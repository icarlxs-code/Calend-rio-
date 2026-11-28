/* A cara do mascote combina com o que ele fala: amor = olhos de coração, dinheiro = cifrão, gol e conquista = estrelas,
   tristeza = lágrimas, "arrasou" = óculos escuros… Com um pouco de acaso, para não virar padrão robótico.
   Puro (sem tela): os testes conferem. Devolve o humor do Sininho ou '' (fica o que já estava). */
const sem = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const B = (x) => new RegExp(`(?<![a-z])(?:${x})`, 'i');
const REGRAS = [
  // tristeza e choro vêm antes (uma notícia triste não pode virar festa)
  { h: ['chorando', 'triste'], re: B('triste|tristeza|chor|saudade|perdemos|perdeu|derrota|sinto muito|que pena|poxa|luto|faleceu|😭|😢|💔') },
  { h: ['emocionado', 'apaixonado'], re: B('emocion|orgulho de voce|que lindo|me emocion|🥹') },
  { h: ['apaixonado', 'amor'], re: B('amor|amo |te amo|apaixon|namor|casad|marido|esposa|coracao|carinho|beijo|saudades de|❤|💛|💕|😍|🥰') },
  { h: ['rico', 'rico', 'descolado'], re: B('dinheiro|r\\$|salario|pix|conta[s]? (do mes|de luz|de agua)|pagar|pago|boleto|fatura|aluguel|economi|investi|lucro|grana|💰|💸|🤑') },
  { h: ['estrelado', 'comemora'], re: B('gol(?![a-z])|golaco|vitoria|ganhamos|venceu|campeao|conquist|parabens|arrasou|incrivel|nivel|trofeu|🏆|🎉|🔥|⭐') },
  { h: ['descolado'], re: B('tranquilo|de boa|relaxa|suave|estiloso|ta favoravel|esta favoravel|😎') },
  { h: ['sono'], re: B('boa noite|dormir|descansa|sono|cama|zzz|😴') },
  { h: ['zonzo', 'surpreso'], re: B('confus|tonto|que loucura|nossa senhora|caramba|😵') },
  { h: ['surpreso'], re: B('uau|nossa!|olha so|novidade|chegou|surpresa|😮|😲') },
  { h: ['comemora', 'danca'], re: B('bora|vamos|festa|aniversario|🎂|🥳') },
];
/** o humor que combina com a fala; `sorte` (0..1) escolhe entre as variações daquela emoção */
export function humorDaFala(texto, sorte = Math.random()) {
  const t = sem(texto);
  if (!t) return '';
  for (const r of REGRAS) if (r.re.test(t)) return r.h[Math.min(r.h.length - 1, Math.floor(sorte * r.h.length))];
  return '';
}
