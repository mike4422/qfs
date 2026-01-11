// src/components/SocialProof.jsx
import { useEffect, useMemo, useState } from "react";

export default function SocialProof() {
  const items = useMemo(
    () => [
      {
        name: "A. Nwosu",
        role: "Retail Investor",
        quote:
          "Moving off the exchange felt intimidating, but the steps were clear. Linking my wallet to the ledger gives me visibility without giving up custody.",
        rating: 5,
        tag: "Self-custody clarity",
      },
      {
        name: "M. Tan",
        role: "Crypto Trader",
        quote:
          "I like the security-first approach. The workflow helped me verify networks, confirm addresses, and track everything cleanly after transfer.",
        rating: 5,
        tag: "Security workflow",
      },
      {
        name: "S. Ibrahim",
        role: "Founder",
        quote:
          "The ledger-link concept is exactly what we needed—proof and monitoring without handing over keys. The UI feels premium and simple.",
        rating: 5,
        tag: "Visibility layer",
      },
      {
        name: "K. Adeyemi",
        role: "Portfolio Manager",
        quote:
          "Fast onboarding, clean tracking, and a professional experience. This is how Web3 onboarding should feel for everyday users.",
        rating: 5,
        tag: "Professional UX",
      },
    ],
    []
  );

  const [i, setI] = useState(0);

  // Auto-rotate (pause on hover via mouse enter/leave)
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const current = items[i];

  return (
    <section id="social-proof" className="relative overflow-hidden py-20">
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: .7; }
          50% { transform: translateY(-12px) translateX(6px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: .7; }
        }
      `}</style>

      {/* Web3 background */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.12),transparent_60%)]" />
      <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-cyan-400/16 blur-3xl animate-[floaty_10s_ease-in-out_infinite]" />
      <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-fuchsia-400/12 blur-3xl animate-[floaty_12s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-white/85 shadow-sm backdrop-blur">
            Social proof
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            Trusted Web3 onboarding
          </span>
        </div>

        {/* Title */}
        <div className="mt-5 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Trusted by people moving off exchanges every day.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/70">
            Users choose Web3LedgerTrust for a clean migration flow, self-custody clarity, and a security-first ledger
            linking layer.
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard title="10K+ Users Secured" desc="Wallets linked with verification workflows" icon={UsersIcon()} />
          <StatCard title="99.98% Uptime" desc="Reliable access for critical actions" icon={UptimeIcon()} />
          <StatCard title="Real-time Visibility" desc="Track balances & activity on your terms" icon={PulseIcon()} />
        </div>

        {/* Carousel */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr] items-stretch">
          {/* Main testimonial card */}
          <div
            className="relative rounded-3xl border border-white/12 bg-white/5 p-6 sm:p-8 backdrop-blur shadow-2xl shadow-cyan-500/10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/6 ring-1 ring-white/12 flex items-center justify-center text-white">
                  {AvatarIcon()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{current.name}</div>
                  <div className="text-xs text-white/60">{current.role}</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-slate-950/30 px-3 py-1 text-[11px] font-semibold text-white/70">
                {TagIcon()}
                {current.tag}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-1 text-white/90">
                {Array.from({ length: current.rating }).map((_, idx) => (
                  <span key={idx} className="inline-flex">{StarIcon()}</span>
                ))}
              </div>

              <blockquote className="mt-4 text-base sm:text-lg leading-relaxed text-white/85">
                “{current.quote}”
              </blockquote>
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {items.map((_, dot) => (
                  <button
                    key={dot}
                    type="button"
                    aria-label={`Go to testimonial ${dot + 1}`}
                    onClick={() => setI(dot)}
                    className={[
                      "h-2.5 w-2.5 rounded-full transition",
                      dot === i ? "bg-white" : "bg-white/25 hover:bg-white/40",
                    ].join(" ")}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setI((v) => (v - 1 + items.length) % items.length)}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/[0.07] transition"
                >
                  <span className="sr-only">Previous</span>
                  <ArrowLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setI((v) => (v + 1) % items.length)}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90 transition"
                >
                  <span className="sr-only">Next</span>
                  <ArrowRightIcon />
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-white/50">
              Security note: We never request seed phrases or private keys.
            </div>
          </div>

          {/* Side list (click to select) */}
          <div className="rounded-3xl border border-white/12 bg-white/5 p-4 sm:p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">More reviews</div>
              <div className="text-[11px] text-white/60">{paused ? "Paused" : "Auto-rotating"}</div>
            </div>

            <div className="mt-4 space-y-3">
              {items.map((t, idx) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setI(idx)}
                  className={[
                    "w-full text-left rounded-2xl border p-4 transition",
                    idx === i
                      ? "border-white/18 bg-white/[0.08]"
                      : "border-white/10 bg-slate-950/20 hover:bg-slate-950/30",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-white/60">{t.role}</div>
                    </div>
                    <div className="text-[11px] text-white/60">{t.tag}</div>
                  </div>
                  <div className="mt-2 text-sm text-white/70 line-clamp-2">“{t.quote}”</div>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/12 bg-slate-950/25 p-4">
              <div className="text-sm font-semibold text-white">Ready to secure yours?</div>
              <div className="mt-1 text-xs text-white/60">
                Join thousands of users migrating from exchanges to self-custody—then link to our ledger layer.
              </div>
              <a
                href="/register"
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-white/90 transition"
              >
                Start Migration
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, desc, icon }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/5 p-5 text-center backdrop-blur">
      <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 ring-1 ring-white/12 text-white">
        {icon}
      </div>
      <div className="mt-3 text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-white/60">{desc}</div>
    </div>
  );
}

/* ---------- Icons (inline, no deps) ---------- */
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 17.3l-5.4 3 1-6.1-4.4-4.3 6.1-.9L12 3.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function UptimeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-4-7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 3v6h-6" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l2 6 4-12 2 6h6" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
function AvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 1 0-16 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12l-8 8-10-10V2h8l10 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01" />
    </svg>
  );
}
