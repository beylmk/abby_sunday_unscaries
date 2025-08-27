// Fast-update service worker: network-first + instant activation
const SW_VERSION = "v6";
const APP_SHELL = ["index.html","styles.css","script.js","manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(`app-${SW_VERSION}`).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.filter((n) => !n.includes(`app-${SW_VERSION}`)).map((n) => caches.delete(n))
    );
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clients) {
      client.postMessage({ type: "SW_ACTIVATED", version: SW_VERSION });
    }
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const isAppShell = APP_SHELL.some((p) => url.pathname.endsWith(p));

  if (isAppShell) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: "no-store" });
        const cache = await caches.open(`app-${SW_VERSION}`);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || new Response("Offline", { status: 503 });
      }
    })());
    return;
  }

  // Default: cache-first for static assets (icons/images), network fallback
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});