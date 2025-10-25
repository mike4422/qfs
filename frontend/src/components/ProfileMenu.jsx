import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../store/auth"
import { ChevronDown, LogOut, Moon, Sun, Settings, User as UserIcon } from "lucide-react"

export default function ProfileMenu() {
  const { user, logout } = useAuth()

  // Theme toggle
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem("theme")
    if (stored) return stored === "dark"
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  })
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  // Dropdown state
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  useEffect(() => {
    const onClickOutside = (e) => {
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-2 hover:shadow-sm transition dark:border-gray-800 dark:bg-gray-900"
        aria-label="Open profile menu"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-sm">
          {initials}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

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

            <div className="my-2 h-px bg-gray-100 dark:bg-gray-800" />

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setIsDark((v) => !v)}
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
  )
}
