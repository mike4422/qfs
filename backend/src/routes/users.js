// backend/src/routes/users.js
import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roles.js'
import { me, updateMe, listUsers, addWallet /*, removeWallet */ } from '../controllers/usersController.js'
import { prisma } from '../db.js';


const r = Router()

r.get('/me', auth, async (req, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ user: u });
});
r.put('/me', auth, updateMe)
r.post('/wallets', auth, addWallet)
// r.delete('/wallets', auth, removeWallet)

r.get('/', auth, requireRole('ADMIN'), listUsers)

export default r
