import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://api.qfsworldwide.net/api",
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
})

// automatically attach auth token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token")
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
