/* O que ficou pra trás — Trabalho (só o que é seu) e Pessoal, numa lista clara.
   Cada item: tocar abre o compromisso/lembrete; "Feito" conclui; "Pra hoje" remarca para hoje no mesmo horário.
   O Lembra no topo acompanha: triste com muita coisa, animado quando está quase zerando, festa quando zera. */
import { store } from '../store.js';
import { openSheet, sheetHead, toast } from '../components.js';
import { icon } from '../icons.js';
import { esc, todayKey, addDays, diffDays, fmtTime } from '../utils.js';
import { personal, overdue, savePersonal } from '../personal.js';
import { sininho, setMood, act, alive, vivo } from '../sininho.js';

const mine = (e) => !store.me || (e.assignees || []).includes(store.me) || e.createdBy === store.me || !(e.assignees || []).length;

/* lista única (Trabalho + Pessoal), do mais antigo ao mais recente */
export function itensAtrasados() {
  const t = todayKey(), desde = addDays(t, -60);
  const work = (store.state?.events || []).filter((e) => mine(e) && e.status !== 'feito' && e.date < t && e.date >= desde)
    .map((e) => ({ k: 'w', id: e.id, title: e.title || 'Compromisso', date: e.date, time: e.time || '' }));
  const pes = (personal.events ? overdue() : []).map((p) => ({ k: 'p', id: p.id, title: p.title || 'Lembrete', date: p.date, time: p.time || '' }));
  return [...work, ...pes].sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1));
}
const quando = (d) => { const n = diffDays(d, todayKey()); return n === 1 ? 'ontem' : `há ${n} dias`; };

async function concluir(it) {
  if (it.k === 'w') { const ev = store.event(it.id); if (ev) await store.upsert('events', { ...ev, status: 'feito' }); }
  else { const p = personal.item(it.id); if (p) savePersonal({ ...p, done: true }); }
}
async function praHoje(it) {
  const t = todayKey();
  if (it.k === 'w') { const ev = store.event(it.id); if (ev) await store.upsert('events', { ...ev, date: t }); }
  else { const p = personal.item(it.id); if (p) savePersonal({ ...p, date: t }); }
}

export function openAtrasados() {
  alive();
  const html = () => {
    const L = itensAtrasados();
    const fala = !L.length ? 'Zerou tudo! Tô muito orgulhoso de você 🎉'
      : L.length === 1 ? 'Só falta essa! Bora resolver? 💪'
      : L.length <= 3 ? `Faltam só ${L.length}. Dá pra zerar hoje!`
      : `Ficaram ${L.length} coisas pra trás. Vamos uma de cada vez, sem pressa 🧡`;
    return `${sheetHead('Ficou pra trás')}
    <div class="page page--sheet atr">
      <div class="atr__hero"><div class="atr__fig">${sininho(!L.length ? 'danca' : L.length > 3 ? 'triste' : 'feliz', { size: 84 })}</div><p class="atr__bub">${esc(fala)}</p></div>
      ${L.length ? `<ul class="atr__list">${L.map((it) => `<li class="atr__it" data-k="${it.k}" data-id="${esc(it.id)}">
          <button class="atr__open" data-open><span class="atr__tag atr__tag--${it.k}">${icon(it.k === 'w' ? 'briefcase' : 'heart', 13)} ${it.k === 'w' ? 'Trabalho' : 'Pessoal'}</span>
            <b>${esc(it.title)}</b><small>${esc(quando(it.date))}${it.time ? ` · ${esc(fmtTime(it.time))}` : ''}</small></button>
          <div class="atr__acts"><button class="atr__b atr__b--ok" data-ok>${icon('check', 15)} Feito</button><button class="atr__b" data-hoje>${icon('calendar', 15)} Pra hoje</button></div>
        </li>`).join('')}</ul>` : '<p class="fhelp atr__vazio">Nada atrasado. Aproveita o dia!</p>'}
    </div>`;
  };
  const s = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      { const f = a.el.querySelector('.atr__fig [data-snh]'); if (f) vivo(f, { aponta: a.el.querySelector('[data-ok]'), gestos: ['pisca', 'olhaLados', 'pensa', 'sobrancelha'] }); }
      const el = a.el, fig = () => el.querySelector('[data-snh]');
      el.querySelectorAll('.atr__it').forEach((li) => {
        const it = itensAtrasados().find((x) => x.id === li.dataset.id && x.k === li.dataset.k);
        if (!it) return;
        li.querySelector('[data-open]').onclick = async () => {
          a.close();
          if (it.k === 'w') (await import('./event.js')).openEventDetail(it.id);
          else (await import('./personal.js')).openPersonalEditor(it.id);
        };
        const sai = async (fn, msg, mood) => {
          li.classList.add('is-saindo');
          await fn(it);
          setMood(fig(), mood); act(fig(), 'pulo');
          import('../sfx.js').then((m) => m.ui('avanco')).catch(() => {});
          toast(msg);
          setTimeout(() => a.set(html()), 420);
        };
        li.querySelector('[data-ok]').onclick = () => sai(concluir, 'Feito ✓', 'comemora');
        li.querySelector('[data-hoje]').onclick = () => sai(praHoje, 'Remarcado para hoje', 'feliz');
      });
    },
  });
  return s;
}
