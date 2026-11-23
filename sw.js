/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-5eqizuhh'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-OUE2LV52.js', 'dist/c-O5S66B2X.js', 'dist/c-QK3DKYEF.js', 'dist/c-C2OOI72U.js', 'dist/c-3DCY6P2L.js', 'dist/c-Y6UVUL7P.js', 'dist/c-CMZAOUK2.js', 'dist/c-6Q37FFVX.js', 'dist/c-CGANU45E.js', 'dist/c-JJEXM3NE.js', 'dist/c-OA7VYUXT.js', 'dist/c-P342BHEF.js', 'dist/c-FZ3ISLLX.js', 'dist/c-NYT3A2Q4.js', 'dist/c-36RXWNYU.js', 'dist/c-NGL65IUN.js', 'dist/c-7LALZHTB.js', 'dist/c-G3KWKS35.js', 'dist/c-M42Q36KB.js', 'dist/c-C5AFB3Y2.js', 'dist/c-VEEOI5DX.js', 'dist/c-O5AHPRDX.js', 'dist/c-3DGZ4WYS.js', 'dist/c-QPVZR7WX.js', 'dist/c-UNC4LR74.js', 'dist/c-XFQWEAUX.js', 'dist/c-CFA7MIM6.js', 'dist/c-JDMNGEQU.js', 'dist/c-76MX73JL.js', 'dist/c-IQBKVDNR.js', 'dist/c-ZNCQ6TQK.js', 'dist/c-I5IGMDQZ.js', 'dist/c-TRCBHONM.js', 'dist/c-BWK7OKEF.js', 'dist/c-4WPHLIN6.js', 'dist/c-JW7WXDGR.js', 'dist/c-3CEK4WML.js', 'dist/c-I75AAJN7.js', 'dist/a-5EQIZUHH.js', 'dist/c-YT2W62DE.js', 'dist/c-X7IV3MMX.js', 'dist/c-M37MRWH4.js', 'dist/c-IK6HUDV6.js', 'dist/c-5PO2SQS2.js', 'dist/c-AE3HS7DG.js', 'dist/c-VTQ2R2F5.js', 'dist/c-ITSWGB5U.js', 'dist/c-BUT2XCJF.js', 'dist/c-XS4D7DFP.js', 'dist/c-C2JVISJL.js', 'dist/c-GX5KA2KR.js', 'dist/c-L372POOI.js', 'dist/c-7MBGCUI5.js', 'dist/c-FCHOFSJD.js', 'dist/c-ZBQ72YEF.js', 'dist/c-C4FC4YHL.js', 'dist/c-QMSI2HFQ.js', 'dist/c-6PVVLET6.js', 'dist/c-WEHMFER6.js', 'dist/c-SQDTHJ2I.js', 'dist/c-AFFAFY2O.js', 'dist/c-IR34IFFF.js', 'dist/c-CDN3HXO2.js', 'dist/c-7I554J4P.js', 'dist/c-BINNCI2M.js', 'dist/c-G5TC26LT.js', 'dist/c-DHVU32FY.js', 'dist/c-TZNCEDPQ.js', 'dist/c-OGGGXZMJ.js', 'dist/c-WLO3J2LO.js', 'dist/c-2TLTGRIW.js', 'dist/c-DWBEWQEH.js', 'dist/c-ERUCOL2A.js', 'dist/c-KENTCPHI.js', 'dist/c-7DNPR2DL.js', 'dist/c-GHF7SBN4.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-L7J4YNBM.js', 'dist/c-MRXVVMGO.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-SNN2PYN3.js',
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
