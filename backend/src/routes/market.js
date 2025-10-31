// // /backend/src/routes/market.js
// import { Router } from "express"
// import fetch from "node-fetch"

// const router = Router()

// // Map symbols -> CoinGecko ids
// const idMap = {
//   BTC:  "bitcoin",
//   ETH:  "ethereum",
//   USDT: "tether",
//   USDC: "usd-coin",
//   XLM:  "stellar",
//   XRP:  "ripple",
//   LTC:  "litecoin",
//   DOGE: "dogecoin",
//   BNB:  "binancecoin",
//   SHIB: "shiba-inu",
//   TRX:  "tron",
//   ADA:  "cardano",
//   SOL:  "solana",
//   MATIC:"polygon-ecosystem-token", // or "matic-network" (both map to Polygon on CG; use this stable id)
//   ALGO: "algorand",
//   AVAX: "avalanche-2",
// DOT:  "polkadot",
// OP:   "optimism",
//   TRUMP:"official-trump",          // “Official Trump” token on CoinGecko (symbol: TRUMP)
//   PEPE: "pepe"
// }

// // 🔹 lightweight cache (per ids list)
// const PRICE_CACHE = new Map() // key: ids string -> { at:number, data: object }
// const TTL_MS = 60_000 // 60s TTL to ride out rate limits

// router.get("/prices", async (req, res) => {
//   try {
//     const symbols = (req.query.symbols || "BTC,ETH,USDT,USDC")
//       .toString()
//       .toUpperCase()
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean)

//       console.log("🔍 Raw symbols:", symbols)

//     // const ids = symbols.map((s) => idMap[s]).filter(Boolean).join(",")
//     // if (!ids) return res.json({})

//     // // 🔹 serve fresh cache if available
//     // const now = Date.now()
//     // const cached = PRICE_CACHE.get(ids)

//     const validSymbols = symbols.filter((s) => idMap[s])
// if (validSymbols.length === 0) return res.json({})
//    console.log("⚠️ No valid symbols found")

// const ids = validSymbols.map((s) => idMap[s]).join(",")
// const cacheKey = validSymbols.sort().join(",")  // ← normalized cache key
// console.log("✅ Valid symbols:", validSymbols)
// console.log("🌐 Fetching CoinGecko IDs:", ids)
// const now = Date.now()
// const cached = PRICE_CACHE.get(cacheKey)


//     if (cached && (now - cached.at) < TTL_MS) {
//       return res.json(cached.data)
//     }

//     // price + 24h change
//     const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
//       ids
//     )}&price_change_percentage=24h`

//     let data
//     try {
//       const r = await fetch(url, { headers: { "accept": "application/json" }, timeout: 10_000 })
//       data = await r.json()
//        console.log("📦 CoinGecko response:", data)
//     } catch (err) {
//       console.error("❌ Network error:", err)
//       // network error → fall back to cache if present
//       if (cached) return res.json(cached.data)
//       console.error("GET /api/market/prices network error:", err)
//       return res.json({})
//     }

//     // Shape to { SYMBOL: { priceUsd, change24h } }
//     const out = {}
//     console.log("✅ Final output (shaped):", out)


//     // ✅ Guard: only iterate when data is an array
//     if (Array.isArray(data)) {
//       for (const item of data) {
//         const sym = Object.keys(idMap).find((k) => idMap[k] === item.id)
//         if (!sym) continue
//         out[sym] = {
//           priceUsd: Number(item.current_price ?? 0),
//           change24h: Number(item.price_change_percentage_24h ?? 0)
//         }
//       }
//       // 🔹 save to cache on success
//       // PRICE_CACHE.set(ids, { at: now, data: out })
//       PRICE_CACHE.set(cacheKey, { at: now, data: out })

//       return res.json(out)
//     } else {
//       // e.g., { status:{ error_code:429, ... } } → serve cache if we have it
//       console.error("Unexpected CoinGecko response shape:", data)
//       if (cached) return res.json(cached.data)
//       return res.json({})
//     }
//   } catch (e) {
//     console.error("GET /api/market/prices error:", e)
//     // final fallback: empty (keep endpoint stable)
//     return res.json({})
//   }
// })

// export default router


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
  MATIC:"polygon-ecosystem-token", // or "matic-network"
  ALGO: "algorand",
  AVAX: "avalanche-2",
  DOT:  "polkadot",
  OP:   "optimism",
  TRUMP:"official-trump",
  PEPE: "pepe"
}

// 🔹 lightweight cache (per ids list)
const PRICE_CACHE = new Map() // key: ids string -> { at:number, data: object }
const TTL_MS = 60_000 // 60s TTL to ride out rate limits

/* ------------------------------------------------------------------
   🧠 BACKGROUND REFRESH (Option 3)
   Fetches all supported tokens every 60s and stores in PRICE_CACHE.
------------------------------------------------------------------ */
async function refreshAllPrices() {
  try {
    const ids = Object.values(idMap).join(",")
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
      ids
    )}&vs_currencies=usd`

    const r = await fetch(url, { headers: { accept: "application/json" }, timeout: 10000 })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const j = await r.json()

    const out = {}
    for (const [sym, id] of Object.entries(idMap)) {
      if (j[id] && typeof j[id].usd === "number") {
        out[sym] = { priceUsd: j[id].usd, change24h: null }
      }
    }

    const cacheKey = Object.keys(idMap).sort().join(",")
    PRICE_CACHE.set(cacheKey, { at: Date.now(), data: out })
    console.log("✅ [market.js] Background prices refreshed:", Object.keys(out).length)
  } catch (err) {
    console.error("⚠️ [market.js] Background price refresh failed:", err.message)
  }
}

// run once at startup and then every minute
refreshAllPrices()
setInterval(refreshAllPrices, 60_000)

/* ------------------------------------------------------------------ */

router.get("/prices", async (req, res) => {
  try {
    const symbols = (req.query.symbols || "BTC,ETH,USDT,USDC")
      .toString()
      .toUpperCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    console.log("🔍 Raw symbols:", symbols)

    const validSymbols = symbols.filter((s) => idMap[s])
    if (validSymbols.length === 0) return res.json({})
    console.log("⚠️ No valid symbols found")

    const ids = validSymbols.map((s) => idMap[s]).join(",")
    const cacheKey = validSymbols.sort().join(",")
    console.log("✅ Valid symbols:", validSymbols)
    console.log("🌐 Fetching CoinGecko IDs:", ids)
    const now = Date.now()
    const cached = PRICE_CACHE.get(cacheKey)

    // ✅ 1st priority: serve from background cache if fresh
    const fullCache = PRICE_CACHE.get(Object.keys(idMap).sort().join(","))
    if (fullCache && (now - fullCache.at) < 5 * 60_000) {
      const subset = {}
      for (const sym of validSymbols) {
        if (fullCache.data[sym]) subset[sym] = fullCache.data[sym]
      }
      if (Object.keys(subset).length) return res.json(subset)
    }

    // ✅ 2nd priority: local cache for this specific pair
    if (cached && (now - cached.at) < TTL_MS) {
      return res.json(cached.data)
    }

    // ✅ 3rd priority: direct fetch fallback (if background missed)
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
      ids
    )}&price_change_percentage=24h`

    let data
    try {
      const r = await fetch(url, { headers: { "accept": "application/json" }, timeout: 10_000 })
      data = await r.json()
      console.log("📦 CoinGecko response:", data)
    } catch (err) {
      console.error("❌ Network error:", err)
      if (cached) return res.json(cached.data)
      return res.json({})
    }

    // Shape to { SYMBOL: { priceUsd, change24h } }
    const out = {}
    console.log("✅ Final output (shaped):", out)

    if (Array.isArray(data)) {
      for (const item of data) {
        const sym = Object.keys(idMap).find((k) => idMap[k] === item.id)
        if (!sym) continue
        out[sym] = {
          priceUsd: Number(item.current_price ?? 0),
          change24h: Number(item.price_change_percentage_24h ?? 0)
        }
      }
      PRICE_CACHE.set(cacheKey, { at: now, data: out })
      return res.json(out)
    } else {
      console.error("Unexpected CoinGecko response shape:", data)
      if (cached) return res.json(cached.data)
      return res.json({})
    }
  } catch (e) {
    console.error("GET /api/market/prices error:", e)
    return res.json({})
  }
})

export default router
