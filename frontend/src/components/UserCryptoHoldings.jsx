import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../store/auth"
import { RefreshCcw, TrendingUp, TrendingDown } from "lucide-react"
import api from "../lib/api"   // ✅ added this line

function formatCurrency(n) {
  if (n == null || Number.isNaN(n)) return "—"
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }).format(n)
  } catch {
    return `$${Number(n).toFixed(2)}`
  }
}

function formatAmount(n, decimals = 8) {
  if (n == null || Number.isNaN(n)) return "0.00"
  const nf = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  })
  return nf.format(n)
}

// Place this ABOVE CoinRow (no extra imports here)
function CoinLogo({ symbol, name, size = 48 }) {
  const srcs = [
    `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${symbol.toLowerCase()}.png`,
    `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/64`,
  ]

  const [idx, setIdx] = useState(0)
  const src = srcs[idx]

  if (!src) {
    return (
      <div
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm"
        style={{ width: size, height: size }}
        title={name || symbol}
      >
        <span className="text-sm font-bold">{symbol}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${name || symbol} logo`}
      width={size}
      height={size}
      className="rounded-xl bg-white shadow-sm border border-gray-200 dark:border-gray-800 object-contain p-1"
      onError={() => setIdx((i) => i + 1)}
      title={name || symbol}
    />
  )
}



function CoinRow({ meta, loading = false }) {
  const { symbol, name, amount, priceUsd, change24h } = meta || {}

  const valueUsd = (amount ?? 0) * (priceUsd ?? 0)
  const isUp = (change24h ?? 0) >= 0

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {loading ? (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          {/* Left: avatar + labels */}
          <div className="flex min-w-0 items-center gap-3">
           <CoinLogo symbol={symbol} name={name} size={48} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {name} <span className="text-gray-500 dark:text-gray-400">({symbol})</span>
              </div>
              <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Price: {formatCurrency(priceUsd)}{" "}
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    isUp
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  ].join(" ")}
                  title="24h change"
                >
                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(change24h ?? 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Right: holdings */}
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatAmount(amount, 8)} {symbol}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatCurrency(valueUsd)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UserCryptoHoldings() {
  const { user, token } = useAuth()
  const authToken = token || user?.token || localStorage.getItem("token")

  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [coins, setCoins] = useState([])

  const symbols = useMemo(
    () => [
      "BTC", "ETH", "USDT", "USDC",
      "XLM", "XRP", "LTC", "DOGE", "BNB", "SHIB",
      "TRX", "ADA", "SOL", "MATIC", "ALGO",
      "TRUMP", "PEPE"
    ],
    []
  )

  async function fetchHoldingsAndPrices() {
    try {
      setErr(null)
      setLoading(true)

      // ✅ 1) Get user holdings (use axios instance)
      const { data: holdings } = await api.get("/me/holdings", {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      })

      // ✅ 2) Get live prices for the same symbols (use axios instance)
      const q = symbols.join(",")
      const { data: prices } = await api.get(`/market/prices?symbols=${encodeURIComponent(q)}`)

      // Build rows
      const rows = symbols.map((sym) => {
        const amount = Number(holdings?.[sym] ?? 0)
        const priceUsd = Number(prices?.[sym]?.priceUsd ?? 0)
        const change24h = Number(prices?.[sym]?.change24h ?? 0)
        const nameMap = {
          BTC: "Bitcoin",
          ETH: "Ethereum",
          USDT: "Tether",
          USDC: "USD Coin",
          XLM: "Stellar",
          XRP: "XRP",
          LTC: "Litecoin",
          DOGE: "Dogecoin",
          BNB: "BNB",
          SHIB: "Shiba Inu",
          TRX: "TRON",
          ADA: "Cardano",
          SOL: "Solana",
          MATIC: "Polygon",
          ALGO: "Algorand",
          TRUMP: "Official Trump",
          PEPE: "Pepe"
        }
        return {
          symbol: sym,
          name: nameMap[sym] || sym,
          amount,
          priceUsd,
          change24h
        }
      })

      setCoins(rows)
    } catch (e) {
      setErr(e.message || "Failed to load holdings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHoldingsAndPrices()
    const id = setInterval(fetchHoldingsAndPrices, 60_000)
    return () => clearInterval(id)
  }, [authToken])

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Your Crypto Coins</h2>
        <button
          onClick={fetchHoldingsAndPrices}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {loading
          ? symbols.map((s) => <CoinRow key={s} loading meta={{}} />)
          : coins.map((c) => <CoinRow key={c.symbol} meta={c} />)}
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {err}
        </div>
      )}
    </section>
  )
}
