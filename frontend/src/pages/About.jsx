// src/pages/About.jsx
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="relative">
      {/* ====== HERO ====== */}
      <section id="about" className="relative overflow-hidden">
        {/* Gradient + mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(40% 40% at 20% 20%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(255,255,255,.25) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-700/30 blur-3xl" />

        <div className="relative container mx-auto px-6 pt-24 pb-20 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Quantum Financial System
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              About QFS Network
            </h1>
            <p className="mt-4 text-white/90 leading-relaxed">
              We’re building transparent, asset-backed digital finance aligned with
              NESARA/GESARA — eliminating monopolies, restoring fairness, and protecting wealth
              as the global system transitions from paper money to sovereign, audited rails.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Badge>ISO 20022 Ready</Badge>
              <Badge>Asset-Backed Currencies</Badge>
              <Badge>Humanitarian Programs</Badge>
              <Badge>Global Interoperability</Badge>
            </div>
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
              QFS Network is a senior full-stack engineering group focused on secure finance,
              compliance-aware integrations, and sovereign data design. We help individuals,
              institutions and communities transition into the Quantum Financial System with
              resilient infrastructure and clean, auditable interfaces.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat kpi="134k+" label="Deployments" />
              <Stat kpi="89" label="Countries" />
              <Stat kpi="99.9%" label="Uptime Targets" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Our Focus</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Dot /> ISO 20022 messaging and reconciliation.
                </li>
                <li className="flex items-start gap-3">
                  <Dot /> Asset-backed value rails & wallet synchronization.
                </li>
                <li className="flex items-start gap-3">
                  <Dot /> Anti-corruption, anti-monopoly system design.
                </li>
                <li className="flex items-start gap-3">
                  <Dot /> Humanitarian program disbursement controls.
                </li>
                <li className="flex items-start gap-3">
                  <Dot /> Education for safe transition & financial sovereignty.
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag>Zero-knowledge mindset</Tag>
                <Tag>Compliant by design</Tag>
                <Tag>Auditable ledgers</Tag>
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
            text="Deliver resilient, fair and transparent financial infrastructure that protects value, removes gatekeepers, and empowers people to thrive in the NESARA/GESARA era."
            points={[
              "Protect wealth against paper-money collapse",
              "Enable global, real-time settlement and messaging",
              "Design out corruption via architecture & policy",
            ]}
          />
          <Panel
            title="Our Vision"
            text="A world where money is honest, value is respected, and prosperity is shared — powered by a sovereign, quantum-secure network with human-first governance."
            points={[
              "Sovereign identity & ownership",
              "Interoperable, asset-backed economies",
              "Uncompromising transparency & accountability",
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
            <Card title="Integrity by Architecture">
              Build systems that make wrongdoing hard and honesty easy through verifiable logs,
              least-privilege access and auditable workflows.
            </Card>
            <Card title="Sovereign Data">
              Users own their data. We design with privacy, portability, and selective disclosure at the core.
            </Card>
            <Card title="Interoperability">
              ISO 20022 semantics, standardized APIs, and predictable contracts across borders and institutions.
            </Card>
            <Card title="Human-First Design">
              Clear UI, safe defaults, and education built-in — because sovereignty requires understanding.
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
                year: "2019",
                title: "Foundations",
                text: "Early R&D into anti-monopoly finance, compliant data models, and humanitarian payout controls.",
              },
              {
                year: "2021",
                title: "ISO 20022",
                text: "First ISO 20022-aligned schemas; integrations with secure messaging and reconciliation pipelines.",
              },
              {
                year: "2023",
                title: "Sovereign Wallet Sync",
                text: "Cross-wallet synchronization, value safety nets, and asset-backed currency research.",
              },
              {
                year: "2025",
                title: "QFS Network",
                text: "Public-facing education, partner integrations, and production-grade dashboards.",
              },
            ].map((t, i) => (
              <li key={i} className="mb-8 ml-2">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-600/20" />
                <time className="text-xs font-medium tracking-wide text-blue-600">{t.year}</time>
                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {t.title}
                </h3>
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
              title="ISO 20022"
              text="Schema-driven messaging with rich semantics for global interoperability, reconciliation and auditability."
            />
            <TrustCard
              title="Security First"
              text="Defense-in-depth, encrypted at rest & in transit, principle of least privilege, and immutable logs."
            />
            <TrustCard
              title="Humanitarian Focus"
              text="Compliance-aware routing and distribution controls to ensure funds reach intended beneficiaries."
            />
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section id="cta" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800" />
        <div className="relative container mx-auto px-6 py-16 text-white">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Transition to QFS with Confidence
                </h3>
                <p className="mt-2 text-white/90 text-sm leading-relaxed">
                  Prepare your assets, sync your wallets, and adopt compliant, transparent rails.
                  We’ll guide your organization through every step.
                </p>
              </div>
              <div className="flex gap-3">
               <a
  href={`https://wa.me/15819427285?text=${encodeURIComponent(
    "Hello QFS Team 👋 I’d like to learn more about QFS / wallet sync / onboarding."
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition"
>
  {/* WhatsApp icon */}
  <svg className="mr-2 h-4 w-4" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M19.1 17.7c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0c-.3-.2-1.4-.5-2.6-1.6-1-1-1.6-2.1-1.8-2.4s0-.5.2-.7c.2-.2.3-.4.5-.6.2-.2.3-.4.4-.6.1-.2 0-.4 0-.6s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.1 3.1 1.3 3.3c.2.2 2.2 3.4 5.4 4.7 3.2 1.3 3.2.9 3.8.9.6 0 1.9-.7 2.2-1.5.3-.8.3-1.4.2-1.5z"/>
    <path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.7 4.5 1.9 6.3L3 29l6.9-1.8C11.7 28.3 13.8 29 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23c-2 0-3.8-.6-5.3-1.7l-.4-.3-4 .9.9-3.9-.3-.4C5.6 19 5 17.1 5 15 5 9.5 9.5 5 15 5s10 4.5 10 10-4.5 11-9 11z"/>
  </svg>
  WhatsApp Us
</a>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/0 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Get Started
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
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
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
  return <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-blue-600" />;
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
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/20">
          {/* icon */}
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3l7.5 4.5v9L12 21 4.5 16.5v-9L12 3z" />
          </svg>
        </span>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}
