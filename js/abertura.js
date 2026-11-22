/* Abertura do Lembra — motion design calculado a cada quadro da tela (60/120 fps).
   4 roteiros (MODELO 1–4), todos terminando na mesma METAMORFOSE com ENCAIXE EXATO:
   o ícone final é o ícone de verdade separado em camadas (assets/mascot/icone: fundo, olhos, pupilas,
   sobrancelhas, boca). Cada peça do Sininho desliza até a posição e o tamanho exatos da mesma peça no ícone
   (cada uma com a sua curva e o seu tempo); só quando estão sobrepostas a camada do ícone assume — sem corte.
   Depois o ícone continua vivo: pisca, as pupilas acompanham as letras, as sobrancelhas sobem.
     1 Splash    – uma gota cai, espirra, o Sininho salta da poça, olha em volta;
     2 Corrida   – ele entra correndo, freia levantando poeira, olha para você;
     3 Despertar – ele cochila, o sino balança (dim-dom), acorda surpreso;
     4 Espiada   – o quadrado aparece, ele espia por trás, olha, pula para dentro. */
import { sininho, alive } from './sininho.js';

/* ===== AJUSTES ===== */
export const MODELO = 1;            // roteiro usado no app (1 a 4)
export const FUNDO = 'branco';      // 'branco' ou 'preto'
export const SPEED = 1;             // velocidade geral (0.8 = mais lenta, 1.2 = mais rápida)
export const CURVE = {              // cubic-bezier, como no After Effects / Figma
  suave: [0.45, 0, 0.2, 1],
  saida: [0.16, 1, 0.3, 1],
  entrada: [0.55, 0, 0.9, 0.4],
  elastica: [0.34, 1.4, 0.5, 1],
  mola: [0.3, 1.18, 0.45, 1],
};

function bezier([x1, y1, x2, y2]) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let i = 0; i < 8; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - x) / d; } return Y(Math.max(0, Math.min(1, t))); };
}
const C = Object.fromEntries(Object.entries(CURVE).map(([k, v]) => [k, bezier(v)]));
const clamp = (x) => Math.max(0, Math.min(1, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;

/* geometria */
const T = 150;                       // quadrado do ícone durante a metamorfose (px)
const RS = 320, RSH = (RS * 1080) / 1160, U = RS / 1160; // elemento do boneco (px) e px por unidade do desenho
const ICON_F = 72, GAP = 14, WORD_H = 44, WW = 720, WH = 159, WORD_W = (WW / WH) * WORD_H;
const LET = [[1, 103], [105, 215], [228, 398], [414, 530], [541, 612], [612, 719]];
const LAYERS = ['base', 'olho-l', 'olho-r', 'pupila-l', 'pupila-r', 'sob-l', 'sob-r', 'boca'];
const FEAT = { eyeL: 'olho-l', eyeR: 'olho-r', pupL: 'pupila-l', pupR: 'pupila-r', browL: 'sob-l', browR: 'sob-r', mouth: 'boca' };
const BODY512 = [-4.5, 6, 521, 495];  // medido: larguras do sino em 3 alturas casam com o corpo do boneco   // onde o corpo do sino fica no ícone (espaço 512)
const DROPS = [[-1, -1.4, 7], [1, -1.6, 6], [-1.6, -0.8, 5], [1.7, -0.9, 6], [-0.6, -2, 4], [0.7, -2.1, 5], [-2.1, -0.4, 4], [2.2, -0.5, 4]];

let LAY = null;
const layP = fetch('assets/mascot/icone/layout.json').then((r) => r.json()).then((j) => { LAY = j.layers; }).catch(() => {});
export const ready = () => Promise.all([layP, ...LAYERS.map((n) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = res; i.src = `assets/mascot/icone/${n}.png`; }))]);

export function mountIntro(host) {
  host.innerHTML = `<div class="ab ab--${FUNDO}">
    <div class="ab__stage">
      <div class="ab__mark">
        <i class="ab__rip"></i><i class="ab__rip ab__rip--2"></i>
        <i class="ab__arc"></i><i class="ab__arc ab__arc--2"></i>
        <i class="ab__blob"><b></b></i>
        <i class="ab__sh"></i>
        ${DROPS.map(() => '<i class="ab__drop"></i>').join('')}
        <i class="ab__dust"></i><i class="ab__dust"></i><i class="ab__dust"></i>
        <div class="ab__rig">${sininho('feliz', { size: RS })}</div>
        <div class="ab__ico">${LAYERS.map((n) => `<img data-l="${n}" src="assets/mascot/icone/${n}.png" alt="" draggable="false">`).join('')}</div>
      </div>
      <div class="ab__word">${LET.map(([a, b]) => `<span class="ab__l" style="--a:${a};--w:${b - a}"></span>`).join('')}${LET.map(() => '<i class="ab__ld"></i>').join('')}</div>
      <p class="ab__tag">Seus compromissos, sempre lembrados</p>
    </div></div>`;
  alive();
  return host.querySelector('.ab');
}

export function runIntro(ab, { onEnd, model } = {}) {
  const M_ = model || (typeof window !== 'undefined' && window.__abModel) || MODELO;
  const $ = (s) => ab.querySelector(s), $$ = (s) => [...ab.querySelectorAll(s)];
  const mark = $('.ab__mark'), blob = $('.ab__blob'), rigEl = $('.ab__rig'), sh = $('.ab__sh'), word = $('.ab__word'), tag = $('.ab__tag'), ico = $('.ab__ico');
  const drops = $$('.ab__drop'), rips = $$('.ab__rip'), arcs = $$('.ab__arc'), dust = $$('.ab__dust'), ls = $$('.ab__l'), lds = $$('.ab__ld');
  const snh = rigEl.querySelector('[data-snh]'), R = snh && snh._rig && !snh._rig.pending ? snh._rig : null;
  const img = Object.fromEntries(LAYERS.map((n) => [n, ico.querySelector(`[data-l="${n}"]`)]));
  if (!LAY) { if (onEnd) onEnd(); return () => {}; }
  const toMark = ([x, y, w, h]) => [(x / 512 - 0.5) * T, (y / 512 - 0.5) * T, (w / 512) * T, (h / 512) * T];
  const MR = Object.fromEntries(LAYERS.map((n) => [n, toMark(LAY[n])]));
  LAYERS.forEach((n) => { const [x, y, w, h] = MR[n]; Object.assign(img[n].style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` }); });
  const LOCK_W = ICON_F + GAP + WORD_W, markX = -LOCK_W / 2 + ICON_F / 2, wordX = -LOCK_W / 2 + ICON_F + GAP, k = WORD_H / WH;
  word.style.cssText = `width:${WORD_W}px;height:${WORD_H}px;transform:translate(${wordX}px,${-WORD_H / 2}px)`;
  ls.forEach((l) => { const a = +l.style.getPropertyValue('--a'), w = +l.style.getPropertyValue('--w');
    Object.assign(l.style, { left: `${a * k}px`, width: `${w * k}px`, backgroundSize: `${WW * k}px ${WORD_H}px`, backgroundPosition: `${-a * k}px 0` }); });
  lds.forEach((d, i) => { const [a, b] = LET[i]; d.style.left = `${((a + b) / 2) * k}px`; });
  ab.style.setProperty('--fit', Math.min(1, (innerWidth - 40) / Math.max(LOCK_W, 300)));
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MS = { 1: 2.05, 2: 2.0, 3: 2.25, 4: 2.1 }[M_] || 2.05; // início da metamorfose
  const END = MS + 2.15;
  if (R) { R.next.idle = 1e9; R.next.blink = 1e9; R.setMood(M_ === 3 ? 'sono' : 'feliz', true); }
  const cue = {}, once = (n, t, at, fn) => { if (!cue[n] && t >= at) { cue[n] = 1; fn(); } };
  const zEnd = T / RS;
  /* retângulo da marca → coordenadas do desenho do boneco (dado o transform atual dele) */
  const toView = ([x, y, w, h], rx, ry, rz) => [400 + ((x - rx) / rz + RS / 2) / U, -40 + ((y - ry) / rz + RSH / 2) / U, w / rz / U, h / rz / U];

  let t0 = 0, raf = 0, done = false;
  const frame = () => {
    if (done) return;
    const now = performance.now();
    if (!t0) t0 = now;
    const t = calm ? END : ((now - t0) / 1000) * SPEED;
    const m = t - MS;

    /* ---------- roteiro ---------- */
    let rx = 0, ry = 0, rz = 0.47, rop = 1, by = 0, bw = 0, bh = 0, brad = 50, bop = 0, shOp = 0, shX = 0, shS = 1, rigBehind = false;
    if (M_ === 1) { /* SPLASH */
      const fall = C.entrada(seg(t, 0, 0.26)), land = seg(t, 0.26, 0.8);
      const wob = t < 0.26 ? 0 : Math.exp(-5 * land) * Math.cos(land * Math.PI * 1.6);
      bop = 1; bw = 30; bh = 36; by = lerp(-280, 44, fall);
      if (t >= 0.26) { bw = lerp(70, 160, C.saida(land)) * (1 + 0.22 * wob); bh = lerp(22, 30, C.saida(land)) * (1 - 0.28 * wob); by = 52; }
      drops.forEach((d, i) => { const [vx, vy, s] = DROPS[i], dt = Math.max(0, t - 0.27) * 1.2, o = t < 0.27 ? 0 : clamp(1 - dt * 1.5);
        d.style.width = d.style.height = `${s * 2}px`; d.style.opacity = o; d.style.transform = `translate(${vx * 95 * dt - s}px, ${46 + vy * 210 * dt + 380 * dt * dt - s}px) scale(${o ? 1 - dt * 0.5 : 0})`; });
      rips.forEach((rp, i) => { const r0 = i ? 0.72 : 0.27, rk = seg(t, r0, r0 + 0.7); rp.style.opacity = rk > 0 && rk < 1 ? (1 - rk) * 0.5 : 0; rp.style.transform = `translate(-50%, calc(-50% + 52px)) scale(${lerp(0.5, 2.4, C.saida(rk))}, ${lerp(0.5, 2.4, C.saida(rk)) * 0.27})`; });
      const pop = C.elastica(seg(t, 0.3, 0.95)), jump = Math.sin(Math.PI * seg(t, 0.3, 0.72)) * 50;
      rz = lerp(0.12, 0.47, pop); ry = lerp(30, -jump + 4, pop); rop = clamp(pop * 3);
      shOp = t < 0.3 ? 0 : 0.85; shS = lerp(0.4, 1, pop) * (1 - jump / 140);
      if (R) {
        once('b1', t, 1.0, () => R.blink());
        once('l1', t, 1.12, () => { R.s.px.t = -26; R.s.py.t = 4; R.s.lean.t = -2.2; });
        once('b2', t, 1.42, () => R.blink());
        once('l2', t, 1.52, () => { R.s.px.t = 26; R.s.py.t = 2; R.s.lean.t = 2.2; R.s.bY.t = -12; R.s.bYr.t = -14; });
        once('l3', t, 1.82, () => { R.s.px.t = 0; R.s.py.t = 0; R.s.lean.t = 0; R.s.bY.t = 0; R.s.bYr.t = 0; R.blink(); });
      }
    } else if (M_ === 2) { /* CORRIDA */
      const e = C.saida(seg(t, 0, 1.0));
      rx = lerp(-300, 0, e);
      const ph = t * Math.PI * 2 * 3.2, speed = 1 - e;
      if (R) {
        if (t < 0.95) { R.s.by.t = -Math.abs(Math.sin(ph)) * 40 * Math.max(0.25, speed); R.s.fL.t = Math.max(0, Math.sin(ph)) * 34 * speed; R.s.fR.t = Math.max(0, -Math.sin(ph)) * 34 * speed; R.s.lean.t = 9 * speed + 1; R.s.aL.t = 12 + Math.sin(ph) * 30 * speed; R.s.aR.t = -12 + Math.sin(ph) * 30 * speed; }
        once('brake', t, 0.95, () => { R.s.by.t = 0; R.s.fL.t = 0; R.s.fR.t = 0; R.s.lean.t = -7; R.s.sq.vel += 1.6; R.s.aL.t = 30; R.s.aR.t = -30; R.s.px.t = 18; });
        once('settle', t, 1.25, () => { R.s.lean.t = 0; R.s.aL.t = 12; R.s.aR.t = -12; R.s.px.t = 0; R.s.py.t = 0; });
        once('b1', t, 1.45, () => R.blink());
        once('br', t, 1.6, () => { R.s.bY.t = -14; R.s.bYr.t = -14; R.s.sq.vel += 0.8; });
        once('br2', t, 1.88, () => { R.s.bY.t = 0; R.s.bYr.t = 0; });
      }
      dust.forEach((d, i) => { const dk = seg(t, 0.95 + i * 0.05, 1.6 + i * 0.05); d.style.opacity = dk > 0 && dk < 1 ? (1 - dk) * 0.6 : 0; d.style.transform = `translate(${-40 - i * 22 - dk * 40}px, ${44 - dk * 26 - i * 4}px) scale(${lerp(0.4, 1.4 + i * 0.2, C.saida(dk))})`; });
      shOp = 0.8; shX = rx;
    } else if (M_ === 3) { /* DESPERTAR */
      const inn = C.saida(seg(t, 0, 0.5));
      rz = lerp(0.36, 0.47, inn); rop = inn; shOp = 0.75 * inn;
      if (R) {
        once('d1', t, 0.45, () => { R.s.lean.t = 7; });
        once('d2', t, 0.8, () => { R.s.lean.t = -7; });
        once('d3', t, 1.12, () => { R.s.lean.t = 0; });
        once('wake', t, 1.32, () => { R.setMood('surpreso'); R.s.sq.vel -= 2.2; R.s.by.vel -= 260; });
        once('happy', t, 1.75, () => { R.setMood('feliz'); });
        once('b1', t, 1.95, () => R.blink());
        once('l1', t, 2.02, () => { R.s.px.t = 14; });
        once('l2', t, 2.15, () => { R.s.px.t = 0; });
      }
      arcs.forEach((a, i) => { const a0 = i ? 0.8 : 0.45, ak = seg(t, a0, a0 + 0.6); a.style.opacity = ak > 0 && ak < 1 ? (1 - ak) * 0.8 : 0; a.style.transform = `translate(-50%, calc(-50% - 62px)) scale(${lerp(0.5, 1.6, C.saida(ak))})`; });
    } else { /* ESPIADA */
      const tp = C.elastica(seg(t, 0, 0.55));
      bop = 1; bw = lerp(0, T, tp); bh = bw; brad = 24.5;
      rigBehind = t < 1.95;
      ry = lerp(40, -78, C.mola(seg(t, 0.55, 0.95)));
      if (R) {
        once('l1', t, 1.0, () => { R.s.px.t = -24; R.s.lean.t = -3; });
        once('b1', t, 1.22, () => R.blink());
        once('l2', t, 1.32, () => { R.s.px.t = 24; R.s.lean.t = 3; });
        once('l3', t, 1.58, () => { R.s.px.t = 0; R.s.lean.t = 0; R.s.bY.t = -14; R.s.bYr.t = -14; });
        once('hop', t, 1.72, () => { R.s.sq.t = 0.1; });
        once('hop2', t, 1.82, () => { R.s.sq.t = 0; R.s.sq.vel -= 2; R.s.bY.t = 0; R.s.bYr.t = 0; });
      }
      if (t >= 1.82) ry = -78 - Math.sin(Math.PI * seg(t, 1.82, 2.1)) * 60;
    }

    /* ---------- METAMORFOSE com encaixe exato ---------- */
    let mo = 0;
    if (m >= 0) {
      mo = C.suave(seg(m, 0, 0.62));
      rx = lerp(rx, 0, mo); ry = lerp(ry, 0, mo); rz = lerp(rz, zEnd, mo); rop = 1;
      const g = C.mola(seg(m, 0, 0.6));
      if (M_ === 4) { bw = T; bh = T; brad = 24.5; by = 0; }
      else { bw = lerp(Math.max(bw, 10), T, g); bh = lerp(Math.max(bh, 10), T, g); by = lerp(by, 0, C.saida(seg(m, 0, 0.5))); brad = lerp(50, 24.5, C.suave(seg(m, 0.05, 0.6))); }
      bop = Math.max(bop, C.saida(seg(m, 0, 0.2)));
      shOp *= 1 - C.suave(seg(m, 0, 0.3));
      if (R) {
        if (!cue.mo) { cue.mo = 1; R.setMood('feliz'); Object.assign(R.s.px, { t: 0 }); R.s.py.t = 0; R.s.lean.t = 0; R.s.bY.t = 0; R.s.bYr.t = 0; R.s.by.t = 0; R.s.sq.t = 0; }
        const kk = {
          body: C.suave(seg(m, 0.04, 0.6)),
          eyeL: C.suave(seg(m, 0.1, 0.56)), eyeR: C.suave(seg(m, 0.13, 0.59)),
          pupL: C.mola(seg(m, 0.18, 0.64)), pupR: C.mola(seg(m, 0.21, 0.67)),
          browL: C.mola(seg(m, 0.22, 0.62)), browR: C.mola(seg(m, 0.25, 0.65)),
          mouth: C.mola(seg(m, 0.28, 0.7)),
        };
        // alvo no espaço do PRÓPRIO boneco (com o transform final): as peças viajam junto com o corpo e encaixam exato no fim
        const rr = { body: toView(toMark(BODY512), 0, 0, zEnd) };
        for (const [f, n] of Object.entries(FEAT)) rr[f] = toView(MR[n], 0, 0, zEnd);
        R.xf = { limbs: 1 - C.suave(seg(m, 0, 0.32)), abs: { k: kk, r: rr, a: {} } };
      }
    }
    /* as camadas do ícone assumem quando cada peça já está encaixada */
    img.base.style.opacity = C.suave(seg(m, 0.78, 1.0)); // o fundo só vem depois que o rosto do ícone está inteiro
    const pL = seg(m, 0.66, 0.69), pR = seg(m, 0.68, 0.71), eL = seg(m, 0.69, 0.75), eR = seg(m, 0.71, 0.77); // pupila do ícone primeiro (fica acima), depois o branco // olho e pupila assumem juntos (senão o branco cobre a pupila)
    const aF = { 'olho-l': eL, 'olho-r': eR, 'pupila-l': pL, 'pupila-r': pR, 'sob-l': seg(m, 0.65, 0.71), 'sob-r': seg(m, 0.67, 0.73), boca: seg(m, 0.71, 0.77) };
    for (const [n, a] of Object.entries(aF)) img[n].style.opacity = a;
    const rigGone = m >= 1.01;

    /* o ícone continua vivo (cada camada com o seu movimento) */
    if (m >= 1.01) {
      const lt = m - 1.01;
      const blink = (at) => { const b = seg(lt, at, at + 0.2); return b > 0 && b < 1 ? 1 - 0.92 * Math.sin(Math.PI * b) : 1; };
      const bl = Math.min(blink(0.6), blink(1.95));
      const look = C.suave(seg(lt, 0.3, 0.55)) * (1 - C.suave(seg(lt, 1.15, 1.45)));
      const browUp = C.mola(seg(lt, 0.28, 0.5)) * (1 - C.suave(seg(lt, 0.95, 1.25)));
      const land = ls.reduce((acc, _, i) => { const a = MS + 1.12 + i * 0.055 + 0.3, q = seg(t, a, a + 0.16); return acc + (q > 0 && q < 1 ? Math.sin(Math.PI * q) : 0); }, 0);
      ['olho-l', 'olho-r'].forEach((n) => { img[n].style.transformOrigin = '50% 55%'; img[n].style.transform = `scale(1, ${bl})`; });
      ['pupila-l', 'pupila-r'].forEach((n) => { const p = MR[n], e = MR[n.replace('pupila', 'olho')], oy = e[1] + e[3] * 0.55 - p[1];
        img[n].style.transformOrigin = `50% ${oy}px`; img[n].style.transform = `translate(${look * 4.2}px, ${-look * 0.6}px) scale(1, ${bl})`; });
      ['sob-l', 'sob-r'].forEach((n, i) => { img[n].style.transform = `translateY(${-browUp * 4.5}px) rotate(${(i ? 1 : -1) * browUp * 4}deg)`; });
      img.boca.style.transformOrigin = '50% 0'; img.boca.style.transform = `scale(${1 + land * 0.03}, ${1 + land * 0.08})`;
      ico.style.transform = `scale(${1 + Math.sin(lt * 2.4) * 0.006})`;
    }

    /* aplica */
    rigEl.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${rz})`;
    rigEl.style.opacity = rigGone ? 0 : rop;
    rigEl.style.zIndex = rigBehind ? 1 : 4;
    const cm = C.suave(seg(m, 0.05, 0.55)), half = lerp(RS, T / 2 / rz, cm), rad = lerp(RS, (T * 0.245) / rz, cm);
    let clip = 'none';
    if (m >= 0) clip = `inset(calc(50% - ${half}px) calc(50% - ${half}px) round ${rad}px)`;
    else if (rigBehind) { const cut = (-bh / 2 - ry) / rz + RSH / 2; clip = `inset(-50% -50% ${Math.max(0, RSH - cut)}px -50%)`; } // atrás do quadrado: só aparece o que está acima da borda
    rigEl.style.clipPath = clip;
    if (M_ === 4 && t < 0.5) rigEl.style.opacity = 0;
    blob.style.width = `${bw}px`; blob.style.height = `${bh}px`; blob.style.borderRadius = M_ === 4 || m >= 0 ? `${brad}%` : '50%';
    blob.style.transform = `translate(-50%, calc(-50% + ${by}px))`; blob.style.opacity = bop;
    blob.classList.toggle('is-tile', M_ === 4 || m >= 0);
    blob.firstChild.style.opacity = M_ === 1 ? clamp(1 - mo * 1.4) : 0;
    sh.style.opacity = shOp; sh.style.transform = `translate(calc(-50% + ${shX}px), 48px) scale(${shS})`;

    /* a marca se forma */
    const lk = C.mola(seg(m, 1.05, 1.7));
    mark.style.transform = `translate(${lerp(0, markX, lk)}px, 0) scale(${lerp(1, ICON_F / T, lk)})`;
    ls.forEach((l, i) => {
      const a = MS + 1.12 + i * 0.055, kk = seg(t, a, a + 0.48);
      l.style.opacity = clamp(kk * 4);
      l.style.transform = `translateY(${(1 - C.elastica(kk)) * -36}px) rotate(${(1 - C.saida(kk)) * (i % 2 ? -16 : 14)}deg) scale(${lerp(0.72, 1, C.saida(kk))})`;
      const sp = seg(t, a + 0.18, a + 0.48);
      lds[i].style.opacity = sp > 0 && sp < 1 ? (1 - sp) * 0.9 : 0;
      lds[i].style.transform = `translate(-50%, 0) scale(${lerp(0.3, 1.7, C.saida(sp))}, ${lerp(0.3, 0.55, C.saida(sp))})`;
    });
    const tk = C.saida(seg(m, 1.55, 1.95));
    tag.style.opacity = tk; tag.style.transform = `translate(-50%, ${lerp(8, 0, tk)}px)`;

    if (t >= END) { done = true; if (onEnd) onEnd(); return; }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { done = true; cancelAnimationFrame(raf); };
}
