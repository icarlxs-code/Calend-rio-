/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-7p7fpqwi'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-IL6YMMMX.js', 'dist/c-ZG7YW7X4.js', 'dist/c-GLDKJNOY.js', 'dist/c-VLU32U2N.js', 'dist/c-PUFKZN7X.js', 'dist/c-XV2CQAQZ.js', 'dist/c-DWYY63XN.js', 'dist/c-VMAZ3TKE.js', 'dist/c-KBBY657Z.js', 'dist/c-YXXHN3FP.js', 'dist/c-F2DWFXGM.js', 'dist/c-TMV4WJ4O.js', 'dist/c-7WY2QBOS.js', 'dist/c-RRM6RTVW.js', 'dist/c-FBQ3XW6A.js', 'dist/c-FJRKJSBV.js', 'dist/c-BWMCJIP2.js', 'dist/c-MLOFXLZP.js', 'dist/c-CJJXWXHL.js', 'dist/c-GFPKCWRG.js', 'dist/c-UHI2MWA5.js', 'dist/c-UYRSGXDM.js', 'dist/c-A6EH6MXE.js', 'dist/c-4QYETS6Z.js', 'dist/c-WXLFT356.js', 'dist/c-X34JOV7V.js', 'dist/c-KH6K72IG.js', 'dist/c-HHEB7ORJ.js', 'dist/c-PM2WYLZ4.js', 'dist/c-JISWX27Z.js', 'dist/c-IW2RWMG5.js', 'dist/c-T52H5G62.js', 'dist/c-JW7WXDGR.js', 'dist/c-UWHRKTPL.js', 'dist/c-I75AAJN7.js', 'dist/a-7P7FPQWI.js', 'dist/c-IMYNCQP6.js', 'dist/c-NYH3BV27.js', 'dist/c-4L2QZHAG.js', 'dist/c-ITSKAIAL.js', 'dist/c-5FR3H3OU.js', 'dist/c-FQAV4Y3C.js', 'dist/c-AVB6MKQY.js', 'dist/c-5QAGDHPH.js', 'dist/c-PBSIVR55.js', 'dist/c-EOKRALB4.js', 'dist/c-CFAGZHII.js', 'dist/c-LXKTWRHZ.js', 'dist/c-G3PVKOS4.js', 'dist/c-4DX5PL5E.js', 'dist/c-PL2XWY24.js', 'dist/c-KL5BW4X5.js', 'dist/c-AQ57PKPC.js', 'dist/c-UO7UAPBK.js', 'dist/c-VG2H7RRR.js', 'dist/c-COJ6PBV4.js', 'dist/c-6PVVLET6.js', 'dist/c-HJML2GSP.js', 'dist/c-X4CFATKS.js', 'dist/c-36OPVOTU.js', 'dist/c-YQUZFLSH.js', 'dist/c-Y7RIPNAS.js', 'dist/c-2AEEKSSD.js', 'dist/c-UJLFBMZD.js', 'dist/c-3GDZIJGM.js', 'dist/c-4E2FQ3QR.js', 'dist/c-A635EOVC.js', 'dist/c-QOUED7JZ.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-VXUEHNTG.js', 'dist/c-AXAJMBPY.js', 'dist/c-5NXIKGTB.js', 'dist/c-DWBEWQEH.js', 'dist/c-XMVJISDL.js', 'dist/c-A2KGTHTD.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-BRVTFY66.js', 'dist/c-TPZLRKKC.js', 'dist/c-2M567PK7.js',
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
