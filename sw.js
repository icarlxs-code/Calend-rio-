/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-ypqvwun6'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-LMZWQARX.js', 'dist/c-EYOR7YN2.js', 'dist/c-OUO73FDN.js', 'dist/c-5OIODXJU.js', 'dist/c-NHMSOX54.js', 'dist/c-NNMR7NWL.js', 'dist/c-CAGFZFZU.js', 'dist/c-X6USO7G3.js', 'dist/c-T4XSVPOJ.js', 'dist/c-33KQ7IVI.js', 'dist/c-72BVIGSI.js', 'dist/c-E7DRPS2Z.js', 'dist/c-HVF22KAZ.js', 'dist/c-NCUDKEN6.js', 'dist/c-JGVSK2MO.js', 'dist/c-2FFKRPPU.js', 'dist/c-S3GBJ7L5.js', 'dist/c-SBUQUOCW.js', 'dist/c-GYWSHN5M.js', 'dist/c-2OK36JTB.js', 'dist/c-NST624LQ.js', 'dist/c-REYQXEZC.js', 'dist/c-LGFYJ3LB.js', 'dist/c-Q6NXNS5M.js', 'dist/c-RTBF47US.js', 'dist/c-LGQBUJDC.js', 'dist/c-7NCCEMFE.js', 'dist/c-OEM4NLPU.js', 'dist/c-C44MNALS.js', 'dist/c-I75AAJN7.js', 'dist/c-CPNMNWF5.js', 'dist/c-7YNHV5AP.js', 'dist/c-3YWUBPNS.js', 'dist/c-A2QMYMG3.js', 'dist/c-O5E7QKCY.js', 'dist/c-6ZMNPVDS.js', 'dist/c-MHHN6SIW.js', 'dist/c-LETVCMVN.js', 'dist/c-AWHZJWA4.js', 'dist/c-S42HDVXL.js', 'dist/c-H45L6ZGX.js', 'dist/c-HMCLDYR5.js', 'dist/c-6RLY3J33.js', 'dist/c-VHAHNYLY.js', 'dist/c-7KZ5FVKH.js', 'dist/c-H7M7UUBW.js', 'dist/c-7B7DX457.js', 'dist/c-WOSXUNFU.js', 'dist/c-2RFU5SG5.js', 'dist/c-YU7QRXA4.js', 'dist/a-YPQVWUN6.js', 'dist/c-K5AZGAKH.js', 'dist/c-7LXWWSBA.js', 'dist/c-JXG4TNAG.js', 'dist/c-7VEVPJAK.js', 'dist/c-5I4LMAMN.js', 'dist/c-MUE6I2OX.js', 'dist/c-RPQ43HCO.js', 'dist/c-L42O6GNZ.js', 'dist/c-N3AV54FA.js', 'dist/c-SLV4XZIM.js', 'dist/c-ZHRDHK6V.js', 'dist/c-7T4CMJNN.js', 'dist/c-D4Z2CGD6.js', 'dist/c-N4LD7FOU.js', 'dist/c-TAHZZ325.js', 'dist/c-IEGIXZNI.js', 'dist/c-6TSSSITY.js', 'dist/c-YX2EPCBO.js', 'dist/c-YBB5CIFC.js', 'dist/c-2XV252HJ.js', 'dist/c-FQ3DTYVO.js', 'dist/c-QOI5LFBO.js', 'dist/c-AQ6UW4FF.js', 'dist/c-GNJ75EGI.js', 'dist/c-6PVVLET6.js', 'dist/c-5KDN44MS.js', 'dist/c-ENRT2J7G.js', 'dist/c-5G6BAX7Y.js', 'dist/c-KXOUXPXF.js', 'dist/c-G7OREPRN.js', 'dist/c-G3JWQKNW.js', 'dist/c-LKTDQSPL.js', 'dist/c-3LFYAACX.js', 'dist/c-QAFPIUQ7.js', 'dist/c-M2CQSOVQ.js', 'dist/c-66KIIOKU.js', 'dist/c-SQD4OE56.js', 'dist/c-CTYHYL7U.js', 'dist/c-7M36KLDR.js', 'dist/c-77XE3D7E.js', 'dist/c-RBNKT5MD.js', 'dist/c-UVAJVIDX.js', 'dist/c-CMPLJCVX.js', 'dist/c-N2CHLRDF.js', 'dist/c-CIEJVWQB.js', 'dist/c-3VF3KZPI.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-MPTN5RTT.js', 'dist/c-RBQLKMQD.js', 'dist/c-MPQC26Q2.js', 'dist/c-3YWITPWG.js', 'dist/c-IRRLC4F2.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-V7PUCKXZ.js',
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
  if (/\/(media\/emblemas|assets\/mascot|assets\/fundos|assets\/stories|media\/marca)\//.test(url.pathname)) {
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
/* dados da frase que vieram no aviso (só texto curto e conhecido) */
function dados(x) {
  x = x && typeof x === 'object' ? x : {};
  const t = (k, n, re) => { const v = String(x[k] || '').slice(0, n); return !re || re.test(v) ? v : ''; };
  return { id: t('id', 40, /^[A-Za-z0-9-]*$/), cat: t('cat', 20, /^[a-z]*$/), fid: t('fid', 60, /^[a-z0-9-]*$/), t: t('t', 8, /^[a-z]*$/), arte: t('arte', 320), eyebrow: t('eyebrow', 80), ref: t('ref', 60), remedio: t('remedio', 80), corpo: t('corpo', 300) };
}
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
      data: { url: d.url || './', title: d.title || '', body: d.body || '', kind: d.kind || '', tag: d.tag || '', ...dados(d.data) },
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
  const notif = { title: String(dd.title || e.notification.title || '').slice(0, 200), body: String(dd.body || e.notification.body || '').slice(0, 1000), kind: String(dd.kind || '').slice(0, 20), tag: String(dd.tag || '').slice(0, 40), ...dados(dd), at: Date.now() };
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
