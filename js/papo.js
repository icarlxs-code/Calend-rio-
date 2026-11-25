/* O papo do Lembra: monta as falas com a profissão, a hora, a agenda, os lembretes, as notas e as listas da pessoa.
   Ele pergunta e já responde ("Como foi o trabalho? Espero que tudo certo!"). Tudo no aparelho: nada sai daqui.
   Nunca repete o que disse nas últimas 400 falas, e não faz piada com assunto sério. */
import { PROFISSOES, QUALQUER, PALAVRAS, SERIO } from './papo-dados.js';
import { humorOn } from './humor.js';

export const serio = (s) => SERIO.test(String(s || ''));
export const limpa = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const K = 'lembra.papo', MAX = 400;
const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };
let ditas = null;
const lidas = () => { if (!ditas) { try { ditas = JSON.parse(localStorage.getItem(K) || '[]'); } catch { ditas = []; } } return ditas; };
export function anota(t) { const d = lidas(); d.push(hash(t)); while (d.length > MAX) d.shift(); try { localStorage.setItem(K, JSON.stringify(d)); } catch { /* ok */ } }
const jaDisse = (t) => lidas().includes(hash(t));
const um = (a) => a[Math.floor(Math.random() * a.length)];
const maius = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const cita = (s) => { const x = String(s || '').trim(); return `“${x.slice(0, 34)}${x.length > 34 ? '…' : ''}”`; };

export const profissaoDe = (p) => { const t = limpa(p).trim(); return t ? PROFISSOES.find((x) => x.re.test(t)) || QUALQUER : null; };

/* ---------- moldes (cada {x} vira uma peça) ---------- */
const RISO = ['Hehe!', 'Hihihi, brincadeira!', 'Ha! Eu sabia 😏', 'Nem precisa responder, já sei 😄', 'Pela sua cara, sim 🤭', 'Tô rindo aqui, mas é com carinho.', 'Se não, ainda dá tempo!', 'Confessa, vai 👀'];
const JA = ['Já {d} hoje?', 'Me conta: já {d} hoje?', 'Deixa eu adivinhar: você já {d} hoje, né?', 'Aposto que você já {d} hoje.', 'Psiu… já {d} hoje?', 'Hoje você já {d} ou tá guardando pra depois?'];
const COM = ['Correria com {q}, né?', 'E {q}, deram trabalho hoje?', 'Como foi lidar com {q} hoje?', 'Tudo em paz com {q}?', 'Muito movimento com {q}?', '{Q} se comportando por aí?'];
const CERTO = ['Espero que tudo certo!', 'Tomara que leve, você merece.', 'Se apertar, respira: eu seguro a agenda.', 'Tenho certeza de que você deu conta.', 'Você tira de letra, eu vejo daqui.', 'Se deu ruim, amanhã a gente vira o jogo.', 'Já já passa, e o dia rende.', 'Com você no comando, tô tranquilo.', 'Qualquer coisa, me dá um toque 🔔', 'Orgulho de você, de verdade 🧡'];
const FOI = {
  manha: ['Pronto pra {w}? Vai dar tudo certo!', 'Bora pra {w}? Hoje é dia bom, eu sinto no badalo 🔔', 'Que Deus abençoe {w} de hoje 🙏', 'Já pensou em {w} de hoje? Começa pelo mais chato e o resto voa.', 'Bom dia! {W} que lute, porque você acordou bem ☀️', 'Café primeiro, {w} depois. Ordem do sino ☕'],
  tarde: ['Como tá {w} hoje? Espero que tranquilo!', 'Metade do dia foi! {W} tá rendendo, aposto.', 'E {w}, tá puxado? Toma uma água e volta com tudo 💧', 'Segura firme que {w} de hoje já tá quase.', 'Pausa de um minuto: {w} não foge. Eu conferi 😄', 'Tarde boa pra {w} fluir, hein?'],
  noite: ['Como foi {w} hoje? Espero que tudo certo!', 'Acabou {w} por hoje? Se sim, descansa. Se não, força!', 'E aí, {w} foi leve? Tomara! Agora é você em primeiro lugar.', 'Sobreviveu a mais um dia com {w}! Medalha de sino dourado 🏅', 'Larga {w} um pouquinho e conta: jantou direitinho? Espero que sim!', 'Dia fechado? Amanhã {w} continua, hoje você descansa 🌙'],
  folga: ['Fim de semana! Tá de folga ou {w} chamou? Se chamou, força!', 'Hoje é dia de esquecer {w}. Pode deixar que eu lembro 😄', 'Descansando de {w}? Merecido demais!', 'Se hoje tiver {w}, que seja rapidinho. Se não, aproveita!'],
};
const COISA = ['E {t}, tá aí por perto? Nunca se sabe!', 'Sonhei com {t} essa noite. Acho que tô convivendo demais com você 😄', 'Se {t} falasse, ia pedir férias, né?', '{T} sumiu de novo? Anota comigo onde deixou.', 'Quem manda mais aí: você ou {t}? Você, claro!', 'Você e {t}: uma história de amor.'];
const DIA = ['Como tá seu dia{n}?', 'E aí{n}, tudo bem?', 'Tá tudo em ordem por aí{n}?', 'Me conta{n}: o dia tá bom?', 'Passei pra saber de você{n}. Tudo certo?', 'Dormiu bem{n}?', 'Já comeu direitinho{n}?', 'Tomou água hoje{n}?', 'Sorriu hoje{n}?', 'Tá de bom humor{n}?', 'Respirou fundo hoje{n}?', 'Tá precisando de mim{n}?'];
const DIAR = ['Espero que sim! Se não, a gente ajeita.', 'Aposto que sim, tá na sua cara 😄', 'Se não, dá tempo agora mesmo.', 'Eu torço daqui, quietinho no canto.', 'Diz que sim, vai! 🧡', 'Vou considerar que sim e ficar feliz.', 'Se a resposta for não, me dá um toque.', 'Pergunta de sino curioso 🔔', 'Tô anotando como sim, hein.', 'Cuida de você primeiro, o resto eu lembro.'];
const DOSDIAS = [
  ['Domingo pede preguiça com moderação. A minha já tá ligada 😌', 'Domingo é dia de não ter pressa. Só de ter sobremesa 🍨'], ['Segunda chegou, mas eu cheguei primeiro 😄', 'Segunda-feira é só um domingo que criou coragem.'], ['Terça: a segunda já perdoou todo mundo.', 'Terça é o dia que ninguém lembra. Menos eu, claro.'],
  ['Quarta! Tá no topo do morro, agora é descida ⛰️', 'Quarta é o recheio da semana.'], ['Quinta: quase sexta, com gostinho de véspera.', 'Quinta-feira é sexta com timidez.'], ['Sextou! Mas termina o que falta primeiro, hein 🎉', 'Sexta: o dia que até o boleto sorri.'], ['Sábado! Agenda leve, risada pesada 😄', 'Sábado é pra badalar. Entendeu? Sino… badalar… 🔔'],
];
/* com o que a pessoa marcou: {x} é o título */
const DO = {
  vem: ['{x} hoje, hein? Vai dar tudo certo!', 'Tô de olho em {x}. Você só vai e arrasa.', 'Friozinho na barriga com {x}? Normal, você dá conta.', '{x} tá chegando. Já respirou fundo? Espero que sim!', 'Hoje tem {x}. Eu cuido da hora, você cuida do show.', 'Tudo pronto pra {x}? Você nasceu pra isso!', '{x} que se prepare pra você.'],
  amanha: ['Amanhã tem {x}. Dorme em paz que eu não durmo 😄', 'Já deixou tudo separado pra {x} amanhã? Se não, dá tempo!', '{x} é só amanhã. Hoje é descanso.', 'Amanhã {x} te espera, e eu te acordo pra isso.'],
  foi: ['E {x}, como foi? Espero que tudo certo!', 'Deu bom em {x}? Aposto que sim!', 'Vi que {x} já foi. Orgulho de você 🧡', '{x} riscado! Que alívio, né?', 'Depois de {x}, você merece um agrado.'],
  nota: ['Lembrei do que você anotou: {x}. Tô guardando direitinho.', 'Você escreveu {x}. Ainda tá valendo? Eu acho que sim!', 'Essa nota {x}… boa memória a sua. Digo, a minha 😄', 'Passei pela sua nota {x} e sorri.', '{x}: anotado, guardado e vigiado 👀'],
  lista: ['A lista {l} tem {x} esperando. Vai hoje? Eu torço que sim!', 'Na lista {l}, {x} tá quietinho pedindo atenção.', 'Não esquece {x} da lista {l}, hein. Eu não esqueci.', '{x} tá com saudade de ser riscado da lista {l}.'],
};
const troca = (s, o) => s.replace(/\{(\w)\}/g, (_, k) => { const b = o[k.toLowerCase()] ?? ''; return k === k.toUpperCase() ? maius(b) : b; });
/* "pra o" vira "pro", "a o"… o básico para não soar robô */
const acerta = (s) => s.replace(/\bpra o\b/g, 'pro').replace(/\bpra os\b/g, 'pros').replace(/\bpra a\b/g, 'pra').replace(/\bpra as\b/g, 'pras').replace(/\bem o\b/g, 'no').replace(/\bem a\b/g, 'na').replace(/\bem os\b/g, 'nos').replace(/\bem as\b/g, 'nas').replace(/\bde o\b/g, 'do').replace(/\bde a\b/g, 'da').replace(/\bde os\b/g, 'dos').replace(/\bde as\b/g, 'das').replace(/\bPronto pra/, 'Tudo pronto pra').replace(/ +/g, ' ').trim();
const PESSOA = (s, pr) => (pr === 'f' ? s : s.replace('doutora', pr === 'm' ? 'doutor' : 'licença'));

const pega = (faz) => { let t = ''; for (let k = 0; k < 14; k++) { t = faz(); if (t && !jaDisse(t)) return t; } return t; };
const periodo = (h, dow) => ((dow === 0 || dow === 6) && Math.random() < 0.6 ? 'folga' : h >= 5 && h < 12 ? 'manha' : h >= 12 && h < 18 ? 'tarde' : 'noite');
const sing = (w) => !/^(os|as) /.test(w);

/* ---------- geradores ---------- */
export function daProfissao({ prof, h = 12, dow = 3, pron = 'n', humor = humorOn() } = {}) {
  const p = profissaoDe(prof) || QUALQUER;
  return pega(() => {
    const r = Math.random(), tipo = !humor ? (r < 0.5 ? 'com' : 'foi') : r < 0.34 ? 'ja' : r < 0.52 ? 'com' : r < 0.7 ? 'foi' : r < 0.82 ? 'coisa' : 'z';
    let s = '';
    if (tipo === 'ja') s = `${troca(um(JA), { d: um(p.d) })} ${um(RISO)}`;
    else if (tipo === 'com') { const q = um(p.q), plural = /^(os|as) /.test(q); let c = um(COM); if (!plural) c = c.replace('deram', 'deu'); s = `${troca(c, { q })} ${um(CERTO)}`; }
    else if (tipo === 'foi') { s = troca(um(FOI[periodo(h, dow)]), { w: p.w }); if (!sing(p.w)) s = s.replace(/\btá rendendo/, 'tão rendendo').replace(/Como tá/, 'Como tão').replace(/, tá puxado/, ', tão puxando').replace(/foi leve/, 'foram leves').replace(/não foge/, 'não fogem').replace(/ que lute/, ' que lutem').replace(/continua,/, 'continuam,').replace(/já tá quase/, 'já tão quase').replace(/ fluir/, ' fluírem').replace(/Como foi /, 'Como foram ').replace(/Acabou /, 'Acabaram ').replace(/ chamou\? Se chamou/, ' chamaram? Se chamaram').replace('tranquilo!', 'tudo tranquilo!'); } else if (tipo === 'coisa') s = troca(um(COISA), { t: um(p.t) });
    else s = um(p.z);
    return PESSOA(acerta(s), pron);
  });
}
/* trocadilho com a palavra do que a pessoa escreveu */
export function trocadilho(texto) {
  if (!humorOn() || SERIO.test(texto || '')) return '';
  const t = String(texto || '').toLowerCase(), L = PALAVRAS.filter(([re]) => re.test(t)).flatMap(([, f]) => f);
  return L.length ? pega(() => um(L)) : '';
}
/* itens: { tipo: vem|amanha|foi|nota|lista, x, l }. Assunto sério nunca entra */
export function doQueMarcou(itens) {
  const bons = (itens || []).filter((i) => i.x && !SERIO.test(i.x) && !SERIO.test(i.l || '') && !/senha|cpf|cart[aã]o|\d{6,}/i.test(i.x));
  if (!bons.length) return null;
  let item = null;
  const t = pega(() => { item = um(bons); const j = Math.random() < 0.6 ? trocadilho(item.x) : ''; const base = acerta(troca(um(DO[item.tipo]), { x: cita(item.x), l: cita(item.l) })); return j ? `${cita(item.x)}: ${j.charAt(0).toLowerCase() === j.charAt(0) ? j : j}` : base; });
  return t ? { t, item } : null;
}
export function doDia({ nome = '', dow = 3 } = {}) {
  return pega(() => (humorOn() && Math.random() < 0.18 ? um(DOSDIAS[dow]) : `${troca(um(DIA), { n: nome && Math.random() < 0.6 ? `, ${nome}` : '' })} ${um(DIAR)}`));
}
/* quantas falas diferentes existem (usado no teste) */
export function total() {
  const por = PROFISSOES.map((p) => JA.length * p.d.length * RISO.length + COM.length * p.q.length * CERTO.length + Object.values(FOI).flat().length + COISA.length * p.t.length + p.z.length);
  return { profissoes: PROFISSOES.length, menor: Math.min(...por), soma: por.reduce((a, b) => a + b, 0), dia: DIA.length * DIAR.length * 2 + 14, trocadilhos: PALAVRAS.flatMap((x) => x[1]).length, moldes: Object.values(DO).flat().length };
}
const RI = /Hehe|Hihi|😄|🤭|😏|Ha!/;
export const gestoDe = (t) => (RI.test(t) ? 'riso' : /🙏|🧡/.test(t) ? 'timido' : /\?/.test(t) ? 'sobrancelha' : 'sim');
export const humorDe = (t) => (/🧡|🙏/.test(t) ? 'amor' : /👀|😏/.test(t) ? 'desconfiado' : 'feliz');
