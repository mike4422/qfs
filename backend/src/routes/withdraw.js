// /backend/src/routes/withdraw.js
import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"
import { sendMail } from "../utils/email.js"

const prisma = new PrismaClient()
const router = Router()

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
   .split(',')
   .map(s => s.trim())
   .filter(Boolean)

// Supported assets + networks (match your UI)
const COINS = new Map([
  ["BTC", ["Bitcoin"]],
  ["ETH", ["Ethereum"]],
  ["USDT", ["Ethereum", "Tron", "BNB Smart Chain", "Solana"]],
  ["USDC", ["Ethereum", "Solana", "Tron", "BNB Smart Chain"]],
  ["XRP", ["XRP Ledger"]],
  ["ADA", ["Cardano"]],
  ["SOL", ["Solana"]],
  ["MATIC", ["Polygon"]],
  ["TRX", ["Tron"]],
  ["DOGE", ["Dogecoin"]],
  ["BNB", ["BNB Beacon Chain", "BNB Smart Chain"]],
  ["SHIB", ["Ethereum"]],
  ["LTC", ["Litecoin"]],
  ["XLM", ["Stellar"]],
  ["ALGO", ["Algorand"]],
  ["PEPE", ["Ethereum"]],
  ["TRUMP", ["Ethereum"]],
])

const MEMO_REQUIRED = {
  XRP: "Destination Tag",
  XLM: "Memo",
  BNB: "Memo", // esp. Beacon Chain
}

// Minimal address sanity checks (not cryptographic)
const validators = {
  Bitcoin: (addr) => /^(bc1|[13])[a-zA-Z0-9]{20,}$/i.test(addr),
  Ethereum: (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr),
  "BNB Smart Chain": (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr),
  Tron: (addr) => /^T[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(addr),
  Solana: (addr) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr),
  Polygon: (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr),
  Cardano: (addr) => /^addr1[0-9a-z]+$/.test(addr),
  Dogecoin: (addr) => /^D[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(addr),
  Litecoin: (addr) => /^(ltc1|L|M)[a-zA-Z0-9]{20,}$/i.test(addr),
  "XRP Ledger": (addr) => /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(addr),
  Stellar: (addr) => /^G[A-Z0-9]{55}$/.test(addr),
  Algorand: (addr) => /^[A-Z2-7]{58}$/i.test(addr),
}

function getUserId(req) {
  return req?.user?.id ?? req?.user?.userId ?? req?.user?.sub
}

// A simple static fee table (asset units); replace with dynamic later
const NETWORK_FEES = {
  Bitcoin: "0.00025",
  Ethereum: "0.004",
  "BNB Smart Chain": "0.003",
  "BNB Beacon Chain": "0.003",
  Solana: "0.00005",
  Polygon: "3",
  Tron: "20",
  Cardano: "0.3",
  Dogecoin: "5",
  Litecoin: "0.001",
  "XRP Ledger": "0.25",
  Stellar: "0.25",
  Algorand: "0.01",
}

// POST /api/wallet/withdraw
router.post("/withdraw", auth, async (req, res) => {
  try {
    const userId = Number(getUserId(req))
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { symbol, network, address, memo, amount } = req.body || {}

    // Basic input validation
    const sym = String(symbol || "").toUpperCase()
    const net = String(network || "")
    const amt = Number(amount || 0)

    if (!COINS.has(sym)) return res.status(400).json({ message: "Unsupported asset" })
    if (!COINS.get(sym).includes(net)) {
      return res.status(400).json({ message: "Unsupported network for this asset" })
    }
    if (!(address && address.trim().length > 6)) {
      return res.status(400).json({ message: "Invalid address" })
    }
    const validate = validators[net]
    if (validate && !validate(address.trim())) {
      return res.status(400).json({ message: "Address format not valid for selected network" })
    }
    if (!(amt > 0)) {
      return res.status(400).json({ message: "Amount must be > 0" })
    }
    if (MEMO_REQUIRED[sym]) {
      if (sym === "BNB" && net !== "BNB Beacon Chain") {
        // allow missing memo on BSC
      } else if (!memo || String(memo).trim().length === 0) {
        return res.status(400).json({ message: `${MEMO_REQUIRED[sym]} is required for this withdrawal` })
      }
    }

    // Fee
    const fee = NETWORK_FEES[net] || "0"
    const feeNum = Number(fee)
    const netAmount = amt - feeNum
    if (netAmount <= 0) {
      return res.status(400).json({ message: "Amount too small after fees" })
    }

    // Atomic balance check + lock
    const result = await prisma.$transaction(async (tx) => {
      // Get holding row
      let holding = await tx.holding.findFirst({
        where: { userId, symbol: sym },
      })

      if (!holding) {
        // create empty holding if not exists
        holding = await tx.holding.create({
          data: { userId, symbol: sym, amount: "0", locked: "0" },
        })
      }

      const available = Number(holding.amount) - Number(holding.locked)
      if (available < amt) {
        throw new Error("Insufficient balance")
      }

      // increase locked by TOTAL deduction (amount)
      const newLocked = (Number(holding.locked) + amt).toString()

      await tx.holding.update({
        where: { id: holding.id },
        data: { locked: newLocked },
      })

      // create withdrawal
      const wd = await tx.withdrawal.create({
        data: {
          userId,
          symbol: sym,
          network: net,
          amount: amt.toString(),
          fee: feeNum.toString(),
          netAmount: netAmount.toString(),
          address: address.trim(),
          memo: memo ? String(memo).trim() : null,
          status: "PENDING", // ← updated to new enum
        }
      })

      // ✅ NEW: also create a Transaction row so it appears in Transactions
      await tx.transaction.create({
        data: {
          ref: `WD_${wd.id}`,
          type: "WITHDRAWAL",
          amount: amt.toString(),   // gross amount
          status: "PENDING",
          userId,
          symbol: sym,
        }
      })

      return wd
    }, { isolationLevel: "Serializable" })

    // --- NEW: notify admins (best effort, non-blocking) ---
    try {
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true }
      })
      for (const to of ADMIN_EMAILS) {
        await sendMail({
          to,
          subject: `New withdrawal request: ${sym} ${amount}`,
          html: `<p>A user submitted a withdrawal request.</p>
<ul>
  <li><b>User ID:</b> ${userId}</li>
  <li><b>User:</b> ${u?.name || "—"} (${u?.email || "—"})</li>
  <li><b>Asset:</b> ${sym}</li>
  <li><b>Amount (gross):</b> ${amount}</li>
  <li><b>Fee:</b> ${feeNum}</li>
  <li><b>Net amount:</b> ${netAmount}</li>
  <li><b>Network:</b> ${network}</li>
  <li><b>Address:</b> ${address}</li>
  <li><b>Memo/Tag:</b> ${memo || "—"}</li>
  <li><b>Status:</b> ${result.status}</li>
  <li><b>Request ID:</b> ${result.id}</li>
  <li><b>Created At:</b> ${result.createdAt}</li>
</ul>
<p>Review it in the Admin dashboard.</p>`
        })
      }
    } catch (e) {
      console.warn("[mailer] admin withdrawal notice failed:", e.message)
    }

    // Success
    return res.json({
      id: result.id,
      status: result.status,
      symbol: result.symbol,
      network: result.network,
      amount: result.amount,
      fee: result.fee,
      netAmount: result.netAmount,
      address: result.address,
      memo: result.memo,
      createdAt: result.createdAt,
    })
  } catch (err) {
    const msg = String(err?.message || "")
    if (msg.includes("Insufficient balance")) {
      return res.status(400).json({ message: "Insufficient balance" })
    }
    console.error("POST /api/wallet/withdraw error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})


// POST /api/wallet/deposit/confirm
router.post("/deposit/confirm", auth, async (req, res) => {
  try {
    const userId = Number(req?.user?.id ?? req?.user?.userId ?? req?.user?.sub)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { symbol, network, amount, txId, address, memo } = req.body || {}
    const sym = String(symbol || "").toUpperCase()
    const amt = Number(amount || 0)
    if (!sym) return res.status(400).json({ message: "Missing symbol" })
    if (!(amt > 0)) return res.status(400).json({ message: "Enter a valid amount" })

    const dep = await prisma.$transaction(async (tx) => {
      // Create Deposit row — rely on Prisma default status = 'PENDING'
      const created = await tx.deposit.create({
        data: {
          userId,
          symbol: sym,
          amount: amt.toString(),
          txId: txId ? String(txId) : null,
          // NOTE: if your Deposit model doesn't have these fields, omit them.
          // Keeping them commented to avoid schema mismatch:
          // network,
          // address,
          // memo: memo ? String(memo) : null,
        },
      })

      // Mirror to Transactions so user sees it in history
      await tx.transaction.create({
        data: {
          ref: `DP_${created.id}`,
          type: "DEPOSIT",
          amount: amt.toString(),
          status: "PENDING",
          userId,
          symbol: sym,
        },
      })

      return created
    })

    // Notify admins (best effort)
    for (const to of ADMIN_EMAILS) {
      try {
        await sendMail({
          to,
          subject: `New deposit request: ${sym} ${amount}`,
          html: `<p>A user submitted a deposit confirmation.</p>
<ul>
  <li><b>User ID:</b> ${userId}</li>
  <li><b>Asset:</b> ${sym}</li>
  <li><b>Amount:</b> ${amount}</li>
  <li><b>Network:</b> ${network || "—"}</li>
  <li><b>TxID:</b> ${txId || "—"}</li>
  <li><b>Address:</b> ${address || "—"}</li>
  <li><b>Memo:</b> ${memo || "—"}</li>
</ul>
<p>Review it in the Admin dashboard.</p>`,
        })
      } catch (e) {
        console.warn("[mailer] admin deposit notice failed:", e.message)
      }
    }

    return res.json({
      ok: true,
      id: dep.id,
      status: "PENDING",
      symbol: dep.symbol,
      amount: dep.amount,
      txId: dep.txId,
      createdAt: dep.createdAt,
    })
  } catch (err) {
    console.error("POST /api/wallet/deposit/confirm error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})


export default router
