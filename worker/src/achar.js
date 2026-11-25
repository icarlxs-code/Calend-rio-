/* Achar pessoas: ID público (@nome) e os códigos embaralhados de celular e e-mail. */
import { semAcento } from '../../functions/times.js';
const RESERVADO = /^(lembra|sininho|meulembra|admin|suporte|oficial|equipe|ajuda|support|root|sistema|moderador|fundador)/;
export const limpaId = (s) => {
  const x = String(s || '').trim().toLowerCase().replace(/^@/, '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  return /^[a-z][a-z0-9._]{2,19}$/.test(x) && !/[._]{2}|[._]$/.test(x) ? x : '';
};
export async function meuId(env, u, nome) {
  const tem = await env.CAL.get(`idde:${u}`); if (tem) return tem;
  const base = (semAcento(nome).split(' ').find((x) => /^[a-z]{2}/.test(x)) || 'pessoa').replace(/[^a-z]/g, '').slice(0, 12).padEnd(3, 'a'), raiz = RESERVADO.test(base) ? 'pessoa' : base;
  for (let i = 0; i < 12; i++) {
    const casas = 4 + (i >> 2), x = raiz + String(crypto.getRandomValues(new Uint32Array(1))[0] % 10 ** casas).padStart(casas, '0');
    if (await env.CAL.get(`uname:${x}`)) continue;
    await env.CAL.put(`uname:${x}`, u); await env.CAL.put(`idde:${u}`, x); return x;
  }
  return '';
}
export async function trocaId(env, u, novo) {
  const x = limpaId(novo); if (!x) return { error: 'O ID precisa ter de 3 a 20 caracteres: letras, números, ponto ou sublinhado, começando com letra.' };
  const velho = await env.CAL.get(`idde:${u}`); if (velho === x) return { id: x };
  if (RESERVADO.test(x)) return { error: 'Esse ID é reservado. Tente outro.' };
  const dono = await env.CAL.get(`uname:${x}`); if (dono && dono !== u) return { error: 'Esse ID já tem dono. Tente outro.' };
  if (velho && (await env.CAL.get(`uname:${velho}`)) === u) await env.CAL.delete(`uname:${velho}`);
  await env.CAL.put(`uname:${x}`, u); await env.CAL.put(`idde:${u}`, x);
  return { id: x };
}
/* trocou ou tirou o número: o código antigo deixa de apontar para a pessoa */
export async function guardaCodigos(env, u, body, achavel) {
  const velho = (await env.CAL.get(`cod:${u}`, 'json')) || {}, novo = {};
  for (const [campo, pre] of [['phoneHash', 'phash'], ['emailHash', 'mhash']]) {
    const h = /^[a-f0-9]{64}$/.test(body[campo] || '') ? body[campo] : '', v = velho[pre] || '';
    if (v && v !== h && campo in body && (await env.CAL.get(`${pre}:${v}`)) === u) await env.CAL.delete(`${pre}:${v}`);
    novo[pre] = campo in body ? h : v;
    if (!h) continue;
    if (achavel || pre === 'phash') await env.CAL.put(`${pre}:${h}`, u);
    else if ((await env.CAL.get(`${pre}:${h}`)) === u) await env.CAL.delete(`${pre}:${h}`);
  }
  if (JSON.stringify(velho) !== JSON.stringify(novo)) await env.CAL.put(`cod:${u}`, JSON.stringify(novo));
}
export async function esqueceAchado(env, u) {
  const c = (await env.CAL.get(`cod:${u}`, 'json')) || {}, id = await env.CAL.get(`idde:${u}`);
  for (const pre of ['phash', 'mhash']) if (c[pre] && (await env.CAL.get(`${pre}:${c[pre]}`)) === u) await env.CAL.delete(`${pre}:${c[pre]}`);
  if (id && (await env.CAL.get(`uname:${id}`)) === u) await env.CAL.delete(`uname:${id}`);
  await env.CAL.delete(`cod:${u}`); await env.CAL.delete(`idde:${u}`);
}
