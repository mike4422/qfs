// /backend/src/routes/market.js
import { Router } from "express"
import fetch from "node-fetch"

const router = Router()

// Map symbols -> CoinGecko ids
const idMap = {
  BTC:  "bitcoin",
  ETH:  "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
  XLM:  "stellar",
  XRP:  "ripple",
  LTC:  "litecoin",
  DOGE: "dogecoin",
  BNB:  "binancecoin",
  SHIB: "shiba-inu",
  TRX:  "tron",
  ADA:  "cardano",
  SOL:  "solana",
  MATIC:"polygon-ecosystem-token",
  ALGO: "algorand",
  TRUMP:"official-trump",
  PEPE: "pepe",
  OP:   "optimism",              // ⬅️ include OP since swap supports it
}

// ✅ Per-symbol cache (order-independent)
const SYM_CACHE = new Map() // key: SYMBOL -> { at:number, priceUsd:number, change24h:number }
const TTL_MS = 60_000 // 60s

router.get("/prices", async (req, res) => {
  try {
    const symbols = String(req.query.symbols || "BTC,ETH,USDT,USDC")
      .toUpperCase()
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)

    // What do we already have fresh?
    const now = Date.now()
    const fresh = new Set()
    const missing = []

    for (const sym of symbols) {
      const entry = SYM_CACHE.get(sym)
      if (entry && (now - entry.at) < TTL_MS) {
        fresh.add(sym)
      } else {
        missing.push(sym)
      }
    }

    // If anything missing/stale, fetch just those ids from CoinGecko
    if (missing.length) {
      const ids = missing.map(s => idMap[s]).filter(Boolean)
      if (ids.length) {
        // Use simple/price for reliability + 24h change
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
          ids.join(",")
        )}&vs_currencies=usd&include_24hr_change=true`

        const headers = { accept: "application/json" }
        if (process.env.COINGECKO_API_KEY) {
          headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY
        }

        try {
          const r = await fetch(url, { headers })
          if (r.ok) {
            const j = await r.json().catch(() => ({}))
            // Reverse map id -> symbol
            const rev = Object.entries(idMap).reduce((acc,[sym,id]) => (acc[id]=sym, acc), {})
            for (const [id, row] of Object.entries(j || {})) {
              const sym = rev[id]
              if (!sym) continue
              const priceUsd  = Number(row?.usd ?? 0)
              const change24h = Number(row?.usd_24h_change ?? 0)
              SYM_CACHE.set(sym, { at: now, priceUsd, change24h })
              fresh.add(sym)
            }
          } else {
            console.error("GET /api/market/prices CoinGecko non-200:", r.status)
          }
        } catch (err) {
          console.error("GET /api/market/prices CoinGecko error:", err?.message || err)
        }
      }
    }

    // Build output from cache only (no empty object surprises)
    const out = {}
    for (const sym of symbols) {
      const e = SYM_CACHE.get(sym)
      out[sym] = {
        priceUsd:  Number(e?.priceUsd ?? 0),
        change24h: Number(e?.change24h ?? 0),
      }
    }

    return res.json(out)
  } catch (e) {
    console.error("GET /api/market/prices error:", e)
    // Stable: return zeros for requested symbols
    const symbols = String(req.query.symbols || "").toUpperCase().split(",").filter(Boolean)
    const out = symbols.reduce((acc, s) => {
      acc[s] = { priceUsd: 0, change24h: 0 }
      return acc
    }, {})
    return res.json(out)
  }
})

export default router
