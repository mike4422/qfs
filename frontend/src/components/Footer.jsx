// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  // Smooth scroll to any section on the same page
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80, // adjust for navbar height if sticky
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="relative mt-24 text-white/75 scroll-smooth">
      {/* Web3LedgerTrust gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.12),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.35) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.25) 0%, transparent 45%)",
        }}
      />

      <div className="relative container mx-auto px-6 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* --- Brand Info --- */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            {/* <div className="h-10 w-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-white font-extrabold shadow-sm backdrop-blur">
              W3
            </div> */}

            {/* keep same image path so nothing breaks; swap later when you add the new logo file */}
            <Link to="/" className="flex items-center">
              <img
                src="/qfs-logo.png"
                alt="Web3LedgerTrust Logo"
                className="w-25 h-25"
              />
            </Link>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">
            Web3LedgerTrust helps you move crypto off centralized exchanges, link your wallet to a verification ledger,
            and manage your assets with a modern self-custody experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 backdrop-blur">
              Non-custodial
            </span>
            <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 backdrop-blur">
              Wallet-first
            </span>
            <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 backdrop-blur">
              Security-ledger link
            </span>
          </div>
        </div>

        {/* --- Platform Links (Web3) --- */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Platform
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-cyan-200 transition-colors">
                About Web3LedgerTrust
              </Link>
            </li>

            {/* Web3-specific links you asked for (routes can be wired later) */}
            <li>
              <Link to="/wallet-link" className="hover:text-cyan-200 transition-colors">
                Link Wallet
              </Link>
            </li>
            <li>
              <Link to="/migration" className="hover:text-cyan-200 transition-colors">
                CEX → Wallet Migration
              </Link>
            </li>
            <li>
              <Link to="/yield" className="hover:text-cyan-200 transition-colors">
                Yield Dashboard
              </Link>
            </li>
            <li>
              <Link to="/referrals" className="hover:text-cyan-200 transition-colors">
                Referrals & Earnings
              </Link>
            </li>

            {/* Keep existing section scroll */}
            <li>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                }}
                className="hover:text-cyan-200 transition-colors cursor-pointer"
              >
                Features
              </a>
            </li>
          </ul>
        </div>

        {/* --- Learn / Resources --- */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Learn
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#news"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("news");
                }}
                className="hover:text-cyan-200 transition-colors cursor-pointer"
              >
                Web3 Updates
              </a>
            </li>

            <li>
              <a
                href="#partners"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("partners");
                }}
                className="hover:text-cyan-200 transition-colors cursor-pointer"
              >
                Wallet & Exchange Partners
              </a>
            </li>

            <li>
              <Link to="/faq" className="hover:text-cyan-200 transition-colors">
                FAQ
              </Link>
            </li>

            {/* Web3-specific additions */}
            <li>
              <Link to="/security" className="hover:text-cyan-200 transition-colors">
                Security Center
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-cyan-200 transition-colors">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-cyan-200 transition-colors">
                Privacy
              </Link>
            </li>

            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="hover:text-cyan-200 transition-colors cursor-pointer"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* --- Newsletter (Footer CTA) --- */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Get product updates
          </h4>

          <p className="text-sm text-white/70 mb-4">
            Weekly tips on safer self-custody, migration checklists, and ledger-link updates.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/50 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/25 outline-none transition backdrop-blur"
              placeholder="Your email"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 hover:bg-white/90 transition"
            >
              Subscribe
            </button>
          </form>

          <p className="text-xs text-white/50 mt-3">
            Security note: We never request seed phrases or private keys.
          </p>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Web3LedgerTrust. All rights reserved.
      </div>
    </footer>
  );
}
