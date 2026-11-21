/* Painel do dono: quem usa o app, com detalhes de cada conta (só números, nunca o conteúdo pessoal) */
import { store } from '../store.js';
import { openSheet, sheetHead, toast } from '../components.js';
import { icon } from '../icons.js';
import { esc, todayKey, addDays } from '../utils.js';
import { CONFIG } from '../../config.js';
import { DIFFICULTIES, GOALS, JOURNEYS } from '../persona.js';

/* "no app agora": sinal de presença do último 2,5 min (o app manda 1 por minuto enquanto está aberto) */
const isOnline = (u) => !!u.online && u.lastPing && Date.now() - u.lastPing < 150e3;
const when = (ms) => (ms ? new Date(ms).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—');
const ago = (ms) => {
  if (!ms) return '—';
  const m = Math.round((Date.now() - ms) / 60e3);
  if (m < 2) return 'agora';
  if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ontem' : `há ${d} dias`;
};
const date = (ms) => (ms ? new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—');
const DEV = { ios: 'iPhone', 'ios-other': 'iPhone (Chrome)', android: 'Android', samsung: 'Android (Samsung)', desktop: 'Computador' };
const NOTIF = { granted: 'ligadas', denied: 'bloqueadas', default: 'não ativadas', unsupported: 'não suportadas' };

function face(u, size = 44) {
  const letter = (u.name || u.email || '?').trim().charAt(0).toUpperCase();
  return `<span class="aface" style="--s:${size}px;background:${esc(u.color || '#8E8E93')}">${u.photo ? `<img src="${u.photo}" alt="">` : esc(letter)}</span>`;
}
function last30(u) {
  const t = todayKey();
  const set = new Set(u.activeDays || []);
  return Array.from({ length: 30 }, (_, i) => addDays(t, i - 29)).map((d) => `<i class="${set.has(d) ? 'on' : ''}" title="${d.split('-').reverse().join('/')}"></i>`).join('');
}
let planOf = () => null;
const planLabel = (p) => (!p ? 'Conta própria' : p.comp ? 'Cortesia' : { trial: 'Teste grátis', monthly: 'Mensal', lifetime: 'Vitalício', expired: 'Teste acabou', blocked: 'Sem plano', none: 'Sem plano' }[p.plan] || 'Conta própria');
function card(u, open) {
  const c = u.counts || {};
  const d = u.device || {};
  const online = isOnline(u);
  const last = Math.max(u.lastPing || 0, u.lastSeen || 0);
  return `<div class="acct${open ? ' is-open' : ''}" data-uid="${esc(u.uid)}">
    <button class="acct__top" data-toggle="${esc(u.uid)}">
      ${face(u)}
      <div class="acct__id"><strong>${esc(u.name || 'Sem nome')}${online ? ' <span class="adot" title="Usando agora"></span>' : ''}</strong><small>${esc(u.email || '')}</small></div>
      <div class="acct__last"><b class="${online ? 'is-live' : ''}">${online ? 'no app agora' : esc(`saiu ${ago(last)}`)}</b><small>${u.workspace === 'dupla' ? 'Dupla' : u.workspace === 'compartilhada' ? 'Convidado' : planLabel(planOf(u.uid))}${planOf(u.uid)?.addon?.active ? ` + ${planOf(u.uid).addon.plan === 'equipe' ? 'Equipe' : 'Dupla'}` : ''}</small></div>
    </button>
    ${u.profile?.done ? `<div class="acct__prof">${icon('idcard', 13)} <b>${esc(u.profile.profession || '—')}</b>${u.profile.age ? ` · ${esc(u.profile.age)} anos` : ''} · índice ${u.profile.index}/100</div>` : u.workspace !== 'dupla' ? `<div class="acct__prof is-off">${icon('idcard', 13)} Ficha não preenchida</div>` : ''}
    <div class="acct__chips">
      <span>${icon('building', 12)} ${c.companies || 0} grupos</span>
      <span>${icon('calendar', 12)} ${c.myEvents || 0} eventos</span>
      <span>${icon('heart', 12)} ${c.personal || 0} pessoais</span>
      <span class="${d.notifications === 'granted' && d.registered ? 'ok' : 'warn'}">${icon('bell', 12)} ${d.notifications === 'granted' && d.registered ? 'avisos ok' : 'sem avisos'}</span>
    </div>
    ${open ? `<div class="acct__more">
      <div class="agrid">
        <div><small>Conta criada</small><b>${esc(date(u.createdAt))}</b></div>
        <div><small>Agora</small><b>${online ? '🟢 Com o app aberto' : '⚪ App fechado'}</b></div>
        <div><small>Última vez que entrou</small><b>${esc(when(u.lastOpen || u.lastSeen))}</b></div>
        <div><small>Saiu do app</small><b>${online ? '—' : esc(when(u.closedAt || last))}</b></div>
        <div><small>Vezes que abriu</small><b>${u.opens || 0}</b></div>
        <div><small>Dias ativos (30 dias)</small><b>${(u.activeDays || []).filter((x) => x >= addDays(todayKey(), -29)).length}</b></div>
        <div><small>Aparelho</small><b>${esc(DEV[d.platform] || '—')}</b></div>
        <div><small>Instalado na tela inicial</small><b>${d.installed ? 'Sim' : 'Não'}</b></div>
        <div><small>Notificações</small><b>${esc(NOTIF[d.notifications] || '—')}${d.registered ? ' · cadastrado' : ''}</b></div>
        <div><small>Último modo usado</small><b>${u.space === 'personal' ? 'Pessoal' : 'Trabalho'}</b></div>
      </div>
      ${u.profile?.done ? `<h4>Ficha</h4>
      <div class="agrid">
        <div><small>Profissão</small><b>${esc(u.profile.profession || '—')}</b></div>
        <div><small>Área</small><b>${esc(u.profile.area || '—')}</b></div>
        <div><small>Idade</small><b>${esc(u.profile.age || '—')}</b></div>
        <div><small>Índice de esquecimento</small><b>${u.profile.index}/100 (marcou ${u.profile.forget}/5)</b></div>
        <div><small>Jornada</small><b>${esc(JOURNEYS.find((j) => j.id === u.profile.journey)?.label || '—')}</b></div>
        <div><small>Objetivo</small><b>${esc(GOALS.find((g) => g.id === u.profile.goal)?.label || '—')}</b></div>
      </div>
      ${(u.profile.difficulties || []).length ? `<div class="adiffs">${u.profile.difficulties.map((d) => `<span>${esc(DIFFICULTIES.find((x) => x.id === d)?.label || d)}</span>`).join('')}</div>` : ''}` : ''}
      <h4>Trabalho</h4>
      <div class="agrid">
        <div><small>Empresas / grupos</small><b>${c.companies || 0}</b></div>
        <div><small>Eventos (total no espaço)</small><b>${c.events || 0}</b></div>
        <div><small>Cadastrados pela pessoa</small><b>${c.myEvents || 0}</b></div>
        <div><small>Próximos 7 dias</small><b>${c.thisWeek || 0}</b></div>
        <div><small>Posts (30 dias)</small><b>${c.posts30 || 0}</b></div>
        <div><small>Feitos (30 dias)</small><b>${c.done30 || 0}</b></div>
        <div><small>Atrasados (30 dias)</small><b class="${c.late ? 'bad' : ''}">${c.late || 0}</b></div>
        <div><small>Bilhetes</small><b>${c.notes || 0}</b></div>
      </div>
      <h4>Pessoal <small>(só quantidade; o conteúdo é privado)</small></h4>
      <div class="agrid">
        <div><small>Anotações</small><b>${c.personal || 0}</b></div>
        <div><small>Listas</small><b>${c.lists || 0}</b></div>
        <div><small>Aniversários</small><b>${c.birthdays || 0}</b></div>
      </div>
      <h4>Uso nos últimos 30 dias</h4>
      <div class="adays">${last30(u)}</div>
      ${u.workspace === 'proprio' ? `<h4>Acesso</h4>
      ${planOf(u.uid)?.comp ? `<button class="btn btn--soft btn--block" data-grant="${esc(u.uid)}" data-on="0">Tirar o acesso cortesia</button>`
        : planOf(u.uid)?.plan === 'lifetime' || planOf(u.uid)?.plan === 'monthly' ? '<p class="fhelp">Conta paga.</p>'
          : `<button class="btn btn--primary btn--block" data-grant="${esc(u.uid)}" data-on="1">Liberar acesso cortesia (revisor da loja, parceiro)</button>`}` : ''}
    </div>` : ''}
  </div>`;
}

/* O que as fichas dizem: profissões, áreas e dores mais comuns (para decidir o que melhorar e onde vender) */
function insightsHtml(users) {
  const fichas = users.map((u) => u.profile).filter((p) => p && p.done);
  if (!fichas.length) return '';
  const top = (arr, n = 5) => Object.entries(arr.reduce((a, k) => { if (k) a[k] = (a[k] || 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]).slice(0, n);
  const bar = ([k, v], label = k) => `<li><span>${esc(label)}</span><i style="--w:${Math.round((v / fichas.length) * 100)}%"></i><b>${v}</b></li>`;
  const avg = Math.round(fichas.reduce((a, p) => a + (p.index || 0), 0) / fichas.length);
  return `<div class="ainsights">
    <div class="ainsights__head"><b>${fichas.length} ficha${fichas.length > 1 ? 's' : ''} preenchida${fichas.length > 1 ? 's' : ''}</b><small>índice médio de esquecimento ${avg}/100</small></div>
    <h4>Profissões</h4><ul class="abars">${top(fichas.map((p) => p.profession)).map((e) => bar(e)).join('')}</ul>
    <h4>Áreas</h4><ul class="abars">${top(fichas.map((p) => p.area)).map((e) => bar(e)).join('')}</ul>
    <h4>Maiores dificuldades</h4><ul class="abars">${top(fichas.flatMap((p) => p.difficulties || [])).map((e) => bar(e, DIFFICULTIES.find((d) => d.id === e[0])?.label || e[0])).join('')}</ul>
  </div>`;
}

/* De onde vieram os cadastros (links com ?utm_source=…): quantos entraram e quantos pagaram, por origem e campanha */
function originHtml(users) {
  const solo = users.filter((u) => u.workspace === 'proprio');
  if (!solo.length) return '';
  const by = {};
  for (const u of solo) {
    const o = u.origin || {};
    const key = o.source ? `${o.source}${o.campaign ? ' · ' + o.campaign : ''}` : 'direto / sem marcação';
    const p = planOf(u.uid);
    const e = (by[key] = by[key] || { n: 0, paid: 0, trial: 0 });
    e.n++;
    if (p && (p.plan === 'monthly' || (p.plan === 'lifetime' && !p.comp))) e.paid++;
    if (p && p.plan === 'trial') e.trial++;
  }
  const rows = Object.entries(by).sort((a, b) => b[1].n - a[1].n).slice(0, 12);
  return `<h3 class="ah">De onde vieram</h3>
  <div class="agroup">${rows.map(([k, v]) => `<div class="arow"><span>${esc(k)}<small>${v.trial} em teste · ${v.paid} pagaram${v.n ? ` · ${Math.round((v.paid / v.n) * 100)}%` : ''}</small></span><b>${v.n}</b></div>`).join('')}</div>
  <p class="fhelp">Use links com marcação nos anúncios, ex.: <b>…/conheca/?utm_source=instagram&amp;utm_campaign=dentistas</b>, para saber qual anúncio traz quem paga.</p>`;
}

/* Erros vindos dos aparelhos (sem conteúdo da agenda): para achar e corrigir bugs */
function errorsHtml(errors) {
  if (errors === null) return '';
  return `<section class="block">
    ${errors.length ? `<div class="aerrs">${errors.slice(0, 40).map((e) => `<div class="aerr">
        <div class="aerr__top"><b>${esc(e.msg)}</b><span>${e.count}×</span></div>
        <small>${esc(e.where || '—')} · ${esc(e.dev || '')} · versão ${esc(e.ver || '?')} · ${(e.users || []).length} pessoa${(e.users || []).length === 1 ? '' : 's'} · último ${esc(ago(e.last))}</small>
      </div>`).join('')}</div>
      <button class="btn btn--soft btn--sm" data-clear-errors>Limpar a lista (depois de corrigir)</button>`
      : `<p class="fhelp">Nenhum erro registrado. 🎉 Quando algo der errado no celular de alguém, aparece aqui.</p>`}
  </section>`;
}

/* Cada conta grava o próprio resumo: o painel trata tudo como não confiável (números viram números, foto só imagem) */
const N = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const S = (v, n = 120) => (typeof v === 'string' ? v.slice(0, n) : '');
function cleanStat(u) {
  const c = u.counts || {}, d = u.device || {}, p = u.profile || {};
  return {
    uid: S(u.uid, 64), name: S(u.name, 60), email: S(u.email, 120), workspace: S(u.workspace, 20), space: S(u.space, 20),
    photo: typeof u.photo === 'string' && /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(u.photo) ? u.photo : null,
    color: /^#[0-9a-fA-F]{6}$/.test(u.color || '') ? u.color : '#8E8E93',
    createdAt: N(u.createdAt), lastSeen: N(u.lastSeen), opens: N(u.opens), online: !!u.online, lastPing: N(u.lastPing), lastOpen: N(u.lastOpen), closedAt: N(u.closedAt),
    activeDays: Array.isArray(u.activeDays) ? u.activeDays.filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)).slice(-40) : [],
    counts: Object.fromEntries(['companies', 'events', 'myEvents', 'thisWeek', 'done30', 'late', 'posts30', 'notes', 'personal', 'lists', 'birthdays'].map((k) => [k, N(c[k])])),
    device: { platform: S(d.platform, 20), installed: !!d.installed, notifications: S(d.notifications, 20), registered: !!d.registered },
    origin: u.origin && typeof u.origin === 'object' ? { source: S(u.origin.source, 60), medium: S(u.origin.medium, 60), campaign: S(u.origin.campaign, 60) } : null,
    profile: p.done ? { done: true, profession: S(p.profession, 80), area: S(p.area, 80), age: S(p.age, 10), index: N(p.index), forget: N(p.forget),
      difficulties: Array.isArray(p.difficulties) ? p.difficulties.filter((x) => typeof x === 'string').slice(0, 12).map((x) => x.slice(0, 30)) : [],
      goal: S(p.goal, 30), journey: S(p.journey, 30) } : { done: false },
  };
}

export async function openAdmin() {
  let users = null, err = null, openUid = null, q = '', plans = {}, errors = null, tab = 'resumo';
  const html = () => {
    const head = sheetHead('Painel do dono', { right: '<button class="btn-text" data-reload>Atualizar</button>' });
    if (err) return `${head}<div class="page page--sheet"><div class="empty"><h3>Não consegui carregar</h3><p>${esc(err)}</p></div></div>`;
    if (!users) return `${head}<div class="page page--sheet"><p class="fhelp">Carregando…</p></div>`;
    const now = Date.now();
    const act = (days) => users.filter((u) => u.lastSeen && now - u.lastSeen < days * 864e5).length;
    const newWeek = users.filter((u) => u.createdAt && now - u.createdAt < 7 * 864e5).length;
    planOf = (uid) => plans[uid] || null;
    const P = Object.values(plans);
    const monthly = P.filter((p) => p.plan === 'monthly').length;
    const lifetime = P.filter((p) => p.plan === 'lifetime' && !p.comp).length;
    const trial = P.filter((p) => p.plan === 'trial').length;
    const addons = P.filter((p) => p.addon && p.addon.active);
    // receita por mês: mensais + complementos (vitalício paga o complemento mais barato); o vitalício em si entra uma vez só
    const mrr = monthly * 9.9 + addons.reduce((a, p) => a + (p.addon.plan === 'equipe' ? (p.plan === 'lifetime' ? 9.9 : 14.9) : (p.plan === 'lifetime' ? 4.9 : 6.9)), 0);
    const tried = P.filter((p) => p.plan !== 'none' && p.plan !== 'team').length;
    const conv = tried ? Math.round(((monthly + lifetime) / tried) * 100) : 0;
    const money = (v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const row = (label, value, sub = '') => `<div class="arow"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><b>${value}</b></div>`;
    const installed = users.filter((u) => u.device?.installed).length;
    const notif = users.filter((u) => u.device?.notifications === 'granted' && u.device?.registered).length;
    const pct = (n) => (users.length ? ` · ${Math.round((n / users.length) * 100)}%` : '');
    const tabs = `<div class="aseg" role="tablist">${[['resumo', 'Resumo'], ['pessoas', `Pessoas · ${users.length}`], ['erros', `Erros${errors && errors.length ? ` · ${errors.length}` : ''}`]].map(([k, l]) => `<button role="tab" class="${tab === k ? 'is-on' : ''}" data-tab-admin="${k}">${l}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'resumo') {
      body = `
      <div class="ahero">
        <small>Receita por mês</small>
        <b>${money(mrr)}</b>
        <span>${monthly} ${monthly === 1 ? 'assinante mensal' : 'assinantes mensais'} · ${addons.length} agenda${addons.length === 1 ? '' : 's'} compartilhada${addons.length === 1 ? '' : 's'}</span>
      </div>
      <div class="atiles">
        <div><b>${act(1)}</b><small>ativas hoje</small></div>
        <div><b>${monthly + lifetime}</b><small>pagantes</small></div>
        <div><b>${trial}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${row('Vitalícios vendidos', `${lifetime}`, `${money(lifetime * 150)} no total`)}
        ${row('Assinantes do Mensal', `${monthly}`)}
        ${row('Agendas compartilhadas', `${addons.length}`, `${addons.filter((p) => p.addon.plan === 'equipe').length} Equipe · ${addons.filter((p) => p.addon.plan === 'dupla').length} Dupla`)}
        ${row('Conversão do teste', `${conv}%`, 'quem pagou ÷ quem testou')}
      </div>
      <h3 class="ah">Pessoas</h3>
      <div class="agroup">
        ${row('Contas', `${users.length}`, `${newWeek} nova${newWeek === 1 ? '' : 's'} nos últimos 7 dias`)}
        ${row('No app agora', `${users.filter(isOnline).length}`)}
        ${row('Ativas na semana', `${act(7)}`)}
        ${row('Convidados (agenda de outra pessoa)', `${users.filter((u) => u.workspace === 'compartilhada').length}`)}
      </div>
      <h3 class="ah">Saúde do app</h3>
      <div class="agroup">
        ${row('Instalaram na tela inicial', `${installed}${pct(installed)}`)}
        ${row('Recebem notificações', `${notif}${pct(notif)}`, notif < users.length ? 'sem isso, os lembretes não chegam' : '')}
        ${row('Compromissos criados', `${users.reduce((a, u) => a + (u.counts?.myEvents || 0), 0)}`)}
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${errors && errors.length ? 'bad' : 'good'}">${errors === null ? '—' : errors.length ? `${errors.length} ›` : 'nenhum ✓'}</b></button>
      </div>
      ${originHtml(users)}
      ${insightsHtml(users)}`;
    } else if (tab === 'pessoas') {
      const list = users.filter((u) => !q || `${u.name} ${u.email} ${u.profile?.profession || ''}`.toLowerCase().includes(q)).sort((a, b) => (isOnline(b) - isOnline(a)) || (Math.max(b.lastPing || 0, b.lastSeen || 0) - Math.max(a.lastPing || 0, a.lastSeen || 0)));
      body = `<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profissão" data-q value="${esc(q)}">
      <div class="accts">${list.map((u) => card(u, u.uid === openUid)).join('') || '<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que já abriram o app atualizado.</p>`;
    } else body = errorsHtml(errors) || '<p class="fhelp">Não consegui ler os erros agora.</p>';
    return `${head}<div class="page page--sheet apanel">${tabs}${body}</div>`;
  };
  const api = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      a.el.querySelectorAll('[data-toggle]').forEach((b) => (b.onclick = () => { openUid = openUid === b.dataset.toggle ? null : b.dataset.toggle; a.set(html()); }));
      a.el.querySelectorAll('[data-tab-admin]').forEach((b) => (b.onclick = () => { tab = b.dataset.tabAdmin; a.set(html()); a.el.scrollTop = 0; }));
      a.el.querySelectorAll('[data-grant]').forEach((b) => (b.onclick = async () => {
        b.disabled = true;
        try {
          const { api } = await import('../avisos.js');
          const r = await api('/admin/grant', { uid: b.dataset.grant, on: b.dataset.on === '1' });
          plans[b.dataset.grant] = r.status; toast(b.dataset.on === '1' ? 'Acesso cortesia liberado ✓' : 'Acesso cortesia retirado'); a.set(html());
        } catch (e) { b.disabled = false; toast(e.message || 'Não consegui agora.'); }
      }));
      const r = a.el.querySelector('[data-reload]');
      if (r) r.onclick = () => load();
      const ce = a.el.querySelector('[data-clear-errors]');
      if (ce) ce.onclick = async () => { try { const { api } = await import('../avisos.js'); errors = (await api('/admin/errors', { clear: true })).errors || []; a.set(html()); } catch { toast('Não consegui limpar agora.'); } };
      const s = a.el.querySelector('[data-q]');
      if (s) s.oninput = () => { q = s.value.trim().toLowerCase(); const pos = s.selectionStart; a.set(html()); const n = a.el.querySelector('[data-q]'); n.focus(); n.setSelectionRange(pos, pos); };
    },
  });
  const load = async () => {
    try {
      users = (await store.backendApi.listStats()).map(cleanStat); err = null;
      try { const { api } = await import('../avisos.js'); plans = (await api('/billing/all', {})).byWs || {}; } catch { plans = {}; }
      try { const { api } = await import('../avisos.js'); errors = (await api('/admin/errors', {})).errors || []; } catch { errors = null; }
    }
    catch (e) { err = /permission/i.test(String(e.code || e.message)) ? 'Falta atualizar as regras do Firebase (bloco “stats”).' : 'Verifique a internet e toque em Atualizar.'; }
    api.set(html());
  };
  load();
  return api;
}

export const isOwner = () => !!store.user && !!CONFIG.adminEmail && (store.user.email || '').toLowerCase() === CONFIG.adminEmail.toLowerCase();
