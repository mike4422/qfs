// backend/src/routes/projects.js
import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { list, create } from '../controllers/projectsController.js'

const r = Router()

r.get('/', auth, list)
r.post('/', auth, create)

export default r
