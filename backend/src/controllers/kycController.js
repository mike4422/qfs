// backend/src/controllers/kycController.js
import { prisma } from '../db.js'

export async function submit(req, res, next) {
  try {
    // You can persist req.file metadata here if needed
    await prisma.user.update({
      where: { id: req.user.sub },
      data: { kycStatus: 'PENDING' }
    })
    res.json({ message: 'KYC submitted' })
  } catch (err) {
    next(err)
  }
}

export async function approve(req, res, next) {
  try {
    const userId = Number(req.params.userId)
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'APPROVED' }
    })
    res.json({ message: 'KYC approved' })
  } catch (err) {
    next(err)
  }
}
