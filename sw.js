/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-bdrwjege'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-YKOCWJ6A.js', 'dist/c-HVPTGS3N.js', 'dist/c-5HEIJ74Y.js', 'dist/c-BQIH3DHF.js', 'dist/c-JPV7ZUII.js', 'dist/c-XV2CQAQZ.js', 'dist/c-YTAF2U64.js', 'dist/c-CGLOST7B.js', 'dist/c-WNODJA73.js', 'dist/c-IAVREPNU.js', 'dist/c-JFN5DXNP.js', 'dist/c-W5DHLJFV.js', 'dist/c-CXRCICUG.js', 'dist/c-WSQC6UOX.js', 'dist/c-NF746INX.js', 'dist/c-FXTAIX6V.js', 'dist/c-M4IMNECD.js', 'dist/c-EUREUBOU.js', 'dist/c-IZ6BAJVC.js', 'dist/c-OJL3636K.js', 'dist/c-IKIYN2TK.js', 'dist/c-ABZFCXV5.js', 'dist/c-A2PPHRO2.js', 'dist/c-52F3L7M7.js', 'dist/c-QZIZXR4G.js', 'dist/c-X34JOV7V.js', 'dist/c-KUF73UK7.js', 'dist/c-HHEB7ORJ.js', 'dist/c-PM2WYLZ4.js', 'dist/c-JISWX27Z.js', 'dist/c-IQXUK3XZ.js', 'dist/c-5EAVENXA.js', 'dist/c-JW7WXDGR.js', 'dist/c-W5RAZSO7.js', 'dist/c-I75AAJN7.js', 'dist/a-BDRWJEGE.js', 'dist/c-JOEWKAKU.js', 'dist/c-NKCMSCFG.js', 'dist/c-7G6CKYRW.js', 'dist/c-2OB4ZIFP.js', 'dist/c-SE5V3TTJ.js', 'dist/c-UCUCK7KG.js', 'dist/c-ICGGU3PA.js', 'dist/c-BON5BLVX.js', 'dist/c-P3RAL6KG.js', 'dist/c-ZHKNIEIU.js', 'dist/c-2PL4CVBJ.js', 'dist/c-464GGHB4.js', 'dist/c-G3PVKOS4.js', 'dist/c-HESKIRED.js', 'dist/c-3CONF6BE.js', 'dist/c-KL5BW4X5.js', 'dist/c-YXXOEHSL.js', 'dist/c-ALGYNGT7.js', 'dist/c-SF5UGREN.js', 'dist/c-M5A2CWOW.js', 'dist/c-6PVVLET6.js', 'dist/c-HJML2GSP.js', 'dist/c-X4CFATKS.js', 'dist/c-RBEML5OS.js', 'dist/c-YQUZFLSH.js', 'dist/c-Y7RIPNAS.js', 'dist/c-2AEEKSSD.js', 'dist/c-DTIYH2WD.js', 'dist/c-5Z5NUUUP.js', 'dist/c-GVWRHKXR.js', 'dist/c-2ODV6OTX.js', 'dist/c-ALNFCY32.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DES2I5RA.js', 'dist/c-PYN3SCUQ.js', 'dist/c-SOIZTWX7.js', 'dist/c-DWBEWQEH.js', 'dist/c-OKQFZL6P.js', 'dist/c-A2KGTHTD.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-BRVTFY66.js', 'dist/c-TPZLRKKC.js', 'dist/c-2M567PK7.js',
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
