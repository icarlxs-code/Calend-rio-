/* Lembra Motion 2 · liga as animações ao app. Carregado pelo app.js depois que a agenda abre.
   Se algo aqui falhar, o app segue funcionando como antes (cada gancho tem o caminho antigo). */
import * as LM from './lembra-motion.js';

const fora = () => document.body.classList.contains('is-client') || !!document.querySelector('.paywall, .termsgate, .photogate');
const TOQUE = '.btn, .iconbtn, .tabbar__btn, .tabbar__fab, .chip, .pchip, .arow--btn, .prow__check, .ecard__check, .seg__btn, .seg3__btn, .whobtn, .fixbtn';
let baixo = null;

/* toque: afunda de leve e volta macio */
addEventListener('pointerdown', (e) => {
  const b = e.target.closest && e.target.closest(TOQUE);
  if (!b || b.disabled || LM.reduzido()) return;
  if (baixo && baixo !== b) baixo.classList.remove('is-baixo', 'is-solto', 'lm-toque');
  b.classList.remove('is-solto'); b.classList.add('lm-toque', 'is-baixo'); baixo = b;
}, { passive: true, capture: true });
const solta = () => {
  const b = baixo; baixo = null;
  if (!b) return;
  b.classList.add('is-solto'); b.classList.remove('is-baixo');
  setTimeout(() => { if (b !== baixo) b.classList.remove('is-solto', 'lm-toque'); }, 300);
};
['pointerup', 'pointercancel', 'dragend', 'blur'].forEach((n) => addEventListener(n, solta, { passive: true, capture: true }));
document.addEventListener('click', (e) => {
  if (!e.target.closest || e.defaultPrevented || LM.reduzido() || fora()) return;
  const b = e.target.closest('.btn--primary, .btn--danger');
  if (b && !b.disabled && e.clientX) LM.gota(b, e.clientX, e.clientY);
}, true);
(window.requestIdleCallback || ((f) => setTimeout(f, 900)))(() => { if (!LM.reduzido()) LM.aquecer(); });

/* ---- ganchos usados pelo app ---- */
const pronto = () => !LM.reduzido() && !fora();
/** troca de aba: `fazer` sempre roda, com ou sem animação */
function trocar(aba, fazer, origem, mesma) {
  if (mesma || !pronto() || document.querySelector('.sheet-wrap.is-open')) return LM.direto(aba, fazer);
  let rodou = false;
  const uma = () => { if (!rodou) { rodou = true; fazer(); } };
  try { LM.trocar(aba, uma, origem); } catch (e) { console.warn('motion', e); LM.direto(aba, uma); }
}
const guardar = (el) => (el && pronto() ? { clone: el.cloneNode(true), rect: el.getBoundingClientRect() } : null);
const sai = (tipo) => (g) => { if (g) LM.saiDeCena(g, tipo).catch(() => {}); };
const concluido = (rect) => { if (pronto() && rect) LM.anelDeFeito(rect).catch(() => {}); };
/** o "+XP" do app termina indo até a foto do perfil */
function voarXp(el) {
  if (!pronto()) return;
  setTimeout(() => {
    const p = document.querySelector('.iconbtn--me, #view [data-action="profile"]'), a = p && p.getBoundingClientRect();
    if (!el.isConnected || !a || !a.width || a.bottom < 0 || a.top > innerHeight) return;
    const r = el.getBoundingClientRect();
    el.animate([{ transform: 'translateX(-50%)', opacity: 1 }, { transform: `translate(calc(-50% + ${a.left + a.width / 2 - r.left - r.width / 2}px), ${a.top + a.height / 2 - r.top - r.height / 2}px) scale(.3)`, opacity: 0 }], { duration: 560, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' })
      .finished.then(() => { if (p.isConnected) LM.pula(p); }).catch(() => {});
  }, 950);
}
const mundo = (...a) => LM.mundo(...a);
/* a tela recua quando uma folha abre (só quando nada fixo mora dentro dela) */
const raiz = document.getElementById('sheets');
if (raiz) new MutationObserver(() => {
  const aberta = raiz.childElementCount > 0 && !LM.reduzido(), b = document.body, tem = b.classList.contains('lm-recua');
  if (aberta === tem) return;
  if (aberta) document.documentElement.style.setProperty('--oy', `${scrollY + innerHeight / 2}px`);
  b.classList.toggle('lm-recua', aberta); b.classList.toggle('lm-volta', !aberta);
  if (!aberta) setTimeout(() => b.classList.remove('lm-volta'), 400);
}).observe(raiz, { childList: true });
const antes = (el) => (pronto() ? LM.antes(el) : null);
const concluir = (s) => { if (s) LM.concluir(s).catch(() => {}); };
window.__motion = { pronto, antes, concluir, trocar, mundo, chuva: (...a) => LM.chuva(...a), agendado: LM.agendado, guardar, excluido: sai('excluido'), adiado: sai('adiado'), concluido, voarXp };
