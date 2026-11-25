/* Cenário da marca: céu, morros e arvorezinhas em forma de sino, na hora do dia em que a pessoa está.
   É decoração (aria-hidden) e só se mexe com transform/opacity. */
import { ceu, estilo } from './hora.js';
export const momento = (h) => { const k = ceu(h); return k.escuro ? 'noite' : k.h < 11 ? 'manha' : k.h < 17 ? 'tarde' : 'por'; };
const arvore = (x, y, e, c) => `<g transform="translate(${x} ${y}) scale(${e})"><rect x="-3" y="-4" width="6" height="16" rx="3" fill="var(--tronco)"/><path d="M0-52c12 0 17 9 19 22 1 9 4 13 8 18 3 4 0 9-5 9h-44c-5 0-8-5-5-9 4-5 7-9 8-18 2-13 7-22 19-22Z" fill="${c}"/><circle cy="-55" r="4.5" fill="none" stroke="${c}" stroke-width="3.5"/></g>`;
export function cena(tempo = momento()) {
  return `<div class="cena cena--${tempo}" data-hora style="${estilo()}" aria-hidden="true"><i class="cena__estrelas"></i><i class="cena__astro${ceu().sol ? '' : ' cena__astro--lua'}"></i><i class="cena__nuvem"></i><i class="cena__nuvem cena__nuvem--b"></i>
  <svg class="cena__m cena__m--longe" viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 72C60 34 110 40 160 62s96 26 150-4 70-18 90-8v70H0Z" fill="var(--m3)"/></svg>
  <svg class="cena__m cena__m--meio" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice"><path d="M-40 92C40 58 110 74 190 88s150-6 250-30v62H-40Z" fill="var(--m2)"/>${arvore(176, 92, 0.46, 'var(--folha)')}${arvore(206, 93, 0.34, 'var(--folha2)')}${arvore(366, 78, 0.5, 'var(--folha)')}</svg>
  <svg class="cena__m cena__m--perto" viewBox="0 0 400 60" preserveAspectRatio="none"><path d="M0 34C70 12 150 22 220 30s120 4 180-12v42H0Z" fill="var(--m1)"/></svg><i class="cena__veu"></i></div>`;
}
/* boneco 3D em imagens: troca de pose com um pulinho */
const url = (p) => `assets/mascot/3d/${p}.webp`;
export const boneco3d = (pose = 'acena', tam = 180, cls = '') => `<span class="c3d ${cls}" style="--s:${tam}px" data-c3d="${pose}"><i class="c3d__sombra"></i><img src="${url(pose)}" width="${tam}" height="${tam}" alt="" decoding="async" draggable="false"></span>`;
export function pose3d(el, pose) {
  if (!el || el.dataset.c3d === pose) return;
  el.dataset.c3d = pose;
  const img = el.querySelector('img'), nova = new Image();
  nova.src = url(pose);
  (nova.decode ? nova.decode() : Promise.resolve()).then(() => {
    if (el.dataset.c3d !== pose) return;
    img.src = nova.src;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    img.animate([{ transform: 'translateY(0) scale(1.05, .93)' }, { transform: 'translateY(-14px) scale(.97, 1.04)', offset: 0.35 }, { transform: 'translateY(0) scale(1.03, .97)', offset: 0.7 }, { transform: 'none' }], { duration: 460, easing: 'cubic-bezier(.3,.6,.3,1)' });
  }).catch(() => {});
}
export const aquece3d = (L) => L.forEach((p) => { const i = new Image(); i.src = url(p); });
