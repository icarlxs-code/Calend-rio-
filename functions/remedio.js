/* Remédio é dado de saúde: o nome nunca aparece na tela de bloqueio (LGPD).
   Compartilhado pelo app e pelo servidor. Sem dependências. */
import { achaRemedio, escondeNome } from './remedios-lista.js';
export const GENERICO = { title: '💊 Hora do seu remédio', body: 'Toque para ver qual' };
const DITO = /rem[eé]dio|comprimid|c[aá]psul|\bgotas\b|\bxarope|\bpomada|antibi[oó]tic|antidepress|ansiol[ií]tic|anticoncep|p[ií]lula|insulin|\bvitamina|\bsuplement|\bcolírio|\bcolirio|\binjeç[aã]o|\bmedica(mento|[cç][aã]o)|\b\d+\s?(mg|mcg|ml|ui)\b/i;
const NAO = /dentist|m[eé]dic[oa]\b|consult|exame|academia|treino|\bpsic|\bpsiq|\bneuro|terap|vacina|hospital|cl[ií]nica|fisio|nutri|cardio|dermat|gineco|pediatr|ortop|oftalm|caminh|corrid|pilates|yoga|check-?up|\bretorno|cirurg|raio.?x|ultrass|doa[cç]|[aá]gua\b|medita|dormir|\bsono\b|\bpeso\b|dieta|massag|alongar|exerc[ií]c|natac|esporte/i;
/** é lembrete de tomar remédio? (na dúvida, dentro de Saúde, conta como remédio) */
export const ehRemedio = (it) => { const t = String((it && it.title) || ''); return !!achaRemedio(t) || DITO.test(t) || (it && it.cat === 'saude' && !!t && !NAO.test(t)); };
export const tituloSeguro = (it) => (ehRemedio(it) ? 'Seu remédio' : it.title);
/** o mesmo compromisso, sem o nome do remédio (para textos que saem no aviso) */
export const semNome = (it) => (it && ehRemedio(it) ? { ...it, title: 'Seu remédio', location: '', description: '' } : it);
export function avisoRemedio(etapa = 'm0') {
  const t = { m60: '💊 Seu remédio em 1 hora', m30: '💊 Seu remédio em 30 min', m20: '💊 Seu remédio em 20 min', after: '💊 Já tomou seu remédio?' }[etapa];
  return { title: t || GENERICO.title, body: GENERICO.body };
}
/** última barreira no servidor: cobre avisos antigos que ainda trazem o nome */
export function barra(msg, nomes = []) {
  const s = `${(msg && msg.title) || ''} ${(msg && msg.body) || ''}`;
  const cita = nomes.some((n) => n && n.length > 2 && s.toLowerCase().includes(n.toLowerCase()));
  return cita ? { ...msg, ...GENERICO } : msg;
}
