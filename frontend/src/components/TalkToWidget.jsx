import { useEffect } from "react";

export default function TalkToWidget() {
  useEffect(() => {
    // Prevent duplicate injection
    if (document.getElementById("tawkto-script")) return;

    const s1 = document.createElement("script");
    s1.id = "tawkto-script";
    s1.async = true;
    // ✅ Your new Tawk.to link
    s1.src = "https://embed.tawk.to/68fee2d77190d319491693f9/1j8hqc6v0";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    s0.parentNode.insertBefore(s1, s0);

    // 🟢 Ensure Tawk API exists before script loads
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // 🟢 CSS override to lift widget above MobileNavDock on mobile
    const style = document.createElement("style");
    style.id = "tawkto-mobile-offset";
    style.textContent = `
      @media (max-width: 767px){
        iframe[src*="tawk.to"] { bottom: 80px !important; }
        #tawkchat-container { bottom: 80px !important; }
        [id^="tawk-"], [id^="tawk_"] { bottom: 80px !important; }
      }
    `;
    document.head.appendChild(style);

    // 🟢 JS fallback to enforce offset dynamically
    const OFFSET_PX = 80;
    const reposition = () => {
      if (window.innerWidth >= 768) return;
      const frames = Array.from(document.querySelectorAll('iframe[src*="tawk.to"]'));
      frames.forEach((frame) => {
        try {
          frame.style.bottom = OFFSET_PX + "px";
          let p = frame.parentElement;
          let hops = 0;
          while (p && hops < 4) {
            const cs = window.getComputedStyle(p);
            if (cs.position === "fixed" || cs.position === "sticky") {
              p.style.bottom = OFFSET_PX + "px";
            }
            p = p.parentElement;
            hops++;
          }
        } catch {}
      });

      const containers = document.querySelectorAll('#tawkchat-container, [id^="tawk-"], [id^="tawk_"]');
      containers.forEach((el) => {
        try { el.style.bottom = OFFSET_PX + "px"; } catch {}
      });
    };

    if (window.Tawk_API) {
      window.Tawk_API.onLoad = function () {
        reposition();
      };
    }

    const observer = new MutationObserver(reposition);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", reposition);
    const tick = setInterval(reposition, 1200);

    return () => {
      const existing = document.getElementById("tawkto-script");
      if (existing) existing.remove();
      observer.disconnect();
      clearInterval(tick);
      window.removeEventListener("resize", reposition);
      const injected = document.getElementById("tawkto-mobile-offset");
      if (injected) injected.remove();
    };
  }, []);

  return null;
}
