/* Lembra Motion · sons.js
   Sons sintetizados na hora (sem arquivo, funcionam offline). Respeitam o som desligado em Ajustes (lembra.sound = '0'). */
let ctx = null, saida = null;
const ligado = () => { try { return localStorage.getItem('lembra.sound') !== '0'; } catch { return true; } };
function pronto() {
  if (!ligado()) return null;
  try {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); const c = ctx.createDynamicsCompressor(); c.threshold.value = -16; saida = ctx.createGain(); saida.gain.value = 0.5; saida.connect(c).connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch { return null; }
}
function tom(at, f0, f1, dur, vol, tipo = 'sine') { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = tipo; o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), at + dur); g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at + dur); o.connect(g).connect(saida); o.start(at); o.stop(at + dur + 0.03); }
let ruidoBuf = null;
function ruido(at, dur, f0, f1, vol, q = 1.2) { if (!ruidoBuf) { ruidoBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = ruidoBuf.getChannelData(0); let s = 7; for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823 - 1; } } const b = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); b.buffer = ruidoBuf; f.type = 'bandpass'; f.Q.value = q; f.frequency.setValueAtTime(f0, at); f.frequency.exponentialRampToValueAtTime(f1, at + dur); g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, at + dur); b.connect(f).connect(g).connect(saida); b.start(at); b.stop(at + dur + 0.02); }
const sino = (at, f, vol, d = 1) => [[1, 1], [2, 0.45], [2.76, 0.35], [5.4, 0.16]].forEach(([m, k], i) => tom(at, f * m, f * m, d / (1 + i * 0.6), vol * k));
const VOZES = {
  toque: (a) => tom(a, 420, 240, 0.07, 0.12), estouro: (a) => tom(a, 320, 780, 0.09, 0.2), vento: (a) => ruido(a, 0.3, 500, 2600, 0.12),
  ventoVolta: (a) => ruido(a, 0.28, 2400, 420, 0.1), folha: (a) => { ruido(a, 0.16, 1800, 5200, 0.14, 0.7); ruido(a + 0.12, 0.14, 4200, 1400, 0.1, 0.7); },
  sino: (a) => sino(a, 880, 0.16), dimdom: (a) => { sino(a, 988, 0.16); sino(a + 0.16, 784, 0.16, 1.2); },
  feito: (a) => [523, 659, 784].forEach((f, i) => tom(a + i * 0.07, f, f, 0.24, 0.16, 'triangle')), xp: (a) => [784, 988, 1319, 1568].forEach((f, i) => tom(a + i * 0.055, f, f, 0.16, 0.11, 'triangle')),
  carimbo: (a) => { tom(a, 150, 52, 0.2, 0.42); ruido(a, 0.07, 900, 300, 0.2); }, erro: (a) => { tom(a, 220, 180, 0.12, 0.16, 'square'); tom(a + 0.13, 185, 140, 0.18, 0.16, 'square'); },
  amassa: (a) => { for (let i = 0; i < 5; i++) ruido(a + i * 0.045, 0.06, 2400 - i * 260, 1200, 0.13, 0.6); }, gota: (a) => { tom(a, 900, 260, 0.12, 0.2); tom(a + 0.1, 260, 640, 0.12, 0.16); },
  nivel: (a) => { [392, 523, 659, 784, 1047].forEach((f, i) => tom(a + i * 0.08, f, f, 0.3, 0.17, 'triangle')); sino(a + 0.42, 1047, 0.14, 1.4); ruido(a, 0.5, 400, 4000, 0.07); }, engrenagem: (a) => { for (let i = 0; i < 4; i++) tom(a + i * 0.045, 1200 + i * 90, 900, 0.03, 0.09, 'square'); },
};
/** som('feito')  |  som('toque', 0.1) toca daqui a 0,1 s */
export function som(nome, atraso = 0) { const f = VOZES[nome]; if (!f) return; const c = pronto(); if (!c) return; try { f(c.currentTime + 0.005 + atraso); } catch { /* sem som, segue a animacao */ } }
export const SONS = Object.keys(VOZES);
