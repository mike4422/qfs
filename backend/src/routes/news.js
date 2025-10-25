// backend/src/routes/news.js
import { Router } from "express";
import Parser from "rss-parser";

const router = Router();

const FEEDS = [
  { source: "Kraken",  url: "https://blog.kraken.com/feed" },
  { source: "Bitfinex",url: "https://blog.bitfinex.com/feed" },
  { source: "Huobi",   url: "https://blog.huobi.com/feed" },
  { source: "HTX",     url: "https://www.htx.com/blog/en-us/feed" },
];

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "QFS-News-Aggregator/1.2 (+https://qfs.example)",
    "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
  },
});

// Cache (stale-while-revalidate)
let CACHE = { ts: 0, items: [] };
const FRESH_TTL_MS = 5 * 60 * 1000;
const HARD_TTL_MS  = 60 * 60 * 1000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cleanPreview = (html = "", max = 160) => {
  const t = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
};
const firstImgFromHtml = (html = "") => {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null; // still from the news content itself
};

async function fetchFeed({ source, url }) {
  const feed = await parser.parseURL(url);
  return (feed.items || []).map((it) => {
    const pub = it.isoDate || it.pubDate || it.date || null;
    // Only use images coming from the article/feed itself
    const image =
      it.enclosure?.url ||
      it["media:content"]?.$?.url ||
      firstImgFromHtml(it["content:encoded"] || it.content) ||
      null;

    return {
      source,
      title: it.title || "Untitled",
      link: it.link,
      pubDate: pub,
      image, // may be null — we won’t fabricate a stock image
      preview: cleanPreview(it["content:encoded"] || it.content || it.summary || ""),
    };
  });
}

router.get("/crypto", async (req, res) => {
  const started = Date.now();
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || "10", 10)));
  const page  = Math.max(1, parseInt(req.query.page || "1", 10));

  try {
    // If cache is fresh, just paginate it
    if (Date.now() - CACHE.ts < FRESH_TTL_MS && CACHE.items.length) {
      const total = CACHE.items.length;
      const start = (page - 1) * limit;
      const slice = CACHE.items.slice(start, start + limit);
      return res.json({
        ok: true, items: slice, fromCache: true, total, page, limit,
        hasMore: start + limit < total, tookMs: Date.now() - started
      });
    }

    // (Re)build cache
    const collected = [];
    for (const feed of FEEDS) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const items = await fetchFeed(feed);
        if (items.length) collected.push(...items);
      } catch (err) {
        console.error(`[news] Failed ${feed.source} (${feed.url}):`, err?.message || err);
      }
      // eslint-disable-next-line no-await-in-loop
      await sleep(120);
    }

    const combined = collected
      .filter((x) => x && x.link)
      .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

    if (combined.length) {
      CACHE = { ts: Date.now(), items: combined };
    } else if (!CACHE.items.length) {
      // nothing new and no cache — return empty ok
      return res.json({ ok: true, items: [], total: 0, page, limit, hasMore: false, tookMs: Date.now() - started });
    }

    // Serve paginated slice from (new or old) cache
    const total = CACHE.items.length;
    const start = (page - 1) * limit;
    const slice = CACHE.items.slice(start, start + limit);
    return res.json({
      ok: true, items: slice, fromCache: combined.length === 0, total, page, limit,
      hasMore: start + limit < total, tookMs: Date.now() - started
    });
  } catch (e) {
    console.error("[news] Unhandled:", e);
    // Serve stale cache if available (respect page/limit)
    if (CACHE.items.length) {
      const total = CACHE.items.length;
      const start = (page - 1) * limit;
      const slice = CACHE.items.slice(start, start + limit);
      return res.json({
        ok: true, items: slice, fromCache: true, total, page, limit,
        hasMore: start + limit < total, tookMs: Date.now() - started
      });
    }
    return res.json({ ok: true, items: [], total: 0, page, limit, hasMore: false, tookMs: Date.now() - started });
  }
});

export default router;
