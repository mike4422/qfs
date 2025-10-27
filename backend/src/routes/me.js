// /backend/src/routes/me.js
import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"
import fetch from "node-fetch"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
const router = Router()

function getUserId(req) {
  return req?.user?.id ?? req?.user?.userId ?? req?.user?.sub
}

async function safeFetchJSON(url, opts = {}, timeoutMs = 7000) {
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), timeoutMs)
  try {
    const r = await fetch(url, { ...opts, signal: ac.signal })
    const j = await r.json().catch(() => ({}))
    return r.ok ? j : {}
  } catch {
    return {}
  } finally {
    clearTimeout(t)
  }
}

// GET /api/me/summary
router.get("/summary", auth, async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        kycStatus: true,
        kycSubmittedAt: true,
        wallet: true,
        wallets: true,
        // txs: {
        //   where: { status: "CONFIRMED" },
        //   select: { type: true, amount: true }
        // }
      }
    })

    if (!user) return res.status(404).json({ message: "User not found" })

    const holdings = await prisma.holding.findMany({
      where: { userId: Number(userId) },
      select: { symbol: true, amount: true, locked: true }
    })

    const cgIdMap = {
      BTC: "bitcoin", ETH: "ethereum", USDT: "tether", USDC: "usd-coin",
      XRP: "ripple", XLM: "stellar", LTC: "litecoin", DOGE: "dogecoin",
      SHIB: "shiba-inu", TRX: "tron", ADA: "cardano", SOL: "solana",
      MATIC: "polygon", BNB: "binancecoin", ALGO: "algorand",
      TRUMP: "maga", PEPE: "pepe"
    }

    const ids = [...new Set(holdings.map(h => cgIdMap[h.symbol?.toUpperCase?.()]).filter(Boolean))]

    let priceUSD = {}
    if (ids.length > 0) {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids.join(","))}&vs_currencies=usd`
      const resp = await fetch(url, { headers: { "accept": "application/json" } })
      if (resp.ok) priceUSD = await resp.json()
    }

    const holdingsTotalUSD = holdings.reduce((acc, h) => {
      const sym = (h.symbol || "").toUpperCase()
      const id = cgIdMap[sym]
      const px = id && priceUSD[id] ? Number(priceUSD[id].usd || 0) : 0
      const available = Number(h.amount) - Number(h.locked || 0)
      if (!isFinite(available) || !isFinite(px)) return acc
      return acc + (available * px)
    }, 0)

    let total = holdingsTotalUSD
    if (!isFinite(total) || total === 0) {
      total = (user.txs || []).reduce((acc, t) => {
        const amt = parseFloat(String(t.amount || "0").replace(/[^0-9.\-]/g, "")) || 0
        if (t.type === "DEPOSIT") return acc + amt
        if (t.type === "WITHDRAWAL") return acc - amt
        return acc
      }, 0)
    }

    const walletSynced = Boolean(user.wallet) || (Array.isArray(user.wallets) && user.wallets.length > 0)

    const kycMap = {
      NOT_VERIFIED: "not_verified",
      PENDING: "pending",
      APPROVED: "approved",
      REJECTED: "not_verified",
    }
    let kycStatus = kycMap[user.kycStatus] ?? "not_verified"
    if (kycStatus === "pending" && !user.kycSubmittedAt) kycStatus = "not_verified"

    // ✅ Fetch the latest wallet sync status
    const lastWalletSync = await prisma.walletSync.findFirst({
      where: { userId: Number(userId) },
      orderBy: { id: "desc" },
      select: { status: true },
    })

    // ✅ Return everything in one response
    return res.json({
      totalAssetUSD: Number(total.toFixed(2)),
      walletSynced,
      walletSyncStatus: lastWalletSync?.status || "NOT_SYNCED",
      kycStatus,
      name: user.name
    })

  } catch (err) {
    console.error("GET /api/me/summary error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// GET /api/me/holdings
router.get("/holdings", auth, async (req, res) => {
  try {
    const userId = getUserId(req) ?? (req?.user?.id ?? req?.user?.userId ?? req?.user?.sub)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const SYMBOLS = ["BTC","ETH","USDT","USDC","XLM","XRP","LTC","DOGE","BNB","SHIB","TRX","ADA","SOL","MATIC","ALGO","TRUMP","PEPE"]
    const zeros = SYMBOLS.reduce((acc, s) => ((acc[s] = 0), acc), {})

    const rows = await prisma.holding.findMany({
      where: { userId: Number(userId) },
      select: { symbol: true, amount: true, locked: true },
    })

    const out = { ...zeros }
    for (const r of rows) {
      const sym = String(r.symbol || "").toUpperCase()
      if (sym in out) {
        const amt = parseFloat(String(r.amount ?? 0).replace(/[^0-9.\-]/g, "")) || 0
        const lck = parseFloat(String(r.locked ?? 0).replace(/[^0-9.\-]/g, "")) || 0
        const available = Math.max(0, amt - lck)
        out[sym] = Number((out[sym] + available).toFixed(8))
      }
    }

    return res.json(out)
  } catch (err) {
    console.error("GET /api/me/holdings error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// GET /api/me/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        username: true,
        email: true,
        country: true,
        phone: true,
        twoFAEnabled: true,
        city: true,  
      }
    })
    if (!u) return res.status(404).json({ message: "User not found" })

    return res.json({
      fullName: u.name || "",
      username: u.username || "",
      email: u.email || "",
      country: u.country || "United State",
      city: u.city || "",
      phone: u.phone || "",
      twoFAEnabled: Boolean(u.twoFAEnabled),
    })
  } catch (err) {
    console.error("GET /api/me/profile error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// PATCH /api/me/profile
router.patch("/profile", auth, async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { fullName, username, email, country, phone, city } = req.body || {}
    if (email && !String(email).includes("@")) {
      return res.status(400).json({ message: "Invalid email" })
    }

    const data = {}
    if (typeof fullName === "string") data.name = fullName.trim()
    if (typeof username === "string") data.username = username.trim()
    if (typeof email === "string")    data.email = email.trim()
    if (typeof country === "string")  data.country = country.trim()
    if (typeof phone === "string")    data.phone = phone.trim()
    if (typeof city === "string")     data.city = city.trim()

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { name: true, username: true, email: true, country: true, phone: true, city: true }
    })

    return res.json({
      fullName: updated.name || "",
      username: updated.username || "",
      email: updated.email || "",
      country: updated.country || "United State",
      city: updated.city || "", 
      phone: updated.phone || "",
    })
  } catch (err) {
    const msg = String(err?.message || "")
    if (msg.includes("Unique constraint") || msg.toLowerCase().includes("unique")) {
      return res.status(400).json({ message: "Email or username already in use" })
    }
    console.error("PATCH /api/me/profile error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// PATCH /api/me/security (legacy-compatible, keep this one)
router.patch("/security", auth, async (req, res) => {
  try {
    const userId = Number(req?.user?.id ?? req?.user?.userId ?? req?.user?.sub)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { currentPassword, newPassword } = req.body || {}
    if (!(currentPassword && newPassword)) {
      return res.status(400).json({ message: "Current and new password are required" })
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" })
    }

    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    })
    if (!u) return res.status(404).json({ message: "User not found" })

    const stored = String(u.password || "")
    const looksHashed = stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")

    let ok = false
    if (looksHashed) {
      ok = await bcrypt.compare(String(currentPassword), stored)
    } else {
      ok = stored === String(currentPassword)
    }

    if (!ok) return res.status(400).json({ message: "Current password is incorrect" })

    const hash = await bcrypt.hash(String(newPassword), 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hash }
    })

    return res.json({ message: "Password updated" })
  } catch (err) {
    console.error("PATCH /api/me/security error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

export default router
