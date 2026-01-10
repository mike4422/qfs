// src/components/LatestNews.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

export default function LatestNews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 10;

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 0) return "just now";
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  // ✅ fixed: use axios instance `api` instead of native fetch
  const fetchPage = async (p, { append = false } = {}) => {
    try {
      if (!append) setLoading(true);
      const { data: json } = await api.get(`/news/crypto?limit=${LIMIT}&page=${p}`);
      if (!json.ok) throw new Error(json.error || "Failed");

      setHasMore(Boolean(json.hasMore));
      setErr("");

      if (append) {
        setItems((prev) => [...prev, ...(json.items || [])]);
      } else {
        if ((json.items?.length ?? 0) === 0 && items.length > 0) {
          setErr("Showing cached updates (live sources temporarily unavailable).");
        } else {
          setItems(json.items || []);
        }
      }
    } catch (e) {
      if (items.length > 0) setErr("Showing cached updates (connection issue).");
      else setErr("Couldn’t load updates right now.");
    } finally {
      if (!append) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
    const id = setInterval(() => {
      setPage(1);
      fetchPage(1);
    }, 120000);
    return () => clearInterval(id);
  }, []);

  const grouped = useMemo(() => items, [items]);

  return (
    <section id="news" className="relative py-20 overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes floaty {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: .7; }
          50% { transform: translateY(-12px) translateX(6px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: .7; }
        }
      `}</style>

      {/* Web3LedgerTrust background */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.12),transparent_60%)]" />
      <div className="absolute -top-28 -left-20 h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl animate-[floaty_10s_ease-in-out_infinite]" />
      <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-emerald-400/14 blur-3xl animate-[floaty_12s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-white/90 shadow-sm backdrop-blur">
            Web3 Updates
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            Market • Security • Wallets
          </span>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Latest Crypto & Web3 insights for safer self-custody
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-white/70">
            Stay informed with real-time headlines on wallets, exchanges, protocols, and security—so you can migrate
            smarter, link confidently, and protect your assets.
          </p>

          {/* Small “legend” chips (UI only) */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
            <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-white/70 backdrop-blur">
              CEX risk signals
            </span>
            <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-white/70 backdrop-blur">
              Wallet security
            </span>
            <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-white/70 backdrop-blur">
              Market moves
            </span>
          </div>
        </div>

        <div className="mt-10">
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/12 bg-white/5 shadow-sm shadow-cyan-500/5 overflow-hidden backdrop-blur"
                >
                  <div className="h-40 bg-gradient-to-r from-white/10 via-white/5 to-white/10 bg-[length:200%_100%] animate-[shimmer_1.2s_linear_infinite]" />
                  <div className="p-4">
                    <div className="h-4 w-3/4 mb-2 bg-white/10 rounded" />
                    <div className="h-3 w-1/4 bg-white/10 rounded" />
                    <div className="mt-3 h-3 w-5/6 bg-white/10 rounded" />
                    <div className="mt-2 h-3 w-4/6 bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && err && (
            <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-100 p-4 text-sm text-center backdrop-blur">
              {err}
            </div>
          )}

          {!loading && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grouped.map((n, idx) => (
                  <article
                    key={`${n.link}-${idx}`}
                    className="group rounded-2xl border border-white/12 bg-white/5 shadow-sm shadow-cyan-500/5 overflow-hidden transition hover:-translate-y-0.5 hover:bg-white/[0.07] hover:shadow-md hover:shadow-cyan-500/10 backdrop-blur"
                  >
                    {n.image ? (
                      <a href={n.link} target="_blank" rel="noopener noreferrer" aria-label={n.title}>
                        <img
                          src={n.image}
                          alt={n.title}
                          className="h-44 w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </a>
                    ) : (
                      <div className="h-44 w-full bg-white/5 flex items-center justify-center">
                        <div className="text-xs text-white/50">No image</div>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] text-white/55">
                        <span className="font-medium text-white/70">{n.source}</span>
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {timeAgo(n.pubDate)}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base sm:text-lg font-semibold text-white line-clamp-2">
                        <a
                          href={n.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-cyan-200 transition"
                          title={n.title}
                        >
                          {n.title}
                        </a>
                      </h3>

                      {n.preview && (
                        <p className="mt-2 text-sm text-white/70 line-clamp-3">{n.preview}</p>
                      )}

                      {/* tiny footer row */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                          Read source
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                          </svg>
                        </span>

                        <span className="text-[11px] text-white/50">
                          Web3LedgerTrust Watch
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={async () => {
                      const next = page + 1;
                      setPage(next);
                      await fetchPage(next, { append: true });
                    }}
                    className="inline-flex items-center rounded-xl border border-white/12 bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90 shadow-lg shadow-cyan-500/10 transition"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
