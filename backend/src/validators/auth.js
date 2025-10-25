import { body } from 'express-validator'
export const registerRules = [
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]
export const loginRules = [
  body('email').isEmail(),
  body('password').isString()
]