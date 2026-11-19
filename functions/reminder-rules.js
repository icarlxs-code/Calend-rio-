/* Regras dos lembretes inteligentes.
   Arquivo compartilhado: usado pelo app (js/) e pelo servidor (functions/).
   Sem dependências: só JavaScript puro. */

export const TZ = 'America/Sao_Paulo';

export const TYPE_LABEL = {
  feed: 'Feed', carrossel: 'Carrossel', reels: 'Reels', story: 'Story',
  captacao: 'Captação', reuniao: 'Reunião', producao: 'Edição', outro: 'Tarefa',
};
const POSTS = ['feed', 'carrossel', 'reels', 'story'];
export const isPostType = (t) => POSTS.includes(t);
const VERB = { feed: 'publicar o feed', carrossel: 'publicar o carrossel', reels: 'postar o Reels', story: 'postar o story', captacao: 'a captação', reuniao: 'a reunião', producao: 'a edição', outro: 'a tarefa' };

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
export function reminderOffsets(ev) {
  const custom = Number.isFinite(ev.reminder) ? ev.reminder : 30;
  let list;
  // a cobrança depois do horário é feita por lateReminders (a cada 10 min)
  if (isPostType(ev.type)) list = [60, 30, 0];
  else if (ev.type === 'captacao') list = [1440, 60, 30];
  else if (ev.type === 'reuniao') list = [1440, 60, 15];
  else list = [60, 30, 0];
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
const LATE = [
  'Você disse que ia {fazer} às {h}. Já são {m} de atraso. Você não consegue honrar nem o que você mesmo prometeu? Vai lá e {faz} agora.',
  'Cada minuto que passa é menos dinheiro no seu bolso. Menos chance de conquistar aquilo que você tanto quer. {Faz} agora.',
  'A {co} confiou em você. Enquanto você enrola, ela perde alcance — e você perde credibilidade.',
  'Você quer ser grande, mas não cumpre nem o próprio horário? Grandes cumprem o que falam. {Faz} agora.',
  'Lembra do porquê você começou? Não foi pra ficar devendo post. Levanta e resolve.',
  'Quem você quer ser daqui a um ano não deixaria isso atrasar {m}. Prova que você é essa pessoa.',
  'Ninguém vai fazer por você. Ninguém vai lembrar das suas desculpas. Só do que você entregou.',
  'Você reclama de não crescer, mas deixa o trabalho parado? A resposta está nessa tarefa atrasada.',
  'Disciplina dói menos que arrependimento. {Faz} agora e tira esse peso das costas.',
  'Tem gente que daria tudo pra ter os clientes que você tem. E você está deixando eles esperando.',
  'Cada atraso é um tijolo a menos no seu sonho. {m} de atraso. Para de cavar o buraco e {faz} agora.',
  'Seu cliente paga você pra cumprir. Profissional não deixa pra depois. {Faz} já.',
  'Você é melhor que isso, e você sabe. Mostra agora: abre e {faz}.',
  'A preguiça está ganhando de você há {m}. Vai deixar ela vencer hoje?',
  'Palavra dada é palavra cumprida. Você marcou {h}. Honra o seu compromisso.',
  'O sucesso não aceita “depois eu faço”. Ele exige agora. {Faz}!',
  'Se fosse o seu dinheiro atrasado, você aceitaria? A {co} também não. {Faz} agora.',
  'Quem perde o horário perde o algoritmo, perde o cliente e perde o respeito. Não seja essa pessoa.',
];
const hashStr = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
/* Lista de cobranças de um evento atrasado: [{ late, at, title, body }] */
export function lateReminders(ev, startMs, company = '') {
  const post = isPostType(ev.type);
  const base = post ? startMs : startMs + (Number(ev.duration) || 30) * 60e3; // post: no horário; o resto: quando termina
  const what = `${TYPE_LABEL[ev.type] || 'Tarefa'}${company ? ' · ' + company : ''}`;
  const fazer = post ? 'postar' : 'fazer', faz = post ? 'posta' : 'faz', Faz = post ? 'Posta' : 'Faz';
  const h = hm(ev.time);
  const out = [];
  const h0 = hashStr(ev.id);
  for (let m = LATE_EVERY, k = 0; m <= LATE_MAX; m += LATE_EVERY, k++) {
    const at = base + m * 60e3;
    const brHour = new Date(at - 3 * 3600e3).getUTCHours();
    if (brHour >= 23 || brHour < 7) break; // não cobra de madrugada
    const text = LATE[k === 0 ? 0 : 1 + ((h0 + k) % (LATE.length - 1))].replace(/\{m\}/g, m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}` : `${m} min`)
      .replace(/\{co\}/g, company || 'empresa').replace(/\{fazer\}/g, fazer).replace(/\{faz\}/g, faz).replace(/\{Faz\}/g, Faz).replace(/\{h\}/g, h);
    out.push({ late: m, at, title: `⏰ Atrasado ${m >= 60 ? Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : '') : m + ' min'} · ${what}`, body: `${ev.title ? ev.title + '. ' : ''}${text}` });
  }
  return out;
}

export function reminderMessage(ev, offset, company = '') {
  const what = `${TYPE_LABEL[ev.type] || 'Tarefa'}${company ? ' · ' + company : ''}`;
  const title = ev.title ? `“${ev.title}”` : '';
  const at = hm(ev.time);
  const place = ev.location ? ` · ${ev.location}` : '';
  if (offset >= 1440) {
    return {
      title: `Amanhã: ${what} às ${at}`,
      body: ev.type === 'captacao'
        ? `Hoje: carregue baterias, esvazie os cartões e confirme com o cliente.${place}`
        : `${title}${place}`.trim() || 'Confirme o horário com o cliente.',
    };
  }
  if (offset > 0) {
    return { title: `Daqui a ${dur(offset)}: ${what}`, body: `${at} — ${VERB[ev.type] || 'a tarefa'}${title ? ' ' + title : ''}${place}` };
  }
  // na hora exata: pergunta se já foi feito
  if (offset === 0) {
    return {
      title: isPostType(ev.type) ? `Já postou? ${what}` : `Já fez? ${what}`,
      body: `Deu ${at}${title ? ' — ' + title : ''}. Se já ${isPostType(ev.type) ? 'postou' : 'fez'}, toque e marque como feito ✓`,
    };
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
  return kind === 'morning'
    ? { title: `Bom dia, ${name}! Seu dia hoje`, body: parts.join(' · ') }
    : { title: `${name}, amanhã você tem ${sorted.length} tarefa${sorted.length > 1 ? 's' : ''}`, body: parts.slice(1).join(' · ') };
}
