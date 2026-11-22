/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-ufeyi7o7'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-5GXXL2KJ.js', 'dist/c-YUZUODHS.js', 'dist/c-JZ54NXQS.js', 'dist/c-OQ7FHOU4.js', 'dist/c-Q23562KP.js', 'dist/c-4JUEENUN.js', 'dist/c-6FFM56VH.js', 'dist/c-35FZBQHJ.js', 'dist/c-KQAZIF5X.js', 'dist/c-CG4CILC3.js', 'dist/c-ZECKM7CU.js', 'dist/c-WWEXQ7J2.js', 'dist/c-IXM6YN6P.js', 'dist/c-JW7WXDGR.js', 'dist/c-4QP5TQPO.js', 'dist/c-P6MUTTGX.js', 'dist/c-B6VIV3GW.js', 'dist/c-W3AW5NKD.js', 'dist/c-CNS7VS34.js', 'dist/c-4J5KWNXS.js', 'dist/c-WGH74DEU.js', 'dist/c-HUTUNXYT.js', 'dist/c-UUQDQLFN.js', 'dist/c-S4RDAZSV.js', 'dist/c-3MWYFVUJ.js', 'dist/c-RCYJWVBF.js', 'dist/a-UFEYI7O7.js', 'dist/c-XNPACGXA.js', 'dist/c-SQIRJL37.js', 'dist/c-CDL637ST.js', 'dist/c-64HS6HPI.js', 'dist/c-LP7YGVUV.js', 'dist/c-NPL44HZ6.js', 'dist/c-5UKS35OO.js', 'dist/c-POCPYLVD.js', 'dist/c-IG4AJKTG.js', 'dist/c-JAKHX4H5.js', 'dist/c-ZJEC6RRM.js', 'dist/c-Q3ZDGYG7.js', 'dist/c-CPT2LI3S.js', 'dist/c-XM7CNMCT.js', 'dist/c-7CFPPP3P.js', 'dist/c-6PVVLET6.js', 'dist/c-7ITRCZ2M.js', 'dist/c-H6QPEF3B.js', 'dist/c-4N7OQ5LA.js', 'dist/c-H6CEOQGW.js', 'dist/c-JG4KQR2B.js', 'dist/c-37PH5LAS.js', 'dist/c-VIFLTBOZ.js', 'dist/c-DWBEWQEH.js', 'dist/c-WE3D54I2.js', 'dist/c-6FXMHWZQ.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-TVNAMZDF.js', 'dist/c-YIGCTNA3.js', 'dist/c-WIDD6LQC.js', 'dist/c-PYXMSP7H.js', 'dist/c-4G6P2CFT.js', 'dist/c-BRVTFY66.js', 'dist/c-TPZLRKKC.js', 'dist/c-YBFISTKK.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-ZRNFXFQM.js',
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
