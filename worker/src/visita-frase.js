/* Aviso de visita no perfil: a cada visita a pessoa recebe uma frase diferente, que fica mais forte
   quando o mesmo visitante volta no mesmo dia. Nunca a mesma frase duas vezes seguidas. Puro: os testes conferem. */
const PRIMEIRA = [
  ['👀 Tem alguém com saudade de você', 'Será que tá com saudade? Toque e descubra quem é.'],
  ['💭 Alguém pensou em você agora', 'Acabou de abrir o seu perfil. Quer saber quem foi?'],
  ['✨ Seu perfil recebeu uma visita', 'Alguém veio te ver agora mesmo. Curioso(a)?'],
  ['🤭 Tem gente bisbilhotando', 'Alguém está espiando o seu perfil. Toque pra ver quem é.'],
  ['💌 Você foi lembrado(a) agora', 'Alguém abriu o seu perfil. Será que sentiu sua falta?'],
  ['🔎 Alguém tá te procurando', 'Uma pessoa acabou de entrar no seu perfil. Quem será?'],
  ['🌟 Você chamou atenção', 'Alguém parou tudo pra olhar o seu perfil. Descubra quem.'],
];
const SEGUNDA = [
  ['👀 {n} voltou no seu perfil', 'Já é a 2ª vez hoje. O que será que {ela} tanto procura?'],
  ['🤔 De novo {n} por aqui', '{N} entrou no seu perfil outra vez. Saudade, será?'],
  ['💭 {n} não esquece de você', 'Segunda visita no seu perfil hoje. Isso quer dizer alguma coisa…'],
  ['😏 Olha {n} aí de novo', 'Voltou pra ver o seu perfil. Tem coisa aí!'],
];
const MUITAS = [
  ['😳 Não é possível!', 'De novo {n} entrou no seu perfil. Já são {x} vezes hoje. O que será que tá acontecendo?'],
  ['🔥 {n} não para de olhar seu perfil', '{x} visitas só hoje. Alguém tá pensando muito em você…'],
  ['🚨 Alerta de saudade', '{n} abriu o seu perfil pela {x}ª vez hoje. Vai deixar sem resposta?'],
  ['💘 {n} de novo?!', 'Já são {x} vezes hoje. O que será que {ela} tanto procura no seu perfil?'],
  ['👀👀 Tá ficando sério', '{n} visitou o seu perfil {x} vezes hoje. Você é importante pra alguém!'],
  ['🫣 Mais uma vez {n}', 'Visita número {x} de hoje. Que tal mandar um oi?'],
];
const h32 = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
/** { title, body, idx } — `hoje` = quantas vezes esse visitante entrou hoje (já contando esta); `ultima` = índice da última frase usada para o visitado */
export function fraseVisita({ nome = '', hoje = 1, ultima = -1, semente = '' } = {}) {
  const L = hoje <= 1 ? PRIMEIRA : hoje === 2 ? SEGUNDA : MUITAS;
  const base = hoje <= 1 ? 0 : hoje === 2 ? 100 : 200;
  let i = h32(`${semente}:${hoje}`) % L.length;
  if (base + i === ultima) i = (i + 1) % L.length;
  const pn = String(nome || 'Alguém').trim().split(/\s+/)[0] || 'Alguém';
  const f = (t) => t.replace(/\{n\}/g, pn).replace(/\{N\}/g, pn).replace(/\{x\}/g, String(hoje)).replace(/\{ela\}/g, 'essa pessoa');
  return { title: f(L[i][0]), body: f(L[i][1]), idx: base + i };
}
