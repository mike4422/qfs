import cors from 'cors'

// allow the Vite dev origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
