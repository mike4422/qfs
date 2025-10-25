import { useState } from "react"
import { BadgeDollarSign, ExternalLink } from "lucide-react"

/* Proxy to bypass hosts that block hotlinking */
const proxify = (url) => {
  try { const u = new URL(url); return `https://images.weserv.nl/?url=${u.host}${u.pathname}${u.search||""}` } catch { return url }
}

/* Robust logo loader: tries each candidate (and its proxified version), then falls back to initials */
function SmartLogo({ sources, alt, size = 44, initials = "C" }) {
  const base = Array.isArray(sources) ? sources : [sources].filter(Boolean)
  const all = base.flatMap(s => [s, proxify(s)])
  const [idx, setIdx] = useState(0)
  const src = all[idx]

  if (!src) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full text-white"
        style={{ width: size, height: size, background: "linear-gradient(135deg,#2563eb,#7c3aed)", fontSize: Math.max(10, size*0.34), fontWeight: 700 }}
        aria-label={alt}
      >
        {initials}
      </span>
    )
  }

  // eslint-disable-next-line
  return <img
    src={src}
    alt={alt}
    className="rounded-full object-contain bg-white/5"
    style={{ width: size, height: size }}
    onError={() => setIdx(i => i + 1)}
    referrerPolicy="no-referrer"
  />
}

/* Verified logo candidates for each provider */
const PROVIDERS = [
  {
    name: "Ramp",
    url: "https://ramp.network/",
    logos: [
      "https://assets.ramp.network/static/logos/ramp-logo-green.svg", // official brand asset
      "https://ramp.network/assets/images/favicon/apple-touch-icon.png",
      "https://rampnetwork.com/favicon.ico",
    ],
    blurb: "Instant crypto purchase with cards and local bank methods in 150+ regions.",
  },
  {
    name: "Transak",
    url: "https://transak.com/",
    logos: [
      "https://assets.transak.com/images/transak-logo-blue.svg",      // official brand asset
      "https://global.transak.com/favicon-196x196.png",
      "https://transak.com/favicon.ico",
    ],
    blurb: "Global on-ramp coverage with broad asset support and smooth checkout.",
  },
  {
    name: "Mercuryo",
    url: "https://mercuryo.io/",
    logos: [
      "https://mercuryo.io/wp-content/uploads/2020/08/cropped-mercuryo-fav-192x192.png",
      "https://mercuryo.io/favicon.ico",
    ],
    blurb: "Card and bank payments with competitive FX and a fast, modern flow.",
  },
  {
    name: "MoonPay",
    url: "https://www.moonpay.com/",
    logos: [
      "https://www.moonpay.com/static/favicon-196.png",
      "https://www.moonpay.com/favicon.ico",
      // Wikimedia copy of the wordmark (extra fallback)
      "https://upload.wikimedia.org/wikipedia/commons/4/45/MoonPay.svg",
    ],
    blurb: "Buy popular assets quickly with cards and local rails where available.",
  },
]

export default function Buycrypto() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Buy Crypto</h1>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-200">
          <BadgeDollarSign className="h-4 w-4" />
          Multiple payment methods
        </span>
      </div>

      {/* Providers */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PROVIDERS.map(p => (
          <article
            key={p.name}
            className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <SmartLogo sources={p.logos} alt={`${p.name} logo`} size={44} initials={p.name[0]?.toUpperCase() || "C"} />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.name}</h3>
                <p className="text-[12px] text-gray-500 dark:text-gray-400">{new URL(p.url).host}</p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {p.blurb}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Visa · Mastercard · Bank
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
                aria-label={`Buy with ${p.name}`}
                title={`Buy with ${p.name}`}
              >
                Buy with {p.name}
                <ExternalLink className="h-4 w-4 opacity-90" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        Service provided in partnership with leading payment providers.
      </div>
    </section>
  )
}
