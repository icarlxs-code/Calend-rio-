/* Lembrete para postar um story: 3 vezes por dia (10h, 15h e 20h, horário de Brasília), para cada aparelho cadastrado.
   Textos variam por dia (não repetem em sequência). Os números são os de verdade: 25 XP do story livre (1x por dia) e 5 pontos no ranking. */
import { brNow } from './coach.js';

const VARIANTES = [
  ['📸 Story agora = 25 XP de bônus', 'Ganhe pontos no ranking e chegue mais perto do próximo emblema e brasão. Toque e poste!'],
  ['🏆 Quer subir no ranking?', 'Cada story vale 5 pontos e 25 XP. Poste um agora e acompanhe seu brasão subir.'],
  ['🔥 Seu próximo emblema está perto', 'Um story hoje já te dá 25 XP. Toque e poste antes de dormir.'],
  ['✨ Hoje tem story?', 'Story vale 25 XP e 5 pontos no ranking. Conte seu dia em uma foto!'],
];

/* três janelas por dia (10h, 15h e 20h, horário de Brasília); cada uma dura 5 min */
export const JANELAS = [10, 15, 20];
/** uma rodada por minuto do cron; manda só nas janelas, uma vez por janela */
export async function lembraStory(env, now, send, { max = 500 } = {}) {
  const br = brNow(now);
  if (!JANELAS.includes(br.h) || br.m > 4) return { motivo: 'hora' };
  const chave = `stnud:${br.date}:${br.h}`;
  if (await env.CAL.get(chave)) return { pulou: 'ja' };
  await env.CAL.put(chave, '1', { expirationTtl: 2 * 86400 });
  if (typeof env.CAL.scan !== 'function') return { motivo: 'sem-lista' };
  const [t, c] = VARIANTES[(Number(br.date.replace(/-/g, '')) + br.h) % VARIANTES.length];
  let n = 0;
  for (const [k] of await env.CAL.scan('dev:')) {
    if (n >= max) break;
    await send(env, k.slice(4), { title: t, body: c, tag: 'story-dia', url: './' });
    n++;
  }
  return { avisos: n };
}
