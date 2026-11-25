/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-c46kfcmj'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-4CDGYOCM.js', 'dist/c-PKM7MTCJ.js', 'dist/c-AWULWAYZ.js', 'dist/c-3W77SJWW.js', 'dist/c-5WWIRREX.js', 'dist/c-TEKMME5W.js', 'dist/c-NNMR7NWL.js', 'dist/c-SIDVQGEF.js', 'dist/c-NIRD5AUM.js', 'dist/c-D4A635SZ.js', 'dist/c-CHEE5D3X.js', 'dist/c-BBLYTGI4.js', 'dist/c-LRWHPDBU.js', 'dist/c-R2JIFYY2.js', 'dist/c-J2NDGGJT.js', 'dist/c-EZU6ZKYQ.js', 'dist/c-VZDZQEGY.js', 'dist/c-LH4JQGBI.js', 'dist/c-SKPKTKCD.js', 'dist/c-6WS5GGBW.js', 'dist/c-4W35MNAL.js', 'dist/c-4UHGUJXI.js', 'dist/c-XRNL5KFZ.js', 'dist/c-2RVTHRCV.js', 'dist/c-3KXPTY6J.js', 'dist/c-Q6NXNS5M.js', 'dist/c-RTBF47US.js', 'dist/c-SGMVWCMR.js', 'dist/c-UQWF5BO5.js', 'dist/c-OEM4NLPU.js', 'dist/c-TMBZEYPW.js', 'dist/c-I75AAJN7.js', 'dist/c-2SKBBJD3.js', 'dist/c-OANA6BLB.js', 'dist/c-B7TVCY2C.js', 'dist/c-YU7QRXA4.js', 'dist/c-O5E7QKCY.js', 'dist/c-TMRJKBCE.js', 'dist/c-4VCBAKRF.js', 'dist/c-BFXAXKW5.js', 'dist/c-GXRGCFK5.js', 'dist/c-EWS5MUXM.js', 'dist/c-H45L6ZGX.js', 'dist/c-4BLJ7UJI.js', 'dist/c-OZ6RQC2V.js', 'dist/c-TNACW3G6.js', 'dist/c-MGFRHZF3.js', 'dist/c-MEJOOOBR.js', 'dist/c-ZAW2ISSX.js', 'dist/c-4MEVMLA4.js', 'dist/c-I3B7MJQB.js', 'dist/a-C46KFCMJ.js', 'dist/c-UYWZFFHK.js', 'dist/c-GYPBK77W.js', 'dist/c-75AQI5BA.js', 'dist/c-HOLFC42U.js', 'dist/c-45XE3SK2.js', 'dist/c-UQC5ABUC.js', 'dist/c-FMRRB5OS.js', 'dist/c-ONUDDBFZ.js', 'dist/c-ARIFL6PK.js', 'dist/c-AZAPX3J3.js', 'dist/c-CI5N23UX.js', 'dist/c-N3AV54FA.js', 'dist/c-M2CQSOVQ.js', 'dist/c-J6PDATOP.js', 'dist/c-6MJZU6KH.js', 'dist/c-ISKT76ZK.js', 'dist/c-FQ3DTYVO.js', 'dist/c-YPC7SHIZ.js', 'dist/c-7DD5EN2P.js', 'dist/c-NR52GRXG.js', 'dist/c-FZTFDLZY.js', 'dist/c-3QSH7YPZ.js', 'dist/c-4KZL2TFI.js', 'dist/c-UC43QLIJ.js', 'dist/c-5KDN44MS.js', 'dist/c-6PVVLET6.js', 'dist/c-QDSOLNOZ.js', 'dist/c-FJWD3IX2.js', 'dist/c-SOKIXRJI.js', 'dist/c-7EZ4UPSF.js', 'dist/c-WR5GQAGK.js', 'dist/c-3QVIOJ72.js', 'dist/c-5CH2UEG7.js', 'dist/c-T77NEGKL.js', 'dist/c-MER2S6VY.js', 'dist/c-L4IWVCS3.js', 'dist/c-66KIIOKU.js', 'dist/c-SQD4OE56.js', 'dist/c-CTYHYL7U.js', 'dist/c-7M36KLDR.js', 'dist/c-77XE3D7E.js', 'dist/c-RBNKT5MD.js', 'dist/c-D3T2RPZJ.js', 'dist/c-AHVZHNWX.js', 'dist/c-PD4NMVRX.js', 'dist/c-CIEJVWQB.js', 'dist/c-WWTNKPRM.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-MPTN5RTT.js', 'dist/c-RBQLKMQD.js', 'dist/c-MPQC26Q2.js', 'dist/c-3YWITPWG.js', 'dist/c-IRRLC4F2.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-V7PUCKXZ.js',
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
