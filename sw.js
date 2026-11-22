/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-gb4fn7qp'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-REGQDX7N.js', 'dist/c-543Q5E65.js', 'dist/c-NXQJ52C7.js', 'dist/c-N7L5CTSN.js', 'dist/c-KNJODACO.js', 'dist/c-2NI6BEZC.js', 'dist/c-XFI3LOAA.js', 'dist/c-2W6KS3JU.js', 'dist/c-236P4ADJ.js', 'dist/c-JW7WXDGR.js', 'dist/c-7ZVGREKG.js', 'dist/c-UYSZR2HC.js', 'dist/c-QPFQKMOW.js', 'dist/c-LAQ6UCFC.js', 'dist/c-OJ7DESGR.js', 'dist/c-MCG2D3HS.js', 'dist/c-BORIELZX.js', 'dist/c-M2X7FDUZ.js', 'dist/c-P2CUUEVD.js', 'dist/c-TXR4ZYSB.js', 'dist/c-BHJXLJU3.js', 'dist/c-2TFMARSM.js', 'dist/c-JROAVEZP.js', 'dist/c-HVQFNZSH.js', 'dist/a-GB4FN7QP.js', 'dist/c-EK4AU4LG.js', 'dist/c-OZUDMOSI.js', 'dist/c-WNVIXEII.js', 'dist/c-KEVIUK64.js', 'dist/c-S2PEFHES.js', 'dist/c-4QZS2S6Z.js', 'dist/c-Y5KH7BGO.js', 'dist/c-6SIQZ2RL.js', 'dist/c-M6VFG7DP.js', 'dist/c-OZTEZS66.js', 'dist/c-5U3ADIMU.js', 'dist/c-FEE66XPA.js', 'dist/c-2Y4EXYPK.js', 'dist/c-I5TSXT3K.js', 'dist/c-GZL4D2BK.js', 'dist/c-6JXI3UKE.js', 'dist/c-QSZRGQWK.js', 'dist/c-JX347AYW.js', 'dist/c-2WTZG77E.js', 'dist/c-NDNCRMSJ.js', 'dist/c-C57AJYFC.js', 'dist/c-CGADN7WU.js', 'dist/c-6PVVLET6.js', 'dist/c-7JXIKB2N.js', 'dist/c-Q4J7C4JJ.js', 'dist/c-YPTZLWLY.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-DJZ2CNRK.js', 'dist/c-4G6P2CFT.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-BRVTFY66.js', 'dist/c-TPZLRKKC.js', 'dist/c-QMFOEAEL.js',
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
