/* "Feito para você": sugestões do modo Pessoal calculadas a partir da ficha.
   Pesa a identidade (como a pessoa se identifica e como quer ser tratada), a idade, as dificuldades
   que marcou, a rotina (acordar/dormir) e se quer mensagens de fé. Cada sugestão vira, com um toque,
   um lembrete que repete sozinho no ritmo certo. */
import { store } from './store.js';
import { ageOf, g } from './persona.js';
import { personal, savePersonal } from './personal.js';
import { todayKey, addDays, fromKey } from './utils.js';

export function who() {
  const p = store.profile || {};
  const gender = p.gender || '';
  const pronoun = ['f', 'm', 'n'].includes(p.pronoun) ? p.pronoun : /^mulher/.test(gender) ? 'f' : /^homem/.test(gender) ? 'm' : 'n';
  // cuidado pessoal segue o tratamento escolhido (uma mulher trans recebe as sugestões femininas, um homem trans as masculinas)
  const style = /^mulher/.test(gender) ? 'f' : /^homem/.test(gender) ? 'm' : pronoun;
  const set = (a) => new Set(Array.isArray(a) ? a : []);
  return { age: ageOf(p.birth), gender, pronoun, style, diffs: set(p.difficulties), faith: !!p.faith, religion: p.religion || '', sleep: p.sleep || '22:30', wake: p.wake || '06:30', lunch: p.lunch || '12:00',
    name: p.nickname || (p.name || '').split(' ')[0] || '', goal: p.goal || '', journey: p.journey || '', traits: set(p.traits), focus: set(p.focus), likes: set(p.likes),
    selfesteem: p.selfesteem || '', anxiety: p.anxiety || '', motivation: p.motivationLevel || '', workDays: Array.isArray(p.workDays) ? p.workDays : [1, 2, 3, 4, 5], profession: p.profession || '' };
}
/* palavra no gênero da pessoa */
export const gx = (m, f, n) => g(m, f, n, who().pronoun);

/* próximo dia da semana (0=dom) a partir de hoje */
const nextDow = (dow, from = todayKey()) => { let d = from; for (let i = 0; i < 7; i++) { if (fromKey(d).getDay() === dow) return d; d = addDays(d, 1); } return from; };
const minus = (hm, min) => { const [h, m] = hm.split(':').map(Number); const t = (h * 60 + m - min + 1440) % 1440; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
const nextDate = (mmdd) => { const t = todayKey(); const y = +t.slice(0, 4); const d = `${y}-${mmdd}`; return d >= t ? d : `${y + 1}-${mmdd}`; };

const FAITH_TITLE = { catolica: 'Oração do dia (terço ou Palavra)', evangelica: 'Devocional: oração e leitura da Bíblia', protestante: 'Devocional: oração e leitura da Bíblia', crista: 'Momento de oração e Palavra', adventista: 'Devocional da manhã', espirita: 'Prece e leitura do Evangelho', umbanda: 'Momento de oração e firmeza', candomble: 'Momento de reza e conexão', judaica: 'Momento de oração (tefilá)', islamica: 'Salah: lembrete de oração', budista: 'Meditação da manhã', hindu: 'Momento de oração e meditação', espiritualizado: 'Momento de silêncio e gratidão' };
/* Catálogo de sugestões. score: quanto maior, mais no topo. */
function catalog(w) {
  const a = w.age ?? 30;
  const out = [];
  const LOOK = { telas: ['moon', ['#5E5CE6', '#5E5CE6']], respirar: ['droplet', ['#30B0C7', '#30B0C7']], niveres: ['cake', ['#FF2D55', '#FF2D55']], familia: ['heart', ['#FF375F', '#FF375F']], semana: ['cal2', ['#0A84FF', '#0A84FF']], revisar: ['clock', ['#FF9500', '#FF9500']], fe: ['sun', ['#FFB800', '#FFB800']], autocuidado: ['heart', ['#AF52DE', '#AF52DE']] };
  const add = (id, title, cat, repeat, date, time, why, score) => out.push({ id, title, cat, repeat, date, time, why, score, ...(LOOK[id] ? { ic: LOOK[id][0], g: LOOK[id][1] } : {}) });
  // cuidado pessoal (conforme a identidade)
  if (w.style === 'm') {
    add('cabelo', 'Cortar o cabelo', 'beleza', 'monthly', nextDow(6), '10:00', 'Todo mês, para nunca passar do ponto', 90);
    add('barba', 'Aparar a barba', 'beleza', 'weekly', nextDow(0), '09:00', 'Toda semana, no domingo de manhã', 70);
  } else if (w.style === 'f') {
    add('unhas', 'Fazer as unhas', 'beleza', 'biweekly', nextDow(6), '10:00', 'A cada 2 semanas', 90);
    add('salao', 'Salão: hidratar o cabelo', 'beleza', 'monthly', nextDow(6), '14:00', 'Todo mês', 75);
    add('sobrancelha', 'Fazer a sobrancelha', 'beleza', 'monthly', nextDow(5), '18:30', 'Todo mês', 65);
  } else {
    add('cabelo', 'Cortar o cabelo', 'beleza', 'monthly', nextDow(6), '10:00', 'Todo mês', 85);
    add('autocuidado', 'Momento de autocuidado', 'beleza', 'weekly', nextDow(0), '10:00', 'Uma pausa só sua, toda semana', 70);
  }
  // saúde conforme a idade (consultas de rotina — o médico define o resto)
  add('dentista', 'Dentista: revisão e limpeza', 'saude', 'yearly', addDays(todayKey(), 14), '09:00', 'Uma vez por ano, no mínimo', a >= 25 ? 60 : 50);
  if (a >= 30) add('checkup', 'Check-up anual (exames de rotina)', 'saude', 'yearly', addDays(todayKey(), 21), '08:00', `Aos ${a} anos, todo ano vale a pena`, 55 + Math.min(30, a - 30));
  if (a >= 25 && w.style === 'f') add('gineco', 'Consulta ginecológica de rotina', 'saude', 'yearly', addDays(todayKey(), 28), '09:00', 'Uma vez por ano', 50 + (a >= 40 ? 25 : 0));
  if (a >= 45 && w.style === 'm') add('uro', 'Consulta com urologista (rotina)', 'saude', 'yearly', addDays(todayKey(), 28), '09:00', `A partir dos 45, todo ano`, 70);
  if (a >= 45) add('pressao', 'Medir a pressão', 'saude', 'monthly', addDays(todayKey(), 3), '09:00', 'Todo mês, rapidinho na farmácia', 50 + (a >= 60 ? 25 : 0));
  if (a >= 60) add('gripe', 'Vacina da gripe (campanha do ano)', 'saude', 'yearly', nextDate('04-15'), '09:00', 'Todo ano, em abril', 80);
  if (a < 45) add('treino', 'Treino / atividade física', 'saude', 'weekly', nextDow(1), '07:00', 'Toda semana: o corpo agradece', 55 + (a < 30 ? 10 : 0));
  else add('caminhada', 'Caminhada de 30 minutos', 'saude', 'weekly', nextDow(6), '07:30', 'Toda semana, no seu ritmo', 60);
  // dificuldades que a pessoa marcou
  if (w.diffs.has('sono')) add('telas', 'Desligar as telas e relaxar', 'lembrete', 'daily', todayKey(), minus(w.sleep, 30), `Todo dia, 30 min antes de dormir (${w.sleep.replace(':', 'h')})`, 85);
  if (w.diffs.has('ansiedade')) add('respirar', 'Pausa de 5 minutos para respirar', 'lembrete', 'daily', todayKey(), '15:00', 'Todo dia à tarde', 80);
  if (w.diffs.has('datas')) add('niveres', 'Cadastrar os aniversários da família', 'lembrete', 'none', todayKey(), '20:00', 'Uma vez: depois o Lembra avisa sozinho', 88);
  if (w.diffs.has('equilibrio')) add('familia', 'Tempo de qualidade com quem eu amo', 'compromisso', 'weekly', nextDow(0), '16:00', 'Toda semana, sem celular', 75);
  if (w.diffs.has('desorganizacao') || w.diffs.has('sobrecarga')) add('semana', 'Planejar a semana (10 minutos)', 'lembrete', 'weekly', nextDow(0), '19:00', 'Domingo à noite: a semana começa leve', 78);
  if (w.diffs.has('prazos')) add('revisar', 'Revisar prazos da semana', 'lembrete', 'weekly', nextDow(1), minus(w.wake, -60), 'Segunda cedo, antes de tudo', 70);
  // vida adulta
  if (a >= 18) add('contas', 'Pagar as contas do mês', 'pagar', 'monthly', (() => {
    const t = todayKey(); let y = +t.slice(0, 4), m = +t.slice(5, 7);
    if (+t.slice(8) > 5) { m++; if (m > 12) { m = 1; y++; } }
    return `${y}-${String(m).padStart(2, '0')}-05`;
  })(), '09:00', 'Todo dia 5: sem juros, sem susto', 58);
  if (w.faith) add('fe', FAITH_TITLE[w.religion] || 'Momento de oração', 'lembrete', 'daily', todayKey(), w.wake > '07:00' ? w.wake : '07:00', 'Todo dia, ao acordar · você pediu mensagens de fé', 62);
  if (w.faith && /catolica|evangelica|protestante|crista|adventista|ortodoxa|sud|testemunha/.test(w.religion)) add('culto', w.religion === 'catolica' ? 'Missa de domingo' : w.religion === 'adventista' ? 'Culto de sábado' : 'Culto / reunião da igreja', 'compromisso', 'weekly', nextDow(w.religion === 'adventista' ? 6 : 0), w.religion === 'adventista' ? '09:00' : '18:00', 'Toda semana · da sua religião', 66);
  if (w.faith && w.religion === 'espirita') add('estudo_espirita', 'Estudo / palestra no centro espírita', 'compromisso', 'weekly', nextDow(3), '20:00', 'Toda semana · da sua crença', 60);

  // o que a pessoa quer trabalhar em si (ficha "Você por dentro")
  const F = w.focus, T = w.traits;
  if (F.has('autoestima') || w.selfesteem === 'baixa') add('gratidao3', 'Escrever 3 coisas boas sobre mim', 'lembrete', 'daily', todayKey(), minus(w.sleep, 45), 'Todo dia antes de dormir · para fortalecer a autoestima', 74 + (w.selfesteem === 'baixa' ? 10 : 0));
  if (F.has('ansiedade') || w.anxiety === 'muita') add('respirar', 'Pausa de 5 minutos para respirar', 'lembrete', 'daily', todayKey(), '15:00', 'Todo dia à tarde · você marcou ansiedade', 82);
  if (F.has('foco') || T.has('procrastinador') || w.diffs.has('procrastinar')) add('foco25', 'Bloco de foco: 25 min sem celular', 'lembrete', 'daily', todayKey(), minus(w.wake, -180), 'Todo dia de manhã · técnica Pomodoro, ótima pra quem deixa pra depois', 76);
  if (F.has('disciplina')) add('rotina_manha', 'Rotina da manhã: cama, água e plano do dia', 'lembrete', 'daily', todayKey(), minus(w.wake, -10), 'Todo dia ao acordar · disciplina começa pequena', 70);
  if (F.has('relacionamentos')) add('ligar', 'Ligar para alguém que eu gosto', 'lembrete', 'weekly', nextDow(3), '19:30', 'Toda semana · relacionamentos se cultivam', 68);
  if (F.has('dinheiro') || w.goal === 'carreira') add('financas', 'Revisar gastos e guardar um pouco', 'pagar', 'weekly', nextDow(0), '18:00', 'Toda semana, 10 minutos · você quer cuidar do dinheiro', 72);
  if (F.has('gratidao')) add('gratidao', 'Agradecer por 1 coisa do dia', 'lembrete', 'daily', todayKey(), minus(w.sleep, 20), 'Todo dia antes de dormir · gratidão muda o humor', 64);
  if (F.has('descanso')) add('desligar', 'Desligar do trabalho e descansar', 'lembrete', 'daily', todayKey(), '19:00', 'Todo dia · descanso também é produtividade', 66);
  if (F.has('saude') || w.goal === 'saude') add('agua2l', 'Garrafa de água cheia na mesa', 'saude', 'daily', todayKey(), minus(w.wake, -60), 'Todo dia de manhã · você quer cuidar do corpo', 63);
  if (T.has('perfeccionista')) add('feito', 'Entregar algo “bom o suficiente” hoje', 'lembrete', 'weekly', nextDow(2), '10:00', 'Feito é melhor que perfeito · pra quem é perfeccionista', 58);
  if (T.has('sonhador')) add('sonho', 'Um passo pequeno no meu sonho', 'lembrete', 'weekly', nextDow(6), '11:00', 'Toda semana · sonho com prazo vira plano', 62);
  if (T.has('competitivo')) add('meta_sem', 'Definir a meta da semana (e bater!)', 'lembrete', 'weekly', nextDow(1), minus(w.wake, -45), 'Segunda cedo · pra quem gosta de desafio', 61);
  if (w.motivation === 'baixa') add('vitoria', 'Comemorar uma pequena vitória', 'lembrete', 'daily', todayKey(), '18:00', 'Todo dia · motivação nasce de vitórias pequenas', 70);

  // o que a pessoa curte fazer
  const L = w.likes, wkend = nextDow(6);
  const LIKE = {
    leitura: ['ler', 'Ler 10 páginas de um livro', 'lembrete', 'daily', todayKey(), minus(w.sleep, 60), 'Todo dia antes de dormir · você curte ler'],
    esporte: ['treino', 'Treino / academia', 'saude', 'weekly', nextDow(1), '07:00', 'Toda semana · você curte esporte'],
    corrida: ['corrida', 'Corrida ou caminhada ao ar livre', 'saude', 'weekly', wkend, '07:00', 'Fim de semana de manhã · você curte correr'],
    musica: ['musica', 'Playlist nova pra semana', 'lembrete', 'weekly', nextDow(1), '08:00', 'Toda segunda · você curte música'],
    cozinhar: ['receita', 'Testar uma receita nova', 'compromisso', 'weekly', wkend, '11:00', 'Fim de semana · você curte cozinhar'],
    series: ['filme', 'Noite de filme ou série (sem culpa)', 'compromisso', 'weekly', nextDow(5), '20:30', 'Sexta à noite · você curte séries'],
    games: ['games', 'Jogar depois das tarefas do dia', 'lembrete', 'weekly', nextDow(5), '21:00', 'Recompensa da semana · você curte games'],
    natureza: ['natureza', 'Passeio ao ar livre (parque, praia, trilha)', 'compromisso', 'monthly', wkend, '09:00', 'Todo mês · você curte natureza'],
    viagem: ['viagem', 'Planejar a próxima viagem', 'lembrete', 'monthly', nextDow(0), '16:00', 'Todo mês, 20 minutos · você curte viajar'],
    arte: ['arte', 'Tempo criativo: desenhar, pintar, criar', 'lembrete', 'weekly', wkend, '15:00', 'Toda semana · você curte arte'],
    danca: ['danca', 'Dançar uma música inteira', 'lembrete', 'weekly', nextDow(3), '19:00', 'Toda semana · você curte dançar'],
    pets: ['pet', 'Vacina e vermífugo do pet', 'saude', 'yearly', addDays(todayKey(), 20), '10:00', 'Todo ano · você tem/curte pets'],
    moda: ['guarda_roupa', 'Organizar o guarda-roupa', 'lembrete', 'monthly', wkend, '10:00', 'Todo mês · você curte moda'],
    estudar: ['curso', 'Estudar algo novo (30 min)', 'lembrete', 'weekly', nextDow(2), '20:00', 'Toda semana · você curte aprender'],
    amigos: ['amigos', 'Marcar algo com os amigos', 'compromisso', 'biweekly', nextDow(5), '19:00', 'A cada 2 semanas · você curte sair com amigos'],
    familia: ['familia', 'Tempo de qualidade com quem eu amo', 'compromisso', 'weekly', nextDow(0), '16:00', 'Toda semana, sem celular · você curte a família'],
    igreja: ['culto', 'Culto / reunião da igreja', 'compromisso', 'weekly', nextDow(0), '18:00', 'Toda semana · você curte a comunidade'],
    meditacao: ['meditar', 'Meditação ou yoga (10 min)', 'lembrete', 'daily', todayKey(), minus(w.wake, -20), 'Todo dia de manhã · você curte meditar'],
    jardinagem: ['regar', 'Regar as plantas', 'lembrete', 'weekly', nextDow(3), '08:00', 'Toda semana · você curte plantas'],
    voluntariado: ['ajudar', 'Ajudar alguém ou fazer voluntariado', 'compromisso', 'monthly', wkend, '09:00', 'Todo mês · você curte ajudar'],
  };
  for (const k of L) if (LIKE[k]) { const [id, title, cat, rep, date, time, why] = LIKE[k]; if (!out.some((x) => x.id === id)) add(id, title, cat, rep, date, time, why, 86); else { const o = out.find((x) => x.id === id); o.score = Math.max(o.score, 86); o.why = why; } }

  // objetivo e jornada
  if (w.goal === 'tempo') add('folga', 'Bloquear 1h só pra mim', 'compromisso', 'weekly', nextDow(3), '19:00', 'Toda semana · seu objetivo é ter mais tempo livre', 72);
  if (w.goal === 'carreira') add('carreira', 'Atualizar currículo / aprender algo da área', 'lembrete', 'monthly', nextDow(6), '10:00', 'Todo mês · seu objetivo é crescer na carreira', 68);
  if (w.journey === 'plantao' || w.journey === 'turnos') add('sono_plantao', 'Dormir depois do plantão (proteger o descanso)', 'lembrete', 'weekly', nextDow(2), '08:00', 'Quem trabalha em escala precisa repor o sono', 67);
  if (w.journey === 'estudo') add('revisao', 'Revisar a matéria da semana', 'lembrete', 'weekly', nextDow(6), '15:00', 'Toda semana · você estuda', 74);
  if (w.diffs.has('agua')) add('agua2l', 'Garrafa de água cheia na mesa', 'saude', 'daily', todayKey(), minus(w.wake, -60), 'Todo dia · você marcou que esquece de beber água', 77);
  if (w.diffs.has('comer')) add('almoco', 'Parar para almoçar de verdade', 'lembrete', 'daily', todayKey(), w.lunch, `Todo dia às ${w.lunch.replace(':', 'h')} · você marcou que pula refeições`, 80);
  // a mesma sugestão pode ter vindo de dois lugares: fica a de maior peso
  const best = new Map();
  for (const x of out) if (!best.has(x.id) || best.get(x.id).score < x.score) best.set(x.id, x);
  return [...best.values()];
}

/* Sugestões que ainda não viraram lembrete (as mais relevantes primeiro) */
export function suggestions(limit = 6) {
  if (!store.profile?.onboardedAt) return [];
  const have = new Set(personal.events.map((e) => e.sug).filter(Boolean));
  const titles = new Set(personal.events.map((e) => (e.title || '').toLowerCase()));
  const hidden = new Set(personal.prefs.sugHidden || []);
  return catalog(who()).filter((s) => !have.has(s.id) && !hidden.has(s.id) && !titles.has(s.title.toLowerCase())).sort((a, b) => b.score - a.score).slice(0, limit);
}
export function addSuggestion(id) {
  const s = catalog(who()).find((x) => x.id === id);
  if (!s) return null;
  return savePersonal({ title: s.title, cat: s.cat, date: s.date, time: s.time, repeat: s.repeat, sug: s.id, note: '' });
}
export function hideSuggestion(id) {
  const prefs = personal.prefs;
  return savePersonal({ ...prefs, id: 'prefs', kind: 'prefs', sugHidden: [...new Set([...(prefs.sugHidden || []), id])].slice(-40) });
}
/* frase do topo da seção, no tom da pessoa */
export function forYouLead() {
  const w = who();
  const bits = [w.age ? `seus ${w.age} anos` : '', w.likes.size ? 'o que você curte' : '', w.focus.size || w.diffs.size ? 'o que você quer melhorar' : 'a sua rotina'].filter(Boolean);
  return `Pensado para ${bits.slice(0, -1).join(', ')}${bits.length > 1 ? ' e ' : ''}${bits.at(-1)}. Um toque e vira lembrete que se repete sozinho.`;
}
