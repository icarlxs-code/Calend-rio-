/* O assistente agindo de verdade: transforma as ações que a IA devolve
   ("criar", "mover", "concluir", "excluir", "editar", "pessoal", "bilhete")
   em mudanças na agenda — sempre mostrando um resumo para a pessoa confirmar. */
import { store } from './store.js';
import { numeroBR, reaisTxt } from './frase-conta.js';
import { TYPES, TYPE_ORDER, isMarketing, ent } from './constants.js';
import { uid, todayKey, addDays, fromKey, toMin, fromMin, fmtTime, dayLabel, fmtDayShort } from './utils.js';
import { tidyTitle } from './tidy.js';
import { savePersonal, removePersonal, personal, CATS, guessCat, addMemo } from './personal.js';

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || '');
const isTime = (t) => /^\d{1,2}:\d{2}$/.test(t || '');
const T = (t) => (isTime(t) ? t.padStart(5, '0') : null);

const TYPE_WORDS = {
  feed: ['feed', 'post', 'postagem', 'publicacao'], carrossel: ['carrossel', 'carousel'], reels: ['reels', 'reel', 'video'],
  story: ['story', 'stories', 'storie'], captacao: ['captacao', 'gravacao', 'gravar', 'filmagem', 'foto', 'fotos', 'captar'],
  reuniao: ['reuniao', 'call', 'encontro', 'conversa'], producao: ['producao', 'edicao', 'editar', 'roteiro', 'criacao'], outro: ['outro', 'tarefa'],
};
/* Tipo do compromisso: primeiro os da profissão da pessoa, depois qualquer um do catálogo */
const wordsOf = (k) => [...(TYPE_WORDS[k] || []), ...(TYPES[k]?.words || []), norm(TYPES[k]?.label)].filter(Boolean);
export function resolveType(t, title = '') {
  if (TYPES[t]) return t;
  const s = ' ' + norm(t + ' ' + title) + ' ';
  const hit = (k) => wordsOf(k).some((w) => s.includes(' ' + norm(w)));
  const mine = TYPE_ORDER.filter((k) => k !== 'outro');
  return mine.find(hit) || (norm(t) && Object.keys(TYPES).find((k) => k !== 'outro' && hit(k))) || (TYPE_ORDER.includes('outro') ? 'outro' : TYPE_ORDER[TYPE_ORDER.length - 1] || 'outro');
}
export function resolveCompany(name) {
  const n = norm(name);
  if (!n) return null;
  const cos = store.state.companies;
  return cos.find((c) => norm(c.name) === n)
    || cos.find((c) => norm(c.name).includes(n) || n.includes(norm(c.name)))
    || cos.find((c) => c.instagram && norm(c.instagram) === n.replace(/ /g, ''))
    || cos.find((c) => n.split(' ').filter((w) => w.length > 2).every((w) => norm(c.name).includes(w)))
    || null;
}
function resolvePeople(list) {
  const arr = Array.isArray(list) ? list : list ? [list] : [];
  const out = new Set();
  for (const p of arr) {
    const n = norm(p);
    if (['eu', 'mim', 'me', 'meu', 'minha'].includes(n)) out.add(store.me);
    else if (['ambos', 'todos', 'os dois', 'dupla', 'nos'].includes(n)) store.team.forEach((m) => out.add(m.id));
    else { const m = store.team.find((x) => norm(x.name) === n || x.id === n); if (m) out.add(m.id); }
  }
  if (!out.size && store.me) out.add(store.me);
  return [...out].filter(Boolean);
}
/* Datas: uma só, uma lista, ou de/até com dias da semana (0 = domingo … 6 = sábado) */
export function expandDates(a) {
  if (Array.isArray(a.datas)) return a.datas.filter(isDate);
  const d = a.datas && typeof a.datas === 'object' ? a.datas : null;
  if (d && isDate(d.de)) {
    const until = isDate(d.ate) ? d.ate : d.de;
    const days = Array.isArray(d.dias_semana) && d.dias_semana.length ? d.dias_semana.map(Number) : null;
    const out = [];
    for (let k = d.de; k <= until && out.length < 120; k = addDays(k, 1)) if (!days || days.includes(fromKey(k).getDay())) out.push(k);
    return out;
  }
  return isDate(a.data) ? [a.data] : [];
}
const overlaps = (date, time, dur, people, ignore = new Set()) => {
  if (!time) return [];
  const s = toMin(time), e = s + dur;
  return store.state.events.filter((x) => x.date === date && !ignore.has(x.id) && x.time && (x.assignees || []).some((p) => people.includes(p)))
    .filter((x) => { const xs = toMin(x.time), xe = xs + (x.duration || TYPES[x.type]?.dur || 30); return xs < e && s < xe; });
};

/* Valida e descreve cada ação. Retorna { ok, text, warn, run } */
export function planAction(a) {
  const kind = norm(a?.acao);
  const ev = a?.id ? store.event(a.id) : null;
  const own = (e) => store.canEdit('events', e);
  const who = (ids) => ids.map((id) => store.member(id)?.name).join(' e ');
  if (kind === 'criar') {
    const co = resolveCompany(a.empresa);
    // marketing: toda marcação é de uma empresa. Outras profissões: o grupo (Local, Turma, Obra…) é opcional
    if (!co && isMarketing()) return { ok: false, text: `Não achei a empresa “${a.empresa || '?'}”. Confira o nome em Empresas.` };
    const coWarn = !co && a.empresa ? `Não achei ${ent(false, true)} “${a.empresa}”: vou marcar sem ${ent(false, true)}.` : '';
    const dates = expandDates(a);
    if (!dates.length) return { ok: false, text: 'Faltou a data do compromisso.' };
    const type = resolveType(a.tipo, a.titulo);
    const start = T(a.inicio || a.hora);
    const end = T(a.fim);
    let dur = start && end ? toMin(end) - toMin(start) : Number(a.duracao_min) || null;
    if (dur && dur <= 0) dur = null;
    const people = resolvePeople(a.responsaveis);
    const title = tidyTitle(String(a.titulo || '').slice(0, 120), type) || TYPES[type].label;
    const busy = dates.filter((d) => overlaps(d, start, dur || TYPES[type].dur, people).length);
    const span = dates.length === 1 ? dayLabel(dates[0]) : `${dates.length} dias, de ${fmtDayShort(dates[0])} a ${fmtDayShort(dates[dates.length - 1])}`;
    return {
      ok: true,
      text: `Criar ${TYPES[type].label} “${title}”${co ? ` · ${co.name}` : ''} — ${span}${start ? ` · ${fmtTime(start)}${dur ? ' às ' + fmtTime(fromMin(toMin(start) + dur)) : ''}` : ''} · ${who(people)}`,
      warn: [coWarn, busy.length ? (dates.length === 1 ? 'Atenção: já tem outro compromisso nesse horário.' : `${busy.length === dates.length ? 'Todas as datas' : `${busy.length} das datas`} já têm algo nesse horário.`) : ''].filter(Boolean).join(' '),
      run: async () => {
        const seriesId = dates.length > 1 ? uid('s_') : null;
        const items = dates.map((date) => ({
          id: uid('e_'), type, companyId: co ? co.id : null, title, date, time: start, duration: dur || null, assignees: people,
          platform: TYPES[type].kind === 'post' ? (a.rede || 'instagram') : null, status: 'pendente', reminder: 30, visibleToClient: TYPES[type].client !== false, description: String(a.descricao || '').slice(0, 2000), location: String(a.local || '').slice(0, 300), seriesId,
        }));
        if (items.length > 1) await store.upsertMany('events', items, { activity: { kind: 'series', count: items.length, label: `${TYPES[type].label} ${title}`, sample: { companyId: co ? co.id : null, date: dates[0] } } });
        else await store.upsert('events', items[0]);
        return items.length;
      },
    };
  }
  if (['mover', 'concluir', 'editar'].includes(kind)) {
    if (!ev) return { ok: false, text: 'Não achei esse compromisso na agenda.' };
    if (!own(ev)) return { ok: false, text: `“${ev.title}” foi cadastrado por ${store.member(ev.createdBy)?.name || 'o parceiro'}; só ele pode alterar.` };
    const label = `${TYPES[ev.type]?.label || ''} “${ev.title || ''}” (${dayLabel(ev.date)}${ev.time ? ' ' + fmtTime(ev.time) : ''})`;
    if (kind === 'concluir') return { ok: true, text: `Marcar como feito: ${label}`, run: async () => { await store.upsert('events', { ...store.event(ev.id), status: 'feito' }); return 1; } };
    const patch = {};
    if (isDate(a.data)) patch.date = a.data;
    if (T(a.inicio || a.hora)) patch.time = T(a.inicio || a.hora);
    if (T(a.fim)) patch.duration = Math.max(5, toMin(T(a.fim)) - toMin(patch.time || ev.time || '00:00'));
    if (a.titulo) patch.title = String(a.titulo).slice(0, 120);
    if (a.tipo) patch.type = resolveType(a.tipo, a.titulo);
    if (a.responsaveis) patch.assignees = resolvePeople(a.responsaveis);
    if (a.empresa) { const co = resolveCompany(a.empresa); if (co) patch.companyId = co.id; }
    if (!Object.keys(patch).length) return { ok: false, text: `Não entendi o que mudar em ${label}.` };
    const desc = [patch.date && `para ${dayLabel(patch.date)}`, patch.time && `às ${fmtTime(patch.time)}`, patch.title && `título “${patch.title}”`, patch.assignees && `responsável ${who(patch.assignees)}`].filter(Boolean).join(', ');
    return { ok: true, text: `${kind === 'mover' ? 'Mover' : 'Alterar'} ${label}${desc ? ' → ' + desc : ''}`, run: async () => { await store.upsert('events', { ...store.event(ev.id), ...patch }); return 1; } };
  }
  if (kind === 'excluir') {
    let evs, aviso = '', alcance = '';
    const co = a.empresa || a.filtro?.empresa ? resolveCompany(a.empresa || a.filtro.empresa) : null;
    if ((a.empresa || a.filtro?.empresa) && !co) return { ok: false, text: `Não achei a empresa “${a.empresa || a.filtro.empresa}”.` };
    if (a.filtro && typeof a.filtro === 'object') { // o alcance é resolvido aqui, sobre a agenda inteira
      const de = isDate(a.filtro.de) ? a.filtro.de : todayKey(), ate = isDate(a.filtro.ate) ? a.filtro.ate : null, p = a.filtro.pessoa ? resolvePeople(a.filtro.pessoa) : null;
      if (!co && !p && !ate) return { ok: false, text: 'Preciso saber de qual empresa, pessoa ou período.' };
      evs = store.state.events.filter((e) => (!co || e.companyId === co.id) && (!p || (e.assignees || []).some((x) => p.includes(x))) && e.date >= de && (!ate || e.date <= ate));
      const ult = evs.reduce((m, e) => (e.date > m ? e.date : m), de); const dt = (k) => k.split('-').reverse().join('/');
      alcance = `${evs.length} ${evs.length === 1 ? 'item' : 'itens'}${co ? ` da ${co.name}` : ''} de ${de === todayKey() ? 'hoje' : dt(de)} até ${dt(ate || ult)}`;
    } else {
      const idsList = [...new Set((Array.isArray(a.ids) ? a.ids : [a.id]).filter((x) => typeof x === 'string'))];
      evs = idsList.map((id) => store.event(id)).filter(Boolean);
      const p = a.pessoa ? resolvePeople(a.pessoa) : null, fora = evs.filter((e) => (co && e.companyId !== co.id) || (p && !(e.assignees || []).some((x) => p.includes(x))));
      if (fora.length) { evs = evs.filter((e) => !fora.includes(e)); aviso = `${fora.length} ${fora.length === 1 ? 'item não é' : 'itens não são'} ${co ? `da ${co.name}` : 'dessa pessoa'} e ${fora.length === 1 ? 'ficou' : 'ficaram'}.`; }
    }
    if (!evs.length) return { ok: false, text: aviso || 'Não achei o que excluir.' };
    const mine = evs.filter(own).sort((x, y) => (x.date + (x.time || '') < y.date + (y.time || '') ? -1 : 1));
    if (!mine.length) return { ok: false, text: 'Esses compromissos foram cadastrados pelo parceiro; só ele pode excluir.' };
    if (mine.length > 100) return { ok: false, text: `São ${mine.length} itens. Pelo assistente o limite é 100 de uma vez: apague pela agenda ou peça um período menor.` };
    const ids = mine.map((e) => e.id);
    return { ok: true, apaga: mine.map((e) => ({ id: e.id, title: e.title || TYPES[e.type]?.label || '', date: e.date, time: e.time || '', serie: !!e.seriesId })), text: alcance ? `Apagar ${alcance}` : `Apagar ${mine.length === 1 ? `“${mine[0].title}” (${dayLabel(mine[0].date)})` : `${mine.length} compromissos`}`,
      warn: [aviso, mine.length < evs.length ? `${evs.length - mine.length} são do parceiro e ficam.` : ''].filter(Boolean).join(' '), run: async (o = {}) => { const antes = store.state.events.filter((e) => ids.includes(e.id)).length; await store.removeMany('events', ids, { via: 'assistente', lote: o.lote }); return antes - store.state.events.filter((e) => ids.includes(e.id)).length; } };
  }
  if (kind === 'pessoal') {
    const dates = expandDates(a);
    const date = dates[0] || todayKey(), dm = Number.isInteger(a.dia_mes) && a.dia_mes > 28 && a.dia_mes < 32 ? a.dia_mes : 0;
    const ate = isDate(a.ate) ? a.ate : isDate(a.until) ? a.until : null;
    const cat = CATS[a.categoria] ? a.categoria : guessCat(a.titulo || '');
    const rep = ['none', 'daily', 'weekly', 'monthly', 'yearly'].includes(a.repetir) ? a.repetir : cat === 'aniversario' ? 'yearly' : 'none';
    const title = String(a.titulo || '').slice(0, 120);
    if (!title) return { ok: false, text: 'Faltou dizer o que anotar no Pessoal.' };
    const valor = typeof a.valor === 'number' ? a.valor : numeroBR(String(a.valor || ''));
    const vt = valor > 0 && valor < 1e7 ? ` · ${reaisTxt(valor)}` : '';
    return { ok: true, text: `Anotar no seu Pessoal: “${title}” · ${dayLabel(date)}${T(a.inicio || a.hora) ? ' às ' + fmtTime(T(a.inicio || a.hora)) : ''}${rep === 'monthly' ? ` · todo dia ${a.dia_mes || +date.slice(8)}` : rep !== 'none' ? ' · repete' : ''}${ate && rep !== 'none' ? ` até ${ate.split('-').reverse().join('/')}` : ''}${vt}`, novo: true, titulo: title, quando: `${rep === 'monthly' ? `Todo dia ${a.dia_mes || +date.slice(8)}` : dayLabel(date)}${ate && rep !== 'none' ? ` · até ${ate.split('-').reverse().join('/')}` : T(a.inicio || a.hora) ? ' · ' + fmtTime(T(a.inicio || a.hora)) : ''}`,
      run: async () => { savePersonal({ title, date, time: T(a.inicio || a.hora), cat, repeat: rep, ...(ate && rep !== 'none' ? { until: ate } : {}), ...(dm && rep === 'monthly' ? { diaMes: dm } : {}), ...(vt ? { valor } : {}), note: String(a.descricao || '').slice(0, 500), remind: 'auto' }); return 1; } };
  }
  if (kind === 'anotacao' || kind === 'anotação') {
    const text = String(a.texto || a.titulo || '').slice(0, 500);
    if (!text) return { ok: false, text: 'Faltou o que anotar.' };
    return { ok: true, text: `Guardar nas suas Notas: “${text}” (agora)`, run: async () => { addMemo(text); return 1; } };
  }
  if (kind === 'excluir pessoal' || kind === 'excluir_pessoal') {
    const it = personal.item(a.id);
    if (!it) return { ok: false, text: 'Não achei essa anotação.' };
    return { ok: true, apaga: [{ id: it.id, title: it.title || it.text || it.name || '', date: it.date || '', time: it.time || '', serie: !!it.repeat && it.repeat !== 'none' }], text: `Apagar do Pessoal: “${it.title || it.text || it.name || ''}”`, run: async (o = {}) => (removePersonal(it.id, { via: 'assistente', lote: o.lote }) ? 1 : 0) };
  }
  if (kind === 'bilhete') {
    const text = String(a.texto || '').slice(0, 280);
    if (!text) return { ok: false, text: 'Faltou o texto do bilhete.' };
    const date = isDate(a.data) ? a.data : todayKey();
    return { ok: true, text: `${store.team.length > 1 ? 'Bilhete para a equipe' : 'Bilhete'} (${dayLabel(date)}): “${text}”`, run: async () => { await store.upsert('notes', { id: uid('n_'), date, text, author: store.me }); return 1; } };
  }
  return { ok: false, text: `Ação desconhecida: ${a?.acao || '?'}` };
}

/* ---------- o plano mostrado é o plano executado ---------- */
/** congela as ações: o que aparece no cartão é exatamente o que será feito */
export function congela(acoes) { return acoes.map((a) => { try { const p = planAction(a); return { a, ok: !!p.ok, text: p.text, warn: p.warn || '', apaga: p.apaga || null, ...(p.novo ? { novo: true, titulo: p.titulo, quando: p.quando } : {}) }; } catch { return { a, ok: false, text: 'Não entendi uma das ações.', warn: '', apaga: null }; } }); }
const chaveApaga = (L) => (L || []).map((x) => `${x.id}|${x.title}|${x.date}|${x.time}`).sort().join('~');
/** a agenda mudou desde que o cartão apareceu? */
export function mudou(plano) { return congela(plano.map((x) => x.a)).some((n, i) => n.ok !== plano[i].ok || n.text !== plano[i].text || chaveApaga(n.apaga) !== chaveApaga(plano[i].apaga)); }
export const quantosApaga = (plano) => plano.filter((x) => x.ok).reduce((n, x) => n + (x.apaga ? x.apaga.length : 0), 0);
export const pedeSegunda = (plano) => quantosApaga(plano) > 3 || plano.some((x) => x.ok && x.apaga && x.apaga.some((y) => y.serie));
const copia = (x) => JSON.parse(JSON.stringify(x));
/** executa o plano congelado e guarda como desfazer */
export async function executa(plano, { lote }) {
  const antesE = new Map(store.state.events.map((e) => [e.id, copia(e)])), antesP = new Map(personal.items.map((e) => [e.id, copia(e)])), antesN = new Set(store.state.notes.map((x) => x.id));
  let n = 0, fails = 0, apagou = 0;
  for (const x of plano) {
    if (!x.ok) { fails++; continue; }
    try { const p = x.apaga ? planAction(x.a.id && !x.a.ids && !x.a.filtro ? x.a : { acao: x.a.acao, ids: x.apaga.map((y) => y.id), id: x.apaga[0].id }) : planAction(x.a); if (!p.ok) { fails++; continue; } const k = (await p.run({ lote })) || 0; n += k; if (x.apaga) apagou += k; } catch (e) { console.error(e); fails++; }
  }
  const dif = (m, L) => L.filter((e) => m.has(e.id) && JSON.stringify(m.get(e.id)) !== JSON.stringify(e)).map((e) => m.get(e.id));
  const undo = { at: Date.now(), lote: apagou ? lote : null, events: dif(antesE, store.state.events), pessoal: dif(antesP, personal.items).filter((x) => x.kind !== 'prefs'), criados: store.state.events.filter((e) => !antesE.has(e.id)).map((e) => e.id), criadosP: personal.items.filter((e) => !antesP.has(e.id)).map((e) => e.id), criadosN: store.state.notes.filter((x) => !antesN.has(x.id)).map((x) => x.id) };
  return { n, fails, apagou, undo };
}
/** volta tudo como estava antes do plano (o criado vai para a lixeira) */
export async function desfaz(undo) {
  if (!undo) return 0;
  let n = 0;
  if (undo.lote) { const { restauraLote } = await import('./lixeira.js'); n += await restauraLote(undo.lote); }
  if (undo.events?.length) { await store.upsertMany('events', undo.events.map(copia)); n += undo.events.length; }
  for (const x of undo.pessoal || []) { savePersonal(copia(x)); n++; }
  if (undo.criados?.length && (await store.removeMany('events', undo.criados, { via: 'assistente' }))) n += undo.criados.length;
  for (const id of undo.criadosP || []) if (removePersonal(id, { via: 'assistente' })) n++;
  if (undo.criadosN?.length && (await store.removeMany('notes', undo.criadosN, { via: 'assistente' }))) n += undo.criadosN.length;
  return n;
}
