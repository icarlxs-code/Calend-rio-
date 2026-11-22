/* Abertura do Lembra — motion design (fundo branco, ~3,7 s, calculada a cada quadro da tela: 60/120 fps).
   Roteiro, cada elemento com a sua própria curva:
   1) SPLASH: uma gota laranja cai, achata no chão e espirra gotinhas (com gravidade);
   2) o Sininho salta de dentro do splash (mola, passa do ponto e assenta);
   3) ATUAÇÃO: pisca, olha para um lado, pisca, olha para o outro, sobrancelha de curiosidade;
   4) METAMORFOSE contínua: ele agacha (antecipação); a poça laranja cresce e vira um quadrado arredondado
      (círculo → squircle) enquanto ele aproxima e "veste" o quadrado; o desenho do ícone se completa devagar;
   5) a marca se forma: o ícone desliza, as letras caem uma a uma com um respingo, a frase aparece. */
import { sininho, alive } from './sininho.js';

const LET = [[1, 103], [105, 215], [228, 398], [414, 530], [541, 612], [612, 719]];
const WW = 720, WH = 159;
/* ===== CURVAS DE MOVIMENTO (ajuste aqui) =====
   SPEED: velocidade geral (1 = normal, 0.8 = mais lenta, 1.2 = mais rápida).
   Cada curva é uma cubic-bezier (as mesmas do After Effects / Figma): [x1, y1, x2, y2]. */
export const SPEED = 0.92;
export const CURVE = {
  suave: [0.45, 0, 0.2, 1],       // entrada e saída suaves (padrão de motion design)
  saida: [0.16, 1, 0.3, 1],       // começa rápido e desacelera longamente ("expo out")
  entrada: [0.55, 0, 0.9, 0.4],   // acelera como algo caindo (gravidade)
  elastica: [0.34, 1.45, 0.5, 1], // passa do ponto e volta, sem tremer
  mola: [0.3, 1.25, 0.45, 1],     // passa um pouquinho do ponto
};
function bezier([x1, y1, x2, y2]) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let i = 0; i < 8; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - x) / d; } return Y(Math.max(0, Math.min(1, t))); };
}
const C = Object.fromEntries(Object.entries(CURVE).map(([k, v]) => [k, bezier(v)]));
const clamp = (x) => Math.max(0, Math.min(1, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eOut = C.saida, eOut5 = C.saida, eIn = C.entrada, eIO = C.suave;
const back = (x) => C.elastica(x);
/* mola amortecida bem suave (sem tremedeira) */
const spring = (x, k = 7, f = 1.2) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-k * x) * Math.cos(f * Math.PI * x * 0.9));
const lerp = (a, b, k) => a + (b - a) * k;
const DROPS = [[-1, -1.4, 7], [1, -1.6, 6], [-1.6, -0.8, 5], [1.7, -0.9, 6], [-0.6, -2, 4], [0.7, -2.1, 5], [-2.1, -0.4, 4], [2.2, -0.5, 4]];

export function mountIntro(host) {
  host.innerHTML = `<div class="ab">
    <div class="ab__stage">
      <div class="ab__mark">
        <i class="ab__rip"></i><i class="ab__rip ab__rip--2"></i>
        <i class="ab__blob"><b></b></i>
        <i class="ab__sh"></i>
        ${DROPS.map(() => '<i class="ab__drop"></i>').join('')}
        <div class="ab__rig">${sininho('feliz', { size: 132 })}</div>
      </div>
      <div class="ab__word">${LET.map(([a, b]) => `<span class="ab__l" style="--a:${a};--w:${b - a}"></span>`).join('')}${LET.map(() => '<i class="ab__ld"></i>').join('')}</div>
      <p class="ab__tag">Seus compromissos, sempre lembrados</p>
    </div></div>`;
  alive();
  return host.querySelector('.ab');
}

export function runIntro(ab, { onEnd } = {}) {
  const $ = (s) => ab.querySelector(s);
  const mark = $('.ab__mark'), blob = $('.ab__blob'), rigEl = $('.ab__rig'), sh = $('.ab__sh'), rips = [...ab.querySelectorAll('.ab__rip')], word = $('.ab__word'), tag = $('.ab__tag');
  const drops = [...ab.querySelectorAll('.ab__drop')], ls = [...ab.querySelectorAll('.ab__l')], lds = [...ab.querySelectorAll('.ab__ld')];
  const snh = rigEl.querySelector('[data-snh]'), R = snh && snh._rig && !snh._rig.pending ? snh._rig : null;
  const T = 122, ICON_F = 70, GAP = 14, WORD_H = 44, WORD_W = (WW / WH) * WORD_H;
  const LOCK_W = ICON_F + GAP + WORD_W, markX = -LOCK_W / 2 + ICON_F / 2, wordX = -LOCK_W / 2 + ICON_F + GAP;
  const k = WORD_H / WH;
  word.style.cssText = `width:${WORD_W}px;height:${WORD_H}px;transform:translate(${wordX}px,${-WORD_H / 2}px)`;
  ls.forEach((l) => { const a = +l.style.getPropertyValue('--a'), w = +l.style.getPropertyValue('--w');
    Object.assign(l.style, { left: `${a * k}px`, width: `${w * k}px`, backgroundSize: `${WW * k}px ${WORD_H}px`, backgroundPosition: `${-a * k}px 0` }); });
  lds.forEach((d, i) => { const [a, b] = LET[i]; d.style.left = `${((a + b) / 2) * k}px`; });
  ab.style.setProperty('--fit', Math.min(1, (innerWidth - 40) / Math.max(LOCK_W, 300)));
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const END = calm ? 1.2 : 3.9;
  if (R) { R.next.idle = 1e9; R.next.blink = 1e9; R.setMood('feliz', true); }
  const cue = {};
  const once = (n, t, at, fn) => { if (!cue[n] && t >= at) { cue[n] = 1; fn(); } };

  let t0 = 0, raf = 0, done = false;
  const frame = () => {
    if (done) return;
    const now = performance.now();
    if (!t0) t0 = now;
    const t = calm ? 3.7 : ((now - t0) / 1000) * SPEED;

    /* 1) gota cai e espirra */
    const fall = eIn(seg(t, 0, 0.26)), land = seg(t, 0.26, 0.75);
    const wob = t < 0.26 ? 0 : Math.exp(-5 * land) * Math.cos(land * Math.PI * 1.6);
    let bw = 30, bh = 36, by = lerp(-260, 40, fall), radius = '50%';
    if (t >= 0.26) { bw = lerp(70, 150, eOut(land)) * (1 + 0.25 * wob); bh = lerp(22, 30, eOut(land)) * (1 - 0.3 * wob); by = 50; }
    drops.forEach((d, i) => {
      const [vx, vy, s] = DROPS[i], dt = Math.max(0, t - 0.27) * 1.25;
      const x = vx * 95 * dt, y = 46 + vy * 210 * dt + 380 * dt * dt, o = t < 0.27 ? 0 : clamp(1 - dt * 1.6);
      d.style.width = d.style.height = `${s * 2}px`; d.style.opacity = o;
      d.style.transform = `translate(${x - s}px, ${y - s}px) scale(${o ? 1 - dt * 0.6 : 0})`;
    });
    /* 2) salta do splash */
    const pop = C.elastica(seg(t, 0.3, 0.95)), jump = Math.sin(Math.PI * seg(t, 0.3, 0.72)) * 46;
    /* 3) atuação */
    if (R) {
      once('b1', t, 0.98, () => R.blink());
      once('l1', t, 1.12, () => { R.s.px.t = -26; R.s.py.t = 4; R.s.lean.t = -2.2; });
      once('b2', t, 1.42, () => R.blink());
      once('l2', t, 1.5, () => { R.s.px.t = 26; R.s.py.t = 2; R.s.lean.t = 2.2; R.s.bY.t = -12; R.s.bYr.t = -14; });
      once('l3', t, 1.86, () => { R.s.px.t = 0; R.s.py.t = 0; R.s.lean.t = 0; R.s.bY.t = 0; R.s.bYr.t = 0; });
      once('b3', t, 1.78, () => R.blink());
      once('b4', t, 2.22, () => R.blink());
      once('sq', t, 1.95, () => { R.s.sq.t = 0.1; R.s.by.t = 10; });
      once('up', t, 2.14, () => { R.s.sq.t = 0; R.s.by.t = 0; R.s.sq.vel -= 1.6; });
    }
    /* 4) metamorfose: poça → squircle; o boneco veste o quadrado */
    const mo = eIO(seg(t, 2.0, 2.85)), grow = C.mola(seg(t, 2.0, 2.85));
    if (t >= 2.0) { bw = lerp(150, T, grow); bh = lerp(30, T, grow); by = lerp(50, 0, eOut5(seg(t, 2.05, 2.6))); radius = `${lerp(50, 24.6, mo)}%`; }
    blob.style.width = `${bw}px`; blob.style.height = `${bh}px`; blob.style.borderRadius = radius;
    blob.style.transform = `translate(-50%, calc(-50% + ${by}px))`;
    const zoom = lerp(1, 1.61, mo);
    rigEl.style.transform = `translate(-50%, calc(-50% + ${lerp(lerp(30, -jump, pop), 1.2, mo)}px)) scale(${lerp(0.25, 1, pop) * zoom})`;
    rigEl.style.opacity = clamp(pop * 3);
    const cm = eIO(seg(t, 2.0, 2.7)), half = lerp(150, T / 2 / zoom, cm), rad = lerp(80, 30 / zoom, cm);
    rigEl.style.clipPath = t >= 2.0 ? `inset(calc(50% - ${half}px) calc(50% - ${half}px) round ${rad}px)` : 'none';
    /* deformação peça a peça (cada uma com a sua curva e o seu tempo) — o ícone É o boneco, sem troca de imagem */
    if (R) R.xf = {
      limbs: 1 - eIO(seg(t, 1.98, 2.4)),                                   // pés e braços recolhem para dentro
      body: lerp(1, 1.1, eIO(seg(t, 2.05, 2.6))),                          // corpo alarga e ocupa o quadrado
      eye: lerp(1, 1.08, C.elastica(seg(t, 2.18, 2.7))),                   // olhos crescem (passam do ponto)
      eyeDx: lerp(0, 12, eIO(seg(t, 2.18, 2.6))), eyeDy: lerp(0, 14, eIO(seg(t, 2.18, 2.6))),
      pupil: lerp(1, 1.06, C.mola(seg(t, 2.32, 2.78))),                    // pupilas atrasadas (movimento secundário)
      pupilDx: lerp(0, 2, C.mola(seg(t, 2.32, 2.78))), pupilDy: lerp(0, -4, C.mola(seg(t, 2.32, 2.78))),
      brow: lerp(1, 1.12, eIO(seg(t, 2.26, 2.66))), browDy: lerp(0, -14, C.elastica(seg(t, 2.26, 2.7))), // sobrancelhas sobem
      mouth: lerp(1, 1.32, C.elastica(seg(t, 2.36, 2.85))),                // boca abre por último
    };
    /* splash realista: sombra do boneco no chão e ondas */
    const hgt = Math.max(0, jump * pop) * (1 - mo);
    sh.style.opacity = t < 0.3 ? 0 : clamp(1 - mo * 1.4) * 0.9;
    sh.style.transform = `translate(-50%, ${46}px) scale(${lerp(0.5, 1, pop) * (1 - hgt / 120)}, ${lerp(0.5, 1, pop) * (1 - hgt / 160)})`;
    rips.forEach((rp, i) => { const r0 = i ? 0.68 : 0.27, rk = seg(t, r0, r0 + 0.65); rp.style.opacity = rk > 0 && rk < 1 ? (1 - rk) * 0.55 : 0; rp.style.transform = `translate(-50%, calc(-50% + 50px)) scale(${lerp(0.5, 2.3, eOut(rk))}, ${lerp(0.5, 2.3, eOut(rk)) * 0.28})`; });
    blob.classList.toggle('is-tile', t >= 2.0);
    blob.firstChild.style.opacity = clamp(1 - mo * 1.2);
    /* 5) a marca se forma */
    const lk = C.mola(seg(t, 2.85, 3.55));
    mark.style.transform = `translate(${lerp(0, markX, lk)}px, 0) scale(${lerp(1, ICON_F / T, lk)})`;
    ls.forEach((l, i) => {
      const a = 2.9 + i * 0.05, kk = seg(t, a, a + 0.45);
      l.style.opacity = clamp(kk * 4);
      l.style.transform = `translateY(${(1 - back(kk, 2.3)) * -38}px) rotate(${(1 - eOut(kk)) * (i % 2 ? -18 : 16)}deg) scale(${lerp(0.7, 1, eOut(kk))})`;
      const sp = seg(t, a + 0.12, a + 0.42);
      lds[i].style.opacity = sp > 0 && sp < 1 ? 1 - sp : 0;
      lds[i].style.transform = `translate(-50%, 0) scale(${lerp(0.3, 1.8, eOut(sp))}, ${lerp(0.3, 0.6, eOut(sp))})`;
    });
    const tk = eOut(seg(t, 3.25, 3.6));
    tag.style.opacity = tk; tag.style.transform = `translate(-50%, ${lerp(8, 0, tk)}px)`;
    if (t >= END) { done = true; onEnd && onEnd(); return; }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { done = true; cancelAnimationFrame(raf); };
}
