// backend/src/controllers/usersController.js
import { prisma } from '../db.js'

/**
 * GET /api/users/me
 * Return current user's profile
 */
export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { id: true, name: true, email: true, wallet: true, role: true, kycStatus: true, wallets: true }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/users/me
 * Update current user's basic profile fields
 */
export async function updateMe(req, res, next) {
  try {
    const { name, wallet } = req.body
    await prisma.user.update({
      where: { id: req.user.sub },
      data: { name, wallet }
    })
    res.json({ message: 'Profile updated' })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/users/wallets
 * Append a new wallet address to user's wallets[] array
 */
export async function addWallet(req, res, next) {
  try {
    const { address } = req.body
    if (!address) return res.status(400).json({ message: 'Address is required' })
    const user = await prisma.user.update({
      where: { id: req.user.sub },
      data: { wallets: { push: address } },
      select: { wallets: true }
    })
    res.json(user.wallets)
  } catch (err) {
    next(err)
  }
}

/**
 * DELETE /api/users/wallets
 * Remove a wallet address from wallets[] (optional helper)
 */
export async function removeWallet(req, res, next) {
  try {
    const { address } = req.body
    if (!address) return res.status(400).json({ message: 'Address is required' })
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const filtered = (user.wallets || []).filter(a => a !== address)
    await prisma.user.update({
      where: { id: req.user.sub },
      data: { wallets: filtered }
    })
    res.json(filtered)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/users
 * Admin: list users (minimal fields)
 */
export async function listUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
      select: { id: true, name: true, email: true, role: true, kycStatus: true }
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
}
