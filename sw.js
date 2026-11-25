/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-2cl232e3'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.min.css', 'css/arte.min.css', 'css/motion.min.css', 'css/marca.min.css', 'css/social.min.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-PAU2KPQE.js', 'dist/c-XIQHMOSV.js', 'dist/c-4MG6RT62.js', 'dist/c-OOYIAXHF.js', 'dist/c-JNP3S2JA.js', 'dist/c-5A4W7KCH.js', 'dist/c-A76YQNU6.js', 'dist/c-OXIWKUPI.js', 'dist/c-KSPUOMRA.js', 'dist/c-7DTUIHWI.js', 'dist/c-WD3VBVZ3.js', 'dist/c-YOMKIYKO.js', 'dist/c-SFZXTNN2.js', 'dist/c-XLNSYIS7.js', 'dist/c-7QILX6LF.js', 'dist/c-5DYTC2AS.js', 'dist/c-G7ZHR4JJ.js', 'dist/c-HL3E3CZL.js', 'dist/c-WSQQBKZT.js', 'dist/c-JX6XJXFD.js', 'dist/c-ZU5B7IJ5.js', 'dist/c-4XHFS6AD.js', 'dist/c-DSGYXVMA.js', 'dist/c-T5MNA6J6.js', 'dist/c-ZVPTZG5U.js', 'dist/c-TWNEKMP7.js', 'dist/c-O6YLAXMT.js', 'dist/c-W7JPWIKH.js', 'dist/c-3ZFJLYX5.js', 'dist/c-I75AAJN7.js', 'dist/c-ZTNMS64R.js', 'dist/c-A4VAJOQF.js', 'dist/c-ECDTDCPO.js', 'dist/c-BJICBJHD.js', 'dist/c-WMRPQTCM.js', 'dist/c-PDUYZFE7.js', 'dist/c-PLFNVENW.js', 'dist/c-NJYGDUG7.js', 'dist/c-R5QNWGKE.js', 'dist/c-J2XCMAO2.js', 'dist/c-UVMAGZUK.js', 'dist/c-HWSX2PIS.js', 'dist/c-QMUDA2J7.js', 'dist/c-EC5ELB52.js', 'dist/c-QKAVIB3S.js', 'dist/c-HEOI3PTR.js', 'dist/c-JJFJEU37.js', 'dist/c-YCME6VEV.js', 'dist/c-GKXVQWIN.js', 'dist/c-NTHP3OD3.js', 'dist/c-COCKH2X2.js', 'dist/c-T5L53EWT.js', 'dist/c-N2JZKKXC.js', 'dist/c-P77YSJY2.js', 'dist/c-U6XMIKQ5.js', 'dist/c-O52HTZ4T.js', 'dist/c-JPGHZTHY.js', 'dist/c-YU2BFIR2.js', 'dist/c-423TVNX2.js', 'dist/c-V5DL4DRX.js', 'dist/c-RIHH7ZAH.js', 'dist/c-QXVFA6QG.js', 'dist/c-USY5UTD6.js', 'dist/c-TKLJZYQE.js', 'dist/a-2CL232E3.js', 'dist/c-5YQWZFFM.js', 'dist/c-X7KKGSXP.js', 'dist/c-AZUMLIE3.js', 'dist/c-BQSKSIX4.js', 'dist/c-TPL3TJ5X.js', 'dist/c-564CP3OW.js', 'dist/c-JQXFSY4F.js', 'dist/c-ZJNXGSVG.js', 'dist/c-H4OCSPHL.js', 'dist/c-PWEFW5ON.js', 'dist/c-7CDZKC5A.js', 'dist/c-D77I5BRK.js', 'dist/c-57TMWNBC.js', 'dist/c-BLWJ5DSN.js', 'dist/c-B6NMBC7H.js', 'dist/c-P5JDYXGA.js', 'dist/c-VRXJHYF2.js', 'dist/c-GGDRXL7Q.js', 'dist/c-FQ3DTYVO.js', 'dist/c-LCF6VAZ3.js', 'dist/c-3OASPHKA.js', 'dist/c-H2BSVXWA.js', 'dist/c-QX2OBUPP.js', 'dist/c-AKO7IGRA.js', 'dist/c-DOFFKJXD.js', 'dist/c-6PVVLET6.js', 'dist/c-5KDN44MS.js', 'dist/c-YS76YCAA.js', 'dist/c-4GQQEWNL.js', 'dist/c-ETX3XTJL.js', 'dist/c-Q7BUFF7C.js', 'dist/c-FJWD3IX2.js', 'dist/c-UDIK3IYU.js', 'dist/c-SAILFSXD.js', 'dist/c-5IK4ATAS.js', 'dist/c-2ZQFDC4M.js', 'dist/c-WD36NXW5.js', 'dist/c-V3RRGVRC.js', 'dist/c-GXLEURSU.js', 'dist/c-MS2DKBIL.js', 'dist/c-BVSGG3SY.js', 'dist/c-6LZWOCXP.js', 'dist/c-FT6C2W7M.js', 'dist/c-3NCQ26DR.js', 'dist/c-OSNYNATF.js', 'dist/c-JBD6Q2JF.js', 'dist/c-HGVZS7Q2.js', 'dist/c-UHQGRDES.js', 'dist/c-CIEJVWQB.js', 'dist/c-X442VGR4.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-KTN3RNUM.js', 'dist/c-J3YPHKOB.js', 'dist/c-CGIZ6YWE.js', 'dist/c-MPTN5RTT.js', 'dist/c-L4SNDX7B.js', 'dist/c-NFC3SKGJ.js', 'dist/c-MPQC26Q2.js', 'dist/c-CKL3W2LR.js', 'js/roupas.js', 'js/utils.js', 'js/sininho.js', 'js/sfx.js', 'js/abertura.js', 'media/fonts/nunito-latin-ext-wght-normal.woff2', 'media/fonts/nunito-latin-wght-normal.woff2',
];

/* o que precisa estar no celular para o app abrir: se faltar um, a versão nova não entra no lugar da antiga */
const OBRIGATORIO = (u) => u === 'index.html' || /\.(css|js|woff2|webmanifest)$/.test(u);
const limpa = async (res) => (res.redirected ? unredirect(res) : res);
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(async (c) => {
    const pega = async (u) => {
      if (u.startsWith('dist/')) { const v = await caches.match(u); if (v) return c.put(u, v); } // o nome muda a cada versão: o que já está no celular serve
      const res = await fetch(u, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`${u} ${res.status}`);
      await c.put(u, await limpa(res));
    };
    const ob = SHELL.filter(OBRIGATORIO), ex = SHELL.filter((u) => !OBRIGATORIO(u));
    for (let i = 0; i < ob.length; i += 12) await Promise.all(ob.slice(i, i + 12).map((u) => pega(u).catch(() => pega(u)))); // duas tentativas
    await Promise.all(ex.map((u) => pega(u).catch(() => {})));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  // só apaga o cache antigo do app (cal-…) e só com o novo inteiro; mídia, stories e avisos ficam
  e.waitUntil((async () => {
    const c = await caches.open(CACHE), tem = new Set((await c.keys()).map((r) => new URL(r.url).pathname.replace(new URL(self.registration.scope).pathname, '')));
    if (SHELL.filter(OBRIGATORIO).every((u) => tem.has(u))) await Promise.all((await caches.keys()).filter((k) => k.startsWith('cal-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});
const PAGINA_VAZIA = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lembra</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;text-align:center;padding:24px;background:#FFF6EE;color:#201008;font:700 18px/1.5 Nunito,system-ui,sans-serif}@media(prefers-color-scheme:dark){body{background:#0A0A0A;color:#fff}}</style><p>Abra o Lembra uma vez com internet.<br>Depois ele abre até sem.</p>';
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
  const cam = url.pathname.replace(new URL(self.registration.scope).pathname, '');
  // teste de internet de verdade: nunca responde pelo cache
  if (url.searchParams.has('ping')) return;
  // ABRIR A PÁGINA: rede com pouco tempo; não respondeu (avião, Wi-Fi morto, servidor fora), abre a cópia do celular.
  // Nunca decide por navigator.onLine: ele diz "conectado" mesmo sem internet.
  if (e.request.mode === 'navigate') {
    const app = cam === '' || cam === 'index.html';
    e.respondWith((async () => {
      const c = new AbortController(), t = setTimeout(() => c.abort(), 3200);
      try { const r = await fetch(e.request, { signal: c.signal }); if (r.status < 500) return r; } catch { /* sem rede */ } finally { clearTimeout(t); }
      const g = (await caches.match(app ? 'index.html' : e.request, { ignoreSearch: true })) || (app ? await caches.match('./') : null);
      return g ? unredirect(g) : new Response(PAGINA_VAZIA, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    })());
    return;
  }
  const guarda = (res) => { if (res.ok && res.status === 200 && !res.redirected) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); } return res; };
  // nome versionado: o conteúdo nunca muda
  if (cam.startsWith('dist/')) { e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request).then(guarda))); return; }
  // letras, ícones e estilos: na hora do celular, conferindo por trás
  if (/^(media\/fonts|icons)\//.test(cam)) { e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => { const net = fetch(e.request).then(guarda).catch(() => hit || Response.error()); if (hit) { e.waitUntil(net.catch(() => {})); return hit; } return net; })); return; }
  // demais: rede primeiro (recebe atualização), com pouco tempo; sem rede, a cópia do celular
  e.respondWith((async () => {
    const c = new AbortController(), t = setTimeout(() => c.abort(), 6000);
    try { const res = await fetch(e.request, { cache: 'no-cache', signal: c.signal }); if (res.redirected && new URL(res.url).origin !== location.origin) return res; if (res.status < 500) return guarda(res); } catch { /* sem rede */ } finally { clearTimeout(t); }
    const r = await caches.match(e.request, { ignoreSearch: true }); return r ? unredirect(r) : Response.error();
  })());
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
