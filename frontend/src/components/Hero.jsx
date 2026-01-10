// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1920&auto=format&fit=crop"
        alt="Web3 ledger security background"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      {/* Premium Web3 overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/85" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.14),transparent_55%)]" />

      {/* Subtle grid + glow accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-10 -z-10 h-[480px] w-[480px] rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: copy + CTAs */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 shadow-sm backdrop-blur">
              Web3LedgerTrust
              <span className="h-1 w-1 rounded-full bg-cyan-300" />
              Non-custodial Ledger Linking
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Reclaim your crypto:{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                ditch CEX risk
              </span>
              , own it all.
            </h1>

            <p className="mt-4 max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-white/80">
              Move funds from centralized exchanges to your decentralized wallet, then link it to a secure Web3 ledger layer.
              Track balances, verify ownership, and earn{" "}
              <span className="font-semibold text-white">10% monthly yield</span>{" "}
              on eligible wallet funds.
            </p>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3">
              <a
                href="/register"
                className="group inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-white/90 shadow-lg shadow-cyan-500/10"
              >
                Start Migration Now
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/5 group-hover:bg-slate-900/10">
                  →
                </span>
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 shadow border border-white/15 backdrop-blur"
              >
                Link Wallet (Login)
              </a>
            </div>

            {/* Micro trust line */}
            <div className="mt-6 flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Non-custodial: you keep control
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Wallet-verified ledger records
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-300" />
                Exchange exposure reduced
              </span>
            </div>

            {/* Web3 stats / quick proof */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center shadow-sm backdrop-blur">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-xs text-white/70">Wallets Linked</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center shadow-sm backdrop-blur">
                <div className="text-2xl font-bold text-white">10%</div>
                <div className="text-xs text-white/70">Monthly Yield</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center shadow-sm backdrop-blur">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/70">Ledger Monitoring</div>
              </div>
            </div>
          </div>

          {/* Right: Web3 visual (dashboard + cards) */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glass frame */}
              <div className="rounded-3xl border border-white/15 bg-white/5 p-2 shadow-2xl shadow-cyan-500/10 backdrop-blur">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?q=80&w=1600&auto=format&fit=crop"
                    alt="Web3 ledger dashboard preview"
                    loading="lazy"
                    className="h-[420px] w-full object-cover"
                  />
                  {/* Overlay vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />

                  {/* Floating mini UI inside the frame */}
                  <div className="absolute left-4 top-4 right-4 hidden sm:block">
                    <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-slate-950/55 px-4 py-3 backdrop-blur">
                      <div>
                        <div className="text-xs text-white/70">Ledger status</div>
                        <div className="text-sm font-semibold text-white">Linked • Protected</div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accent floating badges (Web3 cards) */}
              <div className="absolute -bottom-6 -left-6 hidden sm:block">
                <div className="rounded-2xl border border-white/15 bg-white/5 shadow-lg px-4 py-3 backdrop-blur">
                  <div className="text-xs text-white/70">Estimated monthly yield</div>
                  <div className="text-lg font-bold text-white">+10% on eligible funds</div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 hidden sm:block">
                <div className="rounded-2xl border border-white/15 bg-white/5 shadow-lg px-4 py-3 backdrop-blur">
                  <div className="text-xs text-white/70">Wallet type</div>
                  <div className="text-lg font-bold text-white">Trust Wallet • MetaMask</div>
                </div>
              </div>

              {/* Small “steps” card for clarity (mobile-visible) */}
              <div className="mt-6 sm:hidden">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                  <div className="text-sm font-semibold text-white">3-step setup</div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-white/70">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">Move</div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">Link</div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">Earn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-foot notes under hero (Web3 aligned) */}
        <div className="mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-xs text-white/70">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Non-custodial wallet linking
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Balance tracking (ETH / USDT / BTC*)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-300" />
            Secure ledger records & alerts
          </span>
        </div>
      </div>
    </section>
  );
}
