/* Regra da casa: nada some sem a pessoa pedir. Apagar = marca "deletedAt" (o conteúdo continua inteiro) por 24 horas.
   Puro, sem tela e sem banco: usado pelo app e pelos testes. */
export const PRAZO = 24 * 36e5;
/* campos da lixeira: nunca mudam numa edição comum (só apagar/restaurar mexe neles) */
export const CAMPOS = ['deletedAt', 'deletedBy', 'deletedVia', 'deleteBatch', 'purgeAt', 'restoredAt'];
export const VIAS = ['manual', 'assistente', 'lote', 'empresa', 'tudo', 'conta'];
export const apagado = (x) => !!(x && x.deletedAt);
export const vivo = (x) => !!x && !x.deletedAt && !x._del;
export const vencido = (x, agora = Date.now()) => apagado(x) && Number(x.purgeAt) <= agora;
export const novoLote = () => `l_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
export function marca({ por = '', via = 'manual', lote = novoLote(), agora = Date.now() } = {}) {
  return { deletedAt: agora, deletedBy: por, deletedVia: VIAS.includes(via) ? via : 'manual', deleteBatch: lote, purgeAt: agora + PRAZO };
}
export const desmarca = (agora = Date.now()) => ({ deletedAt: null, deletedBy: null, deletedVia: null, deleteBatch: null, purgeAt: null, restoredAt: agora });
/** o item como era (sem as marcas da lixeira) */
export function conteudo(x) { const o = { ...x }; for (const k of CAMPOS) delete o[k]; delete o._u; return o; }
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/** só os campos que mudaram: uma edição antiga (sem internet) não leva embora o que outro aparelho escreveu.
    Campo ausente não é apagado; campo presente com undefined vai em "tira". Nunca inclui as marcas da lixeira. */
export function mudancas(base, item) {
  const por = {}, tira = [];
  for (const k of Object.keys(item)) {
    if (CAMPOS.includes(k) || k === '_u' || k === '_del') continue;
    if (item[k] === undefined) { if (base && base[k] !== undefined) tira.push(k); continue; }
    if (!base || !igual(base[k], item[k])) por[k] = item[k];
  }
  return { por, tira };
}
/** separa o que aparece na agenda do que está na lixeira */
export function separa(lista) { const ok = [], lixo = []; for (const x of lista) (apagado(x) ? lixo : ok).push(x); return { ok, lixo }; }
export const faltaTxt = (x, agora = Date.now()) => { const m = Math.max(0, Math.round((x.purgeAt - agora) / 6e4)); return m < 60 ? `some em ${m} min` : `some em ${Math.floor(m / 60)} h`; };
