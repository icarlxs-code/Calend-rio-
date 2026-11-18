/* Teste de ponta a ponta do servidor (roda contra os emuladores locais):
   cadastra um "celular falso", agenda um Reels para daqui a 2h, roda o relógio
   do servidor e decifra a notificação recebida. */
import https from 'node:https';
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ece = require('http_ece');

const [certDir] = process.argv.slice(2);
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8085';
process.env.GCLOUD_PROJECT = 'demo-calendario';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const received = [];
const server = https.createServer({ key: readFileSync(certDir + '/key.pem'), cert: readFileSync(certDir + '/cert.pem') }, (req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => { received.push({ headers: req.headers, body: Buffer.concat(chunks) }); res.writeHead(201); res.end(); });
});
await new Promise((r) => server.listen(8443, '127.0.0.1', r));

const ecdh = crypto.createECDH('prime256v1');
ecdh.generateKeys();
const authSecret = crypto.randomBytes(16);
const b64u = (b) => b.toString('base64url');

const fns = await import('../index.js');
const { getFirestore } = await import('firebase-admin/firestore');
const { nowIn, addDaysKey } = await import('../reminder-rules.js');
const db = getFirestore();

const now = nowIn();
let m = now.minutes + 120;
let date = now.date;
if (m >= 1440) { m -= 1440; date = addDaysKey(date, 1); }
const time = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

await db.doc('companies/c_teste').set({ id: 'c_teste', name: 'Pura Vida' });
await db.doc('devices/d_teste').set({ id: 'd_teste', member: 'henrique', subscription: { endpoint: 'https://127.0.0.1:8443/push/1', keys: { p256dh: b64u(ecdh.getPublicKey()), auth: b64u(authSecret) } }, prefs: { reminders: true } });
await db.doc('events/e_teste').set({ id: 'e_teste', date, time, type: 'reels', companyId: 'c_teste', title: 'Bastidores', assignees: ['henrique'], status: 'pendente', reminder: 30 });

await fns.tick.run({});
await new Promise((r) => setTimeout(r, 500));
// rodar de novo no mesmo minuto não pode repetir a notificação
await fns.tick.run({});
await new Promise((r) => setTimeout(r, 500));

for (const r of received) {
  const plain = ece.decrypt(r.body, { version: 'aes128gcm', privateKey: ecdh, authSecret });
  console.log('NOTIFICAÇÃO RECEBIDA:', plain.toString(), '| TTL', r.headers.ttl, '| urgency', r.headers.urgency, '| VAPID?', /^vapid t=/.test(r.headers.authorization || ''));
}
console.log('total recebidas:', received.length, '(esperado: 1)');
server.close();
process.exit(received.length === 1 ? 0 : 1);
