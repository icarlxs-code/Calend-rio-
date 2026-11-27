/* Falas do mascote escritas pela IA para ESTA pessoa (servidor /fala), e o que ela mais gosta.
   - Frase do momento na tela inicial: uma de manhã, uma à tarde e uma à noite (nunca a mesma).
   - Quando toca no mascote: às vezes vem uma fala nova da IA (já buscada antes, para não esperar).
   - Gostos: o assunto das falas em que ela toca num botão sobe; o que ela dispensa desce. Fica só no aparelho dela.
   Sem internet, sem servidor ou sem cota da IA: tudo continua com as frases do próprio app. */
import { store } from './store.js';
import { personal } from './personal.js';
import { todayKey, addDays } from './utils.js';

export const turno = (d = new Date()) => (d.getHours() < 12 ? 'manha' : d.getHours() < 18 ? 'tarde' : 'noite');
export const TURNOS = ['manha', 'tarde', 'noite'];
const LS_G = 'lembra.gostos', ler = (k, v) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? v; } catch { return v; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ok */ } };

/* ---------- gostos ---------- */
/** "vida-filho" → "filho"; "late-3" → "late" */
export const assunto = (k) => String(k || '').replace(/^vida-/, '').split(/[-:]/)[0] || '';
/** +2 tocou num botão da fala, +1 tocou no mascote logo depois dela, -1 dispensou. Com o tempo, tudo esfria (nada fica para sempre). */
export function gostou(k, peso) {
  const a = assunto(k); if (!a) return;
  const g = ler(LS_G, {}), agora = Date.now();
  for (const [x, v] of Object.entries(g)) { const d = (agora - (v.at || agora)) / 864e5; v.p = (v.p || 0) * Math.pow(0.97, d); v.at = agora; if (Math.abs(v.p) < 0.05) delete g[x]; }
  g[a] = { p: Math.max(-10, Math.min(30, ((g[a] && g[a].p) || 0) + peso)), at: agora };
  gravar(LS_G, g);
}
/** quanto a pessoa gosta do assunto desta fala (de -10 a 30) */
export const gostoDe = (k) => (ler(LS_G, {})[assunto(k)] || {}).p || 0;
/** os assuntos de que ela mais gosta (vão para a IA) */
export const preferidos = (n = 4) => Object.entries(ler(LS_G, {})).filter(([, v]) => v.p > 0.5).sort((a, b) => b[1].p - a[1].p).slice(0, n).map(([k]) => NOMES[k] || k);
const NOMES = { filho: 'filhos', filhos: 'filhos', par: 'relacionamento', complicado: 'relacionamento', solteiro: 'vida de solteiro', autoestima: 'autoestima e motivação', desanimado: 'motivação', late: 'organizar o atrasado', agenda: 'agenda', torcida: 'futebol', papo: 'conversar', pessoal: 'vida pessoal' };

/* ---------- o retrato que vai para a IA (só o necessário) ---------- */
export function contexto() {
  const p = store.profile || {}, t = todayKey(), am = addDays(t, 1);
  const tit = (e) => `${e.time ? `${e.time} ` : ''}${e.title || ''}`.trim();
  let hoje = [], amanha = [], atrasados = 0, feitos = 0;
  try {
    const trab = store.eventsOn ? store.eventsOn(t, { person: store.me || 'all' }) : [];
    const pes = (personal.events || []).filter((e) => e.date === t || e.repeat === 'daily');
    hoje = [...trab, ...pes].filter((e) => e.status !== 'feito' && !e.done).map(tit).slice(0, 6);
    feitos = trab.filter((e) => e.status === 'feito').length;
    amanha = [...(store.eventsOn ? store.eventsOn(am, { person: store.me || 'all' }) : []), ...(personal.events || []).filter((e) => e.date === am)].map(tit).slice(0, 4);
    atrasados = (personal.events || []).filter((e) => (e.repeat || 'none') === 'none' && !e.done && e.date < t && e.date >= addDays(t, -30)).length;
  } catch { /* agenda ainda carregando */ }
  let vida = p.vida; if (!vida) vida = ler('lembra.vida', null);
  return { nome: String(p.nickname || store.user?.displayName || '').split(' ')[0], pronome: p.pronoun || '', vida, hoje, amanha, atrasados, feitos, gostos: preferidos(), time: p.teamId || '' };
}

/* ---------- busca no servidor ---------- */
const LS_F = (dia, tu) => `lembra.fala.${dia}.${tu}`;
let buscando = false;
async function pede(onde, momento) {
  const { api, server } = await import('./avisos.js');
  if (store.mode !== 'cloud' || !store.user || !server()) return '';
  const r = await api('/fala', { ws: '', onde, momento, ctx: contexto() });
  return r && r.t ? String(r.t) : '';
}
/** a frase do momento já guardada (ou null): a tela usa esta, senão a frase do app */
export function falaDoTurno(dia = todayKey(), tu = turno()) { const f = ler(LS_F(dia, tu), null); return f && f.t ? f : null; }
/** busca a frase deste turno (uma vez por turno) e avisa a tela para redesenhar */
export async function buscaTurno() {
  const dia = todayKey(), tu = turno();
  if (buscando || falaDoTurno(dia, tu) || ler(`${LS_F(dia, tu)}.tentou`, 0) > Date.now() - 30 * 60e3) return null;
  buscando = true;
  try {
    gravar(`${LS_F(dia, tu)}.tentou`, Date.now());
    const t = await pede('tela', tu);
    if (!t) return null;
    gravar(LS_F(dia, tu), { t, at: Date.now() });
    try { localStorage.removeItem(LS_F(addDays(dia, -2), tu)); } catch { /* ok */ }
    window.dispatchEvent(new CustomEvent('lembra:fala'));
    return t;
  } catch { return null; } finally { buscando = false; }
}
/* uma fala de toque guardada para usar na hora (sem esperar a rede) */
const LS_T = 'lembra.fala.toque';
export function pegaFalaToque() { const f = ler(LS_T, null); if (!f || !f.t || Date.now() - f.at > 6 * 3600e3) return null; try { localStorage.removeItem(LS_T); } catch { /* ok */ } setTimeout(() => buscaToque(), 4000); return f.t; }
export async function buscaToque() { if (ler(LS_T, null)) return; try { const t = await pede('toque', turno()); if (t) gravar(LS_T, { t, at: Date.now() }); } catch { /* ok */ } }
/** liga tudo: busca ao abrir, ao voltar para o app e na troca de turno */
let ligado = false;
export function liga() {
  if (ligado) return; ligado = true;
  setTimeout(() => { buscaTurno(); setTimeout(buscaToque, 8000); }, 5000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) buscaTurno(); });
  setInterval(() => { if (!document.hidden) buscaTurno(); }, 15 * 60e3);
}
