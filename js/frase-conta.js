/* O jeito que a pessoa fala, virando compromisso: repetição ("todo dia 10"), valor ("R$ 480")
   e título limpo ("quero que você coloque na minha agenda que eu tenho que pagar o aluguel" → "Pagar o aluguel").
   Puro (sem tela, sem banco e sem rede): o parseQuick usa, e os testes conferem frase por frase.
   Trabalha sobre o texto com espaço no começo e no fim (" ... "), igual ao parseQuick. */

const pad = (n) => String(n).padStart(2, '0');
const ultimoDia = (y, m) => new Date(y, m, 0).getDate();
const DIAS_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

/* número escrito do jeito brasileiro: "1.200", "1.200,50", "230,5", "480", "2 mil", "1,5 mil" */
export function numeroBR(s) {
  let t = String(s || '').toLowerCase().replace(/r\$\s*/, '').trim();
  const mil = /\s*mil$/.test(t); t = t.replace(/\s*mil$/, '');
  if (/,\d{1,2}$/.test(t)) t = t.replace(/\./g, '').replace(',', '.');
  else t = t.replace(/[.,](?=\d{3}(\D|$))/g, '');
  const n = parseFloat(t);
  return Number.isFinite(n) ? Math.round(n * (mil ? 1000 : 1) * 100) / 100 : 0;
}
/** "R$ 1.234,50" (centavos só quando existem) */
export const reaisTxt = (v) => (Number(v) > 0 ? `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: Number.isInteger(Number(v)) ? 0 : 2, maximumFractionDigits: 2 })}` : '');

const NUM = String.raw`\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:,\d{1,2})?`;
const LIGA = String.raw`(?:\s(?:no valor de|com valor de|valor de|valor|de|por|custa|custando|que custa|=|:))?`;
const VALOR_RES = [
  new RegExp(String.raw`${LIGA}\sr\$\s?(${NUM})(\smil)?(?:\sreais)?(?=\s)`, 'i'),
  new RegExp(String.raw`${LIGA}\s(${NUM})(\smil)?\s(?:reais|real|conto|contos|pila)(?=\s)`, 'i'),
];
/** tira o valor do texto: { valor, texto } (valor 0 quando não tem) */
export function tiraValor(texto) {
  for (const re of VALOR_RES) {
    const m = re.exec(texto);
    if (!m) continue;
    const valor = numeroBR(`${m[1]}${m[2] ? ' mil' : ''}`);
    if (!(valor > 0) || valor > 10_000_000) continue;
    return { valor, texto: `${texto.slice(0, m.index)} ${texto.slice(m.index + m[0].length)}` };
  }
  return { valor: 0, texto };
}

/** a próxima data (hoje inclusive) que cai no dia N do mês; dia 29–31 vira o último dia dos meses menores */
export function proximoDiaDoMes(n, hoje) {
  let y = +hoje.slice(0, 4), m = +hoje.slice(5, 7);
  for (let i = 0; i < 14; i++) {
    const k = `${y}-${pad(m)}-${pad(Math.min(n, ultimoDia(y, m)))}`;
    if (k >= hoje) return k;
    if (++m > 12) { m = 1; y++; }
  }
  return null;
}
function proximoDiaDaSemana(w, hoje) {
  const d = new Date(+hoje.slice(0, 4), +hoje.slice(5, 7) - 1, +hoje.slice(8));
  while (d.getDay() !== w) d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const MES = 'm[eê]s';
const DIA_N = String.raw`(\d{1,2})(?:º|°)?`;
/* do mais específico para o mais geral; cada regra devolve a repetição e (quando tem) o dia */
const REGRAS = [
  // "todo mês no dia 25", "cada mês, dia 5"
  { re: new RegExp(String.raw`\s(?:todo|cada)\s${MES}\s(?:no\s|,\s)?dia\s${DIA_N}(?=\s)`, 'i'), rep: 'monthly', dia: 1 },
  // "todo dia 10", "todo dia 10 do mês", "todo dia 10 de cada mês"
  { re: new RegExp(String.raw`\s(?:todo|cada)\sdia\s${DIA_N}(?:\s(?:de|do)\s(?:todo\s|cada\s)?${MES})?(?=\s)`, 'i'), rep: 'monthly', dia: 1 },
  // "dia 10 de todo mês", "no dia 5 de cada mês", "dia 8 todo mês"
  { re: new RegExp(String.raw`\s(?:no\s|pro\s)?dia\s${DIA_N}\s(?:(?:de|do)\s)?(?:todo|cada)\s${MES}(?=\s)`, 'i'), rep: 'monthly', dia: 1 },
  // "toda segunda", "todas as sextas", "todo sábado"
  { re: /\s(?:toda|todo|todas as|todos os|cada)\s(domingo|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado)s?(?:-feiras?)?(?=\s)/i, rep: 'weekly', semana: 1 },
  // "todo mês", "mensal", "mensalmente" (o dia vem de "dia 10" ou de hoje)
  { re: new RegExp(String.raw`\s(?:tod[oa]s?\s(?:os\s)?${MES}(?:es)?|cada\s${MES}|mensal(?:mente)?)(?=\s)`, 'i'), rep: 'monthly' },
  { re: /\s(?:toda semana|todas as semanas|semanalmente)(?=\s)/i, rep: 'weekly' },
  { re: /\s(?:todo ano|todos os anos|anualmente)(?=\s)/i, rep: 'yearly' },
  // "todo dia" sem número depois (às 8h, de manhã…), "todos os dias", "diariamente"
  { re: /\s(?:todo dia|todos os dias|diariamente)(?=\s)(?!\s*\d{1,2}(?:º|°)?(?:\s|$))/i, rep: 'daily' },
];
/** tira a repetição do texto: { repeat, diaMes, date, texto } (repeat 'none' quando não tem) */
export function tiraRepeticao(texto, hoje) {
  for (const r of REGRAS) {
    const m = r.re.exec(texto);
    if (!m) continue;
    const resto = `${texto.slice(0, m.index)} ${texto.slice(m.index + m[0].length)}`;
    if (r.dia) {
      const n = +m[1];
      if (n < 1 || n > 31) continue;
      return { repeat: 'monthly', diaMes: n, date: proximoDiaDoMes(n, hoje), texto: resto };
    }
    if (r.semana) {
      const w = DIAS_SEMANA.indexOf(m[1].toLowerCase().replace('terca', 'terça').replace('sabado', 'sábado'));
      return { repeat: 'weekly', diaMes: 0, date: proximoDiaDaSemana(w, hoje), texto: resto };
    }
    return { repeat: r.rep, diaMes: 0, date: null, texto: resto };
  }
  return { repeat: 'none', diaMes: 0, date: null, texto };
}

/* contas que vencem todo mês: "dia 10" sozinho, nelas, quer dizer todo dia 10 */
const B = (x) => new RegExp(String.raw`(?<!\p{L})(?:${x})(?!\p{L})`, 'iu');
const FORTE = B(String.raw`aluguel|condom[ií]nio|mensalidade|fatura|financiamento|presta[cç][aã]o|parcela|pens[aã]o aliment[ií]cia|plano de sa[uú]de|conv[eê]nio`);
const CONTA = B(String.raw`internet|luz|energia|[aá]gua|g[aá]s|telefone|celular|cart[aã]o|escola|faculdade|curso|academia|seguro|netflix|spotify|streaming|tv a cabo|sky|diarista`);
const PAGA = B(String.raw`pag(?:ar|o|a|amento)|conta|vence|vencimento|boleto|d[eé]bito`);
const UMA_VEZ = B(String.raw`s[oó] (?:esse|este|nesse|neste) m[eê]s|s[oó] (?:essa|esta) vez|uma vez s[oó]|uma [uú]nica vez|desta vez|dessa vez|[uú]nica vez|n[aã]o repete|sem repetir`);
/** é conta que se repete todo mês? (aluguel, condomínio, fatura, ou "pagar internet/luz/cartão…") */
export const contaMensal = (frase) => !UMA_VEZ.test(frase) && (FORTE.test(frase) || (CONTA.test(frase) && PAGA.test(frase)));

/* ---------- título limpo ---------- */
const LUGAR = String.raw`(?:(?:n[ao]s?|pra|pro|para\s(?:a|o))\s(?:minha\s|meu\s)?(?:agenda|calend[aá]rio|lembretes?)\s)?`;
const PONHA = String.raw`(?:colo(?:ca|car|que)|mar(?:ca|car|que)|anot(?:a|ar|e)|bot(?:a|ar|e)|agend(?:a|ar|e)|lembr(?:a|ar|e)|adicion(?:a|ar|e)|salv(?:a|ar|e)|registr(?:a|ar|e)|cri(?:a|ar|e)|ponha|p[õo]e|p[ôo]r|guard(?:a|ar|e))`;
const CORTES = [
  /^(?:por favor|ent[aã]o|oi|ol[aá]|bom dia|boa tarde|boa noite|ei|ow|hey)[,!.]?\s+/i,
  new RegExp(String.raw`^(?:eu\s)?(?:quero|queria|gostaria|preciso)\s(?:que\s)?(?:voc[eê]\s|vc\s|tu\s)?${PONHA}\s(?:isso\s|a[ií]\s)?${LUGAR}(?:pra\smim\s)?(?:que\s|de\s|pra\s|para\s)?`, 'i'),
  new RegExp(String.raw`^(?:voc[eê]\s|vc\s)?(?:pode|poderia|consegue|da\spra|d[aá]\spara)\s${PONHA}\s(?:isso\s|a[ií]\s)?${LUGAR}(?:pra\smim\s)?(?:que\s|de\s|pra\s|para\s)?`, 'i'),
  /^(?:me\s)?(?:lembr(?:a|e|ar)(?:-me)?|avis(?:a|e|ar))(?:\sme)?\s(?:de\s|que\s|para\s|pra\s)?/i,
  /^n[aã]o\s(?:me\s)?deix(?:a|e|ar)\s(?:eu\s|me\s)?esquecer\s(?:de\s|que\s|do\s|da\s)?/i,
  new RegExp(String.raw`^${PONHA}\s(?:a[ií]\s)?${LUGAR}(?:pra\smim\s)?(?:que\s)?`, 'i'),
  new RegExp(String.raw`^${LUGAR.replace(/\)\?$/, ')')}(?:que\s)?`, 'i'),
  /^(?:eu\s)?(?:tenho|tem|vou\ster|preciso|precisa)\s(?:que|de)\s/i,
  /^(?:eu\s)?(?:preciso|vou)\s(?=\w+r\b)/i,
  /^(?:eu\s)?tenho\s(?:um\s|uma\s)?(?=\S)/i,
  /^eu\s/i,
];
const PRIMEIRA = { pago: 'pagar', levo: 'levar', busco: 'buscar', compro: 'comprar', renovo: 'renovar', faço: 'fazer', faco: 'fazer' };
/** tira o jeito de conversar e deixa só o que é: "Pagar o aluguel" */
export function limpaTitulo(t) {
  let s = String(t || '').replace(/\s+/g, ' ').trim();
  for (let i = 0; i < 6; i++) {
    const antes = s;
    for (const re of CORTES) s = s.replace(re, '');
    s = s.replace(/^(?:que|de|do|da|para|pra|pro|a[ií])\s/i, '');
    if (s === antes) break;
  }
  s = s.replace(/^(\p{L}+)/u, (w) => PRIMEIRA[w.toLowerCase()] || w);
  // "cartão vence" → "Pagar cartão"; "conta de luz que vence" → "Pagar conta de luz"
  const v = /^(.+?)\s(?:que\s)?(?:vence|venceu|vencimento)$/i.exec(s);
  if (v && !/^pag/i.test(v[1])) s = `pagar ${v[1]}`;
  for (let i = 0; i < 3; i++) s = s.replace(/[\s:,.;-]+$|\s(?:no|na|às|as|de|para|pra|pro|dia|em|que|e|todo|toda|com|valor|vence|vencimento)$/i, '').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
