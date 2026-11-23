/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-nfxg6gdg'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-4NOBCBDC.js', 'dist/c-XLGWN2FQ.js', 'dist/c-7OS5XFTX.js', 'dist/c-6YWVTUTU.js', 'dist/c-2AIFNQTE.js', 'dist/c-TSCATMO6.js', 'dist/c-KSQ3WFY2.js', 'dist/c-NZZTKDVX.js', 'dist/c-E3RI227I.js', 'dist/c-44SP2L7V.js', 'dist/c-KMIPTGG2.js', 'dist/c-BBZSZMBD.js', 'dist/c-CQMPTEXZ.js', 'dist/c-ETOZVJ4I.js', 'dist/c-DPEA44M2.js', 'dist/c-XFSJP4OY.js', 'dist/c-VPPKXQHD.js', 'dist/c-HOT2HDYZ.js', 'dist/c-6X7LDCTN.js', 'dist/c-RPCFHLAC.js', 'dist/c-MJSYFPSP.js', 'dist/c-TBEGRLSL.js', 'dist/c-5CW5Q4BT.js', 'dist/c-23SX3EMD.js', 'dist/c-ESHF4C2D.js', 'dist/c-W7XXXGX4.js', 'dist/c-U6E7NSKW.js', 'dist/c-YRU4JXAW.js', 'dist/c-UQRXQRSV.js', 'dist/c-JW7WXDGR.js', 'dist/c-DTMWFIL5.js', 'dist/c-I75AAJN7.js', 'dist/c-SKEPIDFP.js', 'dist/c-PR2W6I7P.js', 'dist/a-NFXG6GDG.js', 'dist/c-JDIP7US4.js', 'dist/c-LADAEK24.js', 'dist/c-ERN7NVUS.js', 'dist/c-XQ65GMTS.js', 'dist/c-VJBJQZVX.js', 'dist/c-ECEUR73E.js', 'dist/c-UENFD2PZ.js', 'dist/c-KM6Y6YZX.js', 'dist/c-25FHNKSM.js', 'dist/c-WQI6EDXM.js', 'dist/c-GDNT7U5T.js', 'dist/c-2IGNFKKT.js', 'dist/c-GW3RWWXV.js', 'dist/c-2ESPXHHG.js', 'dist/c-6Y6TUYOC.js', 'dist/c-TC7M4YQY.js', 'dist/c-6PVVLET6.js', 'dist/c-MGTPZUN3.js', 'dist/c-JSI3LAF7.js', 'dist/c-WKS56G54.js', 'dist/c-IDTKONJR.js', 'dist/c-43GDR632.js', 'dist/c-XS6RSKZ5.js', 'dist/c-5QI4QGM4.js', 'dist/c-Q4J7C4JJ.js', 'dist/c-K7OCHRSM.js', 'dist/c-J2ENOY4W.js', 'dist/c-7YQ7RVDE.js', 'dist/c-EAO6H6YM.js', 'dist/c-2WS4FWE5.js', 'dist/c-7MC6NOXC.js', 'dist/c-BRVTFY66.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-KMB2UJEK.js', 'dist/c-WNVIXEII.js', 'dist/c-DWBEWQEH.js', 'dist/c-4G6P2CFT.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-TPZLRKKC.js', 'dist/c-PS34WZPS.js',
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
