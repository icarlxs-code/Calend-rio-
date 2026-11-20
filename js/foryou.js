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
  return { age: ageOf(p.birth), gender, pronoun, style, diffs: new Set(p.difficulties || []), faith: !!p.faith, sleep: p.sleep || '22:30', wake: p.wake || '06:30', name: p.nickname || (p.name || '').split(' ')[0] || '' };
}
/* palavra no gênero da pessoa */
export const gx = (m, f, n) => g(m, f, n, who().pronoun);

/* próximo dia da semana (0=dom) a partir de hoje */
const nextDow = (dow, from = todayKey()) => { let d = from; for (let i = 0; i < 7; i++) { if (fromKey(d).getDay() === dow) return d; d = addDays(d, 1); } return from; };
const minus = (hm, min) => { const [h, m] = hm.split(':').map(Number); const t = (h * 60 + m - min + 1440) % 1440; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
const nextDate = (mmdd) => { const t = todayKey(); const y = +t.slice(0, 4); const d = `${y}-${mmdd}`; return d >= t ? d : `${y + 1}-${mmdd}`; };

/* Catálogo de sugestões. score: quanto maior, mais no topo. */
function catalog(w) {
  const a = w.age ?? 30;
  const out = [];
  const add = (id, title, cat, repeat, date, time, why, score) => out.push({ id, title, cat, repeat, date, time, why, score });
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
  if (w.faith) add('fe', 'Momento de oração', 'lembrete', 'daily', todayKey(), w.wake > '07:00' ? w.wake : '07:00', 'Todo dia, ao acordar', 45);
  return out;
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
  const bits = [w.age ? `seus ${w.age} anos` : '', w.diffs.size ? 'o que você marcou na ficha' : 'a sua rotina'].filter(Boolean);
  return `Pensado para ${bits.join(' e ')}. Um toque e vira lembrete que se repete sozinho.`;
}
