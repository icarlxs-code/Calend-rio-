/* Conversa para guardar uma conta que se repete (aluguel, boleto, mensalidade…).
   O assistente pergunta uma coisa por vez, entende a resposta (inclusive "não sei", "muda o valor"),
   e só guarda quando a pessoa confirma. Puro (sem tela): os testes conferem. */
import { numeroBR } from './frase-conta.js';

const sem = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const CONTA = /\b(pagar|pago|paga|aluguel|alugue|boleto|fatura|conta de|contas|parcela|mensalidade|prestacao|condominio|iptu|financiamento|assinatura|cartao|luz|agua|internet|escola|faculdade|plano)\b/;
const NAO_SEI = /^(n[aã]o sei|nao lembro|tanto faz|qualquer|tanto|depois|nao tenho certeza|sei la|sei lá|pula|pular|pode ser)\b/;
const SIM = /^(sim|s|isso|isso mesmo|exato|exatamente|claro|com certeza|sempre|todo mes|todo mês|todo dia|e sempre|é sempre|e|ss|aham|uhum|pode|pode guardar|guarda|confirmo|ok|okay|beleza|tá certo|ta certo|certo|isso aí|bora)\b/;
const NAO = /^(nao|não|n|nunca|muda|varia|nao e|não é|nao é|nao sempre|não sempre|mudou|diferente|outro dia)\b/;
const CANCELA = /\b(cancela|deixa pra la|deixa pra lá|esquece|nao quero|não quero|desiste|para com isso)\b/;

const DIGITOS = { zero: 0, um: 1, uma: 1, dois: 2, duas: 2, tres: 3, três: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13, quatorze: 14, catorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60, setenta: 70, oitenta: 80, noventa: 90, cem: 100, cento: 100, duzentos: 200, trezentos: 300, quatrocentos: 400, quinhentos: 500, seiscentos: 600, setecentos: 700, oitocentos: 800, novecentos: 900 };

/** valor em reais a partir do que a pessoa escreveu: "1500", "R$ 1.500", "1,5 mil", "mil e quinhentos", "dois mil e duzentos"; 0 = não entendeu */
export function valorDe(texto) {
  // "dia 10", "10 de dezembro", "10/12" são datas, não valor
  const s = sem(texto).replace(/r\$\s*/g, '').replace(/\bdia\s*\d{1,2}\b/g, ' ').replace(/\b\d{1,2}\s*de\s*[a-z]+/g, ' ').replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g, ' ');
  const m = /(\d[\d.]*(,\d{1,2})?)\s*(mil)?/.exec(s);
  if (m && /\d/.test(m[1])) { const n = numeroBR(`${m[1]}${m[3] ? ' mil' : ''}`); if (n > 0) return n; }
  const pal = s.split(/\s+/);
  const mi = pal.indexOf('mil');
  if (mi >= 0) {
    const antes = mi > 0 ? (DIGITOS[pal[mi - 1]] || 1) : 1;
    let resto = 0; const dep = pal.slice(mi + 1).filter((w) => w !== 'e');
    for (const w of dep) { if (DIGITOS[w] !== undefined) resto += DIGITOS[w]; else break; }
    const v = antes * 1000 + resto;
    if (v > 0) return v;
  }
  return 0;
}
/** dia do mês (1–31) a partir de "dia 10", "todo dia 10", "10" ou "dia dez" */
export function diaDe(texto) {
  const s = sem(texto);
  const m = /(?:dia\s*)?(\d{1,2})(?:\s*(?:º|°|do mes|do mês))?\b/.exec(s);
  if (m) { const n = +m[1]; if (n >= 1 && n <= 31) return n; }
  for (const w of s.split(/\s+/)) { const n = DIGITOS[w]; if (n >= 1 && n <= 31) return n; }
  return 0;
}
const dest = (s) => /\b(nota|notas|anota|anotacao|anotação|bilhete|so anot|só anot)\b/.test(s) ? 'nota' : /\b(agenda|calendario|calendário|marca|marcar|agend)\w*/.test(s) ? 'agenda' : '';
const espaco = (s) => /\b(trabalho|empresa|profissional|work|escritorio|escritório)\b/.test(s) ? 'work' : /\b(pessoal|pessoa|casa|minha vida|particular)\b/.test(s) ? 'personal' : '';

/** é uma conta que se repete? (o assistente abre a conversa em vez de só perguntar "onde guardo") */
export function ehConta(x, texto) {
  if (!x || !x.texto) return false;
  const s = sem(texto || x.texto);
  return CONTA.test(s) && (x.repetir === 'monthly' || !!x.diaMes || /\btodo (dia|mes|mês)\b|\btodo mes\b|\bmensal/.test(s));
}

/** começa a conversa com o que já se sabe */
export function novaConta(x, texto) {
  const s = sem(texto || x.texto);
  const titulo = String(x.titulo || x.texto || 'Conta').replace(/^(pagar|pago|paga)\s+(meu|minha|o|a|os|as)?\s*/i, '').replace(/^(meu|minha)\s+/i, '') || 'Conta';
  return {
    tipo: 'conta', etapa: 'valor', titulo: titulo.charAt(0).toUpperCase() + titulo.slice(1),
    valor: Number(x.valor) || valorDe(texto) || null, diaMes: x.diaMes || diaDe(s) || null,
    destino: dest(s) || '', espaco: espaco(s) || (x.espaco === 'work' ? 'work' : ''), texto: x.texto, fim: false,
  };
}

const FALA = {
  valor: [
    (t) => `Boa! Quanto custa ${t.toLowerCase()}? Pode falar do jeito que for: 1500, R$ 1.500 ou mil e quinhentos. 💰`,
    (t) => `Anotei que você tem que pagar ${t.toLowerCase()}. Qual é o valor?`,
  ],
  valorNaoSei: ['Tudo bem, sem valor então. Depois você me conta. 🙂', 'Sem problema! Fica sem valor por enquanto.'],
  valorErro: ['Não peguei o valor. Pode escrever só o número, tipo 1500 ou 1.200,50? 🙂', 'Hmm, não entendi o valor. É só o número mesmo, tipo 980.'],
  dia: [
    (c) => `Anotado: ${c.valor ? `R$ ${c.valor.toLocaleString('pt-BR')}` : 'sem valor'}. Esse vencimento é sempre no dia ${c.diaMes}?`,
    (c) => `Certo! E é sempre no dia ${c.diaMes}, todo mês, ou varia?`,
  ],
  diaNovo: ['Entendi, então muda. Qual dia costuma vencer?', 'Sem problema. Em que dia do mês costuma cair?'],
  diaNaoSei: ['Tudo bem. Vou deixar sem dia fixo por enquanto.', 'Sem problema, deixo sem dia fixo.'],
  destino: [
    'Quer que eu coloque na sua agenda (aparece no dia e eu te aviso) ou só guardo como nota?',
    'Agora me diz: prefere na agenda, com aviso no dia, ou só anotado como nota?',
  ],
  espaco: [
    'Isso é do seu modo pessoal ou do trabalho?',
    'E esse compromisso é pessoal ou de trabalho?',
  ],
  confirma: (c) => `Então ficou assim: **${c.titulo}**${c.valor ? ` · R$ ${c.valor.toLocaleString('pt-BR')}` : ''}${c.diaMes ? ` · todo dia ${c.diaMes}` : ''} · ${c.destino === 'nota' ? 'como nota' : c.espaco === 'work' ? 'na agenda de trabalho' : 'na agenda pessoal'}. Posso guardar?`,
  cancela: ['Tudo bem, deixei isso pra lá. Nada foi guardado.', 'Certo, cancelei. Nada foi guardado.'],
  naoEntendi: ['Não entendi bem. Pode responder de novo?', 'Hmm, não peguei. Me diz de novo, por favor?'],
};
const pick = (L, seed = 0) => (typeof L === 'function' ? L : L[Math.abs(seed) % L.length]);
const seedDe = (c) => (c.valor || 0) + (c.diaMes || 0) * 7 + (c.titulo || '').length;

/** a próxima pergunta, ou o resumo para confirmar quando já está tudo */
export function proximo(c) {
  if (c.valor === null || c.valor === undefined) return { etapa: 'valor', fala: pick(FALA.valor, seedDe(c))(c.titulo) };
  if (c.diaMes === null || c.diaMes === undefined) return { etapa: 'diaNovo', fala: pick(FALA.diaNovo, seedDe(c)) };
  if (c.diaMes === 0) { /* sem dia fixo: segue */ }
  else if (!c.diaVisto) return { etapa: 'dia', fala: pick(FALA.dia, seedDe(c))(c) };
  if (!c.destino) return { etapa: 'destino', fala: pick(FALA.destino, seedDe(c)) };
  if (c.destino === 'agenda' && !c.espaco) return { etapa: 'espaco', fala: pick(FALA.espaco, seedDe(c)) };
  return { etapa: 'confirma', fala: FALA.confirma(c) };
}

/** entende a resposta da pessoa no passo atual (e também mudanças: "o valor é 1600", "é de trabalho") */
export function responde(c, texto) {
  const s = sem(texto).trim();
  const n = { ...c };
  if (CANCELA.test(s)) return { c: { ...n, fim: true, cancelada: true }, fala: pick(FALA.cancela, seedDe(c)), fim: true };
  // mudanças em qualquer passo
  const mudaValor = /\b(valor|preco|preço|custa|custo)\b/.test(s) && valorDe(texto) > 0;
  if (mudaValor) { n.valor = valorDe(texto); }
  const d = /\bdia\b/.test(s) ? diaDe(texto) : 0;
  if (d && c.etapa !== 'valor') { n.diaMes = d; }
  const de = dest(s); if (de && c.etapa !== 'espaco' && c.etapa !== 'valor') n.destino = de;
  const es = espaco(s); if (es && c.etapa !== 'valor') n.espaco = es;
  if (mudaValor || d || de || es) {
    if (c.etapa === 'confirma' || c.etapa === 'dia' || c.etapa === 'destino' || c.etapa === 'espaco') {
      const p = proximo(n);
      const trocou = c.etapa === 'confirma' && (n.valor !== c.valor || n.diaMes !== c.diaMes || n.destino !== c.destino || n.espaco !== c.espaco);
      return { c: { ...n, etapa: p.etapa }, fala: `${trocou ? 'Atualizado! ' : ''}${p.fala}`, fim: false };
    }
  }
  if (c.etapa === 'valor') {
    if (NAO_SEI.test(s)) { n.valor = 0; const p = proximo(n); return { c: { ...n, etapa: p.etapa }, fala: `${pick(FALA.valorNaoSei, seedDe(c))} ${p.fala}` }; }
    const v = valorDe(texto);
    if (!v) return { c, fala: pick(FALA.valorErro, seedDe(c)) };
    n.valor = v; const p = proximo(n);
    return { c: { ...n, etapa: p.etapa }, fala: `Anotado: R$ ${v.toLocaleString('pt-BR')}. ${p.fala}` };
  }
  if (c.etapa === 'dia') {
    if (SIM.test(s) && !NAO.test(s)) { const p = proximo({ ...n, diaVisto: true }); return { c: { ...n, diaVisto: true, etapa: p.etapa }, fala: p.fala }; }
    if (NAO.test(s)) return { c: { ...n, etapa: 'diaNovo', diaMes: null }, fala: pick(FALA.diaNovo, seedDe(c)) };
    if (NAO_SEI.test(s)) { n.diaMes = 0; const p = proximo({ ...n, diaVisto: true }); return { c: { ...n, diaVisto: true, etapa: p.etapa }, fala: `${pick(FALA.diaNaoSei, seedDe(c))} ${p.fala}` }; }
    if (d) { n.diaMes = d; const p = proximo({ ...n, diaVisto: true }); return { c: { ...n, diaVisto: true, etapa: p.etapa }, fala: p.fala }; }
    return { c, fala: pick(FALA.naoEntendi, seedDe(c)) + ' É sempre no mesmo dia do mês? (sim ou não)' };
  }
  if (c.etapa === 'diaNovo') {
    const dd = diaDe(texto);
    if (!dd) { if (NAO_SEI.test(s)) { n.diaMes = 0; const p = proximo({ ...n, diaVisto: true }); return { c: { ...n, diaVisto: true, etapa: p.etapa }, fala: `${pick(FALA.diaNaoSei, seedDe(c))} ${p.fala}` }; } return { c, fala: pick(FALA.naoEntendi, seedDe(c)) + ' Qual dia do mês? (1 a 31)' }; }
    n.diaMes = dd; const p = proximo({ ...n, diaVisto: true });
    return { c: { ...n, diaVisto: true, etapa: p.etapa }, fala: `Anotado, dia ${dd}. ${p.fala}` };
  }
  if (c.etapa === 'destino') {
    if (!de) { if (NAO_SEI.test(s)) { n.destino = 'agenda'; const p = proximo(n); return { c: { ...n, etapa: p.etapa }, fala: `Vou de agenda então. ${p.fala}` }; } return { c, fala: pick(FALA.naoEntendi, seedDe(c)) + ' Agenda ou nota?' }; }
    n.destino = de; const p = proximo(n);
    return { c: { ...n, etapa: p.etapa }, fala: p.fala };
  }
  if (c.etapa === 'espaco') {
    if (!es) { if (NAO_SEI.test(s)) { n.espaco = 'personal'; const p = proximo(n); return { c: { ...n, etapa: p.etapa }, fala: `Vou de pessoal então. ${p.fala}` }; } return { c, fala: pick(FALA.naoEntendi, seedDe(c)) + ' Pessoal ou trabalho?' }; }
    n.espaco = es; const p = proximo(n);
    return { c: { ...n, etapa: p.etapa }, fala: p.fala };
  }
  if (c.etapa === 'confirma') {
    if (SIM.test(s) && !NAO.test(s)) return { c: { ...n, fim: true, confirmada: true }, fala: 'Pronto, guardado! Eu te aviso antes de vencer. ✅', fim: true, salvar: true };
    if (NAO.test(s)) return { c, fala: 'O que você quer mudar? Pode falar o valor, o dia ou se é agenda ou nota.' };
    return { c, fala: pick(FALA.naoEntendi, seedDe(c)) + ' Posso guardar? (sim ou não)' };
  }
  return { c, fala: pick(FALA.naoEntendi, seedDe(c)) };
}
