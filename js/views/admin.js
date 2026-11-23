/* Painel do dono: quem usa o app, com detalhes de cada conta (só números, nunca o conteúdo pessoal) */
import { store } from '../store.js';
import { openSheet, sheetHead, toast, confirmDialog } from '../components.js';
import { icon } from '../icons.js';
import { esc, todayKey, addDays } from '../utils.js';
import { CONFIG } from '../../config.js';
import { DIFFICULTIES, GOALS, JOURNEYS, GENDERS, TONES, METHODS, VOLUMES } from '../persona.js';

/* "no app agora": sinal de presença do último 2,5 min (o app manda 1 por minuto enquanto está aberto) */
const isOnline = (u) => !!u.online && u.lastPing && Date.now() - u.lastPing < 6 * 60e3; // o app avisa a cada 4 min
/* "no app agora": vem do servidor de avisos (memória, sem gastar o banco) e completa o resumo de cada conta */
let pres = {};
const withPresence = (list) => list.map((u) => {
  const p = pres[u.uid];
  if (!p || (u.lastPing && u.lastPing > p.lastPing)) return u;
  return { ...u, online: p.online, lastPing: p.lastPing, ...(p.closedAt ? { closedAt: p.closedAt } : {}), ...(p.lastOpen ? { lastOpen: Math.max(p.lastOpen, u.lastOpen || 0), lastSeen: Math.max(p.lastPing, u.lastSeen || 0) } : {}), ...(p.app && p.app.v ? { app: p.app } : {}) };
});
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
const ownerMail = () => String(CONFIG.adminEmail || '').toLowerCase();
const isAppOwner = (u) => !!u && !!u.email && String(u.email).toLowerCase() === ownerMail();
const planLabel = (p, u) => (isAppOwner(u) ? 'Proprietário' : !p ? 'Conta própria' : p.founderTeam && !p.vip ? 'Fundador' : p.plan === 'comp' ? `Liberado até ${new Date(p.compUntil).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}` : p.vip ? `Vitalício Nº ${String(p.vip.no).padStart(3, '0')}` : p.comp ? 'Cortesia' : { gratis: 'Grátis (lançamento)', trial: 'Teste grátis', monthly: 'Mensal', lifetime: 'Vitalício', expired: 'Teste acabou', blocked: 'Sem plano', none: 'Sem plano' }[p.plan] || 'Conta própria');
/* versão do app da pessoa comparada com a última publicada */
let latestVer = null;
const cmpV = (a, b) => { const A = String(a || '0').split('.').map(Number), B = String(b || '0').split('.').map(Number); for (let i = 0; i < 3; i++) if ((A[i] || 0) !== (B[i] || 0)) return (A[i] || 0) > (B[i] || 0) ? 1 : -1; return 0; };
const verState = (u) => {
  if (!u.app) return { cls: 'warn', label: 'versão antiga', long: 'Antes da 2.0.0 (ainda não abriu o app atualizado)', ok: false };
  if (!latestVer) return { cls: '', label: `v${u.app.v}`, long: `v${u.app.v}`, ok: true };
  const same = u.app.b === latestVer.build || cmpV(u.app.v, latestVer.version) >= 0;
  return same ? { cls: 'ok', label: `v${u.app.v} ✓`, long: `v${u.app.v} (${u.app.b}) — a mais recente`, ok: true }
    : { cls: 'warn', label: `v${u.app.v} · desatualizada`, long: `v${u.app.v} (${u.app.b}) — a última é a v${latestVer.version}`, ok: false };
};
const pad = (n) => String(n || 0).padStart(3, '0');
const isVip = (uid) => !!planOf(uid)?.vip;
/* data e hora padrão do "liberar até": daqui a 7 dias, no fuso do celular */
const in7 = () => { const d = new Date(Date.now() + 7 * 864e5); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

/* Acesso da pessoa: dar / acabar com o vitalício e liberar até uma data e hora */
function accessHtml(u) {
  const p = planOf(u.uid) || {};
  const uid = esc(u.uid);
  if (isAppOwner(u)) return `<h4>Acesso</h4><div class="avip">${icon('crown', 18)}<div><b>Proprietário</b><small>Você criou o Lembra: acesso total a tudo, para sempre</small></div></div>`;
  const paid = (p.plan === 'lifetime' && !p.comp) || p.plan === 'monthly';
  if (paid) return `<h4>Acesso</h4><p class="fhelp">Conta paga (${esc(planLabel(p))}). O acesso é da pessoa: não dá para mexer por aqui.</p>`;
  const vip = p.vip ? `<div class="avip">${icon('crown', 18)}<div><b>Vitalício Nº ${pad(p.vip.no)}</b>
      <small>Desde ${esc(date(p.vip.at))} · ${p.vip.sent ? 'o aviso chegou no celular' : p.vip.sent === 0 ? 'aviso não chegou (avisos desligados)' : 'aviso enviado'} · ${u.vipSeen ? 'já viu a surpresa ✓' : 'ainda não viu a surpresa'}</small></div></div>` : '';
  return `<h4>Acesso</h4>${vip}
    ${p.plan === 'comp' ? `<p class="fhelp">✅ Liberado até <b>${esc(when(p.compUntil))}</b>. Depois disso a pessoa precisa assinar.</p>` : ''}
    <div class="grantbox">
      ${p.vip ? `<button class="btn btn--danger btn--block" data-grant="${uid}" data-on="0" data-end="vip">Acabar com o acesso vitalício</button>`
        : p.plan === 'lifetime' && p.comp ? `<button class="btn btn--primary btn--block" data-grant="${uid}" data-on="1" data-vip="1">👑 Entregar a surpresa do Vitalício</button>
          <p class="fhelp">Esta pessoa ganhou o acesso para sempre antes da surpresa existir.</p>
          <button class="btn btn--danger btn--block" data-grant="${uid}" data-on="0" data-end="vip">Acabar com o acesso para sempre</button>`
        : `<button class="btn btn--primary btn--block" data-grant="${uid}" data-on="1" data-vip="1">👑 Dar acesso vitalício</button>
          <p class="fhelp">A pessoa recebe um aviso no celular e, ao abrir o app, vê a surpresa: cartão de membro com número único, emblema lendário e anel na foto.</p>`}
      ${p.plan === 'lifetime' ? '' : `<div class="grantdate">
        <label class="flabel" for="until-${uid}">Liberar tudo, sem pagar, até:</label>
        <input id="until-${uid}" type="datetime-local" class="input" data-until="${uid}" value="${p.plan === 'comp' ? (() => { const d = new Date(p.compUntil); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); })() : in7()}">
        <button class="btn btn--soft btn--block" data-grant="${uid}" data-on="1" data-dated="1">${p.plan === 'comp' ? 'Mudar a data e hora' : 'Liberar até essa data e hora'}</button>
        ${p.plan === 'comp' ? `<button class="btn btn--danger btn--block" data-grant="${uid}" data-on="0" data-end="comp">Tirar o acesso agora</button>` : ''}
      </div>`}
    </div>`;
}

/* Aba Vitalícios: quem tem, número, se o aviso chegou, se já viu — e o controle de quantos foram dados */
function vipHtml(users) {
  const P = Object.entries(plans_);
  const vips = P.filter(([, p]) => p && p.vip).sort((a, b) => a[1].vip.no - b[1].vip.no);
  const olds = P.filter(([, p]) => p && p.plan === 'lifetime' && p.comp && !p.vip);
  const dated = P.filter(([, p]) => p && p.plan === 'comp').sort((a, b) => a[1].compUntil - b[1].compUntil);
  const who = (ws) => users.find((u) => u.uid === ws) || { uid: ws, name: 'Conta', email: ws };
  const lastNo = vips.reduce((m, [, p]) => Math.max(m, p.vip.no), 0);
  const row = ([ws, p]) => { const u = who(ws); return `<button class="avrow" data-goto="${esc(ws)}">${face(u, 40)}
      <span class="avrow__id"><b>${esc(u.name || 'Sem nome')} <i class="acrown">${icon('crown', 12)}</i></b><small>${esc(u.email || '')}</small>
      <small>Nº ${pad(p.vip.no)} · desde ${esc(date(p.vip.at))} · ${p.vip.sent ? 'aviso ok' : 'sem aviso'} · ${u.vipSeen ? 'viu a surpresa' : 'ainda não viu'}</small></span>${icon('right', 16)}</button>`; };
  return `<div class="ahero ahero--vip"><small>${icon('crown', 14)} Vitalícios ativos</small><b>${vips.length}</b>
      <span>${lastNo ? `Números entregues até agora: Nº 001 a Nº ${pad(lastNo)} (nunca se repetem)` : 'Ninguém ganhou ainda.'}</span></div>
    <p class="fhelp">Para dar: aba <b>Pessoas</b> → toque na pessoa → <b>👑 Dar acesso vitalício</b>. Para acabar com um vitalício, toque na pessoa abaixo. Pelos Termos de Uso, o acesso de cortesia pode ser encerrado a qualquer momento.</p>
    <h3 class="ah">Com acesso vitalício</h3>
    <div class="agroup">${vips.map(row).join('') || '<p class="fhelp" style="padding:12px 16px">Nenhum ainda.</p>'}</div>
    ${olds.length ? `<h3 class="ah">Para sempre, mas ainda sem a surpresa</h3><div class="agroup">${olds.map(([ws]) => { const u = who(ws); return `<button class="avrow" data-goto="${esc(ws)}">${face(u, 40)}<span class="avrow__id"><b>${esc(u.name || 'Sem nome')}</b><small>${esc(u.email || '')}</small><small>Toque para entregar a surpresa ou acabar com o acesso</small></span>${icon('right', 16)}</button>`; }).join('')}</div>` : ''}
    <h3 class="ah">Liberados até uma data</h3>
    <div class="agroup">${dated.map(([ws, p]) => { const u = who(ws); return `<button class="avrow" data-goto="${esc(ws)}">${face(u, 40)}<span class="avrow__id"><b>${esc(u.name || 'Sem nome')}</b><small>${esc(u.email || '')}</small><small>Até ${esc(when(p.compUntil))}</small></span>${icon('right', 16)}</button>`; }).join('') || '<p class="fhelp" style="padding:12px 16px">Nenhum.</p>'}</div>`;
}
let plans_ = {};
const brl = (c) => `R$ ${(Number(c || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
/* o que a pessoa assina hoje, em palavras */
function subLine(u) {
  const p = planOf(u.uid);
  if (isAppOwner(u)) return 'Proprietário · acesso total (criador do app)';
  if (!p) return 'Nenhuma';
  const base = p.plan === 'monthly' ? `${p.tier === 'essencial' ? 'Essencial' : 'Profissional'} ${p.prepaid ? '12 meses no Pix' : p.interval === 'year' ? 'anual' : 'mensal'}${p.cancelAt ? ' (cancelada, vale até ' + new Date(p.cancelAt).toLocaleDateString('pt-BR') + ')' : p.paidUntil ? ' · renova ' + new Date(p.paidUntil).toLocaleDateString('pt-BR') : ''}`
    : p.plan === 'lifetime' ? (p.vip ? `Vitalício de presente Nº ${pad(p.vip.no)}` : p.founderTeam ? 'Fundador · acesso para sempre' : p.comp ? 'Cortesia para sempre' : p.founder ? 'Fundadores (pago, para sempre)' : 'Vitalício (pago)')
    : p.plan === 'comp' ? `Liberado até ${new Date(p.compUntil).toLocaleDateString('pt-BR')}` : p.plan === 'trial' ? 'Teste grátis' : 'Nenhuma';
  const add = p.addon && p.addon.active ? ` + agenda compartilhada ${p.addon.plan === 'equipe' ? 'Equipe' : 'Dupla'}${p.addon.gift ? ' (de presente)' : ''}` : '';
  return base + add;
}

function card(u, open) {
  const c = u.counts || {};
  const d = u.device || {};
  const online = isOnline(u);
  const last = Math.max(u.lastPing || 0, u.lastSeen || 0);
  return `<div class="acct${open ? ' is-open' : ''}" data-uid="${esc(u.uid)}">
    <button class="acct__top" data-toggle="${esc(u.uid)}">
      ${face(u)}
      <div class="acct__id"><strong>${esc(u.name || 'Sem nome')}${isVip(u.uid) ? ` <i class="acrown" title="Vitalício">${icon('crown', 12)}</i>` : ''}${online ? ' <span class="adot" title="Usando agora"></span>' : ''}</strong><small>${esc(u.email || '')}</small></div>
      <div class="acct__last"><b class="${online ? 'is-live' : ''}">${online ? 'no app agora' : esc(`saiu ${ago(last)}`)}</b><small>${u.workspace === 'compartilhada' ? 'Convidado' : planLabel(planOf(u.uid), u)}${planOf(u.uid)?.spent > 0 ? ` · ${brl(planOf(u.uid).spent)}` : ''}${planOf(u.uid)?.addon?.active ? ` + ${planOf(u.uid).addon.plan === 'equipe' ? 'Equipe' : 'Dupla'}` : ''}</small></div>
    </button>
    ${isAppOwner(u) ? `<div class="acct__prof">${icon('crown', 13)} <b>Proprietário</b> · criador do Lembra, acesso total</div>` : u.profile?.done ? `<div class="acct__prof">${icon('idcard', 13)} <b>${esc(u.profile.profession || '—')}</b>${u.profile.age ? ` · ${esc(u.profile.age)} anos` : ''} · índice ${u.profile.index}/100</div>` : u.workspace !== 'dupla' ? `<div class="acct__prof is-off">${icon('idcard', 13)} Ficha não preenchida</div>` : ''}
    <div class="acct__chips">
      <span>${icon('building', 12)} ${c.companies || 0} grupos</span>
      <span>${icon('calendar', 12)} ${c.myEvents || 0} eventos</span>
      <span>${icon('heart', 12)} ${c.personal || 0} pessoais</span>
      <span class="${d.notifications === 'granted' && d.registered ? 'ok' : 'warn'}">${icon('bell', 12)} ${d.notifications === 'granted' && d.registered ? 'avisos ok' : 'sem avisos'}</span>
      <span class="${verState(u).cls}">${icon('refresh', 12)} ${esc(verState(u).label)}</span>
      ${u.game ? `<span>${icon('trophy', 12)} nível ${u.game.level}</span>` : ''}
    </div>
    ${open ? `<div class="acct__more">
      <div class="agrid">
        <div class="agrid__wide"><small>Assinatura ativa</small><b>${esc(subLine(u))}</b></div>
        <div><small>Já gastou no Lembra</small><b>${isAppOwner(u) ? '—' : brl(planOf(u.uid)?.spent || 0)}</b></div>
        <div><small>Pagamentos</small><b>${planOf(u.uid)?.payments || 0}${planOf(u.uid)?.lastPaidAt ? ` · último ${esc(date(planOf(u.uid).lastPaidAt))}` : ''}</b></div>
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
        <div><small>Versão do app</small><b class="${verState(u).ok ? 'good' : 'bad'}">${esc(verState(u).long)}</b></div>
        <div><small>Recebeu esta versão</small><b>${u.app?.since ? esc(when(u.app.since)) : '—'}</b></div>
        ${u.game ? `<div><small>Conquistas</small><b>Nível ${u.game.level} · ${u.game.xp.toLocaleString('pt-BR')} XP · ${u.game.badges} emblemas</b></div>` : ''}
      </div>
      ${!verState(u).ok ? `<div class="aupd"><p>${u.lastOpen && latestVer?.builtAt && u.lastOpen < Date.parse(latestVer.builtAt) ? 'Ainda não abriu o app desde a atualização: ela chega sozinha na próxima vez que abrir.' : 'Abriu o app mas continua na versão antiga (celular guardou a versão velha).'}</p>
        <button class="btn btn--soft btn--sm" data-nudge-upd="${esc(u.uid)}" data-email="${esc(u.email)}">${icon('bell', 14)} Pedir para atualizar</button></div>` : ''}
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
      ${u.workspace === 'proprio' ? accessHtml(u) : ''}
    </div>` : ''}
  </div>`;
}


/* Nome dos botões e telas (o app guarda só o nome técnico, contado) */
const USAGE = {
  'compromisso:criado': 'Compromisso criado', 'compromisso:concluido': 'Compromisso concluído', 'new-event': 'Botão + (novo compromisso)', 'toggle-done': 'Check de concluir',
  'open-event': 'Abriu um compromisso', 'aba:hoje': 'Aba Hoje', 'aba:calendario': 'Aba Calendário', 'aba:locais': 'Aba Locais/Clientes', 'aba:clientes': 'Aba Clientes', 'aba:ajustes': 'Aba Ajustes',
  space: 'Trocou Trabalho ↔ Pessoal', 'switch-space': 'Trocou Trabalho ↔ Pessoal', 'p-new': 'Pessoal: novo item', 'p-done': 'Pessoal: concluiu', 'p-open': 'Pessoal: abriu item', 'p-newlist': 'Pessoal: nova lista',
  assistant: 'Assistente (IA)', profile: 'Perfil e conquistas', ranking: 'Ranking', 'team-board': 'Placar da equipe', support: 'Suporte', plans: 'Abriu os planos', 'billing-portal': 'Gerenciar assinatura',
  share: 'Agenda compartilhada', 'notify-enable': 'Ativar avisos', 'ativar-avisos': 'Ativar avisos (revelação)', 'notify-test': 'Testar aviso', 'new-company': 'Novo cliente/grupo', 'open-company': 'Abriu cliente/grupo',
  month: 'Calendário: mês', week: 'Calendário: semana', 'open-day': 'Abriu um dia', 'go-today': 'Voltar para hoje', 'set-date': 'Escolheu um dia', 'set-person': 'Filtrou por pessoa',
  ficha: 'Ficha', 'edit-profile': 'Editar perfil', theme: 'Mudou o tema', 'install-guide': 'Como instalar', whatsnew: 'Novidades', 'check-update': 'Procurar atualização', guide: 'Como funciona',
  'vip-card': 'Cartão Vitalício', logout: 'Sair da conta', admin: 'Painel do dono', export: 'Exportar dados', ics: 'Exportar calendário', 'confirm-phone': 'Confirmar celular', 'p-sug': 'Pessoal: usou sugestão',
};
const usageLabel = (k) => USAGE[k] || (k.startsWith('pessoal:') ? `Pessoal: ${k.slice(8).replace(/^p-/, '')}` : k.startsWith('painel:') ? `Painel: ${k.slice(7)}` : k);

/* Aba Dados: tudo que as fichas e o uso mostram (anônimo e somado) — para decidir o que melhorar e para quem falar */
function dataHtml(users) {
  const fichas = users.map((u) => u.profile).filter((p) => p && p.done);
  const n = fichas.length;
  const count = (arr) => Object.entries(arr.reduce((a, k) => { if (k) a[k] = (a[k] || 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]);
  const bars = (rows, total, label = (k) => k, max = 8) => rows.length ? `<ul class="abars">${rows.slice(0, max).map(([k, v]) => `<li><span>${esc(label(k))}</span><i style="--w:${Math.round((v / Math.max(1, total)) * 100)}%"></i><b>${v}${total ? ` · ${Math.round((v / total) * 100)}%` : ''}</b></li>`).join('')}</ul>` : '<p class="fhelp">Ainda sem dados.</p>';
  const lab = (list) => (k) => list.find((x) => x.id === k)?.label || k;
  const AGES = ['até 17', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'];
  const ages = count(fichas.map((p) => p.age)).sort((a, b) => AGES.indexOf(a[0]) - AGES.indexOf(b[0]));
  // atraso: soma de todos (minutos depois do horário marcado, ao concluir)
  const timed = users.reduce((a, u) => a + (u.counts?.timed30 || 0), 0);
  const delay = users.reduce((a, u) => a + (u.counts?.delaySum30 || 0), 0);
  const onTime = users.reduce((a, u) => a + (u.counts?.onTime30 || 0), 0);
  const fmtMin = (m) => (m < 60 ? `${Math.round(m)} min` : `${Math.floor(m / 60)}h${String(Math.round(m % 60)).padStart(2, '0')}`);
  const groupDelay = (keyOf) => {
    const g = {};
    for (const u of users) { const k = keyOf(u); const c = u.counts || {}; if (!k || !c.timed30) continue; (g[k] = g[k] || { t: 0, d: 0, o: 0 }); g[k].t += c.timed30; g[k].d += c.delaySum30; g[k].o += c.onTime30; }
    return Object.entries(g).sort((a, b) => b[1].t - a[1].t);
  };
  const delayRows = (rows, label = (k) => k) => rows.length ? `<div class="agroup">${rows.slice(0, 6).map(([k, v]) => `<div class="arow"><span>${esc(label(k))}<small>${v.t} concluídos · ${Math.round((v.o / v.t) * 100)}% no horário</small></span><b>${fmtMin(v.d / v.t)}</b></div>`).join('')}</div>` : '<p class="fhelp">Ainda sem compromissos concluídos com horário.</p>';
  // botões e telas
  const use = {};
  for (const u of users) for (const [k, v] of Object.entries(u.usage || {})) { (use[k] = use[k] || { t: 0, p: 0 }); use[k].t += v; use[k].p++; }
  const useRows = Object.entries(use).sort((a, b) => b[1].t - a[1].t);
  const useMax = useRows[0]?.[1].t || 1;
  const notif = users.filter((u) => u.device?.notifications === 'granted' && u.device?.registered).length;
  const avg = (f) => (users.length ? users.reduce((a, u) => a + f(u), 0) / users.length : 0);
  const pct = (x) => (users.length ? `${Math.round((x / users.length) * 100)}%` : '—');
  return `<p class="fhelp">Tudo aqui é somado e anônimo: serve para saber quem usa o Lembra, onde as pessoas travam e o que melhorar. Os números ficam mais certeiros conforme mais gente usa.</p>
    <div class="atiles">
      <div><b>${n}</b><small>fichas</small></div>
      <div><b>${timed ? fmtMin(delay / timed) : '—'}</b><small>atraso médio</small></div>
      <div><b>${timed ? `${Math.round((onTime / timed) * 100)}%` : '—'}</b><small>no horário</small></div>
    </div>
    <h3 class="ah">Quem se cadastra</h3>
    <div class="ainsights"><h4>Gênero</h4>${bars(count(fichas.map((p) => p.gender)), n, lab(GENDERS))}
      <h4>Idade</h4>${bars(ages, n, (k) => `${k} anos`, 7)}
      <h4>Profissões</h4>${bars(count(fichas.map((p) => p.profession)), n, (k) => k, 10)}
      <h4>Áreas</h4>${bars(count(fichas.map((p) => p.area)), n)}</div>
    <h3 class="ah">O que mais pesa na vida delas</h3>
    <div class="ainsights"><div class="ainsights__head"><small>índice médio de esquecimento ${n ? Math.round(fichas.reduce((a, p) => a + (p.index || 0), 0) / n) : 0}/100</small></div>
      <h4>Maiores dificuldades</h4>${bars(count(fichas.flatMap((p) => p.difficulties || [])), n, lab(DIFFICULTIES), 12)}
      <h4>Objetivo com o Lembra</h4>${bars(count(fichas.map((p) => p.goal)), n, lab(GOALS))}
      <h4>Como se lembravam antes</h4>${bars(count(fichas.map((p) => p.method)), n, lab(METHODS))}
      <h4>Compromissos por dia</h4>${bars(count(fichas.map((p) => p.volume)), n, lab(VOLUMES))}
      <h4>Jornada de trabalho</h4>${bars(count(fichas.map((p) => p.journey)), n, lab(JOURNEYS))}
      <h4>Jeito de cobrar que preferem</h4>${bars(count(fichas.map((p) => p.tone)), n, lab(TONES))}</div>
    <h3 class="ah">Atraso ao concluir (últimos 30 dias)</h3>
    <p class="fhelp">Quanto tempo depois do horário marcado a pessoa marca como feito. "No horário" = até 30 min.</p>
    <h4 class="ah2">Por profissão</h4>${delayRows(groupDelay((u) => u.profile?.profession))}
    <h4 class="ah2">Por gênero</h4>${delayRows(groupDelay((u) => u.profile?.gender), lab(GENDERS))}
    <h4 class="ah2">Por idade</h4>${delayRows(groupDelay((u) => u.profile?.age), (k) => `${k} anos`)}
    <h3 class="ah">Como usam o app</h3>
    <div class="agroup">
      <div class="arow"><span>Compromissos por pessoa<small>média de cadastrados</small></span><b>${avg((u) => u.counts?.myEvents || 0).toFixed(1)}</b></div>
      <div class="arow"><span>Dias ativos nos últimos 30<small>média por pessoa</small></span><b>${avg((u) => (u.activeDays || []).filter((x) => x >= addDays(todayKey(), -29)).length).toFixed(1)}</b></div>
      <div class="arow"><span>Recebem avisos<small>sem isso, o Lembra não alcança a pessoa</small></span><b>${pct(notif)}</b></div>
      <div class="arow"><span>Instalaram na tela inicial</span><b>${pct(users.filter((u) => u.device?.installed).length)}</b></div>
      <div class="arow"><span>Nível médio nas conquistas</span><b>${avg((u) => u.game?.level || 0).toFixed(1)}</b></div>
    </div>
    <h3 class="ah">Botões e telas mais usados (30 dias)</h3>
    ${useRows.length ? `<ul class="abars abars--use">${useRows.slice(0, 25).map(([k, v]) => `<li><span>${esc(usageLabel(k))}<small>${v.p} pessoa${v.p === 1 ? '' : 's'}</small></span><i style="--w:${Math.round((v.t / useMax) * 100)}%"></i><b>${v.t}</b></li>`).join('')}</ul>
      <p class="fhelp">Botão que quase ninguém toca = difícil de achar ou não interessa. Começa a contar a partir desta versão.</p>` : '<p class="fhelp">Começa a contar a partir desta versão: em alguns dias aparece aqui o que as pessoas mais tocam.</p>'}
    ${originHtml(users)}`;
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
        ${e.steps ? `<small class="aerr__steps">O que a pessoa fazia: ${esc(e.steps)}</small>` : ''}
        ${/^Script error\.?$/i.test(e.msg) ? '<small class="aerr__why">Erro vindo de fora do app (o Safari esconde o detalhe): tradução automática, extensão ou outro site dentro do app. Não trava o Lembra. A partir da versão 2.0.2 aparece aqui o que a pessoa estava fazendo.</small>' : ''}
        ${/payment_intent_data/.test(e.msg) ? '<small class="aerr__why">Corrigido na versão 2.0.2 (assinatura no cartão). Pode limpar a lista.</small>' : ''}
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
    counts: Object.fromEntries(['companies', 'events', 'myEvents', 'thisWeek', 'done30', 'late', 'posts30', 'notes', 'personal', 'lists', 'birthdays', 'timed30', 'delaySum30', 'onTime30'].map((k) => [k, N(c[k])])),
    usage: u.usage && typeof u.usage === 'object' ? Object.fromEntries(Object.entries(u.usage).filter(([k]) => /^[a-z0-9:_-]{1,40}$/.test(k)).slice(0, 80).map(([k, v]) => [k, Math.max(0, Math.min(1e5, N(v)))])) : {},
    vipSeen: u.vipSeen === true,
    device: { platform: S(d.platform, 20), installed: !!d.installed, notifications: S(d.notifications, 20), registered: !!d.registered },
    app: u.app && typeof u.app === 'object' && /^\d+\.\d+\.\d+$/.test(u.app.v || '') ? { v: S(u.app.v, 20), b: S(u.app.b, 12).replace(/[^a-z0-9]/gi, ''), since: N(u.app.since) } : null,
    game: u.game && typeof u.game === 'object' ? { level: Math.max(0, Math.min(100, Math.round(N(u.game.level)))), xp: N(u.game.xp), badges: N(u.game.badges) } : null,
    origin: u.origin && typeof u.origin === 'object' ? { source: S(u.origin.source, 60), medium: S(u.origin.medium, 60), campaign: S(u.origin.campaign, 60) } : null,
    profile: p.done ? { done: true, profession: S(p.profession, 80), area: S(p.area, 80), age: S(p.age, 10), index: N(p.index), forget: N(p.forget),
      difficulties: Array.isArray(p.difficulties) ? p.difficulties.filter((x) => typeof x === 'string').slice(0, 12).map((x) => x.slice(0, 30)) : [],
      goal: S(p.goal, 30), journey: S(p.journey, 30), gender: S(p.gender, 20), tone: S(p.tone, 20), volume: S(p.volume, 10), method: S(p.method, 20) } : { done: false },
  };
}

export async function openAdmin() {
  let stop = null, tick = null, plansAt = Date.now(), raw = null, lastSig = '';
  let users = null, err = null, openUid = null, q = '', plans = {}, errors = null, tab = 'resumo';
  const html = () => {
    const head = sheetHead('Painel do dono', { right: '<span class="alive"><i></i>Ao vivo</span>' });
    if (err) return `${head}<div class="page page--sheet"><div class="empty"><h3>Não consegui carregar</h3><p>${esc(err)}</p></div></div>`;
    if (!users) return `${head}<div class="page page--sheet"><p class="fhelp">Carregando…</p></div>`;
    const now = Date.now();
    const act = (days) => users.filter((u) => u.lastSeen && now - u.lastSeen < days * 864e5).length;
    const newWeek = users.filter((u) => u.createdAt && now - u.createdAt < 7 * 864e5).length;
    planOf = (uid) => plans[uid] || null;
    plans_ = plans;
    const P = Object.values(plans);
    const monthly = P.filter((p) => p.plan === 'monthly').length;
    const lifetime = P.filter((p) => p.plan === 'lifetime' && !p.comp && !p.founderTeam).length;
    const founders = P.filter((p) => p.plan === 'lifetime' && p.founder && !p.comp && !p.founderTeam).length;
    // preço por mês de cada assinatura (anual dividido por 12)
    const perMonth = (p) => (p.tier === 'essencial' ? (p.interval === 'year' ? 119.9 / 12 : 12.9) : (p.interval === 'year' ? 179.9 / 12 : 19.9));
    const trial = P.filter((p) => p.plan === 'trial').length;
    const addons = P.filter((p) => p.addon && p.addon.active && !p.addon.gift); // presente (vitalício/fundador) não é receita
    const received = P.reduce((a, p) => a + (p.spent || 0), 0);
    // receita por mês: mensais + complementos (vitalício paga o complemento mais barato); o vitalício em si entra uma vez só
    const mrr = P.filter((p) => p.plan === 'monthly').reduce((a, p) => a + perMonth(p), 0) + addons.reduce((a, p) => a + (p.addon.plan === 'equipe' ? (p.plan === 'lifetime' ? 19.9 : 29.9) : (p.plan === 'lifetime' ? 4.9 : 7.9)), 0);
    const tried = P.filter((p) => p.plan !== 'none' && p.plan !== 'team').length;
    const conv = tried ? Math.round(((monthly + lifetime) / tried) * 100) : 0;
    const money = (v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const row = (label, value, sub = '') => `<div class="arow"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><b>${value}</b></div>`;
    const installed = users.filter((u) => u.device?.installed).length;
    const notif = users.filter((u) => u.device?.notifications === 'granted' && u.device?.registered).length;
    const pct = (n) => (users.length ? ` · ${Math.round((n / users.length) * 100)}%` : '');
    const vipN = P.filter((p) => p && p.vip).length;
    // 6 abas numa grade 3×2 (todas do mesmo tamanho, nada quebrando a linha)
    const tabs = `<div class="aseg aseg--6" role="tablist">${[['resumo', 'Resumo', 'chart'], ['pessoas', 'Pessoas', 'users', users.length], ['vip', 'Vitalícios', 'crown', vipN], ['dados', 'Dados', 'pulse'], ['ranking', 'Ranking', 'trophy'], ['erros', 'Erros', 'alert', errors && errors.length ? errors.length : 0]]
      .map(([k, l, ic, n]) => `<button role="tab" class="${tab === k ? 'is-on' : ''}${k === 'erros' && n ? ' is-bad' : ''}" data-tab-admin="${k}">${icon(ic, 15)}<span>${l}</span>${n ? `<em>${n}</em>` : ''}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'resumo') {
      body = `
      <div class="ahero">
        <small>Receita por mês</small>
        <b>${money(mrr)}</b>
        <span>Total já recebido: <b>${brl(received)}</b></span>
        <span>${monthly} ${monthly === 1 ? 'assinante' : 'assinantes'} · ${addons.length} agenda${addons.length === 1 ? '' : 's'} compartilhada${addons.length === 1 ? '' : 's'}</span>
      </div>
      <div class="atiles">
        <div><b>${act(1)}</b><small>ativas hoje</small></div>
        <div><b>${monthly + lifetime}</b><small>pagantes</small></div>
        <div><b>${trial}</b><small>em teste</small></div>
      </div>
      <h3 class="ah">Dinheiro</h3>
      <div class="agroup">
        ${row('Total já recebido', brl(received), 'soma de tudo que as pessoas pagaram (menos reembolsos)')}
        ${row('Fundadores / vitalícios vendidos', `${lifetime}`, `${money(founders * 199 + (lifetime - founders) * 150)} no total`)}
        ${row('Assinantes (mensal e anual)', `${monthly}`, `${P.filter((p) => p.plan === 'monthly' && p.tier === 'essencial').length} Essencial · ${P.filter((p) => p.plan === 'monthly' && p.tier !== 'essencial').length} Profissional · ${P.filter((p) => p.plan === 'monthly' && p.interval === 'year').length} anuais`)}
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
        ${row(`Na versão atual${latestVer ? ` (v${esc(latestVer.version)})` : ''}`, `${users.filter((u) => verState(u).ok && u.app).length} de ${users.length}`, (() => { const late = users.filter((u) => !verState(u).ok); return late.length ? `desatualizados: ${late.slice(0, 4).map((u) => esc((u.name || u.email || '').split(' ')[0])).join(', ')}${late.length > 4 ? ` e mais ${late.length - 4}` : ''} — atualiza sozinho ao abrir` : 'todo mundo atualizado ✓'; })())}
        ${row('Instalaram na tela inicial', `${installed}${pct(installed)}`)}
        ${row('Recebem notificações', `${notif}${pct(notif)}`, notif < users.length ? 'sem isso, os lembretes não chegam' : '')}
        ${row('Compromissos criados', `${users.reduce((a, u) => a + (u.counts?.myEvents || 0), 0)}`)}
        <button class="arow arow--btn" data-rank-admin><span>🏆 Ranking (pontos e suspeitas)</span><b>abrir ›</b></button>
        <button class="arow arow--btn" data-support-inbox><span>💬 Mensagens de suporte</span><b>abrir ›</b></button>
        <button class="arow arow--btn" data-tab-admin="erros"><span>Erros do app</span><b class="${errors && errors.length ? 'bad' : 'good'}">${errors === null ? '—' : errors.length ? `${errors.length} ›` : 'nenhum ✓'}</b></button>
      </div>
      <button class="arow arow--btn" data-tab-admin="dados"><span>📊 Dados: quem usa, dificuldades, atraso médio, botões mais usados</span><b>abrir ›</b></button>
      <button class="arow arow--btn" data-tab-admin="vip"><span>👑 Vitalícios</span><b>${vipN} ›</b></button>`;
    } else if (tab === 'vip') {
      body = vipHtml(users);
    } else if (tab === 'dados') {
      body = dataHtml(users);
    } else if (tab === 'pessoas') {
      const list = users.filter((u) => !q || `${u.name} ${u.email} ${u.profile?.profession || ''}`.toLowerCase().includes(q)).sort((a, b) => (isOnline(b) - isOnline(a)) || (Math.max(b.lastPing || 0, b.lastSeen || 0) - Math.max(a.lastPing || 0, a.lastSeen || 0)));
      body = `<input class="input" type="search" placeholder="Buscar por nome, e-mail ou profissão" data-q value="${esc(q)}">
      <div class="accts">${list.map((u) => card(u, u.uid === openUid)).join('') || '<p class="fhelp">Nenhuma conta encontrada.</p>'}</div>
      <p class="fhelp">Toque numa conta para ver os detalhes. Aparecem aqui as contas que já abriram o app atualizado.</p>`;
    } else if (tab === 'ranking') {
      const r = rankData;
      const day = (k) => (k || '').split('-').reverse().join('/');
      body = !r ? '<p class="fhelp">Carregando o ranking…</p>' : r.error ? `<p class="fhelp">Não consegui ler o ranking: ${esc(r.error)}</p>` : `
      <h3 class="ah">Semana de ${esc(day(r.week))}</h3>
      <div class="agroup">${(r.rows || []).length ? r.rows.map((x, i) => {
        const u = users.find((y) => y.uid === x.ws);
        return `<div class="arow"><span><b>${x.flag ? '—' : i + 1 + 'º'}</b> ${esc(u?.name || x.i)} <small>${esc(u?.email || x.ws)}</small>${x.flag ? `<br><small class="bad">⚠️ fora do ranking: ${esc(x.flag.why)}</small>` : ''}</span><b>${x.pts} pts</b></div>`;
      }).join('') : '<p class="fhelp" style="padding:12px 16px">Ninguém pontuou esta semana ainda. Só contas no plano mensal participam.</p>'}</div>
      <h3 class="ah">Campeões do mês (mês grátis)</h3>
      <div class="agroup">${(r.winners || []).length ? r.winners.map((w) => { const u = users.find((y) => y.uid === w.ws); return `<div class="arow"><span>${esc(w.month.split('-').reverse().join('/'))} · ${esc(u?.name || w.i)} <small>${w.pts} pts</small></span><b class="${w.applied ? 'good' : 'bad'}">${w.applied ? 'cupom aplicado ✓' : 'cupom não aplicado'}</b></div>`; }).join('') : '<p class="fhelp" style="padding:12px 16px">Ainda nenhum campeão. O prêmio é calculado no dia 1º de cada mês.</p>'}</div>
      <p class="fhelp">Aqui você vê nome e e-mail. Os participantes só veem a inicial uns dos outros.</p>`;
      if (!rankData) loadRank();
    } else body = errorsHtml(errors) || '<p class="fhelp">Não consegui ler os erros agora.</p>';
    return `${head}<div class="page page--sheet apanel">${tabs}${body}</div>`;
  };
  let rankData = null;
  const loadRank = async () => {
    const { api: call } = await import('../avisos.js');
    rankData = await call('/rank/admin', {}).catch((e) => ({ error: e.message }));
    if (tab === 'ranking') api.set(html());
  };
  const api = openSheet({
    onClose: () => { try { stop && stop(); } catch { /* ok */ } clearInterval(tick); },
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      a.el.querySelectorAll('[data-toggle]').forEach((b) => (b.onclick = () => { openUid = openUid === b.dataset.toggle ? null : b.dataset.toggle; a.set(html()); }));
      const rk = a.el.querySelector('[data-rank-admin]');
      if (rk) rk.onclick = async () => {
        const { api } = await import('../avisos.js');
        const r = await api('/rank/admin', {}).catch((e) => ({ error: e.message }));
        openSheet({ className: 'sheet--tall', html: `${sheetHead('Ranking · semana de ' + esc((r.week || '').split('-').reverse().join('/')), { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet">
          ${r.error ? `<p class="fhelp">${esc(r.error)}</p>` : (r.rows || []).map((x, i) => `<div class="arow"><span>${i + 1}. ${esc(x.i)} · <small>${esc(x.ws)}</small>${x.flag ? `<br><small class="bad">⚠️ fora do ranking: ${esc(x.flag.why)}</small>` : ''}</span><b>${x.pts} pts</b></div>`).join('') || '<p class="fhelp">Ninguém pontuou esta semana.</p>'}
          <h4>Campeões (mês grátis)</h4>${(r.winners || []).map((w) => `<div class="arow"><span>${esc(w.month)} · ${esc(w.i)} <small>${esc(w.ws)}</small></span><b>${w.applied ? 'cupom aplicado ✓' : 'não aplicado'}</b></div>`).join('') || '<p class="fhelp">Ainda nenhum.</p>'}</div>` });
      };
      const sup = a.el.querySelector('[data-support-inbox]');
      if (sup) sup.onclick = async () => (await import('./support.js')).openSupportInbox();
      a.el.querySelectorAll('[data-tab-admin]').forEach((b) => (b.onclick = () => { tab = b.dataset.tabAdmin; a.set(html()); a.el.scrollTop = 0; }));
      a.el.querySelectorAll('[data-goto]').forEach((b) => (b.onclick = () => {
        tab = 'pessoas'; q = ''; openUid = b.dataset.goto; a.set(html());
        requestAnimationFrame(() => a.el.querySelector(`.acct[data-uid="${b.dataset.goto}"]`)?.scrollIntoView({ block: 'start' }));
      }));
      a.el.querySelectorAll('[data-grant]').forEach((b) => (b.onclick = async () => {
        const who = users.find((u) => u.uid === b.dataset.grant);
        const nm = (who?.name || who?.email || 'esta pessoa').split(' ')[0];
        const given = Object.values(plans).filter((p) => p && p.vip).length;
        if (b.dataset.vip && !(await confirmDialog({ title: `Dar acesso vitalício para ${nm}?`, text: `${given ? `Você já deu ${given} acesso${given === 1 ? '' : 's'} vitalício${given === 1 ? '' : 's'}. ` : ''}${nm} fica com tudo do Profissional sem pagar, recebe a surpresa e um número de membro que nunca se repete. Você pode acabar com o acesso quando quiser (está nos Termos de Uso).`, ok: 'Dar acesso vitalício' }))) return;
        if (b.dataset.end && !(await confirmDialog({ title: b.dataset.end === 'vip' ? `Acabar com o vitalício de ${nm}?` : `Tirar o acesso de ${nm} agora?`, text: b.dataset.end === 'vip' ? `O acesso gratuito termina agora: para continuar usando, ${nm} vai precisar escolher um plano. O número de membro não volta a ser usado.` : `Para continuar usando, ${nm} vai precisar escolher um plano.`, ok: b.dataset.end === 'vip' ? 'Acabar com o vitalício' : 'Tirar o acesso', danger: true }))) return;
        b.disabled = true;
        try {
          const { api } = await import('../avisos.js');
          const inp = b.dataset.dated ? a.el.querySelector(`[data-until="${b.dataset.grant}"]`) : null;
          const until = inp ? new Date(inp.value).getTime() : 0;
          if (inp && !(until > Date.now())) { toast('Escolha uma data e hora no futuro'); return; }
          const r = await api('/admin/grant', { uid: b.dataset.grant, on: b.dataset.on === '1', until });
          plans[b.dataset.grant] = r.status;
          toast(b.dataset.on !== '1' ? (b.dataset.end === 'vip' ? 'Acesso vitalício encerrado' : 'Acesso retirado') : until ? `Liberado até ${when(until)} ✓` : r.gifted ? (r.sent ? `👑 Vitalício Nº ${String(r.status.vip.no).padStart(3, '0')} entregue. O aviso já chegou no celular da pessoa.` : `👑 Vitalício Nº ${String(r.status.vip.no).padStart(3, '0')} entregue. A pessoa está sem avisos ligados: ela vê a surpresa quando abrir o app.`) : 'Acesso liberado ✓', { ms: r.gifted ? 6000 : 2600 });
          a.set(html());
        } catch (e) { b.disabled = false; toast(e.message || 'Não consegui agora.'); }
      }));
      a.el.querySelectorAll('[data-nudge-upd]').forEach((b) => (b.onclick = async () => {
        b.disabled = true;
        try {
          const { api } = await import('../avisos.js');
          const r = await api('/admin/nudge-update', { uid: b.dataset.nudgeUpd, email: b.dataset.email, version: latestVer?.version || '' });
          toast(r.sent ? 'Aviso enviado ✓ Quando a pessoa tocar, o app abre já atualizado.' : 'A pessoa não ativou as notificações: peça pelo WhatsApp para abrir o app.', { ms: 5000 });
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
      try { const { api: call } = await import('../avisos.js'); pres = (await call('/admin/presence', {})).byUid || {}; } catch { pres = {}; }
      users = withPresence((await store.backendApi.listStats()).map(cleanStat)); err = null;
      try { latestVer = await (await import('../version.js')).fetchLatest(); } catch { latestVer = null; }
      try { const { api } = await import('../avisos.js'); plans = (await api('/billing/all', {})).byWs || {}; } catch { plans = {}; }
      try { const { api } = await import('../avisos.js'); errors = (await api('/admin/errors', {})).errors || []; } catch { errors = null; }
    }
    catch (e) { err = /permission/i.test(String(e.code || e.message)) ? 'Falta atualizar as regras do Firebase (bloco “stats”).' : 'Verifique a internet e toque em Atualizar.'; }
    api.set(html());
    live();
  };
  /* ao vivo: o que muda no celular das pessoas aparece aqui na hora, sem tocar em Atualizar */
  const redraw = () => {
    if (api.closed || !users) return;
    const s = api.el.querySelector('[data-q]'), focused = s && document.activeElement === s, pos = focused ? s.selectionStart : 0;
    const scroller = api.el.querySelector('.page--sheet'), top = scroller ? scroller.scrollTop : 0;
    api.set(html());
    const sc2 = api.el.querySelector('.page--sheet'); if (sc2) sc2.scrollTop = top;
    if (focused) { const n = api.el.querySelector('[data-q]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
  };
  const live = () => {
    if (stop || !store.backendApi.watchStats) return;
    stop = store.backendApi.watchStats(async (list) => {
      raw = list.map(cleanStat);
      users = withPresence(raw);
      // planos e pagamentos: atualiza junto, no máximo a cada 20 s
      if (Date.now() - plansAt > 60e3) { plansAt = Date.now(); try { const { api: call } = await import('../avisos.js'); plans = (await call('/billing/all', {})).byWs || plans; } catch { /* mantém */ } }
      redraw();
    }, (e) => console.warn('painel ao vivo', e));
    // a cada 5 s: quem abriu ou fechou o app (do servidor de avisos) e "saiu há 1 min" sem precisar de novidade
    let n = 0;
    tick = setInterval(async () => {
      if (document.hidden) return;
      try { const { api: call } = await import('../avisos.js'); pres = (await call('/admin/presence', {})).byUid || pres; } catch { /* mantém */ }
      if (raw) users = withPresence(raw);
      if (++n % 6 === 0 || JSON.stringify(users.map((u) => [u.online, u.lastPing])) !== lastSig) { lastSig = JSON.stringify(users.map((u) => [u.online, u.lastPing])); redraw(); }
    }, 5e3);
  };
  load();
  return api;
}

export const isOwner = () => !!store.user && !!CONFIG.adminEmail && (store.user.email || '').toLowerCase() === CONFIG.adminEmail.toLowerCase();
