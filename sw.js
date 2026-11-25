/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-qxpo356t'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-GUK2KC7Q.js', 'dist/c-V2BVRYZP.js', 'dist/c-B3NW52H6.js', 'dist/c-L6LXEU43.js', 'dist/c-KCDXUNQF.js', 'dist/c-DTRJ5QB4.js', 'dist/c-NRS7IKCC.js', 'dist/c-CV6KCBWW.js', 'dist/c-Y5KEBQ7P.js', 'dist/c-345PFVI2.js', 'dist/c-UAJ54YLI.js', 'dist/c-4OXH3ZSK.js', 'dist/c-JNTDC7OY.js', 'dist/c-5GHNVFSR.js', 'dist/c-R2Q3RO3Q.js', 'dist/c-EP5JQTDR.js', 'dist/c-VJLPG5WF.js', 'dist/c-YKRRX6UC.js', 'dist/c-7X7ECAFQ.js', 'dist/c-PO5OS5AA.js', 'dist/c-6CPST7YG.js', 'dist/c-Y7VTQYGX.js', 'dist/c-BHI2MLZM.js', 'dist/c-JXAOS7BS.js', 'dist/c-CNMAVNLK.js', 'dist/c-5YTBNBF6.js', 'dist/c-PUQTDXHZ.js', 'dist/c-NBDMF6QB.js', 'dist/c-DG7QUTUH.js', 'dist/c-LYO6PQGS.js', 'dist/c-2A7KC4QN.js', 'dist/c-JSEZPSSX.js', 'dist/c-OEM4NLPU.js', 'dist/c-UXA2FOZA.js', 'dist/c-CEVUKNEH.js', 'dist/c-WM7Q5OWA.js', 'dist/c-I75AAJN7.js', 'dist/c-BRYA7D7U.js', 'dist/c-ROW2W44R.js', 'dist/c-QCLGRYHG.js', 'dist/c-STSUKRN6.js', 'dist/c-STHICVM2.js', 'dist/c-C3GSQTQ6.js', 'dist/c-53FRI2E5.js', 'dist/c-M2KGVPHO.js', 'dist/c-3KSHDHHT.js', 'dist/c-5SC2LNQI.js', 'dist/c-HGLWH6Q3.js', 'dist/c-ABD7GVHR.js', 'dist/c-KER4ZXEC.js', 'dist/c-Z4XTQYQQ.js', 'dist/c-MIULXWXY.js', 'dist/c-OF374IT2.js', 'dist/c-LE4IT3Z2.js', 'dist/c-PFW4T6BS.js', 'dist/c-44AO5NHY.js', 'dist/c-JU5IFTEZ.js', 'dist/c-HCEBFXPU.js', 'dist/c-3VPOOFJN.js', 'dist/a-QXPO356T.js', 'dist/c-RNJYWLZ7.js', 'dist/c-2LUKOVJP.js', 'dist/c-U255YENN.js', 'dist/c-ME62A5NG.js', 'dist/c-V5WOYJRJ.js', 'dist/c-AHW5YTUT.js', 'dist/c-6RTM5T7W.js', 'dist/c-VZBBLIM6.js', 'dist/c-2MH6JZZ7.js', 'dist/c-MNCYKSVR.js', 'dist/c-I7JIKRYT.js', 'dist/c-RMQK7F65.js', 'dist/c-A2X63JAT.js', 'dist/c-GZQSSGN2.js', 'dist/c-FQ3DTYVO.js', 'dist/c-IEKSAGMW.js', 'dist/c-PZQLNNS6.js', 'dist/c-EYQLKLV7.js', 'dist/c-54XAP6BJ.js', 'dist/c-N3JJKH6S.js', 'dist/c-PGHLFVNL.js', 'dist/c-RI3KL5PA.js', 'dist/c-6PVVLET6.js', 'dist/c-KV2UEH3H.js', 'dist/c-XFLFLBQ4.js', 'dist/c-5KDN44MS.js', 'dist/c-HL4LGT7D.js', 'dist/c-J6PDATOP.js', 'dist/c-FJWD3IX2.js', 'dist/c-7NREOAUD.js', 'dist/c-QCJG7YNU.js', 'dist/c-PGR7OM7D.js', 'dist/c-2NRRIKNO.js', 'dist/c-CRQDPG7K.js', 'dist/c-JAI6M6PY.js', 'dist/c-2FZ7LH5I.js', 'dist/c-67WMPW24.js', 'dist/c-H6PM4QRI.js', 'dist/c-OSUPC35O.js', 'dist/c-VWQ7URYC.js', 'dist/c-NPXXLJRE.js', 'dist/c-L4SNDX7B.js', 'dist/c-EZP3IJBN.js', 'dist/c-WNSGKG2J.js', 'dist/c-DO7SGJNJ.js', 'dist/c-CIEJVWQB.js', 'dist/c-WWTNKPRM.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-MPTN5RTT.js', 'dist/c-V3MHWQEV.js', 'dist/c-MPQC26Q2.js', 'dist/c-HQN2OXJP.js', 'dist/c-IRRLC4F2.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-X2DG7C6C.js',
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
  if (/\/(media\/emblemas|assets\/mascot|assets\/fundos|assets\/stories|media\/marca)\//.test(url.pathname)) {
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
/* dados da frase que vieram no aviso (só texto curto e conhecido) */
function dados(x) {
  x = x && typeof x === 'object' ? x : {};
  const t = (k, n, re) => { const v = String(x[k] || '').slice(0, n); return !re || re.test(v) ? v : ''; };
  return { id: t('id', 40, /^[A-Za-z0-9-]*$/), cat: t('cat', 20, /^[a-z]*$/), fid: t('fid', 60, /^[a-z0-9-]*$/), t: t('t', 8, /^[a-z]*$/), arte: t('arte', 320), eyebrow: t('eyebrow', 80), ref: t('ref', 60), remedio: t('remedio', 80), corpo: t('corpo', 300) };
}
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
      data: { url: d.url || './', title: d.title || '', body: d.body || '', kind: d.kind || '', tag: d.tag || '', ...dados(d.data) },
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
  const notif = { title: String(dd.title || e.notification.title || '').slice(0, 200), body: String(dd.body || e.notification.body || '').slice(0, 1000), kind: String(dd.kind || '').slice(0, 20), tag: String(dd.tag || '').slice(0, 40), ...dados(dd), at: Date.now() };
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
