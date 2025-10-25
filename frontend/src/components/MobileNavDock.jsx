import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../store/auth"
import {
  Home,
  CreditCard,
  Link2,
  ShieldCheck,
  MoreHorizontal,
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  ReceiptText,   // Transactions
  LifeBuoy,      // Support
  Settings2      // <-- Admin
} from "lucide-react"

function DockItem({ to, icon: Icon, label, active }) {
  return (
    <Link
      to={to}
      className={[
        "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition",
        active
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      ].join(" ")}
    >
      <Icon className="h-6 w-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}

export default function MobileNavDock() {
  const { user, logout } = useAuth()
  const location = useLocation()

  // Theme handling (robust + immediate)
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

  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  function closeOnOutside(e) {
    if (!panelRef.current) return
    if (!panelRef.current.contains(e.target)) setOpen(false)
  }

  const username = useMemo(() => {
    return (
      user?.username ||
      user?.name ||
      user?.fullName ||
      (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User")
    )
  }, [user])

  const initials = useMemo(() => {
    const base = (username || "").trim()
    const p = base.split(/\s+/)
    return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase() || "U"
  }, [username])

  const isActive = (path) => location.pathname === path

  // --- Admin detection (role + localStorage fallback) ---
  let stored = null
  try {
    stored = JSON.parse(localStorage.getItem("qfs_user") || "null")
  } catch (_) { stored = null }
  const effectiveUser = user || stored
  const isAdmin = effectiveUser?.role === "ADMIN"

  return (
    <>
      {/* Bottom dock (mobile only) */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-gray-900/90"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-screen-md">
          <div className="grid grid-cols-5 px-3 py-2">
            <DockItem to="/dashboard/cards"        icon={CreditCard} label="Cards"       active={isActive("/dashboard/cards")} />
            <DockItem to="/dashboard/wallet-sync"  icon={Link2}      label="Link Wallet" active={isActive("/dashboard/wallet-sync")} />
            <DockItem to="/dashboard"              icon={Home}       label="Home"        active={isActive("/dashboard")} />
            {/* If admin, show Admin here; otherwise show Verify */}
            {isAdmin ? (
              <DockItem to="/dashboard/admin" icon={Settings2} label="Admin" active={isActive("/dashboard/admin")} />
            ) : (
              <DockItem to="/dashboard/kyc"   icon={ShieldCheck} label="Verify" active={isActive("/dashboard/kyc")} />
            )}
            <button
              onClick={() => setOpen(true)}
              className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <MoreHorizontal className="h-6 w-6" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </div>
        </div>
      </nav>

       {/* spacer so content doesn't sit under the fixed dock */}
      <div
        className="sm:hidden"
        style={{ height: "calc(64px + env(safe-area-inset-bottom))" }}
        aria-hidden="true"
      />

      {/* Slide-out panel from left (mobile only) */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-50">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeOnOutside} />

          {/* panel */}
          <aside
            ref={panelRef}
            className="absolute inset-y-0 left-3 w-[18rem] max-w-[80%] translate-x-0 rounded-2xl border border-gray-200 bg-white/95 shadow-xl ring-1 ring-black/5 transition-transform supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-900/95"
          >
            {/* header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-sm">
                {initials}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  Welcome back, {username}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Dashboard</div>
              </div>
            </div>

            {/* menu */}
            <div className="p-2 space-y-1 text-sm">
              {/* Admin shortcut (only if admin) */}
              {isAdmin && (
                <Link
                  to="/dashboard/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <span className="inline-flex items-center gap-3">
                    <Settings2 className="h-4 w-4" />
                    Admin
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              )}

              <Link
                to="/dashboard/profile"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <span className="inline-flex items-center gap-3">
                  <UserIcon className="h-4 w-4" />
                  Account
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              {/* Theme toggle */}
              <button
                onClick={() => {
                  const next = !isDark
                  setIsDark(next)
                  applyTheme(next)
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <span className="inline-flex items-center gap-3">
                  {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Dark Mode
                </span>
                <span
                  className={[
                    "relative inline-flex h-5 w-10 items-center rounded-full transition",
                    isDark ? "bg-gray-900" : "bg-gray-300"
                  ].join(" ")}
                  aria-hidden="true"
                >
                  <span
                    className={[
                      "inline-block h-4 w-4 transform rounded-full bg-white transition",
                      isDark ? "translate-x-5" : "translate-x-1"
                    ].join(" ")}
                  />
                </span>
              </button>

              {/* quick links */}
              <Link to="/dashboard/cards" onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
                <span className="inline-flex items-center gap-3"><CreditCard className="h-4 w-4" /> Cards</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link to="/dashboard/wallet-sync" onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
                <span className="inline-flex items-center gap-3"><Link2 className="h-4 w-4" /> Link Wallet</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link to="/dashboard/transactions" onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
                <span className="inline-flex items-center gap-3"><ReceiptText className="h-4 w-4" /> Transactions</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              {/* Show Verify only to non-admins here (admins have Admin link) */}
              {!isAdmin && (
                <Link to="/dashboard/kyc" onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
                  <span className="inline-flex items-center gap-3"><ShieldCheck className="h-4 w-4" /> Verify Account</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              )}

              {/* Support */}
              <Link to="/dashboard/support" onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
                <span className="inline-flex items-center gap-3"><LifeBuoy className="h-4 w-4" /> Support</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              {/* logout */}
              <button
                onClick={() => { setOpen(false); logout?.() }}
                className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <span className="inline-flex items-center gap-3"><LogOut className="h-4 w-4" /> Logout</span>
                <ChevronRight className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
