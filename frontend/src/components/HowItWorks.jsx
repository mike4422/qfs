// src/components/HowItWorks.jsx
export default function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Connect your CEX",
      desc: "Start from your exchange (Coinbase, Binance, etc.) and prepare a secure withdrawal. No custody transfer to us.",
      bullets: ["Verify network (ERC20/TRC20/BEP20)", "Copy your wallet address", "Set a small test transfer first"],
      icon: ExchangeIcon(),
      badge: "CEX",
    },
    {
      n: "02",
      title: "Transfer to your wallet",
      desc: "Move funds to a decentralized wallet like Trust Wallet, MetaMask, Ledger, or any supported wallet.",
      bullets: ["Confirm address + network match", "Track confirmations on-chain", "Your keys, your assets"],
      icon: WalletIcon(),
      badge: "WALLET",
    },
    {
      n: "03",
      title: "Link to our ledger",
      desc: "Link your wallet to Web3LedgerTrust for verification, activity visibility, and security-first monitoring.",
      bullets: ["Ledger-link verification", "Real-time balance visibility", "Security alerts & audit trail"],
      icon: LinkIcon(),
      badge: "LEDGER",
    },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden py-20">
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: .75; }
          50% { transform: translateY(-12px) translateX(6px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: .75; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-30%); opacity: .0; }
          30% { opacity: .18; }
          100% { transform: translateX(130%); opacity: .0; }
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
            How it works
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            3-step migration flow
          </span>
        </div>

        {/* Title */}
        <div className="mt-5 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Move off CEX custody in minutes.
            <span className="block mt-2 text-white/70 text-base sm:text-lg font-semibold">
              Connect → Transfer → Ledger-Link
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/70">
            A clean workflow to shift your crypto to self-custody, then link to Web3LedgerTrust for verification and
            real-time visibility.
          </p>
        </div>

        {/* 3-step visual */}
        <div className="mt-10">
          {/* Desktop connector line */}
          <div className="relative hidden lg:block">
            <div className="absolute left-0 right-0 top-12 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            <div className="pointer-events-none absolute left-0 right-0 top-12 h-px overflow-hidden">
              <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-[shimmer_4.5s_linear_infinite]" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="group relative rounded-3xl border border-white/12 bg-white/5 p-6 sm:p-7 backdrop-blur shadow-2xl shadow-cyan-500/5 transition hover:bg-white/[0.06]"
              >
                {/* Step header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 ring-1 ring-white/12 text-white shadow-sm">
                      {s.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white/60">Step {s.n}</div>
                      <div className="text-lg font-semibold text-white">{s.title}</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center rounded-2xl border border-white/12 bg-slate-950/30 px-3 py-1 text-[11px] font-semibold text-white/75">
                    {s.badge}
                  </span>
                </div>

                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  {s.desc}
                </p>

                {/* bullets */}
                <div className="mt-5 space-y-2">
                  {s.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-cyan-300/80" />
                      <p className="text-sm text-white/65">{b}</p>
                    </div>
                  ))}
                </div>

                {/* subtle bottom accent */}
                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                {/* micro footer note */}
                <div className="mt-4 text-xs text-white/50">
                  {s.n === "01" && "You initiate withdrawals from your exchange account."}
                  {s.n === "02" && "Assets arrive in your wallet under your custody."}
                  {s.n === "03" && "Ledger linking adds visibility and security signals."}
                </div>

                {/* mobile connector */}
                <div className="lg:hidden pointer-events-none absolute -bottom-3 left-1/2 h-6 w-px bg-gradient-to-b from-white/20 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA row (links only; no new functionality) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/register"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 hover:bg-white/90 transition"
          >
            Start Migration Now
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
            href="/login"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.07] transition backdrop-blur"
          >
            I already have an account
          </a>
        </div>

      </div>
    </section>
  );
}

/* ---------- Icons (inline, no deps) ---------- */
function ExchangeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h12M7 7l3-3M7 7l3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17H5m12 0-3-3m3 3-3 3" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7a3 3 0 0 1 3-3h12a1 1 0 0 1 1 1v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10a3 3 0 0 0 3 3h13a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 13h2" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a3 3 0 0 1 0-4l1-1a3 3 0 0 1 4 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a3 3 0 0 1 0 4l-1 1a3 3 0 0 1-4 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16l-2 2a3 3 0 0 1-4 0 3 3 0 0 1 0-4l2-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2a3 3 0 0 1 4 0 3 3 0 0 1 0 4l-2 2" />
    </svg>
  );
}
