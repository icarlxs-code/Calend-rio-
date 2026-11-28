/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-czrblw6h'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.min.css', 'css/arte.min.css', 'css/motion.min.css', 'css/marca.min.css', 'css/social.min.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-RN6NS4JK.js', 'dist/c-JE6IKROI.js', 'dist/c-UQRHTK6O.js', 'dist/c-YF5PWH6G.js', 'dist/c-E3K3W6RE.js', 'dist/c-6D6WIJ4P.js', 'dist/c-O6CTLLTC.js', 'dist/c-DQBOVE2U.js', 'dist/c-3S3CQ24C.js', 'dist/c-J2LMMNSR.js', 'dist/c-EZRQL5NI.js', 'dist/c-D2FT3QF3.js', 'dist/c-3P356FJD.js', 'dist/c-45NZCDSH.js', 'dist/c-XEQTR7FS.js', 'dist/c-32B42URL.js', 'dist/c-BLA4BFDR.js', 'dist/c-6FLZLTHP.js', 'dist/c-EEF5WJVC.js', 'dist/c-WM5HPMM3.js', 'dist/c-JI572GXO.js', 'dist/c-XUGMKVCA.js', 'dist/c-B4WC6ANO.js', 'dist/c-XILWVGF2.js', 'dist/c-ORVFZYWB.js', 'dist/c-ACFZQMAB.js', 'dist/c-UZSMCH6C.js', 'dist/c-CLT7KWLW.js', 'dist/c-FLCLWYZ4.js', 'dist/c-ESX62JTG.js', 'dist/c-PS3DJ7I6.js', 'dist/c-N3KPLFZQ.js', 'dist/c-FALYBY4Q.js', 'dist/c-KC4ZLGC2.js', 'dist/c-WSTZE5TF.js', 'dist/c-DJ5XB5H5.js', 'dist/c-WRGBJDDZ.js', 'dist/c-EQKQ6BNZ.js', 'dist/c-XAG6TEQJ.js', 'dist/c-XXLSNEML.js', 'dist/c-7T4BLJXU.js', 'dist/c-AIXNOQOU.js', 'dist/c-R3ACQTYY.js', 'dist/c-ZJANVST2.js', 'dist/c-I75AAJN7.js', 'dist/c-EC5ELB52.js', 'dist/c-TKBKYCL3.js', 'dist/c-MHFSQPR6.js', 'dist/c-YNJKNZAT.js', 'dist/c-N45HNBDN.js', 'dist/c-CJY46PQL.js', 'dist/c-AWVPBMCK.js', 'dist/c-I5HGPDQN.js', 'dist/c-K2JYDXUH.js', 'dist/c-NAB3DS37.js', 'dist/c-GIGCQKXW.js', 'dist/c-3QGGJXGO.js', 'dist/c-IP5W75ZK.js', 'dist/c-Q4UN5WTI.js', 'dist/c-KTKLJP3L.js', 'dist/c-FQHQ7ILY.js', 'dist/c-OX7T64E3.js', 'dist/c-TQOJIJTR.js', 'dist/c-IJERLIG7.js', 'dist/c-Q2UO5TGU.js', 'dist/c-WPR52VFD.js', 'dist/c-IFRUEYX2.js', 'dist/c-CBCZFZ55.js', 'dist/c-T5L53EWT.js', 'dist/c-CNFZITW2.js', 'dist/c-CM7Z2TDR.js', 'dist/c-DD3RVNQS.js', 'dist/c-RGSLAURO.js', 'dist/c-6ZOBMRA2.js', 'dist/c-ENUMMWFN.js', 'dist/c-GTK5HTRY.js', 'dist/c-DXNV5R3A.js', 'dist/c-2CAE5GZE.js', 'dist/c-OMRQYG2N.js', 'dist/c-XIODVEQQ.js', 'dist/c-SMXBEQGN.js', 'dist/a-CZRBLW6H.js', 'dist/c-4EFAIRZ4.js', 'dist/c-PBYNAM53.js', 'dist/c-QR77LSI2.js', 'dist/c-PCCH4ODN.js', 'dist/c-BSO47FPE.js', 'dist/c-MUSO4KYU.js', 'dist/c-KRLRBFPS.js', 'dist/c-KOPGSKCP.js', 'dist/c-DEBRBSKC.js', 'dist/c-RXDXUL5D.js', 'dist/c-5WLDT3LY.js', 'dist/c-FQ3DTYVO.js', 'dist/c-M57GNMO3.js', 'dist/c-LVFRAI6P.js', 'dist/c-JNSENJHH.js', 'dist/c-3OASPHKA.js', 'dist/c-BPAKP7US.js', 'dist/c-FZV4NNKM.js', 'dist/c-QLSAUP3S.js', 'dist/c-EQWCGYQ4.js', 'dist/c-HEIQEFIO.js', 'dist/c-N4QDWI6Q.js', 'dist/c-FHFTBPZJ.js', 'dist/c-FUELKO3W.js', 'dist/c-XLEXKK7T.js', 'dist/c-GXLEURSU.js', 'dist/c-Q6I7IEDH.js', 'dist/c-J3XRJ3EV.js', 'dist/c-HIHB2F6V.js', 'dist/c-UK5GCHDM.js', 'dist/c-BGSOZY67.js', 'dist/c-6PVVLET6.js', 'dist/c-5KDN44MS.js', 'dist/c-RR23K5TD.js', 'dist/c-ZSBL3N6O.js', 'dist/c-Q7BUFF7C.js', 'dist/c-FJWD3IX2.js', 'dist/c-434QLPL5.js', 'dist/c-3MLDEMXY.js', 'dist/c-636EANXA.js', 'dist/c-5IK4ATAS.js', 'dist/c-AKHUMFCY.js', 'dist/c-Y5GSBCDA.js', 'dist/c-MPQC26Q2.js', 'dist/c-V3RRGVRC.js', 'dist/c-3K3MBMEJ.js', 'dist/c-A2K3DQIA.js', 'dist/c-AWTR7I6J.js', 'dist/c-IEC476XV.js', 'dist/c-F2QFWGPS.js', 'dist/c-ZRCBSHUF.js', 'dist/c-IJV2S5GX.js', 'dist/c-HR46EEJQ.js', 'dist/c-RI4BMA2O.js', 'dist/c-FSVILGQT.js', 'dist/c-6LZWOCXP.js', 'dist/c-MPX6Y7QE.js', 'dist/c-CIEJVWQB.js', 'dist/c-AQ2ADUWO.js', 'dist/c-RICAUSDB.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-FZKIUGLE.js', 'dist/c-MPTN5RTT.js', 'dist/c-S3CUES7U.js', 'dist/c-AGPHPKXT.js', 'js/roupas.js', 'js/utils.js', 'js/sininho.js', 'js/sfx.js', 'js/abertura.js', 'media/fonts/nunito-latin-ext-wght-normal.woff2', 'media/fonts/nunito-latin-wght-normal.woff2',
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
    // atualização forçada (?u= ou ?r=): SÓ a rede, nunca a cópia velha — assim o celular nunca fica preso numa versão antiga
    const forcar = url.searchParams.has('u') || url.searchParams.has('r');
    e.respondWith((async () => {
      const c = new AbortController(), t = setTimeout(() => c.abort(), forcar ? 12000 : 3200);
      try { const r = await fetch(e.request, { cache: 'reload', signal: c.signal }); if (r.status < 500) return r; } catch { /* sem rede */ } finally { clearTimeout(t); }
      if (forcar) return new Response(PAGINA_VAZIA, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
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
