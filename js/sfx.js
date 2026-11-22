/* SFX da abertura — sintetizados na hora (sem arquivo), sincronizados com cada movimento.
   Cada voz recebe (ctx, destino, instante, opções). A mesma voz toca ao vivo e também é usada para
   "renderizar" o áudio do vídeo de demonstração (OfflineAudioContext), então o som do vídeo é o do app.
   Respeita o som desligado em Ajustes (lembra.sound = '0'). */
const noiseBuf = new WeakMap();
function noise(ctx) {
  if (noiseBuf.has(ctx)) return noiseBuf.get(ctx);
  const b = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noiseBuf.set(ctx, b); return b;
}
const VOL = 0.5; // volume geral dos efeitos (metade do anterior)
const env = (g, at, peak, a, dcy, sustain = 0.0001) => { peak *= VOL; g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(peak, at + a); g.gain.exponentialRampToValueAtTime(Math.max(sustain, 0.0001), at + a + dcy); };
function osc(ctx, out, at, { type = 'sine', f0, f1 = f0, dur, peak = 0.2, a = 0.006, curve = 'exp' }) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, at);
  if (f1 !== f0) (curve === 'lin' ? o.frequency.linearRampToValueAtTime(f1, at + dur) : o.frequency.exponentialRampToValueAtTime(f1, at + dur));
  env(g, at, peak, a, dur); o.connect(g).connect(out); o.start(at); o.stop(at + a + dur + 0.05);
}
function nz(ctx, out, at, { dur, peak = 0.2, type = 'bandpass', f0 = 1200, f1 = f0, q = 1, a = 0.005 }) {
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noise(ctx); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, at);
  if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, at + dur);
  env(g, at, peak, a, dur); s.connect(f).connect(g).connect(out); s.start(at, Math.random()); s.stop(at + a + dur + 0.05);
}
/* sino (parciais inarmônicos de sino de verdade) */
function bell(ctx, out, at, f = 880, peak = 0.16, dur = 1.6) {
  [[1, 1], [2.0, 0.5], [2.76, 0.42], [5.4, 0.22], [8.93, 0.1]].forEach(([m, v], i) => osc(ctx, out, at, { f0: f * m, dur: dur / (1 + i * 0.6), peak: peak * v, a: 0.002 }));
}
/* marimba (letras) */
function mari(ctx, out, at, f, peak = 0.14) { osc(ctx, out, at, { f0: f, dur: 0.32, peak, a: 0.003 }); osc(ctx, out, at, { f0: f * 4, dur: 0.06, peak: peak * 0.35, a: 0.002 }); }

export const VOICES = {
  queda: (c, o, t) => osc(c, o, t, { f0: 1400, f1: 500, dur: 0.24, peak: 0.05, type: 'sine' }),                        // gota caindo (assobio descendo)
  splash: (c, o, t) => { nz(c, o, t, { dur: 0.45, peak: 0.32, f0: 2200, f1: 500, q: 0.7 }); osc(c, o, t, { f0: 140, f1: 60, dur: 0.22, peak: 0.35 }); },
  gotinha: (c, o, t, { i = 0 } = {}) => osc(c, o, t, { f0: 1500 + i * 180, f1: 2600 + i * 200, dur: 0.07, peak: 0.05 }),
  pulo: (c, o, t) => osc(c, o, t, { f0: 260, f1: 720, dur: 0.18, peak: 0.16, type: 'triangle' }),                       // boing subindo
  pouso: (c, o, t) => { osc(c, o, t, { f0: 150, f1: 70, dur: 0.14, peak: 0.28 }); nz(c, o, t, { dur: 0.08, peak: 0.06, f0: 700, q: 0.8 }); },
  piscada: (c, o, t) => osc(c, o, t, { f0: 2400, f1: 1800, dur: 0.035, peak: 0.035 }),                                   // tic delicado
  olhada: (c, o, t) => nz(c, o, t, { dur: 0.16, peak: 0.05, f0: 900, f1: 2400, q: 2 }),                                   // swish curto
  sobrancelha: (c, o, t) => osc(c, o, t, { f0: 600, f1: 900, dur: 0.08, peak: 0.05, type: 'triangle' }),
  passo: (c, o, t) => { osc(c, o, t, { f0: 120, f1: 80, dur: 0.07, peak: 0.16 }); nz(c, o, t, { dur: 0.04, peak: 0.04, f0: 1800, q: 1 }); },
  derrapa: (c, o, t) => nz(c, o, t, { dur: 0.42, peak: 0.14, f0: 2600, f1: 900, q: 3 }),
  poeira: (c, o, t) => nz(c, o, t, { dur: 0.35, peak: 0.05, type: 'lowpass', f0: 1200, f1: 300, q: 0.5 }),
  ronco: (c, o, t) => { nz(c, o, t, { dur: 0.5, peak: 0.06, type: 'lowpass', f0: 500, f1: 260, q: 4, a: 0.25 }); },
  dim: (c, o, t) => bell(c, o, t, 988, 0.12, 1.1),
  dom: (c, o, t) => bell(c, o, t, 740, 0.12, 1.2),
  susto: (c, o, t) => osc(c, o, t, { f0: 380, f1: 1100, dur: 0.12, peak: 0.13, type: 'square' }),
  aparece: (c, o, t) => { osc(c, o, t, { f0: 200, f1: 520, dur: 0.16, peak: 0.14 }); nz(c, o, t, { dur: 0.12, peak: 0.04, f0: 3000, q: 1 }); },
  espia: (c, o, t) => osc(c, o, t, { f0: 500, f1: 760, dur: 0.1, peak: 0.07, type: 'triangle' }),
  vira: (c, o, t) => { nz(c, o, t, { dur: 0.6, peak: 0.08, f0: 400, f1: 3800, q: 1.2, a: 0.2 }); osc(c, o, t, { f0: 300, f1: 900, dur: 0.55, peak: 0.05, a: 0.15 }); }, // transformação (shimmer subindo)
  encaixe: (c, o, t, { n = 0 } = {}) => osc(c, o, t, { f0: [880, 988, 1175, 1319, 1568][n % 5], f1: [880, 988, 1175, 1319, 1568][n % 5] * 1.02, dur: 0.12, peak: 0.06 }), // cada peça encaixando
  quadrado: (c, o, t) => osc(c, o, t, { f0: 180, f1: 120, dur: 0.2, peak: 0.2 }),
  letra: (c, o, t, { n = 0 } = {}) => mari(c, o, t, [523.25, 587.33, 659.25, 783.99, 880, 1046.5][n % 6]),
  final: (c, o, t) => { bell(c, o, t, 1046.5, 0.13, 1.8); bell(c, o, t + 0.09, 1568, 0.07, 1.6); },                  // "ding" do sino da marca
};

let ctx = null, master = null;
const soundOn = () => { try { return localStorage.getItem('lembra.sound') !== '0'; } catch { return true; } };
function live() {
  if (!soundOn()) return null;
  try {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor(); master = ctx.createGain(); master.gain.value = 0.9;
      master.connect(comp).connect(ctx.destination);
      // celular bloqueia som antes do primeiro toque: libera no primeiro toque
      const un = () => { ctx.resume(); removeEventListener('pointerdown', un); };
      addEventListener('pointerdown', un, { once: true });
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch { return null; }
}
export function warm() { live(); }
/* toca um som agora (e registra para o vídeo de demonstração) */
export function sfx(name, opts = {}, tIntro) {
  if (typeof window !== 'undefined' && window.__sfxLog && tIntro != null) window.__sfxLog.push([name, tIntro, opts]);
  const c = live(); if (!c || !VOICES[name] || c.state !== 'running') return;
  VOICES[name](c, master, c.currentTime + 0.005, opts);
}
/* renderiza uma lista de sons [nome, tempo, opções] num WAV (para o vídeo) */
export async function renderWav(cues, seconds) {
  const sr = 48000, off = new OfflineAudioContext(2, Math.ceil(sr * seconds), sr);
  const comp = off.createDynamicsCompressor(), m = off.createGain(); m.gain.value = 0.9; m.connect(comp).connect(off.destination);
  cues.forEach(([n, t, o]) => VOICES[n] && VOICES[n](off, m, Math.max(0, t), o || {}));
  const buf = await off.startRendering(), L = buf.getChannelData(0), R = buf.getChannelData(1);
  const dv = new DataView(new ArrayBuffer(44 + L.length * 4));
  const w = (o, s) => [...s].forEach((ch, i) => dv.setUint8(o + i, ch.charCodeAt(0)));
  w(0, 'RIFF'); dv.setUint32(4, 36 + L.length * 4, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
  dv.setUint32(24, sr, true); dv.setUint32(28, sr * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, L.length * 4, true);
  for (let i = 0; i < L.length; i++) { dv.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true); dv.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
  return new Uint8Array(dv.buffer);
}
