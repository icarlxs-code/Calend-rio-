/* Sininho, o mascote do Lembra — rig montado com as peças desenhadas (assets/mascot/*.webp):
   corpo, olhos, sobrancelhas, bocas, braços, pés e lágrimas, cada peça se mexendo sozinha e em sincronia.
   Como no Duolingo, ele:
   - vive na tela: respira, pisca em intervalos irregulares, olha em volta;
   - FALA: balão digitado com a boca sincronizada às letras (lip-sync) e sobrancelha nas ênfases;
   - REAGE: concluiu algo → comemora; atrasou/ofensiva em risco → triste; noite → sono; toque → reação;
   - ESPIA da borda da tela, acena (tchauzinho), fala e volta.
   Troca de emoção acontece no meio de uma piscada (truque de animação para não "saltar"). */
import { esc } from './utils.js';

const A = (n) => `assets/mascot/${n}.webp`;
/* posições no desenho original (1312 × 1199) */
const CW = 1312, CH = 1199;
const box = (x, y, w) => `left:${(x / CW) * 100}%;top:${(y / CH) * 100}%;width:${(w / CW) * 100}%`;
const MOUTH = { aberta: 200, o: 96, grito: 220, 'sorriso-aberto': 196, sorriso: 186, sorrisinho: 120, triste: 160, tristinha: 140 };
const mouthBox = (m) => box(672 - MOUTH[m] / 2, m === 'o' ? 660 : 648, MOUTH[m]);

/* expressão de cada emoção: olhos, sobrancelhas, boca, braços (graus: + levanta o esquerdo, − levanta o direito) */
const EXP = {
  feliz: { eye: 'olho', brow: ['neutra', 'neutra'], mouth: 'aberta', arms: [18, -18] },
  comemora: { eye: 'olho-feliz', brow: ['neutra', 'neutra'], mouth: 'sorriso-aberto', arms: [70, -70], prop: 'conf' },
  sono: { eye: 'olho-sono', brow: ['reta', 'reta'], mouth: 'o', arms: [-28, 28], prop: 'zzz' },
  desconfiado: { eye: 'olho-sono', brow: ['reta', 'neutra'], mouth: 'tristinha', arms: [-38, 38], prop: 'hmm' },
  amor: { eye: 'olho-feliz', brow: ['neutra', 'neutra'], mouth: 'sorrisinho', arms: [-10, 10], prop: 'love', blush: true },
  danca: { eye: 'olho-feliz', brow: ['neutra', 'neutra'], mouth: 'sorriso-aberto', arms: [55, -10], prop: 'notes' },
  bravo: { eye: 'olho', brow: ['brava', 'brava'], mouth: 'triste', arms: [-20, 20], prop: 'steam' },
  triste: { eye: 'olho-peq', brow: ['triste', 'triste'], mouth: 'tristinha', arms: [-42, 42], tears: true },
  surpreso: { eye: 'olho-peq', brow: ['neutra', 'neutra'], mouth: 'o', arms: [40, -40] },
};
export const MOODS = Object.keys(EXP);
const PROPS = {
  zzz: '<b class="p1">z</b><b class="p2">Z</b><b class="p3">z</b>',
  love: '<i class="p1 snh-heart"></i><i class="p2 snh-heart"></i>',
  notes: '<b class="p1">♪</b><b class="p2">♫</b>',
  steam: '<i class="p1 snh-puff"></i><i class="p2 snh-puff"></i>',
  conf: '<i class="p1"></i><i class="p2"></i><i class="p3"></i><i class="p4"></i><i class="p5"></i>',
  hmm: '<b class="p1">?</b>',
};

export function sininho(mood = 'feliz', { size = 120, cls = '', label = 'Sininho, o mascote do Lembra' } = {}) {
  const m = EXP[mood] ? mood : 'feliz', e = EXP[m];
  return `<span class="snh snh--${m} ${cls}" style="--s:${size}px;--al:${e.arms[0]}deg;--ar:${e.arms[1]}deg" data-snh="${m}" role="img" aria-label="${esc(label)}">
  <span class="snh__stage"><span class="snh__all">
    <span class="snh__props">${PROPS[e.prop] || ''}</span>
    <img class="snh__p snh__foot snh__foot--l" src="${A('pe-l')}" style="${box(350, 868, 212)}" alt="">
    <img class="snh__p snh__foot snh__foot--r" src="${A('pe-r')}" style="${box(730, 868, 212)}" alt="">
    <span class="snh__body">
      <img class="snh__p snh__arm snh__arm--l" src="${A('braco-l')}" style="${box(30, 545, 300)}" alt="">
      <img class="snh__p snh__arm snh__arm--r" src="${A('braco-r')}" style="${box(982, 525, 300)}" alt="">
      <img class="snh__p snh__corpo" src="${A('corpo')}" style="${box(128, 32, 1032)}" alt="">
      <span class="snh__face">
        <span class="snh__blush" ${e.blush ? '' : 'hidden'}><i></i><i></i></span>
        <img class="snh__p snh__eye snh__eye--l" src="${A(e.eye + '-l')}" style="${box(348, 388, 298)}" alt="">
        <img class="snh__p snh__eye snh__eye--r" src="${A(e.eye + '-r')}" style="${box(670, 380, 284)}" alt="">
        <img class="snh__p snh__brow snh__brow--l" src="${A('sob-' + e.brow[0] + '-l')}" style="${box(388, 282, 228)}" alt="">
        <img class="snh__p snh__brow snh__brow--r" src="${A('sob-' + e.brow[1] + '-r')}" style="${box(690, 268, 206)}" alt="">
        <img class="snh__p snh__mouth" src="${A('boca-' + e.mouth)}" style="${mouthBox(e.mouth)}" alt="">
        <img class="snh__p snh__tear snh__tear--l" src="${A('lagrima-l')}" style="${box(318, 610, 150)}" ${e.tears ? '' : 'hidden'} alt="">
        <img class="snh__p snh__tear snh__tear--r" src="${A('lagrima-r')}" style="${box(842, 606, 150)}" ${e.tears ? '' : 'hidden'} alt="">
      </span>
    </span>
  </span></span></span>`;
}

const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const $ = (el, s) => el.querySelector(s);
let preloaded = false;
function preload() {
  if (preloaded) return; preloaded = true;
  ['olho', 'olho-feliz', 'olho-sono', 'olho-peq'].forEach((e) => ['l', 'r'].forEach((s) => { new Image().src = A(`${e}-${s}`); }));
  ['neutra', 'triste', 'brava', 'reta'].forEach((b) => ['l', 'r'].forEach((s) => { new Image().src = A(`sob-${b}-${s}`); }));
  Object.keys(MOUTH).forEach((m) => { new Image().src = A('boca-' + m); });
}

/* ---------- vida própria: piscar irregular e olhar em volta (um relógio só para todos na tela) ---------- */
function blink(el, ms = 130) {
  if (!el || el.classList.contains('is-blink')) return;
  el.classList.add('is-blink');
  setTimeout(() => el.classList.remove('is-blink'), ms);
}
let ticking = false;
function life() {
  if (ticking) return; ticking = true;
  const loop = () => {
    if (!document.hidden && !calm()) document.querySelectorAll('[data-snh]').forEach((el) => {
      if (el.dataset.snh === 'sono' || el.dataset.snh === 'comemora' || el.dataset.snh === 'danca') return;
      const r = Math.random();
      if (r < 0.16) { blink(el); if (Math.random() < 0.25) setTimeout(() => blink(el), 260); } // às vezes pisca duas vezes
      else if (r < 0.24) { const f = $(el, '.snh__face'); f.style.setProperty('--lx', `${pick([-1.6, 0, 1.6])}%`); f.style.setProperty('--ly', `${pick([-1, 0, 0.6])}%`); }
    });
    setTimeout(loop, 700 + Math.random() * 500);
  };
  loop();
}

/* troca de emoção: acontece no meio de uma piscada; braços vão com mola até a nova pose */
export function setMood(el, mood) {
  if (!el || !EXP[mood] || el.dataset.snh === mood) return;
  preload();
  const e = EXP[mood];
  const apply = () => {
    el.dataset.snh = mood;
    el.className = el.className.replace(/snh--\w+/, `snh--${mood}`);
    el.style.setProperty('--al', `${e.arms[0]}deg`); el.style.setProperty('--ar', `${e.arms[1]}deg`);
    $(el, '.snh__eye--l').src = A(e.eye + '-l'); $(el, '.snh__eye--r').src = A(e.eye + '-r');
    $(el, '.snh__brow--l').src = A(`sob-${e.brow[0]}-l`); $(el, '.snh__brow--r').src = A(`sob-${e.brow[1]}-r`);
    mouth(el, e.mouth);
    el.querySelectorAll('.snh__tear').forEach((t) => { t.hidden = !e.tears; });
    $(el, '.snh__blush').hidden = !e.blush;
    $(el, '.snh__props').innerHTML = PROPS[e.prop] || '';
  };
  if (calm()) return apply();
  blink(el, 170);
  setTimeout(apply, 70);
  act(el, 'pop');
}
function mouth(el, m) { const i = $(el, '.snh__mouth'); if (!i || !MOUTH[m]) return; i.src = A('boca-' + m); i.style.cssText = mouthBox(m); }

/* gestos: 'pulo' | 'tchau' | 'nao' | 'pop' | 'sim' */
export function act(el, name) {
  const a = el && $(el, '.snh__all');
  if (!a || calm()) return;
  a.classList.remove(...[...a.classList].filter((c) => c.startsWith('do-')));
  void a.offsetWidth;
  a.classList.add(`do-${name}`);
  clearTimeout(a._t);
  a._t = setTimeout(() => a.classList.remove(`do-${name}`), { pulo: 950, tchau: 1700, nao: 800, pop: 450, sim: 700 }[name] || 900);
}

/* fala: digita no balão e mexe a boca junto com as letras (vogais abrem, consoantes fecham) */
export function say(el, text, { bubble, speed = 34 } = {}) {
  const b = bubble || el?.closest('.snhwrap')?.querySelector('.snhb__txt');
  if (!b) return Promise.resolve();
  clearInterval(b._t);
  const wrap = b.closest('.snhb');
  if (wrap) { wrap.classList.remove('is-in'); void wrap.offsetWidth; wrap.classList.add('is-in'); }
  if (calm() || !el) { b.textContent = text; return Promise.resolve(); }
  const rest = EXP[el.dataset.snh]?.mouth || 'sorrisinho';
  const sad = ['triste', 'bravo', 'desconfiado'].includes(el.dataset.snh);
  el.classList.add('is-talk');
  if (/!/.test(text)) setTimeout(() => el.classList.add('is-emph'), 120);
  return new Promise((res) => {
    let i = 0;
    b.textContent = '';
    b._t = setInterval(() => {
      const ch = text[i] || '';
      i += 1;
      b.textContent = text.slice(0, i);
      if (/[aáãâeéêoóõô]/i.test(ch)) mouth(el, sad ? 'o' : pick(['aberta', 'sorriso-aberto']));
      else if (/[iíuú]/i.test(ch)) mouth(el, 'o');
      else if (/[\s,.!?]/.test(ch)) mouth(el, sad ? 'tristinha' : 'sorrisinho');
      if (i >= text.length) { clearInterval(b._t); mouth(el, rest); el.classList.remove('is-talk', 'is-emph'); res(); }
    }, speed);
  });
}

/* ---------- toque: ele reage (como tocar no Duo) ---------- */
const TAP = [
  ['comemora', 'pulo', ['Opa! Tô aqui com você!', 'Bora fazer o dia render!', 'Hehe, cócegas!']],
  ['danca', 'pulo', ['Dia organizado, dia feliz!', 'Tô animado hoje!']],
  ['amor', 'sim', ['Gosto de te ver por aqui.', 'Você tá mandando bem!']],
  ['surpreso', 'pop', ['Ei! Já viu os lembretes de hoje?', 'Opa, me assustou!']],
];
export function interactive(el, { base, bubble } = {}) {
  if (!el || el._snh) return;
  el._snh = true; preload(); life();
  base = base || el.dataset.snh;
  el.style.cursor = 'pointer';
  let back;
  el.addEventListener('click', () => {
    const [mood, g, lines] = pick(TAP);
    setMood(el, mood); setTimeout(() => act(el, g), 90);
    try { navigator.vibrate && navigator.vibrate(12); } catch { /* ok */ }
    if (bubble) say(el, pick(lines), { bubble });
    clearTimeout(back);
    back = setTimeout(() => setMood(el, base), 3200);
  });
}
/* liga a vida (piscar etc.) para Sininhos que só aparecem, sem toque */
export function alive() { preload(); life(); }

/* ---------- espiada na borda da tela: sobe, acena, fala e desce ---------- */
let peekOn = null;
export function peek(mood, text, { ms = 3400, gesture } = {}) {
  if (document.hidden) return;
  if (document.querySelector('.gx, .paywall, .ficha, .photogate, .okfx')) { setTimeout(() => peek(mood, text, { ms, gesture }), 1500); return; }
  preload(); life();
  peekOn?.remove();
  const w = document.createElement('div');
  w.className = 'snhpeek snhwrap';
  w.innerHTML = `<div class="snhb snhb--peek"><span class="snhb__txt"></span></div>${sininho(mood, { size: 104 })}`;
  document.body.appendChild(w);
  peekOn = w;
  const el = $(w, '[data-snh]');
  let gone = false;
  const close = () => {
    if (gone) return; gone = true;
    act(el, 'tchau');
    setTimeout(() => w.classList.add('is-out'), 650);
    setTimeout(() => { w.remove(); if (peekOn === w) peekOn = null; }, 1200);
  };
  requestAnimationFrame(() => requestAnimationFrame(() => {
    w.classList.add('is-in');
    setTimeout(() => {
      act(el, gesture || (['comemora', 'danca'].includes(mood) ? 'pulo' : 'tchau'));
      say(el, text, { bubble: $(w, '.snhb__txt') });
    }, 420);
  }));
  w.addEventListener('click', close);
  setTimeout(close, ms + text.length * 34);
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
/* concluiu algo: ele aparece comemorando (sem exagero: não a cada clique) */
export function cheerDone({ late = false, perfect = false } = {}) {
  doneCount++;
  const now = Date.now();
  if (perfect) { lastPeek = now; return peek('danca', 'Dia 100%! Você zerou tudo hoje!', { gesture: 'pulo', ms: 4200 }); }
  if (doneCount > 1 && now - lastPeek < 90e3 && doneCount % 3) return;
  lastPeek = now;
  peek(late ? 'feliz' : 'comemora', pick(late ? DONE_LATE : DONE));
}
