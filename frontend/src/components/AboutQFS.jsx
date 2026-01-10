// src/components/AboutQFS.jsx
import { NavLink } from "react-router-dom";

export default function AboutQFS() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Web3LedgerTrust section background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: Visual */}
          <div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-cyan-500/10 border border-white/12 bg-white/5 backdrop-blur">
              <img
                src="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1600&auto=format&fit=crop"
                alt="Web3 ledger security infrastructure"
                className="h-[420px] w-full object-cover"
                loading="lazy"
              />
              {/* Corner badge */}
              <div className="absolute top-4 left-4 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white border border-white/12 backdrop-blur">
                Web3LedgerTrust • Non-custodial
              </div>

              {/* Bottom overlay card (UI only) */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-2xl border border-white/12 bg-slate-950/55 px-4 py-3 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/70">Ledger link status</div>
                      <div className="text-sm font-semibold text-white">Verified • Monitoring enabled</div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Secure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/90 shadow-sm backdrop-blur">
              About Web3LedgerTrust
              <span className="h-1 w-1 rounded-full bg-cyan-300" />
              Security • Ownership • Yield
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              A safer way to hold crypto—off exchanges.
            </h2>

            <p className="mt-4 text-white/75 leading-relaxed">
              <strong className="text-white">Web3LedgerTrust</strong> helps you move funds from centralized exchanges into a
              decentralized wallet (Trust Wallet, MetaMask, and more), then{" "}
              <strong className="text-white">link your wallet to our Web3 ledger layer</strong> for verified tracking and
              continuous monitoring—without surrendering custody.
            </p>

            <p className="mt-4 text-white/75 leading-relaxed">
              Once linked, you get a clean ledger view of holdings and activity plus a clear path to{" "}
              <strong className="text-white">earn 10% monthly yield</strong> on eligible wallet funds—presented with
              professional transparency and investor-grade reporting.
            </p>

            {/* Pillars */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Feature
                title="Non-custodial by design"
                desc="You control your wallet. We provide the ledger link, visibility, and verification layer."
              />
              <Feature
                title="CEX risk reduction"
                desc="A UI built around safe withdrawals, network checks, and clarity before you send."
              />
              <Feature
                title="Ledger-verified tracking"
                desc="Clean balance snapshots and activity views designed to improve confidence and oversight."
              />
              <Feature
                title="10% monthly yield"
                desc="Simple yield presentation with clear projections and performance summaries (UI-ready)."
              />
            </div>

            {/* micro stats / credibility line */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <Chip>Wallet Connect ready</Chip>
              <Chip>On-chain visibility</Chip>
              <Chip>Referral rewards</Chip>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <NavLink
                to="/about"
                className="group inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90 shadow-lg shadow-cyan-500/10 transition"
              >
                Learn more about Web3LedgerTrust
                <svg
                  viewBox="0 0 24 24"
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </NavLink>

              <a
                href="/register"
                className="inline-flex items-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white border border-white/15 hover:bg-white/15 backdrop-blur transition"
              >
                Start Migration
              </a>
            </div>

            {/* Tiny disclaimer line (UI only) */}
            <div className="mt-4 text-xs text-white/55">
              *Non-custodial linking: Web3LedgerTrust does not take ownership of your wallet funds.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Small helpers for tidy JSX (unchanged functionality) --- */
function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/5 p-5 shadow-sm shadow-cyan-500/5 backdrop-blur">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/12 text-cyan-200">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-white/70">{desc}</div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 backdrop-blur">
      {children}
    </span>
  );
}
