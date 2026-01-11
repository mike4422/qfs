// src/pages/dashboard/Cards.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { CreditCard, UploadCloud, CheckCircle2, Copy, Check } from "lucide-react"
import { useAuth } from "../../store/auth"
import api from "../../lib/api"

const DEFAULT_NETWORK = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Ethereum",
  USDC: "Ethereum",
  XLM: "Stellar",
  XRP: "XRP Ledger",
  LTC: "Litecoin",
  DOGE: "Dogecoin",
  BNB: "BNB Smart Chain",
  SHIB: "Ethereum",
  TRX: "Tron",
  ADA: "Cardano",
  SOL: "Solana",
  MATIC: "Polygon",
  ALGO: "Algorand",
  TRUMP:"Ethereum",
  PEPE: "Ethereum",
}

const CARD_PRICE_USD = 1259.98;
const formatUSD = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);


// Ultra-robust normalizer → always returns { BTC:"...", ETH:"...", ... }
function normalizeAddresses(raw) {
  if (!raw) return {}

  // If the API wraps data, unwrap the most likely container
  const unwrapCandidates = (obj) => {
    if (!obj || typeof obj !== "object") return obj
    const layers = ["addresses", "data", "result", "wallets", "deposit", "payload"]
    for (const k of layers) {
      if (obj[k] && typeof obj[k] === "object") return obj[k]
    }
    return obj
  }

  let obj = unwrapCandidates(raw)

  // Arrays like [{symbol,address}] or [{coin,addr}] etc.
  if (Array.isArray(obj)) {
    const out = {}
    for (const it of obj) {
      const sym = String(it.symbol ?? it.coin ?? it.asset ?? it.ticker ?? "").toUpperCase()
      const addr = String(it.address ?? it.addr ?? it.wallet ?? it.value ?? "").trim()
      if (sym && addr) out[sym] = addr
    }
    return out
  }

  // Flat objects or nested per-coin objects
  // Accept patterns:
  // { BTC:"...", ETH:"..." }
  // { BTC:{address:"..."}, ETH:{addr:"..."} }
  // { btcAddress:"...", eth_address:"..." }
  // { BTC:{ deposit:{ address:"..."}} }
  const out = {}

  const coerceAddrObj = (v) => {
    if (v == null) return ""
    if (typeof v === "string") return v
    // nested possibilities
    return String(
      v.address ?? v.addr ?? v.wallet ?? v.value ??
      v.deposit?.address ?? v.deposit?.addr ?? v.deposit?.wallet ??
      v.receive?.address ?? v.receive?.addr ?? v.receive?.wallet ?? ""
    ).trim()
  }

  const pushIfCoinish = (k, v) => {
    const sym = String(k).toUpperCase()
    const addr = coerceAddrObj(v)
    // Also catch keys like 'btcAddress' / 'eth_address'
    const keyIsAddrField = /^(btc|eth|usdt|usdc|xrp|xlm|ltc|doge|bnb|shib|trx|ada|sol|matic|algo|trump|pepe)[ _-]?address$/i
    if (keyIsAddrField.test(k)) {
      const coin = k.split(/[ _-]?address/i)[0].toUpperCase()
      if (v && typeof v === "string") out[coin] = v.trim()
      return
    }
    if (addr && /^[A-Z0-9]{2,10}$/.test(sym)) out[sym] = addr
  }

  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) pushIfCoinish(k, v)
  }

  return out
}

const COINS = [
  "BTC","ETH","USDT","USDC",
  "XLM","XRP","LTC","DOGE","BNB","SHIB",
  "TRX","ADA","SOL","MATIC","ALGO",
  "TRUMP","PEPE"
]

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{hint}</div>}
    </div>
  )
}

export default function Cards() {
  const { token, user } = useAuth()
  const authToken = token || user?.token || localStorage.getItem("token")

  // Flip card every 1s
  const [flipped, setFlipped] = useState(false)
  useEffect(() => {
    const id = setInterval(() => setFlipped(f => !f), 1000)
    return () => clearInterval(id)
  }, [])

  // 🔹 Deposit addresses from backend (/routes/wallet.js)
  // Expecting a shape like: { BTC:"...", ETH:"...", ... }
  const [addresses, setAddresses] = useState({})
  const [addrLoading, setAddrLoading] = useState(true)

  // 🔹 Memos/tags per coin (moved inside component)
  const [memos, setMemos] = useState({})

  // Fetch per-coin deposit address from /api/wallet/deposit/address
  useEffect(() => {
    let alive = true
    ;(async () => {
      setAddrLoading(true)
      const found = {}
      const foundMemos = {}
      // const opts = {
      //   credentials: "include",
      //   headers: {
      //     Accept: "application/json",
      //     ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      //   },
      // }

      for (const sym of COINS) {
        const net = DEFAULT_NETWORK[sym]
        if (!net) continue
        try {
      //     const url = `/api/wallet/deposit/address?symbol=${encodeURIComponent(sym)}&network=${encodeURIComponent(net)}`
      //     const res = await fetch(url, opts)
      //     const j = await res.json().catch(() => ({}))
      //     if (res.ok && j?.address) {
      //       found[sym] = String(j.address)
      //       if (j.memo) {
      //         foundMemos[sym] = { label: j.memoLabel || "Memo/Tag", value: String(j.memo) }
      //       }
      //     }

           // ✅ Use your configured Axios instance (handles baseURL + Authorization)
           const { data } = await api.get("/wallet/deposit/address", {
             params: { symbol: sym, network: net },
           })
          if (data?.address) {
            found[sym] = String(data.address)
            if (data.memo) {
              foundMemos[sym] = { label: data.memoLabel || "Memo/Tag", value: String(data.memo) }
           }
          }
        } catch {}
      }

      if (!alive) return
      setAddresses(found)                 // { BTC: "...", ETH: "...", ... }
      setForm(f => ({ ...f, wallet: found[f.coin] || "" })) // sync current selection
      setAddrLoading(false)
      setMemos(foundMemos)               // save memos
    })()
    return () => { alive = false }
  }, [authToken])

  // Form state
  const [form, setForm] = useState({
    name: "",
    type: "Visa Card", // Visa Card | Master Card | Platinum Card
    email: "",
    phone: "",
    address: "",
    coin: "USDT",
    wallet: "" // auto-filled from addresses
  })

  // Keep form.wallet synced with chosen coin + loaded addresses
  useEffect(() => {
    setForm(f => ({ ...f, wallet: addresses[f.coin] || "" }))
  }, [addresses, form.coin])

  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      form.email.includes("@") &&
      form.phone.trim().length >= 6 &&
      form.address.trim().length >= 6 &&
      (form.wallet || "").trim().length >= 6 &&
      !!file
    )
  }, [form, file])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    // Simulate request; wire to your backend later
    setTimeout(() => {
      setSubmitting(false)
      setDone(true)
      setTimeout(() => setDone(false), 2200)
    }, 900)
  }

  async function copyWallet() {
    try {
      await navigator.clipboard.writeText(form.wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  return (
    <section className="space-y-6">
      {/* Heading */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Cards</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Pre-order your card and get it shipped to your address. Simple, secure, and fast.
          </p>
        </div>
      </div>

      {/* Card Preview + Form */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* 3D Card */}
        <div className="flex items-center justify-center">
          <div className="relative" style={{ perspective: "1200px" }}>
            <div
              className="relative h-[220px] w-[380px] sm:h-[240px] sm:w-[420px] transition-transform duration-700"
              style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-2xl p-5 shadow-xl ring-1 ring-black/10"
                style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg,#0ea5e9,#4f46e5)" }}
              >
                <div className="flex items-center justify-between text-white/90">
                  <div className="inline-flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-sm font-semibold">Web3LedgerTrust</span>
                  </div>
                  <div className="text-xs">
                    {form.type.includes("Master") ? "MASTERCARD" : form.type.includes("Platinum") ? "PLATINUM" : "VISA"}
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2">
                  <span className="h-7 w-10 rounded-md bg-white/25 backdrop-blur" />
                  <span className="h-7 w-7 rounded-full bg-white/25 backdrop-blur" />
                </div>

                <div className="mt-6 font-mono text-lg tracking-widest text-white">
                  •••• •••• •••• 4821
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 text-white">
                  <div>
                    <div className="text-[10px] uppercase text-white/70">Cardholder</div>
                    <div className="text-sm font-semibold truncate">{form.name || "YOUR NAME"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-white/70">Expires</div>
                    <div className="text-sm font-semibold">08/29</div>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-2xl p-5 shadow-xl ring-1 ring-black/10"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(135deg,#111827,#374151)"
                }}
              >
                <div className="h-8 w-full rounded-md bg-white/15" />
                <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-3">
                  <div className="rounded-md bg-white px-2 py-1 text-right font-mono text-sm tracking-widest">821</div>
                  <div className="text-[10px] uppercase text-white/60">CVV</div>
                </div>
                <div className="mt-8 text-xs text-white/70">For customer support, visit your dashboard.</div>
                <div className="mt-2 text-[10px] uppercase text-white/60">QFS • Card Services</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Shipping Details</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Cardholder full name">
              <input
                value={form.name}
                onChange={onChange("name")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="Jane Doe"
              />
            </Field>

            {/* Card type: Visa, Master Card, Platinum Card */}
            <Field label="Card type">
              <select
                value={form.type}
                onChange={onChange("type")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              >
                <option>Visa Card</option>
                <option>Master Card</option>
                <option>Platinum Card</option>
              </select>
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={onChange("email")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="you@domain.com"
              />
            </Field>

            <Field label="Phone number">
              <input
                type="tel"
                value={form.phone}
                onChange={onChange("phone")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="+1 555 000 1234"
              />
            </Field>

            <Field label="Shipping address" hint="Street, city, state, postal code, country">
              <input
                value={form.address}
                onChange={onChange("address")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="123 Market St, Suite 10, NY 10001, USA"
              />
            </Field>

            <Field label="Proof of address (PDF/JPG/PNG)">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  <UploadCloud className="h-4 w-4" />
                  Upload file
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {file ? file.name : "No file chosen"}
                </div>
              </div>
            </Field>
          </div>

          {/* Payment details */}
          <div className="mt-6 mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Payment Details</div>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Select asset">
              <select
                value={form.coin}
                onChange={onChange("coin")}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              >
                {COINS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            {/* Our wallet address from backend (read-only, copyable) */}
            <Field label={`Our ${form.coin} wallet address`}>
              <div className="flex items-center gap-2">
                <input
                  value={addrLoading ? "Loading…" : (form.wallet || "Not available")}
                  readOnly
                  className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
                {memos[form.coin]?.value && (
                  <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
                    {memos[form.coin].label}: <span className="font-semibold">{memos[form.coin].value}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={copyWallet}
                  disabled={!form.wallet}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                  title="Copy address"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </Field>
            <Field label="Card price (USD)">
  <input
    value={formatUSD(CARD_PRICE_USD)}
    readOnly
    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
  />
</Field>

          </div>

          {/* Submit */}
          <div className="mt-6 flex items-center justify-end">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
                (!canSubmit || submitting)
                  ? "bg-gray-300 dark:bg-gray-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              ].join(" ")}
            >
              {submitting ? "Processing…" : "PRE-ORDER"}
            </button>
          </div>

          {/* lightweight success toast */}
          {done && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Pre-order submitted successfully.
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
