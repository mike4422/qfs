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
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: .75; }
          50% { transform: translateY(-12px) translateX(6px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: .75; }
        }
        @keyframes gridMove { 0% { transform: translateX(0px); } 100% { transform: translateX(-48px); } }
      `}</style>

      {/* Web3LedgerTrust background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      <div className="pointer-events-none absolute -z-10 inset-0 opacity-[0.16]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="animate-[gridMove_18s_linear_infinite]" />
        </svg>
      </div>

      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl animate-[floaty_8s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl animate-[floaty_10s_ease-in-out_infinite]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Eyebrow */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-white/90 shadow-sm backdrop-blur">
            Ledger Linking Explained
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            Security • Ownership • Yield
          </span>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          {/* Right column becomes first on mobile */}
          <div className="order-1 lg:order-2 lg:overflow-visible lg:-mr-24">
            <div className="relative rounded-3xl border border-white/12 bg-white/5 shadow-2xl shadow-cyan-500/10 backdrop-blur p-4">
              <img
                src="/qfs.png"
                alt="Web3 ledger dashboard preview"
                className="w-full h-[360px] sm:h-[420px] lg:h-[520px] object-contain rounded-2xl"
                loading="lazy"
              />

              {/* floating info chips (UI only) */}
              <div className="absolute top-4 left-4 hidden sm:flex items-center gap-2 rounded-full border border-white/12 bg-slate-950/55 px-3 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Non-custodial
              </div>

              <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 rounded-full border border-white/12 bg-slate-950/55 px-3 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Ledger Verified
              </div>
            </div>
          </div>

          {/* Left column: title + copy + stats */}
          <div className="order-2 lg:order-1">
            <h2 className="text-center lg:text-left text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              A Web3 ledger layer for safer self-custody.
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75">
              Centralized exchanges can freeze withdrawals, limit access, or become a single point of failure.{" "}
              <strong className="text-white">Web3LedgerTrust</strong> is built to help you{" "}
              <strong className="text-white">move assets to a decentralized wallet</strong>, then{" "}
              <strong className="text-white">link that wallet to our ledger</strong> for clean tracking, verification, and monitoring—
              without taking custody of your funds.
            </p>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75">
              Once linked, your dashboard can show wallet balances, activity snapshots, and yield projections with a calm,
              professional UI. Designed for everyday holders who want clarity, safety, and a path to{" "}
              <strong className="text-white">10% monthly yield</strong> on eligible balances.
            </p>

            {/* Key points (UI only) */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Bullet title="Move off CEXs" desc="Guided migration UX to reduce wrong-network mistakes." />
              <Bullet title="Link & verify" desc="A ledger link badge to confirm wallet ownership & visibility." />
              <Bullet title="Monitor in real time" desc="Clean balance + activity views designed for confidence." />
              <Bullet title="Earn monthly yield" desc="Transparent yield presentation and reporting-ready layouts." />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <Stat label="Wallets Linked" value={10} suffix="K+" visible={visible} />
              <Stat label="Monthly Yield" value={10} suffix="%" visible={visible} delay={150} />
              <Stat label="Uptime Target" value={99} suffix=".9%" visible={visible} delay={300} />
            </div>

            {/* Micro note */}
            <div className="mt-4 text-xs text-white/55">
              *UI/UX preview: linking is non-custodial. Your wallet remains fully under your control.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* helpers (functionality unchanged) */
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
      if (t < t0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(start + (end - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, delay]);

  return (
    <div className="rounded-2xl border border-white/12 bg-white/5 p-4 text-center shadow-sm shadow-cyan-500/5 backdrop-blur">
      <div className="text-2xl font-extrabold text-white">
        {n}
        {suffix}
      </div>
      <div className="text-xs text-white/65">{label}</div>
    </div>
  );
}

function Bullet({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/5 p-4 shadow-sm shadow-cyan-500/5 backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300" />
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-white/70">{desc}</div>
        </div>
      </div>
    </div>
  );
}
