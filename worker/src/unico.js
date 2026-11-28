/* Um telefone e um CPF só podem estar em UMA conta. O servidor guarda só o número embaralhado
   (com o segredo do servidor), nunca o número em si. E-mail repetido o próprio login já recusa. */
const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const sha = async (t) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)));
/** telefone do Brasil só com números, sem o 55 e sem o 0 do DDD: "(21) 99999-8888" → "21999998888" */
export function telLimpo(t) {
  let d = String(t || '').replace(/\D/g, '');
  if (d.length >= 12 && d.startsWith('55')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  return d.length >= 10 && d.length <= 11 ? d : '';
}
export function cpfValido(c) {
  const d = String(c || '').replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const dv = (n) => { let s = 0; for (let i = 0; i < n; i++) s += +d[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
  return dv(9) === +d[9] && dv(10) === +d[10];
}
const chave = async (env, tipo, valor) => `uniq-${tipo}:${await sha(`${tipo}:${env.CPF_SALT || 'lembra'}:${valor}`)}`;

/** confere (e, com reservar, guarda) telefone e CPF desta conta; { ok, ocupado: ['telefone'|'cpf'] } */
export async function confereUnico(env, uid, { telefone, cpf, reservar = false } = {}) {
  const ocupado = [], meu = (await env.CAL.get(`uniq-meu:${uid}`, 'json')) || {};
  const pedidos = [];
  const tel = telLimpo(telefone); if (telefone && tel) pedidos.push(['tel', tel, 'telefone']);
  const doc = String(cpf || '').replace(/\D/g, ''); if (cpf && cpfValido(doc)) pedidos.push(['cpf', doc, 'cpf']);
  const chaves = {};
  for (const [tipo, valor, nome] of pedidos) {
    const k = await chave(env, tipo, valor); chaves[tipo] = k;
    const dono = await env.CAL.get(k);
    if (dono && dono !== uid) ocupado.push(nome);
  }
  if (ocupado.length || !reservar) return { ok: !ocupado.length, ocupado };
  for (const [tipo] of pedidos) {
    const k = chaves[tipo];
    if (meu[tipo] && meu[tipo] !== k) await env.CAL.delete(meu[tipo]); // trocou o número: libera o antigo
    await env.CAL.put(k, uid); meu[tipo] = k;
  }
  await env.CAL.put(`uniq-meu:${uid}`, JSON.stringify(meu));
  return { ok: true, ocupado: [] };
}
/** conta excluída: libera o telefone e o CPF para quem for usar depois */
export async function liberaUnico(env, uid) {
  const meu = (await env.CAL.get(`uniq-meu:${uid}`, 'json')) || {};
  await Promise.all(Object.values(meu).map((k) => env.CAL.delete(k)));
  await env.CAL.delete(`uniq-meu:${uid}`);
}
