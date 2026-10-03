// Minimal offline service worker (ADR-0003 Phase 9): once assets are
// fetched, normal learning must not require the network.
//   /media/*          → cache-first (rights-verified local assets)
//   same-origin other → stale-while-revalidate (app shell stays fresh)
// Cross-origin (embeds) is never cached — it degrades gracefully.
const CACHE = "se-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/media/")) {
    e.respondWith(
      caches.match(e.request).then(
        (hit) =>
          hit ??
          fetch(e.request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((hit) => {
      const refresh = fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      });
      return hit ?? refresh;
    }),
  );
});
