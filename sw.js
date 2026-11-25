/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-75zealxs'/*CACHE*/;
const MEDIA = 'lembra-media-v1';
const SHELL = [
  './', 'index.html', 'css/app.min.css', 'css/arte.min.css', 'css/motion.min.css', 'css/marca.min.css', 'css/social.min.css', 'assets/mascot/3d/acena.webp', 'assets/mascot/3d/voa.webp', 'assets/mascot/3d/joia.webp', 'assets/mascot/3d/aponta.webp', 'assets/mascot/3d/pensa.webp', 'assets/mascot/3d/amor.webp', 'assets/mascot/3d/festa.webp', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'assets/fundos/raios.webp', 'assets/fundos/leque.webp', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-SZZJ7PMF.js', 'dist/c-XHIDIFDK.js', 'dist/c-GCNCWFLP.js', 'dist/c-JUWQHFN4.js', 'dist/c-JNN2TEL4.js', 'dist/c-B3NW52H6.js', 'dist/c-FINB4NOZ.js', 'dist/c-TJFQMCII.js', 'dist/c-OJU43W4E.js', 'dist/c-BUIHDEDW.js', 'dist/c-VK5URNAQ.js', 'dist/c-KBBO463L.js', 'dist/c-L5MNSBSH.js', 'dist/c-MBAEYG25.js', 'dist/c-QFOGUZ7T.js', 'dist/c-HR4RMI3E.js', 'dist/c-FRWQLIH2.js', 'dist/c-RPKNAT6Z.js', 'dist/c-CV6CMZNW.js', 'dist/c-KCEE3KDR.js', 'dist/c-RRRPOQPJ.js', 'dist/c-2SBTB7NM.js', 'dist/c-JBFMXOHY.js', 'dist/c-UXA2FOZA.js', 'dist/c-6RSMZWIK.js', 'dist/c-6WHPXFTZ.js', 'dist/c-5WB4EGYH.js', 'dist/c-7PJKNCVP.js', 'dist/c-FGDN3WUP.js', 'dist/c-I75AAJN7.js', 'dist/c-PQFYQNJA.js', 'dist/c-5D33MLFJ.js', 'dist/c-VXC4PWC4.js', 'dist/c-457AJ5O6.js', 'dist/c-4GKLXTZP.js', 'dist/c-EPUKQUKP.js', 'dist/c-WYHALVYF.js', 'dist/c-KEVFXU6S.js', 'dist/c-D3IU34YU.js', 'dist/c-ZDU4EDUE.js', 'dist/c-VYFKHCP7.js', 'dist/c-W3WOT76U.js', 'dist/c-Z32ZGX6M.js', 'dist/c-KIDFC4E3.js', 'dist/c-O347OEQL.js', 'dist/c-X3P3SMAO.js', 'dist/c-YFU5V7XO.js', 'dist/c-MPCLJ7DC.js', 'dist/c-N4P4Q4PI.js', 'dist/c-OBSUTIFB.js', 'dist/c-QPQVP26T.js', 'dist/c-T5L53EWT.js', 'dist/c-IDRFOWJW.js', 'dist/c-GZJAOIME.js', 'dist/c-EY57AQZB.js', 'dist/c-M2KGVPHO.js', 'dist/c-5U4TDZAW.js', 'dist/c-MIULXWXY.js', 'dist/c-ASVOM4LI.js', 'dist/c-IDR3BKMB.js', 'dist/c-CUEDQDYQ.js', 'dist/c-WLJPMT3Q.js', 'dist/c-7MTAQRZL.js', 'dist/c-AVC5ERMB.js', 'dist/a-75ZEALXS.js', 'dist/c-QH32B665.js', 'dist/c-R52XWUWX.js', 'dist/c-UKA4P4JV.js', 'dist/c-6Q6CR5GO.js', 'dist/c-5LEQQ4ON.js', 'dist/c-W4BXVU7F.js', 'dist/c-53U5DZ4S.js', 'dist/c-G52G4ZYV.js', 'dist/c-RTLNXXXI.js', 'dist/c-LA3TY5OC.js', 'dist/c-EK7X4AP7.js', 'dist/c-3ZCJGN35.js', 'dist/c-G7VTLZ4G.js', 'dist/c-MC4PASWC.js', 'dist/c-75AUDXLV.js', 'dist/c-GXLEURSU.js', 'dist/c-Q2QNNZ6M.js', 'dist/c-SFZ7TEMZ.js', 'dist/c-AKI7GPQV.js', 'dist/c-FQ3DTYVO.js', 'dist/c-2AH5CJGW.js', 'dist/c-3OASPHKA.js', 'dist/c-PZQXEDQG.js', 'dist/c-GF7OF5G2.js', 'dist/c-JDSJIZDO.js', 'dist/c-R6HU5P3P.js', 'dist/c-6PVVLET6.js', 'dist/c-5KDN44MS.js', 'dist/c-TXABM6Z4.js', 'dist/c-6ETV3AVE.js', 'dist/c-EJS7U3OT.js', 'dist/c-HK7QHYSV.js', 'dist/c-FJWD3IX2.js', 'dist/c-VNC2QS5D.js', 'dist/c-YIXIYK2N.js', 'dist/c-5IK4ATAS.js', 'dist/c-IOKV2FWH.js', 'dist/c-DQVU4PXA.js', 'dist/c-V3RRGVRC.js', 'dist/c-HNU56755.js', 'dist/c-FVXE7SW7.js', 'dist/c-TNHIJLAU.js', 'dist/c-67WMPW24.js', 'dist/c-H6PM4QRI.js', 'dist/c-F2WBRTAH.js', 'dist/c-ZZ4XH6O7.js', 'dist/c-B2IZHLZP.js', 'dist/c-E4AX3FJP.js', 'dist/c-CIEJVWQB.js', 'dist/c-WWTNKPRM.js', 'dist/c-5PVYAXQB.js', 'dist/c-JRZKGWYQ.js', 'dist/c-S22CTDX7.js', 'dist/c-OSUPC35O.js', 'dist/c-VA4GV6J2.js', 'dist/c-WGMBN2RI.js', 'dist/c-MPTN5RTT.js', 'dist/c-L4SNDX7B.js', 'dist/c-V3MHWQEV.js', 'dist/c-MPQC26Q2.js', 'dist/c-X2DG7C6C.js', 'js/roupas.js', 'js/utils.js', 'js/sininho.js', 'js/sfx.js', 'js/abertura.js', 'media/fonts/nunito-latin-ext-wght-normal.woff2', 'media/fonts/nunito-latin-wght-normal.woff2',
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
