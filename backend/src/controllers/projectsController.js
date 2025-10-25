// backend/src/controllers/projectsController.js
import { prisma } from '../db.js'

export async function list(req, res, next) {
  try {
    const items = await prisma.project.findMany({
      where: { userId: req.user.sub },
      orderBy: { id: 'desc' }
    })
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })
    const item = await prisma.project.create({
      data: { title, userId: req.user.sub }
    })
    res.json(item)
  } catch (err) {
    next(err)
  }
}
