// src/components/Partners.jsx
export default function Partners() {
  const partners = [
    { name: "Trust Wallet", logo: TrustWalletLogo() },
    { name: "MetaMask", logo: MetaMaskLogo() },
    { name: "Coinbase", logo: CoinbaseLogo() },
    { name: "Binance", logo: BinanceLogo() },
    { name: "Ledger", logo: LedgerLogo() },
    { name: "Trezor", logo: TrezorLogo() },
    { name: "Circle", logo: CircleLogo() },
    { name: "Visa", logo: VisaLogo() },
  ];

  // seamless loop
  const looped = [...partners, ...partners];

  return (
    <section id="partners" className="relative overflow-hidden py-16 sm:py-20">
      {/* Web3 background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      {/* marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee { animation: marquee 26s linear infinite; }
        .marquee:hover, .marquee:focus-within { animation-play-state: paused; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow + heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-white/90 shadow-sm backdrop-blur">
            Ecosystem Compatibility
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            Wallets • Exchanges • Infrastructure
          </span>

          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Built for the tools you already trust.
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-white/70">
            Web3LedgerTrust is designed to work with leading wallets and rails—so you can migrate from CEXs, link your
            wallet to our ledger layer, and stay in control.
          </p>
        </div>

        {/* Slider */}
        <div className="mt-10 overflow-hidden">
          <div className="group relative">
            <div className="marquee flex w-[200%] gap-6 sm:gap-8" aria-label="Partner logos carousel">
              {looped.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="flex w-[50%] xs:w-[33.33%] sm:w-[25%] md:w-[20%] lg:w-[12.5%] items-stretch justify-center"
                >
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 p-4 shadow-sm shadow-cyan-500/5 backdrop-blur transition hover:bg-white/[0.07] hover:shadow-md hover:shadow-cyan-500/10">
                    {/* logo */}
                    <div className="flex h-12 sm:h-14 items-center justify-center">
                      {p.logo}
                    </div>
                    {/* name label */}
                    <div className="text-[11px] sm:text-xs font-medium text-white/75 text-center">
                      {p.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* mask edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950 to-transparent" />
          </div>
        </div>

        {/* tiny trust line */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Non-custodial linking
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Exchange-to-wallet migration UX
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-300" />
            Clean ledger verification layer
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Inline SVG (colored) ---------- */
function TrustWalletLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Trust Wallet">
      <path fill="#3375BB" d="M128 16c33 24 66 24 98 16v98c0 56-36 86-98 110-62-24-98-54-98-110V32c32 8 65 8 98-16Z" />
      <path fill="#fff" d="M128 40c-23 14-46 18-70 16v74c0 43 29 68 70 86 41-18 70-43 70-86V56c-24 2-47-2-70-16Z" />
    </svg>
  );
}
function MetaMaskLogo() {
  return (
    <svg viewBox="-8 -6 272 248" className="h-8 w-auto" role="img" aria-label="MetaMask">
      <path fill="#E4761B" d="M250 3L144 80l19-45L250 3Z" />
      <path fill="#F6851B" d="M6 3l93 32 19 45L6 3Z" />
      <path fill="#E2761B" d="M208 173l32 61-55-15 23-46Z" />
      <path fill="#E4761B" d="M48 173l23 46-55 15 32-61Z" />
      <path fill="#F6851B" d="M104 151h48l-5 31-19 12-19-12-5-31Z" />
      <path fill="#C0CAD4" d="M173 97l33 9-23 67-33-3 23-73Z" />
      <path fill="#D7E1EA" d="M83 97l23 73-33 3-23-67 33-9Z" />
    </svg>
  );
}
function CoinbaseLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Coinbase">
      <circle cx="128" cy="128" r="112" fill="#0052FF" />
      <path fill="#fff" d="M171 143h-30v30h-26v-30H85v-26h30V87h26v30h30v26Z" />
    </svg>
  );
}
function BinanceLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Binance">
      <path
        fill="#F3BA2F"
        d="M128 33l27 27-27 27-27-27 27-27Zm54 54l27 27-27 27-27-27 27-27Zm-108 0l27 27-27 27-27-27 27-27Zm54 54l27 27-27 27-27-27 27-27Z"
      />
    </svg>
  );
}
function LedgerLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Ledger">
      <rect x="32" y="32" width="80" height="80" fill="#111827" />
      <rect x="144" y="32" width="80" height="32" fill="#38BDF8" />
      <rect x="144" y="80" width="80" height="32" fill="#111827" />
      <rect x="32" y="144" width="32" height="80" fill="#34D399" />
      <rect x="80" y="144" width="32" height="80" fill="#111827" />
      <rect x="144" y="144" width="80" height="80" fill="#38BDF8" />
    </svg>
  );
}
function TrezorLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Trezor">
      <path fill="#111827" d="M128 20l40 24v44c0 53-26 92-40 108-14-16-40-55-40-108V44l40-24Z" />
      <rect x="96" y="84" width="64" height="56" rx="10" fill="#34D399" />
    </svg>
  );
}
function CircleLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Circle">
      <circle cx="128" cy="128" r="96" fill="none" stroke="#34D399" strokeWidth="20" />
      <circle cx="128" cy="128" r="60" fill="none" stroke="#60A5FA" strokeWidth="20" />
    </svg>
  );
}
function VisaLogo() {
  return (
    <svg viewBox="0 0 256 80" className="h-8 w-auto" role="img" aria-label="Visa">
      <path
        fill="#93C5FD"
        d="M8 72L20 8h24L32 72H8Zm74 0L90 8h23L97 72H82Zm72 0h-22L123 8h22l9 39 18-39h22l-33 64Zm84 0h-24l10-64h24l-10 64Z"
      />
    </svg>
  );
}
