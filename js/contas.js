/* Contas de empréstimo e parcela feitas pelo app (nunca pela IA). Puro: sem tela e sem banco. */
const pad = (n) => String(n).padStart(2, '0');
const ultimo = (y, m) => new Date(y, m, 0).getDate();
const centavos = (v) => Math.round(Number(v) * 100);
export const reais = (v) => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })}`;
/** datas dos descontos a partir do dia seguinte a "inicio" (dia 29–31 cai no último dia do mês curto) */
export function parcelas({ saldo, valor, dias, inicio }) {
  const S = centavos(saldo), V = centavos(valor), D = [...new Set(dias.map(Number))].filter((d) => d >= 1 && d <= 31).sort((a, b) => a - b);
  if (!(S > 0) || !(V > 0) || !D.length || !/^\d{4}-\d{2}-\d{2}$/.test(inicio || '')) return null;
  const n = Math.ceil(S / V); if (n > 600) return null;
  const datas = []; let [y, m] = inicio.split('-').map(Number);
  while (datas.length < n) { for (const d of [...new Set(D.map((x) => Math.min(x, ultimo(y, m))))]) { const k = `${y}-${pad(m)}-${pad(d)}`; if (k > inicio && datas.length < n) datas.push(k); } if (++m > 12) { m = 1; y++; } }
  const resto = (S - V * (n - 1)) / 100;
  return { n, datas, ultima: datas[n - 1], porMes: (V * D.length) / 100, resto, inteiras: resto === V / 100 };
}
export const sobra = ({ renda, descontosPorMes }) => (renda ? (centavos(renda) - centavos(descontosPorMes)) / 100 : null);
const num = (t) => { if (!t) return 0; let s = t.replace(/[^\d.,k]/gi, ''); const mil = /k$/i.test(s); s = s.replace(/k/i, ''); if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.'); else s = s.replace(/[.,](?=\d{3}\b)/g, ''); return (parseFloat(s) || 0) * (mil ? 1000 : 1); };
const sem = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const VAL = '(?:r\\$\\s*)?(\\d[\\d.,]*k?)(?:\\s*reais)?';
/** entende a frase; null = não é conta (segue o caminho normal) */
export function entendeConta(frase, hoje) {
  const s = sem(frase); if (s.length > 400 || !/\b(emprestimo|parcela|desconta|descontam|descontad|prestac|financiamento|divida)\w*/.test(s)) return null;
  const dm = /\bdias? (\d{1,2}(?:(?:\s*,\s*|\s+e\s+(?:dia )?)\d{1,2})*)/.exec(s); if (!dm) return null;
  const dias = dm[1].match(/\d{1,2}/g).map(Number).filter((d) => d >= 1 && d <= 31), x = s.replace(dm[0], ' ');
  const saldo = num((new RegExp(`(?:falta\\w*|resta\\w*|devo|saldo(?: de)?|deve\\w*)\\s*(?:pagar\\s*)?(?:ainda\\s*)?${VAL}`).exec(x) || [])[1]);
  const valor = num((new RegExp(`(?:desconta\\w*|parcelas?(?: de)?|prestac\\w*(?: de)?|pago|tira\\w*|cai\\w*)\\s*(?:de\\s*)?${VAL}`).exec(x) || [])[1]);
  const renda = num((new RegExp(`(?:recebo|ganho|salario(?: de)?|renda(?: de)?)\\s*${VAL}`).exec(x) || [])[1]);
  if (!saldo || !valor || !dias.length) return null;
  const p = parcelas({ saldo, valor, dias, inicio: hoje }); if (!p) return null;
  return { saldo, valor, renda, dias, ...p, sobra: sobra({ renda, descontosPorMes: p.porMes }), nome: /financiamento/.test(s) ? 'financiamento' : /divida/.test(s) ? 'dívida' : 'empréstimo' };
}
const br = (k) => k.split('-').reverse().join('/');
/** resposta pronta: texto, fichas e as ações do cartão (lembretes com fim, e o dia da quitação) */
export function respostaConta(c) {
  const t = `Acaba em **${br(c.ultima)}**. São ${c.n} descontos, ${c.dias.length} por mês.${c.inteiras ? '' : ` O último é de **${reais(c.resto)}**.`}`;
  const chips = [`${reais(c.saldo)} ÷ ${reais(c.valor)} = ${c.n}`, `1º ${br(c.datas[0]).slice(0, 5)}`, ...(c.sobra !== null ? [`sobra ${reais(c.sobra)}/mês`] : [])];
  const acoes = c.dias.map((d) => { const L = c.datas.filter((k) => { const [y, m, dd] = k.split('-').map(Number); return dd === Math.min(d, ultimo(y, m)); }); if (!L.length) return null; return { acao: 'pessoal', titulo: `Desconto do ${c.nome}`, data: L[0], inicio: '09:00', categoria: 'pagar', repetir: 'monthly', dia_mes: d, ate: L[L.length - 1], descricao: reais(c.valor) }; }).filter(Boolean);
  return { texto: t, chips, acoes: [...acoes, { acao: 'pessoal', titulo: `${c.nome.charAt(0).toUpperCase()}${c.nome.slice(1)} quitad${c.nome === 'dívida' ? 'a' : 'o'}!`, data: c.ultima, inicio: '09:00', categoria: 'pagar' }] };
}
