/* Privacidade e dados (LGPD): aceite dos Termos, baixar meus dados, excluir minha conta.
   Direitos do titular (art. 18): acesso, portabilidade, correção (Sua ficha) e eliminação. */
import * as retro from './retro.js';
import { brand } from './brand.js';
import { store, saveUserProfile } from './store.js';
import { personal } from './personal.js';
import { openSheet, sheetHead, toast, confirmDialog } from './components.js';
import { icon } from './icons.js';
import { esc, todayKey } from './utils.js';
import { api, server } from './avisos.js';
import { CONFIG } from '../config.js';

const local = () => /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
export const pageUrl = (name) => `${local() || !CONFIG.siteUrl ? location.pathname.replace(/[^/]*$/, '') : CONFIG.siteUrl.replace(/\/?$/, '/')}${name}/`;
const consentHtml = (checked = false) => `<label class="consent"><input type="checkbox" data-consent ${checked ? 'checked' : ''}><span class="consent__dot" aria-hidden="true">${icon('check', 14)}</span>
  <span>Li e concordo com os <a href="${pageUrl('termos')}" target="_blank" rel="noopener">Termos de Uso</a> e a <a href="${pageUrl('privacidade')}" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>`;

/* Termos novos (ou conta antiga sem aceite registrado): pede a concordância antes de continuar */
export function ensureTermsAccepted() {
  const v = CONFIG.termsVersion || '1.0';
  if (store.mode !== 'cloud' || !store.user || (store.profile && store.profile.termsVersion === v)) return Promise.resolve(true);
  return new Promise((resolve) => {
    const w = document.createElement('div');
    w.className = 'ficha is-open termsgate';
    const first = !store.profile?.consentAt;
    w.innerHTML = `<div class="ficha__inner"><div class="ficha__step">
      <div class="ficha__hero"><div class="brandwrap">${brand('completa', { h: 110 })}</div>
      <h1>${first ? 'Sua privacidade em primeiro lugar' : 'Atualizamos nossos Termos'}</h1>
      <p>Para seguir a Lei Geral de Proteção de Dados (LGPD), precisamos da sua concordância com os Termos de Uso e a Política de Privacidade do ${esc(CONFIG.appName || 'Lembra')}.</p></div>
      <ul class="ficha__bul">
        <li>${icon('lock', 16)} Não vendemos seus dados. Seu modo Pessoal é só seu.</li>
        <li>${icon('download', 16)} Baixe seus dados quando quiser.</li>
        <li>${icon('trash', 16)} Exclua sua conta direto no app.</li>
      </ul>
      ${consentHtml()}
      <p class="ficha__err" hidden></p>
      <div class="ficha__nav"><span></span><button class="btn btn--primary" data-ok>Continuar</button></div>
    </div></div>`;
    document.body.appendChild(w);
    w.querySelector('[data-ok]').onclick = async () => {
      const err = w.querySelector('.ficha__err');
      if (!w.querySelector('[data-consent]').checked) { err.textContent = 'Marque a bolinha de concordância para continuar.'; err.hidden = false; return; }
      try { await saveUserProfile({ consentAt: store.profile?.consentAt || Date.now(), termsVersion: v, termsAcceptedAt: Date.now() }); } catch (e) { console.warn('termos', e); }
      w.remove();
      resolve(true);
    };
  });
}

/* Baixar meus dados (portabilidade): tudo o que é da pessoa, num arquivo */
export async function exportMyData() {
  const uid = store.user?.uid;
  const mine = (e) => (e.createdBy || store.me) === store.me;
  const own = store.workspace === uid;
  const data = {
    exportadoEm: new Date().toISOString(),
    app: CONFIG.appName || 'Lembra',
    conta: { email: store.user?.email || '', criadaEm: store.user?.metadata?.creationTime || null },
    ficha: store.profile || {},
    plano: store.billing || null,
    trabalho: own
      ? { grupos: store.state.companies, compromissos: store.state.events, bilhetes: store.state.notes, ajustes: store.state.settings }
      : { compromissosCadastradosPorVoce: store.state.events.filter(mine), bilhetesSeus: store.state.notes.filter((n) => n.author === store.me) },
    pessoal: personal.items,
    retrospectiva: retro.exporta(), // livro-razão do ano, que só existe neste aparelho
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const name = `meus-dados-lembra-${todayKey()}.json`;
  const file = typeof File === 'function' ? new File([blob], name, { type: 'application/json' }) : null;
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Meus dados do Lembra' }); return; } catch { /* cancelou: baixa */ }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
}

/* Excluir minha conta: confirma a senha, apaga tudo e encerra o login */
async function deleteEverything(password) {
  const { account } = await import('./cloud.js');
  await account.reauth(password); // só quem sabe a senha apaga
  const b = store.backendApi;
  const uid = store.user.uid;
  // 1) servidor: cancela assinaturas na Stripe, aparelhos, lembretes e mensagens
  if (server()) await api('/account/delete', {}).catch((e) => { console.warn('servidor', e); });
  // 2) agenda compartilhada: sai das equipes em que entrou; desfaz a própria equipe e os convites
  for (const owner of Object.keys(store.profile?.teams || {})) await b.leaveTeam(owner, uid).catch(() => {});
  if (store.solo) {
    const invites = await b.listInvites(uid).catch(() => []);
    await Promise.all(invites.map((i) => b.deleteInvite(i.id).catch(() => {})));
    await b.deleteTeam?.(uid).catch(() => {});
  }
  // 3) dados: lê tudo antes; se o login não puder ser encerrado no fim, devolve tudo (nunca fica conta viva e vazia)
  const copia = await b.contaLe(), perfil = { ...(store.profile || {}) };
  await b.contaMarca(true); // a regra do banco só aceita este apagar com a marca feita há menos de 10 minutos
  try {
    await b.contaApaga(copia);
    await b.deleteOwnDocs?.(uid);
    await account.deleteUser();
  } catch (e) {
    await b.saveProfile(uid, perfil).catch(() => {});
    await b.contaRepoe(copia.filter((x) => !x.data._del && !x.data.deletedAt)).catch((x) => console.error('devolver agenda', x));
    await b.contaMarca(false).catch(() => {});
    throw e;
  }
  try { sessionStorage.setItem('lembra.deleted', '1'); } catch { /* ok */ }
  try { Object.keys(localStorage).filter((k) => /^(lembra|cal\.|pauta)/.test(k)).forEach((k) => localStorage.removeItem(k)); } catch { /* ok */ }
}

export function openPrivacy() {
  let verified = null;
  const html = () => `${sheetHead('Privacidade e dados')}
    <div class="page page--sheet">
      <div class="share__plan">${icon('lock', 18)}<div><b>Seus dados são seus</b><small>Tratados conforme a LGPD. Não vendemos dados. O modo Pessoal é só seu.</small></div></div>
      <div class="list">
        <a class="list__row" href="${pageUrl('privacidade')}" target="_blank" rel="noopener">${icon('lock', 18)}<span>Política de Privacidade</span>${icon('right', 16, 'muted')}</a>
        <a class="list__row" href="${pageUrl('termos')}" target="_blank" rel="noopener">${icon('note', 18)}<span>Termos de Uso</span>${icon('right', 16, 'muted')}</a>
        <button class="list__row" data-action="ficha">${icon('idcard', 18)}<span>Ver e corrigir minha ficha</span>${icon('right', 16, 'muted')}</button>
        <button class="list__row" data-export>${icon('download', 18)}<span>Baixar meus dados</span>${icon('right', 16, 'muted')}</button>
      </div>
      <section class="block">
        <h2 class="block__title">${icon('user', 16)} Conta</h2>
        <div class="card card--row"><div><strong>${esc(store.user?.email || '')}</strong><small>${verified === null ? 'Verificando…' : verified ? 'E-mail confirmado ✓' : 'E-mail ainda não confirmado: confirme para proteger a recuperação de senha.'}</small></div>
          ${verified === false ? '<button class="btn btn--soft btn--sm" data-verify>Reenviar</button>' : ''}</div>
        <p class="fhelp">Aceite registrado: Termos e Privacidade versão ${esc(store.profile?.termsVersion || '—')}${store.profile?.termsAcceptedAt || store.profile?.consentAt ? ` em ${new Date(store.profile.termsAcceptedAt || store.profile.consentAt).toLocaleDateString('pt-BR')}` : ''}.</p>
        <button class="list__row is-danger list__row--alone" data-delete>${icon('trash', 18)}<span>Excluir minha conta</span>${icon('right', 16, 'muted')}</button>
        <p class="fhelp">Apaga sua ficha, sua agenda${store.solo ? '' : ' pessoal'}, seu modo Pessoal e cancela assinaturas ativas. Não dá para desfazer. Pedidos também por <a href="mailto:${esc(CONFIG.supportEmail || CONFIG.adminEmail || '')}">${esc(CONFIG.supportEmail || CONFIG.adminEmail || '')}</a>.</p>
      </section>
    </div>`;
  const s = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      const el = a.el;
      el.querySelector('[data-export]').onclick = () => exportMyData().then(() => toast('Seus dados foram exportados ✓')).catch(() => toast('Não consegui gerar o arquivo agora.'));
      const v = el.querySelector('[data-verify]');
      if (v) v.onclick = async () => { const { account } = await import('./cloud.js'); account.resendVerification().then(() => toast('Enviamos o e-mail de confirmação (veja também o spam).', { ms: 5000 })).catch(() => toast('Espere alguns minutos e tente de novo.')); };
      el.querySelector('[data-delete]').onclick = () => askDelete();
    },
  });
  import('./cloud.js').then(async ({ account }) => { try { await account.reload(); } catch { /* ok */ } verified = account.emailVerified(); s.set(html()); }).catch(() => {});
  return s;
}

async function askDelete() {
  const ok = await confirmDialog({ title: 'Excluir sua conta?', text: 'Tudo o que é seu será apagado e as assinaturas ativas serão canceladas. Se pagou nos últimos 7 dias, peça o reembolso pelo e-mail de suporte antes de excluir.', ok: 'Continuar', danger: true });
  if (!ok) return;
  const s = openSheet({
    className: 'sheet--dialog',
    html: `<div class="dialog"><h3>Confirme com a sua senha</h3><p>Por segurança, só quem sabe a senha pode excluir a conta.</p>
      <input class="input" type="password" data-pass autocomplete="current-password" placeholder="Sua senha">
      <p class="login__err" data-err hidden></p>
      <button class="btn btn--danger btn--block" data-go>Excluir para sempre</button>
      <button class="btn btn--ghost btn--block" data-close>Cancelar</button></div>`,
    onMount: (a) => {
      const go = a.el.querySelector('[data-go]');
      go.onclick = async () => {
        const pass = a.el.querySelector('[data-pass]').value;
        const err = a.el.querySelector('[data-err]');
        if (!pass) { err.textContent = 'Digite sua senha.'; err.hidden = false; return; }
        go.disabled = true; go.textContent = 'Excluindo…';
        try {
          await deleteEverything(pass);
          document.body.innerHTML = `<div class="splash"><div class="brandwrap">${brand('simbolo', { h: 64 })}</div><h2>Conta excluída</h2><p>Seus dados foram apagados. Obrigado por ter usado o ${esc(CONFIG.appName || 'Lembra')}.</p></div>`;
          setTimeout(() => location.reload(), 4000);
        } catch (e) {
          go.disabled = false; go.textContent = 'Excluir para sempre';
          const c = String(e.code || e.message);
          err.textContent = /wrong-password|invalid-credential/.test(c) ? 'Senha incorreta.' : /too-many/.test(c) ? 'Muitas tentativas. Espere alguns minutos.' : 'Não consegui excluir agora. Verifique a internet e tente de novo.';
          err.hidden = false;
        }
      };
    },
  });
  return s;
}
