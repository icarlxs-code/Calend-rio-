/* Notificações vivas: escolhe a frase certa para a pessoa, a hora e o momento, sem IA e sem custo.
   Banco em frases-semente.json. Tudo aqui é puro (mesma entrada, mesma saída) e nunca manda um {campo} cru. */
import SEED from './frases-semente.json' with { type: 'json' };
import { hashStr } from './mind.js';

export const BANCO = SEED;
const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const DIA_NOME = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
/* sorteio com semente (mulberry32) */
export const rng = (s) => () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
/* manhã/tarde/noite contados na janela da pessoa (quem acorda às 14h tem "manhã" às 14h) */
export const turnoDe = (minsDoDia, L) => (minsDoDia < Math.min(270, L * 0.36) ? 'manha' : minsDoDia < L - Math.min(210, L * 0.25) ? 'tarde' : 'noite');
/* só fé cristã ou católica marcada na ficha recebe versículo deste banco */
export const feCrista = (fam, faith) => faith !== false && (fam === 'crista' || fam === 'catolica');

export function tagsDoPerfil(p = {}) {
  const m = p.mind || p.prefs?.mind || {};
  return new Set([...(p.likes || []), ...(p.goals || []), ...(m.traits || []), ...(m.focus || []), p.work?.profession ? 'trabalho' : '', m.anxiety === 'muita' ? 'ansiedade' : '', (p.goals || []).length ? 'meta' : ''].filter(Boolean));
}
const CRU = /[{}]/;
/** null quando falta algum dado: a frase é descartada, nunca sai {x} */
export function preenche(txt, slots = {}) {
  let falta = false;
  const out = String(txt).replace(/\{(\w+)\}/g, (_, k) => { const v = slots[k]; if (v == null || v === '') { falta = true; return ''; } return String(v).replace(/[{}]/g, ''); });
  return falta || CRU.test(out) ? null : out.replace(/\s{2,}/g, ' ').trim();
}
const faseDe = (q) => (!q ? null : q === 'hoje' ? 'hoje' : q === 'amanhã' ? 'amanha' : 'antes');
/* "antes" vale para amanhã e para "em N dias"; "hoje" e "amanhã" só para o próprio dia */
const cabe = (f, fase) => !f || !fase || f === fase || (f === 'antes' && fase === 'amanha');
/* as últimas 30, ou 60% do que está disponível quando o banco é menor */
export const janela = (pool) => Math.min(30, Math.floor(pool * 0.6));

/** agora = { turno, wd, chave } (chave: "2026-11-25T09", sempre no horário do Brasil) */
export function candidatas({ cat, perfil = {}, slots = {}, agora, hist = [], lista = BANCO.categorias[cat] || [] }) {
  const tags = tagsDoPerfil(perfil), fase = faseDe(slots.quando), tom = perfil.prefs?.tone, verso = cat === 'versiculo', ok = [];
  for (const f of lista) {
    if (f.hora !== 'qualquer' && f.hora !== agora.turno) continue;
    if (f.dia && f.dia !== DIAS[agora.wd]) continue;
    if (!cabe(f.quando, fase)) continue;
    if (cat === 'aniversario' && fase && fase !== 'hoje' && !f.quando && !/\{quando\}/.test(f.texto) && /parab[eé]ns/i.test(f.texto)) continue; // "manda o parabéns" só no dia
    const texto = verso ? f.texto : preenche(f.texto, slots); if (!texto || CRU.test(texto)) continue;
    let w = 1, bate = 0;
    for (const t of f.tags || []) if (tags.has(t)) { w += 3; bate++; }
    if (tom && f.tom === tom) w += 1.5;
    if (f.tom === 'trocadilho') w += 0.8;
    if (!verso && (f.tags || []).length && !bate) w *= 0.35; // assunto que não é da pessoa aparece bem menos
    ok.push({ f, texto, w });
  }
  if (!ok.length) return ok;
  const rec = new Set(hist.filter((x) => !x.includes('-g-')).slice(-janela(ok.length)));
  return ok.filter((c) => !rec.has(c.f.id));
}
export function escolhe(o) {
  const L = candidatas(o); if (!L.length) return null;
  const r = rng(hashStr(`${o.perfil?.uid || o.perfil?.name || 'x'}|${o.cat}|${o.agora.chave}|${(o.hist || []).length}|${(o.hist || []).at(-1) || ''}`));
  let x = r() * L.reduce((a, c) => a + c.w, 0), e = L[L.length - 1];
  for (const c of L) if ((x -= c.w) <= 0) { e = c; break; }
  return { id: e.f.id, cat: o.cat, texto: e.texto, tom: e.f.tom, tags: e.f.tags || [], ...(e.f.ref ? { ref: e.f.ref } : {}) };
}
/* abertura × núcleo × fecho; uma parte só volta depois de 5 mensagens */
export function daGramatica(cat, slots, semente, partes = []) {
  const g = BANCO.gramaticas[cat]; if (!g) return null;
  const r = rng(semente), usadas = new Set(partes.slice(-15));
  const extra = Object.fromEntries(Object.entries(g.slots_extra || {}).map(([k, v]) => [k, v[Math.floor(r() * v.length)]])), S = { ...slots, ...extra };
  const pega = (arr, tag) => { // só o que tem todos os dados e não saiu há pouco
    const val = arr.map((x, i) => [x === '' ? '' : preenche(x, S), `${tag}${i}`]).filter(([x]) => x !== null); if (!val.length) return null;
    const livres = val.filter(([, id]) => !usadas.has(id)); if (!livres.length) return null;
    return livres[Math.floor(r() * livres.length)];
  };
  const a = pega(g.abertura, 'a'), n = pega(g.nucleo, 'n'), f = pega(g.fecho, 'f'); if (!a || !n || !f) return null;
  const meio = /[?!.…]$/.test(n[0]) ? n[0] : `${n[0]}.`;
  const texto = `${a[0]} ${meio} ${f[0]}`.replace(/([!?.]) (\p{Ll})/gu, (m, p, l) => `${p} ${l.toUpperCase()}`).replace(/\s{2,}/g, ' ').trim();
  return CRU.test(texto) ? null : { id: `${cat}-g-${a[1]}${n[1]}${f[1]}`, cat, texto, tom: 'leve', tags: [], partes: [a[1], n[1], f[1]] };
}
/** a próxima frase da categoria, já contando o histórico. vh = { [cat]: [ids], _p: { [cat]: [partes] }, _n: { [cat]: n } } */
export function proxima({ cat, perfil, slots, agora, vh = {} }) {
  const hist = vh[cat] || [], n = vh._n?.[cat] || 0;
  let m = null;
  if (BANCO.gramaticas[cat] && n % 4 === 3) m = daGramatica(cat, slots, hashStr(`${perfil.uid || perfil.name}|${cat}|g|${n}`), vh._p?.[cat] || []);
  if (m && hist.includes(m.id)) m = null;
  m = m || escolhe({ cat, perfil, slots, agora, hist });
  if (!m) return null;
  const novo = { ...vh, [cat]: [...hist, m.id].slice(-40), _n: { ...(vh._n || {}), [cat]: n + 1 } };
  if (m.partes) novo._p = { ...(vh._p || {}), [cat]: [...(vh._p?.[cat] || []), ...m.partes].slice(-15) };
  const fase = faseDe(slots.quando), L = (BANCO.titulos[cat] || []).filter((x) => cat !== 'aniversario' || (fase === 'hoje' ? !/chegando/i.test(x) : !/\bhoje\b/i.test(x))), r = hashStr(`${m.id}|${agora.chave}|t`);
  let titulo = ''; for (let i = 0; i < L.length && !titulo; i++) titulo = preenche(L[(r + i) % L.length], slots) || '';
  return { ...m, titulo, vh: novo };
}
/** introdução do versículo (o versículo em si nunca muda) */
export function introducao(perfil, slots, agora) {
  const I = BANCO.introducoes_versiculo, k = tagsDoPerfil(perfil).has('ansiedade') && hashStr(`${perfil.uid}|${agora.chave}|i`) % 2 ? 'ansiedade' : agora.turno, L = I[k] || I.tarde;
  for (let i = 0, r = hashStr(`${perfil.uid}|${agora.chave}|in`); i < L.length; i++) { const x = preenche(L[(r + i) % L.length], slots); if (x) return x; }
  return '';
}

/* ---------- dados da agenda que viram slots ---------- */
const hm = (t) => (t ? t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h') : '');
export function slotsDe(p, br) {
  const T = p.today || [], ab = T.filter((x) => !x.done), feitos = T.length - ab.length, agoraM = br.h * 60 + br.m, min = (t) => +t.slice(0, 2) * 60 + +t.slice(3, 5);
  const px = ab.filter((x) => x.time && min(x.time) > agoraM).sort((a, b) => (a.time < b.time ? -1 : 1))[0], am = [...(p.tomorrow || [])].sort((a, b) => ((a.time || '99') < (b.time || '99') ? -1 : 1))[0];
  return { nome: p.name || '', profissao: p.work?.profession || '', meta: p.work?.goal || '', diasemana: DIA_NOME[br.wd], qtd_hoje: ab.length ? `${ab.length} ${ab.length > 1 ? 'coisas' : 'coisa'}` : '', feitos: feitos ? `${feitos} ${feitos > 1 ? 'tarefas' : 'tarefa'}` : '', primeiro_amanha: am?.title || '', proximo: px?.title || '', hora: px ? hm(px.time) : '' };
}
const NAO_REMEDIO = /dentist|m[eé]dic[oa]|consult|exame|academia|treino|\bpsic|\bpsiq|\bneuro|terap|vacina|hospital|cl[ií]nica|fisio|nutri|cardio|derma|gineco|pediatr|ortop|oftalm|caminh|corrid|pilates|yoga|check-?up|retorno|cirurg|raio|ultrass|doa[cç]/i;
const ESTUDO = /\bestud|\bprova\b|\baula\b|\bcurso\b|\bler\b|\bleitura|\benem\b|\btcc\b|faculdade|vestibular|\brevis(ar|ão|ao)\b|li[cç][aã]o|dever de casa|\bmatem[aá]tica|\bingl[eê]s\b/i;
/* tira o verbo do título para ele encaixar na frase: "Tomar Losartana" → "Losartana" */
const semVerbo = (t, re) => { const x = String(t || '').replace(re, '').trim(); return x ? x : String(t || '').trim(); };
export const nomeRemedio = (t) => semVerbo(t, /^(tomar|hora d[aeo]|lembrar d[aeo]|rem[eé]dio:?)\s+(o |a |os |as )?/i);
export const nomeMateria = (t) => semVerbo(t, /^(estudar|aula de|prova de|curso de|revisar|revis[aã]o de|ler)\s+(o |a |os |as )?/i);
export const nomeConta = (t) => { const x = semVerbo(t, /^(pagar|pagamento d[aeo]|quitar)\s+/i); return /^(a|o|as|os)\s/i.test(x) ? x : /^(conta|fatura|mensalidade|parcela|internet)\b/i.test(x) ? `a ${x.charAt(0).toLowerCase()}${x.slice(1)}` : /^(boleto|aluguel|iptu|ipva|condom)/i.test(x) ? `o ${x.charAt(0).toLowerCase()}${x.slice(1)}` : x; };
const abre = (t) => t.charAt(0).toUpperCase() + t.slice(1);
/** pedidos de frase vindos da agenda: [{ cat, key, slots, every? }] */
export function daAgenda(p, br) {
  const out = [], base = slotsDe(p, br), agoraM = br.h * 60 + br.m;
  for (const b of (p.birthdays || []).filter((x) => x.inDays >= 0 && x.inDays <= 5 && x.name)) out.push({ cat: 'aniversario', key: `bd-${b.name}-${b.inDays === 0 ? 'hoje' : 'antes'}`, every: b.inDays ? 2 : 9, slots: { ...base, pessoa: b.name, quando: b.inDays === 0 ? 'hoje' : b.inDays === 1 ? 'amanhã' : `em ${b.inDays} dias` } });
  for (const x of p.today || []) {
    if (x.done || !x.title) continue;
    const d = x.time ? +x.time.slice(0, 2) * 60 + +x.time.slice(3, 5) - agoraM : null;
    // "hora do remédio" só na hora: do horário marcado até 25 min depois
    if (x.cat === 'saude' && !NAO_REMEDIO.test(x.title)) { if (d !== null && d <= 0 && d >= -25) out.push({ cat: 'remedio', key: `rm-${x.title}-${x.time}`, slots: { ...base, remedio: nomeRemedio(x.title), hora: hm(x.time) } }); }
    else if (x.cat === 'pagar') out.push({ cat: 'contas', key: `ct-${x.title}`, slots: { ...base, conta: nomeConta(x.title), quando: 'hoje' } });
    else if (ESTUDO.test(x.title) && (d === null || (d >= -60 && d <= 90))) out.push({ cat: 'estudo', key: `es-${x.title}`, slots: { ...base, materia: nomeMateria(x.title) } });
  }
  for (const x of p.tomorrow || []) if (x.cat === 'pagar' && !x.done && x.title) out.push({ cat: 'contas', key: `ct-${x.title}`, slots: { ...base, conta: nomeConta(x.title), quando: 'amanhã' } });
  if (p.work?.profession && br.wd >= 1 && br.wd <= 5 && br.h >= 8 && br.h < 18) out.push({ cat: 'trabalho', key: 'trab', slots: base });
  return out;
}
/** frase começa com letra maiúscula mesmo quando o slot abre a frase */
export const inicia = (t) => (/^\p{Ll}/u.test(t) ? abre(t) : t);
