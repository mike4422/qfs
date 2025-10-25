// src/pages/Deposit.jsx
import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft, WalletMinimal, ChevronDown, Copy, Check, Info, ShieldAlert,
  QrCode, RefreshCcw, Search, AlertTriangle
} from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../store/auth"

// --- tiny helpers
const cls = (...a) => a.filter(Boolean).join(" ")
const COINS = [
  // Core
  { symbol: "BTC",  name: "Bitcoin",      networks: ["Bitcoin"] },
  { symbol: "ETH",  name: "Ethereum",     networks: ["Ethereum"] },
  { symbol: "USDT", name: "Tether",       networks: ["Ethereum", "Tron", "BNB Smart Chain", "Solana"] },
  { symbol: "USDC", name: "USD Coin",     networks: ["Ethereum", "Solana", "Tron", "BNB Smart Chain"] },

  // Extended list requested
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
  { symbol: "TRUMP",name: "Official Trump", networks: ["Ethereum"] }, // as requested
]

// coins that ALWAYS require a memo/tag
const MEMO_REQUIRED = {
  "XRP": "Destination Tag",
  "XLM": "Memo",
  "BNB": "Memo",
}

// Provide a decent logo source; fallback to gradient initials badge.
function CoinLogo({ symbol, name, size = 28, className = "" }) {
  const srcs = useMemo(() => {
    const lower = symbol.toLowerCase()
    return [
      // cryptoicons.org style
      `https://cryptoicons.org/api/icon/${lower}/200`,
      // trustwallet assets (not all coins available)
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${symbol}/logo.png`
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
          onError={() => {
            // try the second source once
            if (src !== srcs[1]) setSrc(srcs[1])
            else setSrc("")
          }}
        />
      ) : (
        <span className="text-[10px] font-bold">{symbol.slice(0,3).toUpperCase()}</span>
      )}
    </span>
  )
}

export default function Deposit() {
  const { token, user } = useAuth()
  const authToken = token || user?.token || localStorage.getItem("token")

  // asset + network selection
  const [query, setQuery] = useState("")
  const [assetOpen, setAssetOpen] = useState(false)
  const [selected, setSelected] = useState(() => COINS[0])
  const [network, setNetwork] = useState(() => COINS[0].networks[0])

  // address state
  const [loading, setLoading] = useState(false)
  const [addrError, setAddrError] = useState(null)
  const [address, setAddress] = useState("")
  const [tag, setTag] = useState("") // memo/destination tag when applicable

  const [amountInput, setAmountInput] = useState("")
const [txId, setTxId] = useState("")
const [submitting, setSubmitting] = useState(false)
const [submitMsg, setSubmitMsg] = useState(null)

  // copy feedback
  const [copiedField, setCopiedField] = useState(null)
  function copyToClipboard(text, field) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1200)
    })
  }

  async function confirmDeposit() {
  try {
    setSubmitMsg(null)

    // Basic client validations
    const amt = Number(amountInput)
    if (!amountInput || !(amt > 0)) {
      return setSubmitMsg({ type: "err", text: "Enter a valid amount" })
    }
    if (!address) {
      return setSubmitMsg({ type: "err", text: "No deposit address available yet" })
    }
    if (MEMO_REQUIRED[selected.symbol]) {
      if (selected.symbol === "BNB" && network !== "BNB Beacon Chain") {
        // memo optional on BSC
      } else if (!tag || String(tag).trim().length === 0) {
        return setSubmitMsg({ type: "err", text: `${MEMO_REQUIRED[selected.symbol]} is required` })
      }
    }

    setSubmitting(true)

    // POST to backend (you’ll add this route): /api/wallet/deposit/confirm
    const res = await fetch(`/api/wallet/deposit/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        symbol: selected.symbol,
        network,
        amount: amountInput,
        txId: txId || null,
        address,
        memo: tag || null,
      })
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(json.message || `Failed (${res.status})`)
    }

    setSubmitMsg({ type: "ok", text: "Deposit request sent. You’ll be notified after review." })
    // optional reset:
    // setAmountInput(""); setTxId("");
  } catch (e) {
    setSubmitMsg({ type: "err", text: e.message || "Could not submit deposit" })
  } finally {
    setSubmitting(false)
  }
}


  // fetch deposit address whenever coin/network changes
  async function fetchAddress(sym, net) {
    setLoading(true)
    setAddrError(null)
    setAddress("")
    setTag("")
    try {
      // Adjust to your backend route; this is what we wired earlier patterns with auth.
      const res = await fetch(`/api/wallet/deposit/address?symbol=${encodeURIComponent(sym)}&network=${encodeURIComponent(net)}`, {
        credentials: "include",
        headers: {
          "Accept": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || `Failed (${res.status})`)
      }
      const j = await res.json()
      setAddress(j.address || "")
      setTag(j.memo || j.tag || "")
    } catch (e) {
      setAddrError(e.message || "Unable to fetch address")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddress(selected.symbol, network)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.symbol, network])

  const filteredCoins = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COINS
    return COINS.filter(c =>
      c.symbol.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
    )
  }, [query])

  const requiresMemo = MEMO_REQUIRED[selected.symbol]
  const memoLabel = requiresMemo || "Memo / Tag (if provided)"

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
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Deposit</div>
        </div>
      </div>

      {/* Top card: Choose asset & network */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2">
          <WalletMinimal className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Choose wallet</h2>
        </div>

        {/* Asset selector */}
        <div className="grid gap-3 sm:grid-cols-[minmax(0,360px)_1fr]">
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

          {/* Network selector */}
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
              Only send <span className="font-semibold">{selected.symbol}</span> on the <span className="font-semibold">{network}</span> network.
              Sending on a different network may result in loss of funds.
            </div>
          </div>
        </div>
      </div>

      {/* Address / QR */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Your deposit address</h2>
          </div>
          <button
            onClick={() => fetchAddress(selected.symbol, network)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
            disabled={loading}
          >
            <RefreshCcw className={cls("h-3.5 w-3.5", loading ? "animate-spin" : "")} />
            Refresh
          </button>
        </div>

        {addrError && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {addrError}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
          {/* QR */}
          <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 p-3 dark:border-gray-700">
            {loading ? (
              <div className="h-[180px] w-[180px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            ) : address ? (
              // Using a simple QR code image API to avoid extra deps.
              // Replace with your own QR generator if preferred.
              <img
                alt="QR"
                className="h-[180px] w-[180px] rounded-lg"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(address)}`}
              />
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400">No address yet</div>
            )}
          </div>

          {/* Address + memo */}
          <div className="space-y-3">
            <div>
              <div className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">Address</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 truncate rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
                  {loading ? (
                    <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  ) : (address || "—")}
                </div>
                <button
                  onClick={() => address && copyToClipboard(address, "address")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                  disabled={!address}
                >
                  {copiedField === "address" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedField === "address" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {(requiresMemo || tag) && (
              <div>
                <div className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">{memoLabel}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 truncate rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
                    {loading ? (
                      <span className="inline-block h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    ) : (tag || "—")}
                  </div>
                  <button
                    onClick={() => tag && copyToClipboard(tag, "tag")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                    disabled={!tag}
                  >
                    {copiedField === "tag" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedField === "tag" ? "Copied" : "Copy"}
                  </button>
                </div>
                {requiresMemo && (
                  <div className="mt-1 inline-flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {memoLabel} is required for {selected.symbol} deposits on {network}.
                  </div>
                )}
              </div>
            )}

            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              Double-check the asset and network before sending. Incorrect deposits may be irrecoverable.
            </div>
          </div>
        </div>
      </div>

      {/* Confirm deposit card */}
<div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <div className="mb-3 flex items-center gap-2">
    <Info className="h-4 w-4 text-gray-600 dark:text-gray-300" />
    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Confirm your deposit</h2>
  </div>

  <div className="grid gap-4 sm:grid-cols-2">
    <div>
      <div className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">Amount ({selected.symbol})</div>
      <input
        inputMode="decimal"
        value={amountInput}
        onChange={(e) => setAmountInput(e.target.value)}
        placeholder="0.00"
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
      />
    </div>

    <div>
      <div className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">TxID / Hash (optional)</div>
      <input
        value={txId}
        onChange={(e) => setTxId(e.target.value)}
        placeholder="Paste transaction hash (if available)"
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
      />
    </div>
  </div>

  {submitMsg && (
    <div
      className={cls(
        "mt-3 rounded-lg px-3 py-2 text-xs",
        submitMsg.type === "ok"
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
          : "border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200"
      )}
    >
      {submitMsg.text}
    </div>
  )}

  <div className="mt-4 flex items-center justify-end">
    <button
      onClick={confirmDeposit}
      disabled={submitting}
      className={cls(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
        submitting
          ? "cursor-not-allowed opacity-60 border border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-200"
          : "border border-gray-900 bg-gray-900 text-white hover:bg-black dark:border-white/10 dark:bg-white dark:text-gray-900 dark:hover:bg-white"
      )}
    >
      {submitting ? "Submitting..." : "Confirm deposit"}
    </button>
  </div>
</div>


      {/* Info + Safety */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Deposit details</div>
          </div>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
            <li>• Minimum deposit may apply depending on the network congestion.</li>
            <li>• Funds are credited after required confirmations on the {network} network.</li>
            <li>• Large deposits may require additional review for your security.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Safety reminders</div>
          </div>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
            <li>• Never send unsupported assets to this address.</li>
            <li>• Always include the correct memo/tag when required.</li>
            <li>• For help, contact support from your dashboard.</li>
          </ul>
        </div>
      </div>

      {/* Optional: recent deposits (placeholder; hook to your API if desired) */}
      {/* <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Recent deposits</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">No recent deposits.</div>
      </div> */}
    </section>
  )
}
