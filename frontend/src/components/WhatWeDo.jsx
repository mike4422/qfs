// src/components/WhatWeDo.jsx
export default function WhatWeDo() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* --- Animated Background --- */}
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: .7; }
          50% { transform: translateY(-12px) translateX(6px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: .7; }
        }
        @keyframes gridMove { 0% { transform: translateX(0px); } 100% { transform: translateX(-56px); } }
      `}</style>

      {/* Web3LedgerTrust background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px] animate-[gridMove_18s_linear_infinite]" />

      {/* Soft moving overlay blobs */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl animate-[floaty_10s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-emerald-400/15 blur-3xl animate-[floaty_12s_ease-in-out_infinite]" />

      {/* --- Main Content --- */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-white/90 shadow-sm backdrop-blur">
            WHAT WE DO
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            Web3LedgerTrust
          </span>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          {/* Left: image (premium glass frame) */}
          <div className="order-1">
            <div className="relative rounded-3xl border border-white/12 bg-white/5 shadow-2xl shadow-cyan-500/10 backdrop-blur p-2">
              <img
                src="/qfs2.png"
                alt="Web3 wallet security and ledger linking"
                className="w-full h-[360px] sm:h-[420px] lg:h-[520px] object-cover rounded-2xl"
                loading="lazy"
              />
              {/* Corner badge */}
              <div className="absolute top-4 left-4 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white border border-white/12 backdrop-blur">
                Non-custodial • Wallet-first
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="order-2">
            <h2 className="text-center lg:text-left text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Move off exchanges. Link your wallet. Earn monthly yield.
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75">
              Centralized exchanges can freeze withdrawals, restrict access, or become a single point of failure.
              Web3LedgerTrust is built to help you{" "}
              <strong className="text-white">migrate funds to your decentralized wallet</strong>, then{" "}
              <strong className="text-white">link it to our Web3 ledger layer</strong> for verified monitoring—while providing a
              clear path to <strong className="text-white">10% monthly yield</strong> on eligible balances.
            </p>

            {/* Mini CTA row (UI only; links already exist elsewhere) */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
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

            {/* Feature cards */}
            <div className="mt-8 grid gap-5 sm:gap-6 sm:grid-cols-2">
              <Feature
                title="CEX → Wallet Migration"
                desc="Guided withdrawal UX with network checks, memo/tag warnings, and safer sending steps."
                icon={MigrateIcon()}
              />
              <Feature
                title="Wallet Connect Linking"
                desc="Connect Trust Wallet / MetaMask and establish a ledger link—without surrendering custody."
                icon={LinkIcon()}
              />
              <Feature
                title="Ledger Monitoring"
                desc="Clean balance snapshots and activity views designed to reduce surprises and increase confidence."
                icon={ShieldPulseIcon()}
              />
              <Feature
                title="10% Monthly Yield"
                desc="Professional yield presentation with clear projections and performance-ready reporting layouts."
                icon={YieldIcon()}
              />
            </div>

            <div className="mt-4 text-xs text-white/55">
              *Non-custodial linking: Web3LedgerTrust does not take ownership of your wallet funds.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Reusable feature card (functionality unchanged) --- */
function Feature({ title, desc, icon }) {
  return (
    <div className="group rounded-2xl border border-white/12 bg-white/5 p-5 shadow-sm shadow-cyan-500/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.07] hover:shadow-md hover:shadow-cyan-500/10">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/90 to-emerald-400/80 text-slate-950 shadow-lg shadow-cyan-500/15">
        {icon}
      </div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-white/70">{desc}</div>
    </div>
  );
}

/* --- Inline icons (Web3 oriented) --- */
function MigrateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h11M9 3l6 4-6 4M20 17H9m6 4-6-4 6-4" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </svg>
  );
}
function ShieldPulseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 13h2l1.2-3 2.1 6 1.7-4H17" />
    </svg>
  );
}
function YieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 14l4-4 3 3 6-6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7v6h-6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14" />
    </svg>
  );
}
