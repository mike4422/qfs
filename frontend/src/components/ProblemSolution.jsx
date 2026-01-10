// src/components/ProblemSolution.jsx
export default function ProblemSolution() {
  const left = [
    {
      title: "Exchange freezes",
      desc: "Withdrawals can be paused during “maintenance”, volatility, or policy changes—your funds are not fully under your control.",
      icon: WarningIcon(),
    },
    {
      title: "Hacks & breaches",
      desc: "Centralized platforms are high-value targets. A single breach can impact millions of users at once.",
      icon: ShieldSlashIcon(),
    },
    {
      title: "Custody loss",
      desc: "If you don’t control the keys, you don’t control the assets. Account restrictions can become asset restrictions.",
      icon: KeyOffIcon(),
    },
  ];

  const right = [
    {
      title: "Full wallet control",
      desc: "Move to a decentralized wallet (Trust Wallet or others) and keep custody under your own keys.",
      icon: WalletIcon(),
    },
    {
      title: "Ledger linking layer",
      desc: "Link your wallet to the Web3LedgerTrust ledger for verification, security signals, and activity transparency.",
      icon: LinkShieldIcon(),
    },
    {
      title: "Real-time tracking",
      desc: "Monitor balances and transfers with clear visibility and a security-first workflow.",
      icon: PulseIcon(),
    },
  ];

  return (
    <section id="problem-solution" className="relative overflow-hidden py-20">
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: .7; }
          50% { transform: translateY(-12px) translateX(6px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: .7; }
        }
      `}</style>

      {/* Web3 background */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.12),transparent_60%)]" />
      <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-cyan-400/18 blur-3xl animate-[floaty_10s_ease-in-out_infinite]" />
      <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-emerald-400/14 blur-3xl animate-[floaty_12s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-white/85 shadow-sm backdrop-blur">
            Problem → Solution
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            CEX risks vs self-custody
          </span>
        </div>

        {/* Heading */}
        <div className="mt-5 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            CEX Risks: hacks, freezes, custody loss.
            <span className="block mt-2 text-white/70 text-base sm:text-lg font-semibold">
              Our Fix: full control, real-time tracking, ironclad security workflows.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/70">
            Web3LedgerTrust is built for the transition: move assets to a decentralized wallet, then link to our ledger
            layer for visibility and safer account operations.
          </p>
        </div>

        {/* Split cards */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Left: Risks */}
          <div className="rounded-3xl border border-white/12 bg-white/5 p-6 sm:p-8 backdrop-blur shadow-2xl shadow-red-500/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">Centralized Exchange (CEX)</div>
                <div className="mt-1 text-2xl font-extrabold text-white">
                  What can go wrong
                </div>
              </div>

              <div className="inline-flex items-center rounded-2xl border border-red-300/20 bg-red-300/10 px-3 py-1.5 text-xs font-semibold text-red-100">
                High risk surface
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {left.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-white/10 bg-slate-950/30 p-4 transition hover:bg-slate-950/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-300/10 ring-1 ring-red-300/20 text-red-100">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="mt-1 text-sm text-white/65">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-xs text-white/50">
              Tip: Always verify networks (ERC20/TRC20/BEP20), withdraw limits, and operational status before moving funds.
            </div>
          </div>

          {/* Right: Fix */}
          <div className="rounded-3xl border border-white/12 bg-white/5 p-6 sm:p-8 backdrop-blur shadow-2xl shadow-cyan-500/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">Web3LedgerTrust</div>
                <div className="mt-1 text-2xl font-extrabold text-white">
                  How we reduce risk
                </div>
              </div>

              <div className="inline-flex items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                Self-custody first
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {right.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-white/10 bg-slate-950/30 p-4 transition hover:bg-slate-950/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 ring-1 ring-cyan-300/20 text-cyan-100">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="mt-1 text-sm text-white/65">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs (no new functionality; just UI links) */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 hover:bg-white/90 transition"
              >
                Start Migration
                <svg
                  viewBox="0 0 24 24"
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>

              <a
                href="#partners"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("partners");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.07] transition backdrop-blur"
              >
                View supported wallets
              </a>
            </div>

            <div className="mt-4 text-xs text-white/50">
              Security note: We will never ask for seed phrases or private keys.
            </div>
          </div>
        </div>

        {/* Bottom micro stats bar */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <MiniStat label="Safer by design" value="Self-custody first" />
          <MiniStat label="Visibility layer" value="Ledger-link tracking" />
          <MiniStat label="Yield focus" value="10% monthly (eligible)" />
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/5 p-4 text-center backdrop-blur">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

/* ---------- Icons (inline, no deps) ---------- */
function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  );
}
function ShieldSlashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16" />
    </svg>
  );
}
function KeyOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a4 4 0 1 0-7.9 1.2M10 12l2 2m2-2l-2 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l-4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7a3 3 0 0 1 3-3h12a1 1 0 0 1 1 1v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10a3 3 0 0 0 3 3h13a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 13h2" />
    </svg>
  );
}
function LinkShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a3 3 0 0 1 0-4l1-1a3 3 0 0 1 4 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a3 3 0 0 1 0 4l-1 1a3 3 0 0 1-4 0" />
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
