/* Abertura do Lembra (motion design, fundo branco, ~3,3 s, calculada a cada quadro da tela = 60/120 fps).
   Roteiro (cada elemento com a sua própria curva):
   1) o Sininho (boneco montado com as peças) surge com mola e dá tchauzinho;
   2) vira o ÍCONE: o quadrado laranja cresce atrás dele, o boneco aproxima até virar o rosto do ícone
      (máscara arredondada fechando), e o desenho do ícone se completa por cima;
   3) a marca se forma: o ícone encolhe e desliza para a esquerda, as letras de "Lembra" entram uma a uma
      (sobem, giram e assentam com mola) e a frase aparece embaixo. Tudo compacto, com respiro. */
import { sininho, alive, act, setMood } from './sininho.js';

/* letras da palavra (colunas na imagem palavra-preto.png 720×159) */
const LET = [[1, 103], [105, 215], [228, 398], [414, 530], [541, 612], [612, 719]];
const WW = 720, WH = 159;

/* curvas */
const clamp = (x) => Math.max(0, Math.min(1, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const back = (x, s = 1.6) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
const spring = (x, z = 0.42, f = 2.4) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-z * 10 * x) * Math.cos(f * Math.PI * 2 * x) * (1 - x * 0.0));
const lerp = (a, b, k) => a + (b - a) * k;

export function mountIntro(host) {
  host.innerHTML = `<div class="ab">
    <div class="ab__stage">
      <div class="ab__mark">
        <i class="ab__tile"></i>
        <div class="ab__rig">${sininho('feliz', { size: 132 })}</div>
        <img class="ab__icon" src="media/marca/icone.webp" alt="" draggable="false">
      </div>
      <div class="ab__word">${LET.map(([a, b], i) => `<span class="ab__l" style="--a:${a};--w:${b - a}"></span>`).join('')}</div>
      <p class="ab__tag">Seus compromissos, sempre lembrados</p>
    </div></div>`;
  alive();
  return host.querySelector('.ab');
}

/* roda a coreografia; devolve uma função para parar */
export function runIntro(ab, { onEnd } = {}) {
  const $ = (s) => ab.querySelector(s);
  const mark = $('.ab__mark'), tile = $('.ab__tile'), rig = $('.ab__rig'), icon = $('.ab__icon'), word = $('.ab__word'), tag = $('.ab__tag');
  const ls = [...ab.querySelectorAll('.ab__l')];
  const snh = rig.querySelector('[data-snh]');
  // medidas (px) da marca final: ícone 72 + 14 + palavra 46 de altura
  const T = 122, ICON_F = 72, GAP = 14, WORD_H = 46, WORD_W = (WW / WH) * WORD_H;
  const LOCK_W = ICON_F + GAP + WORD_W;
  const markX = -LOCK_W / 2 + ICON_F / 2, wordX = -LOCK_W / 2 + ICON_F + GAP;
  word.style.width = `${WORD_W}px`; word.style.height = `${WORD_H}px`;
  word.style.transform = `translate(${wordX}px, ${-WORD_H / 2}px)`;
  ls.forEach((l) => { const a = +l.style.getPropertyValue('--a'), w = +l.style.getPropertyValue('--w'); const k = WORD_H / WH;
    l.style.left = `${a * k}px`; l.style.width = `${w * k}px`; l.style.backgroundSize = `${WW * k}px ${WORD_H}px`; l.style.backgroundPosition = `${-a * k}px 0`; });
  const fit = Math.min(1, (innerWidth - 40) / Math.max(LOCK_W, 300));
  ab.style.setProperty('--fit', fit);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const END = calm ? 1.3 : 3.35;
  let t0 = 0, raf = 0, done = false, cues = { pulo: 0, tchau: 0, mood: 0 };

  const frame = () => {
    if (done) return;
    const now = performance.now();
    if (!t0) t0 = now;
    const t = calm ? 3 : (now - t0) / 1000;
    // 1) boneco surge
    const pIn = spring(seg(t, 0, 0.75), 0.5, 1.6);
    if (!cues.pulo && t > 0.02 && !calm) { cues.pulo = 1; act(snh, 'pulo'); }
    if (!cues.tchau && t > 0.55 && !calm) { cues.tchau = 1; act(snh, 'tchau'); }
    // 2) vira ícone (1.55 → 2.2)
    const m = easeInOut(seg(t, 1.55, 2.15));
    const tileK = back(seg(t, 1.5, 2.0), 1.4);
    const zoom = lerp(1, 1.62, m);
    const ry = lerp(0, -4, m);
    const rigS = lerp(0.6, 1, pIn) * zoom;
    // máscara arredondada fechando no quadrado do ícone (em px do rig sem zoom)
    const mc = easeOut(seg(t, 1.5, 1.95)); const half = lerp(110, T / 2 / zoom, mc), rad = lerp(70, 30 / zoom, mc);
    rig.style.transform = `translate(-50%, calc(-50% + ${ry}px)) scale(${rigS})`;
    rig.style.opacity = Math.min(1, pIn * 1.6);
    rig.style.clipPath = mc > 0 ? `inset(calc(50% - ${half}px) calc(50% - ${half}px) round ${rad}px)` : 'none';
    tile.style.transform = `translate(-50%, -50%) scale(${Math.max(0, tileK)})`;
    const iconK = easeOut(seg(t, 2.02, 2.24));
    icon.style.opacity = iconK;
    if (iconK >= 1) rig.style.visibility = 'hidden';
    // 3) a marca se forma (ícone encolhe e desliza; 2.2 → 2.75)
    const lk = spring(seg(t, 2.2, 2.95), 0.55, 1.1);
    const ms = lerp(1, ICON_F / T, lk), mx = lerp(0, markX, lk);
    mark.style.transform = `translate(${mx}px, 0) scale(${ms})`;
    ls.forEach((l, i) => {
      const k = seg(t, 2.36 + i * 0.055, 2.36 + i * 0.055 + 0.5);
      const y = (1 - back(k, 2.2)) * 34, r = (1 - easeOut(k)) * (i % 2 ? -14 : 12);
      l.style.opacity = clamp(k * 3);
      l.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    });
    const tk = easeOut(seg(t, 2.78, 3.15));
    tag.style.opacity = tk; tag.style.transform = `translate(-50%, ${lerp(10, 0, tk)}px)`;
    if (t >= END) { done = true; onEnd && onEnd(); return; }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { done = true; cancelAnimationFrame(raf); };
}
