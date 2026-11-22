/* Lembra, o companheiro (Sininho). Ele é parte da plataforma, não só uma frase na tela:
   - o balão pode trazer BOTÕES (Sim/Não e outras escolhas) que abrem as telas reais do app:
     agendar, marcar um lembrete do Pessoal, ver os atrasados, ver o ranking, trocar de modo;
   - fala sobre o que existe de verdade (compromissos de hoje, atrasados, lembretes do Pessoal, cabelo marcado…);
   - aparece, fala e sai andando; volta sozinho em 15 s a 1 min (aleatório, nunca passa de 1 min);
   - reage ao que acontece (concluir, marcar, atrasar, ofensiva, dia 100%);
   - por enquanto SÓ para o dono (CONFIG.adminEmail); para todo mundo: CONFIG.mascotPublic = true. */
import { store } from './store.js';
import { CONFIG } from '../config.js';
import { sininho, setMood, act, say } from './sininho.js';
import { todayKey } from './utils.js';
import { personal, overdue } from './personal.js';

export const isOwner = () => !!store.user && !!CONFIG.adminEmail && (store.user.email || '').toLowerCase() === CONFIG.adminEmail.toLowerCase();
export const mascotOn = () => {
  if (CONFIG.mascotPublic) return true;
  if (isOwner()) { try { localStorage.setItem('lembra.mascote', '1'); } catch { /* ok */ } return true; }
  try { return localStorage.getItem('lembra.mascote') === '1'; } catch { return false; } // celular onde o dono já entrou (para testar com outras contas)
};

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const R = (a, b) => a + Math.random() * (b - a);
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- o que está acontecendo com a pessoa agora ---------- */
function ctx() {
  const me = store.member && store.member(store.me);
  const nome = (store.profile?.nickname || me?.name || store.user?.displayName || '').trim().split(' ')[0];
  const t = todayKey(), h = new Date().getHours(), dow = new Date().getDay();
  let pend = [], late = [], feitos = 0, pessoal = [], cabelo = null, esquecido = null, feitoPessoal = [];
  try {
    const evs = store.eventsOn ? store.eventsOn(t, { person: store.me || 'all' }) : [];
    pend = evs.filter((e) => e.status !== 'feito');
    feitos = evs.filter((e) => e.status === 'feito').length;
    late = (store.state?.events || []).filter((e) => e.status !== 'feito' && e.date < t && e.date >= t.slice(0, 8) + '01');
    const pev = personal.events || [];
    pessoal = pev.filter((p) => !p.done && p.date === t);
    esquecido = overdue()[0] || null;                                                  // lembrete do Pessoal que ficou pra trás
    feitoPessoal = pev.filter((p) => p.done && p.date === t);
    cabelo = [...feitoPessoal, ...(store.state?.events || []).filter((e) => e.status === 'feito' && e.date === t)].find((e) => /cabel|escova|corte|penteado|unha|manicure|sobrancelha/i.test(e.title || ''));
  } catch { /* ok */ }
  return { nome, h, dow, pend, late, feitos, pessoal, cabelo, esquecido, feitoPessoal, primeiro: nome ? `, ${nome}` : '' };
}

/* ---------- falas: cada uma tem uma ação real (ou nenhuma) ---------- */
/* ação: { label, go: função } — os botões aparecem no balão */
const A = {
  agendar: () => import('./views/event.js').then((m) => m.openEventEditor({ date: todayKey() })),
  lembrete: () => import('./views/personal.js').then((m) => m.openPersonalEditor()),
  atrasados: () => import('./views/event.js').then((m) => m.openEventEditor({ date: todayKey() })),
  ranking: () => import('./views/ranking.js').then((m) => m.openRanking()),
  perfil: () => import('./views/profile.js').then((m) => m.openProfile()),
  trocarPessoal: () => { location.hash = '#/p/hoje'; return Promise.resolve(); },
};

function falas(c) {
  const out = [];
  if (c.late.length) out.push({ t: c.late.length === 1 ? `Ficou 1 coisa atrasada${c.primeiro}. Quer resolver agora?` : `Ficaram ${c.late.length} coisas atrasadas${c.primeiro}. Quer ver?`, m: 'triste', u: 1, acoes: [{ label: 'Ver atrasados', go: A.atrasados }, { label: 'Agora não' }] });
  if (c.pend.length) out.push({ t: `Hoje ainda tem ${c.pend.length} ${c.pend.length === 1 ? 'coisa' : 'coisas'} pra fazer${c.primeiro}. Quer marcar mais alguma?`, m: 'acena', acoes: [{ label: 'Sim, agendar', go: A.agendar }, { label: 'Não' }] });
  if (c.pessoal.length) out.push({ t: `Você tem ${c.pessoal.length} ${c.pessoal.length === 1 ? 'lembrete' : 'lembretes'} pessoal hoje. Já cuidou?`, m: 'feliz', acoes: [{ label: 'Ver', go: A.lembrete }, { label: 'Depois' }] });
  if (c.esquecido) out.push({ t: `Ei${c.primeiro}… você esqueceu de “${c.esquecido.title}” 😅 Quer resolver agora?`, m: 'triste', u: 1, acoes: [{ label: 'Abrir', go: () => import('./views/personal.js').then((m) => m.openPersonalEditor(c.esquecido.id)) }, { label: 'Depois' }] });
  if (c.feitoPessoal.length && !c.cabelo) { const it = c.feitoPessoal[c.feitoPessoal.length - 1]; out.push({ t: `Vi que você fez “${it.title}”! Arrasou 💛`, m: 'comemora' }); }
  if (c.cabelo) out.push({ t: `Caramba, vi que você foi cuidar de você${c.primeiro}! Deve estar lindo, com certeza. Autoestima é tudo 💛`, m: 'amor' });
  if (c.feitos >= 3) out.push({ t: `Já foram ${c.feitos} feitos hoje${c.primeiro}! Que ritmo 🔥`, m: 'comemora', acoes: [{ label: 'Ver meu ranking', go: A.ranking }, { label: 'Valeu' }] });
  if (!c.pend.length && !c.late.length) out.push({ t: `Tudo em dia${c.primeiro}! Aproveita o descanso 🙌`, m: 'danca' });
  const gen = [
    { t: `Oi${c.primeiro}! Quer agendar alguma coisa?`, m: 'acena', acoes: [{ label: 'Sim', go: A.agendar }, { label: 'Não' }] },
    { t: `Tá precisando marcar algo${c.primeiro}?`, m: 'feliz', acoes: [{ label: 'Sim', go: A.agendar }, { label: 'Agora não' }] },
    { t: `Sua agenda tá em ordem? Quer dar uma olhada?`, m: 'surpreso', acoes: [{ label: 'Abrir', go: A.perfil }, { label: 'Não' }] },
    { t: `Lembre de beber água hoje${c.primeiro} 💧`, m: 'feliz' },
    { t: `Você é mais forte do que imagina${c.primeiro} 💪`, m: 'amor' },
    { t: `Respira fundo. Um passo de cada vez${c.primeiro} 🌿`, m: 'sono' },
    { t: `Tá fazendo o quê${c.primeiro}? Eu tô de olho 👀`, m: 'desconfiado' },
    { t: `Toda vez que você marca algo, eu fico feliz${c.primeiro} 🧡`, m: 'amor' },
  ];
  return out.concat(gen);
}
/* madrugada, sexta, segunda, datas */
function especiais(c) {
  const d = new Date(), md = `${d.getMonth() + 1}-${d.getDate()}`;
  if (md === '12-25') return { t: `Feliz Natal${c.primeiro}! 🎄 Hoje eu toco especial!`, m: 'danca' };
  if (md === '1-1') return { t: `Feliz Ano Novo${c.primeiro}! 🎆 Nova agenda!`, m: 'danca' };
  if (c.h >= 0 && c.h < 5) return { t: pick(['Acordado(a) a essa hora? 😴', 'Psiu… já é madrugada. Vai descansar!', 'Eu tava dormindo… mas tô aqui 🥱']), m: 'sono' };
  if (c.dow === 5 && c.h >= 17) return { t: pick(['Sextou! 🎉', 'Sexta-feira! Bora fechar a semana bonito?']), m: 'danca' };
  if (c.dow === 1 && c.h < 11) return { t: pick(['Segunda-feira… bora com calma ☕', 'Semana nova, agenda nova! 💪']), m: 'feliz' };
  return null;
}

const DONE = ['Mandou bem!', 'Isso aí! Mais um riscado!', 'Arrasou!', 'Boa! Tô orgulhoso de você!', 'Uhuul! 🙌', 'Riscou! Que sensação boa, né?'];
const DONE_LATE = ['Antes tarde do que nunca! 💪', 'Feito! O importante é não desistir.', 'Ufa! Resolvido 😮‍💨'];
const CREATED = ['Anotado! Eu te lembro 🔔', 'Deixa comigo!', 'Marcado! ✍️', 'Pode esquecer que eu lembro 😉'];
const SPY = ['Psiu… tô de olho 👀', 'Só passando pra ver se tá tudo bem…', 'Shhh 🤫', 'Achei você! 😄'];

/* ---------- o companheiro na tela ---------- */
let B = null, ultima = '', hideT = 0, spyT = 0, holdT = 0, busyUntil = 0, sumiuEm = 0, ultimoPapo = 0;
const blocked = () => !!document.querySelector('.sheet-wrap.is-open, .paywall, .ficha, .photogate, .gx, .okfx, .stk, .snhpeek') ||
  (document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName));
const el = () => B && B.querySelector('[data-snh]');
function state(s, side) { if (!B) return; B.dataset.st = s; if (side) B.dataset.side = side; }

/* o balão: texto digitado e, quando for o caso, botões de escolha */
function balao(line, ms) {
  if (!B) return;
  const box = B.querySelector('.snhbud__bub'), txt = box.querySelector('span'), btns = box.querySelector('.snhbud__acoes');
  clearTimeout(hideT);
  btns.innerHTML = '';
  (line.acoes || []).forEach((a) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'snhbud__ac'; b.textContent = a.label;
    b.onclick = (ev) => { ev.stopPropagation(); box.classList.remove('is-in'); btns.innerHTML = ''; if (a.go) a.go().catch(() => {}); };
    btns.appendChild(b);
  });
  box.classList.remove('is-in'); void box.offsetWidth; box.classList.add('is-in');
  say(el(), line.t, { bubble: txt, speed: 26 });
  busyUntil = Date.now() + (ms || Math.min(9000, 3200 + line.t.length * 45));
  hideT = setTimeout(() => { if (!box.matches(':hover') && !btns.children.length) box.classList.remove('is-in'); }, busyUntil - Date.now() + 200);
  clearTimeout(holdT);
  holdT = setTimeout(() => { if (Date.now() >= busyUntil && !btns.children.length) settle(); }, busyUntil - Date.now() + 300);
}
function fala(line, gesto, tentativa = 0) {
  if (!B) return;
  // algo aberto por cima (ficha, janela, teclado): espera e fala depois, em vez de falar escondido
  if (blocked()) { if (tentativa < 40) setTimeout(() => fala(line, gesto, tentativa + 1), 1500); return; }
  ultima = line.t; ultimoPapo = Date.now();
  state('up');
  setMood(el(), line.m || 'feliz');
  if (gesto) setTimeout(() => act(el(), gesto), 220);
  setTimeout(() => balao(line), 260);
}
/* volta a ficar quietinho no canto */
function settle() {
  if (!B) return;
  B.querySelector('.snhbud__bub').classList.remove('is-in');
  setMood(el(), new Date().getHours() >= 23 || new Date().getHours() < 5 ? 'sono' : 'feliz');
  state('rest');
}
function escolhe(lista) { let l, i = 0; do { l = pick(lista); i++; } while (l.t === ultima && i < 8); return l; }

/* ao tocar: fala algo útil e relevante (com ação quando faz sentido) */
let toques = [];
function onTap() {
  const now = Date.now();
  toques = toques.filter((t) => now - t < 3200); toques.push(now);
  try { navigator.vibrate && navigator.vibrate(8); } catch { /* ok */ }
  if (toques.length === 5) return fala({ t: pick(['Ei! Para de me cutucar! 😤', 'Assim eu fico tonto! 😵‍💫']), m: 'bravo' }, 'nao');
  if (toques.length === 9) return fala({ t: 'Tá bom, tá bom… FESTA! 🎉', m: 'danca' }, 'pulo');
  if (toques.length > 1 && toques.length < 5) return act(el(), pick(['pop', 'sim', 'riso']));
  const c = ctx();
  const e = especiais(c);
  const L = falas(c), urg = L.filter((x) => x.u);
  const linha = e && Math.random() < 0.3 ? e : urg.length && Math.random() < 0.6 ? escolhe(urg) : escolhe(L); // o urgente vem primeiro
  return fala(linha, pick(['tchau', 'sim', 'pop', 'riso']));
}

/* sai andando e aparece de novo, às vezes espiando e às vezes com algo a dizer */
function sai() {
  if (!B) return;
  state('away', pick(['l', 'r']));
  sumiuEm = Date.now();
}
function volta() {
  if (!B) return;
  state('rest', pick(['l', 'r']));
  settle();
  const c = ctx();
  if (Math.random() < 0.6) setTimeout(() => { if (!blocked()) fala(escolhe(falas(c))); }, 700);
}
/* o ciclo: some por 15 s a 1 min (aleatório), volta, fala quando tem algo; nunca passa de 1 min sumido */
function ciclo() {
  clearTimeout(spyT);
  if (!B) return;
  const sumido = B.dataset.st === 'away';
  if (sumido) { spyT = setTimeout(() => { volta(); ciclo(); }, R(15, 60) * 1000); return; }
  spyT = setTimeout(() => {
    if (!B || document.hidden || blocked() || Date.now() < busyUntil) return ciclo();
    if (Math.random() < 0.5) { // espia pela borda
      const side = pick(['l', 'r']); state('spy', side); setMood(el(), pick(['desconfiado', 'feliz', 'surpreso']));
      setTimeout(() => { if (Math.random() < 0.6) balao({ t: pick(SPY) }, 2600); else act(el(), 'sim'); }, 900);
      setTimeout(() => { if (B && B.dataset.st === 'spy') { act(el(), 'tchau'); setTimeout(() => { sai(); ciclo(); }, 1100); } }, R(3600, 5200));
    } else { sai(); ciclo(); }
  }, R(20, 60) * 1000);
}

/* ---------- API ---------- */
export function start() {
  if (B || !mascotOn()) { if (B && !mascotOn()) stop(); return; }
  document.documentElement.classList.add('snh-theme');
  B = document.createElement('div');
  B.className = 'snhbud';
  B.dataset.st = 'away'; B.dataset.side = 'r';
  B.innerHTML = `<div class="snhbud__bub" role="status" aria-live="polite"><span></span><div class="snhbud__acoes"></div></div><button class="snhbud__fig" aria-label="Lembra, seu companheiro">${sininho('feliz', { size: 96 })}</button>`;
  document.body.appendChild(B);
  B.querySelector('.snhbud__fig').addEventListener('click', onTap);
  let segurar;
  B.querySelector('.snhbud__fig').addEventListener('pointerdown', () => { segurar = setTimeout(() => { toques = []; fala({ t: 'Zzz… me acorda se precisar 😴', m: 'sono' }, null); }, 700); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => B.querySelector('.snhbud__fig').addEventListener(ev, () => clearTimeout(segurar)));
  const guarda = () => { if (B) B.classList.toggle('is-hidden', blocked()); };
  B._mo = new MutationObserver(guarda); B._mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  document.addEventListener('focusin', guarda); document.addEventListener('focusout', () => setTimeout(guarda, 50));
  // chega dando oi, com algo de verdade para dizer
  setTimeout(() => {
    state('rest');
    const c = ctx(), e = especiais(c);
    const L = falas(c), urg = L.filter((x) => x.u);
    setTimeout(() => fala(urg[0] || e || escolhe(L), 'tchau'), 900); // chega falando do que importa agora
  }, 1200);
  ciclo();
}
export function stop() {
  if (!B) return;
  B._mo && B._mo.disconnect(); B.remove(); B = null;
  clearTimeout(spyT); clearTimeout(hideT); clearTimeout(holdT);
  document.documentElement.classList.remove('snh-theme');
}
/* o app avisa o que aconteceu; ele reage */
export function react(kind, o = {}) {
  if (!B || blocked()) return;
  if (kind === 'done') return fala(o.perfect ? { t: 'Dia 100%! Você zerou tudo! 🏆', m: 'danca' } : o.late ? { t: pick(DONE_LATE), m: 'feliz' } : { t: pick(DONE), m: 'comemora' }, 'pulo');
  if (kind === 'created') return fala({ t: pick(CREATED), m: 'feliz' }, 'sim');
  if (kind === 'late') return fala({ t: 'Ih… esse passou da hora. Quer remarcar?', m: 'triste', acoes: [{ label: 'Remarcar', go: A.agendar }, { label: 'Depois' }] }, null);
}
export const active = () => !!B;
