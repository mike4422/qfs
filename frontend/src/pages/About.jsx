// src/pages/About.jsx
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="relative">
      {/* ====== HERO ====== */}
      <section id="about" className="relative overflow-hidden">
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

        <div className="relative container mx-auto px-6 pt-24 pb-20 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold ring-1 ring-white/15 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Web3LedgerTrust
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              About Web3LedgerTrust
            </h1>

            <p className="mt-4 text-white/85 leading-relaxed">
              We help you exit centralized custody, move assets to decentralized wallets, and link your wallet to a
              security ledger for real-time visibility—without handing over control.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Badge>Non-custodial by design</Badge>
              <Badge>CEX → Wallet migration</Badge>
              <Badge>Ledger linking & tracking</Badge>
              <Badge>Target 10% monthly yield*</Badge>
            </div>

            <p className="mt-3 text-xs text-white/55">
              *Yield depends on product terms and eligibility. Never share seed phrases or private keys.
            </p>
          </div>
        </div>
      </section>

      {/* ====== WHO WE ARE ====== */}
      <section id="who-we-are" className="bg-white dark:bg-slate-950 py-16 sm:py-20">
        <div className="container mx-auto px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Who We Are
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              Web3LedgerTrust is a security-first Web3 platform focused on self-custody onboarding, wallet-to-ledger
              visibility, and safer rails for everyday crypto users. We make the path from exchanges to decentralized
              ownership clear, guided, and verifiable.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat kpi="10K+" label="Users secured" />
              <Stat kpi="24/7" label="Monitoring" />
              <Stat kpi="99.9%" label="Uptime targets" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">What We Do</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Dot /> Guided CEX-to-wallet transfers with network & address checks.
                </li>
                <li className="flex items-start gap-3">
                  <Dot /> Wallet linking to our ledger layer for real-time tracking and alerts.
                </li>
                <li className="flex items-start gap-3">
                  <Dot /> Risk-aware UX (safe defaults, confirmations, and visibility-first flows).
                </li>
                <li className="flex items-start gap-3">
                  <Dot /> Yield onboarding experiences designed for clarity and trust.
                </li>
                <li className="flex items-start gap-3">
                  <Dot /> Education that prevents common Web3 mistakes (phishing, wrong chain, fake dApps).
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag>Seed phrase Recovery</Tag>
                <Tag>Security-first UX</Tag>
                <Tag>Transparent tracking</Tag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== MISSION / VISION ====== */}
      <section id="mission" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950" />
        <div className="container mx-auto px-6 grid gap-8 lg:grid-cols-2">
          <Panel
            title="Our Mission"
            text="Make self-custody the default—help users reclaim ownership, reduce exchange risk, and gain real-time visibility through a secure ledger linking layer."
            points={[
              "Reduce custody risk and platform lockouts",
              "Improve transfer safety with guided checks",
              "Provide tracking and alerts without taking control",
            ]}
          />
          <Panel
            title="Our Vision"
            text="A Web3 experience where ownership is simple, security is built-in, and users can confidently grow and manage crypto without hidden custody tradeoffs."
            points={[
              "Clear self-custody onboarding for everyone",
              "Accountable, trackable transaction visibility",
              "Trustworthy yield experiences with transparent UX",
            ]}
          />
        </div>
      </section>

      {/* ====== PILLARS ====== */}
      <section id="pillars" className="bg-white dark:bg-slate-950 py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Core Pillars
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Self-Custody First">
              Your wallet stays yours. We focus on guided flows and visibility—never custody, never seed phrases.
            </Card>
            <Card title="Security Ledger Linking">
              Link wallets to our ledger layer for tracking, monitoring, and integrity signals without giving up control.
            </Card>
            <Card title="Clarity Over Hype">
              Short, direct steps, safe confirmations, and readable details—because one wrong chain can cost everything.
            </Card>
            <Card title="Professional Web3 UX">
              Mobile-first design, clean dashboards, and security messaging users actually understand.
            </Card>
          </div>
        </div>
      </section>

      {/* ====== TIMELINE ====== */}
      <section id="timeline" className="relative py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Our Journey
          </h2>
          <ol className="mt-8 relative border-l border-slate-200 pl-6 dark:border-slate-800">
            {[
              {
                year: "2022",
                title: "Foundation",
                text: "Built early onboarding flows focused on avoiding wrong-chain sends, fake dApps, and custody confusion.",
              },
              {
                year: "2023",
                title: "Ledger Linking",
                text: "Introduced wallet-to-ledger linking concepts for visibility and tracking without custody.",
              },
              {
                year: "2024",
                title: "Security-First UX",
                text: "Added safety checks, confirmations, and clean transaction visibility patterns for everyday users.",
              },
              {
                year: "2025",
                title: "Web3LedgerTrust",
                text: "Launched a modern platform that simplifies CEX-to-wallet migration, ledger linking, and yield onboarding.",
              },
            ].map((t, idx) => (
              <li key={idx} className="mb-8 ml-2">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-cyan-600 ring-4 ring-cyan-600/20" />
                <time className="text-xs font-semibold tracking-wide text-cyan-700 dark:text-cyan-400">
                  {t.year}
                </time>
                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{t.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====== TRUST / BADGES ====== */}
      <section id="trust" className="bg-white dark:bg-slate-950 py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <TrustCard
              title="Non-Custodial Approach"
              text="We design for ownership: your wallet remains under your control. We focus on guidance, tracking, and safer UX."
            />
            <TrustCard
              title="Risk-Aware Design"
              text="Clear network labeling, confirmation steps, and visibility patterns that reduce common user errors."
            />
            <TrustCard
              title="Transparent Visibility"
              text="Ledger linking enables monitoring and tracking signals so you can verify what’s happening at a glance."
            />
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section id="cta" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(40% 40% at 20% 20%, rgba(56,189,248,.35) 0%, rgba(56,189,248,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(168,85,247,.28) 0%, rgba(168,85,247,0) 60%)",
          }}
        />
        <div className="relative container mx-auto px-6 py-16 text-white">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Ready to ditch CEX custody and reclaim control?
                </h3>
                <p className="mt-2 text-white/85 text-sm leading-relaxed">
                  Move assets to your decentralized wallet, link to our ledger for visibility, and explore yield with a
                  professional, security-first experience.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-white/90 transition"
                >
                  Start Migration
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/0 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- small presentational components ---------- */

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold ring-1 ring-white/15 backdrop-blur">
      {children}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {children}
    </span>
  );
}

function Dot() {
  return <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-cyan-600" />;
}

function Stat({ kpi, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-2xl font-semibold text-slate-900 dark:text-white">{kpi}</div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function Panel({ title, text, points = [] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p>
      {points.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <Dot /> {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{children}</p>
    </div>
  );
}

function TrustCard({ title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600/10 text-cyan-700 ring-1 ring-cyan-600/20 dark:text-cyan-300">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
              d="M12 3l7.5 4.5v9L12 21 4.5 16.5v-9L12 3z"
            />
          </svg>
        </span>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}
