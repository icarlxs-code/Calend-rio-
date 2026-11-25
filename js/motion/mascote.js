/* Lembra Motion · mascote.js
   Mascote vivo: cada valor da pose e uma mola, entao qualquer troca de pose passa do ponto e assenta sozinha.
   Uso:  const m = criarMascote(elemento, { tamanho: 180, pose: 'acena' });  m.pose('festa');  m.falar(1200);  m.parar();  */
import { desenhar, dancar, andar } from './mascote-desenho.js';

export const POSES = {
  feliz: {}, acena: (t) => ({ aR: 48 + Math.sin(t * 13) * 18, tilt: -3 }), joia: { aR: 46, hR: 'joia', eye: 'wink', tilt: 5 },
  aponta: { aR: 38, hR: 'aponta', turn: 0.45 }, apontaEsq: { aL: 38, hL: 'aponta', turn: -0.45 },
  bravo: { angry: 1, cross: 1 }, tedio: { eye: 'tedio', cross: 0.9, boca: 'riso' }, triste: { sad: 1 }, choro: { choro: 1, sad: 1, sit: 1, rosto: 1 },
  susto: { shock: 1, aL: 44, aR: 44, hL: 'aberta', hR: 'aberta' }, amor: (t) => ({ eye: 'love', rosto: 1, tilt: Math.sin(t * 5) * 6 }),
  estrela: (t) => ({ eye: 'star', aL: 50 + Math.sin(t * 9) * 8, aR: 50 - Math.sin(t * 9) * 8 }), sono: { eye: 'sono', mouth: 0.3 },
  escuta: { turn: 0.8, lx: 0.6, aR: 36, shock: 0.4, tilt: -5 }, espia: (t) => ({ lx: Math.sin(t * 5) * 0.8, ly: 0.2, aL: 20, aR: 20 }),
  sentado: { sit: 1 }, pensa: { ly: -0.8, lx: 0.5, aR: 30, rosto: 0, boca: 'riso', tilt: 4 }, festa: dancar, anda: andar,
  voa: (t) => ({ aL: 64, aR: 64, lL: 20, lR: 20, sq: -0.1, y: Math.sin(t * 6) * 30 }),
  chama: (t) => ({ angry: 0.45, aL: 40 + Math.sin(t * 22) * 20, aR: 40 - Math.sin(t * 22) * 20, swing: Math.sin(t * 22) * 16, tilt: Math.sin(t * 22) * 4 }),
};
const NUM = ['aL', 'aR', 'lL', 'lR', 'tilt', 'sq', 'lx', 'ly', 'angry', 'shock', 'sad', 'y', 'swing', 'turn', 'cross', 'rosto', 'choro', 'mouth', 'giro'];
const BASE = { aL: 4, aR: 4, mouth: 0.95 };
let serie = 0;
const vivos = new Set(); let raf = 0;
function laco(agora) { raf = vivos.size ? requestAnimationFrame(laco) : 0; vivos.forEach((m) => m._quadro(agora)); }

export function criarMascote(el, { tamanho = 180, pose = 'feliz', sombra = true, brilho = true, fps = 60 } = {}) {
  const id = 'lm' + (++serie), v = {}, x = {}; NUM.forEach((k) => { x[k] = BASE[k] || 0; v[k] = 0; });
  let alvo = POSES[pose] || pose, t0 = 0, ult = 0, fala = 0, girando = null, ultimoDesenho = 0;
  el.classList.add('lm-mascote'); el.style.width = el.style.height = tamanho + 'px';
  const m = {
    el,
    pose(p) { alvo = POSES[p] || p; return m; },
    falar(ms = 1000) { fala = performance.now() + ms; return m; },
    girar(ms = 620) { girando = [performance.now(), ms]; return m; },
    parar() { vivos.delete(m); return m; },
    _quadro(agora) {
      if (!el.isConnected) { if (t0) vivos.delete(m); return; }
      if (!t0) { t0 = ult = agora; }
      const t = (agora - t0) / 1000, dt = Math.min(0.034, (agora - ult) / 1000); ult = agora;
      const p = { ...BASE, ...(typeof alvo === 'function' ? alvo(t) : alvo) };
      for (const k of NUM) { const a = p[k] || 0; for (let i = 0; i < 2; i++) { v[k] += ((a - x[k]) * 260 - v[k] * 20) * (dt / 2); x[k] += v[k] * (dt / 2); } }
      if (agora - ultimoDesenho < 1000 / fps - 2) return; ultimoDesenho = agora;
      const q = { ...p, glossy: brilho }; for (const k of NUM) if (k !== 'giro') q[k] = k === 'angry' || k === 'shock' || k === 'sad' || k === 'choro' || k === 'cross' || k === 'rosto' ? Math.max(0, Math.min(1, x[k])) : x[k];
      delete q.giro;
      if (girando) { const g = (agora - girando[0]) / girando[1]; if (g >= 1) girando = null; else q.giro = 360 * (g < 0.5 ? 4 * g * g * g : 1 - Math.pow(-2 * g + 2, 3) / 2); }
      if (agora < fala) { q.mouth = 0.15 + 0.9 * Math.abs(Math.sin(t * 17) * Math.sin(t * 7.3 + 1)); delete q.boca; }
      el.innerHTML = desenhar(q, t, tamanho, id, sombra);
    },
  };
  el.innerHTML = desenhar({ ...BASE, ...(typeof alvo === 'function' ? alvo(0) : alvo), glossy: brilho }, 0, tamanho, id, sombra);
  vivos.add(m); if (!raf) raf = requestAnimationFrame(laco);
  return m;
}
/** desenho parado (para lista vazia, e-mail, etc.): devolve o SVG em texto */
export const mascoteParado = (pose = 'feliz', tamanho = 160) => { const p = POSES[pose] || pose; return desenhar({ ...BASE, ...(typeof p === 'function' ? p(0.2) : p), glossy: true }, 0.4, tamanho, 'lmp' + (++serie), true); };
