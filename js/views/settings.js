/* Ajustes: perfil, lembretes, sincronização, backup */
import { coachTest } from '../coach.js';
import { usagePlaceholder, fillUsage } from '../usage.js';
import { store } from '../store.js';
import { CONFIG } from '../../config.js';
import { TYPES, BEST_TIMES_TABLE } from '../constants.js';
import { esc, todayKey, addDays, isStandalone } from '../utils.js';
import { icon } from '../icons.js';
import { avatar, toast, confirmDialog, chooseDialog } from '../components.js';
import { downloadICS } from '../ics.js';
import { routine } from '../planner.js';
import * as push from '../avisos.js';
import { resetOnboarding } from './onboarding.js';
import { WD_SHORT } from '../utils.js';

export function renderSettings() {
  const me = store.member(store.me);
  const cloud = store.mode === 'cloud';
  const notifOk = 'Notification' in window && Notification.permission === 'granted';
  if (cloud) setTimeout(() => { fillDevices(); fillUsage(); }, 0);
  return `
  <header class="hdr">
    <div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${esc(CONFIG.appName)} · ${esc(CONFIG.agencyName)}</p><h1>Ajustes</h1></div></div>
  </header>
  <div class="page">
    <button class="pbig pbig--toPersonal" data-action="space" data-space="personal">${icon('heart', 22)}<div><strong>Abrir o modo Pessoal</strong><small>Aniversários, compromissos, listas — só você vê</small></div>${icon('right', 18)}</button>
    ${cloud && (store.user?.email || '').toLowerCase() === (CONFIG.adminEmail || '').toLowerCase() ? `<button class="pbig" data-action="admin">${icon('users', 22)}<div><strong>Painel do dono</strong><small>Quantas pessoas usam o app e os detalhes de cada conta</small></div>${icon('right', 18)}</button>` : ''}
    <section class="block">
      <h2 class="block__title">${icon('user', 16)} Quem está usando este celular?</h2>
      ${cloud
        ? `<div class="card card--row">${me ? avatar(me.id, 40) : icon('user', 24)}<div><strong>${esc(me?.name || store.user?.email || '')}</strong><small>${esc(store.user?.email || '')}</small></div>
            ${store.solo ? `<button class="btn btn--soft btn--sm" data-action="edit-profile">Editar</button>` : ''}
            <button class="btn btn--soft btn--sm" data-action="logout">${icon('logout', 16)} Sair</button></div>`
        : `<div class="whogrid">${store.team.map((m) => `<button class="whobtn${store.me === m.id ? ' is-on' : ''}" style="--mc:${m.color}" data-action="set-me" data-p="${m.id}">${avatar(m.id, 34)}<span>${esc(m.name)}</span><i class="whobtn__check">${icon('check', 14)}</i></button>`).join('')}</div>
           <p class="fhelp">Usado para saudação, “Criado por” e nos lembretes.</p>`}
    </section>

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
          ${store.team.length > 1 ? `<button class="btn btn--soft btn--sm" data-action="ics" data-who="all" data-days="7">Semana da dupla</button>` : ''}
        </div>
        <p class="fhelp">No iPhone, toque em “Calendário” ou abra o arquivo baixado e escolha “Adicionar tudo”. Se mudar algo depois, exporte de novo.</p>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">${icon('cloud', 16)} Sincronização</h2>
      <div class="card card--row ${cloud ? 'card--ok' : 'card--warn'}">
        ${icon(cloud ? 'cloud' : 'phone', 22)}
        <div><strong>${cloud ? 'Sincronizado na nuvem' : 'Salvo só neste aparelho'}</strong>
        <small>${cloud ? 'Henrique, Matheus e os links dos clientes veem tudo em tempo real.' : 'Para Henrique e Matheus verem a mesma agenda em celulares diferentes, ative a nuvem (gratuito). Veja o guia no README do projeto.'}</small></div>
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

    <section class="block">
      <h2 class="block__title">${icon('bulb', 16)} Melhores horários (referência)</h2>
      <div class="card card--flush">
        <ul class="besttimes">
          ${BEST_TIMES_TABLE.map((r) => `<li><span class="tbadge tbadge--${r.type}">${icon(TYPES[r.type].icon, 13)}${TYPES[r.type].label}</span><span>${esc(r.text)}</span></li>`).join('')}
        </ul>
        <p class="fhelp pad">Médias de mercado. Confiram os Insights do Instagram de cada cliente e ajustem: cada público tem seu horário de pico.</p>
      </div>
    </section>

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
    <p class="about">${esc(CONFIG.appName)} — agenda de conteúdo · v1.0</p>
  </div>`;
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
    state = 'ok'; text = 'Ativadas. Os lembretes e os avisos do parceiro chegam mesmo com o app fechado.'; btn = `<button class="btn btn--soft btn--sm" data-action="notify-enable">Recadastrar</button>`;
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
      <label class="list__row"><span><b>Lembretes dos meus posts</b><small>2h e 30 min antes, na hora e cobrança se atrasar</small></span><input type="checkbox" class="switch" name="reminders" ${prefs.reminders ? 'checked' : ''}></label>
      <label class="list__row"${store.team.length < 2 ? ' hidden' : ''}><span><b>Avisos do parceiro</b><small>quando marcar, mudar ou concluir algo</small></span><input type="checkbox" class="switch" name="partner" ${prefs.partner ? 'checked' : ''}></label>
      <label class="list__row"><span><b>Dicas e motivação</b><small>a cada 1h30–2h30 (8h30 às 21h30): ideias de conteúdo, trends e cobranças por empresa</small></span><input type="checkbox" class="switch" name="coach" ${prefs.coach ? 'checked' : ''}></label>
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
      return `<div class="list__row"><span><b>${esc(m.name)}</b><small>${n ? `${n} celular${n > 1 ? 'es' : ''} recebendo avisos` : 'Nenhum celular cadastrado — não recebe notificações. Abra o app pelo ícone → Ajustes → Notificações → Ativar/Cadastrar.'}</small></span><span>${n ? '✅' : '⚠️'}</span></div>`;
    }).join('');
  });
}

function routineSection() {
  const r = routine();
  const mins = [0, 15, 30, 45, 60, 90];
  return `<section class="block">
    <h2 class="block__title">${icon('clock', 16)} Rotina e tempo livre</h2>
    <form class="list" data-routine-form onsubmit="return false">
      <label class="list__row"><span>Expediente</span><input type="time" name="workStart" value="${r.workStart}"> <input type="time" name="workEnd" value="${r.workEnd}"></label>
      <label class="list__row"><span>Almoço</span><input type="time" name="lunchStart" value="${r.lunchStart}"> <input type="time" name="lunchEnd" value="${r.lunchEnd}"></label>
      <label class="list__row"><span>Deslocamento entre lugares</span><select name="travelMin">${mins.map((m) => `<option value="${m}"${r.travelMin === m ? ' selected' : ''}>${m ? m + ' min' : 'não considerar'}</option>`).join('')}</select></label>
      <label class="list__row"><span>Máximo de tarefas/dia</span><select name="maxTasks">${[4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => `<option value="${n}"${r.maxTasks === n ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
      <div class="list__row list__row--col"><span>Dias de folga</span>
        <div class="daysoff">${WD_SHORT.map((w, i) => `<label class="dayoff"><input type="checkbox" name="off" value="${i}"${r.daysOff.includes(i) ? ' checked' : ''}><span>${w}</span></label>`).join('')}</div>
      </div>
    </form>
    <p class="fhelp">O assistente usa isso para não marcar nada em cima do almoço, da folga ou fora do expediente, e para proteger o tempo livre de vocês.</p>
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
