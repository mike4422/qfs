// src/components/Services.jsx
import { useEffect, useMemo, useRef, useState } from "react";

export default function Services() {
  const items = useMemo(() => ([
    {
      title: "Wallet Sync",
      desc: "Seamless BTC, USDT (TRC20), and ETH connectivity with real-time balances and history.",
      icon: ShieldCheckIcon(),
      details: [
        "One-click wallet linking with encrypted key handling.",
        "Real-time balance polling + webhook push for instant updates.",
        "Transaction timeline with confirmations, fees, and memos.",
      ],
    },
    {
      title: "Secure Transactions",
      desc: "Quantum-grade encryption, multi-sig flows, and anti-tamper integrity checks.",
      icon: LockIcon(),
      details: [
        "Multi-sig approvals with role-based policies.",
        "Integrity checks (hash, nonce, timestamp) for every hop.",
        "Automatic anomaly detection on amounts, velocity, and counterparties.",
      ],
    },
    {
      title: "Project Funding",
      desc: "Cross-border funding with milestone-based releases and transparent settlement.",
      icon: GlobeIcon(),
      details: [
        "Escrow-style vaults tied to milestones.",
        "On-chain proofs attached to each release.",
        "Transparent reporting for backers and auditors.",
      ],
    },
    {
      title: "KYC & Compliance",
      desc: "Role-based access, audit trails, and KYC-aware onboarding for regulated environments.",
      icon: FileCheckIcon(),
      details: [
        "Document verification & liveness checks.",
        "Granular permissions and immutable audit logs.",
        "Sanctions screening with periodic re-checks.",
      ],
    },
    {
      title: "Analytics & Reporting",
      desc: "Live dashboards for volume, velocity, and performance KPIs.",
      icon: ActivityIcon(),
      details: [
        "Cohort and funnel analytics for growth tracking.",
        "Settlement velocity and risk heatmaps.",
        "Export to CSV/PDF with scheduled email reports.",
      ],
    },
    {
      title: "24/7 Support",
      desc: "Priority assistance for mission-critical operations—anytime, anywhere.",
      icon: HeadsetIcon(),
      details: [
        "Follow-the-sun coverage with <30m target response.",
        "Runbooks for critical incidents and SLAs.",
        "Dedicated success managers for enterprise plans.",
      ],
    },
  ]), []);

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
    <section id="services" className="relative py-20">
      {/* Background image (security theme) */}
      <img
        src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1920&auto=format&fit=crop"
        alt="Secure fintech infrastructure"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/75 via-slate-900/65 to-slate-900/60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow / kicker */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-white/10 px-5 py-2 text-sm font-semibold text-blue-100 shadow-sm backdrop-blur">
            NESARA/GESARA
          </span>
        </div>

        {/* Title & subtitle */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Services engineered for trust, speed, and scale
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-200">
            Enterprise-grade capabilities to secure assets, streamline operations, and power global growth.
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-white/10 bg-white/90 p-6 shadow-xl backdrop-blur transition will-change-transform hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>

              <button
                className="mt-5 inline-flex items-center text-sm font-semibold text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
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
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="relative z-[61] w-full sm:max-w-2xl mx-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 sm:p-6 focus:outline-none"
          >
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
                {current.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900">{current.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{current.desc}</p>
              </div>

              <button
                aria-label="Close"
                className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
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
                  <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                  <p className="text-sm leading-relaxed text-slate-700">{line}</p>
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
                      dotIdx === index ? "bg-blue-600" : "bg-slate-300",
                    ].join(" ")}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                  onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Prev
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
