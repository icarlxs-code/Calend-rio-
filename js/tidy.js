/* Deixa o título do evento bonito e fácil de entender, mesmo escrito às pressas:
   "post no feed couve flor" → "Couve-flor" (o tipo "Feed" e a empresa já aparecem no cartão). */
const FILLER = new Set(['fazer', 'criar', 'postar', 'subir', 'publicar', 'gravar', 'post', 'postagem', 'publicacao', 'publicação', 'o', 'a', 'um', 'uma', 'no', 'na', 'do', 'da', 'de', 'dos', 'das', 'pro', 'pra', 'para', 'feed', 'reels', 'reel', 'story', 'stories', 'storie', 'storys', 'carrossel', 'carosel', 'carossel', 'instagram', 'insta', 'ig', 'sobre', 'com', 'e']);
const FIX = [
  [/\bcouve flor\b/gi, 'couve-flor'], [/\bpromocao\b/gi, 'promoção'], [/\bpromoçao\b/gi, 'promoção'], [/\bacao\b/gi, 'ação'], [/\bpao\b/gi, 'pão'],
  [/\blimao\b/gi, 'limão'], [/\bmamao\b/gi, 'mamão'], [/\bmelao\b/gi, 'melão'], [/\bfeijao\b/gi, 'feijão'], [/\bmaca\b/gi, 'maçã'], [/\bmaça\b/gi, 'maçã'],
  [/\babobora\b/gi, 'abóbora'], [/\bpessego\b/gi, 'pêssego'], [/\bmaracuja\b/gi, 'maracujá'], [/\babacate\b/gi, 'abacate'], [/\babacaxi\b/gi, 'abacaxi'],
  [/\bcafe\b/gi, 'café'], [/\bpromo\b/gi, 'promo'], [/\bblack friday\b/gi, 'Black Friday'], [/\bnatal\b/gi, 'Natal'], [/\bano novo\b/gi, 'Ano Novo'],
  [/\bdia das maes\b/gi, 'Dia das Mães'], [/\bdia dos pais\b/gi, 'Dia dos Pais'], [/\bhamburguer\b/gi, 'hambúrguer'], [/\bhamburguers\b/gi, 'hambúrgueres'],
  [/\blancamento\b/gi, 'lançamento'], [/\bcolecao\b/gi, 'coleção'], [/\bvideo\b/gi, 'vídeo'], [/\bsabado\b/gi, 'sábado'], [/\bpromocoes\b/gi, 'promoções'],
];
const strip = (w) => w.toLowerCase().replace(/[.,:;!]+$/, '');
export function tidyTitle(raw) {
  let t = String(raw || '').replace(/\s+/g, ' ').trim();
  if (!t) return t;
  const words = t.split(' ');
  // tira as palavras de "comando" do começo (post no feed da …), mas sempre deixa algo
  while (words.length > 1 && FILLER.has(strip(words[0]))) words.shift();
  t = words.join(' ').replace(/\s+(no|pro|pra|para o)\s+(instagram|insta|ig|feed)\s*$/i, '').trim();
  if (FILLER.has(strip(t))) return capFirst(String(raw).trim()); // era só "post no feed": deixa como estava
  for (const [re, to] of FIX) t = t.replace(re, to);
  return capFirst(t);
}
const capFirst = (s) => (s ? s.charAt(0).toLocaleUpperCase('pt-BR') + s.slice(1) : s);
