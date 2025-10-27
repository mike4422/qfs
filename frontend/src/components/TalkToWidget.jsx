import { useEffect } from "react";

export default function TalkToWidget() {
  useEffect(() => {
    const SCRIPT_ID = "tawkto-script";
    const INSTANCE_MARK = "__tawk_injected__";

    const inject = () => {
      if (document.getElementById(SCRIPT_ID)) return;
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
      document.documentElement[INSTANCE_MARK] = true;
    };

    const remove = () => {
      try {
        const s = document.getElementById(SCRIPT_ID);
        if (s) s.remove();
        document
          .querySelectorAll(
            'iframe[src*="tawk.to"], #tawkchat-container, [id^="tawk-"], [id^="tawk_"]'
          )
          .forEach((n) => n.remove());
        delete window.Tawk_API;
        delete window.Tawk_LoadStart;
        delete document.documentElement[INSTANCE_MARK];
      } catch {}
    };

    const shouldShow = () => {
      const token = localStorage.getItem("token");
      const path = window.location.pathname || "/";
      const authed = !!token;
      const isDashboard = path.startsWith("/dashboard");
      // Show only when NOT authenticated AND not on /dashboard
      // Show on any page that is NOT /dashboard*, regardless of auth
return !((window.location.pathname || "/").startsWith("/dashboard"));


    };

    // initial decide
    if (shouldShow()) inject();
    else remove();

    // poll for SPA changes (path or auth changes)
    let lastPath = window.location.pathname;
    let lastToken = localStorage.getItem("token");
    const tick = setInterval(() => {
      const path = window.location.pathname;
      const token = localStorage.getItem("token");

      if (path !== lastPath || token !== lastToken) {
        lastPath = path;
        lastToken = token;
        if (shouldShow()) inject();
        else remove();
      }
    }, 700);

    // cleanup
    return () => {
      clearInterval(tick);
      remove();
    };
  }, []);

  return null;
}
