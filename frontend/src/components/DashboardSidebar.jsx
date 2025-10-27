import { useMemo, useState } from "react"
import { NavLink, Link, useLocation } from "react-router-dom"
import {
  LayoutGrid,
  User,
  Wallet,
  RefreshCcw,
  ArrowLeftRight,
  CreditCard,
  Landmark,
  Shield,
  FileCheck2,
  Settings2,
  LogIn,
  ChevronDown,
} from "lucide-react"
import { useAuth } from "../store/auth"

function linkClasses(isActive) {
  return [
    "group relative flex items-center gap-3 rounded-xl px-3 py-1.5 text-sm transition",

    "border border-transparent",
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
  ].join(" ")
}

function ActivePill({ active }) {
  return (
    <span
      className={[
        "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full",
        active ? "bg-blue-600 dark:bg-blue-400" : "bg-transparent",
      ].join(" ")}
    />
  )
}

export default function DashboardSidebar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Safe localStorage fallback so the sidebar works on first render/hard refresh
  let stored = null
  try {
    stored = JSON.parse(localStorage.getItem("qfs_user") || "null")
  } catch (_) {
    stored = null
  }
  const effectiveUser = user || stored
  const role = effectiveUser?.role
  const isAdmin = role === "ADMIN"

  const menu = useMemo(
    () => [
      { to: "/dashboard", label: "Overview", icon: LayoutGrid, end: true },
      { to: "/dashboard/profile", label: "Profile", icon: User },
      { to: "/dashboard/wallet-sync", label: "Wallet Sync", icon: RefreshCcw },
      { to: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
      { to: "/dashboard/deposit", label: "Deposit", icon: LogIn },
      { to: "/dashboard/withdraw", label: "Withdraw", icon: Wallet },
      { to: "/dashboard/buycrypto", label: "Buy Crypto", icon: CreditCard },
      { to: "/dashboard/swap", label: "Swap", icon: ArrowLeftRight },
      { to: "/dashboard/secure-401-ira", label: "Secure 401 or IRA", icon: Landmark },
      { to: "/dashboard/cards", label: "Cards", icon: FileCheck2 },
      { to: "/dashboard/kyc", label: "KYC", icon: Shield },
      ...(isAdmin ? [{ to: "/dashboard/admin", label: "Admin", icon: Settings2 }] : []),
    ],
    [isAdmin]
  )

  return (
    <aside className="lg:sticky lg:top-6 self-start">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-sm">
              QF
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                <Link to='/'>
                QFS Dashboard
                </Link>
                </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Navigation</div>
            </div>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            Menu
            <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav className={`px-2 py-2 lg:block ${open ? "block" : "hidden"} lg:px-3`}>
          <ul className="space-y-1.5">
            {menu.map(({ to, label, icon: Icon, end }) => {
              const extraActive =
                to === "/dashboard" && (pathname === "/dashboard" || pathname === "/dashboard/overview")
              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) => linkClasses(isActive || extraActive)}
                  >
                    <ActivePill active={extraActive || undefined} />
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>

          <div className="my-3 border-t border-gray-100 dark:border-gray-800" />

          <div className="px-2 pb-3">
            <div className="rounded-xl border border-dashed border-gray-200 p-3 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
              <p className="font-medium text-gray-900 dark:text-gray-100">Need help?</p>
              <p className="mt-0.5">
                Visit <span className="font-medium">FAQ</span> or contact support.
              </p>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}
