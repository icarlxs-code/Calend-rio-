/* Tipos de evento, status, paleta e dicas */
import { TYPE_DEFS, ARCHETYPES, ARCH_THEME, profStyle, formOf } from '../functions/catalog.js';

export const TYPES = {
  feed: {
    label: 'Feed', icon: 'grid', kind: 'post', dur: 15, client: true,
    best: ['11:30', '12:30', '18:00', '19:30'],
    tip: 'Feed costuma ter mais alcance entre 11h–13h (almoço) e 18h–20h (saída do trabalho).',
    placeholder: 'Ex.: Post da promoção de verão',
  },
  carrossel: {
    label: 'Carrossel', icon: 'layers', kind: 'post', dur: 15, client: true,
    best: ['11:30', '12:30', '18:30', '20:00'],
    tip: 'Carrossel prende atenção: publique quando o público tem tempo de deslizar — almoço ou noite.',
    placeholder: 'Ex.: 5 dicas para…',
  },
  reels: {
    label: 'Reels', icon: 'play', kind: 'post', dur: 15, client: true,
    best: ['12:00', '18:00', '19:00', '20:30'],
    tip: 'Reels: 12h e 18h–21h tendem a ter mais alcance. Evite publicar dois Reels da mesma empresa no mesmo dia.',
    placeholder: 'Ex.: Bastidores da cozinha',
  },
  story: {
    label: 'Story', icon: 'story', kind: 'post', dur: 10, client: true,
    best: ['08:30', '12:00', '15:00', '19:00', '21:00'],
    tip: 'Stories: distribua de 3 a 7 ao longo do dia (manhã, almoço e noite) em vez de postar tudo de uma vez.',
    placeholder: 'Ex.: Enquete sobre o novo sabor',
  },
  captacao: {
    label: 'Captação', icon: 'camera', kind: 'shoot', dur: 120, client: true,
    best: ['08:30', '09:00', '16:00', '16:30'],
    tip: 'Captação: a luz natural mais bonita é no início da manhã (8h–10h) e no fim da tarde (16h–17h30). Reserve 30–45 min de deslocamento.',
    placeholder: 'Ex.: Fotos do cardápio novo',
  },
  reuniao: {
    label: 'Reunião', icon: 'users', kind: 'meeting', dur: 60, client: true,
    best: ['10:00', '14:00', '15:00'],
    tip: 'Reuniões: prefira 10h ou 14h e deixe livres os horários de pico de postagem (12h e 18h–20h).',
    placeholder: 'Ex.: Alinhamento do mês',
  },
  producao: {
    label: 'Edição', icon: 'scissors', kind: 'work', dur: 90, client: false,
    best: ['09:00', '10:00', '14:00'],
    tip: 'Edição/produção rende mais em blocos (batching): edite o conteúdo da semana inteira de uma vez, de manhã.',
    placeholder: 'Ex.: Editar Reels da semana',
  },
  outro: {
    label: 'Outro', icon: 'dot', kind: 'other', dur: 30, client: false,
    best: [],
    tip: 'Use para tarefas avulsas: aprovação, orçamento, pagamento, compras de material…',
    placeholder: 'Ex.: Enviar aprovação para o cliente',
  },
};

/* Todos os tipos do catálogo (de todas as profissões) ficam válidos; o editor mostra só os do perfil atual */
const KIND_TIP = {
  meeting: 'Confirme o horário um dia antes e chegue com 10 minutos de folga.',
  shoot: 'Reserve tempo de deslocamento antes e depois.',
  work: 'Proteja esse bloco: sem outros compromissos por cima.',
  other: 'Coisas rápidas: resolva assim que o Lembra avisar.',
  post: 'Programe com antecedência para não depender do celular na hora.',
};
for (const [id, d] of Object.entries(TYPE_DEFS)) {
  if (TYPES[id]) { TYPES[id] = { ...d, ...TYPES[id], color: d.color }; continue; }
  TYPES[id] = { label: d.label, icon: d.icon, color: d.color, kind: d.kind, dur: d.dur, onSite: !!d.onSite, client: d.kind !== 'work' || !!d.onSite, best: [], tip: KIND_TIP[d.kind] || KIND_TIP.other, placeholder: `Ex.: ${d.label}`, ask: d.ask, verb: d.verb, words: d.words };
}
export const TYPE_ORDER = ['feed', 'story', 'reels', 'carrossel', 'captacao', 'reuniao', 'producao', 'outro'];
/* ícone original de cada tipo (a profissão pode trocar: dentista → dente, veterinário → pata…) */
const BASE_ICON = Object.fromEntries(Object.entries(TYPES).map(([k, t]) => [k, t.icon]));
/* Perfil de trabalho ativo (muda com a profissão da conta) */
export const WORK = { arch: 'marketing', profession: '', entity: ARCHETYPES.marketing.entity, clientLike: true, tips: ARCHETYPES.marketing.tips, badge: 'building', theme: null, form: formOf('marketing') };
export function applyArch(arch, profession = '') {
  const a = ARCHETYPES[arch] || ARCHETYPES.generico;
  WORK.arch = ARCHETYPES[arch] ? arch : 'generico';
  WORK.profession = profession || '';
  WORK.entity = a.entity;
  WORK.clientLike = !!a.clientLike;
  WORK.tips = a.tips;
  TYPE_ORDER.splice(0, TYPE_ORDER.length, ...a.types);
  // ícones com a cara da profissão
  const st = profStyle(profession);
  for (const [k, ic] of Object.entries(BASE_ICON)) TYPES[k].icon = (st.types && st.types[k]) || ic;
  WORK.badge = st.icon || a.entity.icon;
  WORK.theme = ARCH_THEME[WORK.arch] || null;
  WORK.form = formOf(WORK.arch, profession);
  // profissão com um tipo principal (ex.: confeiteira → Encomenda vem primeiro e já marcado)
  if (WORK.form.first && TYPE_ORDER.includes(WORK.form.first)) TYPE_ORDER.splice(0, TYPE_ORDER.length, WORK.form.first, ...TYPE_ORDER.filter((t) => t !== WORK.form.first));
  return WORK;
}
/* Cor do tipo (tipos novos usam a cor do catálogo) */
export const typeStyle = (id) => (TYPES[id] && !['feed', 'carrossel', 'reels', 'story', 'captacao', 'reuniao', 'producao', 'outro'].includes(id) ? ` style="--tc:${TYPES[id].color}"` : '');
export const isMarketing = () => WORK.arch === 'marketing';
/* Como chamar o grupo de pessoas da agenda: a dupla Henrique + Matheus ou a equipe (agenda compartilhada) */
export const crew = () => (WORK.arch === 'marketing' && WORK.main ? 'dupla' : 'equipe');
/* gênero do nome do grupo (Nova empresa / Novo local / Todas as turmas…) */
const FEM = ['Empresa', 'Turma', 'Obra', 'Unidade', 'Plataforma', 'Área', 'Matéria'];
export const entFem = () => FEM.includes(WORK.entity.one);
export const novo = () => (entFem() ? 'Nova' : 'Novo');
export const nenhum = () => (entFem() ? 'Nenhuma' : 'Nenhum');
export const todos = () => (entFem() ? 'Todas' : 'Todos');
export const ent = (plural = false, lower = false) => { const t = plural ? WORK.entity.many : WORK.entity.one; return lower ? t.toLowerCase() : t; };
export const isPost = (type) => TYPES[type]?.kind === 'post';
export const durationOf = (ev) => ev.duration || TYPES[ev.type]?.dur || 30;

export const STATUS = {
  pendente: { label: 'A fazer' },
  pronto: { label: 'Pronto' },
  feito: { label: 'Feito' },
};
export const STATUS_ORDER = ['pendente', 'pronto', 'feito'];

/* Como o status aparece para o cliente */
export const clientStatus = (ev) => {
  const post = isPost(ev.type);
  if (ev.status === 'feito') return post ? 'Publicado' : 'Realizado';
  if (ev.status === 'pronto') return post ? 'Agendado' : 'Confirmado';
  return 'Planejado';
};

export const PALETTE = [
  '#16A34A', '#0D9488', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED',
  '#C026D3', '#DB2777', '#E11D48', '#EA580C', '#CA8A04', '#57534E',
];

/* durações oferecidas: as de sempre + a duração padrão de cada tipo do catálogo (aula 50 min, plantão 12h…) */
export const DURATIONS = [10, 15, 20, 30, 45, 50, 60, 90, 100, 120, 180, 240, 300, 360, 480, 600, 720, 1440];
export const REMINDERS = [
  { v: -1, label: 'Sem lembrete' },
  { v: 0, label: 'Na hora' },
  { v: 10, label: '10 min antes' },
  { v: 15, label: '15 min antes' },
  { v: 30, label: '30 min antes' },
  { v: 60, label: '1 hora antes' },
  { v: 120, label: '2 horas antes' },
  { v: 1440, label: '1 dia antes' },
];
export const REPEATS = [
  { v: 'none', label: 'Não repetir' },
  { v: 'daily', label: 'Todo dia' },
  { v: 'weekdays', label: 'Dias úteis (seg–sex)' },
  { v: 'weekly', label: 'Toda semana' },
];

/* Dicas gerais — uma por dia, em rodízio */
export const GENERAL_TIPS = [
  'Programe os posts no Meta Business Suite (ou no próprio Instagram) na véspera. Assim, nenhum horário depende de vocês estarem com o celular na mão.',
  'Faça a captação de vários conteúdos da mesma empresa numa visita só: fotos de feed, vídeos de Reels e material para stories.',
  'Reserve um bloco fixo na semana (ex.: segunda de manhã) para planejar a pauta de todas as empresas.',
  'Nunca marquem uma captação no mesmo horário de um post importante. Deixem o post programado antes de sair.',
  'Entre duas captações em lugares diferentes, deixem pelo menos 45 minutos livres para deslocamento e imprevistos.',
  'Mandem o cronograma da semana para o cliente aprovar até sexta-feira. Menos retrabalho, menos correria.',
  'Depois de postar, fiquem 15–20 minutos respondendo comentários: isso ajuda o alcance do post.',
  'Agrupem tarefas parecidas: editar todos os Reels juntos, escrever todas as legendas juntas.',
  'Antes de cada captação: baterias carregadas, cartões de memória vazios, roteiro e lista de tomadas definidos.',
  'Uma vez por mês, olhem os Insights de cada perfil e ajustem os horários. Cada público tem o seu pico.',
  'Combinem quem responde o cliente em cada empresa. Um ponto de contato só evita mensagens desencontradas.',
  'Mantenham um banco de conteúdo pronto (2 ou 3 posts reserva) por empresa para dias imprevisíveis.',
  'Evitem mais de 1 post de feed por dia na mesma empresa. Stories podem (e devem) ser vários.',
  'Mudanças de última hora: atualizem o calendário na hora, para o parceiro e o cliente verem a versão certa.',
];

export const BEST_TIMES_TABLE = [
  { type: 'feed', text: '11h–13h · 18h–20h' },
  { type: 'reels', text: '12h · 18h–21h' },
  { type: 'story', text: '8h30 · 12h · 15h · 19h · 21h' },
  { type: 'carrossel', text: '11h30–13h · 18h30–20h' },
  { type: 'captacao', text: '8h–10h · 16h–17h30 (luz natural)' },
  { type: 'reuniao', text: '10h · 14h–15h' },
  { type: 'producao', text: 'Manhã, em blocos' },
];
