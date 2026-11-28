/* Câmera do story, como no Instagram: abre em tela cheia já no formato 9:16, com o botão de tirar foto,
   o de virar a câmera e a galeria. A foto sai EXATAMENTE como aparece na tela (mesmo corte, e a câmera da
   frente sai como no espelho, do jeito que a pessoa se viu), sempre em 9:16 (1080×1920). */
import { icon } from './icons.js';

const toast2 = (t) => { const e = document.createElement('div'); e.className = 'scam__aviso'; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), 1600); };
const W = 1080, H = 1920, LIMITE = 400000; // o servidor aceita fotos até ~400 KB

/** canvas → JPEG que cabe no limite do servidor */
export function jpeg(c) {
  let q = 0.86, out = c.toDataURL('image/jpeg', q);
  while (out.length > LIMITE && q > 0.4) { q -= 0.08; out = c.toDataURL('image/jpeg', q); }
  if (out.length > LIMITE) { const m = document.createElement('canvas'); m.width = 720; m.height = Math.round(720 * c.height / c.width); m.getContext('2d').drawImage(c, 0, 0, m.width, m.height); return jpeg(m); } // menor, mesma proporção
  return out;
}

/** foto da galeria em 9:16: a foto inteira no meio, com o fundo feito dela mesma, desfocado (como o Instagram) */
export function encaixa916(src) {
  return new Promise((ok, erro) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      const iw = img.naturalWidth, ih = img.naturalHeight, r = iw / ih;
      if (Math.abs(r - W / H) < 0.02) { g.drawImage(img, 0, 0, W, H); return ok(jpeg(c)); } // já é 9:16
      // fundo: a própria foto cobrindo tudo, desfocada e um pouco escura
      const kc = Math.max(W / iw, H / ih); g.filter = 'blur(40px) brightness(.7)';
      g.drawImage(img, (W - iw * kc) / 2, (H - ih * kc) / 2, iw * kc, ih * kc); g.filter = 'none';
      // a foto inteira, centralizada
      const k = Math.min(W / iw, H / ih), w = iw * k, h = ih * k;
      g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      ok(jpeg(c));
    };
    img.onerror = () => erro(new Error('Não consegui ler a foto.'));
    img.src = src;
  });
}
const lerArquivo = (f) => new Promise((ok, erro) => { const u = URL.createObjectURL(f); encaixa916(u).then((x) => { URL.revokeObjectURL(u); ok(x); }, erro); });

export const temCamera = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

/** abre a câmera; devolve a foto 9:16 (data URL) ou null se fechou. soCamera: sem galeria (foto da hora) */
/* a câmera já liberada fica pausada uns minutos depois de fechar: abrir de novo nesse tempo reaproveita a mesma
   (no iPhone, desligar e ligar outra vez faz o sistema pedir a permissão de novo) */
let guardada = null;
const GUARDA_MS = 60 * 60e3; // pausada (sem imagem) enquanto o app está em uso: abrir de novo não pede permissão
function pegaGuardada(chave) {
  if (!guardada || guardada.chave !== chave) return null;
  const f = guardada.fluxo; f.dev = guardada.dev; clearTimeout(guardada.timer); guardada = null;
  const tr = f.getVideoTracks()[0];
  if (!tr || tr.readyState !== 'live') return null;
  f.getTracks().forEach((t) => (t.enabled = true));
  return f;
}
function guarda(fluxo, chave, dev = null) {
  if (!fluxo) return;
  if (guardada) { clearTimeout(guardada.timer); if (guardada.fluxo !== fluxo) guardada.fluxo.getTracks().forEach((t) => t.stop()); }
  fluxo.getTracks().forEach((t) => (t.enabled = false));             // pausada: sem imagem
  guardada = { fluxo, chave, dev, timer: setTimeout(() => { fluxo.getTracks().forEach((t) => t.stop()); guardada = null; }, GUARDA_MS) };
}
let lentesMemo = null; // as lentes do aparelho, descobertas uma vez (a câmera abre direto na certa nas próximas)
/* a tela cheia é posta direto em cada elemento (com prioridade) na hora de criar a câmera, antes de qualquer pintura:
   assim ela nunca aparece com a borda do formato antigo, nem na primeira vez depois de reabrir o app. */
const CSS_TELA = {
  '.scam': 'position:fixed;inset:0;width:100vw;height:100dvh;z-index:9600;background:#000;display:block;padding:0;margin:0',
  '.scam__quadro': 'position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto;border-radius:0;background:#000;overflow:hidden',
  '.scam__v': 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover',
  '.scam__x': 'position:absolute;top:calc(env(safe-area-inset-top,0px) + 10px);left:12px;z-index:3',
  '.scam__barra': 'position:absolute;left:0;right:0;bottom:0;width:auto;max-width:none;height:auto;padding:18px 0 calc(env(safe-area-inset-bottom,0px) + 26px);z-index:3;background:linear-gradient(to top,rgba(0,0,0,.45),transparent)',
  '.scam__zooms': 'position:absolute;left:50%;transform:translateX(-50%);margin:0;bottom:calc(env(safe-area-inset-bottom,0px) + 140px);z-index:3',
  '.scam__msg': 'z-index:3',
};
function aplicaTelaCheia(raiz) {
  for (const [sel, css] of Object.entries(CSS_TELA)) {
    const els = sel === '.scam' ? [raiz] : raiz.querySelectorAll(sel);
    els.forEach((el) => css.split(';').forEach((d) => { const i = d.indexOf(':'); if (i > 0) el.style.setProperty(d.slice(0, i).trim(), d.slice(i + 1).trim(), 'important'); }));
  }
}
/* Tela cheia garantida: as regras entram pelo próprio JavaScript (com !important), então o aparelho nunca mostra o
   quadro antigo com borda preta, mesmo que o arquivo de estilo guardado no celular ainda seja de uma versão anterior. */
const ESTILO_CAMERA = `
.scam{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;z-index:9600!important;background:#000!important;display:block!important;padding:0!important;margin:0!important;}
.scam__quadro{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;aspect-ratio:auto!important;border-radius:0!important;background:#000!important;overflow:hidden!important;}
.scam__v{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;}
.scam__x{position:absolute!important;top:calc(env(safe-area-inset-top,0px) + 10px)!important;left:12px!important;z-index:3!important;}
.scam__barra{position:absolute!important;left:0!important;right:0!important;bottom:0!important;width:auto!important;max-width:none!important;height:auto!important;padding:18px 0 calc(env(safe-area-inset-bottom,0px) + 26px)!important;z-index:3!important;background:linear-gradient(to top,rgba(0,0,0,.45),transparent)!important;}
.scam__zooms{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;margin:0!important;bottom:calc(env(safe-area-inset-bottom,0px) + 140px)!important;z-index:3!important;}
.scam__msg{z-index:3!important;}
`;
function garanteEstiloCamera() {
  if (document.getElementById('scam-tela-cheia')) return;
  const st = document.createElement('style'); st.id = 'scam-tela-cheia'; st.textContent = ESTILO_CAMERA; document.head.appendChild(st);
}
export function abreCamera({ soCamera = false, lado = 'environment', arrasto = null } = {}) {
  return new Promise((fim) => {
    let fluxo = null, frente = lado === 'user', acabou = false;
    /* ZOOM E LENTES (como a câmera do celular): pinça e botões 0.5x / 1x / 2x.
       1) se o aparelho tem a câmera "múltipla" (iPhone: dupla/tripla), o zoom dela troca de lente sozinho;
       2) senão, troca de lente pela lista de câmeras (ultra-angular, normal, tele) e completa com zoom digital. */
    let lentes = null, zoomHw = null, zDig = 1, zAtual = 1, nivel = 1; // nivel: 0.5, 1, 2, 3… (o número que a pessoa vê)
    const rotulo = (d) => (d.label || '').toLowerCase();
    const ehTras = (d) => !/front|frontal|frente|user|facetime/.test(rotulo(d));
    async function achaLentes() {
      try {
        const L = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput' && ehTras(d));
        const multi = L.find((d) => /tripla|triple|dupla|dual/.test(rotulo(d)));
        const ultra = L.find((d) => /ultra/.test(rotulo(d))), tele = L.find((d) => /tele/.test(rotulo(d)));
        const normal = L.find((d) => d !== ultra && d !== tele && d !== multi && !/dupla|dual|tripla|triple/.test(rotulo(d))) || L[0];
        return { multi, ultra, tele, normal };
      } catch { return {}; }
    }
    const w = document.createElement('div');
    w.className = 'scam'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Câmera do story');
    w.innerHTML = `<div class="scam__quadro"><video class="scam__v" playsinline muted autoplay></video><div class="scam__flash"></div><p class="scam__msg" hidden></p>
        <button type="button" class="scam__x" data-x aria-label="Fechar">${icon('x', 26)}</button></div>
      <div class="scam__zooms" hidden></div>
      <div class="scam__barra">
        ${soCamera ? '<span class="scam__vaga"></span>' : `<label class="scam__gal" aria-label="Escolher da galeria">${icon('image', 24)}<input type="file" accept="image/*" class="scam__arq" data-gal></label>`}
        <button type="button" class="scam__clique" data-foto aria-label="Tirar foto"><i></i></button>
        <button type="button" class="scam__vira" data-vira aria-label="Virar a câmera"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/></svg></button>
      </div>`;
    garanteEstiloCamera(); aplicaTelaCheia(w); document.body.appendChild(w); document.body.classList.add('has-scam');
    const v = w.querySelector('video'), msg = w.querySelector('.scam__msg');
    // a tela só aparece quando o vídeo já está rodando com imagem (nada de quadro parcial ou borda enquanto a câmera acorda)
    let revelou = false;
    const revela = () => { if (revelou || acabou) return; revelou = true; v.classList.add('is-vivo'); w.classList.add('is-in'); };
    v.addEventListener('playing', revela);
    v.addEventListener('loadeddata', () => { if (v.videoWidth) revela(); });
    setTimeout(revela, 1800); // se a câmera demorar, mostra mesmo assim (nunca fica tela preta para sempre)
    const para = () => { if (fluxo) fluxo.getTracks().forEach((t) => t.stop()); fluxo = null; };
    const sai = (x) => { if (acabou) return; acabou = true; guarda(fluxo, chaveAtual(), opts.deviceId); fluxo = null; w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-scam'); }, 220); fim(x); };
    const opts = { deviceId: null };
    const chaveAtual = () => (frente ? 'f' : 't');
    // quanto vale o "1x": na câmera múltipla do iPhone o zoom 1 é a ultra-angular (0.5x), então 1x = zoom 2
    const base = () => (zoomHw && zoomHw.multi && lentes && lentes.ultra ? 2 : 1);
    const niveisDisp = () => {
      if (frente) return [];
      const N = [];
      if (lentes && (lentes.ultra || (zoomHw && zoomHw.multi))) N.push(0.5);
      N.push(1);
      if (lentes && lentes.tele) N.push(/3/.test((lentes.tele.label || '')) ? 3 : 2); else N.push(2);
      return N;
    };
    function botoes() {
      const b = w.querySelector('.scam__zooms'); if (!b) return;
      const N = niveisDisp(); b.hidden = N.length < 2;
      b.innerHTML = N.map((n) => `<button type="button" data-z="${n}" class="${Math.abs(nivel - n) < 0.25 || (n === N.at(-1) && nivel > n) ? 'is-on' : ''}">${Math.abs(nivel - n) < 0.25 || (n === N.at(-1) && nivel >= n) ? `${(Math.round(nivel * 10) / 10).toString().replace('.', ',')}×` : String(n).replace('.', ',')}</button>`).join('');
      b.querySelectorAll('[data-z]').forEach((x) => (x.onclick = () => irPara(+x.dataset.z, true)));
    }
    let trocando = false;
    /** vai para o nível de zoom pedido (0.5 = ultra-angular), trocando de lente quando precisa */
    async function irPara(n, suave) {
      if (frente) return;
      const N = niveisDisp(); n = Math.max(N.includes(0.5) ? 0.5 : 1, Math.min(10, n)); nivel = n;
      const tr = fluxo && fluxo.getVideoTracks()[0];
      if (zoomHw && tr && (zoomHw.multi || n >= 1)) {           // zoom do próprio aparelho (a câmera múltipla troca de lente sozinha)
        const alvo = Math.max(zoomHw.min, Math.min(zoomHw.max, n * base()));
        try { await tr.applyConstraints({ advanced: [{ zoom: alvo }] }); zAtual = alvo; zDig = 1; } catch { zDig = n; }
        if (!zoomHw.multi && n < 1 && lentes && lentes.ultra) return trocaLente(lentes.ultra, 0.5);
      } else if (n < 1 && lentes && lentes.ultra) { return trocaLente(lentes.ultra, 0.5); }
      else if (n >= 2 && lentes && lentes.tele && !trocando && opts.deviceId !== lentes.tele.deviceId) { return trocaLente(lentes.tele, n); }
      else if (n >= 1 && lentes && opts.deviceId && opts.deviceId !== (lentes.normal && lentes.normal.deviceId) && !(lentes.tele && opts.deviceId === lentes.tele.deviceId && n >= 2) && !(lentes.multi && opts.deviceId === lentes.multi.deviceId)) { return trocaLente(lentes.normal, n); }
      else { const lenteBase = lentes && lentes.tele && opts.deviceId === lentes.tele.deviceId ? (/3/.test(lentes.tele.label) ? 3 : 2) : 1; zDig = Math.max(1, n / lenteBase); }
      v.style.transform = `${frente ? 'scaleX(-1) ' : ''}scale(${zDig})`; v.style.transition = suave ? 'transform .2s ease-out' : 'none';
      botoes();
    }
    async function trocaLente(d, n) {
      if (!d || trocando) return; trocando = true; opts.deviceId = d.deviceId; zDig = 1; nivel = n; v.style.transform = '';
      w.querySelector('.scam__quadro').classList.add('is-troca'); await liga(); w.querySelector('.scam__quadro').classList.remove('is-troca'); trocando = false;
    }
    const liga = async () => {
      para(); msg.hidden = true;
      try {
        if (!frente && !lentes) {                                   // já com permissão, os nomes das câmeras vêm: escolhe a lente antes de ligar
          lentes = lentesMemo || await achaLentes();
          if (!lentes.normal || !lentes.normal.label) lentes = null; else { lentesMemo = lentes; if (lentes.multi && !opts.deviceId) opts.deviceId = lentes.multi.deviceId; }
        }
        const dev = !frente && lentes ? (opts.deviceId || null) : null;
        const reuso = pegaGuardada(chaveAtual()); if (reuso) opts.deviceId = reuso.dev || null; // a mesma câmera de antes (sem pedir permissão de novo)
        fluxo = reuso || await navigator.mediaDevices.getUserMedia({ audio: false, video: { ...(dev ? { deviceId: { exact: dev } } : { facingMode: frente ? 'user' : { ideal: 'environment' } }), width: { ideal: 1920 }, height: { ideal: 1080 } } });
        if (acabou) return para();
        v.srcObject = fluxo; v.classList.toggle('is-frente', frente); await v.play().catch(() => {});
        if (!frente && !lentes) { lentes = await achaLentes(); if (lentes.normal && lentes.normal.label) lentesMemo = lentes; } // primeira vez: só descobre (a próxima já abre na câmera múltipla)
        const tr = fluxo.getVideoTracks()[0], cap = tr && tr.getCapabilities ? tr.getCapabilities() : {};
        zoomHw = cap && cap.zoom && cap.zoom.max > cap.zoom.min ? { min: cap.zoom.min, max: Math.min(cap.zoom.max, 15), passo: cap.zoom.step || 0.1, multi: !!(lentes && lentes.multi && opts.deviceId === lentes.multi.deviceId) } : null;
        if (zoomHw && zoomHw.multi) irPara(nivel, false); else botoes(); // câmera múltipla: começa no 1x (o zoom 1 dela é a ultra-angular)
      } catch (e) {
        msg.hidden = false;
        msg.textContent = /Permission|NotAllowed/i.test(e && e.name) ? 'O Lembra precisa da permissão da câmera. Libere nos ajustes do celular e tente de novo.' : 'Não consegui abrir a câmera agora.';
      }
    };
    w.querySelector('[data-x]').onclick = () => sai(null);
    const quadro = w.querySelector('.scam__quadro');
    // vai e volta (como no Instagram): com um dedo, arrastar da direita para a esquerda leva a câmera junto e fecha
    let volta = null;
    quadro.addEventListener('touchstart', (e) => { if (e.touches.length === 1 && !w.classList.contains('is-arrasto')) { const t = e.touches[0]; volta = { x: t.clientX, y: t.clientY, t: performance.now(), dx: 0, ok: null }; } else volta = null; }, { passive: true });
    quadro.addEventListener('touchmove', (e) => {
      if (!volta || e.touches.length !== 1) { if (volta && volta.ok) { w.style.transition = 'transform .2s'; w.style.transform = ''; } volta = null; return; }
      const t = e.touches[0], dx = t.clientX - volta.x, dy = t.clientY - volta.y;
      if (volta.ok === null && Math.hypot(dx, dy) > 12) { volta.ok = dx < 0 && -dx > Math.abs(dy) * 1.3; }
      volta.dx = Math.min(0, dx); w.style.transition = 'none'; w.style.transform = `translate3d(${volta.dx}px,0,0)`;
    }, { passive: true });
    quadro.addEventListener('touchend', () => {
      if (!volta || !volta.ok) { volta = null; return; }
      const v = -volta.dx / Math.max(1, performance.now() - volta.t), fecha = -volta.dx > innerWidth * 0.3 || (v > 0.5 && -volta.dx > 50); volta = null;
      if (fecha) { w.style.transition = 'transform .24s ease-in'; w.style.transform = 'translate3d(-100%,0,0)'; setTimeout(() => sai(null), 230); }
      else { w.style.transition = 'transform .22s cubic-bezier(.2,.9,.3,1)'; w.style.transform = 'translate3d(0,0,0)'; }
    });
    // pinça: abrir os dedos aproxima, fechar afasta (passando de 1x para 0,5x troca para a ultra-angular)
    let pinca = null;
    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    quadro.addEventListener('touchstart', (e) => { if (e.touches.length === 2) { pinca = { d0: dist(e.touches), n0: nivel }; e.preventDefault(); } }, { passive: false });
    quadro.addEventListener('touchmove', (e) => {
      if (!pinca || e.touches.length !== 2) return; e.preventDefault();
      const n = pinca.n0 * Math.pow(dist(e.touches) / pinca.d0, 1.15);
      if (!trocando) irPara(Math.round(n * 10) / 10, false);
    }, { passive: false });
    quadro.addEventListener('touchend', () => { pinca = null; });
    w.querySelector('[data-vira]').onclick = () => { opts.deviceId = null; nivel = 1; zDig = 1; v.style.transform = ''; frente = !frente; w.querySelector('[data-vira]').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }], { duration: 320, easing: 'ease-out' }); liga(); };
    const gal = w.querySelector('[data-gal]');
    if (gal) gal.onchange = async () => { const f = gal.files && gal.files[0]; if (!f) return; try { sai(await lerArquivo(f)); } catch (e) { msg.hidden = false; msg.textContent = e.message; } };
    w.querySelector('[data-foto]').onclick = () => {
      if (!v.videoWidth) return;
      // a foto é exatamente o que está na tela (tela cheia): mesma proporção do quadro, 1080 de largura
      const q = w.querySelector('.scam__quadro').getBoundingClientRect(), PW = W, PH = Math.round(Math.min(2400, Math.max(H, W * (q.height / q.width))));
      const c = document.createElement('canvas'); c.width = PW; c.height = PH; const g = c.getContext('2d');
      const vw = v.videoWidth, vh = v.videoHeight, k = Math.max(PW / vw, PH / vh) * zDig, dw = vw * k, dh = vh * k;
      if (frente) { g.translate(PW, 0); g.scale(-1, 1); } // a câmera da frente sai como a pessoa se viu (espelho), sem inverter
      g.drawImage(v, (PW - dw) / 2, (PH - dh) / 2, dw, dh);
      w.querySelector('.scam__flash').animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 260, easing: 'ease-out' });
      try { navigator.vibrate && navigator.vibrate(12); } catch { /* ok */ }
      setTimeout(() => sai(jpeg(c)), 140);
    };
    if (arrasto) {
      w.classList.add('is-in', 'is-arrasto'); w.style.transform = 'translate3d(-100%,0,0)';
      arrasto({
        mover: (k) => { w.style.transform = `translate3d(${(Math.min(1, Math.max(0, k)) - 1) * 100}%,0,0)`; },
        confirmar: () => { w.style.transition = 'transform .28s cubic-bezier(.2,.9,.3,1)'; w.style.transform = 'translate3d(0,0,0)'; setTimeout(() => { w.classList.remove('is-arrasto'); w.style.transition = ''; w.style.transform = ''; }, 300); },
        cancelar: () => { w.style.transition = 'transform .24s ease-in'; w.style.transform = 'translate3d(-100%,0,0)'; setTimeout(() => sai(null), 240); },
      });
    } else { /* a revelação vem quando o vídeo estiver rodando */ }
    liga();
  });
}
