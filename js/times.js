/* Time do coração: só o nome do clube (informação) e as cores. NUNCA escudo, logo, hino, mascote ou desenho de uniforme.
   O bóton é um desenho nosso, liso, com a sigla. O time fica só na conta da pessoa: não vai para IA, anúncio nem perfil público. */
import { esc } from './utils.js';
import { porTime } from '../functions/times.js';
export { TIMES, porTime, achaTimes } from '../functions/times.js';
export const AVISO_TIME = 'O Lembra não é afiliado, oficial ou patrocinado por nenhum clube, federação ou confederação.';
const claro = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.62; };
/** bóton próprio: um círculo liso de duas cores com a sigla */
export function boton(t, s = 44) {
  const x = typeof t === 'string' ? porTime(t) : t; if (!x) return '';
  return `<svg class="boton" width="${s}" height="${s}" viewBox="0 0 48 48" role="img" aria-label="${esc(x.nome)}"><circle cx="24" cy="24" r="22.5" fill="${x.cores[1]}" stroke="#80766a" stroke-opacity=".55"/><circle cx="24" cy="24" r="18" fill="${x.cores[0]}"/><text x="24" y="28.4" text-anchor="middle" font-family="Nunito,system-ui,sans-serif" font-weight="900" font-size="12.5" fill="${claro(x.cores[0]) ? '#1B1410' : '#fff'}">${esc(x.sigla)}</text></svg>`;
}
