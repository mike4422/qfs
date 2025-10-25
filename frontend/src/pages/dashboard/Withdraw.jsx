// src/pages/Withdraw.jsx
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft, WalletMinimal, ChevronDown, Search, Info, AlertTriangle,
  Check, Copy, RefreshCcw, ShieldAlert, ArrowRight, LockKeyhole, Loader2
} from "lucide-react"
import { useAuth } from "../../store/auth"

// --- helpers / constants
const cls = (...a) => a.filter(Boolean).join(" ")

const COINS = [
  { symbol: "BTC",  name: "Bitcoin",      networks: ["Bitcoin"] },
  { symbol: "ETH",  name: "Ethereum",     networks: ["Ethereum"] },
  { symbol: "USDT", name: "Tether",       networks: ["Ethereum", "Tron", "BNB Smart Chain", "Solana"] },
  { symbol: "USDC", name: "USD Coin",     networks: ["Ethereum", "Solana", "Tron", "BNB Smart Chain"] },
  { symbol: "XRP",  name: "Ripple",       networks: ["XRP Ledger"] },
  { symbol: "ADA",  name: "Cardano",      networks: ["Cardano"] },
  { symbol: "SOL",  name: "Solana",       networks: ["Solana"] },
  { symbol: "MATIC",name: "Polygon",      networks: ["Polygon"] },
  { symbol: "TRX",  name: "Tron",         networks: ["Tron"] },
  { symbol: "DOGE", name: "Dogecoin",     networks: ["Dogecoin"] },
  { symbol: "BNB",  name: "BNB",          networks: ["BNB Beacon Chain", "BNB Smart Chain"] },
  { symbol: "SHIB", name: "Shiba Inu",    networks: ["Ethereum"] },
  { symbol: "LTC",  name: "Litecoin",     networks: ["Litecoin"] },
  { symbol: "XLM",  name: "Stellar",      networks: ["Stellar"] },
  { symbol: "ALGO", name: "Algorand",     networks: ["Algorand"] },
  { symbol: "PEPE", name: "PEPE",         networks: ["Ethereum"] },
  { symbol: "TRUMP",name: "Official Trump", networks: ["Ethereum"] },
]

// coins that often need a memo / tag
const MEMO_REQUIRED = {
  XRP: "Destination Tag",
  XLM: "Memo",
  BNB: "Memo", // esp. Beacon Chain
}

// very lightweight “fees table” (static demo numbers)
const NETWORK_FEES = {
  Bitcoin: 0.00025,
  Ethereum: 0.004,
  "BNB Smart Chain": 0.003,
  "BNB Beacon Chain": 0.003,
  Solana: 0.00005,
  Polygon: 3, // in MATIC (for display simplicity we still show “3 MATIC” in fee row)
  Tron: 20,   // in TRX
  Cardano: 0.3,
  Dogecoin: 5,
  Litecoin: 0.001,
  "XRP Ledger": 0.25,
  Stellar: 0.25,
  Algorand: 0.01,
}

// Try a simple coin logo (gracefully falls back to initials)
function CoinLogo({ symbol, name, size = 28, className = "" }) {
  const srcs = useMemo(() => {
    const lower = symbol.toLowerCase()
    return [
      `https://cryptoicons.org/api/icon/${lower}/200`,
    ]
  }, [symbol])
  const [src, setSrc] = useState(srcs[0])

  return (
    <span
      className={cls(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line
        <img
          src={src}
          alt={`${symbol} logo`}
          className="h-full w-full rounded-full object-cover"
          onError={() => setSrc("")}
        />
      ) : (
        <span className="text-[10px] font-bold">{symbol.slice(0, 3).toUpperCase()}</span>
      )}
    </span>
  )
}

export default function Withdraw() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const authToken = token || user?.token || localStorage.getItem("token")

  // selection
  const [query, setQuery] = useState("")
  const [assetOpen, setAssetOpen] = useState(false)
  const [selected, setSelected] = useState(() => COINS[0])
  const [network, setNetwork] = useState(() => COINS[0].networks[0])

  // balances
  const [holdings, setHoldings] = useState([])
  const [loadingHoldings, setLoadingHoldings] = useState(true)
  const [holdingsErr, setHoldingsErr] = useState(null)
  const available = useMemo(() => {
    const h = holdings.find(h => (h.symbol || "").toUpperCase() === selected.symbol)
    const amt = Number(h?.amount || 0)
    return Number.isFinite(amt) ? amt : 0
  }, [holdings, selected])

  // form
  const [address, setAddress] = useState("")
  const [memo, setMemo] = useState("") // tag/memo if required
  const [amount, setAmount] = useState("")
  const [twoFA, setTwoFA] = useState("") // optional if you wire TOTP later

  // submission
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState(null)
  const [showReview, setShowReview] = useState(false)

  // Derived
  const requiresMemo = MEMO_REQUIRED[selected.symbol] || null
  const fee = useMemo(() => NETWORK_FEES[network] ?? 0, [network])
  const amtNum = Number(amount || 0) || 0
  const totalDeduct = amtNum + (Number.isFinite(fee) ? fee : 0)

  const filteredCoins = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COINS
    return COINS.filter(c =>
      c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    )
  }, [query])

  // Replace ONLY the contents of the holdings fetch effect in Withdraw.jsx

// fetch holdings (to show available balance)
useEffect(() => {
  let alive = true
  async function run() {
    setLoadingHoldings(true)
    setHoldingsErr(null)
    try {
      const res = await fetch("/api/me/holdings", {
        credentials: "include",
        headers: {
          "Accept": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        }
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || `Failed (${res.status})`)
      }
      const j = await res.json()

      // 🔧 Normalize to [{ symbol, amount }] where amount = available
      let arr = []
      if (Array.isArray(j?.holdings)) {
        arr = j.holdings
      } else if (Array.isArray(j)) {
        arr = j
      } else if (j && typeof j === "object") {
        arr = Object.entries(j).map(([symbol, available]) => ({
          symbol: String(symbol).toUpperCase(),
          amount: Number(available) || 0,
        }))
      }

      if (alive) setHoldings(arr)
    } catch (e) {
      if (alive) setHoldingsErr(e.message || "Unable to load balances")
    } finally {
      if (alive) setLoadingHoldings(false)
    }
  }
  run()
  return () => { alive = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [authToken])


  // validation
  const addressOk = address.trim().length >= 6 // minimal non-empty validation
  const amountOk  = amtNum > 0 && amtNum <= available
  const memoOk    = !requiresMemo || (memo.trim().length > 0)
  const canContinue = addressOk && amountOk && memoOk

  function setMax() {
    setAmount(String(available || ""))
  }

  function openReview() {
    if (!canContinue) return
    setShowReview(true)
  }

  async function submitWithdrawal() {
    try {
      setSubmitting(true)
      setSubmitErr(null)

      // Adjust backend path once you implement it
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          symbol: selected.symbol,
          network,
          address: address.trim(),
          memo: memo.trim() || null,
          amount: amtNum,
          twoFA: twoFA.trim() || null,
        })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || `Request failed (${res.status})`)
      }

      // success → go to transactions
      navigate("/dashboard/transactions")
    } catch (e) {
      setSubmitErr(e.message || "Unable to submit withdrawal")
    } finally {
      setSubmitting(false)
      setShowReview(false)
    }
  }

  return (
    <section className="space-y-6">
      {/* Heading / back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Withdraw</div>
        </div>
      </div>

      {/* Asset & Network */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2">
          <WalletMinimal className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Choose asset & network</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,360px)_1fr]">
          {/* Asset */}
          <div className="relative">
            <button
              onClick={() => setAssetOpen(v => !v)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 outline-none hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
            >
              <span className="inline-flex items-center gap-2">
                <CoinLogo symbol={selected.symbol} name={selected.name} />
                <span className="font-semibold">{selected.symbol}</span>
                <span className="text-gray-500 dark:text-gray-400">— {selected.name}</span>
              </span>
              <ChevronDown className="ml-auto inline h-4 w-4 text-gray-400" />
            </button>

            {assetOpen && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="p-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                      placeholder="Search (BTC, ETH, XRP...)"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredCoins.map(c => (
                    <button
                      key={c.symbol}
                      onClick={() => { setSelected(c); setNetwork(c.networks[0]); setAssetOpen(false) }}
                      className={cls(
                        "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800",
                        selected.symbol === c.symbol ? "bg-gray-50 dark:bg-gray-800" : ""
                      )}
                    >
                      <CoinLogo symbol={c.symbol} name={c.name} size={24} />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{c.symbol}</span>
                      <span className="text-gray-500 dark:text-gray-400">— {c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Network */}
          <div>
            <div className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">Network</div>
            <div className="flex flex-wrap gap-2">
              {selected.networks.map(net => (
                <button
                  key={net}
                  onClick={() => setNetwork(net)}
                  className={cls(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium",
                    network === net
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-300"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                  )}
                >
                  {net}
                </button>
              ))}
            </div>
            <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Info className="h-3.5 w-3.5" />
              Only withdraw <span className="font-semibold">{selected.symbol}</span> on the <span className="font-semibold">{network}</span> network.
            </div>
          </div>
        </div>
      </div>

      {/* Form: address / memo / amount */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* balance */}
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Withdrawal details</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {loadingHoldings ? "Loading balance…" :
              holdingsErr ? <span className="text-red-600 dark:text-red-400">{holdingsErr}</span> :
              <>Available: <span className="font-semibold text-gray-900 dark:text-gray-100">{available}</span> {selected.symbol}</>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Address */}
          <div>
            <label className="block text-[11px] text-gray-500 dark:text-gray-400">Destination address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              placeholder={`Enter ${selected.symbol} address`}
            />
            {!addressOk && address.length > 0 && (
              <div className="mt-1 text-[11px] text-red-600">Address looks too short.</div>
            )}
          </div>

          {/* Memo / Tag when required */}
          <div>
            <label className="block text-[11px] text-gray-500 dark:text-gray-400">
              {requiresMemo || "Memo / Tag (if required)"}
            </label>
            <input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              placeholder={requiresMemo ? `${requiresMemo} for ${selected.symbol}` : "Optional"}
            />
            {requiresMemo && !memoOk && (
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                {requiresMemo} is required for this withdrawal.
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11px] text-gray-500 dark:text-gray-400">Amount ({selected.symbol})</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="0.00"
              />
              <button
                type="button"
                onClick={setMax}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Max
              </button>
            </div>
            {!amountOk && amount && (
              <div className="mt-1 text-[11px] text-red-600">
                Amount must be greater than 0 and ≤ available.
              </div>
            )}
          </div>

          {/* Fee (static estimate) */}
          <div>
            <label className="block text-[11px] text-gray-500 dark:text-gray-400">Network fee (estimated)</label>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
                {fee} {selected.symbol === "MATIC" && network === "Polygon" ? "MATIC" :
                      selected.symbol === "TRX"   && network === "Tron"    ? "TRX"   :
                      selected.symbol === "XRP"   && network === "XRP Ledger" ? "XRP" :
                      selected.symbol === "XLM"   && network === "Stellar" ? "XLM" :
                      selected.symbol === "BNB"   && network === "BNB Smart Chain" ? "BNB" :
                      selected.symbol === "BNB"   && network === "BNB Beacon Chain" ? "BNB" :
                      selected.symbol}
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => {/* would refetch dynamic fee later */}}
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Update
              </button>
            </div>
            <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              Total deduction (est.): <span className="font-semibold text-gray-900 dark:text-gray-100">
                {Number.isFinite(totalDeduct) ? totalDeduct : "—"} {selected.symbol}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
          Carefully verify network, address and (if required) memo/tag. Incorrect withdrawals may be irrecoverable.
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={openReview}
            disabled={!canContinue}
            className={cls(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
              canContinue
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            )}
          >
            Review & Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {submitErr && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {submitErr}
          </div>
        )}
      </div>

      {/* Review & Confirm Modal */}
      {showReview && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setShowReview(false)}
          />
          <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[520px]">
            <div className="mx-auto rounded-t-2xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-3 flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Confirm withdrawal</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Asset / Network</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {selected.symbol} — {network}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">To</div>
                  <div className="font-mono break-all text-gray-900 dark:text-gray-100">{address}</div>
                  {requiresMemo && (
                    <div className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                      {MEMO_REQUIRED[selected.symbol]}: <span className="font-semibold">{memo || "—"}</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Amount</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{amtNum} {selected.symbol}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Estimated fee</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{fee} {selected.symbol === "MATIC" && network === "Polygon" ? "MATIC" :
                      selected.symbol === "TRX" && network === "Tron" ? "TRX" :
                      selected.symbol === "XRP" && network === "XRP Ledger" ? "XRP" :
                      selected.symbol === "XLM" && network === "Stellar" ? "XLM" :
                      selected.symbol === "BNB" ? "BNB" : selected.symbol}</div>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total deduction (est.)</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{totalDeduct} {selected.symbol}</div>
                </div>
              </div>

              {/* 2FA (optional UI; wire when ready) */}
              <div className="mt-3">
                <label className="block text-[11px] text-gray-500 dark:text-gray-400">Two-factor code (if enabled)</label>
                <input
                  value={twoFA}
                  onChange={(e) => setTwoFA(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="123456"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowReview(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={submitWithdrawal}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Confirm withdrawal
                </button>
              </div>

              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
                <ShieldAlert className="h-3.5 w-3.5" />
                Submissions are final once broadcast to the network.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
