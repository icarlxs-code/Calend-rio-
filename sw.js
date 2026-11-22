/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-ujb75sa5'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-OEA24NBN.js', 'dist/c-6EDXFYRU.js', 'dist/c-NA4XNZ62.js', 'dist/c-3FCKYRLO.js', 'dist/c-SXUHRRO7.js', 'dist/c-PDPFEWB2.js', 'dist/c-ZGQKIOAF.js', 'dist/c-7GKHOKTS.js', 'dist/c-UOL4M4SZ.js', 'dist/c-VA65XJZ7.js', 'dist/c-4AHRBD67.js', 'dist/c-LJ63QCOI.js', 'dist/c-PDGJFUYB.js', 'dist/c-O5LG7OH3.js', 'dist/c-PBGRPMMO.js', 'dist/c-ZZEJCQHR.js', 'dist/c-GU645MRD.js', 'dist/c-4RFZC5PZ.js', 'dist/c-LL4HP7MY.js', 'dist/c-H5O4MPJ5.js', 'dist/c-VHW3KD4U.js', 'dist/a-UJB75SA5.js', 'dist/c-SJVN4ZKV.js', 'dist/c-764OS4LT.js', 'dist/c-SQQHXUPS.js', 'dist/c-LNY47LZN.js', 'dist/c-I6IW2LUO.js', 'dist/c-5KQYAS4D.js', 'dist/c-G22RP6YW.js', 'dist/c-JEEQPTYE.js', 'dist/c-OLKD67LW.js', 'dist/c-RFWEIJYU.js', 'dist/c-FVGRVSL5.js', 'dist/c-HFZMP5I6.js', 'dist/c-OD25MDCI.js', 'dist/c-T4O7UDWL.js', 'dist/c-D5PBBLJS.js', 'dist/c-TDIDPYZT.js', 'dist/c-FLN5RWR6.js', 'dist/c-7E2JEATU.js', 'dist/c-FX27D6U2.js', 'dist/c-IDMSODP7.js', 'dist/c-3QF4OIYH.js', 'dist/c-4EDKZKPW.js', 'dist/c-6PVVLET6.js', 'dist/c-S7QRVFQO.js', 'dist/c-Q4J7C4JJ.js', 'dist/c-VK7ORKG4.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-YETVNYGH.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-4G6P2CFT.js', 'dist/c-BRVTFY66.js', 'dist/c-TPZLRKKC.js', 'dist/c-JUW44VMD.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
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
  const req = e.request.mode === 'navigate' ? e.request.url : e.request;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        // o app mudou de endereço (ex.: github.io → meulembra.com.br): a abertura segue o novo endereço.
        // Sem isto, o navegador recusa a resposta redirecionada e mostra uma página de erro.
        if (res.redirected && e.request.mode === 'navigate') return Response.redirect(res.url, 302);
        if (res.redirected && new URL(res.url).origin !== location.origin) return res; // arquivo vindo do endereço novo: usa, mas não guarda
        if (res.ok && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))),
  );
});

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
