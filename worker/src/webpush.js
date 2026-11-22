/* Web Push (RFC 8291 + RFC 8292) só com WebCrypto: funciona no Cloudflare Workers.
   - Criptografa a mensagem (aes128gcm) para o aparelho
   - Assina o pedido com as chaves VAPID do servidor */
const enc = new TextEncoder();
export const b64u = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => {
    const str = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
    return Uint8Array.from(str, (c) => c.charCodeAt(0));
  },
};
const concat = (...parts) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
};
async function hkdf(salt, ikm, info, bytes) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, bytes * 8));
}

/* ---------- chaves VAPID ---------- */
export async function generateVapid() {
  const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  return {
    publicKey: b64u.enc(await crypto.subtle.exportKey('raw', kp.publicKey)),
    privateJwk: await crypto.subtle.exportKey('jwk', kp.privateKey),
  };
}

/* A assinatura VAPID vale 12h para cada serviço de push (Apple, Google, Mozilla…): é feita uma vez
   e reaproveitada, em vez de assinar de novo a cada aviso (economiza processamento no plano grátis). */
const vapidCache = new Map();
let vapidKey = null;
async function vapidAuth(endpoint, vapid, subject) {
  const aud = new URL(endpoint).origin;
  const now = Math.floor(Date.now() / 1000);
  const hit = vapidCache.get(aud);
  if (hit && hit.pub === vapid.publicKey && hit.exp - now > 3600) return hit.value;
  const exp = now + 12 * 3600;
  const header = b64u.enc(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const claims = b64u.enc(enc.encode(JSON.stringify({ aud, exp, sub: subject })));
  if (!vapidKey || vapidKey.pub !== vapid.publicKey) vapidKey = { pub: vapid.publicKey, key: await crypto.subtle.importKey('jwk', vapid.privateJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']) };
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, vapidKey.key, enc.encode(`${header}.${claims}`));
  const value = `vapid t=${header}.${claims}.${b64u.enc(sig)}, k=${vapid.publicKey}`;
  vapidCache.set(aud, { value, exp, pub: vapid.publicKey });
  return value;
}

/* ---------- criptografia da mensagem (aes128gcm) ---------- */

export async function encryptPayload(subscription, payloadText) {
  const uaPublic = b64u.dec(subscription.keys.p256dh);
  const authSecret = b64u.dec(subscription.keys.auth);
  // chave temporária nova para cada mensagem (como manda a RFC 8291)
  const local = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', local.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, local.privateKey, 256));
  const ikm = await hkdf(authSecret, shared, concat(enc.encode('WebPush: info\0'), uaPublic, asPublic), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);
  const aes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const plain = concat(enc.encode(payloadText), new Uint8Array([2])); // 0x02 = último bloco
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aes, plain));
  const rs = new Uint8Array([0, 0, 16, 0]); // tamanho do bloco: 4096
  return concat(salt, rs, new Uint8Array([asPublic.length]), asPublic, cipher);
}

/* Envia uma notificação. Retorna o status HTTP (404/410 = aparelho não existe mais) */
/* tempo esperando a rede (não conta como processamento): usado para medir o trabalho de verdade de cada rodada */
export const NET = { ms: 0 };
export async function sendPush(subscription, payload, vapid, { subject = 'mailto:avisos@example.com', ttl = 3600, urgency = 'high' } = {}) {
  const body = await encryptPayload(subscription, typeof payload === 'string' ? payload : JSON.stringify(payload));
  const auth = await vapidAuth(subscription.endpoint, vapid, subject);
  const t0 = performance.now();
  try { return await post(subscription, body, auth, ttl, urgency); } finally { NET.ms += performance.now() - t0; }
}
async function post(subscription, body, auth, ttl, urgency) {
  const res = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: String(ttl),
      Urgency: urgency,
    },
    body,
  });
  return res.status;
}
