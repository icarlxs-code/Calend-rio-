/* Ajustes: perfil, lembretes, sincronização, backup */
import { iaStatus } from '../ia-consent.js';
import { coachTest } from '../coach.js';
import { fmtLeft } from '../billing.js';
import { usagePlaceholder, fillUsage } from '../usage.js';
import { store } from '../store.js';
import { CONFIG } from '../../config.js';
import { TYPES, BEST_TIMES_TABLE, isMarketing, WORK, crew } from '../constants.js';
import { esc, todayKey, addDays, isStandalone } from '../utils.js';
import { icon } from '../icons.js';
import { avatar, toast, confirmDialog, chooseDialog } from '../components.js';
import { downloadICS } from '../ics.js';
import { routine } from '../planner.js';
import { THEMES, themePref } from '../theme.js';
import { soundOn } from '../sound.js';
import * as push from '../avisos.js';
import { resetOnboarding } from './onboarding.js';
import { WD_SHORT } from '../utils.js';
import { brand } from '../brand.js';
import { phoneAuthOn } from '../phone.js';
import { professionFor } from '../../functions/catalog.js';
const ownerApp = () => !!store.user && String(store.user.email || '').toLowerCase() === String(CONFIG.adminEmail || '').toLowerCase();
import { APP_VERSION, APP_BUILD } from '../version.js';

export function renderSettings() {
  const me = store.member(store.me);
  const cloud = store.mode === 'cloud';
  const notifOk = 'Notification' in window && Notification.permission === 'granted';
  if (cloud) setTimeout(() => { fillDevices(); fillUsage(); }, 0);
  return `
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${esc(CONFIG.appName)}${store.solo ? '' : ' · ' + esc(CONFIG.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    ${store.solo ? planSection() : ''}
    <section class="block">
      <div class="glist">
        ${grow({ cls: 'pbig--toPersonal', attrs: 'data-action="space" data-space="personal"', ic: 'heart', c: '#FF2D55', t: 'Modo Pessoal', s: 'Aniversários, compromissos e listas — só você vê' })}
        ${cloud ? fichaRow() : ''}
        ${cloud && store.solo ? grow({ cls: 'pbig--share', attrs: 'data-action="share"', ic: 'users', c: '#34C759', t: 'Agenda compartilhada', s: store.shared ? `Você está na agenda de ${esc(store.shared.ownerName)}` : store.billing?.addon?.active ? `Plano ${store.billing.addon.plan === 'equipe' ? 'Equipe' : 'Dupla'} ativo · convide e gerencie` : 'Divida a agenda com sócio ou equipe · à parte' }) : ''}
        ${store.team.length > 1 ? grow({ attrs: 'data-action="team-board"', ic: 'trophy', c: '#FF9F0A', t: 'Placar da equipe', s: 'Quem cumpriu o que marcou nesta semana' }) : ''}
        ${grow({ attrs: 'data-action="profile"', ic: 'crown', c: '#AF52DE', t: 'Perfil e conquistas', s: 'Seu nível, XP e emblemas' })}
        ${cloud && phoneAuthOn() ? grow({ attrs: store.profile?.phoneVerified ? '' : 'data-action="confirm-phone"', ic: 'shield', c: store.profile?.phoneVerified ? '#34C759' : '#0A84FF', t: store.profile?.phoneVerified ? 'Celular confirmado ✓' : 'Confirmar meu celular', s: store.profile?.phoneVerified ? esc(store.profile.phone || '') + ' · dá para recuperar a senha por SMS' : 'Protege a conta e permite recuperar a senha por SMS' }) : ''}
        ${grow({ attrs: 'data-action="guide"', ic: 'sparkles', c: '#5856D6', t: 'Como funciona o Lembra', s: 'Trabalho e Pessoal em 1 minuto' })}
        ${grow({ attrs: 'data-action="snh-toggle"', ic: 'bell', c: '#FF6B1A', t: 'Lembra na tela', s: (() => { try { return localStorage.getItem('lembra.companheiroOff') === '1'; } catch { return false; } })() ? 'Escondido · toque para ele voltar' : 'Aparecendo · arraste ele pra onde quiser' })}
        ${cloud ? grow({ attrs: 'data-action="ia-toggle"', ic: 'sparkle', c: '#FF6B1A', t: 'Inteligência artificial', s: iaStatus() === true ? 'Ativada · toque para desativar' : iaStatus() === false ? 'Desativada · nada é enviado para a IA' : 'Ainda não decidiu · toque para ver como funciona' }) : ''}
        ${cloud ? grow({ cls: 'pbig--privacy', attrs: 'data-action="privacy"', ic: 'lock', c: '#8E8E93', t: 'Privacidade e dados', s: 'Termos, baixar ou apagar meus dados' }) : ''}
        ${cloud && store.solo ? grow({ attrs: 'data-action="ranking"', ic: 'trophy', c: '#FF9F0A', t: 'Ranking da semana', s: store.billing?.plan === 'monthly' && store.billing?.tier !== 'essencial' ? 'Ligas semanais · o nº 1 do mês ganha o mês seguinte grátis' : 'Plano Profissional · ligas e meses grátis' }) : ''}
        ${cloud ? ((store.user?.email || '').toLowerCase() === (CONFIG.adminEmail || '').toLowerCase()
          ? grow({ attrs: 'data-action="support" data-allow-locked', ic: 'headset', c: '#0A84FF', t: 'Mensagens de suporte', s: 'O que os clientes escreveram · toque para responder' })
          : grow({ attrs: 'data-action="support" data-allow-locked', ic: 'headset', c: '#0A84FF', t: 'Falar com o suporte', s: 'Chat com a equipe do Lembra · respondemos em até 24h' })) : CONFIG.supportWhatsapp || CONFIG.supportEmail ? grow({ attrs: 'data-action="support"', ic: CONFIG.supportWhatsapp ? 'phone' : 'mail', c: CONFIG.supportWhatsapp ? '#25D366' : '#0A84FF', t: 'Ajuda e atendimento', s: CONFIG.supportWhatsapp ? 'Fale com a gente no WhatsApp' : 'Fale com a gente por e-mail' }) : ''}
      </div>
    </section>
    ${cloud && (store.user?.email || '').toLowerCase() === (CONFIG.adminEmail || '').toLowerCase() ? `<section class="block"><div class="glist">${grow({ attrs: 'data-action="admin"', ic: 'chart', c: '#0A84FF', t: 'Painel do dono', s: 'Receita, pessoas e saúde do app' })}</div></section>` : ''}
    <section class="block">
      <h2 class="block__title">${icon('user', 16)} ${cloud ? 'Sua conta' : 'Quem está usando este celular?'}</h2>
      ${cloud
        ? `<div class="card whocard">
            <div class="whocard__top">${me ? avatar(me.id, 48) : icon('user', 24)}<div class="whocard__txt"><strong>${esc(me?.name || store.user?.email || '')}${ownerApp() ? `<span class="vbadge">${icon('crown', 12)} Proprietário</span>` : store.billing?.plan === 'lifetime' ? `<span class="vbadge">${icon('crown', 12)} ${store.billing?.founderTeam || (store.billing?.comp && !store.billing?.vip && CONFIG.team.some((t) => (t.email || '').toLowerCase() === (store.user?.email || '').toLowerCase())) ? 'Fundador' : 'Vitalício'}</span>` : ''}</strong><small>${esc(store.user?.email || '')}</small></div></div>
            <div class="whocard__btns">${store.solo ? `<button class="btn btn--soft btn--sm" data-action="edit-profile">${icon('edit', 16)} Editar perfil</button>` : ''}
            <button class="btn btn--danger-soft btn--sm" data-action="logout">${icon('logout', 16)} Sair da conta</button></div></div>`
        : `<div class="whogrid">${store.team.map((m) => `<button class="whobtn${store.me === m.id ? ' is-on' : ''}" style="--mc:${m.color}" data-action="set-me" data-p="${m.id}">${avatar(m.id, 34)}<span>${esc(m.name)}</span><i class="whobtn__check">${icon('check', 14)}</i></button>`).join('')}</div>
           <p class="fhelp">Usado para saudação, “Criado por” e nos lembretes.</p>`}
    </section>

    ${themeCard()}

    ${routineSection()}

    <section class="block">
      <h2 class="block__title">${icon('sparkle', 16)} Assistente e Claude</h2>
      <div class="card card--row">
        ${icon('sparkle', 22)}
        <div><strong>Assistente automático ativo</strong><small>Confere conflitos, tempo livre e melhores horários sozinho, sem internet e sem chave.</small></div>
        <button class="btn btn--soft btn--sm" data-action="assistant">Abrir</button>
      </div>
      <p class="fhelp">Para perguntas abertas (ideias, reorganizar a semana), use “Perguntar ao Claude” no Assistente. Abre o Claude com o seu login normal, sem chave de API.</p>
    </section>

    ${notifySection()}

    <section class="block">
      <h2 class="block__title">${icon('calendar', 16)} Lembretes no Calendário do iPhone</h2>
      <div class="card">
        <p>Envie a agenda para o <b>Calendário do iPhone</b> com alarmes. Assim o celular avisa na hora certa, mesmo com o app fechado.</p>
        <div class="btnrow">
          <button class="btn btn--primary btn--sm" data-action="ics" data-who="me" data-days="7">${icon('download', 16)} Minha semana</button>
          <button class="btn btn--soft btn--sm" data-action="ics" data-who="me" data-days="30">Meus 30 dias</button>
          ${store.team.length > 1 ? `<button class="btn btn--soft btn--sm" data-action="ics" data-who="all" data-days="7">Semana da ${crew()}</button>` : ''}
        </div>
        <p class="fhelp">No iPhone, toque em “Calendário” ou abra o arquivo baixado e escolha “Adicionar tudo”. Se mudar algo depois, exporte de novo.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${icon('cloud', 16)} Sincronização</h2>
      <div class="card card--row ${cloud ? 'card--ok' : 'card--warn'}">
        ${icon(cloud ? 'cloud' : 'phone', 22)}
        <div><strong>${cloud ? 'Sincronizado na nuvem' : 'Salvo só neste aparelho'}</strong>
        <small>${cloud ? (store.solo ? 'Sua agenda fica salva na sua conta e aparece igual em qualquer celular em que você entrar.' : 'Henrique, Matheus e os links dos clientes veem tudo em tempo real.') : 'Para ver a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto.'}</small></div>
      </div>
    </section>

    ${!isStandalone() ? `<section class="block">
      <h2 class="block__title">${icon('phone', 16)} Instalar como app</h2>
      <div class="card">
        <ol class="steps">
          <li>Abra este endereço no <b>Safari</b>.</li>
          <li>Toque em ${icon('share', 15)} <b>Compartilhar</b>.</li>
          <li>Escolha <b>Adicionar à Tela de Início</b>.</li>
        </ol>
        <p class="fhelp">O app abre em tela cheia, como um aplicativo normal.</p>
      </div>
    </section>` : ''}

    ${isMarketing() ? `<section class="block">
      <h2 class="block__title">${icon('bulb', 16)} Melhores horários (referência)</h2>
      <div class="card card--flush">
        <ul class="besttimes">
          ${BEST_TIMES_TABLE.map((r) => `<li><span class="tbadge tbadge--${r.type}">${icon(TYPES[r.type].icon, 13)}${TYPES[r.type].label}</span><span>${esc(r.text)}</span></li>`).join('')}
        </ul>
        <p class="fhelp pad">Médias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada público tem seu horário de pico.</p>
      </div>
    </section>` : ''}

    <section class="block">
      <h2 class="block__title">${icon('download', 16)} Dados e backup</h2>
      <div class="list">
        <button class="list__row" data-action="export">${icon('download', 18)}<span>Exportar backup (.json)</span>${icon('right', 16, 'muted')}</button>
        <label class="list__row">${icon('upload', 18)}<span>Importar backup</span><input type="file" accept="application/json,.json" data-action-change="import" hidden>${icon('right', 16, 'muted')}</label>
        ${store.demo ? `<button class="list__row" data-action="clear-demo">${icon('sparkle', 18)}<span>Apagar dados de exemplo</span>${icon('right', 16, 'muted')}</button>` : ''}
        <button class="list__row is-danger" data-action="clear-all">${icon('trash', 18)}<span>Apagar tudo</span>${icon('right', 16, 'muted')}</button>
      </div>
      <p class="fhelp">${store.state.companies.length} empresas · ${store.state.events.length} eventos · ${store.state.notes.length} bilhetes</p>
    </section>
    <section class="block">
      <h2 class="block__title">${icon('refresh', 16)} Versão do app</h2>
      <div class="list">
        <div class="list__row list__row--static"><span><b>${esc(CONFIG.appName)} ${esc(APP_VERSION)}</b><small>Atualiza sozinho sempre que você abre · código ${esc(APP_BUILD)}</small></span><span class="verok">${icon('check', 14)} em dia</span></div>
        <button class="list__row" data-action="whatsnew">${icon('sparkles', 18)}<span>Novidades desta versão</span>${icon('right', 16, 'muted')}</button>
        <button class="list__row" data-action="check-update">${icon('refresh', 18)}<span>Procurar atualização agora</span>${icon('right', 16, 'muted')}</button>
      </div>
    </section>
    ${cloud ? `<section class="block">
      <button class="logoutbig" data-action="logout">${icon('logout', 20)}<span>Sair da conta</span></button>
      <p class="fhelp center">Conectado como ${esc(store.user?.email || '')}</p>
    </section>` : ''}
    <div class="about">${brand('palavra', { h: 22, alt: esc(CONFIG.appName) })}<small>versão ${esc(APP_VERSION)} · sua agenda de trabalho e pessoal</small></div>
  </div>`;
}

/* Ficha da pessoa: profissão + índice calculado (abre para editar) */
function themeCard() {
  const cur = themePref();
  return `<section class="block">
    <h2 class="block__title">${icon('sun', 16)} Aparência</h2>
    <div class="seg3">${THEMES.map((t) => `<button class="seg3__btn${cur === t.id ? ' is-on' : ''}" data-action="theme" data-v="${t.id}">${icon(t.id === 'dark' ? 'moon' : t.id === 'light' ? 'sun' : 'phone', 18)}<b>${t.label}</b><small>${t.hint}</small></button>`).join('')}</div>
    <div class="list" style="margin-top:10px"><label class="list__row"><span><b>Sons</b><small>Toque suave ao trocar de modo e ao concluir</small></span><input type="checkbox" class="switch" data-sound ${soundOn() ? 'checked' : ''}></label></div>
    ${!isMarketing() && WORK.theme ? `<p class="fhelp">As cores do modo Trabalho combinam com a sua área${WORK.profession ? ` (${esc(professionFor(WORK.profession, store.profile?.pronoun))})` : ''}.</p>` : ''}
  </section>`;
}
/* Linha de lista agrupada: ícone num quadrado colorido + título + detalhe + seta */
export const grow = ({ cls = '', attrs = '', ic, c, t, s = '', badge = '' }) => `<button class="glist__row ${cls}" ${attrs}><span class="glist__ic" style="--c:${c}">${icon(ic, 18)}</span><span class="glist__txt"><b>${esc(t)}</b>${s ? `<small>${s}</small>` : ''}</span>${badge ? `<span class="glist__badge">${esc(badge)}</span>` : ''}${icon('right', 16)}</button>`;
function fichaRow() {
  const p = store.profile || {};
  if (!p.onboardedAt) return grow({ cls: 'pbig--ficha', attrs: 'data-action="ficha"', ic: 'idcard', c: '#FF9500', t: 'Preencha sua ficha', s: '2 minutos: o Lembra se adapta a você' });
  return grow({ cls: 'pbig--ficha', attrs: 'data-action="ficha"', ic: !isMarketing() && WORK.badge ? WORK.badge : 'idcard', c: '#FF9500', t: 'Sua ficha', s: `${esc(professionFor(p.profession, p.pronoun) || 'Profissão')} · índice ${Number(p.index) || 0}/100`, badge: '' });
}

function notifySection() {
  const perm = push.permission();
  const install = push.needsInstall();
  const cloud = store.mode === 'cloud';
  const device = !!localStorage.getItem('pauta.device');
  const prefs = push.getPrefs();
  let state, text, btn = '';
  if (install) {
    state = 'warn'; text = 'No iPhone, as notificações só funcionam com o app instalado na Tela de Início.'; btn = `<button class="btn btn--primary btn--sm" data-action="install-guide">Como instalar</button>`;
  } else if (perm === 'unsupported') {
    state = 'warn'; text = 'Este navegador não aceita notificações.';
  } else if (perm === 'denied') {
    state = 'warn'; text = `Bloqueadas. Para ligar: Ajustes do iPhone → Notificações → ${CONFIG.appName}.`;
  } else if (perm !== 'granted') {
    state = 'warn'; text = 'Desativadas neste celular.'; btn = `<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>`;
  } else if (cloud && device) {
    state = 'ok'; text = store.team.length > 1 ? 'Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.' : 'Ativadas. Seus lembretes chegam mesmo com o app fechado.'; btn = `<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>`;
  } else if (cloud) {
    state = 'warn'; text = 'Permissão concedida, mas este celular ainda não foi cadastrado no servidor. Toque em Cadastrar.'; btn = `<button class="btn btn--primary btn--sm" data-action="notify-enable">Cadastrar</button>`;
  } else {
    state = 'warn'; text = 'Ativadas só com o app aberto. Para receber com o app fechado e no celular do parceiro, ligue a nuvem e o servidor (README).';
  }
  return `<section class="block">
    <h2 class="block__title">${icon('bell', 16)} Notificações</h2>
    <div class="card card--row ${state === 'ok' ? 'card--ok' : 'card--warn'}">
      ${icon('bell', 22)}
      <div><strong>${state === 'ok' ? 'Funcionando' : 'Atenção'}</strong><small>${esc(text)}</small></div>
      ${btn}
    </div>
    <form class="list notif-prefs" data-notify-form onsubmit="return false">
      <label class="list__row"><span><b>Lembretes dos meus compromissos</b><small>antes do horário (como calculado na sua ficha), na hora e cobrança se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${prefs.reminders ? 'checked' : ''}></label>
      <label class="list__row"${store.team.length < 2 ? ' hidden' : ''}><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${prefs.partner ? 'checked' : ''}></label>
      <label class="list__row"><span><b>Dicas do trabalho</b><small>${isMarketing() ? 'ideias de conteúdo, trends e cobranças por empresa' : 'dicas práticas da sua profissão e motivação'}, em horários variados</small></span><input type="checkbox" class="switch" name="coach" ${prefs.coach ? 'checked' : ''}></label>
      <label class="list__row"><span><b>Resumo do dia</b><small>às 8h (hoje) e às 20h (amanhã)</small></span><input type="checkbox" class="switch" name="daily" ${prefs.daily ? 'checked' : ''}></label>
    </form>
    ${cloud ? `<div class="list" data-devices><div class="list__row"><span><small>Conferindo celulares cadastrados…</small></span></div></div>` : ''}
    ${perm === 'granted' ? `<button class="btn btn--soft btn--block" data-action="notify-test">${icon('bell', 16)} Enviar notificação de teste</button>` : ''}
    ${usagePlaceholder() ? `<h3 class="block__sub">Uso de hoje (grátis)</h3>${usagePlaceholder()}` : ''}
    ${perm === 'granted' && cloud ? `<button class="btn btn--soft btn--block" data-action="coach-test">✨ Receber uma dica agora</button>` : ''}
    ${!isStandalone() ? `<button class="btn btn--soft btn--block" data-action="install-guide">${icon('phone', 16)} Instalar na tela inicial</button>` : ''}
    <button class="btn-text btn-text--sm" data-action="onboarding-again">Ver a apresentação de novo</button>
  </section>`;
}

function fillDevices() {
  push.teamDevices().then((counts) => {
    const box = document.querySelector('[data-devices]');
    if (!box) return;
    if (!counts) { box.innerHTML = '<div class="list__row"><span><small>Não deu para conferir os celulares agora.</small></span></div>'; return; }
    box.innerHTML = store.team.map((m) => {
      const n = counts[m.id] || 0;
      return `<div class="list__row devrow"><span><b>${esc(m.name)}</b><small>${n ? `${n} celular${n > 1 ? 'es' : ''} recebendo avisos` : 'Nenhum celular cadastrado — não recebe notificações. Abra o app pelo ícone → Ajustes → Notificações → Ativar/Cadastrar.'}</small></span><span>${n ? '✅' : '⚠️'}</span></div>`;
    }).join('');
  });
}

function planSection() {
  const b = store.billing || {};
  const label = { gratis: 'Grátis até 31/12/2026 (tudo liberado)', trial: 'Teste grátis (tudo liberado)', comp: 'Acesso liberado', monthly: `${b.tier === 'essencial' ? 'Essencial' : 'Profissional'} · ${b.prepaid ? '12 meses no Pix' : b.interval === 'year' ? 'anual' : 'mensal'}`, lifetime: ownerApp() ? 'Proprietário · acesso total' : b.vip ? 'Lembra Vitalício' : b.founder ? 'Fundadores · Profissional para sempre' : 'Vitalício', expired: 'Teste encerrado', blocked: 'Sem plano', none: 'Sem plano', shared: 'Agenda compartilhada', checking: 'Conferindo…', offline: 'Sem conexão para conferir' }[b.plan] || '—';
  const detail = b.plan === 'gratis' ? 'Lançamento do Lembra: todos os recursos liberados, inclusive o assistente com IA. Ninguém é cobrado sem escolher assinar.' : b.plan === 'trial' ? `Termina em ${fmtLeft(b.trialEndsAt - Date.now())}`
    : b.plan === 'monthly' ? (b.prepaid ? `Pago até ${new Date(b.paidUntil).toLocaleDateString('pt-BR')} · perto de vencer, é só renovar` : b.cancelAt ? `Cancelada: vale até ${new Date(b.cancelAt).toLocaleDateString('pt-BR')}` : b.paidUntil ? `Renova em ${new Date(b.paidUntil).toLocaleDateString('pt-BR')}` : 'Ativa')
      : b.plan === 'lifetime' ? (b.vip ? `Membro Nº ${String(b.vip.no).padStart(3, '0')} · desde ${new Date(b.vip.at).toLocaleDateString('pt-BR')}. Presente de cortesia do Lembra (veja os Termos de Uso).` : b.comp ? 'Acesso cortesia liberado pelo Lembra.' : 'Pago uma vez, para sempre. Obrigado!')
        : b.plan === 'comp' ? `Acesso liberado pelo Lembra até ${new Date(b.compUntil).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}. Depois disso, é só escolher um plano.`
        : b.plan === 'shared' ? `Liberado pela agenda de ${store.shared?.ownerName || b.ownerName || 'quem te convidou'}. Você não paga nada.` : '';
  const ap = (k) => (b.plan === 'lifetime' ? { dupla: '4,90', equipe: '19,90' } : { dupla: '7,90', equipe: '29,90' })[k];
  const addon = b.addon && b.addon.active ? `<div class="card card--row"><div><strong>+ Agenda compartilhada ${b.addon.plan === 'equipe' ? `Equipe · R$ ${ap('equipe')}/mês` : `Dupla · R$ ${ap('dupla')}/mês`}</strong><small>${b.addon.cancelAt ? `Cancelada: vale até ${new Date(b.addon.cancelAt).toLocaleDateString('pt-BR')}` : 'Complemento mensal, cobrado à parte'}</small></div><button class="btn btn--soft btn--sm" data-action="share">Ver</button></div>` : '';
  return `<section class="block">
    <h2 class="block__title">${icon('card', 16)} Seu plano</h2>
    <div class="card card--row"><div><strong>${esc(label)}</strong>${detail ? `<small>${esc(detail)}</small>` : ''}</div>
      ${b.plan === 'lifetime' && b.vip && !b.addon ? '<button class="btn btn--soft btn--sm" data-action="vip-card">Ver cartão</button>' : b.plan === 'monthly' && b.prepaid ? ((b.paidUntil - Date.now()) < 30 * 864e5 ? '<button class="btn btn--primary btn--sm" data-action="plans">Renovar</button>' : '') : b.plan === 'monthly' || (b.plan === 'lifetime' && b.addon) ? '<button class="btn btn--soft btn--sm" data-action="billing-portal">Gerenciar</button>' : !['lifetime', 'shared'].includes(b.plan) ? '<button class="btn btn--primary btn--sm" data-action="plans">Assinar</button>' : ''}
    </div>
    ${b.plan === 'monthly' && b.tier === 'essencial' ? `<button class="card card--row upgrade" data-action="billing-portal">${icon('crown', 20)}<div><strong>Passe para o Profissional</strong><small>Assistente com IA, cobrança de atraso e ranking com meses grátis. Troque em “Gerenciar”.</small></div>${icon('right', 16)}</button>` : ''}
    ${b.plan === 'monthly' && (b.foundersLeft ?? 0) > 0 ? `<button class="card card--row upgrade" data-action="plans">${icon('crown', 20)}<div><strong>Vire Fundador</strong><small>R$ 199 uma vez: o Profissional para sempre. Só ${b.foundersLeft} vagas. A assinatura é cancelada na hora.</small></div>${icon('right', 16)}</button>` : ''}
    ${addon}
  </section>`;
}

/* "Seu dia de trabalho": perguntas simples, uma por cartão, com o resumo em uma frase no topo */
function routineSection() {
  const r = routine();
  const hh = (t) => String(t || '').replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
  const WD_FULL = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const offs = r.daysOff.map((i) => WD_FULL[i]);
  const resumo = `Você trabalha das <b>${hh(r.workStart)}</b> às <b>${hh(r.workEnd)}</b>, almoça das <b>${hh(r.lunchStart)}</b> às <b>${hh(r.lunchEnd)}</b>${offs.length ? ` e folga ${offs.length === 1 ? 'no' : 'em'} <b>${offs.join(', ').replace(/, ([^,]*)$/, ' e $1')}</b>` : ' e não tem dia de folga'}.`;
  const travel = [[0, 'Não preciso de tempo entre eles'], [15, '15 minutos'], [30, '30 minutos'], [45, '45 minutos'], [60, '1 hora'], [90, '1 hora e meia']];
  return `<section class="block">
    <h2 class="block__title">${icon('clock', 16)} Seu dia de trabalho</h2>
    <p class="rt__lead">Conte como é o seu dia. Com isso o Lembra <b>não marca nada</b> no seu almoço, na sua folga ou fora do expediente, e avisa quando o dia estiver cheio demais.</p>
    <div class="rt__resumo">${icon('sparkles', 16)}<span>${resumo}</span></div>
    <form class="rt" data-routine-form onsubmit="return false">
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#0A84FF">${icon('briefcase', 18)}</span><div><b>Que horas você começa e termina de trabalhar?</b><small>Fora desse horário o Lembra não marca compromisso de trabalho.</small></div></div>
        <div class="rt__times"><span>Das</span><input type="time" name="workStart" value="${r.workStart}" aria-label="Começo do expediente"><span>às</span><input type="time" name="workEnd" value="${r.workEnd}" aria-label="Fim do expediente"></div></div>
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#FF9500">${icon('utensils', 18)}</span><div><b>Que horas é o seu almoço?</b><small>Esse horário fica livre: nada é marcado em cima dele.</small></div></div>
        <div class="rt__times"><span>Das</span><input type="time" name="lunchStart" value="${r.lunchStart}" aria-label="Começo do almoço"><span>às</span><input type="time" name="lunchEnd" value="${r.lunchEnd}" aria-label="Fim do almoço"></div></div>
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#34C759">${icon('sun', 18)}</span><div><b>Em quais dias você NÃO trabalha?</b><small>Toque nos dias de folga (eles ficam verdes). Nesses dias o Lembra deixa você descansar.</small></div></div>
        <div class="rt__days">${WD_SHORT.map((w, i) => `<label class="rt__day"><input type="checkbox" name="off" value="${i}"${r.daysOff.includes(i) ? ' checked' : ''}><span><b>${w}</b><small>${r.daysOff.includes(i) ? 'folga' : 'trabalho'}</small></span></label>`).join('')}</div></div>
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#AF52DE">${icon('car', 18)}</span><div><b>Quanto tempo você leva de um compromisso para o outro?</b><small>O Lembra deixa esse intervalo livre entre eles (trânsito, deslocamento).</small></div></div>
        <select class="rt__sel" name="travelMin">${travel.map(([m, l]) => `<option value="${m}"${r.travelMin === m ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="rt__card"><div class="rt__q"><span class="rt__ic" style="--c:#FF3B30">${icon('listcheck', 18)}</span><div><b>Quantos compromissos você aguenta num dia?</b><small>Passou disso, o Lembra avisa que o dia está pesado.</small></div></div>
        <select class="rt__sel" name="maxTasks">${[4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => `<option value="${n}"${r.maxTasks === n ? ' selected' : ''}>Até ${n} por dia</option>`).join('')}</select></div>
    </form>
    <p class="fhelp">Muda na hora, sem botão de salvar.</p>
  </section>`;
}

export const settingsActions = {
  async notifyEnable() {
    const r = await push.enable().catch((e) => ({ ok: false, reason: 'error', message: e.message }));
    if (r.ok) toast(r.local ? 'Ativado (com o app aberto)' : 'Notificações ativadas');
    else if (r.reason === 'install') toast('Instale o app na Tela de Início primeiro');
    else if (r.reason === 'denied') toast('Bloqueado: libere em Ajustes do iPhone → Notificações');
    else if (r.reason === 'server') toast('Servidor de notificações ainda não publicado');
    else toast(`Não foi possível ativar${r.message ? ': ' + r.message : ''}`, { ms: 8000 });
    store.emit();
  },
  async coachTest() {
    try {
      await coachTest();
      toast('Pronto! Uma dica chega em até 1 minuto (se for entre 8h30 e 21h30).', { ms: 5000 });
    } catch { toast('Não deu para pedir a dica agora. Verifique a conexão.'); }
  },
  async notifyTest() {
    let r;
    try {
      r = await push.sendTest();
    } catch (e) {
      return toast(`Falhou: ${e.message}`, { ms: 8000 });
    }
    if (r.kind === 'not-registered') return toast('Este celular ainda não está cadastrado. Toque em "Ativar" acima.', { ms: 7000 });
    if (r.kind === 'local') return toast('Notificação local mostrada (servidor não configurado)');
    if (r.sent > 0) return toast('Enviada! Deve chegar em alguns segundos. Bloqueie a tela para ver.', { ms: 7000 });
    if (!r.devices) return toast('O servidor não tem este celular cadastrado. Toque em "Ativar" de novo.', { ms: 7000 });
    toast(`A Apple não aceitou o envio (${(r.statuses || []).join(', ') || 'sem resposta'}). Toque em "Ativar" de novo.`, { ms: 9000 });
  },
  async notifyPrefs(form) {
    await push.setPrefs({ reminders: form.reminders.checked, partner: form.partner.checked, daily: form.daily.checked, coach: form.coach.checked });
    toast('Preferências salvas');
  },
  onboardingAgain() {
    resetOnboarding();
  },
  async routine(form) {
    const t = (n, def) => (/^\d{2}:\d{2}$/.test(form[n].value) ? form[n].value : def);
    const r = routine();
    const next = {
      id: 'routine',
      workStart: t('workStart', r.workStart),
      workEnd: t('workEnd', r.workEnd),
      lunchStart: t('lunchStart', r.lunchStart),
      lunchEnd: t('lunchEnd', r.lunchEnd),
      travelMin: Number(form.travelMin.value),
      maxTasks: Number(form.maxTasks.value),
      daysOff: [...form.querySelectorAll('input[name="off"]:checked')].map((i) => Number(i.value)),
    };
    if (next.workEnd <= next.workStart) return toast('O fim do expediente precisa ser depois do início');
    if (next.lunchEnd <= next.lunchStart) return toast('O fim do almoço precisa ser depois do início');
    await store.upsert('settings', next);
    toast('Rotina salva');
  },
  async ics(btn) {
    const who = btn.dataset.who === 'me' ? store.me : 'all';
    if (btn.dataset.who === 'me' && !store.me) return toast('Escolha primeiro quem está usando este celular');
    const days = Number(btn.dataset.days);
    const t = todayKey();
    const evs = store.eventsBetween(t, addDays(t, days), { person: who }).filter((e) => e.status !== 'feito');
    if (!evs.length) return toast('Nada agendado nesse período');
    const name = who === 'all' ? `${CONFIG.appName} – Dupla` : `${CONFIG.appName} – ${store.member(who).name}`;
    await downloadICS(evs, `pauta-${who}-${t}.ics`, name);
  },
  export() {
    const blob = new Blob([store.exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pauta-backup-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Backup exportado');
  },
  async import(input) {
    const f = input.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const mode = await chooseDialog({
        title: 'Importar backup',
        text: 'Como deseja importar?',
        options: [
          { label: 'Juntar com os dados atuais', value: 'merge', primary: true },
          { label: 'Substituir tudo', value: 'replace', danger: true },
        ],
      });
      if (!mode) return;
      await store.importData(text, { replace: mode === 'replace' });
      toast('Backup importado');
    } catch (e) {
      toast('Arquivo inválido');
    } finally {
      input.value = '';
    }
  },
  async clearAll() {
    const ok = await confirmDialog({ title: 'Apagar TUDO?', text: 'Empresas, eventos e bilhetes serão apagados. Exporte um backup antes, se precisar.', ok: 'Apagar tudo', danger: true });
    if (!ok) return;
    await store.clearAll();
    toast('Tudo apagado');
  },
};
