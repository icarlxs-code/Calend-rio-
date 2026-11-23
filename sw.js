/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-c4di6wp5'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-UMMIG2F4.js', 'dist/c-LJI4SYDW.js', 'dist/c-L22JHFEN.js', 'dist/c-DIMXWQUV.js', 'dist/c-OBEWEZH5.js', 'dist/c-24XXH6V6.js', 'dist/c-SQGEUVNI.js', 'dist/c-EVN76CEC.js', 'dist/c-K533XSOW.js', 'dist/c-WZWUPTDP.js', 'dist/c-QRNMNBQO.js', 'dist/c-O2S2XTED.js', 'dist/c-ZMK3RKQQ.js', 'dist/c-P3TG5YYO.js', 'dist/c-YLY5LAYM.js', 'dist/c-NU5VFQXA.js', 'dist/c-643Z2G3B.js', 'dist/c-NXQ6BFP7.js', 'dist/c-V2E3OWSC.js', 'dist/c-BXIJGFXZ.js', 'dist/c-H56LYPC6.js', 'dist/c-N4JEWRXW.js', 'dist/c-6PY67RWL.js', 'dist/c-U7DCTCRK.js', 'dist/c-44RZKYBJ.js', 'dist/c-O376QAZB.js', 'dist/c-66XZN5VB.js', 'dist/c-MLAJCGT4.js', 'dist/c-I75AAJN7.js', 'dist/c-7YTYYLW6.js', 'dist/c-RMX4E2GT.js', 'dist/c-ZAPN3P2D.js', 'dist/c-OIVWV6NW.js', 'dist/c-CPB32LQO.js', 'dist/c-4XNSZRBT.js', 'dist/c-BV72RGZO.js', 'dist/c-VUXO3VEO.js', 'dist/c-JG3UT3SJ.js', 'dist/c-AWZHCQMZ.js', 'dist/c-VETCUNKC.js', 'dist/c-CWSQTS75.js', 'dist/a-C4DI6WP5.js', 'dist/c-MT7TJY5B.js', 'dist/c-SJQCDTTF.js', 'dist/c-YMZ726OP.js', 'dist/c-KYZ2XMWF.js', 'dist/c-7MRKBDN5.js', 'dist/c-PF3XJLW4.js', 'dist/c-KETB4FAZ.js', 'dist/c-FRNOBKUY.js', 'dist/c-IJ7ODZYL.js', 'dist/c-PL5YUGMV.js', 'dist/c-MUVX27UP.js', 'dist/c-3DOXAMIN.js', 'dist/c-HZJCQCSS.js', 'dist/c-CIEI4XVQ.js', 'dist/c-YPQYSL4P.js', 'dist/c-ECFWONEE.js', 'dist/c-MNL7KNG5.js', 'dist/c-6PVVLET6.js', 'dist/c-TIUWFAVA.js', 'dist/c-KORJHKPX.js', 'dist/c-KFDEYI2I.js', 'dist/c-WV5TU2HC.js', 'dist/c-C6MIREDD.js', 'dist/c-M4KV747Y.js', 'dist/c-6NJNTGAP.js', 'dist/c-K33XFDI3.js', 'dist/c-65LJRLUA.js', 'dist/c-4B2GDFUM.js', 'dist/c-O5DWIAEX.js', 'dist/c-DDORSTJF.js', 'dist/c-JSYZDQOA.js', 'dist/c-466CRGUK.js', 'dist/c-73TCWLZL.js', 'dist/c-DWBEWQEH.js', 'dist/c-DA4OR7N3.js', 'dist/c-PFCPEEHV.js', 'dist/c-JHGBPK5W.js', 'dist/c-FRPQWHDG.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-GIISU2CP.js', 'dist/c-3VF3KZPI.js', 'dist/c-MPTN5RTT.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-GFKCHTBL.js',
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
