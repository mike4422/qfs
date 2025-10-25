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
  MATIC:"polygon-ecosystem-token", // or "matic-network" (both map to Polygon on CG; use this stable id)
  ALGO: "algorand",
  TRUMP:"official-trump",          // “Official Trump” token on CoinGecko (symbol: TRUMP)
  PEPE: "pepe"
}

// 🔹 lightweight cache (per ids list)
const PRICE_CACHE = new Map() // key: ids string -> { at:number, data: object }
const TTL_MS = 60_000 // 60s TTL to ride out rate limits

router.get("/prices", async (req, res) => {
  try {
    const symbols = (req.query.symbols || "BTC,ETH,USDT,USDC")
      .toString()
      .toUpperCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const ids = symbols.map((s) => idMap[s]).filter(Boolean).join(",")
    if (!ids) return res.json({})

    // 🔹 serve fresh cache if available
    const now = Date.now()
    const cached = PRICE_CACHE.get(ids)
    if (cached && (now - cached.at) < TTL_MS) {
      return res.json(cached.data)
    }

    // price + 24h change
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
      ids
    )}&price_change_percentage=24h`

    let data
    try {
      const r = await fetch(url, { headers: { "accept": "application/json" }, timeout: 10_000 })
      data = await r.json()
    } catch (err) {
      // network error → fall back to cache if present
      if (cached) return res.json(cached.data)
      console.error("GET /api/market/prices network error:", err)
      return res.json({})
    }

    // Shape to { SYMBOL: { priceUsd, change24h } }
    const out = {}

    // ✅ Guard: only iterate when data is an array
    if (Array.isArray(data)) {
      for (const item of data) {
        const sym = Object.keys(idMap).find((k) => idMap[k] === item.id)
        if (!sym) continue
        out[sym] = {
          priceUsd: Number(item.current_price ?? 0),
          change24h: Number(item.price_change_percentage_24h ?? 0)
        }
      }
      // 🔹 save to cache on success
      PRICE_CACHE.set(ids, { at: now, data: out })
      return res.json(out)
    } else {
      // e.g., { status:{ error_code:429, ... } } → serve cache if we have it
      console.error("Unexpected CoinGecko response shape:", data)
      if (cached) return res.json(cached.data)
      return res.json({})
    }
  } catch (e) {
    console.error("GET /api/market/prices error:", e)
    // final fallback: empty (keep endpoint stable)
    return res.json({})
  }
})

export default router
