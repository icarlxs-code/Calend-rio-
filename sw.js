/* Service worker: funciona offline, recebe notificações e abre o app no lugar certo */
const CACHE = /*CACHE*/'cal-mbjcadps'/*CACHE*/;
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest', 'media/intro-poster5.jpg',
  ...Array.from({ length: 67 }, (_, i) => `media/intro5/f${String(i + 1).padStart(3, '0')}.webp`),
  'media/logos/pura-vida.jpg', 'media/lembra-logo.jpg', 'media/marca/completa-preto.png', 'media/marca/completa-branco.png', 'media/marca/simbolo-preto.png', 'media/marca/simbolo-branco.png', 'media/marca/palavra-preto.png', 'media/marca/palavra-branco.png', 'media/marca/letra-preto.png', 'media/marca/letra-branco.png', 'version.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-64.png',
  /*FILES*/ 'dist/c-SPA54QKL.js', 'dist/c-ZA23NR5E.js', 'dist/c-IGFLVF47.js', 'dist/c-HASFE2PY.js', 'dist/c-KBK2G5DU.js', 'dist/c-BRBNOKNA.js', 'dist/c-V5NPRO4P.js', 'dist/c-5AYBDAZK.js', 'dist/c-NSHIGLN4.js', 'dist/c-R63RM75N.js', 'dist/c-4IFNTBWF.js', 'dist/c-YFSUTZ3R.js', 'dist/c-AXADPC4U.js', 'dist/c-RSJNBHP6.js', 'dist/c-6FRBO5XY.js', 'dist/c-JG6YRTZ2.js', 'dist/c-6SHL6JZX.js', 'dist/c-2S5YXJVH.js', 'dist/c-ANI7FB62.js', 'dist/c-N7ZOWCHM.js', 'dist/c-VZI6U37K.js', 'dist/a-MBJCADPS.js', 'dist/c-65BWULEF.js', 'dist/c-5LJA5VHN.js', 'dist/c-SQQHXUPS.js', 'dist/c-DHJXFGH4.js', 'dist/c-TDQPVY2S.js', 'dist/c-RMNP4NU5.js', 'dist/c-Q4EISH7I.js', 'dist/c-JLBFK54P.js', 'dist/c-5ZMWSFDA.js', 'dist/c-6ZWBXTLH.js', 'dist/c-HFSGKBMP.js', 'dist/c-EPIKRU6E.js', 'dist/c-6Z7ZFPYZ.js', 'dist/c-KYCL6DWF.js', 'dist/c-TA7SIA5Q.js', 'dist/c-L26MC5JA.js', 'dist/c-WJYAEZSL.js', 'dist/c-CCSBP2FY.js', 'dist/c-FKOIJVZK.js', 'dist/c-DLXVYZDY.js', 'dist/c-3GSSGVWY.js', 'dist/c-HVTGVZUS.js', 'dist/c-6PVVLET6.js', 'dist/c-QGLKBVRA.js', 'dist/c-Q4J7C4JJ.js', 'dist/c-45DFUABZ.js', 'dist/c-XQMLTXRG.js', 'dist/c-FQJ5CCBF.js', 'dist/c-DWBEWQEH.js', 'dist/c-PYAWNVDU.js', 'dist/c-ZUAJ4OTH.js', 'dist/c-4G6P2CFT.js', 'dist/c-BRVTFY66.js', 'dist/c-TPZLRKKC.js', 'dist/c-KNIJGAA2.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // vídeo: o iPhone pede em pedaços (Range); deixa o navegador cuidar direto
  if (url.pathname.endsWith('.mp4')) return;
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
  const req = e.request.mode === 'navigate' ? e.request.url : e.request;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        // o app mudou de endereço (ex.: github.io → meulembra.com.br): a abertura segue o novo endereço.
        // Sem isto, o navegador recusa a resposta redirecionada e mostra uma página de erro.
        if (res.redirected && e.request.mode === 'navigate') return Response.redirect(res.url, 302);
        if (res.redirected && new URL(res.url).origin !== location.origin) return res; // arquivo vindo do endereço novo: usa, mas não guarda
        if (res.ok && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))),
  );
});

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
      data: { url: d.url || './' },
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
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      const c = cs.find((x) => x.url.startsWith(self.registration.scope));
      if (c) {
        c.postMessage({ type: 'open', url: target });
        return c.focus();
      }
      // abriu pelo aviso: o app conta isso (ajuda a acertar o melhor horário dos próximos avisos)
      let t2 = target; try { const u = new URL(target); u.searchParams.set('src', 'notif'); t2 = u.href; } catch { /* ok */ }
      return self.clients.openWindow(t2);
    }),
  );
});
