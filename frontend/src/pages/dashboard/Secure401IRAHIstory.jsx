// src/pages/dashboard/Secure401IRAHistory.jsx
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, Clock, CheckCircle2, XCircle, FileText, Building2, PiggyBank, Loader2 } from "lucide-react"

function StatusBadge({ status }) {
  const map = {
    PENDING:      { text: "Pending",      cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", Icon: Clock },
    UNDER_REVIEW: { text: "Under Review", cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",   Icon: ShieldCheck },
    APPROVED:     { text: "Approved",     cls: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", Icon: CheckCircle2 },
    REJECTED:     { text: "Rejected",     cls: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",       Icon: XCircle },
  }
  const c = map[status] || map.PENDING
  const Icon = c.Icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {c.text}
    </span>
  )
}

function Row({ r }) {
  const created = useMemo(() => new Date(r.createdAt).toLocaleString(), [r.createdAt])
  const balance = useMemo(() => {
    const num = Number(r.approxBalance || 0)
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(num)
    } catch {
      return `$${num.toFixed(2)}`
    }
  }, [r.approxBalance])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left cluster */}
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">#{r.id}</div>
              <StatusBadge status={r.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{r.provider}</span>
              <span className="inline-flex items-center gap-1"><PiggyBank className="h-3.5 w-3.5" />{balance}</span>
              <span className="inline-flex items-center gap-1">{r.taxType}</span>
              <span className="inline-flex items-center gap-1">{r.destType === "Open IRA"
                ? "Open IRA"
                : `Existing IRA • ${r.destInstitution || "—"} •••• ${r.destAccountLast4 || "—"}`}</span>
              <span className="inline-flex items-center gap-1 text-gray-500">Submitted: {created}</span>
            </div>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/secure401ira`} // could be a details page later
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            <FileText className="h-4 w-4" />
            View details
          </Link>
        </div>
      </div>

      {/* Files (preview list) */}
      {r.files?.length ? (
        <div className="mt-3">
          <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Documents</div>
          <ul className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
            {r.files.map((f) => (
              <li key={f.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-800">
                <span className="truncate">{f.original}</span>
                <a
                  href={`/${f.path}`.replace(/^\/+/, "/")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Open
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default function Secure401IRAHistory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let alive = true
    async function run() {
      try {
        setErr(null)
        setLoading(true)
        const res = await fetch("/api/rollovers/mine", {
          credentials: "include",
          headers: {
            // If you use bearer tokens:
            ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {})
          }
        })
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
        const data = await res.json()
        if (alive) setItems(Array.isArray(data.items) ? data.items : [])
      } catch (e) {
        setErr(e.message || "Unable to load")
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => { alive = false }
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">401/IRA History</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Track rollover requests and their statuses.</p>
        </div>
      </div>

      {/* Filters (quick) */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map(tag => (
          <button
            key={tag}
            onClick={() => {
              const nodes = document.querySelectorAll("[data-status]")
              nodes.forEach(n => {
                n.style.display = (tag === "ALL" || n.dataset.status === tag) ? "" : "none"
              })
            }}
            className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            {tag === "ALL" ? "All" : tag.replace("_", " ")}
          </button>
        ))}
        <Link
          to="/dashboard/secure401ira/start"
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
        >
          New rollover
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {err}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          No rollover requests yet. Start one from the 401/IRA page.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} data-status={r.status}>
              <Row r={r} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
