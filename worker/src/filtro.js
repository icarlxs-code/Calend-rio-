/* Conteúdo que nunca sai num aviso, venha do banco ou da IA: palavrão, política, aposta e conteúdo adulto. */
const L = [
  // palavrões
  'porra', 'caralh\\w*', 'merda\\w*', 'bost(a|inha|ao)s?', 'put(a|o|aria|eiro)s?', 'fod(a|e|er|eu|ase|ido|ida)s?', 'foda-se', 'cu', 'cuz(ao|inho)', 'buceta\\w*', 'xoxota', 'piroca', 'pau no', 'arrombad\\w*', 'viad\\w*', 'bicha', 'desgrac\\w*', 'vagabund\\w*', 'otari\\w*', 'babaca\\w*', 'imbecil', 'idiota\\w*', 'retardad\\w*', 'fdp', 'vsf', 'pqp', 'krl',
  // política
  'bolsonar\\w*', 'lulis\\w*', 'lula', 'petista\\w*', 'petralh\\w*', 'comunist\\w*', 'fascist\\w*', 'nazis\\w*', 'eleic\\w*', 'eleitor\\w*', 'candidat[oa]s?', 'deputad\\w*', 'senador\\w*', 'vereador\\w*', 'partido politico', 'impeachment', 'direita e esquerda', 'esquerdist\\w*', 'direitist\\w*', 'ditadura',
  // aposta
  'apost[ae]s?', 'apostar', 'cassino\\w*', 'bet', 'bets', 'tigrinho', 'loteria\\w*', 'mega-?sena', 'jogo do bicho', 'roleta', 'caca-?niquel', 'blackjack', 'poker', 'poquer',
  // adulto e drogas
  'sex[oy]', 'sexual\\w*', 'transar', 'tesao', 'nudes?', 'porn\\w*', 'erotic\\w*', 'masturb\\w*', 'orgasm\\w*', 'pelad[oa]s?', 'maconha', 'cocaina', 'crack', 'suicid\\w*', 'se matar', 'automutil\\w*',
];
const RE = new RegExp(`(^|[^a-z0-9])(${L.join('|')})(?=$|[^a-z0-9])`, 'i');
export const limpa = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[@4]/g, 'a').replace(/0(?=[a-z])/g, 'o').replace(/([a-z])\1{2,}/g, '$1');
export const bloqueado = (s) => RE.test(limpa(s));
/** dose ou diagnóstico: vale só para o que a IA escreve */
export const medico = (s) => /\b\d+\s?(mg|mcg|ml|gotas|comprimidos?)\b|\bdose\b|diagn[oó]stic|\bcura(r|do)?\b.*\b(doen|ansiedade|depress)/i.test(String(s || ''));
