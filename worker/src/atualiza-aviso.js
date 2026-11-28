/* "Tem versão nova": de 5 em 5 minutos, para quem está com o app desatualizado, até a pessoa abrir e atualizar.
   - a versão publicada vem do próprio site (version.json), conferida a cada 5 min;
   - a versão de cada pessoa é a que o app informa ao abrir (ver:{pessoa});
   - o aviso usa sempre a mesma etiqueta: o novo SUBSTITUI o anterior no celular (não empilha 12 avisos);
   - nunca de madrugada (23h30 às 8h, horário de Brasília). */
import { brNow } from './coach.js';
const BLOCO = 5 * 60e3;

/** a versão no ar agora (guardada por 5 min) */
export async function versaoPublicada(env, now = Date.now()) {
  const g = await env.CAL.get('upd:site', 'json');
  if (g && g.at > now - BLOCO && g.build) return g;
  const site = String(env.SITE_URL || 'https://meulembra.com.br/').replace(/\/?$/, '/');
  try {
    const r = await fetch(`${site}version.json?t=${now}`, { headers: { accept: 'application/json' } });
    const j = r.ok ? await r.json() : null;
    if (j && j.build && /^\d+\.\d+\.\d+$/.test(j.version || '')) { const v = { at: now, version: j.version, build: String(j.build) }; await env.CAL.put('upd:site', JSON.stringify(v), { expirationTtl: 86400 }); return v; }
  } catch { /* sem site agora: usa o último */ }
  return g && g.build ? g : null;
}
/** guarda a versão que o aparelho da pessoa informou (só grava quando muda) */
export async function guardaVersao(env, member, app, now = Date.now()) {
  const b = String(app?.b || '').slice(0, 20), v = String(app?.v || '').slice(0, 20), nv = app?.nv === true;
  if (!member || !b || b === 'dev') return;
  const era = await env.CAL.get(`ver:${member}`, 'json');
  if (!era || era.b !== b || !!era.nv !== nv) await env.CAL.put(`ver:${member}`, JSON.stringify({ v, b, nv, at: now }), { expirationTtl: 120 * 86400 });
  // quem já viu as novidades desta versão fica registrado à parte: um celular antigo que ainda pinga não reabre o aviso
  if (nv) await env.CAL.put(`verok:${member}`, JSON.stringify({ b, at: now }), { expirationTtl: 30 * 86400 });
}
export const AVISO = { title: '✨ Chegou versão nova do Lembra', body: 'Toque aqui para atualizar. Leva 2 segundos e você não perde nada.', tag: 'atualizar', url: './?atualizar=1' };
/* já está na versão nova, mas ainda não viu as novidades até o final */
export const AVISO_NOVIDADES = { title: '🎁 Tem novidade te esperando no Lembra', body: 'Abra e confira tudo o que chegou, até o final. Preparei com carinho!', tag: 'atualizar', url: './' };

/** uma rodada: de 5 em 5 min, avisa quem tem aparelho cadastrado e não está na versão no ar (até 23h30 e a partir das 8h; para só depois de ver as novidades até o final) */
export async function lembraAtualizar(env, now, send, { max = 200 } = {}) {
  const bloco = String(Math.floor(now / BLOCO));
  if ((await env.CAL.get('upd:bloco')) === bloco) return { pulou: 'cedo' };
  await env.CAL.put('upd:bloco', bloco, { expirationTtl: 3600 });
  const { h, m } = brNow(now), min = h * 60 + m;
  // silêncio da noite: das 23h30 às 8h (horário de Brasília)
  if (min < 8 * 60 || min >= 23 * 60 + 30) return { motivo: 'noite' };
  const no = await versaoPublicada(env, now);
  if (!no) return { motivo: 'sem-versao' };
  if (typeof env.CAL.scan !== 'function') return { motivo: 'sem-lista' };
  let avisos = 0, emDia = 0;
  for (const [k] of await env.CAL.scan('dev:')) {
    const m = k.slice(4), v = await env.CAL.get(`ver:${m}`, 'json'), ok = await env.CAL.get(`verok:${m}`, 'json');
    if ((v && v.b === no.build && v.nv) || (ok && ok.b === no.build)) { emDia++; continue; } // já está na última e viu as novidades até o final: para de avisar
    if (avisos >= max) break;
    await send(env, m, v && v.b === no.build ? AVISO_NOVIDADES : AVISO);
    avisos++;
  }
  return { avisos, emDia, build: no.build };
}
