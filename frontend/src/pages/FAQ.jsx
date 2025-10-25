// src/pages/FAQ.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [query, setQuery] = useState("");

  const faqs = useMemo(
    () => [
      {
        q: "What is Q-F-S WorldwideNetwork?",
        a: (
          <>
            The Q-F-S WorldwideNetwork (QFS) is a <strong>proposed</strong> financial system
            that explores using quantum-grade security, modern cryptography, and distributed
            ledger technology (DLT) to make transactions more transparent, tamper-resistant,
            and efficient. Unlike conventional, centrally intermediated rails, QFS ideas
            emphasize <em>decentralized</em> operations and digital settlement—potentially
            reducing reliance on physical cash and legacy clearing.
            <br /><br />
            While real-world timelines and implementations are not finalized, the vision
            is a more inclusive, auditable, and secure financial ecosystem aligned with
            asset protection and sovereignty.
          </>
        ),
        id: "qfs-definition",
      },
      {
        q: "How does QFS differ from the traditional financial system?",
        a: (
          <>
            QFS concepts differ by:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Favoring <strong>decentralized</strong>, verifiable operations over single points of control.</li>
              <li>Using advanced cryptography and quantum-resilient approaches for <strong>security</strong>.</li>
              <li>Prioritizing <strong>digital settlement</strong> and programmable value flows over paper-based processes.</li>
              <li>Designing for <strong>auditability</strong> and transparent messaging (e.g., ISO 20022 semantics).</li>
            </ul>
          </>
        ),
        id: "qfs-vs-traditional",
      },
      {
        q: "Will QFS eliminate the existence of paper money?",
        a: (
          <>
            Reducing reliance on cash is a common goal in QFS discussions. Whether physical
            currency is entirely eliminated will depend on policy choices, national preferences,
            regulatory adoption, and the pace of real-world rollout. In practice, hybrid
            models often coexist during transitions.
          </>
        ),
        id: "paper-money",
      },
      {
        q: "What is wallet synchronization?",
        a: (
          <>
            <strong>Wallet synchronization</strong> is a secure handshake between your wallet
            and our QFS-aligned infrastructure to register and map your asset identifiers,
            enabling:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Integrity checks and anti-tamper protection</li>
              <li>Recovery & backup options governed by your consent</li>
              <li>Faster settlement/verification across connected services</li>
            </ul>
            You maintain ownership; synchronization enhances security and continuity.
          </>
        ),
        id: "wallet-sync",
      },
      {
        q: "How do QFS cards work?",
        a: (
          <>
            QFS cards (virtual or physical) are designed to act as <strong>secure access
            tokens</strong> to your synchronized wallet and permitted balances. Typical features include:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Tokenized authorization:</strong> the card represents rights to spend/verify, not your seed.</li>
              <li><strong>Multi-factor security:</strong> PIN/biometrics + device risk checks.</li>
              <li><strong>Programmable limits:</strong> per-transaction caps, geofencing, and whitelist rules.</li>
              <li><strong>ISO 20022-aligned messaging:</strong> clear, auditable transaction semantics.</li>
            </ul>
            Cards don’t store private keys; they initiate <em>consented</em> transactions through your synced profile.
          </>
        ),
        id: "qfs-cards",
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(40% 40% at 20% 20%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(255,255,255,.25) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div className="relative container mx-auto px-6 pt-24 pb-16 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Help Center
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-white/90">
              Clear answers about QFS concepts, wallet synchronization, cards, and the
              transition away from legacy systems.
            </p>

            {/* Search */}
            <div className="mt-6 max-w-xl">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search FAQs (e.g., cards, paper money, wallet)…"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-white/70 outline-none ring-0 focus:border-blue-300 focus:bg-white/15"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
                  <path d="M20 20l-3.5-3.5" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ List ===== */}
      <section className="bg-white py-16 dark:bg-slate-950 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white shadow-xl dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {filtered.map((item, i) => (
              <Accordion key={item.id} {...item} defaultOpen={i === 0} />
            ))}
          </div>

          {/* Small CTA */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            Still have questions?{" "}
            <Link
              to="/#contact"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  const el = document.getElementById("contact");
                  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
                }
              }}
              className="font-semibold text-blue-600 hover:underline"
            >
              Contact our team
            </Link>{" "}
            and we’ll respond within one business day.
          </div>
        </div>
      </section>

      {/* ===== JSON-LD for SEO ===== */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toFaqJsonLd(faqs)) }} />
    </main>
  );
}

/* ---------- Components ---------- */

function Accordion({ q, a, id, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div id={id} className="group">
      <button
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring dark:hover:bg-slate-800/50"
      >
        <span className="text-base font-semibold text-slate-900 dark:text-white">{q}</span>
        <span
          className={[
            "inline-flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-slate-300 text-slate-600 transition dark:ring-slate-700 dark:text-slate-300",
            open ? "rotate-45" : "",
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
          {/* Shareable link */}
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
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
      title="Copy link to this answer"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 12a4 4 0 014-4h2" />
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M18 12a4 4 0 01-4 4h-2" />
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
          ? (Array.isArray(node.props.children)
              ? node.props.children.map(strip).join(" ")
              : strip(node.props.children))
          : "")
          .toString()
          .replace(/\s+/g, " ")
          .trim();

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": strip(f.a),
      },
    })),
  };
}
