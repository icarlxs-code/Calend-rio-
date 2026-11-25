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
  if (!sons.has(c)) sons.set(c, fetch(`media/vozes/n232-${c}.mp3`).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status))).then((b) => new Promise((ok, no) => { a.decodeAudioData(b, ok, no); })).catch(() => { sons.delete(c); return null; }));
  return sons.get(c);
}
/* um locutor por tela de novidades */
export function locutor() {
  let fonte = null, rig = null, raf = 0, vez = 0;
  const para = () => { vez += 1; cancelAnimationFrame(raf); if (fonte) { fonte.onended = null; try { fonte.stop(); } catch { /* ok */ } fonte = null; } if (rig) rig.fala(null); rig = null; };
  const oculta = () => { if (ctx && fonte) (document.hidden ? ctx.suspend() : ctx.resume()).catch(() => {}); };
  document.addEventListener('visibilitychange', oculta);
  return {
    para,
    /* true: falou (ou não tem como falar); false: o aparelho ainda espera um toque */
    async fala(c, el) {
      para(); if (!(window.AudioContext || window.webkitAudioContext)) return true;
      const minha = vez, pode = await libera();
      if (minha !== vez) return true;
      if (!pode) { carrega(c); return false; }
      const som = await carrega(c);
      if (minha !== vez || !som) return true;
      fonte = ctx.createBufferSource(); fonte.buffer = som; fonte.connect(ctx.destination); fonte.onended = para; fonte.start();
      const t0 = ctx.currentTime, atraso = ctx.outputLatency || ctx.baseLatency || 0, trilha = BOCA[c];
      if (parado()) return true;
      const quadro = () => { rig = rigDe(el()) || rig; if (rig) rig.fala(FORMA[trilha[Math.max(0, Math.floor((ctx.currentTime - t0 - atraso) * 20))]] || 'fechada'); raf = requestAnimationFrame(quadro); };
      quadro(); return true;
    },
    fim() { para(); document.removeEventListener('visibilitychange', oculta); sons.clear(); if (ctx) ctx.close().catch(() => {}); ctx = null; },
  };
}
