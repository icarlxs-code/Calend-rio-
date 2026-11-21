/* Motor de personalização do Lembra.
   A ficha da pessoa vira números de verdade:
   - índice de esquecimento (0–100) → quantos avisos e com quanta antecedência
   - procrastinação/sobrecarga → de quanto em quanto tempo cobrar quando atrasa, e até quando
   - horário de acordar/dormir/almoço → janela das mensagens do dia
   - jornada → limite de tarefas por dia e expediente */

export const DIFFICULTIES = [
  { id: 'esquecer', label: 'Esqueço compromissos', w: 16 },
  { id: 'prazos', label: 'Perco prazos', w: 12 },
  { id: 'atrasos', label: 'Me atraso com frequência', w: 10 },
  { id: 'procrastinar', label: 'Deixo tudo para depois', w: 12 },
  { id: 'sobrecarga', label: 'Muitas coisas ao mesmo tempo', w: 8 },
  { id: 'desorganizacao', label: 'Minha rotina vive bagunçada', w: 8 },
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
/* como a pessoa lembra das coisas hoje (quem guarda tudo na cabeça precisa de mais ajuda) */
export const METHODS = [
  { id: 'cabeca', label: 'Na cabeça', w: 10 },
  { id: 'outros', label: 'Alguém me lembra', w: 8 },
  { id: 'papel', label: 'Papel ou caderno', w: 4 },
  { id: 'celular', label: 'Alarme ou agenda do celular', w: 0 },
];
/* quantos compromissos num dia normal (limite de sobrecarga e peso no índice) */
export const VOLUMES = [
  { id: '1-3', label: '1 a 3', max: 4, w: 0 },
  { id: '4-6', label: '4 a 6', max: 7, w: 3 },
  { id: '7-10', label: '7 a 10', max: 11, w: 6 },
  { id: '10+', label: 'Mais de 10', max: 15, w: 9 },
];
/* Como a pessoa se identifica (define o tratamento e as sugestões do modo Pessoal) */
export const GENDERS = [
  { id: 'mulher', label: 'Mulher', pronoun: 'f' },
  { id: 'homem', label: 'Homem', pronoun: 'm' },
  { id: 'mulher_trans', label: 'Mulher trans', pronoun: 'f' },
  { id: 'homem_trans', label: 'Homem trans', pronoun: 'm' },
  { id: 'nao_binario', label: 'Não binário', pronoun: 'n' },
  { id: 'nao_dizer', label: 'Prefiro não dizer', pronoun: 'n' },
];
/* Como o Lembra fala com a pessoa: no feminino, no masculino ou de forma neutra */
export const PRONOUNS = [
  { id: 'f', label: 'No feminino' },
  { id: 'm', label: 'No masculino' },
  { id: 'n', label: 'Neutro' },
];
/* Escolhe a palavra certa: g('pronto', 'pronta', 'tudo pronto', pronome) */
export const g = (m, f, n, pr) => (pr === 'f' ? f : pr === 'm' ? m : n);
export const GOALS = [
  { id: 'lembrar', label: 'Nunca mais esquecer compromissos' },
  { id: 'produtivo', label: 'Render mais no dia' },
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

/* Celular brasileiro: (11) 98765-4321 / (11) 3456-7890. Aceita +55 colado. */
export const maskPhone = (raw) => {
  let c = String(raw || '').replace(/\D/g, '');
  if (c.length > 11 && c.startsWith('55')) c = c.slice(2);
  c = c.slice(0, 11);
  if (c.length <= 2) return c ? `(${c}` : '';
  const ddd = c.slice(0, 2), n = c.slice(2);
  const cut = c.length === 11 || n[0] === '9' ? 5 : 4; // celular (9xxxx) ou fixo
  return n.length > cut ? `(${ddd}) ${n.slice(0, cut)}-${n.slice(cut)}` : `(${ddd}) ${n}`;
};
export const validPhone = (raw) => {
  let c = String(raw || '').replace(/\D/g, '');
  if (c.length > 11 && c.startsWith('55')) c = c.slice(2);
  if (!c) return true; // opcional
  return /^[1-9][1-9](9\d{8}|[2-5]\d{7})$/.test(c);
};

/* Nome: só letras (com acento), espaço, hífen e apóstrofo; arruma espaços e maiúsculas */
const LOWER = new Set(['da', 'de', 'do', 'das', 'dos', 'e', 'di', 'du', 'van', 'von']);
export const tidyName = (raw) => String(raw || '').normalize('NFC').replace(/\s+/g, ' ').trim()
  .split(' ').map((w, i) => {
    const lw = w.toLocaleLowerCase('pt-BR');
    if (i > 0 && LOWER.has(lw)) return lw;
    // só ajusta quem digitou tudo minúsculo ou tudo maiúsculo (respeita "McDonald", "DiCaprio")
    if (w !== lw && w !== w.toLocaleUpperCase('pt-BR')) return w;
    return lw.replace(/(^|[-'’])(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase('pt-BR'));
  }).join(' ');
export const validNameChars = (raw) => /^[\p{L}\p{M}' ’.-]+$/u.test(String(raw || '').trim());

/* E-mail: formato e erros de digitação comuns no domínio (gmial.com, hotmail.con…) */
const DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.com.br', 'icloud.com', 'live.com', 'bol.com.br', 'uol.com.br', 'terra.com.br', 'msn.com', 'me.com', 'hotmail.com.br', 'outlook.com.br'];
const lev = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[a.length][b.length];
};
export const cleanEmail = (raw) => String(raw || '').normalize('NFC').replace(/\s+/g, '').replace(/[,;]+$/, '').toLowerCase();
export const validEmail = (e) => /^[a-z0-9._%+'-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(e) && !/\.\./.test(e) && !/^\.|\.@|@-/.test(e);
export function emailTypo(e) {
  const m = /^([^@]+)@(.+)$/.exec(e || '');
  if (!m) return '';
  const dom = m[2];
  if (DOMAINS.includes(dom)) return '';
  let best = '', bd = 3;
  for (const d of DOMAINS) { const x = lev(dom, d); if (x < bd) { bd = x; best = d; } }
  // "gmail" sem ".com", "gmail.co", "gmail.com.br" (não existe)
  const fixes = { 'gmail': 'gmail.com', 'gmail.com.br': 'gmail.com', 'hotmail': 'hotmail.com', 'outlook': 'outlook.com', 'icloud': 'icloud.com', 'icloud.com.br': 'icloud.com' };
  if (fixes[dom]) best = fixes[dom], bd = 1;
  return bd > 0 && (bd === 1 || (bd === 2 && dom.length >= 8)) && best ? `${m[1]}@${best}` : '';
}

/* A ficha vira a personalização (com a explicação de cada número) */
export function computePersona(f) {
  const diffs = new Set(f.difficulties || []);
  const forget = Math.min(5, Math.max(1, Number(f.forget) || 3));
  const weights = DIFFICULTIES.filter((d) => diffs.has(d.id)).reduce((a, d) => a + d.w, 0);
  const method = METHODS.find((m) => m.id === f.method) || null;
  const volume = VOLUMES.find((v) => v.id === f.volume) || null;
  const extra = (method ? method.w : 0) + (volume ? volume.w : 0);
  const index = Math.max(0, Math.min(100, Math.round((forget - 1) * 15 + weights + extra)));
  const step = LADDER.find((l) => index <= l.upTo) || LADDER[LADDER.length - 1];
  const offsets = new Set(step.offsets);
  const lead = Number(f.lead);
  if (Number.isFinite(lead) && lead > 0) offsets.add(lead);
  const offs = [...offsets].sort((a, b) => b - a);
  const procrast = diffs.has('procrastinar');
  // cobrança de atraso firme, mas sem virar spam: no máximo 6 avisos (quem esquece muito), 3 ou 1
  const lateEvery = procrast || index > 70 ? 20 : index > 40 ? 30 : 45;
  const lateMax = index > 60 || procrast ? 120 : index > 30 ? 90 : 45;
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
    `Jornada “${journey.label}”: o Lembra avisa quando passar de ${volume ? volume.max : journey.max} compromissos no dia.`,
  ];
  if (method && method.w) why.splice(1, 0, `Hoje você lembra das coisas ${method.id === 'cabeca' ? 'de cabeça' : method.id === 'outros' ? 'porque alguém te lembra' : 'no papel'}: a partir de agora o Lembra assume esse trabalho por você.`);
  return {
    index, offsets: offs, lateEvery, lateMax, tone,
    routine: {
      workStart: f.workStart || '08:00', workEnd: f.workEnd || '18:00',
      lunchStart: lunch, lunchEnd: `${String(Math.floor((toMin(lunch) + 60) / 60) % 24).padStart(2, '0')}:${String((toMin(lunch) + 60) % 60).padStart(2, '0')}`,
      daysOff: [0, 1, 2, 3, 4, 5, 6].filter((d) => !workDays.includes(d)), travelMin: 30, maxTasks: volume ? volume.max : journey.max,
    },
    nudges: {
      nudges: true, water: Number(f.waterEvery ?? 180) > 0 && water !== false, meals, faith: !!f.faith && !['ateu', 'agnostico', 'nao_dizer'].includes(f.religion), freq, wake, sleep, lunch, tone, pronoun: ['f', 'm', 'n'].includes(f.pronoun) ? f.pronoun : 'n',
      // perfil para o amigo do Lembra (mensagens só desta pessoa)
      nickname: (f.nickname || String(f.name || '').split(' ')[0] || '').trim().slice(0, 30), age: ageOf(f.birth) || null,
      religion: f.faith ? f.religion || 'crista' : '', motivation: f.wantsMotivation !== false,
      perDay: Number(f.perDay) || 7, waterEvery: Number(f.waterEvery ?? 180),
      mind: { motivation: f.motivationLevel || null, selfesteem: f.selfesteem || null, anxiety: f.anxiety || (Array.isArray(f.difficulties) && f.difficulties.includes('ansiedade') ? 'as_vezes' : null), traits: f.traits || [], focus: f.focus || [] },
    },
    why,
  };
}
