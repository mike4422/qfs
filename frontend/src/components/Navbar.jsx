// src/components/Navbar.jsx
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Always scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "text-white bg-white/10 border border-white/15"
        : "text-white/80 hover:text-white hover:bg-white/5"
    }`;

  // Helper: go to home then smooth-scroll to a section id (e.g., services)
  const goToHomeAndScroll = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      // give the home page a tick to mount, then scroll
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      {/* ✅ Removed left/right padding so links fit better */}
      <div className="mx-auto max-w-full px-3 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center">
          <img
            src="/qfs-logo-b.png"
            alt="Web3LedgerTrust Logo"
            className="w-25 h-25 object-contain"
          />
          {/* <div className="leading-tight">
            <div className="text-sm sm:text-base font-extrabold tracking-tight text-white">
              Web3LedgerTrust
            </div>
            <div className="text-[11px] text-white/60 hidden sm:block">
              Non-custodial • 10% monthly yield
            </div>
          </div> */}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkCls}>
            Home
          </NavLink>

          {/* Web3LedgerTrust core nav (scroll sections on Home) */}
          <button
            onClick={() => goToHomeAndScroll("how-it-works")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            How it Works
          </button>

          <button
            onClick={() => goToHomeAndScroll("migration")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            Migration
          </button>

          <button
            onClick={() => goToHomeAndScroll("ledger-link")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            Ledger Link
          </button>

          <button
            onClick={() => goToHomeAndScroll("yield")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            10% Yield
          </button>

          <button
            onClick={() => goToHomeAndScroll("referrals")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            Referrals
          </button>

          {/* Keep existing routes */}
          <NavLink to="/about" className={linkCls}>
            About
          </NavLink>
          <NavLink to="/faq" className={linkCls}>
            FAQ
          </NavLink>

          {/* Get in touch scrolls on Home */}
          <button
            onClick={() => goToHomeAndScroll("contact")}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            Contact
          </button>

          <NavLink to="/login" className={linkCls}>
            Log in
          </NavLink>
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="hidden sm:inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-950 bg-white hover:bg-white/90 shadow-lg shadow-cyan-500/10 transition"
          >
            Start Migration
          </Link>

          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="text-lg leading-none">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/80 backdrop-blur">
          <div className="px-4 py-4 flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={linkCls}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>

            <button
              onClick={() => {
                goToHomeAndScroll("how-it-works");
                setOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition w-full"
            >
              How it Works
            </button>

            <button
              onClick={() => {
                goToHomeAndScroll("migration");
                setOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition w-full"
            >
              Migration
            </button>

            <button
              onClick={() => {
                goToHomeAndScroll("ledger-link");
                setOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition w-full"
            >
              Ledger Link
            </button>

            <button
              onClick={() => {
                goToHomeAndScroll("yield");
                setOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition w-full"
            >
              10% Yield
            </button>

            <button
              onClick={() => {
                goToHomeAndScroll("referrals");
                setOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition w-full"
            >
              Referrals
            </button>

            <NavLink
              to="/about"
              className={linkCls}
              onClick={() => setOpen(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/faq"
              className={linkCls}
              onClick={() => setOpen(false)}
            >
              FAQ
            </NavLink>

            <button
              onClick={() => {
                goToHomeAndScroll("contact");
                setOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition w-full"
            >
              Contact
            </button>

            <NavLink
              to="/login"
              className={linkCls}
              onClick={() => setOpen(false)}
            >
              Log in
            </NavLink>

            <Link
              to="/register"
              className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-950 bg-white hover:bg-white/90 text-center transition"
              onClick={() => setOpen(false)}
            >
              Start Migration
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
