/* Deslizar com o dedo, acompanhando o toque:
   - na tela: passa para a aba do lado (a tela vizinha aparece junto, como páginas);
   - numa folha (conversa, mensagens, amigos, perfil): arrastar para a direita volta, como no iPhone.
   O que já tem o próprio gesto continua com ele: calendário, faixas que rolam de lado, linhas de conversa e bolhas. */
import { topSheet, openSheets } from './components.js';

const EASE = 'cubic-bezier(.22,.8,.26,1)', BORDA = 30;
const calmo = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const JA_TEM = '[data-swipe], .daystrip, .snhbud, .pvsw, .crop__area, .bdet__stage, .vcard, [data-semdeslize], input, textarea, select, [contenteditable="true"], audio, video';
/* está em cima de algo que rola de lado? (fica com a rolagem dele) */
function rolaDeLado(n, ate) {
  for (; n && n !== ate && n !== document.body; n = n.parentElement) if (n.scrollWidth > n.clientWidth + 4 && /auto|scroll/.test(getComputedStyle(n).overflowX)) return true;
  return false;
}
let g = null, abas = null, acabando = null, fimToque = 0;

/** abas: { lista() → ids, atual() → id, previa(id) → elemento pronto, vai(id) } */
export function ligaDeslizar(o) {
  abas = o;
  document.addEventListener('touchstart', comeca, { passive: true });
  document.addEventListener('touchmove', mexe, { passive: false });
  document.addEventListener('touchend', solta, { passive: true });
  document.addEventListener('touchcancel', () => desfaz(), { passive: true });
  document.addEventListener('click', (e) => { if (Date.now() - fimToque < 350) { e.preventDefault(); e.stopPropagation(); } }, true); // o arrasto não vira toque
}
const desfaz = () => { if (g && g.trava) (g.tipo === 'aba' ? voltaAba : voltaFolha)(); g = null; };

function comeca(e) {
  if (acabando) acabando(); // ainda animando: termina na hora e já aceita o próximo gesto
  if (e.touches.length > 1) { desfaz(); return; }
  const t = e.touches[0], alvo = e.target; g = null; if (!alvo.closest) return;
  const base = { x: t.clientX, y: t.clientY, dx: 0, trava: false, pts: [[performance.now(), t.clientX]] }, borda = t.clientX <= BORDA;
  const panel = alvo.closest('.sheet');
  if (panel) {
    const s = topSheet();
    if (!s || s.panel !== panel || !panel.matches('.sheet--tall, .sheet--conv, .sheet--fx')) return;
    const conversa = panel.classList.contains('sheet--conv');
    if (!borda && (alvo.closest(JA_TEM) || rolaDeLado(alvo, panel) || alvo.closest('.bol__c, .conv__barra, .conv__grava'))) return;
    if (!borda && !conversa && !panel.classList.contains('sheet--fx') && !panel.classList.contains('sheet--prof')) return; // formulários: só pela borda
    g = { ...base, tipo: 'folha', s, panel, fundo: panel.parentElement.querySelector('.sheet-backdrop'), w: innerWidth };
    return;
  }
  const view = alvo.closest('#view');
  if (!view || openSheets().length || document.querySelector('.paywall, .ficha, .ob, .guide, .nv, .stv, .spaceveil, .termsgate, .photogate, .avgate') || alvo.closest(JA_TEM) || rolaDeLado(alvo, view)) return;
  const L = abas.lista(), i = L.indexOf(abas.atual()); if (i < 0) return;
  g = { ...base, tipo: 'aba', view, w: innerWidth, ant: L[i - 1], prox: L[i + 1], lados: {} };
}

function mexe(e) {
  if (!g) return; const t = e.touches[0], dx = t.clientX - g.x, dy = t.clientY - g.y;
  if (!g.trava) {
    if (Math.abs(dx) < 9 && Math.abs(dy) < 9) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.25 || (g.tipo === 'folha' && dx < 0)) { g = null; return; } // está rolando a tela
    g.trava = true; g.x += Math.sign(dx) * 9; const f = document.activeElement; if (f && /INPUT|TEXTAREA/.test(f.tagName)) f.blur();
    if (g.tipo === 'aba') { document.documentElement.classList.add('dz-on'); g.view.style.transition = 'none'; g.view.style.willChange = 'transform'; } else { g.panel.style.transition = 'none'; g.fundo.style.transition = 'none'; }
  }
  if (e.cancelable) e.preventDefault();
  g.dx = t.clientX - g.x; g.pts.push([performance.now(), t.clientX]); if (g.pts.length > 6) g.pts.shift();
  if (!g.raf) g.raf = requestAnimationFrame(() => { if (!g) return; g.raf = 0; (g.tipo === 'aba' ? pintaAba : pintaFolha)(); });
}
const vel = () => { const p = g.pts; if (p.length < 2) return 0; const a = p[0], b = p[p.length - 1]; return performance.now() - b[0] > 130 ? 0 : (b[1] - a[1]) / Math.max(1, b[0] - a[0]); };

/* ---------- abas ---------- */
function lado(id, dir) {
  if (!id) return null; if (g.lados[dir]) return g.lados[dir];
  const n = document.createElement('div'); n.className = 'dz__lado'; n.setAttribute('aria-hidden', 'true'); n.inert = true;
  const c = abas.previa(id); c.classList.add('view'); n.append(c); document.body.appendChild(n); abas.vive && abas.vive();
  return (g.lados[dir] = n);
}
function pintaAba() {
  const dir = g.dx < 0 ? 1 : -1, id = dir > 0 ? g.prox : g.ant; let x = g.dx;
  if (!id) x = Math.sign(x) * 70 * (1 - Math.exp(-Math.abs(x) / 190)); // não tem aba desse lado: resiste como elástico
  const n = lado(id, dir); g.view.style.transform = `translate3d(${x}px,0,0)`;
  if (n) n.style.transform = `translate3d(${x + dir * g.w}px,0,0)`;
  const o = g.lados[-dir]; if (o) o.style.transform = `translate3d(${-dir * g.w}px,0,0)`;
}
const limpaView = (v) => { v.style.transition = ''; v.style.transform = ''; v.style.willChange = ''; document.documentElement.classList.remove('dz-on'); };
function termina(ms, fim) { let feito = false; const f = () => { if (feito) return; feito = true; acabando = null; fim(); }; acabando = f; setTimeout(f, ms); }
function voltaAba() {
  const { view, lados, w } = g, ms = calmo() ? 0 : 240;
  view.style.transition = `transform ${ms}ms ${EASE}`; view.style.transform = 'translate3d(0,0,0)';
  for (const [d, n] of Object.entries(lados)) { n.style.transition = `transform ${ms}ms ${EASE}`; n.style.transform = `translate3d(${d * w}px,0,0)`; }
  termina(ms + 20, () => { limpaView(view); Object.values(lados).forEach((n) => n.remove()); });
}
function vaiAba(dir, id, v) {
  const { view, lados, w, dx } = g, n = lado(id, dir), ms = calmo() ? 0 : Math.max(150, Math.min(300, (w - Math.abs(dx)) / Math.max(1.2, Math.abs(v))));
  pintaAba(); void n.offsetWidth;
  view.style.transition = `transform ${ms}ms ${EASE}`; n.style.transition = `transform ${ms}ms ${EASE}`;
  view.style.transform = `translate3d(${-dir * w}px,0,0)`; n.style.transform = 'translate3d(0,0,0)';
  if (lados[-dir]) lados[-dir].remove();
  abas.marca(id); try { navigator.vibrate && navigator.vibrate(6); } catch { /* ok */ }
  termina(ms + 20, () => {
    view.style.transition = 'none'; n.classList.add('is-cobre'); // a prévia fica na frente até a tela de verdade estar desenhada
    limpaView(view); abas.vai(id); requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => n.remove(), 90)));
  });
}

/* ---------- folhas: voltar ---------- */
function pintaFolha() { const x = Math.max(0, g.dx); g.panel.style.transform = `translate3d(${x}px,0,0)`; g.fundo.style.opacity = String(Math.max(0, 1 - x / g.w)); }
function voltaFolha() {
  const { panel, fundo } = g, ms = calmo() ? 0 : 240;
  panel.style.transition = `transform ${ms}ms ${EASE}`; fundo.style.transition = `opacity ${ms}ms`; panel.style.transform = 'translate3d(0,0,0)'; fundo.style.opacity = '1';
  termina(ms + 20, () => { panel.style.transition = ''; panel.style.transform = ''; fundo.style.transition = ''; fundo.style.opacity = ''; });
}
function fechaFolha(v) {
  const { panel, fundo, s, w, dx } = g, ms = calmo() ? 0 : Math.max(140, Math.min(280, (w - dx) / Math.max(1.2, v)));
  panel.style.transition = `transform ${ms}ms ${EASE}`; fundo.style.transition = `opacity ${ms}ms`; panel.style.transform = `translate3d(${w}px,0,0)`; fundo.style.opacity = '0';
  termina(ms, () => { if (!s.closed) { if (s.aoVoltar) s.aoVoltar(); s.close(); } });
}

function solta(e) {
  if (!g) return; const era = g; if (!g.trava) { g = null; return; }
  const f = e && e.changedTouches && e.changedTouches[0]; if (f && Math.abs(f.clientX - g.pts[g.pts.length - 1][1]) > 1) { g.dx = f.clientX - g.x; g.pts.push([performance.now(), f.clientX]); }
  if (g.raf) cancelAnimationFrame(g.raf); fimToque = Date.now();
  const v = vel(), longe = Math.abs(g.dx) > g.w * 0.36;
  if (g.tipo === 'folha') { if (g.dx > 24 && (longe || v > 0.4) && v > -0.2) fechaFolha(v); else voltaFolha(); } else {
    const dir = g.dx < 0 ? 1 : -1, id = dir > 0 ? g.prox : g.ant, aFavor = -dir * v;
    if (id && (longe ? aFavor > -0.25 : aFavor > 0.3 && Math.abs(g.dx) > 24)) vaiAba(dir, id, v); else voltaAba();
  }
  if (g === era) g = null;
}
