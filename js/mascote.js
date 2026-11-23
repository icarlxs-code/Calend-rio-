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
import { sininho, setMood, act, say, lookAt, rigOf, reactNivel, reactErro } from './sininho.js';
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
    const fc = ST.feedCache();
    if (fc.pedidos > 0) {
      const [i, t] = variante('pedidos', [
        fc.pedidos === 1 ? 'Ei! Tem alguém querendo ser seu amigo 👀 Quer ver quem é?' : `${fc.pedidos} pedidos de amizade te esperando! Você tá famoso(a), hein 😎`,
        'Psiu… chegou pedido de amizade. Vai deixar a pessoa no vácuo? 🤭',
      ]);
      out.push({ k: 'pedidos', i, t, m: 'surpreso', roteiro: ['pulo', 'sobrancelha'], u: 2.2, acoes: [{ label: 'Ver pedido', go: () => import('./friends.js').then((m) => m.openFriends()) }, { label: 'Depois' }] });
    }
    const on = (fc.online || []).filter((x) => x.uid);
    if (on.length) {
      const n1 = on[0].name.split(' ')[0];
      const [i, t] = variante('online', [
        on.length === 1 ? `${n1} tá online agora 🟢 Bora ver o que anda aprontando?` : `${n1} e mais ${on.length - 1} amigo${on.length > 2 ? 's' : ''} estão online agora 🟢`,
        `Olha só quem apareceu: ${n1} tá on! 👋`,
        `${n1} tá no Lembra agora. Será que já riscou tudo de hoje? 🤔`,
      ]);
      out.push({ k: 'online', i, t, m: 'acena', roteiro: ['olhaLados'], u: 1.2, acoes: [{ label: 'Ver perfil', go: () => import('./friends.js').then((m) => m.openPublicProfile(on[0].uid, on[0])) }, { label: 'Depois' }] });
    }
    /* concluiu e não postou a foto: lembra do bônus (só o que é verdade: XP, nível e emblema calculados) */
    const fp = ST.fotoPendente && ST.fotoPendente();
    if (fp) {
      const T = q(fp.title), b0 = fp.P.badges[0], sobe = fp.P.lv1 > fp.P.lv0;
      const [i, t] = variante('foto', [
        b0 ? `Se postar a foto de ${T} agora, o emblema “${b0.name()}” é seu na hora 🏅` : sobe ? `Uma foto de ${T} e você sobe pro nível ${fp.P.lv1}! 🚀` : `Ainda dá tempo de postar a foto de ${T} e ganhar +${fp.P.total} XP 📸`,
        `Fez ${T} e não mostrou? Foto = XP em dobro (+${fp.P.total}) 😏`,
        `Psiu… a foto de ${T} ainda vale +${fp.P.total} XP. Tira rapidinho? 🤳`,
      ]);
      out.push({ k: 'foto', i, t, m: 'comemora', roteiro: ['sobrancelha'], u: 1.6, acoes: [{ label: '📸 Postar', go: () => ST.postStory({ title: fp.title, ref: fp.ref, kind: fp.kind }) }, { label: 'Depois' }] });
    }
    const vis = ST.visitasCache().list; let vistos = 0; try { vistos = +localStorage.getItem(visKey) || 0; } catch { /* ok */ }
    const recentes = vis.filter((v) => v.at > vistos);
    if (recentes.length) {
      const ini = (recentes[0].name || '?').trim().charAt(0).toUpperCase(), nv = recentes.length;
      const [i, t] = variante('visitas', [
        'Alguém tá fofocando por aqui, hehe 🤭 Quer saber quem?',
        'Psiu… alguém entrou no seu perfil e saiu de fininho 🐾',
        'Tem gente curiosa com a sua vida… e eu sei quem é 😏',
        `Adivinha quem passou no seu perfil? Dica: começa com “${ini}” 🤫`,
        nv > 1 ? `${nv} pessoas espiaram seu perfil. Uma delas parece BEM interessada 👀` : 'Uma pessoa espiou seu perfil… e não foi a primeira vez, hein 👀',
        'Se eu fosse você, eu olhava quem visitou… só digo isso 🤐',
        'Alguém andou fuçando seu perfil. Não fui eu, juro 🙈',
        'Ihhh… visita nova no seu perfil. Será que é quem você tá pensando? 💭',
        'Fofoca quentinha: passaram no seu perfil faz pouco 🔥 Quer o nome?',
        'A lista de quem te visitou some em 7 dias… melhor olhar antes que suma 👀',
        `Quer saber quem entrou no seu perfil pra ver o que você postou? 👀`,
        `Viu quem tá bisbilhotando o seu perfil? ${nv > 1 ? `Foram ${nv} pessoas!` : 'Tem gente curiosa 🤭'}`,
      ]);
      out.push({ k: 'visitas', i, t, m: 'desconfiado', roteiro: ['olhaLados', 'maoBoca'], u: 1.9, acoes: [{ label: 'Quero saber', go: () => { try { localStorage.setItem(visKey, String(Date.now())); } catch { /* ok */ } return ST.openVisitors(); } }, { label: 'Nem ligo' }] });
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
  const primeiro = c.pend[0] ? q(c.pend[0].title) : '';
  if (c.h >= 5 && c.h < 10) out.push({ k: 'manha', t: pick([
    primeiro ? `Bom dia${c.primeiro}! Primeira da lista: ${primeiro}. Vai nela antes do celular te distrair ☀️` : `Bom dia${c.primeiro}! Agenda limpinha… quer colocar alguma coisa nela? ☀️`,
    `Acordei antes de você${c.primeiro}. Mentira, eu nem durmo 😅 Bom dia!`,
    c.pend.length > 2 ? `${c.pend.length} coisas hoje. Começa pela que dá mais preguiça: o resto fica fácil 😏` : 'Manhã é o horário nobre do cérebro. Usa ela pro que importa 🧠',
  ]), m: 'acena', tod: 1 });
  if (c.h >= 11 && c.h < 14) out.push({ k: 'almoco', t: pick(['Almoço longe da tela, combinado? Até eu desligo um pouco 🍽️', 'Pular almoço vira mau humor às 15h. Eu já vi isso acontecer 😬', 'Hora de comer! Depois me conta o que teve de bom no prato 🍽️']), m: 'feliz', tod: 1 });
  if (c.h >= 14 && c.h < 17) out.push({ k: 'tarde', t: pick([
    c.pend.length ? `Tarde é traiçoeira: parece que sobra tempo e não sobra. Ainda tem ${c.pend.length === 1 ? q(c.pend[0].title) : `${c.pend.length} coisas`} 👀` : 'Tarde livre na agenda? Que raridade. Aproveita bem 😌',
    'Bateu a moleza das 15h? Levanta, estica e volta. Eu espero aqui 🧘',
  ]), m: 'feliz', tod: 1 });
  if (c.h >= 21 || c.h < 5) out.push({ k: 'noite', t: pick(['Fecha as abas do dia. O que ficou, amanhã eu te cutuco 🌙', c.amanha ? `Amanhã tem ${c.amanha}. Deixa que eu te lembro, pode dormir tranquilo(a) 😴` : 'Amanhã tá livre por enquanto. Dorme sem culpa 😴']), m: 'sono', tod: 1 });

  /* papo leve (sempre disponível, com pouco peso) */
  [
    ['oi', `Oi${c.primeiro}! Quer agendar alguma coisa?`, 'acena', [{ label: 'Sim', go: agendaAqui }, { label: 'Não' }]],
    ['marcar', `Tá precisando marcar algo${c.primeiro}?`, 'feliz', [{ label: 'Sim', go: agendaAqui }, { label: 'Agora não' }]],
    ['agua', 'Teu copo tá aí do lado te olhando faz um tempão 👀', 'desconfiado'],
    ['forte', `Sabe o que eu reparei${c.primeiro}? Você sempre volta. Mesmo nos dias ruins 🧡`, 'amor'],
    ['respira', 'Ombro grudado na orelha? Solta ele. Agora o outro 😌', 'sono'],
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
const abre = (c) => { const L = falas(c), urg = L.filter((x) => (x.u || 0) >= 2); if (urg.length) return melhor(urg); const e = especiais(c); return e && !(MEM.n || {})[e.k] ? e : melhor(L); }; // o urgente vem antes da frase do dia

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
function state(s, side) { if (!B) return; B.dataset.st = s; if (side && !livre) B.dataset.side = side; }
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
/* prioridade das reações: erro > nível > dia perfeito > concluiu > XP > criou > o resto.
   Uma reação nova substitui a anterior, a não ser que a anterior seja mais importante e ainda esteja valendo. */
const PRIO = { erro: 6, nivel: 5, perfeito: 4, done: 3, xp: 2, created: 1 };
let atual = { p: -1, ate: 0, id: 0 };
function fala(line, gesto, tentativa = 0, desde = Date.now(), id = 0) {
  if (!B || !line) return;
  const p = line.p ?? 0;
  if (!tentativa) {
    if (p < atual.p && Date.now() < atual.ate) return;             // tem coisa mais importante sendo dita
    atual = { p, ate: Date.now() + 4000, id: atual.id + 1 }; id = atual.id;
  } else if (id !== atual.id) return;                              // outra reação já tomou o lugar
  // algo aberto por cima (ficha, janela, teclado): espera e fala depois — vale por 4 s (~3 tentativas)
  if (blocked()) { if (tentativa < 2 && Date.now() - desde < 4000) setTimeout(() => fala(line, gesto, tentativa + 1, desde, id), 1500); return; }
  ultima = line.t;
  if (line.k) lembrou(line.k, line.i);
  state('up');
  setMood(el(), line.m || 'feliz');
  const g = gesto || line.gesto;
  if (g) setTimeout(() => act(el(), g), 220);
  // roteiro: uma sequência de gestos enquanto fala (olha pros lados, desconfia, tapa a boca rindo…)
  (line.roteiro || []).forEach((r, i) => setTimeout(() => { if (B && falando()) act(el(), r); }, 900 + i * 1900));
  setTimeout(() => { balao(line); window.__snhGuarda && window.__snhGuarda(); setTimeout(() => window.__snhGuarda && window.__snhGuarda(), busyUntil - Date.now() + 300); }, 260);
  atual.ate = Math.max(atual.ate, busyUntil || 0);
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
  if (!B || falando() || arr) return;
  B.querySelector('.snhbud__bub').classList.remove('is-in');
  setMood(el(), new Date().getHours() >= 23 || new Date().getHours() < 5 ? 'sono' : 'feliz');
  if (B.dataset.st === 'up') state('rest');
}

/* ---------- vida própria: uma "cena" curta a cada poucos segundos, nunca a mesma duas vezes seguidas ---------- */
const CENAS = [
  { g: 'olhaLados', w: 3 }, { g: 'pisca', w: 2 }, { g: 'pensa', w: 2 }, { g: 'riso', w: 1.5 }, { g: 'sim', w: 1 },
  { g: 'pop', w: 1 }, { g: 'timido', w: 1.2 },
  { m: 'surpreso', g: 'pop', w: 0.8, volta: 1300 }, { m: 'amor', w: 0.8, volta: 2200 }, { m: 'desconfiado', g: 'olhaLados', w: 1, volta: 2000 },
  { g: 'cinico', w: 1.2 }, { g: 'coca', w: 1.2 }, { g: 'sobrancelha', w: 1.3 }, { g: 'balanca', w: 1.4 }, { g: 'maoBoca', w: 0.9 },
  { m: 'desconfiado', g: 'cinico', w: 0.8, volta: 2200 },
]; // parado, sem gesto grande (pulo, tchau, susto e dança ficam para quando algo acontece)
function cena() {
  clearTimeout(cenaT);
  cenaT = setTimeout(cena, R(6, 11) * 1000);
  if (!B || document.hidden || calmo() || B.dataset.st === 'away' || falando() || blocked() || arr) return;
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
let toques = [], semClique = 0;
function onTap() {
  if (Date.now() - semClique < 450 || arr) return;
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
function sai() { if (!B || falando() || arr) return; state('away', pick(['l', 'r'])); }
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
    if (!B || document.hidden || blocked() || falando() || arr) return ciclo();
    // não espia mais pelas laterais (cobria o conteúdo): só um gesto pequeno no cantinho dele, ou sai um pouco
    if (Math.random() < 0.5) { act(el(), pick(['sim', 'olhaLados', 'pisca'])); ciclo(); }
    else { sai(); ciclo(); }
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

/* ---------- arrastar: a pessoa leva o Lembra pra onde quiser ----------
   Física de corpo pendurado no dedo (pêndulo cujo ponto de apoio é o dedo):
     θ'' = (−aₓ·cos θ − (g − a_y)·sin θ) / L − c·θ'
   θ = ângulo entre "apoio → centro de massa" e a vertical. Acelerar para a direita joga o corpo para a esquerda;
   subir rápido "pesa" mais; descer rápido deixa ele quase sem peso (sensação de queda). Ao soltar com velocidade,
   ele voa com atrito, quica nas bordas da tela e se endireita balançando (mola amortecida), e fica onde parou. */
const POSK = 'lembra.snh.pos', FIG = 96, FIGH = Math.round(96 * 1080 / 1160);
const G_PX = 2400, AMORT = 2.3;
let livre = null, arr = null, rebelou = 0, mudancas = 0, solturas = [], deboche = false, ultDrag = '';
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
let probe = null;
const safe = () => {
  if (!probe) { probe = document.createElement('div'); probe.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)'; document.body.appendChild(probe); }
  const cs = getComputedStyle(probe); return [parseFloat(cs.paddingTop) || 0, parseFloat(cs.paddingBottom) || 0];
};
const limites = () => { const [st, sb] = safe(); return { x0: 2, x1: innerWidth - FIG - 2, y0: st + 36, y1: innerHeight - FIGH - 4 - sb }; };
const cantoXY = () => { const [, sb] = safe(); return { x: innerWidth - 6 - FIG, y: innerHeight - sb - 76 - FIGH }; };
/* posição escolhida: o lado (esquerda/direita) e a altura. Ele fica ali escondidinho na borda, como sempre */
const lePos = () => { try { const p = JSON.parse(localStorage.getItem(POSK) || 'null'); if (!p || !(p.fy >= 0)) return null; return { side: p.side || (p.fx < 0.5 ? 'l' : 'r'), fy: p.fy }; } catch { return null; } };
const gravaPos = () => { try { if (livre) localStorage.setItem(POSK, JSON.stringify({ side: livre.side, fy: livre.y / innerHeight })); else localStorage.removeItem(POSK); } catch { /* ok */ } };
const rig = () => rigOf(el());
const bordaX = (side) => (side === 'l' ? 6 : innerWidth - 6 - FIG);
/* enquanto está sendo carregado: posição livre na tela */
function pos(x, y) {
  if (!B) return;
  B.style.left = `${Math.round(x * 10) / 10}px`; B.style.top = `${Math.round(y * 10) / 10}px`;
  B.dataset.side = x + FIG / 2 < innerWidth / 2 ? 'l' : 'r';
  B.classList.toggle('bub-baixo', y < 170);
}
/* encostado na borda escolhida, na altura escolhida */
function encosta(side, y, desde) {
  if (!B) return;
  livre = { side, y, em: desde || (livre && livre.em) || Date.now() };
  B.classList.add('is-free'); B.style.left = ''; B.style.top = `${Math.round(y)}px`; B.dataset.side = side;
  B.classList.toggle('bub-baixo', y < 170);
}
function voltaCanto() {
  livre = null; gravaPos();
  if (!B) return;
  B.classList.remove('is-free', 'is-drag', 'bub-baixo'); B.style.left = B.style.top = ''; B.dataset.side = 'r';
}
const zona = (side, y) => { const cy = y + FIGH / 2, H = innerHeight; return cy < H * 0.3 ? 'topo' : cy > H * 0.72 ? 'baixo' : side === 'l' ? 'esq' : 'dir'; };

/* falas (muitas, para nunca soar repetido; cada grupo evita a última dita) */
const F = {
  pega: ['Opa! Me pegou! 😳', 'Ei ei ei! Cuidado comigo!', 'Uau! Tô voando?!', 'Calma, eu não sei voar! 😰', 'Pra onde você vai me levar? 👀', 'Segura firme, hein!', 'Ai, que friozinho na barriga!', 'Me levando pra passear? 🥹'],
  meDeixa: ['Me deixa quieto, eu quero ficar aqui! 😫', 'Ah não… tava tão bom ali 😩', 'Psiu! Eu tava descansando!', 'Cinco minutinhos… só mais cinco 😴', 'Ninguém respeita o descanso de um sino 😤'],
  deNovo: ['De novo?! Acabei de desfazer as malas! 🧳', 'Mal cheguei e já vou mudar?', 'Nem esquentei o lugar ainda! 😅'],
  sacode: ['Tá doido?! Quer me deixar tonto? 😵', 'Para de me sacudir! Eu não sou chocalho!', 'Aaaah! Meu badalo tá batendo em tudo! 🔔', 'Socorroooo! 😱', 'Eu vou passar mal! 🤢', 'Isso é sequestro de sino!', 'Calmaaa! Devagaaaar!'],
  cai: ['Tô caindooo! 😱', 'Freia! Freia! Freia!', 'Aaaaaah, que queda!', 'Meu estômago ficou lá em cima!', 'Me segura, me segura! 🙏'],
  sobe: ['Tô subindo! Tô subindo! 🚀', 'Que alto! Não olha pra baixo…', 'Lá vou eu pras nuvens! ☁️', 'Ui, que elevador rápido!'],
  lado: ['Pra lá não! Pra lá não!', 'Ida e volta? Eu não comprei essa passagem! 🎫', 'Uiii, que vento na cara! 💨', 'Que velocidade! Cadê o cinto? 😬'],
  parado: ['Vai me segurar até quando? 😅', 'Não olha pra baixo… não olha pra baixo… 😰', 'Tá, e agora? Me põe em algum lugar!', 'Meu braço tá cansando… e é você que tá segurando 😂', 'Tenho medo de altura, sabia? 🥺'],
  beira: ['Ei! Olha a beirada! 😱', 'Cuidado que aí acaba a tela!', 'Não me joga pra fora!'],
  tonto: ['Fiquei tonto agora… 😵‍💫', 'Tô vendo três agendas… qual delas é a sua? 😵', 'O mundo tá girando ou sou eu?', 'Ugh… acho que vou tocar sozinho 🔔🤢', 'Me dá um minutinho… tô vendo estrelinha ✨', 'Calma que meu badalo ainda tá balançando…', 'Quem sou eu? Onde estou? Ah, sim: o Lembra 😵‍💫'],
  jogou: ['Ei! Você me jogou?! 😤', 'Isso não é jeito de tratar um sino!', 'Uau, voei! Faz de novo? …Não, pera, não faz! 😅', 'Pouso perfeito! Nota 10 dos jurados 🙆', 'Eu sou sino, não bumerangue! 🪃'],
  bateu: ['Ai! Bati a cabeça na parede! 🤕', 'Plim! 🔔 Isso foi eu batendo na borda…', 'Quem colocou essa parede aqui?! 😵'],
  ue: ['Ué? Me pegou e soltou? 🤨', 'Hum? Foi sem querer?', 'Mudou de ideia rapidinho, hein 😏'],
  ioio: ['De novo?! Eu tenho cara de ioiô? 🪀', 'Tá, já entendi que você gosta de mim 😳', 'Mais uma mudança e eu cobro frete! 🚚', 'Se continuar assim eu vou fazer academia de tanto ser carregado 💪'],
  topo: ['Daqui de cima eu vejo tudo! 🦅', 'Vista privilegiada! Agora nada escapa 👀', 'Cobertura com vista pra sua agenda 😎', 'Lá de cima é mais fácil te vigiar… digo, cuidar 😇'],
  baixo: ['Aqui embaixo é bem tranquilo 😌', 'Pertinho dos botões… dica, hein? 😉', 'Pé no chão, como deve ser 🦶', 'Aqui eu fico de olho no que você vai marcar ✍️'],
  esq: ['Lado esquerdo, lado do coração 🧡', 'Cantinho novo, vida nova ✨', 'Gostei daqui. Sombra e água fresca 🌴'],
  dir: ['Ok, lado direito. Sou um sino de direita… digo, do lado direito 😅', 'Aqui tá ótimo, obrigado 🙏', 'Bom lugar! Bem pertinho de você 🧡'],
  lugar: ['Hmm… gostei daqui. Vista boa 👀', 'Novo escritório! 🏢', 'Ok, me mudei. Avisa o correio 📮', 'Aqui tá bom. Pode deixar que eu cuido 🔔', 'Lugar novo, mesma memória de elefante 🐘'],
  rebelde: ['Não… eu não vou ficar aqui onde você me colocou. 😤', 'Aqui? Nem pensar. Vou voltar pro meu cantinho! 😤', 'Não gostei. Tchau! 😤'],
  casa: ['Aqui é o meu cantinho. 😌', 'Pronto. Lar, doce lar 🏠', 'Bem melhor. 😏'],
  interrompe: ['Ei! Eu tava falando! 😤', 'Deixa eu terminar de falar, pô!', 'Que falta de educação, me pegar no meio da frase! 😒'],
  madruga: ['Shhh… é madrugada, me carrega devagar 😴', 'A essa hora? Tá sem sono, né? 🌙', 'Psiu, não acorda os vizinhos! 🤫'],
  dorme: ['Tá… vou tirar um cochilo aqui no seu dedo mesmo 😴', 'Zzz… me avisa quando chegar 💤', 'Já que não vai me soltar, vou dormir 😪'],
  recorde: ['Recorde de velocidade! 🏎️💨', 'Eu quebrei a barreira do som? 🚀', 'Isso foi um foguete ou fui eu? 😵'],
  mesmo: ['Ué, me tirou daqui pra me colocar aqui de novo? 🤔', 'Mudou… nada 😂', 'Fiz uma viagem pra lugar nenhum ✈️'],
  debocha: ['Hum… tá bom, eu fico aqui. Mas só porque eu quero. 🙄', 'Tá, tá… fico. Mas é favor, hein? 😒', 'Ok. Mas fica registrado que foi ideia MINHA 🙄', 'Hmpf. Até que aqui não é tão ruim… mas não se acostuma 😒'],
};
const ultF = {};
const fraseDe = (g) => { const L = F[g]; let t; do { t = pick(L); } while (L.length > 1 && t === ultF[g]); ultF[g] = t; return t; };
function falaJa(g, ms = 1900, m) {
  if (!B) return;
  B.dataset.st = 'up';
  if (m) setMood(el(), m);
  busyUntil = 0; balao({ t: fraseDe(g) }, ms);
  ultDrag = g;
}

function arrastavel(fig) {
  fig.addEventListener('pointerdown', (ev) => {
    if (!B || arr || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
    arr = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, fx: ev.clientX, fy: ev.clientY, on: false, t0: performance.now() };
  });
  fig.addEventListener('pointermove', (ev) => {
    if (!arr || ev.pointerId !== arr.id || arr.voo) return;
    arr.fx = ev.clientX; arr.fy = ev.clientY;
    if (!arr.on && Math.hypot(ev.clientX - arr.x0, ev.clientY - arr.y0) >= 8) comeca(fig, ev);
    if (arr.on) ev.preventDefault();
  });
  const fim = (ev) => {
    if (!arr || ev.pointerId !== arr.id || arr.voo) return;
    if (arr.on) { termina(); return; }
    // segurou parado e soltou sem arrastar: cochilo de mentirinha (como antes)
    if (performance.now() - arr.t0 > 700 && ev.type === 'pointerup') { semClique = Date.now(); toques = []; fala({ t: 'Zzz… me acorda se precisar 😴', m: 'sono' }, 'boceja'); }
    arr = null;
  };
  fig.addEventListener('pointerup', fim); fig.addEventListener('pointercancel', fim);
  addEventListener('resize', () => { if (livre && !arr) { const L = limites(); encosta(livre.side, cl(livre.y, L.y0, L.y1)); } });
}

function comeca(fig, ev) {
  try { fig.setPointerCapture(ev.pointerId); } catch { /* ok */ }
  const r = fig.getBoundingClientRect();
  const x = r.left + r.width / 2 - FIG / 2, y = r.top + r.height / 2 - FIGH / 2;
  const st = B.dataset.st, sd = B.dataset.side;
  const rot0 = st === 'rest' ? (sd === 'l' ? 14 : -14) : st === 'spy' ? (sd === 'l' ? 62 : -62) : 0;
  const ox = cl(arr.x0 - x, 6, FIG - 6), oy = cl(arr.y0 - y, 4, FIGH - 4);
  // centro de massa (um pouco abaixo do meio do sino); se pegou por baixo, o corpo não vira de cabeça pra baixo
  const cmx = FIG / 2 - ox, cmy = Math.max(22, FIGH * 0.56 - oy);
  const L = Math.max(26, Math.hypot(cmx, cmy)), phi0 = Math.atan2(cmx, cmy) * 0.75;
  const psi0 = (rot0 * Math.PI) / 180;
  const hr = new Date().getHours();
  const era = { falava: falando() && B.querySelector('.snhbud__bub').classList.contains('is-in'), madruga: hr >= 23 || hr < 5, antes: livre ? { side: livre.side, y: livre.y } : null, sono: fingindo || el()?.dataset.snh === 'sono', recente: livre && Date.now() - livre.em < 8000, antigo: livre && Date.now() - livre.em > 20 * 60e3 };
  Object.assign(arr, { on: true, x, y, ox, oy, L, phi0, th: phi0 - psi0, om: 0, vx: 0, vy: 0, ax: 0, ay: 0, lt: performance.now(), quieto: performance.now(),
    agito: 0, viradas: [], picoVir: 0, totVir: 0, sx: 0, sy: 0, dist: 0, era, falou: 0, beira: false, parou: false, bateu: false, vmax: 0 });
  clearTimeout(hideT); clearTimeout(holdT); busyUntil = 0; fingindo = false; clearTimeout(fingeT);
  B.querySelector('.snhbud__bub').classList.remove('is-in');
  B.classList.add('is-drag'); pos(x, y);
  B.dataset.st = 'up';
  fig.style.transformOrigin = `${ox}px ${oy}px`;
  const rg = rig(); rg && rg.pega();
  try { navigator.vibrate && navigator.vibrate(12); } catch { /* ok */ }
  setTimeout(() => { if (arr && arr.on && !arr.falou) { arr.falou = performance.now(); falaJa(era.sono || era.antigo ? 'meDeixa' : era.falava ? 'interrompe' : era.madruga ? 'madruga' : era.recente ? 'deNovo' : 'pega', 1700); } }, 280);
  requestAnimationFrame(passo);
}

/* um quadro de física */
function passo(now) {
  if (!arr || !B) return;
  const fig = B.querySelector('.snhbud__fig');
  const dt = cl((now - arr.lt) / 1000, 0.001, 0.034); arr.lt = now;
  const Lm = limites();
  let nx, ny;
  if (!arr.voo) { // segue o dedo (pode passar um pouco da borda)
    nx = cl(arr.fx - arr.ox, Lm.x0 - 26, Lm.x1 + 26); ny = cl(arr.fy - arr.oy, Lm.y0 - 30, Lm.y1 + 26);
  } else {       // voando depois de solto: atrito do ar e quique nas bordas
    const fr = Math.exp(-dt * 4.4); arr.gvx *= fr; arr.gvy *= fr;
    nx = arr.x + arr.gvx * dt; ny = arr.y + arr.gvy * dt;
    const quica = (lado) => { arr.bateu = true; const rg = rig(); rg && rg.bate(lado); try { navigator.vibrate && navigator.vibrate(14); } catch { /* ok */ } };
    if (nx < Lm.x0) { nx = Lm.x0; if (arr.gvx < -120) quica(1); arr.gvx = -arr.gvx * 0.42; }
    if (nx > Lm.x1) { nx = Lm.x1; if (arr.gvx > 120) quica(-1); arr.gvx = -arr.gvx * 0.42; }
    if (ny < Lm.y0) { ny = Lm.y0; if (arr.gvy < -120) quica(0); arr.gvy = -arr.gvy * 0.42; }
    if (ny > Lm.y1) { ny = Lm.y1; if (arr.gvy > 120) quica(0); arr.gvy = -arr.gvy * 0.42; }
  }
  // velocidade e aceleração do apoio (suavizadas: o dedo treme e os eventos chegam em ritmos diferentes)
  const rvx = (nx - arr.x) / dt, rvy = (ny - arr.y) / dt, kv = 1 - Math.exp(-dt / 0.045), ka = 1 - Math.exp(-dt / 0.06);
  const pvx = arr.vx, pvy = arr.vy;
  arr.vx += (rvx - arr.vx) * kv; arr.vy += (rvy - arr.vy) * kv;
  arr.ax += (cl((arr.vx - pvx) / dt, -26000, 26000) - arr.ax) * ka; arr.ay += (cl((arr.vy - pvy) / dt, -26000, 26000) - arr.ay) * ka;
  if (arr.voo && arr.enc) { const k = Math.min(1, (now - arr.enc.t0) / 420), e = 1 - Math.pow(1 - k, 3); nx = arr.enc.x0 + (arr.enc.x1 - arr.enc.x0) * e; ny = arr.y; } // desliza até a borda
  arr.dist += Math.hypot(nx - arr.x, ny - arr.y); arr.x = nx; arr.y = ny;
  const sp = Math.hypot(arr.vx, arr.vy); arr.vmax = Math.max(arr.vmax, sp);
  if (!arr.voo) { arr.hist = (arr.hist || []).filter((h) => now - h[0] < 90); arr.hist.push([now, arr.vx, arr.vy, sp]); }
  if (sp > 60) arr.quieto = now;
  // pêndulo (preso no dedo) ou, depois de solto, endireitando como um joão-bobo
  const n = 4, h = dt / n; let om0 = arr.om;
  for (let i = 0; i < n; i++) {
    let al;
    if (!arr.voo) al = (-arr.ax * Math.cos(arr.th) - (G_PX - arr.ay) * Math.sin(arr.th)) / arr.L - AMORT * arr.om;
    else { const ps = arr.phi0 - arr.th, w0 = 2 * Math.PI * 1.45; al = w0 * w0 * ps - 2 * 0.24 * w0 * arr.om - arr.ax * 0.0011; }
    arr.om += al * h; arr.th += arr.om * h;
    if (arr.th > 1.7) { arr.th = 1.7; arr.om *= -0.3; } if (arr.th < -1.7) { arr.th = -1.7; arr.om *= -0.3; }
  }
  const psi = arr.phi0 - arr.th, wdeg = (-(arr.om) * 180) / Math.PI;
  // sacudida: conta as viradas bruscas de direção e o quanto ele balançou
  // (só conta quando inverte o sentido no MESMO eixo: direita↔esquerda ou cima↔baixo)
  if (!arr.voo) {
    const gx = Math.abs(arr.vx) > 380 ? Math.sign(arr.vx) : 0, gy = Math.abs(arr.vy) > 480 ? Math.sign(arr.vy) : 0;
    if (gx && arr.sx && gx !== arr.sx) { arr.viradas.push(now); arr.totVir++; }
    if (gy && arr.sy && gy !== arr.sy) { arr.viradas.push(now); arr.totVir++; }
    if (gx) arr.sx = gx; if (gy) arr.sy = gy;
  }
  arr.viradas = arr.viradas.filter((t) => now - t < 1500); arr.picoVir = Math.max(arr.picoVir, arr.viradas.length);
  arr.agito += Math.abs(om0) * dt + (arr.viradas.length >= 2 ? dt * 1.2 : 0);
  B.style.left = `${nx.toFixed(1)}px`; B.style.top = `${ny.toFixed(1)}px`;
  if (!arr.voo || arr.enc) { B.dataset.side = arr.enc ? arr.enc.side : nx + FIG / 2 < innerWidth / 2 ? 'l' : 'r'; B.classList.toggle('bub-baixo', ny < 170); }
  fig.style.transform = calmo() ? '' : `rotate(${((psi * 180) / Math.PI).toFixed(2)}deg)`; // "reduzir movimento": arrasta sem balançar
  const parado = (now - arr.quieto) / 1000;
  const rg = rig();
  if (rg && rg.dr) rg.arrasta({ vx: arr.vx, vy: arr.vy, ax: arr.ax, ay: arr.ay, w: wdeg, parado });
  // o que ele fala enquanto é carregado (no máximo uma frase a cada ~2 s)
  if (!arr.voo && arr.falou && arr.viradas.length >= 3 && ultDrag !== 'sacode' && now - arr.falou > 700) { arr.falou = now; falaJa('sacode', 1800); setMood(el(), 'bravo'); }
  else if (!arr.voo && arr.falou && now - arr.falou > 2100) {
    let g = '';
    if (arr.viradas.length >= 3) g = 'sacode';
    else if (!arr.beira && (nx < Lm.x0 + 2 || nx > Lm.x1 - 2 || ny > Lm.y1 - 2)) { g = 'beira'; arr.beira = true; }
    else if (arr.vy > 950) g = 'cai';
    else if (arr.vy < -950) g = 'sobe';
    else if (Math.abs(arr.vx) > 1100) g = 'lado';
    else if (parado > 1.8 && !arr.parou) { g = 'parado'; arr.parou = true; }
    else if (parado > 5.5 && !arr.dormiu) { g = 'dorme'; arr.dormiu = true; }
    if (g && !(g === ultDrag && g !== 'sacode')) { arr.falou = now; falaJa(g, 1700); if (g === 'sacode') { setMood(el(), 'bravo'); } }
  }
  // voo acabando: largou de vez
  if (arr.voo) {
    const gsp = Math.hypot(arr.gvx, arr.gvy);
    if (rg && rg.dr && gsp < 240) rg.solta({ vx: arr.gvx * 3, vy: arr.gvy * 3, tonto: arr.tonto });
    if (gsp < 14 && !arr.reagiu) { arr.reagiu = true; reage(arr); }
    if (gsp < 14 && arr.enc && now - arr.enc.t0 > 440 && Math.abs(psi) < 0.012 && Math.abs(arr.om) < 0.06) return pousou();
  }
  requestAnimationFrame(passo);
}

function termina() {
  arr.voo = true; semClique = Date.now();
  const top = (arr.hist || []).reduce((m, h) => (h[3] > m[3] ? h : m), [0, arr.vx, arr.vy, Math.hypot(arr.vx, arr.vy)]);
  arr.vx = top[1]; arr.vy = top[2];
  arr.vtop = top[3];
  const sp = top[3], escala = sp > 2600 ? 2600 / sp : 1;
  arr.gvx = arr.vx * escala; arr.gvy = arr.vy * escala;
  arr.durou = (performance.now() - arr.t0) / 1000;
  arr.tonto = arr.picoVir >= 3 || arr.totVir >= 7;
  arr.lancou = sp > 850;
  const rg = rig();
  if (rg && rg.dr && sp < 240) rg.solta({ vx: arr.vx, vy: arr.vy, tonto: arr.tonto });
}

/* terminou de se endireitar: tira a física e fica ali */
function pousou() {
  const a = arr; arr = null;
  if (!B) return;
  const fig = B.querySelector('.snhbud__fig');
  fig.style.transform = ''; fig.style.transformOrigin = '';
  if (!a.reagiu) reage(a);
  B.classList.remove('is-drag');
  if (livre) encosta(livre.side, livre.y);
  if (!falando()) state('rest');         // escondidinho na borda, como sempre
}
/* o que ele acha da mudança (assim que para de voar) */
function reage(a) {
  if (!B) return;
  const Lm = limites(), x = cl(a.x, Lm.x0, Lm.x1), y = cl(a.y, Lm.y0, Lm.y1);
  const rg = rig(); if (rg && rg.dr) rg.solta({ tonto: a.tonto });
  const side = x + FIG / 2 < innerWidth / 2 ? 'l' : 'r';
  a.y = y; a.enc = { t0: performance.now(), x0: a.x, x1: bordaX(side), side };   // vai deslizando pra borda mais perto
  livre = { side, y, em: Date.now() }; gravaPos();
  const agora = Date.now(); mudancas++; solturas = solturas.filter((t) => agora - t < 30000); solturas.push(agora);
  // o que ele acha da mudança
  const fala2 = (g, m, gesto, ms) => { busyUntil = 0; B.dataset.st = 'up'; setTimeout(() => { if (!B || (arr && !arr.voo)) return; fala({ t: fraseDe(g), m }, gesto); }, ms); };
  if (a.tonto) return fala2('tonto', 'tonto', null, 650);
  if (a.bateu) return fala2('bateu', 'bravo', 'dor', 250);
  if (a.lancou && a.vtop > 2300) return fala2('recorde', 'comemora', 'pulo', 300);
  if (a.lancou) return fala2('jogou', 'surpreso', 'nao', 300);
  if (a.durou < 0.45 && a.dist < 70) return fala2('ue', 'desconfiado', 'sobrancelha', 200);
  if (solturas.length >= 3) return fala2('ioio', 'desconfiado', 'revira', 300);
  if (a.era.antes && a.era.antes.side === side && Math.abs(y - a.era.antes.y) < 36 && a.dist > 80) return fala2('mesmo', 'desconfiado', 'pensa', 300);
  const longe = side === 'l' || Math.abs(y - cantoXY().y) > 120;
  if (deboche || (rebelou && agora - rebelou < 10 * 60e3)) { // depois de ter se rebelado: aceita, revirando os olhos
    rebelou = 0; deboche = false;
    setTimeout(() => { if (B && !(arr && !arr.voo)) act(el(), 'revira'); }, 250);
    return fala2('debocha', 'desconfiado', null, 1500);
  }
  if (longe && mudancas > 2 && !window.__semRebelde && agora - rebelou > 4 * 60e3 && Math.random() < 0.08) { // raro: "eu não vou ficar aqui"
    busyUntil = 0; B.dataset.st = 'up';
    setTimeout(() => { if (B && !(arr && !arr.voo)) fala({ t: fraseDe('rebelde'), m: 'bravo' }, 'nao'); }, 300);
    setTimeout(() => { if (B && !arr && livre) andaPraCasa(); }, 2600);
    return;
  }
  const z = zona(side, y);
  fala2(Math.random() < 0.6 ? z : 'lugar', pick(['feliz', 'amor', 'acena']), pick(['sim', 'balanca', 'pisca', 'olhaLados']), 350);
}

/* rebeldia: sai andando de volta pro canto dele */
function andaPraCasa() {
  const fim = cantoXY(), ini = { x: bordaX(livre.side), y: livre.y }, d = Math.hypot(fim.x - ini.x, fim.y - ini.y), dur = Math.min(2.6, 0.8 + d / 380);
  rebelou = Date.now(); deboche = true;
  const rg = rig(); rg && rg.anda(Math.sign(fim.x - ini.x) || 1, dur);
  setMood(el(), 'desconfiado');
  const t0 = performance.now();
  B.dataset.st = 'up'; B.classList.add('is-drag'); pos(ini.x, ini.y);
  const f = (now) => {
    if (!B || arr) return;
    const k = Math.min(1, (now - t0) / 1000 / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    pos(ini.x + (fim.x - ini.x) * e, ini.y + (fim.y - ini.y) * e - Math.abs(Math.sin(k * Math.PI * dur * 2.6)) * 3);
    if (k < 1) return requestAnimationFrame(f);
    voltaCanto(); busyUntil = 0;
    setTimeout(() => { if (B && !arr) fala({ t: fraseDe('casa'), m: 'desconfiado' }, 'cinico'); }, 350);
  };
  requestAnimationFrame(f);
}

/* alguém novo passou no perfil: ele conta na hora (sem dizer quem: dá a dica e deixa a curiosidade trabalhar) */
const visAvK = 'lembra.visitasAvisadas';
function avisaVisita() {
  if (!B || !ST) return;
  const list = ST.visitasCache().list || []; let vistos = 0, avisadas = 0;
  try { vistos = +localStorage.getItem(visKey) || 0; avisadas = +localStorage.getItem(visAvK) || 0; } catch { /* ok */ }
  const novas = list.filter((v) => v.at > Math.max(vistos, avisadas));
  if (!novas.length) return;
  try { localStorage.setItem(visAvK, String(Math.max(...novas.map((v) => v.at)))); } catch { /* ok */ }
  const l = falas(ctx()).find((x) => x.k === 'visitas');
  if (!l) return;
  const tenta = (n = 0) => { if (!B) return; if (arr || falando() || blocked()) { if (n < 30) setTimeout(() => tenta(n + 1), 4000); return; } busyUntil = 0; fala(l, 'sobrancelha'); };
  setTimeout(tenta, 1500);
}

/* ---------- API ---------- */
export const companheiroOn = () => { try { return mascotOn() && localStorage.getItem('lembra.companheiroOff') !== '1'; } catch { return mascotOn(); } };
export function start() {
  if (B || !companheiroOn()) { if (B && !companheiroOn()) stop(); return; }
  document.documentElement.classList.add('snh-theme');
  B = document.createElement('div');
  B.className = 'snhbud';
  B.dataset.st = 'away'; B.dataset.side = 'r';
  B.innerHTML = `<div class="snhbud__bub" role="status" aria-live="polite"><span></span><div class="snhbud__acoes"></div></div><button class="snhbud__fig" aria-label="Lembra, seu companheiro">${sininho('feliz', { size: 96 })}</button>`;
  document.body.appendChild(B);
  B.querySelector('.snhbud__fig').addEventListener('click', onTap);
  arrastavel(B.querySelector('.snhbud__fig'));
  { const p = lePos(); if (p) { const L = limites(); encosta(p.side, cl(p.fy * innerHeight, L.y0, L.y1)); } }
  let guardaT = 0;
  // no Hoje, com o Foco na tela, ele fica escondido (não cobre nada) — mas aparece quando tem algo a dizer
  const guardaJa = () => { guardaT = 0; if (B) B.classList.toggle('is-hidden', blocked() || (document.body.classList.contains('foco-visivel') && !falando())); };
  window.__snhGuarda = guardaJa;
  const guarda = () => { if (!guardaT) guardaT = setTimeout(guardaJa, 150); }; // junta as mudanças em 150 ms
  B._mo = new MutationObserver(guarda); B._mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'], characterData: false });
  document.addEventListener('focusin', guarda); document.addEventListener('focusout', () => setTimeout(guarda, 50));
  if (!window.__snhOuve) { window.__snhOuve = 1; ouvir(); }
  import('./stories.js').then((m) => { ST = m; const up = () => { if (!document.hidden) Promise.all([m.refreshFeed(), m.refreshVisitors()]).then(avisaVisita).catch(() => {}); }; up(); clearInterval(window.__stT); window.__stT = setInterval(up, 3 * 60e3); }).catch(() => {});
  // só no modo de teste local (emuladores): ganchos para o robô de testes
  try { if (localStorage.getItem('cal.emulator') === '1' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__lembra = { finge: () => { state('rest'); busyUntil = 0; fingeDormir(); }, toca: onTap, falas: () => falas(ctx()), livre: () => livre, solta: () => { voltaCanto(); }, rebelde: () => { if (livre) { busyUntil = 0; fala({ t: fraseDe('rebelde'), m: 'bravo' }, 'nao'); setTimeout(andaPraCasa, 2600); } }, estado: () => ({ st: B && B.dataset.st, humor: el()?.dataset.snh, fingindo, fala: B && B.querySelector('.snhbud__bub span')?.textContent }) }; } catch { /* ok */ }
  // chega dando oi, com o que mais importa agora
  setTimeout(() => { state('rest'); setTimeout(() => fala(abre(ctx()), 'tchau'), 900); }, 1200);
  ciclo(); cena();
}
export function stop() {
  if (!B) return;
  B._mo && B._mo.disconnect(); B.remove(); B = null; arr = null;
  clearTimeout(spyT); clearTimeout(hideT); clearTimeout(holdT); clearTimeout(cenaT);
  document.documentElement.classList.remove('snh-theme');
}
/* o app avisa o que aconteceu; ele reage */
export function react(kind, o = {}) {
  if (kind === 'created') salvouAgora = Date.now();
  if (!B || blocked()) return;
  busyUntil = 0;
  if (kind === 'erro') { reactErro(el()); return fala({ t: 'Ops, não salvou. Tento de novo quando a internet voltar.', m: 'triste', p: PRIO.erro }, 'pop'); }
  if (kind === 'nivel') { reactNivel(el()); return fala({ t: o.nivel ? `Nível ${o.nivel}! Subiu de nível 🎉` : 'Subiu de nível! 🎉', m: 'comemora', p: PRIO.nivel }, null); }
  if (kind === 'done') return fala(o.perfect ? { k: 'perfeito', t: pick(['Dia 100%! Você zerou tudo! 🏆', 'Zerou o dia! Pode comemorar 🎉']), m: 'danca', p: PRIO.perfeito } : o.late ? { t: outra(DONE_LATE), m: 'feliz', p: PRIO.done } : { t: outra(DONE), m: 'comemora', p: PRIO.done }, 'pulo');
  if (kind === 'created') return fala({ t: outra(CREATED), m: 'feliz', p: PRIO.created }, 'sim');
  if (kind === 'pedido') return fala({ t: pick([`Pedido enviado! Agora é torcer pra ${(o.nome || 'pessoa').split(' ')[0]} aceitar 🤞`, 'Mandei o convite voando! 🕊️ Já já chega no celular da pessoa.', 'Feito! Amizade a um toque de distância 🤝']), m: 'comemora', roteiro: ['balanca'] }, 'pulo');
  if (kind === 'story') return fala({ t: pick(['Postou story! Agora todo mundo vai ver que você fez 😎📸', 'XP em dobro na conta! Fotógrafo(a) profissional, hein 📸', 'Prova registrada! Ninguém pode dizer que você não fez 😏']), m: 'danca', roteiro: ['balanca'] }, 'pulo');
  if (kind === 'visitas') { try { localStorage.setItem(visKey, String(Date.now())); } catch { /* ok */ } return o.n ? fala({ t: pick([`Hmm… que que será que ${(o.nome || 'essa pessoa').split(' ')[0]} tava querendo, hein? 🤭`, `${(o.nome || 'Alguém').split(' ')[0]} passou por aqui… será que tá com saudade? 👀`, 'Olha quanta gente curiosa com a sua vida 😏', `${(o.nome || 'Alguém').split(' ')[0]} veio, olhou e não falou nada… típico de quem tá interessado 😏`, 'Esse povo vê tudo e finge que não viu 🙈 Mas eu vi.', 'Quer que eu fique de olho em quem voltar? Eu fico 🕵️']), m: 'desconfiado', roteiro: ['olhaLados', 'maoBoca'] }, 'sobrancelha') : fala({ t: 'Ninguém passou ainda… posta um story que o povo aparece 😉', m: 'feliz' }, 'pisca'); }
  if (kind === 'late') return fala({ t: 'Ih… esse passou da hora. Quer ver o que ficou pra trás?', m: 'triste', acoes: [{ label: 'Ver', go: A.atrasados }, { label: 'Depois' }] }, null);
}
export const active = () => !!B;
