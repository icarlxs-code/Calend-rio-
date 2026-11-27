/* A vida da pessoa, do jeito que ela contou (relacionamento, filhos, como anda o ânimo),
   para o mascote falar com ELA. Puro: sem tela, sem banco e sem rede (os testes conferem frase por frase).
   Fica só na conta da própria pessoa (users/{uid}); o painel do dono nunca recebe nada disto.
   Toda pergunta tem "prefiro não dizer": a tela é obrigatória, a resposta não. */

export const VERSAO_VIDA = 1;
export const NAO_DIZER = 'nao_dizer';
export const RELACOES = [
  ['solteiro', 'Solteiro(a)'], ['namorando', 'Namorando'], ['noivo', 'Noivo(a)'], ['casado', 'Casado(a)'], ['uniao', 'União estável'],
  ['complicado', 'É complicado'], ['separado', 'Separado(a) ou divorciado(a)'], ['viuvo', 'Viúvo(a)'], [NAO_DIZER, 'Prefiro não dizer'],
];
export const COM_PAR = ['namorando', 'noivo', 'casado', 'uniao', 'complicado'];
export const FILHOS = [['sim', 'Sim'], ['nao', 'Não'], ['gravida', 'A caminho'], [NAO_DIZER, 'Prefiro não dizer']];
export const ANIMO = [['bem', 'Animado(a)'], ['normal', 'Normal'], ['desanimado', 'Meio desanimado(a)'], ['dificil', 'Passando por uma fase difícil'], [NAO_DIZER, 'Prefiro não dizer']];
const ok = (L, v) => L.some(([k]) => k === v);
const nome = (s) => String(s || '').normalize('NFC').replace(/[<>{}\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);

/** confere e limpa o que veio da tela (ou do banco). null = faltou responder alguma pergunta */
export function limpaVida(v) {
  if (!v || typeof v !== 'object') return null;
  const rel = ok(RELACOES, v.rel) ? v.rel : null, fil = ok(FILHOS, v.filhos) ? v.filhos : null, ani = ok(ANIMO, v.animo) ? v.animo : null;
  if (!rel || !fil || !ani) return null;
  const filhos = fil === 'sim' ? (Array.isArray(v.nomes) ? v.nomes : String(v.nomes || '').split(/[,;\n]|\se\s/)).map(nome).filter(Boolean).slice(0, 8) : [];
  return { v: VERSAO_VIDA, rel, par: COM_PAR.includes(rel) ? nome(v.par) : '', filhos: fil, nomes: filhos, animo: ani };
}
/** já respondeu esta versão das perguntas? */
export const respondeu = (p) => !!(p && p.vida && p.vida.v >= VERSAO_VIDA && limpaVida(p.vida));

/* ---------- frases: escolhidas pela vida da pessoa, nunca a mesma duas vezes seguidas ---------- */
const h32 = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const G = (pr, m, f, n) => (pr === 'f' ? f : pr === 'm' ? m : n);
const lista = (L) => (L.length <= 1 ? L[0] || '' : `${L.slice(0, -1).join(', ')} e ${L.at(-1)}`);

const F = {
  filho: [
    'E aí, como {filho} está hoje? Manda um beijo meu 💛', '{Filho} tem sorte de ter você por perto. De verdade.', 'Já deu um abraço em {filho} hoje? Vale mais que qualquer tarefa 🤗',
    'Saiu com {filho} hoje? Um passeio curtinho já vira lembrança boa.', 'Aposto que {filho} te acha {incrivel}. E tá certo.', 'Tempo com {filho} nunca é tempo perdido 💛',
    'Quando bater o cansaço, lembra: {filho} se inspira em você.', 'Que tal guardar um horário hoje só pra você e {filho}?', '{Filho} cresce rápido. Aproveita cada risada 😄',
    'Você está fazendo um trabalho lindo com {filho}. Não esquece disso.', 'Cuida de você também: {filho} precisa de você bem 💪', 'Uma foto com {filho} hoje? Daqui a uns anos vai valer ouro 📸',
  ],
  filhos: [
    'Como estão {filhos}? Casa cheia é coração cheio 💛', '{Filhos} têm sorte de ter você. Lembra disso nos dias puxados.', 'Já pensou num programinha com {filhos} esse fim de semana?',
    'Cuidar de {filhos} e da agenda ao mesmo tempo? Você é {forte} 💪', 'Um abraço coletivo em {filhos} hoje, combinado? 🤗', 'Respira: você não precisa ser perfeito(a), só presente. {Filhos} sentem isso.',
  ],
  gravida: ['Tem alguém a caminho! Como você está se sentindo? 💛', 'Cuida de você com carinho: tem uma vida nova chegando 🌱', 'Já pensou no enxoval? Posso te lembrar das consultas 🗓️'],
  par: [
    'Como você e {par} estão? Um recadinho carinhoso hoje faz diferença 💌', 'Que tal surpreender {par} com algo simples hoje? 😉', 'Relacionamento bom é feito de pequenos cuidados. Você manda bem nisso.',
    'Já disse pra {par} o quanto gosta dele(a) hoje? 💛', 'Uma janta, um filme, um passeio… {par} vai amar ✨', 'Separa um tempinho só pra você e {par} essa semana?',
  ],
  parSemNome: ['Como vocês dois estão? Um recadinho carinhoso hoje faz diferença 💌', 'Que tal um programa a dois essa semana? 😉', 'Pequenos cuidados mantêm o amor aceso. Você manda bem nisso 💛'],
  complicado: [
    'Fase confusa no amor? Vai passar. Você merece alguém que te dê paz 💛', 'Você não precisa resolver tudo hoje. Um passo de cada vez.', 'Seu valor não depende de ninguém. Lembra disso 💪',
    'Cuida do seu coração primeiro. O resto se ajeita.', 'Se estiver pesado, conversa com alguém de confiança. Você não está {so} 🤝', 'Você é {incrivel} do jeitinho que é. Quem estiver do seu lado precisa enxergar isso ✨',
  ],
  solteiro: [
    'Solteiro(a) e dono(a) da própria agenda! Aproveita pra cuidar de você 😎', 'Seu tempo é todo seu: que tal um programa que você adora hoje?', 'Você é {incrivel} e merece o melhor. Começando por você mesmo(a) 💛',
    'Bora investir em você? Um curso, um treino, um passeio… o mundo é seu ✨', 'Sua companhia é ótima. Aproveita um momento só seu hoje 🌿',
  ],
  separado: ['Recomeçar exige coragem, e você tem de sobra 💪', 'Cada dia é uma página nova. Escreve uma boa hoje ✨', 'Você está {forte}, mesmo quando não parece. Orgulho de você 💛'],
  viuvo: ['Estou aqui com você. Um dia de cada vez 🤍', 'Saudade é amor que continua. Se precisar, conversa com alguém querido 🤍', 'Cuida de você hoje com carinho. Você merece 🌿'],
  desanimado: [
    'Dia difícil? Você já venceu muitos outros. Vai vencer esse também 💪', 'Não precisa dar conta de tudo. Escolhe uma coisa só e comemora quando fizer 🎉', 'Você é mais {forte} do que imagina. Eu acredito em você 💛',
    'Respira fundo. Uma tarefinha de cada vez e o dia anda ✨', 'Ninguém vê, mas eu vejo o seu esforço. Tá indo muito bem 👏', 'Hoje, seja gentil com você mesmo(a). Você merece 🌷',
    'Pequenos passos também levam longe. Bora dar um hoje?', 'Lembra de beber água e respirar. O resto a gente organiza junto 💧',
  ],
  dificil: [
    'Fase difícil não é pra sempre. Você vai sair dessa 💛', 'Estou do seu lado. Se apertar, conversa com alguém de confiança ou com o CVV (188) 🤍', 'Você não está {so}. Um dia de cada vez, combinado?',
    'O que você está sentindo importa. Cuida de você primeiro hoje 🌿', 'Você já atravessou dias pesados antes. Vai atravessar esse também 💪',
  ],
  bem: ['Que energia boa! Aproveita pra adiantar aquilo que você vem adiando 🚀', 'Você tá voando hoje! Orgulho de você 🎉', 'Dia bom pede comemoração: marca algo legal pra você 😎'],
  linda: ['Já te disseram hoje que você é {incrivel}? Pois é 💛', 'Você ilumina qualquer lugar. Não esquece disso ✨', 'Olha no espelho e repete: eu sou {incrivel}. Porque é verdade 💖'],
};
/** troca {o}/{filho}/{par}/{incrivel}… pelas palavras da pessoa (com o gênero que ela escolheu) */
function enche(t, s) {
  return t.replace(/\{(\w+)\}/g, (_, k) => {
    const cap = k[0] === k[0].toUpperCase(), base = k.toLowerCase(), v = s[base] ?? '';
    return cap && v ? v.charAt(0).toUpperCase() + v.slice(1) : v;
  }).replace(/\s+/g, ' ').replace(/ ([,.!?])/g, '$1').trim();
}

/**
 * As falas da vida da pessoa: lista de { k, t } (k = assunto, para o mascote não repetir o mesmo tema seguido).
 * `semente` muda a escolha (dia, hora…); `pronome` é o da ficha ('f', 'm' ou 'n').
 */
export function frasesDaVida(vida, { pronome = 'n', semente = '', max = 4 } = {}) {
  const v = limpaVida(vida); if (!v) return [];
  const s = {
    incrivel: G(pronome, 'incrível', 'linda', 'incrível'), forte: G(pronome, 'forte', 'forte', 'forte'), so: G(pronome, 'sozinho', 'sozinha', 'só'),
    par: v.par, o: '', filho: '', filhos: lista(v.nomes),
  };
  const temas = [];
  if (v.filhos === 'sim' && v.nomes.length === 1) temas.push(['filho', F.filho]);
  else if (v.filhos === 'sim' && v.nomes.length > 1) temas.push(['filhos', F.filhos]);
  else if (v.filhos === 'sim') temas.push(['filhos', F.filhos.filter((x) => !/\{Filhos\}|\{filhos\}/.test(x)).concat(['Como estão as crianças? Casa cheia é coração cheio 💛'])]);
  else if (v.filhos === 'gravida') temas.push(['gravida', F.gravida]);
  if (['namorando', 'noivo', 'casado', 'uniao'].includes(v.rel)) temas.push(['par', v.par ? F.par : F.parSemNome]);
  if (v.rel === 'complicado') temas.push(['complicado', F.complicado]);
  if (v.rel === 'solteiro') temas.push(['solteiro', F.solteiro]);
  if (v.rel === 'separado') temas.push(['separado', F.separado]);
  if (v.rel === 'viuvo') temas.push(['viuvo', F.viuvo]);
  if (['desanimado', 'dificil', 'bem'].includes(v.animo)) temas.push([v.animo, F[v.animo]]);
  if (pronome === 'f' || v.animo === 'desanimado' || v.animo === 'dificil') temas.push(['autoestima', F.linda]);
  const out = [];
  for (const [k, L] of temas) {
    if (k === 'filho') { s.filho = v.nomes[0]; s.o = ''; }
    const t = L[h32(`${semente}:${k}`) % L.length];
    out.push({ k: `vida-${k}`, t: enche(t, s) });
  }
  return out.slice(0, max);
}
/** quantas frases diferentes a vida desta pessoa rende (para os testes e para o painel de qualidade) */
export const totalFrases = (vida) => { const v = limpaVida(vida); if (!v) return 0; const s = new Set(); for (let i = 0; i < 400; i++) frasesDaVida(v, { semente: String(i), max: 9 }).forEach((x) => s.add(x.t)); return s.size; };

/* ---------- conversa curta: "vocês estão bem?" ---------- */
export function perguntaDoPar(vida) {
  const v = limpaVida(vida); if (!v || !COM_PAR.includes(v.rel)) return null;
  return v.par ? `E você e ${v.par}, estão bem?` : 'E aí, vocês dois estão bem?';
}
export const RESPOSTA_SIM = ['Que bom! Cuida bem desse amor 💛', 'Amo saber disso! Aproveita esse momento bom ✨', 'Isso aí! Relação boa é a que traz paz 🌿'];

/* ---------- risco: agressão, ameaça ou pensamento de se machucar ---------- */
const sem = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const VIOLENCIA = /\b(me (bate|bateu|batia|agride|agrediu|empurr\w*|machuc\w*|enforc\w*|estupr\w*|ameac\w*|forca|forcou|prende|trancou)|(bate|bateu|batendo|agrediu|agressao|agressiv\w*|violen\w*|espanc\w*|soco|tapa|chute|estupro|abuso|abusiv\w*|medida protetiva)|ameac\w* (me |de )?(matar|bater)|vai me matar|tenho medo (dele|dela|do meu|da minha))\b/;
const AUTOLESAO = /\b((quero|vou|vontade de|pensando em|penso em|pensei em) me matar|quero morrer|nao quero (mais )?viver|vontade de morrer|acabar com (a minha vida|tudo)|suicid\w*|me (cortar|machucar)|tirar (a )?minha (propria )?vida|sumir pra sempre)\b/;
/** 'violencia' | 'autolesao' | null */
export function risco(texto) {
  const s = sem(texto);
  if (AUTOLESAO.test(s)) return 'autolesao';
  if (VIOLENCIA.test(s)) return 'violencia';
  return null;
}
/** os números que o botão liga (o celular pede confirmação; o app nunca liga sozinho) */
export const EMERGENCIA = [
  { n: '190', t: 'Polícia (190)', s: 'Perigo agora' },
  { n: '180', t: 'Central da Mulher (180)', s: 'Violência contra a mulher, 24h' },
  { n: '188', t: 'CVV (188)', s: 'Apoio emocional, 24h, de graça' },
  { n: '192', t: 'SAMU (192)', s: 'Emergência de saúde' },
];
/** resposta pronta quando há risco (não depende da IA estar no ar) */
export function respostaDeRisco(tipo) {
  if (tipo === 'autolesao') return 'Sinto muito que você esteja passando por isso. Você importa muito, e não precisa enfrentar sozinho(a). Liga agora para o CVV (188), é de graça e 24h. Se estiver em perigo, liga 192.';
  if (tipo === 'violencia') return 'O que você contou é sério, e a culpa não é sua. Você merece estar em segurança. Se estiver em perigo agora, liga 190. A Central da Mulher (180) ajuda 24h, de graça e em sigilo.';
  return '';
}
/** quando a IA está fora do ar: resposta curta e carinhosa, sem inventar nada sobre a pessoa */
export function respostaReserva(texto, semente = '') {
  const L = ['Sinto muito que esteja assim. Isso vai passar, e você é mais forte do que imagina 💛', 'Obrigado por me contar. Respira fundo: um dia de cada vez, combinado? 🌿', 'Entendo. Cuida do seu coração primeiro, você merece paz e carinho ✨'];
  return L[h32(`${semente}${texto}`) % L.length];
}
export const FECHO = 'Espero ter ajudado 💛';
