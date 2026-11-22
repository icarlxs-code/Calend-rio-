/* Sininho, o mascote do Lembra — usa os DESENHOS ORIGINAIS de cada pose (assets/mascot/*.webp),
   todos alinhados pela alça e pelos pés, para a troca de pose não "pular".
   Movimento só com transform/opacity (roda na placa de vídeo, a 60 fps), com curvas de mola:
   - cada emoção tem o seu jeito contínuo de se mexer (respirar, balançar, dançar, tremer, murchar);
   - gestos de momento (pulo com antecipação e pouso amortecido, tchauzinho, "não", pop);
   - troca de pose no ponto mais achatado de um "pop" de mola (sem imagem dupla);
   - fala: balão digitado com o corpo quicando no ritmo das letras;
   - espia da borda da tela, acena, fala e volta; reage ao toque. */
import { esc } from './utils.js';

/* emoções que já têm animação quadro a quadro (vídeo) */
export const LIVE = ['feliz', 'acena', 'comemora', 'danca'];
export const MOODS = ['feliz', 'acena', 'comemora', 'sono', 'desconfiado', 'amor', 'danca', 'bravo', 'triste'];
const src = (m) => `assets/mascot/${MOODS.includes(m) ? m : 'feliz'}.webp`;
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const $ = (el, s) => el && el.querySelector(s);

/* imagens já decodificadas: a troca acontece sem nenhum quadro em branco */
const decoded = new Map();
function ready(m) {
  if (!decoded.has(m)) { const i = new Image(); i.src = src(m); decoded.set(m, (i.decode ? i.decode() : Promise.resolve()).catch(() => {})); }
  return decoded.get(m);
}
let warmed = false;
export function alive() {
  if (warmed) return; warmed = true;
  const go = () => MOODS.forEach(ready);
  ('requestIdleCallback' in window) ? requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 600);
}

export function sininho(mood = 'feliz', { size = 120, cls = '', label = 'Sininho, o mascote do Lembra' } = {}) {
  const m = MOODS.includes(mood) ? mood : 'feliz';
  return `<span class="snh snh--${m} ${cls}" style="--s:${size}px" data-snh="${m}" role="img" aria-label="${esc(label)}"><span class="snh__mot"><span class="snh__idle"><span class="snh__breath"><span class="snh__pose"><img class="is-on" src="${src(m)}" alt="" draggable="false" decoding="async"><img src="${src(m)}" alt="" draggable="false" decoding="async"></span></span></span></span></span>`;
}

/* ---------- gestos (Web Animations: keyframes com easing por trecho, só transform) ---------- */
const O = { transformOrigin: '50% 92%' };
const G = {
  pulo: [[
    { transform: 'translateY(0) scale(1,1)', easing: 'cubic-bezier(.3,0,.5,1)' },
    { transform: 'translateY(0) scale(1.13,.86)', offset: .16, easing: 'cubic-bezier(.2,.8,.4,1)' },
    { transform: 'translateY(-24%) scale(.92,1.1)', offset: .44, easing: 'cubic-bezier(.6,0,.9,.6)' },
    { transform: 'translateY(0) scale(1.12,.88)', offset: .68, easing: 'cubic-bezier(.2,.8,.4,1)' },
    { transform: 'translateY(0) scale(.97,1.03)', offset: .84, easing: 'ease-in-out' },
    { transform: 'translateY(0) scale(1,1)' }], 900],
  pop: [[
    { transform: 'scale(1,1)', easing: 'cubic-bezier(.4,0,.6,1)' },
    { transform: 'scale(1.1,.88)', offset: .17, easing: 'cubic-bezier(.2,.9,.3,1.25)' },
    { transform: 'scale(.95,1.06)', offset: .55, easing: 'ease-in-out' },
    { transform: 'scale(1,1)' }], 420],
  nao: [[
    { transform: 'rotate(0)' }, { transform: 'rotate(-7deg)', offset: .18 }, { transform: 'rotate(6deg)', offset: .4 },
    { transform: 'rotate(-4deg)', offset: .6 }, { transform: 'rotate(2deg)', offset: .8 }, { transform: 'rotate(0)' }], 760],
  sim: [[
    { transform: 'translateY(0)' }, { transform: 'translateY(4%) scale(1.03,.97)', offset: .3 }, { transform: 'translateY(-2%)', offset: .6 }, { transform: 'translateY(0)' }], 620],
  tchau: [[
    { transform: 'rotate(0)', easing: 'ease-in-out' }, { transform: 'rotate(-5deg)', offset: .15, easing: 'ease-in-out' }, { transform: 'rotate(3deg)', offset: .32, easing: 'ease-in-out' },
    { transform: 'rotate(-4deg)', offset: .5, easing: 'ease-in-out' }, { transform: 'rotate(2deg)', offset: .68, easing: 'ease-in-out' }, { transform: 'rotate(0)' }], 1300],
};
export function act(el, name) {
  const m = $(el, '.snh__mot');
  if (!m || calm() || !G[name] || !m.animate) return;
  if (name === 'tchau' && el.dataset.snh !== 'acena') { const was = el.dataset.snh; setMood(el, 'acena', { pop: false }); setTimeout(() => el.dataset.snh === 'acena' && setMood(el, was, { pop: false }), 1500); }
  m.getAnimations().forEach((a) => a.cancel());
  m.animate(G[name][0], { duration: G[name][1], ...O });
}

/* troca de pose: a nova imagem entra por cima em fusão, junto com um pop de mola */
export async function setMood(el, mood, { pop = true } = {}) {
  if (!el || !MOODS.includes(mood) || el.dataset.snh === mood) return;
  el.dataset.snh = mood;
  await ready(mood);
  if (el.dataset.snh !== mood) return; // trocou de novo enquanto carregava
  const [a, b] = el.querySelectorAll('.snh__pose img');
  const on = a.classList.contains('is-on') ? a : b, off = on === a ? b : a;
  off.src = src(mood);
  // troca o desenho de uma vez no ponto mais "achatado" do pop (o olho não percebe o corte, sem fantasma)
  const swap = () => { el.className = el.className.replace(/snh--\w+/, `snh--${mood}`); off.classList.add('is-on'); on.classList.remove('is-on'); };
  if (!pop || calm()) return swap();
  act(el, 'pop');
  setTimeout(swap, 70);
}

/* fala: balão digitado; o corpo quica no ritmo (sílabas abertas = quique maior) */
export function say(el, text, { bubble, speed = 32 } = {}) {
  const b = bubble || el?.closest('.snhwrap')?.querySelector('.snhb__txt');
  if (!b) return Promise.resolve();
  clearInterval(b._t);
  const box = b.closest('.snhb');
  if (box) { box.classList.remove('is-in'); void box.offsetWidth; box.classList.add('is-in'); }
  if (calm()) { b.textContent = text; return Promise.resolve(); }
  el?.classList.add('is-talk');
  return new Promise((res) => {
    let i = 0;
    b.textContent = '';
    b._t = setInterval(() => {
      i += 1;
      b.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(b._t); el?.classList.remove('is-talk'); res(); }
    }, speed);
  });
}

/* ---------- toque ---------- */
const TAP = [
  ['comemora', 'pulo', ['Opa! Tô aqui com você!', 'Bora fazer o dia render!', 'Hehe, cócegas!']],
  ['danca', 'pop', ['Dia organizado, dia feliz!', 'Tô animado hoje!']],
  ['amor', 'sim', ['Gosto de te ver por aqui.', 'Você tá mandando bem!']],
  ['acena', 'tchau', ['Oi oi! Precisando de algo?', 'Tô de olho na sua agenda!']],
];
export function interactive(el, { base, bubble } = {}) {
  if (!el || el._snh) return;
  el._snh = true; alive();
  base = base || el.dataset.snh;
  el.style.cursor = 'pointer';
  let back, last = -1;
  el.addEventListener('click', () => {
    let i; do { i = Math.floor(Math.random() * TAP.length); } while (i === last && TAP.length > 1); last = i;
    const [mood, g, lines] = TAP[i];
    setMood(el, mood, { pop: false }).then(() => act(el, g));
    try { navigator.vibrate && navigator.vibrate(10); } catch { /* ok */ }
    if (bubble) say(el, pick(lines), { bubble });
    clearTimeout(back);
    back = setTimeout(() => setMood(el, base), 3600);
  });
}

/* ---------- espiada na borda da tela ---------- */
let peekOn = null;
export async function peek(mood, text, { ms = 3400, gesture } = {}) {
  if (document.hidden) return;
  if (document.querySelector('.gx, .paywall, .ficha, .photogate, .okfx, .stk')) { setTimeout(() => peek(mood, text, { ms, gesture }), 1500); return; }
  await ready(mood);
  peekOn?.remove();
  const w = document.createElement('div');
  w.className = 'snhpeek snhwrap';
  const vivo = LIVE.includes(mood) && !calm();
  const V = vivo ? await import('./sininho-vivo.js') : null;
  w.innerHTML = `<div class="snhb snhb--peek"><span class="snhb__txt"></span></div>${vivo ? V.sininhoVivo(128) : sininho(mood, { size: 110 })}`;
  document.body.appendChild(w);
  peekOn = w;
  const el = $(w, '[data-snh]');
  if (vivo) { V.live($(w, '[data-snhv]'), { start: 'festa' }); ms = Math.max(ms, 5200); }
  let gone = false;
  const close = () => {
    if (gone) return; gone = true;
    act(el, 'tchau');
    setTimeout(() => w.classList.add('is-out'), 900);
    setTimeout(() => { w.remove(); if (peekOn === w) peekOn = null; }, 1500);
  };
  requestAnimationFrame(() => requestAnimationFrame(() => {
    w.classList.add('is-in');
    setTimeout(() => { act(el, gesture || (['comemora', 'danca'].includes(mood) ? 'pulo' : 'sim')); say(el, text, { bubble: $(w, '.snhb__txt') }); }, 480);
  }));
  w.addEventListener('click', close);
  setTimeout(close, ms + text.length * 32);
}

/* ---------- o que ele fala ---------- */
export function greetLine({ first = '', pending = 0, late = 0, off = 0, offToday = true, hour = new Date().getHours() } = {}) {
  const n = first ? `, ${first}` : '';
  if (hour >= 23 || hour < 5) return { mood: 'sono', text: pick([`Já é tarde${n}… amanhã eu te lembro de tudo.`, `Hora de descansar${n}. Eu cuido da agenda.`]) };
  if (late) return { mood: 'triste', text: late === 1 ? `Ficou 1 coisa pra trás${n}. Bora resolver?` : `Ficaram ${late} coisas pra trás${n}. Vamos juntos?` };
  if (off >= 2 && !offToday) return { mood: 'desconfiado', text: `Sua ofensiva de ${off} dias tá em risco! Conclua algo hoje.` };
  if (!pending) return { mood: 'danca', text: pick([`Tudo em dia${n}! Que orgulho!`, `Nada pendente hoje${n}. Aproveita!`]) };
  const tod = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  return { mood: 'feliz', text: pick([`${tod}${n}! Hoje tem ${pending} ${pending === 1 ? 'coisa' : 'coisas'} pra fazer.`, `${tod}${n}! Bora riscar ${pending === 1 ? 'aquele lembrete' : `esses ${pending} lembretes`}?`, `Oi${n}! Já separei ${pending === 1 ? 'o lembrete' : `os ${pending} lembretes`} de hoje.`]) };
}
const DONE = ['Mandou bem!', 'Isso aí! Mais um riscado!', 'Arrasou! Continua assim!', 'Boa! Tô orgulhoso de você!', 'Uhuul! Mais um feito!'];
const DONE_LATE = ['Antes tarde do que nunca!', 'Feito! O importante é não desistir.'];
let doneCount = 0, lastPeek = 0;
export function cheerDone({ late = false, perfect = false } = {}) {
  doneCount++;
  const now = Date.now();
  if (perfect) { lastPeek = now; return peek('danca', 'Dia 100%! Você zerou tudo hoje!', { gesture: 'pulo', ms: 4200 }); }
  if (doneCount > 1 && now - lastPeek < 90e3 && doneCount % 3) return;
  lastPeek = now;
  peek(late ? 'acena' : 'comemora', pick(late ? DONE_LATE : DONE));
}
