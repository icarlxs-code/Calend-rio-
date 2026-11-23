/* Sininho — boneco montado com as PEÇAS desenhadas (assets/mascot/rig): corpo, olhos, pupilas, sobrancelhas,
   bocas, braços (pendurado / levantado / aberto) e pés. As posições e o jeito de se mexer foram medidos quadro a
   quadro nos vídeos de referência:
   - pose a pose: o corpo muda de inclinação (~1,8°) em ~0,5 s e SEGURA a pose 0,8–2 s (nada de balanço contínuo);
   - respiração quase invisível (0,5%); piscada rápida (~80 ms fechando, ~120 ms abrindo), às vezes dupla;
   - aceno: braço sobe rápido, a mão balança ±7° a ~4,5 Hz por ~1 s, corpo inclina para o lado oposto;
   - movimento secundário: o rosto chega atrasado em relação ao corpo, braços e pés passam do ponto e voltam (molas).
   Cada parte é um canal com mola (frequência + amortecimento), desenhado em canvas a cada quadro da tela (60/120 Hz). */
import { esc } from './utils.js';

const R = 'assets/mascot/rig/';
const VIEW = { x: 400, y: -40, w: 1160, h: 1080 };         // área do desenho (espaço das peças)
const FEET = [965, 1009];                                  // ponto de apoio (inclinação e achatamento)
const SKIN = 'rgb(253,109,21)', SKIN_EDGE = 'rgb(232,84,10)', INK = '#3B2620';
const SH = { l: [668, 612], r: [1272, 620] };              // ombros: por dentro da borda do sino (medido no vídeo: o braço nasce atrás do corpo)
const ARM = {                                              // peça, ponto de encaixe (fração da peça) e ângulo de descanso
  'baixo-l': [0.66, 0.1], 'baixo-r': [0.34, 0.1], 'cima-l': [0.72, 0.9], 'cima-r': [0.28, 0.9], 'aberto-l': [0.85, 0.75], 'aberto-r': [0.15, 0.75],
};
const PARTS = ['corpo', 'olho-l', 'olho-r', 'pupila-l', 'pupila-r', 'sob-l', 'sob-r', 'pe-l', 'pe-r',
  ...['fechada', 'aberta', 'riso', 'a', 'e', 'o', 'oo', 'beijo', 'tristinha', 'choro', 'grito', 'lingua', 'dentes', 'cerrado', 'canto'].map((m) => 'boca-' + m),
  'braco-baixo-l', 'braco-baixo-r', 'braco-cima-l', 'braco-cima-r', 'braco-aberto-l', 'braco-aberto-r'];

/* ---------- carregamento (uma vez para todos) ---------- */
let LAY = null, IMG = null, loading = null;
function load() {
  if (loading) return loading;
  loading = fetch(R + 'layout.json').then((r) => r.json()).then(async (lay) => {
    LAY = lay;
    const imgs = {};
    await Promise.all(PARTS.map((p) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = `${R}${p}.webp`; imgs[p] = i; })));
    await Promise.all(Object.values(imgs).map((i) => (i.decode ? i.decode().catch(() => {}) : 0)));
    IMG = imgs;
  }).catch(() => { loading = null; });
  return loading;
}

const lerpN = (a, b, k) => a + (b - a) * k;
const lerpR = (n, a, k) => (a && k > 0 ? n.map((v, i) => v + (a[i] - v) * k) : n);
const kOf = (X, f) => (X.abs && X.abs.k && X.abs.k[f]) || 0;
const aOf = (X, f) => (X.abs && X.abs.a && X.abs.a[f] != null ? X.abs.a[f] : 1);
/* ---------- mola ---------- */
class Spring {
  constructor(v, f = 2, z = 0.7) { this.v = v; this.t = v; this.vel = 0; this.set(f, z); }
  set(f, z) { const w = 2 * Math.PI * f; this.k = w * w; this.c = 2 * z * w; return this; }
  step(dt) { const a = this.k * (this.t - this.v) - this.c * this.vel; this.vel += a * dt; this.v += this.vel * dt; }
}

/* ---------- emoções (alvos de cada canal) ---------- */
const EMO = {
  feliz: { lid: 0, happy: 0, brow: [0, 0, 0], mouth: 'aberta', arms: ['baixo', 12, 'baixo', -12], amp: 1, breath: 3.2 },
  acena: { lid: 0, happy: 0, brow: [0, 0, -6], mouth: 'aberta', arms: ['baixo', 12, 'baixo', -12], amp: 1, breath: 3.2, loop: 'tchau' },
  comemora: { lid: 0, happy: 1, brow: [0, 0, -10], mouth: 'riso', arms: ['aberto', 24, 'aberto', -24], amp: 0.6, breath: 2.4, loop: 'pulo' },
  danca: { lid: 0, happy: 1, brow: [0, 0, -8], mouth: 'riso', arms: ['aberto', 10, 'aberto', -10], amp: 0, breath: 2.4, loop: 'danca' },
  amor: { lid: 0, happy: 1, brow: [0, 0, -4], mouth: 'fechada', arms: ['baixo', 4, 'baixo', -4], amp: 1.6, breath: 2.8, blush: 1 },
  sono: { lid: 0.62, happy: 0, brow: [0, 0, 10], mouth: 'o', arms: ['baixo', 6, 'baixo', -6], amp: 0.5, breath: 4.6, look: [0, 10], loop: 'cochilo' },
  desconfiado: { lid: 0.42, happy: 0, brow: [-9, 7, 4, 1], mouth: 'canto', arms: ['baixo', 0, 'baixo', 0], amp: 0.6, breath: 3.4, look: [18, 4], lean: -2.5 },
  triste: { lid: 0.12, happy: 0, brow: [17, -17, 6], mouth: 'tristinha', arms: ['baixo', -2, 'baixo', 2], amp: 0.5, breath: 4, look: [0, -8], sag: 0.03 },
  bravo: { lid: 0.22, happy: 0, brow: [-20, 20, 14], mouth: 'cerrado', arms: ['baixo', 22, 'baixo', -22], amp: 0, breath: 1.4, loop: 'tremer' },
  surpreso: { lid: 0, happy: 0, brow: [0, 0, -26], mouth: 'oo', arms: ['aberto', 8, 'aberto', -8], amp: 0.4, breath: 2.6, pupil: 0.82 },
};
export const MOODS = Object.keys(EMO);
export const LIVE = []; // (compatibilidade)
/* todos os bonecos vivos: quando a pessoa toca na tela, eles olham para onde ela tocou */
const RIGS = new Set();
if (typeof document !== 'undefined') document.addEventListener('pointerdown', (ev) => {
  RIGS.forEach((r) => { if (r.visible && r.el.isConnected && !r.el.contains(ev.target) && !(EMO[r.mood] || {}).look) r.lookAt(ev.clientX, ev.clientY); });
}, { passive: true, capture: true });

/* ---------- um Sininho ---------- */
class Rig {
  constructor(el) {
    this.el = el; this.cv = el.querySelector('canvas'); this.ctx = this.cv.getContext('2d');
    const S = (v, f, z) => new Spring(v, f, z);
    this.s = {
      lean: S(0, 1.5, 0.78), bx: S(0, 1.3, 0.85), by: S(0, 3.2, 0.55), sq: S(0, 2.6, 0.42),
      aL: S(12, 3.6, 0.5), aR: S(-12, 3.6, 0.5), px: S(0, 5, 0.85), py: S(0, 5, 0.85), pz: S(1, 6, 0.7),
      lid: S(0, 16, 1), happy: S(0, 7, 0.9), bL: S(0, 5, 0.6), bR: S(0, 5, 0.6), bY: S(0, 5, 0.55), bYr: S(0, 5, 0.55),
      fL: S(0, 5, 0.55), fR: S(0, 5, 0.55), mz: S(1, 9, 0.45), blush: S(0, 2.5, 1), sag: S(0, 2, 0.9), hand: S(0, 9, 0.6), wL: S(0, 18, 1), wR: S(0, 18, 1),
    };
    this.pose = { l: 'baixo', r: 'baixo' }; this.mouth = 'aberta'; this.mood = '';
    this.q = []; this.t = 0; this.next = { idle: 0.6, blink: 1.5 + Math.random() * 2 }; this.loopAt = 0;
    this.visible = true; this.dead = false; this.talk = 0; RIGS.add(this);
    this.io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; }) : null;
    this.io && this.io.observe(el);
    this.resize(); this.setMood(el.dataset.snh || 'feliz', true);
    this.last = performance.now();
    const tick = () => { if (this.dead) return; if (!el.isConnected) return this.stop(); this.raf = requestAnimationFrame(tick); this.frame(performance.now()); };
    if (typeof window !== 'undefined' && window.__snhManual) { this.fake = 0; (window.__snhRigs = window.__snhRigs || []).push(this); this.last = 0; } // modo de teste: avançado à mão, quadro a quadro
    else this.raf = requestAnimationFrame(tick);
  }
  stop() { RIGS.delete(this); this.dead = true; cancelAnimationFrame(this.raf); this.io && this.io.disconnect(); }
  resize() {
    const dpr = Math.min(3, window.devicePixelRatio || 1), w = this.el.clientWidth || parseFloat(this.el.style.getPropertyValue('--s')) || 120;
    this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(w * VIEW.h / VIEW.w * dpr); this.scale = this.cv.width / VIEW.w;
  }
  /* agenda no relógio do boneco */
  at(sec, fn) { this.q.push([this.t + sec, fn]); }
  clear() { this.q = []; }

  setMood(m, now = false) {
    if (!EMO[m]) m = 'feliz';
    if (m === this.mood) return;
    this.mood = m; this.el.dataset.snh = m;
    const e = EMO[m], s = this.s;
    this.clear(); this.loopAt = this.t + 0.5;
    s.lid.t = e.lid; s.happy.t = e.happy; s.bL.t = e.brow[0]; s.bR.t = e.brow[1]; s.bY.t = e.brow[2]; s.bYr.t = e.brow[3] ?? e.brow[2];
    s.blush.t = e.blush || 0; s.sag.t = e.sag || 0; s.pz.t = e.pupil || 1;
    s.px.t = e.look ? e.look[0] : 0; s.py.t = e.look ? e.look[1] : 0;
    s.lean.t = e.lean || 0; s.bx.t = 0; s.by.t = 0; s.fL.t = 0; s.fR.t = 0;
    this.arms(e.arms);
    this.setMouth(e.mouth);
    if (!now) { s.sq.vel += 1.4; s.by.vel -= 120; } // "pulinho" de reação ao mudar
    if (now) Object.values(s).forEach((x) => { x.v = x.t; x.vel = 0; });
  }
  arms([pl, al, pr, ar]) {
    const s = this.s;
    const go = (side, pose, ang) => {
      const sp = side === 'l' ? s.aL : s.aR;
      if (this.pose[side] !== pose) {               // troca de peça no meio de um movimento rápido (o olho não percebe)
        const up = pose === 'aberto';
        sp.vel += (side === 'l' ? 1 : -1) * (up ? 500 : -500);
        this.at(0.06, () => { this.pp = this.pp || {}; this.pp[side] = [this.pose[side], this.t, sp.v]; this.pose[side] = pose; sp.v = ang + (side === 'l' ? -1 : 1) * (up ? 16 : -16); });
      }
      sp.t = ang;
    };
    go('l', pl, al); go('r', pr, ar);
  }
  setMouth(m) { if (m && m !== this.mouth && this.imgOk('boca-' + m)) { this.pm = this.mouth; this.pmT = this.t; this.mouth = m; this.s.mz.v = 0.9; } }
  imgOk(n) { return IMG && IMG[n] && IMG[n].naturalWidth; }
  blink(dbl) {
    if (this.s.lid.t >= 0.6) return;
    const base = this.s.lid.t; this.s.lid.t = 1;
    this.at(0.085, () => { this.s.lid.t = base; });
    if (dbl) this.at(0.26, () => this.blink(false));
  }

  /* gestos */
  act(name) {
    const s = this.s, e = EMO[this.mood];
    if (name === 'tchau') {
      const back = e.arms;
      s.lean.t = 2.2; s.bx.t = 6;                                  // inclina para o lado oposto ao aceno
      this.arms(['aberto', 20, back[2], back[3]]);
      this.at(0.06, () => { s.bY.t = (e.brow[2] || 0) - 10; s.happy.t = Math.max(e.happy, 0.0); });
      for (let i = 0; i < 9; i++) this.at(0.16 + i * 0.111, () => { s.aL.t = i % 2 ? 27 : 13; });   // ±7° a ~4,5 Hz
      this.at(1.2, () => { this.arms(back); s.lean.t = e.lean || 0; s.bx.t = 0; s.bY.t = e.brow[2]; });
    } else if (name === 'pulo') {
      s.sq.t = 0.12; s.by.t = 18;                                  // antecipação (agacha)
      this.at(0.12, () => { s.sq.t = -0.08; s.by.t = -150; s.fL.t = 26; s.fR.t = 26; s.sq.vel -= 2; });
      this.at(0.34, () => { s.by.t = 0; s.sq.t = 0; });
      this.at(0.5, () => { s.sq.vel += 2.4; s.fL.t = 0; s.fR.t = 0; }); // pouso amortecido
    } else if (name === 'riso') {
      const keep = [s.happy.t, this.mouth];
      s.happy.t = 1; this.setMouth('riso'); s.bY.t = -12;
      for (let i = 0; i < 4; i++) this.at(i * 0.16, () => { s.sq.vel += 1.6; s.by.vel -= 90; });
      this.at(1.1, () => { s.happy.t = keep[0]; this.setMouth(keep[1]); s.bY.t = e.brow[2]; });
    } else if (name === 'nao') {
      [[-4, 0], [4, 0.16], [-3, 0.32], [2, 0.46], [e.lean || 0, 0.6]].forEach(([v, t]) => this.at(t, () => { s.lean.t = v; s.px.t = v * 4; }));
    } else if (name === 'sim') {
      [[0.06, 0], [-0.03, 0.14], [0.04, 0.28], [0, 0.42]].forEach(([v, t]) => this.at(t, () => { s.sq.t = v; }));
    } else if (name === 'pop') { s.sq.vel += 1.8; }
    else if (name === 'pensa') {                                   // olha pra cima de lado, uma sobrancelha sobe, boca de canto
      const m0 = this.mouth; s.px.t = 16; s.py.t = -14; s.bY.t = (e.brow[2] || 0) - 14; s.lean.t = (e.lean || 0) - 1.6; this.setMouth('canto');
      this.at(1.7, () => { s.px.t = 0; s.py.t = 0; s.bY.t = e.brow[2]; s.lean.t = e.lean || 0; this.setMouth(m0); this.next.idle = this.t + 0.8; });
      this.next.idle = this.t + 2;
    } else if (name === 'boceja') {                                // espreguiça: braços sobem, olhos quase fecham, boca de "o"
      const m0 = this.mouth, l0 = s.lid.t, back = e.arms;
      s.lid.t = 0.55; this.setMouth('oo'); s.sq.t = -0.05; this.arms(['aberto', 30, 'aberto', -30]);
      this.at(1.3, () => { s.lid.t = l0; this.setMouth(m0); s.sq.t = 0; this.arms(back); s.sq.vel += 1; });
      this.next.idle = this.t + 1.8;
    } else if (name === 'timido') {                                // fica vermelhinho e olha pra baixo
      const m0 = this.mouth, b0 = s.blush.t; s.blush.t = 1; s.px.t = -12; s.py.t = 12; s.lean.t = (e.lean || 0) + 1.5; this.setMouth('fechada');
      this.at(1.8, () => { s.blush.t = b0; s.px.t = 0; s.py.t = 0; s.lean.t = e.lean || 0; this.setMouth(m0); });
      this.next.idle = this.t + 2.1;
    } else if (name === 'pisca') {                                 // piscadinha marota com sorriso
      const lado = Math.random() < 0.5 ? 'wL' : 'wR', m0 = this.mouth;
      s[lado].t = 1; if (lado === 'wL') { s.bY.t = (e.brow[2] || 0) + 8; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 12; } else { s.bYr.t = (e.brow[3] ?? e.brow[2]) + 8; s.bY.t = (e.brow[2] || 0) - 12; }
      this.setMouth('canto'); s.lean.t = lado === 'wL' ? -2 : 2;
      this.at(0.45, () => { s[lado].t = 0; });
      this.at(0.8, () => { s.bY.t = e.brow[2]; s.bYr.t = e.brow[3] ?? e.brow[2]; this.setMouth(m0); s.lean.t = e.lean || 0; });
    } else if (name === 'dor') {                                   // levou um tapinha: amassa, fecha os olhos com força, treme
      const m0 = this.mouth, l0 = s.lid.t, b0 = [s.bL.t, s.bR.t, s.bY.t];
      s.sq.vel += 3.2; s.by.vel += 80; s.lid.t = 0.95; this.setMouth('dentes'); s.bL.t = 14; s.bR.t = -14; s.bY.t = 8;
      [[-3, 0.05], [3, 0.12], [-2.5, 0.19], [2, 0.26], [-1, 0.33], [0, 0.4]].forEach(([v, t]) => this.at(t, () => { s.lean.t = v; }));
      this.at(0.9, () => { s.lid.t = l0; this.setMouth(m0); [s.bL.t, s.bR.t, s.bY.t] = b0; });
      this.next.idle = this.t + 1.2;
    } else if (name === 'cinico') {                               // risadinha debochada: olha de lado, boca de canto, sacode baixinho
      const m0 = this.mouth; s.px.t = 18; s.py.t = 2; s.lid.t = 0.35; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 14; this.setMouth('canto'); s.lean.t = -2;
      for (let i = 0; i < 5; i++) this.at(0.25 + i * 0.13, () => { s.sq.vel += 0.9; s.by.vel -= 40; });
      this.at(0.55, () => this.setMouth('riso'));
      this.at(1.25, () => this.setMouth('canto'));
      this.at(1.7, () => { s.px.t = 0; s.py.t = 0; s.lid.t = e.lid; s.bYr.t = e.brow[3] ?? e.brow[2]; s.lean.t = e.lean || 0; this.setMouth(m0); });
      this.next.idle = this.t + 2;
    } else if (name === 'maoBoca') {                              // mão na boca segurando a risada (fofoca, desconfiança)
      const m0 = this.mouth, back = e.arms;
      s.px.t = -14; s.lid.t = 0.3; this.setMouth('riso'); s.blush.t = 0.6; s.hand.t = 1; s.lean.t = 1.5;
      for (let i = 0; i < 4; i++) this.at(0.3 + i * 0.15, () => { s.sq.vel += 0.8; });
      this.at(1.5, () => { s.px.t = 0; s.lid.t = e.lid; this.setMouth(m0); s.blush.t = e.blush || 0; s.hand.t = 0; s.lean.t = e.lean || 0; });
      this.next.idle = this.t + 1.9;
    } else if (name === 'susto') {                                // leva um susto: pula pra trás, olhos arregalados
      const m0 = this.mouth; s.pz.t = 0.75; this.setMouth('oo'); s.bY.t = -24; s.by.vel -= 220; s.sq.vel -= 2; s.lean.t = 3;
      this.at(0.8, () => { s.pz.t = e.pupil || 1; this.setMouth(m0); s.bY.t = e.brow[2]; s.lean.t = e.lean || 0; });
      this.next.idle = this.t + 1.1;
    } else if (name === 'coca') {                                 // coça a cabeça pensando
      const back = e.arms; this.front = { l: false, r: true }; this.arms([back[0], back[1], 'cima', -4]); s.px.t = 12; s.py.t = -10; s.lean.t = 1.5; s.wR.t = 0.4; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 10;
      for (let i = 0; i < 6; i++) this.at(0.15 + i * 0.12, () => { s.aR.t = i % 2 ? 2 : -10; });
      this.at(1.1, () => { this.arms(back); s.px.t = 0; s.py.t = 0; s.lean.t = e.lean || 0; s.wR.t = 0; s.bYr.t = e.brow[3] ?? e.brow[2]; });
      this.at(1.25, () => { this.front = null; });
      this.next.idle = this.t + 1.4;
    } else if (name === 'balanca') {                              // balancinho alegre de um lado pro outro
      [[4, 0], [-4, 0.3], [4, 0.6], [-3, 0.9], [0, 1.2]].forEach(([v, t]) => this.at(t, () => { s.lean.t = v; s.fL.t = v > 0 ? 14 : 0; s.fR.t = v < 0 ? 14 : 0; }));
      this.at(1.3, () => { s.fL.t = 0; s.fR.t = 0; });
      this.next.idle = this.t + 1.5;
    } else if (name === 'sobrancelha') {                          // levanta uma sobrancelha só, olhar de quem sabe das coisas
      const m0 = this.mouth; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 22; s.bR.t = -8; s.bY.t = (e.brow[2] || 0) + 6; s.px.t = -10; this.setMouth('canto');
      this.at(1.3, () => { s.bYr.t = e.brow[3] ?? e.brow[2]; s.bR.t = e.brow[1]; s.bY.t = e.brow[2]; s.px.t = 0; this.setMouth(m0); });
      this.next.idle = this.t + 1.6;
    } else if (name === 'olhaLados') {                             // olha pra um lado, pro outro, e volta
      [[-20, 0, 0], [20, 0, 0.55], [0, 0, 1.15]].forEach(([x, y, t]) => this.at(t, () => { s.px.t = x; s.py.t = y; }));
      this.next.idle = this.t + 1.6;
    }
  }
  /* olha para um ponto da tela (o toque da pessoa, um botão) */
  lookAt(x, y, hold = 1.4) {
    const r = this.el.getBoundingClientRect(); if (!r.width) return;
    const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height * 0.45), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / (r.width * 1.5));
    this.s.px.t = (dx / d) * 20 * k; this.s.py.t = (dy / d) * 13 * k;
    this.s.lean.t += Math.max(-1.2, Math.min(1.2, dx / 300));
    this.next.idle = this.t + hold;
  }

  /* vida própria */
  idle() {
    const s = this.s, e = EMO[this.mood];
    if (this.t >= this.next.idle) {
      const amp = e.amp ?? 1;
      if (amp) {
        s.lean.t = (e.lean || 0) + [-1.8, -1, 0, 1, 1.8][Math.floor(Math.random() * 5)] * amp;
        s.bx.t = (Math.random() - 0.5) * 10 * amp;
        s.sq.vel += 0.25;                                          // assentar o peso
      }
      if (!e.look) { const r = Math.random(); s.px.t = r < 0.35 ? 0 : (Math.random() - 0.5) * 36; s.py.t = r < 0.35 ? 0 : (Math.random() - 0.5) * 20; }
      if (Math.random() < 0.12 && !this.talk) { s.bY.t = e.brow[2] - 12; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 12; this.at(0.6, () => { s.bY.t = e.brow[2]; s.bYr.t = e.brow[3] ?? e.brow[2]; }); }
      this.next.idle = this.t + 0.9 + Math.random() * 1.6;          // segura a pose (como no vídeo)
    }
    if (this.t >= this.next.blink) { this.blink(Math.random() < 0.2); this.next.blink = this.t + 2.2 + Math.random() * 3.6; }
    if (e.loop && this.t >= this.loopAt) {
      const L = e.loop;
      if (L === 'tchau') { this.act('tchau'); this.loopAt = this.t + 3.2 + Math.random() * 2; }
      else if (L === 'pulo') { this.act('pulo'); this.loopAt = this.t + 0.95; }
      else if (L === 'danca') {
        const k = Math.round(this.t / 0.42) % 2;
        s.lean.t = k ? 6 : -6; s.by.t = 0; s.by.vel -= 160; s.aL.t = k ? 24 : -14; s.aR.t = k ? 14 : -24; s.fL.t = k ? 22 : 0; s.fR.t = k ? 0 : 22;
        this.loopAt = this.t + 0.42;
      } else if (L === 'cochilo') { s.lean.t = s.lean.t > 1 ? -0.5 : 2.6; s.by.t = s.lean.t > 1 ? 6 : 0; this.loopAt = this.t + 2.3; }
      else if (L === 'tremer') { s.lean.t = (s.lean.t > 0 ? -1 : 1) * 1.1; this.loopAt = this.t + 0.07; }
    }
  }

  frame(now) {
    let dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if ((!this.visible && !this.fake && this.fake !== 0) || document.hidden || !IMG) return;
    const n = Math.max(1, Math.ceil(dt / (1 / 240)));               // passos pequenos: molas estáveis em qualquer taxa de tela
    for (let i = 0; i < n; i++) {
      this.t += dt / n;
      while (this.q.length) { const j = this.q.findIndex((x) => x[0] <= this.t); if (j < 0) break; const [, fn] = this.q.splice(j, 1)[0]; fn(); }
      if (i === 0) this.idle();
      for (const k in this.s) this.s[k].step(dt / n);
    }
    this.draw();
  }

  draw() {
    const c = this.ctx, s = this.s, L = LAY, e = EMO[this.mood];
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, this.cv.width, this.cv.height);
    c.setTransform(this.scale, 0, 0, this.scale, -VIEW.x * this.scale, -VIEW.y * this.scale);
    const img = (n, x, y, w, h) => { const i = IMG[n]; if (i && i.naturalWidth) c.drawImage(i, x, y, w, h); };
    const at = (n, dx = 0, dy = 0) => { const [x, y, w, h] = L[n]; img(n, x + dx, y + dy, w, h); };
    const X = Object.assign({ eye: 1, eyeDx: 0, eyeDy: 0, pupil: 1, pupilDx: 0, pupilDy: 0, brow: 1, browDy: 0, mouth: 1, mouthDy: 0, body: 1, limbs: 1 }, this.xf || {}); // deformação peça a peça (abertura)
    const breath = Math.sin((this.t / (e.breath || 3.2)) * Math.PI * 2) * 0.005;
    const kb = kOf(X, 'body');
    const sq = (s.sq.v + breath + s.sag.v) * (1 - kb);
    const sy = 1 - sq, sx = (1 + sq * 0.7) * X.body;
    // pés (no chão; só sobem nos pulos/passos)
    c.save(); c.translate(s.bx.v * 0.3, Math.min(0, s.by.v) * 0.85);
    [['pe-l', s.fL.v, -1], ['pe-r', s.fR.v, 1]].forEach(([n, lift, side]) => {
      if (X.limbs <= 0.01) return;
      const [x, y, w, h] = L[n]; c.save(); c.globalAlpha = X.limbs; c.translate(x + w / 2, y + h - (1 - X.limbs) * 120); c.scale(lerpN(0.4, 1, X.limbs), lerpN(0.2, 1, X.limbs)); c.rotate(side * lift * 0.004); c.translate(-(x + w / 2), -(y + h) - lift); img(n, x, y, w, h); c.restore();
    });
    c.restore();
    // corpo: inclina e achata a partir do apoio
    c.save();
    c.translate(FEET[0] + s.bx.v * (1 - kb), FEET[1] + s.by.v * (1 - kb)); c.rotate((s.lean.v * (1 - kb) * Math.PI) / 180); c.scale(sx, sy); c.translate(-FEET[0], -FEET[1]);
    // braços giram no ombro; normalmente atrás do corpo, mas um gesto pode trazer um braço para a FRENTE
    // (mão na boca, coçar a cabeça): aí ele é desenhado depois do rosto, com sombra e contorno, para ler como "na frente"
    const drawArms = (front) => [['l', s.aL.v], ['r', s.aR.v]].forEach(([side, ang]) => {
      if (!!(this.front && this.front[side]) !== front) return;
      if (front) { c.save(); c.shadowColor = 'rgba(110,35,0,.55)'; c.shadowBlur = 22; c.shadowOffsetY = 8; }
      const one = (pose, a, alpha) => {
        const n = `braco-${pose}-${side}`; alpha *= X.limbs; if (!L[n] || alpha <= 0.01) return;
        const [, , w, h] = L[n], [ax, ay] = ARM[`${pose}-${side}`], [px, py] = SH[side];
        c.save(); c.globalAlpha = alpha; c.translate(px + (side === 'l' ? 1 : -1) * (1 - X.limbs) * 60, py); c.rotate((a * Math.PI) / 180); c.scale(lerpN(0.5, 1, X.limbs), lerpN(0.5, 1, X.limbs)); img(n, -ax * w, -ay * h, w, h); c.restore();
      };
      const old = this.pp && this.pp[side], k = old ? Math.min(1, (this.t - old[1]) / 0.12) : 1;
      if (old && k < 1) one(old[0], old[2] + (ang - old[2]) * 0.4, 1 - k);
      one(this.pose[side], ang, k < 1 ? 0.35 + 0.65 * k : 1);
      if (front) c.restore();
    });
    drawArms(false);
    { const r = lerpR(L.corpo, X.abs && X.abs.r && X.abs.r.body, kb); c.save(); c.globalAlpha = aOf(X, 'body'); img('corpo', r[0], r[1], r[2], r[3]); c.restore(); }
    // rosto: chega atrasado em relação ao corpo (movimento secundário)
    const fk = 1 - Math.max(kb, kOf(X, 'eyeL'));
    const fx = (-s.lean.vel * 1.1 + s.px.v * 0.12) * fk, fy = -s.by.vel * 0.012 * fk;
    c.save(); c.translate(fx, fy);
    // bochechas
    if (s.blush.v > 0.02) { c.globalAlpha = 0.5 * s.blush.v; c.fillStyle = '#FF8E7A'; [[790, 640], [1150, 648]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x, y, 46, 26, 0, 0, Math.PI * 2); c.fill(); }); c.globalAlpha = 1; }
    // olhos
    ['l', 'r'].forEach((side) => {
      const fE = side === 'l' ? 'eyeL' : 'eyeR', fP = side === 'l' ? 'pupL' : 'pupR';
      if (kOf(X, fE) > 0) {                                   // encaixe exato no olho do ícone
        const er = lerpR(L['olho-' + side], X.abs.r[fE], kOf(X, fE));
        const [qx, qy, qw, qh] = L['pupila-' + side], z = s.pz.v;
        const pn = [qx + qw / 2 + s.px.v - (qw * z) / 2, qy + qh / 2 + s.py.v - (qh * z) / 2, qw * z, qh * z];
        const pr = lerpR(pn, X.abs.r[fP], kOf(X, fP));
        c.save(); c.globalAlpha = aOf(X, fE); img('olho-' + side, er[0], er[1], er[2], er[3]);
        c.beginPath(); c.ellipse(er[0] + er[2] / 2, er[1] + er[3] / 2, er[2] / 2 - 2, er[3] / 2 - 2, 0, 0, Math.PI * 2); c.clip();
        c.globalAlpha = aOf(X, fP); img('pupila-' + side, pr[0], pr[1], pr[2], pr[3]); c.restore();
        return;
      }
      const [x, y, w, h] = L['olho-' + side], cx = x + w / 2, cy = y + h / 2;
      c.save(); c.translate(cx + (side === 'l' ? -1 : 1) * X.eyeDx, cy + X.eyeDy); c.scale(X.eye, X.eye); c.translate(-cx, -cy);
      const hp = Math.min(1, Math.max(0, s.happy.v)), open = 1 - hp;
      if (open > 0.02) {
        c.save(); c.globalAlpha = open;
        c.translate(cx, cy); c.scale(1, 1 - hp * 0.5); c.translate(-cx, -cy);
        img('olho-' + side, x, y, w, h);
        c.save(); c.beginPath(); c.ellipse(cx, cy, w / 2 - 3, h / 2 - 3, 0, 0, Math.PI * 2); c.clip();
        const [qx, qy, qw, qh] = L['pupila-' + side], z = s.pz.v * X.pupil;
        const pcx = qx + qw / 2 + s.px.v + (side === 'l' ? 1 : -1) * X.pupilDx, pcy = qy + qh / 2 + s.py.v + X.pupilDy;
        img('pupila-' + side, pcx - (qw * z) / 2, pcy - (qh * z) / 2, qw * z, qh * z);
        // pálpebra (piscar, sono, desconfiança)
        c.restore();
        // pálpebra (piscar, sono, desconfiança): cobre o olho inteiro, inclusive a borda
        const lid = Math.min(1, Math.max(0, s.lid.v + (side === 'l' ? s.wL.v : s.wR.v))); // cada olho tem a sua pálpebra (piscadinha de um olho só)
        if (lid > 0.01) {
          c.save(); c.beginPath(); c.ellipse(cx, cy, w / 2 + 3, h / 2 + 3, 0, 0, Math.PI * 2); c.clip();
          const ly = y - 6 + (h + 12) * lid;
          c.fillStyle = SKIN; c.beginPath(); c.moveTo(x - 8, y - 12); c.lineTo(x + w + 8, y - 12); c.lineTo(x + w + 8, ly); c.quadraticCurveTo(cx, ly + 14 * (1 - lid), x - 8, ly); c.closePath(); c.fill();
          c.strokeStyle = SKIN_EDGE; c.lineWidth = 7; c.beginPath(); c.moveTo(x - 8, ly); c.quadraticCurveTo(cx, ly + 14 * (1 - lid), x + w + 8, ly); c.stroke();
          c.restore();
        }
        c.restore();
        if (lid > 0.9) { c.strokeStyle = INK; c.lineWidth = 13; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx - w * 0.32, cy + 4); c.quadraticCurveTo(cx, cy + 26, cx + w * 0.32, cy + 4); c.stroke(); }
      }
      if (hp > 0.02) { // olhos fechados de alegria (arco, como no vídeo)
        c.save(); c.globalAlpha = hp; c.strokeStyle = INK; c.lineWidth = 15; c.lineCap = 'round';
        c.beginPath(); c.moveTo(cx - w * 0.3, cy + 14); c.quadraticCurveTo(cx, cy - 40, cx + w * 0.3, cy + 14); c.stroke(); c.restore();
      }
      c.restore();
    });
    // sobrancelhas (giram no centro, sobem/descem)
    [['l', s.bL.v, s.bY.v], ['r', s.bR.v, s.bYr.v]].forEach(([side, rot, dy]) => {
      const fB = side === 'l' ? 'browL' : 'browR';
      if (kOf(X, fB) > 0) { const kk = kOf(X, fB), [x0, y0, w0, h0] = L['sob-' + side];
        const r = lerpR([x0, y0 + dy, w0, h0], X.abs.r[fB], kk), cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2;
        c.save(); c.globalAlpha = aOf(X, fB); c.translate(cx, cy); c.rotate((rot * (1 - kk) * Math.PI) / 180); img('sob-' + side, -r[2] / 2, -r[3] / 2, r[2], r[3]); c.restore(); return; }
      const [x, y, w, h] = L['sob-' + side], cx = x + w / 2, cy = y + h / 2;
      c.save(); c.translate(cx + (side === 'l' ? -1 : 1) * X.eyeDx * 0.8, cy + dy + X.browDy); c.rotate((rot * Math.PI) / 180); c.scale(X.brow, X.brow); img('sob-' + side, -w / 2, -h / 2, w, h); c.restore();
    });
    // boca (troca de forma com um pequeno "pop")
    if (kOf(X, 'mouth') > 0) { const n = 'boca-' + this.mouth, r = lerpR(L[n], X.abs.r.mouth, kOf(X, 'mouth'));
      c.save(); c.globalAlpha = aOf(X, 'mouth'); img(n, r[0], r[1], r[2], r[3]); c.restore(); }
    else { const z = s.mz.v, k = this.pm ? Math.min(1, (this.t - this.pmT) / 0.09) : 1;
      const one = (m, a) => { const n = 'boca-' + m; if (!L[n] || a <= 0) return; const [x, y, w, h] = L[n], cx = x + w / 2, cy = y + h / 2;
        c.save(); c.globalAlpha = a; c.translate(cx, cy + X.mouthDy); c.scale(z * (1 + (z - 1) * -0.6) * X.mouth, z * X.mouth); img(n, -w / 2, -h / 2, w, h); c.restore(); };
      if (this.pm && k < 1) one(this.pm, 1 - k);
      one(this.mouth, k); }
    // mãozinha na frente da boca (segurando a risada)
    if (s.hand.v > 0.03) {
      const [x, y, w, h] = L['boca-aberta'], cx = x + w * 0.62, cy = y + h * 0.55 + X.mouthDy + (1 - s.hand.v) * 120;
      c.save(); c.globalAlpha = Math.min(1, s.hand.v * 1.4); c.shadowColor = 'rgba(110,35,0,.5)'; c.shadowBlur = 20; c.shadowOffsetY = 6;
      const g = c.createRadialGradient(cx - 18, cy - 20, 10, cx, cy, 80); g.addColorStop(0, 'rgb(255,150,60)'); g.addColorStop(1, 'rgb(226,78,8)');
      c.fillStyle = g; c.strokeStyle = 'rgb(176,52,0)'; c.lineWidth = 8;
      c.beginPath(); c.ellipse(cx, cy, 96, 70, -0.35, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
    }
    drawArms(true);
    // lágrimas
    if (this.mood === 'triste') {
      const ph = (this.t % 1.6) / 1.6; c.fillStyle = 'rgba(120,200,255,' + (0.9 * Math.sin(ph * Math.PI)) + ')';
      [[792, 600], [1140, 606]].forEach(([x, y], i) => { const yy = y + ((ph + i * 0.35) % 1) * 90; c.beginPath(); c.ellipse(x, yy, 13, 18, 0, 0, Math.PI * 2); c.fill(); });
    }
    c.restore(); c.restore();
  }
}

/* ---------- montagem automática ---------- */
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function mount(el) {
  if (!el || el._rig) return el && el._rig;
  if (!el.querySelector('canvas')) el.innerHTML = '<canvas></canvas>';
  el._rig = { pending: true };
  load().then(() => { if (!el.isConnected && !el._rig.pending) return; const r = new Rig(el); if (calm()) { r.draw(); r.stop(); } el._rig = r; (el._todo || []).forEach((f) => f(r)); el._todo = null; });
  return el._rig;
}
const withRig = (el, fn) => { if (!el) return; const r = mount(el); if (r && !r.pending) fn(r); else (el._todo = el._todo || []).push(fn); };
let mo = null;
function watch() {
  if (mo || typeof MutationObserver === 'undefined') return;
  mo = new MutationObserver(() => document.querySelectorAll('[data-snh]').forEach((el) => !el._rig && mount(el)));
  mo.observe(document.body, { childList: true, subtree: true });
}
if (typeof document !== 'undefined' && document.body) watch(); else if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', watch);

export function sininho(mood = 'feliz', { size = 120, cls = '', label = 'Lembra' } = {}) {
  const m = EMO[mood] ? mood : 'feliz';
  return `<span class="snh ${cls}" style="--s:${size}px" data-snh="${m}" role="img" aria-label="${esc(label)}"><canvas></canvas></span>`;
}
export function alive() { watch(); load(); document.querySelectorAll('[data-snh]').forEach(mount); }
export function setMood(el, mood) { withRig(el, (r) => r.setMood(mood)); return Promise.resolve(); }
export function act(el, name) { withRig(el, (r) => r.act(name === 'pop' ? 'pop' : name)); }
export function lookAt(el, x, y, hold) { withRig(el, (r) => r.lookAt(x, y, hold)); }
export const GESTOS = ['tchau', 'pulo', 'riso', 'nao', 'sim', 'pop', 'pensa', 'boceja', 'timido', 'pisca', 'olhaLados', 'dor', 'cinico', 'maoBoca', 'susto', 'coca', 'balanca', 'sobrancelha'];

/* balão do app: o texto aparece digitado; o Sininho NÃO fala (sem boca mexendo, sem som),
   só reage com o corpo quando a mensagem chega, como o Duo faz no Duolingo */
export function say(el, text, { bubble, speed = 28 } = {}) {
  const b = bubble || el?.closest('.snhwrap')?.querySelector('.snhb__txt');
  if (!b) return Promise.resolve();
  clearInterval(b._t);
  const box = b.closest('.snhb');
  if (box) { box.classList.remove('is-in'); void box.offsetWidth; box.classList.add('is-in'); }
  if (calm()) { b.textContent = text; return Promise.resolve(); }
  return new Promise((res) => {
    let i = 0;
    b.textContent = '';
    const ch = Array.from(text); // por caractere inteiro: emoji nunca aparece pela metade
    b._t = setInterval(() => { i += 1; b.textContent = ch.slice(0, i).join(''); if (i >= ch.length) { clearInterval(b._t); res(); } }, speed);
  });
}

/* toque: ele reage */
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const TAP = [
  ['comemora', 'pulo', ['Opa! Tô aqui com você!', 'Bora fazer o dia render!']],
  ['feliz', 'riso', ['Hehe, cócegas!', 'Ai, para! Hahaha']],
  ['amor', 'sim', ['Gosto de te ver por aqui.', 'Você tá mandando bem!']],
  ['acena', 'tchau', ['Oi oi! Precisando de algo?', 'Tô de olho na sua agenda!']],
  ['surpreso', 'pop', ['Opa, me assustou!', 'Ei! Já viu os lembretes de hoje?']],
];
export function interactive(el, { base, bubble } = {}) {
  if (!el || el._tap) return;
  el._tap = true; mount(el);
  base = base || el.dataset.snh;
  el.style.cursor = 'pointer';
  let back, last = -1;
  el.addEventListener('click', () => {
    let i; do { i = Math.floor(Math.random() * TAP.length); } while (i === last); last = i;
    const [mood, g, lines] = TAP[i];
    withRig(el, (r) => { r.setMood(mood); r.at(0.12, () => r.act(g)); });
    try { navigator.vibrate && navigator.vibrate(10); } catch { /* ok */ }
    if (bubble) say(el, pick(lines), { bubble });
    clearTimeout(back);
    back = setTimeout(() => setMood(el, base), 3800);
  });
}

/* espiada na borda da tela */
let peekOn = null;
export async function peek(mood, text, { ms = 3600, gesture } = {}) {
  if (document.hidden) return;
  if (document.querySelector('.gx, .paywall, .ficha, .photogate, .okfx, .stk')) { setTimeout(() => peek(mood, text, { ms, gesture }), 1500); return; }
  await load();
  peekOn?.remove();
  const w = document.createElement('div');
  w.className = 'snhpeek snhwrap';
  w.innerHTML = `<div class="snhb snhb--peek"><span class="snhb__txt"></span></div>${sininho(mood, { size: 120 })}`;
  document.body.appendChild(w);
  peekOn = w;
  const el = w.querySelector('[data-snh]'); mount(el);
  let gone = false;
  const close = () => {
    if (gone) return; gone = true;
    act(el, 'tchau');
    setTimeout(() => w.classList.add('is-out'), 1000);
    setTimeout(() => { w.remove(); if (peekOn === w) peekOn = null; }, 1600);
  };
  requestAnimationFrame(() => requestAnimationFrame(() => {
    w.classList.add('is-in');
    setTimeout(() => { act(el, gesture || (['comemora', 'danca'].includes(mood) ? 'pulo' : 'tchau')); say(el, text, { bubble: w.querySelector('.snhb__txt') }); }, 450);
  }));
  w.addEventListener('click', close);
  setTimeout(close, ms + text.length * 34);
}

/* o que ele fala */
export function greetLine({ first = '', pending = 0, late = 0, off = 0, offToday = true, hour = new Date().getHours() } = {}) {
  const n = first ? `, ${first}` : '';
  if (hour >= 23 || hour < 5) return { mood: 'sono', text: pick([`Já é tarde${n}… amanhã eu te lembro de tudo.`, `Hora de descansar${n}. Eu cuido da agenda.`]) };
  if (late) return { mood: 'triste', text: late === 1 ? `Ficou 1 coisa pra trás${n}. Bora resolver?` : `Ficaram ${late} coisas pra trás${n}. Vamos juntos?` };
  if (off >= 2 && !offToday) return { mood: 'desconfiado', text: `Sua ofensiva de ${off} dias tá em risco! Conclua algo hoje.` };
  if (!pending) return { mood: 'danca', text: pick([`Tudo em dia${n}! Que orgulho!`, `Nada pendente hoje${n}. Aproveita!`]) };
  const tod = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  return { mood: 'acena', text: pick([`${tod}${n}! Hoje tem ${pending} ${pending === 1 ? 'coisa' : 'coisas'} pra fazer.`, `${tod}${n}! Bora riscar ${pending === 1 ? 'aquele lembrete' : `esses ${pending} lembretes`}?`, `Oi${n}! Já separei ${pending === 1 ? 'o lembrete' : `os ${pending} lembretes`} de hoje.`]) };
}
const DONE = ['Mandou bem!', 'Isso aí! Mais um riscado!', 'Arrasou! Continua assim!', 'Boa! Tô orgulhoso de você!', 'Uhuul! Mais um feito!'];
const DONE_LATE = ['Antes tarde do que nunca!', 'Feito! O importante é não desistir.'];
let doneCount = 0, lastPeek = 0;
export function cheerDone({ late = false, perfect = false } = {}) {
  doneCount++;
  const now = Date.now();
  if (perfect) { lastPeek = now; return peek('danca', 'Dia 100%! Você zerou tudo hoje!', { gesture: 'pulo', ms: 4200 }); }
  if (doneCount > 1 && now - lastPeek < 90e3 && doneCount % 3) return;
  lastPeek = now;
  peek(late ? 'feliz' : 'comemora', pick(late ? DONE_LATE : DONE));
}
