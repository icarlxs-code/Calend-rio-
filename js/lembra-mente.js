/* A "cabeça" do Lembra: lê os bilhetes (anotações do Pessoal e bilhetes do dia) e puxa assunto sobre eles,
   como alguém que se lembra do que você contou. Cada assunto vira uma pergunta com Sim/Não e cada resposta
   leva a algum lugar (um lembrete pronto, uma comemoração, um conselho). Tudo roda no aparelho: nada sai dele.
   Uma vez respondido, o assunto daquele bilhete não volta. */
import { store } from './store.js';
import { personal } from './personal.js';

const K = 'lembra.mente';
const mem = () => { try { return JSON.parse(localStorage.getItem(K) || '{}'); } catch { return {}; } };
export const respondido = (id) => !!mem()[id];
export function marca(id) { try { const m = mem(); m[id] = Date.now(); const ks = Object.keys(m); if (ks.length > 400) ks.slice(0, 100).forEach((k) => delete m[k]); localStorage.setItem(K, JSON.stringify(m)); } catch { /* ok */ } }

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const quando = (at) => {
  const d = new Date(at), hoje = new Date(); const n = Math.round((new Date(hoje.toDateString()) - new Date(d.toDateString())) / 864e5);
  return n <= 0 ? 'hoje' : n === 1 ? 'ontem' : n < 7 ? `${[0, 6].includes(d.getDay()) ? 'no' : 'na'} ${DIAS[d.getDay()]}` : `no dia ${d.getDate()}/${d.getMonth() + 1}`;
};
const corta = (s, n = 40) => { s = String(s || '').trim().replace(/[.!?]+$/, ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const genero = () => store.profile?.pronoun || 'n'; // f | m | n
const oa = (f, m, n) => ({ f, m }[genero()] || n);

/* regras: teste no texto → fala com ações. ctx: { id, texto, at, quando } */
const REGRAS = [
  { k: 'protecao', re: /(sem (camisinha|preservativo|prote[cç][aã]o))|(camisinha (estourou|rasgou))|(transei|rela[cç][aã]o) sem/i,
    fala: (c) => ({ t: `Psiu… vi que você anotou uma relação sem preservativo ${c.quando}. Tá ${oa('preocupada', 'preocupado', 'com receio')}? Quer anotar se ${genero() === 'm' ? 'ela estava' : 'estava'} no período fértil? 🤭`,
      m: 'desconfiado', roteiro: ['olhaLados', 'maoBoca'],
      acoes: [{ label: 'Sim, anotar', abrir: { title: `Período fértil? (relação ${c.quando})`, cat: 'saude' }, resposta: { t: 'Boa! Anotar ajuda a ficar tranquilo(a). Se bater dúvida, a pílula do dia seguinte funciona melhor até 72 h depois. 💛', m: 'amor' } },
        { label: 'Tô tranquil' + oa('a', 'o', 'e'), resposta: { t: 'Ufa! Mas se mudar de ideia, eu tô aqui… e não conto pra ninguém 🤐', m: 'desconfiado', gesto: 'cinico' } }] }) },
  { k: 'teste', re: /(teste de gravidez|menstrua[cç][aã]o (atrasada|atrasou)|beta ?hcg)/i,
    fala: (c) => ({ t: `Vi que você anotou sobre ${/teste/i.test(c.texto) ? 'teste de gravidez' : 'a menstruação atrasada'} ${c.quando}… já teve alguma novidade? 👀`, m: 'surpreso', roteiro: ['olhaLados', 'timido'],
      acoes: [{ label: 'Já sei', resposta: { t: 'Seja o que for, conta comigo pra organizar o que vier 💛', m: 'amor' } },
        { label: 'Ainda não', abrir: { title: 'Fazer o teste', cat: 'saude' }, resposta: { t: 'Marquei um lembrete pra você não ficar nessa ansiedade. Respira 🌿', m: 'feliz' } }] }) },
  { k: 'remedio', re: /(rem[eé]dio|antibi[oó]tico|comprimido|tomar (o|a) [a-zç]+ (de|das) \d)/i,
    fala: (c) => ({ t: `Lembro que você falou de remédio: “${corta(c.texto)}”. Já tomou hoje? 💊`, m: 'feliz', roteiro: ['pensa'],
      acoes: [{ label: 'Já tomei', resposta: { t: 'Isso! Saúde em dia é tudo 💪', m: 'comemora', gesto: 'pulo' } },
        { label: 'Ainda não', abrir: { title: 'Tomar o remédio', cat: 'saude' }, resposta: { t: 'Marquei pra você. Não me faz te cutucar de novo, hein 😤', m: 'bravo', gesto: 'nao' } }] }) },
  { k: 'medico', re: /(m[eé]dic[oa]|consulta|exame|dentista|psic[oó]log|ginecolog|dermato)/i,
    fala: (c) => ({ t: `Você anotou ${c.quando}: “${corta(c.texto)}”. Já marcou a consulta? 🩺`, m: 'acena', roteiro: ['pensa'],
      acoes: [{ label: 'Já marquei', resposta: { t: 'Olha só, responsa! Tô orgulhoso 🧡', m: 'amor' } },
        { label: 'Ainda não', abrir: { title: 'Marcar consulta', cat: 'saude' }, resposta: { t: 'Deixei um lembrete pronto. Saúde primeiro, o resto a gente encaixa 😉', m: 'feliz' } }] }) },
  { k: 'pagar', re: /(pagar|boleto|fatura|conta de (luz|[aá]gua|internet|telefone)|aluguel|pix pr[ao])/i,
    fala: (c) => ({ t: `Plim 🔔 você anotou “${corta(c.texto)}”. Já pagou? Juros não perdoam, hein 💸`, m: 'desconfiado', roteiro: ['olhaLados'],
      acoes: [{ label: 'Já paguei', resposta: { t: 'Conta paga, cabeça leve. Arrasou! 💰', m: 'danca' } },
        { label: 'Ainda não', abrir: { title: corta(c.texto, 60), cat: 'pagar' }, resposta: { t: 'Marquei pra hoje. Bora antes que o banco lembre por mim 😅', m: 'feliz' } }] }) },
  { k: 'triste', re: /(triste|chorei|chateado|chateada|ansios|ansiedade|deprimid|desanimad|cansad[oa] de|briguei|brigamos|terminamos|t[ôo] mal)/i,
    fala: (c) => ({ t: `Ei… ${c.quando} você escreveu que não tava legal. Já tá melhor? 🫂`, m: 'triste', roteiro: ['timido'],
      acoes: [{ label: 'Tô melhor', resposta: { t: 'Que bom! Fico feliz de verdade. Tô sempre por aqui 💛', m: 'amor', gesto: 'pulo' } },
        { label: 'Ainda não', abrir: { title: 'Fazer algo que me faz bem', cat: 'lembrete' }, resposta: { t: 'Tudo bem não estar bem. Que tal marcar algo só pra você hoje? Eu te lembro com carinho 🌿', m: 'amor' } }] }) },
  { k: 'evento', re: /(prova|entrevista|apresenta[cç][aã]o|reuni[aã]o importante|primeiro dia|vestibular|enem)/i,
    fala: (c) => ({ t: `E aí?! Como foi ${(/prova|entrevista|apresenta[cç][aã]o|vestibular|enem/i.exec(c.texto) || ['aquilo'])[0].toLowerCase().replace(/^(prova|entrevista|apresenta[cç][aã]o)$/, 'a $1')}? Conta tudo 👀`, m: 'surpreso', roteiro: ['balanca'],
      acoes: [{ label: 'Foi ótimo!', resposta: { t: 'EU SABIA! 🎉 Merece até comemoração!', m: 'danca', gesto: 'pulo' } },
        { label: 'Não foi bem', resposta: { t: 'Faz parte. Você tentou, e isso já é coragem. Próxima vai ser sua 💪', m: 'amor' } }] }) },
  { k: 'treino', re: /(academia|treinar|treino|correr|caminhada|dieta|regime|n[aã]o comer doce)/i,
    fala: (c) => ({ t: `Você disse ${c.quando}: “${corta(c.texto)}”. E aí, tá firme? 💪`, m: 'desconfiado', roteiro: ['olhaLados', 'cinico'],
      acoes: [{ label: 'Tô firme', resposta: { t: 'Monstro! Ninguém segura 🔥', m: 'comemora', gesto: 'pulo' } },
        { label: 'Escorreguei', resposta: { t: 'Hahaha eu sabia! 🤭 Relaxa, amanhã é outro dia. Quer que eu te lembre?', m: 'desconfiado', gesto: 'maoBoca' } }] }) },
  { k: 'onde', re: /(deixei|guardei|coloquei|escondi) (a |o |as |os |minha |meu )?[^,.]{2,40} (n[ao]s? |em |dentro|embaixo|atr[aá]s|em cima)/i,
    fala: (c) => ({ t: `Caso você esteja procurando… você anotou ${c.quando}: “${corta(c.texto, 60)}” 🔎`, m: 'desconfiado', roteiro: ['coca'], acoes: [{ label: 'Achei, valeu!', resposta: { t: 'De nada! Memória de sino nunca falha 🔔', m: 'desconfiado', gesto: 'cinico' } }] }) },
  { k: 'intencao', re: /\b(vou|preciso|tenho que|tenho de|n[aã]o posso esquecer de|lembrar de)\s+([a-zà-úç][^.,;!?\n]{3,45})/i,
    fala: (c, m) => { const o = corta(m[2], 45); return { t: `Lembro que você disse ${c.quando} que ${/^(vou)/i.test(m[1]) ? 'ia' : 'precisava'} ${o}. Já fez? 🤔`, m: 'desconfiado', roteiro: ['pensa'],
      acoes: [{ label: 'Já fiz', resposta: { t: 'Olha que orgulho! Riscado da minha cabeça também ✔️', m: 'comemora', gesto: 'pulo' } },
        { label: 'Ainda não', abrir: { title: o.charAt(0).toUpperCase() + o.slice(1), cat: 'lembrete' }, resposta: { t: 'Já deixei um lembrete pronto pra você. Agora não tem desculpa 😏', m: 'desconfiado', gesto: 'cinico' } }] }; } },
];

/* todos os bilhetes dos últimos 10 dias: anotações do Pessoal + bilhetes do dia (Trabalho) */
function bilhetes() {
  const lim = Date.now() - 10 * 864e5, out = [];
  try { (personal.memos || []).forEach((m) => { if ((m.at || 0) >= lim && m.text) out.push({ id: 'p' + m.id, texto: m.text, at: m.at }); }); } catch { /* ok */ }
  try { (store.state?.notes || []).forEach((n) => { if ((n.createdAt || 0) >= lim && n.text && (!n.author || n.author === store.me)) out.push({ id: 'n' + n.id, texto: n.text, at: n.createdAt }); }); } catch { /* ok */ }
  return out.sort((a, b) => b.at - a.at);
}

/* as falas que os bilhetes rendem agora (no máximo 3, das mais recentes) */
export function falasDosBilhetes() {
  const out = [];
  for (const b of bilhetes()) {
    for (const r of REGRAS) {
      const m = r.re.exec(b.texto); if (!m) continue;
      const id = `${b.id}:${r.k}`; if (respondido(id)) break;
      if (Date.now() - b.at < 20 * 60e3 && r.k === 'intencao') break; // acabou de escrever: dá um tempo antes de cobrar
      const f = r.fala({ ...b, quando: quando(b.at) }, m);
      out.push({ ...f, k: `bilhete:${r.k}`, memoId: id, u: r.k === 'protecao' || r.k === 'remedio' || r.k === 'triste' ? 2.2 : 1.6 });
      break; // uma regra por bilhete
    }
  }
  // o mais importante primeiro (saúde, remédio, sentimento), depois o mais recente
  return out.sort((a, b) => b.u - a.u).slice(0, 3);
}
