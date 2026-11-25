/* Receita da arte de uma frase: a mesma mensagem sempre dá a mesma arte; uma mensagem nova varia.
   Puro (sem tela): usado pelo app e pelos testes do servidor. */
export function hash(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
export const rng = (s) => () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* fundo por assunto: [de dia, à noite]; mais de um = variante escolhida pelo id */
export const FUNDO = {
  agua: [['17-agua', '31-agua-b'], ['18-agua-noite']], socializar: [['19-socializar'], ['20-socializar-noite']], contas: [['21-contas'], ['27-contas-noite']], remedio: [['08-saude-remedio'], ['22-remedio-noite']], saude: [['08-saude-remedio'], ['22-remedio-noite']],
  estudo: [['09-estudo'], ['23-estudo-noite']], trabalho: [['10-trabalho'], ['24-trabalho-noite']], refeicao: [['25-refeicao'], ['26-refeicao-noite']], calma: [['28-calma'], ['28-calma']], manha: [['01-manha', '29-manha-b'], ['01-manha', '29-manha-b']], ofensiva: [['30-ofensiva'], ['30-ofensiva']],
  noite: [['03-noite'], ['03-noite']], motivacao: [['05-motivacao'], ['14-motivacao-noite']], versiculo: [['04-fe-versiculo'], ['13-fe-noite']], palavra: [['28-calma'], ['03-noite']], aniversario: [['06-aniversario'], ['16-aniversario-noite']], viagem: [['07-viagem'], ['03-noite']], semana: [['11-conquista-semana'], ['11-conquista-semana']],
  lembrete: [['12-lembrete'], ['15-lembrete-noite']], geral: [['02-tarde'], ['15-lembrete-noite']],
};
const ESCUROS = new Set(['03-noite', '13-fe-noite', '14-motivacao-noite', '15-lembrete-noite', '16-aniversario-noite', '18-agua-noite', '20-socializar-noite', '22-remedio-noite', '23-estudo-noite', '24-trabalho-noite', '26-refeicao-noite', '27-contas-noite']);
/* espaço livre para a frase em cada fundo (medido nas imagens, em 1080 × 1920): largura e até onde desce */
const ZONA = {
  '01-manha': { fim: 900 }, '02-tarde': { fim: 860, larg: 800 }, '03-noite': { fim: 880 }, '04-fe-versiculo': { fim: 860 }, '05-motivacao': { fim: 700 }, '06-aniversario': { larg: 600, fim: 800 }, '07-viagem': { larg: 820, fim: 690 }, '08-saude-remedio': { fim: 820 }, '09-estudo': { fim: 800 }, '10-trabalho': { larg: 780, fim: 740 }, '11-conquista-semana': { fim: 560 }, '12-lembrete': { larg: 700, fim: 860 },
  '13-fe-noite': { fim: 600 }, '14-motivacao-noite': { fim: 620 }, '15-lembrete-noite': { fim: 620 }, '16-aniversario-noite': { larg: 600, fim: 820 }, '17-agua': { fim: 700 }, '18-agua-noite': { fim: 880 }, '19-socializar': { fim: 800 }, '20-socializar-noite': { fim: 860 }, '21-contas': { fim: 780 }, '22-remedio-noite': { fim: 880 }, '23-estudo-noite': { fim: 880 }, '24-trabalho-noite': { fim: 880 }, '25-refeicao': { fim: 840 }, '26-refeicao-noite': { fim: 880 }, '27-contas-noite': { fim: 760 }, '28-calma': { fim: 880 }, '29-manha-b': { larg: 820, fim: 860 }, '30-ofensiva': { larg: 800, fim: 820 }, '31-agua-b': { fim: 730 },
};
/* assunto → como o Lembra se veste */
export const ROUPA = { agua: 'agua', manha: 'manha', noite: 'sono', motivacao: 'forca', versiculo: 'fe', palavra: 'calma', aniversario: 'aniversario', socializar: 'amigos', remedio: 'agua', saude: 'saude', estudo: 'estudo', trabalho: 'trabalho', contas: 'dinheiro', refeicao: 'comida', ofensiva: 'conquista', semana: 'conquista', calma: 'calma', viagem: 'viagem', lembrete: 'manha', geral: 'forca' };
/* assunto achado no texto → categoria do fundo */
export const CAT_DO_TEMA = { agua: 'agua', fe: 'versiculo', sono: 'noite', manha: 'manha', comida: 'refeicao', dinheiro: 'contas', estudo: 'estudo', trabalho: 'trabalho', amigos: 'socializar', conquista: 'ofensiva', calma: 'calma', aniversario: 'aniversario', viagem: 'viagem', saude: 'saude', forca: 'motivacao' };
export const fonteDe = (n) => (n <= 40 ? 96 : n <= 70 ? 84 : n <= 110 ? 72 : n <= 160 ? 60 : 50);

/** a mesma entrada dá sempre a mesma receita */
export function receitaArte(msgId, cat, turno, texto) {
  const c = FUNDO[cat] ? cat : 'geral', noite = turno === 'noite', r = rng(hash(`${msgId}|${c}|${noite}`)), L = FUNDO[c][noite ? 1 : 0];
  const fundo = L[Math.floor(r() * L.length)], escuro = ESCUROS.has(fundo);
  return {
    v: 1, msgId, cat: c, noite, fundo, escuro,
    paleta: escuro ? { base: '#0A0A0A', texto: '#FFF6EE', eyebrow: '#FF8A3D', brilho: ['#FF8A3D', '#FFF6EE', '#FFC27A'] } : { base: '#FFF3E4', texto: '#201008', eyebrow: fundo === '05-motivacao' ? '#201008' : '#B93B08', brilho: ['#E85A0C', '#FFFFFF', '#F5A623'] },
    layout: ['centro', 'esquerda', 'centro-alto'][Math.floor(r() * 3)],
    fonte: fonteDe(String(texto).length), peso: 900, linhasMax: 5, zona: ZONA[fundo] || {},
    blob: { forma: Math.floor(r() * 2), girar: Math.round(r() * 30 - 15), escala: +(0.9 + r() * 0.25).toFixed(3), espelhar: r() < 0.5 },
    brilhos: { qtd: 6 + Math.floor(r() * 9), seed: hash(`${msgId}|b`) },
    roupa: ROUPA[c], y: 1350, largura: 620,
  };
}
