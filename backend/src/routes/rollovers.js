// /backend/src/routes/rollovers.js
import fs from "node:fs"
import path from "node:path"
import { Router } from "express"
import multer from "multer"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"

const prisma = new PrismaClient()
const router = Router()

// storage for uploads
const UPLOAD_DIR = path.resolve(process.cwd(), "uploads", "rollovers")
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_")
    const stamp = Date.now()
    cb(null, `${stamp}-${safe}`)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB/file
})

// Robust user id getter
function getUserId(req) {
  return req?.user?.id ?? req?.user?.userId ?? req?.user?.sub
}

// POST /api/rollovers  (multipart/form-data)
router.post("/", auth, upload.array("files"), async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const {
      provider,
      otherProvider,
      approxBalance,
      taxType,
      destType,
      destInstitution,
      destAccountLast4,
      legalName,
      dob,
    } = req.body

    // normalize provider if "Other"
    const providerName =
      provider === "Other" && otherProvider?.trim()
        ? `Other: ${otherProvider.trim()}`
        : provider

    // basic validation
    if (!providerName) return res.status(400).json({ message: "Provider is required" })
    if (!approxBalance) return res.status(400).json({ message: "Approx balance is required" })
    if (!taxType) return res.status(400).json({ message: "Tax type is required" })
    if (!destType) return res.status(400).json({ message: "Destination type is required" })
    if (!legalName) return res.status(400).json({ message: "Legal name is required" })
    if (!dob) return res.status(400).json({ message: "Date of birth is required" })

    const balanceNum = Number(String(approxBalance).replace(/[^0-9.\-]/g, "")) || 0
    const dobDate = new Date(dob)

    const created = await prisma.$transaction(async (tx) => {
      const rollover = await tx.rolloverRequest.create({
        data: {
          userId: Number(userId),
          provider: providerName,
          approxBalance: balanceNum,
          taxType,
          destType,
          destInstitution: destInstitution || null,
          destAccountLast4: destAccountLast4 || null,
          legalName,
          dob: dobDate,
          status: "PENDING",
        }
      })

      // persist files
      const files = (req.files || []).map((f) => ({
        rolloverId: rollover.id,
        path: path.relative(process.cwd(), f.path),
        original: f.originalname,
        mime: f.mimetype,
        size: f.size,
      }))
      if (files.length) {
        await tx.rolloverFile.createMany({ data: files })
      }

      return rollover
    })

    return res.json({ ok: true, id: created.id })
  } catch (err) {
    console.error("POST /api/rollovers error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// GET /api/rollovers/mine  — list current user's rollover requests
router.get("/mine", auth, async (req, res) => {
  try {
    const userId = req?.user?.id ?? req?.user?.userId ?? req?.user?.sub
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const items = await prisma.rolloverRequest.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        provider: true,
        approxBalance: true,
        taxType: true,
        destType: true,
        destInstitution: true,
        destAccountLast4: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        files: {
          select: { id: true, original: true, path: true, size: true, mime: true, createdAt: true }
        }
      }
    })

    res.json({ items })
  } catch (err) {
    console.error("GET /api/rollovers/mine error:", err)
    res.status(500).json({ message: "Server error" })
  }
})


export default router
