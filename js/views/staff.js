/* Painel da equipe do Lembra: cada cargo vê só a sua parte (métricas, suporte, denúncias, equipe).
   O dono cadastra as pessoas pelo e-mail e escolhe os cargos. Ninguém da equipe vê agenda, notas ou dados pessoais. */
import { store } from '../store.js';
import { openSheet, sheetHead, toast, confirmDialog } from '../components.js';
import { icon } from '../icons.js';
import { esc } from '../utils.js';
import { api } from '../avisos.js';

const call = (p, b = {}) => api(p, { ws: '', ...b });
let eu = null;
/* quem é da equipe (o app pergunta uma vez por sessão) */
export async function minhaEquipe(force = false) {
  if (store.mode !== 'cloud' || !store.user) return null;
  if (eu && !force) return eu;
  try { eu = await call('/staff/me'); } catch { eu = { perms: [], cargos: [] }; }
  return eu;
}
const n = (x) => Number(x || 0).toLocaleString('pt-BR');

export async function openStaff() {
  const me = await minhaEquipe(true);
  if (!me?.perms?.length) return toast('Só para a equipe do Lembra.');
  const abas = [['metricas', 'Números', 'chart'], ['denuncias', 'Denúncias', 'flag'], ['equipe_ver', 'Equipe', 'users']].filter(([p]) => me.perms.includes(p));
  let aba = abas[0]?.[0] || '', m = null, reps = null, eq = null, err = '';
  const cargoTxt = me.cargos.map((c) => (c === 'dono' ? 'Dono' : me.nomes?.[c] || c)).join(' · ');
  const html = () => `${sheetHead('Painel da equipe', { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet stf">
      <p class="stf__eu">${icon('shield', 14)} Seu acesso: <b>${esc(cargoTxt)}</b></p>
      ${me.perms.includes('suporte') ? `<button class="stf__sup" data-sup>${icon('headset', 18)} Abrir o chat do suporte ${icon('right', 16)}</button>` : ''}
      ${abas.length > 1 ? `<div class="fxtabs">${abas.map(([k, l, ic]) => `<button class="${aba === k ? 'is-on' : ''}" data-aba="${k}">${icon(ic, 15)} ${l}</button>`).join('')}</div>` : ''}
      ${err ? `<p class="fhelp">${esc(err)}</p>` : ''}
      ${aba === 'metricas' ? metricasHtml() : aba === 'denuncias' ? denunciasHtml() : aba === 'equipe_ver' ? equipeHtml() : ''}
      <p class="fhelp stf__nota">Regra da casa: ninguém da equipe vê agenda, notas, CPF, celular ou e-mail de usuários. Números são agregados.</p>
    </div>`;
  const metricasHtml = () => !m ? '<div class="fx__load"><i></i><i></i><i></i></div>' : `
    <div class="stf__grid">
      ${[['Contas', m.contas], ['Ativos hoje', m.ativos.dia], ['Ativos 7 dias', m.ativos.semana], ['Ativos 30 dias', m.ativos.mes], ['Online agora', m.ativos.agora], ['Novas hoje', m.novas.hoje], ['Novas 7 dias', m.novas.semana], ['Novas 30 dias', m.novas.mes]].map(([l, v]) => `<div class="stf__k"><b>${n(v)}</b><small>${l}</small></div>`).join('')}
    </div>
    <h3 class="fx__h">${icon('users', 16)} Social e crescimento</h3>
    <div class="stf__grid">
      ${[['Amizades', m.social.amizades], ['Contas com amigos', m.social.comAmigos], ['Stories hoje', m.social.storiesHoje], ['Quem postou hoje', m.social.quemPostouHoje], ['Convites que viraram conta', m.social.convitesQueViraramConta], ['Perto de você ligado', m.social.pertoLigado], ['Nível médio', m.niveis.medio], ['Nível 10+', m.niveis.acima10]].map(([l, v]) => `<div class="stf__k"><b>${n(v)}</b><small>${l}</small></div>`).join('')}
    </div>
    <h3 class="fx__h">${icon('chart', 16)} Cadastros por dia (30 dias)</h3>
    <div class="stf__bars">${(() => { const d = Object.entries(m.novas.porDia || {}).sort(); const mx = Math.max(1, ...d.map(([, v]) => v)); return d.length ? d.map(([k, v]) => `<span title="${k}: ${v}"><i style="height:${Math.max(4, (v / mx) * 100)}%"></i><small>${k.slice(8)}</small></span>`).join('') : '<p class="fhelp">Sem cadastros no período.</p>'; })()}</div>
    <p class="fhelp">Atualizado ${new Date(m.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · ${m.denunciasAbertas} denúncia(s) aberta(s) · ${m.menores} conta(s) de 13–17 anos (protegidas)</p>`;
  const denunciasHtml = () => !reps ? '<div class="fx__load"><i></i><i></i><i></i></div>' : !reps.length ? '<p class="fhelp">Nenhuma denúncia. 🙌</p>' : `<div class="agroup">${reps.map((r) => `
    <div class="stf__rep${r.resolvida ? ' is-ok' : ''}"><div><b>${esc(r.motivo || 'Sem motivo')}</b><small>${r.tipo === 'story' ? 'Story' : 'Perfil'} de ${esc(r.alvo)} · ${new Date(r.at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}${r.resolvida ? ` · ${r.resolvida.acao} por ${esc(r.resolvida.por)}` : r.tipo === 'story' ? (r.storyNoAr ? ' · no ar' : ' · já saiu do ar') : ''}</small></div>
      ${r.resolvida ? icon('check', 18) : `<span class="stf__acts">${r.tipo === 'story' && r.storyNoAr ? `<button class="btn btn--danger-soft btn--sm" data-rm="${r.i}">Tirar do ar</button>` : ''}<button class="btn btn--soft btn--sm" data-ok="${r.i}">Manter</button></span>`}</div>`).join('')}</div>`;
  const equipeHtml = () => !eq ? '<div class="fx__load"><i></i><i></i><i></i></div>' : `
    ${eq.equipe.length ? `<div class="agroup">${eq.equipe.map((p) => `<div class="stf__p"><div><b>${esc(p.nome || p.email)}</b><small>${esc(p.email)} · ${p.cargos.map((c) => esc(eq.cargos[c]?.nome || c)).join(', ')}</small></div>${me.perms.includes('equipe_editar') ? `<button class="btn btn--danger-soft btn--sm" data-tira="${esc(p.email)}">Tirar</button>` : ''}</div>`).join('')}</div>` : '<p class="fhelp">Ninguém na equipe ainda.</p>'}
    ${me.perms.includes('equipe_editar') ? `<h3 class="fx__h">${icon('plus', 16)} Adicionar pessoa</h3>
      <div class="stf__novo"><input class="field" placeholder="Nome" data-nome><input class="field" type="email" placeholder="E-mail que ela usa no Lembra" data-email>
      <div class="stf__cargos">${Object.entries(eq.cargos).map(([k, v]) => `<label><input type="checkbox" value="${k}"><span><b>${esc(v.nome)}</b><small>${v.perms.map((p) => ({ metricas: 'números', suporte: 'chat do suporte', denuncias: 'denúncias', receita: 'receita', equipe_ver: 'ver a equipe' })[p] || p).join(', ')}</small></span></label>`).join('')}</div>
      <button class="btn btn--primary btn--block" data-add>Adicionar à equipe</button>
      <p class="fhelp">A pessoa entra com a própria conta do Lembra (mesmo e-mail) e encontra o painel em Ajustes. Tirar da equipe corta o acesso na hora.</p></div>` : ''}`;
  const carrega = async (x) => {
    err = '';
    try {
      if (aba === 'metricas') m = (await call('/staff/metrics')).m;
      if (aba === 'denuncias') reps = (await call('/staff/reports')).rows;
      if (aba === 'equipe_ver') eq = await call('/staff/list');
    } catch (e) { err = e.message || 'Não consegui carregar.'; }
    if (!x.closed) x.set(html());
  };
  const a = openSheet({ className: 'sheet--tall', html: html(), onMount: (x) => {
    x.el.querySelectorAll('[data-aba]').forEach((b) => (b.onclick = () => { aba = b.dataset.aba; x.set(html()); carrega(x); }));
    const sp = x.el.querySelector('[data-sup]'); if (sp) sp.onclick = () => import('./support.js').then((s) => s.openSupportInbox());
    x.el.querySelectorAll('[data-rm],[data-ok]').forEach((b) => (b.onclick = async () => { const rm = b.hasAttribute('data-rm'); if (rm && !(await confirmDialog({ title: 'Tirar este story do ar?', text: 'Ele some na hora para todo mundo.', ok: 'Tirar do ar', danger: true }))) return; try { await call('/staff/report-action', { i: Number(rm ? b.dataset.rm : b.dataset.ok), acao: rm ? 'remover' : 'manter' }); toast(rm ? 'Story removido' : 'Denúncia encerrada'); carrega(x); } catch (e) { toast(e.message || 'Não consegui.'); } }));
    x.el.querySelectorAll('[data-tira]').forEach((b) => (b.onclick = async () => { if (!(await confirmDialog({ title: 'Tirar da equipe?', text: `${b.dataset.tira} perde o acesso ao painel na hora.`, ok: 'Tirar', danger: true }))) return; try { await call('/staff/remove', { email: b.dataset.tira }); carrega(x); } catch (e) { toast(e.message || 'Não consegui.'); } }));
    const ad = x.el.querySelector('[data-add]');
    if (ad) ad.onclick = async () => {
      const cargos = [...x.el.querySelectorAll('.stf__cargos input:checked')].map((i) => i.value);
      try { await call('/staff/set', { email: x.el.querySelector('[data-email]').value.trim(), nome: x.el.querySelector('[data-nome]').value.trim(), cargos }); toast('Pessoa adicionada à equipe ✓'); carrega(x); } catch (e) { toast(e.message || 'Não consegui.'); }
    };
  } });
  carrega(a);
  return a;
}
