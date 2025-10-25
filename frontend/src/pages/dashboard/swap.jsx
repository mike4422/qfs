// src/pages/dashboard/swap.jsx
import { useEffect, useMemo, useState } from "react"
import {
  ArrowDownUp, ChevronDown, Settings, AlertTriangle, Repeat2,
  Wallet, Loader2, X, SlidersHorizontal, Info,
  CheckCircle2, XCircle
} from "lucide-react"
import { useAuth } from "../../store/auth"

// proxy to avoid hotlink tears
const proxify = (url) => {
  try { const u = new URL(url); return `https://images.weserv.nl/?url=${u.host}${u.pathname}${u.search||""}` } catch { return url }
}
function SmartLogo({ sources, alt, size = 22, initials = "T" }) {
  const base = Array.isArray(sources) ? sources : [sources].filter(Boolean)
  const all = base.flatMap(s => [s, proxify(s)])
  const [idx, setIdx] = useState(0)
  const src = all[idx]
  if (!src) {
    return (
      <span className="inline-flex items-center justify-center rounded-full text-white"
        style={{ width: size, height: size, background: "linear-gradient(135deg,#2563eb,#7c3aed)", fontSize: Math.max(10, size*0.38), fontWeight: 700 }}>
        {initials}
      </span>
    )
  }
  // eslint-disable-next-line
  return <img src={src} alt={alt} className="rounded-full object-contain bg-white/5"
    style={{ width: size, height: size }} onError={() => setIdx(i => i + 1)} referrerPolicy="no-referrer" />
}

const TOKENS = [
  { symbol: "BTC",  name: "Bitcoin",  decimals: 8,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png",
    "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  ]},
  { symbol: "ETH",  name: "Ethereum", decimals: 18, logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png",
    "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  ]},
  { symbol: "USDT", name: "Tether",   decimals: 6,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png",
    "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png"
  ]},
  { symbol: "USDC", name: "USD Coin", decimals: 6,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png",
    "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"
  ]},
  { symbol: "BNB",  name: "BNB",      decimals: 18, logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png",
    "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
  ]},
  { symbol: "SOL",  name: "Solana",   decimals: 9,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png",
    "https://assets.coingecko.com/coins/images/4128/large/solana.png"
  ]},
  { symbol: "MATIC",name: "Polygon",  decimals: 18, logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/matic.png",
    "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png"
  ]},
  { symbol: "XRP",  name: "Ripple",   decimals: 6,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png",
    "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"
  ]},
  { symbol: "ADA",  name: "Cardano",  decimals: 6,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ada.png",
    "https://assets.coingecko.com/coins/images/975/large/cardano.png"
  ]},
  { symbol: "DOGE", name: "Dogecoin", decimals: 8,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png",
    "https://assets.coingecko.com/coins/images/5/large/dogecoin.png"
  ]},
  { symbol: "TRX",  name: "Tron",     decimals: 6,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/trx.png",
    "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png"
  ]},
  { symbol: "LTC",  name: "Litecoin", decimals: 8,  logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ltc.png",
    "https://assets.coingecko.com/coins/images/2/large/litecoin.png"
  ]},
  { symbol: "AVAX", name: "Avalanche",decimals: 18, logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/avax.png",
    "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png"
  ]},
  { symbol: "DOT",  name: "Polkadot", decimals: 10, logos: [
    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dot.png",
    "https://assets.coingecko.com/coins/images/12171/large/polkadot.png"
  ]},
  { symbol: "OP",   name: "Optimism", decimals: 18, logos: [
    "https://assets.coingecko.com/coins/images/25244/large/OP.png"
  ]},
]

const fmt = (n, max = 8) => Number.isFinite(n) ? String(n.toFixed(max)).replace(/\.?0+$/,"") : "—"

function TokenPill({ token, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
    >
      <SmartLogo sources={token.logos} alt={`${token.symbol} logo`} />
      <span className="font-semibold">{token.symbol}</span>
      <ChevronDown className="h-4 w-4 opacity-60" />
    </button>
  )
}

function TokenRow({ t, onPick, priceUsd }) {
  return (
    <button
      onClick={() => onPick(t)}
      className="flex w-full items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-center gap-3">
        <SmartLogo sources={t.logos} alt={`${t.symbol} logo`} size={24} />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.symbol}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{t.name}</div>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">${fmt(priceUsd ?? 0, 2)}</div>
    </button>
  )
}

export default function Swap() {
  const { token, user } = useAuth()
  const authToken = token || user?.token || localStorage.getItem("token")

  const [from, setFrom] = useState(() => TOKENS.find(t => t.symbol === "ETH"))
  const [to, setTo] = useState(() => TOKENS.find(t => t.symbol === "USDT"))

  // balances
  const [holdings, setHoldings] = useState({})
  const [loadingHoldings, setLoadingHoldings] = useState(true)

  // prices
  const [prices, setPrices] = useState({})

  // quote
  const [amountIn, setAmountIn] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [quote, setQuote] = useState(null)
  const [quoting, setQuoting] = useState(false)

  const [openSel, setOpenSel] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [connected] = useState(true) // internal venue
  const [submitting, setSubmitting] = useState(false)
  const [errMsg, setErrMsg] = useState(null)

  // 🔹 Success/Error modal state
  const [modal, setModal] = useState(null)
  // modal = { type:'success'|'error', title, message, meta?: {...} }

  const amtNum = Number(amountIn || 0)
  const fromBal = Number(holdings[from.symbol] || 0)
  const toBal = Number(holdings[to.symbol] || 0)

  const estRate = useMemo(() => {
    const pf = prices[from.symbol]?.priceUsd || 0
    const pt = prices[to.symbol]?.priceUsd || 0
    return pf && pt ? pf / pt : 0
  }, [prices, from, to])

  const outAfterFee = quote ? quote.amountOut : (amtNum > 0 && estRate ? amtNum * estRate * (1 - 0.0035) : 0)
  const minReceive = outAfterFee * (1 - slippage / 100)

  // holdings
  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoadingHoldings(true)
      try {
        const res = await fetch("/api/me/holdings", {
          credentials: "include",
          headers: { "Accept": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
        })
        const j = await res.json().catch(() => ({}))
        const map = j && typeof j === "object" && !Array.isArray(j) ? j : {}
        if (alive) setHoldings(map)
      } finally {
        if (alive) setLoadingHoldings(false)
      }
    })()
    return () => { alive = false }
  }, [authToken])

  // prices
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const symbols = TOKENS.map(t => t.symbol).join(",")
        const res = await fetch(`/api/market/prices?symbols=${encodeURIComponent(symbols)}`)
        const j = await res.json().catch(() => ({}))
        if (!alive) return
        const out = {}
        Object.entries(j || {}).forEach(([sym, v]) => { out[sym] = { priceUsd: Number(v?.priceUsd || 0) } })
        setPrices(out)
      } catch {}
    })()
    return () => { alive = false }
  }, [])

  // quote
  useEffect(() => {
    if (!(amtNum > 0)) { setQuote(null); return }
    let alive = true
    setQuoting(true)
    const t = setTimeout(async () => {
      try {
        const q = new URLSearchParams({ from: from.symbol, to: to.symbol, amount: String(amtNum) }).toString()
        const res = await fetch(`/api/swap/quote?${q}`, {
          credentials: "include",
          headers: { "Accept": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
        })
        const j = await res.json().catch(() => ({}))
        if (alive && res.ok) setQuote(j)
        else if (alive) setQuote(null)
      } catch {
        if (alive) setQuote(null)
      } finally {
        if (alive) setQuoting(false)
      }
    }, 280)
    return () => { alive = false; clearTimeout(t) }
  }, [from, to, amtNum, authToken])

  function flip() {
    const oldFrom = from
    setFrom(to)
    setTo(oldFrom)
    setErrMsg(null)
    setQuote(null)
  }

  function pickToken(side, t) {
    if (side === "from") setFrom(t.symbol === to.symbol ? from : t)
    else setTo(t.symbol === from.symbol ? to : t)
    setOpenSel(null)
    setErrMsg(null)
  }

  function setMax() {
    setAmountIn(fmt(fromBal, 8))
  }

  async function onSwap() {
    setErrMsg(null)
    if (!connected || !(amtNum > 0) || from.symbol === to.symbol) return
    if (amtNum > fromBal) { setErrMsg("Insufficient balance"); return }
    try {
      setSubmitting(true)
      const res = await fetch("/api/swap/execute", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          from: from.symbol,
          to: to.symbol,
          amount: amtNum,
          minReceive: Number(minReceive.toFixed(8)),
        })
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.message || "Swap failed")

      // Update balances locally
      setHoldings((h) => ({ ...h, ...(j?.balances || {}) }))
      setAmountIn("")
      setQuote(null)

      // 🔹 Success modal
      setModal({
        type: "success",
        title: "Swap Successful",
        message: `You swapped ${fmt(amtNum, 8)} ${from.symbol} for ${fmt(j.amountOut ?? outAfterFee, 8)} ${to.symbol}.`,
        meta: {
          from: from.symbol,
          to: to.symbol,
          amountIn: fmt(amtNum, 8),
          amountOut: fmt(j.amountOut ?? outAfterFee, 8),
          feePct: (j.feePct ?? 0.0035) * 100,
        }
      })
    } catch (e) {
      const msg = e.message || "Swap failed"
      setErrMsg(msg)

      // 🔹 Error modal
      setModal({
        type: "error",
        title: "Swap Failed",
        message: msg,
        meta: {
          from: from.symbol,
          to: to.symbol,
          attempted: fmt(amtNum, 8),
        }
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Swap</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Exchange tokens instantly within your QFS account.</p>
        </div>
        <button
          onClick={() => setShowSettings(v => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Transaction Settings</div>
            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] text-gray-500 dark:text-gray-400">Slippage tolerance</label>
              <div className="mt-1 flex items-center gap-2">
                {[0.1, 0.5, 1.0].map(v => (
                  <button
                    key={v}
                    onClick={() => setSlippage(v)}
                    className={[
                      "rounded-lg border px-2.5 py-1.5 text-sm font-semibold",
                      slippage === v
                        ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-300"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                    ].join(" ")}
                  >
                    {v}%
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={slippage}
                    onChange={e => setSlippage(Math.max(0.1, Math.min(5, Number(e.target.value || 0))))}
                    className="w-24 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-gray-500 dark:text-gray-400">Routing</label>
              <div className="mt-1 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm dark:border-gray-800">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                Auto (internal)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swap Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-900">
        {/* From */}
        <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">From</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              Balance: <span className="font-semibold text-gray-900 dark:text-gray-100">
                {loadingHoldings ? "…" : fmt(fromBal, 8)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TokenPill token={from} onClick={() => setOpenSel("from")} />
            <input
              inputMode="decimal"
              value={amountIn}
              onChange={e => setAmountIn(e.target.value)}
              placeholder="0.00"
              className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-right text-xl font-semibold text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <button onClick={setMax} className="rounded-md px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800">Max</button>
            <div className="inline-flex items-center gap-2">
              {quoting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              1 {from.symbol} ≈ {fmt(estRate, 6)} {to.symbol}
            </div>
          </div>
        </div>

        {/* Switch */}
        <div className="my-3 flex justify-center">
          <button
            onClick={flip}
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            title="Flip"
          >
            <Repeat2 className="h-4 w-4" />
          </button>
        </div>

        {/* To */}
        <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">To</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              Current: <span className="font-semibold text-gray-900 dark:text-gray-100">{fmt(toBal, 8)}</span> {to.symbol}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TokenPill token={to} onClick={() => setOpenSel("to")} />
            <div className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-right text-xl font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
              {amtNum > 0 ? fmt(outAfterFee, 6) : "0.00"}
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="inline-flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              Min receive (slippage {slippage}%): <span className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(minReceive, 6)} {to.symbol}
              </span>
            </div>
            <div>Fee ~ 0.35%</div>
          </div>
        </div>

        {/* CTA + errors */}
        <div className="mt-4">
          <button
            onClick={onSwap}
            disabled={submitting || !(amtNum > 0) || from.symbol === to.symbol}
            className={[
              "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm",
              (submitting || !(amtNum > 0) || from.symbol === to.symbol)
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            ].join(" ")}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownUp className="h-4 w-4" />}
            {submitting ? "Swapping…" : "Swap"}
          </button>

          {(amtNum > fromBal) && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              Insufficient balance
            </div>
          )}
          {errMsg && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              {errMsg}
            </div>
          )}
        </div>
      </div>

      {/* Token selector modal */}
      {openSel && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={() => setOpenSel(null)} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[520px]">
            <div className="mx-auto rounded-t-2xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Select a token</div>
                <button onClick={() => setOpenSel(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid max-h-[60vh] gap-1 overflow-y-auto">
                {TOKENS.map(t => (
                  <TokenRow key={t.symbol} t={t} onPick={(tok) => pickToken(openSel, tok)} priceUsd={prices[t.symbol]?.priceUsd} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

     {/* Success / Error Modal */}
{modal && (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={() => setModal(null)} />
    <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[520px]">
      {(() => {
        const isSuccess = modal.type === "success"
        const panelClass = isSuccess
          ? "border-transparent bg-gradient-to-br from-emerald-600 to-blue-700"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        const titleClass = isSuccess ? "text-white" : "text-gray-900 dark:text-white"
        const bodyTextClass = isSuccess ? "text-white" : "text-gray-700 dark:text-gray-300"
        const labelTextClass = isSuccess ? "text-white/80" : "text-[11px] text-gray-500 dark:text-gray-400"
        const boxBorderClass = isSuccess ? "border-white/30" : "border-gray-200 dark:border-gray-800"

        return (
          <div className={`mx-auto rounded-t-2xl sm:rounded-2xl border p-5 shadow-xl ${panelClass}`}>
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <div className={`text-sm font-semibold ${titleClass}`}>{modal.title}</div>
              </div>
              <button
                onClick={() => setModal(null)}
                className={`hover:opacity-80 ${isSuccess ? "text-white" : "text-gray-500 dark:text-gray-400"}`}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={`text-sm ${bodyTextClass}`}>{modal.message}</div>

            {modal.meta && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {"amountIn" in modal.meta && (
                  <div className={`rounded-lg border p-2 ${boxBorderClass}`}>
                    <div className={labelTextClass}>Amount In</div>
                    <div className={`font-semibold ${isSuccess ? "text-white" : ""}`}>
                      {modal.meta.amountIn} {modal.meta.from}
                    </div>
                  </div>
                )}
                {"amountOut" in modal.meta && (
                  <div className={`rounded-lg border p-2 ${boxBorderClass}`}>
                    <div className={labelTextClass}>Amount Out</div>
                    <div className={`font-semibold ${isSuccess ? "text-white" : ""}`}>
                      {modal.meta.amountOut} {modal.meta.to}
                    </div>
                  </div>
                )}
                {"feePct" in modal.meta && (
                  <div className={`rounded-lg border p-2 ${boxBorderClass}`}>
                    <div className={labelTextClass}>Fees</div>
                    <div className={`font-semibold ${isSuccess ? "text-white" : ""}`}>
                      {Number(modal.meta.feePct).toFixed(2)}%
                    </div>
                  </div>
                )}
                {"attempted" in modal.meta && (
                  <div className={`rounded-lg border p-2 ${boxBorderClass}`}>
                    <div className={labelTextClass}>Attempted</div>
                    <div className={`font-semibold ${isSuccess ? "text-white" : ""}`}>
                      {modal.meta.attempted} {modal.meta.from}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModal(null)}
                className={`inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-semibold shadow-sm
                  ${isSuccess ? "bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25" :
                    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"}`}
              >
                Close
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  </div>
)}

    </section>
  )
}
