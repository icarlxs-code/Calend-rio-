/* "Amigo" do modo Pessoal: ao longo do dia (7h20 às 22h15) manda para cada pessoa
   mensagens de ânimo, versículos, água, hora de comer e lembretes do que ela anotou.
   Cada pessoa recebe só sobre a própria agenda pessoal. */
import { brNow } from './coach.js';

export const VERSES = [
  ['Tudo posso naquele que me fortalece.', 'Filipenses 4:13'],
  ['Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.', 'Josué 1:9'],
  ['Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.', 'Jeremias 29:11'],
  ['O Senhor é o meu pastor; de nada terei falta.', 'Salmos 23:1'],
  ['Não tema, pois estou com você; não tenha medo, pois sou o seu Deus. Eu o fortalecerei e o ajudarei.', 'Isaías 41:10'],
  ['Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso a vocês.', 'Mateus 11:28'],
  ['Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento.', 'Provérbios 3:5'],
  ['Sabemos que Deus age em todas as coisas para o bem daqueles que o amam.', 'Romanos 8:28'],
  ['Deus é o nosso refúgio e a nossa fortaleza, auxílio sempre presente na adversidade.', 'Salmos 46:1'],
  ['Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.', '2 Timóteo 1:7'],
  ['Entregue o seu caminho ao Senhor; confie nele, e ele agirá.', 'Salmos 37:5'],
  ['Aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não ficam exaustos.', 'Isaías 40:31'],
  ['Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.', '1 Pedro 5:7'],
  ['Este é o dia em que o Senhor agiu; alegremo-nos e exultemos neste dia.', 'Salmos 118:24'],
  ['As misericórdias do Senhor renovam-se cada manhã. Grande é a tua fidelidade.', 'Lamentações 3:22-23'],
  ['Eu te louvo porque me fizeste de modo especial e admirável.', 'Salmos 139:14'],
  ['Deixo com vocês a paz; a minha paz dou a vocês.', 'João 14:27'],
  ['O choro pode persistir uma noite, mas de manhã irrompe a alegria.', 'Salmos 30:5'],
  ['Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.', 'Provérbios 16:3'],
  ['O Senhor te abençoe e te guarde.', 'Números 6:24'],
  ['Sejam fortes e corajosos. O Senhor, o seu Deus, vai com vocês; nunca os deixará, nunca os abandonará.', 'Deuteronômio 31:6'],
  ['Tudo o que fizerem, façam de todo o coração, como para o Senhor.', 'Colossenses 3:23'],
  ['Alegrem-se sempre no Senhor. Novamente direi: alegrem-se!', 'Filipenses 4:4'],
  ['A alegria do Senhor os fortalecerá.', 'Neemias 8:10'],
];
const NIGHT_VERSES = [
  ['Em paz me deito e logo pego no sono, porque só tu, Senhor, me fazes viver em segurança.', 'Salmos 4:8'],
  ['Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso a vocês.', 'Mateus 11:28'],
  ['Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.', '1 Pedro 5:7'],
  ['Deixo com vocês a paz; a minha paz dou a vocês.', 'João 14:27'],
  ['O choro pode persistir uma noite, mas de manhã irrompe a alegria.', 'Salmos 30:5'],
];

const T = {
  morning: [
    'Bom dia, {n}! Hoje é um novo começo. Você é capaz de muito mais do que imagina ☀️',
    'Bom dia, {n}! Levanta, toma uma água e vai com tudo. Hoje vai dar certo ☀️',
    'Bom dia! Deus está contigo hoje, {n}. Um passo de cada vez ☀️',
    'Acordou? Bora, {n}! Que hoje seja leve e produtivo ☀️',
  ],
  water: [
    'Já bebeu água hoje, {n}? Vai lá, um copo agora 💧',
    'Pausa rápida: bebe um copo d’água. Seu corpo agradece 💧',
    'Ei, {n}! Hidratação em dia? Vai beber água 💧',
    'Lembrete de amigo: água! Cabeça boa começa com corpo hidratado 💧',
    'Tá bebendo água direitinho? Bora mais um copo 💧',
    'Só passando pra lembrar: água, {n}! 💧',
    'Hora da água! Um copo agora e a cabeça agradece 💧',
    'Garrafinha do lado? Dá uns goles aí, {n} 💧',
    'Seu corpo é 70% água. Repõe aí, campeão 💧',
    'Cansaço às vezes é só sede. Bebe um copo e sente a diferença 💧',
    'Mais um copo pra conta de hoje! Bora, {n} 💧',
    'Pausa de 10 segundos: bebe água e volta com tudo 💧',
    'Pele, foco e disposição agradecem: vai beber água 💧',
    'Água agora, {n}! Cuidar de você é prioridade 💧',
    'Lembra da água? Um copinho já ajuda 💧',
    'Hidratado rende mais. Bebe um copo aí 💧',
    'Ô {n}, cadê a água? Vai lá rapidinho 💧',
    'Brinde com você mesmo: um copo d’água agora 💧',
    'Cuidar do corpo também é produtividade. Água! 💧',
    'Já faz uma hora... hora de mais um copo 💧',
  ],
  lunch: [
    'Já tá dando a hora do almoço, {n}. Vai almoçar, hein! Não pula refeição 🍽️',
    'Hora de comer! Para um pouquinho e almoça com calma 🍽️',
    'Almoçou já? Saco vazio não para em pé 😄 Vai comer 🍽️',
  ],
  dinner: [
    'Já jantou, {n}? Come alguma coisa boa e descansa 🍽️',
    'Hora de jantar! Você merece uma pausa depois do dia de hoje 🍽️',
  ],
  night: [
    'Você foi bem hoje, {n}. Descansa, que amanhã tem mais 🌙',
    'Hora de desacelerar. Deixa o celular de lado e descansa 🌙',
    'Orgulho de você por mais um dia vencido, {n}. Boa noite 🌙',
  ],
  motivation: [
    'Você é melhor do que imagina, {n}. Nunca esquece disso 💜',
    'Confia no seu processo. O que é seu está guardado 🙏',
    'Você tem potencial demais, {n}. Bora usar um pouco dele agora 💪',
    'Respira. Você dá conta. Sempre deu 💜',
    'Pequenas vitórias também contam. Comemora cada uma 🎉',
    'Feito é melhor que perfeito. Bora fazer acontecer 💪',
    'Você é {lindo} por dentro e por fora, {n}. Se valoriza 💜',
    'Deus está contigo em cada detalhe do seu dia 🙏',
    'Quem planta constância colhe resultado. Continua 🌱',
    'Não se compara com ninguém. Seu tempo é seu 💜',
    'Você já venceu coisa muito mais difícil que isso, {n} 💪',
    'Seja gentil com você hoje. Você está fazendo o seu melhor 💜',
    'Sorri um pouco, {n}. Você tem muitos motivos 😊',
    'Acredita em você como eu acredito 💜',
    'O dia não acabou. Ainda dá tempo de fazer algo incrível ✨',
  ],
  counsel: [
    'Como você tá de verdade hoje, {n}? Se algo pesou, tudo bem. Respira e vai no seu ritmo 💜',
    'Não carrega o mundo nas costas. Escolhe UMA coisa importante agora e faz só ela.',
    'Pensa em 3 coisas boas que aconteceram hoje. Gratidão muda o foco da mente 🙏',
    'Se a cabeça tá cheia, escreve num papel o que tá te preocupando. Tirar da mente já alivia.',
    'Você não precisa dar conta de tudo hoje. Precisa só do próximo passo.',
    'Errar faz parte. O que importa é o que você faz depois. Segue, {n}.',
    'Cuidado com a voz interna: fala com você como falaria com um amigo que você ama 💜',
    'Ansiedade é o futuro batendo na porta antes da hora. Volta pro agora: o que dá pra fazer nos próximos 10 minutos?',
    'Pede ajuda quando precisar. Isso não é fraqueza, é inteligência.',
    'Descansar não é perder tempo, {n}. É recarregar pra continuar.',
    'Comemora o que você já fez hoje, mesmo que pareça pouco. Pouco todo dia vira muito.',
    'Sabe aquela coisa que você tá adiando? Faz só os primeiros 2 minutos. O resto vem.',
  ],
  social: [
    'Manda uma mensagem pra alguém que você gosta e não fala faz tempo. Vai fazer o dia dessa pessoa 💬',
    'Liga pra sua mãe, seu pai ou alguém da família hoje. 5 minutinhos já valem muito ❤️',
    'Que tal chamar um amigo pra conversar ou tomar um café essa semana? ☕',
    'Elogia alguém hoje, de verdade. Faz bem pra quem ouve e pra quem fala 😊',
    'Responde aquelas mensagens que ficaram paradas. Tira esse peso da cabeça 💬',
    'Pergunta pra alguém próximo como ele tá. Às vezes a pessoa só precisa disso 💜',
  ],
  habit: [],
  checkin: [
    'Tem mais alguma coisa pra marcar hoje, {n}? Anota agora antes que escape 📝',
    'Lembrou de algo que precisa fazer? Joga no Lembra que eu te lembro na hora certa 😉',
    'Passou alguma coisa pela sua cabeça que você não anotou? Abre aqui rapidinho 📝',
    'Ei, {n}! Algum compromisso, conta ou recado novo? Marca agora e tira da cabeça 🧠',
    'Como tá seu dia? Se surgiu algo novo, coloca no Lembra pra não esquecer 💜',
    'Tem cliente, reunião ou aniversário chegando? Dá uma olhada na agenda e marca o que faltar 📅',
    'Cabeça leve é cabeça que anota tudo. Tem algo pra colocar aí hoje? ✍️',
    'Vai que esquece… Anota agora o que você prometeu pra alguém hoje 🤝',
    'Já faz um tempinho que você não passa aqui, {n}. Bora dar uma conferida no dia? 👀',
  ],
  selfcare: [
    'Dá uma alongada rápida e arruma a postura, {n} 🧘',
    'Faz uma pausa de 5 minutinhos. Respira fundo 3 vezes 🌿',
    'Já tomou um ar hoje? Dá uma volta rapidinha 🌿',
    'Descansa os olhos da tela um pouco, {n} 👀',
  ],
};
/* hábitos do dia a dia, de acordo com a hora (escovar os dentes, arrumar a cama, ler...) */
const HABITS = [
  [6, 10, 'Já arrumou a cama, {n}? Começar o dia com uma vitória pequena faz diferença 🛏️'],
  [6, 10, 'Toma um pouco de sol hoje de manhã, nem que seja 10 minutos ☀️'],
  [6, 11, 'Já tomou café da manhã direitinho? Não sai de estômago vazio ☕'],
  [12, 15, 'Comeu? Agora escova os dentes 🪥 Sorriso bonito dá trabalho, hein!'],
  [9, 18, 'Dá uma organizada rápida no que está à sua volta. Ambiente limpo, cabeça leve 🧹'],
  [9, 18, 'Levanta e anda um pouquinho. 2 minutos já ativam o corpo 🚶'],
  [14, 20, 'Que tal 10 minutos de leitura hoje? Um capítulo já conta 📚'],
  [15, 21, 'Já se mexeu hoje? Uma caminhada, um treino, uma dança... qualquer coisa vale 💪'],
  [17, 21, 'Separa a roupa e as coisas de amanhã. O você de amanhã agradece 👕'],
  [19, 23, 'Escova os dentes antes de deitar, combinado? 🪥'],
  [19, 23, 'Faz seu cuidado da noite: banho, pele, cabelo... você merece esse carinho 🧴'],
  [20, 23, 'Deixa o celular longe da cama hoje. O sono vem melhor 📵'],
];
const OPENERS = ['Ei, {n}!', 'Opa, passando aqui:', 'Ô {n},', 'Só um toque de amigo:', 'Olha só,', 'Psiu, {n}!', 'Rapidinho:', 'Ei, {campeao},', 'Fala, {n}!', 'Lembrete de quem torce por você:'];
const CLOSERS = ['Tô contigo 💜', 'Bora! 💪', 'Você consegue.', 'Confia.', 'Orgulho de você.', 'Conta comigo.', 'Vai dar certo 🙏', 'Um passo de cada vez.', 'Você é importante, viu?', 'Segue firme!'];
const pick = (a, seed) => a[Math.abs(seed) % a.length];
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');
/* palavras no gênero que a pessoa escolheu na ficha: feminino, masculino ou neutro */
export const genderWords = (pr) => (pr === 'f' ? { lindo: 'linda', campeao: 'campeã' } : pr === 'm' ? { lindo: 'lindo', campeao: 'campeão' } : { lindo: 'incrível', campeao: 'você' });
const verseText = ([t, ref]) => `“${t}” — ${ref}`;
const hm = (t) => (t ? t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h') : '');

/* Mensagens a partir da agenda pessoal (cabelo, contas atrasadas, listas, aniversários...) */
export function agendaMessages(p, br, st) {
  const out = [];
  const n = p.name || '';
  const nowMin = br.h * 60 + br.m;
  for (const it of p.today || []) {
    if (it.done || !it.time) continue;
    const [h, m] = it.time.split(':').map(Number);
    const diff = h * 60 + m - nowMin;
    if (diff > 90 && diff < 480) out.push({ key: `up-${it.title}`, title: '📅 Mais tarde', body: `Hoje às ${hm(it.time)} tem ${it.title}. Já tá se organizando, ${n}?` });
  }
  if ((p.today || []).some((it) => !it.done && !it.time)) {
    const it = p.today.find((x) => !x.done && !x.time);
    out.push({ key: `td-${it.title}`, title: '📅 Não esquece hoje', body: `Você anotou “${it.title}” pra hoje. Já fez? Se fez, marca como feito 😉` });
  }
  for (const it of (p.overdue || []).slice(0, 2)) out.push({ key: `od-${it.title}`, title: '📅 Ficou pra trás', body: `Ainda tá pendente: ${it.title}. Bora resolver hoje? Você consegue 💪` });
  const lb = p.lastByCat || {}, nb = p.nextByCat || {};
  if (!nb.beleza) {
    const days = lb.beleza ? Math.round((Date.parse(br.date) - Date.parse(lb.beleza)) / 864e5) : null;
    const fem = p.prefs?.pronoun === 'f', masc = p.prefs?.pronoun === 'm';
    const what = fem ? 'um horário no salão (cabelo, unhas, sobrancelha)' : masc ? 'um corte de cabelo (e dar um tapa na barba)' : 'um momento de cuidado com o visual';
    if (days === null) out.push({ key: 'hair', title: '💈 Cuidar de você', body: `Já pensou em agendar ${what}, ${n}? Cuidar da aparência levanta a autoestima. Você merece 💜`, every: 5 });
    else if (days >= (fem ? 14 : 21)) out.push({ key: 'hair', title: fem ? '💅 Hora de se cuidar?' : '💈 E o cabelo?', body: `Faz ${days} dias desde o último cuidado com o visual. Precisa agendar? Anota aqui no app que eu te lembro 😉`, every: 4 });
  }
  for (const b of (p.birthdays || []).filter((x) => x.inDays >= 1 && x.inDays <= 5)) {
    out.push({ key: `bd-${b.name}`, title: '🎁 Aniversário chegando', body: `${b.name} faz aniversário ${b.inDays === 1 ? 'amanhã' : `em ${b.inDays} dias`}. Já pensou no presente ou numa mensagem bonita?`, every: 2 });
  }
  for (const l of (p.lists || []).filter((x) => x.open >= 3).slice(0, 2)) {
    out.push({ key: `ls-${l.name}`, title: `Lista ${l.name} 📋`, body: `Sua lista “${l.name}” tem ${l.open} itens pendentes. Bora resolver alguns hoje?`, every: 2 });
  }
  if ((p.tomorrow || []).length && br.h >= 17) {
    const t = p.tomorrow[0];
    out.push({ key: `tm-${t.title}`, title: '📅 Amanhã', body: `Amanhã tem ${t.title}${t.time ? ' às ' + hm(t.time) : ''}. Já deixa tudo encaminhado pra não correr 😉` });
  }
  // não repete o mesmo assunto antes do prazo ("every" em dias; padrão: 1 vez por dia)
  return out.filter((m) => {
    const last = st.asked?.[m.key];
    return !last || Date.parse(br.date) - Date.parse(last) >= (m.every || 1) * 864e5;
  });
}

/* Intervalos aleatórios de verdade: às vezes várias numa hora, às vezes um silêncio longo.
   Nunca menos de 25 min entre duas mensagens e nunca num ritmo fixo. */
const SCALE = { alta: 0.75, normal: 1, calma: 1.8 };
export function randomGap(freq, rand = Math.random) {
  const r = rand();
  const [a, b] = r < 0.35 ? [25, 45] : r < 0.75 ? [50, 110] : [120, 190];
  return Math.max(25, Math.round((a + rand() * (b - a)) * (SCALE[freq] || 1)));
}
const MIN_GAP = 25 * 60e3;
/* Títulos organizados por tipo */
export const KIND_TITLE = { streak: '🔥 Sequência', rank: '🏆 Ranking', checkin: '📝 Algo pra marcar?', counsel: '🫶 Conselho', social: '💬 Pessoas', habit: '✅ Hábito', water: '💧 Água', verse: '📖 Versículo', motivation: '💜 Motivação', selfcare: '🌿 Pausa', lunch: '🍽️ Almoço', dinner: '🍽️ Jantar', night: '🌙 Boa noite' };
/* Janela do dia de cada pessoa (da ficha): começa 30 min depois de acordar e termina 15 min antes de dormir.
   Sem ficha: 7h20 às 22h15. Funciona também para quem trabalha à noite (janela que passa da meia-noite).
   Tudo é medido em "minutos desde o começo da janela" (rel). */
const hhmm = (s) => (/^\d{2}:\d{2}$/.test(s || '') ? Math.min(1439, +s.slice(0, 2) * 60 + +s.slice(3)) : null);
export function dayWindow(prefs = {}) {
  const wake = hhmm(prefs.wake), sleep = hhmm(prefs.sleep), lunch = hhmm(prefs.lunch);
  const start = wake == null ? 7 * 60 + 20 : (wake + 30) % 1440;
  const end = sleep == null ? 22 * 60 + 15 : (sleep - 15 + 1440) % 1440;
  return { start, end, lunch: lunch == null ? 12 * 60 : lunch };
}
const relOf = (mins, w) => (mins - w.start + 1440) % 1440;
const spanOf = (w) => ((w.end - w.start + 1440) % 1440) || 1440;
export const inWindow = (mins, w) => relOf(mins, w) <= spanOf(w);
/* Momentos fixos do dia, relativos à janela da pessoa */
export function anchorsFor(w) {
  const L = spanOf(w);
  const r = (m) => relOf(m, w);
  return [
    { key: 'morning', from: 0, to: Math.min(100, L) },
    { key: 'lunch', from: r(w.lunch) - 20, to: r(w.lunch) + 40, pref: 'meals' },
    { key: 'dinner', from: r(19 * 60 + 15), to: r(19 * 60 + 15) + 60, pref: 'meals' },
    { key: 'night', from: Math.max(0, L - 35), to: L },
  ].filter((a) => a.from >= 0 && a.to <= L && a.from < a.to);
}

/* Escolhe a próxima mensagem de uma pessoa. Retorna { msg, state } ou null. Função pura (testável). */
export function nextNudge(p, st, now, rand = Math.random) {
  const br = brNow(now);
  const prefs = { nudges: true, water: true, meals: true, faith: true, freq: 'normal', ...(p.prefs || {}) };
  if (!prefs.nudges && !prefs.water) return null;
  const w = dayWindow(prefs);
  const L = spanOf(w);
  const ANCHORS = anchorsFor(w);
  const mins = relOf(br.h * 60 + br.m, w); // minutos desde o começo do dia da pessoa
  st = { next: 0, day: '', done: {}, water: 0, verses: 0, recent: [], asked: {}, ...st };
  if (st.day !== br.date) st = { ...st, day: br.date, done: {}, water: 0, verses: 0, checkins: 0 };
  if (mins > L) return null;
  const seed = Math.floor(rand() * 1e6);
  const n = p.name || '';
  const V = { n, ...genderWords(p.prefs?.pronoun) };
  let msg = null;

  // 1) momentos fixos do dia
  const anchor = prefs.nudges && now - (st.lastAny || 0) >= 20 * 60e3 ? ANCHORS.find((a) => mins >= a.from && mins <= a.to && !st.done[a.key] && (!a.pref || prefs[a.pref])) : null;
  // água: de hora em hora, das 8h às 21h30 (independente das outras mensagens)
  const waterDue = prefs.water && (st.water || 0) < 4 && mins >= 90 && mins <= L - 45 && now >= (st.nextWater || 0) && now - (st.lastAny || 0) >= (st.minGap || 25) * 60e3;
  let isWater = false;
  if (!anchor && waterDue) {
    isWater = true;
    st.water++;
    st.lastWater = now;
    st.nextWater = now + (150 + Math.round(rand() * 60)) * 60e3; // próxima água entre 2h30 e 3h30 (máx. 4 por dia)
    const wpool = T.water.filter((w) => !(st.recent || []).some((r) => r.includes(fill(w, V))));
    msg = { title: KIND_TITLE.water, body: fill(pick(wpool.length ? wpool : T.water, seed), V), kind: 'water' };
  } else if (anchor) {
    st.done = { ...st.done, [anchor.key]: true };
    if (anchor.key === 'morning') {
      const count = (p.today || []).filter((x) => !x.done).length;
      const base = fill(pick(T.morning, seed), V);
      const v = prefs.faith ? pick(VERSES, seed + br.wd) : null;
      msg = { title: `☀️ Bom dia, ${n}`, body: v ? `${base}\n${verseText(v)}` : base, kind: 'morning', verse: v };
      if (count) msg.body += `\nHoje você tem ${count} ${count > 1 ? 'coisas' : 'coisa'} anotada${count > 1 ? 's' : ''}.`;
      if (prefs.faith) st.verses++;
    } else if (anchor.key === 'night') {
      const base = fill(pick(T.night, seed), V);
      const v = prefs.faith ? pick(NIGHT_VERSES, seed) : null;
      msg = { title: KIND_TITLE.night, body: v ? `${base}\n${verseText(v)}` : base, kind: 'night', verse: v };
    } else {
      msg = { title: KIND_TITLE[anchor.key], body: fill(pick(T[anchor.key], seed), V), kind: anchor.key };
    }
  } else {
    // avisos de RETORNO (sequência em risco / caiu no ranking) furam a fila: não esperam o próximo horário sorteado
    const sn0 = p.seen || {}, today0 = br.date;
    const usual0 = Array.isArray(sn0.hours) && sn0.hours.some((x) => x > 0) ? sn0.hours.indexOf(Math.max(...sn0.hours)) : 19;
    const opened0 = p.seenAt && new Date(p.seenAt - 3 * 3600e3).toISOString().slice(0, 10) === today0;
    const prio = prefs.nudges && now - (st.lastAny || 0) >= 20 * 60e3 && (
      ((sn0.streak || 0) >= 2 && !opened0 && ((br.h >= usual0 && br.h <= usual0 + 2) || br.h >= 19) && st.streakDay !== today0)
      || (p.rank && p.rank.pos && st.rankPos && st.rankWeek === p.rank.week && p.rank.pos > st.rankPos && st.rankDay !== today0));
    if (!prio && (!prefs.nudges || now < (st.next || 0) || now - (st.lastAny || 0) < (st.minGap || 25) * 60e3)) return null;
    // não manda logo antes de um momento fixo
    if (!prio && ANCHORS.some((a) => !st.done[a.key] && a.from - mins > 0 && a.from - mins < 25)) return null;
    // 2) mensagens ao longo do dia: agenda > água > fé > ânimo > autocuidado
    const agenda = agendaMessages(p, br, st).filter((m) => !st.recent.includes(m.body));
    const options = [];
    if (agenda.length) options.push(['agenda', 4]);
    // ficou horas sem abrir o app: chama de volta para anotar (até 3 por dia, com 3h entre elas)
    const away = p.seenAt ? now - p.seenAt : 0;
    if (away > 3 * 3600e3 && (st.checkins || 0) < 3 && now - (st.lastCheckin || 0) > 3 * 3600e3 && mins > 60) options.push(['checkin', 8]);
    // RETORNO (como no Duolingo): no horário em que a pessoa costuma abrir, usa o que mais importa para ela
    const sn = p.seen || {}, today = br.date;
    const usual = Array.isArray(sn.hours) && sn.hours.some((x) => x > 0) ? sn.hours.indexOf(Math.max(...sn.hours)) : 19;
    const openedToday = p.seenAt && new Date(p.seenAt - 3 * 3600e3).toISOString().slice(0, 10) === today;
    const nearUsual = br.h >= usual && br.h <= usual + 2;
    if ((sn.streak || 0) >= 2 && !openedToday && (nearUsual || br.h >= 19) && st.streakDay !== today) options.push(['streak', 12]);
    if (p.rank && p.rank.pos && st.rankPos && p.rank.pos > st.rankPos && st.rankDay !== today) options.push(['rank', 11]);
    if (p.rank && p.rank.pos) {
      if (st.rankWeek !== p.rank.week) { st.rankWeek = p.rank.week; st.rankPos = p.rank.pos; }
      else if (p.rank.pos < st.rankPos) st.rankPos = p.rank.pos; // subiu: guarda a melhor posição
    }
    if (prefs.faith && st.verses < 4) options.push(['verse', 3]);
    options.push(['motivation', 3]);
    options.push(['counsel', 3]);
    const habits = HABITS.filter(([a, b, t]) => br.h >= a && br.h < b && !(st.recent || []).some((r) => r.includes(fill(t, V).slice(0, 30))));
    if (habits.length) options.push(['habit', 3]);
    if (br.h >= 10 && br.h < 21) options.push(['social', 1.5]);
    if (mins > 160 && mins < L - 240) options.push(['selfcare', 1]);
    if (prio) { const pr = options.filter(([k]) => k === 'streak' || k === 'rank'); if (pr.length) options.splice(0, options.length, ...pr); }
    const total = options.reduce((a, [, w]) => a + w, 0);
    let r = rand() * total, kind = options[0][0];
    for (const [k, w] of options) { if ((r -= w) <= 0) { kind = k; break; } }
    if (kind === 'agenda') {
      const m = agenda[seed % agenda.length];
      st.asked = { ...st.asked, [m.key]: br.date };
      msg = { title: m.title, body: m.body, kind: 'agenda', fact: m.body };
    } else if (kind === 'water') {
      st.water++;
      msg = { title: KIND_TITLE.water, body: fill(pick(T.water, seed), V), kind: 'water' };
    } else if (kind === 'streak') {
      st.streakDay = br.date;
      const n2 = p.seen.streak;
      msg = { title: `🔥 ${n2} dias seguidos em risco`, body: fill(pick([`Sua sequência de ${n2} dias termina hoje, {n}. Conclua uma coisinha no Lembra para manter 🔥`, `Não deixa sua sequência de ${n2} dias acabar! Abre o Lembra e marca algo como feito.`, `${n2} dias seguidos sem esquecer nada. Bora fazer ${n2 + 1}? Falta só uma tarefa hoje.`], seed), V), kind: 'streak' };
    } else if (kind === 'rank') {
      st.rankDay = br.date;
      const r = p.rank, ahead = r.ahead || 0;
      msg = { title: `🏆 Você caiu para ${r.pos}º na liga ${r.leagueName}`, body: ahead > 0 ? `Faltam só ${ahead} pontos para recuperar o ${r.pos - 1}º lugar. Conclua uma tarefa no horário (+3).` : 'Conclua tarefas no horário para subir de novo no ranking da semana.', kind: 'rank', url: './#/ranking' };
      st.rankPos = r.pos;
    } else if (kind === 'checkin') {
      st.checkins = (st.checkins || 0) + 1;
      st.lastCheckin = now;
      const pool = T.checkin.filter((x) => !st.recent.includes(fill(x, V)));
      msg = { title: KIND_TITLE.checkin, body: fill(pick(pool.length ? pool : T.checkin, seed), V), kind: 'checkin' };
    } else if (kind === 'habit') {
      const hs = HABITS.filter(([a, b, t]) => br.h >= a && br.h < b && !(st.recent || []).some((r) => r.includes(fill(t, V).slice(0, 30))));
      msg = { title: KIND_TITLE.habit, body: fill(pick(hs, seed)[2], V), kind: 'habit' };
    } else if (kind === 'verse') {
      st.verses++;
      const v = pick(VERSES, seed);
      msg = { title: KIND_TITLE.verse, body: verseText(v), kind: 'verse', verse: v };
    } else {
      const pool = T[kind].filter((s) => !st.recent.includes(fill(s, V)));
      msg = { title: KIND_TITLE[kind] || KIND_TITLE.motivation, body: fill(pick(pool.length ? pool : T[kind], seed), V), kind };
    }
  }
  // variedade mesmo sem IA: às vezes um jeito diferente de começar e de terminar
  if (!['morning', 'night', 'verse'].includes(msg.kind)) {
    const r1 = rand(), r2 = rand();
    if (r1 < 0.45 && !/^(ei|opa|ô|psiu|fala|olha)\b/i.test(msg.body) && !(n && msg.body.includes(n))) msg.body = fill(`${pick(OPENERS, Math.floor(r1 * 1e6))} ${msg.body.charAt(0).toLowerCase()}${msg.body.slice(1)}`, V);
    if (r2 < 0.4) msg.body = fill(`${msg.body} ${pick(CLOSERS, Math.floor(r2 * 1e6))}`, V);
  }
  if (!isWater) st.next = now + randomGap(prefs.freq, rand) * 60e3;
  st.lastAny = now;
  st.minGap = 25 + Math.round(rand() * 22); // folga mínima também varia (25 a 47 min)
  st.recent = [...(st.recent || []), msg.body].slice(-12);
  return { msg: { ...msg, tag: 'p-amigo', url: msg.url || (['checkin', 'streak'].includes(msg.kind) ? './' : './#/p/hoje') }, state: st };
}

/* Reescreve a mensagem com IA, como um amigo/conselheiro de verdade.
   Versículos ficam exatamente como estão (a IA só escreve em volta). */
const AI_MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];
const KIND_TASK = {
  morning: 'Mensagem de bom dia carinhosa e animadora, que faça a pessoa se sentir importante. Se ela tiver coisas hoje, cite 1 ou 2 com leveza.',
  night: 'Mensagem de boa noite acolhedora: reconheça o esforço do dia, diga que ela foi bem e que pode descansar.',
  lunch: 'Lembre com carinho que está na hora de almoçar e de fazer uma pausa de verdade.',
  dinner: 'Lembre com carinho de jantar e desacelerar.',
  water: 'Lembre de beber água de um jeito divertido e cuidadoso (varie: copo, garrafinha, hidratação, cabeça boa).',
  agenda: 'Lembre a pessoa disto da agenda pessoal dela, como um amigo que se importa e dá aquela força: ',
  verse: 'Escreva UMA frase curta e acolhedora para apresentar o versículo (sem repetir o versículo).',
  motivation: 'Mensagem de ânimo e autoestima, sincera e específica (não genérica), como um amigo próximo ou conselheiro que acredita muito nela.',
  counsel: 'Fale como um psicólogo/conselheiro acolhedor: uma reflexão curta e prática sobre ansiedade, foco, autoestima, gratidão ou descanso, com uma pergunta ou ação simples. Base: ',
  social: 'Incentive com carinho a pessoa a cuidar das relações (falar com um amigo, ligar para a família, elogiar alguém). Base: ',
  streak: 'Avise com carinho e senso de urgência que a sequência de dias seguidos da pessoa no app vai acabar hoje se ela não concluir pelo menos uma tarefa. Base: ',
  rank: 'Avise de forma motivadora e competitiva (sem ser chato) que a pessoa caiu de posição no ranking semanal e diga como recuperar. Base: ',
  checkin: 'A pessoa está há algumas horas sem abrir o app de agenda. Chame de volta com carinho e curiosidade para ela anotar algo novo de hoje (compromisso, conta, recado, promessa). Base: ',
  habit: 'Lembre com leveza deste hábito do dia a dia, como um amigo que cuida: ',
  selfcare: 'Sugira um cuidado rápido com o corpo/mente (respirar, alongar, postura, tomar um ar, descansar os olhos).',
};
export async function humanize(env, msg, p, recent, br) {
  if (!env.AI || !msg.kind || !KIND_TASK[msg.kind]) return null;
  const today = (p.today || []).filter((x) => !x.done).map((x) => `${x.time ? x.time + ' ' : ''}${x.title}`).slice(0, 5).join('; ');
  const tone = { carinhoso: 'Tom: carinhoso e acolhedor.', firme: 'Tom: amigo coach, firme e motivador, que puxa para cima.', direto: 'Tom: direto e objetivo, sem rodeios, mas gentil.' }[p.prefs?.tone] || '';
  const work = p.work && p.work.profession ? `${p.name} trabalha como ${p.work.profession}${p.work.goal ? ` e o objetivo ${g.dele} é: ${p.work.goal}` : ''}. Quando fizer sentido, conecte a mensagem com a rotina dessa profissão (sem inventar fatos).` : '';
  const g = p.prefs?.pronoun === 'f' ? { dele: 'dela', o: 'a', ele: 'ela' } : p.prefs?.pronoun === 'm' ? { dele: 'dele', o: 'o', ele: 'ele' } : { dele: 'dele(a)', o: 'o(a)', ele: 'ele(a)' };
  const sys = `Você escreve notificações de celular em português do Brasil para ${p.name}${p.prefs?.pronoun === 'f' ? ' (mulher; use o feminino)' : p.prefs?.pronoun === 'm' ? ' (homem; use o masculino)' : ' (use linguagem neutra, sem marcar gênero)'}, como o melhor amigo ${g.dele} — alguém que se importa de verdade, conselheiro, que levanta a autoestima e a moral.${p.prefs?.faith === false ? ' Não fale de religião.' : ' Pode citar fé em Deus com naturalidade.'}
${tone} ${work}
Estilo: humano, caloroso, informal, como mensagem de WhatsApp de um amigo. Frases curtas. No máximo 1 ou 2 emojis. Nunca soe robótico, nunca use "lembrete:" seco, não use aspas, não repita frases prontas.
Agora são ${String(br.h).padStart(2, '0')}h${String(br.m).padStart(2, '0')} (${['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][br.wd]}).
${today ? `Coisas de hoje na agenda pessoal: ${today}.` : 'Hoje a agenda pessoal está livre.'}
NÃO repita nem parafraseie estas mensagens recentes: ${(recent || []).slice(-8).join(' | ') || '—'}
Responda SÓ com JSON: {"title":"até 38 caracteres, com 1 emoji","body":"até 170 caracteres"}`;
  const task = KIND_TASK[msg.kind] + (msg.kind === 'agenda' ? msg.fact : ['counsel', 'social', 'habit', 'checkin', 'streak', 'rank'].includes(msg.kind) ? msg.body : '');
  for (const model of AI_MODELS) {
    try {
      const out = await env.AI.run(model, { messages: [{ role: 'system', content: sys }, { role: 'user', content: task }], max_tokens: 220, temperature: 1.0 });
      const m = /\{[\s\S]*\}/.exec(String(out?.response || ''));
      if (!m) continue;
      const j = JSON.parse(m[0]);
      if (!j.title || !j.body) continue;
      let body = String(j.body).replace(/^["“]|["”]$/g, '').slice(0, 220);
      if (msg.verse) body = msg.kind === 'verse' ? `${body}\n${verseText(msg.verse)}` : `${body}\n${verseText(msg.verse)}`;
      return { title: String(j.title).slice(0, 50), body };
    } catch (e) { console.log('amigo IA', model, e.message); }
  }
  return null;
}

/* Roda a cada minuto (cron) */
export async function runPersonalCoach(env, sendToMember, team, rankInfo = null) {
  const now = Date.now();
  const br = brNow(now);
  const clock = br.h * 60 + br.m;
  const [state, force] = await Promise.all([env.CAL.get('pcoach', 'json'), env.CAL.get('pnudge-force', 'json')]);
  const all = state || {};
  let sent = 0, changed = false;
  for (const m of team) {
    const st = { ...(all[m.id] || {}) };
    if (force && force[m.id] && force[m.id] > (st.forcedAt || 0)) { st.next = 0; st.forcedAt = force[m.id]; changed = true; }
    // janela do dia guardada no estado (relida da ficha a cada 3h): fora dela, nem lê nada
    const fresh = st.win && now - (st.winAt || 0) < 3 * 3600e3;
    if (fresh) {
      const w = st.win, L = spanOf(w), mins = relOf(clock, w);
      if (mins > L) continue;
      const waterMaybe = mins >= 40 && mins <= L - 45 && now >= (st.nextWater || 0);
      if ((st.next || 0) > now && !waterMaybe && !anchorsFor(w).some((a) => mins >= a.from && mins <= a.to && !(st.day === br.date && st.done?.[a.key]))) continue;
    }
    const prof = await env.CAL.get(`pprofile:${m.id}`, 'json');
    if (!prof) continue; // a pessoa ainda não abriu o app novo
    st.win = dayWindow(prof.prefs || {});
    st.winAt = now;
    if (!fresh) { all[m.id] = { ...(all[m.id] || {}), ...st }; changed = true; }
    // resumo de outro dia (a pessoa não abriu o app hoje): ajusta "hoje" e "amanhã"
    const seenRaw = await env.CAL.get(`seen:${m.id}`);
    let sn = {}; try { sn = seenRaw && seenRaw.startsWith('{') ? JSON.parse(seenRaw) : { last: Number(seenRaw) || 0 }; } catch { sn = {}; }
    // posição no ranking (para avisar quando cair) — só para quem participa
    let rank = null;
    if (m.ws && m.ws !== 'main' && rankInfo) { const b = await rankInfo(m.ws); if (b) rank = b; }
    let p = { ...prof, name: prof.name || m.name, seenAt: sn.last || 0, seen: sn, rank };
    if (prof.date && prof.date !== br.date) {
      const yesterday = new Date(Date.parse(br.date) - 864e5).toISOString().slice(0, 10);
      p = { ...p, today: prof.date === yesterday ? prof.tomorrow || [] : [], tomorrow: [] };
    }
    const r = nextNudge(p, st, now);
    if (!r) { all[m.id] = st; continue; }
    // 7 em cada 10 mensagens escritas pela IA (as outras do banco variado): quase nunca iguais
    let out = r.msg;
    const u = r.state.usage && r.state.usage.date === br.date ? r.state.usage : { date: br.date, sent: 0, ai: 0 };
    if (Math.random() < 0.7 && r.msg.kind !== 'water') {
      const h = await humanize(env, r.msg, p, st.recent, br).catch(() => null);
      if (h) { out = { ...r.msg, body: h.body }; /* título fica o do tipo */ u.ai++; r.state.recent = [...(r.state.recent || []).slice(0, -1), h.body].slice(-12); }
    }
    u.sent++;
    r.state.usage = u;
    all[m.id] = r.state;
    changed = true;
    const { kind, fact, verse, ...push } = out;
    sent += await sendToMember(env, m.id, push);
  }
  if (changed) await env.CAL.put('pcoach', JSON.stringify(all));
  return sent;
}
