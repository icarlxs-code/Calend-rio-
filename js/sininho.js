/* Sininho — boneco montado com as PEÇAS desenhadas (assets/mascot/rig): corpo, olhos, pupilas, sobrancelhas,
   bocas, braços (pendurado / levantado / aberto) e pés. As posições e o jeito de se mexer foram medidos quadro a
   quadro nos vídeos de referência:
   - pose a pose: o corpo muda de inclinação (~1,8°) em ~0,5 s e SEGURA a pose 0,8–2 s (nada de balanço contínuo);
   - respiração quase invisível (0,5%); piscada rápida (~80 ms fechando, ~120 ms abrindo), às vezes dupla;
   - aceno: braço sobe rápido, a mão balança ±7° a ~4,5 Hz por ~1 s, corpo inclina para o lado oposto;
   - movimento secundário: o rosto chega atrasado em relação ao corpo, braços e pés passam do ponto e voltam (molas).
   Cada parte é um canal com mola (frequência + amortecimento), desenhado em canvas a cada quadro da tela (60/120 Hz). */
import { PALMA } from './roupas.js';
import { esc } from './utils.js';

const R = (() => { try { return new URL('../assets/mascot/rig/', import.meta.url).href; } catch { return 'assets/mascot/rig/'; } })(); // funciona no app e em qualquer página (ex.: /conheca/)
const VIEW = { x: 400, y: -40, w: 1160, h: 1080 };         // área do desenho (espaço das peças)
const VIEWG = { x: 238, y: -230, w: 1500, h: 1310 };                              // quadro folgado (com roupa e objetos na mão)
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
  constructor(v, f = 2, z = 0.7, o = null) { this.o = o; this.v = v; this._t = v; this._vel = 0; this.set(f, z); }
  // mexer no alvo ou na velocidade (de dentro ou de fora, ex.: abertura e arrasto) acorda o boneco que estava "dormindo"
  get t() { return this._t; } set t(x) { this._t = x; if (this.o && this.o.sleeping) this.o.wake(); }
  get vel() { return this._vel; } set vel(x) { this._vel = x; if (this.o && this.o.sleeping) this.o.wake(); }
  set(f, z) { this.f = f; this.z = z; const w = 2 * Math.PI * f; this.k = w * w; this.c = 2 * z * w; return this; }
  step(dt) { const a = this.k * (this._t - this.v) - this.c * this._vel; this._vel += a * dt; this.v += this._vel * dt; }
  calma() { return Math.abs(this._t - this.v) < 0.01 && Math.abs(this._vel) < 0.01; }
}

/* ---------- emoções (alvos de cada canal) ---------- */
const EMO = {
  feliz: { lid: 0, happy: 0, brow: [-4, 4, -8], mouth: 'riso', arms: ['baixo', 12, 'baixo', -12], amp: 1, breath: 3.2 },
  acena: { lid: 0, happy: 0, brow: [0, 0, -6], mouth: 'aberta', arms: ['baixo', 12, 'baixo', -12], amp: 1, breath: 3.2, loop: 'tchau' },
  comemora: { lid: 0, happy: 1, brow: [-6, 6, -16], mouth: 'riso', arms: ['aberto', 24, 'aberto', -24], amp: 0.6, breath: 2.4, loop: 'pulo', enf: 'confete' },
  danca: { lid: 0, happy: 1, brow: [0, 0, -8], mouth: 'riso', arms: ['aberto', 10, 'aberto', -10], amp: 0, breath: 2.4, loop: 'danca' },
  amor: { lid: 0, happy: 1, brow: [-6, 6, -10], mouth: 'fechada', arms: ['baixo', 4, 'baixo', -4], amp: 1.6, breath: 2.8, blush: 1, enf: 'coracoes' },
  sono: { lid: 0.62, happy: 0, brow: [0, 0, 10], mouth: 'o', arms: ['baixo', 6, 'baixo', -6], amp: 0.5, breath: 4.6, look: [0, 10], loop: 'cochilo' },
  calmo: { lid: 0.95, happy: 0, brow: [-4, 4, 4], mouth: 'fechada', enf: 'vento', arms: ['baixo', 5, 'baixo', -5], amp: 0.8, breath: 3.7 },
  cansado: { lid: 0.55, happy: 0, brow: [-12, 12, 8], mouth: 'o', enf: 'zzz', arms: ['baixo', 0, 'baixo', 0], amp: 0.6, breath: 4.2, look: [0, 5], sag: 0.015 },
  sonolento: { lid: 0.5, happy: 0, brow: [-6, 6, 8], mouth: 'fechada', arms: ['baixo', 2, 'baixo', -2], amp: 0.5, breath: 4.6, look: [0, 8], sag: 0.02 },
  desconfiado: { lid: 0.42, happy: 0, brow: [14, -4, 8, -6], mouth: 'canto', enf: 'duvida', arms: ['baixo', 0, 'baixo', 0], amp: 0.6, breath: 3.4, look: [18, 4], lean: -2.5 },
  triste: { lid: 0.08, happy: 0, brow: [-18, 18, 0], mouth: 'tristinha', fx: 'umido', arms: ['baixo', -2, 'baixo', 2], amp: 0.5, breath: 4, look: [0, -8], sag: 0.03 },
  bravo: { lid: 0.3, happy: 0, brow: [40, -40, 30], mouth: 'cerrado', pupil: 0.82, enf: 'raiva', arms: ['baixo', 22, 'baixo', -22], amp: 0, breath: 1.4, loop: 'tremer' },
  tonto: { lid: 0.3, happy: 0, brow: [8, 12, 4, -8], mouth: 'canto', arms: ['baixo', 6, 'baixo', -2], amp: 0, breath: 3, sag: 0.02 },
  surpreso: { lid: 0, happy: 0, brow: [-6, 6, -34], mouth: 'oo', enf: 'susto', arms: ['aberto', 8, 'aberto', -8], amp: 0.4, breath: 2.6, pupil: 0.82 },
  // olhos especiais (como nas folhas de expressão): coração, cifrão, estrela, espiral, óculos e choro
  apaixonado: { lid: 0, happy: 0, brow: [-10, 10, -14], mouth: 'riso', arms: ['baixo', 6, 'baixo', -6], amp: 1.4, breath: 2.6, blush: 1, fx: 'coracao', enf: 'coracoes' },
  rico: { lid: 0, happy: 0, brow: [0, 0, -12], mouth: 'riso', arms: ['aberto', 14, 'aberto', -14], amp: 0.8, breath: 2.4, fx: 'cifrao' },
  estrelado: { lid: 0, happy: 0, brow: [0, 0, -16], mouth: 'riso', arms: ['aberto', 22, 'aberto', -22], amp: 0.6, breath: 2.2, fx: 'estrela' },
  descolado: { lid: 0, happy: 0, brow: [0, 0, -4], mouth: 'canto', arms: ['baixo', 10, 'baixo', -10], amp: 0.8, breath: 3, fx: 'oculos', lean: 2 },
  zonzo: { lid: 0.1, happy: 0, brow: [8, 12, 4, -8], mouth: 'canto', arms: ['baixo', 6, 'baixo', -2], amp: 0, breath: 3, sag: 0.02, fx: 'espiral' },
  chorando: { lid: 0, happy: 1, brow: [-22, 22, 4], mouth: 'choro', lagrima: true, arms: ['baixo', -2, 'baixo', 2], amp: 0.5, breath: 3.4, look: [0, -6], sag: 0.03, fx: 'lagrima' },
  emocionado: { lid: 0, happy: 0, brow: [-16, 16, -4], mouth: 'riso', arms: ['baixo', 8, 'baixo', -8], amp: 1, breath: 2.8, blush: 1, fx: 'brilho', lagrima: true, enf: 'brilhos' },
};
/* desenha o símbolo no lugar da pupila (o olho continua piscando e acompanhando o olhar) */
function simbolo(c, fx, x, y, k, t) {
  c.save(); c.translate(x, y); c.scale(k, k);
  if (fx === 'coracao') { const p = 1 + Math.sin(t * 7) * 0.08; c.scale(p, p); c.fillStyle = '#E8142B'; c.beginPath(); c.moveTo(0, 34); c.bezierCurveTo(-66, -4, -40, -62, 0, -26); c.bezierCurveTo(40, -62, 66, -4, 0, 34); c.fill(); c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-22, -22, 9, 6, -0.6, 0, Math.PI * 2); c.fill(); }
  else if (fx === 'umido') {                                    // olhos marejados: pupila grande, úmida, com brilhos grandes
    c.fillStyle = '#2B1A12'; c.beginPath(); c.arc(0, 0, 58, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(120,170,255,.35)'; c.beginPath(); c.ellipse(0, 34, 46, 18, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-20, -22, 19, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(18, 12, 9, 0, Math.PI * 2); c.fill();
  } else if (fx === 'brilho') {                                   // olhos brilhando (encantado/amor): pupila grande e úmida, cheia de brilhos que cintilam
    c.fillStyle = '#2B1A12'; c.beginPath(); c.arc(0, 0, 56, 0, Math.PI * 2); c.fill();
    const g = c.createRadialGradient(0, 18, 4, 0, 18, 56); g.addColorStop(0, 'rgba(255,120,160,.55)'); g.addColorStop(1, 'rgba(255,120,160,0)'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 56, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-18, -20, 17, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(16, 14, 8, 0, Math.PI * 2); c.fill();
    const tw = 0.6 + 0.4 * Math.abs(Math.sin(t * 3.2)); c.save(); c.translate(20, -24); c.scale(tw, tw); c.beginPath(); for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4, r = i % 2 ? 4 : 13; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore();
  } else if (fx === 'cifrao') { c.fillStyle = '#1F9D55'; c.beginPath(); c.arc(0, 0, 50, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; c.font = '900 72px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', 0, 4); }
  else if (fx === 'estrela') { c.rotate(Math.sin(t * 3) * 0.15); c.fillStyle = '#2B1A12'; c.beginPath(); c.arc(0, 0, 52, 0, Math.PI * 2); c.fill(); c.fillStyle = '#FFC21A'; c.beginPath(); for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4, rr = i % 2 ? 12 : 42; c.lineTo(Math.sin(a) * rr, -Math.cos(a) * rr); } c.closePath(); c.fill(); }
  else if (fx === 'espiral') { c.rotate(t * 5); c.strokeStyle = '#2B1A12'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); for (let a = 0; a < Math.PI * 5; a += 0.2) { const rr = 4 + a * 3.1; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.stroke(); }
  c.restore();
}
/* ENFEITES do sentimento, em volta da cabeça (como nas folhas de expressão): veia e fumaça de raiva, zzz de sono,
   interrogação, corações, brilhos, confete, ventinho de calma e risquinhos de susto/alegria. Tudo animado. */
function estrela4(c, x, y, r) { c.beginPath(); for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2, rr = i % 2 ? r * 0.28 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
function coracao(c, x, y, k) { c.save(); c.translate(x, y); c.scale(k, k); c.beginPath(); c.moveTo(0, 34); c.bezierCurveTo(-66, -4, -40, -62, 0, -26); c.bezierCurveTo(40, -62, 66, -4, 0, 34); c.fill(); c.restore(); }
function enfeite(c, tipo, t) {
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  c.translate(965, 380); c.scale(1.4, 1.4); c.translate(-965, -380); // maiores, para ler bem no tamanho do app
  const ciclo = (v) => v - Math.floor(v);
  if (tipo === 'raiva') {
    const p = 1 + Math.sin(t * 9) * 0.12;                                     // veia pulsando na testa
    c.save(); c.translate(1150, 300); c.scale(p, p); c.strokeStyle = '#D91E2E'; c.lineWidth = 15;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { c.beginPath(); c.moveTo(sx * 10, sy * 34); c.quadraticCurveTo(sx * 10, sy * 10, sx * 34, sy * 10); c.stroke(); }
    c.restore();
    for (const [x, d] of [[650, -1], [1290, 1]]) for (let i = 0; i < 2; i++) {   // fumacinha saindo dos dois lados
      const k = ciclo(t * 0.9 + i * 0.5), a = Math.sin(k * Math.PI);
      c.globalAlpha = a * 0.9; c.fillStyle = '#F4EDE8'; c.strokeStyle = 'rgba(120,90,70,.5)'; c.lineWidth = 5;
      const cx = x + d * k * 60, cy = 330 - k * 110, r = 26 + k * 20;
      for (const [ox, oy, rr] of [[0, 0, 1], [-r * 0.8, r * 0.3, 0.7], [r * 0.8, r * 0.3, 0.7]]) { c.beginPath(); c.arc(cx + ox, cy + oy, r * rr, 0, Math.PI * 2); c.fill(); c.stroke(); }
    }
  } else if (tipo === 'zzz') {
    c.fillStyle = '#3A2418'; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 0; i < 3; i++) { const k = ciclo(t * 0.35 + i / 3); c.globalAlpha = Math.sin(k * Math.PI); c.font = `900 ${50 + k * 40}px Nunito, system-ui, sans-serif`; c.fillText('z', 1250 + k * 90, 300 - k * 200); }
  } else if (tipo === 'duvida') {
    c.fillStyle = '#3A2418'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 150px Nunito, system-ui, sans-serif';
    c.save(); c.translate(1330, 210 + Math.sin(t * 2.4) * 10); c.rotate(0.18 + Math.sin(t * 1.7) * 0.08); c.fillText('?', 0, 0); c.restore();
  } else if (tipo === 'coracoes') {
    c.fillStyle = '#E8142B';
    for (let i = 0; i < 3; i++) { const k = ciclo(t * 0.32 + i / 3); c.globalAlpha = Math.sin(k * Math.PI); coracao(c, 1260 + Math.sin(k * 6 + i) * 26 + i * 22, 320 - k * 240, 0.55 + 0.25 * Math.sin(k * Math.PI)); }
  } else if (tipo === 'brilhos') {
    c.fillStyle = '#FFC21A';
    [[1290, 170, 46, 0], [1350, 280, 30, 0.7], [640, 210, 26, 1.4]].forEach(([x, y, r, f]) => { c.globalAlpha = 0.55 + 0.45 * Math.abs(Math.sin(t * 2.6 + f)); estrela4(c, x, y, r * (0.8 + 0.25 * Math.abs(Math.sin(t * 2.6 + f)))); });
  } else if (tipo === 'confete') {
    const cores = ['#2F80ED', '#27AE60', '#F2C94C', '#EB5757', '#9B51E0'];
    for (let i = 0; i < 12; i++) { const k = ciclo(t * 0.45 + i * 0.083), x = 600 + ((i * 97) % 740), y = 40 + k * 330; c.globalAlpha = Math.min(1, (1 - k) * 2); c.fillStyle = cores[i % 5]; c.save(); c.translate(x + Math.sin(t * 3 + i) * 20, y); c.rotate(t * 4 + i); c.fillRect(-14, -6, 28, 12); c.restore(); }
  } else if (tipo === 'vento') {
    c.strokeStyle = 'rgba(120,90,70,.55)'; c.lineWidth = 9; const k = ciclo(t * 0.4); c.globalAlpha = Math.sin(k * Math.PI);
    c.save(); c.translate(1300 + k * 30, 420); c.beginPath(); for (let a = 0; a < Math.PI * 3.2; a += 0.15) { const r = 8 + a * 9; c.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.7); } c.stroke(); c.restore();
  } else if (tipo === 'susto') {
    c.strokeStyle = '#FFC21A'; c.lineWidth = 18; const p = 0.85 + 0.15 * Math.abs(Math.sin(t * 6));
    [[-0.9, 0], [-0.45, 18], [0, 30]].forEach(([a, d]) => { const x = 1270, y = 240; c.beginPath(); c.moveTo(x + Math.cos(a - 0.6) * (60 + d) * p, y + Math.sin(a - 0.6) * (60 + d) * p - 40); c.lineTo(x + Math.cos(a - 0.6) * (120 + d) * p, y + Math.sin(a - 0.6) * (120 + d) * p - 40); c.stroke(); });
  }
  c.restore();
}
/* lágrimas que escorrem (choro ou emoção) */
function lagrimas(c, x, y, w, h, t, lado) {
  c.save(); const lx = x + (lado === 'l' ? w * 0.22 : w * 0.78);
  // lágrima parada na borda do olho (sempre visível) + gotas escorrendo
  c.fillStyle = '#5BC0FF'; c.beginPath(); c.ellipse(lx, y + h * 0.86, 30, 20, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(lx - 9, y + h * 0.82, 8, 5, -0.4, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#3FA9F5';
  for (let i = 0; i < 2; i++) { const k = ((t * 0.8 + i * 0.5 + (lado === 'l' ? 0 : 0.25)) % 1); const ly = y + h * 0.95 + k * 170; c.globalAlpha = Math.min(1, (1 - k) * 1.4); c.beginPath(); c.moveTo(lx, ly - 34); c.quadraticCurveTo(lx + 26, ly + 6, lx, ly + 20); c.quadraticCurveTo(lx - 26, ly + 6, lx, ly - 34); c.fill(); }
  c.restore();
}
/* óculos escuros por cima dos dois olhos */
function oculos(c, L) {
  const [lx, ly, lw, lh] = L['olho-l'], [rx, ry, rw, rh] = L['olho-r'];
  c.save(); c.fillStyle = '#1C1C1E'; c.strokeStyle = '#1C1C1E'; c.lineWidth = 16; c.lineJoin = 'round';
  const lente = (x, y, w, h) => { c.beginPath(); c.moveTo(x - 6, y + h * 0.22); c.lineTo(x + w + 6, y + h * 0.22); c.quadraticCurveTo(x + w + 4, y + h * 0.95, x + w / 2, y + h * 0.92); c.quadraticCurveTo(x - 4, y + h * 0.95, x - 6, y + h * 0.22); c.fill(); };
  lente(lx, ly, lw, lh); lente(rx, ry, rw, rh);
  c.beginPath(); c.moveTo(lx + lw, ly + lh * 0.3); c.quadraticCurveTo((lx + lw + rx) / 2, ly + lh * 0.18, rx, ry + rh * 0.3); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.28)'; [[lx, ly, lw, lh], [rx, ry, rw, rh]].forEach(([x, y, w, h]) => { c.beginPath(); c.moveTo(x + w * 0.2, y + h * 0.32); c.lineTo(x + w * 0.38, y + h * 0.32); c.lineTo(x + w * 0.22, y + h * 0.7); c.lineTo(x + w * 0.08, y + h * 0.7); c.closePath(); c.fill(); });
  c.restore();
}
export const MOODS = Object.keys(EMO);
export const LIVE = []; // (compatibilidade)
/* todos os bonecos vivos: quando a pessoa toca na tela, eles olham para onde ela tocou */
const RIGS = new Set();
if (typeof document !== 'undefined') document.addEventListener('pointerdown', (ev) => {
  RIGS.forEach((r) => { if (r.visible && r.el.isConnected && !r.el.contains(ev.target) && !(EMO[r.mood] || {}).look) r.lookAt(ev.clientX, ev.clientY); });
}, { passive: true, capture: true });

/* ---------- um laço de animação só, para todos os bonecos (máx. 60 fps) ----------
   Para sozinho quando nenhum boneco precisa de quadro (todos parados, fora da tela ou app em segundo plano). */
let rafId = 0, lastLoop = 0;
const precisa = (r) => !r.dead && !r.manual && !r.sleeping && r.visible;
function loop(now) {
  rafId = 0;
  if (typeof document !== 'undefined' && document.hidden) return;
  if (now - lastLoop >= 1000 / 120 - 1) { // acompanha a tela: 60 fps, ou 120 nos celulares com tela de 120 Hz
    lastLoop = now;
    // durante uma troca de tela quem se mexe é o Lembra da transição: os outros esperam (o quadro fica livre para o movimento)
    const viaja = document.documentElement.classList.contains('lm-viajando');
    RIGS.forEach((r) => { if (!r.el.isConnected) return r.stop(); if (!precisa(r)) return; if (viaja) { r.last = now; return; } r.frame(now); });
  }
  for (const r of RIGS) if (precisa(r)) { rafId = requestAnimationFrame(loop); return; }
}
function kick() { if (!rafId && typeof requestAnimationFrame !== 'undefined' && !(typeof document !== 'undefined' && document.hidden)) rafId = requestAnimationFrame(loop); }
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (!document.hidden) { RIGS.forEach((r) => { r.last = performance.now(); }); kick(); } });

/* ---------- um Sininho ---------- */
class Rig {
  constructor(el) {
    this.el = el; this.cv = el.querySelector('canvas'); this.ctx = this.cv.getContext('2d');
    const S = (v, f, z) => new Spring(v, f, z, this);
    this.s = {
      lean: S(0, 1.5, 0.78), bx: S(0, 1.3, 0.85), by: S(0, 3.2, 0.55), sq: S(0, 2.6, 0.42),
      aL: S(12, 3.6, 0.5), aR: S(-12, 3.6, 0.5), px: S(0, 5, 0.85), py: S(0, 5, 0.85), pz: S(1, 6, 0.7),
      lid: S(0, 16, 1), happy: S(0, 7, 0.9), bL: S(0, 5, 0.6), bR: S(0, 5, 0.6), bY: S(0, 5, 0.55), bYr: S(0, 5, 0.55),
      fL: S(0, 5, 0.55), fR: S(0, 5, 0.55), mz: S(1, 9, 0.45), blush: S(0, 2.5, 1), sag: S(0, 2, 0.9), hand: S(0, 9, 0.6), wL: S(0, 18, 1), wR: S(0, 18, 1), fxL: S(0, 5, 0.45), fxR: S(0, 5, 0.45),
    };
    this.pose = { l: 'baixo', r: 'baixo' }; this.mouth = 'aberta'; this.mood = '';
    this.q = []; this.t = 0; this.next = { idle: 0.6, blink: 1.5 + Math.random() * 2 }; this.loopAt = 0;
    this.visible = true; this.dead = false; this.talk = 0; this.sleeping = false; this.calm = calm(); this.loopN = 0; RIGS.add(this);
    this.io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (this.visible) { this.last = performance.now(); kick(); } }) : null;
    this.io && this.io.observe(el);
    this.ro = 'ResizeObserver' in window ? new ResizeObserver(() => { this.resize(); if (this.sleeping && IMG) this.draw(); }) : null;
    this.ro && this.ro.observe(el);
    this.resize(); this.setMood(el.dataset.snh || 'feliz', true);
    this.last = performance.now();
    if (typeof window !== 'undefined' && window.__snhManual) { this.manual = true; this.fake = 0; (window.__snhRigs = window.__snhRigs || []).push(this); this.last = 0; } // modo de teste: avançado à mão, quadro a quadro
    else kick();
  }
  stop() { RIGS.delete(this); this.dead = true; clearTimeout(this.wakeT); this.io && this.io.disconnect(); this.ro && this.ro.disconnect(); }
  resize() {
    const VIEW2 = this.el.dataset.nitido ? VIEWG : VIEW; this.vista = VIEW2; const dpr = this.el.dataset.nitido ? 2 : Math.min(2, window.devicePixelRatio || 1), w = this.el.clientWidth || parseFloat(this.el.style.getPropertyValue('--s')) || 120;
    const W = Math.round(w * dpr), H = Math.round(w * VIEW2.h / VIEW2.w * dpr);
    if (this.cv.width !== W || this.cv.height !== H) { this.cv.width = W; this.cv.height = H; }
    this.scale = this.cv.width / VIEW2.w;
  }
  get xf() { return this._xf; }
  set xf(v) { this._xf = v; if (this.sleeping) this.wake(); }
  /* dormir: parado de verdade (molas em repouso, nada agendado, sem loop) → não redesenha; acorda na próxima piscada/pose */
  dorme() {
    this.sleeping = true; this.sleptAt = performance.now();
    const e = EMO[this.mood] || {}, prox = Math.min(this.next.idle, this.next.blink, this.next.vida ?? Infinity, e.loop ? this.loopAt : Infinity) - this.t;
    clearTimeout(this.wakeT); this.wakeT = setTimeout(() => this.wake(), Math.max(60, prox * 1000));
  }
  wake() {
    if (!this.sleeping || this.dead) return;
    this.sleeping = false; clearTimeout(this.wakeT);
    const now = performance.now(); this.t += (now - this.sleptAt) / 1000; this.last = now; // o relógio do boneco anda o tempo que ele dormiu
    kick();
  }
  quieto() {
    const e = EMO[this.mood] || {};
    if (this.q.length || this.dr || this.tonto || this.talk || this.mood === 'triste' || (e.loop && !this.calm)) return false;
    if (this.pp && Object.values(this.pp).some((o) => o && this.t - o[1] < 0.15)) return false;
    if (this.pm && this.t - this.pmT < 0.12) return false;
    for (const k in this.s) if (!this.s[k].calma()) return false;
    return true;
  }
  /* agenda no relógio do boneco */
  at(sec, fn) { this.q.push([this.t + sec, fn]); if (this.sleeping) this.wake(); }
  clear() { this.q = []; }

  setMood(m, now = false) {
    if (!EMO[m]) m = 'feliz';
    if (m === this.mood) return;
    this.mood = m; this.el.dataset.snh = m;
    const e = EMO[m], s = this.s;
    this.clear(); this.loopAt = this.t + 0.5; this.loopN = 0;
    if (this.calm) now = true; // reduzir movimento: troca a expressão na hora
    if (this.sleeping) this.wake();
    s.lid.t = e.lid; s.happy.t = e.happy; s.bL.t = e.brow[0]; s.bR.t = e.brow[1]; s.bY.t = e.brow[2]; s.bYr.t = e.brow[3] ?? e.brow[2];
    s.blush.t = e.blush || 0; s.sag.t = e.sag || 0; s.pz.t = e.pupil || 1; this.fx = e.fx || ''; this.lagri = !!e.lagrima; this.enf = e.enf || '';
    s.px.t = e.look ? e.look[0] : 0; s.py.t = e.look ? e.look[1] : 0;
    s.lean.t = e.lean || 0; s.bx.t = 0; s.by.t = 0; s.fL.t = 0; s.fR.t = 0;
    if (!this.dr) this.arms(e.arms);                // no ar, os braços continuam abertos
    this.setMouth(e.mouth);
    if (!now) { s.sq.vel += 1.4; s.by.vel -= 120; } // "pulinho" de reação ao mudar
    if (now) Object.values(s).forEach((x) => { x.v = x.t; x.vel = 0; });
    if (this.calm && IMG) this.draw();
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
  /* boca falando (novidades): manda sobre os gestos enquanto houver voz */
  fala(m) { if (m === null) { if (this.voz) { this.voz = null; this.calou = this.t; this.mouth = this.antes || 'aberta'; this.pm = null; } return; } if (!this.voz) this.antes = this.mouth; this.voz = m; if (this.imgOk('boca-' + m)) { this.mouth = m; this.pm = null; } }
  setMouth(m) { if (this.voz || (this.t - this.calou < 2.5 && /^(a|e|o)$/.test(m))) return; if (m && m !== this.mouth && this.imgOk('boca-' + m)) { this.pm = this.mouth; this.pmT = this.t; this.mouth = m; this.s.mz.v = 0.9; } }
  imgOk(n) { return IMG && IMG[n] && IMG[n].naturalWidth; }
  blink(dbl) {
    if (this.sleeping) this.wake();
    if (this.s.lid.t >= 0.6) return;
    const base = this.s.lid.t, meio = !dbl && Math.random() < 0.12;
    this.s.lid.t = meio ? Math.max(base, 0.55) : 1;                  // às vezes só "meio piscar", como gente
    this.at(meio ? 0.12 : 0.13, () => { this.s.lid.t = base; });
    if (dbl) this.at(0.26, () => this.blink(false));
  }

  /* gestos */
  act(name, opt = {}) {
    const s = this.s, e = EMO[this.mood];
    if (this.sleeping) this.wake();
    if (this.calm && ['vibra', 'soco', 'orgulho', 'alivio', 'pulo', 'tchau', 'riso', 'nao', 'balanca', 'dor', 'susto', 'coca', 'aponta', 'apontaEsq', 'boceja', 'cinico', 'maoBoca'].includes(name)) { this.blink(false); return; } // reduzir movimento: só o rosto
    if (name === 'tchau') {
      const back = e.arms;
      s.lean.t = 2.2; s.bx.t = 6;                                  // inclina para o lado oposto ao aceno
      this.arms(['aberto', 20, back[2], back[3]]);
      this.at(0.06, () => { s.bY.t = (e.brow[2] || 0) - 10; s.happy.t = Math.max(e.happy, 0.0); });
      for (let i = 0; i < 9; i++) this.at(0.16 + i * 0.111, () => { s.aL.t = i % 2 ? 27 : 13; });   // ±7° a ~4,5 Hz
      this.at(1.2, () => { this.arms(back); s.lean.t = e.lean || 0; s.bx.t = 0; s.bY.t = e.brow[2]; });
    } else if (name === 'pulo') {
      const alto = opt.alto ? 1.45 : 1;
      s.sq.t = 0.12; s.by.t = 18;                                  // antecipação: agacha 90 ms
      this.at(0.09, () => { s.sq.t = -0.08; s.by.t = -150 * alto; s.fL.t = 26; s.fR.t = 26; }); // estica no ar
      this.at(0.09 + 0.24 * alto, () => { s.by.t = 0; s.sq.t = 0; });
      this.at(0.21 + 0.24 * alto, () => { s.sq.t = 0.14; s.fL.t = 0; s.fR.t = 0; }); // pouso: achata 100 ms
      this.at(0.31 + 0.24 * alto, () => { s.sq.t = 0; });          // e a mola devolve
    } else if (name === 'vibra') {                                // vibra de felicidade: agacha, salta com os braços pro alto, dois pulinhos e assenta
      const back = opt.volta || e.arms, m0 = this.mouth, k = opt.alto ? 1.3 : 1, h0 = e.happy;
      s.sq.t = 0.12; s.by.t = 14; s.bY.t = (e.brow[2] || 0) - 14;
      this.at(0.13, () => { s.sq.t = -0.09; s.by.t = -120 * k; s.fL.t = 24; s.fR.t = 24; this.arms(['cima', 18, 'cima', -18]); this.setMouth('riso'); s.happy.t = 1; });
      this.at(0.13 + 0.26 * k, () => { s.by.t = 0; s.sq.t = 0; });
      this.at(0.25 + 0.26 * k, () => { s.sq.t = 0.12; s.fL.t = 0; s.fR.t = 0; });
      this.at(0.35 + 0.26 * k, () => { s.sq.t = 0; });
      for (let i = 0; i < 2; i++) {
        const b = 0.82 + i * 0.4;
        this.at(b, () => { s.sq.t = 0.07; s.lean.t = (i ? 1 : -1) * 4; });
        this.at(b + 0.08, () => { s.sq.t = -0.05; s.by.t = -56 * k; s[i ? 'fR' : 'fL'].t = 20; });
        this.at(b + 0.24, () => { s.by.t = 0; s.sq.t = 0.08; s.fL.t = 0; s.fR.t = 0; });
        this.at(b + 0.33, () => { s.sq.t = 0; });
      }
      for (let i = 0; i < 9; i++) this.at(0.6 + i * 0.12, () => { s.aL.t = i % 2 ? 26 : 10; s.aR.t = i % 2 ? -10 : -26; });
      this.at(1.75, () => { s.lean.t = e.lean || 0; this.arms(back); });
      this.at(2, () => { s.happy.t = h0; this.setMouth(m0); s.bY.t = e.brow[2]; });
      this.next.idle = this.t + 2.6; this.loopAt = Math.max(this.loopAt, this.t + 2.6);
    } else if (name === 'soco') {                                 // "isso!": puxa o braço com vontade, duas vezes, e pisca
      const back = opt.volta || e.arms, m0 = this.mouth, h0 = e.happy;
      this.arms([back[0], back[1], 'cima', -18]); s.sq.t = -0.06; s.lean.t = 3; s.bY.t = (e.brow[2] || 0) - 10;
      [0.24, 0.66].forEach((b) => { this.at(b, () => { s.sq.t = 0.11; s.lean.t = -4; s.aR.t = 8; s.by.t = 8; this.setMouth('riso'); s.happy.t = 0.8; }); this.at(b + 0.17, () => { s.sq.t = -0.07; s.lean.t = 3; s.aR.t = -20; s.by.t = -36; }); this.at(b + 0.32, () => { s.by.t = 0; s.sq.t = 0; }); });
      this.at(1.1, () => { s.wR.t = 1; s.happy.t = h0; }); this.at(1.5, () => { s.wR.t = 0; });
      this.at(1.35, () => { this.arms(back); s.lean.t = e.lean || 0; }); this.at(1.8, () => { this.setMouth(m0); s.bY.t = e.brow[2]; });
      this.next.idle = this.t + 2.2; this.loopAt = Math.max(this.loopAt, this.t + 2.2);
    } else if (name === 'orgulho') {                              // peito cheio, corado, balança devagar e suspira
      const m0 = this.mouth, h0 = e.happy, b0 = e.blush || 0;
      s.sq.t = -0.06; s.blush.t = 1; s.happy.t = 1; this.setMouth('fechada'); s.bY.t = (e.brow[2] || 0) - 6;
      [[3, 0.25], [-3, 0.75], [2, 1.2], [e.lean || 0, 1.6]].forEach(([v, t]) => this.at(t, () => { s.lean.t = v; }));
      this.at(1.5, () => { s.sq.t = 0.04; }); this.at(1.8, () => { s.sq.t = 0; s.happy.t = h0; s.blush.t = b0; this.setMouth(m0); s.bY.t = e.brow[2]; });
      this.next.idle = this.t + 2.3; this.loopAt = Math.max(this.loopAt, this.t + 2.3);
    } else if (name === 'alivio') {                               // ufa: murcha soltando o ar e abre um sorriso
      const m0 = this.mouth, h0 = e.happy;
      s.lid.t = 0.5; s.sq.t = 0.06; this.setMouth('oo'); s.bL.t = 8; s.bR.t = -8; s.lean.t = -1.5;
      this.at(0.75, () => { s.sq.t = -0.05; s.lid.t = e.lid; this.setMouth('riso'); s.happy.t = 1; s.bL.t = e.brow[0]; s.bR.t = e.brow[1]; s.by.vel -= 160; s.lean.t = 1.5; });
      this.at(1.1, () => { s.sq.t = 0; s.lean.t = e.lean || 0; }); this.at(1.9, () => { s.happy.t = h0; this.setMouth(m0); });
      this.next.idle = this.t + 2.2;
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
      const back = e.arms; this.front = null; this.arms([back[0], back[1], 'cima', 14]); // o braço sobe pelo lado do sino até a cabeça (na frente ele virava uma mão solta) s.px.t = 12; s.py.t = -10; s.lean.t = 1.5; s.wR.t = 0.4; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 10;
      for (let i = 0; i < 6; i++) this.at(0.15 + i * 0.12, () => { s.aR.t = i % 2 ? 22 : 8; });
      this.at(1.1, () => { this.arms(back); s.px.t = 0; s.py.t = 0; s.lean.t = e.lean || 0; s.wR.t = 0; s.bYr.t = e.brow[3] ?? e.brow[2]; });
      this.at(1.25, () => { this.front = null; });
      this.next.idle = this.t + 1.4;
    } else if (name === 'balanca') {                              // balancinho alegre de um lado pro outro
      [[4, 0], [-4, 0.3], [4, 0.6], [-3, 0.9], [0, 1.2]].forEach(([v, t]) => this.at(t, () => { s.lean.t = v; s.fL.t = v > 0 ? 14 : 0; s.fR.t = v < 0 ? 14 : 0; }));
      this.at(1.3, () => { s.fL.t = 0; s.fR.t = 0; });
      this.next.idle = this.t + 1.5;
    } else if (name === 'aponta' || name === 'apontaEsq') {        // aponta para um botão (direita ou esquerda) e olha pra ele
      const dir = name === 'aponta' ? 1 : -1, back = e.arms, m0 = this.mouth;
      if (dir > 0) this.arms([back[0], back[1], 'aberto', -64]); else this.arms(['aberto', 64, back[2], back[3]]);
      s.px.t = 20 * dir; s.py.t = 6; s.lean.t = 2.4 * dir; this.setMouth('aberta'); s.bY.t = (e.brow[2] || 0) - 8;
      [0.35, 0.7, 1.05].forEach((t, i) => this.at(t, () => { if (dir > 0) s.aR.t = i % 2 ? -64 : -56; else s.aL.t = i % 2 ? 64 : 56; }));
      this.at(0.5, () => { s.px.t = 0; s.py.t = 0; }); // olha pra você ("toca aí!")
      this.at(0.9, () => { s.px.t = 20 * dir; });
      this.at(1.6, () => { this.arms(back); s.px.t = 0; s.py.t = 0; s.lean.t = e.lean || 0; this.setMouth(m0); s.bY.t = e.brow[2]; });
      this.next.idle = this.t + 1.9;
    } else if (name === 'sobrancelha') {                          // levanta uma sobrancelha só, olhar de quem sabe das coisas
      const m0 = this.mouth; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 22; s.bR.t = -8; s.bY.t = (e.brow[2] || 0) + 6; s.px.t = -10; this.setMouth('canto');
      this.at(1.3, () => { s.bYr.t = e.brow[3] ?? e.brow[2]; s.bR.t = e.brow[1]; s.bY.t = e.brow[2]; s.px.t = 0; this.setMouth(m0); });
      this.next.idle = this.t + 1.6;
    } else if (name === 'revira') {                               // revira os olhos (deboche): pupilas fazem um arco por cima
      const m0 = this.mouth; s.lid.t = 0.34; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 16; s.bY.t = (e.brow[2] || 0) - 5; this.setMouth('canto'); s.lean.t = (e.lean || 0) - 2.2;
      [[15, -4, 0], [10, -15, 0.16], [0, -18, 0.32], [-12, -14, 0.48], [-16, -5, 0.64], [-10, 0, 0.9], [0, 0, 1.3]].forEach(([x, y, t]) => this.at(t, () => { s.px.t = x; s.py.t = y; }));
      this.at(0.6, () => { s.sq.vel += 0.9; });
      this.at(1.4, () => { s.lid.t = e.lid; s.bY.t = e.brow[2]; s.bYr.t = e.brow[3] ?? e.brow[2]; this.setMouth(m0); s.lean.t = e.lean || 0; });
      this.next.idle = this.t + 1.7;
    } else if (name === 'olhaLados') {                             // olha pra um lado, pro outro, e volta
      [[-20, 0, 0], [20, 0, 0.55], [0, 0, 1.15]].forEach(([x, y, t]) => this.at(t, () => { s.px.t = x; s.py.t = y; }));
      this.next.idle = this.t + 1.6;
    }
  }
  /* olha para um ponto da tela (o toque da pessoa, um botão) */
  lookAt(x, y, hold = 1.4) {
    const r = this.el.getBoundingClientRect(); if (!r.width) return;
    if (this.sleeping) this.wake();
    const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height * 0.45), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / (r.width * 1.5));
    this.s.px.t = (dx / d) * 20 * k; this.s.py.t = (dy / d) * 13 * k;
    this.s.lean.t += Math.max(-1.2, Math.min(1.2, dx / 300));
    this.next.idle = this.t + hold;
  }

  /* ---------- sendo carregado pelo dedo ----------
     O app manda, a cada quadro: velocidade (vx, vy em px/s), aceleração (ax, ay em px/s²), giro do corpo (w em °/s)
     e há quanto tempo o dedo está parado. Cada parte reage com a física de um corpo pendurado:
     - olhos: olham para onde ele está sendo levado; parado no ar, olham para baixo (medo de altura);
     - braços: abertos, se debatendo; ficam para trás do movimento e sobem quando ele desce (o ar empurra);
     - pés: pendurados pelo peso, chutando o ar, também ficando para trás;
     - corpo: achata quando acelera para cima, estica quando cai; boca de "o" e de grito com a velocidade. */
  pega() {
    const s = this.s;
    this.clear(); this.front = null; this.tonto = null; s.hand.t = 0; s.wL.t = 0; s.wR.t = 0; s.happy.t = 0; s.blush.t = 0;
    s.aL.set(8, 0.42); s.aR.set(8, 0.42); s.fL.set(7, 0.38); s.fR.set(7, 0.38); s.px.set(9, 0.72); s.py.set(9, 0.72);
    if (this.pose.l !== 'aberto' || this.pose.r !== 'aberto') this.arms(['aberto', 40, 'aberto', -40]);
    s.sq.vel -= 2.4; s.pz.t = 0.78; s.bY.t = -26; s.bYr.t = -26; this.setMouth('oo');   // susto de ser pego
    this.dr = { vx: 0, vy: 0, ax: 0, ay: 0, w: 0, parado: 0 };
  }
  arrasta(d) { if (this.dr) Object.assign(this.dr, d); }
  pendurado() {
    const d = this.dr, s = this.s, t = this.t, cl = (v, a, b) => Math.max(a, Math.min(b, v));
    const sp = Math.hypot(d.vx, d.vy), k = Math.min(1, sp / 1500), kv = Math.min(1, sp / 450);
    if (sp > 90) { s.px.t = (d.vx / sp) * 21 * kv; s.py.t = (d.vy / sp) * 14 * kv + (1 - kv) * 9; }
    else { s.px.t = Math.sin(t * 1.6) * 8; s.py.t = 11; }
    s.pz.t = 1 - 0.3 * k - (d.vy > 600 ? 0.08 : 0);
    const zz = d.parado > 5.5 ? Math.min(1, (d.parado - 5.5) / 1.5) : 0;   // seguro muito tempo: vai cochilando no dedo
    s.lid.t = 0.6 * zz;
    s.bL.t = 12 + 6 * k; s.bR.t = -12 - 6 * k; s.bY.t = -16 - 12 * k; s.bYr.t = s.bY.t;
    const boca = d.vy > 850 || k > 0.62 ? 'grito' : k > 0.16 ? 'oo' : zz > 0.5 ? 'o' : d.parado > 1.2 ? 'tristinha' : 'o';
    if (boca !== this.mouth) this.setMouth(boca);
    const trail = cl(-d.vx * 0.022 - d.w * 0.1, -40, 40), sobe = cl(d.vy * 0.016 - d.ay * 0.0004, -22, 28);
    const f = 2 * Math.PI * (4 + 2.8 * k), amp = (6 + 17 * k + (d.parado > 0.8 ? 7 : 0)) * (1 - 0.8 * zz);
    s.aL.t = 36 + trail + sobe + Math.sin(t * f) * amp;
    s.aR.t = -36 + trail - sobe + Math.sin(t * f + 2.1) * amp;
    // pendurado: os pés balançam, mas ficam PRESOS embaixo do sino (antes desciam até 88 e se soltavam do corpo)
    const kick = 6 + 9 * k, fk = 2 * Math.PI * (3.2 + 2.4 * k), base = cl(-16 + d.ay * 0.0003, -24, -8);
    s.fL.t = cl(base + Math.sin(t * fk) * kick, -30, -2); s.fR.t = cl(base + Math.sin(t * fk + Math.PI) * kick, -30, -2);
    const ft = cl(-d.vx * 0.02 - d.w * 0.15, -26, 26);
    s.fxL.t = ft; s.fxR.t = ft * 0.85;
    s.by.t = -70; s.bx.t = 0;
    s.sq.t = cl(-d.ay / 90000, -0.12, 0.12) + cl((Math.abs(d.vx) - Math.abs(d.vy)) / 16000, -0.07, 0.07);
    s.lean.t = cl(-d.w * 0.015, -4, 4);
  }
  /* largou: volta ao normal; as pupilas passam do ponto e balançam (inércia), e se foi muito sacudido fica tonto */
  solta({ vx = 0, vy = 0, tonto = false } = {}) {
    if (!this.dr) return;
    const s = this.s, cl = (v, a, b) => Math.max(a, Math.min(b, v));
    this.dr = null;
    s.aL.set(3.6, 0.5); s.aR.set(3.6, 0.5); s.fL.set(5, 0.55); s.fR.set(5, 0.55); s.fxL.t = 0; s.fxR.t = 0;
    const m = tonto ? 'tonto' : this.mood; this.mood = ''; this.setMood(m);
    s.px.set(3.1, 0.16); s.py.set(3.1, 0.16);
    s.px.vel += cl(vx * 0.07, -260, 260); s.py.vel += cl(vy * 0.07, -200, 200);
    if (Math.abs(vx) + Math.abs(vy) < 200) { s.px.vel += 120; }        // mesmo solto devagar, o olho dá uma balançadinha
    s.px.t = 0; s.py.t = 0; s.sq.vel += 2.4;
    this.at(1.7, () => { s.px.set(5, 0.85); s.py.set(5, 0.85); });
    if (tonto) { this.tonto = { a: this.t, ate: this.t + 3 }; this.next.idle = this.t + 3.2; }
  }
  /* bateu na beirada da tela voando */
  bate(lado) { const s = this.s; s.sq.vel += 3.4; s.lean.vel += lado * 60; s.pz.t = 0.7; this.setMouth('dentes'); s.lid.t = 0.5; this.at(0.25, () => { s.lid.t = 0; }); }
  /* anda de volta pro cantinho dele (passinhos) */
  anda(dir, dur = 1.4) {
    const s = this.s, e = EMO[this.mood], n = Math.max(2, Math.round(dur / 0.19));
    for (let i = 0; i < n; i++) this.at(i * 0.19, () => { const k = i % 2; s.fL.t = k ? 42 : 0; s.fR.t = k ? 0 : 42; s.by.vel -= 70; s.lean.t = dir * 3 + (k ? 1.2 : -1.2); s.aL.t = 14 + (k ? 16 : -10); s.aR.t = -14 + (k ? 10 : -16); s.px.t = dir * 16; s.py.t = 0; });
    this.at(n * 0.19, () => { s.fL.t = 0; s.fR.t = 0; s.lean.t = e.lean || 0; s.aL.t = e.arms[1]; s.aR.t = e.arms[3]; s.px.t = 0; s.sq.vel += 1.2; });
    this.next.idle = this.t + n * 0.19 + 0.5;
  }

  /* CORRIDINHA: ciclo de corrida contínuo, recalculado a cada quadro (60 fps), sem sprite e sem saltos.
     Pernas alternando (sobem e vão pra frente/trás), corpo quicando duas vezes por ciclo com amassa-e-estica
     no contato do pé (a "distorção" que dá peso), inclinado para a frente, gingando de lado, braços
     balançando ao contrário das pernas e olhar para onde vai. Começa e termina suave. */
  corre(dir = 1, dur = 1) {
    const s = this.s;
    if (!this.corrida) this.molasAntes = ['fL', 'fR', 'fxL', 'fxR', 'by', 'bx', 'sq', 'lean', 'aL', 'aR'].map((k) => [k, s[k].f, s[k].z]);
    [['fL', 11, 0.55], ['fR', 11, 0.55], ['fxL', 11, 0.6], ['fxR', 11, 0.6], ['by', 12, 0.6], ['bx', 7, 0.7], ['sq', 12, 0.5], ['lean', 6, 0.75], ['aL', 10, 0.55], ['aR', 10, 0.55]].forEach(([k, a, b]) => s[k].set(a, b));
    this.corrida = { dir: dir < 0 ? -1 : 1, t0: this.t, ate: this.t + Math.max(0.35, dur) };
    this.wake && this.sleeping && this.wake();
  }
  cicloCorrida() {
    const s = this.s, c = this.corrida, e = EMO[this.mood] || {};
    if (this.t >= c.ate) {                                         // chegou: pés no chão, assenta o peso
      this.corrida = null;
      (this.molasAntes || []).forEach(([k, a, b]) => s[k].set(a, b));
      s.fL.t = 0; s.fR.t = 0; s.fxL.t = 0; s.fxR.t = 0; s.by.t = 0; s.bx.t = 0; s.sq.t = 0; s.sq.vel += 1.1;
      s.lean.t = e.lean || 0; s.px.t = 0; if (e.arms) { s.aL.t = e.arms[1]; s.aR.t = e.arms[3]; }
      this.next.idle = this.t + 0.6;
      return;
    }
    const d = c.dir, el = this.t - c.t0, falta = c.ate - this.t;
    const A = Math.max(0, Math.min(1, el / 0.22, falta / 0.28));      // entra e sai suave
    const ph = el * Math.PI * 2 * 2.1;                               // 2,1 ciclos por segundo (4,2 passos)
    const sn = Math.sin(ph), salto = Math.abs(sn);
    // passada de verdade: o pé sobe enquanto vai pra FRENTE (aparece do lado do sino, não escondido atrás),
    // pousa na frente e, no chão, empurra pra trás. Escala do desenho: ~2000 unidades de largura.
    const R = 46 * A, SOBE = 62 * A, cs = Math.cos(ph); // passada que não sai de baixo do sino
    s.fL.t = Math.max(0, sn) * SOBE;  s.fxL.t = -cs * R * d;     // pé esquerdo
    s.fR.t = Math.max(0, -sn) * SOBE; s.fxR.t = cs * R * d;      // pé direito, meio ciclo depois
    s.by.t = -salto * 62 * A;                                                          // corpo quica a cada passo
    s.sq.t = (0.08 - salto * 0.16) * A;                                                // amassa no contato, estica no ar
    s.lean.t = (d * 8 + Math.sin(ph * 2) * 1.6) * A + (e.lean || 0) * (1 - A);         // inclinado pra frente
    s.bx.t = sn * 12 * A;                                                              // ginga de lado
    s.aL.t = 24 + sn * 40 * A; s.aR.t = -24 + sn * 40 * A;                              // braços ao contrário das pernas
    s.px.t = d * 16 * A; s.py.t = 2;                                                   // olha para onde vai
    // na corrida a curva vale exata em cada quadro (sem a mola atrasar nem achatar o passo)
    const mix = Math.max(0.22, A); for (const k of ['fL', 'fR', 'fxL', 'fxR', 'by', 'sq', 'lean', 'bx', 'aL', 'aR']) { s[k].v += (s[k]._t - s[k].v) * mix; s[k]._vel = 0; } // entra e sai misturando, sem pular
  }

  /* VIDA PRÓPRIA: a cada poucos segundos uma micro-reação natural, escolhida pelo sentimento e pela hora
     (bocejar, olhar para um lado e para o outro, levantar a sobrancelha, sorrisinho, suspiro, piscar devagar…) */
  vida() {
    const m = this.mood, s = this.s, h = new Date().getHours(), noite = h >= 22 || h < 6;
    const sono = ['cansado', 'sono', 'sonolento'].includes(m) || noite;
    const L = [['olhaLados', 3], ['sobrancelha', 2], ['piscaLento', 2], ['balanca', m === 'feliz' || m === 'acena' ? 1.5 : 0.4], ['cabeca', 2]];
    if (sono) L.push(['boceja', 3.5], ['piscaLento', 2]);
    if (['feliz', 'acena', 'amor', 'apaixonado', 'emocionado'].includes(m)) L.push(['sorriso', 2.5]);
    if (['triste', 'chorando'].includes(m)) L.push(['suspiro', 3]);
    if (m === 'desconfiado') L.push(['sobrancelha', 3], ['olhaLados', 2]);
    if (m === 'bravo') L.splice(0, L.length, ['bufa', 3], ['olhaLados', 1]);
    let r = Math.random() * L.reduce((a, x) => a + x[1], 0), g = L[0][0];
    for (const [n, w] of L) { if ((r -= w) <= 0) { g = n; break; } }
    const e = EMO[m] || {};
    if (g === 'piscaLento') { const b = s.lid.t; s.lid.set(5, 0.9); s.lid.t = 1; this.at(0.42, () => { s.lid.t = b; }); this.at(0.9, () => s.lid.set(16, 1)); }
    else if (g === 'cabeca') { const d = Math.random() < 0.5 ? -1 : 1; s.lean.t = (e.lean || 0) + d * 4; s.px.t = d * 22; s.py.t = -6; this.at(1.3, () => { s.lean.t = e.lean || 0; s.px.t = 0; s.py.t = 0; }); }
    else if (g === 'sorriso') { const bo = this.mouth; this.setMouth('riso'); s.happy.t = 0.6; this.at(1.1, () => { this.setMouth(bo); s.happy.t = e.happy || 0; }); }
    else if (g === 'suspiro') { s.sq.vel -= 0.9; s.py.t = 14; s.bY.t = (e.brow?.[2] || 0) - 8; this.at(0.7, () => { s.sq.vel += 1.1; }); this.at(1.6, () => { s.py.t = (e.look || [0, 0])[1]; s.bY.t = e.brow?.[2] || 0; }); }
    else if (g === 'bufa') { s.sq.vel += 1.4; s.bY.t = (e.brow?.[2] || 0) + 6; this.at(0.5, () => { s.bY.t = e.brow?.[2] || 0; }); }
    else this.act(g);
  }

  /* vida própria */
  idle() {
    const s = this.s, e = EMO[this.mood];
    if (this.corrida) return this.cicloCorrida();
    if (this.dr) { this.pendurado(); if (this.t >= this.next.blink) { this.blink(false); this.next.blink = this.t + 3 + Math.random() * 3; } return; }
    if (this.tonto) {                                              // tonto: corpo bambo, cambaleando
      const A = Math.min(1, Math.max(0, (this.tonto.ate - this.t) / 1.2));
      s.lean.t = Math.sin(this.t * 4.1) * 3.4 * A; s.bx.t = Math.sin(this.t * 4.1 + 1.2) * 9 * A;
      if (this.t >= this.next.blink) { this.blink(true); this.next.blink = this.t + 1.4 + Math.random(); }
      return;
    }
    if (this.t >= this.next.idle) {
      const amp = this.calm ? 0 : e.amp ?? 1;
      if (amp) {                                                   // pose pequena e segurada (nada de gesto grande parado)
        s.lean.t = (e.lean || 0) + [-1, -0.5, 0, 0.5, 1][Math.floor(Math.random() * 5)] * amp;
        s.bx.t = (Math.random() - 0.5) * 6 * amp;
        s.sq.vel += 0.2;                                           // assentar o peso
      }
      if (!e.look) { const r = Math.random(); s.px.t = r < 0.35 ? 0 : (Math.random() - 0.5) * 36; s.py.t = r < 0.35 ? 0 : (Math.random() - 0.5) * 20; }
      if (Math.random() < 0.12 && !this.talk) { s.bY.t = e.brow[2] - 12; s.bYr.t = (e.brow[3] ?? e.brow[2]) - 12; this.at(0.6, () => { s.bY.t = e.brow[2]; s.bYr.t = e.brow[3] ?? e.brow[2]; }); }
      this.next.idle = this.t + 1.8 + Math.random() * 1.8;          // segura a pose (como no vídeo) e economiza bateria
    }
    if (this.t >= this.next.blink) { this.blink(Math.random() < 0.18); this.next.blink = this.t + 2 + Math.random() * 3.4; }
    if (this.t >= (this.next.vida ?? 2.5) && !this.calm && !this.talk && !this.q.length) { this.vida(); this.next.vida = this.t + 2.8 + Math.random() * 3.8; }
    if (e.loop && !this.calm && this.t >= this.loopAt) {
      const L = e.loop;
      if (L === 'tchau') { this.act('tchau'); this.loopAt = this.t + 3.2 + Math.random() * 2; }
      else if (L === 'pulo') { if (this.loopN++ >= 3) return this.setMood('feliz'); this.act('pulo'); this.loopAt = this.t + 0.95; } // comemora: até 3 pulos
      else if (L === 'danca') {
        if (this.loopN++ >= 4) return this.setMood('feliz');      // dança: até 4 compassos (~1,7 s)
        const k = this.loopN % 2;
        s.lean.t = k ? 6 : -6; s.by.t = 0; s.by.vel -= 160; s.aL.t = k ? 24 : -14; s.aR.t = k ? 14 : -24; s.fL.t = k ? 22 : 0; s.fR.t = k ? 0 : 22;
        this.loopAt = this.t + 0.42;
      } else if (L === 'cochilo') { s.lean.t = s.lean.t > 1 ? -0.5 : 2.6; s.by.t = s.lean.t > 1 ? 6 : 0; this.loopAt = this.t + 2.3; }
      else if (L === 'tremer') { s.lean.t = (s.lean.t > 0 ? -1 : 1) * 1.1; this.loopAt = this.t + 0.07; }
    }
  }

  frame(now) {
    let dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if ((!this.visible && !this.fake && this.fake !== 0) || document.hidden || !IMG) return;
    if (this.calm) { const s = this.s; ['lean', 'bx', 'by', 'sq'].forEach((k) => { s[k]._t = 0; s[k].v = 0; s[k]._vel = 0; }); } // reduzir movimento: corpo parado
    const n = Math.max(1, Math.ceil(dt / (1 / 240)));               // passos pequenos: molas estáveis em qualquer taxa de tela
    for (let i = 0; i < n; i++) {
      this.t += dt / n;
      while (this.q.length) { const j = this.q.findIndex((x) => x[0] <= this.t); if (j < 0) break; const [, fn] = this.q.splice(j, 1)[0]; fn(); }
      if (i === 0) this.idle();
      for (const k in this.s) this.s[k].step(dt / n);
    }
    this.draw();
    if (!this.manual && this.quieto()) this.dorme();
  }

  draw() {
    const c = this.ctx, s = this.s, L = LAY, e = EMO[this.mood];
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, this.cv.width, this.cv.height);
    c.setTransform(this.scale, 0, 0, this.scale, -this.vista.x * this.scale, -this.vista.y * this.scale);
    const img = (n, x, y, w, h) => { const i = IMG[n]; if (i && i.naturalWidth) c.drawImage(i, x, y, w, h); };
    const at = (n, dx = 0, dy = 0) => { const [x, y, w, h] = L[n]; img(n, x + dx, y + dy, w, h); };
    const X = Object.assign({ eye: 1, eyeDx: 0, eyeDy: 0, pupil: 1, pupilDx: 0, pupilDy: 0, brow: 1, browDy: 0, mouth: 1, mouthDy: 0, body: 1, limbs: 1 }, this.xf || {}); // deformação peça a peça (abertura)
    const breath = this.calm ? 0 : Math.sin((this.t / 3.2) * Math.PI * 2) * 0.012;   // respiração: 1,2%, 3,2 s
    const kb = kOf(X, 'body');
    const sq = Math.max(-0.14, Math.min(0.14, (s.sq.v + breath + s.sag.v) * (1 - kb))); // achata/estica com volume, no máx. 14%
    const sy = 1 - sq, sx = (1 + sq * 0.7) * X.body;
    // pés (no chão; só sobem nos pulos/passos)
    c.save(); c.translate(s.bx.v * 0.3, Math.min(0, s.by.v) * 0.85);
    [['pe-l', s.fL.v, -1, s.fxL.v], ['pe-r', s.fR.v, 1, s.fxR.v]].forEach(([n, lift, side, fx]) => {
      if (X.limbs <= 0.01) return;
      const [x, y, w, h] = L[n]; c.save(); c.globalAlpha = X.limbs; c.translate(x + w / 2 + fx, y + h - (1 - X.limbs) * 120); c.scale(lerpN(0.4, 1, X.limbs), lerpN(0.2, 1, X.limbs)); c.rotate(side * lift * 0.004 + fx * 0.0035); c.translate(-(x + w / 2), -(y + h) - lift); img(n, x, y, w, h); c.restore();
    });
    c.restore();
    // corpo: inclina e achata a partir do apoio
    c.save();
    c.translate(FEET[0] + s.bx.v * (1 - kb), FEET[1] + s.by.v * (1 - kb)); c.rotate((s.lean.v * (1 - kb) * Math.PI) / 180); c.scale(sx, sy); c.translate(-FEET[0], -FEET[1]);
    // braços giram no ombro; normalmente atrás do corpo, mas um gesto pode trazer um braço para a FRENTE
    // (mão na boca, coçar a cabeça): aí ele é desenhado depois do rosto, com sombra e contorno, para ler como "na frente"
    const drawArms = (front) => (this.ac && this.ac.semBracos) ? null : [['l', s.aL.v], ['r', s.aR.v]].forEach(([side, ang]) => {
      if (!!(this.front && this.front[side]) !== front) return;
      if (front) { c.save(); c.shadowColor = 'rgba(110,35,0,.55)'; c.shadowBlur = 22; c.shadowOffsetY = 8; }
      const one = (pose, a, alpha) => {
        const n = `braco-${pose}-${side}`; alpha *= X.limbs; if (!L[n] || alpha <= 0.01) return;
        const [, , w, h] = L[n], [ax, ay] = ARM[`${pose}-${side}`], [px, py] = SH[side];
        c.save(); c.globalAlpha = alpha; c.translate(px + (side === 'l' ? 1 : -1) * (1 - X.limbs) * 60, py); c.rotate((a * Math.PI) / 180); c.scale(lerpN(0.5, 1, X.limbs), lerpN(0.5, 1, X.limbs)); const mao = this.ac && this.ac.mao && this.ac.mao[side], pm = mao && PALMA[`${pose}-${side}`];
        if (pm) { c.save(); c.translate((pm[0] - ax) * w, (pm[1] - ay) * h); c.rotate((-a * Math.PI) / 180); c.scale(1.32, 1.32); mao(c, this.t); c.restore(); }
        img(n, -ax * w, -ay * h, w, h); c.restore();
      };
      const old = this.pp && this.pp[side], k = old ? Math.min(1, (this.t - old[1]) / 0.12) : 1;
      if (old && k < 1) one(old[0], old[2] + (ang - old[2]) * 0.4, 1 - k);
      one(this.pose[side], ang, k < 1 ? 0.35 + 0.65 * k : 1);
      if (front) c.restore();
    });
    const V = this.ac; // roupa (js/roupas.js): desenhada nas medidas do corpo, vai junto com ele
    if (V && V.atras) { c.save(); V.atras(c, this.t); c.restore(); }
    drawArms(false);
    { const r = lerpR(L.corpo, X.abs && X.abs.r && X.abs.r.body, kb); c.save(); c.globalAlpha = aOf(X, 'body'); img('corpo', r[0], r[1], r[2], r[3]); c.restore(); }
    if (V && V.cab && kb < 0.05) { c.save(); V.cab(c, this.t); c.restore(); }
    // rosto: chega atrasado em relação ao corpo (movimento secundário)
    const fk = 1 - Math.max(kb, kOf(X, 'eyeL'));
    const fx = (-s.lean.vel * 1.1 + s.px.v * 0.12) * fk, fy = -s.by.vel * 0.012 * fk;
    c.save(); c.translate(fx, fy);
    // bochechas
    if (s.blush.v > 0.02) { c.globalAlpha = 0.5 * s.blush.v; c.fillStyle = '#FF8E7A'; [[790, 640], [1150, 648]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x, y, 46, 26, 0, 0, Math.PI * 2); c.fill(); }); c.globalAlpha = 1; }
    // tontura: as pupilas giram em círculo, cada olho para um lado
    const dz = { l: [0, 0], r: [0, 0] };
    if (this.tonto) {
      const tt = this.t - this.tonto.a, A = Math.min(1, tt / 0.25) * Math.min(1, Math.max(0, (this.tonto.ate - this.t) / 0.9));
      if (this.t > this.tonto.ate) this.tonto = null;
      else { const ph = tt * 2 * Math.PI * (1.9 - tt * 0.25); dz.l = [Math.cos(ph) * 18 * A, Math.sin(ph) * 12 * A]; dz.r = [Math.cos(Math.PI - ph) * 18 * A, Math.sin(Math.PI - ph) * 12 * A]; }
    }
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
        const pcx = qx + qw / 2 + s.px.v + dz[side][0] + (side === 'l' ? 1 : -1) * X.pupilDx, pcy = qy + qh / 2 + s.py.v + dz[side][1] + X.pupilDy;
        if (['coracao', 'cifrao', 'estrela', 'espiral', 'brilho', 'umido'].includes(this.fx)) simbolo(c, this.fx, pcx, pcy, z * (this.fx === 'coracao' ? 1.7 : this.fx === 'estrela' ? 1.3 : ['brilho', 'umido'].includes(this.fx) ? 1.08 : 1.15), this.t + (side === 'l' ? 0 : 0.3));
        else img('pupila-' + side, pcx - (qw * z) / 2, pcy - (qh * z) / 2, qw * z, qh * z);
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
      if (this.fx === 'lagrima' || this.lagri) lagrimas(c, x, y, w, h, this.t, side);
      if (hp > 0.02) { // olhos fechados de alegria (arco, como no vídeo)
        c.save(); c.globalAlpha = hp; c.strokeStyle = INK; c.lineWidth = 15; c.lineCap = 'round';
        if (this.lagri) { const d = side === 'l' ? 1 : -1; c.beginPath(); c.moveTo(cx - d * w * 0.3, cy - 26); c.lineTo(cx + d * w * 0.22, cy); c.lineTo(cx - d * w * 0.3, cy + 26); c.stroke(); } // chorando: olhos apertados "> <"
        else { c.beginPath(); c.moveTo(cx - w * 0.3, cy + 14); c.quadraticCurveTo(cx, cy - 40, cx + w * 0.3, cy + 14); c.stroke(); }
        c.restore();
      }
      c.restore();
    });
    if (this.fx === 'oculos') oculos(c, L);
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
    if (V && V.ros) { c.save(); V.ros(c, this.t); c.restore(); }
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
    if (this.enf && !this.calm) { c.setTransform(this.scale, 0, 0, this.scale, -this.vista.x * this.scale, -this.vista.y * this.scale); enfeite(c, this.enf, this.t); }
  }
}

/* ---------- montagem automática ---------- */
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function mount(el) {
  if (!el || el._rig) return el && el._rig;
  if (!el.querySelector('canvas')) el.innerHTML = '<canvas></canvas>';
  el._rig = { pending: true };
  load().then(() => { if (!el.isConnected && !el._rig.pending) return; const r = new Rig(el); if (r.calm) r.draw(); el._rig = r; (el._todo || []).forEach((f) => f(r)); el._todo = null; });
  return el._rig;
}
const withRig = (el, fn) => { if (!el) return; const r = mount(el); if (r && !r.pending) fn(r); else (el._todo = el._todo || []).push(fn); };
let mo = null;
function watch() {
  if (mo || typeof MutationObserver === 'undefined') return;
  // só olha os nós ADICIONADOS que têm (ou contêm) [data-snh], juntando as mudanças em 100 ms
  let novos = [], t = 0;
  mo = new MutationObserver((recs) => {
    for (const r of recs) for (const n of r.addedNodes) if (n.nodeType === 1 && (n.matches?.('[data-snh]') || n.querySelector?.('[data-snh]'))) novos.push(n);
    if (!novos.length || t) return;
    t = setTimeout(() => { const l = novos; novos = []; t = 0; l.forEach((n) => { if (!n.isConnected) return; (n.matches('[data-snh]') ? [n] : []).concat([...n.querySelectorAll('[data-snh]')]).forEach((el) => !el._rig && mount(el)); }); }, 100);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}
if (typeof document !== 'undefined' && document.body) watch(); else if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', watch);

export function sininho(mood = 'feliz', { size = 120, cls = '', label = 'Lembra' } = {}) {
  const m = EMO[mood] ? mood : 'feliz';
  return `<span class="snh ${cls}" style="--s:${size}px" data-snh="${m}" role="img" aria-label="${esc(label)}"><canvas></canvas></span>`;
}
/** veste o boneco: peças de roupas.js; com braço e boca definidos, a pose fica parada nela */
export function veste(el, v) {
  withRig(el, (r) => {
    r.ac = v || null; r.pausado = !!(v && v.l);
    if (v && v.mood) r.setMood(v.mood, true);
    if (v && v.l) { r.clear(); r.pose = { l: v.l[0], r: v.r[0] }; r.arms([v.l[0], v.l[2] ?? ({ baixo: 12, cima: -16, aberto: 6 })[v.l[0]], v.r[0], v.r[2] ?? ({ baixo: -12, cima: 16, aberto: -6 })[v.r[0]]]); r.front = { l: !!v.frente?.l, r: !!v.frente?.r }; if (v.boca) r.setMouth(v.boca); r.s.aL.v = r.s.aL.t; r.s.aR.v = r.s.aR.t; }
    if (r.sleeping) r.wake(); r.draw();
  });
}
/** desenho parado e sempre igual (para a imagem que vai ser guardada ou postada) */
export async function retrato(v, larg = 1200, t = 0.75) {
  await load(); if (!IMG) return null;
  const el = document.createElement('span'); el.className = 'snh'; el.dataset.snh = (v && v.mood) || 'feliz'; el.dataset.nitido = '1'; el.style.setProperty('--s', `${larg / 2}px`); el.innerHTML = '<canvas></canvas>';
  const r = new Rig(el); r.stop(); el._rig = r; r.calm = true; r.q = [];
  r.ac = v || null;
  if (v && v.l) { r.pose = { l: v.l[0], r: v.r[0] }; r.s.aL.t = v.l[2] ?? ({ baixo: 12, cima: -16, aberto: 6 })[v.l[0]]; r.s.aR.t = v.r[2] ?? ({ baixo: -12, cima: 16, aberto: -6 })[v.r[0]]; r.front = { l: false, r: false }; }
  if (v && v.boca) r.mouth = v.boca;
  r.pp = null; r.pm = null; Object.values(r.s).forEach((x) => { x.v = x.t; x.vel = 0; }); r.s.mz.v = 1; r.s.px.v = EMO[r.mood]?.look ? r.s.px.v : 0; r.s.py.v = EMO[r.mood]?.look ? r.s.py.v : 0; r.t = t; r.draw();
  return r.cv;
}
export const rigDe = (el) => (el && el._rig && !el._rig.pending ? el._rig : null);
export function alive() { watch(); load(); document.querySelectorAll('[data-snh]').forEach(mount); }
export function setMood(el, mood) { withRig(el, (r) => r.setMood(mood)); return Promise.resolve(); }
export function act(el, name, opt) { withRig(el, (r) => r.act(name, opt)); }
export function lookAt(el, x, y, hold) { withRig(el, (r) => r.lookAt(x, y, hold)); }
export const GESTOS = ['revira', 'tchau', 'pulo', 'riso', 'nao', 'sim', 'pop', 'pensa', 'boceja', 'timido', 'pisca', 'olhaLados', 'dor', 'cinico', 'maoBoca', 'susto', 'coca', 'balanca', 'sobrancelha', 'aponta', 'apontaEsq'];

/* balão do app: o texto aparece digitado; aqui o Sininho não fala (a voz só existe nas novidades, em voz-novidades.js),
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
  // acessível: dá pra focar e "tocar" com Enter ou Espaço
  el.tabIndex = 0; el.setAttribute('role', 'button');
  el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') { ev.preventDefault(); el.click(); } });
  let back, last = -1, lastG = '';
  el.addEventListener('click', () => {
    let i, n = 0; do { i = Math.floor(Math.random() * TAP.length); n++; } while ((i === last || TAP[i][1] === lastG) && n < 20); last = i; lastG = TAP[i][1]; // nunca repete o gesto anterior
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
export async function peek(mood, text, { ms = 3600, gesture, tries = 0, desde = Date.now() } = {}) {
  if (document.hidden) return;
  if (document.querySelector('.gx, .paywall, .ficha, .photogate, .avgate, .okfx, .stk')) {
    if (tries < 2 && Date.now() - desde < 4000) setTimeout(() => peek(mood, text, { ms, gesture, tries: tries + 1, desde }), 1500); // no máx. 3 tentativas em 4 s
    return;
  }
  await load();
  if (peekOn) { const old = peekOn; peekOn = null; old.classList.add('is-out'); setTimeout(() => old.remove(), 500); } // a anterior sai com animação
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
    setTimeout(() => { act(el, gesture || (['comemora', 'danca'].includes(mood) ? 'pulo' : 'tchau')); if (text) say(el, text, { bubble: w.querySelector('.snhb__txt') }); else w.querySelector('.snhb')?.remove(); }, 450);
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
  if (doneCount > 1 && now - lastPeek < 90e3) {                // em sequência: reação curta (sem balão), mas sempre reage
    const r = [...RIGS].find((x) => x.visible && x.el.isConnected && x.el.closest('.snhbud')) || [...RIGS].find((x) => x.visible && x.el.isConnected);
    if (r) { r.act('sim'); r.blink(false); } else peek('feliz', '', { gesture: 'sim', ms: 900 });
    return;
  }
  lastPeek = now;
  peek(late ? 'feliz' : 'comemora', pick(late ? DONE_LATE : DONE));
}

/* mascote "vivo" dentro de uma tela: de vez em quando faz um gesto calmo (piscar, olhar, sobrancelha…),
   e pode apontar para um botão (aponta: seletor do alvo). Os olhos já seguem os toques na tela (RIGS).
   Para sozinho quando o elemento sai da tela. */
export function vivo(el, { gestos = ['pisca', 'olhaLados', 'sobrancelha', 'pensa', 'riso', 'sim'], aponta = null, cada = [3.5, 7] } = {}) {
  if (!el || el._vivo) return;
  el._vivo = true; mount(el);
  let n = 0;
  const tick = () => {
    if (!el.isConnected) return;
    if (!document.hidden && !calm()) {
      n++;
      const alvo = aponta && (typeof aponta === 'string' ? document.querySelector(aponta) : aponta);
      if (alvo && n % 3 === 1) {
        const r = el.getBoundingClientRect(), a = alvo.getBoundingClientRect();
        withRig(el, (rg) => { rg.act(a.left + a.width / 2 > r.left + r.width / 2 ? 'aponta' : 'apontaEsq'); rg.at(0.5, () => rg.lookAt(a.left + a.width / 2, a.top + a.height / 2, 1)); });
      } else act(el, gestos[Math.floor(Math.random() * gestos.length)]);
    }
    setTimeout(tick, (cada[0] + Math.random() * (cada[1] - cada[0])) * 1000);
  };
  setTimeout(tick, 1200 + Math.random() * 1500);
}

/* atalhos de reação (XP, subida de nível, erro) */
export function reactXp(el) { withRig(el, (r) => { r.blink(false); r.at(0.25, () => r.act('sim')); }); }
export function reactNivel(el) {
  withRig(el, (r) => {
    const back = EMO[r.mood].arms;
    r.act('pulo', { alto: true });
    if (!r.calm) { r.arms(['cima', 18, 'cima', -18]); r.at(0.7, () => r.arms(back)); }
  });
}
export function reactErro(el) { withRig(el, (r) => { r.act('pop'); r.setMood('triste'); setTimeout(() => { if (r.mood === 'triste') r.setMood('feliz'); }, 1200); }); }

/* acesso ao boneco (para o arrasto do companheiro) */
export function rigOf(el) { const r = el && el._rig; return r && !r.pending ? r : null; }

/* figuras dentro de uma tela (ex.: o Lembra do cartão em foco) também comemoram */
export function comemoraEm(sel, gesto = 'vibra') { document.querySelectorAll(`${sel} [data-snh]`).forEach((n) => withRig(n, (r) => r.act(gesto))); }
