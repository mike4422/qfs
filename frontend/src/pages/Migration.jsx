// src/pages/Migration.jsx
import { Link } from "react-router-dom";

export default function Migration() {
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
              "radial-gradient(40% 40% at 20% 20%, rgba(56,189,248,.35) 0%, rgba(56,189,248,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(168,85,247,.28) 0%, rgba(168,85,247,0) 60%)",
          }}
        />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative container mx-auto px-6 pt-24 pb-16 text-white">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold ring-1 ring-white/15 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Web3LedgerTrust • Migration Hub
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Reclaim Your Crypto: Ditch CEX Custody, Own It All.
            </h1>

            <p className="mt-4 text-white/85 leading-relaxed">
              Move funds from centralized exchanges to your decentralized wallet, then link your wallet to{" "}
              <strong>Web3LedgerTrust</strong> for real-time tracking, integrity signals, and optional yield onboarding.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#start"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-400"
              >
                Start Migration
                <svg
                  viewBox="0 0 24 24"
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Create Account
              </Link>

              <a
                href="#security"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
              >
                Read Safety Checklist
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Kpi title="Non-Custodial" value="You hold keys" />
              <Kpi title="Fast Setup" value="Minutes to link" />
              <Kpi title="Security Layer" value="Ledger visibility" />
            </div>

          </div>
        </div>
      </section>

      {/* ===== 3-STEP FLOW ===== */}
      <section id="start" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950" />
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  How Migration Works
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  A simple 3-step flow designed to minimize mistakes and maximize control.
                </p>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Get Started
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <StepCard
                step="01"
                title="Connect Your Exchange"
                text="Select your CEX and confirm your withdrawal settings. Always verify the correct network before sending."
                icon={<ExchangeIcon />}
              />
              <StepCard
                step="02"
                title="Transfer to Your Wallet"
                text="Withdraw to Trust Wallet / MetaMask / Ledger-supported addresses. Use a small test send when possible."
                icon={<WalletIcon />}
              />
              <StepCard
                step="03"
                title="Link to Web3 Ledger"
                text="Attach your wallet to Web3LedgerTrust for activity tracking, security signals, and optional yield onboarding."
                icon={<LedgerIcon />}
              />
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Prefer a guided migration?
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Our onboarding team can help you verify chain/network choices and reduce transfer errors.
                  </div>
                </div>
                <a
                  href="#security"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                >
                  View Checklist
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECURITY CHECKLIST ===== */}
      <section id="security" className="relative py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                    Safety Checklist
                  </span>
                  <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Avoid the 3 biggest migration mistakes
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Most losses happen due to network mismatch, wrong address, or phishing. Use this checklist every time.
                  </p>
                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ChecklistItem
                  title="Confirm the chain/network"
                  text="ERC20 ≠ TRC20 ≠ BEP20. The sending and receiving networks must match."
                />
                <ChecklistItem
                  title="Verify the destination address"
                  text="Copy/paste carefully, verify the first/last 6 characters, and confirm address format."
                />
                <ChecklistItem
                  title="Use a test transfer"
                  text="Send a small amount first (where practical) before moving your full balance."
                />
                <ChecklistItem
                  title="Watch for phishing"
                  text="Only use official domains/links. Ignore DMs claiming “support” with urgent requests."
                />
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Ready to move? Start with the guided flow and keep custody of your assets.
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#start"
                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-400"
                  >
                    Start Migration
                  </a>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative container mx-auto px-6 py-14 text-white">
          <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Own your wallet. Track it like a pro.
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  Migrate from CEX custody, link to Web3LedgerTrust, and unlock a cleaner security posture for long-term holding.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-400"
                >
                  Start Migration Now
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/5"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- Small UI pieces (local to this page) ---------- */

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
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 text-white shadow-sm">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{step}</span>
      </div>
      <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{text}</div>
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

/* ---------- Inline Icons ---------- */

function ExchangeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 7l2-2M7 7l2 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17H7M17 17l-2-2M17 17l-2 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" opacity="0.6" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h4v4h-4a2 2 0 110-4z" />
    </svg>
  );
}

function LedgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h6" />
    </svg>
  );
}
