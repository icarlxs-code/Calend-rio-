/* Service worker: funciona offline e sempre busca a versão mais nova primeiro */
const CACHE = 'pauta-v1';
const SHELL = [
  './', 'index.html', 'config.js', 'css/app.css', 'manifest.webmanifest',
  'js/app.js', 'js/store.js', 'js/ui.js', 'js/utils.js', 'js/constants.js', 'js/icons.js',
  'js/components.js', 'js/insights.js', 'js/ics.js', 'js/share.js', 'js/cloud.js',
  'js/views/calendar.js', 'js/views/event.js', 'js/views/companies.js', 'js/views/settings.js', 'js/views/client.js',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // rede primeiro (para receber atualizações); cache se estiver offline
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))),
  );
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((cs) => (cs[0] ? cs[0].focus() : self.clients.openWindow('./'))));
});
