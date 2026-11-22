/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-6gtvwzmg'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-J7ILGVBN.js', 'dist/c-H5CVV54T.js', 'dist/c-EENUAF6K.js', 'dist/c-O3T6XY4I.js', 'dist/c-R25MBOUV.js', 'dist/c-WNO3D74B.js', 'dist/c-YWRBKZQ2.js', 'dist/c-DC572OAA.js', 'dist/c-RP4PA7XE.js', 'dist/c-YQIXPGOP.js', 'dist/c-J24VTK2W.js', 'dist/c-4HH7OX3U.js', 'dist/c-3KHD3PA6.js', 'dist/c-XYTVBZDQ.js', 'dist/c-XPLJJSL5.js', 'dist/c-52C5IMGY.js', 'dist/c-23M2ATTU.js', 'dist/c-OWILP5EO.js', 'dist/c-N6COJDTA.js', 'dist/c-E2LIF4WH.js', 'dist/c-FB5HSMPK.js', 'dist/c-JW7WXDGR.js', 'dist/c-KW6K7DZP.js', 'dist/c-TY5NHR3W.js', 'dist/c-BTZP5NVU.js', 'dist/c-C4WUY4E3.js', 'dist/c-2JOF6GUR.js', 'dist/c-QOSVBAA4.js', 'dist/a-6GTVWZMG.js', 'dist/c-SYLULVUK.js', 'dist/c-RR2OCUXK.js', 'dist/c-XLUW4JSA.js', 'dist/c-JORH36DH.js', 'dist/c-KNMGETN3.js', 'dist/c-4L66B4TV.js', 'dist/c-ELOAQPUX.js', 'dist/c-CKVAYPCC.js', 'dist/c-XGSHXTTJ.js', 'dist/c-4N6YFUXC.js', 'dist/c-FOLSPV72.js', 'dist/c-SNZPUN2V.js', 'dist/c-TP4WJHPE.js', 'dist/c-WIDD6LQC.js', 'dist/c-TOLZGBC4.js', 'dist/c-PT2PLB3M.js', 'dist/c-WZFRB6KK.js', 'dist/c-WDQ27VWC.js', 'dist/c-Q4J7C4JJ.js', 'dist/c-CA27AOLC.js', 'dist/c-XQQXIXHB.js', 'dist/c-WNVIXEII.js', 'dist/c-I5TSO4SZ.js', 'dist/c-PSR3M55Q.js', 'dist/c-IOAMVS3Q.js', 'dist/c-AGSGFUOM.js', 'dist/c-E33QHG3A.js', 'dist/c-6PVVLET6.js', 'dist/c-TQCFEHV2.js', 'dist/c-XFHII5S4.js', 'dist/c-ENSWC7B7.js', 'dist/c-QVK7XZWZ.js', 'dist/c-BRVTFY66.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-4G6P2CFT.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-TPZLRKKC.js', 'dist/c-XRE53NEH.js',
];

self.addEventListener('install', (e) => {
  // guarda o app no celular (cada arquivo já "limpo": nunca uma resposta redirecionada)
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => fetch(u, { cache: 'no-cache' }).then(async (res) => {
    if (!res.ok) return;
    await c.put(u, res.redirected ? await unredirect(res) : res);
  }).catch(() => {})))).then(() => self.skipWaiting()));
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
  const nav = e.request.mode === 'navigate';
  // ABRIR A PÁGINA: com internet, o próprio Safari cuida (o service worker não se mete).
  // Assim nunca aparece "Response served by service worker has redirections".
  // Sem internet: entrega a cópia guardada no celular (limpa de redirecionamento).
  if (nav) {
    if (self.navigator.onLine !== false) return;
    e.respondWith(caches.match('index.html').then((x) => x || caches.match('./')).then((r) => (r ? unredirect(r) : Response.error())));
    return;
  }
  // demais arquivos: rede primeiro (para receber atualizações); cache se estiver offline
  // "no-cache": sempre confere com o servidor se há versão nova (evita ficar preso numa versão antiga)
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then((res) => {
        if (res.redirected && new URL(res.url).origin !== location.origin) return res; // arquivo vindo do endereço novo: usa, mas não guarda
        if (res.ok && res.status === 200 && !res.redirected) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => (r ? unredirect(r) : Response.error()))),
  );
});
/* resposta guardada que veio de um redirecionamento: vira uma resposta "nova", que o Safari aceita */
async function unredirect(r) {
  if (!r.redirected) return r;
  return new Response(await r.blob(), { status: r.status, statusText: r.statusText, headers: r.headers });
}

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
