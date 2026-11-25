/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-4qoro7dr'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-7VFBYTO4.js', 'dist/c-ZMUUTAJJ.js', 'dist/c-BFQOSYAT.js', 'dist/c-C4TR2FV4.js', 'dist/c-FE7K6MPD.js', 'dist/c-7OQUNS5S.js', 'dist/c-MJSZYK7F.js', 'dist/c-2QQMEQYQ.js', 'dist/c-3HXSGYIK.js', 'dist/c-5ZGACLVE.js', 'dist/c-IGBGQIWF.js', 'dist/c-XBP4T4NE.js', 'dist/c-VA4KM427.js', 'dist/c-JDU4Y6DK.js', 'dist/c-FNQVKHV3.js', 'dist/c-FD6VDHJB.js', 'dist/c-NOOSIB3G.js', 'dist/c-SIZZI2AR.js', 'dist/c-G4BYWUIL.js', 'dist/c-IVAMUCET.js', 'dist/c-FAXD4ANB.js', 'dist/c-H43WL3TY.js', 'dist/c-PQCL76Z4.js', 'dist/c-IKCX5MIV.js', 'dist/c-GFUYVV5D.js', 'dist/c-EBQIOR6M.js', 'dist/c-4ZD5JUCA.js', 'dist/c-6VCNNKNZ.js', 'dist/c-2UU6DT7A.js', 'dist/c-POALB3P4.js', 'dist/c-BJR7SEHH.js', 'dist/c-U2Y6ODZC.js', 'dist/c-SZN57GPP.js', 'dist/c-EKIPM56A.js', 'dist/c-JPDRI4IV.js', 'dist/c-LHUPQJIJ.js', 'dist/c-OEM4NLPU.js', 'dist/c-PZFS5KV2.js', 'dist/c-I75AAJN7.js', 'dist/c-C3QWSWZL.js', 'dist/c-OUWXJYJV.js', 'dist/c-XSKP3PXZ.js', 'dist/c-IHV2XWEG.js', 'dist/c-H2GDSYMZ.js', 'dist/c-HZIC5NDQ.js', 'dist/c-BFVP53Z6.js', 'dist/c-IAB7Z4NX.js', 'dist/a-4QORO7DR.js', 'dist/c-DBQQREG2.js', 'dist/c-X2FVBKTZ.js', 'dist/c-HYCSTJFR.js', 'dist/c-IWDFII44.js', 'dist/c-TC2RJKCX.js', 'dist/c-ALBTBVJ5.js', 'dist/c-RRYPNWRK.js', 'dist/c-IVQKJXGN.js', 'dist/c-NCUPMQ2F.js', 'dist/c-CS2PWDI5.js', 'dist/c-RL4WNWTP.js', 'dist/c-DQP4MCES.js', 'dist/c-HIUIO3LH.js', 'dist/c-5UCKRV2G.js', 'dist/c-2YQRXHXA.js', 'dist/c-FTS5XASS.js', 'dist/c-MSQ6SS6A.js', 'dist/c-AX43AF6D.js', 'dist/c-53GAVHZV.js', 'dist/c-FQ3DTYVO.js', 'dist/c-52C6TV6S.js', 'dist/c-V5X3KGNK.js', 'dist/c-6PVVLET6.js', 'dist/c-5KDN44MS.js', 'dist/c-AESAU6CF.js', 'dist/c-GIXRYQJP.js', 'dist/c-NUU7KQ4M.js', 'dist/c-BBDHVRG2.js', 'dist/c-752F7W4O.js', 'dist/c-67IH2ESP.js', 'dist/c-NIXEHK3H.js', 'dist/c-KYJE7J6S.js', 'dist/c-ZH7C6UKM.js', 'dist/c-THQ6QCZA.js', 'dist/c-KTNO3OLK.js', 'dist/c-SXS7TRPL.js', 'dist/c-LO2WO46F.js', 'dist/c-24UOX5PX.js', 'dist/c-USCFCPI3.js', 'dist/c-CCLNF445.js', 'dist/c-2GCPY3KG.js', 'dist/c-VRKQB7LR.js', 'dist/c-3VF3KZPI.js', 'dist/c-MPTN5RTT.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-TSTT5A4Y.js', 'dist/c-MPQC26Q2.js', 'dist/c-BZUKNJTU.js', 'dist/c-IRRLC4F2.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-F6Q54LUN.js',
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== MEDIA && k !== 'lembra-stories-v1' && k !== 'lembra-notif').map((k) => caches.delete(k)))).then(() => self.clients.claim()),
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
      data: { url: d.url || './', title: d.title || '', body: d.body || '', kind: d.kind || '', tag: d.tag || '' },
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
  // a frase (motivacional, bíblica, dica…) abre dentro do app: guarda o aviso pro app mostrar quando carregar
  const dd = e.notification.data || {};
  const notif = { title: String(dd.title || e.notification.title || '').slice(0, 200), body: String(dd.body || e.notification.body || '').slice(0, 1000), kind: String(dd.kind || '').slice(0, 20), tag: String(dd.tag || '').slice(0, 40), at: Date.now() };
  const guarda = caches.open('lembra-notif').then((c) => c.put('/__notif', new Response(JSON.stringify(notif), { headers: { 'Content-Type': 'application/json' } }))).catch(() => {});
  e.waitUntil(guarda.then(() =>
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      const c = cs.find((x) => x.url.startsWith(self.registration.scope));
      if (c) {
        c.postMessage({ type: 'open', url: target, notif });
        return c.focus();
      }
      // abriu pelo aviso: o app conta isso (ajuda a acertar o melhor horário dos próximos avisos)
      let t2 = target; try { const u = new URL(target); u.searchParams.set('src', 'notif'); t2 = u.href; } catch { /* ok */ }
      return self.clients.openWindow(t2);
    })),
  );
});
