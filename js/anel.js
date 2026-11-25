/* Anel de stories: um traço por story (laranja = não visto, cinza = já visto) e o número do que falta ver. Puro. */
let seq = 0;
export function conta(r) { const s = (r && r.stories) || [], novos = s.filter((x) => !x.seen).length; return { total: s.length, novos, estado: !s.length ? 'vazio' : novos === s.length ? 'novo' : novos ? 'parcial' : 'visto' }; }
export const numero = (n) => (n > 9 ? '9+' : String(n));
export function rotulo(r, nome, meu) {
  const c = conta(r);
  if (meu) return c.total ? `Seu story, ${c.total} no ar` : 'Novo story';
  return c.novos ? `${c.novos} ${c.novos === 1 ? 'story novo' : 'stories novos'} de ${nome}` : `${c.total === 1 ? 'Story' : 'Stories'} de ${nome}, já ${c.total === 1 ? 'visto' : 'vistos'}`;
}
/** SVG do anel; meu: sempre colorido; vazio: tracejado */
export function anel(r, { meu = false } = {}) {
  const c = conta(r), id = `an${++seq}`, R = 46, C = 2 * Math.PI * R;
  if (!c.total) return '<svg class="anel anel--vazio" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke-width="3.4" stroke-dasharray="9 7.1" stroke-linecap="round"/></svg>';
  const n = Math.min(c.total, 12), vao = n === 1 ? 0 : Math.min(13, (C / n) * 0.34), tr = C / n - vao;
  const tracos = r.stories.slice(0, n).map((s, i) => `<circle class="${meu || !s.seen ? 'is-n' : 'is-v'}" cx="50" cy="50" r="${R}" fill="none" stroke-width="6" stroke-linecap="${n === 1 ? 'butt' : 'round'}" stroke-dasharray="${tr.toFixed(2)} ${(C - tr).toFixed(2)}" stroke-dashoffset="${(-(i * (tr + vao)) - vao / 2).toFixed(2)}" transform="rotate(-90 50 50)"${meu || !s.seen ? ` stroke="url(#${id})"` : ''}/>`).join('');
  return `<svg class="anel" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FFC21A"/><stop offset=".5" stop-color="#FF6B1A"/><stop offset="1" stop-color="#FF2D7A"/></linearGradient></defs>${tracos}</svg>`;
}
export const bolinha = (r) => { const n = conta(r).novos; return n ? `<b class="anel__n" aria-hidden="true">${numero(n)}</b>` : ''; };
/** pulsa uma vez por sessão para quem tem novidade */
export function pulsa(r) { const c = conta(r); if (!c.novos) return ''; try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return ''; const k = `lembra.pulso.${r.uid}.${r.stories.filter((x) => !x.seen).map((x) => x.id).join('_')}`; if (sessionStorage.getItem(k)) return ''; sessionStorage.setItem(k, '1'); return ' is-pulsa'; } catch { return ''; } }
