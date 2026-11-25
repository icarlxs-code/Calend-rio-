/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-swzccdrt'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'css/arte.css', 'css/motion.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-PA352VNE.js', 'dist/c-FOJV3EKT.js', 'dist/c-QPMLDXZZ.js', 'dist/c-E3U3IXV2.js', 'dist/c-UD3UNVVO.js', 'dist/c-AIICBZQ4.js', 'dist/c-6CTFJTUG.js', 'dist/c-CF5R6AKE.js', 'dist/c-TYQM3KG7.js', 'dist/c-JHURJZES.js', 'dist/c-MKWGJ54V.js', 'dist/c-3BDXWTMN.js', 'dist/c-RTLJL3IX.js', 'dist/c-3AFMXHVB.js', 'dist/c-NPMXTLZS.js', 'dist/c-RQYA3VAO.js', 'dist/c-UHM6JCZP.js', 'dist/c-G2AUWBCB.js', 'dist/c-HLDLDRB2.js', 'dist/c-GS5VZ7KD.js', 'dist/c-Y3ZMDOKS.js', 'dist/c-2PADQEUB.js', 'dist/c-URBCT6IO.js', 'dist/c-HUBHZJ3Z.js', 'dist/c-SHABRVUQ.js', 'dist/c-FFC5YKPE.js', 'dist/c-6KNKR5NH.js', 'dist/c-66XZN5VB.js', 'dist/c-5F2VBQTI.js', 'dist/c-I75AAJN7.js', 'dist/c-U2ADGSXH.js', 'dist/c-LF4FUKCR.js', 'dist/c-IBIHQEIR.js', 'dist/c-2GJDALAE.js', 'dist/c-ANHBWYCL.js', 'dist/c-O2P66WJC.js', 'dist/c-UW3BNGPF.js', 'dist/c-LCCLZ4O5.js', 'dist/c-WCRR5C73.js', 'dist/c-I6IRRO7G.js', 'dist/c-6MDWPZEW.js', 'dist/c-IP6WH3OB.js', 'dist/a-SWZCCDRT.js', 'dist/c-7FDQDV74.js', 'dist/c-UAXPLOWK.js', 'dist/c-EQY3V2T7.js', 'dist/c-H3KWRVPA.js', 'dist/c-NEG2PQT4.js', 'dist/c-DXQYV7G7.js', 'dist/c-OXY5EWP5.js', 'dist/c-AI2HGKCY.js', 'dist/c-EWMTSPQM.js', 'dist/c-UWS2SM47.js', 'dist/c-MUVX27UP.js', 'dist/c-VJ6P3LLG.js', 'dist/c-J4YWSCB6.js', 'dist/c-XZB3KUNW.js', 'dist/c-7VNEFV7Q.js', 'dist/c-DSRWVS5F.js', 'dist/c-YAFITVBN.js', 'dist/c-6PVVLET6.js', 'dist/c-AJIHBTYD.js', 'dist/c-U7VLQDW6.js', 'dist/c-WH5LLXGG.js', 'dist/c-5N6S3KYS.js', 'dist/c-CW5BIQSL.js', 'dist/c-Q6DHGZF5.js', 'dist/c-XGKWHAHG.js', 'dist/c-O46FJNL5.js', 'dist/c-PZIMVCQK.js', 'dist/c-KKFR4PWL.js', 'dist/c-EW4TMFFP.js', 'dist/c-XVYCQGTG.js', 'dist/c-V4FXAJLF.js', 'dist/c-NZ4A6U7M.js', 'dist/c-73TCWLZL.js', 'dist/c-DWBEWQEH.js', 'dist/c-F7WHT76T.js', 'dist/c-L2W5AMW2.js', 'dist/c-6JMLUU2L.js', 'dist/c-AP3P4QYF.js', 'dist/c-NLB3TXKJ.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DXNZ5F63.js', 'dist/c-3VF3KZPI.js', 'dist/c-MPTN5RTT.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-4G5JLGGF.js',
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
