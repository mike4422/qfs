import { useEffect, useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import api from "../lib/api"

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get("token") || ""
  const nav = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (!token) setErr("Missing token. Please use the link from your email.")
  }, [token])

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true); setErr(null); setMsg(null)
    try {
      const { data } = await api.post("/auth/reset", { token, password, confirmPassword })
      setMsg(data?.message || "Password updated. You can now log in.")
      setTimeout(() => nav("/login"), 1500)
    } catch (e) {
      setErr(e?.response?.data?.message || "Reset failed. Try requesting a new link.")
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = password.length >= 8 && password === confirmPassword && token

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Set a New Password</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Create a strong password (minimum 8 characters).
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400">New password</label>
            <input
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400">Retype password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e=>setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className={[
              "w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
              (submitting || !canSubmit)
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            ].join(" ")}
          >
            {submitting ? "Updating…" : "Update Password"}
          </button>

          {msg && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              {msg}
            </div>
          )}
          {err && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
              {err}
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Remembered your password? <Link to="/login" className="text-blue-600 dark:text-blue-300 hover:underline">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
