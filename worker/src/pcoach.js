/* "Amigo" do modo Pessoal: ao longo do dia (7h20 às 22h15) manda para cada pessoa
   mensagens de ânimo, versículos, água, hora de comer e lembretes do que ela anotou.
   Cada pessoa recebe só sobre a própria agenda pessoal. */
import { GENERICO, semNome, ehRemedio } from '../../functions/remedio.js';
import { bloqueado, medico } from './filtro.js';
import { proxima, daAgenda, slotsDe, turnoDe, feCrista, introducao, inicia } from './vivo.js';
import { brNow } from './coach.js';
import { pickMind, pickFaith, mindBrief, hashStr, RELIGIONS } from './mind.js';

/* Paráfrases próprias do Lembra (não são citações de nenhuma tradução). */
export const VERSES = [
  ['Com Cristo me sustentando, consigo encarar o que vier.', 'Filipenses 4:13'],
  ['Coragem! Não deixe o medo mandar, porque aonde você for Deus vai junto.', 'Josué 1:9'],
  ['Deus pensa em você com carinho: o que ele prepara é paz e um amanhã cheio de esperança.', 'Jeremias 29:11'],
  ['Deus cuida de mim como um pastor cuida do rebanho: não vai me faltar o essencial.', 'Salmos 23:1'],
  ['Deus diz: estou do seu lado, então respire. Eu te dou força e te seguro pela mão.', 'Isaías 41:10'],
  ['Jesus convida quem anda exausto e carregando peso demais: chega perto, aqui tem descanso.', 'Mateus 11:28'],
  ['Confie em Deus por inteiro, mesmo quando a sua cabeça não entende o caminho.', 'Provérbios 3:5'],
  ['Para quem ama a Deus, até os dias difíceis acabam servindo para algo bom.', 'Romanos 8:28'],
  ['Quando aperta, Deus é abrigo e força: uma ajuda que está sempre por perto.', 'Salmos 46:1'],
  ['O medo não veio de Deus. Dele vêm a força, o amor e a cabeça no lugar.', '2 Timóteo 1:7'],
  ['Coloque o seu caminho nas mãos de Deus e confie: ele cuida do resto.', 'Salmos 37:5'],
  ['Quem espera em Deus ganha fôlego novo: levanta voo, corre e segue sem desabar.', 'Isaías 40:31'],
  ['Pode soltar em Deus tudo o que te deixa ansioso. Ele se importa com você.', '1 Pedro 5:7'],
  ['O dia de hoje é presente de Deus. Que tal receber com alegria?', 'Salmos 118:24'],
  ['O amor de Deus não se esgota: toda manhã vem uma porção nova, e ele não falha.', 'Lamentações 3:22-23'],
  ['Obrigado, Deus, por ter me criado de um jeito tão incrível e só meu.', 'Salmos 139:14'],
  ['Jesus deixou um presente de despedida: a paz dele, para ficar com a gente.', 'João 14:27'],
  ['A tristeza pode dormir aqui uma noite, mas quando amanhece a alegria chega.', 'Salmos 30:5'],
  ['Entregue a Deus o que você faz e veja os seus planos ganharem firmeza.', 'Provérbios 16:3'],
  ['Que Deus abençoe você e proteja os seus passos.', 'Números 6:24'],
  ['Seja forte, sem pânico: Deus caminha junto e não vai embora.', 'Deuteronômio 31:6'],
  ['Seja qual for a tarefa, capriche de coração, como quem trabalha para Deus.', 'Colossenses 3:23'],
  ['Que a sua alegria venha de Deus, hoje e todo dia. Vale repetir: alegre-se!', 'Filipenses 4:4'],
  ['A alegria que vem de Deus é o que te mantém de pé.', 'Neemias 8:10'],
];
const NIGHT_VERSES = [
  ['Deito tranquilo e o sono chega logo: com Deus por perto, estou seguro.', 'Salmos 4:8'],
  ['Jesus convida quem anda exausto e carregando peso demais: chega perto, aqui tem descanso.', 'Mateus 11:28'],
  ['Pode soltar em Deus tudo o que te deixa ansioso. Ele se importa com você.', '1 Pedro 5:7'],
  ['Jesus deixou um presente de despedida: a paz dele, para ficar com a gente.', 'João 14:27'],
  ['A tristeza pode dormir aqui uma noite, mas quando amanhece a alegria chega.', 'Salmos 30:5'],
];

const T = {
  morning: [
    'Bom dia, {n}. O dia ainda tá em branco: você escolhe a primeira coisa que entra nele ☀️',
    'Acordou, {n}? Antes do celular te engolir: qual é a UMA coisa que, feita hoje, já salva o dia?',
    'Bom dia! Café, cara lavada e a agenda aberta. Nessa ordem, {n} ☕',
    'Dia novo, placar zerado. Ontem não conta mais, {n} ☀️',
    'Bom dia, {n}. Hoje não precisa ser perfeito, precisa só começar.',
    'Ei, {n}, bom dia! A versão de você das 18h vai agradecer o que você fizer nas próximas 2 horas.',
    'Bom dia! Abre a janela, respira esse ar e me diz: o que tá na sua lista hoje? 🌤️',
  ],
  water: [
    'Teu copo tá aí do lado te olhando faz um tempão, {n} 👀',
    'Desafio relâmpago: termina o copo antes de responder a próxima mensagem 🥤',
    'Se a garrafinha falasse, ela tava te chamando agora, {n}.',
    'Dor de cabeça no meio da tarde muitas vezes é sede disfarçada. Uns goles resolvem.',
    'A gente só lembra da água quando a boca seca. Adianta ela, {n} 😉',
    'Um copo agora = menos cansaço lá pelas 16h. Conta simples.',
    'Pausa estratégica: levanta, enche o copo, volta. Rende mais do que parece.',
    'Seu cérebro tá pedindo combustível transparente. Três goles e tá pago, {n}.',
    'Já percebeu que o cansaço da tarde às vezes é só sede? Testa agora.',
    'Hora do gole. Sem desculpa de "depois", {n} 🫗',
    'Copo cheio do lado do computador é o melhor lembrete que existe. Arruma um aí.',
    'Água com limão, gelada, natural… do jeito que for. Só não deixa pra amanhã.',
    'Missão rápida: um copo inteiro até o próximo compromisso, {n}.',
    'Seu rim mandou um recado: "lembra de mim?" 🫗',
    'Quanto você bebeu até agora hoje, {n}? Se precisou pensar, já sabe a resposta.',
    'Tem prova de que boca seca derruba o foco. Gole agora, foco depois.',
  ],
  lunch: [
    'Tá na hora do almoço, {n}. Come sentado e longe da tela, nem que seja por 15 minutos 🍽️',
    'Pular o almoço vira mau humor às 15h. Para um pouco e come direito, {n}.',
    'Almoço não é intervalo entre duas tarefas: é a tarefa agora 🍽️',
    'O que tem pra hoje no prato, {n}? Capricha que a tarde é longa.',
  ],
  dinner: [
    'Janta com calma hoje, {n}. O dia já cobrou o suficiente 🍽️',
    'Hora de fechar a cozinha do dia: janta e desacelera, {n}.',
    'Jantar leve, cabeça leve, sono melhor. Bora, {n}?',
  ],
  night: [
    'Fecha as abas do dia, {n}. O que ficou, amanhã eu te lembro 🌙',
    'Você aguentou o dia inteiro, {n}. Agora o compromisso é descansar 🌙',
    'Antes de dormir: uma coisa boa que aconteceu hoje. Pensa nela e apaga a luz.',
    'Celular longe da cama hoje, combinado? Eu cuido da agenda enquanto você dorme 🌙',
  ],
  motivation: [
    'Você riscou coisa hoje que ninguém viu, {n}. Eu vi 👀',
    'Quem marca na agenda já está um passo na frente de quem só pensa em fazer.',
    'Nem todo dia vai ser 100%. Os dias de 60% também te levam pra frente, {n}.',
    'O que parecia enorme semana passada hoje você já resolve sem pensar. Isso é crescer.',
    'Você é {lindo}, {n}. E não é só por fora, tá?',
    'A pessoa que você quer ser daqui a 6 meses está sendo construída nos seus dias comuns.',
    'Lembra daquilo que você achou que não ia dar conta? Deu. Vai dar de novo.',
    'Hoje o mínimo bem feito já conta como vitória, {n}.',
    'Ninguém te cobra mais do que você mesmo(a). Pega um pouco mais leve hoje 💜',
    'Disciplina é só lembrar do que você quer quando a preguiça bater. Por isso eu tô aqui 😉',
    'Seu jeito de fazer as coisas é único, {n}. Não precisa copiar o ritmo de ninguém.',
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
    'Ombro grudado na orelha? Solta ele. Agora o outro, {n} 🧘',
    'Olha pra algo bem longe da tela por 20 segundos. Seu olho agradece 👀',
    'Levanta, estica os braços pro alto e dá uma volta no cômodo. 60 segundos.',
    'Inspira contando até 4, segura 4, solta em 4. Duas vezes e volta pro jogo.',
    'Dá uma checada na postura agora mesmo, {n}. Pegou, né? 😄',
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
const OPENERS = ['Ei, {n}!', 'Ô {n},', 'Psiu, {n}!', 'Rapidinho:', 'Fala, {n}!', 'Olha só,', 'Plim! 🔔', '{n}, escuta essa:'];
const CLOSERS = ['Tô de olho 👀', 'Conta comigo.', 'Depois me conta 😉', 'Eu lembro do resto.', 'Fechou?', 'Valeu, {n}!'];
const pick = (a, seed) => a[Math.abs(seed) % a.length];
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');
/* palavras no gênero que a pessoa escolheu na ficha: feminino, masculino ou neutro */
export const genderWords = (pr) => (pr === 'f' ? { lindo: 'linda', campeao: 'campeã' } : pr === 'm' ? { lindo: 'lindo', campeao: 'campeão' } : { lindo: 'incrível', campeao: 'você' });
const verseText = ([t, ref]) => `${t} — ${ref}`; // paráfrase: sem aspas, porque não é citação
const hm = (t) => (t ? t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h') : '');

/* Mensagens a partir da agenda pessoal (cabelo, contas atrasadas, listas, aniversários...) */
export function agendaMessages(p0, br, st) {
  const seg = (L) => (L || []).filter((x) => !ehRemedio(x)); // remédio só sai pela frase própria, sem o nome na tela de bloqueio
  const p = { ...p0, today: seg(p0.today), tomorrow: seg(p0.tomorrow), overdue: seg(p0.overdue), lists: p0.lists };
  const out = [];
  const n = p.name || '';
  const nowMin = br.h * 60 + br.m;
  // variações por assunto e por dia: o mesmo lembrete nunca chega com a mesma frase dois dias seguidos
  const v = (key, list) => list[hashStr(`${key}|${br.date}`) % list.length];
  const agora = agoraDe(p, br);
  for (const x of daAgenda(p0, br)) out.push({ ...x, vivo: true });
  for (const it of p.today || []) {
    if (it.done || !it.time) continue;
    const [h, m] = it.time.split(':').map(Number);
    const diff = h * 60 + m - nowMin;
    if (it.cat !== 'pagar' && diff > 90 && diff < 480) out.push({ key: `up-${it.title}`, title: v(`upt-${it.title}`, ['📅 Mais tarde', '⏳ Guarda esse horário', '🔔 Spoiler do seu dia']), body: v(`up-${it.title}`, [`Hoje às ${hm(it.time)} tem ${it.title}. Já tá se organizando, ${n}?`, `${it.title} às ${hm(it.time)}. Quem se adianta não se atrasa 😉`, `Às ${hm(it.time)}: ${it.title}. Eu toco o sino na hora, combinado? 🔔`, `${n}, anota aí na cabeça: ${it.title} às ${hm(it.time)}. O resto deixa comigo.`]) });
  }
  if ((p.today || []).some((it) => !it.done && !it.time)) {
    const it = p.today.find((x) => !x.done && !x.time && x.cat !== 'pagar');
    if (it)     out.push({ key: `td-${it.title}`, title: v(`tdt-${it.title}`, ['📅 Não esquece hoje', '🔔 Lembra?', '✍️ Tá na lista de hoje']), body: v(`td-${it.title}`, [`Você anotou “${it.title}” pra hoje. Já fez? Se fez, marca como feito 😉`, `“${it.title}” tá te esperando hoje. Riscar é a melhor parte ✔️`, `Lembra de “${it.title}”? Eu lembro. É meu nome 😅`, `Hoje é dia de “${it.title}”. Um toque e pronto ✨`]) });
  }
  for (const it of (p.overdue || []).slice(0, 2)) out.push({ key: `od-${it.title}`, title: v(`odt-${it.title}`, ['📅 Ficou pra trás', '⏰ Atrasado não é perdido', '🔔 Toc toc']), body: v(`od-${it.title}`, [`Ainda tá pendente: ${it.title}. Bora resolver hoje? Você consegue 💪`, `${it.title} ficou pra trás. Que tal trazer pra frente hoje?`, `${it.title} ainda dá tempo! Resolve e tira isso da cabeça 😮‍💨`, `Quem é vivo sempre aparece… e ${it.title} também 😅 Bora?`]) });
  const lb = p.lastByCat || {}, nb = p.nextByCat || {};
  if (!nb.beleza) {
    const days = lb.beleza ? Math.round((Date.parse(br.date) - Date.parse(lb.beleza)) / 864e5) : null;
    const fem = p.prefs?.pronoun === 'f', masc = p.prefs?.pronoun === 'm';
    const what = fem ? 'um horário no salão (cabelo, unhas, sobrancelha)' : masc ? 'um corte de cabelo (e dar um tapa na barba)' : 'um momento de cuidado com o visual';
    if (days === null) out.push({ key: 'hair', title: '💈 Cuidar de você', body: `Já pensou em agendar ${what}, ${n}? Cuidar da aparência levanta a autoestima. Você merece 💜`, every: 5 });
    else if (days >= (fem ? 14 : 21)) out.push({ key: 'hair', title: fem ? '💅 Hora de se cuidar?' : '💈 E o cabelo?', body: `Faz ${days} dias desde o último cuidado com o visual. Precisa agendar? Anota aqui no app que eu te lembro 😉`, every: 4 });
  }
  for (const l of (p.lists || []).filter((x) => x.open >= 3).slice(0, 2)) {
    out.push({ key: `ls-${l.name}`, title: `Lista ${l.name} 📋`, body: `Sua lista “${l.name}” tem ${l.open} itens pendentes. Bora resolver alguns hoje?`, every: 2 });
  }
  if ((p.tomorrow || []).length && br.h >= 17) {
    const t = p.tomorrow[0];
    out.push({ key: `tm-${t.title}`, title: v(`tmt-${t.title}`, ['📅 Amanhã', '🌙 Spoiler de amanhã', '👀 Amanhã tem']), body: v(`tm-${t.title}`, [`Amanhã tem ${t.title}${t.time ? ' às ' + hm(t.time) : ''}. Já deixa tudo encaminhado pra não correr 😉`, `${t.title}${t.time ? ' às ' + hm(t.time) : ''}, amanhã. Dorme tranquilo(a) que eu te lembro 🔔`, `Amanhã: ${t.title}${t.time ? ' (' + hm(t.time) + ')' : ''}. Separa hoje o que precisar e acorda leve.`]) });
  }
  // não repete o mesmo assunto antes do prazo ("every" em dias; padrão: 1 vez por dia)
  const livres = out.filter((m) => {
    const last = st.asked?.[m.key];
    return !last || Date.parse(br.date) - Date.parse(last) >= (m.every || 1) * 864e5;
  });
  // transforma os pedidos em frases (cada uma sem repetir as últimas da categoria)
  const prontas = [];
  for (const m of livres) {
    if (!m.vivo) { prontas.push(m); continue; }
    const f = proxima({ cat: m.cat, perfil: p, slots: m.slots, agora, vh: st.vh });
    if (f) prontas.push({ key: m.key, every: m.every, title: f.titulo, body: inicia(f.texto), cat: m.cat, fid: f.id, vh: f.vh, ...(m.cat === 'remedio' ? { priv: m.slots.remedio } : {}) });
  }
  return prontas;
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
const agoraDe = (p, br) => { const w = dayWindow(p.prefs || {}), L = spanOf(w); return { turno: turnoDe(relOf(br.h * 60 + br.m, w), L), wd: br.wd, chave: `${br.date}T${String(br.h).padStart(2, '0')}` }; };
export function nextNudge(p, st, now, rand = Math.random) {
  const br = brNow(now);
  const prefs = { nudges: true, water: true, meals: true, faith: true, freq: 'normal', ...(p.prefs || {}) };
  const pid = p.uid || p.name || 'x'; // identidade da pessoa: a sequência de mensagens é só dela
  const fam = prefs.religion ? (RELIGIONS[prefs.religion] || {}).fam : null;
  if (fam === 'secular') prefs.faith = false;
  const faithOf = (slot) => (prefs.religion ? pickFaith(prefs.religion, pid, slot, st.recent || []) : pick(VERSES, hashStr(`${pid}|${slot}`)));
  const wantsMotivation = prefs.motivation !== false;
  const waterEvery = Number.isFinite(prefs.waterEvery) ? prefs.waterEvery : 180; // minutos (0 = não lembrar)
  const waterMax = waterEvery > 0 ? Math.max(1, Math.min(8, Math.floor(spanOf(dayWindow(prefs)) / waterEvery))) : 0;
  const phase = hashStr(`${pid}|agua`) % 40; // cada pessoa bebe água num horário diferente
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
  const agora = agoraDe(p, br), SL = slotsDe(p, br), cristao = feCrista(fam, prefs.faith);
  // frase viva da categoria; se nada couber, vale o texto de reserva
  const viva = (cat, kind, reserva) => { const m = proxima({ cat, perfil: p, slots: SL, agora, vh: st.vh }); if (!m) return reserva; st.vh = m.vh; return { title: m.titulo || KIND_TITLE[kind], body: inicia(m.texto), kind, cat, fid: m.id }; };
  const vivoVerso = () => { const m = proxima({ cat: 'versiculo', perfil: p, slots: SL, agora, vh: st.vh }); if (!m) return null; st.vh = m.vh; return m; };
  let msg = null;

  // 1) momentos fixos do dia
  const anchor = prefs.nudges && now - (st.lastAny || 0) >= 20 * 60e3 ? ANCHORS.find((a) => mins >= a.from && mins <= a.to && !st.done[a.key] && (!a.pref || prefs[a.pref])) : null;
  // água: de hora em hora, das 8h às 21h30 (independente das outras mensagens)
  const waterDue = prefs.water && waterEvery > 0 && (st.water || 0) < waterMax && mins >= 70 + phase && mins <= L - 45 && now >= (st.nextWater || 0) && now - (st.lastAny || 0) >= (st.minGap || 25) * 60e3;
  let isWater = false;
  if (!anchor && waterDue) {
    isWater = true;
    st.water++;
    st.lastWater = now;
    st.nextWater = now + Math.round(waterEvery * (0.85 + rand() * 0.3)) * 60e3; // no intervalo que a pessoa escolheu, com variação
    msg = viva('agua', 'water', { title: KIND_TITLE.water, body: fill(pick(T.water, seed), V), kind: 'water' });
  } else if (anchor) {
    st.done = { ...st.done, [anchor.key]: true };
    if (anchor.key === 'morning') {
      const count = (p.today || []).filter((x) => !x.done).length;
      msg = viva('manha', 'morning', { title: `☀️ Bom dia, ${n}`, body: fill(pick(T.morning, seed), V), kind: 'morning' });
      const m0 = cristao ? vivoVerso() : null, v = m0 ? [m0.texto, m0.ref] : prefs.faith && prefs.religion && !cristao ? faithOf(`${br.date}|manha`) : null;
      if (v) { msg.body = `${msg.body}\n${verseText(v)}`; msg.verse = v; msg.vfid = m0?.id; }
      if (count && !msg.body.includes(SL.qtd_hoje)) msg.body += `\nHoje você tem ${count} ${count > 1 ? 'coisas' : 'coisa'} anotada${count > 1 ? 's' : ''}.`;
      if (v) st.verses++;
    } else if (anchor.key === 'night') {
      msg = viva('noite', 'night', { title: KIND_TITLE.night, body: fill(pick(T.night, seed), V), kind: 'night' });
      const m0 = cristao ? vivoVerso() : null, v = m0 ? [m0.texto, m0.ref] : prefs.faith && prefs.religion && !cristao ? faithOf(`${br.date}|noite`) : null;
      if (v) { msg.body = `${msg.body}\n${verseText(v)}`; msg.verse = v; msg.vfid = m0?.id; }
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
    if (prefs.faith && prefs.religion && st.verses < 4) options.push(['verse', 3]); // só quem marcou a religião na ficha
    if (wantsMotivation) { options.push(['motivation', 3]); options.push(['counsel', 3]); }
    if (p.mind && wantsMotivation) options.push(['mind', 5]); // frases escolhidas pelo jeito de ser da pessoa
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
      if (m.vh) st.vh = m.vh;
      msg = { title: m.title, body: m.body, kind: 'agenda', fact: m.body, ...(m.cat ? { cat: m.cat, fid: m.fid } : {}), ...(m.priv ? { priv: m.priv } : {}) };
    } else if (kind === 'water') {
      st.water++;
      msg = viva('agua', 'water', { title: KIND_TITLE.water, body: fill(pick(T.water, seed), V), kind: 'water' });
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
    } else if (kind === 'mind') {
      const m2 = pickMind(p.mind, pid, `${br.date}|${br.h}|${st.mindN || 0}`, (st.recent || []).map((x) => x.replace(/\{n\}/g, n)));
      st.mindN = (st.mindN || 0) + 1;
      msg = { title: { ansiedade: '🌿 Respira', autoestima: '💜 Pra você', desmotivado: '💪 Um passo', motivado: '🔥 Bora', gratidao: '🙏 Gratidão', descanso: '🌙 Pausa' }[m2.group] || KIND_TITLE.motivation, body: fill(m2.text, V), kind: 'mind', group: m2.group };
    } else if (kind === 'verse') {
      st.verses++;
      const m0 = cristao ? vivoVerso() : null, v = m0 ? [m0.texto, m0.ref] : faithOf(`${br.date}|${br.h}|${st.verses}`), it = m0 ? introducao(p, SL, agora) : '';
      msg = { title: (m0 && m0.titulo) || KIND_TITLE.verse, body: `${it ? it + '\n' : ''}${verseText(v)}`, kind: 'verse', verse: v, ...(m0 ? { cat: 'versiculo', fid: m0.id, ref: m0.ref } : {}) };
    } else {
      const pool = T[kind].filter((s) => !st.recent.includes(fill(s, V)));
      const list = pool.length ? pool : T[kind];
      const reserva = { title: KIND_TITLE[kind] || KIND_TITLE.motivation, body: fill(list[hashStr(`${pid}|${br.date}|${br.h}|${kind}|${seed}`) % list.length], V), kind };
      msg = kind === 'motivation' ? viva('motivacao', kind, reserva) : kind === 'social' ? viva('socializar', kind, reserva) : reserva;
    }
  }
  // variedade mesmo sem IA: às vezes um jeito diferente de começar e de terminar
  if (!msg.fid && !['morning', 'night', 'verse'].includes(msg.kind)) {
    const r1 = rand(), r2 = rand();
    if (r1 < 0.45 && !/^(ei|opa|ô|psiu|fala|olha)\b/i.test(msg.body) && !(n && msg.body.includes(n))) msg.body = fill(`${pick(OPENERS, Math.floor(r1 * 1e6))} ${msg.body.charAt(0).toLowerCase()}${msg.body.slice(1)}`, V);
    if (r2 < 0.4) msg.body = fill(`${msg.body} ${pick(CLOSERS, Math.floor(r2 * 1e6))}`, V);
  }
  if (!isWater) st.next = now + (prefs.perDay ? Math.max(25, Math.round((L / prefs.perDay) * (0.6 + rand() * 0.8))) : randomGap(prefs.freq, rand)) * 60e3;
  st.lastAny = now;
  st.minGap = 25 + Math.round(rand() * 22); // folga mínima também varia (25 a 47 min)
  st.recent = [...(st.recent || []), msg.body].slice(-40);
  return { msg: { ...msg, tag: 'p-amigo', url: msg.url || (['checkin', 'streak'].includes(msg.kind) ? './' : './#/p/hoje') }, state: st };
}

/* Reescreve a mensagem com IA, como um amigo/conselheiro de verdade.
   Versículos ficam exatamente como estão (a IA só escreve em volta). */
const AI_MODELS = ['@cf/meta/llama-3.1-8b-instruct-fast'];
const KIND_TASK = {
  morning: 'Mensagem de bom dia carinhosa e animadora, que faça a pessoa se sentir importante. Se ela tiver coisas hoje, cite 1 ou 2 com leveza.',
  night: 'Mensagem de boa noite acolhedora: reconheça o esforço do dia, diga que ela foi bem e que pode descansar.',
  lunch: 'Lembre que é hora do almoço de um jeito original e específico (comer longe da tela, não pular refeição pra não ficar de mau humor à tarde). Sem frases batidas.',
  dinner: 'Lembre com carinho de jantar e desacelerar.',
  water: 'Lembre de tomar água de um jeito original: uma observação concreta (o copo do lado, a sede que vira cansaço às 16h, um desafio de 3 goles). Nunca diga "beba água" nem "hidrate-se".',
  agenda: 'Lembre a pessoa disto da agenda pessoal dela, como um amigo que se importa e dá aquela força: ',
  verse: 'Escreva UMA frase curta e acolhedora para apresentar o versículo (sem repetir o versículo).',
  motivation: 'Mensagem de ânimo e autoestima, sincera e específica (não genérica), como um amigo próximo ou conselheiro que acredita muito nela.',
  mind: 'Reescreva esta mensagem do jeito dessa pessoa, como um amigo próximo que conhece ela (mantenha a ideia). Base: ',
  counsel: 'Fale como um psicólogo/conselheiro acolhedor: uma reflexão curta e prática sobre ansiedade, foco, autoestima, gratidão ou descanso, com uma pergunta ou ação simples. Base: ',
  social: 'Incentive com carinho a pessoa a cuidar das relações (falar com um amigo, ligar para a família, elogiar alguém). Base: ',
  streak: 'Avise com carinho e senso de urgência que a sequência de dias seguidos da pessoa no app vai acabar hoje se ela não concluir pelo menos uma tarefa. Base: ',
  rank: 'Avise de forma motivadora e competitiva (sem ser chato) que a pessoa caiu de posição no ranking semanal e diga como recuperar. Base: ',
  checkin: 'A pessoa está há algumas horas sem abrir o app de agenda. Chame de volta com carinho e curiosidade para ela anotar algo novo de hoje (compromisso, conta, recado, promessa). Base: ',
  habit: 'Lembre com leveza deste hábito do dia a dia, como um amigo que cuida: ',
  selfcare: 'Sugira um cuidado rápido com o corpo/mente (respirar, alongar, postura, tomar um ar, descansar os olhos).',
};
export async function humanize(env, msg, p, recent, br) {
  if (!env.AI || p.ia !== true || msg.kind !== 'agenda' || msg.fid) return null; // só com o consentimento da pessoa, e só recados da agenda (o resto vem do banco, sem gastar IA)
  const g = p.prefs?.pronoun === 'f' ? { dele: 'dela', o: 'a', ele: 'ela' } : p.prefs?.pronoun === 'm' ? { dele: 'dele', o: 'o', ele: 'ele' } : { dele: 'dele(a)', o: 'o(a)', ele: 'ele(a)' };
  const today = (p.today || []).filter((x) => !x.done).map(semNome).map((x) => `${x.time ? x.time + ' ' : ''}${x.title}`).slice(0, 5).join('; ');
  const tone = { carinhoso: 'Tom: carinhoso e acolhedor.', firme: 'Tom: amigo coach, firme e motivador, que puxa para cima.', direto: 'Tom: direto e objetivo, sem rodeios, mas gentil.' }[p.prefs?.tone] || '';
  const work = p.work && p.work.profession ? `${p.name} trabalha como ${p.work.profession}${p.work.goal ? ` e o objetivo ${g.dele} é: ${p.work.goal}` : ''}. Quando fizer sentido, conecte a mensagem com a rotina dessa profissão (sem inventar fatos).` : '';
  const sys = `Você escreve notificações de celular em português do Brasil para ${p.name}${p.prefs?.pronoun === 'f' ? ' (mulher; use o feminino)' : p.prefs?.pronoun === 'm' ? ' (homem; use o masculino)' : ' (use linguagem neutra, sem marcar gênero)'}, como o melhor amigo ${g.dele} — alguém que se importa de verdade, conselheiro, que levanta a autoestima e a moral.${p.prefs?.faith === false || (p.prefs?.religion && (RELIGIONS[p.prefs.religion] || {}).fam === 'secular') ? ' Não fale de religião nem de Deus.' : p.prefs?.religion ? ` A religião da pessoa é ${RELIGIONS[p.prefs.religion]?.label || 'cristã'}: se falar de fé, respeite SÓ essa tradição.` : ' Pode citar fé em Deus com naturalidade.'}${p.mind ? ` Sobre a pessoa: ${mindBrief(p.mind)}.` : ''}${p.age ? ` Ela tem por volta de ${p.age} anos: use referências e jeito de falar dessa idade.` : ''}
${tone} ${work}
Estilo: humano, caloroso, informal, como mensagem de WhatsApp de um amigo espirituoso. Frases curtas. No máximo 1 emoji. Nunca soe robótico, nunca use "lembrete:" seco, não use aspas. PROIBIDO frases batidas de autoajuda e de app: "saco vazio não para em pé", "beba água", "hidrate-se", "seu corpo agradece", "um passo de cada vez", "você é capaz", "você consegue", "foco, força e fé", "bora lá", "não desista", "acredite em você". Seja específico, com uma imagem concreta, uma observação esperta ou um desafio pequeno — como quem conhece a pessoa.
Agora são ${String(br.h).padStart(2, '0')}h${String(br.m).padStart(2, '0')} (${['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][br.wd]}).
${today ? `Coisas de hoje na agenda pessoal: ${today}.` : 'Hoje a agenda pessoal está livre.'}
NÃO repita nem parafraseie estas mensagens recentes: ${(recent || []).slice(-8).join(' | ') || '—'}
Responda SÓ com JSON: {"title":"até 38 caracteres, com 1 emoji","body":"até 170 caracteres"}`;
  const task = KIND_TASK[msg.kind] + (msg.kind === 'agenda' ? msg.fact : ['counsel', 'social', 'habit', 'checkin', 'streak', 'rank', 'mind'].includes(msg.kind) ? msg.body : '');
  for (const model of AI_MODELS) {
    try {
      const out = await env.AI.run(model, { messages: [{ role: 'system', content: sys }, { role: 'user', content: task }], max_tokens: 220, temperature: 1.0 });
      const m = /\{[\s\S]*\}/.exec(String(out?.response || ''));
      if (!m) continue;
      const j = JSON.parse(m[0]);
      if (!j.title || !j.body) continue;
      let body = String(j.body).replace(/^["“]|["”]$/g, '').slice(0, 220);
      if (msg.verse) body = msg.kind === 'verse' ? `${body}\n${verseText(msg.verse)}` : `${body}\n${verseText(msg.verse)}`;
      if (bloqueado(`${j.title} ${body}`) || medico(body)) continue; // a IA passa pelo mesmo filtro do banco
      return { title: String(j.title).slice(0, 50), body };
    } catch (e) { console.log('amigo IA', model, e.message); }
  }
  return null;
}

/* Um "amigo" para UMA pessoa (o relógio chama só quando é a vez dela).
   Estado por pessoa em pc:{id}; pedido de teste em pcf:{id}. Retorna quantos avisos saíram e quando olhar de novo. */
export async function amigoOne(env, sendToMember, m, now = Date.now(), rankInfo = null, usage = null) {
  const br = brNow(now);
  const clock = br.h * 60 + br.m;
  const key = `pc:${m.id}`;
  const st = { ...((await env.CAL.get(key, 'json')) || {}) };
  let changed = false;
  const force = Number(await env.CAL.get(`pcf:${m.id}`)) || 0;
  if (force && force > (st.forcedAt || 0)) { st.next = 0; st.forcedAt = force; changed = true; }
  // janela do dia guardada no estado (relida da ficha a cada 3h): fora dela, nem lê nada
  const fresh = st.win && now - (st.winAt || 0) < 3 * 3600e3;
  if (fresh) {
    const w = st.win, L = spanOf(w), mins = relOf(clock, w);
    const waterMaybe = mins >= 40 && mins <= L - 45 && now >= (st.nextWater || 0);
    if (mins > L || ((st.next || 0) > now && !waterMaybe && !anchorsFor(w).some((a) => mins >= a.from && mins <= a.to && !(st.day === br.date && st.done?.[a.key])))) {
      if (changed) await env.CAL.put(key, JSON.stringify(st));
      return { sent: 0, nextAt: amigoNextAt(st, now) };
    }
  }
  const prof = await env.CAL.get(`pprofile:${m.id}`, 'json');
  if (!prof) { if (changed) await env.CAL.put(key, JSON.stringify(st)); return { sent: 0, nextAt: null }; } // ainda não abriu o app novo
  if (!fresh) { st.win = dayWindow(prof.prefs || {}); st.winAt = now; changed = true; }
  // resumo de outro dia (a pessoa não abriu o app hoje): ajusta "hoje" e "amanhã"
  const seenRaw = await env.CAL.get(`seen:${m.id}`);
  let sn = {}; try { sn = seenRaw && seenRaw.startsWith('{') ? JSON.parse(seenRaw) : { last: Number(seenRaw) || 0 }; } catch { sn = {}; }
  // posição no ranking (para avisar quando cair) — só para quem participa
  let rank = null;
  if (m.ws && m.ws !== 'main' && rankInfo) { const b = await rankInfo(m.ws); if (b) rank = b; }
  let p = { ...prof, uid: m.id, name: prof.prefs?.nickname || prof.name || m.name, seenAt: sn.last || 0, seen: sn, rank, banco: env.FRASES ? env.FRASES.atual() : null, likes: prof.likes || [], goals: prof.goals || [], mind: prof.prefs?.mind || null, age: prof.prefs?.age || null };
  if (prof.date && prof.date !== br.date) {
    const yesterday = new Date(Date.parse(br.date) - 864e5).toISOString().slice(0, 10);
    p = { ...p, today: prof.date === yesterday ? prof.tomorrow || [] : [], tomorrow: [] };
  }
  st.vh = (await env.CAL.get(`vh:${m.id}`, 'json')) || {};
  const r = nextNudge(p, st, now);
  delete st.vh;
  if (!r) { if (changed) await env.CAL.put(key, JSON.stringify(st)); return { sent: 0, nextAt: amigoNextAt(st, now) }; }
  // os recados da agenda que não vêm do banco de frases podem ser reescritos pela IA (com consentimento)
  let out = r.msg, ai = false;
  if (r.msg.kind === 'agenda' && !r.msg.fid && !r.msg.priv && Math.random() < 0.7) {
    const h = await humanize(env, r.msg, p, st.recent, br).catch((e) => { console.log('humanize falhou', e.message); if (usage && usage.erro) usage.erro('amigo'); return null; });
    if (h) { out = { ...r.msg, body: h.body }; ai = true; r.state.recent = [...(r.state.recent || []), h.body].slice(-40); }
  }
  delete r.state.usage;
  const vh = r.state.vh; delete r.state.vh;
  // grava ANTES de mandar: se algo cair no meio, a mesma mensagem nunca sai duas vezes
  await env.CAL.put(key, JSON.stringify(r.state));
  if (r.msg.fid || r.msg.vfid) await env.CAL.put(`vh:${m.id}`, JSON.stringify(vh || {}));
  if (usage) usage('amigo', ai);
  const { kind, fact, verse, cat, fid, vfid, ref, priv, ...push0 } = out;
  const push = priv ? { ...push0, ...GENERICO, data: { remedio: priv, corpo: out.body } } : push0; // remédio: o nome vai só nos dados, nunca na tela de bloqueio
  // cat e fid vão no aviso na Etapa 4
  const sent = await sendToMember(env, m.id, push);
  return { sent, nextAt: amigoNextAt(r.state, now) };
}

/* Quando olhar a pessoa de novo: o próximo horário sorteado, a próxima água, o próximo momento fixo do dia
   (bom dia, almoço, jantar, boa noite) ou, no máximo, daqui a 30 min (avisos de "volta aqui"). */
export function amigoNextAt(st, now = Date.now()) {
  const MIN = 60e3, CAP = 30 * MIN;
  if (!st || !st.win) return now + CAP;
  const br = brNow(now), clock = br.h * 60 + br.m;
  const w = st.win, L = spanOf(w), mins = relOf(clock, w);
  if (mins > L) return now + (((w.start - clock + 1440) % 1440) || 1440) * MIN + 30e3; // começo da próxima janela
  const at = (rel) => now + (rel - mins) * MIN;
  const c = [now + CAP];
  const after = (t) => { if (Number.isFinite(t) && t > now) c.push(t); };
  after(st.next);
  after(st.nextWater);
  after((st.lastAny || 0) + (st.minGap || 25) * MIN);
  const done = st.day === br.date ? st.done || {} : {};
  for (const a of anchorsFor(w)) {
    if (done[a.key]) continue;
    if (a.from > mins) after(at(a.from));
    else if (a.to >= mins) after(Math.max(now + 2 * MIN, (st.lastAny || 0) + 20 * MIN));
  }
  if (mins < 70) after(at(70));
  after(at(L) + MIN);
  return Math.max(now + MIN, Math.min(...c));
}

/* Compatível com a versão antiga (todo mundo de uma vez): usada nos testes */
export async function runPersonalCoach(env, sendToMember, team, rankInfo = null) {
  await splitLegacyAmigo(env);
  let sent = 0;
  for (const m of team) sent += (await amigoOne(env, sendToMember, m, Date.now(), rankInfo)).sent;
  return sent;
}
/* Uma vez só: o estado antigo (uma chave com todo mundo) vira um por pessoa */
export async function splitLegacyAmigo(env) {
  const all = await env.CAL.get('pcoach', 'json');
  if (all && typeof all === 'object') {
    for (const [id, st] of Object.entries(all)) if (st && !(await env.CAL.get(`pc:${id}`))) await env.CAL.put(`pc:${id}`, JSON.stringify(st));
    await (env.CAL.delete ? env.CAL.delete('pcoach') : env.CAL.put('pcoach', 'null'));
  }
  const force = await env.CAL.get('pnudge-force', 'json');
  if (force && typeof force === 'object') {
    for (const [id, t] of Object.entries(force)) await env.CAL.put(`pcf:${id}`, String(t));
    await (env.CAL.delete ? env.CAL.delete('pnudge-force') : env.CAL.put('pnudge-force', 'null'));
  }
}
