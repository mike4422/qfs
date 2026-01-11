// src/pages/Privacy.jsx
import { Link } from "react-router-dom";

export default function Privacy() {
  const updatedAt = "January 11, 2026";

  return (
    <main className="relative">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(40% 40% at 20% 20%, rgba(255,255,255,.30) 0%, rgba(255,255,255,0) 60%), radial-gradient(35% 35% at 80% 30%, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-700/25 blur-3xl" />

        <div className="relative container mx-auto px-6 pt-24 pb-16 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Legal
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              Privacy Policy
            </h1>

            <p className="mt-4 text-white/90 leading-relaxed">
              This Privacy Policy explains how Web3LedgerTrust collects, uses, and protects information
              when you use our platform, including migration guidance, wallet linking, and yield-related
              experiences.
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
                <h2>1. Scope</h2>
                <p>
                  This Policy applies to Web3LedgerTrust websites, apps, dashboards, and support channels
                  that reference this Policy (collectively, the “Services”).
                </p>

                <h2>2. Information We Collect</h2>
                <p>We may collect the following categories of information:</p>
                <ul>
                  <li>
                    <strong>Account information:</strong> name, username, email address, country, phone
                    number, and login metadata.
                  </li>
                  <li>
                    <strong>Support communications:</strong> messages you send to support, including
                    attachments you provide.
                  </li>
                  <li>
                    <strong>Usage and device data:</strong> pages viewed, features used, approximate
                    location derived from IP, browser type, device identifiers, and diagnostic logs.
                  </li>
                  <li>
                    <strong>Wallet-related identifiers you provide:</strong> public wallet addresses,
                    chain/network selections, and linking status indicators used to power ledger-style
                    security views and feature eligibility.
                  </li>
                </ul>

                <h2>3. How We Use Information</h2>
                <p>We use collected information to:</p>
                <ul>
                  <li>Provide and operate the Services (account access, dashboards, and support).</li>
                  <li>Enable wallet linking, security telemetry, and user-facing status updates.</li>
                  <li>Improve UX and performance (analytics, bug fixes, feature optimization).</li>
                  <li>Detect abuse, prevent fraud, and protect platform integrity.</li>
                  <li>Communicate important notices (security updates, service changes, policy updates).</li>
                </ul>

                <h2>4. Legal Bases</h2>
                <p>
                  Where required, we process information based on legitimate interests, contract necessity
                  (to provide the Services), consent (where requested), and compliance with legal obligations.
                </p>

                <h2>5. Sharing and Disclosure</h2>
                <p>
                  We may share information with trusted service providers who process data on our behalf
                  (e.g., hosting, analytics, customer support tooling, email delivery), subject to contractual
                  safeguards. We may also disclose information:
                </p>
                <ul>
                  <li>To comply with lawful requests and legal obligations.</li>
                  <li>To protect rights, safety, and platform security.</li>
                  <li>In connection with a business transaction (e.g., merger, acquisition) subject to protections.</li>
                </ul>

                <h2>6. Cookies and Analytics</h2>
                <p>
                  We may use cookies and similar technologies to keep you signed in, remember preferences,
                  and understand usage patterns to improve the Services. You can control cookies through
                  your browser settings.
                </p>

                <h2>7. Data Retention</h2>
                <p>
                  We retain information for as long as necessary to provide the Services, comply with legal
                  obligations, resolve disputes, enforce agreements, and maintain security. Retention periods
                  may vary by data type and legal requirements.
                </p>

                <h2>8. Security</h2>
                <p>
                  We implement administrative, technical, and organizational safeguards designed to protect
                  information against unauthorized access, loss, misuse, or alteration. No system is perfectly
                  secure, and you are responsible for protecting your account credentials and device security.
                </p>

                <h2>9. International Transfers</h2>
                <p>
                  Your information may be processed in countries other than your own. Where applicable, we use
                  safeguards designed to protect information during cross-border transfers.
                </p>

                <h2>10. Your Rights</h2>
                <p>
                  Depending on your location, you may have rights to access, correct, delete, or restrict
                  certain processing of your personal data, and to obtain a copy of the data you provided.
                  You may also object to certain processing or withdraw consent where processing is based
                  on consent.
                </p>

                <h2>11. Children’s Privacy</h2>
                <p>
                  The Services are not intended for children. If you believe a child has provided personal data,
                  contact us so we can take appropriate steps.
                </p>

                <h2>12. Changes to This Policy</h2>
                <p>
                  We may update this Policy from time to time. We will update the “Last updated” date on this page.
                  Continued use after changes means you accept the updated Policy.
                </p>

                <h2>13. Contact</h2>
                <p>
                  Questions or requests regarding privacy can be submitted through the Contact page or your
                  usual support channel.
                </p>
              </div>

              {/* Footer CTA */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Privacy request or question?
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                      Contact our team for data access, correction, or deletion requests where applicable.
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

            <p className="mx-auto mt-6 max-w-4xl text-xs text-slate-500 dark:text-slate-400">
              This page is a general template and does not constitute legal advice. Consider reviewing with
              counsel for your jurisdiction and product structure.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
