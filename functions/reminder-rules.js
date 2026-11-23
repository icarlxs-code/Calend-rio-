/* Regras dos lembretes inteligentes.
   Arquivo compartilhado: usado pelo app (js/) e pelo servidor (functions/).
   Sem dependências: só JavaScript puro. */

export const TZ = 'America/Sao_Paulo';

import { TYPE_DEFS } from './catalog.js';

/* Rótulos e verbos vêm do catálogo (todas as profissões) */
export const TYPE_LABEL = Object.fromEntries(Object.entries(TYPE_DEFS).map(([k, d]) => [k, d.label]));
TYPE_LABEL.outro = 'Tarefa';
export const isPostType = (t) => TYPE_DEFS[t]?.kind === 'post';
const VERB = Object.fromEntries(Object.entries(TYPE_DEFS).map(([k, d]) => [k, d.verb]));
const ASK = (t) => TYPE_DEFS[t]?.ask || 'Já fez?';

/* "13:00" -> "13h", "09:30" -> "9h30" */
export const hm = (t) => (t ? t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h') : '');
const toMin = (t) => {
  const [h, m] = String(t).split(':').map(Number);
  return h * 60 + m;
};
const dayNum = (k) => Math.round(Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10)) / 86400000);
export const addDaysKey = (k, n) => {
  const d = new Date(Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10) + n));
  return d.toISOString().slice(0, 10);
};

/* Data/hora atual no fuso de São Paulo */
export function nowIn(tz = TZ, date = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(date).map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

/* Quando lembrar (minutos antes). Negativo = depois do horário (cobrança). */
export function reminderOffsets(ev, persona = null) {
  const custom = Number.isFinite(ev.reminder) ? ev.reminder : 30;
  const def = TYPE_DEFS[ev.type] || TYPE_DEFS.outro;
  let list;
  // a cobrança depois do horário é feita por lateReminders
  if (persona && Array.isArray(persona.offsets) && persona.offsets.length) {
    // ficha da pessoa: quantos avisos e com quanta antecedência + os avisos de véspera do tipo (plantão, prova…)
    list = [...persona.offsets, ...def.offsets.filter((o) => o >= 1440), 0];
  } else list = [...def.offsets];
  if (custom >= 0 && !list.includes(custom)) list.push(custom);
  if (custom < 0) list = list.filter((o) => o < 0); // "Sem lembrete": só a cobrança
  return [...new Set(list)].sort((a, b) => b - a);
}

/* Lembretes que vencem agora (janela de alguns minutos para tolerar atrasos) */
export function dueReminders(events, now, windowMin = 4) {
  const nowAbs = dayNum(now.date) * 1440 + now.minutes;
  const out = [];
  events.forEach((ev) => {
    if (!ev || !ev.time || !ev.date || ev.status === 'feito') return;
    const evAbs = dayNum(ev.date) * 1440 + toMin(ev.time);
    reminderOffsets(ev).forEach((offset) => {
      if (offset < 0 && ev.status !== 'pendente') return; // cobrança só se ainda "a fazer"
      const fireAt = evAbs - offset;
      if (fireAt <= nowAbs && fireAt > nowAbs - windowMin) out.push({ ev, offset });
    });
  });
  return out;
}

const relDayText = (date, now) => {
  const diff = dayNum(date) - dayNum(now.date);
  if (diff === 0) return 'hoje';
  if (diff === 1) return 'amanhã';
  if (diff === -1) return 'ontem';
  const wd = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][new Date(Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10))).getUTCDay()];
  return `${wd}, ${date.slice(8, 10)}/${date.slice(5, 7)}`;
};
const dur = (min) => {
  if (min >= 60) {
    const h = Math.floor(min / 60), m = min % 60;
    return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
  }
  return `${min} min`;
};

/* Texto da notificação de lembrete */
/* ---------- atrasado: cobrança a cada 10 minutos até marcar como feito ---------- */
export const LATE_EVERY = 10, LATE_MAX = 180;
/* Tom firme (mexe com o ego) — servem para qualquer profissão */
const LATE_FIRME = [
  'Você disse que ia {fazer} às {h}. Já são {m} de atraso. Você não consegue honrar nem o que você mesmo prometeu? Vai lá e {faz} agora.',
  'Cada minuto que passa é menos dinheiro no seu bolso. Menos chance de conquistar aquilo que você tanto quer. Resolve agora.',
  'Você quer ser grande, mas não cumpre nem o próprio horário? Grandes cumprem o que falam. Vai agora.',
  'Lembra do porquê você começou? Não foi pra ficar devendo. Levanta e resolve.',
  'Quem você quer ser daqui a um ano não deixaria isso atrasar {m}. Prova que você é essa pessoa.',
  'Ninguém vai fazer por você. Ninguém vai lembrar das suas desculpas. Só do que você entregou.',
  'Você reclama de não crescer, mas deixa o compromisso parado? A resposta está nesse atraso.',
  'Disciplina dói menos que arrependimento. Resolve agora e tira esse peso das costas.',
  'Cada atraso é um tijolo a menos no seu sonho. {m} de atraso. Para de cavar o buraco.',
  'Profissional de verdade cumpre o horário. Você é profissional. Mostra agora.',
  'Você é melhor que isso, e você sabe. Mostra agora.',
  'A preguiça está ganhando de você há {m}. Vai deixar ela vencer hoje?',
  'Palavra dada é palavra cumprida. Você marcou {h}. Honra o seu compromisso.',
  'O sucesso não aceita “depois eu faço”. Ele exige agora.',
];
/* Para quem é cliente/empresa (marketing, vendas, serviços…) */
const LATE_CLIENTE = [
  'A {co} confiou em você. Enquanto você enrola, ela espera — e você perde credibilidade.',
  'Tem gente que daria tudo pra ter os clientes que você tem. E você está deixando eles esperando.',
  'Se fosse o seu dinheiro atrasado, você aceitaria? A {co} também não. Resolve agora.',
];
const LATE_POST = ['Quem perde o horário perde o algoritmo, perde o cliente e perde o respeito. Não seja essa pessoa.'];
/* Tom carinhoso */
const LATE_CARINHO = [
  'Ei, passou do horário de {fazer} ({h}). Tudo bem? Quando der, resolve e marca como feito 💜',
  'Ainda dá tempo! {m} de atraso não é o fim do mundo. Bora resolver?',
  'Lembrete com carinho: isso ficou pendente desde as {h}. Você consegue 💪',
  'Respira e faz só esse primeiro passo agora. O resto flui.',
  'Tô aqui torcendo por você. Resolve e tira isso da cabeça 😉',
  'Você já fez coisas muito mais difíceis hoje. Essa é rapidinha.',
];
/* Tom direto */
const LATE_DIRETO = [
  'Pendente desde {h} ({m}). Resolver agora.',
  'Atrasado {m}. Marque como feito quando concluir.',
  'Ainda não concluído: {fazer}. Prazo era {h}.',
  'Compromisso das {h} em aberto há {m}.',
];
const hashStr = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
/* Lista de cobranças de um evento atrasado: [{ late, at, title, body }].
   persona (da ficha): de quanto em quanto tempo cobrar, até quando e em que tom. */
/* compromisso longo (plantão, turno, serviço, aula dupla…): começou ≠ atrasou */
export const isLong = (ev) => (Number(ev.duration) || (TYPE_DEFS[ev.type] || TYPE_DEFS.outro).dur || 30) >= 180;
export function lateReminders(ev, startMs, company = '', persona = null, opts = {}) {
  const post = isPostType(ev.type);
  const def = TYPE_DEFS[ev.type] || TYPE_DEFS.outro;
  const base = post ? startMs : startMs + (Number(ev.duration) || def.dur || 30) * 60e3; // post: no horário; o resto: quando termina
  // plantão/turno longo: não faz sentido cobrar "atraso" depois que já aconteceu; só um lembrete gentil de marcar como feito
  if (!post && isLong(ev)) {
    const at = base + 15 * 60e3;
    const brHour = new Date(at - 3 * 3600e3).getUTCHours();
    if (brHour >= 23 || brHour < 7) return [];
    return [{ late: 15, at, title: `✓ Terminou: ${TYPE_LABEL[ev.type] || 'Tarefa'}${company ? ' · ' + company : ''}`, body: `${ev.title ? ev.title + '. ' : ''}Toque e marque como feito para fechar o dia. Bom descanso!` }];
  }
  const what = `${TYPE_LABEL[ev.type] || 'Tarefa'}${company ? ' · ' + company : ''}`;
  const verbo = def.verb || 'fazer';
  const every = persona?.lateEvery || LATE_EVERY;
  const max = persona?.lateMax ?? LATE_MAX;
  const tone = persona?.tone || 'firme';
  const pool = tone === 'carinhoso' ? LATE_CARINHO : tone === 'direto' ? LATE_DIRETO
    : [...LATE_FIRME, ...(opts.clientLike && company ? LATE_CLIENTE : []), ...(post ? LATE_POST : [])];
  const h = hm(ev.time);
  const out = [];
  const h0 = hashStr(ev.id);
  for (let m = every, k = 0; m <= max; m += every, k++) {
    const at = base + m * 60e3;
    const brHour = new Date(at - 3 * 3600e3).getUTCHours();
    if (brHour >= 23 || brHour < 7) break; // não cobra de madrugada
    const mt = m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}` : `${m} min`;
    const text = pool[k === 0 ? 0 : 1 + ((h0 + k) % (pool.length - 1))].replace(/\{m\}/g, mt)
      .replace(/\{co\}/g, company || 'empresa').replace(/\{fazer\}/g, verbo).replace(/\{faz\}/g, post ? 'posta' : 'faz').replace(/\{h\}/g, h);
    out.push({ late: m, at, title: `⏰ Atrasado ${mt} · ${what}`, body: `${ev.title ? ev.title + '. ' : ''}${text}` });
  }
  return out;
}

export function reminderMessage(ev, offset, company = '') {
  const what = `${TYPE_LABEL[ev.type] || 'Tarefa'}${company ? ' · ' + company : ''}`;
  const title = ev.title ? `“${ev.title}”` : '';
  const at = hm(ev.time);
  const place = ev.location ? ` · ${ev.location}` : '';
  if (offset >= 1440) {
    const days = Math.round(offset / 1440);
    return {
      title: `${days === 1 ? 'Amanhã' : `Em ${days} dias`}: ${what} às ${at}`,
      body: ev.type === 'captacao'
        ? `Hoje: carregue baterias, esvazie os cartões e confirme com o cliente.${place}`
        : `${title}${place}`.trim() || 'Já se organize para não pegar ninguém de surpresa.',
    };
  }
  const k = hashStr(`${ev.id}|${offset}|${ev.date}`);
  const tema = `${VERB[ev.type] || 'a tarefa'}${title ? ' ' + title : ''}`;
  if (offset > 0) {
    // antes da hora: o título diz o essencial (quanto falta e o quê); o texto varia, com um toque de humor
    const ANTES = [
      `${at} — ${tema}${place}`,
      `Plim! 🔔 Às ${at} tem ${tema}${place}. Quem se adianta não se atrasa 😉`,
      `Às ${at}: ${tema}${place}. Já vai separando o que precisa.`,
      `${tema} às ${at}${place}. Eu lembro, você arrasa 💪`,
      `Contagem regressiva ⏳ ${tema} às ${at}${place}.`,
      `Um toque do seu sino: ${tema} às ${at}${place} 🔔`,
    ];
    return { title: `Daqui a ${dur(offset)}: ${what}`, body: ANTES[k % ANTES.length] };
  }
  // na hora exata: pergunta se já foi feito
  if (offset === 0) {
    // plantão/turno: começa agora — a pergunta é se chegou, e o "feito" é no fim
    if (isLong(ev) && !isPostType(ev.type)) {
      return { title: `${ASK(ev.type)} ${what}`, body: `Começa agora, às ${at}${title ? ' — ' + title : ''}${place}. Bom trabalho! Quando terminar, marque como feito ✓` };
    }
    const AGORA = [
      `Deu ${at}${title ? ' — ' + title : ''}. Se já resolveu, toque e marque como feito ✓`,
      `É agora${title ? ': ' + title : ''}! Feito? Um toque e risca da lista ✓`,
      `${at} em ponto${title ? ' — ' + title : ''}. Bateu o sino, bateu a hora 🔔`,
      `Hora H${title ? ': ' + title : ''}. Quando terminar, marca como feito pra ganhar XP ✨`,
    ];
    return { title: `${ASK(ev.type)} ${what}`, body: AGORA[k % AGORA.length] };
  }
  return {
    title: `Atrasado: ${what}`,
    body: `Era às ${at}${title ? ' — ' + title : ''} e ainda não foi marcado como feito. Já ${isPostType(ev.type) ? 'postou' : 'fez'}? Toque para marcar.`,
  };
}

/* Texto da notificação quando o parceiro mexe na agenda */
export function changeMessage(before, after, { actor = 'Alguém', company = '', recipient = null, now } = {}) {
  const ev = after || before;
  const what = `${TYPE_LABEL[ev.type] || 'Tarefa'}${company ? ' · ' + company : ''}`;
  const when = (e) => `${relDayText(e.date, now)}${e.time ? ', ' + hm(e.time) : ''}`;
  const forMe = (e) => recipient && (e.assignees || []).includes(recipient);
  if (!before && after) {
    return {
      title: forMe(after) ? `${actor} marcou para você` : `${actor} adicionou na agenda`,
      body: `${what} — ${when(after)}${after.title ? ' · ' + after.title : ''}`,
    };
  }
  if (before && !after) return { title: `${actor} removeu da agenda`, body: `${what} — ${when(before)}` };
  // edições
  if (before.status !== 'feito' && after.status === 'feito') return { title: `${actor} concluiu ✓`, body: `${what} — ${when(after)}` };
  const wasMine = forMe(before), isMine = forMe(after);
  if (!wasMine && isMine) return { title: `${actor} passou para você`, body: `${what} — ${when(after)}${after.title ? ' · ' + after.title : ''}` };
  if (wasMine && !isMine) return { title: `${actor} assumiu uma tarefa sua`, body: `${what} — ${when(after)}` };
  if (before.date !== after.date || before.time !== after.time) return { title: `${actor} mudou o horário`, body: `${what}: ${when(before)} → ${when(after)}` };
  return null; // mudança pequena (texto, legenda): não incomoda ninguém
}

/* Resumo do dia (8h) e da véspera (20h) */
export function dailyMessage(kind, name, events, companyOf) {
  if (!events.length) return null;
  const sorted = [...events].sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const first = sorted.find((e) => e.time) || sorted[0];
  const posts = sorted.filter((e) => isPostType(e.type)).length;
  const outs = sorted.filter((e) => e.type === 'captacao' || e.type === 'reuniao');
  const line = (e) => `${hm(e.time)} ${TYPE_LABEL[e.type]}${companyOf(e) ? ' · ' + companyOf(e) : ''}`;
  const parts = [`${sorted.length} tarefa${sorted.length > 1 ? 's' : ''} (${posts} post${posts === 1 ? '' : 's'})`, `primeira: ${line(first)}`];
  if (outs.length) parts.push(`sai para ${outs.map((e) => `${companyOf(e) || TYPE_LABEL[e.type]} às ${hm(e.time)}`).join(' e ')}`);
  const k = hashStr(`${kind}|${first.date}|${name}`), n = sorted.length;
  if (kind === 'morning') {
    const T = [`Bom dia, ${name}! Seu dia hoje`, `☀️ ${name}, o dia já tem roteiro`, `☕ Café e agenda, ${name}?`, `🔔 Plim! Bom dia, ${name}`];
    const fim = ['', ' · Risca tudo e o dia fica 100% 🏆', ' · Um de cada vez, sem pressa', ' · Bora fazer valer'];
    return { title: T[k % T.length], body: parts.join(' · ') + fim[(k >>> 3) % fim.length] };
  }
  const T = [`${name}, amanhã você tem ${n} tarefa${n > 1 ? 's' : ''}`, `🌙 Amanhã: ${n} na agenda`, `${name}, spoiler de amanhã: ${n} tarefa${n > 1 ? 's' : ''} 👀`, `Deixa o amanhã comigo, ${name}: ${n} tarefa${n > 1 ? 's' : ''}`];
  return { title: T[k % T.length], body: parts.slice(1).join(' · ') };
}
