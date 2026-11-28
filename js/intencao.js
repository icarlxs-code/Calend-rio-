/* O que a pessoa quer com a mensagem: PERGUNTAR (consultar a agenda) ou PEDIR (marcar, anotar, mudar).
   Pergunta nunca vira cartão de "Quer que eu crie?": o assistente só responde. */
const sem = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

// verbos de pedido: com eles é pedido, mesmo que venha com "?" ("pode marcar dentista quinta?")
const PEDE = /\b(marca|marque|marcar|agenda|agende|agendar|anota|anote|anotar|cria|crie|criar|coloca|coloque|colocar|poe|ponha|por na|adiciona|adicione|adicionar|salva|salve|salvar|guarda|guarde|guardar|lembra(-me)? de|me lembra|me lembre|me avisa|me avise|lembrete|cadastra|registra|muda|mude|mudar|move|mova|mover|remarca|remarque|troca|troque|apaga|apague|apagar|exclui|exclua|cancela|cancele|desmarca|desmarque|tira|tire)\b/;
// jeitos de perguntar
const PERGUNTA = /^(tenho|tem|eu tenho|quais|qual|que|o que|oque|quando|quanto|quantos|quantas|onde|como|sera que|existe|ha|to livre|estou livre|eu to|ja tenho|ja marquei|ja agendei|me fala|me diz|mostra|lista|ve se|veja se)\b/;

/** a mensagem é só uma consulta (sem pedido de criar, mudar ou apagar)? */
export function ehConsulta(q) {
  const t = sem(q);
  if (!t || PEDE.test(t)) return false;
  return /\?\s*$/.test(t) || PERGUNTA.test(t);
}

/** o item que a IA quer criar já está na agenda (mesmo título no mesmo dia)? */
export function jaTem(acao, existentes = []) {
  const tit = sem(acao?.titulo || acao?.texto || acao?.title);
  const dia = (Array.isArray(acao?.datas) && acao.datas[0]) || acao?.data || acao?.date || null;
  if (!tit) return false;
  const chave = (x) => sem(x).replace(/[^a-z0-9 ]/g, '').split(' ').filter((w) => w.length > 2);
  const A = chave(tit);
  if (!A.length) return false;
  return existentes.some((e) => {
    if (dia && e.date && e.date !== dia) return false;
    const B = chave(e.title || e.text);
    return B.length && A.some((w) => B.some((v) => v.startsWith(w) || w.startsWith(v)));
  });
}

/** tira da resposta os recados internos que a IA às vezes copia do histórico */
export const limpaResposta = (t) => String(t || '')
  .replace(/\s*\((?:a[cç][oõ]es|a pessoa)[^)]*\)\.?/gi, '')
  .replace(/\s*\[(?:sistema|a[cç][oõ]es)[^\]]*\]/gi, '')
  .trim();
