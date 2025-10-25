// // /backend/src/routes/wallet.js
// import { Router } from "express"
// import crypto from "crypto"
// import { auth } from "../middleware/auth.js"

// const router = Router()

// // Keep this in sync with your frontend list
// const COINS = [
//   { symbol: "BTC",  networks: ["Bitcoin"] },
//   { symbol: "ETH",  networks: ["Ethereum"] },
//   { symbol: "USDT", networks: ["Ethereum", "Tron", "BNB Smart Chain", "Solana"] },
//   { symbol: "USDC", networks: ["Ethereum", "Solana", "Tron", "BNB Smart Chain"] },
//   { symbol: "XRP",  networks: ["XRP Ledger"] },
//   { symbol: "ADA",  networks: ["Cardano"] },
//   { symbol: "SOL",  networks: ["Solana"] },
//   { symbol: "MATIC",networks: ["Polygon"] },
//   { symbol: "TRX",  networks: ["Tron"] },
//   { symbol: "DOGE", networks: ["Dogecoin"] },
//   { symbol: "BNB",  networks: ["BNB Beacon Chain", "BNB Smart Chain"] },
//   { symbol: "SHIB", networks: ["Ethereum"] },
//   { symbol: "LTC",  networks: ["Litecoin"] },
//   { symbol: "XLM",  networks: ["Stellar"] },
//   { symbol: "ALGO", networks: ["Algorand"] },
//   { symbol: "PEPE", networks: ["Ethereum"] },
//   { symbol: "TRUMP",networks: ["Ethereum"] },
// ]

// // coins that commonly require memo/tag
// const MEMO_REQUIRED = {
//   XRP: "Destination Tag",
//   XLM: "Memo",
//   BNB: "Memo", // many custodial BNB deposits require memo
// }

// // ---- helpers to make a stable, mock address per user/symbol/network
// function base58(input) {
//   // very small base58 encoder for mock purposes
//   const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
//   let x = BigInt("0x" + input.toString("hex"))
//   let out = ""
//   while (x > 0n) {
//     const mod = x % 58n
//     out = alphabet[Number(mod)] + out
//     x = x / 58n
//   }
//   return out || "1"
// }

// function makeMockAddress({ userId, symbol, network }) {
//   const seed = `${userId}:${symbol}:${network}`
//   const h = crypto.createHash("sha256").update(seed).digest()

//   // Prefixes to vaguely resemble address formats (purely cosmetic)
//   const prefixMap = {
//     BTC: "bc1",
//     ETH: "0x",
//     USDT: "0x",
//     USDC: "0x",
//     XRP: "r",
//     ADA: "addr1",
//     SOL: "SoL",
//     MATIC: "0x",
//     TRX: "T",
//     DOGE: "D",
//     BNB: "bnb",
//     SHIB: "0x",
//     LTC: "ltc1",
//     XLM: "G",
//     ALGO: "ALGO",
//     PEPE: "0x",
//     TRUMP: "0x",
//   }
//   const prefix = prefixMap[symbol] || ""

//   // For hex-like chains (0x…), just use the first 20 bytes
//   if (prefix === "0x") {
//     return prefix + h.slice(0, 20).toString("hex")
//   }

//   // For others, return a short base58-ish string
//   return prefix + base58(h).slice(0, 36)
// }

// function makeMockMemo({ userId, symbol, network, label }) {
//   // a stable numeric memo/tag
//   const seed = `${userId}:${symbol}:${network}:memo`
//   const h = crypto.createHash("sha256").update(seed).digest()
//   const num = (h.readUInt32BE(0) % 10_000_000).toString()
//   return { label, value: num }
// }

// // ---- GET /api/wallet/deposit/address?symbol=BTC&network=Bitcoin
// router.get("/deposit/address", auth, (req, res) => {
//   try {
//     const { symbol, network } = req.query
//     if (!symbol || !network) {
//       return res.status(400).json({ message: "symbol and network are required" })
//     }

//     const coin = COINS.find(c => c.symbol.toUpperCase() === String(symbol).toUpperCase())
//     if (!coin) return res.status(404).json({ message: "Unsupported asset" })
//     if (!coin.networks.includes(network)) {
//       return res.status(400).json({ message: "Unsupported network for this asset" })
//     }

//     // get userId from your auth middleware payload
//     const userId = req?.user?.id ?? req?.user?.userId ?? req?.user?.sub ?? "anon"

//     const address = makeMockAddress({ userId, symbol: coin.symbol, network })
//     const memoLabel = MEMO_REQUIRED[coin.symbol]
//     const memo = memoLabel ? makeMockMemo({ userId, symbol: coin.symbol, network, label: memoLabel }) : null

//     return res.json({
//       symbol: coin.symbol,
//       network,
//       address,
//       ...(memo ? { memo: memo.value, memoLabel: memo.label } : {}),
//     })
//   } catch (e) {
//     console.error("GET /api/wallet/deposit/address error:", e)
//     return res.status(500).json({ message: "Server error" })
//   }
// })

// export default router


// /backend/src/routes/wallet.js
import { Router } from "express"
import { auth } from "../middleware/auth.js"

const router = Router()

// Keep in sync with the coins you support in the UI
const COINS = [
  { symbol: "BTC",  networks: ["Bitcoin"] },
  { symbol: "ETH",  networks: ["Ethereum"] },
  { symbol: "USDT", networks: ["Ethereum", "Tron", "BNB Smart Chain", "Solana"] },
  { symbol: "USDC", networks: ["Ethereum", "Solana", "Tron", "BNB Smart Chain"] },
  { symbol: "XRP",  networks: ["XRP Ledger"] },
  { symbol: "ADA",  networks: ["Cardano"] },
  { symbol: "SOL",  networks: ["Solana"] },
  { symbol: "MATIC",networks: ["Polygon"] },
  { symbol: "TRX",  networks: ["Tron"] },
  { symbol: "DOGE", networks: ["Dogecoin"] },
  { symbol: "BNB",  networks: ["BNB Beacon Chain", "BNB Smart Chain"] },
  { symbol: "SHIB", networks: ["Ethereum"] },
  { symbol: "LTC",  networks: ["Litecoin"] },
  { symbol: "XLM",  networks: ["Stellar"] },
  { symbol: "ALGO", networks: ["Algorand"] },
  { symbol: "PEPE", networks: ["Ethereum"] },
  { symbol: "TRUMP",networks: ["Ethereum"] },
]

// Coins that require memo/tag with many custodians
const MEMO_REQUIRED = {
  XRP: "Destination Tag",
  XLM: "Memo",
  BNB: "Memo", // Beacon Chain deposits often require a Memo
}

// ---------- STATIC ADDRESSES (demo only) ----------
// These are well-formed example addresses (public/demo). Replace with your real ones later or move to env vars.
const STATIC_ADDRESSES = {
  BTC: {
    Bitcoin: "bc1qzs4vthzu2fh92l7ztcg02km7jdc9jc4apu27s6", // sample bech32
  },
  ETH: {
    Ethereum: "0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3", // sample 0x
  },
  USDT: {
    Ethereum:        "0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3",
    Tron:            "THGXeXnvttD36zRwvPFKJNAUnjd4GDBRqw",        // sample T-address
    "BNB Smart Chain":"0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3",
    Solana:          "72PQJr6put6CtTvAbao8mVvzGRN1Gqwt7hkw7wghLxEr", // sample base58-ish
  },
  USDC: {
    Ethereum:        "0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3",
    Solana:          "72PQJr6put6CtTvAbao8mVvzGRN1Gqwt7hkw7wghLxEr",
    Tron:            "THGXeXnvttD36zRwvPFKJNAUnjd4GDBRqw",
    "BNB Smart Chain":"0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3",
  },
  XRP: {
    "XRP Ledger": "rnCt5x46WjySqiBNxwK4SiEHoMYraWVKQo", // sample r-address
    // Destination Tag will be returned separately
  },
  ADA: {
    Cardano: "addr1qy54fpfl7leggpln0py565tq7449kyxd5jtqrrp30zs383kmxmtuyr36g7zk3rcxgxzd492lh39xhycq00n4yzdvd7kqeklper", // sample bech32
  },
  SOL: {
    Solana: "72PQJr6put6CtTvAbao8mVvzGRN1Gqwt7hkw7wghLxEr", // sample base58
  },
  MATIC: {
    Polygon: "0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3",
  },
  TRX: {
    Tron: "THGXeXnvttD36zRwvPFKJNAUnjd4GDBRqw", // sample T-address
  },
  DOGE: {
    Dogecoin: "DQA7Kh2D9isNmZx4GTEktHDyyZfnEGdjqY", // sample D-address
  },
  BNB: {
    "BNB Beacon Chain": "permanently shut down", // sample bech32
    "BNB Smart Chain":  "0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3", // EVM
  },
  SHIB: {
    Ethereum: "0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3",
  },
  LTC: {
    Litecoin: "ltc1q4cpezdx8z2dlke9lfeesp43f2men2vnk0lgfzk", // sample bech32
  },
  XLM: {
    Stellar: "GBSBZRILFWRHWD3ACC5VZDHSD6TR7JDKMVLK6BVDRGC6SJMOIOR2HR6I", // sample public key
    // Memo will be returned separately
  },
  ALGO: {
    Algorand: "YLAVJ43HOMQJGAE5C7YZQGZZXSTVIXZ2P5MYCOTFUAQALB7FFX3MQCVGEE", // sample Algorand addr format
  },
  PEPE: {
    Ethereum: "0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3",
  },
  TRUMP: {
    Ethereum: "0x73E8732738C2B77162a45FcebA0D2768C3bc1Ed3",
  },
}

// Optional static memos/tags (demo)
const STATIC_MEMOS = {
  XRP: { label: MEMO_REQUIRED.XRP, value: "123456" },
  XLM: { label: MEMO_REQUIRED.XLM, value: "987654321" },
  BNB: { label: MEMO_REQUIRED.BNB, value: "246810" }, // for Beacon Chain
}

// GET /api/wallet/deposit/address?symbol=BTC&network=Bitcoin
router.get("/deposit/address", auth, (req, res) => {
  try {
    const rawSymbol = String(req.query.symbol || "").toUpperCase()
    const rawNetwork = String(req.query.network || "")

    if (!rawSymbol || !rawNetwork) {
      return res.status(400).json({ message: "symbol and network are required" })
    }

    const coin = COINS.find(c => c.symbol === rawSymbol)
    if (!coin) return res.status(404).json({ message: "Unsupported asset" })
    if (!coin.networks.includes(rawNetwork)) {
      return res.status(400).json({ message: "Unsupported network for this asset" })
    }

    const address = STATIC_ADDRESSES?.[rawSymbol]?.[rawNetwork]
    if (!address) {
      return res.status(404).json({ message: "No static address configured for this asset/network" })
    }

    // Memo/tag if required and available for this asset/network
    let memo = null
    if (MEMO_REQUIRED[rawSymbol]) {
      // For BNB, only apply memo for Beacon Chain (commonly required)
      if (rawSymbol !== "BNB" || rawNetwork === "BNB Beacon Chain") {
        memo = STATIC_MEMOS[rawSymbol]?.value || null
      }
    }

    return res.json({
      symbol: rawSymbol,
      network: rawNetwork,
      address,
      ...(memo ? { memo, memoLabel: MEMO_REQUIRED[rawSymbol] } : {}),
    })
  } catch (e) {
    console.error("GET /api/wallet/deposit/address error:", e)
    return res.status(500).json({ message: "Server error" })
  }
})

export default router
