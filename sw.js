/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-jp6ygzt4'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-4L7PYWFY.js', 'dist/c-7X337AHK.js', 'dist/c-3F5SQZND.js', 'dist/c-LHF37M35.js', 'dist/c-4IU36FPB.js', 'dist/c-ZEP7IM7X.js', 'dist/c-M3ZBBBZT.js', 'dist/c-5AYBDAZK.js', 'dist/c-OM46ARAA.js', 'dist/c-PDY5LDKO.js', 'dist/c-UESEJKEW.js', 'dist/c-BFWRJ35K.js', 'dist/c-4ONPDU2P.js', 'dist/c-EHZ4HOWF.js', 'dist/c-GLLR66SV.js', 'dist/c-NSOG4GX6.js', 'dist/c-RJSS3VSY.js', 'dist/c-XHESKNQB.js', 'dist/c-TOGUEIYP.js', 'dist/c-KIBETS3N.js', 'dist/c-ZITXCQ4S.js', 'dist/a-JP6YGZT4.js', 'dist/c-QAK5FPX3.js', 'dist/c-4R56HXZE.js', 'dist/c-SQQHXUPS.js', 'dist/c-Q7UHJZ4N.js', 'dist/c-CHKZWO24.js', 'dist/c-DACNT2RM.js', 'dist/c-E4MBWS6M.js', 'dist/c-ZTKAODX7.js', 'dist/c-4UW4ZCFI.js', 'dist/c-P5RZL2PV.js', 'dist/c-7RZCWITB.js', 'dist/c-QZJ4KI6T.js', 'dist/c-MQPGNZYM.js', 'dist/c-KYCL6DWF.js', 'dist/c-LTG6P7XQ.js', 'dist/c-L26MC5JA.js', 'dist/c-WJYAEZSL.js', 'dist/c-FC3EQ5LJ.js', 'dist/c-V7AW6ZU4.js', 'dist/c-AKBMQ34V.js', 'dist/c-FTDONEXB.js', 'dist/c-SM423ZOI.js', 'dist/c-6PVVLET6.js', 'dist/c-OGRZ2NXL.js', 'dist/c-Q4J7C4JJ.js', 'dist/c-XRZM3M6P.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-6OHH6P6N.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-4G6P2CFT.js', 'dist/c-BRVTFY66.js', 'dist/c-TPZLRKKC.js', 'dist/c-KNIJGAA2.js',
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
        // o app mudou de endereço (ex.: github.io → meulembra.com.br): a abertura segue o novo endereço.
        // Sem isto, o navegador recusa a resposta redirecionada e mostra uma página de erro.
        if (res.redirected && e.request.mode === 'navigate') return Response.redirect(res.url, 302);
        if (res.redirected && new URL(res.url).origin !== location.origin) return res; // arquivo vindo do endereço novo: usa, mas não guarda
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
