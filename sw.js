/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-hwbfjgm5'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-3RZ7H7VL.js', 'dist/c-W7ZMEPO2.js', 'dist/c-JFFUEPGN.js', 'dist/c-C2HCZW7L.js', 'dist/c-PUZKYYM4.js', 'dist/c-3DUF36VU.js', 'dist/c-SIRQN2CE.js', 'dist/c-FWFXZGAD.js', 'dist/c-WI4JTTLU.js', 'dist/c-QA4QZ36S.js', 'dist/c-MGKYWR6X.js', 'dist/c-XIXJENVP.js', 'dist/c-7JVE4RDV.js', 'dist/c-6QDCMI3G.js', 'dist/c-Y2CUY4NV.js', 'dist/c-QPFYHN5I.js', 'dist/c-VAO6M6IH.js', 'dist/c-YE677CNC.js', 'dist/c-K6KUXGJ4.js', 'dist/c-LRY62AN7.js', 'dist/c-EROLKZCW.js', 'dist/c-B7O7VGDF.js', 'dist/c-Y66G2GSL.js', 'dist/c-4IVTYTPA.js', 'dist/c-VBNDAIFG.js', 'dist/c-H5OX7SCQ.js', 'dist/c-JW7WXDGR.js', 'dist/c-ZW3KU5KT.js', 'dist/c-I75AAJN7.js', 'dist/c-5ICBLMDW.js', 'dist/c-UPAYY4KX.js', 'dist/c-B57KZSHZ.js', 'dist/a-HWBFJGM5.js', 'dist/c-ZXTNT435.js', 'dist/c-CE4EYQKL.js', 'dist/c-FZL7CX4D.js', 'dist/c-GOBFBG2S.js', 'dist/c-Q2DVM5OZ.js', 'dist/c-3YFH23OH.js', 'dist/c-OL3Y2BAX.js', 'dist/c-QWHHDRQB.js', 'dist/c-NK2YITWK.js', 'dist/c-DRDA5CL7.js', 'dist/c-UIWWZM3W.js', 'dist/c-BWTO6BLC.js', 'dist/c-7RPOU3YU.js', 'dist/c-ZI3E5ZFP.js', 'dist/c-INPXHRA2.js', 'dist/c-CEJKAD73.js', 'dist/c-JTKYYIAK.js', 'dist/c-RTTX2RYA.js', 'dist/c-Q4J7C4JJ.js', 'dist/c-53K6VCPK.js', 'dist/c-F6PZXCMK.js', 'dist/c-WNVIXEII.js', 'dist/c-PEAGWN6C.js', 'dist/c-WEFBKIYE.js', 'dist/c-ZBXTUAPL.js', 'dist/c-VBDYCSR7.js', 'dist/c-JS4DOQNM.js', 'dist/c-6PVVLET6.js', 'dist/c-VK2AS5DG.js', 'dist/c-EML7VKSJ.js', 'dist/c-ZTVHMXE5.js', 'dist/c-MQOGTKIB.js', 'dist/c-BRVTFY66.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-4G6P2CFT.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-TPZLRKKC.js', 'dist/c-YIOKEDII.js',
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
