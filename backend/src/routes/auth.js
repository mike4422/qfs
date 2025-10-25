import { Router } from 'express'
import { register, login, verifyEmail } from '../controllers/authController.js'
import { registerRules, loginRules } from '../validators/auth.js'

const r = Router()

r.post('/register', registerRules, register)
r.get('/verify', verifyEmail)
r.post('/login', loginRules, login)

export default r