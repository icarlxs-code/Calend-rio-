/* Retrospectiva do ano: livro-razão SÓ neste aparelho (localStorage), sem título, sem nome, sem nada enviado.
   Nada daqui vai para o servidor, para o painel ou para a conta. */
const FUSO = 'America/Sao_Paulo';
const dia = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ms));
const hora = (ms) => Number(new Intl.DateTimeFormat('en-GB', { timeZone: FUSO, hour: '2-digit', hourCycle: 'h23' }).format(new Date(ms)));
const mais = (k, n) => new Date(Date.parse(`${k}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
const semana = (k) => new Date(`${k}T12:00:00Z`).getUTCDay();
const resumo = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }; // o id vira um código: não dá para voltar ao item
let dono = '';
export const usaDono = (uid) => { dono = uid ? `.${resumo(uid)}` : ''; };
export const chave = (ano) => `lembra.retro.${ano}${dono}`;
/* { v, x: { código: [dia, 't'|'p', hora|null, noHorario 1|0|null, categoria, aniversarioNoDia 1|0] }, a: { dia: copos }, d: [dias ativos], b: emblemas do ano, rec } */
const vazio = () => ({ v: 1, x: {}, a: {}, d: [], b: 0, rec: 0 });
export function le(ano) { try { const o = JSON.parse(localStorage.getItem(chave(ano)) || 'null'); return o && o.v === 1 ? { ...vazio(), ...o } : vazio(); } catch { return vazio(); } }
function grava(ano, o) { try { localStorage.setItem(chave(ano), JSON.stringify(o)); } catch { /* cheio: fica para depois */ } }
const prazo = (d, t) => (/^\d{4}-\d{2}-\d{2}$/.test(d || '') && /^\d{2}:\d{2}$/.test(t || '') ? Date.parse(`${d}T${t}:00-03:00`) : null);
const linhaEvento = (e, at) => { const p = prazo(e.date, e.time); return [at ? dia(at) : e.date, 't', at ? hora(at) : null, at && p ? (at <= p + (Number(e.duration) || 30) * 6e4 + 15 * 6e4 ? 1 : 0) : null, String(e.type || 'outro').slice(0, 20), 0]; };
const linhaPessoal = (it, ocorre, at) => { const d = at ? dia(at) : ocorre; return [d, 'p', at ? hora(at) : null, at && prazo(ocorre, it.time) ? (at <= prazo(ocorre, it.time) + 60 * 6e4 ? 1 : 0) : null, String(it.cat || 'lembrete').slice(0, 20), it.cat === 'aniversario' && (d === ocorre || d === mais(ocorre, 1)) ? 1 : 0]; };
function poe(id, linha) { const ano = Number(linha[0].slice(0, 4)); if (!(ano >= 2026 && ano < 2200)) return; const o = le(ano); o.x[resumo(id)] = linha; if (!o.d.includes(linha[0])) o.d.push(linha[0]); grava(ano, o); }
function tira(id, ano) { for (const a of [ano, ano - 1]) { const o = le(a), k = resumo(id); if (o.x[k]) { delete o.x[k]; grava(a, o); } } }
/* ---------- ganchos (ao concluir e desmarcar) ---------- */
export function aoEvento(antes, depois, agora = Date.now()) {
  if (!depois) return; const era = antes && antes.status === 'feito', eh = depois.status === 'feito';
  if (eh && !era) poe(`e:${depois.id}`, linhaEvento(depois, agora)); else if (!eh && era) tira(`e:${depois.id}`, Number(dia(agora).slice(0, 4)));
}
export function aoPessoal(antes, depois, agora = Date.now()) {
  if (!depois || (depois.kind && depois.kind !== 'event')) return; const ano = Number(dia(agora).slice(0, 4));
  if (!depois.repeat || depois.repeat === 'none') { if (depois.done && !antes?.done) poe(`p:${depois.id}`, linhaPessoal(depois, depois.date, agora)); else if (!depois.done && antes?.done) tira(`p:${depois.id}`, ano); return; }
  const A = new Set(antes?.doneDates || []), D = new Set(depois.doneDates || []);
  for (const d of D) if (!A.has(d)) poe(`p:${depois.id}:${d}`, linhaPessoal(depois, d, agora));
  if (antes) for (const d of A) if (!D.has(d)) tira(`p:${depois.id}:${d}`, ano);
}
/** só o toque em "Bebi ✓" conta (receber ou abrir o aviso não) */
export function bebi(agora = Date.now()) { const d = dia(agora), ano = Number(d.slice(0, 4)), o = le(ano); o.a[d] = Math.min(20, (o.a[d] || 0) + 1); if (!o.d.includes(d)) o.d.push(d); grava(ano, o); return o.a[d]; }
/* ---------- reconstrução (uma vez): só o que a agenda mostra de verdade ---------- */
export function reconstroi(ano, { eventos = [], pessoal = [], dias = [], emblemas = [], meu = () => true } = {}) {
  const o = le(ano); if (o.rec) return o; const no = (d) => typeof d === 'string' && d.startsWith(`${ano}-`), ativo = new Set(o.d);
  const add = (id, l) => { if (!no(l[0])) return; const k = resumo(id); if (!o.x[k]) o.x[k] = l; ativo.add(l[0]); };
  for (const e of eventos) if (e && e.status === 'feito' && meu(e)) add(`e:${e.id}`, linhaEvento(e, e.doneAt || 0));
  for (const it of pessoal) {
    if (!it || (it.kind && it.kind !== 'event')) continue;
    if (it.done && (!it.repeat || it.repeat === 'none')) add(`p:${it.id}`, linhaPessoal(it, it.date, it.doneAt || 0));
    for (const d of it.doneDates || []) { const l = linhaPessoal(it, d, 0); l[5] = 0; add(`p:${it.id}:${d}`, l); } // sem a hora real não dá para dizer que lembrou no dia
  }
  for (const d of dias) if (no(d)) ativo.add(d);
  o.d = [...ativo].sort(); o.b = emblemas.filter((t) => Number.isFinite(t) && no(dia(t))).length; o.rec = 1; grava(ano, o); return o;
}
/* ---------- contas (puras; sem amostra = null, e a tela some) ---------- */
export function totaisDoAno(ano, o = le(ano)) {
  const L = Object.values(o.x), com = L.filter((l) => l[3] !== null), cat = {}; for (const l of L) cat[l[4]] = (cat[l[4]] || 0) + 1;
  const copos = Object.values(o.a).reduce((a, b) => a + b, 0), fds = L.filter((l) => [0, 6].includes(semana(l[0]))).length;
  return { conclusoes: L.length, trabalho: L.filter((l) => l[1] === 't').length, pessoal: L.filter((l) => l[1] === 'p').length, noHorario: com.length >= 5 ? com.filter((l) => l[3]).length : null, medidos: com.length >= 5 ? com.length : null, aniversarios: L.filter((l) => l[5]).length || null, copos: copos || null, diasAgua: Object.keys(o.a).length || null, diasAtivos: o.d.length, emblemas: o.b || null, fimDeSemana: fds || null, categoria: L.length ? Object.entries(cat).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0] : null, curto: o.d.length < 7 && L.length < 5 };
}
export function maiorOfensiva(ano, o = le(ano)) { const D = [...new Set(o.d)].filter((d) => d.startsWith(`${ano}-`)).sort(); let m = 0, n = 0, ant = ''; for (const d of D) { n = ant && mais(ant, 1) === d ? n + 1 : 1; m = Math.max(m, n); ant = d; } return m >= 2 ? m : null; }
export function horarioFavorito(ano, o = le(ano)) { const H = Array(24).fill(0); let n = 0; for (const l of Object.values(o.x)) if (l[2] !== null) { H[l[2]]++; n++; } return n >= 5 ? H.indexOf(Math.max(...H)) : null; }
export function perfilDoAno(ano, o = le(ano)) {
  const t = totaisDoAno(ano, o), of = maiorOfensiva(ano, o) || 0, h = horarioFavorito(ano, o), L = Object.values(o.x);
  if (t.curto) return 'Primeiro Capítulo';
  if (of >= 100) return 'Diamante da Rotina';
  if (of >= 30) return 'Mestre da Ofensiva';
  if ((t.aniversarios || 0) >= 5) return 'Guardião dos Aniversários';
  if ((t.diasAgua || 0) >= 60) return 'Hidratador Lendário';
  if (t.medidos >= 20 && t.noHorario / t.medidos >= 0.9) return 'Relógio de Ponto';
  if (h !== null && h >= 5 && h < 9) return 'Sininho Madrugador';
  if (h !== null && (h >= 22 || h < 4)) return 'Coruja do Sininho';
  if (L.length >= 20 && t.fimDeSemana / L.length >= 0.4) return 'Fim de Semana em Dia';
  const D = [...o.d].sort(); for (let i = 1; i < D.length; i++) if ((Date.parse(D[i]) - Date.parse(D[i - 1])) / 864e5 >= 30 && D.length - i >= 10) return 'Volta por Cima';
  return 'Sininho Constante';
}
/** para o "Baixar meus dados" */
export function exporta() { const out = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^lembra\.retro\.\d{4}/.test(k || '') && (!dono || k.endsWith(dono))) out[k.replace(dono, '')] = JSON.parse(localStorage.getItem(k)); } } catch { /* ok */ } return out; }
