/* Fila de alterações: tudo que a pessoa muda neste aparelho fica guardado até a nuvem confirmar.
   Fechou o app sem internet? Na próxima abertura com rede, sobe na mesma ordem. Nunca apaga nada por conta própria.
   Puro: recebe onde guardar e como enviar (usado pelo app e pelos testes). */
export const FATAL = /permission-denied|invalid-argument|failed-precondition|unauthenticated/;
export function criaFila({ le, grava, envia, aoMudar = () => {}, aoRecusar = () => {} }) {
  let L = [], seq = 0, pronta = null, rodando = null;
  const salva = () => grava(L).catch(() => {});
  const carrega = () => (pronta ||= le().then((x) => { const antes = Array.isArray(x) ? x : []; L = [...antes, ...L.filter((n) => !antes.some((a) => a.n === n.n))]; seq = Math.max(seq, ...L.map((e) => e.n || 0), 0); aoMudar(L.length); }).catch(() => {}));
  /* junta alterações do mesmo documento que ainda não subiram (menos peso, mesma ordem) */
  async function poe(e) {
    await carrega();
    const u = [...L].reverse().find((x) => x.k === e.k), item = { n: ++seq, at: Date.now(), ...e };
    if (u && !u.indo && !u.erro) { u.por = { ...u.por, ...e.por }; u.tira = [...new Set([...(u.tira || []).filter((k) => !(k in (e.por || {}))), ...(e.tira || [])])]; for (const k of u.tira) delete u.por[k]; u.novo = u.novo || e.novo; await salva(); aoMudar(L.length); return u; }
    L.push(item); await salva(); aoMudar(L.length); return item;
  }
  const tira = async (item) => { L = L.filter((x) => x !== item); await salva(); aoMudar(L.length); };
  /* envia o que falta, um por vez e na ordem; parou por falta de rede, tenta de novo depois */
  function esvazia() {
    return (rodando ||= (async () => {
      await carrega();
      for (const item of [...L]) {
        if (item.indo || item.erro || !L.includes(item)) continue;
        item.indo = 1;
        try { await envia(item); await tira(item); }
        catch (e) { const c = String((e && (e.code || e.message)) || e); delete item.indo; if (/not-found/.test(c) && !item.novo) { await tira(item); continue; } if (FATAL.test(c)) { item.erro = c.slice(0, 60); await salva(); aoRecusar(item, c); continue; } break; }
      }
    })().finally(() => { rodando = null; }));
  }
  /** o que ainda não subiu vale por cima do que o servidor mandou */
  function porCima(k, doc) {
    let d = doc; for (const e of L) if (e.k === k && !e.erro) { d = { ...(d || {}), ...e.por }; for (const t of e.tira || []) delete d[t]; }
    return d;
  }
  return { poe, tira, esvazia, porCima, carrega, pendentes: () => L.filter((e) => !e.erro), todos: () => L, chaves: (pre) => [...new Set(L.filter((e) => !e.erro && e.k.startsWith(pre)).map((e) => e.k))] };
}
