import { useEffect } from "react";

export default function TalkToWidget() {
  useEffect(() => {
    const SCRIPT_ID = "tawkto-script";
    const HIDE_STYLE_ID = "tawkto-hide-style";

    // --- robust current "route" getter (supports hash and pathname)
    const getPath = () => {
      const hashPath = (window.location.hash || "").replace(/^#/, "");
      if (hashPath.startsWith("/")) return hashPath;
      return window.location.pathname || "/";
    };

    const isDashboardRoute = () => {
      const p = getPath();
      return p === "/dashboard" || p.startsWith("/dashboard/");
    };

    // --- hard hide: remove script + DOM + add a CSS kill-switch as a fallback
    const hideTawk = () => {
      // remove injected script
      const s = document.getElementById(SCRIPT_ID);
      if (s) s.remove();

      // remove any Tawk iframes/containers
      document
        .querySelectorAll(
          'iframe[src*="tawk.to"], #tawkchat-container, [id^="tawk-"], [id^="tawk_"]'
        )
        .forEach((n) => n.remove());

      // kill any remaining renders with CSS (in case Tawk re-attaches)
      if (!document.getElementById(HIDE_STYLE_ID)) {
        const st = document.createElement("style");
        st.id = HIDE_STYLE_ID;
        st.textContent = `
          /* nuke any Tawk nodes if they slip through */
          #tawkchat-container, [id^="tawk-"], [id^="tawk_"], iframe[src*="tawk.to"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
        `;
        document.head.appendChild(st);
      }

      // clear globals so Tawk can re-init later on public pages
      try { delete window.Tawk_API; } catch {}
      try { delete window.Tawk_LoadStart; } catch {}
    };

    // --- show: ensure CSS kill-switch is removed, then inject script once
    const showTawk = () => {
      // remove hide style
      const h = document.getElementById(HIDE_STYLE_ID);
      if (h) h.remove();

      if (document.getElementById(SCRIPT_ID)) return; // already injected

      // init globals
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const s1 = document.createElement("script");
      s1.id = SCRIPT_ID;
      s1.async = true;
      s1.src = "https://embed.tawk.to/68fee2d77190d319491693f9/1j8hqc6v0";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");

      const s0 = document.getElementsByTagName("script")[0];
      s0?.parentNode?.insertBefore(s1, s0);
    };

    const applyRule = () => {
      if (isDashboardRoute()) {
        hideTawk();
      } else {
        showTawk();
      }
    };

    // initial apply
    applyRule();

    // --- react to SPA route changes (history API + hash + popstate)
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    history.pushState = function (...args) {
      const ret = origPush.apply(this, args);
      setTimeout(applyRule, 0);
      return ret;
    };
    history.replaceState = function (...args) {
      const ret = origReplace.apply(this, args);
      setTimeout(applyRule, 0);
      return ret;
    };

    const onPop = () => applyRule();
    const onHash = () => applyRule();
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onHash);

    // as a safety net (some SPA libs bypass history API), poll briefly
    let lastPath = getPath();
    const poll = setInterval(() => {
      const now = getPath();
      if (now !== lastPath) {
        lastPath = now;
        applyRule();
      }
    }, 600);

    // cleanup
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onHash);
      clearInterval(poll);
      // do not forcibly remove on unmount — leave current page state intact
    };
  }, []);

  return null;
}
