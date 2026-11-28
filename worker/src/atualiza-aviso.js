/* "Tem versão nova": de 5 em 5 minutos, para quem está com o app desatualizado, até a pessoa abrir e atualizar.
   - a versão publicada vem do próprio site (version.json), conferida a cada 5 min;
   - as versões que cada pessoa informa ao abrir ficam em vers:{pessoa} (até 4 aparelhos/versões);
   - o aviso usa sempre a mesma etiqueta: o novo SUBSTITUI o anterior no celular (não empilha 12 avisos);
   - nunca de madrugada (23h30 às 8h, horário de Brasília). */
import { brNow } from './coach.js';
import { getDevices } from './devices.js';
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
/** guarda as versões que os aparelhos da pessoa informaram (um registro por versão, os 4 mais recentes).
    Assim, se UM aparelho já está na versão nova, a pessoa não recebe mais "atualize" — mesmo que outro aparelho antigo ainda pingue. */
export async function guardaVersao(env, member, app, now = Date.now()) {
  const b = String(app?.b || '').slice(0, 20), v = String(app?.v || '').slice(0, 20), nv = app?.nv === true;
  if (!member || !b || b === 'dev') return;
  const L = (await env.CAL.get(`vers:${member}`, 'json')) || [];
  const era = L.find((x) => x.b === b);
  if (era && era.nv === nv && now - era.at < 3600e3 && L[0] && L[0].b === b) return; // nada mudou: não grava a cada ping
  const nova = [{ v, b, nv, at: now }, ...L.filter((x) => x.b !== b)].slice(0, 4);
  await env.CAL.put(`vers:${member}`, JSON.stringify(nova), { expirationTtl: 30 * 86400 });
}
export const AVISO = { title: '✨ Chegou versão nova do Lembra', body: 'Toque aqui para atualizar. Leva 2 segundos e você não perde nada.', tag: 'atualizar', url: './?atualizar=1' };

/** uma rodada: de 5 em 5 min, só para quem está com versão antiga (até a pessoa atualizar). Novidade não é aviso: quem já está na versão no ar não recebe nada. */
/* desligado: o aviso de "versão nova" só volta quando o dono pedir (ligado: true) */
export async function lembraAtualizar(env, now, send, { max = 200, ligado = false } = {}) {
  if (!ligado) return { motivo: 'desligado' };
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
    if (avisos >= max) break;
    const m2 = k.slice(4), L = (await env.CAL.get(`vers:${m2}`, 'json')) || [];
    // um aparelho da pessoa já na versão no ar basta: os outros não recebem mais aviso
    // (ao abrir o app em qualquer aparelho, ele se atualiza sozinho)
    const devs = await getDevices(env, m2), ids = Object.keys(devs);
    if (L.some((x) => x.b === no.build) || ids.some((id) => devs[id].b === no.build)) { emDia++; continue; }
    await send(env, m2, AVISO);
  }
  return { avisos, emDia, build: no.build };
}
