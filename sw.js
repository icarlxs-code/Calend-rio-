/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-xmwbtk2s'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-WV5SUEOR.js', 'dist/c-D5XIT46M.js', 'dist/c-O4ALNGRG.js', 'dist/c-VMC3UUT3.js', 'dist/c-JOPXWBJJ.js', 'dist/c-FY2VSKJS.js', 'dist/c-H2FTVKYW.js', 'dist/c-M5BD2P5Q.js', 'dist/c-BOMEWMC6.js', 'dist/c-RK62F5LN.js', 'dist/c-ZQNC4UT4.js', 'dist/c-QOHSPI25.js', 'dist/c-44AW7C65.js', 'dist/c-U43HVL5R.js', 'dist/c-NBVLTGVM.js', 'dist/c-6JATCFW4.js', 'dist/c-52A3OSDJ.js', 'dist/c-IBAHC727.js', 'dist/a-XMWBTK2S.js', 'dist/c-3JZ2OZKB.js', 'dist/c-K2E6AUPD.js', 'dist/c-MY7MXRIS.js', 'dist/c-XSNWLYWR.js', 'dist/c-4RLKTLVR.js', 'dist/c-YGACEYLO.js', 'dist/c-IFRUWLAB.js', 'dist/c-D2FPDBYW.js', 'dist/c-UOBDPJAD.js', 'dist/c-YQF2MNEK.js', 'dist/c-UAWJPR6V.js', 'dist/c-7BVI4DAN.js', 'dist/c-76SRSHV4.js', 'dist/c-KGPF6OT5.js', 'dist/c-KXNU5BAV.js', 'dist/c-UNNRQD2B.js', 'dist/c-ASFGSPL2.js', 'dist/c-AXDMTUHH.js', 'dist/c-YRYXY6RY.js', 'dist/c-JJKMYMYA.js', 'dist/c-MPIIXGSC.js', 'dist/c-6PVVLET6.js', 'dist/c-42VHWGQT.js', 'dist/c-QIGM7RV5.js', 'dist/c-VUEO3RDN.js', 'dist/c-HFQNHPBJ.js', 'dist/c-FQJ5CCBF.js', 'dist/c-M4BGKEOZ.js', 'dist/c-3IWDVPSS.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-PVDXWGYP.js', 'dist/c-ZL5OENJV.js', 'dist/c-LQRWGXTC.js', 'dist/c-OLEXNASH.js',
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
