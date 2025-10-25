// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="relative">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1920&auto=format&fit=crop"
        alt="Quantum security background"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* Soft overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: copy + CTAs */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
              QFS Worldwide Network
              <span className="h-1 w-1 rounded-full bg-blue-600" />
              Trusted Digital Finance
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight text-gray-900">
              Quantum-grade{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                security
              </span>{" "}
              for your digital assets.
            </h1>

            <p className="mt-4 max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-700">
              Connect wallets, manage assets, and fund real projects across the globe.
              Built on next-generation encryption and resilient infrastructure for total confidence.
            </p>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-blue-700 bg-white/80 hover:bg-white shadow border border-blue-100"
              >
                 Log in
              </a>
            </div>

            {/* Trust bar / quick stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">135k+</div>
                <div className="text-xs text-gray-600">Transactions</div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">$1.2B</div>
                <div className="text-xs text-gray-600">Volume Processed</div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">150+</div>
                <div className="text-xs text-gray-600">Partner Projects</div>
              </div>
            </div>
          </div>

          {/* Right: polished image/card */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-3xl border border-gray-200 bg-white/80 p-2 shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop"
                    alt="Financial dashboard preview"
                    loading="lazy"
                    className="h-[420px] w-full object-cover"
                  />
                </div>
              </div>

              {/* Accent floating badges */}
              <div className="absolute -bottom-6 -left-6 hidden sm:block">
                <div className="rounded-2xl bg-white shadow-lg border border-blue-100 px-4 py-3">
                  <div className="text-xs text-gray-600">Avg. settlement</div>
                  <div className="text-lg font-bold text-gray-900">T+0.5 days</div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 hidden sm:block">
                <div className="rounded-2xl bg-white shadow-lg border border-indigo-100 px-4 py-3">
                  <div className="text-xs text-gray-600">Uptime</div>
                  <div className="text-lg font-bold text-gray-900">99.98%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-foot notes under hero */}
        <div className="mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-xs text-gray-600">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            PCI-aware flows
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Wallet sync (BTC / USDT TRC20 / ETH)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Role-based access (Admin / User)
          </span>
        </div>
      </div>
    </section>
  );
}
