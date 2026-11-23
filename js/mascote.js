/* Lembra, o companheiro (Sininho). Ele é parte da plataforma, não só uma frase na tela:
   - o balão traz BOTÕES que fazem coisas de verdade: concluir, trazer pra hoje, abrir a lista do que ficou pra trás,
     agendar, anotar no Pessoal, ver o ranking;
   - fala do que existe de verdade, citando pelo nome (o que ficou pra trás, o próximo compromisso, o cabelo marcado…);
   - acompanha o que a pessoa está fazendo: a tela aberta, o dia escolhido, o editor que ela abriu e fechou sem salvar,
     a rolagem, o tempo parado;
   - escolhe o que dizer por PONTOS (urgência × contexto × hora do dia × novidade), com memória no aparelho: a mesma
     fala não volta logo, e o assunto urgente perde força a cada vez que já foi dito hoje;
   - nunca fica parado: entre uma fala e outra ele pisca, olha pros lados, pensa, boceja, fica tímido, dá risada…;
   - aparece, fala e sai andando; volta sozinho em 15 s a 1 min;
   - por enquanto SÓ para o dono (CONFIG.adminEmail); para todo mundo: CONFIG.mascotPublic = true. */
import { store } from './store.js';
import { CONFIG } from '../config.js';
import { sininho, setMood, act, say, lookAt } from './sininho.js';
import { todayKey, addDays, diffDays, fmtTime } from './utils.js';
import { personal } from './personal.js';
import { itensAtrasados } from './views/atrasados.js';
import { falasDosBilhetes, padroes, marca } from './lembra-mente.js';

export const isOwner = () => !!store.user && !!CONFIG.adminEmail && (store.user.email || '').toLowerCase() === CONFIG.adminEmail.toLowerCase();
export const mascotOn = () => {
  if (CONFIG.mascotPublic) return true;
  if (isOwner()) { try { localStorage.setItem('lembra.mascote', '1'); } catch { /* ok */ } return true; }
  try { return localStorage.getItem('lembra.mascote') === '1'; } catch { return false; } // celular onde o dono já entrou (para testar com outras contas)
};

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const R = (a, b) => a + Math.random() * (b - a);
const q = (s) => { const x = (s || '').trim(); return `“${x.slice(0, 38)}${x.length > 38 ? '…' : ''}”`; };
const quando = (d) => { const n = diffDays(d, todayKey()); return n <= 1 ? 'ontem' : `há ${n} dias`; };
const mine = (e) => !store.me || (e.assignees || []).includes(store.me) || e.createdBy === store.me || !(e.assignees || []).length;
const calmo = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- memória (no aparelho): quando cada assunto foi dito e quantas vezes hoje ---------- */
const MK = 'lembra.memoria';
let MEM = (() => { try { return JSON.parse(localStorage.getItem(MK) || '{}'); } catch { return {}; } })();
if (MEM.dia !== todayKey()) MEM = { dia: todayKey(), n: {}, at: MEM.at || {}, v: MEM.v || {} };
const grava = () => { try { localStorage.setItem(MK, JSON.stringify(MEM)); } catch { /* ok */ } };
function lembrou(k, i) {
  if (MEM.dia !== todayKey()) { MEM.dia = todayKey(); MEM.n = {}; }
  MEM.at[k] = Date.now(); MEM.n[k] = (MEM.n[k] || 0) + 1;
  if (i != null) MEM.v[k] = i;
  grava();
}
/* escolhe uma variante diferente da última usada nesse assunto */
function variante(k, lista) {
  let i = Math.floor(Math.random() * lista.length);
  if (lista.length > 1 && i === MEM.v[k]) i = (i + 1 + Math.floor(Math.random() * (lista.length - 1))) % lista.length;
  return [i, lista[i]];
}

/* ---------- o que a pessoa está vendo/fazendo agora ---------- */
const TELA = { space: 'work', tab: 'hoje', date: '' };
let ultimoToque = Date.now(), editorAberto = 0, salvouAgora = 0, desistiu = 0;

function ctx() {
  const me = store.member && store.member(store.me);
  const nome = (store.profile?.nickname || me?.name || store.user?.displayName || '').trim().split(' ')[0];
  const t = todayKey(), d = new Date(), h = d.getHours(), dow = d.getDay(), agora = h * 60 + d.getMinutes();
  let pend = [], late = [], feitos = 0, pessoal = [], cabelo = null, feitoPessoal = [], prox = null, memo = null, amanha = 0;
  try {
    const evs = (store.eventsOn ? store.eventsOn(t, { person: store.me || 'all' }) : []).filter(mine);
    pend = evs.filter((e) => e.status !== 'feito');
    feitos = evs.filter((e) => e.status === 'feito').length;
    late = itensAtrasados();
    const pev = personal.events || [];
    pessoal = pev.filter((p) => !p.done && p.date === t);
    feitoPessoal = pev.filter((p) => p.done && p.date === t);
    // o próximo compromisso de hoje (Trabalho ou Pessoal) que começa em até 90 min
    prox = [...pend.map((e) => ({ ...e, k: 'w' })), ...pessoal.map((p) => ({ ...p, k: 'p' }))].filter((e) => /^\d\d:\d\d/.test(e.time || ''))
      .map((e) => ({ e, min: (+e.time.slice(0, 2)) * 60 + (+e.time.slice(3, 5)) - agora }))
      .filter((x) => x.min > 0 && x.min <= 90).sort((a, b) => a.min - b.min)[0] || null;
    cabelo = [...feitoPessoal, ...(store.state?.events || []).filter((e) => e.status === 'feito' && e.date === t)].find((e) => /cabel|escova|corte|penteado|unha|manicure|sobrancelha/i.test(e.title || ''));
    memo = (personal.memos || []).find((m) => Date.now() - (m.at || 0) < 3 * 864e5) || null;   // "deixei a chave na gaveta"
    amanha = (store.eventsOn ? store.eventsOn(addDays(t, 1), { person: store.me || 'all' }) : []).filter(mine).length;
  } catch { /* ok */ }
  return { nome, h, dow, t, pend, late, feitos, pessoal, cabelo, feitoPessoal, prox, memo, amanha, primeiro: nome ? `, ${nome}` : '' };
}

/* stories e visitas (o Lembra fofoca com você sobre os amigos) */
let ST = null;
const visKey = 'lembra.visitasVistas';
/* ---------- ações reais (os botões do balão) ---------- */
const A = {
  agendar: (date = todayKey()) => import('./views/event.js').then((m) => m.openEventEditor({ date })),
  lembrete: () => import('./views/personal.js').then((m) => m.openPersonalEditor()),
  atrasados: () => import('./views/atrasados.js').then((m) => m.openAtrasados()),
  ranking: () => import('./views/ranking.js').then((m) => m.openRanking()),
  perfil: () => import('./views/profile.js').then((m) => m.openProfilePage({ tab: 'numeros' })),
  pessoal: () => { location.hash = '#/p/hoje'; return Promise.resolve(); },
  abrir: (it) => (it.k === 'w'
    ? import('./views/event.js').then((m) => m.openEventDetail(it.id))
    : import('./views/personal.js').then((m) => m.openPersonalEditor(it.id))),
  feito: async (it) => {
    if (it.k === 'w') { const ev = store.event(it.id); if (ev) await store.upsert('events', { ...ev, status: 'feito' }); }
    else { const p = personal.item(it.id); if (p) (await import('./personal.js')).savePersonal({ ...p, done: true }); }
    setTimeout(() => fala(itensAtrasados().length
      ? { t: pick(['Riscado! Um a menos 💪', 'Feito! Que alívio, né?', 'Isso! Bem melhor assim 🙌']), m: 'comemora' }
      : { t: pick(['Zerou tudo o que tinha ficado pra trás! 🎉', 'Caixa zerada! Tô muito orgulhoso 🏆']), m: 'danca' }, 'pulo'), 500);
  },
  praHoje: async (it) => {
    if (it.k === 'w') { const ev = store.event(it.id); if (ev) await store.upsert('events', { ...ev, date: todayKey() }); }
    else { const p = personal.item(it.id); if (p) (await import('./personal.js')).savePersonal({ ...p, date: todayKey() }); }
    setTimeout(() => fala({ t: pick([`Trouxe ${q(it.title)} pra hoje. Agora vai! 😉`, `${q(it.title)} tá na agenda de hoje. Te lembro na hora 🔔`]), m: 'feliz' }, 'sim'), 400);
  },
};
const agendaAqui = () => A.agendar(TELA.date || todayKey());

/* ---------- falas: cada uma tem assunto (k), pontos de contexto e, quando faz sentido, ação ---------- */
function falas(c) {
  const out = [], L = c.late;
  /* o que ficou pra trás, citado pelo nome — com botões que resolvem ali mesmo */
  if (L.length === 1) {
    const it = L[0], T = q(it.title), w = quando(it.date);
    const [i, t] = variante('late', [
      `${T} ficou pra trás (${w}). Resolvo com você agora?`,
      `Plim! 🔔 ${T} tá te esperando desde ${w === 'ontem' ? 'ontem' : w.replace('há ', 'uns ') + ' atrás'}.`,
      `Atrasado não é perdido: ${T} ainda dá tempo!`,
      `Lembra de ${T}? Eu lembro. É meu nome, né 😅`,
      `${T} ficou pra trás. Que tal trazer pra frente?`,
    ]);
    out.push({ k: 'late', i, t, m: 'triste', u: 3, acoes: [{ label: 'Feito ✓', go: () => A.feito(it) }, { label: 'Pra hoje', go: () => A.praHoje(it) }, { label: 'Abrir', go: () => A.abrir(it) }] });
  } else if (L.length > 1) {
    const nomes = L.slice(0, 2).map((x) => `${q(x.title)} (${quando(x.date)})`).join(' e ');
    const resto = L.length > 2 ? ` e mais ${L.length - 2}` : '';
    const [i, t] = variante('late', [
      `Ficou pra trás: ${nomes}${resto}. Vamos zerar juntos?`,
      `Tô tocando o sino 🔔 por ${nomes}${resto}. Bora resolver?`,
      `${L.length} coisas esperando: ${nomes}${resto}. Uma de cada vez, sem pressa 🧡`,
      `Atrasado não é perdido! ${nomes}${resto} ainda dá tempo.`,
    ]);
    out.push({ k: 'late', i, t, m: 'triste', u: 3, acoes: [{ label: `Ver os ${L.length}`, go: A.atrasados }, { label: 'Agora não' }] });
  }
  /* o que a pessoa escreveu nos bilhetes: ele lembra e puxa assunto */
  try { [...falasDosBilhetes(), ...padroes()].forEach((f) => out.push({ ...f, acoes: (f.acoes || []).map((a) => ({ label: a.label, go: () => {
    marca(f.memoId);
    if (a.abrir) import('./views/personal.js').then((m) => m.openPersonalEditor(null, a.abrir));
    if (a.resposta) setTimeout(() => fala({ t: a.resposta.t, m: a.resposta.m }, a.resposta.gesto || 'sim'), a.abrir ? 1600 : 450);
  } })) })); } catch { /* ok */ }
  /* amigos: story novo e visitas no perfil (gatilho de curiosidade) */
  if (ST) {
    const novos = ST.feedCache().rows.filter((r) => !r.me && r.stories.some((x) => !x.seen));
    if (novos.length) {
      const r = novos[0], st = r.stories.find((x) => !x.seen), n1 = r.name.split(' ')[0];
      const [i, t] = variante('story', [
        `Tu viu que ${n1} ${st.title ? `fez “${st.title}”` : 'concluiu um compromisso'}? Postou até story! Quer ver? 👀`,
        `Psiu… ${n1} postou story agora há pouco. Bora espiar antes que suma? 🤭`,
        `${n1} tá mostrando serviço: story novo no ar 📸 Quer ver?`,
        novos.length > 1 ? `${novos.length} amigos postaram story hoje. Você vai ficar de fora? 👀` : `Fofoca fresquinha: ${n1} postou story 🤫 Quer ver?`,
      ]);
      out.push({ k: 'story', i, t, m: 'desconfiado', roteiro: ['olhaLados', 'maoBoca'], u: 2.1, acoes: [{ label: 'Quero ver', go: () => ST.openViewer(r.uid) }, { label: 'Depois' }] });
    }
    const vis = ST.visitasCache().list; let vistos = 0; try { vistos = +localStorage.getItem(visKey) || 0; } catch { /* ok */ }
    const recentes = vis.filter((v) => v.at > vistos);
    if (recentes.length) {
      const [i, t] = variante('visitas', [
        `Quer saber quem entrou no seu perfil pra ver o que você postou? 👀`,
        `Viu quem tá bisbilhotando o seu perfil? ${recentes.length > 1 ? `Foram ${recentes.length} pessoas!` : 'Tem gente curiosa 🤭'}`,
        `Psiu… alguém passou no seu perfil. Quer descobrir quem foi? 🕵️`,
      ]);
      out.push({ k: 'visitas', i, t, m: 'desconfiado', roteiro: ['sobrancelha', 'cinico'], u: 1.9, acoes: [{ label: 'Quero saber', go: () => { try { localStorage.setItem(visKey, String(Date.now())); } catch { /* ok */ } return ST.openVisitors(); } }, { label: 'Nem ligo' }] });
    }
  }
  /* o próximo compromisso, quando está chegando */
  if (c.prox) {
    const { e, min } = c.prox, T = q(e.title), em = min < 60 ? `${min} min` : `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;
    const [i, t] = variante('prox', [
      `Daqui a ${em}: ${T}. Já tá se preparando?`,
      `Psiu… ${T} começa em ${em} ⏰`,
      `Contagem regressiva: ${em} pra ${T}!`,
      `Às ${fmtTime(e.time)} tem ${T}. Eu te cutuco na hora 🔔`,
    ]);
    out.push({ k: 'prox', i, t, m: min < 20 ? 'surpreso' : 'acena', u: min < 30 ? 2 : 1, acoes: [{ label: 'Abrir', go: () => A.abrir(e) }, { label: 'Ok!' }] });
  }
  if (c.pend.length && !c.prox) {
    const n = c.pend.length, falta = n === 1 ? 'Falta 1' : `Faltam ${n}`;
    const [i, t] = variante('pend', [
      `Hoje ainda tem ${n} ${n === 1 ? 'coisa' : 'coisas'} pra fazer${c.primeiro}. Bora riscar?`,
      `${falta} pra fechar o dia com chave de ouro 🔑`,
      `Quanto mais você risca, mais eu sorrio 😄 ${falta}!`,
    ]);
    out.push({ k: 'pend', i, t, m: 'acena', ctx: TELA.tab === 'hoje' && TELA.space === 'work' ? 1 : 0 });
  }
  if (c.pessoal.length) out.push({ k: 'pessoal', t: `Você tem ${c.pessoal.length === 1 ? q(c.pessoal[0].title) : `${c.pessoal.length} lembretes`} no Pessoal hoje. Já cuidou?`, m: 'feliz', ctx: TELA.space === 'personal' ? 1 : 0, acoes: TELA.space === 'personal' ? null : [{ label: 'Ver', go: A.pessoal }, { label: 'Depois' }] });
  if (c.cabelo) out.push({ k: 'cabelo', t: `Caramba, vi que você foi cuidar de você${c.primeiro}! Deve estar lindo, com certeza. Autoestima é tudo 💛`, m: 'amor', u: 1 });
  else if (c.feitoPessoal.length) { const it = c.feitoPessoal[c.feitoPessoal.length - 1]; out.push({ k: 'feitoP', t: pick([`Vi que você fez ${q(it.title)}! Arrasou 💛`, `${q(it.title)}: check! ✔️ Mandou bem`]), m: 'comemora' }); }
  if (c.feitos >= 3) out.push({ k: 'ritmo', t: pick([`Já foram ${c.feitos} feitos hoje${c.primeiro}! Que ritmo 🔥`, `${c.feitos} riscados! Você tá on fire 🔥`]), m: 'comemora', acoes: [{ label: 'Ver ranking', go: A.ranking }, { label: 'Valeu' }] });
  if (!c.pend.length && !L.length) out.push({ k: 'emdia', t: pick([`Tudo em dia${c.primeiro}! Aproveita o descanso 🙌`, 'Agenda zerada, coração tranquilo 💛', 'Nada pendente. Pode até tirar um cochilo… eu vigio 😴']), m: 'danca' });
  if (c.memo) out.push({ k: 'memo', t: `Você me pediu pra lembrar: ${q(c.memo.text)} 🧠`, m: 'desconfiado', gesto: 'pensa', ctx: TELA.space === 'personal' ? 1 : 0 });
  if (c.h >= 18 && c.amanha) out.push({ k: 'amanha', t: `Amanhã tem ${c.amanha} ${c.amanha === 1 ? 'compromisso' : 'compromissos'}. Já deixa a cabeça pronta 🌙`, m: 'feliz' });

  /* o que a pessoa está vendo agora */
  if (TELA.space === 'work' && TELA.date && TELA.date > c.t) out.push({ k: 'futuro', t: pick(['Planejando o futuro? Assim que eu gosto 🔮', 'Olhando lá na frente, hein? Quer marcar algo nesse dia?']), m: 'surpreso', ctx: 2, acoes: [{ label: 'Marcar nesse dia', go: () => A.agendar(TELA.date) }, { label: 'Só olhando' }] });
  if (TELA.space === 'work' && TELA.date && TELA.date < c.t) out.push({ k: 'passado', t: 'Relembrando o que passou? Quem vive de passado é museu… mas eu guardo tudo pra você 😄', m: 'desconfiado', ctx: 2 });
  if (TELA.space === 'work' && TELA.tab === 'mes') out.push({ k: 'mes', t: 'Toca num dia pra ver tudo o que tem nele 📅', m: 'acena', ctx: 1 });
  if (TELA.space === 'work' && TELA.tab === 'ajustes') out.push({ k: 'ajustes', t: 'Mexendo nas configurações? Se travar em algo, me chama 🛠️', m: 'desconfiado', ctx: 2 });
  if (TELA.space === 'personal') out.push({ k: 'pessoalTela', t: pick(['Aqui é só seu. Nem seu chefe vê 🤫', 'Cantinho pessoal: pode anotar até onde deixou a chave 🔑']), m: 'amor', ctx: 1, acoes: [{ label: 'Anotar algo', go: A.lembrete }, { label: 'Depois' }] });
  if (desistiu && Date.now() - desistiu < 60000) out.push({ k: 'desistiu', t: pick(['Fechou sem salvar? Se lembrar depois, é só me chamar 😉', 'Esqueceu o que ia marcar? Acontece! Quer tentar de novo?']), m: 'desconfiado', gesto: 'pensa', ctx: 3, acoes: [{ label: 'Tentar de novo', go: agendaAqui }, { label: 'Deixa' }] });

  /* hora do dia */
  if (c.h >= 5 && c.h < 10) out.push({ k: 'manha', t: pick([`Bom dia${c.primeiro}! ☀️ Bora começar leve?`, 'Café tomado? Então bora ☕', 'Manhã é ótima pra riscar o mais difícil primeiro 💪']), m: 'acena', tod: 1 });
  if (c.h >= 11 && c.h < 14) out.push({ k: 'almoco', t: pick(['Já almoçou? Saco vazio não para em pé 🍽️', 'Pausa pro almoço também é compromisso 😋']), m: 'feliz', tod: 1 });
  if (c.h >= 14 && c.h < 17) out.push({ k: 'tarde', t: pick(['Tarde de produtividade? Eu acredito em você 💪', 'Aquela moleza da tarde… bebe uma água 💧']), m: 'feliz', tod: 1 });
  if (c.h >= 21 || c.h < 5) out.push({ k: 'noite', t: pick(['Já já é hora de descansar 🌙', 'Deixa o amanhã comigo. Eu lembro 😴']), m: 'sono', tod: 1 });

  /* papo leve (sempre disponível, com pouco peso) */
  [
    ['oi', `Oi${c.primeiro}! Quer agendar alguma coisa?`, 'acena', [{ label: 'Sim', go: agendaAqui }, { label: 'Não' }]],
    ['marcar', `Tá precisando marcar algo${c.primeiro}?`, 'feliz', [{ label: 'Sim', go: agendaAqui }, { label: 'Agora não' }]],
    ['agua', 'Bebe uma água 💧 Eu sou o Lembra, não posso deixar passar!', 'feliz'],
    ['forte', `Você é mais forte do que imagina${c.primeiro} 💪`, 'amor'],
    ['respira', 'Respira fundo. Um passo de cada vez 🌿', 'sono'],
    ['olho', 'Tá fazendo o quê? Eu tô de olho 👀', 'desconfiado'],
    ['marcou', 'Toda vez que você marca algo, eu fico feliz 🧡', 'amor'],
    ['sino', 'Sabia que eu sou um sino? Por isso vivo te dando um toque 🔔', 'feliz'],
    ['cabeca', 'Deixa a memória comigo e a cabeça livre pra você 🧠', 'feliz'],
    ['perfil', 'Quer ver como tá sua ofensiva? 🔥', 'surpreso', [{ label: 'Ver', go: A.perfil }, { label: 'Depois' }]],
    ['boba1', 'Eu ia te contar uma piada de calendário… mas ela é meio datada 😅', 'desconfiado'],
    ['boba2', 'Sabia que sino não sente cócegas? Mentira. Sinto sim 🤭', 'feliz'],
    ['boba3', 'Plim plom! Era só pra ver se você tava prestando atenção 👀', 'desconfiado'],
    ['boba4', 'Se eu tivesse braço maior, eu mesmo anotava pra você 💪', 'feliz'],
    ['boba5', 'Meu sonho é ser despertador. Mas sou fofo demais pra acordar alguém no susto 😌', 'amor'],
    ['boba6', 'Nunca esqueço nada. É meu único talento… e minha beleza, claro 💅', 'desconfiado'],
    ['boba7', 'Hoje eu acordei badalando! 🔔🎶', 'danca'],
    ['boba8', 'Me dá um toque que eu te dou um lembrete. Trato feito? 🤝', 'acena'],
    ['boba9', 'Tô de olho em você… brincadeira. Ou não 👀', 'desconfiado'],
    ['boba10', 'Você fica bem melhor quando sorri. Pronto, falei 🥹', 'amor'],
  ].forEach(([k, t, m, acoes]) => out.push({ k, t, m, acoes, leve: 1 }));
  return out;
}

/* pontos: o que mais importa agora, sem repetir o que acabou de ser dito */
function pontua(l) {
  const desde = (Date.now() - (MEM.at[l.k] || 0)) / 60000;          // minutos desde a última vez
  const vezes = (MEM.n || {})[l.k] || 0;                            // quantas vezes hoje
  let p = 10;
  if (l.u) p += l.u * 22 * Math.max(0.15, 1 - vezes / 4);             // urgente, mas cansa: perde força a cada vez no dia
  if (l.ctx) p += l.ctx * 14;                                       // fala do que a pessoa está vendo
  if (l.tod) p += 8 * Math.max(0, 1 - vezes / 2);
  if (l.leve) p -= 4;
  p += Math.min(25, desde / 6);                                     // novidade: quanto mais tempo sem dizer, mais pontos
  if (!MEM.at[l.k]) p += 12;                                        // nunca disse
  if (desde < (l.u ? 6 : 15)) p -= 80;                              // acabou de dizer: quase proibido
  if (l.t === ultima) p -= 200;
  return p + Math.random() * 14;                                    // um pouco de acaso: nunca robótico
}
const melhor = (L) => L.map((l) => [pontua(l), l]).sort((a, b) => b[0] - a[0])[0]?.[1];

/* madrugada, sexta, segunda, datas */
function especiais(c) {
  const d = new Date(), md = `${d.getMonth() + 1}-${d.getDate()}`;
  if (md === '12-25') return { k: 'natal', t: `Feliz Natal${c.primeiro}! 🎄 Hoje eu toco especial!`, m: 'danca' };
  if (md === '1-1') return { k: 'ano', t: `Feliz Ano Novo${c.primeiro}! 🎆 Agenda nova, vida nova!`, m: 'danca' };
  if (c.h >= 0 && c.h < 5) return { k: 'madru', t: pick(['Acordado(a) a essa hora? 😴', 'Psiu… já é madrugada. Vai descansar!', 'Eu tava dormindo… mas tô aqui 🥱']), m: 'sono' };
  if (c.dow === 5 && c.h >= 17) return { k: 'sextou', t: pick(['Sextou! 🎉', 'Sexta-feira! Bora fechar a semana bonito?']), m: 'danca' };
  if (c.dow === 1 && c.h < 11) return { k: 'segunda', t: pick(['Segunda-feira… bora com calma ☕', 'Semana nova, agenda nova! 💪']), m: 'feliz' };
  return null;
}
const abre = (c) => { const e = especiais(c); return e && !(MEM.n || {})[e.k] ? e : melhor(falas(c)); };

const DONE = ['Mandou bem!', 'Isso aí! Mais um riscado!', 'Arrasou!', 'Boa! Tô orgulhoso de você!', 'Uhuul! 🙌', 'Riscou! Que sensação boa, né?', 'Check! ✔️ Você é fera', 'Plim! 🔔 Mais um pra conta'];
const DONE_LATE = ['Antes tarde do que nunca! 💪', 'Feito! O importante é não desistir.', 'Ufa! Resolvido 😮‍💨', 'Atrasou, mas não falhou! 🙌'];
const CREATED = ['Anotado! Eu te lembro 🔔', 'Deixa comigo!', 'Marcado! ✍️', 'Pode esquecer que eu lembro 😉', 'Guardei na minha memória de sino 🔔', 'Feito! Agora é comigo'];
const SPY = ['Psiu… tô de olho 👀', 'Só passando pra ver se tá tudo bem…', 'Shhh 🤫', 'Achei você! 😄', 'Cadê? Achou! 🙈'];
const outra = (L) => pick(L.filter((x) => x !== ultima));

/* ---------- o companheiro na tela ---------- */
let B = null, ultima = '', hideT = 0, spyT = 0, holdT = 0, busyUntil = 0, cenaT = 0, ultimoGesto = '';
const blocked = () => !!document.querySelector('.sheet-wrap.is-open, .paywall, .ficha, .photogate, .gx, .okfx, .stk, .stv, .snhpeek, .spaceveil') ||
  (document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName));
const el = () => B && B.querySelector('[data-snh]');
function state(s, side) { if (!B) return; B.dataset.st = s; if (side) B.dataset.side = side; }
const falando = () => Date.now() < busyUntil;

/* o balão: texto digitado e, quando for o caso, botões de escolha */
function balao(line, ms) {
  if (!B) return;
  const box = B.querySelector('.snhbud__bub'), txt = box.querySelector('span'), btns = box.querySelector('.snhbud__acoes');
  clearTimeout(hideT); clearTimeout(holdT);
  btns.innerHTML = '';
  (line.acoes || []).forEach((a) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'snhbud__ac'; b.textContent = a.label;
    b.onclick = (ev) => {
      ev.stopPropagation(); box.classList.remove('is-in'); btns.innerHTML = ''; busyUntil = 0;
      import('./sfx.js').then((m) => m.ui('clique')).catch(() => {});
      if (a.go) { act(el(), 'sim'); Promise.resolve().then(a.go).catch(() => {}); } else { act(el(), 'tchau'); }
      setTimeout(settle, 1000);
    };
    btns.appendChild(b);
  });
  box.classList.remove('is-in'); void box.offsetWidth; box.classList.add('is-in');
  say(el(), line.t, { bubble: txt, speed: 26 });
  const dura = ms || Math.min(11000, 3400 + line.t.length * 48) + (line.acoes ? 6000 : 0); // com botões, dá tempo de decidir
  busyUntil = Date.now() + dura;
  hideT = setTimeout(() => { if (!box.matches(':hover')) { box.classList.remove('is-in'); btns.innerHTML = ''; } }, dura + 200);
  holdT = setTimeout(() => { if (!falando()) settle(); }, dura + 400);
}
function fala(line, gesto, tentativa = 0) {
  if (!B || !line) return;
  // algo aberto por cima (ficha, janela, teclado): espera e fala depois, em vez de falar escondido
  if (blocked()) { if (tentativa < 40) setTimeout(() => fala(line, gesto, tentativa + 1), 1500); return; }
  ultima = line.t;
  if (line.k) lembrou(line.k, line.i);
  state('up');
  setMood(el(), line.m || 'feliz');
  const g = gesto || line.gesto;
  if (g) setTimeout(() => act(el(), g), 220);
  // roteiro: uma sequência de gestos enquanto fala (olha pros lados, desconfia, tapa a boca rindo…)
  (line.roteiro || []).forEach((r, i) => setTimeout(() => { if (B && falando()) act(el(), r); }, 900 + i * 1900));
  setTimeout(() => balao(line), 260);
}

/* ---------- fingindo que dorme: o tapinha acorda, ele sente a dor e jura que não tava dormindo ---------- */
let fingindo = false, fingeT = 0;
const DESCULPAS = [
  'Ai! 😣 Eu não tava dormindo… tava só fingindo!',
  'Aiii! Tava de olho fechado, mas com o ouvido bem aberto 👂',
  'Dormindo? Eu?! Tava meditando, tá? 🧘',
  'Ai, isso é jeito de acordar um sino? Quase toquei sozinho! 🔔',
  'Ei! Tava só descansando a vista… e cuidando da sua agenda ao mesmo tempo 😤',
  'Ai! Eu tava testando se você ia sentir minha falta 😏',
];
function fingeDormir() {
  if (!B || fingindo || falando()) return;
  fingindo = true; state('rest');
  setMood(el(), 'sono'); act(el(), 'boceja');
  clearTimeout(fingeT);
  fingeT = setTimeout(() => { if (fingindo) { fingindo = false; act(el(), 'susto'); setTimeout(() => setMood(el(), 'feliz'), 900); } }, R(25, 50) * 1000);
}
function levaTapinha() {
  fingindo = false; clearTimeout(fingeT); busyUntil = 0;
  setMood(el(), 'bravo'); act(el(), 'dor');
  try { navigator.vibrate && navigator.vibrate([30, 40, 20]); } catch { /* ok */ }
  setTimeout(() => fala({ t: outra(DESCULPAS), m: 'desconfiado', roteiro: ['cinico'] }), 650);
}
/* volta a ficar quietinho no canto */
function settle() {
  if (!B || falando()) return;
  B.querySelector('.snhbud__bub').classList.remove('is-in');
  setMood(el(), new Date().getHours() >= 23 || new Date().getHours() < 5 ? 'sono' : 'feliz');
  if (B.dataset.st === 'up') state('rest');
}

/* ---------- vida própria: uma "cena" curta a cada poucos segundos, nunca a mesma duas vezes seguidas ---------- */
const CENAS = [
  { g: 'olhaLados', w: 3 }, { g: 'pisca', w: 2 }, { g: 'pensa', w: 2 }, { g: 'riso', w: 1.5 }, { g: 'sim', w: 1 },
  { g: 'pop', w: 1 }, { g: 'timido', w: 1.2 }, { g: 'tchau', w: 1 }, { g: 'pulo', w: 0.8 },
  { m: 'surpreso', g: 'pop', w: 0.8, volta: 1300 }, { m: 'amor', w: 0.8, volta: 2200 }, { m: 'desconfiado', g: 'olhaLados', w: 1, volta: 2000 },
  { g: 'cinico', w: 1.2 }, { g: 'coca', w: 1.2 }, { g: 'sobrancelha', w: 1.3 }, { g: 'balanca', w: 1.4 }, { g: 'maoBoca', w: 0.9 }, { g: 'susto', w: 0.4 },
  { m: 'desconfiado', g: 'cinico', w: 0.8, volta: 2200 }, { m: 'danca', w: 0.5, volta: 2600 },
];
function cena() {
  clearTimeout(cenaT);
  cenaT = setTimeout(cena, R(4.5, 10) * 1000);
  if (!B || document.hidden || calmo() || B.dataset.st === 'away' || falando() || blocked()) return;
  const parado = (Date.now() - ultimoToque) / 1000, h = new Date().getHours();
  // sem mexer na tela há um tempo (ou tarde da noite): boceja e cochila um pouquinho
  if ((parado > 45 || h >= 23 || h < 5) && Math.random() < 0.45) { act(el(), 'boceja'); if (parado > 90) setMood(el(), 'sono'); return; }
  if (fingindo) return;
  if (Math.random() < 0.07) return fingeDormir();
  const pool = CENAS.filter((c) => (c.g || c.m) !== ultimoGesto), tot = pool.reduce((s, c) => s + c.w, 0);
  let r = Math.random() * tot, c = pool[0];
  for (const x of pool) { r -= x.w; if (r <= 0) { c = x; break; } }
  ultimoGesto = c.g || c.m;
  if (c.m) { setMood(el(), c.m); if (c.volta) setTimeout(() => { if (!falando()) setMood(el(), 'feliz'); }, c.volta); }
  if (c.g) setTimeout(() => act(el(), c.g), c.m ? 200 : 0);
}

/* ao tocar: fala o que mais importa agora (com ação quando faz sentido) */
let toques = [];
function onTap() {
  if (fingindo || el()?.dataset.snh === 'sono') return levaTapinha();
  const now = Date.now();
  toques = toques.filter((t) => now - t < 3200); toques.push(now);
  try { navigator.vibrate && navigator.vibrate(8); } catch { /* ok */ }
  if (toques.length === 5) return fala({ t: pick(['Ei! Para de me cutucar! 😤', 'Assim eu fico tonto! 😵‍💫', 'Cócegas não! 😆']), m: 'bravo' }, 'nao');
  if (toques.length === 9) return fala({ t: 'Tá bom, tá bom… FESTA! 🎉', m: 'danca' }, 'pulo');
  if (toques.length > 1 && toques.length < 5) return act(el(), pick(['pop', 'sim', 'riso', 'timido', 'pisca']));
  busyUntil = 0;
  return fala(abre(ctx()), pick(['tchau', 'sim', 'pop', 'riso']));
}

/* sai andando e aparece de novo, às vezes espiando e às vezes com algo a dizer */
function sai() { if (!B || falando()) return; state('away', pick(['l', 'r'])); }
function volta() {
  if (!B) return;
  fingindo = false;
  state('rest', pick(['l', 'r']));
  settle();
  if (Math.random() < 0.65) setTimeout(() => { if (!blocked()) fala(melhor(falas(ctx())), 'tchau'); }, 800);
  else setTimeout(() => act(el(), pick(['tchau', 'pulo', 'pisca'])), 700);
}
/* o ciclo: some por 15 s a 1 min (aleatório), volta, fala quando tem algo; nunca passa de 1 min sumido */
function ciclo() {
  clearTimeout(spyT);
  if (!B) return;
  if (B.dataset.st === 'away') { spyT = setTimeout(() => { volta(); ciclo(); }, R(15, 60) * 1000); return; }
  spyT = setTimeout(() => {
    if (!B || document.hidden || blocked() || falando()) return ciclo();
    if (Math.random() < 0.5) { // espia pela borda
      const side = pick(['l', 'r']); state('spy', side); setMood(el(), pick(['desconfiado', 'feliz', 'surpreso']));
      setTimeout(() => { if (Math.random() < 0.6) balao({ t: pick(SPY) }, 2600); else act(el(), pick(['sim', 'olhaLados', 'pisca'])); }, 900);
      setTimeout(() => { if (B && B.dataset.st === 'spy') { act(el(), 'tchau'); setTimeout(() => { busyUntil = 0; sai(); ciclo(); }, 1100); } }, R(3600, 5200));
    } else { sai(); ciclo(); }
  }, R(20, 60) * 1000);
}

/* ---------- acompanha o que a pessoa faz ---------- */
function ouvir() {
  window.addEventListener('lembra:tela', (ev) => {
    const d = ev.detail || {}, antes = { ...TELA };
    Object.assign(TELA, d);
    if (!B || blocked() || falando() || B.dataset.st === 'away') return;
    // trocou de tela/dia: ele olha, e às vezes comenta (se valer a pena)
    if (antes.tab !== TELA.tab || antes.space !== TELA.space || antes.date !== TELA.date) {
      act(el(), pick(['olhaLados', 'pop', 'sim']));
      if (Math.random() < 0.4) setTimeout(() => { const l = melhor(falas(ctx()).filter((x) => x.ctx)); if (l && pontua(l) > 35) fala(l); }, 900);
    }
  });
  document.addEventListener('pointerdown', (ev) => { ultimoToque = Date.now(); if (B && !B.contains(ev.target) && el()?.dataset.snh === 'sono' && !fingindo && !falando()) setMood(el(), 'surpreso'); }, { passive: true });
  // rolagem: ele acompanha com os olhos
  let rolT = 0, y0 = scrollY;
  addEventListener('scroll', () => {
    if (!B || rolT) return;
    rolT = setTimeout(() => { rolT = 0; const f = el(); if (f) { const r = f.getBoundingClientRect(); lookAt(f, r.left + r.width / 2, scrollY > y0 ? innerHeight : 0, 0.9); } y0 = scrollY; }, 120);
  }, { passive: true });
  // abriu um editor (tem "Salvar") e fechou sem salvar: ele percebe
  new MutationObserver(() => {
    const ed = document.querySelector('.sheet-wrap.is-open [data-save]');
    if (ed && !editorAberto) editorAberto = Date.now();
    if (!ed && editorAberto) {
      const durou = Date.now() - editorAberto; editorAberto = 0;
      setTimeout(() => {
        if (Date.now() - salvouAgora < 2500 || durou < 2500) return;
        desistiu = Date.now();
        if (B && !falando()) fala(falas(ctx()).find((x) => x.k === 'desistiu'));
      }, 900);
    }
  }).observe(document.getElementById('sheets') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
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
  B.querySelector('.snhbud__fig').addEventListener('pointerdown', () => { segurar = setTimeout(() => { toques = []; fala({ t: 'Zzz… me acorda se precisar 😴', m: 'sono' }, 'boceja'); }, 700); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => B.querySelector('.snhbud__fig').addEventListener(ev, () => clearTimeout(segurar)));
  const guarda = () => { if (B) B.classList.toggle('is-hidden', blocked()); };
  B._mo = new MutationObserver(guarda); B._mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  document.addEventListener('focusin', guarda); document.addEventListener('focusout', () => setTimeout(guarda, 50));
  if (!window.__snhOuve) { window.__snhOuve = 1; ouvir(); }
  import('./stories.js').then((m) => { ST = m; const up = () => { if (!document.hidden) Promise.all([m.refreshFeed(), m.refreshVisitors()]).catch(() => {}); }; up(); clearInterval(window.__stT); window.__stT = setInterval(up, 3 * 60e3); }).catch(() => {});
  // só no modo de teste local (emuladores): ganchos para o robô de testes
  try { if (localStorage.getItem('cal.emulator') === '1' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__lembra = { finge: () => { state('rest'); busyUntil = 0; fingeDormir(); }, toca: onTap, falas: () => falas(ctx()), estado: () => ({ st: B && B.dataset.st, humor: el()?.dataset.snh, fingindo, fala: B && B.querySelector('.snhbud__bub span')?.textContent }) }; } catch { /* ok */ }
  // chega dando oi, com o que mais importa agora
  setTimeout(() => { state('rest'); setTimeout(() => fala(abre(ctx()), 'tchau'), 900); }, 1200);
  ciclo(); cena();
}
export function stop() {
  if (!B) return;
  B._mo && B._mo.disconnect(); B.remove(); B = null;
  clearTimeout(spyT); clearTimeout(hideT); clearTimeout(holdT); clearTimeout(cenaT);
  document.documentElement.classList.remove('snh-theme');
}
/* o app avisa o que aconteceu; ele reage */
export function react(kind, o = {}) {
  if (kind === 'created') salvouAgora = Date.now();
  if (!B || blocked()) return;
  busyUntil = 0;
  if (kind === 'done') return fala(o.perfect ? { k: 'perfeito', t: pick(['Dia 100%! Você zerou tudo! 🏆', 'Zerou o dia! Pode comemorar 🎉']), m: 'danca' } : o.late ? { t: outra(DONE_LATE), m: 'feliz' } : { t: outra(DONE), m: 'comemora' }, 'pulo');
  if (kind === 'created') return fala({ t: outra(CREATED), m: 'feliz' }, 'sim');
  if (kind === 'story') return fala({ t: pick(['Postou story! Agora todo mundo vai ver que você fez 😎📸', 'XP em dobro na conta! Fotógrafo(a) profissional, hein 📸', 'Prova registrada! Ninguém pode dizer que você não fez 😏']), m: 'danca', roteiro: ['balanca'] }, 'pulo');
  if (kind === 'visitas') { try { localStorage.setItem(visKey, String(Date.now())); } catch { /* ok */ } return o.n ? fala({ t: pick([`Hmm… que que será que ${(o.nome || 'essa pessoa').split(' ')[0]} tava querendo, hein? 🤭`, `${(o.nome || 'Alguém').split(' ')[0]} passou por aqui… será que tá com saudade? 👀`, 'Olha quanta gente curiosa com a sua vida 😏']), m: 'desconfiado', roteiro: ['olhaLados', 'maoBoca'] }, 'sobrancelha') : fala({ t: 'Ninguém passou ainda… posta um story que o povo aparece 😉', m: 'feliz' }, 'pisca'); }
  if (kind === 'late') return fala({ t: 'Ih… esse passou da hora. Quer ver o que ficou pra trás?', m: 'triste', acoes: [{ label: 'Ver', go: A.atrasados }, { label: 'Depois' }] }, null);
}
export const active = () => !!B;
