import { useEffect } from "react";

export default function TalkToWidget() {
  useEffect(() => {
    // Prevent duplicate injection
    if (document.getElementById("tawkto-script")) return;

    // ---- 1) Inject the official Tawk script (unchanged) ----
    const s1 = document.createElement("script");
    s1.id = "tawkto-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/68fee2d77190d319491693f9/1j8hqc6v0";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    s0.parentNode.insertBefore(s1, s0);

    // ---- 2) Robust re-positioner (works even if Tawk re-renders) ----
    const MOBILE_BOTTOM_OFFSET_PX = 76;   // move up above your MobileNavDock
    const MOBILE_RIGHT_OFFSET_PX  = 16;   // keep a little breathing room from edge

    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    // climbs up from the iframe to find the fixed container Tawk uses
    const findFixedContainer = (el) => {
      let node = el?.parentElement || null;
      while (node && node !== document.body) {
        const cs = getComputedStyle(node);
        if (cs.position === "fixed") return node;
        node = node.parentElement;
      }
      return null;
    };

    const nudge = () => {
      try {
        const iframes = Array.from(
          document.querySelectorAll('iframe[src*="tawk.to"], iframe[id*="tawk"], iframe[name*="tawk"]')
        );
        if (!iframes.length) return;

        for (const iframe of iframes) {
          const fixedBox = findFixedContainer(iframe) || iframe; // fallback to the iframe itself
          if (!fixedBox) continue;

          const style = fixedBox.style;

          // Always keep it clickable above other UI
          style.setProperty("z-index", "2147483000", "important");
          style.setProperty("pointer-events", "auto", "important");

          if (isMobile()) {
            style.setProperty("bottom", `${MOBILE_BOTTOM_OFFSET_PX}px`, "important");
            style.setProperty("right", `${MOBILE_RIGHT_OFFSET_PX}px`, "important");
            style.setProperty("left", "auto", "important"); // avoid left-corner layouts overlapping
          } else {
            // desktop: leave Tawk default bottom-right, just ensure we don’t sit under anything
            style.setProperty("bottom", "24px", "important");
            style.setProperty("right", "24px", "important");
          }
        }
      } catch {
        /* ignore */
      }
    };

    // keep enforcing (Tawk sometimes re-injects)
    const interval = setInterval(nudge, 800);

    // also react immediately to new DOM nodes
    const mo = new MutationObserver(nudge);
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // first run + on resize
    nudge();
    const onResize = () => nudge();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mo.disconnect();
      clearInterval(interval);
      const existing = document.getElementById("tawkto-script");
      if (existing) existing.remove();
    };
  }, []);

  return null;
}
