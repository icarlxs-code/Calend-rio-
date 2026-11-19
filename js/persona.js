/* Motor de personalização do Lembra.
   A ficha da pessoa vira números de verdade:
   - índice de esquecimento (0–100) → quantos avisos e com quanta antecedência
   - procrastinação/sobrecarga → de quanto em quanto tempo cobrar quando atrasa, e até quando
   - horário de acordar/dormir/almoço → janela das mensagens do dia
   - jornada → limite de tarefas por dia e expediente */

export const DIFFICULTIES = [
  { id: 'esquecer', label: 'Esqueço compromissos', w: 16 },
  { id: 'prazos', label: 'Perco prazos', w: 12 },
  { id: 'atrasos', label: 'Chego atrasado(a)', w: 10 },
  { id: 'procrastinar', label: 'Deixo tudo para depois', w: 12 },
  { id: 'sobrecarga', label: 'Muitas coisas ao mesmo tempo', w: 8 },
  { id: 'desorganizacao', label: 'Me sinto desorganizado(a)', w: 8 },
  { id: 'datas', label: 'Esqueço aniversários e datas', w: 5 },
  { id: 'equilibrio', label: 'Conciliar trabalho e vida pessoal', w: 3 },
  { id: 'agua', label: 'Esqueço de beber água', w: 0 },
  { id: 'comer', label: 'Pulo refeições', w: 0 },
  { id: 'ansiedade', label: 'Ansiedade e estresse', w: 0 },
  { id: 'sono', label: 'Durmo mal', w: 0 },
];
export const JOURNEYS = [
  { id: 'comercial', label: 'Horário comercial', hint: 'segunda a sexta, de dia', max: 8 },
  { id: 'turnos', label: 'Turnos', hint: 'manhã, tarde ou noite', max: 6 },
  { id: 'plantao', label: 'Plantões / escala', hint: '12x36, 24x72, serviço', max: 4 },
  { id: 'flexivel', label: 'Flexível / autônomo', hint: 'faço meus horários', max: 8 },
  { id: 'estudo', label: 'Estudo', hint: 'aulas e provas', max: 6 },
];
export const GOALS = [
  { id: 'lembrar', label: 'Nunca mais esquecer compromissos' },
  { id: 'produtivo', label: 'Ser mais produtivo(a)' },
  { id: 'tempo', label: 'Ter mais tempo livre' },
  { id: 'saude', label: 'Cuidar melhor de mim' },
  { id: 'carreira', label: 'Crescer na carreira' },
  { id: 'organizar', label: 'Organizar o trabalho e a equipe' },
];
export const TONES = [
  { id: 'carinhoso', label: 'Amigo carinhoso', sample: '“Ei, passou do horário. Tudo bem? Quando der, resolve 💜”' },
  { id: 'firme', label: 'Coach firme', sample: '“Você disse que ia fazer às 12h. Honra o seu compromisso.”' },
  { id: 'direto', label: 'Direto e objetivo', sample: '“Pendente desde 12h. Resolver agora.”' },
];
const LADDER = [
  { upTo: 20, offsets: [30] },
  { upTo: 40, offsets: [60, 15] },
  { upTo: 60, offsets: [60, 30, 10] },
  { upTo: 80, offsets: [120, 60, 30, 10] },
  { upTo: 100, offsets: [1440, 120, 60, 30, 10] },
];
const toMin = (t) => { const [h, m] = String(t || '0:0').split(':').map(Number); return h * 60 + (m || 0); };
const hm = (min) => `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, '0') : ''}`;
const fmtOff = (o) => (o >= 1440 ? `${Math.round(o / 1440)} dia${o >= 2880 ? 's' : ''} antes` : o >= 60 ? `${o / 60}h antes` : `${o} min antes`);

/* Idade a partir da data de nascimento (AAAA-MM-DD) */
export function ageOf(birth, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth || '')) return null;
  const [y, m, d] = birth.split('-').map(Number);
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
  return age >= 0 && age < 130 ? age : null;
}

/* Valida CPF (dígitos verificadores) */
export function validCPF(raw) {
  const c = String(raw || '').replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const dv = (len) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += +c[i] * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dv(9) === +c[9] && dv(10) === +c[10];
}
export const maskCPF = (raw) => {
  const c = String(raw || '').replace(/\D/g, '').slice(0, 11);
  return c.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1-$2');
};

/* A ficha vira a personalização (com a explicação de cada número) */
export function computePersona(f) {
  const diffs = new Set(f.difficulties || []);
  const forget = Math.min(5, Math.max(1, Number(f.forget) || 3));
  const weights = DIFFICULTIES.filter((d) => diffs.has(d.id)).reduce((a, d) => a + d.w, 0);
  const index = Math.max(0, Math.min(100, Math.round((forget - 1) * 15 + weights)));
  const step = LADDER.find((l) => index <= l.upTo) || LADDER[LADDER.length - 1];
  const offsets = new Set(step.offsets);
  const lead = Number(f.lead);
  if (Number.isFinite(lead) && lead > 0) offsets.add(lead);
  const offs = [...offsets].sort((a, b) => b - a);
  const procrast = diffs.has('procrastinar');
  const lateEvery = procrast || index > 70 ? 10 : index > 40 ? 15 : 25;
  const lateMax = index > 60 || procrast ? 180 : index > 30 ? 120 : 60;
  const tone = ['carinhoso', 'firme', 'direto'].includes(f.tone) ? f.tone : 'firme';
  const journey = JOURNEYS.find((j) => j.id === f.journey) || JOURNEYS[0];
  const freq = f.freq || (diffs.has('ansiedade') ? 'calma' : procrast || diffs.has('desorganizacao') ? 'alta' : 'normal');
  const wake = f.wake || '06:30', sleep = f.sleep || '22:30', lunch = f.lunch || '12:00';
  const water = f.water !== undefined ? !!f.water : true;
  const meals = f.meals !== undefined ? !!f.meals : true;
  const workDays = Array.isArray(f.workDays) && f.workDays.length ? f.workDays : [1, 2, 3, 4, 5];
  const why = [
    `Índice de esquecimento ${index}/100 (você marcou ${forget} de 5${weights ? ` e ${diffs.size} dificuldade${diffs.size > 1 ? 's' : ''}` : ''}).`,
    `Por isso, cada compromisso terá ${offs.length} aviso${offs.length > 1 ? 's' : ''} antes (${offs.map(fmtOff).join(', ')}) e uma pergunta na hora exata.`,
    `Se atrasar, o Lembra cobra a cada ${lateEvery} minutos por até ${hm(lateMax)}, no tom “${TONES.find((t) => t.id === tone).label}”.`,
    `Mensagens do dia só entre ${f.wake || '6h30'} e ${f.sleep || '22h30'} (seu horário de acordar e dormir), ${freq === 'alta' ? 'com mais frequência' : freq === 'calma' ? 'com calma, sem excesso' : 'em ritmo equilibrado'}${water ? ', com lembrete de água' : ''}${meals ? ` e de comer perto das ${lunch.replace(':00', 'h')}` : ''}.`,
    `Jornada “${journey.label}”: o Lembra avisa quando passar de ${journey.max} compromissos no dia.`,
  ];
  return {
    index, offsets: offs, lateEvery, lateMax, tone,
    routine: {
      workStart: f.workStart || '08:00', workEnd: f.workEnd || '18:00',
      lunchStart: lunch, lunchEnd: `${String(Math.floor((toMin(lunch) + 60) / 60) % 24).padStart(2, '0')}:${String((toMin(lunch) + 60) % 60).padStart(2, '0')}`,
      daysOff: [0, 1, 2, 3, 4, 5, 6].filter((d) => !workDays.includes(d)), travelMin: 30, maxTasks: journey.max,
    },
    nudges: { nudges: true, water, meals, faith: !!f.faith, freq, wake, sleep, lunch, tone },
    why,
  };
}
