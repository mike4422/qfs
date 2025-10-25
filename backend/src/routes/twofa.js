// /backend/src/routes/twofa.js
import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"
import speakeasy from "speakeasy"

const prisma = new PrismaClient()
const router = Router()

function getUserId(req) {
  return Number(req?.user?.id ?? req?.user?.userId ?? req?.user?.sub)
}

// POST /api/2fa/setup → generates and stores secret, returns {secret, otpauthUrl}
router.post("/setup", auth, async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    // You can use email/username to show a nicer label in authenticator apps
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, username: true, name: true } })
    const label = user?.email || user?.username || user?.name || `User#${userId}`

    const secret = speakeasy.generateSecret({
      name: `QFS (${label})`,    // shows in authenticator app
      length: 20,                 // 20 bytes → base32 ~32 chars
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFASecret: secret.base32,
        twoFAEnabled: false, // not enabled until verified
      },
    })

    return res.json({
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url || secret.otpauthUrl || null,
    })
  } catch (err) {
    console.error("POST /api/2fa/setup error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// POST /api/2fa/enable { code } → verifies TOTP, flips enabled=true
router.post("/enable", auth, async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { code } = req.body || {}
    if (!code) return res.status(400).json({ message: "Code is required" })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFASecret: true }
    })
    if (!user?.twoFASecret) return res.status(400).json({ message: "2FA not initialized" })

    const ok = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token: String(code).trim(),
      window: 1, // allow ±30s drift
    })

    if (!ok) return res.status(400).json({ message: "Invalid code" })

    await prisma.user.update({
      where: { id: userId },
      data: { twoFAEnabled: true },
    })

    return res.json({ enabled: true })
  } catch (err) {
    console.error("POST /api/2fa/enable error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// POST /api/2fa/disable → clears secret and disables
router.post("/disable", auth, async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    await prisma.user.update({
      where: { id: userId },
      data: { twoFAEnabled: false, twoFASecret: null },
    })

    return res.json({ enabled: false })
  } catch (err) {
    console.error("POST /api/2fa/disable error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

export default router
