/* Lembra Motion 2 · transições suaves, na paleta do app, com o Lembra participando.
   Regra de desempenho: só transform e opacity, em camadas prontas (a placa de vídeo anima sozinha,
   mesmo enquanto o app monta a tela). Nada de clonar a tela nem redesenhar o mascote a cada quadro. */
import { mascoteParado } from './mascote.js';
import { som } from './sons.js';

const SAI = 'cubic-bezier(.4,0,.2,1)', ENTRA = 'cubic-bezier(.16,1,.3,1)', ARCO = 'cubic-bezier(.33,0,.2,1)';
/** menos movimento: preferência do aparelho ou Ajustes → Animações */
export const reduzido = () => { try { if (localStorage.getItem('lembra.motion') === '0') return true; } catch { /* ok */ } return matchMedia('(prefers-reduced-motion: reduce)').matches; };
const anima = (el, q, o) => { const a = el.animate(q, { easing: ENTRA, fill: 'both', ...o }); return a.finished.catch(() => {}); };
const passageiro = (el, q, o) => el.animate(q, { easing: ENTRA, fill: 'backwards', ...o }); // em elemento do app: não deixa nada preso
const meio = (x) => { const r = x.getBoundingClientRect ? x.getBoundingClientRect() : x; return [r.left + r.width / 2, r.top + r.height / 2, r.top]; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- o Lembra em imagens prontas (desenhadas uma vez só) ---------- */
const CHEGADA = { hoje: 'acena', mes: 'aponta', empresas: 'joia', ajustes: 'pensa', 'p-hoje': 'amor', 'p-agenda': 'aponta', 'p-listas': 'joia', 'p-notas': 'pensa', 'p-ajustes': 'pensa' };
const fotos = {};
const figura = (pose) => fotos[pose] || (fotos[pose] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(mascoteParado(pose, 160).replace(/<svg(?![^>]*xmlns=)/, '<svg xmlns="http://www.w3.org/2000/svg"')));

/* ---------- palco fixo, criado uma vez ---------- */
let P = null;
function palco() {
  if (P && P.raiz.isConnected) return P;
  const raiz = document.createElement('div');
  raiz.className = 'lm-palco'; raiz.setAttribute('aria-hidden', 'true');
  raiz.innerHTML = '<div class="lm-brilho"></div><div class="lm-sombra"></div><div class="lm-x"><div class="lm-y"><img class="lm-a" alt=""><img class="lm-b" alt=""></div></div>';
  document.body.appendChild(raiz);
  const q = (s) => raiz.querySelector(s);
  P = { raiz, brilho: q('.lm-brilho'), sombra: q('.lm-sombra'), x: q('.lm-x'), y: q('.lm-y'), a: q('.lm-a'), b: q('.lm-b') };
  P.a.src = figura('voa');
  return P;
}
/** deixa as imagens decodificadas antes do primeiro toque */
export function aquecer() {
  const p = palco();
  const lista = [...new Set(Object.values(CHEGADA))];
  lista.forEach((pose, i) => setTimeout(() => { const im = new Image(); im.src = figura(pose); im.decode && im.decode().catch(() => {}); fotos['_' + pose] = im; }, 60 * i));
  p.a.decode && p.a.decode().catch(() => {});
}

/* ---------- 1 · troca de página ---------- */
let vez = 0, pendente = 0, vivas = [], fimT = 0, ultimaAba = '';
const ORDEM = ['hoje', 'p-hoje', 'mes', 'p-agenda', 'p-listas', 'p-notas', 'empresas', 'ajustes', 'p-ajustes'];
const toca = (el, q, o) => { const a = el.animate(q, { easing: ENTRA, fill: 'both', ...o }); vivas.push(a); return a; };
function para() { clearTimeout(pendente); clearTimeout(fimT); pendente = 0; vivas.forEach((a) => { try { a.cancel(); } catch { /* ok */ } }); vivas = []; document.documentElement.classList.remove('lm-viajando'); }
const ativa = () => document.querySelector('.tabbar .tabbar__btn.is-on');

export function trocar(aba, fazer, origem) {
  const view = document.getElementById('view');
  const minha = ++vez, de = ativa(), dir = ORDEM.indexOf(aba) >= ORDEM.indexOf(ultimaAba || (de && de.dataset.tab)) ? 1 : -1;
  para(); ultimaAba = aba;
  const p = palco(), larg = innerWidth, alt = innerHeight;
  const alvo = document.querySelector(`.tabbar [data-tab="${aba}"]`) || origem || de;
  // o botão responde na hora, antes de a tela ser montada
  if (alvo && alvo.closest('.tabbar')) document.querySelectorAll('.tabbar__btn').forEach((b) => b.classList.toggle('is-on', b === alvo));
  const [x1, , topo1] = alvo ? meio(alvo) : [larg / 2, 0, alt - 70];
  const [x0, , topo0] = de ? meio(de) : [x1, 0, topo1];
  const barra = document.querySelector('.tabbar'), chao = (barra ? barra.getBoundingClientRect().top : Math.min(topo0, topo1)) + 9;
  document.documentElement.classList.add('lm-viajando'); // o companheiro do canto dá licença: é ele quem está pulando

  // brilho suave na cor do app, acompanhando o Lembra
  toca(p.brilho, [
    { transform: `translate3d(${x0 - 260}px, ${chao - 260}px, 0) scale(.5)`, opacity: 0 },
    { transform: `translate3d(${(x0 + x1) / 2 - 260}px, ${chao - 300}px, 0) scale(1.15)`, opacity: 1, offset: 0.42 },
    { transform: `translate3d(${x1 - 260}px, ${chao - 270}px, 0) scale(1.7)`, opacity: 0 },
  ], { duration: 760, easing: ARCO });

  // o Lembra pula de uma aba para a outra
  const longe = Math.abs(x1 - x0), salto = 44 + Math.min(46, longe * 0.2), T = 400 + Math.min(90, longe * 0.3);
  p.b.src = figura(CHEGADA[aba] || 'acena');
  toca(p.x, [{ transform: `translate3d(${x0 - 36}px, ${chao - 72}px, 0)` }, { transform: `translate3d(${x1 - 36}px, ${chao - 72}px, 0)` }], { duration: T, easing: 'cubic-bezier(.4,.1,.3,1)' });
  toca(p.y, [
    { transform: 'translate3d(0, 34px, 0) scale(.55)', opacity: 0, easing: 'cubic-bezier(.2,.7,.3,1)' },
    { transform: `translate3d(0, ${-salto}px, 0) scale(1) rotate(${dir * 7}deg)`, opacity: 1, offset: 0.27, easing: 'cubic-bezier(.6,0,.75,.5)' },
    { transform: 'translate3d(0, 0, 0) scale(1.06, .93)', opacity: 1, offset: 0.49, easing: 'cubic-bezier(.2,.8,.3,1)' },
    { transform: 'translate3d(0, -5px, 0) scale(.99, 1.02)', opacity: 1, offset: 0.6, easing: 'ease-in-out' },
    { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1, offset: 0.74, easing: 'cubic-bezier(.5,0,.8,.4)' },
    { transform: 'translate3d(0, 46px, 0) scale(.7)', opacity: 0 },
  ], { duration: T * 2.05, easing: 'linear' });
  toca(p.a, [{ opacity: 1 }, { opacity: 1, offset: 0.43 }, { opacity: 0, offset: 0.52 }, { opacity: 0 }], { duration: T * 2.05, easing: 'linear' });
  toca(p.b, [{ opacity: 0 }, { opacity: 0, offset: 0.43 }, { opacity: 1, offset: 0.52 }, { opacity: 1 }], { duration: T * 2.05, easing: 'linear' });
  toca(p.sombra, [{ transform: `translate3d(${x0 - 24}px, ${chao - 5}px, 0) scale(.5)`, opacity: 0 }, { transform: `translate3d(${(x0 + x1) / 2 - 24}px, ${chao - 5}px, 0) scale(.55)`, opacity: 0.35, offset: 0.27 }, { transform: `translate3d(${x1 - 24}px, ${chao - 5}px, 0) scale(1)`, opacity: 1, offset: 0.49 }, { transform: `translate3d(${x1 - 24}px, ${chao - 5}px, 0) scale(1)`, opacity: 1, offset: 0.74 }, { transform: `translate3d(${x1 - 24}px, ${chao - 5}px, 0) scale(.5)`, opacity: 0 }], { duration: T * 2.05, easing: 'linear' });
  fimT = setTimeout(() => { if (minha === vez) para(); }, T * 2.05 + 60);

  // a página sai de leve… e a nova chega na direção do pulo
  if (view) toca(view, [{ opacity: 1 }, { opacity: 0.1 }], { duration: 90, easing: SAI });
  pendente = setTimeout(() => {
    pendente = 0;
    const sai = vivas.filter((a) => a.effect && a.effect.target === view);
    try { fazer(); } finally {
      const nova = document.getElementById('view') || view;
      if (nova) {
        nova.querySelectorAll('.page').forEach((n) => { n.style.animation = 'none'; }); // a entrada antiga do app não roda junto
        sai.forEach((a) => a.cancel());
        toca(nova, [{ opacity: 0.1 }, { opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'backwards' });
        const pg = nova.querySelector('.page');
        if (pg) toca(pg, [{ transform: `translate3d(${dir * 26}px, 0, 0)` }, { transform: 'translate3d(0, 0, 0)' }], { duration: 460, fill: 'backwards' });
      }
    }
    som('toque');
  }, 90);
}
/** tocou na aba em que já está (ou a animação foi desligada): cancela o que estiver no ar e faz */
export function direto(aba, fazer) { vez++; para(); ultimaAba = aba; fazer(); }

/* ---------- 2 · botões ---------- */
export function gota(el, x, y) {
  const r = el.getBoundingClientRect(), g = document.createElement('div'), i = document.createElement('i');
  g.className = 'lm-gota';
  Object.assign(g.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: getComputedStyle(el).borderRadius });
  Object.assign(i.style, { left: x - r.left + 'px', top: y - r.top + 'px' });
  g.appendChild(i); document.body.appendChild(g);
  anima(i, [{ transform: 'scale(.2)', opacity: 0.5 }, { transform: 'scale(1)', opacity: 0 }], { duration: 520 }).then(() => g.remove());
}
const pula = (el) => passageiro(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.1)', offset: 0.4 }, { transform: 'scale(1)' }], { duration: 360, easing: 'ease-in-out' });
export { pula };

/* ---------- 3 · agendamento ---------- */
function camada() { const c = document.createElement('div'); c.className = 'lm-camada'; c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c); return c; }
const diaAlvo = (d) => (d && [...document.querySelectorAll('#view [data-date], #view [data-k]')].find((e) => (e.dataset.date || e.dataset.k) === d && e.getClientRects().length)) || document.querySelector('.tabbar [data-tab="mes"], .tabbar [data-tab="p-agenda"]');
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
/** o Lembra surge, mostra o bilhete e o manda para o dia */
export async function agendado({ titulo = 'Compromisso', quando = '', dia } = {}) {
  const c = camada();
  try {
    const x0 = innerWidth / 2, y0 = innerHeight * 0.56, alvo = diaAlvo(dia), a = alvo ? meio(alvo) : [x0, 110];
    const visivel = a[1] > 0 && a[1] < innerHeight, [x1, y1] = visivel ? a : [x0, 110];
    c.innerHTML = `<div class="lm-cartao"><img alt="" src="${figura('joia')}"><div><b>Deixa comigo!</b><span>${esc(titulo)}</span>${quando ? `<small>${esc(quando)}</small>` : ''}</div></div>`;
    const b = c.firstElementChild, em = (dx, dy, s) => `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%) scale(${s})`;
    som('estouro');
    await anima(b, [{ transform: em(x0, y0 + 40, 0.94), opacity: 0 }, { transform: em(x0, y0, 1), opacity: 1 }], { duration: 420 });
    await espera(900);
    som('dimdom');
    await anima(b, [{ transform: em(x0, y0, 1), opacity: 1 }, { transform: em(x0 + (x1 - x0) * 0.35, y0 + (y1 - y0) * 0.35, 0.7), opacity: 1, offset: 0.4 }, { transform: em(x1, y1, 0.08), opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.5,0,.2,1)' });
    if (alvo && visivel) pula(alvo);
    try { navigator.vibrate && navigator.vibrate(10); } catch { /* ok */ }
  } finally { c.remove(); }
}
/** cartão guardado sai de cena (o aviso com "Desfazer" é do app) */
export async function saiDeCena({ clone, rect: r }, tipo) {
  const c = camada();
  Object.assign(clone.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', margin: 0 });
  c.appendChild(clone);
  await anima(clone, [{ transform: 'none', opacity: 1 }, { transform: tipo === 'adiado' ? 'translate3d(70px, 0, 0)' : 'translate3d(0, 18px, 0) scale(.92)', opacity: 0 }], { duration: 320, easing: SAI });
  c.remove();
}
export async function anelDeFeito(r) {
  const c = camada(), [x, y] = meio(r), n = document.createElement('div');
  n.className = 'lm-anel'; Object.assign(n.style, { left: x - 44 + 'px', top: y - 44 + 'px' }); c.appendChild(n);
  await anima(n, [{ transform: 'scale(.3)', opacity: 0.9 }, { transform: 'scale(1)', opacity: 0 }], { duration: 620 });
  c.remove();
}
