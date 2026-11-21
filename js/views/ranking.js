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
    <div class="rank__hero">${icon('trophy', 34)}<div><strong>${d ? `Liga ${esc(d.leagueName)}` : 'Ligas semanais'}</strong><small>Os ${d?.move || 5} primeiros do grupo sobem de liga na segunda. No mês: 1º ganha o mês seguinte <b>grátis</b>, 2º 50% e 3º 25% de desconto.</small></div></div>
    ${!d ? '<p class="fhelp">Carregando…</p>' : `
      <div class="rank__stats">
        <div><b>${d.streak || 0}</b><small>🔥 dias seguidos</small></div>
        <div><b>${d.me && d.me.pos ? medal(d.me.pos) : '—'}</b><small>sua posição</small></div>
        <div><b>${d.me ? d.me.pts : 0}</b><small>pontos na semana</small></div>
      </div>
      ${!d.eligible ? `<div class="rank__me rank__me--off"><span>O ranking faz parte do plano Profissional</span><small>Assine o Profissional (mensal ou anual) para participar e concorrer a meses grátis.</small><button class="btn btn--primary btn--sm" data-action="plans">Ver planos</button></div>` : ''}
      <div class="glist rank__list">${d.top.length ? d.top.map((r) => `<div class="rank__row${r.me ? ' is-me' : ''}${r.pos <= (d.move || 5) ? ' is-up' : ''}"><span class="rank__pos">${medal(r.pos)}</span><span class="rank__ini">${esc(r.i)}</span><span class="rank__name">${r.me ? 'Você' : 'Participante'}${r.pos === (d.move || 5) ? ' <small>· zona de subida</small>' : ''}</span><b>${r.pts} pts</b></div>`).join('') : '<p class="fhelp" style="padding:16px">Ninguém pontuou ainda nesta liga. Seja o primeiro!</p>'}</div>
      ${d.lastWinner ? `<p class="fhelp">🏆 Campeão de ${esc(d.lastWinner.month.split('-').reverse().join('/'))}: <b>${esc(d.lastWinner.i)}.</b> (${d.lastWinner.pts} pts)${d.lastWinner.me ? ' — foi você! 🎉' : ''}</p>` : ''}
      <h4>Como pontuar</h4>
      <ul class="rank__rules"><li><b>3 pts</b> por tarefa concluída no horário (atrasada vale 1)</li><li><b>2 pts</b> no primeiro uso do dia — mantém a sua sequência 🔥</li><li><b>1 pt</b> por compromisso criado (até 10 por dia), lembrete pessoal ou bilhete</li></ul>
      <p class="fhelp">Jogo limpo: cada item conta uma vez, há limite de pontos por hora e por dia, e contas com uso automático (robôs, scripts, IA mexendo sozinha) saem do ranking. A sequência aguenta 1 dia de folga por semana. Quem fica 20+ dias ativo no mês ganha 10% de desconto. Cada pessoa ganha no máximo 1 prêmio a cada 90 dias.</p>`}
  </div>`;
  const a = openSheet({ className: 'sheet--tall', html: html() });
  try { d = await (await import('../avisos.js')).api('/rank/board', {}); a.set(html()); } catch (e) { toast('Não consegui abrir o ranking agora.'); }
  return a;
}
