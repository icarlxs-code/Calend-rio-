/* Lembra Motion 2 · transições suaves, na paleta do app, com o Lembra participando.
   Regra de desempenho: só transform e opacity, em camadas prontas (a placa de vídeo anima sozinha,
   mesmo enquanto o app monta a tela). Nada de clonar a tela nem redesenhar o mascote a cada quadro. */
import { prepara, tem3d, toca as toca3d } from './palco3d.js';
import { som } from './sons.js';
import { passo, chime, pulso, abreMundo, pouso, carimbo as somCarimbo } from '../sound.js';

const SAI = 'cubic-bezier(.4,0,.2,1)', ENTRA = 'cubic-bezier(.16,1,.3,1)', ARCO = 'cubic-bezier(.33,0,.2,1)';
/** menos movimento: preferência do aparelho ou Ajustes → Animações */
export const reduzido = () => { try { if (localStorage.getItem('lembra.motion') === '0') return true; } catch { /* ok */ } return matchMedia('(prefers-reduced-motion: reduce)').matches; };
const anima = (el, q, o) => { const a = el.animate(q, { easing: ENTRA, fill: 'both', ...o }); return a.finished.catch(() => {}); };
const passageiro = (el, q, o) => el.animate(q, { easing: ENTRA, fill: 'backwards', ...o }); // em elemento do app: não deixa nada preso
const meio = (x) => { const r = x.getBoundingClientRect ? x.getBoundingClientRect() : x; return [r.left + r.width / 2, r.top + r.height / 2, r.top]; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- o Lembra em imagens prontas (desenhadas uma vez só) ---------- */
const CHEGADA = { hoje: 'acena', mes: 'aponta', empresas: 'joia', ajustes: 'pensa', 'p-hoje': 'amor', 'p-agenda': 'aponta', 'p-listas': 'joia', 'p-notas': 'pensa', 'p-ajustes': 'pensa' };
const figura = (pose) => `assets/mascot/3d/${pose}.webp`;

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
  ['voa', 'joia', ...new Set(Object.values(CHEGADA))].forEach((pose, i) => setTimeout(() => { const im = new Image(); im.src = figura(pose); im.decode && im.decode().catch(() => {}); guardadas.push(im); }, 120 * i));
  p.a.decode && p.a.decode().catch(() => {});
  setTimeout(prepara, 2600);
}
const guardadas = [];

/* ---------- 1 · troca de página ---------- */
const ORDEM_SOM = ['hoje', 'mes', 'empresas', 'ajustes'].concat(['p-hoje', 'p-agenda', 'p-listas', 'p-ajustes']);
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

  // a pílula da aba desliza de uma para a outra (não pisca de lugar)
  if (alvo && de && alvo !== de && alvo.closest('.tabbar')) { try { toca(alvo, [{ transform: `translate3d(${x0 - x1}px, 0, 0)` }, { transform: 'translate3d(0, 0, 0)' }], { duration: 420, pseudoElement: '::before' }); } catch { /* navegador antigo: só troca */ } }
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
    passo(Math.max(0, ORDEM_SOM.indexOf(aba)));
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
/** o Lembra aparece atrás do cartão, solta a piada, carimba e o cartão voa até o dia */
export async function agendado({ titulo = 'Compromisso', quando = '', dia, frase = '' } = {}) {
  const c = camada(); c.classList.add('lm-camada--fundo');
  try {
    const x0 = innerWidth / 2, y0 = innerHeight * 0.52, alvo = diaAlvo(dia), a = alvo ? meio(alvo) : [x0, 110], visivel = a[1] > 0 && a[1] < innerHeight, [x1, y1] = visivel ? a : [x0, 110];
    const dito = frase || 'Deixa comigo!';
    c.innerHTML = `<div class="lm-marca"><img alt="" src="${figura('joia')}"><b>${esc(dito)}</b><div><span>${esc(titulo)}${quando ? `<small>${esc(quando)}</small>` : ''}</span><i class="lm-selo2">${SINO}</i></div></div>`;
    const b = c.firstElementChild, img = b.querySelector('img'), selo = b.querySelector('.lm-selo2');
    const em = (dx, dy, s, rx = 0, rz = 0) => `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%) rotateX(${rx}deg) rotate(${rz}deg) scale(${s})`;
    img.decode && await Promise.race([img.decode().catch(() => {}), espera(160)]);
    som('estouro');
    anima(img, [{ transform: 'translateY(120px) scale(.7, .6)' }, { transform: 'translateY(-16px) scale(.98, 1.06)', offset: 0.5 }, { transform: 'translateY(4px) scale(1.03, .96)', offset: 0.75 }, { transform: 'none' }], { duration: 640, delay: 180 });
    anima(selo, [{ transform: 'scale(2.6) rotate(24deg)', opacity: 0 }, { transform: 'scale(2.6) rotate(24deg)', opacity: 1, offset: 0.1 }, { transform: 'scale(.86) rotate(-8deg)', opacity: 1, offset: 0.55 }, { transform: 'scale(1) rotate(-8deg)', opacity: 1 }], { duration: 380, delay: 620, easing: 'cubic-bezier(.6,0,.4,1)' });
    setTimeout(() => { somCarimbo(); try { navigator.vibrate && navigator.vibrate(18); } catch { /* ok */ } b.animate([{ translate: '0 0' }, { translate: '0 5px' }, { translate: '0 -2px' }, { translate: '0 0' }], { duration: 180 }); }, 830);
    await anima(b, [{ transform: em(x0, y0 + 150, 0.86, 58), opacity: 0 }, { transform: em(x0, y0 - 6, 1.02, -6), opacity: 1, offset: 0.62 }, { transform: em(x0, y0, 1), opacity: 1 }], { duration: 520 });
    await espera(Math.min(2400, 900 + dito.length * 24));
    som('dimdom'); c.classList.add('is-fim');
    anima(img, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(70px) scale(.6)', opacity: 0 }], { duration: 200, easing: SAI });
    await anima(b, [{ transform: em(x0, y0, 1), opacity: 1 }, { transform: em(x0, y0 + 14, 0.94, 0, 2), opacity: 1, offset: 0.18 }, { transform: em(x0 + (x1 - x0) * 0.45, y0 + (y1 - y0) * 0.45 - 30, 0.56, 34, -8), opacity: 1, offset: 0.6 }, { transform: em(x1, y1, 0.07, 60, -20), opacity: 0 }], { duration: 560, easing: 'cubic-bezier(.5,0,.25,1)' });
    if (alvo && visivel) { pula(alvo); anelDeFeito(alvo.getBoundingClientRect(), '#FF6B1A'); }
    try { navigator.vibrate && navigator.vibrate(10); } catch { /* ok */ }
  } finally { c.remove(); }
}
const SINO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.6 2H4.4Z"/><path d="M10 21h4M12 3v2"/></svg>';
/** cartão guardado sai de cena (o aviso com "Desfazer" é do app) */
export async function saiDeCena({ clone, rect: r }, tipo) {
  const c = camada();
  Object.assign(clone.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', margin: 0 });
  c.appendChild(clone);
  await anima(clone, [{ transform: 'none', opacity: 1 }, { transform: tipo === 'adiado' ? 'translate3d(70px, 0, 0)' : 'translate3d(0, 18px, 0) scale(.92)', opacity: 0 }], { duration: 320, easing: SAI });
  c.remove();
}
export async function anelDeFeito(r, cor = '') {
  const c = camada(), [x, y] = meio(r), n = document.createElement('div');
  n.className = 'lm-anel'; if (cor) n.style.borderColor = cor; Object.assign(n.style, { left: x - 44 + 'px', top: y - 44 + 'px' }); c.appendChild(n);
  await anima(n, [{ transform: 'scale(.3)', opacity: 0.9 }, { transform: 'scale(1)', opacity: 0 }], { duration: 620 });
  c.remove();
}

/* ---------- 4 · Trabalho <-> Pessoal ----------
   A cor nasce do botão e cobre a tela; o Lembra chega com o objeto do mundo novo (maleta ou coração),
   dá meia-volta trocando um pelo outro e a cortina sobe levando ele junto. Só transform e opacity. */
const OBJ = {
  work: '<svg viewBox="0 0 64 64"><rect x="6" y="20" width="52" height="36" rx="9" fill="#8A3B12"/><path d="M23 20v-4a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v4" fill="none" stroke="#8A3B12" stroke-width="6"/><path d="M6 34h52" stroke="#5E2407" stroke-width="5"/><rect x="26" y="29" width="12" height="11" rx="4" fill="#FFC23D"/></svg>',
  personal: '<svg viewBox="0 0 64 64"><path d="M32 57C10 42 5 31 5 22 5 13 12 7 19 7c6 0 10 3 13 8 3-5 7-8 13-8 7 0 14 6 14 15 0 9-5 20-27 35Z" fill="#FF4F6D"/><path d="M15 20c0-4 3-6 6-6" stroke="#fff" stroke-opacity=".75" stroke-width="5" stroke-linecap="round" fill="none"/></svg>',
};
/** a passagem entre Trabalho e Pessoal: em 3D quando o aparelho permite; senão, a versão leve */
export function mundo(...a) { return tem3d() ? mundo3d(...a) : (prepara(), mundo2d(...a)); }
async function mundo3d(space, from, trocaTela, cor = () => {}, barra = []) {
  vez++; para();
  const v = document.createElement('div'), pess = space === 'personal';
  v.className = `spaceveil lm-m3 lm-m3--${space}`; v.setAttribute('role', 'status');
  v.innerHTML = `<p><b>${pess ? 'Pessoal' : 'Trabalho'}</b><small>${pess ? 'Só você vê' : 'Bora resolver'}</small></p>`;
  document.body.appendChild(v);
  document.documentElement.classList.add('lm-viajando');
  const [x, y] = from ? meio(from) : [innerWidth / 2, 60], comp = document.querySelector('.snhbud__fig'), r = comp && comp.getBoundingClientRect();
  const casa = r && r.width ? [lim(r.left + r.width / 2, 48, innerWidth - 48), lim(r.top + r.height / 2, 120, innerHeight - 110)] : [innerWidth - 52, innerHeight - 130];
  // a primeira do dia é completa; as seguintes, mais rápidas (quem troca muito não espera)
  let n = 0; try { const k = 'lembra.m3', d = new Date().toDateString(), o = JSON.parse(localStorage.getItem(k) || '{}'); n = o.d === d ? o.n : 0; localStorage.setItem(k, JSON.stringify({ d, n: n + 1 })); } catch { /* ok */ }
  let trocou = false;
  const troca = () => { if (!trocou) { trocou = true; trocaTela(); } }, vib = (q) => { try { navigator.vibrate && navigator.vibrate(q); } catch { /* ok */ } }, t = v.querySelector('b'), sub = v.querySelector('small');
  v.onclick = () => toca3d.pula && toca3d.pula();
  try {
    await toca3d({ mundo: space, x, y, fx: casa[0], fy: casa[1] }, n < 1 ? 1 : n < 4 ? 1.25 : 1.5, (m) => {
      if (m === 'bate') { vib(14); pulso(); }
      else if (m === 'cobriu') { cor(pess ? '#FFD9B8' : '#3A1608'); troca(); }
      else if (m === 'abre') { vib([12, 40, 20]); abreMundo(space); }
      else if (m === 'pousa') { vib(16); pouso(); anima(t, [{ transform: 'translateY(26px) scale(.8)', opacity: 0 }, { transform: 'translateY(-4px) scale(1.04)', opacity: 1, offset: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 420 }); anima(sub, [{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, delay: 110 }); }
      else if (m === 'sai') {
        cor(...barra);
        [t, sub].forEach((e) => anima(e, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-14px)' }], { duration: 180 }));
        const nova = document.getElementById('view'), ab = document.querySelector('.tabbar');
        if (nova) passageiro(nova, [{ transform: 'scale(.94)', opacity: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 560 });
        if (ab) passageiro(ab, [{ transform: 'translate3d(0, 110px, 0)' }, { transform: 'none' }], { duration: 520, delay: 160 });
      }
    });
  } finally { troca(); cor(...barra); v.remove(); document.documentElement.classList.remove('lm-viajando'); }
}
const lim = (x, a, b) => Math.max(a, Math.min(b, x));
async function mundo2d(space, from, trocaTela, cor = () => {}, barra = []) {
  vez++; para(); chime(space);
  const c = document.createElement('div');
  c.className = `spaceveil lm-mundo lm-mundo--${space}`;
  c.innerHTML = `<div class="lm-cortina"><i class="lm-onda"></i></div><div class="lm-tinta"></div><div class="lm-cena"><div class="lm-cena__sombra"></div><div class="lm-cena__x"><img class="lm-cena__a" alt="" src="${figura('voa')}"><img class="lm-cena__b" alt="" src="${figura(space === 'personal' ? 'amor' : 'joia')}"></div><span class="lm-cena__de">${OBJ[space === 'work' ? 'personal' : 'work']}</span><span class="lm-cena__para">${OBJ[space]}</span><b>${space === 'personal' ? 'Pessoal' : 'Trabalho'}</b><small>${space === 'personal' ? 'Só você vê' : 'Bora resolver'}</small></div>`;
  document.body.appendChild(c);
  document.documentElement.classList.add('lm-viajando');
  const q = (s) => c.querySelector(s), tinta = q('.lm-tinta'), cortina = q('.lm-cortina'), cena = q('.lm-cena'), boneco = q('.lm-cena__x');
  const [x, y] = from ? meio(from) : [innerWidth / 2, 60], R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 30;
  let trocou = false;
  const troca = () => { if (!trocou) { trocou = true; trocaTela(); } };
  const fim = setTimeout(() => { troca(); c.remove(); document.documentElement.classList.remove('lm-viajando'); cor(...barra); }, 3200); // segurança
  try {
    Object.assign(tinta.style, { left: x - 60 + 'px', top: y - 60 + 'px' });
    try { navigator.vibrate && navigator.vibrate(8); } catch { /* ok */ }
    cortina.style.opacity = 0;
    setTimeout(() => cor(space === 'personal' ? '#FF6B1A' : '#5E2407'), 200);
    anima(boneco, [{ transform: 'translate3d(0, 90px, 0) scale(.5)', opacity: 0 }, { transform: 'translate3d(0, -18px, 0) scale(1.03, 1.05)', opacity: 1, offset: 0.55 }, { transform: 'translate3d(0, 0, 0) scale(1.05, .95)', offset: 0.78 }, { transform: 'none', opacity: 1 }], { duration: 560, delay: 170, easing: 'cubic-bezier(.3,.6,.3,1)' });
    anima(q('.lm-cena__sombra'), [{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, delay: 300 });
    anima(q('.lm-cena__de'), [{ transform: 'translate3d(0, 60px, 0) scale(.4)', opacity: 0 }, { transform: 'none', opacity: 1, offset: 0.45 }, { transform: 'scale(1)', opacity: 1, offset: 0.68 }, { transform: 'translate3d(-46px, -34px, 0) rotate(-50deg) scale(.3)', opacity: 0 }], { duration: 760, delay: 200 });
    await anima(tinta, [{ transform: 'scale(.05)', opacity: 1 }, { transform: `scale(${R / 60})`, opacity: 1 }], { duration: 400, easing: 'cubic-bezier(.5,0,.2,1)' });
    cortina.style.opacity = 1; tinta.remove();
    await espera(60);
    troca(); // a tela nova é montada escondida atrás da cor: nenhum engasgo aparece
    await espera(30);
    // meia-volta: troca o objeto do mundo
    const giro = { duration: 440, easing: 'cubic-bezier(.45,0,.2,1)' };
    anima(q('.lm-cena__a'), [{ transform: 'scaleX(1)', opacity: 1 }, { transform: 'scaleX(.02)', opacity: 1, offset: 0.5 }, { transform: 'scaleX(.02)', opacity: 0, offset: 0.51 }, { opacity: 0, transform: 'scaleX(.02)' }], giro);
    anima(q('.lm-cena__b'), [{ transform: 'scaleX(.02)', opacity: 0 }, { transform: 'scaleX(.02)', opacity: 0, offset: 0.49 }, { transform: 'scaleX(.02)', opacity: 1, offset: 0.5 }, { transform: 'scaleX(1)', opacity: 1 }], giro);
    anima(q('.lm-cena__para'), [{ transform: 'translate3d(40px, 20px, 0) rotate(50deg) scale(.2)', opacity: 0 }, { transform: 'scale(1.12)', opacity: 1, offset: 0.65 }, { transform: 'none', opacity: 1 }], { duration: 460, delay: 170 });
    anima(q('.lm-cena b'), [{ transform: 'translate3d(0, 14px, 0)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, delay: 190 });
    await anima(q('.lm-cena small'), [{ transform: 'translate3d(0, 12px, 0)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, delay: 270 });
    await espera(160);
    cor(...barra);
    const nova = document.getElementById('view');
    if (nova) passageiro(nova, [{ opacity: 0.2 }, { opacity: 1 }], { duration: 460 });
    const barraAbas = document.querySelector('.tabbar');
    if (barraAbas) passageiro(barraAbas, [{ transform: 'translate3d(0, 110px, 0)' }, { transform: 'none' }], { duration: 520, delay: 120 });
    anima(cena, [{ transform: 'none', opacity: 1 }, { transform: `translate3d(0, ${-innerHeight * 0.75}px, 0)`, opacity: 1 }], { duration: 560, easing: 'cubic-bezier(.6,0,.25,1)' });
    await anima(cortina, [{ transform: 'none' }, { transform: 'translate3d(0, -118%, 0)' }], { duration: 600, easing: 'cubic-bezier(.6,0,.2,1)' });
  } finally { clearTimeout(fim); troca(); cor(...barra); c.remove(); document.documentElement.classList.remove('lm-viajando'); }
}

/* ---------- 5 · confete leve: poucos pedaços, só transform e opacity ---------- */
export function chuva(n = 30, de = null, brasa = false) {
  if (reduzido()) return;
  const c = camada(), r = de && de.getBoundingClientRect ? de.getBoundingClientRect() : null;
  c.style.zIndex = 9600;
  const x0 = r ? r.left + r.width / 2 : innerWidth / 2, y0 = r ? r.top + r.height / 2 : innerHeight * 0.32;
  const cores = brasa ? ['#FFD34D', '#FF8A1E', '#FFF1C2', '#FF5A1F'] : ['#FF6B1A', '#FFC23D', '#FFFFFF', '#FF8FA3', '#FFB054', '#E85A0C'];
  const fins = [];
  for (let i = 0; i < Math.min(60, n); i++) {
    const p = document.createElement('i'), a = (Math.PI * 2 * i) / n + (Math.random() - 0.5), d = 90 + Math.random() * Math.min(230, innerWidth * 0.5), s = 6 + Math.random() * 7;
    const dx = Math.cos(a) * d, dy = Math.sin(a) * d * 0.8 - 70, cai = brasa ? -120 - Math.random() * 160 : 190 + Math.random() * 220, g = (Math.random() - 0.5) * 720;
    p.className = 'lm-papel';
    Object.assign(p.style, { left: x0 - s / 2 + 'px', top: y0 - s / 2 + 'px', width: s + 'px', height: (brasa || i % 3 === 0 ? s : s * 1.7) + 'px', background: cores[i % cores.length], borderRadius: brasa || i % 3 === 0 ? '50%' : '3px' });
    c.appendChild(p);
    fins.push(anima(p, [{ transform: 'translate3d(0,0,0) scale(.3)', opacity: 1, easing: 'cubic-bezier(.1,.8,.3,1)' }, { transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${g / 2}deg) scale(1)`, opacity: 1, offset: 0.32, easing: 'cubic-bezier(.4,0,.8,.6)' }, { transform: `translate3d(${dx * 1.12}px, ${dy + cai}px, 0) rotate(${g}deg) scale(${brasa ? 0.2 : 0.9})`, opacity: 0 }], { duration: 1500 + Math.random() * 900, easing: 'linear' }));
  }
  Promise.all(fins).then(() => c.remove());
}

/* ---------- 6 · concluir: carimbo, o cartão vai para os feitos e a lista se ajeita deslizando (FLIP) ---------- */
const CHAVES = '#view .ecard[data-id], #view .prow[data-id], #view .foco, #view .dobra, #view .tl-group__h, #view .pempty';
const chave = (e) => e.classList[0] + ':' + (e.dataset.id || e.dataset.k || e.textContent.slice(0, 24)) + (e.dataset.date || '');
const barraDe = () => document.querySelector('#view .foco__bar b, #view .dayprog__bar i');
/** foto das posições antes de a tela mudar */
export function antes(cartao) {
  const m = new Map();
  document.querySelectorAll(CHAVES).forEach((e) => { const r = e.getBoundingClientRect(); if (r.bottom > -300 && r.top < innerHeight + 300) m.set(chave(e), r.top); });
  const b = barraDe(), c = cartao && cartao.getBoundingClientRect();
  return { m, pct: b ? parseFloat(b.style.width) || 0 : null, cartao: c && c.width ? { clone: cartao.cloneNode(true), rect: c, chave: chave(cartao) } : null };
}
export function depois(s) {
  document.querySelectorAll(CHAVES).forEach((e) => {
    const r = e.getBoundingClientRect(); if (r.bottom < -300 || r.top > innerHeight + 300) return;
    const k = chave(e), t = s.m.get(k);
    if (t != null && Math.abs(t - r.top) > 2) passageiro(e, [{ transform: `translate3d(0, ${t - r.top}px, 0)` }, { transform: 'none' }], { duration: 480, delay: 120 });
    else if (t == null) passageiro(e, [{ transform: 'translate3d(0, 14px, 0) scale(.97)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: 200 });
  });
  const b = barraDe(), pct = b ? parseFloat(b.style.width) || 0 : 0;
  if (b && s.pct != null && pct > 0 && Math.abs(pct - s.pct) > 0.5) { passageiro(b, [{ transform: `scaleX(${s.pct / pct})` }, { transform: 'scaleX(1)' }], { duration: 760, delay: 420 }); const l = b.parentElement; passageiro(l, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.7)', offset: 0.4 }, { transform: 'scaleY(1)' }], { duration: 620, delay: 520 }); }
}
export async function concluir(s) {
  depois(s);
  if (!s.cartao) return;
  const c = camada(), { clone, rect: r } = s.cartao;
  try {
    clone.classList.add('lm-feito'); clone.querySelectorAll('canvas').forEach((x) => x.remove());
    Object.assign(clone.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    const k = document.createElement('i'); k.className = 'lm-carimbo'; k.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" stroke-dasharray="1" d="M4.5 12.8l4.9 4.9L19.8 6.6"/></svg>';
    const esc2 = Math.min(1, (r.height - 8) / 108); k.style.scale = esc2;
    clone.appendChild(k); c.appendChild(clone);
    anima(k.querySelector('path'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 260, delay: 150 });
    anima(k, [{ transform: 'scale(2.4) rotate(20deg)', opacity: 0 }, { transform: 'scale(1.7) rotate(10deg)', opacity: 1, offset: 0.2 }, { transform: 'scale(.84) rotate(-10deg)', opacity: 1, offset: 0.62 }, { transform: 'scale(1.06) rotate(-10deg)', opacity: 1, offset: 0.82 }, { transform: 'scale(1) rotate(-10deg)', opacity: 1 }], { duration: 400, easing: 'cubic-bezier(.5,0,.5,1)' });
    setTimeout(() => { somCarimbo(true); try { navigator.vibrate && navigator.vibrate([16, 30, 10]); } catch { /* ok */ } }, 220);
    await anima(clone, [{ transform: 'none' }, { transform: 'scale(1)', offset: 0.5 }, { transform: 'scale(.97, .95) rotate(-.6deg)', offset: 0.62 }, { transform: 'scale(1.012, 1.02) rotate(.4deg)', offset: 0.8 }, { transform: 'none' }], { duration: 440, easing: 'ease-out' });
    const alvo = [...document.querySelectorAll('#view .dobra__ok, #view .foco__bar')].find((e) => { const q = e.getBoundingClientRect(); return q.width && q.top > 0 && q.bottom < innerHeight; }), [x1, y1] = alvo ? meio(alvo) : [innerWidth / 2, innerHeight - 60];
    const dx = x1 - (r.left + r.width / 2), dy = y1 - (r.top + r.height / 2);
    await anima(clone, [{ transform: 'none', opacity: 1 }, { transform: `translate3d(${dx * 0.3}px, ${dy * 0.3 - 26}px, 0) scale(.62) rotate(-4deg)`, opacity: 1, offset: 0.45 }, { transform: `translate3d(${dx}px, ${dy}px, 0) scale(.06)`, opacity: 0 }], { duration: 480, easing: 'cubic-bezier(.5,0,.25,1)' });
    if (alvo) pula(alvo);
  } finally { c.remove(); }
}
