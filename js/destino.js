/* Agenda ou nota? Entende o que a pessoa escreveu e diz para onde pode ir.
   Vale para os dois caminhos do assistente (o brilho lá em cima e o campo lá embaixo). Nada sai do aparelho. */
import { parseQuick } from './personal.js';

const sem = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const PERGUNTA = /\?\s*$|^(onde|quando|quant[oa]s?|o que|oque|qual|quais|como|quem|por que|porque|cad[eê]|tem |tenho (algo|alguma|algum|o que)|estou livre|to livre|to ocupad|estou ocupad|me (diz|diga|fala|explica|mostra|ajuda)|analis|resum|organiz|planej|suger|oi\b|ola\b|bom dia|boa (tarde|noite)|obrigad|valeu|sim\b|nao\b(?! (me )?deix| esquec)|ok\b)/;
const DESFAZ = /^(desfaz(er|e)?|desfaca|volta (como|tudo)|nao era isso|cancela isso|desfaz isso)\b[\s\w]*[.! ]*$/;
const SO_VERBO = /^(desmarc\w*|cancel\w*|tira|tire|apag\w*|remov\w*|exclu\w*)[.! ]*$/;
const MEXE = /\b(desmarc\w*|(tir|apag)[ae] tudo|na verdade|muda (pra|para|o|a)\b|mud[ae]r?|mov[ae]r?|remarc\w*|adi[ae]r?|pass[ae] (o|a|os|as)\b|troc[ae]r?|apag\w*|exclu\w*|delet\w*|cancel\w*|remov\w*|tir[ae] (o|a|os|as)\b|conclu\w*|marc(a|ar|que) como (feit|pronto|conclu)\w*)\b/;
const VARIOS = /\b(tod[oa]s? (os|as|dia|dias|segunda|terca|quarta|quinta|sexta|sabado|domingo|semana|mes)|toda semana|todo mes|de segunda a|ate (o|a|dia|fim)|segundas|tercas|quartas|quintas|sextas)\b/;
/* mais de uma regra ou um período ("de segunda a sexta", "dia 5 e 20", "até dezembro"): vai para a IA */
const MUITAS = /\b(de (segunda|terca|quarta|quinta|sexta|sabado|domingo) a|ate (o|a|dia|fim|janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)|(segunda|terca|quarta|quinta|sexta|sabado|domingo)s? e (as |os |a |o )?(segunda|terca|quarta|quinta|sexta|sabado|domingo)|dias? \d{1,2}(º|°)? e (dia )?\d{1,2})\b/;
const NA_AGENDA = /\b(na|no|para a|pra|pro) (minha |meu )?(agenda|calendario)\b|\bagend(a|ar|e|ei)\b(?! de\b)/;
const NA_NOTA = /\b(nas?|em|uma|nos?|como|so) (minhas? |meus? )?(notas?|anotac(ao|oes)|bilhetes?)\b/;
const QUANDO = /\b(hoje|amanha|depois de amanha|domingo|segunda|terca|quarta|quinta|sexta|sabado|meio-dia|meia-noite|semana que vem|mes que vem|daqui a?|dia \d{1,2}|\d{1,2}\/\d{1,2}|\d{1,2}h(\d{2})?|\d{1,2}:\d{2}|as \d{1,2})\b|\b\d{1,2} de (jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/;
const VERBO = /^(por favor,?\s+|entao,?\s+)?(me |pode |voce pode |quero |queria |preciso |eu )*(lembr(a|ar|e)( de)?( que)?|anot(a|ar|e)( (ai|que|pra mim))*|marc(a|ar|que)( (ai|pra mim))*|agend(a|ar|e)( (ai|pra mim))*|coloc(a|ar|que)( (ai|que|pra mim))*|bot(a|ar|e)( ai)?|poe( ai)?|guard(a|ar|e)( que)?|registr(a|ar|e)|adicion(a|ar|e)|cri(a|ar|e)|salv(a|ar|e)|tenho|tem que|vou ter|vou|ter)\s+(que tenho |que eu tenho |tenho |um compromisso de |um compromisso: |a |o |um |uma |de )*/;
const TRAB = /\b(reuniao|cliente|empresa|trabalho|escritorio|captacao|gravacao|reels|feed|stories|post\b|entrega|projeto|proposta|orcamento|aula|plantao|visita tecnica|obra)\b/;
const PESS = /\b(medic[oa]|dentista|consulta|exame|psic\w*|psiq\w*|neuro\w*|terapia|cabel\w*|barb\w*|unha|academia|treino|aniversario|mae|pai|filh[oa]|vo\b|vovo|mercado|casa|igreja|culto|missa|namorad\w*|espos[oa]|marido|remedio|viagem|pessoal)\b/;

/** { intencao } = desfazer ou pergunta curta; null = é conversa (pergunta, mudança, pedido repetido): vai para a IA. */
export function entende(raw, espaco = 'personal') {
  const texto = String(raw || '').replace(/\s+/g, ' ').trim(), s = sem(texto);
  if (DESFAZ.test(s)) return { intencao: 'desfazer' };
  if (SO_VERBO.test(s)) return { intencao: 'qual', verbo: s.replace(/[.! ]+$/, '') };
  if (texto.length < 3 || texto.length > 160 || PERGUNTA.test(s) || MEXE.test(s) || /\n/.test(raw.trim())) return null;
  const limpo = texto.replace(/,?\s*(por favor|pfv|pf)\.?$/i, '');
  const q = parseQuick(limpo.replace(/\b(na|no|nas|nos|em|como|só|so)\s+(minhas?\s+|meus?\s+)?(agenda|calend[aá]rio|notas?|anota[cç][aã]o|anota[cç][oõ]es|bilhetes?)(\s+(de|do)\s+trabalho|\s+pessoal)?\b/gi, ' '));
  // uma repetição só ("todo dia 10", "toda segunda") o app resolve; várias regras ou um período vão para a IA
  if (MUITAS.test(s) || (VARIOS.test(s) && q.repeat === 'none')) return null;
  const m = VERBO.exec(sem(q.title)), corta = m && m[0].length < q.title.length ? m[0].length : 0;
  // só com normalização que não muda o tamanho do texto o corte por posição vale
  let titulo = q.title.normalize('NFC'); if (corta && sem(titulo).length === titulo.length) titulo = titulo.slice(corta);
  titulo = titulo.replace(/^[\s:,.;-]+|[\s:,.;-]+$/g, '').replace(/\s+(no|na|às|as|de|para|pra|dia|em)$/i, '');
  titulo = titulo ? titulo.charAt(0).toUpperCase() + titulo.slice(1) : texto;
  const temQuando = QUANDO.test(s), trabalho = /\btrabalho\b/.test(s) || (TRAB.test(s) && !PESS.test(s)) || (espaco === 'work' && !PESS.test(s));
  const dito = NA_NOTA.test(s) ? 'nota' : NA_AGENDA.test(s) ? 'agenda' : '';
  return { texto, titulo: titulo.slice(0, 120), data: temQuando ? q.date : null, hora: q.time || null, cat: q.cat, repetir: q.repeat, ...(q.diaMes ? { diaMes: q.diaMes } : {}), ...(q.valor ? { valor: q.valor } : {}), temQuando, espaco: trabalho ? 'work' : 'personal', dito };
}
