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

    return () => {
      const existing = document.getElementById("tawkto-script");
      if (existing) existing.remove();
    };
  }, []);

  return null;
}
