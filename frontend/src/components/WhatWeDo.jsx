// src/components/WhatWeDo.jsx
export default function WhatWeDo() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* --- Animated Background --- */}
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: .8; }
          50% { transform: translateY(-12px) translateX(6px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: .8; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Gradient wash */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-blue-50 via-white to-blue-100" />

      {/* Soft moving overlay blobs */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl animate-[floaty_10s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-400/20 blur-3xl animate-[floaty_12s_ease-in-out_infinite]" />

      {/* Subtle animated gradient layer */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-200 bg-[length:200%_200%] animate-[gradientShift_16s_ease-in-out_infinite]" />

      {/* --- Main Content --- */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold text-blue-700 shadow-sm backdrop-blur">
            WHAT WE DO
          </span>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          {/* Left: image (no frame, border, or bg) */}
          <div className="order-1">
            <img
              src="./public/qfs2.png"
              alt="Asset-backed digital finance"
              className="w-full h-[360px] sm:h-[420px] lg:h-[520px] object-cover rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Right: content */}
          <div className="order-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              THE INCOMING COLLAPSE OF PAPER MONEY
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700">
              The history of money is entering a new era—you could wake up with no money. Convert paper currency into a
              digitally gold-backed asset. We guide you through that transition. <strong>Act now</strong> before it’s too late.
              We’ll walk with you—step by step.
            </p>

            {/* Feature cards */}
            <div className="mt-8 grid gap-5 sm:gap-6 sm:grid-cols-2">
              <Feature
                title="Assets Conversion"
                desc="A universal network designed to facilitate the transfer of asset-backed funds."
                icon={GoldBarsIcon()}
              />
              <Feature
                title="Wallet Synchronization"
                desc="Sync your wallet with our Security Ledger 3 for utmost protection."
                icon={LedgerIcon()}
              />
              <Feature
                title="Stolen Assets Recovery"
                desc="Intercept and recover stolen digital assets with expert workflows."
                icon={RecoverIcon()}
              />
              <Feature
                title="Humanitarian Project"
                desc="Submit your QFS humanitarian project after KYC verification."
                icon={HeartHandsIcon()}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Reusable feature card --- */
function Feature({ title, desc, icon }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white/85 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
        {icon}
      </div>
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{desc}</div>
    </div>
  );
}

/* --- Inline icons --- */
function GoldBarsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 14l5-9 5 9M4 18h16M6 18l-2 4m14-4l2 4" />
    </svg>
  );
}
function LedgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6" />
    </svg>
  );
}
function RecoverIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v4l3 3M20.49 9A8.5 8.5 0 1 1 7 3.51" />
    </svg>
  );
}
function HeartHandsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-4.5-6-8.5a3.5 3.5 0 0 1 6-2.5 3.5 3.5 0 0 1 6 2.5C18 16.5 12 21 12 21z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l-2-2M17 7l2-2" />
    </svg>
  );
}
