/* Voz das novidades: um mp3 por quadro (media/vozes) e a boca do mascote seguindo o áudio (20 quadros por segundo). */
import { BOCA } from './novidades-voz.js';
import { rigDe } from './sininho.js';
import { soundOn } from './sound.js';

const KEY = 'lembra.voz', FORMA = ['fechada', 'e', 'a', 'o'];
const parado = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let ctx = null; const sons = new Map();
export const temVoz = (c) => !!BOCA[c];
export const vozLigada = () => { try { const v = localStorage.getItem(KEY); return v ? v === '1' : soundOn(); } catch { return true; } };
export const ligaVoz = (on) => { try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* ok */ } };
export const duracao = (c) => (BOCA[c] || '').length * 50;
const contexto = () => { if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; ctx = A ? new A() : null; } return ctx; };
/* o celular só libera som depois de um toque: devolve se já pode tocar */
async function libera() {
  const a = contexto(); if (!a) return false;
  if (a.state !== 'running') { try { await Promise.race([a.resume(), new Promise((r) => setTimeout(r, 350))]); } catch { /* ok */ } }
  return a.state === 'running';
}
export function carrega(c) {
  const a = contexto(); if (!a || !BOCA[c]) return Promise.resolve(null);
  if (!sons.has(c)) sons.set(c, fetch(`media/vozes/n232-${c}.mp3?v=2`).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status))).then((b) => new Promise((ok, no) => { a.decodeAudioData(b, ok, no); })).catch(() => { sons.delete(c); return null; }));
  return sons.get(c);
}
/* onde a fala vira de plano: a pausa mais perto da divisão do texto (o "|") */
export function corte(c, s) {
  const b = BOCA[c] || '', n = b.length, alvo = (n * s.indexOf('|')) / (s.length - 1); let melhor = alvo, nota = -1;
  for (const m of b.matchAll(/0+/g)) { const meio = m.index + m[0].length / 2, v = m[0].length - Math.abs(meio - alvo) / 3; if (meio > 3 && meio < n - 8 && v > nota) { nota = v; melhor = meio; } }
  return melhor / 20;
}
/* batida da apresentação, feita em código: bumbo, chimbal e baixo em 124 BPM */
function batida(a) {
  const sr = a.sampleRate, t = 60 / 124, n = Math.round(sr * t * 8), buf = a.createBuffer(1, n, sr), d = buf.getChannelData(0); let z = 7;
  const ruido = () => { z = (z * 16807) % 2147483647; return z / 1073741823 - 1; };
  const soma = (em, dur, f) => { const i0 = Math.round(em * t * sr), k = Math.round(dur * sr); for (let i = 0; i < k && i0 + i < n; i++) d[i0 + i] += f(i / sr); };
  for (let b = 0; b < 8; b++) {
    soma(b, 0.2, (x) => Math.sin(6.283 * (48 * x + 6 * (1 - Math.exp(-x * 34)))) * Math.exp(-x * 15) * 0.9);
    soma(b + 0.5, 0.06, (x) => ruido() * Math.exp(-x * 80) * 0.22);
    if (b % 2) soma(b, 0.14, (x) => ruido() * Math.exp(-x * 26) * 0.26);
  }
  [[0.5, 110], [1.5, 110], [2.5, 130.8], [3.25, 130.8], [4.5, 146.8], [5.5, 146.8], [6.5, 98], [7.25, 123.5]].forEach(([e, h]) => soma(e, 0.22, (x) => (Math.sin(6.283 * h * x) + 0.35 * Math.sin(12.566 * h * x)) * Math.min(1, x * 200) * Math.exp(-x * 9) * 0.4));
  [[0, 440], [1.5, 523.3], [3, 587.3], [4, 587.3], [5.5, 659.3], [7, 493.9]].forEach(([e, h]) => soma(e, 0.2, (x) => Math.sin(6.283 * h * x) * Math.min(1, x * 300) * Math.exp(-x * 16) * 0.16));
  return buf;
}
/* um locutor por tela de novidades */
export function locutor() {
  let base = null, fonte = null, rig = null, raf = 0, vez = 0;
  const para = () => { vez += 1; cancelAnimationFrame(raf); if (fonte) { fonte.onended = null; try { fonte.stop(); } catch { /* ok */ } fonte = null; } if (rig) rig.fala(null); rig = null; };
  const oculta = () => { if (ctx && (fonte || base)) (document.hidden ? ctx.suspend() : ctx.resume()).catch(() => {}); };
  document.addEventListener('visibilitychange', oculta);
  return {
    para,
    musica(on) {
      if (!on || !ctx || ctx.state !== 'running') { if (base) { try { base.g.gain.setTargetAtTime(0, ctx.currentTime, 0.12); base.s.stop(ctx.currentTime + 0.6); } catch { /* ok */ } base = null; } return; }
      if (base) return;
      const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = batida(ctx); s.loop = true; g.gain.value = 0; g.gain.setTargetAtTime(0.16, ctx.currentTime, 0.2); s.connect(g).connect(ctx.destination); s.start(); base = { s, g };
    },
    /* troca de plano: sopro curto */
    corta(forte) {
      if (!ctx || ctx.state !== 'running') return;
      const a = ctx, t = a.currentTime, n = Math.round(a.sampleRate * 0.26), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / n) ** 2;
      const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = b; f.type = 'bandpass'; f.Q.value = 1.1; f.frequency.setValueAtTime(forte ? 500 : 1100, t); f.frequency.exponentialRampToValueAtTime(forte ? 4200 : 2600, t + 0.22); g.gain.value = forte ? 0.32 : 0.18; s.connect(f).connect(g).connect(a.destination); s.start();
    },
    /* true: falou; null: sem áudio (mostra o texto todo); false: o aparelho ainda espera um toque */
    async fala(c, el, { passo, fim } = {}) {
      para(); if (!(window.AudioContext || window.webkitAudioContext)) return null;
      const minha = vez, pode = await libera();
      if (minha !== vez) return true;
      if (!pode) { carrega(c); return false; }
      const som = await carrega(c);
      if (minha !== vez) return true;
      if (!som) return null;
      fonte = ctx.createBufferSource(); fonte.buffer = som; fonte.connect(ctx.destination); fonte.onended = () => { para(); if (fim) fim(); }; fonte.start();
      const t0 = ctx.currentTime, atraso = ctx.outputLatency || ctx.baseLatency || 0, trilha = BOCA[c];
      if (parado()) { if (passo) passo(1e9); return true; }
      const quadro = () => { const seg = ctx.currentTime - t0 - atraso; if (passo) passo(seg); rig = rigDe(el()) || rig; if (rig) rig.fala(FORMA[trilha[Math.max(0, Math.floor(seg * 20))]] || 'fechada'); raf = requestAnimationFrame(quadro); };
      quadro(); return true;
    },
    fim() { para(); this.musica(false); document.removeEventListener('visibilitychange', oculta); sons.clear(); if (ctx) ctx.close().catch(() => {}); ctx = null; },
  };
}
