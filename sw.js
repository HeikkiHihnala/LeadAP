// Service worker: makes the app work offline (e.g. weak Wi-Fi at the exhibition).
const CACHE = "ap-leads-v1.0.0";
const CORE = ["./", "index.html", "styles.css", "app.js", "config.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png"];
// Third-party libraries (OCR, Microsoft login) are cached the first time they are used.
const CDN_HOSTS = ["cdn.jsdelivr.net", "alcdn.msauth.net", "tessdata.projectnaptha.com", "unpkg.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // Never cache Microsoft login or Graph API calls
  if (url.hostname.includes("login.microsoftonline.com") || url.hostname.includes("graph.microsoft.com")) return;

  if (CDN_HOSTS.includes(url.hostname)) {
    // cache-first for libraries
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    })));
    return;
  }
  if (url.origin === self.location.origin) {
    // network-first for own files so updates arrive quickly, cache as fallback offline
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  }
});
