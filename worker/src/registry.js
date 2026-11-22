/* Registro de quem usa o app (nome, agenda e até quando tem plano): UMA LINHA POR PESSOA (reg:{id}).
   Antes era uma lista única com todo mundo, que ficaria grande demais com muitos usuários. */
const K = (id) => `reg:${id}`;
export const idOfWs = (ws) => 'u' + String(ws || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 24);

const done = new WeakSet();
/* uma vez só: a lista antiga ("users") vira uma linha por pessoa */
export async function regUpgrade(env) {
  if (done.has(env.CAL)) return;
  const old = await env.CAL.get('users', 'json');
  if (old && typeof old === 'object') {
    for (const [id, u] of Object.entries(old)) if (u && !(await env.CAL.get(K(id)))) await env.CAL.put(K(id), JSON.stringify(u));
    await env.CAL.delete('users');
  }
  done.add(env.CAL);
}
export async function regGet(env, id) { await regUpgrade(env); return (await env.CAL.get(K(id), 'json')) || null; }
export async function regPut(env, id, u) { await regUpgrade(env); await env.CAL.put(K(id), JSON.stringify(u)); }
export async function regDel(env, id) { await regUpgrade(env); await env.CAL.delete(K(id)); }
/* todo mundo (só o painel do dono e tarefas raras usam) */
export async function regAll(env) {
  await regUpgrade(env);
  const rows = env.CAL.scan ? await env.CAL.scan('reg:') : [];
  const out = {};
  for (const [k, v] of rows) { try { out[k.slice(4)] = JSON.parse(v); } catch { /* linha estragada: ignora */ } }
  return out;
}
