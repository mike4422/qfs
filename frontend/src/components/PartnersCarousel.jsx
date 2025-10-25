// src/components/Partners.jsx
export default function Partners() {
  const partners = [
    { name: "Trust Wallet",   logo: TrustWalletLogo() },
    { name: "MetaMask",       logo: MetaMaskLogo() },
    { name: "Coinbase",       logo: CoinbaseLogo() },
    { name: "Binance",        logo: BinanceLogo() },
    { name: "Ledger",         logo: LedgerLogo() },
    { name: "Trezor",         logo: TrezorLogo() },
    { name: "Circle",         logo: CircleLogo() },
    { name: "Visa",           logo: VisaLogo() },
  ];

  // seamless loop
  const looped = [...partners, ...partners];

  return (
    <section id="partners" className="relative py-16 sm:py-20">
      {/* soft bg */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-blue-50/40 to-white" />

      {/* marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee { animation: marquee 28s linear infinite; }
        .marquee:hover, .marquee:focus-within { animation-play-state: paused; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow + heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold text-blue-700 shadow-sm backdrop-blur">
            Our Partners
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            Trusted by leading wallets, exchanges & infrastructure
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-gray-600">
            Strategic partnerships that power secure onboarding, settlement, and scale.
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
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur transition hover:shadow-md">
                    {/* colored logo (no grayscale) */}
                    <div className="flex h-12 sm:h-14 items-center justify-center">
                      {p.logo}
                    </div>
                    {/* name label */}
                    <div className="text-[11px] sm:text-xs font-medium text-gray-700 text-center">
                      {p.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* mask edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Inline SVG (colored) ---------- */
function TrustWalletLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Trust Wallet">
      <path fill="#3375BB" d="M128 16c33 24 66 24 98 16v98c0 56-36 86-98 110-62-24-98-54-98-110V32c32 8 65 8 98-16Z"/>
      <path fill="#fff" d="M128 40c-23 14-46 18-70 16v74c0 43 29 68 70 86 41-18 70-43 70-86V56c-24 2-47-2-70-16Z"/>
    </svg>
  );
}
function MetaMaskLogo() {
  return (
    <svg viewBox="-8 -6 272 248" className="h-8 w-auto" role="img" aria-label="MetaMask">
      <path fill="#E4761B" d="M250 3L144 80l19-45L250 3Z"/><path fill="#F6851B" d="M6 3l93 32 19 45L6 3Z"/>
      <path fill="#E2761B" d="M208 173l32 61-55-15 23-46Z"/><path fill="#E4761B" d="M48 173l23 46-55 15 32-61Z"/>
      <path fill="#F6851B" d="M104 151h48l-5 31-19 12-19-12-5-31Z"/>
      <path fill="#C0CAD4" d="M173 97l33 9-23 67-33-3 23-73Z"/><path fill="#D7E1EA" d="M83 97l23 73-33 3-23-67 33-9Z"/>
    </svg>
  );
}
function CoinbaseLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Coinbase">
      <circle cx="128" cy="128" r="112" fill="#0052FF"/><path fill="#fff" d="M171 143h-30v30h-26v-30H85v-26h30V87h26v30h30v26Z"/>
    </svg>
  );
}
function BinanceLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Binance">
      <path fill="#F3BA2F" d="M128 33l27 27-27 27-27-27 27-27Zm54 54l27 27-27 27-27-27 27-27Zm-108 0l27 27-27 27-27-27 27-27Zm54 54l27 27-27 27-27-27 27-27Z"/>
    </svg>
  );
}
function LedgerLogo() {
  // Add subtle blue accents so it isn't purely black/white
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Ledger">
      <rect x="32" y="32" width="80" height="80" fill="#111827"/><rect x="144" y="32" width="80" height="32" fill="#3B82F6"/>
      <rect x="144" y="80" width="80" height="32" fill="#111827"/><rect x="32" y="144" width="32" height="80" fill="#3B82F6"/>
      <rect x="80" y="144" width="32" height="80" fill="#111827"/><rect x="144" y="144" width="80" height="80" fill="#3B82F6"/>
    </svg>
  );
}
function TrezorLogo() {
  // Use Trezor green accent to avoid monochrome
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Trezor">
      <path fill="#111827" d="M128 20l40 24v44c0 53-26 92-40 108-14-16-40-55-40-108V44l40-24Z"/>
      <rect x="96" y="84" width="64" height="56" rx="10" fill="#22C55E"/>
    </svg>
  );
}
function CircleLogo() {
  return (
    <svg viewBox="0 0 256 256" className="h-8 w-auto" role="img" aria-label="Circle">
      <circle cx="128" cy="128" r="96" fill="none" stroke="#22C55E" strokeWidth="20"/>
      <circle cx="128" cy="128" r="60" fill="none" stroke="#60A5FA" strokeWidth="20"/>
    </svg>
  );
}
function VisaLogo() {
  return (
    <svg viewBox="0 0 256 80" className="h-8 w-auto" role="img" aria-label="Visa">
      <path fill="#1A1F71" d="M8 72L20 8h24L32 72H8Zm74 0L90 8h23L97 72H82Zm72 0h-22L123 8h22l9 39 18-39h22l-33 64Zm84 0h-24l10-64h24l-10 64Z"/>
    </svg>
  );
}
