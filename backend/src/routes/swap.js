// /backend/src/routes/swap.js
import { Router } from "express"
import fetch from "node-fetch"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"

const prisma = new PrismaClient()
const router = Router()

// put near the top with other imports
const API_BASE = process.env.API_URL || ""; 


// Map symbols -> CoinGecko ids (align with your market.js)
const idMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
  XLM: "stellar",
  XRP: "ripple",
  LTC: "litecoin",
  DOGE: "dogecoin",
  BNB: "binancecoin",
  SHIB: "shiba-inu",
  TRX: "tron",
  ADA: "cardano",
  SOL: "solana",
  MATIC: "polygon-ecosystem-token",
  ALGO: "algorand",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  OP: "optimism",
}

const SUPPORTED = Object.keys(idMap)
const FEE_PCT = 0.0035 // 0.35% total fee inside your venue

function getUserId(req) {
  return req?.user?.id ?? req?.user?.userId ?? req?.user?.sub
}

const DASHBOARD_SYMBOLS = [
  "BTC","ETH","USDT","USDC",
  "BNB","SOL","MATIC","XRP","ADA","DOGE","TRX","LTC",
  "AVAX","DOT","OP"
].join(",");

// fallback-safe base resolver
function resolveBase(req) {
  const envBase = (process.env.API_URL || "").replace(/\/+$/, "");
  if (envBase) return envBase;
  const proto = req?.headers?.["x-forwarded-proto"] || req?.protocol || "https";
  const host  = req?.headers?.host || req?.get?.("host") || "localhost:10000";
  return `${proto}://${host}`;
}

async function getPricesUSD(symbols, req) {
  if (!Array.isArray(symbols) || symbols.length === 0) return {};

  const base = resolveBase(req).replace(/\/+$/, "");
  const url = `${base}/api/market/prices?symbols=${encodeURIComponent(DASHBOARD_SYMBOLS)}`;

  try {
    const r = await fetch(url, { headers: { accept: "application/json" } });
    if (!r.ok) {
      console.error("fetch failed:", r.status, url);
      return {};
    }
    const all = await r.json().catch(() => ({}));
    const out = {};
    for (const s of symbols) out[s] = Number(all?.[s]?.priceUsd || 0);
    return out;
  } catch (e) {
    console.error("fetch error", e);
    return {};
  }
}



// async function getPricesUSD(symbols) {
//   if (!Array.isArray(symbols) || symbols.length === 0) return {};
//   const qs = new URLSearchParams({ symbols: symbols.join(",") }).toString();
//   const url = `${API_BASE}/api/market/prices?${qs}`;

//   try {
//     const r = await fetch(url, { headers: { accept: "application/json" } });
//     const j = await r.json().catch(() => ({}));
//     // shape: { BTC:{priceUsd,...}, ETH:{priceUsd,...}, ... }
//     const out = {};
//     for (const s of symbols) {
//       out[s] = Number(j?.[s]?.priceUsd || 0);
//     }
//     return out;
//   } catch {
//     return {};
//   }
// }

// GET /api/swap/quote?from=ETH&to=USDT&amount=1.23
router.get("/quote", auth, async (req, res) => {
  try {
    const userId = Number(getUserId(req))
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const from = String(req.query.from || "").toUpperCase()
    const to = String(req.query.to || "").toUpperCase()
    const amount = parseFloat(String(req.query.amount || "0"))

    if (!SUPPORTED.includes(from) || !SUPPORTED.includes(to) || from === to) {
      return res.status(400).json({ message: "Invalid pair" })
    }
    if (!(amount > 0)) return res.status(400).json({ message: "Amount must be > 0" })

    const prices = await getPricesUSD([from, to, req])
    const pFrom = prices[from] || 0
    const pTo = prices[to] || 0
    if (!pFrom || !pTo) return res.status(400).json({ message: "Price unavailable" })

    const fromUsd = amount * pFrom
    const grossOut = fromUsd / pTo
    const netOut = grossOut * (1 - FEE_PCT)

    return res.json({
      from, to, amount,
      priceFromUsd: pFrom,
      priceToUsd: pTo,
      feePct: FEE_PCT,
      amountOut: Number(netOut.toFixed(8)),
      route: "internal",
      ts: Date.now(),
    })
  } catch (e) {
    console.error("GET /api/swap/quote error:", e)
    return res.status(500).json({ message: "Server error" })
  }
})

// POST /api/swap/execute
// body: { from:"ETH", to:"USDT", amount:1.23, minReceive: 1229.0 }
router.post("/execute", auth, async (req, res) => {
  try {
    const userId = Number(getUserId(req))
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { from, to, amount, minReceive } = req.body || {}
    const f = String(from || "").toUpperCase()
    const t = String(to || "").toUpperCase()
    const amt = parseFloat(String(amount || "0"))
    const minOut = parseFloat(String(minReceive ?? "0"))

    if (!SUPPORTED.includes(f) || !SUPPORTED.includes(t) || f === t) {
      return res.status(400).json({ message: "Invalid pair" })
    }
    if (!(amt > 0)) return res.status(400).json({ message: "Amount must be > 0" })

    const prices = await getPricesUSD([f, t, req])
    const pFrom = prices[f] || 0
    const pTo = prices[t] || 0
    if (!pFrom || !pTo) return res.status(400).json({ message: "Price unavailable" })

    const fromUsd = amt * pFrom
    const grossOut = fromUsd / pTo
    const netOut = Number((grossOut * (1 - FEE_PCT)).toFixed(8))
    if (minOut && netOut < minOut) {
      return res.status(400).json({ message: "Slippage exceeded" })
    }

    const result = await prisma.$transaction(async (tx) => {
      // holdings
      let fromH = await tx.holding.findFirst({ where: { userId, symbol: f } })
      if (!fromH) fromH = await tx.holding.create({ data: { userId, symbol: f, amount: "0", locked: "0" } })
      let toH = await tx.holding.findFirst({ where: { userId, symbol: t } })
      if (!toH) toH = await tx.holding.create({ data: { userId, symbol: t, amount: "0", locked: "0" } })

      const available = parseFloat(String(fromH.amount)) - parseFloat(String(fromH.locked ?? 0))
      if (available < amt) throw new Error("Insufficient balance")

      const newFromAmt = Number((parseFloat(String(fromH.amount)) - amt).toFixed(8)).toString()
      const newToAmt   = Number((parseFloat(String(toH.amount)) + netOut).toFixed(8)).toString()

      await tx.holding.update({ where: { id: fromH.id }, data: { amount: newFromAmt } })
      await tx.holding.update({ where: { id: toH.id }, data: { amount: newToAmt } })

      // Log a transaction (TRANSFER)
      const tr = await tx.transaction.create({
        data: {
          ref: `SWAP_${f}_${t}_${Date.now()}`,
          type: "TRANSFER",
          amount: String(netOut),
          status: "CONFIRMED",
          userId,
          symbol: t, // show received asset in your Transactions list
        }
      })

      return { newFromAmt, newToAmt, trId: tr.id }
    }, { isolationLevel: "Serializable" })

    return res.json({
      ok: true,
      from: f,
      to: t,
      amount: amt,
      amountOut: netOut,
      feePct: FEE_PCT,
      priceFromUsd: pFrom,
      priceToUsd: pTo,
      balances: { [f]: result.newFromAmt, [t]: result.newToAmt }
    })
  } catch (e) {
    const msg = String(e?.message || "")
    if (msg.includes("Insufficient")) {
      return res.status(400).json({ message: "Insufficient balance" })
    }
    console.error("POST /api/swap/execute error:", e)
    return res.status(500).json({ message: "Server error" })
  }
})

export default router
