// src/components/Services.jsx
import { useEffect, useMemo, useRef, useState } from "react";

export default function Services() {
  const items = useMemo(
    () => [
      {
        title: "CEX → Wallet Migration",
        desc: "Move assets from centralized exchanges to a self-custody wallet (Trust Wallet, MetaMask, and more) with a guided, error-resistant flow.",
        icon: GlobeIcon(),
        details: [
          "Step-by-step migration checklist (network selection, memo/tag warnings, address format validation).",
          "Exchange-safe withdrawal guidance to reduce wrong-network losses.",
          "Built-in confirmations and “before you send” safety prompts.",
        ],
      },
      {
        title: "Wallet Connect + Ledger Link",
        desc: "Link your wallet to Web3LedgerTrust for secure ledger verification and monitoring—without giving up custody.",
        icon: ShieldCheckIcon(),
        details: [
          "Non-custodial linking: you keep control of your funds at all times.",
          "Ledger link status + verification badges for added trust and clarity.",
          "Tamper-resistant tracking for balances and on-chain activity.",
        ],
      },
      {
        title: "10% Monthly Yield",
        desc: "Earn a consistent 10% monthly yield on eligible wallet funds, with transparent reporting and clear projections.",
        icon: ActivityIcon(),
        details: [
          "Yield dashboard previews (monthly estimates, history, and performance summaries).",
          "Clear eligibility rules and audit-friendly reporting formats.",
          "Designed for a clean, simple investor experience—no clutter.",
        ],
      },
      {
        title: "Real-Time Wallet Monitoring",
        desc: "Track balances and activity with a live ledger view—built to reduce surprises and increase confidence.",
        icon: LockIcon(),
        details: [
          "Live balance snapshots with a clean transaction timeline view.",
          "Alerts-ready UI patterns (velocity spikes, unusual transfers, large movements).",
          "Network-aware labeling (chains, confirmations, and fee visibility).",
        ],
      },
      {
        title: "Referral Rewards",
        desc: "Invite users, grow your network, and track rewards in a clear, professional referral dashboard.",
        icon: FileCheckIcon(),
        details: [
          "Referral link + share-ready UI with performance stats and payout status.",
          "Tier-ready layout for future upgrades (levels, bonuses, milestones).",
          "Simple, transparent earnings presentation—no confusion.",
        ],
      },
      {
        title: "24/7 Web3 Support",
        desc: "Fast, reliable help for migration, linking, and wallet issues—when it matters most.",
        icon: HeadsetIcon(),
        details: [
          "Priority support UX patterns (tickets, status tracking, guided troubleshooting).",
          "Clear escalation visuals for critical incidents and account safety.",
          "Support designed to feel premium, calm, and trustworthy.",
        ],
      },
    ],
    []
  );

  // Modal state
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null); // last clicked "Learn more"

  // a11y: close on Esc, navigate with arrows
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  // a11y: focus trap-ish
  useEffect(() => {
    if (open && dialogRef.current) {
      const t = setTimeout(() => dialogRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open, index]);

  const current = items[index];

  return (
    <section id="services" className="relative overflow-hidden py-20">
      {/* Background image (Web3 security theme) */}
      <img
        src="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1920&auto=format&fit=crop"
        alt="Web3 ledger security"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* Premium overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/85" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow / kicker */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 shadow-sm backdrop-blur">
            Web3LedgerTrust Toolkit
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            Migration • Ledger Link • Yield
          </span>
        </div>

        {/* Title & subtitle */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Everything you need to go self-custody—safely.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/75">
            Move crypto off exchanges, link your wallet to a secure Web3 ledger layer, and track everything in a clean, investor-grade dashboard.
          </p>

          {/* Optional micro-CTA (UI only; no functionality change) */}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-950 bg-white hover:bg-white/90 shadow-lg shadow-cyan-500/10 transition"
            >
              Start Migration
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur transition"
            >
              Link Wallet (Login)
            </a>
          </div>
        </div>

        {/* Services grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-white/12 bg-white/5 p-6 shadow-xl shadow-cyan-500/5 backdrop-blur transition will-change-transform hover:-translate-y-0.5 hover:bg-white/[0.07]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/90 to-emerald-400/80 text-slate-950 shadow-lg shadow-cyan-500/15">
                {item.icon}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.desc}</p>

              <button
                className="mt-5 inline-flex items-center text-sm font-semibold text-cyan-200 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 rounded-md"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setIndex(i);
                  setOpen(true);
                }}
              >
                Learn more
                <svg
                  viewBox="0 0 24 24"
                  className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* ---------- Modal / Slider ---------- */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="relative z-[61] w-full sm:max-w-2xl mx-auto rounded-2xl border border-white/12 bg-slate-950/75 shadow-2xl shadow-cyan-500/10 p-5 sm:p-6 backdrop-blur focus:outline-none"
          >
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/90 to-emerald-400/80 text-slate-950 shadow-lg shadow-cyan-500/15">
                {current.icon}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{current.title}</h3>
                <p className="mt-1 text-sm text-white/70">{current.desc}</p>
              </div>

              <button
                aria-label="Close"
                className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/5 hover:bg-white/10 text-white transition"
                onClick={() => {
                  setOpen(false);
                  // return focus to the triggering button
                  setTimeout(() => triggerRef.current?.focus(), 0);
                }}
              >
                <span className="sr-only">Close</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            {/* Content (slider-like bullets) */}
            <div className="mt-5 space-y-3">
              {current.details.map((line, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300" />
                  <p className="text-sm leading-relaxed text-white/80">{line}</p>
                </div>
              ))}
            </div>

            {/* Footer: slider controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {items.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={[
                      "h-1.5 w-1.5 rounded-full transition",
                      dotIdx === index ? "bg-cyan-300" : "bg-white/25",
                    ].join(" ")}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                  onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Prev
                </button>

                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90 transition shadow-lg shadow-cyan-500/10"
                  onClick={() => setIndex((i) => (i + 1) % items.length)}
                >
                  Next
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Inline Icon Helpers (unchanged) ---------- */
function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.5l1.8 1.8 3.7-3.7" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3c2.5 3 2.5 15 0 18M6 6c3 2 9 2 12 0M6 18c3-2 9-2 12 0" />
    </svg>
  );
}
function FileCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l2 2 4-4" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l2 6 4-12 2 6h6" />
    </svg>
  );
}
function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a9 9 0 0 0-9 9v2a2 2 0 0 0 2 2h2v-6a7 7 0 1 1 14 0v6h2a2 2 0 0 0 2-2v-2a9 9 0 0 0-9-9z" />
      <rect x="5" y="14" width="3" height="6" rx="1" />
      <rect x="16" y="14" width="3" height="6" rx="1" />
    </svg>
  );
}
