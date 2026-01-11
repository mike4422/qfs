// src/pages/Terms.jsx
import { Link } from "react-router-dom";

export default function Terms() {
  const updatedAt = "January 11, 2026";

  return (
    <main className="relative">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Gradient + mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(40% 40% at 20% 20%, rgba(255,255,255,.30) 0%, rgba(255,255,255,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-700/25 blur-3xl" />

        <div className="relative container mx-auto px-6 pt-24 pb-16 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Legal
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              Terms of Service
            </h1>

            <p className="mt-4 text-white/90 leading-relaxed">
              These Terms govern your access to Web3LedgerTrust, including wallet linking, migration
              guidance, and yield-related features. By using the platform, you agree to these Terms.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                Last updated: {updatedAt}
              </span>
              <Link
                to="/"
                className="inline-flex items-center rounded-full bg-white/0 px-3 py-1 ring-1 ring-white/20 hover:bg-white/10 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="relative py-14 sm:py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-950" />
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="prose prose-slate max-w-none dark:prose-invert">
                <h2>1. Who We Are</h2>
                <p>
                  Web3LedgerTrust (“Web3LedgerTrust”, “we”, “our”, “us”) provides a Web3-oriented
                  platform designed to help users migrate funds from centralized exchanges to
                  decentralized wallets, link wallets to a ledger-style security layer, and access
                  yield-related features.
                </p>

                <h2>2. Eligibility</h2>
                <p>
                  You must be legally able to enter into these Terms and comply with all applicable
                  laws in your jurisdiction. If you use Web3LedgerTrust on behalf of an entity, you
                  represent that you have authority to bind that entity.
                </p>

                <h2>3. Non-Custodial Access and User Responsibilities</h2>
                <p>
                  You are responsible for your wallets, keys, devices, network security, and all
                  on-chain and off-chain actions taken from your accounts. You must ensure the
                  accuracy of wallet addresses and destination networks (e.g., ERC-20 vs TRC-20)
                  before transferring funds.
                </p>

                <h2>4. Wallet Linking and Ledger Features</h2>
                <p>
                  Web3LedgerTrust may allow you to link a wallet to a ledger profile for monitoring,
                  security signals, permissions, and risk controls. Linked status and visibility may
                  depend on network conditions and third-party infrastructure.
                </p>

                <h2>5. Migration Guidance</h2>
                <p>
                  Web3LedgerTrust may provide steps, checklists, and UI flows for migrating crypto
                  from centralized exchanges to decentralized wallets. You acknowledge that exchanges
                  and networks can impose limits, delays, maintenance windows, or compliance checks
                  outside of our control.
                </p>

                <h2>6. Yield Features and Disclosures</h2>
                <p>
                  Web3LedgerTrust may present yield-related features, estimated returns, and earnings
                  summaries. Any percentage figures (including “10% monthly”) are informational and
                  may vary based on product configuration, market conditions, network behavior, and
                  eligibility. Nothing on Web3LedgerTrust is investment advice.
                </p>
                <ul>
                  <li>Returns are not guaranteed.</li>
                  <li>You are responsible for understanding risk, including smart contract risk and counterparty risk.</li>
                  <li>Availability may vary by region and compliance requirements.</li>
                </ul>

                <h2>7. Fees</h2>
                <p>
                  We may charge fees for certain services or features. Any applicable fees will be
                  presented before you confirm an action, where feasible. You are also responsible
                  for third-party fees such as gas/network fees.
                </p>

                <h2>8. Prohibited Activities</h2>
                <p>You agree not to misuse Web3LedgerTrust, including:</p>
                <ul>
                  <li>Attempting to interfere with platform security or availability.</li>
                  <li>Using the platform for unlawful activity.</li>
                  <li>Fraud, deception, or misrepresentation.</li>
                  <li>Reverse engineering or unauthorized access attempts.</li>
                </ul>

                <h2>9. Third-Party Services and Links</h2>
                <p>
                  Web3LedgerTrust may integrate or link to third-party services (exchanges, wallets,
                  explorers, payment providers, or analytics). We do not control third-party services
                  and are not responsible for their terms, outages, actions, or content.
                </p>

                <h2>10. Service Availability</h2>
                <p>
                  We may modify, suspend, or discontinue parts of the service at any time. We may also
                  apply rate limits, maintenance windows, or access restrictions to protect the platform.
                </p>

                <h2>11. Disclaimers</h2>
                <p>
                  Web3LedgerTrust is provided on an “as is” and “as available” basis. To the maximum
                  extent permitted by law, we disclaim warranties of merchantability, fitness for a
                  particular purpose, and non-infringement. Crypto markets and networks involve risk,
                  including the risk of loss.
                </p>

                <h2>12. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Web3LedgerTrust will not be liable for
                  indirect, incidental, special, consequential, or punitive damages, or any loss of
                  profits, data, goodwill, or business interruption arising from your use of the platform.
                </p>

                <h2>13. Indemnification</h2>
                <p>
                  You agree to indemnify and hold Web3LedgerTrust harmless from claims, liabilities,
                  damages, losses, and expenses arising out of your use of the platform or violation of
                  these Terms.
                </p>

                <h2>14. Termination</h2>
                <p>
                  We may suspend or terminate access if we reasonably believe you violated these Terms,
                  created risk for the platform, or where required for compliance. You may stop using
                  Web3LedgerTrust at any time.
                </p>

                <h2>15. Changes to These Terms</h2>
                <p>
                  We may update these Terms from time to time. We will update the “Last updated” date
                  at the top of this page. Continued use after changes means you accept the updated Terms.
                </p>

                <h2>16. Contact</h2>
                <p>
                  For questions about these Terms, contact support via the Contact page or your usual
                  support channel.
                </p>
              </div>

              {/* Footer CTA */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Need clarification?
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                      Our team can help you understand platform features, migration steps, and account access.
                    </p>
                  </div>

                  <Link
                    to="/#contact"
                    onClick={(e) => {
                      if (location.pathname === "/") {
                        e.preventDefault();
                        const el = document.getElementById("contact");
                        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
                      }
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>

            {/* Small legal note */}
            <p className="mx-auto mt-6 max-w-4xl text-xs text-slate-500 dark:text-slate-400">
              This page is a general template and does not constitute legal advice. Consider reviewing
              with counsel for your jurisdiction and product structure.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
