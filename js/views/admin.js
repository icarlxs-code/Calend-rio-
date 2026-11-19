/* Painel do dono: quem usa o app, com detalhes de cada conta (só números, nunca o conteúdo pessoal) */
import { store } from '../store.js';
import { openSheet, sheetHead, toast } from '../components.js';
import { icon } from '../icons.js';
import { esc, todayKey, addDays } from '../utils.js';
import { CONFIG } from '../../config.js';
import { DIFFICULTIES, GOALS, JOURNEYS } from '../persona.js';

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
const planLabel = (p) => (!p ? 'Conta própria' : { trial: 'Teste grátis', monthly: 'Mensal', lifetime: 'Vitalício', expired: 'Teste acabou', blocked: 'Sem plano', none: 'Sem plano' }[p.plan] || 'Conta própria');
function card(u, open) {
  const c = u.counts || {};
  const d = u.device || {};
  const online = u.lastSeen && Date.now() - u.lastSeen < 15 * 60e3;
  return `<div class="acct${open ? ' is-open' : ''}" data-uid="${esc(u.uid)}">
    <button class="acct__top" data-toggle="${esc(u.uid)}">
      ${face(u)}
      <div class="acct__id"><strong>${esc(u.name || 'Sem nome')}${online ? ' <span class="adot" title="Usando agora"></span>' : ''}</strong><small>${esc(u.email || '')}</small></div>
      <div class="acct__last"><b>${esc(ago(u.lastSeen))}</b><small>${u.workspace === 'dupla' ? 'Dupla' : u.workspace === 'compartilhada' ? 'Convidado' : planLabel(planOf(u.uid))}${planOf(u.uid)?.addon?.active ? ` + ${planOf(u.uid).addon.plan === 'equipe' ? 'Equipe' : 'Dupla'}` : ''}</small></div>
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
        <div><small>Último acesso</small><b>${esc(u.lastSeen ? new Date(u.lastSeen).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—')}</b></div>
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
        <div><small>Cadastrados por ele(a)</small><b>${c.myEvents || 0}</b></div>
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

export async function openAdmin() {
  let users = null, err = null, openUid = null, q = '', plans = {};
  const html = () => {
    if (err) return `${sheetHead('Painel do dono')}<div class="page page--sheet"><div class="empty"><h3>Não consegui carregar</h3><p>${esc(err)}</p></div></div>`;
    if (!users) return `${sheetHead('Painel do dono')}<div class="page page--sheet"><p class="fhelp">Carregando contas…</p></div>`;
    const now = Date.now();
    const act = (days) => users.filter((u) => u.lastSeen && now - u.lastSeen < days * 864e5).length;
    const list = users.filter((u) => !q || `${u.name} ${u.email} ${u.profile?.profession || ''}`.toLowerCase().includes(q)).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
    const newWeek = users.filter((u) => u.createdAt && now - u.createdAt < 7 * 864e5).length;
    planOf = (uid) => plans[uid] || null;
    const paying = Object.values(plans).filter((p) => p.plan === 'monthly' || p.plan === 'lifetime');
    const addons = Object.values(plans).filter((p) => p.addon && p.addon.active);
    // receita recorrente por mês: mensais + complementos de agenda compartilhada (o vitalício entra uma vez só)
    const mrr = Object.values(plans).filter((p) => p.plan === 'monthly').length * 9.9 + addons.reduce((a, p) => a + (p.addon.plan === 'equipe' ? 14.9 : 6.9), 0);
    return `${sheetHead('Painel do dono', { right: '<button class="btn-text" data-reload>Atualizar</button>' })}
    <div class="page page--sheet">
      <div class="akpis">
        <div><b>${users.length}</b><small>contas</small></div>
        <div><b>${users.filter((u) => u.lastSeen && now - u.lastSeen < 15 * 60e3).length}</b><small>usando agora</small></div>
        <div><b>${act(1)}</b><small>ativas hoje</small></div>
        <div><b>${act(7)}</b><small>na semana</small></div>
        <div><b>${newWeek}</b><small>novas (7 dias)</small></div>
        <div><b>${users.filter((u) => u.device?.installed).length}</b><small>instalaram</small></div>
        <div><b>${users.filter((u) => u.device?.notifications === 'granted' && u.device?.registered).length}</b><small>com avisos</small></div>
        <div><b>${users.reduce((a, u) => a + (u.counts?.myEvents || 0), 0)}</b><small>eventos criados</small></div>
        <div><b>${paying.length}</b><small>pagantes</small></div>
        <div><b>${Object.values(plans).filter((p) => p.plan === 'trial').length}</b><small>em teste</small></div>
        <div><b>${Object.values(plans).filter((p) => p.plan === 'lifetime').length}</b><small>vitalícios</small></div>
        <div><b>${addons.length}</b><small>agendas compartilhadas</small></div>
        <div><b>${users.filter((u) => u.workspace === 'compartilhada').length}</b><small>convidados</small></div>
        <div><b>R$ ${mrr.toFixed(2).replace('.', ',')}</b><small>por mês</small></div>
      </div>
      ${insightsHtml(users)}
      <input class="input" type="search" placeholder="Buscar por nome, e-mail ou profissão" data-q value="${esc(q)}">
      <div class="accts">${list.map((u) => card(u, u.uid === openUid)).join('') || '<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">As contas aparecem aqui depois de abrirem o app atualizado pelo menos uma vez. Toque numa conta para ver os detalhes.</p>
    </div>`;
  };
  const api = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      a.el.querySelectorAll('[data-toggle]').forEach((b) => (b.onclick = () => { openUid = openUid === b.dataset.toggle ? null : b.dataset.toggle; a.set(html()); }));
      const r = a.el.querySelector('[data-reload]');
      if (r) r.onclick = () => load();
      const s = a.el.querySelector('[data-q]');
      if (s) s.oninput = () => { q = s.value.trim().toLowerCase(); const pos = s.selectionStart; a.set(html()); const n = a.el.querySelector('[data-q]'); n.focus(); n.setSelectionRange(pos, pos); };
    },
  });
  const load = async () => {
    try {
      users = await store.backendApi.listStats(); err = null;
      try { const { api } = await import('../avisos.js'); plans = (await api('/billing/all', {})).byWs || {}; } catch { plans = {}; }
    }
    catch (e) { err = /permission/i.test(String(e.code || e.message)) ? 'Falta atualizar as regras do Firebase (bloco “stats”).' : 'Verifique a internet e toque em Atualizar.'; }
    api.set(html());
  };
  load();
  return api;
}

export const isOwner = () => !!store.user && !!CONFIG.adminEmail && (store.user.email || '').toLowerCase() === CONFIG.adminEmail.toLowerCase();
