/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-nlipz4u6'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-OZCZEM32.js', 'dist/c-EEMJBG7O.js', 'dist/c-PSR2DW3O.js', 'dist/c-5AN5JZD5.js', 'dist/c-VZQ6ZQCI.js', 'dist/c-4UYJ3RZS.js', 'dist/c-L2RLGU23.js', 'dist/c-3MAAYZZJ.js', 'dist/c-KFGN4EDT.js', 'dist/c-IKXF35WN.js', 'dist/c-CV2JNCYG.js', 'dist/c-DKQPZOX2.js', 'dist/c-LJN4KHOK.js', 'dist/c-GHYCK4QI.js', 'dist/c-733EPOQU.js', 'dist/c-DNWGRTN6.js', 'dist/c-XOW2W2P3.js', 'dist/c-45UP5DHQ.js', 'dist/c-OA2BOBLW.js', 'dist/c-RBNFYMA3.js', 'dist/c-SOFAOVPM.js', 'dist/c-O5IERFJY.js', 'dist/c-TK6UXHJT.js', 'dist/c-RBSDVUCQ.js', 'dist/c-SV6SFP2Y.js', 'dist/c-I75AAJN7.js', 'dist/c-4F7ICEQU.js', 'dist/c-FYDFTYRH.js', 'dist/c-RYR55PTB.js', 'dist/c-7LZCXTRF.js', 'dist/c-SNYWNZYD.js', 'dist/c-TN7KJP23.js', 'dist/c-Y7XATYEC.js', 'dist/c-W43WZWTD.js', 'dist/c-I62NBY6Y.js', 'dist/c-Q3VIZGD2.js', 'dist/c-IXUHPQTR.js', 'dist/c-36OHLWKM.js', 'dist/c-S4E556BZ.js', 'dist/c-66XZN5VB.js', 'dist/c-MSQEY4V3.js', 'dist/c-4AG4XPD7.js', 'dist/c-QTIWBEC2.js', 'dist/c-MOTFL5HO.js', 'dist/c-645MKKXG.js', 'dist/c-T34H2N3Y.js', 'dist/c-S74Q5NQP.js', 'dist/c-RKYPR7IL.js', 'dist/a-NLIPZ4U6.js', 'dist/c-WWCFYYZR.js', 'dist/c-NV37STN5.js', 'dist/c-3VDOWFEI.js', 'dist/c-KVHPKT74.js', 'dist/c-MG5ZSN3O.js', 'dist/c-NLHOSNPG.js', 'dist/c-ROAW7NSH.js', 'dist/c-6YJBTC4M.js', 'dist/c-X5ZSFOXO.js', 'dist/c-P5GNZ7FV.js', 'dist/c-HNZPAUBZ.js', 'dist/c-PJX3PVC7.js', 'dist/c-WQGTEHBJ.js', 'dist/c-KWEFJ3YX.js', 'dist/c-6UBFPVZE.js', 'dist/c-UMFUXUXI.js', 'dist/c-6XC4EBUD.js', 'dist/c-VCCWLXBQ.js', 'dist/c-QN5XMRRQ.js', 'dist/c-NETN24IS.js', 'dist/c-FQ3DTYVO.js', 'dist/c-TFB2YFR2.js', 'dist/c-2AGRA3DN.js', 'dist/c-6PVVLET6.js', 'dist/c-5KDN44MS.js', 'dist/c-IRRLC4F2.js', 'dist/c-M4VXOZB3.js', 'dist/c-X5UH7GGL.js', 'dist/c-ZRMTYMXI.js', 'dist/c-YJB4Q24D.js', 'dist/c-FQJ5CCBF.js', 'dist/c-TOBOK3XD.js', 'dist/c-BO76WNIU.js', 'dist/c-DWBEWQEH.js', 'dist/c-SPQG7KJD.js', 'dist/c-IPDKRFZJ.js', 'dist/c-UQ3DEVQT.js', 'dist/c-GO6HPPGR.js', 'dist/c-IXAQ3CIE.js', 'dist/c-EHFGGOGH.js', 'dist/c-SNA5BOJH.js', 'dist/c-XHZPV5JG.js', 'dist/c-MTVQ6BMB.js', 'dist/c-C6JFG7NX.js', 'dist/c-DHFSN55J.js', 'dist/c-W7YWA7XC.js', 'dist/c-V6SSEMDW.js', 'dist/c-3VF3KZPI.js', 'dist/c-MPTN5RTT.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-WTVQPP2K.js', 'dist/c-MPQC26Q2.js', 'dist/c-IMKH3CE2.js',
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
