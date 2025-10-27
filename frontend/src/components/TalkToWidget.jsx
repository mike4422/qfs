import { useEffect } from "react";

export default function TalkToWidget() {
  useEffect(() => {
    // Prevent duplicate injection
    if (document.getElementById("tawkto-script")) return;

    const s1 = document.createElement("script");
    s1.id = "tawkto-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/68fee2d77190d319491693f9/1j8hqc6v0";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    s0.parentNode.insertBefore(s1, s0);

    // 🟢 Move the chat widget up a bit on mobile to avoid overlapping MobileNavDock
    const reposition = () => {
      const frame = document.querySelector("#tawkto-widget iframe, iframe[src*='tawk.to']");
      if (frame && window.innerWidth < 768) {
        frame.style.bottom = "80px"; // move up ~80px above your MobileNavDock
      }
    };

    const observer = new MutationObserver(reposition);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("resize", reposition);
    const repositionInterval = setInterval(reposition, 1000);

    return () => {
      const existing = document.getElementById("tawkto-script");
      if (existing) existing.remove();
      observer.disconnect();
      clearInterval(repositionInterval);
      window.removeEventListener("resize", reposition);
    };
  }, []);

  return null;
}
