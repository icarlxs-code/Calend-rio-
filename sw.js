/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-srdlrg7a'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-WRYRB2MQ.js', 'dist/c-DUMWLWHN.js', 'dist/c-X6MBT7CJ.js', 'dist/c-3FMPJK3N.js', 'dist/c-3C3LSXZZ.js', 'dist/c-RWS76EUP.js', 'dist/c-TFFP4INZ.js', 'dist/c-THBHZCWQ.js', 'dist/c-G752TWB3.js', 'dist/c-BQLRHYS3.js', 'dist/c-VPHY2OW6.js', 'dist/c-UJUY5D4O.js', 'dist/c-TR5KDDSD.js', 'dist/c-C6OYU5KC.js', 'dist/c-BDSB4XQ6.js', 'dist/c-FVCSU66C.js', 'dist/c-M7JQ7PTK.js', 'dist/c-WBQCZUPQ.js', 'dist/c-BB2EZI3A.js', 'dist/c-Q5DXAEYN.js', 'dist/c-YMZV34HR.js', 'dist/c-FJTUGP65.js', 'dist/c-DTJ66F55.js', 'dist/c-YFJYQIK6.js', 'dist/c-JW7WXDGR.js', 'dist/c-YI6IDJPI.js', 'dist/c-I75AAJN7.js', 'dist/c-UBKO7SJ4.js', 'dist/c-UHA7FX65.js', 'dist/c-AORAVPBE.js', 'dist/c-3WD57WBN.js', 'dist/c-EK2KE5PS.js', 'dist/c-YJWIDQPT.js', 'dist/c-UL57WTNK.js', 'dist/c-E5WVLINM.js', 'dist/c-57G6BMVS.js', 'dist/c-F75CPEKN.js', 'dist/c-GQRHSRKD.js', 'dist/c-DLUCCDLI.js', 'dist/a-SRDLRG7A.js', 'dist/c-BDIAIFN7.js', 'dist/c-WHF5EEDP.js', 'dist/c-H6UVIS6F.js', 'dist/c-V5L5S3TJ.js', 'dist/c-ZDIBOIEJ.js', 'dist/c-RE2PKLST.js', 'dist/c-SPXUTIEO.js', 'dist/c-5JWQ6ZAE.js', 'dist/c-TQP6IZTI.js', 'dist/c-EBIUKIRO.js', 'dist/c-ETGHQ7QW.js', 'dist/c-A4LAMRJM.js', 'dist/c-5PW2AXJI.js', 'dist/c-EARKWQVU.js', 'dist/c-XWYHGWZL.js', 'dist/c-JDOLXQ7V.js', 'dist/c-YEQ5XREB.js', 'dist/c-6PVVLET6.js', 'dist/c-6SQNP2X5.js', 'dist/c-S4G6ANPC.js', 'dist/c-ILWWL4JY.js', 'dist/c-OM2L62BF.js', 'dist/c-2XFQERXZ.js', 'dist/c-O54I4QAW.js', 'dist/c-7FL2JLHL.js', 'dist/c-UN5BQ6JN.js', 'dist/c-AQS2OIYN.js', 'dist/c-MSQGGUZE.js', 'dist/c-XRTKZDKA.js', 'dist/c-BDAF2TUO.js', 'dist/c-MHZGZLXA.js', 'dist/c-L4FZAR7E.js', 'dist/c-73TCWLZL.js', 'dist/c-DWBEWQEH.js', 'dist/c-G3G3UGJI.js', 'dist/c-ZFYSH7RE.js', 'dist/c-Q6BWNKKZ.js', 'dist/c-3X53J4ZN.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-W7VIVO4T.js', 'dist/c-3VF3KZPI.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-C3ZIMZ22.js',
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
