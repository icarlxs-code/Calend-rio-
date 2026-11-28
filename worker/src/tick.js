/* Relógio do servidor (a cada minuto + continuações rápidas): em vez de reler a agenda de TODO MUNDO
   a cada minuto, olha só a fila de "quem está na hora" (dueOf(env)) e manda em lotes pequenos,
   para caber no limite grátis da Cloudflare (10 ms de processamento e 50 envios por execução).
   Chaves da fila:
     rem:{ws}     lembretes da agenda de trabalho (schedule:{ws}; enviados em ssent:{ws})
     per:{pessoa} lembretes do Pessoal (pitems:{pessoa}; enviados em psent:{pessoa})
     amg:{pessoa} o "amigo" do Pessoal (pc:{pessoa})
     cch:{pessoa} dicas de trabalho (co:{pessoa}) */
import { ehRemedio, barra } from '../../functions/remedio.js';
import { dueOf } from './kvsql.js';
import { amigoOne, splitLegacyAmigo } from './pcoach.js';
import { coachOne } from './coach.js';
import { upgradeSubs } from './devices.js';
import { regAll, regGet, idOfWs } from './registry.js';

const WINDOW = 15 * 60e3; // um lembrete atrasado até 15 min ainda sai (depois disso, não incomoda mais)
const PER_KEY = 6;        // no máximo 6 lembretes de uma pessoa por vez (o resto sai na continuação)
const prune = (sent, now) => { for (const [k, t] of Object.entries(sent)) if (t < now - 3 * 86400e3) delete sent[k]; return sent; };
const scheduleKey = (ws) => (ws === 'main' ? 'schedule' : `schedule:${ws}`);

/* próximo horário de uma lista (o que ainda não saiu e ainda vale) */
export function nextOf(items, sent, now) {
  let best = null;
  for (const it of items || []) {
    if (!it || !Number.isFinite(it.at) || sent[it.id] || it.at <= now - WINDOW) continue;
    if (best === null || it.at < best) best = it.at;
  }
  return best === null ? null : Math.max(best, now);
}
/* depois que o app manda a lista nova: marca na fila quando olhar */
export async function planReminders(env, ws, items, now = Date.now()) {
  const sent = (await env.CAL.get(`ssent:${ws}`, 'json')) || {};
  const at = nextOf(items, sent, now);
  const D = dueOf(env);
  if (at === null) await D.del(`rem:${ws}`); else await D.set(`rem:${ws}`, at);
}
export async function planPersonal(env, member, items, now = Date.now()) {
  const sent = (await env.CAL.get(`psent:${member}`, 'json')) || {};
  const at = nextOf(items, sent, now);
  const D = dueOf(env);
  if (at === null) await D.del(`per:${member}`); else await D.set(`per:${member}`, at);
}
/* pessoa com plano ativo: garante que o amigo e as dicas estão na fila */
export async function seedPerson(env, id, now = Date.now(), { soAmigo = false } = {}) {
  const D = dueOf(env);
  if ((await D.get(`amg:${id}`)) === null) await D.set(`amg:${id}`, now);
  if (!soAmigo && (await D.get(`cch:${id}`)) === null) await D.set(`cch:${id}`, now);
}
/* uma vez: põe na fila do bom dia / boa noite quem ficou de fora (sem plano ativo) */
export async function seedTodos(env, now = Date.now()) {
  const marca = 'seed-amg:v1';
  if (await env.CAL.get(marca)) return 0;
  await env.CAL.put(marca, String(now));
  let n = 0;
  const D = dueOf(env);
  for (const id of Object.keys(await regAll(env))) { await D.set(`amg:${id}`, now); n++; } // já olha agora: quem ficou sem o bom dia de hoje recebe na hora (quem já recebeu não repete)
  console.log(`bom dia para todos: ${n} pessoas na fila`);
  return n;
}

/* manda o que venceu de uma lista; devolve quantos e grava o próximo horário */
async function dueList(env, { itemsKey, sentKey, dueKey, member, send, now, pref }) {
  const raw = await env.CAL.get(itemsKey, 'json');
  const items = Array.isArray(raw) ? raw : (raw && raw.items) || [];
  const sent = (await env.CAL.get(sentKey, 'json')) || {};
  const due = items.filter((it) => it && Number.isFinite(it.at) && it.at <= now && it.at > now - WINDOW && !sent[it.id]).sort((a, b) => a.at - b.at);
  const batch = due.slice(0, PER_KEY);
  prune(sent, now);
  // avisos pessoais guardados antes desta versão ainda podem trazer o nome do remédio
  let nomes = [];
  if (member && batch.length) { const pr = await env.CAL.get(`pprofile:${member}`, 'json'); nomes = [...(pr?.today || []), ...(pr?.tomorrow || []), ...(pr?.overdue || [])].filter(ehRemedio).map((x) => x.title); }
  for (const it of batch) {
    // marca um por um, logo antes de enviar: nunca repete e, se a rodada for cortada, perde no máximo um
    sent[it.id] = now;
    await env.CAL.put(sentKey, JSON.stringify(sent));
    const seguro = barra(it, nomes);
    await send(env, member || it.member, { title: seguro.title, body: seguro.body, tag: it.tag, url: it.url, ...(it.badge !== undefined ? { badge: it.badge } : {}) }, pref ? (it.kind || pref) : undefined);
  }
  // relê do banco: se a pessoa mandou uma lista nova enquanto os avisos saíam, vale a nova
  const D = dueOf(env);
  let next = now;
  if (due.length <= batch.length) {
    const raw2 = batch.length ? await env.CAL.get(itemsKey, 'json') : raw;
    const items2 = Array.isArray(raw2) ? raw2 : (raw2 && raw2.items) || [];
    const sent2 = batch.length ? (await env.CAL.get(sentKey, 'json')) || {} : sent;
    next = nextOf(items2, sent2, now + 1);
  }
  if (next === null) await D.del(dueKey); else await D.set(dueKey, next);
  if (batch.length && env.USAGE) { env.USAGE[member ? 'pessoais' : 'lembretes'] = (env.USAGE[member ? 'pessoais' : 'lembretes'] || 0) + batch.length; }
  return batch.length;
}

/* Uma vez só, na primeira vez que o servidor novo roda: separa o que era guardado "todo mundo junto"
   e coloca na fila quem já usava o app. */
const upgradedEnv = new WeakSet();
export async function upgradeLegacy(env, now = Date.now()) {
  if (upgradedEnv.has(env.CAL)) return;
  if (await env.CAL.get('upgraded:v2')) { upgradedEnv.add(env.CAL); return; }
  await upgradeSubs(env);
  await splitLegacyAmigo(env);
  // dicas de trabalho: estado de todo mundo numa chave → uma por pessoa
  const co = await env.CAL.get('coach', 'json');
  if (co && typeof co === 'object') {
    const ids = new Set([...Object.keys(co.next || {}), ...Object.keys(co.recent || {})]);
    for (const id of ids) await env.CAL.put(`co:${id}`, JSON.stringify({ next: co.next?.[id] || 0, recent: co.recent?.[id] || [], forced: co.forced?.[id] || 0 }));
    await env.CAL.delete('coach');
  }
  const cf = await env.CAL.get('coach-force', 'json');
  if (cf && typeof cf === 'object') { for (const [id, t] of Object.entries(cf)) await env.CAL.put(`cof:${id}`, String(t)); await env.CAL.delete('coach-force'); }
  // "já enviados": de uma lista de todo mundo para uma por agenda
  const ssent = (await env.CAL.get('schedule-sent', 'json')) || {};
  const psent = (await env.CAL.get('personal-sent', 'json')) || {};
  const legacyPersonal = await env.CAL.get('personal', 'json');
  const reg = await regAll(env);
  const D = dueOf(env);
  for (const [id, u] of Object.entries(reg)) {
    if (!u || !u.ws) continue;
    const sch = await env.CAL.get(scheduleKey(u.ws), 'json');
    if (sch && Array.isArray(sch.items)) {
      const mine = {};
      for (const it of sch.items) if (ssent[it.id]) mine[it.id] = ssent[it.id];
      if (Object.keys(mine).length) await env.CAL.put(`ssent:${u.ws}`, JSON.stringify(mine));
      const at = nextOf(sch.items, mine, now);
      if (at !== null) await D.set(`rem:${u.ws}`, at);
    }
    let pit = await env.CAL.get(`pitems:${id}`, 'json');
    if (!pit && legacyPersonal?.byMember?.[id]) { pit = legacyPersonal.byMember[id]; await env.CAL.put(`pitems:${id}`, JSON.stringify(pit)); }
    if (Array.isArray(pit)) {
      const mine = {};
      for (const it of pit) if (psent[it.id] || legacyPersonal?.sent?.[it.id]) mine[it.id] = psent[it.id] || legacyPersonal.sent[it.id];
      if (Object.keys(mine).length) await env.CAL.put(`psent:${id}`, JSON.stringify(mine));
      const at = nextOf(pit, mine, now);
      if (at !== null) await D.set(`per:${id}`, at);
    }
    if ((u.until || 0) > now) await seedPerson(env, id, now);
  }
  await env.CAL.put('upgraded:v2', String(now));
  upgradedEnv.add(env.CAL);
}

/* Contadores de uso do dia (para o painel): ficam na memória e são gravados junto com a fila */
export function usageMeter(env) {
  const day = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
  const u = env.USAGE || (env.USAGE = { date: day(), amigo: { sent: 0, ai: 0 }, coach: { sent: 0, ai: 0 } });
  return Object.assign((kind, ai) => {
    if (u.date !== day()) Object.assign(u, { date: day(), amigo: { sent: 0, ai: 0 }, coach: { sent: 0, ai: 0 } });
    u[kind].sent++; if (ai) u[kind].ai++;
    u.dirty = true;
  }, { erro: (kind) => { if (u[kind]) { u[kind].aiErr = (u[kind].aiErr || 0) + 1; u.dirty = true; } } });
}

/* Uma rodada do relógio. Para cedo quando o lote enche: devolve { more: true } e quem chamou
   agenda a continuação logo em seguida (nova execução = novo limite de processamento). */
export async function runTick(env, { now = Date.now(), send, maxPushes = 8, maxKeys = 15, meter = { pushes: 0 }, rankInfo = null, kinds = null } = {}) {
  await upgradeLegacy(env, now);
  const D = dueOf(env);
  let list = await D.dueBefore(now, maxKeys * 4);
  if (kinds) list = list.filter(([k]) => kinds.includes(k.slice(0, k.indexOf(':'))));
  if (!list.length) return { more: false, processed: 0, sent: 0 };
  // quem tem plano ativo (o registro de cada pessoa guarda até quando ela tem direito)
  const regOf = async (id) => { const u = await regGet(env, id); return u && (u.until || 0) > now ? u : null; };
  const usage = usageMeter(env);
  const cache = {};
  let processed = 0, sent = 0;
  for (const [k, at] of list) {
    if (meter.pushes >= maxPushes || processed >= maxKeys) return { more: true, processed, sent };
    processed++;
    const i = k.indexOf(':'), kind = k.slice(0, i), id = k.slice(i + 1);
    try {
      if (kind === 'rem') {
        if (!(await regOf(idOfWs(id)))) { await D.del(k); continue; }
        sent += await dueList(env, { itemsKey: scheduleKey(id), sentKey: `ssent:${id}`, dueKey: k, send, now, pref: 'reminders' });
      } else if (kind === 'per') {
        if (!(await regOf(id))) { await D.del(k); continue; }
        sent += await dueList(env, { itemsKey: `pitems:${id}`, sentKey: `psent:${id}`, dueKey: k, member: id, send, now });
      } else if (kind === 'amg' || kind === 'cch') {
        // o bom dia e o boa noite são de TODO mundo; com plano ativo vem também o resto do dia (água, ânimo, agenda…)
        const u = await regOf(id), u0 = u || (kind === 'amg' ? await regGet(env, id) : null);
        if (!u0) { await D.del(k); continue; }
        const m = { id, name: u0.name, ws: u0.ws, ctxKey: `coach-ctx:${u0.ws}`, ...(u ? {} : { soMomentos: true }) };
        const r = kind === 'amg' ? await amigoOne(env, send, m, now, rankInfo, usage) : await coachOne(env, send, m, now, cache, usage);
        sent += r.sent;
        if (r.nextAt === null) await D.del(k); else await D.set(k, Math.max(r.nextAt, now + 60e3));
      } else await D.del(k);
    } catch (e) {
      console.log('relógio', k, e.message);
      await D.set(k, now + 5 * 60e3); // tenta de novo em 5 min (nunca trava a fila)
    }
  }
  return { more: list.length >= maxKeys * 4, processed, sent };
}
