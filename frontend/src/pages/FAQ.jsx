// src/pages/FAQ.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [query, setQuery] = useState("");

  const faqs = useMemo(
    () => [
      {
        q: "What is Web3LedgerTrust?",
        a: (
          <>
            <strong>Web3LedgerTrust</strong> is a security-first Web3 platform that helps you{" "}
            <strong>move crypto from centralized exchanges (CEXs) to decentralized wallets</strong>, then{" "}
            <strong>link your wallet to our ledger layer</strong> for tracking, integrity signals, and safer visibility—
            without taking custody of your funds.
          </>
        ),
        id: "what-is-web3ledgertrust",
      },
      {
        q: "Do you take custody of my crypto?",
        a: (
          <>
            No. Web3LedgerTrust is designed for <strong>self-custody</strong>. Your assets remain in your wallet.
            We do <strong>not</strong> hold your funds.
          </>
        ),
        id: "custody",
      },
      {
        q: "How does the CEX → wallet migration work?",
        a: (
          <>
            You follow a guided flow to withdraw from your exchange to your decentralized wallet:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Select the asset and <strong>correct network</strong> (chain) before withdrawing.</li>
              <li>Confirm the destination wallet address and perform a <strong>small test send</strong> when applicable.</li>
              <li>Track confirmations and final settlement with clear status updates.</li>
            </ul>
            The goal is simple: <strong>get your crypto out of custodial risk</strong> and into a wallet you control.
          </>
        ),
        id: "migration",
      },
      {
        q: "What does “Link Wallet to Ledger” mean?",
        a: (
          <>
            Linking your wallet creates a <strong>visibility layer</strong> between your wallet and our security ledger.
            This enables:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Real-time tracking</strong> of activity and confirmations</li>
              <li><strong>Integrity & risk signals</strong> (e.g., suspicious patterns, anomalous activity)</li>
              <li><strong>Audit-friendly history</strong> for your own records</li>
            </ul>
            Linking is designed to be <strong>non-custodial</strong> and <strong>privacy-aware</strong>.
          </>
        ),
        id: "ledger-link",
      },
      {
        q: "How does the 10% monthly yield work?",
        a: (
          <>
            Yield is offered through <strong>opt-in</strong> program terms inside Web3LedgerTrust. When enabled, eligible
            balances may be routed through supported yield mechanisms depending on the product configuration.
            <br />
            <br />
            <strong>Important:</strong> yield is not guaranteed. Availability, eligibility, and rates may vary by asset,
            network conditions, and jurisdiction. Always review the product terms and risk disclosures before enabling
            yield.
          </>
        ),
        id: "yield",
      },
      
      {
        q: "What wallets and exchanges are supported?",
        a: (
          <>
            Web3LedgerTrust is built to support common Web3 onboarding patterns across major exchanges and popular
            decentralized wallets. Support may vary by chain and asset.
            <br />
            <br />
            If you can withdraw from your exchange to a self-custody wallet address, you can typically use the guided
            migration flow.
          </>
        ),
        id: "supported",
      },
      {
        q: "Are there any fees to migrate or link my wallet?",
        a: (
          <>
            Standard network fees (gas) may apply depending on the chain and asset. Exchanges may also charge withdrawal
            fees. Web3LedgerTrust focuses on <strong>reducing mistakes</strong> (wrong chain, wrong address) and improving
            visibility—so you can move with confidence.
          </>
        ),
        id: "fees",
      },
      {
        q: "What if I sent funds on the wrong network?",
        a: (
          <>
            Wrong-network transfers can be difficult to recover. Before sending, always confirm:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>The receiving wallet supports the <strong>exact same network</strong> you’re withdrawing on</li>
              <li>The address format matches the chain (and any memo/tag requirements)</li>
              <li>You’ve completed a <strong>small test transfer</strong> when possible</li>
            </ul>
            If a mistake happens, contact the exchange and wallet provider immediately. Do not trust third-party “recovery”
            DMs.
          </>
        ),
        id: "wrong-network",
      },
      {
        q: "Is KYC required?",
        a: (
          <>
            Some features may require identity verification depending on regulations, payout rails, or risk controls.
            Self-custody migration and basic tracking can often be used without KYC, but eligibility can vary by region and
            product terms.
          </>
        ),
        id: "kyc",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        (typeof f.a === "string" ? f.a.toLowerCase().includes(q) : false)
    );
  }, [faqs, query]);

  return (
    <main id="faq" className="relative">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
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

        <div className="relative container mx-auto px-6 pt-24 pb-16 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold ring-1 ring-white/15 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Help Center
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Frequently Asked Questions
            </h1>

            <p className="mt-4 text-white/85">
              Clear answers about self-custody, CEX migrations, wallet-to-ledger linking, and yield onboarding—
              written for real users (not traders).
            </p>

            {/* Search */}
            <div className="mt-6 max-w-xl">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search (e.g., wallet, ledger linking, yield, fees)…"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder-white/60 outline-none ring-0 focus:border-cyan-300/60 focus:bg-white/10"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="7" strokeWidth="1.6" />
                  <path d="M20 20l-3.5-3.5" strokeWidth="1.6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ List ===== */}
      <section className="bg-white py-16 dark:bg-slate-950 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {filtered.map((item, i) => (
              <Accordion key={item.id} {...item} defaultOpen={i === 0} />
            ))}
          </div>

          {/* Small CTA */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            Still need help?{" "}
            <Link
              to="/#contact"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  const el = document.getElementById("contact");
                  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
                }
              }}
              className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300"
            >
              Contact our team
            </Link>{" "}
            for onboarding guidance and security questions.
          </div>
        </div>
      </section>

      {/* ===== JSON-LD for SEO ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toFaqJsonLd(faqs)) }}
      />
    </main>
  );
}

/* ---------- Components ---------- */

function Accordion({ q, a, id, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div id={id} className="group border-b border-slate-200 last:border-b-0 dark:border-slate-800">
      <button
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 dark:hover:bg-slate-800/50"
      >
        <span className="text-base font-semibold text-slate-900 dark:text-white">{q}</span>
        <span
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-slate-300/80 text-slate-600 transition dark:ring-slate-700 dark:text-slate-300",
            open ? "rotate-45 bg-slate-50 dark:bg-slate-800/60" : "bg-white dark:bg-slate-900",
          ].join(" ")}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        className={`overflow-hidden px-5 transition-[max-height] duration-300 ease-out ${
          open ? "max-h-[1000px] py-2" : "max-h-0"
        }`}
      >
        <div className="pb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {a}
          <div className="mt-3">
            <CopyAnchor anchorId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyAnchor({ anchorId }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          const url = `${location.origin}${location.pathname}#${anchorId}`;
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
      title="Copy link to this answer"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M6 12a4 4 0 014-4h2" />
        <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M18 12a4 4 0 01-4 4h-2" />
        <rect x="3" y="8" width="8" height="8" rx="2" />
        <rect x="13" y="8" width="8" height="8" rx="2" />
      </svg>
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

/* ---------- Helpers ---------- */

function toFaqJsonLd(faqs) {
  // Convert React nodes to plain text fallback for JSON-LD
  const strip = (node) =>
    typeof node === "string"
      ? node
      : (node?.props?.children
          ? Array.isArray(node.props.children)
            ? node.props.children.map(strip).join(" ")
            : strip(node.props.children)
          : "")
          .toString()
          .replace(/\s+/g, " ")
          .trim();

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: strip(f.a),
      },
    })),
  };
}
