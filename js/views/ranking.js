/* Ranking semanal (só plano mensal): mostra só a INICIAL de cada pessoa (nada de foto ou nome) */
import { store } from '../store.js';
import { openSheet, sheetHead, toast } from '../components.js';
import { icon } from '../icons.js';
import { esc } from '../utils.js';

const medal = (p) => (p === 1 ? '🥇' : p === 2 ? '🥈' : p === 3 ? '🥉' : `${p}º`);
export async function openRanking() {
  let d = null;
  const html = () => `${sheetHead('Ranking da semana', { left: '<button class="btn-text" data-close>Fechar</button>' })}
  <div class="page page--sheet rank">
    <div class="rank__hero">${icon('trophy', 34)}<div><strong>Quem mais usa o Lembra ganha</strong><small>O nº 1 do mês tem o mês seguinte <b>grátis</b>: a fatura vem zerada no dia 1º.</small></div></div>
    ${!d ? '<p class="fhelp">Carregando…</p>' : `
      ${d.eligible ? (d.me && d.me.pos ? `<div class="rank__me"><span>Sua posição</span><b>${medal(d.me.pos)}</b><small>${d.me.pts} pontos esta semana</small></div>` : '<div class="rank__me"><span>Você ainda não pontuou esta semana</span><small>Marque compromissos, conclua tarefas e anote: cada ação conta.</small></div>')
        : `<div class="rank__me rank__me--off"><span>O ranking é exclusivo do plano mensal</span><small>Assine o mensal para participar e concorrer a meses grátis.</small><button class="btn btn--primary btn--sm" data-action="plans">Ver planos</button></div>`}
      <div class="glist rank__list">${d.top.length ? d.top.map((r) => `<div class="rank__row${r.me ? ' is-me' : ''}"><span class="rank__pos">${medal(r.pos)}</span><span class="rank__ini">${esc(r.i)}</span><span class="rank__name">${r.me ? 'Você' : 'Participante'}</span><b>${r.pts} pts</b></div>`).join('') : '<p class="fhelp" style="padding:16px">Ninguém pontuou ainda esta semana. Seja o primeiro!</p>'}</div>
      ${d.lastWinner ? `<p class="fhelp">🏆 Campeão de ${esc(d.lastWinner.month.split('-').reverse().join('/'))}: <b>${esc(d.lastWinner.i)}.</b> (${d.lastWinner.pts} pts)${d.lastWinner.me ? ' — foi você! 🎉' : ''}</p>` : ''}
      <h4>Como pontuar</h4>
      <ul class="rank__rules"><li><b>3 pts</b> por compromisso criado</li><li><b>2 pts</b> por tarefa concluída ou lembrete pessoal criado</li><li><b>1 pt</b> por bilhete e ao abrir o app (no máximo a cada 2h)</li></ul>
      <p class="fhelp">Jogo limpo: cada item conta uma vez, há limite de pontos por hora e por dia, e contas com uso automático (robôs, scripts, IA mexendo sozinha) saem do ranking. A semana vai de segunda a domingo; o prêmio do mês soma as semanas do mês. Válido só para quem continua no plano mensal.</p>`}
  </div>`;
  const a = openSheet({ className: 'sheet--tall', html: html() });
  try { d = await (await import('../avisos.js')).api('/rank/board', {}); a.set(html()); } catch (e) { toast('Não consegui abrir o ranking agora.'); }
  return a;
}
