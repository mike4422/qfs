// src/pages/dashboard/Profile.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../../store/auth"
import {
  User, ShieldCheck, Globe, Mail, Phone, LockKeyhole, KeyRound, CheckCircle2,
  Loader2, ShieldAlert
} from "lucide-react"

// Country → currency code (expand as needed)
const COUNTRY_TO_CC = {
  "United States": "USD",
  "United Kingdom": "GBP",
  Canada: "CAD",
  Germany: "EUR",
  France: "EUR",
  Spain: "EUR",
  Italy: "EUR",
  Netherlands: "EUR",
  Sweden: "SEK",
  Norway: "NOK",
  Denmark: "DKK",
  Switzerland: "CHF",
  Poland: "PLN",
  Turkey: "TRY",
  UAE: "AED",
  "Saudi Arabia": "SAR",
  Kenya: "KES",
  Ghana: "GHS",
  India: "INR",
  Singapore: "SGD",
  "Hong Kong": "HKD",
  Japan: "JPY",
  "South Korea": "KRW",
  Australia: "AUD",
  "New Zealand": "NZD",
  Brazil: "BRL",
  Mexico: "MXN",
}

const COUNTRIES = Object.keys(COUNTRY_TO_CC)

function Field({ label, children, hint, error }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{hint}</div>}
      {error && <div className="mt-1 text-[11px] text-red-600">{error}</div>}
    </div>
  )
}

function Pill({ status }) {
  const map = {
    not_verified: { text: "Not verified", class: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
    pending:      { text: "Pending review", class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    approved:     { text: "Approved", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  }
  const p = map[status] || map.not_verified
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${p.class}`}>{p.text}</span>
}

export default function Profile() {
  const { token, user } = useAuth()
  const authToken = token || user?.token || localStorage.getItem("token")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null) // {type:'success'|'error', message:''}

  // Fetched summary (kyc + minimal user info)
  const [summary, setSummary] = useState(null)

  // Editable form state
  const [pi, setPi] = useState({
    fullName: "",
    username: "",
    email: "",
    country: "Nigeria",
    city: "",
  })

  const accountCurrency = useMemo(
    () => COUNTRY_TO_CC[pi.country] || "USD",
    [pi.country]
  )

  // Security
  const [sec, setSec] = useState({
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 2FA state
  const [twoFA, setTwoFA] = useState({
    enabled: false,            // display state
    provisioning: null,        // { secret, otpauthUrl }
    code: "",                  // user-entered TOTP during enable
  })

  const onPi = (k) => (e) => setPi((s) => ({ ...s, [k]: e.target.value }))
  const onSec = (k) => (e) => setSec((s) => ({ ...s, [k]: e.target.value }))
  const on2fa = (k) => (e) => setTwoFA((s) => ({ ...s, [k]: e.target.value }))

  // Load profile + kyc status
  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        // Pull KYC + name from summary
        const res1 = await fetch("/api/me/summary", {
          credentials: "include",
          headers: { Accept: "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
        })
        const j1 = await res1.json().catch(()=> ({}))
        if (!alive) return
        setSummary(j1 || {})

        // Attempt richer profile endpoint if present (graceful fallback)
        const res2 = await fetch("/api/me/profile", {
          credentials: "include",
          headers: { Accept: "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
        })
        const j2 = await res2.json().catch(()=> ({}))

        // Merge into form (prefer /profile values, fallback to summary/user)
        setPi({
          fullName: j2.fullName || j1.name || user?.name || "",
          username: j2.username || user?.username || "",
          email:    j2.email || user?.email || "",
          country:  j2.country || "Nigeria",
          city:     j2.city || "",
        })
        setSec((s) => ({ ...s, phone: j2.phone || user?.phone || "" }))

        // 2FA current status if your API supports it
        if (j2.twoFAEnabled != null) {
          setTwoFA((t) => ({ ...t, enabled: Boolean(j2.twoFAEnabled) }))
        }
      } catch {
        // keep defaults
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [authToken])

  // Validations
  const errors = useMemo(() => {
    const e = {}
    if (pi.fullName.trim().length < 2) e.fullName = "Please enter your full name"
    if (pi.username.trim().length < 2) e.username = "Please enter a username"
    if (!pi.email.includes("@")) e.email = "Enter a valid email"
    if (pi.city.trim().length < 2) e.city = "Please enter your city"

    if (sec.phone && sec.phone.trim().length < 6) e.phone = "Enter a valid phone number"

    if (sec.newPassword || sec.confirmPassword) {
      if (!sec.currentPassword) e.currentPassword = "Enter your current password"
      if (sec.newPassword.length < 8) e.newPassword = "Must be at least 8 characters"
      if (sec.newPassword !== sec.confirmPassword) e.confirmPassword = "Passwords do not match"
    }
    return e
  }, [pi, sec])

  const kycStatus = summary?.kycStatus || "not_verified"

  // Save handler (split into two PATCH calls; both optional)
  async function applySettings(e) {
    e.preventDefault()
    if (Object.keys(errors).length > 0) {
      setToast({ type: "error", message: "Please fix validation errors." })
      setTimeout(() => setToast(null), 2000)
      return
    }

    setSaving(true)
    setToast(null)
    try {
      // 1) Save personal info
      const p1 = fetch("/api/me/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          fullName: pi.fullName,
          username: pi.username,
          email: pi.email,
          country: pi.country,
          city: pi.city,
          accountCurrency,     // send derived currency
          phone: sec.phone,
        })
      })

      // 2) Save password if user filled it
      let p2 = Promise.resolve({ ok: true })
      if (sec.newPassword || sec.confirmPassword || sec.currentPassword) {
        p2 = fetch("/api/me/security", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          },
          body: JSON.stringify({
            currentPassword: sec.currentPassword,
            newPassword: sec.newPassword,
          })
        })
      }

      const [r1, r2] = await Promise.all([p1, p2])
      if (!r1.ok) {
        const j = await r1.json().catch(() => ({}))
        throw new Error(j.message || "Failed to update profile")
      }
      if (!r2.ok) {
        const j = await r2.json().catch(() => ({}))
        throw new Error(j.message || "Failed to update password")
      }

      setToast({ type: "success", message: "Settings saved." })
      setSec((s) => ({ ...s, currentPassword: "", newPassword: "", confirmPassword: "" }))
    } catch (err) {
      setToast({ type: "error", message: err.message || "Unable to save settings" })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 2200)
    }
  }

  // 2FA flows (optional endpoints; graceful if not present)
  async function start2FA() {
    try {
      const res = await fetch("/api/2fa/setup", {
        method: "POST",
        credentials: "include",
        headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      })
      const j = await res.json().catch(()=> ({}))
      if (!res.ok || !j.secret) throw new Error(j.message || "Unable to start 2FA")
      setTwoFA((t) => ({ ...t, provisioning: { secret: j.secret, otpauthUrl: j.otpauthUrl || "" } }))
    } catch (e) {
      setToast({ type: "error", message: e.message || "2FA setup failed" })
      setTimeout(() => setToast(null), 2200)
    }
  }

  async function confirm2FA() {
    try {
      if (!twoFA.code) return
      const res = await fetch("/api/2fa/enable", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ code: twoFA.code })
      })
      const j = await res.json().catch(()=> ({}))
      if (!res.ok) throw new Error(j.message || "Invalid code")
      setTwoFA({ enabled: true, provisioning: null, code: "" })
      setToast({ type: "success", message: "Two-factor authentication enabled." })
      setTimeout(() => setToast(null), 2200)
    } catch (e) {
      setToast({ type: "error", message: e.message || "Unable to enable 2FA" })
      setTimeout(() => setToast(null), 2200)
    }
  }

  async function disable2FA() {
    try {
      const res = await fetch("/api/2fa/disable", {
        method: "POST",
        credentials: "include",
        headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      })
      const j = await res.json().catch(()=> ({}))
      if (!res.ok) throw new Error(j.message || "Unable to disable 2FA")
      setTwoFA({ enabled: false, provisioning: null, code: "" })
      setToast({ type: "success", message: "Two-factor authentication disabled." })
      setTimeout(() => setToast(null), 2200)
    } catch (e) {
      setToast({ type: "error", message: e.message || "Unable to disable 2FA" })
      setTimeout(() => setToast(null), 2200)
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your personal details and account security.
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          {loading ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading…</span>
          ) : (
            <Pill status={kycStatus} />
          )}
        </div>
      </div>

      {/* Personal Information */}
      <form onSubmit={applySettings} className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Information</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" error={errors.fullName}>
              <input
                value={pi.fullName}
                onChange={onPi("fullName")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="Jane Doe"
              />
            </Field>

            <Field label="Username" error={errors.username}>
              <input
                value={pi.username}
                onChange={onPi("username")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="janedoe"
              />
            </Field>

            <Field label="Email address" error={errors.email}>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={pi.email}
                  onChange={onPi("email")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="you@domain.com"
                />
              </div>
            </Field>

            <Field label="Account currency">
              <input
                value={accountCurrency}
                readOnly
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </Field>

            <Field label="Country / Region">
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={pi.country}
                  onChange={onPi("country")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                >
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </Field>

            <Field label="City" error={errors.city}>
              <input
                value={pi.city}
                onChange={onPi("city")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="Edmond Ok"
              />
            </Field>
          </div>
        </div>

        {/* Account Security */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Account Security</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Phone number" error={errors.phone}>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={sec.phone}
                  onChange={onSec("phone")}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="+1 777 869 4577"
                />
              </div>
            </Field>

            <div className="hidden sm:block" />

            <Field label="Current password" error={errors.currentPassword}>
              <input
                type="password"
                value={sec.currentPassword}
                onChange={onSec("currentPassword")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="••••••••"
              />
            </Field>

            <Field label="New password" error={errors.newPassword}>
              <input
                type="password"
                value={sec.newPassword}
                onChange={onSec("newPassword")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="At least 8 characters"
              />
            </Field>

            <Field label="Confirm new password" error={errors.confirmPassword}>
              <input
                type="password"
                value={sec.confirmPassword}
                onChange={onSec("confirmPassword")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="Repeat new password"
              />
            </Field>

            {/* 2FA */}
            <div className="sm:col-span-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div className="mb-2 flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Two-Factor Authentication (2FA)
                  </div>
                </div>
                <div className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  twoFA.enabled
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}>
                  {twoFA.enabled ? "Enabled" : "Disabled"}
                </div>
              </div>

              {!twoFA.enabled && !twoFA.provisioning && (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Protect your account with a one-time code from an authenticator app.
                  </div>
                  <button
                    type="button"
                    onClick={start2FA}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:from-blue-700 hover:to-indigo-700"
                  >
                    Enable 2FA
                  </button>
                </div>
              )}

              {!twoFA.enabled && twoFA.provisioning && (
                <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
                  {/* QR (uses otpauthUrl if provided) */}
                  <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950">
                    {twoFA.provisioning.otpauthUrl ? (
                      // eslint-disable-next-line
                      <img
                        className="h-44 w-44"
                        alt="Scan QR in your authenticator app"
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=${encodeURIComponent(twoFA.provisioning.otpauthUrl)}`}
                      />
                    ) : (
                      <div className="text-xs text-gray-500 dark:text-gray-400">Scan not available</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Secret</div>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-2 font-mono text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
                      {twoFA.provisioning.secret}
                    </div>

                    <div className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">Enter code to confirm</div>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        value={twoFA.code}
                        onChange={on2fa("code")}
                        inputMode="numeric"
                        className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                        placeholder="123456"
                      />
                      <button
                        type="button"
                        onClick={confirm2FA}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:from-blue-700 hover:to-indigo-700"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setTwoFA({ enabled: false, provisioning: null, code: "" })}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                      Use Google Authenticator, 1Password, Authy, or compatible apps.
                    </div>
                  </div>
                </div>
              )}

              {twoFA.enabled && (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Your account is protected with two-factor authentication.
                  </div>
                  <button
                    type="button"
                    onClick={disable2FA}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Disable 2FA
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apply Settings */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Apply Settings
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
          }`}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            {toast.message}
          </div>
        )}
      </form>

      {/* Note */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300">
        <ShieldAlert className="mr-1 inline h-3.5 w-3.5" />
        Changes to email, password, and 2FA may require re-authentication.
      </div>
    </section>
  )
}
