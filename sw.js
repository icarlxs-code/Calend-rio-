/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-4blgm2th'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-NJ3ALYLF.js', 'dist/c-RJPIKSF7.js', 'dist/c-SQJDSTIQ.js', 'dist/c-QBS4MCGU.js', 'dist/c-EPSOHCNB.js', 'dist/c-BV4DLTKM.js', 'dist/c-SD42HWPV.js', 'dist/c-KMCHKNO6.js', 'dist/c-SUJWHUPB.js', 'dist/c-JW7WXDGR.js', 'dist/c-PBS76XOQ.js', 'dist/c-24XKNKGB.js', 'dist/c-FEDFV46I.js', 'dist/c-7N7GEDTL.js', 'dist/c-AXJFCOHZ.js', 'dist/c-BO5U4SHO.js', 'dist/c-NHHK43FD.js', 'dist/c-3ZFW25XB.js', 'dist/c-5XB33HUY.js', 'dist/c-CUDSC2Z7.js', 'dist/c-HEDOBTSG.js', 'dist/c-PTMF3SOI.js', 'dist/c-S6LMLTCD.js', 'dist/c-C4IUCYG5.js', 'dist/a-4BLGM2TH.js', 'dist/c-HG4RPEZ2.js', 'dist/c-OF44MR4E.js', 'dist/c-WNVIXEII.js', 'dist/c-VXO5SREK.js', 'dist/c-BZO3VZJC.js', 'dist/c-QKQCUBO2.js', 'dist/c-ZP5NGN3L.js', 'dist/c-QHAXCOT5.js', 'dist/c-YM5XWM7N.js', 'dist/c-OGWTGDXX.js', 'dist/c-2JOUSIHP.js', 'dist/c-FADHAPGA.js', 'dist/c-N6UCOP4T.js', 'dist/c-NMLAOALZ.js', 'dist/c-CGYO2FWT.js', 'dist/c-GSTGWK7Z.js', 'dist/c-LY6JVL26.js', 'dist/c-WG46JVES.js', 'dist/c-YOIEMZCB.js', 'dist/c-TLOBOSAR.js', 'dist/c-DHEGETI6.js', 'dist/c-ZWPVWEJX.js', 'dist/c-6PVVLET6.js', 'dist/c-3ABERBOS.js', 'dist/c-Q4J7C4JJ.js', 'dist/c-JUFNEOMC.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-TISDOUMX.js', 'dist/c-4G6P2CFT.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-BRVTFY66.js', 'dist/c-TPZLRKKC.js', 'dist/c-B6TLGICE.js',
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
  const req = nav ? e.request.url : e.request;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        // abertura que passou por redirecionamento (endereço antigo, barra no fim…): manda o navegador seguir
        // o endereço final. O Safari recusa uma resposta "redirecionada" vinda do service worker
        // ("Response served by service worker has redirections").
        if (res.redirected && nav) return Response.redirect(res.url, 302);
        if (res.redirected && new URL(res.url).origin !== location.origin) return res; // arquivo vindo do endereço novo: usa, mas não guarda
        if (res.ok && res.status === 200 && !res.redirected) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      // sem internet: o que estiver guardado no celular (sempre "limpo" de redirecionamento)
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || (nav ? caches.match('index.html').then((x) => x || caches.match('./')) : null)).then((r) => (r ? unredirect(r) : Response.error()))),
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
