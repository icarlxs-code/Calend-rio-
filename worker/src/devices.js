/* Aparelhos que recebem os avisos, guardados POR PESSOA (dev:{pessoa}) em vez de numa lista única de todo mundo.
   Assim cada envio lê só os aparelhos daquela pessoa e duas pessoas ativando os avisos ao mesmo tempo
   nunca apagam o cadastro uma da outra.
   - devid:{id}   → de quem é aquele identificador de aparelho (ninguém "sequestra" o id de outra pessoa)
   - devep:{hash} → de quem é aquele endereço de notificação (o mesmo celular não fica em duas contas) */
const devKey = (m) => `dev:${m}`;

export async function epHash(endpoint) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(endpoint)));
  return Array.from(new Uint8Array(d).slice(0, 12), (x) => x.toString(16).padStart(2, '0')).join('');
}

export async function getDevices(env, member) {
  await upgradeSubs(env);
  return (await env.CAL.get(devKey(member), 'json')) || {};
}
export async function saveDevices(env, member, devs) {
  if (Object.keys(devs).length) await env.CAL.put(devKey(member), JSON.stringify(devs));
  else await env.CAL.delete(devKey(member));
}
/* tira aparelhos de uma pessoa (e as marcas de dono do id e do endereço) */
export async function removeDevices(env, member, ids) {
  if (!ids.length) return 0;
  const devs = await getDevices(env, member);
  let n = 0;
  for (const id of ids) {
    const d = devs[id];
    if (!d) continue;
    delete devs[id]; n++;
    if ((await env.CAL.get(`devid:${id}`)) === member) await env.CAL.delete(`devid:${id}`);
    if (d.subscription?.endpoint) {
      const h = await epHash(d.subscription.endpoint);
      const o = await env.CAL.get(`devep:${h}`, 'json');
      if (o && o.member === member && o.id === id) await env.CAL.delete(`devep:${h}`);
    }
  }
  if (n) await saveDevices(env, member, devs);
  return n;
}

/* cadastra (ou atualiza) um aparelho da pessoa, com as mesmas proteções de antes */
export async function addDevice(env, me, { id, subscription, prefs, origin, ua, founder }) {
  await upgradeSubs(env);
  // o identificador do aparelho de outra pessoa não pode ser reaproveitado
  const owner = await env.CAL.get(`devid:${id}`);
  if (owner && owner !== me.id) id = `${me.id}:${id}`.slice(0, 120);
  // o mesmo endereço de notificação não pode ficar registrado em nome de duas pessoas
  const h = await epHash(subscription.endpoint);
  const prev = await env.CAL.get(`devep:${h}`, 'json');
  if (prev && prev.member !== me.id) await removeDevices(env, prev.member, [prev.id]);
  const devs = await getDevices(env, me.id);
  if (prev && prev.member === me.id && prev.id !== id && devs[prev.id]) delete devs[prev.id];
  // mudança de endereço do app: o aparelho igual (mesmo navegador) cadastrado pelo endereço antigo sai
  if (origin && ua) for (const [k, d] of Object.entries(devs)) if (k !== id && d.ua === ua && d.origin && d.origin !== origin) delete devs[k];
  devs[id] = { member: me.id, ...(origin ? { origin } : {}), ...(ua ? { ua } : {}), subscription, prefs, updatedAt: Date.now() };
  await saveDevices(env, me.id, devs);
  await env.CAL.put(`devid:${id}`, me.id);
  await env.CAL.put(`devep:${h}`, JSON.stringify({ member: me.id, id }));
  // a antiga dupla virou conta própria: os aparelhos guardados com o id antigo saem
  if (founder) { const old = await env.CAL.get(devKey(founder), 'json'); if (old) await removeDevices(env, founder, Object.keys(old)); }
  return id;
}

/* Uma vez só: a lista antiga (uma chave "subs" com todo mundo) vira uma lista por pessoa */
const upgraded = new WeakSet();
export async function upgradeSubs(env) {
  if (upgraded.has(env.CAL)) return;
  const raw = await env.CAL.get('subs', 'json');
  if (raw && typeof raw === 'object') {
    const by = {};
    for (const [id, d] of Object.entries(raw)) if (d && d.member && d.subscription?.endpoint) (by[d.member] ||= {})[id] = d;
    for (const [m, devs] of Object.entries(by)) {
      const cur = (await env.CAL.get(devKey(m), 'json')) || {};
      await env.CAL.put(devKey(m), JSON.stringify({ ...devs, ...cur }));
      for (const [id, d] of Object.entries(devs)) {
        await env.CAL.put(`devid:${id}`, m);
        await env.CAL.put(`devep:${await epHash(d.subscription.endpoint)}`, JSON.stringify({ member: m, id }));
      }
    }
    await env.CAL.delete('subs');
  }
  upgraded.add(env.CAL);
}
