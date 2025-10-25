// backend/src/routes/cards.js
import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { list, create } from '../controllers/cardsController.js'

const r = Router()

// List current user's card requests
r.get('/', auth, list)
// Create a new card request
r.post('/', auth, create)

export default r
