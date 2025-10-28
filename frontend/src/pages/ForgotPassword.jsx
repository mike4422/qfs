import { useState } from "react"
import api from "../lib/api"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true); setMsg(null); setErr(null)
    try {
      const { data } = await api.post("/auth/forgot", { email })
      setMsg(data?.message || "If that email exists, a reset link has been sent.")
    } catch (e) {
      setErr(e?.response?.data?.message || "Unable to send reset link")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Forgot Password</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Enter your account email and we’ll send you a reset link.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              placeholder="you@domain.com"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !email.includes("@")}
            className={[
              "w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
              (submitting || !email.includes("@"))
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            ].join(" ")}
          >
            {submitting ? "Sending…" : "Send Reset Link"}
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
        </form>
      </div>
    </div>
  )
}
