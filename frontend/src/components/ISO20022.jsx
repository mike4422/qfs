// src/components/ISO20022.jsx
import { useEffect, useRef, useState } from "react";

export default function ISO20022() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.3 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: .8; }
          50% { transform: translateY(-12px) translateX(6px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: .8; }
        }
        @keyframes gridMove { 0% { transform: translateX(0px); } 100% { transform: translateX(-40px); } }
      `}</style>

      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-blue-50/60 via-white to-white" />
      <div className="pointer-events-none absolute -z-10 inset-0 opacity-40">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DCE7FF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="animate-[gridMove_16s_linear_infinite]" />
        </svg>
      </div>
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl animate-[floaty_8s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl animate-[floaty_10s_ease-in-out_infinite]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Eyebrow */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold text-blue-700 shadow-sm backdrop-blur">
            QFS NESARA/GESARA
          </span>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          {/* Right column becomes first on mobile */}
          <div className="order-1 lg:order-2 lg:overflow-visible lg:-mr-24">
            <img
              src="/qfs.png"
              alt="AI-driven security technology"
              className="w-full h-[360px] sm:h-[420px] lg:h-[520px] object-contain rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Left column: H1 + paragraph + stats (aligned together) */}
          <div className="order-2 lg:order-1">
            <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              ISO20022: GLOBAL ECONOMIC SECURITY AND REFORMATION ACT
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700">
              The Global Currency Reset (GCR) and (NESARA&nbsp;GESARA) is upon us! Regulated ISO 20022 cryptos like these
              below will change the world and EXPLODE really soon. The central banks are using them for the new QFS.
              Cryptos like <strong>XRP</strong>, <strong>XLM</strong>, <strong>XDC</strong>, <strong>ALGO</strong>, <strong>IOTA</strong>, <strong>SHX</strong> — also
              <strong> Gold</strong> and <strong>Silver</strong>. Let me tell you more if you are interested: NESARA states Rainbow
              “Treasury” Tokens (<strong>XRP</strong> and <strong>XLM</strong>) backed by precious metals, adding Quantum & ISO20022
              internationally regulated USA coins also backed by metals.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <Stat label="Users Enrolled" value={85} suffix="M+" visible={visible} />
              <Stat label="Monitored Globally" value={165} suffix="M+" visible={visible} delay={150} />
              <Stat label="Humanitarian Projects" value={5} suffix="M+" visible={visible} delay={300} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* helpers (unchanged) */
function Stat({ value, suffix = "", label, visible, delay = 0 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = value;
    const duration = 900;
    const t0 = performance.now() + delay;
    let raf;
    const tick = (t) => {
      if (t < t0) { raf = requestAnimationFrame(tick); return; }
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(start + (end - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, delay]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-center shadow-sm">
      <div className="text-2xl font-bold text-gray-900">{n}{suffix}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
