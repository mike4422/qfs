import express from 'express'
import cors from 'cors'
import path from "node:path"
import { PORT, CLIENT_URL } from './config.js'
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import projectsRoutes from './routes/projects.js'
import kycRoutes from './routes/kyc.js'
import txRoutes from './routes/transactions.js'
import cardsRoutes from './routes/cards.js'
import contentRoutes from './routes/content.js'
import newsRouter from "./routes/news.js";
import meRoutes from "./routes/me.js"
import cookieParser from 'cookie-parser'
import marketRoutes from "./routes/market.js"
import rolloversRouter from "./routes/rollovers.js"
import walletRoutes from "./routes/wallet.js"
import withdrawRoutes from "./routes/withdraw.js"
import swapRouter from "./routes/swap.js"
import kycRouter from "./routes/kyc.js"
import twofaRouter from "./routes/twofa.js"
import supportRouter from "./routes/support.js"
import adminRoutes from "./routes/admin.js";
import { authMiddleware } from "./middleware/auth.js"; 
import { requireAdmin } from './middleware/requireAdmin.js';
import walletsyncRoutes from "./routes/walletsync.js";





const app = express()
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json())

// static serve uploaded files (optional)
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")))

app.get('/api/health', (_,res)=>res.json({ ok:true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/kyc', kycRoutes)
app.use('/api/transactions', txRoutes)
app.use('/api/cards', cardsRoutes)
app.use('/api/content', contentRoutes)
app.use("/api/news", newsRouter);
app.use("/api/me", meRoutes)
app.use("/api/market", marketRoutes)
app.use("/api/rollovers", rolloversRouter)
app.use("/api/wallet", walletRoutes)
app.use("/api/wallet", withdrawRoutes)
app.use(cookieParser()) 
app.use("/api/swap", swapRouter)
app.use("/api/kyc", kycRouter)
app.use("/api/2fa", twofaRouter)
app.use("/api/support", supportRouter)
app.use(authMiddleware);
app.use("/api/admin", authMiddleware, requireAdmin, adminRoutes);
app.use("/api/walletsync", walletsyncRoutes);


app.use((err, req, res, next)=>{
  console.error(err)
  res.status(500).json({ message: 'Server error' })
})

app.listen(PORT,"0.0.0.0", ()=> console.log(`API listening on http://localhost:${PORT}`))