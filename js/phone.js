/* Celular confirmado por SMS (Firebase Phone Auth): prova que o chip é da pessoa.
   - Confirmar o celular: liga o número à conta (anti-fraude: um número = uma conta; emblema "Número confirmado").
   - Recuperar a senha pelo celular: entra com o código do SMS e cria uma senha nova.
   Custa cerca de US$ 0,02 por SMS no Brasil e precisa do plano Blaze do Firebase com o login por telefone ligado.
   Por isso só aparece com CONFIG.phoneAuth = true (ou, nos testes, localStorage "cal.phoneAuth" = "1"). */
import { CONFIG } from '../config.js';
import { store, saveUserProfile } from './store.js';
import { openSheet, sheetHead, toast } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { maskPhone, validPhone } from './persona.js';

export const phoneAuthOn = () => { try { return !!CONFIG.phoneAuth || localStorage.getItem('cal.phoneAuth') === '1'; } catch { return !!CONFIG.phoneAuth; } };
export const toE164 = (masked) => { let c = String(masked || '').replace(/\D/g, ''); if (c.length > 11 && c.startsWith('55')) c = c.slice(2); return `+55${c}`; };
const ERR = {
  'auth/invalid-phone-number': 'Número inválido. Use DDD + número, ex.: (11) 98765-4321.',
  'auth/too-many-requests': 'Muitas tentativas. Espere alguns minutos e tente de novo.',
  'auth/invalid-verification-code': 'Código errado. Confira os 6 números do SMS.',
  'auth/code-expired': 'O código expirou. Peça um novo.',
  'auth/credential-already-in-use': 'Esse número já está confirmado em outra conta do Lembra.',
  'auth/account-exists-with-different-credential': 'Esse número já está confirmado em outra conta do Lembra.',
  'auth/provider-already-linked': 'Sua conta já tem um celular confirmado.',
  'auth/quota-exceeded': 'Limite de SMS do dia atingido. Tente amanhã.',
  'auth/operation-not-allowed': 'O envio de SMS ainda não foi ligado pelo Lembra.',
  'auth/billing-not-enabled': 'O envio de SMS ainda não foi ligado pelo Lembra.',
  'auth/captcha-check-failed': 'Não deu para confirmar que você não é um robô. Tente de novo.',
  'auth/user-not-found': 'Nenhuma conta tem esse celular confirmado.',
  'auth/missing-phone-number': 'Digite o número do celular.',
};
export const phoneErr = (e) => ERR[e?.code] || 'Não consegui agora. Verifique a internet e tente de novo.';

/* tela com 2 passos: número → código de 6 dígitos */
function codeSheet({ title, lead, start, finish, done }) {
  let step = 'phone', phone = '', msg = '', confirm = null, busy = false, sentAt = 0;
  const html = () => `${sheetHead(title)}
    <div class="page page--sheet psms">
      <span class="psms__ic">${icon(step === 'phone' ? 'phone' : 'shield', 28)}</span>
      <p class="psms__lead">${step === 'phone' ? esc(lead) : `Enviamos um SMS com 6 números para <b>${esc(maskPhone(phone))}</b>.`}</p>
      ${step === 'phone'
        ? `<label class="flabel" for="sms-phone">Celular com DDD</label><input id="sms-phone" class="input psms__in" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(11) 98765-4321" value="${esc(maskPhone(phone))}" data-phone>`
        : `<label class="flabel" for="sms-code">Código do SMS</label><input id="sms-code" class="input psms__in psms__code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" data-code>`}
      ${msg ? `<p class="login__err" role="alert">${esc(msg)}</p>` : ''}
      <button class="btn btn--primary btn--block" data-go ${busy ? 'disabled' : ''}>${busy ? 'Aguarde…' : step === 'phone' ? 'Enviar código por SMS' : 'Confirmar código'}</button>
      ${step === 'code' ? `<button class="btn-text btn-text--sm" data-again>Mudar o número ou reenviar</button>` : ''}
      <div id="sms-captcha"></div>
      <p class="fhelp">Usamos o número só para confirmar que é você. ${step === 'phone' ? 'Pode chegar em até 1 minuto.' : ''}</p>
    </div>`;
  const a = openSheet({
    html: html(),
    onMount: (x) => {
      const el = x.el;
      const pi = el.querySelector('[data-phone]'); if (pi) { pi.oninput = () => { pi.value = maskPhone(pi.value); phone = pi.value; }; setTimeout(() => pi.focus(), 300); }
      const ci = el.querySelector('[data-code]'); if (ci) { ci.oninput = () => { ci.value = ci.value.replace(/\D/g, '').slice(0, 6); if (ci.value.length === 6) el.querySelector('[data-go]').click(); }; setTimeout(() => ci.focus(), 300); }
      const ag = el.querySelector('[data-again]'); if (ag) ag.onclick = () => { step = 'phone'; msg = ''; x.set(html()); };
      el.querySelector('[data-go]').onclick = async () => {
        if (busy) return;
        msg = '';
        if (step === 'phone') {
          if (!validPhone(phone) || String(phone).replace(/\D/g, '').length < 10) { msg = 'Digite o celular com DDD, ex.: (11) 98765-4321.'; return x.set(html()); }
          if (Date.now() - sentAt < 30e3) { msg = 'Espere alguns segundos para pedir outro código.'; return x.set(html()); }
          busy = true; x.set(html());
          try { confirm = await start(toE164(phone), 'sms-captcha'); sentAt = Date.now(); step = 'code'; }
          catch (e) { console.warn('sms', e); msg = phoneErr(e); }
          busy = false; x.set(html());
          return;
        }
        const code = (el.querySelector('[data-code]')?.value || '').trim();
        if (!/^\d{6}$/.test(code)) { msg = 'Digite os 6 números do SMS.'; return x.set(html()); }
        busy = true; x.set(html());
        try { const r = await finish(confirm, code); busy = false; x.close(); done && done(r, toE164(phone)); }
        catch (e) { console.warn('sms', e); busy = false; msg = phoneErr(e); x.set(html()); }
      };
    },
  });
  return a;
}

/* Ajustes / Perfil → "Confirmar meu celular" */
export function confirmPhone(after) {
  const api = store.backendApi;
  return codeSheet({
    title: 'Confirmar celular',
    lead: 'Confirme seu número: ajuda a proteger a sua conta e permite recuperar a senha por SMS.',
    start: (e164, box) => api.phoneStart(e164, box, 'link'),
    finish: (c, code) => api.phoneFinish(c, code),
    done: async (r, e164) => {
      try { await saveUserProfile({ phoneVerified: true, phoneE164: e164, phone: maskPhone(e164.slice(3)) }); } catch { /* ok */ }
      toast('Celular confirmado ✓', { ms: 3000 });
      import('./game.js').then((g) => g.startGame()).catch(() => {});
      after && after();
    },
  });
}
/* Tela de login → "Recuperar pelo celular": entra com o SMS e cria a senha nova */
export function recoverBySms(cloudApi, onSigned) {
  return codeSheet({
    title: 'Recuperar pelo celular',
    lead: 'Funciona se você já confirmou o seu celular no Lembra. Enviamos um código por SMS.',
    start: (e164, box) => cloudApi.phoneStart(e164, box, 'signin'),
    finish: (c, code) => cloudApi.phoneFinish(c, code),
    done: () => newPasswordSheet(cloudApi, onSigned),
  });
}
function newPasswordSheet(cloudApi, onSigned) {
  let msg = '';
  const html = () => `${sheetHead('Senha nova')}
    <div class="page page--sheet psms">
      <span class="psms__ic">${icon('lock', 28)}</span>
      <p class="psms__lead">Pronto, é você! Agora crie a senha nova.</p>
      <label class="flabel" for="np1">Senha nova</label><input id="np1" class="input" type="password" autocomplete="new-password" data-p1 placeholder="8+ caracteres, letras e números">
      <label class="flabel" for="np2">Repita a senha</label><input id="np2" class="input" type="password" autocomplete="new-password" data-p2>
      ${msg ? `<p class="login__err" role="alert">${esc(msg)}</p>` : ''}
      <button class="btn btn--primary btn--block" data-go>Salvar e entrar</button>
    </div>`;
  return openSheet({
    html: html(),
    onMount: (x) => {
      x.el.querySelector('[data-go]').onclick = async () => {
        const p1 = x.el.querySelector('[data-p1]').value, p2 = x.el.querySelector('[data-p2]').value;
        if (p1.length < 8 || !/[A-Za-zÀ-ÿ]/.test(p1) || !/\d/.test(p1)) { msg = 'Use pelo menos 8 caracteres, com letras e números.'; return x.set(html()); }
        if (p1 !== p2) { msg = 'As duas senhas não estão iguais.'; return x.set(html()); }
        try { await cloudApi.setPassword(p1); x.close(); toast('Senha nova salva ✓', { ms: 3000 }); onSigned && onSigned(); }
        catch (e) { msg = phoneErr(e); x.set(html()); }
      };
    },
  });
}
