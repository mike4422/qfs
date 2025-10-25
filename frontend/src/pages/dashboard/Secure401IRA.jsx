import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ShieldCheck,
  Briefcase,
  PiggyBank,
  Lock,
  ArrowRight,
  ChevronDown,
  Building2,
  FileCheck2,
  DollarSign,
  Percent,
  Calculator,
  HelpCircle,
} from "lucide-react"

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
          {hint ? <div className="text-xs text-gray-500 dark:text-gray-400">{hint}</div> : null}
        </div>
      </div>
    </div>
  )
}

function Step({ idx, title, desc }) {
  return (
    <li className="relative pl-10">
      <span className="absolute left-0 top-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[12px] font-semibold">
        {idx}
      </span>
      <div className="text-sm font-semibold text-gray-900 dark:text-white">{title}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
    </li>
  )
}

export default function Secure401IRA() {
  const [expanded, setExpanded] = useState(false)
  const [amount, setAmount] = useState("")
  const [years, setYears] = useState(10)
  const [rate, setRate] = useState(5)

  // tiny projection (client-side only; this is just an estimator)
  const principal = Number(amount) || 0
  const r = (Number(rate) || 0) / 100
  const n = Number(years) || 0
  const projected = principal * Math.pow(1 + r, n)

  return (
    <section className="space-y-6">
      {/* Top hero card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Secure your 401(k) or IRA
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Consolidate old 401(k)s, open a new IRA, and keep your retirement on track with institutional-grade security.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard/secure401ira/start"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
            >
              Start rollover <ArrowRight className="h-4 w-4" />
            </Link>

            {/* NEW: History button (added beside Start rollover) */}
            <Link
              to="/dashboard/secure401ira/history"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              History
            </Link>

            <a
              href="mailto:support@qfs.example?subject=Rollover%20Help"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Talk to specialist
            </a>
          </div>
        </div>

        {/* trust strip */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Lock className="h-4 w-4" />
            Bank-level encryption & custody controls
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <FileCheck2 className="h-4 w-4" />
            KYC/AML compliant onboarding
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Building2 className="h-4 w-4" />
            FDIC/FINRA partners (where applicable)
          </div>
        </div>
      </div>

      {/* stats & quick estimator */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Stat icon={Briefcase} label="Eligible Accounts" value="401(k), 403(b), 457, IRA" hint="Traditional & Roth" />
        <Stat icon={PiggyBank} label="Typical Transfer Time" value="3–7 business days" hint="Varies by provider" />
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Simple Growth Estimate</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-gray-500 dark:text-gray-400">Amount ($)</label>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 dark:text-gray-400">Years</label>
              <input
                type="number"
                min={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 dark:text-gray-400">Rate (%)</label>
              <div className="relative">
                <Percent className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 pr-7 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Projected value:&nbsp;
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {projected ? projected.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* rollover / secure workflow */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* left: steps */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">How it works</h2>
          </div>
          <ol className="space-y-4">
            <Step
              idx={1}
              title="Tell us about your current plan"
              desc="Your provider, approximate balance, and tax type (Traditional/Roth)."
            />
            <Step
              idx={2}
              title="Choose your destination"
              desc="Open or link an IRA in minutes. Keep your allocation flexible."
            />
            <Step
              idx={3}
              title="Authorize the transfer"
              desc="We generate provider-ready forms and instructions to avoid errors."
            />
            <Step
              idx={4}
              title="Track and confirm"
              desc="Follow real-time status inside your dashboard. We’ll notify you when it’s complete."
            />
          </ol>
          <div className="mt-4">
            <Link
              to="/dashboard/secure401ira/start"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
            >
              Begin Secure Transfer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* middle: account selector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Destination account</h2>
          </div>

          <div className="space-y-2">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">
              <div className="flex items-center gap-3">
                <input type="radio" name="acct" defaultChecked className="h-4 w-4 accent-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Open a new IRA</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">No minimums. Traditional & Roth supported.</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">
              <div className="flex items-center gap-3">
                <input type="radio" name="acct" className="h-4 w-4 accent-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Use my existing IRA</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Link in seconds and stay diversified.</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to="/dashboard/wallet-sync"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Link account
            </Link>
            <Link
              to="/dashboard/secure401ira/start"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700"
            >
              Continue
            </Link>
          </div>
        </div>

        {/* right: FAQs */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Common questions</h2>
          </div>

          <details className="group rounded-xl border border-gray-200 p-3 dark:border-gray-800">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-gray-900 dark:text-gray-100">
              Is a rollover taxable?
              <ChevronDown className="h-4 w-4 text-gray-400 transition group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              Direct trustee-to-trustee rollovers are generally not taxable. Speak with a tax professional for your situation.
            </p>
          </details>

          <details className="group mt-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-gray-900 dark:text-gray-100">
              How long does it take?
              <ChevronDown className="h-4 w-4 text-gray-400 transition group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              Most transfers complete in 3–7 business days, depending on your prior provider.
            </p>
          </details>

          <details className="group mt-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-gray-900 dark:text-gray-100">
              Fees & minimums
              <ChevronDown className="h-4 w-4 text-gray-400 transition group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              No account minimums. Standard transaction or custody fees may apply depending on allocation.
            </p>
          </details>
        </div>
      </div>

      {/* disclosure */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start gap-3">
          <DollarSign className="mt-0.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
            Investment products are not FDIC insured and may lose value. This page is informational and does not constitute
            financial advice. Consider consulting a fiduciary advisor. By proceeding, you acknowledge our Terms & Disclosures.
          </p>
        </div>
      </div>
    </section>
  )
}
