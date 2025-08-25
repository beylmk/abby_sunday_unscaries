self.addEventListener("install", e=>{
  e.waitUntil(caches.open("weekly-cache").then(c=>c.addAll([
    "index.html","styles.css","manifest.json","script.js"
  ])));
});
self.addEventListener("fetch", e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});