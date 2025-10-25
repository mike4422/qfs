import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import ErrorBoundary from "./ErrorBoundary"
import "./index.css"
import { AuthProvider } from "./store/auth.jsx";

const el = document.getElementById("root")
if (!el) throw new Error("No #root element found")

ReactDOM.createRoot(el).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider> 
      <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
