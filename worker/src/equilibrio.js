/* Equilíbrio das notificações: as mensagens "de conversa" (stories, amigos, visitas, dicas, ranking, coach)
   passam por um controle só. Compromissos, mensagens de pessoas, suporte e o aviso de atualização NÃO passam por aqui.
   Regras (horário de Brasília):
   - só entre 8h e 22h;
   - no máximo 6 por dia para cada pessoa;
   - no mínimo 60 min entre duas mensagens desse grupo (uma não cai em cima da outra);
   - a mesma categoria só volta depois de 3 h (story, amigos, visitas… se revezam). */
import { brNow } from './coach.js';

const CATEGORIAS = [
  [/^story/, 'story'], [/^com-|^rp-/, 'story'],
  [/^amigo-|^pedido-/, 'amigos'],
  [/^visitas/, 'visita'],
  [/^coach$/, 'dica'], [/^p-amigo$/, 'dica'],
  [/^ranking$/, 'ranking'],
];
export const DIA_MAX = 6, GAP_GERAL = 60 * 60e3, GAP_CAT = 3 * 3600e3;

/** categoria da mensagem pelo tag; null = não passa pelo controle (compromisso, conversa, suporte, atualização…) */
export function categoriaDe(tag) {
  const t = String(tag || '');
  for (const [re, cat] of CATEGORIAS) if (re.test(t)) return cat;
  return null;
}

/** pode mandar agora? Se pode, já registra o envio. */
export async function cabe(env, member, cat, now = Date.now()) {
  const br = brNow(now);
  if (br.h < 8 || br.h >= 22) return { ok: false, motivo: 'fora-da-janela' };
  const chave = `eq:${member}`;
  let e = (await env.CAL.get(chave, 'json')) || {};
  if (e.d !== br.date) e = { d: br.date, n: 0, t: 0, c: {} };
  if (e.n >= DIA_MAX) return { ok: false, motivo: 'limite-do-dia' };
  if (e.t && now - e.t < GAP_GERAL) return { ok: false, motivo: 'muito-cedo' };
  if (e.c[cat] && now - e.c[cat] < GAP_CAT) return { ok: false, motivo: 'categoria-repetida' };
  e.n += 1; e.t = now; e.c[cat] = now;
  await env.CAL.put(chave, JSON.stringify(e), { expirationTtl: 2 * 86400 });
  return { ok: true };
}
