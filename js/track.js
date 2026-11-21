/* Uso do app (anônimo, só contagem): quais botões e telas as pessoas mais usam, por dia.
   Nunca guarda o que a pessoa escreveu — só o nome do botão (ex.: "novo-evento", "aba:hoje").
   Serve para o dono ver o que funciona, o que ninguém acha e onde as pessoas travam.
   Também guarda os últimos toques para explicar um erro, se acontecer. */
const LS = 'lembra.uso';
const crumbs = [];
const ok = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9:_-]/g, '').slice(0, 40);
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const read = () => { try { return JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch { return {}; } };
let mem = null, dirty = false;

export function track(name) {
  const k = ok(name);
  if (!k) return;
  crumbs.push(k); if (crumbs.length > 8) crumbs.shift();
  mem = mem || read();
  const d = today();
  const day = (mem[d] = mem[d] || {});
  if (Object.keys(day).length >= 150 && !day[k]) return;
  day[k] = (day[k] || 0) + 1;
  dirty = true;
}
/* últimos toques (vai junto com um erro, para saber o que a pessoa estava fazendo) */
export const lastSteps = () => crumbs.slice(-5).join(' › ');

function flush() {
  if (!dirty || !mem) return;
  dirty = false;
  // guarda só os últimos 31 dias
  const keep = Object.keys(mem).sort().slice(-31);
  mem = Object.fromEntries(keep.map((k) => [k, mem[k]]));
  try { localStorage.setItem(LS, JSON.stringify(mem)); } catch { /* ok */ }
}
/* soma dos últimos 30 dias (vai no resumo de uso da conta) */
export function usage30() {
  flush();
  const m = mem || read();
  const out = {};
  for (const day of Object.keys(m).sort().slice(-30)) for (const [k, n] of Object.entries(m[day] || {})) out[k] = (out[k] || 0) + (Number(n) || 0);
  return Object.fromEntries(Object.entries(out).sort((a, b) => b[1] - a[1]).slice(0, 80));
}

export function startTracking() {
  document.addEventListener('click', (ev) => {
    const el = ev.target.closest && ev.target.closest('[data-action], [data-tab], [data-ptab], [data-tab-admin], [data-next], [data-enable]');
    if (!el) return;
    const ds = el.dataset;
    const name = ds.action === 'tab' && ds.tab ? `aba:${ds.tab}` : ds.action === 'ptab' && (ds.ptab || ds.tab) ? `pessoal:${ds.ptab || ds.tab}` : ds.action ? ds.action
      : ds.tab ? `aba:${ds.tab}` : ds.ptab ? `pessoal:${ds.ptab}` : ds.tabAdmin ? `painel:${ds.tabAdmin}` : ds.enable !== undefined ? 'ativar-avisos' : '';
    if (name) track(name);
  }, true);
  setInterval(flush, 15000);
  document.addEventListener('visibilitychange', () => document.hidden && flush());
}
