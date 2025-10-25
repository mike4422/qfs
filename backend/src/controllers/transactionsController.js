// backend/src/controllers/transactionsController.js
import { prisma } from '../db.js'

export async function list(req, res, next) {
  try {
    const txs = await prisma.transaction.findMany({
      where: { userId: req.user.sub },
      orderBy: { id: 'desc' }
    })
    res.json(txs)
  } catch (err) {
    next(err)
  }
}
