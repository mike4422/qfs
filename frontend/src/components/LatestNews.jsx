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
          setErr("Showing cached news (live sources temporarily unavailable).");
        } else {
          setItems(json.items || []);
        }
      }
    } catch (e) {
      if (items.length > 0) setErr("Showing cached news (connection issue).");
      else setErr("Couldn’t load news right now.");
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
      `}</style>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-blue-50/40 to-white" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold text-blue-700 shadow-sm backdrop-blur">
            Our latest news
          </span>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            The Latest Updates from the QFS Global Network
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-gray-600">
            Stay informed with real-time insights, system updates, and developments shaping the future of
            quantum-grade finance, digital security, and asset-backed technology.
          </p>
        </div>

        <div className="mt-10">
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white/80 shadow-sm overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.2s_linear_infinite]" />
                  <div className="p-4">
                    <div className="h-4 w-3/4 mb-2 bg-gray-200 rounded" />
                    <div className="h-3 w-1/4 bg-gray-200 rounded" />
                    <div className="mt-3 h-3 w-5/6 bg-gray-200 rounded" />
                    <div className="mt-2 h-3 w-4/6 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && err && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 text-sm text-center">
              {err}
            </div>
          )}

          {!loading && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grouped.map((n, idx) => (
                  <article
                    key={`${n.link}-${idx}`}
                    className="group rounded-2xl border border-gray-200 bg-white/90 shadow-sm overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md backdrop-blur"
                  >
                    {n.image ? (
                      <a href={n.link} target="_blank" rel="noopener noreferrer" aria-label={n.title}>
                        <img
                          src={n.image}
                          alt={n.title}
                          className="h-44 w-full object-cover"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </a>
                    ) : (
                      <div className="h-44 w-full bg-gray-100 flex items-center justify-center">
                        <div className="text-xs text-gray-500">No image</div>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="font-medium">{n.source}</span>
                        <span>{timeAgo(n.pubDate)}</span>
                      </div>

                      <h3 className="mt-2 text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                        <a
                          href={n.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-700"
                          title={n.title}
                        >
                          {n.title}
                        </a>
                      </h3>

                      {n.preview && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{n.preview}</p>
                      )}
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
                    className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 shadow-sm"
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
