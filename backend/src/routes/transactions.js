// backend/src/routes/transactions.js
import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { list } from '../controllers/transactionsController.js'

const r = Router()

// List the current user's transactions
r.get('/', auth, list)

export default r
