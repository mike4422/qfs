// src/pages/Referral.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Referral() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-slate-950">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(40% 40% at 20% 20%, rgba(34,197,94,.32) 0%, rgba(34,197,94,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(56,189,248,.26) 0%, rgba(56,189,248,0) 60%)",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative container mx-auto px-6 pt-24 pb-16 text-white">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold ring-1 ring-white/15 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Web3LedgerTrust • Referral
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Invite Friends. Earn Together.
            </h1>

            <p className="mt-4 text-white/85 leading-relaxed">
              Refer users to Web3LedgerTrust. When they complete migration from CEX to a self-custody wallet and link to
              our ledger, you unlock rewards — tracked transparently in your dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-300"
              >
                How Referrals Work
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

              <Link
                to="/migration"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
              >
                Start Migration
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Kpi title="Referral Link" value="Shown in Dashboard" />
              <Kpi title="Tracked" value="Wallet-first metrics" />
              <Kpi title="Web3 Native" value="Secure & verifiable" />
            </div>

            <p className="mt-4 text-xs text-white/55">
              Your unique referral link is available only inside your user dashboard (after account creation).
            </p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950" />
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: explainer */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Referral Program, Built for Web3
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  No public referral link on this page. For security and account integrity, your unique link is generated
                  and displayed inside your dashboard.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <InfoCard
                    title="Controlled distribution"
                    text="Keeps referral codes tied to authenticated users and reduces abuse."
                    icon={<ShieldIcon />}
                  />
                  <InfoCard
                    title="Transparent tracking"
                    text="See sign-ups, wallet linking, and rewards from one dashboard view."
                    icon={<ChartIcon />}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <div className="font-semibold">Where do I find my link?</div>
                  <div className="mt-1 text-emerald-900/80 dark:text-emerald-200/85">
                    After creating an account, open your dashboard → <strong>Referral</strong> to copy your unique link.
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/yield"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                  >
                    Explore 10% Yield
                  </Link>
                </div>
              </div>

              {/* Right: steps */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  How Referrals Work
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Three clean steps — designed for Web3 onboarding.
                </p>

                <div className="mt-6 grid gap-4">
                  <StepRow
                    n="01"
                    title="Get your dashboard link"
                    text="Create an account and open Dashboard → Referral to copy your unique link."
                    icon={<LinkIcon />}
                  />
                  <StepRow
                    n="02"
                    title="Your referrals onboard"
                    text="They sign up and follow the guided migration from CEX to a self-custody wallet."
                    icon={<UserPlusIcon />}
                  />
                  <StepRow
                    n="03"
                    title="Wallet links to ledger"
                    text="Once linked, tracking and security signals activate and rewards become eligible."
                    icon={<LedgerIcon />}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Share channels</div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Promote your dashboard referral link in communities you already trust: X, Telegram, WhatsApp, Discord.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ShareChip label="X (Twitter)" />
                    <ShareChip label="WhatsApp" />
                    <ShareChip label="Telegram" />
                    <ShareChip label="Discord" />
                  </div>
                </div>
              </div>
            </div>

            {/* ===== MINI STATS (preview) ===== */}
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Referral Performance (Preview)
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    This is UI-only. Replace these placeholders with live metrics from your backend/dashboard store.
                  </p>
                </div>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Access Dashboard
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatCard title="Clicks" value="—" helper="Dashboard tracked" />
                <StatCard title="Sign-ups" value="—" helper="Verified registrations" />
                <StatCard title="Linked Wallets" value="—" helper="Ledger-linked referrals" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===================== Local UI helpers ===================== */

function Kpi({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-xs font-semibold text-white/70">{title}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function ShareChip({ label }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
      title={label}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {label}
    </button>
  );
}

function StepRow({ n, title, text, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500">{n}</div>
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, text, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-slate-800">
          {icon}
        </span>
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</div>
    </div>
  );
}

/* ===================== Icons ===================== */

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 01-7 0l-2 2a5 5 0 007 7l1-1" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19a6 6 0 00-12 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11a4 4 0 100-8 4 4 0 000 8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 8v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11h6" />
    </svg>
  );
}

function LedgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6" />
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

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 15v-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-2" />
    </svg>
  );
}
