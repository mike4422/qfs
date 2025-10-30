// /backend/src/routes/swap.js
import { Router } from "express"
import fetch from "node-fetch"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"

const prisma = new PrismaClient()
const router = Router()

// put near the top with other imports
const API_BASE = process.env.API_URL || "http://localhost:10000"; // e.g. https://api.qfsworldwide.net (prod) or http://localhost:10000 (dev)


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

async function getPricesUSD(symbols, req) {
  if (!Array.isArray(symbols) || symbols.length === 0) return {};

  // Resolve a safe base: prefer API_URL, else derive from the incoming request host
  const envBase = (API_BASE || "").replace(/\/+$/, "");
  const inferredBase = (() => {
    try {
      const proto = String(req?.headers?.["x-forwarded-proto"] || req?.protocol || "https");
      const host  = String(req?.get?.("host") || req?.headers?.host || "");
      return host ? `${proto}://${host}` : "";
    } catch { return ""; }
  })();
  const base = (envBase || inferredBase || "http://localhost:10000").replace(/\/+$/, "");
  const qs = new URLSearchParams({ symbols: symbols.join(",") }).toString();
  const url = `${base}/api/market/prices?${qs}`;

  // 1) Try your own cached endpoint first
  try {
    const r = await fetch(url, { headers: { accept: "application/json" } });
    if (r.ok) {
      const j = await r.json().catch(() => ({}));
      const out = {};
      for (const s of symbols) out[s] = Number(j?.[s]?.priceUsd || 0);
      // If we actually got non-zero prices for both ends, return them
      if (Object.values(out).some(v => v > 0)) return out;
    } else {
      console.error("getPricesUSD: non-200 from", url, r.status);
    }
  } catch (e) {
    console.error("getPricesUSD: fetch error", url, e?.message || e);
  }

  // 2) Fallback to CoinGecko (minimal, ids via idMap)
  try {
    const ids = symbols.map(s => idMap[s]).filter(Boolean);
    if (ids.length) {
      const cgURL = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;
      const r2 = await fetch(cgURL, { headers: { accept: "application/json" } });
      if (r2.ok) {
        const j2 = await r2.json().catch(() => ({}));
        const rev = {};
        // reverse map ids -> symbols
        for (const [sym, id] of Object.entries(idMap)) rev[id] = sym;
        const out2 = {};
        for (const id of Object.keys(j2 || {})) {
          const sym = rev[id];
          out2[sym] = Number(j2?.[id]?.usd || 0);
        }
        if (Object.values(out2).some(v => v > 0)) return out2;
      } else {
        console.error("getPricesUSD: CoinGecko non-200", r2.status);
      }
    }
  } catch (e) {
    console.error("getPricesUSD: CoinGecko error", e?.message || e);
  }

  return {};
}


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
