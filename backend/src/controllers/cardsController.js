// backend/src/controllers/cardsController.js
import { prisma } from '../db.js'

export async function list(req, res, next) {
  try {
    const data = await prisma.cardRequest.findMany({
      where: { userId: req.user.sub },
      orderBy: { id: 'desc' }
    })
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    const item = await prisma.cardRequest.create({
      data: { userId: req.user.sub, status: 'Pending' }
    })
    res.json(item)
  } catch (err) {
    next(err)
  }
}
