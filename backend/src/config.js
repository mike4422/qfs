import 'dotenv/config'

export const PORT = process.env.PORT || 4000
export const JWT_SECRET = process.env.JWT_SECRET
export const CLIENT_URL = process.env.CLIENT_URL
export const SMTP = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || 'support@qfsworldwide.net'
}