/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-p6phjbpu'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-XOG4SGFA.js', 'dist/c-AG3VEACB.js', 'dist/c-IJ5ISF3E.js', 'dist/c-DISEJ5LC.js', 'dist/c-L25RR7O5.js', 'dist/c-VSL7IBSC.js', 'dist/c-MP7B7O4H.js', 'dist/c-OX65KR2S.js', 'dist/c-M7J7HE2F.js', 'dist/c-WPUT4SUW.js', 'dist/c-VP45HCOV.js', 'dist/c-C4STRYHW.js', 'dist/c-22VKCHYU.js', 'dist/c-D74QE5UM.js', 'dist/c-BQITTMYE.js', 'dist/c-WNZHWS64.js', 'dist/c-XFE2RK4A.js', 'dist/c-GQDTQXFI.js', 'dist/c-DISUEHLV.js', 'dist/c-LLDF6SUV.js', 'dist/c-IN3TZJAR.js', 'dist/c-P434BWRS.js', 'dist/c-4J5EXEWB.js', 'dist/c-CBHD7CQV.js', 'dist/c-JW7WXDGR.js', 'dist/c-H7ZLS7HO.js', 'dist/c-I75AAJN7.js', 'dist/c-KPLA6BJT.js', 'dist/c-MQRVEPVD.js', 'dist/c-4R6F3L6S.js', 'dist/c-5YGED4CF.js', 'dist/c-Q6FA3KE2.js', 'dist/c-OO46LXMW.js', 'dist/c-4B5SJD52.js', 'dist/c-66TKJDBQ.js', 'dist/c-3USXDF6Z.js', 'dist/c-57YQG2J7.js', 'dist/c-WLO5D7XA.js', 'dist/c-5C7WBF4B.js', 'dist/a-P6PHJBPU.js', 'dist/c-NND4CN3S.js', 'dist/c-T3LOMCVM.js', 'dist/c-WOODGUTC.js', 'dist/c-XI6UDX3E.js', 'dist/c-ILOFOPBE.js', 'dist/c-HV67GW7C.js', 'dist/c-PBWZ5J3K.js', 'dist/c-YRYYMFWS.js', 'dist/c-PE76MPG2.js', 'dist/c-ZB3O6CKG.js', 'dist/c-ETGHQ7QW.js', 'dist/c-GMGSSLHS.js', 'dist/c-XBWI27EQ.js', 'dist/c-VY2CZL5B.js', 'dist/c-GOER5DTM.js', 'dist/c-3463IFJ3.js', 'dist/c-6SJR6VWV.js', 'dist/c-6PVVLET6.js', 'dist/c-LDQABZZI.js', 'dist/c-XADVK6LU.js', 'dist/c-IYF3PSI7.js', 'dist/c-G7RZKR64.js', 'dist/c-645ETJ2O.js', 'dist/c-O54I4QAW.js', 'dist/c-EE3JTKGP.js', 'dist/c-SJNYLVOW.js', 'dist/c-LI2YLCGY.js', 'dist/c-ISBU324D.js', 'dist/c-BHE6I7LQ.js', 'dist/c-3V4UCZM4.js', 'dist/c-DY62WZQN.js', 'dist/c-ZTR2SEYD.js', 'dist/c-73TCWLZL.js', 'dist/c-DWBEWQEH.js', 'dist/c-OXTZIMTQ.js', 'dist/c-5ISOR7WR.js', 'dist/c-MSEMQUE5.js', 'dist/c-VOSU3RCB.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-GIINIAXM.js', 'dist/c-3VF3KZPI.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-FVUVFLGL.js',
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== MEDIA).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
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
