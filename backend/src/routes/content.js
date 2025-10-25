// backend/src/routes/content.js
import { Router } from 'express'
import { faq, news, partners } from '../controllers/contentController.js'

const r = Router()

// Static/dummy content endpoints
r.get('/faq', faq)
r.get('/news', news)         // optional: used by Home's "Latest news" later
r.get('/partners', partners) // optional: partner logos list

export default r
