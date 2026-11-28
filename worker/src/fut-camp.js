/* De que campeonato é o jogo, venha da API-Futebol ou da ESPN, e se a pessoa quer avisos dele.
   A pessoa escolhe "todos" (padrão) ou só alguns: brasileirao, serieb, seriec, copadobrasil, libertadores, sulamericana, estadual. */
export const CAMPS = [
  ['brasileirao', 'Brasileirão'], ['serieb', 'Série B'], ['seriec', 'Série C'], ['copadobrasil', 'Copa do Brasil'],
  ['libertadores', 'Libertadores'], ['sulamericana', 'Sul-Americana'], ['estadual', 'Estaduais'],
];
const IDS = CAMPS.map(([k]) => k);
const LIGA = { 'bra.1': 'brasileirao', 'bra.2': 'serieb', 'bra.3': 'seriec', 'bra.copa_do_brazil': 'copadobrasil', 'conmebol.libertadores': 'libertadores', 'conmebol.sudamericana': 'sulamericana' };
const sem = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
/** 'brasileirao' | 'serieb' | … | 'estadual' | 'outro' */
export function campDe(j = {}) {
  if (LIGA[j.liga]) return LIGA[j.liga];
  const n = sem(`${j.camp || ''} ${j.comp || ''}`);
  if (/libertadores/.test(n)) return 'libertadores';
  if (/sul-?americana|sudamericana/.test(n)) return 'sulamericana';
  if (/copa do brasil/.test(n)) return 'copadobrasil';
  if (/serie b\b|brasileiro.*serie b|serie-b/.test(n)) return 'serieb';
  if (/serie c\b|serie-c/.test(n)) return 'seriec';
  if (/brasileir|serie a\b/.test(n)) return 'brasileirao';
  if (/paulista|carioca|mineiro|gaucho|paranaense|baiano|pernambucano|cearense|goiano|catarinense|estadual|paraense|potiguar|paraibano|alagoano|sergipano|capixaba|amazonense|maranhense|piauiense|candango|mato-grossense|sul-mato/.test(n)) return 'estadual';
  return 'outro';
}
/** limpa a escolha que veio do app: [] = todos */
export const limpaCamps = (L) => [...new Set((Array.isArray(L) ? L : []).filter((x) => IDS.includes(x)))];
/** a pessoa quer avisos deste jogo? (sem escolha = todos; "outro" só vai para quem quer todos) */
export const quer = (camps, j) => { const L = limpaCamps(camps); return !L.length || L.includes(campDe(j)); };
