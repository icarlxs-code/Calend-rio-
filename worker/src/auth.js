/* Confere o login do Firebase (ID token) sem bibliotecas: assinatura RS256 com as
   chaves públicas do Google, emissor, público, validade e e-mail da equipe. */
import { b64u } from './webpush.js';

const JWKS = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
let cache = { at: 0, keys: [] };

async function googleKeys() {
  if (Date.now() - cache.at < 3600e3 && cache.keys.length) return cache.keys;
  const res = await fetch(JWKS);
  const { keys } = await res.json();
  cache = { at: Date.now(), keys };
  return keys;
}

const json = (part) => JSON.parse(new TextDecoder().decode(b64u.dec(part)));

export async function verifyIdToken(token, env) {
  if (!token) throw new Error('sem login');
  const [h, p, s] = token.split('.');
  const header = json(h);
  const claims = json(p);
  const now = Math.floor(Date.now() / 1000);
  // Modo de teste local (emulador do Firebase): só se a variável estiver ligada
  const emulator = env.ALLOW_EMULATOR_TOKENS === '1' && header.alg === 'none';
  if (!emulator) {
    if (header.alg !== 'RS256') throw new Error('token inválido');
    const jwk = (await googleKeys()).find((k) => k.kid === header.kid);
    if (!jwk) throw new Error('chave desconhecida');
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u.dec(s), new TextEncoder().encode(`${h}.${p}`));
    if (!ok) throw new Error('assinatura inválida');
    if (claims.iss !== `https://securetoken.google.com/${env.PROJECT_ID}` || claims.aud !== env.PROJECT_ID) throw new Error('projeto errado');
  }
  if (!claims.exp || claims.exp < now - 60) throw new Error('login expirado');
  const email = String(claims.email || '').toLowerCase();
  // todo mundo tem a própria conta (a antiga "dupla" Henrique + Matheus virou duas contas normais).
  // Os fundadores (TEAM) só ganham o acesso para sempre e a agenda compartilhada inclusa.
  const team = JSON.parse(env.TEAM || '[]');
  const member = team.find((m) => m.email === email);
  const uid = String(claims.user_id || claims.sub || '');
  if (!uid) throw new Error('login sem usuário');
  const raw = String(member?.name || claims.name || email.split('@')[0] || 'Você').trim().slice(0, 40);
  return { id: 'u' + uid.replace(/[^A-Za-z0-9]/g, '').slice(0, 24), name: raw.charAt(0).toUpperCase() + raw.slice(1), email, ws: uid, solo: true, ...(member ? { founder: member.id } : {}) };
}
