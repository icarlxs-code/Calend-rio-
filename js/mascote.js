/* Sininho, o companheiro do Lembra (como o Duo no Duolingo: presente, com personalidade, nunca chato).
   - por enquanto SÓ para o dono (CONFIG.adminEmail); para todo mundo: CONFIG.mascotPublic = true
   - fica no canto da tela meio escondido, "espiando"; às vezes some e aparece pelo outro lado
   - toque: ele sobe, reage e pergunta coisas ("O que foi?", "Tá precisando marcar algo?"…)
   - reage ao que acontece no app (concluiu, marcou, atrasou, ofensiva, dia 100%)
   - easter eggs: cutucar várias vezes, segurar, madrugada, sexta, datas especiais, aniversário da pessoa
   - nunca atrapalha: some quando abre janela, planos, ficha ou o teclado; respeita "reduzir movimento" */
import { store } from './store.js';
import { CONFIG } from '../config.js';
import { sininho, setMood, act } from './sininho.js';
import { esc, todayKey } from './utils.js';

export const isOwner = () => !!store.user && !!CONFIG.adminEmail && (store.user.email || '').toLowerCase() === CONFIG.adminEmail.toLowerCase();
export const mascotOn = () => !!CONFIG.mascotPublic || isOwner();

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const R = (a, b) => a + Math.random() * (b - a);
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- quem é a pessoa / como está o dia ---------- */
function ctx() {
  const me = store.member && store.member(store.me);
  const nm = (store.profile?.nickname || me?.name || store.user?.displayName || '').trim().split(' ')[0];
  const t = todayKey(), h = new Date().getHours(), dow = new Date().getDay();
  let pending = 0, late = 0, doneToday = 0;
  try {
    const evs = store.eventsOn ? store.eventsOn(t, { person: store.me || 'all' }) : [];
    pending = evs.filter((e) => e.status !== 'feito').length; doneToday = evs.filter((e) => e.status === 'feito').length;
    late = (store.state?.events || []).filter((e) => e.status !== 'feito' && e.date < t && e.date >= t.slice(0, 8) + '01').length;
  } catch { /* ok */ }
  return { n: nm, h, dow, pending, late, doneToday };
}
const nm = (c) => (c.n ? `, ${c.n}` : '');

/* ---------- frases (combinadas: parecem infinitas e nunca repetem em seguida) ---------- */
const TAP = {
  curioso: ['O que foi?', 'Oi! Me chamou?', 'Tô aqui! 👀', 'Hm? Fala comigo', 'Diga!', 'Presente! 🔔', 'Opa, cheguei!', 'Me chamou ou foi sem querer?'],
  pergunta: ['Tá precisando marcar algo?', 'Tá fazendo o quê?', 'Quer que eu te lembre de alguma coisa?', 'Bora organizar o dia?', 'Já bebeu água hoje?', 'Tem algum compromisso que eu não sei?', 'Como tá o seu dia?', 'Esqueceu de anotar alguma coisa?', 'Posso ajudar em quê?', 'Quer ver o que tem pra hoje?', 'Lembrou de tudo até agora?', 'E aí, tudo sob controle?'],
  carinho: ['Gosto quando você aparece 🧡', 'Tô sempre por aqui, viu?', 'Você não tá sozinho(a) nessa.', 'Conta comigo!', 'Tô torcendo por você!', 'Que bom te ver!', 'Senti sua falta!'],
  piada: ['Sabe por que o sino nunca se atrasa? Porque ele sempre dá o toque! 🔔', 'Eu não durmo, eu só fico em modo silencioso. 🤫', 'Meu esporte favorito? Badalar! 🏃', 'Já pensou se eu esquecesse algo? Seria o fim do mundo! 😅', 'Dizem que sou pequeno… mas faço barulho!'],
};
function tapLine(c) {
  const r = Math.random();
  if (c.late && r < 0.35) return { t: c.late === 1 ? `Tem 1 coisa atrasada${nm(c)}. Bora resolver?` : `Tem ${c.late} coisas atrasadas${nm(c)}… vamos juntos?`, m: 'triste' };
  if (c.pending && r < 0.5) return { t: pick([`Hoje ainda tem ${c.pending} ${c.pending === 1 ? 'coisa' : 'coisas'} pra fazer${nm(c)}.`, `Falta${c.pending > 1 ? 'm' : ''} ${c.pending} pra fechar o dia!`, `${c.pending} na lista. Qual a gente risca primeiro?`]), m: 'feliz' };
  if (c.doneToday >= 3 && r < 0.6) return { t: pick([`Já foram ${c.doneToday} hoje! Que ritmo! 🔥`, `${c.doneToday} feitos hoje. Tô impressionado!`]), m: 'comemora' };
  const kind = pick(['curioso', 'curioso', 'pergunta', 'pergunta', 'pergunta', 'carinho', 'piada']);
  const base = pick(TAP[kind]);
  return { t: kind === 'curioso' && c.n && Math.random() < 0.5 ? base.replace(/[?!]?$/, (x) => `${nm(c)}${x || '!'}`) : base, m: kind === 'carinho' ? 'amor' : kind === 'piada' ? 'comemora' : pick(['feliz', 'acena', 'surpreso']) };
}
const SPY = ['Psiu… tô de olho 👀', 'Só passando pra ver se tá tudo bem…', 'Hmm… o que você tá fazendo aí?', 'Não liga não, só tô espiando 🫣', 'Tudo certo por aí?', '…', 'Shhh 🤫', 'Achei você! 😄', 'Vim conferir sua agenda 🔍'];
const IDLE = ['Ainda tá aí? 👀', 'Tá pensando em quê?', 'Se precisar, é só me chamar!', 'Tô aqui, viu?'];
const DONE = ['Mandou bem! 🎉', 'Isso aí! Mais um riscado!', 'Arrasou!', 'Boa! Tô orgulhoso de você!', 'Uhuul! 🙌', 'Riscou! Que sensação boa, né?', 'Um a menos! 💪', 'Tá voando hoje!'];
const DONE_LATE = ['Antes tarde do que nunca! 💪', 'Feito! O importante é não desistir.', 'Ufa! Resolvido 😮‍💨'];
const CREATED = ['Anotado! Eu te lembro 🔔', 'Deixa comigo!', 'Guardei aqui, pode ficar tranquilo(a).', 'Marcado! ✍️', 'Pode esquecer que eu lembro 😉'];

function special(c) {
  const d = new Date(), md = `${d.getMonth() + 1}-${d.getDate()}`;
  if (md === '12-25') return { t: 'Feliz Natal! 🎄🔔 Hoje eu toco especial!', m: 'danca' };
  if (md === '12-31') return { t: 'Último dia do ano! Bora fechar com chave de ouro ✨', m: 'comemora' };
  if (md === '1-1') return { t: 'Feliz Ano Novo! 🎆 Novo ano, nova agenda!', m: 'danca' };
  const bd = store.profile?.birth || store.profile?.birthDate;
  if (bd && bd.slice(5) === todayKey().slice(5)) return { t: `Feliz aniversário${nm(c)}! 🎂🎉 Hoje é o seu dia!`, m: 'danca' };
  if (c.h >= 0 && c.h < 5) return { t: pick(['Acordado(a) a essa hora? 😴', 'Psiu… já é madrugada. Vai descansar!', 'Eu tava dormindo… mas tô aqui 🥱']), m: 'sono' };
  if (c.dow === 5 && c.h >= 17) return { t: pick(['Sextou! 🎉', 'Sexta-feira! Bora fechar a semana bonito?']), m: 'danca' };
  if (c.dow === 1 && c.h < 11) return { t: pick(['Segunda-feira… bora com calma ☕', 'Semana nova, agenda nova! 💪']), m: 'feliz' };
  return null;
}

/* ---------- o companheiro na tela ---------- */
let B = null, last = '', taps = [], hideT = 0, spyT = 0, idleT = 0, holdT = 0, spies = 0, busyUntil = 0;
const blocked = () => !!document.querySelector('.sheet-wrap.is-open, .paywall, .ficha, .photogate, .gx, .okfx, .stk, .snhpeek') ||
  (document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName));

function el() { return B && B.querySelector('[data-snh]'); }
function state(s, side) {
  if (!B) return;
  B.dataset.st = s;
  if (side) B.dataset.side = side;
}
function bubble(text, ms) {
  if (!B) return;
  const b = B.querySelector('.snhbud__bub');
  clearTimeout(hideT);
  b.querySelector('span').textContent = text;
  b.classList.remove('is-in'); void b.offsetWidth; b.classList.add('is-in');
  hideT = setTimeout(() => b.classList.remove('is-in'), ms || Math.min(7000, 2400 + text.length * 55));
}
function show(line, gesture, holdMs = 4200) {
  if (!B) return;
  const e = el();
  last = line.t;
  state('up');
  setMood(e, line.m || 'feliz');
  if (gesture) setTimeout(() => act(e, gesture), 220);
  setTimeout(() => bubble(line.t), 260);
  busyUntil = Date.now() + holdMs;
  clearTimeout(holdT);
  holdT = setTimeout(() => { if (Date.now() >= busyUntil) settle(); }, holdMs + Math.min(4000, line.t.length * 55));
}
/* volta a ficar quietinho no canto, espiando */
function settle() {
  if (!B) return;
  B.querySelector('.snhbud__bub').classList.remove('is-in');
  setMood(el(), new Date().getHours() >= 23 || new Date().getHours() < 5 ? 'sono' : 'feliz');
  state('rest');
}
function unique(fn) { let l, i = 0; do { l = fn(); i++; } while (l.t === last && i < 6); return l; }

function onTap() {
  const now = Date.now();
  taps = taps.filter((t) => now - t < 3200); taps.push(now);
  try { navigator.vibrate && navigator.vibrate(8); } catch { /* ok */ }
  // easter eggs
  if (taps.length === 5) return show({ t: pick(['Ei! Para de me cutucar! 😤', 'Assim eu fico tonto! 😵‍💫', 'Cosquinha não! 🤭']), m: 'bravo' }, 'nao');
  if (taps.length === 9) return show({ t: 'Tá bom, tá bom… FESTA! 🎉🎶', m: 'danca' }, 'pulo', 5200);
  if (taps.length > 1 && taps.length < 5) return act(el(), pick(['pop', 'sim', 'riso']));
  if (B.dataset.st === 'up' && Date.now() < busyUntil - 1500) return show(unique(() => tapLine(ctx())), pick(['sim', 'riso', 'pop']));
  const sp = Math.random() < 0.18 ? special(ctx()) : null;
  show(sp || unique(() => tapLine(ctx())), sp ? 'pulo' : pick(['tchau', 'sim', 'pop', 'riso']));
}

/* espiada: some de um lado e aparece "escondido" por outro, olha, às vezes cochicha e vai embora */
function spy() {
  clearTimeout(spyT);
  spyT = setTimeout(spy, R(70, 170) * 1000);
  if (!B || document.hidden || blocked() || Date.now() < busyUntil || spies >= 8) return;
  spies++;
  const side = pick(['l', 'r', 'r', 'b']);
  state('away');
  setTimeout(() => {
    if (!B) return;
    state('spy', side);
    setMood(el(), pick(['desconfiado', 'feliz', 'surpreso']));
    setTimeout(() => { if (Math.random() < 0.55) bubble(pick(SPY), 2600); else act(el(), 'sim'); }, 900);
    setTimeout(() => { if (B && B.dataset.st === 'spy') { act(el(), 'tchau'); setTimeout(() => { state('away'); setTimeout(() => { state('rest', pick(['l', 'r'])); settle(); }, 900); }, 1100); } }, R(3600, 5200));
  }, 700);
}
/* parado muito tempo na mesma tela: ele dá um sinal de vida (uma vez) */
function idleWatch() {
  clearTimeout(idleT);
  idleT = setTimeout(() => { if (B && !blocked() && !document.hidden && Date.now() > busyUntil && Math.random() < 0.6) show({ t: pick(IDLE), m: 'acena' }, 'tchau', 3200); }, 75e3);
}

/* ---------- API ---------- */
export function start() {
  if (B || !mascotOn()) { if (B && !mascotOn()) stop(); return; }
  document.documentElement.classList.add('snh-theme');
  B = document.createElement('div');
  B.className = 'snhbud';
  B.dataset.st = 'away'; B.dataset.side = 'r';
  B.innerHTML = `<div class="snhbud__bub" role="status" aria-live="polite"><span></span></div><button class="snhbud__fig" aria-label="Sininho, seu companheiro">${sininho('feliz', { size: 96 })}</button>`;
  document.body.appendChild(B);
  B.querySelector('.snhbud__fig').addEventListener('click', onTap);
  // segurar: ele dorme / acorda
  let hold;
  B.querySelector('.snhbud__fig').addEventListener('pointerdown', () => { hold = setTimeout(() => { taps = []; show({ t: 'Zzz… me acorda se precisar 😴', m: 'sono' }, null, 6000); }, 700); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => B.querySelector('.snhbud__fig').addEventListener(ev, () => clearTimeout(hold)));
  // fica fora do caminho
  const guard = () => { if (B) B.classList.toggle('is-hidden', blocked()); };
  B._mo = new MutationObserver(guard); B._mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  document.addEventListener('focusin', guard); document.addEventListener('focusout', () => setTimeout(guard, 50));
  ['pointerdown', 'keydown', 'scroll'].forEach((ev) => window.addEventListener(ev, idleWatch, { passive: true }));
  // chega dando oi
  setTimeout(() => {
    state('rest');
    const c = ctx(), sp = special(c);
    const hello = sp || (c.late ? { t: `Oi${nm(c)}! Tem coisa atrasada, bora ver? 👀`, m: 'triste' } : { t: pick([`Oi${nm(c)}! 👋`, `Voltou${nm(c)}! 🧡`, `E aí${nm(c)}!`, `Bom te ver${nm(c)}!`]), m: 'acena' });
    setTimeout(() => show(hello, 'tchau', 3400), 900);
  }, 1200);
  spyT = setTimeout(spy, R(60, 120) * 1000);
  idleWatch();
}
export function stop() {
  if (!B) return;
  B._mo && B._mo.disconnect(); B.remove(); B = null;
  clearTimeout(spyT); clearTimeout(idleT); clearTimeout(hideT); clearTimeout(holdT);
  document.documentElement.classList.remove('snh-theme');
}
/* o app avisa o que aconteceu; ele reage */
export function react(kind, o = {}) {
  if (!B || blocked()) return;
  if (kind === 'done') return show(o.perfect ? { t: 'Dia 100%! Você zerou tudo! 🏆', m: 'danca' } : o.late ? { t: pick(DONE_LATE), m: 'feliz' } : { t: pick(DONE), m: 'comemora' }, 'pulo', 3600);
  if (kind === 'created') return show({ t: pick(CREATED), m: 'feliz' }, 'sim', 2800);
  if (kind === 'late') return show({ t: 'Ih… esse passou da hora. Bora remarcar? 🙈', m: 'triste' }, null, 3400);
}
export const active = () => !!B;
export const _spy = () => spy(); // (testes)
