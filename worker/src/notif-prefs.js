/* Preferências de notificação escolhidas pela própria pessoa.
   Ela liga/desliga cada tipo e escolhe quanto quer receber (pouco, normal, muito).
   O servidor respeita isso em todo envio e aprende com a média: se um tipo quase nunca é aberto,
   ele recebe menos sozinho (e volta ao normal quando a pessoa começa a abrir). */

export const CATS = [
  { id: 'agua', label: 'Lembrete de água', soft: true },
  { id: 'motivacao', label: 'Frases motivacionais', soft: true },
  { id: 'dica', label: 'Dicas e coach do dia', soft: true },
  { id: 'story', label: 'Stories dos amigos e stories para postar', soft: true },
  { id: 'amigos', label: 'Pedidos e avisos de amigos', soft: true },
  { id: 'visita', label: 'Quem visitou seu perfil', soft: true },
  { id: 'ranking', label: 'Ranking e conquistas', soft: true },
];
export const FREQ = { pouco: 3, normal: 6, muito: 10 };
const IDS = CATS.map((c) => c.id);

/** o que a pessoa escolheu, limpo; sem escolha = tudo ligado, nível normal */
export function limpaNp(x) {
  const o = x && typeof x === 'object' ? x : {};
  const cats = {};
  for (const id of IDS) cats[id] = o.cats && o.cats[id] === false ? false : true;
  const freq = Object.keys(FREQ).includes(o.freq) ? o.freq : 'normal';
  const v = o.v === 1 ? 1 : 0; // 1 = a pessoa já respondeu a tela
  return { v, cats, freq };
}

/** a pessoa quer este tipo? (compromissos e atualização não passam por aqui) */
export function quer(np, cat) {
  const p = limpaNp(np);
  return p.cats[cat] !== false;
}

/** quantas mensagens desse grupo por dia: o nível escolhido, reduzido se a média mostra que não são abertas */
export function limiteDia(np, cat, media = {}) {
  const p = limpaNp(np);
  let max = FREQ[p.freq];
  const m = media[cat];
  if (m && m.env >= 12 && m.ab / m.env < 0.05) max = Math.max(1, Math.floor(max / 2)); // quase nunca abre: metade
  return max;
}

/** registra um envio e, quando a pessoa abre o aviso, a abertura; a média fica por semana */
export function somaEnvio(media, cat, abriu = false) {
  const M = { ...(media || {}) };
  const m = M[cat] || { env: 0, ab: 0 };
  M[cat] = abriu ? { ...m, ab: m.ab + 1 } : { ...m, env: m.env + 1 };
  return M;
}

/** a "média" de cada tipo: quanto a pessoa abre (0 a 1) — usada para o aprendizado */
export function taxa(media, cat) {
  const m = (media || {})[cat];
  return m && m.env ? Math.round((m.ab / m.env) * 100) / 100 : null;
}
