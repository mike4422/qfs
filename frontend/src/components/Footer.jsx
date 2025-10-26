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
    <footer className="relative mt-24 text-gray-300 scroll-smooth">
      {/* Two-color gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 0%, transparent 40%)",
        }}
      />

      <div className="relative container mx-auto px-6 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* --- Brand Info --- */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/20 flex items-center justify-center text-white font-bold">
              Q
            </div>
                   <Link to="/" className="flex items-center">
  <img
    src="/qfs-logo.png"
    alt="QFS Worldwide Logo"
    className="w-20 h-20 "
  />
  {/* <span className="text-xl font-bold text-blue-700">QFS Worldwide</span> */}
</Link>
          </div>
          <p className="text-sm text-gray-300/90 leading-relaxed">
            The Quantum Financial System (QFS) – restoring fairness,
            transparency, and security to global finance under the NESARA/GESARA
            framework.
          </p>
        </div>

        {/* --- Company Links --- */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="hover:text-blue-400 transition-colors"
              >
                About QFS
              </Link>
            </li>
            <li>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                }}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                Services
              </a>
            </li>
            <li>
            <Link
              to="/faq"
              className="hover:text-blue-400 transition-colors"
            >
              FAQ
            </Link>

            </li>
          </ul>
        </div>

        {/* --- Resources Links --- */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Resources
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#news"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("news");
                }}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                Latest News
              </a>
            </li>
            <li>
              <a
                href="#partners"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("partners");
                }}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                Partners
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* --- Newsletter --- */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Newsletter
          </h4>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 outline-none transition"
              placeholder="Your email"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition"
            >
              Join
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">
            Stay informed about the Global Currency Reset & QFS innovations.
          </p>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} QFS Network — Quantum Financial Sovereignty
        Worldwide. All rights reserved.
      </div>
    </footer>
  );
}
