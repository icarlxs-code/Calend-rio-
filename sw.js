/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-4bzkz4d2'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-WFLEIISD.js', 'dist/c-HHLTEN5T.js', 'dist/c-GEWFJHGT.js', 'dist/c-DKIC5VSL.js', 'dist/c-76HJISYK.js', 'dist/c-HQHGZAXK.js', 'dist/c-7GVMBXN3.js', 'dist/c-C5CMHP4A.js', 'dist/c-AHEGOLRP.js', 'dist/c-YRHAH2NT.js', 'dist/c-7BVN76RL.js', 'dist/c-7XTWFVIG.js', 'dist/c-CD3LELUT.js', 'dist/c-IO54KLRN.js', 'dist/c-NIBASCHH.js', 'dist/c-UKRBJKD2.js', 'dist/c-VXQCXGFO.js', 'dist/c-AMSN6LZQ.js', 'dist/c-33DONZ5K.js', 'dist/c-T67QUIN4.js', 'dist/c-6B375V6L.js', 'dist/c-VWK2CQXA.js', 'dist/c-44YTE6EJ.js', 'dist/c-SHFMFF67.js', 'dist/c-E2SYICHR.js', 'dist/c-GY2QFPKU.js', 'dist/c-NGIVWFOT.js', 'dist/c-SWXRF6H6.js', 'dist/c-NY2QK6PV.js', 'dist/c-66XZN5VB.js', 'dist/c-B5QFP4FF.js', 'dist/c-I75AAJN7.js', 'dist/c-DJMLBI4M.js', 'dist/c-RQXO5WZ6.js', 'dist/c-CDAJBU25.js', 'dist/c-MSLGDSJR.js', 'dist/c-HSUD3A3C.js', 'dist/c-CPWI2FNE.js', 'dist/c-DPZBO4GV.js', 'dist/c-HWVDZTJW.js', 'dist/c-MQ2OEJFP.js', 'dist/c-6ITICOUX.js', 'dist/c-RARQSQBD.js', 'dist/a-4BZKZ4D2.js', 'dist/c-7BCGVALS.js', 'dist/c-WWMNFOEA.js', 'dist/c-VY7VIPQG.js', 'dist/c-EK2MMQ3C.js', 'dist/c-OUVVO5FV.js', 'dist/c-OEKGHV4L.js', 'dist/c-K63ONBDY.js', 'dist/c-L6PW247E.js', 'dist/c-6JTAWARB.js', 'dist/c-XUQVVH25.js', 'dist/c-EOZUG7L7.js', 'dist/c-LKKTKGRL.js', 'dist/c-OWOSNCDK.js', 'dist/c-ZJAFRIPI.js', 'dist/c-R5DXHYTV.js', 'dist/c-LK6GXHWD.js', 'dist/c-7ACZFC3I.js', 'dist/c-GXCFQAKS.js', 'dist/c-6PVVLET6.js', 'dist/c-BZVPSK7C.js', 'dist/c-WVVFA3YP.js', 'dist/c-PDVT2M4Y.js', 'dist/c-GZN3HHFD.js', 'dist/c-NK5OOVFW.js', 'dist/c-UY7PKGSX.js', 'dist/c-A3GGYHYZ.js', 'dist/c-JMVJ3HVU.js', 'dist/c-C46R3EGD.js', 'dist/c-F2DIITXZ.js', 'dist/c-R3SEEGHU.js', 'dist/c-LISODL6D.js', 'dist/c-EOZP6RTU.js', 'dist/c-OUWJPLFY.js', 'dist/c-SLYUS4NG.js', 'dist/c-DMRK45NH.js', 'dist/c-IRRLC4F2.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-55MO4WGQ.js', 'dist/c-SS6SU2PF.js', 'dist/c-KFMKKP6P.js', 'dist/c-3VF3KZPI.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-MPTN5RTT.js', 'dist/c-3G2NLLBU.js',
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
