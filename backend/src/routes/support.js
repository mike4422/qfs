import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"
import multer from "multer"

const prisma = new PrismaClient()
const router = Router()

// simple in-memory file storage; plug S3 later
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB/file
})

function getUserId(req) {
  return Number(req?.user?.id ?? req?.user?.userId ?? req?.user?.sub)
}

// GET /api/support/tickets
router.get("/tickets", auth, async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { messages: true } } }
    })

    const out = tickets.map(t => ({
      id: t.id,
      subject: t.subject,
      category: t.category,
      priority: mapPriorityOut(t.priority),
      status: mapStatusOut(t.status),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      messagesCount: t._count.messages
    }))

    return res.json(out)
  } catch (err) {
    console.error("GET /api/support/tickets error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// POST /api/support/tickets  (multipart: subject, category, priority, message, attachments[])
router.post("/tickets", auth, upload.array("attachments"), async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { subject, category, priority, message } = req.body || {}
    if (!subject || !message) return res.status(400).json({ message: "Subject and message are required" })

    const pIn = String(priority || "Normal").toUpperCase()
    const priorityEnum = ["LOW","NORMAL","HIGH","URGENT"].includes(pIn) ? pIn : "NORMAL"

    const attachments = (req.files || []).map(f => ({
      name: f.originalname,
      type: f.mimetype,
      size: f.size,
      url: null // put S3 URL here when you wire storage
    }))

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject: String(subject).trim(),
        category: String(category || "Other").trim(),
        priority: priorityEnum,
        status: "OPEN",
        messages: {
          create: {
            userId,
            isStaff: false,
            message: String(message).trim(),
            attachments: attachments.length ? attachments : undefined
          }
        }
      }
    })

    return res.json({
      id: ticket.id,
      subject: ticket.subject,
      category: ticket.category,
      priority: mapPriorityOut(ticket.priority),
      status: mapStatusOut(ticket.status),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      messagesCount: 1
    })
  } catch (err) {
    console.error("POST /api/support/tickets error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// GET /api/support/tickets/:id
router.get("/tickets/:id", auth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const id = Number(req.params.id)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    if (!id) return res.status(400).json({ message: "Invalid id" })

    const t = await prisma.supportTicket.findFirst({
      where: { id, userId },
      include: {
        messages: { orderBy: { createdAt: "asc" } }
      }
    })
    if (!t) return res.status(404).json({ message: "Not found" })

    return res.json({
      id: t.id,
      subject: t.subject,
      category: t.category,
      priority: mapPriorityOut(t.priority),
      status: mapStatusOut(t.status),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      messages: t.messages.map(m => ({
        id: m.id,
        author: m.isStaff ? "Support" : "You",
        isStaff: m.isStaff,
        message: m.message,
        attachments: (m.attachments || []),
        createdAt: m.createdAt
      }))
    })
  } catch (err) {
    console.error("GET /api/support/tickets/:id error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// POST /api/support/tickets/:id/messages  (multipart: message, attachments[])
router.post("/tickets/:id/messages", auth, upload.array("attachments"), async (req, res) => {
  try {
    const userId = getUserId(req)
    const id = Number(req.params.id)
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    if (!id) return res.status(400).json({ message: "Invalid id" })

    const ticket = await prisma.supportTicket.findFirst({ where: { id, userId } })
    if (!ticket) return res.status(404).json({ message: "Not found" })

    const { message } = req.body || {}
    if (!message || !String(message).trim()) return res.status(400).json({ message: "Message is required" })

    const attachments = (req.files || []).map(f => ({
      name: f.originalname,
      type: f.mimetype,
      size: f.size,
      url: null
    }))

    await prisma.supportMessage.create({
      data: {
        ticketId: id,
        userId,
        isStaff: false,
        message: String(message).trim(),
        attachments: attachments.length ? attachments : undefined
      }
    })

    return res.json({ ok: true })
  } catch (err) {
    console.error("POST /api/support/tickets/:id/messages error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// helpers: map enums to UI strings
function mapPriorityOut(p) {
  return ({ LOW: "Low", NORMAL: "Normal", HIGH: "High", URGENT: "Urgent" }[p] || "Normal")
}
function mapStatusOut(s) {
  return ({ OPEN: "Open", IN_PROGRESS: "In Progress", RESOLVED: "Resolved", CLOSED: "Closed" }[s] || "Open")
}

export default router
