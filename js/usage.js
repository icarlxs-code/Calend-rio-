import { CONFIG } from '../config.js';
/* "Uso de hoje": mostra o que o servidor grátis já enviou e quanto da IA grátis foi usada */
import { store } from './store.js';
import { server, api } from './avisos.js';
import { esc } from './utils.js';

// números de uso do servidor (avisos de TODAS as contas): só o dono do app vê
const isOwner = () => !!store.user && !!CONFIG.adminEmail && (store.user.email || '').toLowerCase() === CONFIG.adminEmail.toLowerCase();
export const usagePlaceholder = () => (store.mode === 'cloud' && server() && isOwner() ? `<div class="list" data-usage><div class="list__row"><span><small>Conferindo o uso de hoje…</small></span></div></div>` : '');
export async function fillUsage(root = document) {
  const box = root.querySelector('[data-usage]');
  if (!box) return;
  let u = null;
  try { u = await api('/usage', {}); } catch { u = null; }
  if (!box.isConnected) return;
  if (!u || !u.ok) { box.innerHTML = '<div class="list__row"><span><small>Não deu para conferir agora.</small></span></div>'; return; }
  const row = (k, v, s = '') => `<div class="list__row"><span><b>${esc(k)}</b>${s ? `<small>${esc(s)}</small>` : ''}</span><strong>${esc(String(v))}</strong></div>`;
  const total = u.lembretes + u.pessoais + u.amigo.sent + u.coach.sent;
  box.innerHTML = [
    row('Avisos enviados hoje', total, 'tudo grátis e sem limite prático'),
    row('Lembretes de trabalho', u.lembretes, 'horários, "Já postou?" e atrasos'),
    row('Lembretes pessoais', u.pessoais),
    row('Mensagens de ânimo, água e versículos', u.amigo.sent, `${u.amigo.ai} escritas pela IA`),
    row('Dicas do trabalho', u.coach.sent, `${u.coach.ai} escritas pela IA`),
    row('IA grátis usada hoje', `${u.iaPercent}%`, u.iaPercent >= 90 ? 'quase no limite: as mensagens seguem, com textos prontos' : 'a cota renova todo dia'),
  ].join('');
}
