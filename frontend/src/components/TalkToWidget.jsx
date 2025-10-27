import { useEffect } from "react";

export default function TalkToWidget() {
  useEffect(() => {
    // prevent duplicate injection
    if (document.getElementById("tawkto-script")) return;

    const s1 = document.createElement("script");
    s1.id = "tawkto-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/68fede4648a90919514832de/1j8hp8gu9";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    s0.parentNode.insertBefore(s1, s0);

    return () => {
      const existing = document.getElementById("tawkto-script");
      if (existing) existing.remove();
    };
  }, []);

  return null; // no visible output
}
