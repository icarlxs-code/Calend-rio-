/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-zhpc7v6s'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-3G2AETNH.js', 'dist/c-MKS3QL5L.js', 'dist/c-YQEEA4DX.js', 'dist/c-OTP5FR2L.js', 'dist/c-MIE5WGMZ.js', 'dist/c-YSH6K7JP.js', 'dist/c-VMXMYJBP.js', 'dist/c-QURF34RU.js', 'dist/c-B6FMZQZN.js', 'dist/c-LQ7MMMUR.js', 'dist/c-SIU4GCY2.js', 'dist/c-C4JAF2RJ.js', 'dist/c-BPA62U5B.js', 'dist/c-OWHK3XTE.js', 'dist/c-PU6IKPNX.js', 'dist/c-HMDVSGI7.js', 'dist/c-WVIDYU6I.js', 'dist/c-SMDWON4T.js', 'dist/c-FL4RBPQE.js', 'dist/c-GSSS6UE3.js', 'dist/c-R4KFR2GS.js', 'dist/c-STL334RO.js', 'dist/c-Q44QWXMO.js', 'dist/c-CB64OZE3.js', 'dist/c-JW7WXDGR.js', 'dist/c-6SLL6KHK.js', 'dist/c-I75AAJN7.js', 'dist/c-ZAYDZRMQ.js', 'dist/c-M6GTNYTU.js', 'dist/c-3NHE6SGS.js', 'dist/c-QT2H3SCZ.js', 'dist/c-UXQNNIIV.js', 'dist/c-KY3ZK2EC.js', 'dist/c-7S4LGNYM.js', 'dist/c-YQPODDZI.js', 'dist/c-BDGXXLHJ.js', 'dist/c-C52TI42E.js', 'dist/c-BRVKU5ME.js', 'dist/c-N47S67AZ.js', 'dist/a-ZHPC7V6S.js', 'dist/c-2E2T4H36.js', 'dist/c-ERZLPERP.js', 'dist/c-NZNZVEAJ.js', 'dist/c-RO5RTOGM.js', 'dist/c-Y6QCARUQ.js', 'dist/c-K5X7ZJ5K.js', 'dist/c-AU7X6FQZ.js', 'dist/c-MDCVA5OC.js', 'dist/c-34U4T72V.js', 'dist/c-HI3QYTOJ.js', 'dist/c-ETGHQ7QW.js', 'dist/c-5XHSA2QA.js', 'dist/c-7TSEPZES.js', 'dist/c-WOGHTST6.js', 'dist/c-VQKHLU6W.js', 'dist/c-OAVYTSNP.js', 'dist/c-XKTGUDOX.js', 'dist/c-6PVVLET6.js', 'dist/c-2RCA65ND.js', 'dist/c-6IOYIQUZ.js', 'dist/c-6ORKBNC4.js', 'dist/c-HDCGUJNN.js', 'dist/c-L2Z2G3W3.js', 'dist/c-O54I4QAW.js', 'dist/c-KRSV6JEK.js', 'dist/c-LHY5L5XN.js', 'dist/c-4ORTTDMM.js', 'dist/c-RFXKRHAB.js', 'dist/c-QXPZDJKD.js', 'dist/c-WCBT23CM.js', 'dist/c-4DC6JSV3.js', 'dist/c-GGVCXIJ2.js', 'dist/c-73TCWLZL.js', 'dist/c-DWBEWQEH.js', 'dist/c-UPI6OTDW.js', 'dist/c-IMTRN37Y.js', 'dist/c-5UCXMP5K.js', 'dist/c-CFRZNHXQ.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-ATC2IMY5.js', 'dist/c-3VF3KZPI.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-HGL2YE6Q.js',
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
