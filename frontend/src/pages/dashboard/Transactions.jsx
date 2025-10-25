import { useEffect, useMemo, useState } from "react"
import api from "../../lib/api"
import {
  ArrowDownRight,
  ArrowUpRight,
  Copy,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

function formatCurrency(n) {
  const num = Number(n)
  if (!isFinite(num)) return "—"
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(num)
  } catch {
    return `$${num.toFixed(2)}`
  }
}

function StatusBadge({ status }) {
  const map = {
    PENDING: "bg-amber-100 text-amber-800 ring-amber-200",
    CONFIRMED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    FAILED: "bg-rose-100 text-rose-800 ring-rose-200",
    CANCELLED: "bg-gray-100 text-gray-700 ring-gray-200",
  }
  const cls = map[status?.toUpperCase?.()] || "bg-gray-100 text-gray-700 ring-gray-200"
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {status ?? "—"}
    </span>
  )
}

function TypePill({ type }) {
  const dep = type?.toUpperCase?.() === "DEPOSIT"
  const Icon = dep ? ArrowDownRight : ArrowUpRight
  const base = dep
    ? "bg-blue-50 text-blue-700 ring-blue-200"
    : "bg-purple-50 text-purple-700 ring-purple-200"
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${base}`}>
      <Icon className="h-3.5 w-3.5" />
      {type ?? "—"}
    </span>
  )
}

function Skeleton({ rows = 6 }) {
  return (
    <tbody className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: 6 }).map((__, j) => (
            <td key={j} className="py-4">
              <div className="h-3 w-24 rounded bg-gray-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default function Transactions() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("ALL")
  const [type, setType] = useState("ALL")
  const [symbol, setSymbol] = useState("ALL")
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setError("")
        // Keep your existing API shape
        const { data } = await api.get("/transactions")
        setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        setError("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const symbols = useMemo(() => {
    const s = new Set(items.map(i => (i.symbol || "-").toUpperCase()))
    return ["ALL", ...Array.from(s)]
  }, [items])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return items.filter(t => {
      if (status !== "ALL" && t.status?.toUpperCase?.() !== status) return false
      if (type !== "ALL" && t.type?.toUpperCase?.() !== type) return false
      if (symbol !== "ALL" && (t.symbol || "-").toUpperCase() !== symbol) return false
      if (!qq) return true
      return [
        t.ref,
        t.hash,
        t.txid,
        t.type,
        t.symbol,
        t.status,
        t.amount,
        t.network,
      ].filter(Boolean).some(x => String(x).toLowerCase().includes(qq))
    })
  }, [items, q, status, type, symbol])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = filtered.slice((page - 1) * pageSize, page * pageSize)

  function exportCSV() {
    const cols = ["id", "ref", "type", "symbol", "amount", "status"]
    const rows = filtered.map(t => cols.map(k => (t[k] ?? "")).join(","))
    const blob = new Blob(
      [cols.join(","), ...rows.map(r => `\n${r}`)],
      { type: "text/csv;charset=utf-8" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function copy(text) {
    if (!text) return
    navigator.clipboard.writeText(text)
      .then(() => {
        // simple toast
        const el = document.getElementById("txCopyToast")
        if (!el) return
        el.classList.remove("opacity-0")
        setTimeout(() => el.classList.add("opacity-0"), 1200)
      })
      .catch(() => {})
  }

  return (
    <div className="p-0 sm:p-2">
      {/* Header / Controls Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4">
          <div>
            <h1 className="text-lg font-semibold">Transactions</h1>
            <p className="text-sm text-gray-600">
              View deposits, withdrawals, and on-chain activity
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                value={q}
                onChange={e => { setQ(e.target.value); setPage(1) }}
                placeholder="Search hash / ref / symbol"
                className="rounded-xl border border-gray-200 bg-white px-9 py-2 text-sm focus:ring-2 focus:ring-gray-900"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500"><Filter className="h-3.5 w-3.5" /> Filters</span>

              <select
                value={type}
                onChange={e => { setType(e.target.value); setPage(1) }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                {["ALL","DEPOSIT","WITHDRAWAL","TRANSFER"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                value={status}
                onChange={e => { setStatus(e.target.value); setPage(1) }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                {["ALL","PENDING","CONFIRMED","FAILED","CANCELLED"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={symbol}
                onChange={e => { setSymbol(e.target.value); setPage(1) }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                {symbols.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary chips */}
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        <SummaryCard
          label="Total Transactions"
          value={filtered.length}
        />
        <SummaryCard
          label="Confirmed Volume"
          value={formatCurrency(
            filtered
              .filter(t => t.status?.toUpperCase?.() === "CONFIRMED")
              .reduce((a, b) => a + Number(b.usdAmount || b.amount || 0), 0)
          )}
        />
        <SummaryCard
          label="Pending Count"
          value={filtered.filter(t => t.status?.toUpperCase?.() === "PENDING").length}
        />
        <SummaryCard
          label="Failed Count"
          value={filtered.filter(t => t.status?.toUpperCase?.() === "FAILED").length}
        />
      </div>

      {/* Table / Cards */}
      <div className="mt-3 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-[11px] uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 text-left">Hash / Ref</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>

            {loading ? (
              <Skeleton rows={8} />
            ) : current.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                    No transactions found
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-100">
                {current.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px]">{t.hash || t.ref || "—"}</span>
                        {(t.hash || t.ref) && (
                          <button
                            onClick={() => copy(t.hash || t.ref)}
                            className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                            title="Copy"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      {t.network && (
                        <div className="text-[11px] text-gray-500">{t.network}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TypePill type={t.type} />
                    </td>
                    <td className="px-4 py-3 text-center">{t.symbol ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium">{t.amount ?? "—"}</div>
                      {t.usdAmount != null && (
                        <div className="text-[11px] text-gray-500">{formatCurrency(t.usdAmount)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-2 py-3 text-right">
                      {/* reserved for future actions */}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Mobile cards (optional; uncomment if you want separate layout)
        <div className="sm:hidden divide-y divide-gray-100">
          {current.map(t => (
            <div key={t.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs">{t.hash || t.ref || "—"}</span>
                <StatusBadge status={t.status} />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <TypePill type={t.type} />
                <div className="text-right">
                  <div className="font-medium">{t.amount ?? "—"}</div>
                  {t.usdAmount != null && (
                    <div className="text-[11px] text-gray-500">{formatCurrency(t.usdAmount)}</div>
                  )}
                </div>
              </div>
              {t.network && <div className="mt-1 text-[11px] text-gray-500">{t.network}</div>}
            </div>
          ))}
        </div>
        */}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-xs text-gray-500">
              Page {page} of {totalPages} &middot; Showing {(page - 1) * pageSize + 1}
              {"–"}
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tiny toast for copy */}
      <div
        id="txCopyToast"
        className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-gray-900 px-3 py-1 text-xs text-white opacity-0 transition-opacity"
      >
        Copied
      </div>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  )
}
