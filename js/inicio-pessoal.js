/* Início do Pessoal: cada coisa aparece uma vez só. Puro (sem tela e sem banco), para testar. */
const pad = (n) => String(n).padStart(2, '0');
const key = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const de = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const mais = (k, n) => { const d = de(k); d.setDate(d.getDate() + n); return key(d); };
const hm = (t) => (t ? t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h') : '');

/** o item acontece neste dia? (mensal do dia 29, 30 ou 31 cai no último dia dos meses menores) */
export function occursOn(it, day) {
  if (!it.date || day < it.date) return false;
  if (it.until && day > it.until) return false;
  const r = it.repeat || 'none';
  if (r === 'none') return day === it.date;
  if (r === 'daily') return true;
  if (r === 'yearly') return day.slice(5) === it.date.slice(5);
  if (r === 'monthly') { const [y, m] = day.split('-').map(Number); return +day.slice(8) === Math.min(it.diaMes || +it.date.slice(8), new Date(y, m, 0).getDate()); }
  if (r === 'weekly') return de(day).getDay() === de(it.date).getDay();
  if (r === 'biweekly') return Math.round((de(day) - de(it.date)) / 864e5) % 14 === 0;
  return false;
}
const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
/** a regra em palavras: "todo dia 7h30", "toda segunda 9h", "todo dia 5 · 10h" */
export function selo(it) {
  const h = hm(it.time), d = it.date ? de(it.date) : null, w = d ? WD[d.getDay()] : '', n = it.diaMes || (it.date ? +it.date.slice(8) : 0);
  switch (it.repeat) {
    case 'daily': return `todo dia${h ? ` ${h}` : ''}`;
    case 'weekly': return `${/o$|domingo|sábado/.test(w) ? 'todo' : 'toda'} ${w}${h ? ` ${h}` : ''}`;
    case 'biweekly': return `a cada 2 semanas · ${w.slice(0, 3)}${h ? ` ${h}` : ''}`;
    case 'monthly': return `todo dia ${n}${n > 28 ? ' (ou o último do mês)' : ''}${h ? ` · ${h}` : ''}`;
    case 'yearly': return `todo ano · ${it.date.slice(8)}/${it.date.slice(5, 7)}${h ? ` · ${h}` : ''}`;
    default: return '';
  }
}
const feito = (it, dia) => (it.repeat && it.repeat !== 'none' ? (it.doneDates || []).includes(dia) : !!it.done);
const ordem = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.item.time || '99') < (b.item.time || '99') ? -1 : 1);

export function agruparInicio(events, agora = new Date(), { dias = 35, maxDepois = 6 } = {}) {
  const hoje = key(agora), hora = `${pad(agora.getHours())}:${pad(agora.getMinutes())}`, G = { rotina: [], hoje: [], amanha: [], semana: [], depois: [], maisDepois: 0, destaque: null };
  for (const it of events) {
    if (!it || it.cat === 'aniversario' || !it.date) continue;
    const rep = it.repeat || 'none';
    if (rep === 'daily') {
      if (!occursOn(it, hoje) && !(it.date > hoje && it.date <= mais(hoje, dias))) continue;
      if (!occursOn(it, hoje)) { const d = it.date; (d === mais(hoje, 1) ? G.amanha : d <= mais(hoje, 7) ? G.semana : G.depois).push({ item: it, date: d, done: false, selo: selo(it) }); continue; }
      const prox = it.time && it.time <= hora ? mais(hoje, 1) : hoje, vale = occursOn(it, prox) ? prox : hoje;
      G.rotina.push({ item: it, date: hoje, proxima: vale, feitoHoje: feito(it, hoje), selo: selo(it) }); continue;
    }
    let d = null;
    for (let i = 0; i <= dias; i++) { const x = mais(hoje, i); if (occursOn(it, x)) { if (rep !== 'none' && i === 0 && feito(it, x)) { if (d === null) d = x; continue; } d = d && feito(it, d) && i > 0 ? d : x; break; } }
    if (!d) continue;
    const done = feito(it, d);
    if (done && d > hoje && rep === 'none') continue;
    const o = { item: it, date: d, done, selo: selo(it) };
    (d === hoje ? G.hoje : d === mais(hoje, 1) ? G.amanha : d <= mais(hoje, 7) ? G.semana : G.depois).push(o);
  }
  for (const k of ['hoje', 'amanha', 'semana', 'depois']) G[k].sort(ordem);
  G.rotina.sort((a, b) => ((a.item.time || '99') < (b.item.time || '99') ? -1 : 1));
  G.maisDepois = Math.max(0, G.depois.length - maxDepois); G.depois = G.depois.slice(0, maxDepois);
  const un = (o) => (o.item.repeat || 'none') === 'none' && !o.done;
  G.destaque = G.amanha.find(un) || G.semana.find(un) || null;
  return G;
}
