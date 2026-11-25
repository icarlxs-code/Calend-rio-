/* Achar alguém: um campo só. Aceita celular (de qualquer jeito), e-mail ou ID.
   Celular e e-mail viram códigos embaralhados NO APARELHO: o servidor nunca recebe o número nem o e-mail. */
import { openSheet, toast } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { store } from './store.js';
import { api } from './avisos.js';

const call = (p, b = {}) => api(p, { ws: '', ...b });
export const DDDS = new Set('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' '));
/** o que a pessoa digitou → { tipo, ... }. Telefone sem DDD volta como 'ddd' (a tela pergunta) */
export function entende(txt) {
  const t = String(txt || '').trim(); if (!t) return { tipo: 'vazio' };
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t)) return { tipo: 'email', email: t.toLowerCase() };
  if (/^@/.test(t) || /[a-zà-ú]/i.test(t)) {
    const id = t.replace(/^@/, '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (/@/.test(id)) return { tipo: 'erro', msg: 'Confira o e-mail: falta o final, como gmail.com.' };
    return /^[a-z][a-z0-9._]{2,19}$/.test(id) ? { tipo: 'id', id } : { tipo: 'erro', msg: 'Digite um telefone, um e-mail ou um ID (como @lia.moraes).' };
  }
  let d = t.replace(/\D/g, '');
  if (/^\+(?!55)/.test(t)) return { tipo: 'erro', msg: 'Por enquanto só números do Brasil.' };
  if (d.startsWith('0055')) d = d.slice(4);
  if (d.startsWith('55') && d.length >= 12) d = d.slice(2);
  if (d.startsWith('0') && d.length >= 13) d = d.slice(3); // 0 + operadora + DDD
  d = d.replace(/^0+/, '');
  if (d.length === 8 || d.length === 9) return d.length === 9 && d[0] !== '9' ? { tipo: 'erro', msg: 'Esse celular parece ter um número a mais ou a menos.' } : { tipo: 'ddd', num: d };
  if (d.length === 10 || d.length === 11) {
    if (!DDDS.has(d.slice(0, 2))) return { tipo: 'erro', msg: `O DDD ${d.slice(0, 2)} não existe. Confira.` };
    if (d.length === 11 && d[2] !== '9') return { tipo: 'erro', msg: 'Esse celular parece ter um número a mais.' };
    return { tipo: 'tel', tels: variacoes(d) };
  }
  return { tipo: 'erro', msg: d.length < 8 ? 'Faltam números no telefone.' : 'Tem números demais nesse telefone.' };
}
/** com e sem o 9 da frente (cadastros antigos) */
export function variacoes(d) {
  const out = [d];
  if (d.length === 10 && /[6-9]/.test(d[2])) out.unshift(`${d.slice(0, 2)}9${d.slice(2)}`);
  if (d.length === 11) out.push(d.slice(0, 2) + d.slice(3));
  return out;
}
let meu = '';
export async function meuId() { if (!meu) meu = (await call('/friends/id')).id || ''; return meu; }
export async function trocaMeuId(novo) { meu = (await call('/friends/id', { novo })).id; return meu; }

export function abreAchar({ onDone, inicial = '' } = {}) {
  let pede = '', vez = 0;
  return openSheet({ className: 'sheet--achar', html: `<div class="achar">
      <header class="achar__top"><button class="btn-text" data-close>Fechar</button><h2>Achar alguém</h2><span></span></header>
      <label class="achar__campo">${icon('search', 22)}<input type="text" inputmode="text" autocapitalize="none" autocomplete="off" spellcheck="false" enterkeyhint="search" placeholder="Telefone, e-mail ou ID" aria-label="Telefone, e-mail ou ID" value="${esc(inicial)}" data-q></label>
      <div class="achar__ddd" data-ddd hidden><label>Qual é o DDD?<input type="tel" inputmode="numeric" maxlength="2" data-dddv aria-label="DDD" placeholder="21"></label><button class="btn btn--primary btn--sm" data-dddok>Buscar</button></div>
      <div class="achar__res" data-res aria-live="polite"></div>
      <div class="achar__ex"><span>21 99999-8888</span><span>(21) 99999-8888</span><span>nome@email.com</span><span>@nome</span></div>
      <button class="achar__meu" data-meu><span>Seu ID</span><b data-id>…</b>${icon('copy', 18)}</button>
    </div>`,
  onMount: (x) => {
    const q = (s) => x.el.querySelector(s), inp = q('[data-q]'), res = q('[data-res]'), caixa = q('[data-ddd]'), dv = q('[data-dddv]');
    setTimeout(() => inp.focus(), 250);
    meuId().then((i) => { q('[data-id]').textContent = i ? `@${i}` : '—'; }).catch(() => { q('[data-meu]').hidden = true; });
    q('[data-meu]').onclick = async () => { try { await navigator.clipboard.writeText(`@${await meuId()}`); toast('ID copiado'); } catch { /* ok */ } };
    const nada = (t, extra = '') => { res.innerHTML = `<p class="achar__msg">${esc(t)}</p>${extra}`; };
    const busca = async (e) => {
      caixa.hidden = true; pede = '';
      if (e.tipo === 'vazio') { res.innerHTML = ''; return; }
      if (e.tipo === 'erro') { nada(e.msg); return; }
      if (e.tipo === 'ddd') { pede = e.num; caixa.hidden = false; if (!dv.value) { const p = String(store.profile?.phone || '').replace(/\D/g, '').replace(/^55(?=\d{10,})/, ''); dv.value = p.length >= 10 ? p.slice(0, 2) : ''; } res.innerHTML = ''; dv.focus(); dv.select(); return; }
      const minha = ++vez; res.innerHTML = '<div class="fx__load"><i></i><i></i><i></i></div>';
      try {
        const F = await import('./friends.js');
        const corpo = e.tipo === 'tel' ? { tel: (await Promise.all(e.tels.map(F.hashTel))).filter(Boolean) } : e.tipo === 'email' ? { mail: await F.hashMail(e.email) } : { id: e.id };
        const r = await call('/friends/achar', corpo); if (minha !== vez || x.closed) return;
        if (r.self) { nada('Esse é você 😄'); return; }
        if (!r.row) {
          nada('Não achei ninguém assim. A pessoa pode não ter colocado isso no perfil ou preferiu não ser encontrada.', `<button class="btn btn--soft btn--block" data-conv>${icon('share', 16)} Mandar convite</button>`);
          q('[data-conv]').onclick = () => { x.close(); F.openShareChoice(); }; return;
        }
        const c = r.row;
        res.innerHTML = `<button class="fxrow achar__row" data-pp><span class="fxava"><span class="fxava__in">${c.photo ? `<img src="${esc(c.photo)}" alt="">` : `<span style="background:${esc(c.color || '#7C5CFF')}">${esc((c.name || '?').charAt(0))}</span>`}</span></span><span class="fxrow__id"><b>${esc(c.name)}</b><small>${c.rel === 'amigo' ? 'Vocês já são amigos' : c.rel === 'enviado' ? 'Pedido enviado' : c.rel === 'recebido' ? 'Quer ser seu amigo' : esc(c.job || `Nível ${c.level || 0}`)}</small></span><span class="fx__ver">Ver</span></button>`;
        q('[data-pp]').onclick = () => { x.close(); F.openPublicProfile(c.uid).then(() => onDone && onDone()); };
      } catch (er) { if (minha === vez) nada(er.message || 'Não consegui agora.'); }
    };
    const comDdd = () => { const d = dv.value.replace(/\D/g, ''); if (!DDDS.has(d)) { nada('Esse DDD não existe. Confira.'); return; } const e = entende(d + pede); if (e.tipo === 'tel') inp.value = d + pede; busca(e); };
    let t = 0;
    inp.oninput = () => { clearTimeout(t); vez++; caixa.hidden = true; const e = entende(inp.value); if (e.tipo === 'tel' && e.tels.length) t = setTimeout(() => busca(e), 700); else if (e.tipo === 'email' && /\.(com|br|net|org|me|io)$/.test(e.email)) t = setTimeout(() => busca(e), 900); else res.innerHTML = ''; };
    inp.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(t); busca(entende(inp.value)); } };
    inp.onsearch = () => busca(entende(inp.value));
    inp.onblur = () => { const e = entende(inp.value); if (e.tipo === 'ddd' && caixa.hidden) busca(e); };
    q('[data-dddok]').onclick = comDdd; dv.oninput = () => { if (dv.value.replace(/\D/g, '').length === 2) comDdd(); }; dv.onkeydown = (e) => { if (e.key === 'Enter') comDdd(); };
    if (inicial) busca(entende(inicial));
  } });
}
