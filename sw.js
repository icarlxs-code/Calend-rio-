/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-bs4eimzf'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-4XJFCSBS.js', 'dist/c-5IL6GI3D.js', 'dist/c-AJCYFREE.js', 'dist/c-WDGK7GZ3.js', 'dist/c-433J43MO.js', 'dist/c-Y64TI4Q5.js', 'dist/c-S2DLXJLI.js', 'dist/c-FALBYJLV.js', 'dist/c-BKY6XAUM.js', 'dist/c-NLNWTLIB.js', 'dist/c-CTATF75H.js', 'dist/c-DHWR5IBS.js', 'dist/c-ANQTFXDQ.js', 'dist/c-2XBCXNL7.js', 'dist/c-ZMN7SSGT.js', 'dist/c-LSI6TIO4.js', 'dist/c-KCVFHZUE.js', 'dist/c-WZRYULH7.js', 'dist/c-4YS263QK.js', 'dist/c-57EFTVR5.js', 'dist/c-FZWJ6XEV.js', 'dist/c-PX7XPVLK.js', 'dist/c-ZWXTJOZF.js', 'dist/c-OPN7QCDX.js', 'dist/c-FWVQTMCO.js', 'dist/c-2DMR7RMP.js', 'dist/c-4L56USCP.js', 'dist/c-IN33JNWK.js', 'dist/c-TOUMJXFT.js', 'dist/c-U43GRBNA.js', 'dist/c-WKZXRAIB.js', 'dist/c-V2X24SD6.js', 'dist/c-ONB7FX3R.js', 'dist/c-3D4L7H6Z.js', 'dist/c-Z24PNFGC.js', 'dist/c-JW7WXDGR.js', 'dist/c-LGT4PYU6.js', 'dist/c-I75AAJN7.js', 'dist/a-BS4EIMZF.js', 'dist/c-AA3ZPXF6.js', 'dist/c-KLP4CWXZ.js', 'dist/c-DNJ25PJU.js', 'dist/c-JXAELSRM.js', 'dist/c-AYA3VV3G.js', 'dist/c-TKQUK55Z.js', 'dist/c-AE3PGBAM.js', 'dist/c-6Q45FHFJ.js', 'dist/c-KYET2EG4.js', 'dist/c-6J4FKCOF.js', 'dist/c-SYJEV5HR.js', 'dist/c-PAM37KCH.js', 'dist/c-GX5KA2KR.js', 'dist/c-E22R66PN.js', 'dist/c-UGIJ7LXL.js', 'dist/c-IRMLRA2H.js', 'dist/c-DVGOR6RO.js', 'dist/c-6PVVLET6.js', 'dist/c-HS46GUUF.js', 'dist/c-32F2MPCL.js', 'dist/c-T3WAGFEO.js', 'dist/c-HJML2GSP.js', 'dist/c-2IZBME4I.js', 'dist/c-6L3TCDM6.js', 'dist/c-ZCNTTU2I.js', 'dist/c-YGSGEG77.js', 'dist/c-6TKMQFUM.js', 'dist/c-FKEDBPFB.js', 'dist/c-GGV3J35F.js', 'dist/c-OJDOQJAO.js', 'dist/c-Q6OU3OE3.js', 'dist/c-2TLTGRIW.js', 'dist/c-DWBEWQEH.js', 'dist/c-YG3BXAJB.js', 'dist/c-C5MMLQQP.js', 'dist/c-RC6J2DYP.js', 'dist/c-RMBTLQOJ.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-F4MQELPN.js', 'dist/c-MRXVVMGO.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-NWYBJU3T.js',
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
