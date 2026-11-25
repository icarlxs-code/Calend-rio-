/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-mzpow6sp'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-CXOZWLGC.js', 'dist/c-Y5PWTXPA.js', 'dist/c-LZ76AYSW.js', 'dist/c-5AN5JZD5.js', 'dist/c-L3XLI4O3.js', 'dist/c-COQ6SDZC.js', 'dist/c-I4GSELDG.js', 'dist/c-S7RSCFCU.js', 'dist/c-4OXEETHY.js', 'dist/c-OOS6V4UM.js', 'dist/c-QO3BXACH.js', 'dist/c-4H6B62FA.js', 'dist/c-LJN4KHOK.js', 'dist/c-YJ7H5HOF.js', 'dist/c-AHV7WGV5.js', 'dist/c-EXDI3AWG.js', 'dist/c-BJWINQAK.js', 'dist/c-WHHSZRPV.js', 'dist/c-QP5XMD2X.js', 'dist/c-TMEUP32H.js', 'dist/c-3IEXBFXU.js', 'dist/c-O5IERFJY.js', 'dist/c-ZU5QIUGF.js', 'dist/c-LIR3TCJQ.js', 'dist/c-H3YXQJOG.js', 'dist/c-I75AAJN7.js', 'dist/c-UZY7CI34.js', 'dist/c-WAVF5L2N.js', 'dist/c-LVPMM5HZ.js', 'dist/c-CMSCUELA.js', 'dist/c-RABENH2T.js', 'dist/c-CDWOAPOU.js', 'dist/c-BW3D66CZ.js', 'dist/c-NCZLLSRK.js', 'dist/c-I62NBY6Y.js', 'dist/c-5NTHXFVM.js', 'dist/c-IXUHPQTR.js', 'dist/c-GZR72ZCM.js', 'dist/c-S4E556BZ.js', 'dist/c-66XZN5VB.js', 'dist/c-MSQEY4V3.js', 'dist/c-PUEPISZO.js', 'dist/c-2WB5D3AD.js', 'dist/c-DWZBTPF5.js', 'dist/c-DPRP3DRI.js', 'dist/c-LKGDPJGU.js', 'dist/c-FTFBE7LM.js', 'dist/c-RKYPR7IL.js', 'dist/a-MZPOW6SP.js', 'dist/c-26OAWW77.js', 'dist/c-MNCW6ADA.js', 'dist/c-6U3C7IDH.js', 'dist/c-RP7TFFAS.js', 'dist/c-RD3K54MC.js', 'dist/c-BT42WFGQ.js', 'dist/c-MDTBVWNT.js', 'dist/c-43XW32ZG.js', 'dist/c-X5ZSFOXO.js', 'dist/c-P5GNZ7FV.js', 'dist/c-5WUOT5W4.js', 'dist/c-BRDOKCEL.js', 'dist/c-LNTKFI4M.js', 'dist/c-T7TLJ33D.js', 'dist/c-URTTKGAY.js', 'dist/c-JEPU6LWT.js', 'dist/c-PSJGXZTR.js', 'dist/c-3CEOKIC2.js', 'dist/c-PJUZLYZR.js', 'dist/c-HLN5XNDP.js', 'dist/c-FQ3DTYVO.js', 'dist/c-FKPXEK3U.js', 'dist/c-2AGRA3DN.js', 'dist/c-6PVVLET6.js', 'dist/c-5KDN44MS.js', 'dist/c-IRRLC4F2.js', 'dist/c-6UURJPMQ.js', 'dist/c-JXM65LIY.js', 'dist/c-LBZT4JC2.js', 'dist/c-CK2PLVTZ.js', 'dist/c-FQJ5CCBF.js', 'dist/c-EVC3KUE4.js', 'dist/c-3SDCPSHR.js', 'dist/c-DWBEWQEH.js', 'dist/c-SEG7FOHL.js', 'dist/c-RFRMRDAI.js', 'dist/c-UQ3DEVQT.js', 'dist/c-GO6HPPGR.js', 'dist/c-IXAQ3CIE.js', 'dist/c-EHFGGOGH.js', 'dist/c-SNA5BOJH.js', 'dist/c-XHZPV5JG.js', 'dist/c-MTVQ6BMB.js', 'dist/c-C6JFG7NX.js', 'dist/c-IY7NQQ3U.js', 'dist/c-GJNTNUYO.js', 'dist/c-Q3T7H5ZM.js', 'dist/c-3VF3KZPI.js', 'dist/c-MPTN5RTT.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-WTVQPP2K.js', 'dist/c-MPQC26Q2.js', 'dist/c-IMKH3CE2.js',
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
