/* Animações desenhadas quadro a quadro (assets/mascot/anda/*.webp: 15 quadros lado a lado, 256 px cada):
   andar para a direita/esquerda, girar e a sequência de amor. Tocam por cima do boneco e somem sozinhas. */
const URL0 = (n) => `assets/mascot/anda/${n}.webp`;
export const SPRITES = ['direita', 'esquerda', 'gira', 'amor', 'emojis'];
const calmo = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const aquece = () => SPRITES.forEach((n) => { const i = new Image(); i.src = URL0(n); });
/** toca a animação `nome` dentro de `host` por `ms` (repete enquanto durar se `loop`); devolve uma promessa que acaba junto */
export function toca(host, nome, { ms = 700, loop = false, ciclo = 600 } = {}) {
  if (!host || !SPRITES.includes(nome) || calmo()) return Promise.resolve(false);
  host.querySelector(':scope > .spr')?.remove();
  const s = document.createElement('span'); s.className = 'spr'; s.setAttribute('aria-hidden', 'true');
  s.innerHTML = `<i style="background-image:url(${URL0(nome)});--ms:${loop ? ciclo : ms}ms;--it:${loop ? 'infinite' : 1}"></i>`;
  host.appendChild(s); host.classList.add('is-spr');
  return new Promise((ok) => setTimeout(() => { s.remove(); if (!host.querySelector(':scope > .spr')) host.classList.remove('is-spr'); ok(true); }, ms));
}
