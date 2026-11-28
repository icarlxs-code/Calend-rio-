/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-bxpywofa'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.min.css', 'css/arte.min.css', 'css/motion.min.css', 'css/marca.min.css', 'css/social.min.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-6YJEL6DV.js', 'dist/c-P4RKV64H.js', 'dist/c-3S3CQ24C.js', 'dist/c-ERNEPNAJ.js', 'dist/c-WNZ6T3IR.js', 'dist/c-YIGNMRWW.js', 'dist/c-O4HGI6PE.js', 'dist/c-JE6IKROI.js', 'dist/c-JPBTGPXK.js', 'dist/c-RFMJ3BSY.js', 'dist/c-O445RJAU.js', 'dist/c-IQN5L6IC.js', 'dist/c-3RT363D7.js', 'dist/c-NQE3KTHQ.js', 'dist/c-VHWBBUCL.js', 'dist/c-ZDNQ3GNA.js', 'dist/c-OCR46IVI.js', 'dist/c-DQBOVE2U.js', 'dist/c-LPHEAMPR.js', 'dist/c-2T7AOQJQ.js', 'dist/c-7HOH4UJA.js', 'dist/c-AC5QCVPJ.js', 'dist/c-KZCBTESS.js', 'dist/c-KHFJPHYQ.js', 'dist/c-LKM4EAUZ.js', 'dist/c-QH7JSKK5.js', 'dist/c-AIXNOQOU.js', 'dist/c-XXLSNEML.js', 'dist/c-OAJVIOFC.js', 'dist/c-WFFIWAOB.js', 'dist/c-EC5ELB52.js', 'dist/c-Z4DFIA47.js', 'dist/c-I75AAJN7.js', 'dist/c-IQBDK2ZG.js', 'dist/c-J4SPSMB5.js', 'dist/c-NIUENIMF.js', 'dist/c-YUV7SNJF.js', 'dist/c-2KWFEXCG.js', 'dist/c-XK2OFY7Q.js', 'dist/c-BTWZGVHU.js', 'dist/c-RTSAY3FL.js', 'dist/c-WNZQRYFN.js', 'dist/c-IDYYSBTB.js', 'dist/c-WSTZE5TF.js', 'dist/c-DFWA4DWU.js', 'dist/c-3ZG4WG2G.js', 'dist/c-MX6S4QB4.js', 'dist/c-S4KUXCP5.js', 'dist/c-K2JYDXUH.js', 'dist/c-CUBVE5KY.js', 'dist/c-SPEHI6T5.js', 'dist/c-TS6HNN75.js', 'dist/c-QS4HZBKU.js', 'dist/c-C7CEF7NP.js', 'dist/c-4SFXCNIL.js', 'dist/c-PGK3FQUD.js', 'dist/c-YG2TCDSG.js', 'dist/c-TQOJIJTR.js', 'dist/c-ZHTZ46DL.js', 'dist/c-GKRX3VAZ.js', 'dist/c-5RPMBV5L.js', 'dist/c-AV6V2NPK.js', 'dist/c-XHX6H43V.js', 'dist/c-T5L53EWT.js', 'dist/c-IIWQASNL.js', 'dist/c-CANFYD7V.js', 'dist/c-DD3RVNQS.js', 'dist/c-RGSLAURO.js', 'dist/c-6ZOBMRA2.js', 'dist/c-ENUMMWFN.js', 'dist/c-GTK5HTRY.js', 'dist/c-5XHTORLS.js', 'dist/c-LGIKDYEC.js', 'dist/c-VXADCDZR.js', 'dist/c-KDHNNT2N.js', 'dist/c-ZUKH5AMJ.js', 'dist/a-BXPYWOFA.js', 'dist/c-RTJAAAUS.js', 'dist/c-GP6G74JB.js', 'dist/c-MXPECG7A.js', 'dist/c-LE6HZZS2.js', 'dist/c-BUZN5LV4.js', 'dist/c-62OQIVJZ.js', 'dist/c-KSBQE2UX.js', 'dist/c-MUSO4KYU.js', 'dist/c-EPW2EKYN.js', 'dist/c-WX4VZ55V.js', 'dist/c-3CTHNYRA.js', 'dist/c-5PDVB3NO.js', 'dist/c-J426SFKS.js', 'dist/c-TNYHDKVL.js', 'dist/c-FQ3DTYVO.js', 'dist/c-MVZH3SKM.js', 'dist/c-3OASPHKA.js', 'dist/c-LTAOEWUY.js', 'dist/c-IGMYM35N.js', 'dist/c-ESHXVJOJ.js', 'dist/c-XYKMNGFW.js', 'dist/c-AWZZWFI4.js', 'dist/c-XS6KHVFM.js', 'dist/c-BZCHQH27.js', 'dist/c-XLEXKK7T.js', 'dist/c-GXLEURSU.js', 'dist/c-Q6I7IEDH.js', 'dist/c-EETEGCCZ.js', 'dist/c-J3SDGTW7.js', 'dist/c-SNLZVZRR.js', 'dist/c-BGSOZY67.js', 'dist/c-6PVVLET6.js', 'dist/c-5KDN44MS.js', 'dist/c-TEWDZH33.js', 'dist/c-IIB4MYNM.js', 'dist/c-Q7BUFF7C.js', 'dist/c-FJWD3IX2.js', 'dist/c-O3TUCUNQ.js', 'dist/c-BVL2GJU4.js', 'dist/c-DT6YIP5I.js', 'dist/c-5IK4ATAS.js', 'dist/c-3PDXO7FE.js', 'dist/c-LJHTDE6X.js', 'dist/c-MPQC26Q2.js', 'dist/c-V3RRGVRC.js', 'dist/c-3K3MBMEJ.js', 'dist/c-A2K3DQIA.js', 'dist/c-AWTR7I6J.js', 'dist/c-IEC476XV.js', 'dist/c-NKSKVPOQ.js', 'dist/c-IQEINLTJ.js', 'dist/c-IJV2S5GX.js', 'dist/c-YCLMESB2.js', 'dist/c-SKUAU4BX.js', 'dist/c-EGSCC6P4.js', 'dist/c-6LZWOCXP.js', 'dist/c-BLMYMSPS.js', 'dist/c-CIEJVWQB.js', 'dist/c-AQ2ADUWO.js', 'dist/c-RICAUSDB.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-JIHHR4O3.js', 'dist/c-MPTN5RTT.js', 'dist/c-S3CUES7U.js', 'dist/c-AGPHPKXT.js', 'js/roupas.js', 'js/utils.js', 'js/sininho.js', 'js/sfx.js', 'js/abertura.js', 'media/fonts/nunito-latin-ext-wght-normal.woff2', 'media/fonts/nunito-latin-wght-normal.woff2',
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
