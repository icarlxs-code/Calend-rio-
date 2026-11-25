import { regAll } from './registry.js';
/* Cobrança do Lembra (Stripe) + teste grátis de 24h.
   - Planos: mensal R$ 9,90 (assinatura) e vitalício R$ 150 (pagamento único).
   - Complemento mensal, à parte: Agenda compartilhada Dupla R$ 6,90 (+1 pessoa) ou Equipe R$ 14,90 (+4).
     Exige o plano base pago; quem entra pelo convite fica coberto pelo plano do dono.
   - Teste: 24h a partir do toque em "Começar meu teste grátis". Um teste por CPF, por aparelho e por
     endereço de internet (IP, 30 dias) — quem já testou não ganha outro criando conta nova.
   - A dupla Henrique + Matheus (equipe do app) não paga.
   Chaves (segredos do Worker, configurados no painel da Cloudflare):
     STRIPE_SECRET_KEY (sk_live_... ou sk_test_...) e STRIPE_WEBHOOK_SECRET (whsec_...). */

export const TRIAL_MS = 7 * 864e5; // 7 dias grátis, sem cartão
/* Planos (nov/2026):
   - Essencial: agenda, modo Pessoal e avisos calculados. R$ 12,90/mês ou R$ 119,90/ano.
   - Profissional: tudo do Essencial + assistente com IA, cobrança de atraso e ranking. R$ 19,90/mês ou R$ 179,90/ano.
   - Fundadores: Profissional para sempre, pagamento único de R$ 199, só para as primeiras 200 contas.
   - Planos antigos (mensal R$ 9,90 e vitalício R$ 150) continuam valendo para quem já tem (equivalem ao Profissional). */
export const FOUNDERS_MAX = 200;
export const PLANS = {
  essencial_mes: { name: 'Lembra Essencial · mensal', amount: 1290, mode: 'subscription', interval: 'month', tier: 'essencial' },
  essencial_ano: { name: 'Lembra Essencial · anual', amount: 11990, mode: 'subscription', interval: 'year', tier: 'essencial' },
  pro_mes: { name: 'Lembra Profissional · mensal', amount: 1990, mode: 'subscription', interval: 'month', tier: 'pro' },
  pro_ano: { name: 'Lembra Profissional · anual', amount: 17990, mode: 'subscription', interval: 'year', tier: 'pro' },
  fundador: { name: 'Lembra Fundadores · Profissional para sempre', amount: 19900, mode: 'payment', tier: 'pro', founder: true },
  // anual no Pix: pagamento único que vale 12 meses (o Pix não renova sozinho; perto de vencer, o app avisa)
  essencial_ano_pix: { name: 'Lembra Essencial · 12 meses (Pix)', amount: 11990, mode: 'payment', tier: 'essencial', prepaidDays: 365 },
  pro_ano_pix: { name: 'Lembra Profissional · 12 meses (Pix)', amount: 17990, mode: 'payment', tier: 'pro', prepaidDays: 365 },
  // antigos: só para quem já assinou (não aparecem mais na tela de planos)
  mensal: { name: 'Lembra mensal', amount: 990, mode: 'subscription', interval: 'month', tier: 'pro', legacy: true },
  vitalicio: { name: 'Lembra vitalício', amount: 15000, mode: 'payment', tier: 'pro', legacy: true },
  // Agenda compartilhada: complemento mensal, à parte, cobrado por pessoa
  dupla: { name: 'Lembra · Agenda compartilhada (+1 pessoa)', amount: 790, mode: 'subscription', interval: 'month', addon: true, seats: 1 },
  equipe: { name: 'Lembra · Agenda compartilhada (+4 pessoas)', amount: 2990, mode: 'subscription', interval: 'month', addon: true, seats: 4 },
};
const isAddon = (plan) => !!PLANS[plan]?.addon;
/* Vantagem do vitalício: a agenda compartilhada sai mais barata (Dupla R$ 4,90 · Equipe R$ 9,90) */
export const LIFETIME_ADDON = { dupla: 490, equipe: 1990 };
export const addonPrice = (plan, b) => (b && b.lifetime && LIFETIME_ADDON[plan]) || PLANS[plan]?.amount || 0;
const IP_WINDOW = 30 * 864e5; // o mesmo endereço de internet só ganha UM teste a cada 30 dias
const IP_MAX = 1;
/* Endereço de internet da pessoa. IPv6 (a maioria dos celulares no 4G/5G): usa o bloco do aparelho (/64),
   que não muda quando o celular troca o final do endereço — assim criar outra conta não dá outro teste. */
export function netOf(ip) {
  const a = String(ip || '').trim().toLowerCase();
  if (!a) return '';
  if (!a.includes(':')) return a;
  const parts = a.split('::');
  const head = parts[0] ? parts[0].split(':') : [];
  const tail = parts[1] ? parts[1].split(':') : [];
  const full = parts.length > 1 ? [...head, ...Array(8 - head.length - tail.length).fill('0'), ...tail] : head;
  return full.slice(0, 4).map((x) => x.replace(/^0+(?=.)/, '')).join(':') + '::/64';
}

async function sha(text) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
export const getBill = async (env, uid) => (await env.CAL.get(`bill:${uid}`, 'json')) || null;
export const putBill = (env, uid, b) => env.CAL.put(`bill:${uid}`, JSON.stringify(b));

/* Complemento "Agenda compartilhada" (Dupla/Equipe): ativo enquanto a assinatura dele estiver em dia */
export function addonOf(b, now = Date.now()) {
  const a = b && b.addon;
  const real = a && PLANS[a.plan] ? { plan: a.plan, seats: PLANS[a.plan].seats, active: !!a.subActive && (!a.paidUntil || a.paidUntil > now - 3 * 864e5), paidUntil: a.paidUntil || null, cancelAt: a.cancelAt || null } : null;
  // presente Vitalício: a agenda compartilhada Equipe vem junto, sem pagar à parte (quem é convidado também não paga)
  if (b && b.lifetime && b.comp && (b.vip || b.founderTeam) && !(real && real.active)) return { plan: 'equipe', seats: PLANS.equipe.seats, active: true, paidUntil: null, cancelAt: null, gift: true };
  return real;
}
/* Plano base pago (mensal em dia ou vitalício): exigido para o complemento funcionar */
export const basePaid = (b, now = Date.now()) => !!b && (!!b.lifetime || (!!b.prepaidUntil && b.prepaidUntil > now) || (!!b.subActive && (!b.paidUntil || b.paidUntil > now - 3 * 864e5)));

/* Situação da conta: team | lifetime | monthly | trial | expired | blocked | none */
/* Lançamento: tudo grátis para todo mundo até 31/12/2026 23:59 (horário de Brasília).
   Quem já pagou continua com o plano dele; quem não tem plano fica com "gratis" (tudo liberado, IA inclusa). */
export const FOUNDERS_UNTIL = Date.UTC(2027, 1, 1, 3, 0, 0);
export const FREE_UNTIL_DEFAULT = Date.UTC(2027, 0, 1, 3, 0, 0);
export const freeUntil = () => (globalThis.__LEMBRA_FREE_UNTIL ?? FREE_UNTIL_DEFAULT);
const gratis = (now, extra = {}) => (now < freeUntil() ? { plan: 'gratis', active: true, tier: 'pro', freeUntil: freeUntil(), ...extra } : null);
export const livreEm = (now = Date.now()) => now >= FREE_UNTIL_DEFAULT;
export function statusOf(b, me, now = Date.now()) {
  if (me.ws === 'main') return { plan: 'team', active: true };
  if (!b) return gratis(now) || { plan: 'none', active: false, ...(livreEm(now) ? { livre: true } : {}) };
  const addon = addonOf(b, now);
  const extra = addon ? { addon } : {};
  if (b.lifetime) return { plan: 'lifetime', active: true, tier: 'pro', ...(b.founder ? { founder: true } : {}), ...(b.comp ? { comp: true } : {}), ...(b.comp && b.vip ? { vip: { no: b.vip.no, at: b.vip.at, ...(Number.isFinite(b.vip.sent) ? { sent: b.vip.sent } : {}) } } : {}), ...extra };
  if (b.subActive && (!b.paidUntil || b.paidUntil > now - 3 * 864e5)) return { plan: 'monthly', active: true, tier: b.tier || 'pro', interval: b.interval || 'month', paidUntil: b.paidUntil || null, cancelAt: b.cancelAt || null, ...extra };
  // 12 meses pagos no Pix (sem renovação automática)
  if (b.prepaidUntil && b.prepaidUntil > now) return { plan: 'monthly', active: true, tier: b.prepaidTier || b.tier || 'pro', interval: 'year', paidUntil: b.prepaidUntil, prepaid: true, ...extra };
  // acesso liberado pelo dono até uma data e hora (sem pagar); depois disso, precisa assinar
  if (b.compUntil && b.compUntil > now) return { plan: 'comp', active: true, tier: 'pro', comp: true, compUntil: b.compUntil, ...extra };
  if (b.pending && now - b.pending.at < 4 * 864e5) extra.pending = b.pending.plan;
  if (b.trialEndsAt && b.trialEndsAt > now) return { plan: 'trial', active: true, tier: 'pro', trialEndsAt: b.trialEndsAt, ...extra };
  { const g = gratis(now, extra); if (g) return g; }
  const lv = livreEm(now) ? { livre: true } : {}; // depois do lançamento: continua no plano grátis, com limite
  if (b.trialDenied) return { plan: 'blocked', active: false, reason: b.trialDenied, ...lv, ...extra };
  return { plan: 'expired', active: false, trialEndsAt: b.trialEndsAt || null, ...lv, ...extra };
}

/* Até quando a conta tem direito aos lembretes, mensagens e assistente (0 = sem plano) */
export const FOREVER = 8.64e15;
export function untilOf(st, now = Date.now()) {
  if (st && st.livre) return now + 32 * 864e5;
  if (!st || !st.active) return 0;
  if (st.plan === 'team' || st.plan === 'lifetime') return FOREVER;
  if (st.plan === 'monthly') return st.paidUntil ? st.paidUntil + 3 * 864e5 : now + 32 * 864e5;
  if (st.plan === 'trial') return st.trialEndsAt || 0;
  if (st.plan === 'comp') return st.compUntil || 0;
  if (st.plan === 'shared') return now + 864e5;
  if (st.plan === 'gratis') return st.freeUntil || 0;
  return 0;
}

/* ---------- Agenda compartilhada: quem está em qual equipe ----------
   team:{ownerUid} = { ownerUid, ownerId, ownerName, members:[{uid,id,name}], seats }
   member:{uid}    = ownerUid (a equipe em que a pessoa entrou) */
export async function teamActive(env, team, now = Date.now()) {
  if (!team || !team.ownerUid) return false;
  const b = await getBill(env, team.ownerUid);
  const a = addonOf(b, now);
  return !!(a && a.active && basePaid(b, now));
}
/* O dono manda a lista de quem entrou; o servidor corta no número de vagas pagas */
export async function syncTeam(env, me, members, now = Date.now(), ownerName = '') {
  if (me.ws === 'main') throw Object.assign(new Error('A dupla já compartilha a agenda.'), { status: 400 });
  const b = await getBill(env, me.ws);
  const a = addonOf(b, now);
  const active = !!(a && a.active && basePaid(b, now));
  const seats = active ? a.seats : 0;
  const prev = (await env.CAL.get(`team:${me.ws}`, 'json')) || { members: [] };
  const list = (Array.isArray(members) ? members : [])
    .filter((m) => m && /^[A-Za-z0-9]{6,64}$/.test(m.uid || '') && m.uid !== me.ws)
    .slice(0, seats)
    .map((m) => ({ uid: m.uid, id: 'u' + m.uid.slice(0, 24), name: String(m.name || 'Convidado').slice(0, 40) }));
  const team = { ownerUid: me.ws, ownerId: me.id, ownerName: String(ownerName || me.name || 'Dono').slice(0, 40), members: list, seats, active, updatedAt: now };
  await env.CAL.put(`team:${me.ws}`, JSON.stringify(team));
  const gone = (prev.members || []).filter((m) => !list.some((x) => x.uid === m.uid));
  await Promise.all([...list.map((m) => env.CAL.put(`member:${m.uid}`, me.ws)), ...gone.map((m) => env.CAL.delete(`member:${m.uid}`))]);
  return { active, seats, plan: a ? a.plan : null, members: list.length };
}
/* Equipe ativa de uma pessoa convidada (ou null) */
export async function sharedOf(env, uid, now = Date.now()) {
  const owner = await env.CAL.get(`member:${uid}`);
  if (!owner) return null;
  const team = await env.CAL.get(`team:${owner}`, 'json');
  if (!team || !(team.members || []).some((m) => m.uid === uid)) return null;
  return (await teamActive(env, team, now)) ? team : null;
}

/* 1º acesso: começa o teste — se este aparelho/rede ainda não testou */
/* CPF válido (dígitos verificadores) — o servidor confere de novo, não confia no app */
export function validCPF(raw) {
  const c = String(raw || '').replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const dv = (len) => { let sum = 0; for (let i = 0; i < len; i++) sum += +c[i] * (len + 1 - i); const r = (sum * 10) % 11; return r === 10 ? 0 : r; };
  return dv(9) === +c[9] && dv(10) === +c[10];
}

/** guarda só o código embaralhado do CPF (para a regra de um teste por pessoa) */
export async function marcaCpf(env, me, cpf, now = Date.now()) { if (!validCPF(cpf)) return false; const doc = await sha(`cpf:${env.CPF_SALT || 'lembra'}:${String(cpf).replace(/\D/g, '')}`), k = `trial-cpf:${doc}`; if (!(await env.CAL.get(k))) await env.CAL.put(k, JSON.stringify({ uid: me.ws, at: now })); return true; }
export async function startTrial(env, me, { deviceId, ip, cpf, now = Date.now() }) {
  if (me.ws === 'main') return statusOf(null, me, now);
  const uid = me.ws;
  let b = await getBill(env, uid);
  if (b && (b.trialEndsAt || b.trialDenied || b.lifetime || b.subActive)) return statusOf(b, me, now);
  const dev = deviceId ? await sha('dev:' + deviceId) : null;
  // TRIAL_IP_CHECK="0" só nos testes automáticos (todos os celulares de teste saem do mesmo endereço)
  const net = ip && env.TRIAL_IP_CHECK !== '0' ? await sha('ip:' + netOf(ip)) : null;
  // CPF: guardado só embaralhado (com o segredo do servidor), um teste por pessoa
  const doc = validCPF(cpf) ? await sha(`cpf:${env.CPF_SALT || 'lembra'}:${String(cpf).replace(/\D/g, '')}`) : null;
  const [usedDev, usedNet, usedDoc] = await Promise.all([dev ? env.CAL.get(`trial-dev:${dev}`, 'json') : null, net ? env.CAL.get(`trial-ip:${net}`, 'json') : null, doc ? env.CAL.get(`trial-cpf:${doc}`, 'json') : null]);
  const otherDev = usedDev && usedDev.uid !== uid;
  // rede: o mesmo endereço de internet (IP) que já usou o teste nos últimos 30 dias não ganha outro
  const netList = (Array.isArray(usedNet) ? usedNet : usedNet ? [usedNet] : []).filter((x) => now - x.at < IP_WINDOW);
  const otherNet = netList.filter((x) => x.uid !== uid).length >= IP_MAX;
  const otherDoc = usedDoc && usedDoc.uid !== uid;
  b = { ...(b || {}), uid, email: me.email, createdAt: now };
  if (otherDoc || otherDev || otherNet) {
    b.trialDenied = otherDoc ? 'cpf' : otherDev ? 'aparelho' : 'rede';
  } else {
    b.trialStartedAt = now;
    b.trialEndsAt = now + TRIAL_MS;
    const mark = JSON.stringify({ uid, at: now });
    await Promise.all([dev && env.CAL.put(`trial-dev:${dev}`, mark), net && env.CAL.put(`trial-ip:${net}`, JSON.stringify([...netList, { uid, at: now }].slice(-10)), { expirationTtl: IP_WINDOW / 1000 + 60 }), doc && env.CAL.put(`trial-cpf:${doc}`, mark)].filter(Boolean));
  }
  await putBill(env, uid, b);
  return statusOf(b, me, now);
}

export async function billingStatus(env, me) {
  // fundadores (a antiga dupla): para sempre, com a agenda compartilhada inclusa
  if (me.founder && me.ws !== 'main') {
    const b0 = await getBill(env, me.ws);
    if (!b0 || !b0.lifetime || !b0.founderTeam) { const now = Date.now(); await putBill(env, me.ws, { ...(b0 || { uid: me.ws, createdAt: now }), lifetime: true, comp: true, founderTeam: true, lifetimeAt: b0?.lifetimeAt || now, updatedAt: now }); }
  }
  const st = statusOf(me.ws === 'main' ? null : await getBill(env, me.ws), me);
  if (me.ws === 'main' || st.plan === 'lifetime' || st.plan === 'monthly') return st;
  // convidado de uma agenda compartilhada ativa: o plano do dono cobre
  const team = await sharedOf(env, me.ws);
  if (team) return { plan: 'shared', active: true, owner: team.ownerUid, ownerName: team.ownerName, ...(st.addon ? { addon: st.addon } : {}) };
  return st;
}

/* ---------- Stripe ---------- */
const form = (obj, prefix = '', out = new URLSearchParams()) => {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v && typeof v === 'object') form(v, key, out);
    else if (v !== undefined && v !== null) out.append(key, String(v));
  }
  return out;
};
export async function stripe(env, path, params, fetchImpl = fetch, method = 'POST') {
  if (!env.STRIPE_SECRET_KEY) throw Object.assign(new Error('O pagamento ainda não foi configurado (falta a chave da Stripe no servidor).'), { status: 412 });
  const r = await fetchImpl(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form(params).toString(),
  });
  const j = await r.json();
  if (!r.ok) {
    const raw = j?.error?.message || 'A Stripe recusou o pedido.';
    console.log('stripe', path, raw);
    // o dono vê o motivo técnico no Painel (erros do app); a pessoa vê uma mensagem clara
    try {
      const list = (await env.CAL.get('errors', 'json')) || [];
      const sig = `Stripe: ${raw}`.slice(0, 300);
      const hit = list.find((x) => x.sig === sig);
      if (hit) { hit.count++; hit.last = Date.now(); } else list.unshift({ sig, msg: sig, where: `stripe/${path.split('/')[0]}`, count: 1, first: Date.now(), last: Date.now(), users: [] });
      await env.CAL.put('errors', JSON.stringify(list.slice(0, 150)));
    } catch { /* ok */ }
    const friendly = /payment method/i.test(raw) ? 'O pagamento por cartão ainda está sendo ativado. Tente de novo em alguns minutos.' : /No such customer/i.test(raw) ? 'Não encontrei seu cadastro de pagamento. Tente de novo.' : 'O pagamento está temporariamente indisponível. Tente de novo em alguns minutos.';
    throw Object.assign(new Error(friendly), { status: 502, raw });
  }
  return j;
}

/* Endereço do app para a volta do pagamento: só o site oficial ou um endereço autorizado (evita redirecionar para sites de fora) */
export function siteBase(env, returnUrl = '') {
  const official = (env.SITE_URL || 'https://icarlxs-code.github.io/Calend-rio-/').replace(/\/?$/, '/');
  let u;
  try { u = new URL(returnUrl); } catch { return official; }
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((x) => x.trim()).filter(Boolean);
  const local = env.ALLOW_EMULATOR_TOKENS === '1' && /^(localhost|127\.0\.0\.1)$/.test(u.hostname);
  if (!local && !allowed.includes(u.origin) && !official.startsWith(u.origin)) return official;
  return `${u.origin}${u.pathname.replace(/[^/]*$/, '')}`;
}

/* Cria a página de pagamento da Stripe e devolve o endereço */
export async function createCheckout(env, me, { plan, returnUrl }, fetchImpl = fetch) {
  const p = PLANS[plan];
  if (!p) throw Object.assign(new Error('Plano inválido.'), { status: 400 });
  if (me.ws === 'main') throw Object.assign(new Error('A sua conta já é liberada.'), { status: 400 });
  const back = siteBase(env, returnUrl);
  const b = (await getBill(env, me.ws)) || {};
  // nunca cobra duas vezes pela mesma coisa
  if (!p.addon && b.lifetime) throw Object.assign(new Error('Sua conta já é vitalícia: está tudo liberado para sempre.'), { status: 409 });
  if (p.legacy) throw Object.assign(new Error('Este plano não está mais disponível.'), { status: 400 });
  const now0 = Date.now();
  const prepaidLeft = b.prepaidUntil && !b.subActive && !b.lifetime ? b.prepaidUntil - now0 : 0;
  if (!p.addon && p.mode === 'subscription' && prepaidLeft > 10 * 864e5) throw Object.assign(new Error(`Seu plano pago no Pix vale até ${new Date(b.prepaidUntil).toLocaleDateString('pt-BR')}. Faltando 10 dias, você renova no Pix ou passa para o cartão sem perder nenhum dia.`), { status: 409 });
  if (!p.addon && p.mode === 'subscription' && basePaid(b) && !(prepaidLeft > 0)) throw Object.assign(new Error('Você já tem uma assinatura. Para trocar de plano, use “Gerenciar assinatura”.'), { status: 409 });
  if (p.prepaidDays && b.subActive) throw Object.assign(new Error('Você já tem uma assinatura no cartão. Para trocar para o Pix, cancele em “Gerenciar assinatura” e pague o anual no Pix quando ela terminar.'), { status: 409 });
  if (p.founder && Date.now() >= FOUNDERS_UNTIL) throw Object.assign(new Error('As vagas de Fundadores acabaram.'), { status: 409 });
  if (p.founder && Number(await env.CAL.get('founders-count') || 0) >= FOUNDERS_MAX) throw Object.assign(new Error('As vagas de Fundadores acabaram.'), { status: 409 });
  if (p.addon) {
    if (!basePaid(b)) throw Object.assign(new Error('A agenda compartilhada é um complemento: primeiro assine o plano Mensal ou o Vitalício.'), { status: 409 });
    const cur = addonOf(b);
    if (cur && cur.gift) throw Object.assign(new Error('A agenda compartilhada já está incluída no seu acesso: não precisa pagar nada.'), { status: 409 });
    if (cur && cur.active) throw Object.assign(new Error(cur.plan === plan ? 'Você já tem esse plano ativo.' : 'Você já tem a agenda compartilhada. Para trocar de plano, cancele em “Gerenciar assinatura” e assine o outro.'), { status: 409 });
  }
  const price = { currency: 'brl', unit_amount: p.addon ? addonPrice(plan, b) : p.amount, product_data: { name: p.addon && b.lifetime ? `${p.name} · preço de vitalício` : p.name } };
  if (p.mode === 'subscription') price.recurring = { interval: p.interval || 'month' };
  const params = {
    mode: p.mode,
    client_reference_id: me.ws,
    // volta da Stripe: página oficial "Pagamento recebido" (funciona em qualquer navegador, inclusive no iPhone)
    success_url: `${back}pago/?p=${plan}`,
    cancel_url: `${back}pago/?cancelado=1`,
    locale: 'pt-BR',
    allow_promotion_codes: 'true',
    line_items: { 0: { quantity: 1, price_data: price } },
    // cartão em tudo; Pix só no pagamento único (Fundadores e anual no Pix) — a Stripe não renova Pix sozinha
    payment_method_types: p.mode === 'payment' ? { 0: 'card', 1: 'pix' } : { 0: 'card' },
    metadata: { uid: me.ws, plan },
  };
  if (b.customer) params.customer = b.customer; else params.customer_email = me.email;
  if (p.mode === 'subscription') {
    params.subscription_data = { metadata: { uid: me.ws, plan } };
    // trocando do Pix para o cartão perto de vencer: a 1ª cobrança só acontece quando o Pix acaba (não paga em dobro)
    if (!p.addon && prepaidLeft > 2 * 864e5) params.subscription_data.trial_end = Math.floor(b.prepaidUntil / 1000);
  } else params.payment_intent_data = { metadata: { uid: me.ws, plan } }; // (a Stripe recusa payment_intent_data em assinatura)
  if (p.mode === 'payment') params.payment_method_options = { pix: { expires_after_seconds: 86400 } }; // o QR do Pix vale 24h
  let s;
  const go = async () => {
    try { return await stripe(env, 'checkout/sessions', params, fetchImpl); }
    catch (e) {
      // cliente antigo que não existe mais na Stripe (ex.: trocou de conta/modo): cria de novo pelo e-mail
      if (!/No such customer/i.test(e.raw || '') || !params.customer) throw e;
      delete params.customer; params.customer_email = me.email;
      return stripe(env, 'checkout/sessions', params, fetchImpl);
    }
  };
  try { s = await go(); }
  catch (e) {
    // a conta da Stripe ainda não tem o Pix ligado: vende só no cartão (o anual no Pix não faz sentido sem Pix)
    if (!/pix/i.test(e.raw || e.message || '') || p.prepaidDays) throw p.prepaidDays && /pix/i.test(e.raw || e.message || '') ? Object.assign(new Error('O Pix está indisponível agora. Escolha pagar com cartão ou tente mais tarde.'), { status: 503 }) : e;
    params.payment_method_types = { 0: 'card' }; delete params.payment_method_options;
    s = await go();
  }
  return { url: s.url };
}

/* Portal da Stripe: cancelar assinatura, trocar cartão */
export async function createPortal(env, me, { returnUrl }, fetchImpl = fetch) {
  const b = await getBill(env, me.ws);
  if (!b || !b.customer) throw Object.assign(new Error('Não encontrei uma assinatura nesta conta.'), { status: 404 });
  const s = await stripe(env, 'billing_portal/sessions', { customer: b.customer, return_url: (returnUrl || '').split('#')[0] || 'https://icarlxs-code.github.io/Calend-rio-/' }, fetchImpl);
  return { url: s.url };
}

/* Confere a assinatura do aviso da Stripe (HMAC-SHA256, tolerância de 5 min) */
export async function verifyStripe(env, payload, header, now = Date.now()) {
  if (!env.STRIPE_WEBHOOK_SECRET) throw new Error('sem segredo do webhook');
  const parts = Object.fromEntries(String(header || '').split(',').map((p) => p.split('=')));
  const t = Number(parts.t);
  if (!t || Math.abs(now / 1000 - t) > 300) throw new Error('aviso velho ou sem data');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`));
  const hex = [...new Uint8Array(sig)].map((x) => x.toString(16).padStart(2, '0')).join('');
  const given = String(header).split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!given.includes(hex)) throw new Error('assinatura inválida');
  return JSON.parse(payload);
}

/* quanto a pessoa já pagou de verdade (centavos), sem contar o mesmo pagamento duas vezes */
function addSpent(b, id, cents, now) {
  const v = Math.round(Number(cents) || 0);
  if (!id || !v) return;
  b.paidIds = b.paidIds || [];
  if (b.paidIds.includes(id)) return;
  b.paidIds = [...b.paidIds, id].slice(-60);
  b.spent = Math.max(0, (b.spent || 0) + v);
  if (v > 0) { b.lastPaidAt = now; b.payments = (b.payments || 0) + 1; }
}

/* Avisos da Stripe: pagamento confirmado, renovação, cancelamento */
export async function handleStripeEvent(env, ev) {
  const o = ev?.data?.object || {};
  const now = Date.now();
  if (ev.type === 'checkout.session.completed' || ev.type === 'checkout.session.async_payment_succeeded' || ev.type === 'checkout.session.async_payment_failed') {
    const uid = o.client_reference_id || o.metadata?.uid;
    if (!uid) return;
    const b = (await getBill(env, uid)) || { uid };
    b.customer = o.customer || b.customer;
    // vitalício: cartão confirma na hora; Pix/boleto confirmam depois (async_payment_succeeded)
    const prepaid = PLANS[o.metadata?.plan]?.prepaidDays;
    if (o.mode === 'payment' && o.payment_status === 'paid' && prepaid) {
      // 12 meses no Pix: soma ao que ainda faltava (pagar antes de vencer não perde dias)
      if (b.prepaidPI !== o.payment_intent || !b.prepaidUntil) {
        b.prepaidUntil = Math.max(now, b.prepaidUntil || 0) + prepaid * 864e5;
        b.prepaidTier = PLANS[o.metadata.plan].tier; b.tier = b.prepaidTier; b.prepaidPI = o.payment_intent || null; b.prepaidAt = now;
      }
      b.pending = null;
    } else if (o.mode === 'payment' && o.payment_status === 'paid') {
      if (!b.lifetime && PLANS[o.metadata?.plan]?.founder) { b.founder = true; await env.CAL.put('founders-count', String(Number(await env.CAL.get('founders-count') || 0) + 1)); }
      b.lifetime = true; b.lifetimeAt = now; b.lifetimePI = o.payment_intent || b.lifetimePI || null; b.pending = null; b.tier = 'pro';
      // quem assinava o mensal e passou para o vitalício: a mensalidade é cancelada na hora
      if (b.subActive && b.subscription) {
        try { await stripe(env, `subscriptions/${b.subscription}`, {}, fetch, 'DELETE'); b.subActive = false; b.upgradedAt = now; } catch (e) { console.log('cancelar mensal após vitalício', e.message); }
      }
    }
    if (o.mode === 'payment' && o.payment_status === 'paid') addSpent(b, o.payment_intent || o.id, o.amount_total, now);
    else if (o.mode === 'payment' && ev.type === 'checkout.session.completed') b.pending = { plan: o.metadata?.plan || 'vitalicio', at: now };
    if (ev.type === 'checkout.session.async_payment_failed') b.pending = null;
    if (o.mode === 'subscription' && isAddon(o.metadata?.plan)) b.addon = { plan: o.metadata.plan, subscription: o.subscription, subActive: true, paidUntil: now + 32 * 864e5, since: now };
    else if (o.mode === 'subscription') { const pp = PLANS[o.metadata?.plan] || PLANS.mensal; b.subActive = true; b.subscription = o.subscription; b.tier = pp.tier; b.interval = pp.interval; b.paidUntil = now + (pp.interval === 'year' ? 368 : 32) * 864e5; }
    b.updatedAt = now;
    if (b.customer) await env.CAL.put(`cust:${b.customer}`, uid);
    await putBill(env, uid, b);
    return uid;
  }
  if (ev.type === 'customer.subscription.updated' || ev.type === 'customer.subscription.deleted' || ev.type === 'customer.subscription.created') {
    const uid = o.metadata?.uid || (o.customer && (await env.CAL.get(`cust:${o.customer}`)));
    if (!uid) return;
    const b = (await getBill(env, uid)) || { uid };
    b.customer = o.customer || b.customer;
    const alive = ev.type !== 'customer.subscription.deleted' && ['active', 'trialing', 'past_due'].includes(o.status);
    const end = o.current_period_end || o.items?.data?.[0]?.current_period_end;
    // assinatura do complemento (agenda compartilhada) ou do plano base
    if (isAddon(o.metadata?.plan) || (b.addon && b.addon.subscription === o.id)) {
      b.addon = { ...(b.addon || {}), plan: isAddon(o.metadata?.plan) ? o.metadata.plan : b.addon.plan, subscription: o.id, subActive: alive, cancelAt: o.cancel_at ? o.cancel_at * 1000 : null };
      if (end) b.addon.paidUntil = end * 1000;
    } else {
      b.subscription = o.id;
      b.subActive = alive;
      if (PLANS[o.metadata?.plan] && !PLANS[o.metadata.plan].addon) { b.tier = PLANS[o.metadata.plan].tier; b.interval = PLANS[o.metadata.plan].interval; }
      if (end) b.paidUntil = end * 1000;
      b.cancelAt = o.cancel_at ? o.cancel_at * 1000 : null;
    }
    b.updatedAt = now;
    await putBill(env, uid, b);
    return uid;
  }
  // reembolso total do vitalício (ex.: arrependimento em 7 dias): encerra o acesso vitalício
  if (ev.type === 'charge.refunded' && o.refunded) {
    const uid = o.metadata?.uid || (o.customer && (await env.CAL.get(`cust:${o.customer}`)));
    if (!uid) return;
    const b = await getBill(env, uid);
    if (b && o.amount_refunded) { addSpent(b, 'rf:' + (o.id || o.payment_intent), -o.amount_refunded, now); await putBill(env, uid, b); }
    if (b && b.lifetime && (!b.lifetimePI || b.lifetimePI === o.payment_intent)) { b.lifetime = false; b.refundedAt = now; b.updatedAt = now; await putBill(env, uid, b); }
    else if (b && b.prepaidUntil && b.prepaidPI && b.prepaidPI === o.payment_intent) { b.prepaidUntil = now; b.refundedAt = now; b.updatedAt = now; await putBill(env, uid, b); }
    return uid;
  }
  if (ev.type === 'invoice.paid' && o.customer) {
    const uid = await env.CAL.get(`cust:${o.customer}`);
    if (!uid) return;
    const b = (await getBill(env, uid)) || { uid };
    const end = o.lines?.data?.[0]?.period?.end;
    const until = end ? end * 1000 : now + 32 * 864e5;
    const subId = o.subscription || o.parent?.subscription_details?.subscription || null;
    const plan = o.parent?.subscription_details?.metadata?.plan || o.subscription_details?.metadata?.plan || o.lines?.data?.[0]?.metadata?.plan;
    if ((subId && b.addon && b.addon.subscription === subId) || isAddon(plan)) b.addon = { ...(b.addon || {}), ...(isAddon(plan) ? { plan } : {}), ...(subId ? { subscription: subId } : {}), subActive: true, paidUntil: until };
    else { b.subActive = true; b.paidUntil = until; }
    addSpent(b, o.id, o.amount_paid, now);
    await putBill(env, uid, b);
    return uid;
  }
}

/* Dono do app libera (ou tira) um acesso cortesia: revisores da Apple/Google, parceiros, testes.
   Funciona como vitalício, mas marcado como cortesia (não conta como venda). */
export async function grantComp(env, uid, on, now = Date.now(), until = 0) {
  if (!/^[A-Za-z0-9]{6,64}$/.test(uid || '')) throw Object.assign(new Error('conta inválida'), { status: 400 });
  const b = (await getBill(env, uid)) || { uid, createdAt: now };
  let gifted = false;
  if (on && until) {
    if (!(until > now) || until > now + 5 * 365 * 864e5) throw Object.assign(new Error('data inválida'), { status: 400 });
    b.compUntil = until;
  } else if (on) {
    if (!b.lifetime) { b.lifetime = true; b.comp = true; b.lifetimeAt = now; }
    // presente "Vitalício": número de membro único (nunca se repete, nem se o acesso for retirado)
    if (b.comp && !b.vip) { b.vip = { no: await vipLivre(env, uid), at: now }; gifted = true; }
  } else { if (b.comp) { b.lifetime = false; b.comp = false; if (b.vip) await vipSolta(env, uid); delete b.vip; } delete b.compUntil; }
  b.updatedAt = now;
  await putBill(env, uid, b);
  return { ...statusOf(b, { ws: uid }, now), ...(gifted ? { gifted: true } : {}) };
}

/* números do Vitalício SEMPRE em sequência (001, 002, 003…): a lista de quem tem cada número fica em "vip-owners".
   Quem perde o acesso libera o número, e o próximo presente usa o menor número livre — nunca fica buraco. */
const vipDonos = async (env) => { try { return JSON.parse((await env.CAL.get('vip-owners')) || '{}'); } catch { return {}; } };
async function vipLivre(env, uid) {
  const d = await vipDonos(env); let no = 1;
  while (d[no] && d[no] !== uid) no++;
  d[no] = uid; await env.CAL.put('vip-owners', JSON.stringify(d));
  await env.CAL.put('vip-count', String(Object.keys(d).length));
  return no;
}
async function vipSolta(env, uid) {
  const d = await vipDonos(env);
  for (const k of Object.keys(d)) if (d[k] === uid) delete d[k];
  await env.CAL.put('vip-owners', JSON.stringify(d)); await env.CAL.put('vip-count', String(Object.keys(d).length));
}
/* uma vez: refaz a numeração de quem é Vitalício hoje, na ordem em que ganhou, sem buracos (ex.: 001, 003 → 001, 002) */
export async function vipCompacta(env, now = Date.now()) {
  if (await env.CAL.get('vip-compact-1')) return 0;
  const reg = await regAll(env);
  const seen = new Set(), vips = [];
  for (const u of Object.values(reg)) {
    if (!u || !u.ws || seen.has(u.ws) || !/^[A-Za-z0-9]{6,64}$/.test(u.ws)) continue;
    seen.add(u.ws);
    const b = await getBill(env, u.ws);
    if (b && b.lifetime && b.comp && b.vip) vips.push(b);
  }
  vips.sort((a, b) => (a.vip.no - b.vip.no) || ((a.vip.at || 0) - (b.vip.at || 0)));
  const donos = {};
  for (let i = 0; i < vips.length; i++) {
    const b = vips[i], no = i + 1; donos[no] = b.uid;
    if (b.vip.no !== no) { b.vip.no = no; b.updatedAt = now; await putBill(env, b.uid, b); }
  }
  await env.CAL.put('vip-owners', JSON.stringify(donos));
  await env.CAL.put('vip-count', String(vips.length));
  await env.CAL.put('vip-compact-1', String(now));
  return vips.length;
}

/* resultado do aviso "Você recebeu algo raro." (o painel mostra se chegou no celular) */
export async function markVipSent(env, uid, sent) {
  const b = await getBill(env, uid);
  if (!b || !b.vip) return;
  b.vip.sent = Number(sent) || 0;
  await putBill(env, uid, b);
}

/* Uma vez só: quem ganhou o acesso para sempre ANTES de existir a surpresa do Vitalício ganha agora
   o número de membro (na ordem em que recebeu) e o aviso no celular. */
export async function vipMigrate(env, notify, now = Date.now()) {
  if (await env.CAL.get('vip-migrated-1')) return 0;
  await env.CAL.put('vip-migrated-1', String(now));
  const reg = await regAll(env);
  const seen = new Set(), olds = [];
  for (const u of Object.values(reg)) {
    if (!u || !u.ws || seen.has(u.ws) || !/^[A-Za-z0-9]{6,64}$/.test(u.ws)) continue;
    seen.add(u.ws);
    const b = await getBill(env, u.ws);
    if (b && b.lifetime && b.comp && !b.vip) olds.push(b);
  }
  olds.sort((a, b) => (a.lifetimeAt || 0) - (b.lifetimeAt || 0));
  for (const b of olds) {
    b.vip = { no: await vipLivre(env, b.uid), at: b.lifetimeAt || now };
    b.vip.sent = await notify(b.uid).catch(() => 0);
    b.updatedAt = now;
    await putBill(env, b.uid, b);
  }
  return olds.length;
}

/* Para o Painel do dono: situação de cada conta */
/* quem já pagava antes do contador existir: soma uma vez os pagamentos que a Stripe tem dessa pessoa */
async function syncSpent(env, ws, b, fetchImpl) {
  try {
    const r = await fetchImpl(`https://api.stripe.com/v1/charges?customer=${encodeURIComponent(b.customer)}&limit=100`, { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } });
    if (!r.ok) return b;
    const j = await r.json();
    const ok = (j.data || []).filter((c) => c.paid && c.status === 'succeeded');
    b.spent = ok.reduce((a, c) => a + (c.amount_captured ?? c.amount ?? 0) - (c.amount_refunded || 0), 0);
    b.payments = ok.length;
    if (ok.length) b.lastPaidAt = Math.max(...ok.map((c) => (c.created || 0) * 1000));
    b.spentSynced = Date.now();
    await putBill(env, ws, b);
  } catch (e) { console.log('somar pagamentos', e.message); }
  return b;
}
export async function billingAll(env, fetchImpl = fetch) {
  const reg = await regAll(env);
  const out = {};
  await Promise.all(Object.values(reg).map(async (u) => {
    let b = await getBill(env, u.ws);
    if (b && b.customer && !b.spentSynced && env.STRIPE_SECRET_KEY) b = await syncSpent(env, u.ws, b, fetchImpl);
    out[u.ws] = { ...statusOf(b, { ws: u.ws }), spent: (b && b.spent) || 0, payments: (b && b.payments) || 0, ...(b && b.lastPaidAt ? { lastPaidAt: b.lastPaidAt } : {}), ...(b && b.founderTeam ? { founderTeam: true } : {}) };
  }));
  return out;
}

/* Excluir conta (LGPD): cancela as assinaturas na Stripe e tira os dados pessoais do registro de cobrança.
   Fica só o mínimo exigido pela lei fiscal (identificadores do pagamento), sem e-mail. */
export async function closeBilling(env, me, fetchImpl = fetch, now = Date.now()) {
  if (me.ws === 'main') return { canceled: 0 };
  const b = await getBill(env, me.ws);
  if (!b) return { canceled: 0 };
  let canceled = 0;
  for (const sub of [b.subActive && b.subscription, b.addon && b.addon.subActive && b.addon.subscription].filter(Boolean)) {
    try { await stripe(env, `subscriptions/${sub}`, {}, fetchImpl, 'DELETE'); canceled++; } catch (e) { console.log('cancelar assinatura', sub, e.message); }
  }
  const keep = { uid: b.uid, customer: b.customer || null, lifetime: !!b.lifetime, lifetimeAt: b.lifetimeAt || null, subscription: b.subscription || null, deletedAt: now, trialEndsAt: b.trialEndsAt || null, trialDenied: b.trialDenied || null };
  if (b.addon) keep.addon = { plan: b.addon.plan, subscription: b.addon.subscription || null, subActive: false };
  await putBill(env, me.ws, keep);
  // a equipe do dono acaba: convidados perdem o acesso
  const team = await env.CAL.get(`team:${me.ws}`, 'json');
  if (team) await Promise.all([...(team.members || []).map((m) => env.CAL.delete(`member:${m.uid}`)), env.CAL.delete(`team:${me.ws}`)]);
  await env.CAL.delete(`member:${me.ws}`);
  return { canceled };
}
