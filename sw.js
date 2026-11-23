/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-q2koaj4l'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-RBNPUO7J.js', 'dist/c-GNAJMFYT.js', 'dist/c-GW7PHFXP.js', 'dist/c-FSRY72KZ.js', 'dist/c-SKOCPDZP.js', 'dist/c-QL4MS3UT.js', 'dist/c-FAM3G6P5.js', 'dist/c-I62SFLAV.js', 'dist/c-EVOOLBCF.js', 'dist/c-URHZCOZ4.js', 'dist/c-JTFDI5L5.js', 'dist/c-I434I7VQ.js', 'dist/c-3XCFF7IQ.js', 'dist/c-56DRRW2G.js', 'dist/c-ZN54TUTL.js', 'dist/c-KHMVVD5O.js', 'dist/c-6DBO6Z6U.js', 'dist/c-KFLNCXJK.js', 'dist/c-YZOIHE33.js', 'dist/c-ZH6QSUQW.js', 'dist/c-2E2DSLT7.js', 'dist/c-STGSED7V.js', 'dist/c-3IHNT5G6.js', 'dist/c-MX4A7TGR.js', 'dist/c-JW7WXDGR.js', 'dist/c-RVVRW2ZS.js', 'dist/c-I75AAJN7.js', 'dist/c-64PUBAT5.js', 'dist/c-T3ZTLBAC.js', 'dist/c-F6QAX4RI.js', 'dist/c-HVJGETTJ.js', 'dist/c-32NUM6QQ.js', 'dist/c-GUSQBVT3.js', 'dist/c-FDZYYNPL.js', 'dist/c-RRMFZQIU.js', 'dist/c-STCTJZC4.js', 'dist/c-J752HGFB.js', 'dist/c-FI57S7OZ.js', 'dist/c-J3OYKTOA.js', 'dist/a-Q2KOAJ4L.js', 'dist/c-NR7VTSCT.js', 'dist/c-NUFBZWKP.js', 'dist/c-E7KLYPI6.js', 'dist/c-2A3NOTQK.js', 'dist/c-DF3DXDGA.js', 'dist/c-VUQ5NLW7.js', 'dist/c-GC5HR3WO.js', 'dist/c-PV4EEEUR.js', 'dist/c-LLPD6CCN.js', 'dist/c-7XTWZ4M7.js', 'dist/c-ETGHQ7QW.js', 'dist/c-JT2PWFV3.js', 'dist/c-HTP2X3JS.js', 'dist/c-X5WHHUEQ.js', 'dist/c-YY77CY5U.js', 'dist/c-PLS6MA4C.js', 'dist/c-HBZN2HUO.js', 'dist/c-6PVVLET6.js', 'dist/c-NLUSKQDB.js', 'dist/c-J2HDNWLS.js', 'dist/c-UHOYAROP.js', 'dist/c-E25N2PID.js', 'dist/c-4XA3RC3A.js', 'dist/c-O54I4QAW.js', 'dist/c-MFMUU3JD.js', 'dist/c-DZIS5KOZ.js', 'dist/c-4W5KHAXL.js', 'dist/c-ZRFLSPB2.js', 'dist/c-2SRIJLXJ.js', 'dist/c-KDNIHCXH.js', 'dist/c-7KO3DD3N.js', 'dist/c-HBNQUDFB.js', 'dist/c-73TCWLZL.js', 'dist/c-DWBEWQEH.js', 'dist/c-7O6CUIUJ.js', 'dist/c-7ZEIULR5.js', 'dist/c-6QIQGOZN.js', 'dist/c-KIXFJ5N3.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-KQ2IADGC.js', 'dist/c-3VF3KZPI.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-WMUAXNWE.js',
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== MEDIA && k !== 'lembra-stories-v1').map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // vídeo: o iPhone pede em pedaços (Range); deixa o navegador cuidar direto
  if (url.pathname.endsWith('.mp4')) return;
  // emblemas, brasões, peças do mascote e fundos: ficam guardados no celular (abrem na hora, mesmo sem internet)
  // e são conferidos em segundo plano; o cache deles não é apagado a cada versão
  if (/\/(media\/emblemas|assets\/mascot|assets\/fundos|media\/marca)\//.test(url.pathname)) {
    e.respondWith(caches.open(MEDIA).then((c) => c.match(e.request, { ignoreSearch: true }).then((hit) => {
      const net = fetch(e.request).then((res) => { if (res.ok && res.status === 200 && !res.redirected) c.put(e.request, res.clone()); return res; }).catch(() => hit || Response.error());
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net;
    })));
    return;
  }
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
