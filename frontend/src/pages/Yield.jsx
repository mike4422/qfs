// src/pages/Yield.jsx
import { Link } from "react-router-dom";

export default function Yield() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-slate-950">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Web3 gradient + mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(40% 40% at 20% 20%, rgba(34,197,94,.32) 0%, rgba(34,197,94,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(56,189,248,.26) 0%, rgba(56,189,248,0) 60%)",
          }}
        />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative container mx-auto px-6 pt-24 pb-16 text-white">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold ring-1 ring-white/15 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Web3LedgerTrust • Yield
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Earn 10% Monthly Yield — While Staying in Control.
            </h1>

            <p className="mt-4 text-white/85 leading-relaxed">
              Link your wallet to <strong>Web3LedgerTrust</strong> and opt into yield. Keep visibility with ledger tracking,
              get clear allocation signals, and manage participation from your dashboard.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300"
              >
                Activate Yield
                <svg
                  viewBox="0 0 24 24"
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                How It Works
              </a>

              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
              >
                Read FAQs
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Kpi title="Target Yield" value="10% / month" />
              <Kpi title="Dashboard Control" value="Opt-in / opt-out" />
              <Kpi title="Ledger Visibility" value="Track in real time" />
            </div>

          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950" />
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  How 10% Yield Works
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Simple onboarding, transparent tracking, and clean controls — built for Web3 users.
                </p>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Enable Yield
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <StepCard
                step="01"
                title="Link Wallet to Ledger"
                text="Connect your wallet to Web3LedgerTrust to enable tracking and security signals."
                icon={<LinkIcon />}
              />
              <StepCard
                step="02"
                title="Opt Into Yield"
                text="Choose your preferred asset set and confirm your yield settings in the dashboard."
                icon={<SparkIcon />}
              />
              <StepCard
                step="03"
                title="Track Monthly Returns"
                text="Monitor accrual, activity, and ledger events — all in one place with clear reporting."
                icon={<ChartIcon />}
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <InfoCard
                title="Security-first by design"
                text="We use ledger linking to improve visibility and reduce blind spots. You get clean activity views and account-level integrity signals."
                icon={<ShieldIcon />}
              />
              <InfoCard
                title="Full control from your dashboard"
                text="Toggle yield participation, review terms, and manage settings without friction. Clear labels. Clear outcomes."
                icon={<SlidersIcon />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== RISK / TRANSPARENCY ===== */}
      <section className="relative py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                  Transparency
                </span>
                <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Clear reporting. No vague numbers.
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Your dashboard shows yield status, ledger events, and monthly performance in a format designed for quick verification.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <div className="font-semibold">Best practice:</div>
                <div className="mt-1">Use a dedicated wallet for yield participation.</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ChecklistItem
                title="You choose participation"
                text="Enable or disable yield from your account. You are not locked in by default."
              />
              <ChecklistItem
                title="You can audit activity"
                text="Ledger linking helps you track wallet events and see yield-related signals in one view."
              />
              <ChecklistItem
                title="Avoid phishing & imposters"
                text="We will never ask for your seed phrase or private keys. Only connect via official pages."
              />
              <ChecklistItem
                title="Understand risk"
                text="Yield is not risk-free. Review terms and allocate responsibly."
              />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Ready to activate? Link your wallet and enable yield from the dashboard.
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300"
                >
                  Activate Yield
                </Link>
                <Link
                  to="/migration"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                >
                  Go to Migration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-950" />
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Yield FAQs
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Short answers to the questions users ask most.
            </p>

            <div className="mt-8 grid gap-4">
              <FaqItem
                q="Do I need to migrate first?"
                a="If your funds are on a centralized exchange, migration to your wallet is recommended before enabling yield. This keeps custody with you."
              />
              <FaqItem
                q="Is the 10% monthly yield guaranteed?"
                a="Yield participation may involve risk and conditions. Always review the terms shown in your dashboard before enabling."
              />
              <FaqItem
                q="Can I disable yield anytime?"
                a="Yes. You can manage yield participation from your account dashboard (opt-in / opt-out controls)."
              />
              <FaqItem
                q="What does “Link to Ledger” mean?"
                a="It’s a wallet-to-ledger association that improves tracking and security visibility (activity signals, reporting, and integrity checks)."
              />
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Want the cleanest setup?
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Use Migration first, then enable yield from your dashboard.
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/migration"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  >
                    Start Migration
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- Presentational components (local) ---------- */

function Kpi({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-xs font-semibold text-white/70">{title}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function StepCard({ step, title, text, icon }) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 shadow-sm">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{step}</span>
      </div>
      <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{text}</div>
    </div>
  );
}

function InfoCard({ title, text, icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
          {icon}
        </div>
        <div>
          <div className="text-base font-semibold text-slate-900 dark:text-white">{title}</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">{q}</div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{a}</div>
    </div>
  );
}

/* ---------- Icons ---------- */

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 01-7 0l-2 2a5 5 0 007 7l1-1" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l1.4 5.2L19 9l-5.6 1.8L12 16l-1.4-5.2L5 9l5.6-1.8L12 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 18l.9 3L8 20.1" opacity="0.7" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 15l3-3 3 2 4-6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8l0 0" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v6c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-5" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10V3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12V3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 16h4" />
    </svg>
  );
}
