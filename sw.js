/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-dnrt6kis'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'css/marca.css', 'css/social.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-MJTGYRBF.js', 'dist/c-YC6TLXGE.js', 'dist/c-LNLJ3GGP.js', 'dist/c-SMPDICUG.js', 'dist/c-33JPXKR6.js', 'dist/c-6UEPAV6E.js', 'dist/c-IAGSTVZP.js', 'dist/c-7J5RHJVE.js', 'dist/c-IMKQPSRP.js', 'dist/c-LHQ7RZN6.js', 'dist/c-IKJN2ZO2.js', 'dist/c-QCYRPJHJ.js', 'dist/c-Y6BHRQYI.js', 'dist/c-CD7OSEGC.js', 'dist/c-X3IPOFLP.js', 'dist/c-DRVLTYVX.js', 'dist/c-W2XXVMWW.js', 'dist/c-47N4TV3R.js', 'dist/c-QTCUZYQT.js', 'dist/c-BF3RPBPK.js', 'dist/c-AZADGLBW.js', 'dist/c-4HPSDUML.js', 'dist/c-F5SEBAEK.js', 'dist/c-5RTOGM7X.js', 'dist/c-ZQIGWK4L.js', 'dist/c-4KLRQNIL.js', 'dist/c-ZLLHSVKS.js', 'dist/c-ENCUHE65.js', 'dist/c-VA5WCWJZ.js', 'dist/c-QMBMICZW.js', 'dist/c-KXN35FOR.js', 'dist/c-76YJETKZ.js', 'dist/c-7CJJLLZG.js', 'dist/c-66XZN5VB.js', 'dist/c-VJNHNQAG.js', 'dist/c-FALEA4HQ.js', 'dist/c-7JECKO5V.js', 'dist/c-I75AAJN7.js', 'dist/c-45WPNYVP.js', 'dist/c-WVVPO5UB.js', 'dist/c-SN6LOU5T.js', 'dist/c-BETWGGTQ.js', 'dist/c-KYFGPIV5.js', 'dist/c-OYSX33PY.js', 'dist/c-WYQBC4OK.js', 'dist/c-O54HZYLZ.js', 'dist/a-DNRT6KIS.js', 'dist/c-JAVWRSUJ.js', 'dist/c-HF6G2RCH.js', 'dist/c-WV4Z7MJC.js', 'dist/c-UQ4NEZ7C.js', 'dist/c-IX6EPDVM.js', 'dist/c-XLPWBAV7.js', 'dist/c-4PW6JXB3.js', 'dist/c-4WPBMDTN.js', 'dist/c-P5GNZ7FV.js', 'dist/c-DOCJ5IXD.js', 'dist/c-PHSRSCAT.js', 'dist/c-BNMCCMDR.js', 'dist/c-4VSCL56W.js', 'dist/c-RXWJJLWA.js', 'dist/c-IHE2XADT.js', 'dist/c-6T3YWJNL.js', 'dist/c-VNNQVSAF.js', 'dist/c-KKZDFZNY.js', 'dist/c-POMTJFFH.js', 'dist/c-FQ3DTYVO.js', 'dist/c-GUEDGYOW.js', 'dist/c-EK5IDQGV.js', 'dist/c-5KDN44MS.js', 'dist/c-6PVVLET6.js', 'dist/c-HRBOFPH3.js', 'dist/c-25JOFSQD.js', 'dist/c-WJH5Y6L6.js', 'dist/c-6CCRHLLB.js', 'dist/c-GAPFJCGK.js', 'dist/c-4VWEEKSD.js', 'dist/c-Z7JZV4BS.js', 'dist/c-PP45APFB.js', 'dist/c-GI2PVWRG.js', 'dist/c-R3SEEGHU.js', 'dist/c-IMXDSQGB.js', 'dist/c-DYLXH7MD.js', 'dist/c-CWZCXWLS.js', 'dist/c-RWAZAODE.js', 'dist/c-B7AUXS3S.js', 'dist/c-MPQC26Q2.js', 'dist/c-L4RJRI35.js', 'dist/c-IRRLC4F2.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-CRWGFTG5.js', 'dist/c-M3UXFMGF.js', 'dist/c-IANHVQNA.js', 'dist/c-3VF3KZPI.js', 'dist/c-MPTN5RTT.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-TJYKSYVI.js',
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
