import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../store/auth"
import {
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  CheckCircle,
  Clock,
  LifeBuoy  
} from "lucide-react"
import api from "../lib/api" // ✅ added

function formatCurrency(n) {
  if (n == null || Number.isNaN(n)) return "—"
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n)
  } catch {
    return `$${Number(n).toFixed(2)}`
  }
}

function KycBadge({ status }) {
  const map = {
    not_verified: {
      text: "Not Verified",
      className:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      Icon: ShieldAlert
    },
    pending: {
      text: "Pending",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      Icon: Clock
    },
    approved: {
      text: "Approved",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Icon: CheckCircle
    }
  }
  const conf = map[status] ?? map.not_verified
  const Icon = conf.Icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${conf.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {conf.text}
    </span>
  )
}


function StatCard({ title, subtitle, value, icon: Icon, loading = false }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="mt-2 h-6 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          ) : (
            <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
          )}
          {subtitle ? (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          ) : null}
        </div>
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardHeader() {
  const { user, token, logout } = useAuth()

  // Theme
  // Theme (desktop) — match MobileNavDock behavior
const getInitialTheme = () => {
  if (typeof window === "undefined") return false
  const stored = localStorage.getItem("theme")
  if (stored === "dark") return true
  if (stored === "light") return false
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
}

const [isDark, setIsDark] = useState(getInitialTheme)

const applyTheme = (dark) => {
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.style.colorScheme = dark ? "dark" : "light"
  localStorage.setItem("theme", dark ? "dark" : "light")
}

useEffect(() => {
  applyTheme(isDark)
  // Sync with OS changes if user hasn't explicitly chosen after load
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)")
  const onMQ = (e) => {
    const stored = localStorage.getItem("theme")
    if (!stored) {
      setIsDark(e.matches)
      applyTheme(e.matches)
    }
  }
  mq?.addEventListener?.("change", onMQ)
  return () => mq?.removeEventListener?.("change", onMQ)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


  // Profile menu
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  useEffect(() => {
    function onClickOutside(e) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const fullName = useMemo(() => {
    return (
      user?.fullName ||
      user?.name ||
      (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
      user?.username ||
      "User"
    )
  }, [user])

  const initials = useMemo(() => {
    const base = fullName?.trim() || ""
    const parts = base.split(/\s+/)
    const first = parts[0]?.[0] || ""
    const last = parts[1]?.[0] || ""
    return (first + last).toUpperCase() || "U"
  }, [fullName])

  // -------- Dynamic KPIs from API --------
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [summary, setSummary] = useState({
    totalAssetUSD: null,
    walletSynced: null,
    kycStatus: "not_verified"
  })
  // added
  const [stableTotalAssetUSD, setStableTotalAssetUSD] = useState(null)


  const authToken = token || user?.token || localStorage.getItem("token")

  console.log("[summary] using token:", authToken?.slice?.(0,12), "…")

  async function fetchSummary() {
    try {
      setErr(null)
      setLoading(true)
        const { data } = await api.get("/me/summary", {
       headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
     })
    setSummary({
    totalAssetUSD: data?.totalAssetUSD ?? 0,
    walletSyncStatus: data?.walletSyncStatus || "NOT_SYNCED",
    kycStatus: data?.kycStatus || "not_verified",
    });

    // added new
    const next = typeof data?.totalAssetUSD === "number" ? data.totalAssetUSD : 0
setStableTotalAssetUSD(prev => {
  if (prev == null) return next            // first value wins (0 or >0)
  if (next === 0 && prev > 0) return prev  // ignore transient zeros
  return next
})


    } catch (e) {
      setErr(e.message || "Unable to fetch summary")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
    const interval = setInterval(fetchSummary, 15000); 
    const onFocus = () => fetchSummary()
    window.addEventListener("visibilitychange", onFocus)
    return () => window.removeEventListener("visibilitychange", onFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken])

  const walletValue = useMemo(() => {
  if (loading) return null;
  const status = summary.walletSyncStatus?.toUpperCase?.() || "NOT_SYNCED";
  const baseClass = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium";

  switch (status) {
    case "PENDING":
      return (
        <span className={`${baseClass} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300`}>
          <Clock className="h-3.5 w-3.5" /> Pending
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className={`${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`}>
          <ShieldCheck className="h-3.5 w-3.5" /> Under Review
        </span>
      );
    case "APPROVED":
      return (
        <span className={`${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}>
          <CheckCircle className="h-3.5 w-3.5" /> Connected
        </span>
      );
    case "REJECTED":
      return (
        <span className={`${baseClass} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`}>
          <ShieldAlert className="h-3.5 w-3.5" /> Rejected
        </span>
      );
    default:
      return (
        <span className={`${baseClass} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`}>
          <ShieldAlert className="h-3.5 w-3.5" /> Not Synced
        </span>
      );
  }
}, [loading, summary.walletSyncStatus]);


  return (
    <header className="mb-6">
 {/* Top Bar */}
<div className="flex items-center justify-between px-4 sm:px-6 py-4">
  {/* Left: Greeting */}
  <div>
    <p className="text-xs sm:text-sm font-medium text-gray-900">Welcome back,</p>
    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
      {fullName}
    </h1>
  </div>

  {/* Right: Profile / Actions */}
  <div className="relative" ref={menuRef}>
    <button
      onClick={() => setOpen((v) => !v)}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left hover:shadow-sm transition dark:border-gray-800 dark:bg-gray-900"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-sm">
        {initials}
      </span>
      <div className="hidden sm:block">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {fullName}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Dashboard
        </div>
      </div>
      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </button>

    {/* Dropdown */}
    {open && (
      <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="p-2">
          <Link
            to="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Account</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">View & edit your profile</span>
            </div>
          </Link>

          {/* Support */}
          <Link
            to="/dashboard/support"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <LifeBuoy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Support</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Get help & docs</span>
            </div>
          </Link>

          <div className="my-2 h-px bg-gray-100 dark:bg-gray-800" />

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => {
            const next = !isDark
            setIsDark(next)
            applyTheme(next)
            }}

          >
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
              <div className="text-left">
                <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Dark Mode
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  Toggle theme
                </span>
              </div>
            </div>

            {/* Toggle */}
            <span
              className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                isDark ? "bg-gray-900" : "bg-gray-300"
              ].join(" ")}
              aria-hidden="true"
            >
              <span
                className={[
                  "inline-block h-5 w-5 transform rounded-full bg-white transition",
                  isDark ? "translate-x-5" : "translate-x-1"
                ].join(" ")}
              />
            </span>
          </button>

          <div className="my-2 h-px bg-gray-100 dark:bg-gray-800" />

          <button
            onClick={() => {
              setOpen(false)
              logout?.()
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 text-red-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Logout
              </span>
              <span className="text-xs text-red-500/80 dark:text-red-400/80">
                Sign out of your account
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <div className="inline-flex items-center gap-2">
            <Settings className="h-3.5 w-3.5" />
            Quick Actions
          </div>
          <span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-800">v1.0</span>
        </div>
      </div>
    )}
  </div>
</div>



      {/* KPI Row (dynamic) */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Total Asset"
          subtitle="Across all wallets"
          // added new
          value={loading ? null : formatCurrency(stableTotalAssetUSD ?? 0)}
          icon={Wallet}
          loading={loading}
        />

        <StatCard
          title="Wallet Synced"
          subtitle="WalletSync status"
          value={loading ? null : walletValue}
          icon={ShieldCheck}
          loading={loading}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">KYC Status</p>
              {loading ? (
                <div className="mt-2 h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              ) : (
                <div className="mt-2">
                  <KycBadge status={summary.kycStatus} />
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {loading
                  ? ""
                  : summary.kycStatus === "not_verified"
                    ? "Complete verification to unlock full features."
                    : summary.kycStatus === "pending"
                      ? "Your documents are under review."
                      : "Your identity is verified."}
              </p>
            </div>

            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              {summary.kycStatus === "approved" ? (
                <CheckCircle className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Row */}
    <div className="mt-4">
    <Link
        to="/dashboard/secure-401-ira"
        className="group flex items-center justify-between gap-3 rounded-2xl border border-blue-200/60 bg-white px-4 py-3 shadow-sm transition hover:shadow-md dark:border-blue-900/40 dark:bg-gray-900"
    >
        <div className="flex items-center gap-3 min-w-0">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
        </span>
        <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            SECURE 401 OR IRA
        </span>
        <span className="hidden sm:inline-block truncate text-xs text-gray-500 dark:text-gray-400">
            Consolidate and protect your retirement savings
        </span>
        </div>

        <span className="text-sm font-semibold text-blue-700 transition group-hover:translate-x-0.5 dark:text-blue-300">
        Start now →
        </span>
    </Link>
    </div>


      {/* Error Banner (only if fetch failed) */}
      {err && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {err}
        </div>
      )}
    </header>
  )
}
