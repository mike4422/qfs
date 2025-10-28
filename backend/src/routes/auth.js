import { Router } from 'express'
import { register, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js'
import { registerRules, loginRules } from '../validators/auth.js'

const r = Router()

r.post('/register', registerRules, register)
r.get('/verify', verifyEmail)
r.post('/login', loginRules, login)

r.post('/forgot', forgotPassword)
r.post('/reset', resetPassword)

export default r