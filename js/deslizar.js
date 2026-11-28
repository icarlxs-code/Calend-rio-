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
const limpaPrevias = () => { if (!g || !g.lados) return; Object.values(g.lados).forEach((n) => n.remove()); g.lados = {}; };
const desfaz = () => { if (g) { soltaPre(g.pre); if (g.trava) (g.tipo === 'aba' ? voltaAba : voltaFolha)(); else limpaPrevias(); } g = null; };

function comeca(e) {
  if (acabando) { const f = acabando; acabando = null; f(); } // ainda animando: fecha o anterior e já aceita o próximo gesto
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
  prepara();
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
  n.style.transform = `translate3d(${dir * (g.w || innerWidth)}px,0,0)`;   // nasce fora da tela
  const c = abas.previa(id); c.classList.add('view'); n.append(c); document.body.appendChild(n); abas.vive && abas.vive();
  return (g.lados[dir] = n);
}
/* montar a tela vizinha custa uns 100 ms: faz isso assim que o dedo encosta, no tempo ocioso,
   para o arrasto já começar liso (antes, a primeira mexida do dedo engasgava) */
function prepara() {
  const faz = () => { if (!g || g.tipo !== 'aba' || g.pronto) return; g.pronto = 1; try { lado(g.prox, 1); lado(g.ant, -1); } catch (e) { console.warn('deslizar', e); } };
  g.pre = self.requestIdleCallback ? requestIdleCallback(faz, { timeout: 70 }) : setTimeout(faz, 16);
}
const soltaPre = (x) => { if (!x) return; try { (self.cancelIdleCallback || clearTimeout)(x); } catch { /* ok */ } };
function pintaAba() {
  const dir = g.dx < 0 ? 1 : -1, id = dir > 0 ? g.prox : g.ant; let x = g.dx;
  if (!id) x = Math.sign(x) * 70 * (1 - Math.exp(-Math.abs(x) / 190)); // não tem aba desse lado: resiste como elástico
  const n = lado(id, dir); g.view.style.transform = `translate3d(${x}px,0,0)`;
  if (n) n.style.transform = `translate3d(${x + dir * g.w}px,0,0)`;
  const o = g.lados[-dir]; if (o) o.style.transform = `translate3d(${-dir * g.w}px,0,0)`;
}
/* tira o deslocamento SEM animar: se o CSS da tela tiver transição, limpar os dois juntos faz a tela
   voltar deslizando (era o efeito "bumerangue"). Então: trava, limpa, força o desenho e só aí solta. */
const limpaView = (v) => {
  v.style.transition = 'none'; v.style.transform = 'none'; void v.offsetWidth;
  v.style.transform = ''; v.style.willChange = ''; document.documentElement.classList.remove('dz-on');
  requestAnimationFrame(() => { v.style.transition = ''; });
};
const doisQuadros = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
/* desliza um elemento até x e avisa quando REALMENTE terminou (sem relógio: se a tela travar, espera) */
function corre(el, de, ate, ms) {
  el.style.transition = 'none';
  if (!ms || !el.animate) { el.style.transform = `translate3d(${ate}px,0,0)`; return Promise.resolve(); }
  const a = el.animate([{ transform: `translate3d(${de}px,0,0)` }, { transform: `translate3d(${ate}px,0,0)` }], { duration: ms, easing: EASE, fill: 'forwards' });
  return (a.finished || new Promise((r) => { a.onfinish = r; })).catch(() => {}).then(() => { try { el.style.transform = `translate3d(${ate}px,0,0)`; a.cancel(); } catch { /* ok */ } });
}
/* guarda o fim do gesto: dá para "apressar" se a pessoa tocar de novo no meio */
/* espera a animação (promessa) ou um tempo em ms — fechar a janela deslizando mandava um número e quebrava ("e.then is not a function") */
function termina(promessa, fim) {
  let feito = false; const f = () => { if (feito) return Promise.resolve(); feito = true; acabando = null; return Promise.resolve(fim()); };
  acabando = f;
  const p = promessa && typeof promessa.then === 'function' ? promessa : new Promise((r) => setTimeout(r, Number(promessa) || 0));
  p.then(f, f);
}
function voltaAba() {
  const { view, lados, w, dx } = g, ms = calmo() ? 0 : 240;
  const tudo = [corre(view, dx, 0, ms), ...Object.entries(lados).map(([d, n]) => corre(n, dx + d * w, d * w, ms))];
  termina(Promise.all(tudo), () => { limpaView(view); Object.values(lados).forEach((n) => n.remove()); });
}
function vaiAba(dir, id, v) {
  const { view, lados, w, dx } = g, n = lado(id, dir), ms = calmo() ? 0 : Math.max(170, Math.min(320, (w - Math.abs(dx)) / Math.max(1.2, Math.abs(v))));
  pintaAba(); void n.offsetWidth;
  if (lados[-dir]) { lados[-dir].remove(); delete lados[-dir]; }
  abas.marca(id); try { navigator.vibrate && navigator.vibrate(6); } catch { /* ok */ }
  const anda = Promise.all([corre(view, dx, -dir * w, ms), corre(n, dx + dir * w, 0, ms)]);
  termina(anda, async () => {
    // a prévia cobre a tela, a aba de verdade é desenhada por baixo e só então a prévia sai:
    // assim a tela nunca "volta" para o lugar à vista da pessoa
    n.classList.add('is-cobre'); n.style.transform = 'translate3d(0,0,0)';
    view.style.transition = 'none'; view.style.transform = `translate3d(${-dir * w}px,0,0)`;
    abas.vai(id);
    await doisQuadros();
    limpaView(view); n.remove();
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
  if (!g) return; const era = g; soltaPre(g.pre); if (!g.trava) { limpaPrevias(); g = null; return; }
  const f = e && e.changedTouches && e.changedTouches[0]; if (f && Math.abs(f.clientX - g.pts[g.pts.length - 1][1]) > 1) { g.dx = f.clientX - g.x; g.pts.push([performance.now(), f.clientX]); }
  if (g.raf) cancelAnimationFrame(g.raf); fimToque = Date.now();
  const v = vel(), longe = Math.abs(g.dx) > g.w * 0.36;
  if (g.tipo === 'folha') { if (g.dx > 24 && (longe || v > 0.4) && v > -0.2) fechaFolha(v); else voltaFolha(); } else {
    const dir = g.dx < 0 ? 1 : -1, id = dir > 0 ? g.prox : g.ant, aFavor = -dir * v;
    if (id && (longe ? aFavor > -0.25 : aFavor > 0.3 && Math.abs(g.dx) > 24)) vaiAba(dir, id, v); else voltaAba();
  }
  if (g === era) g = null;
}
