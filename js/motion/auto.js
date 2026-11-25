/* Lembra Motion · liga as animações ao app. Carregado pelo app.js depois que a agenda abre.
   Se algo aqui falhar, o app segue funcionando como antes (cada gancho tem o caminho antigo). */
import * as LM from './lembra-motion.js';

const { botao, agenda } = LM;
const fora = () => document.body.classList.contains('is-client') || !!document.querySelector('.paywall, .termsgate, .photogate');
const TOQUE = '.btn, .iconbtn, .tabbar__btn, .tabbar__fab, .chip, .pchip, .list__row, .arow--btn, .prow__check, .ecard__check, .seg__btn, .seg3__btn, .whobtn, .fixbtn';
const ICONE = { hoje: 'sol', 'p-hoje': 'sol', mes: 'folha', 'p-agenda': 'folha', empresas: 'predio', ajustes: 'engrenagem', 'p-ajustes': 'engrenagem', 'p-listas': 'lista' };
let baixo = null;

/* toque: afunda no dedo, volta com mola */
addEventListener('pointerdown', (e) => {
  if (LM.reduzido()) return;
  const b = e.target.closest && e.target.closest(TOQUE);
  if (!b || b.disabled) return;
  if (baixo && baixo !== b) baixo.classList.remove('is-baixo', 'is-solto', 'lm-toque');
  b.classList.remove('is-solto'); b.classList.add('lm-toque'); void b.offsetWidth; b.classList.add('is-baixo'); baixo = b;
}, { passive: true, capture: true });
const solta = () => {
  const b = baixo; baixo = null;
  if (!b) return;
  b.classList.add('is-solto'); b.classList.remove('is-baixo');
  setTimeout(() => { if (b !== baixo) b.classList.remove('is-solto', 'lm-toque'); }, 440);
};
['pointerup', 'pointercancel', 'dragend', 'blur'].forEach((n) => addEventListener(n, solta, { passive: true, capture: true }));

document.addEventListener('click', (e) => {
  const alvo = e.target;
  if (!alvo.closest || e.defaultPrevented || LM.reduzido() || fora()) return;
  const cheio = alvo.closest('.btn--primary, .btn--danger, .btn--soft');
  if (cheio && !cheio.disabled && e.clientX) botao.gota(cheio, e.clientX, e.clientY);
  const f = alvo.closest('.tabbar__fab');
  if (f) { f.classList.remove('lm-fab'); void f.offsetWidth; f.classList.add('lm-fab'); botao.abrirNovo(f); }
  const aba = alvo.closest('.tabbar [data-tab]'), ic = aba && ICONE[aba.dataset.tab];
  if (ic) { const k = 'lm-tab-' + ic; aba.classList.remove(k); void aba.offsetWidth; aba.classList.add(k); setTimeout(() => aba.classList.remove(k), 700); }
}, true);

/* folhas (novo compromisso, perfil…): o conteúdo sobe em cascata */
const raiz = document.getElementById('sheets');
if (raiz) new MutationObserver((rs) => {
  if (LM.reduzido()) return;
  for (const r of rs) for (const n of r.addedNodes) {
    if (n.nodeType !== 1 || !n.matches('.sheet-wrap')) continue;
    const s = n.querySelector('.sheet__inner');
    if (!s) continue;
    let itens = [...s.querySelectorAll('.form > *, .page > *')];
    if (!itens.length) itens = [...s.children];
    itens.filter((x) => !x.matches('.sheet__head')).slice(0, 8).forEach((el, i) => el.animate([{ transform: 'translateY(18px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 340, delay: 60 + i * 32, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }));
  }
}).observe(raiz, { childList: true });

/* ---- ganchos usados pelo app ---- */
export const pronto = () => !LM.reduzido() && !fora();
/** troca de aba: `fazer` sempre roda, com ou sem animação */
export function trocar(aba, fazer, origem) {
  if (!pronto() || document.querySelector('.sheet-wrap.is-open')) return fazer();
  let rodou = false;
  const uma = () => { if (!rodou) { rodou = true; fazer(); } };
  LM.trocar(aba, uma, origem).catch((e) => { console.warn('motion', e); uma(); });
}
const agendado = (o) => agenda.agendado(o);
/** guarda a aparência de um cartão antes de a tela ser redesenhada */
const guardar = (el) => (el && pronto() ? { clone: el.cloneNode(true), rect: el.getBoundingClientRect() } : null);
const excluido = (g) => { if (g) agenda.saiDeCena(g, 'excluido').catch(() => {}); };
const adiado = (g) => { if (g) agenda.saiDeCena(g, 'adiado').catch(() => {}); };
/** anel verde em volta do ✓ (faíscas, som e XP já são do app) */
const concluido = (rect) => { if (pronto() && rect) agenda.anelDeFeito(rect).catch(() => {}); };
/** o "+XP" do app termina voando até a foto do perfil */
function voarXp(el) {
  if (!pronto()) return;
  setTimeout(() => {
    const p = document.querySelector('.iconbtn--me, #view [data-action="profile"]'), a = p && p.getBoundingClientRect();
    if (!el.isConnected || !a || !a.width || a.bottom < 0 || a.top > innerHeight) return;
    const r = el.getBoundingClientRect();
    el.animate([{ transform: 'translateX(-50%)', opacity: 1 }, { transform: `translate(calc(-50% + ${a.left + a.width / 2 - r.left - r.width / 2}px), ${a.top + a.height / 2 - r.top - r.height / 2}px) scale(.3)`, opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' })
      .finished.then(() => { if (p.isConnected) botao.pula(p); }).catch(() => {});
  }, 950);
}
window.__motion = { pronto, trocar, agendado, guardar, excluido, adiado, concluido, voarXp };
