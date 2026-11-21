/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-qgsv7asf'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-XWM5IFPN.js', 'dist/c-DO4ZSMXD.js', 'dist/c-3UUYOZQX.js', 'dist/c-TAY2JBLF.js', 'dist/c-KKEIO4HO.js', 'dist/c-PNFOHZE2.js', 'dist/c-LMJQDK32.js', 'dist/c-Q5IWRV5A.js', 'dist/c-JK6XFRHF.js', 'dist/c-NMIBJWU4.js', 'dist/c-UHISTTQQ.js', 'dist/c-Z3635C44.js', 'dist/c-6RWPHPVY.js', 'dist/c-IVSVI27X.js', 'dist/c-YQIME6H5.js', 'dist/c-H75VP4IZ.js', 'dist/c-WMG2NKYF.js', 'dist/c-LEXVZRCZ.js', 'dist/a-QGSV7ASF.js', 'dist/c-3JZ2OZKB.js', 'dist/c-IQ6DGQOL.js', 'dist/c-MKHVB7BD.js', 'dist/c-FFCLKSN6.js', 'dist/c-5XCBFSBT.js', 'dist/c-HHZFLHLI.js', 'dist/c-UDZ24XCO.js', 'dist/c-PBHVFTGD.js', 'dist/c-JSHXCXPR.js', 'dist/c-XWA2FAVS.js', 'dist/c-RXJTB5GZ.js', 'dist/c-TH5SZ3QG.js', 'dist/c-2MEVFI63.js', 'dist/c-DCRMTMMO.js', 'dist/c-LK34J76P.js', 'dist/c-C5SASHPN.js', 'dist/c-JECGVN66.js', 'dist/c-WL74NBEL.js', 'dist/c-XA2XAVKC.js', 'dist/c-5M4NJ6KG.js', 'dist/c-APDRR2BO.js', 'dist/c-6PVVLET6.js', 'dist/c-WTCYRJNC.js', 'dist/c-QIGM7RV5.js', 'dist/c-4YHAKIW5.js', 'dist/c-HFQNHPBJ.js', 'dist/c-FQJ5CCBF.js', 'dist/c-M4BGKEOZ.js', 'dist/c-XPYX4TXQ.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-PVDXWGYP.js', 'dist/c-ZL5OENJV.js', 'dist/c-LQRWGXTC.js', 'dist/c-QDOSBFAB.js',
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
  // vídeo: o iPhone pede em pedaços (Range); deixa o navegador cuidar direto
  if (url.pathname.endsWith('.mp4')) return;
  // abertura animada: quadros sempre do celular (instantâneo e sem internet)
  if (url.pathname.includes('/media/intro5/')) {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    })));
    return;
  }
  // demais arquivos: rede primeiro (para receber atualizações); cache se estiver offline
  // "no-cache": sempre confere com o servidor se há versão nova (evita ficar preso numa versão antiga)
  const req = e.request.mode === 'navigate' ? e.request.url : e.request;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))),
  );
});

/* ---------- notificações ---------- */
self.addEventListener('push', (e) => {
  let d = {};
  try {
    d = e.data ? e.data.json() : {};
  } catch {
    d = { title: 'Lembra', body: e.data ? e.data.text() : '' };
  }
  const jobs = [
    self.registration.showNotification(d.title || 'Lembra', {
      body: d.body || '',
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      tag: d.tag || undefined,
      renotify: !!d.tag,
      data: { url: d.url || './' },
    }),
  ];
  // número no ícone do app (tarefas pendentes de hoje)
  if (typeof d.badge === 'number' && self.navigator.setAppBadge) {
    jobs.push((d.badge > 0 ? self.navigator.setAppBadge(d.badge) : self.navigator.clearAppBadge()).catch(() => {}));
  }
  e.waitUntil(Promise.all(jobs));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  // segurança: só abre telas do próprio app (nunca um site de fora, mesmo que a mensagem traga outro endereço)
  let target = self.registration.scope;
  try {
    const u = new URL(e.notification.data?.url || './', self.registration.scope);
    if (u.origin === self.location.origin && u.href.startsWith(self.registration.scope) && /^(#\/[\w/-]{0,120})?$/.test(u.hash)) target = u.href;
  } catch { /* endereço inválido: abre o início */ }
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      const c = cs.find((x) => x.url.startsWith(self.registration.scope));
      if (c) {
        c.postMessage({ type: 'open', url: target });
        return c.focus();
      }
      // abriu pelo aviso: o app conta isso (ajuda a acertar o melhor horário dos próximos avisos)
      let t2 = target; try { const u = new URL(target); u.searchParams.set('src', 'notif'); t2 = u.href; } catch { /* ok */ }
      return self.clients.openWindow(t2);
    }),
  );
});
