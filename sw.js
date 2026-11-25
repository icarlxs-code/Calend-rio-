/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-dxrgsf6q'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-HUL4ENAV.js', 'dist/c-GDNPHKHH.js', 'dist/c-GDXOJK3A.js', 'dist/c-CN7UQSCY.js', 'dist/c-IW6XQDDB.js', 'dist/c-UDVTAWA7.js', 'dist/c-LRUMR7AP.js', 'dist/c-Z3YBKXMO.js', 'dist/c-Y4GOOPP7.js', 'dist/c-ML73TCKE.js', 'dist/c-6E44CAHZ.js', 'dist/c-L6F2MDXK.js', 'dist/c-CEVI2H5K.js', 'dist/c-7FTS7UQN.js', 'dist/c-WPAIIEB4.js', 'dist/c-CNLDFFDO.js', 'dist/c-O5XCRX5A.js', 'dist/c-2F72R5G5.js', 'dist/c-KBM5QRND.js', 'dist/c-LXC3VS2F.js', 'dist/c-PGDMUMJW.js', 'dist/c-RMFTLBWK.js', 'dist/c-UAOLMAN5.js', 'dist/c-6PE5KVWJ.js', 'dist/c-SBALMYPO.js', 'dist/c-5CBTC4DQ.js', 'dist/c-AO2PIN4Z.js', 'dist/c-BMWU56QG.js', 'dist/c-TK2ATE7E.js', 'dist/c-Y2EJUUVE.js', 'dist/c-ONNCHTM2.js', 'dist/c-KLB6GHA2.js', 'dist/c-NGC4ZCZG.js', 'dist/c-45LBAPIC.js', 'dist/c-B5CMBWWU.js', 'dist/c-66XZN5VB.js', 'dist/c-QGZC37PO.js', 'dist/c-I75AAJN7.js', 'dist/c-ORMFIV4X.js', 'dist/c-YURDSTCR.js', 'dist/c-FYR3INXQ.js', 'dist/c-YYI3QLSB.js', 'dist/c-VIYUMHWF.js', 'dist/c-SKNV2RRB.js', 'dist/c-M6WK4QEV.js', 'dist/c-UVGOV7DF.js', 'dist/a-DXRGSF6Q.js', 'dist/c-J3R255WL.js', 'dist/c-HAC3EHAY.js', 'dist/c-HIFUOKQN.js', 'dist/c-MPWRZPPE.js', 'dist/c-2XPEH6HI.js', 'dist/c-CLJ6VC3Q.js', 'dist/c-RJVDULHS.js', 'dist/c-JW7I6V7N.js', 'dist/c-D2K55HIS.js', 'dist/c-DUUT6XSG.js', 'dist/c-P5GNZ7FV.js', 'dist/c-XCYQFFTG.js', 'dist/c-2ZRJ5DSI.js', 'dist/c-WYKVOWTO.js', 'dist/c-JC63IWQZ.js', 'dist/c-YGPJ42DW.js', 'dist/c-5KDN44MS.js', 'dist/c-I6Q7SJIR.js', 'dist/c-VY4L3OQ4.js', 'dist/c-U44J5BY2.js', 'dist/c-6PVVLET6.js', 'dist/c-5GEGXKLC.js', 'dist/c-IKFK5BRO.js', 'dist/c-YMJS3CHX.js', 'dist/c-SWZBYMUH.js', 'dist/c-GAPFJCGK.js', 'dist/c-Z2QG32CK.js', 'dist/c-D5W74434.js', 'dist/c-CE6UVEYM.js', 'dist/c-KEFK7MSV.js', 'dist/c-R3SEEGHU.js', 'dist/c-N7HKSYGY.js', 'dist/c-WSCSNMNZ.js', 'dist/c-MCWMS667.js', 'dist/c-XUYRLJOU.js', 'dist/c-GCJOOR7F.js', 'dist/c-MPQC26Q2.js', 'dist/c-ZR6VRIUV.js', 'dist/c-IRRLC4F2.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-2ZJ57DCQ.js', 'dist/c-L4WPLYEF.js', 'dist/c-5HFWXGPY.js', 'dist/c-3VF3KZPI.js', 'dist/c-MPTN5RTT.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-6R6D2R4H.js',
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
