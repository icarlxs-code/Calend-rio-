/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-u2sbblqe'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-JQG7L2G2.js', 'dist/c-VZNAT5E3.js', 'dist/c-WBVHLKAG.js', 'dist/c-TAJFCJQH.js', 'dist/c-RI7AANLR.js', 'dist/c-345PFVI2.js', 'dist/c-JERKRFQY.js', 'dist/c-Z7T3RPBH.js', 'dist/c-ZVHMC3QC.js', 'dist/c-RIVQQOQ5.js', 'dist/c-EMZPXZCQ.js', 'dist/c-EL5ZJ3BF.js', 'dist/c-DUISRRVB.js', 'dist/c-S2ED7M4R.js', 'dist/c-X4EVRKII.js', 'dist/c-X6ZJCEAJ.js', 'dist/c-7O6KC7OZ.js', 'dist/c-7BMWPJCD.js', 'dist/c-AWFUKSDD.js', 'dist/c-VIZVL56W.js', 'dist/c-VNW23WS7.js', 'dist/c-LEMBE4WI.js', 'dist/c-ARJOVYV7.js', 'dist/c-MI7IEPTS.js', 'dist/c-AWRELIMZ.js', 'dist/c-TWYHKNZ5.js', 'dist/c-LYO6PQGS.js', 'dist/c-EKHPHTXW.js', 'dist/c-JSEZPSSX.js', 'dist/c-UXA2FOZA.js', 'dist/c-CNXEJ5NL.js', 'dist/c-6BMUFFXF.js', 'dist/c-NXFK7DBK.js', 'dist/c-I44GUJ32.js', 'dist/c-OEM4NLPU.js', 'dist/c-QBAUB73F.js', 'dist/c-I75AAJN7.js', 'dist/c-CSXJO5SN.js', 'dist/c-F3AO2RE4.js', 'dist/c-VGRTI3PX.js', 'dist/c-C3GSQTQ6.js', 'dist/c-M2KGVPHO.js', 'dist/c-7R2MSO2M.js', 'dist/c-SDBMU25E.js', 'dist/c-NYGMNR6Z.js', 'dist/c-3MDSR2W4.js', 'dist/c-Z4XTQYQQ.js', 'dist/c-QBLCMKKQ.js', 'dist/c-MIULXWXY.js', 'dist/c-FZKKWIRS.js', 'dist/c-D4N6NPG5.js', 'dist/c-LAC33FC6.js', 'dist/c-UC4RKQK3.js', 'dist/c-YU6HFXMH.js', 'dist/c-YHBSQ35H.js', 'dist/c-Z6L43RZL.js', 'dist/a-U2SBBLQE.js', 'dist/c-W2PZOGTP.js', 'dist/c-UAWJNSQH.js', 'dist/c-2PEUASK4.js', 'dist/c-MVKNW2H6.js', 'dist/c-EO4SZDTC.js', 'dist/c-LBY3VSOK.js', 'dist/c-G3XPQBG7.js', 'dist/c-ZWD4FGOM.js', 'dist/c-AOZH4L6D.js', 'dist/c-K3PCMVT5.js', 'dist/c-IL4TFDZP.js', 'dist/c-54XAP6BJ.js', 'dist/c-N3JJKH6S.js', 'dist/c-J6PDATOP.js', 'dist/c-OPZZPNVG.js', 'dist/c-NRYVX3X3.js', 'dist/c-QUEIYM42.js', 'dist/c-FQ3DTYVO.js', 'dist/c-PZQLNNS6.js', 'dist/c-RVICG6HL.js', 'dist/c-D5CPKPGB.js', 'dist/c-5U2YHFGL.js', 'dist/c-XU6TA5B3.js', 'dist/c-6PVVLET6.js', 'dist/c-KNSFK4ZX.js', 'dist/c-VUG77KEV.js', 'dist/c-5KDN44MS.js', 'dist/c-SLNRESYR.js', 'dist/c-FJWD3IX2.js', 'dist/c-3ZTWOI37.js', 'dist/c-JM36PP4R.js', 'dist/c-5I3NAUTW.js', 'dist/c-HTQUI7VD.js', 'dist/c-UL7YCLJE.js', 'dist/c-F5JWQVWE.js', 'dist/c-VXNW5WBH.js', 'dist/c-67WMPW24.js', 'dist/c-H6PM4QRI.js', 'dist/c-OSUPC35O.js', 'dist/c-VWQ7URYC.js', 'dist/c-NPXXLJRE.js', 'dist/c-L4SNDX7B.js', 'dist/c-3Z5OWCWF.js', 'dist/c-ZZ4YWL5F.js', 'dist/c-XHPDSB4G.js', 'dist/c-CIEJVWQB.js', 'dist/c-WWTNKPRM.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-MPTN5RTT.js', 'dist/c-V3MHWQEV.js', 'dist/c-MPQC26Q2.js', 'dist/c-HQN2OXJP.js', 'dist/c-IRRLC4F2.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-X2DG7C6C.js',
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
