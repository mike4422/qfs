// /backend/src/routes/kyc.js
import { Router } from "express"
import multer from "multer"
import { auth } from "../middleware/auth.js"
import { PrismaClient } from "@prisma/client"
import { sendMail } from "../utils/email.js"  
import fs from "node:fs/promises"
import path from "node:path"           

const prisma = new PrismaClient()
const router = Router()

// admins to notify (comma-separated in .env: ADMIN_EMAILS="a@x.com,b@y.com")
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

// --- NEW: where to persist uploaded KYC files on disk ---
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "kyc")

// store files in memory (swap to disk or S3 later)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
})

// Accept the EXACT fields coming from the frontend
const kycFields = upload.fields([
  { name: "docFront", maxCount: 1 },
  { name: "docBack", maxCount: 1 },
  { name: "selfie", maxCount: 1 },
  { name: "proofAddress", maxCount: 1 },
])

router.post("/submit", auth, kycFields, async (req, res) => {
  try {
    const userId = Number(req?.user?.id ?? req?.user?.userId ?? req?.user?.sub)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    // text fields
    const {
      country, docType, firstName, lastName, dob, email, phone, address, consent
    } = req.body || {}

    // files (buffers in memory; persist to storage of your choice)
    const files = req.files || {}
    const docFront = files.docFront?.[0] || null
    const docBack  = files.docBack?.[0]  || null
    const selfie   = files.selfie?.[0]   || null
    const proof    = files.proofAddress?.[0] || null

    // (Optional) Basic validation here, but keep behavior unchanged if you already validate elsewhere

    // Mark KYC as submitted → pending (minimal change, you can store file paths in a table later)
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: "PENDING",
        kycSubmittedAt: new Date(),
        // If you have a dedicated KYC table, insert there instead of storing on user
      },
      select: { id: true, email: true, name: true }
    })

    // --- NEW: persist submission + files to DB/disk (additive only) ---
    try {
      // ensure directory uploads/kyc/<userId>
      const userDir = path.join(UPLOAD_DIR, String(userId))
      await fs.mkdir(userDir, { recursive: true })

      // helper to save buffer → disk and return metadata
      async function saveFile(bufObj, kind) {
        if (!bufObj) return null
        const stamp = Date.now()
        const safeName = `${stamp}_${bufObj.originalname}`.replace(/[^\w.\-]/g, "_")
        const full = path.join(userDir, safeName)
        await fs.writeFile(full, bufObj.buffer)
        return {
          kind,
          path: full,
          original: bufObj.originalname,
          mime: bufObj.mimetype,
          size: bufObj.size,
        }
      }

      const meta = []
      if (docFront) meta.push(await saveFile(docFront,  "docFront"))
      if (docBack)  meta.push(await saveFile(docBack,   "docBack"))
      if (selfie)   meta.push(await saveFile(selfie,    "selfie"))
      if (proof)    meta.push(await saveFile(proof,     "proofAddress"))

      // create KycSubmission with file rows
      await prisma.kycSubmission.create({
        data: {
          userId,
          country: String(country || ""),
          docType: String(docType || ""),
          firstName: String(firstName || ""),
          lastName: String(lastName || ""),
          dob: dob ? new Date(String(dob)) : new Date(0), // expects YYYY-MM-DD
          email: String(email || updated.email || ""),
          phone: String(phone || ""),
          address: String(address || ""),
          status: "PENDING",
          files: {
            create: meta.filter(Boolean).map(f => ({
              kind: f.kind,
              path: f.path,
              original: f.original,
              mime: f.mime,
              size: f.size,
            }))
          }
        }
      })
    } catch (persistErr) {
      // Don't fail submission if storage has a hiccup; just log
      console.warn("[kyc persist] failed:", persistErr.message)
    }

    // --- email all admins (best-effort, non-blocking) ---
    try {
      const fileCount =
        (docFront ? 1 : 0) +
        (docBack ? 1 : 0) +
        (selfie ? 1 : 0) +
        (proof ? 1 : 0)

      for (const to of ADMIN_EMAILS) {
        await sendMail({
          to,
          subject: `New KYC submission: ${updated.email || "user #" + updated.id}`,
          html: `<p>A user submitted KYC information.</p>
<ul>
  <li><b>User ID:</b> ${updated.id}</li>
  <li><b>Name:</b> ${updated.name || `${firstName || ""} ${lastName || ""}`.trim() || "—"}</li>
  <li><b>Email:</b> ${updated.email || email || "—"}</li>
  <li><b>Country:</b> ${country || "—"}</li>
  <li><b>Phone:</b> ${phone || "—"}</li>
  <li><b>DOB:</b> ${dob || "—"}</li>
  <li><b>Doc Type / Number:</b> ${docType || "—"} / ${"—"}</li>
  <li><b>Address (residential):</b> ${address || "—"}</li>
  <li><b>Files uploaded:</b> ${fileCount}</li>
  <li><b>Status:</b> PENDING</li>
</ul>
<p>Review it in the Admin dashboard → KYC.</p>`
        })
      }
    } catch (e) {
      console.warn("[mailer] KYC admin notice failed:", e.message)
    }

    // --- OPTIONAL: confirmation email to user (best-effort) ---
    try {
      const toUser = updated.email || email
      if (toUser) {
        await sendMail({
          to: toUser,
          subject: "KYC submitted",
          html: `<p>Hello${updated.name ? " " + updated.name : ""},</p>
<p>Your KYC was submitted and is now <b>Pending</b>. We’ll email you once it’s reviewed.</p>
<p>— QFS Support</p>`
        })
      }
    } catch (e) {
      console.warn("[mailer] KYC user confirmation failed:", e.message)
    }

    // Respond
    return res.json({ message: "KYC submitted", status: "PENDING" })
  } catch (err) {
    console.error("POST /api/kyc/submit error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// --- GET a stored KYC file (by file id) so the admin UI can preview/download ---
router.get("/file/:id", auth, async (req, res) => {
  try {
    const fileId = Number(req.params.id)
    if (!fileId) return res.status(400).json({ message: "Bad file id" })

    const f = await prisma.kycFile.findUnique({ where: { id: fileId } })
    if (!f) return res.status(404).json({ message: "Not found" })

    // Basic guard: only the owner or an admin should be able to read this
    // (If you don’t have roles, this at least restricts to the owner)
    const userId = Number(req?.user?.id ?? req?.user?.userId ?? req?.user?.sub)
    const owner = await prisma.kycSubmission.findFirst({
      where: { id: f.submissionId },
      select: { userId: true }
    })
    if (!owner) return res.status(404).json({ message: "Not found" })
    if (owner.userId !== userId) {
      // optional: if you have roles, allow admins here
      // e.g. if (req.user?.role !== 'ADMIN') ...
      // For now, block non-owners.
      return res.status(403).json({ message: "Forbidden" })
    }

    // stream from disk
    try {
      const buf = await fs.readFile(f.path)
      res.setHeader("Content-Type", f.mime || "application/octet-stream")
      // inline preview by default; change to attachment if you prefer download
      res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(f.original || "kyc-file")}"`)
      return res.send(buf)
    } catch {
      return res.status(404).json({ message: "File missing on disk" })
    }
  } catch (err) {
    console.error("GET /api/kyc/file/:id error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// --- OPTIONAL: quick check endpoint to see the latest submission for the logged-in user ---
router.get("/latest", auth, async (req, res) => {
  try {
    const userId = Number(req?.user?.id ?? req?.user?.userId ?? req?.user?.sub)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const sub = await prisma.kycSubmission.findFirst({
      where: { userId },
      orderBy: { id: "desc" },
      include: { files: true }
    })
    // also reflect the user’s current KYC flags
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true, kycSubmittedAt: true }
    })

    return res.json({ submission: sub || null, user: u || null })
  } catch (err) {
    console.error("GET /api/kyc/latest error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})


export default router
