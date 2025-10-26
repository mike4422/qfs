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
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "text-white bg-blue-600" : "text-gray-700 hover:text-blue-600"
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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
       <Link to="/" className="flex items-center space-x-2">
  <img
    src="/qfs-logo-b.png"
    alt="QFS Worldwide Logo"
    className="w-20 h-20 "
  />
  {/* <span className="text-xl font-bold text-blue-700">QFS Worldwide</span> */}
</Link>


        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkCls}>Home</NavLink>
          <NavLink to="/about" className={linkCls}>About</NavLink>

          {/* Services scrolls on the Home page */}
          <button
            onClick={() => goToHomeAndScroll("services")}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Services
          </button>

          {/* ✅ FAQ routes to the FAQ page */}
          <NavLink to="/faq" className={linkCls}>FAQ</NavLink>

           <NavLink to="/login" className={linkCls}>Log in</NavLink>

          {/* If you have a dedicated /contact page, keep this.
              If contact is a section on Home, swap to goToHomeAndScroll("contact"). */}
          <button
            onClick={() => goToHomeAndScroll("contact")}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Get in touch
          </button>

        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow"
          >
            Get Started
          </Link>
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-gray-300"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 flex flex-col gap-2">
            <NavLink to="/" end className={linkCls} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/about" className={linkCls} onClick={() => setOpen(false)}>About</NavLink>

            <button
              onClick={() => {
                goToHomeAndScroll("services");
                setOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-medium text-gray-700 hover:text-blue-600 w-full"
            >
              Services
            </button>

            {/* ✅ Mobile FAQ routes to the FAQ page and closes the drawer */}
            <NavLink to="/faq" className={linkCls} onClick={() => setOpen(false)}>FAQ</NavLink>

             <NavLink to="/login" className={linkCls}>Log in</NavLink>

            {/* Same note as desktop about contact: route or scroll */}
           <button
              onClick={() => {
                goToHomeAndScroll("contact");
                setOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-medium text-gray-700 hover:text-blue-600 w-full"
            >
              Get in touch
            </button>


            <Link
              to="/register"
              className="mt-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 text-center"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
