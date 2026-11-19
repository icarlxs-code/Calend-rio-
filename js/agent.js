/* O assistente agindo de verdade: transforma as ações que a IA devolve
   ("criar", "mover", "concluir", "excluir", "editar", "pessoal", "bilhete")
   em mudanças na agenda — sempre mostrando um resumo para a pessoa confirmar. */
import { store } from './store.js';
import { TYPES } from './constants.js';
import { uid, todayKey, addDays, fromKey, toMin, fromMin, fmtTime, dayLabel, fmtDayShort } from './utils.js';
import { tidyTitle } from './tidy.js';
import { savePersonal, removePersonal, personal, CATS, guessCat } from './personal.js';

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || '');
const isTime = (t) => /^\d{1,2}:\d{2}$/.test(t || '');
const T = (t) => (isTime(t) ? t.padStart(5, '0') : null);

const TYPE_WORDS = {
  feed: ['feed', 'post', 'postagem', 'publicacao'], carrossel: ['carrossel', 'carousel'], reels: ['reels', 'reel', 'video'],
  story: ['story', 'stories', 'storie'], captacao: ['captacao', 'gravacao', 'gravar', 'filmagem', 'foto', 'fotos', 'captar'],
  reuniao: ['reuniao', 'call', 'encontro', 'conversa'], producao: ['producao', 'edicao', 'editar', 'roteiro', 'criacao'], outro: ['outro', 'tarefa'],
};
export function resolveType(t, title = '') {
  if (TYPES[t]) return t;
  const s = ' ' + norm(t + ' ' + title) + ' ';
  for (const [k, ws] of Object.entries(TYPE_WORDS)) if (ws.some((w) => s.includes(' ' + w))) return k;
  return 'outro';
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
    if (!co) return { ok: false, text: `Não achei a empresa “${a.empresa || '?'}”. Confira o nome em Empresas.` };
    const dates = expandDates(a);
    if (!dates.length) return { ok: false, text: 'Faltou a data do compromisso.' };
    const type = resolveType(a.tipo, a.titulo);
    const start = T(a.inicio || a.hora);
    const end = T(a.fim);
    let dur = start && end ? toMin(end) - toMin(start) : Number(a.duracao_min) || null;
    if (dur && dur <= 0) dur = null;
    const people = resolvePeople(a.responsaveis);
    const title = tidyTitle(String(a.titulo || '').slice(0, 120)) || TYPES[type].label;
    const busy = dates.filter((d) => overlaps(d, start, dur || TYPES[type].dur, people).length);
    const span = dates.length === 1 ? dayLabel(dates[0]) : `${dates.length} dias, de ${fmtDayShort(dates[0])} a ${fmtDayShort(dates[dates.length - 1])}`;
    return {
      ok: true,
      text: `Criar ${TYPES[type].label} “${title}” · ${co.name} — ${span}${start ? ` · ${fmtTime(start)}${dur ? ' às ' + fmtTime(fromMin(toMin(start) + dur)) : ''}` : ''} · ${who(people)}`,
      warn: busy.length ? (dates.length === 1 ? 'Atenção: já tem outro compromisso nesse horário.' : `${busy.length === dates.length ? 'Todas as datas' : `${busy.length} das datas`} já têm algo nesse horário.`) : '',
      run: async () => {
        const seriesId = dates.length > 1 ? uid('s_') : null;
        const items = dates.map((date) => ({
          id: uid('e_'), type, companyId: co.id, title, date, time: start, duration: dur || null, assignees: people,
          platform: TYPES[type].kind === 'post' ? (a.rede || 'instagram') : null, status: 'pendente', reminder: 30, visibleToClient: TYPES[type].client !== false, description: String(a.descricao || '').slice(0, 2000), location: String(a.local || '').slice(0, 300), seriesId,
        }));
        if (items.length > 1) await store.upsertMany('events', items, { activity: { kind: 'series', count: items.length, label: `${TYPES[type].label} ${title}`, sample: { companyId: co.id, date: dates[0] } } });
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
    const idsList = (Array.isArray(a.ids) ? a.ids : [a.id]).filter(Boolean);
    const evs = idsList.map((id) => store.event(id)).filter(Boolean);
    if (!evs.length) return { ok: false, text: 'Não achei o que excluir.' };
    const mine = evs.filter(own);
    if (!mine.length) return { ok: false, text: 'Esses compromissos foram cadastrados pelo parceiro; só ele pode excluir.' };
    return { ok: true, text: `Excluir ${mine.length === 1 ? `“${mine[0].title}” (${dayLabel(mine[0].date)})` : `${mine.length} compromissos`}`, warn: mine.length < evs.length ? `${evs.length - mine.length} são do parceiro e ficam.` : '', run: async () => { await store.removeMany('events', mine.map((e) => e.id)); return mine.length; } };
  }
  if (kind === 'pessoal') {
    const dates = expandDates(a);
    const date = dates[0] || todayKey();
    const cat = CATS[a.categoria] ? a.categoria : guessCat(a.titulo || '');
    const rep = ['none', 'daily', 'weekly', 'monthly', 'yearly'].includes(a.repetir) ? a.repetir : cat === 'aniversario' ? 'yearly' : 'none';
    const title = String(a.titulo || '').slice(0, 120);
    if (!title) return { ok: false, text: 'Faltou dizer o que anotar no Pessoal.' };
    return { ok: true, text: `Anotar no seu Pessoal: “${title}” · ${dayLabel(date)}${T(a.inicio || a.hora) ? ' às ' + fmtTime(T(a.inicio || a.hora)) : ''}${rep !== 'none' ? ' · repete' : ''}`,
      run: async () => { savePersonal({ title, date, time: T(a.inicio || a.hora), cat, repeat: rep, note: String(a.descricao || '').slice(0, 500), remind: 'auto' }); return 1; } };
  }
  if (kind === 'excluir pessoal' || kind === 'excluir_pessoal') {
    const it = personal.item(a.id);
    if (!it) return { ok: false, text: 'Não achei essa anotação.' };
    return { ok: true, text: `Apagar do Pessoal: “${it.title}”`, run: async () => { removePersonal(it.id); return 1; } };
  }
  if (kind === 'bilhete') {
    const text = String(a.texto || '').slice(0, 280);
    if (!text) return { ok: false, text: 'Faltou o texto do bilhete.' };
    const date = isDate(a.data) ? a.data : todayKey();
    return { ok: true, text: `Bilhete para a dupla (${dayLabel(date)}): “${text}”`, run: async () => { await store.upsert('notes', { id: uid('n_'), date, text, author: store.me }); return 1; } };
  }
  return { ok: false, text: `Ação desconhecida: ${a?.acao || '?'}` };
}
