import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TalkToWidget() {
  const location = useLocation();
  const isAuthed = !!localStorage.getItem("token");
  const isDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    const removeTawk = () => {
      try {
        // remove script
        const s = document.getElementById("tawkto-script");
        if (s) s.remove();
        // remove iframes/containers Tawk adds
        document
          .querySelectorAll(
            'iframe[src*="tawk.to"], #tawkchat-container, [id^="tawk-"], [id^="tawk_"]'
          )
          .forEach((n) => n.remove());
        // clear globals to avoid reusing old instance
        if (window.Tawk_API) delete window.Tawk_API;
        if (window.Tawk_LoadStart) delete window.Tawk_LoadStart;
      } catch {}
    };

    // Hide on any authenticated route OR any /dashboard route
    if (isAuthed || isDashboard) {
      removeTawk();
      return; // do not inject
    }

    // Already injected? do nothing
    if (document.getElementById("tawkto-script")) return;

    // Public pages only → inject
    const s1 = document.createElement("script");
    s1.id = "tawkto-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/68fee2d77190d319491693f9/1j8hqc6v0";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    // init globals (as Tawk recommends)
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s0 = document.getElementsByTagName("script")[0];
    s0?.parentNode?.insertBefore(s1, s0);

    // Cleanup when leaving public routes or unmounting
    return () => removeTawk();
  }, [isAuthed, isDashboard, location.pathname]);

  return null;
}
