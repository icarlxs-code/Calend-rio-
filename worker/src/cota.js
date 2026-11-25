/* IA grátis (10 mil "neurônios" por dia UTC): cada função tem o próprio saldo, e cada pessoa um limite no assistente. */
const RATE = { big: [0.0267, 0.205], small: [0.0041, 0.035] };
export const COTAS = { ask: 6000, amigo: 2000, lotes: 1500 };
export const PESSOA = 600;
export const MSG_PESSOA = 'Você usou a IA bastante hoje; volta às 21h 😉';
export const custo = (model, input, saida) => { const [ri, ro] = /70b|3\.3/.test(model) ? RATE.big : RATE.small; return (JSON.stringify(input?.messages || input || '').length / 3.5) * ri + (String(saida || '').length / 3.5) * ro; };
const diaUtc = (now) => new Date(now).toISOString().slice(0, 10);
export function iaComCota(ai, kv, padrao = 'ask', { cotas = COTAS, pessoaMax = PESSOA, agora = Date.now } = {}) {
  if (!ai) return ai;
  const le = async (k) => (await kv.get(k, 'json')) || {};
  const para = (fn, pessoa = '') => ({
    async run(model, input, opts) {
      const k = `ia:${diaUtc(agora())}`, u = await le(k), f = u.f || {}, p = u.p || {};
      if (pessoa && (p[pessoa] || 0) >= pessoaMax) throw Object.assign(new Error(MSG_PESSOA), { status: 429 });
      if ((f[fn] || 0) >= (cotas[fn] ?? cotas.amigo)) throw new Error('limite diário da IA grátis atingido');
      const r = await ai.run(model, input, opts), c = custo(model, input, r?.response), n = await le(k);
      n.f = { ...(n.f || {}), [fn]: Math.round((n.f?.[fn] || 0) + c) };
      if (pessoa) n.p = { ...(n.p || {}), [pessoa]: Math.round((n.p?.[pessoa] || 0) + c) };
      await kv.put(k, JSON.stringify(n), { expirationTtl: 3 * 86400 });
      return r;
    },
  });
  return { run: para(padrao).run, para };
}
/** no máximo n por hora, guardado no banco (não zera quando o servidor dorme) */
export async function porHora(kv, quem, n = 30, now = Date.now()) {
  const k = `askh:${quem}:${Math.floor(now / 36e5)}`, v = Number(await kv.get(k)) || 0;
  if (v >= n) return false;
  await kv.put(k, String(v + 1), { expirationTtl: 7200 }); return true;
}
export async function usoIA(kv, now = Date.now()) { const u = (await kv.get(`ia:${diaUtc(now)}`, 'json')) || {}; return { total: Object.values(u.f || {}).reduce((a, b) => a + b, 0), porFuncao: u.f || {}, top: Object.entries(u.p || {}).sort((a, b) => b[1] - a[1]).slice(0, 5) }; }
