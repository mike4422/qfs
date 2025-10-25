import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../store/auth"

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}
