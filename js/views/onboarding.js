/* Boas-vindas: aparece na primeira vez e pede a permissão de notificações */
import { store } from '../store.js';
import { CONFIG } from '../../config.js';
import { esc, isStandalone } from '../utils.js';
import { icon } from '../icons.js';
import { avatar, toast } from '../components.js';
import * as push from '../push.js';

const LS_DONE = 'pauta.onboarded';
const LS_ASKED = 'pauta.notifyAskedAt';

/* Decide se mostra a apresentação completa ou só o pedido de notificações */
export function maybeOnboard() {
  const done = localStorage.getItem(LS_DONE);
  if (!done) return show(store.me ? ['welcome', 'notify', 'done'] : ['welcome', 'who', 'notify', 'done']);
  if (!store.me && store.mode === 'local') return show(['who']);
  // já instalado na Tela de Início e ainda não respondeu às notificações: pergunta de novo (no máximo a cada 3 dias)
  const asked = Number(localStorage.getItem(LS_ASKED) || 0);
  if (isStandalone() && push.permission() === 'default' && Date.now() - asked > 3 * 86400000) return show(['notify']);
}

function preview(title, body, when = 'agora') {
  return `<div class="nprev">
    <img src="icons/icon-192.png" alt="">
    <div><div class="nprev__top"><b>${esc(CONFIG.appName.toUpperCase())}</b><span>${esc(when)}</span></div>
    <strong>${esc(title)}</strong><p>${esc(body)}</p></div>
  </div>`;
}

function stepHtml(step, i, total) {
  const me = store.member(store.me);
  const partner = store.team.find((m) => m.id !== store.me) || store.team[1] || store.team[0];
  const dots = total > 1 ? `<div class="ob__dots">${Array.from({ length: total }, (_, k) => `<i class="${k === i ? 'is-on' : ''}"></i>`).join('')}</div>` : '';
  if (step === 'welcome') {
    return `<div class="ob__art"><img class="ob__icon" src="icons/icon-512.png" alt=""></div>
      <h1>Bem-vindo ao ${esc(CONFIG.appName)}</h1>
      <p>A agenda de conteúdo de ${esc(CONFIG.agencyName)}: posts, stories, reels e captações de todas as empresas, num lugar só.</p>
      ${dots}
      <button class="btn btn--primary btn--block" data-next>Começar</button>`;
  }
  if (step === 'who') {
    return `<div class="ob__art ob__art--sm">${icon('user', 34)}</div>
      <h1>Quem vai usar este celular?</h1>
      <p>Assim o app sabe de quem são os lembretes e avisa o parceiro quando você marcar algo.</p>
      <div class="whogrid ob__who">${store.team.map((m) => `<button class="whobtn${store.me === m.id ? ' is-on' : ''}" style="--mc:${m.color}" data-me="${m.id}">${avatar(m.id, 36)}<span>${esc(m.name)}</span><i class="whobtn__check">${icon('check', 14)}</i></button>`).join('')}</div>
      ${dots}
      <button class="btn btn--primary btn--block" data-next ${store.me ? '' : 'disabled'}>Continuar</button>`;
  }
  if (step === 'notify') {
    return `<div class="ob__previews">
        ${preview('Daqui a 2h: Reels · Pura Vida', '18h — postar o Reels “Bastidores”', 'agora')}
        ${preview(`${partner?.name || 'Seu parceiro'} marcou para você`, 'Story · Café Aroma — amanhã, 16h', 'há 2 min')}
        ${preview(`Bom dia, ${me?.name || 'Henrique'}! Seu dia hoje`, '5 tarefas · primeira: 11h30 Feed · Studio Fit', '8:00')}
      </div>
      <h1>Nunca mais esqueça um post</h1>
      <p>Lembretes 2h e 30 min antes de cada post, aviso na véspera das captações, cobrança se algo ficou para trás e aviso quando o parceiro marcar algo para você.</p>
      <div data-notify-msg></div>
      ${dots}
      <button class="btn btn--primary btn--block" data-enable>${icon('bell', 18)} Ativar notificações</button>
      <button class="btn btn--ghost btn--block" data-skip>Agora não</button>`;
  }
  return `<div class="ob__art ob__art--ok">${icon('check', 40)}</div>
    <h1>Tudo pronto${me ? ', ' + esc(me.name) : ''}!</h1>
    <ul class="ob__tips">
      <li>${icon('plus', 18)}<span>Toque no <b>+</b> para marcar posts, captações e reuniões.</span></li>
      <li>${icon('sparkle', 18)}<span>O <b>Assistente</b> avisa conflitos e sugere os melhores horários.</span></li>
      <li>${icon('link', 18)}<span>Em <b>Empresas</b>, mande para cada cliente o link do cronograma dele.</span></li>
    </ul>
    ${dots}
    <button class="btn btn--primary btn--block" data-next>Abrir a agenda</button>`;
}

function show(steps) {
  if (document.querySelector('.ob')) return;
  let i = 0;
  const el = document.createElement('div');
  el.className = 'ob';
  el.innerHTML = `<div class="ob__card"></div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  const card = el.querySelector('.ob__card');

  const close = () => {
    if (steps.includes('welcome') || steps.includes('done')) localStorage.setItem(LS_DONE, '1');
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 400);
  };
  const go = (n) => {
    if (n >= steps.length) return close();
    i = n;
    card.classList.remove('is-shown');
    setTimeout(() => {
      card.innerHTML = stepHtml(steps[i], i, steps.length);
      bind();
      card.classList.add('is-shown');
    }, card.innerHTML ? 180 : 0);
  };
  const msg = (html, kind = 'info') => {
    const box = card.querySelector('[data-notify-msg]');
    if (box) box.innerHTML = `<div class="ob__msg ob__msg--${kind}">${html}</div>`;
  };

  const bind = () => {
    card.querySelectorAll('[data-next]').forEach((b) => (b.onclick = () => go(i + 1)));
    card.querySelectorAll('[data-me]').forEach((b) => (b.onclick = () => {
      store.setMe(b.dataset.me);
      card.querySelectorAll('[data-me]').forEach((x) => x.classList.toggle('is-on', x === b));
      card.querySelector('[data-next]').disabled = false;
    }));
    const skip = card.querySelector('[data-skip]');
    if (skip) skip.onclick = () => {
      localStorage.setItem(LS_ASKED, String(Date.now()));
      go(i + 1);
    };
    const en = card.querySelector('[data-enable]');
    if (en) en.onclick = async () => {
      localStorage.setItem(LS_ASKED, String(Date.now()));
      if (push.needsInstall()) {
        msg(`<b>Primeiro instale o app.</b> No iPhone, as notificações só funcionam pelo ícone da Tela de Início:<br>
          1. Toque em ${icon('share', 14)} <b>Compartilhar</b><br>2. <b>Adicionar à Tela de Início</b><br>3. Abra o ${esc(CONFIG.appName)} pelo ícone`, 'warn');
        en.outerHTML = `<button class="btn btn--primary btn--block" data-next>Entendi</button>`;
        bind();
        return;
      }
      en.disabled = true;
      en.innerHTML = 'Aguardando permissão…';
      const r = await push.enable().catch(() => ({ ok: false, reason: 'error' }));
      if (r.ok) {
        if (r.local) {
          msg('Ativado neste celular. Para os avisos chegarem com o app fechado e no celular do parceiro, falta ligar o servidor de notificações (Ajustes → Notificações).', 'ok');
        } else {
          msg('Pronto! Você vai receber uma notificação de teste em instantes.', 'ok');
          push.sendTest().catch(() => {});
        }
        en.outerHTML = `<button class="btn btn--primary btn--block" data-next>Continuar</button>`;
        card.querySelector('[data-skip]')?.remove();
        bind();
      } else if (r.reason === 'server') {
        msg('Permissão concedida! O servidor de notificações ainda não foi publicado; quando for, este celular é cadastrado sozinho.', 'ok');
        en.outerHTML = `<button class="btn btn--primary btn--block" data-next>Continuar</button>`;
        bind();
      } else if (r.reason === 'denied') {
        msg(`As notificações foram bloqueadas. Para ligar depois: <b>Ajustes do iPhone → Notificações → ${esc(CONFIG.appName)}</b>.`, 'warn');
        en.outerHTML = `<button class="btn btn--primary btn--block" data-next>Continuar</button>`;
        bind();
      } else {
        msg('Este aparelho não aceita notificações deste app.', 'warn');
        en.disabled = false;
        en.innerHTML = 'Tentar de novo';
      }
    };
  };
  go(0);
}

export function resetOnboarding() {
  localStorage.removeItem(LS_DONE);
  localStorage.removeItem(LS_ASKED);
  toast('A apresentação aparece na próxima abertura');
}
