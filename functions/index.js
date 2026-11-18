/* Servidor de notificações do Calendário (Firebase Cloud Functions).
   - Avisa o parceiro quando alguém marca, muda, conclui ou remove algo.
   - Lembretes inteligentes: 1 dia antes (captação), 2h antes, 30 min antes, na hora
     e uma cobrança 30 min depois se ainda não foi marcado como feito.
   - Resumo do dia às 8h e da véspera às 20h.
   As chaves de notificação (VAPID) são criadas sozinhas na primeira execução. */
import { onDocumentWritten, onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import Anthropic from '@anthropic-ai/sdk';
import { ask, buildContext } from './assistant.js';
import { setGlobalOptions, logger } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import webpush from 'web-push';
import { TZ, nowIn, addDaysKey, dueReminders, reminderMessage, changeMessage, dailyMessage } from './reminder-rules.js';
import { TEAM } from './team.js';

initializeApp();
const db = getFirestore();
setGlobalOptions({ region: process.env.FUNCTIONS_REGION || 'southamerica-east1', maxInstances: 2 });

const nameOf = (id) => TEAM.find((m) => m.id === id)?.name || 'Alguém';

/* ---------- chaves VAPID (geradas uma vez e guardadas só no servidor) ---------- */
let vapidReady = null;
async function ensureVapid() {
  if (vapidReady) return vapidReady;
  vapidReady = (async () => {
    const ref = db.doc('private/vapid');
    let snap = await ref.get();
    if (!snap.exists) {
      const keys = webpush.generateVAPIDKeys();
      try {
        await ref.create({ ...keys, createdAt: Date.now() });
      } catch { /* outra execução criou ao mesmo tempo */ }
      snap = await ref.get();
    }
    const { publicKey, privateKey } = snap.data();
    // a chave pública vai para um lugar que o app da equipe consegue ler
    await db.doc('meta/push').set({ vapidPublicKey: publicKey }, { merge: true });
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:pauta@example.com', publicKey, privateKey);
    return publicKey;
  })();
  return vapidReady;
}

/* ---------- envio ---------- */
async function companyName(id) {
  if (!id) return '';
  const s = await db.doc(`companies/${id}`).get();
  return s.exists ? s.data().name || '' : '';
}

async function pendingToday(member) {
  const today = nowIn(TZ).date;
  const q = await db.collection('events').where('date', '==', today).get();
  return q.docs.map((d) => d.data()).filter((e) => e.status !== 'feito' && (e.assignees || []).includes(member)).length;
}

/* Manda para todos os aparelhos de uma pessoa (respeitando as preferências do aparelho) */
async function sendTo(member, msg, { pref = null, tag, url = './' } = {}) {
  await ensureVapid();
  const devices = await db.collection('devices').where('member', '==', member).get();
  if (devices.empty) return 0;
  const badge = await pendingToday(member).catch(() => 0);
  const payload = JSON.stringify({ title: msg.title, body: msg.body, tag, url, badge });
  let sent = 0;
  await Promise.all(devices.docs.map(async (d) => {
    const dev = d.data();
    if (pref && dev.prefs && dev.prefs[pref] === false) return;
    try {
      await webpush.sendNotification(dev.subscription, payload, { TTL: 3600, urgency: 'high' });
      sent++;
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        await d.ref.delete(); // aparelho desinstalou ou trocou
      } else {
        logger.warn('Falha no envio', { member, status: err.statusCode, body: err.body });
      }
    }
  }));
  return sent;
}

/* Grava um "já enviei" para nunca repetir a mesma notificação */
async function once(key) {
  try {
    await db.doc(`sent/${key}`).create({ at: Date.now(), expiresAt: new Date(Date.now() + 3 * 86400000) });
    return true;
  } catch {
    return false;
  }
}

/* ---------- 1) Alguém mexeu na agenda -> avisa o parceiro ---------- */
export const onEventWrite = onDocumentWritten('events/{id}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  if (!after) return; // exclusões chegam por "activity" (sabemos quem excluiu)
  if (after.bulkAt && after.bulkAt === after.updatedAt) return; // importação/série: resumo vem por "activity"
  const actorId = after.updatedBy || after.createdBy;
  if (!actorId) return;
  const company = await companyName(after.companyId);
  const now = nowIn(TZ);
  const recipients = TEAM.map((m) => m.id).filter((id) => id !== actorId);
  await Promise.all(recipients.map((r) => {
    const msg = changeMessage(before, after, { actor: nameOf(actorId), company, recipient: r, now });
    if (!msg) return null;
    return sendTo(r, msg, { pref: 'partner', tag: `ev-${event.params.id}`, url: `./#/e/${event.params.id}` });
  }));
});

/* ---------- 2) Exclusões e criações em lote (o app grava um registro de atividade) ---------- */
export const onActivity = onDocumentCreated('activity/{id}', async (event) => {
  const a = event.data?.data();
  if (!a) return;
  const actor = nameOf(a.by);
  const now = nowIn(TZ);
  const recipients = TEAM.map((m) => m.id).filter((id) => id !== a.by);
  let msg = null;
  if (a.kind === 'deleted' && a.events?.length) {
    const e = a.events[0];
    const company = await companyName(e.companyId);
    msg = a.events.length === 1
      ? changeMessage(e, null, { actor, company, now })
      : { title: `${actor} removeu ${a.events.length} itens da agenda`, body: `${company ? company + ' · ' : ''}a partir de ${e.date.slice(8, 10)}/${e.date.slice(5, 7)}` };
  } else if (a.kind === 'series' && a.sample) {
    const company = await companyName(a.sample.companyId);
    msg = { title: `${actor} adicionou ${a.count} itens repetidos`, body: `${a.label || ''}${company ? ' · ' + company : ''}` };
  } else if (a.kind === 'series-edit' && a.sample) {
    const company = await companyName(a.sample.companyId);
    msg = { title: `${actor} alterou ${a.count} itens repetidos`, body: `${a.label || ''}${company ? ' · ' + company : ''}` };
  } else if (a.kind === 'import') {
    msg = { title: `${actor} importou a agenda`, body: `${a.count || 0} itens atualizados.` };
  }
  if (msg) await Promise.all(recipients.map((r) => sendTo(r, msg, { pref: 'partner', tag: `act-${event.params.id}` })));
  await event.data.ref.delete();
});

/* ---------- 3) Teste de notificação pedido pelo app ---------- */
export const onPing = onDocumentCreated('pings/{id}', async (event) => {
  const p = event.data?.data();
  if (!p) return;
  await ensureVapid();
  const dev = await db.doc(`devices/${p.device}`).get();
  if (dev.exists) {
    try {
      await webpush.sendNotification(dev.data().subscription, JSON.stringify({
        title: 'Notificações ativadas ✓',
        body: 'É assim que os lembretes e avisos do parceiro vão chegar.',
        tag: 'teste', url: './',
      }), { TTL: 600, urgency: 'high' });
    } catch (err) {
      logger.warn('Teste falhou', { status: err.statusCode });
    }
  }
  await event.data.ref.delete();
});

/* ---------- 4) A cada minuto: lembretes, cobranças e resumos ---------- */
export const tick = onSchedule({ schedule: 'every 1 minutes', timeZone: TZ, retryCount: 0 }, async () => {
  await ensureVapid();
  const now = nowIn(TZ);
  const dates = [addDaysKey(now.date, -1), now.date, addDaysKey(now.date, 1)];
  const snap = await db.collection('events').where('date', 'in', dates).get();
  const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const names = new Map();
  const coName = async (id) => {
    if (!names.has(id)) names.set(id, await companyName(id));
    return names.get(id);
  };

  // lembretes de cada evento
  for (const { ev, offset } of dueReminders(events, now)) {
    if (!(await once(`r_${ev.id}_${offset}_${ev.date}_${ev.time.replace(':', '')}`))) continue;
    const msg = reminderMessage(ev, offset, await coName(ev.companyId));
    const who = ev.assignees?.length ? ev.assignees : TEAM.map((m) => m.id);
    await Promise.all(who.map((m) => sendTo(m, msg, { pref: 'reminders', tag: `rem-${ev.id}`, url: `./#/e/${ev.id}` })));
  }

  // resumo da manhã (8h) e da véspera (20h)
  const slot = now.minutes >= 480 && now.minutes < 485 ? 'morning' : now.minutes >= 1200 && now.minutes < 1205 ? 'evening' : null;
  if (slot) {
    const day = slot === 'morning' ? now.date : addDaysKey(now.date, 1);
    for (const m of TEAM) {
      if (!(await once(`d_${slot}_${day}_${m.id}`))) continue;
      const mine = events.filter((e) => e.date === day && e.status !== 'feito' && (e.assignees || []).includes(m.id));
      const companyMap = new Map(await Promise.all([...new Set(mine.map((e) => e.companyId))].map(async (id) => [id, await coName(id)])));
      const msg = dailyMessage(slot, m.name, mine, (e) => companyMap.get(e.companyId));
      if (msg) await sendTo(m.id, msg, { pref: 'daily', tag: `daily-${slot}`, url: './' });
    }
  }
});

/* ---------- 5) Limpeza diária dos registros de envio ---------- */
export const cleanup = onSchedule({ schedule: 'every day 04:00', timeZone: TZ }, async () => {
  const old = await db.collection('sent').where('expiresAt', '<', new Date()).limit(400).get();
  const batch = db.batch();
  old.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
});


/* ---------- 6) Assistente dentro do app (Claude Haiku 5.5) ---------- */
export const perguntar = onCall({ timeoutSeconds: 60, memory: '256MiB' }, async (request) => {
  const email = (request.auth?.token?.email || '').toLowerCase();
  const me = TEAM.find((m) => m.email && m.email.toLowerCase() === email);
  if (!me) throw new HttpsError('permission-denied', 'Só a equipe pode usar o assistente.');
  const question = String(request.data?.question || '').trim();
  if (!question) throw new HttpsError('invalid-argument', 'Escreva uma pergunta.');
  const history = Array.isArray(request.data?.history) ? request.data.history : [];

  const now = nowIn(TZ);
  const [evSnap, coSnap, setSnap, noteSnap] = await Promise.all([
    db.collection('events').where('date', '>=', addDaysKey(now.date, -7)).where('date', '<=', addDaysKey(now.date, 30)).get(),
    db.collection('companies').get(),
    db.doc('settings/routine').get(),
    db.collection('notes').where('date', '>=', addDaysKey(now.date, -2)).get(),
  ]);
  const context = buildContext({
    events: evSnap.docs.map((d) => d.data()),
    companies: coSnap.docs.map((d) => d.data()),
    routine: setSnap.exists ? setSnap.data() : null,
    notes: noteSnap.docs.map((d) => d.data()),
    team: TEAM,
    me: me.id,
    now,
  });
  try {
    return { answer: await ask({ question, history, context }) };
  } catch (err) {
    if (err.code === 'no-key') throw new HttpsError('failed-precondition', err.message);
    if (err instanceof Anthropic.AuthenticationError) throw new HttpsError('failed-precondition', 'A chave do Claude é inválida. Confira o segredo ANTHROPIC_API_KEY no GitHub.');
    if (err instanceof Anthropic.RateLimitError) throw new HttpsError('resource-exhausted', 'Muitas perguntas seguidas. Espere um pouco e tente de novo.');
    if (err instanceof Anthropic.APIConnectionError) throw new HttpsError('unavailable', 'Não consegui falar com o Claude agora. Tente de novo em instantes.');
    if (err instanceof Anthropic.APIError) {
      logger.error('Claude API', { status: err.status, message: err.message });
      throw new HttpsError('internal', err.status === 402 || /credit|billing/i.test(err.message) ? 'Sem créditos na conta da Anthropic.' : 'O Claude não respondeu. Tente de novo.');
    }
    logger.error('assistente', err);
    throw new HttpsError('internal', 'Algo deu errado no assistente.');
  }
});
