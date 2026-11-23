/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-2h6k7rle'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-6GGRJ4GY.js', 'dist/c-43BLZVG4.js', 'dist/c-DTK5CNA2.js', 'dist/c-MWYBBLHT.js', 'dist/c-AT227VAS.js', 'dist/c-FTIAQGWL.js', 'dist/c-BGXVFSI4.js', 'dist/c-ZQ3FYZHX.js', 'dist/c-W63FJYVA.js', 'dist/c-5ZC32EJR.js', 'dist/c-ESHOBXWD.js', 'dist/c-H2DARJYV.js', 'dist/c-6WAJUCKJ.js', 'dist/c-EMU6ACDD.js', 'dist/c-3IJ6TQT6.js', 'dist/c-IARAY564.js', 'dist/c-FGN2SL4U.js', 'dist/c-CYBFNLSZ.js', 'dist/c-GHTZDYYD.js', 'dist/c-I2MRM2HX.js', 'dist/c-DUQJ2OY7.js', 'dist/c-4ONRPIAZ.js', 'dist/c-CUUYOOLX.js', 'dist/c-LHCMBETF.js', 'dist/c-JW7WXDGR.js', 'dist/c-IXYPBUDV.js', 'dist/c-I75AAJN7.js', 'dist/c-W6ZM7NY6.js', 'dist/c-EDP3FKV5.js', 'dist/c-MFRC5JU4.js', 'dist/c-ILUFU43N.js', 'dist/c-PYD6LRLY.js', 'dist/c-MVX7UEIT.js', 'dist/c-JU5UX7J4.js', 'dist/c-OVDD2UWY.js', 'dist/c-DIXRJEOW.js', 'dist/c-WIBZLGXM.js', 'dist/c-CFWFOI7W.js', 'dist/c-7HVQQCIV.js', 'dist/a-2H6K7RLE.js', 'dist/c-4LFEAOUS.js', 'dist/c-B7WF226D.js', 'dist/c-SFHYTXB3.js', 'dist/c-EWJMMRNM.js', 'dist/c-B2DTIF3Q.js', 'dist/c-5CXLVIZJ.js', 'dist/c-HV4IJBF5.js', 'dist/c-IQJ6XMD7.js', 'dist/c-2XYV6Q6R.js', 'dist/c-QLHQ3YSZ.js', 'dist/c-ETGHQ7QW.js', 'dist/c-HK3FTWJA.js', 'dist/c-RTSMW2QG.js', 'dist/c-RQCAM5YY.js', 'dist/c-DNYV3OJV.js', 'dist/c-3VGO5YKC.js', 'dist/c-VXXVLUNJ.js', 'dist/c-6PVVLET6.js', 'dist/c-65KGPFMW.js', 'dist/c-JGWMIVEW.js', 'dist/c-AKTCBD5A.js', 'dist/c-WXE6G2GN.js', 'dist/c-WIMKQ3NF.js', 'dist/c-O54I4QAW.js', 'dist/c-QVERK62R.js', 'dist/c-WYA5ELFR.js', 'dist/c-ACX7HAXH.js', 'dist/c-4WKXV5ZB.js', 'dist/c-AXJ2JT4L.js', 'dist/c-A5SHTLGF.js', 'dist/c-ICD3QZQY.js', 'dist/c-K75JW2WA.js', 'dist/c-73TCWLZL.js', 'dist/c-DWBEWQEH.js', 'dist/c-NZD77CB2.js', 'dist/c-A554WOZN.js', 'dist/c-7KRDVDAM.js', 'dist/c-JVHB4KTR.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-4TIDMGXF.js', 'dist/c-3VF3KZPI.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-RGPLEEPW.js',
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
