/* Empresas: lista, página da empresa, cadastro e link do cliente */
import { nicheOf } from '../coach.js';
import { store } from '../store.js';
import { TYPES, PALETTE, isPost, WORK, ent, isMarketing, novo, nenhum, entFem } from '../constants.js';
import { esc, todayKey, addDays, startOfWeek, fmtDayShort, relDay, dayLabel, rgba, textOn, resizeImage, uid, monthKey, fmtMonth } from '../utils.js';
import { icon } from '../icons.js';
import { openSheet, sheetHead, logo, eventCard, emptyState, toast, confirmDialog } from '../components.js';
import { buildClientPayload, encodeSnapshot, liveLink, snapshotLink } from '../share.js';

/* ======================== LISTA ======================== */
/* exemplo de nome em cada área */
const EXAMPLE = { Empresa: 'Pura Vida', Local: 'Hospital Santa Clara', Turma: '9º ano B', Obra: 'Residencial Aurora', Cliente: 'Maria Silva', Setor: 'Linha de produção 2', Unidade: '3º Batalhão', Projeto: 'Novo site', Plataforma: 'iFood', 'Área': 'Talhão 3', 'Matéria': 'Matemática' };
export function renderCompanies() {
  const list = store.companiesSorted();
  const t = todayKey();
  const ws = startOfWeek(t);
  const we = addDays(ws, 6);
  return `
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles"><p class="hdr__eyebrow">${list.length} ${list.length === 1 ? ent(false, true) : ent(true, true)}</p><h1>${ent(true)}</h1></div>
      <div class="hdr__actions"><button class="btn btn--primary btn--sm" data-action="new-company">${icon('plus', 16)} ${novo()}</button></div>
    </div>
  </header>
  <div class="page">
    ${!list.length ? emptyState(`${nenhum()} ${ent(false, true)} ainda`, `Cadastre ${WORK.entity.hint} com nome, cor e foto. Assim cada compromisso fica organizado no lugar certo.`,
      `<button class="btn btn--primary" data-action="new-company">${icon('plus', 18)} Cadastrar ${ent(false, true)}</button>`) : ''}
    <div class="colist">
      ${list.map((c) => {
        const week = store.eventsBetween(ws, we, { companyId: c.id });
        const posts = week.filter((e) => isPost(e.type)).length;
        const shoots = week.filter((e) => e.type === 'captacao').length;
        const next = store.state.events
          .filter((e) => e.companyId === c.id && e.date >= t && e.status !== 'feito')
          .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
        return `<button class="cocard" style="--cc:${c.color};--cc-soft:${rgba(c.color, 0.1)}" data-action="open-company" data-id="${c.id}">
          <div class="cocard__top">
            ${logo(c, 48)}
            <div class="cocard__name"><strong>${esc(c.name)}</strong>${c.instagram ? `<small>${icon('insta', 12)} @${esc(c.instagram)}</small>` : ''}</div>
            ${icon('right', 18, 'muted')}
          </div>
          <div class="cocard__stats">
            ${isMarketing() ? `<span><b>${posts}</b> posts</span><span><b>${shoots}</b> captaç${shoots === 1 ? 'ão' : 'ões'}</span>` : `<span><b>${week.length}</b> compromisso${week.length === 1 ? '' : 's'}</span>`}<span class="muted">nesta semana</span>
          </div>
          ${next ? `<div class="cocard__next">${icon(TYPES[next.type].icon, 14)} <b>${esc(relDay(next.date))}${next.time ? ' ' + next.time : ''}</b> · ${esc(TYPES[next.type].label)} — ${esc(next.title || '')}</div>` : `<div class="cocard__next muted">Nada agendado</div>`}
        </button>`;
      }).join('')}
    </div>
  </div>`;
}

/* ======================== PÁGINA DA EMPRESA ======================== */
export function openCompany(id) {
  const api = openSheet({ className: 'sheet--tall', html: companyHtml(id), onMount: (a) => mountCompany(a, id) });
  api.refresh = () => (store.company(id) ? api.set(companyHtml(id)) : api.close());
}

function companyHtml(id) {
  const c = store.company(id);
  if (!c) return '';
  const t = todayKey();
  const mk = monthKey(t);
  const month = store.eventsBetween(`${mk}-01`, `${mk}-31`, { companyId: id });
  const upcoming = store.eventsBetween(t, addDays(t, 30), { companyId: id });
  const past = store.eventsBetween(addDays(t, -14), addDays(t, -1), { companyId: id }).reverse();
  const count = (types) => month.filter((e) => types.includes(e.type)).length;
  const done = month.filter((e) => e.status === 'feito').length;

  let lastDate = '';
  const list = upcoming.map((e) => {
    const head = e.date !== lastDate ? `<h4 class="dayhead">${esc(dayLabel(e.date))}</h4>` : '';
    lastDate = e.date;
    return head + eventCard(e);
  }).join('');

  return `
  ${sheetHead('', { right: store.canEdit('companies', c) ? `<button class="btn-text" data-act="edit">Editar</button>` : '' })}
  <div class="cohero" style="--cc:${c.color};--cc-soft:${rgba(c.color, 0.14)}">
    ${logo(c, 72, 20)}
    <h2>${esc(c.name)}</h2>
    ${c.instagram ? `<a class="cohero__ig" href="https://instagram.com/${encodeURIComponent(c.instagram)}" target="_blank" rel="noopener">${icon('insta', 14)} @${esc(c.instagram)}</a>` : ''}
    <div class="cohero__btns">
      <button class="btn btn--primary btn--sm" data-act="new">${icon('plus', 16)} Evento</button>
      ${WORK.clientLike ? `<button class="btn btn--soft btn--sm" data-act="clientview">${icon('eye', 16)} Página do cliente</button>` : ''}
      <button class="btn btn--soft btn--sm" data-act="share">${icon('share', 16)} Enviar</button>
    </div>
  </div>

  <div class="page page--sheet">
    <section class="block">
      <h2 class="block__title">${esc(fmtMonth(mk))}</h2>
      <div class="mstats mstats--5">
        <div><b>${count(['feed', 'carrossel'])}</b><span>feed</span></div>
        <div><b>${count(['reels'])}</b><span>reels</span></div>
        <div><b>${count(['story'])}</b><span>stories</span></div>
        <div><b>${count(['captacao'])}</b><span>captações</span></div>
        <div><b>${month.length ? Math.round((done / month.length) * 100) : 0}%</b><span>feito</span></div>
      </div>
    </section>

    ${c.address || c.contact || c.notes ? `<ul class="rows">
      ${c.address ? `<li><span class="rows__k">${icon('pin', 16)} Endereço</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(c.address)}" target="_blank" rel="noopener">${esc(c.address)}</a></li>` : ''}
      ${c.contact ? `<li><span class="rows__k">${icon('user', 16)} Contato</span><span class="rows__v">${esc(c.contact)}</span></li>` : ''}
      ${c.notes ? `<li><span class="rows__k">${icon('note', 16)} Observações</span><span class="rows__v">${esc(c.notes)}</span></li>` : ''}
    </ul>` : ''}

    <section class="block">
      <h2 class="block__title">Próximos 30 dias</h2>
      ${list || emptyState('Nada agendado', `Toque em + para marcar o primeiro compromisso aqui.`)}
    </section>

    ${past.length ? `<section class="block">
      <h2 class="block__title">Últimas 2 semanas</h2>
      ${past.map((e) => eventCard(e, { showDate: true, compact: true })).join('')}
    </section>` : ''}
  </div>`;
}

function mountCompany(api, id) {
  const el = api.el;
  (el.querySelector('[data-act="edit"]') || {}).onclick = () => openCompanyEditor(id);
  el.querySelector('[data-act="new"]').onclick = async () => {
    const { openEventEditor } = await import('./event.js');
    openEventEditor({ companyId: id });
  };
  el.querySelector('[data-act="share"]').onclick = () => openShare(id);
  el.querySelector('[data-act="clientview"]').onclick = () => openClientPreview(id);
}

/* ======================== CADASTRO ======================== */
export function openCompanyEditor(id = null, onSaved = null) {
  const existing = id ? store.company(id) : null;
  const used = store.state.companies.map((c) => c.color);
  const d = existing
    ? { ...existing }
    : { id: uid('c_'), name: '', color: PALETTE.find((p) => !used.includes(p)) || PALETTE[0], logo: null, instagram: '', address: '', contact: '', notes: '', shareToken: null };

  const html = () => `
    ${sheetHead(existing ? `Editar ${ent(false, true)}` : `${novo()} ${ent(false, true)}`, {
      left: `<button class="btn-text" data-close>Cancelar</button>`,
      right: `<button class="btn btn--primary btn--sm" data-save>Salvar</button>`,
    })}
    <form class="form" onsubmit="return false">
      <div class="logopick">
        <div data-preview>${logo({ ...d, name: d.name || '?' }, 88, 24)}</div>
        <div class="logopick__btns">
          <label class="btn btn--soft btn--sm">${icon('image', 16)} ${d.logo ? 'Trocar logo' : 'Enviar logomarca'}<input type="file" accept="image/*" data-file hidden></label>
          ${d.logo ? `<button type="button" class="btn-text btn-text--sm" data-rmlogo>Remover logo</button>` : '<p class="fhelp">Opcional. Sem logo, usamos as iniciais na cor escolhida.</p>'}
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-name">Nome (${esc(WORK.entity.hint)})</label>
        <input id="c-name" class="input" name="name" value="${esc(d.name)}" placeholder="Ex.: ${esc(EXAMPLE[WORK.entity.one] || 'Pura Vida')}" autocomplete="off" maxlength="60">
      </div>
      <div class="fgroup">
        <label class="flabel">Cor no calendário</label>
        <div class="palette">
          ${PALETTE.map((p) => `<button type="button" class="swatch${d.color === p ? ' is-on' : ''}" style="background:${p}" data-color="${p}" aria-label="Cor ${p}">${icon('check', 16)}</button>`).join('')}
          <label class="swatch swatch--custom" title="Outra cor"><input type="color" value="${d.color}" data-customcolor>${icon('plus', 16)}</label>
        </div>
      </div>
      <div class="fgroup"${isMarketing() ? '' : ' hidden'}>
        <label class="flabel" for="c-ig">Instagram</label>
        <div class="input-prefix"><span>@</span><input id="c-ig" class="input" name="instagram" value="${esc(d.instagram || '')}" placeholder="usuario" autocomplete="off" autocapitalize="none"></div>
      </div>
      <div class="fgroup"${store.team.length > 1 ? '' : ' hidden'}>
        <label class="flabel">Notificações daqui vão para</label>
        <div class="seg seg--notify">${[['', store.team.length === 2 ? 'Os dois' : 'Todos'], ...store.team.map((m) => [m.id, m.name])].map(([v, l]) => `<button type="button" class="seg__btn${(d.notifyOnly || '') === v ? ' is-on' : ''}" data-only="${v}">${esc(l)}</button>`).join('')}</div>
        <p class="fhelp">${isMarketing() ? 'Avisos, lembretes, “Já postou?”, cobranças de atraso e dicas desta empresa' : `Avisos, lembretes e cobranças de atraso ${entFem() ? 'desta' : 'deste'} ${esc(ent(false, true))}`} chegam só para quem estiver marcado.</p>
      </div>
      <div class="fgroup"${isMarketing() ? '' : ' hidden'}>
        <label class="flabel" for="c-niche">O que a empresa faz (para as dicas)</label>
        <input id="c-niche" class="input" name="niche" value="${esc(d.niche || nicheOf(d))}" placeholder="Ex.: hamburgueria artesanal, loja de roupas femininas" autocomplete="off" maxlength="160">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-addr">Endereço</label>
        <input id="c-addr" class="input" name="address" value="${esc(d.address || '')}" placeholder="Rua, número – bairro" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-contact">Contato</label>
        <input id="c-contact" class="input" name="contact" value="${esc(d.contact || '')}" placeholder="${isMarketing() ? 'Nome e WhatsApp do responsável' : 'Telefone, responsável, horário…'}" autocomplete="off">
      </div>
      <div class="fgroup">
        <label class="flabel" for="c-notes">${isMarketing() ? 'Observações internas' : 'Observações'}</label>
        <textarea id="c-notes" class="input" name="notes" rows="3" placeholder="${isMarketing() ? 'Tom de voz, o que evitar, preferências…' : 'Tudo o que você precisa lembrar sobre esse lugar…'}">${esc(d.notes || '')}</textarea>
      </div>
      ${existing ? `<button type="button" class="btn btn--danger-soft btn--block" data-delete>${icon('trash', 18)} Excluir ${ent(false, true)}</button>` : ''}
      <div class="form__spacer"></div>
    </form>`;

  const mount = (api) => {
    const el = api.el;
    const form = el.querySelector('form');
    const read = () => {
      d.name = form.name.value.trim();
      d.instagram = form.instagram.value.trim().replace(/^@/, '');
      d.niche = form.niche.value.trim();
      d.notifyOnly = el.querySelector('[data-only].is-on')?.dataset.only || null;
      d.address = form.address.value.trim();
      d.contact = form.contact.value.trim();
      d.notes = form.notes.value.trim();
    };
    const preview = () => (el.querySelector('[data-preview]').innerHTML = logo({ ...d, name: form.name.value || '?' }, 88, 24));
    form.name.addEventListener('input', preview);
    el.querySelectorAll('[data-only]').forEach((b) => (b.onclick = () => el.querySelectorAll('[data-only]').forEach((x) => x.classList.toggle('is-on', x === b))));
    el.querySelectorAll('[data-color]').forEach((b) => (b.onclick = () => {
      d.color = b.dataset.color;
      el.querySelectorAll('[data-color]').forEach((x) => x.classList.toggle('is-on', x === b));
      preview();
    }));
    el.querySelector('[data-customcolor]').oninput = (ev) => {
      d.color = ev.target.value;
      el.querySelectorAll('[data-color]').forEach((x) => x.classList.remove('is-on'));
      preview();
    };
    el.querySelector('[data-file]').onchange = async (ev) => {
      const f = ev.target.files[0];
      if (!f) return;
      try {
        read();
        d.logo = await resizeImage(f, 160);
        api.set(html());
      } catch {
        toast('Não foi possível ler essa imagem');
      }
    };
    const rm = el.querySelector('[data-rmlogo]');
    if (rm) rm.onclick = () => {
      read();
      d.logo = null;
      api.set(html());
    };
    const del = el.querySelector('[data-delete]');
    if (del) del.onclick = async () => {
      const evs = store.state.events.filter((e) => e.companyId === d.id);
      const ok = await confirmDialog({
        title: `Excluir ${d.name}?`,
        text: evs.length ? `Os ${evs.length} compromissos daqui também serão apagados e o link do cliente deixará de funcionar.` : 'O link do cliente deixará de funcionar.',
        ok: 'Excluir',
        danger: true,
      });
      if (!ok) return;
      await store.removeMany('events', evs.map((e) => e.id));
      await store.remove('companies', d.id);
      api.close();
      toast('Excluído');
    };
    el.querySelector('[data-save]').onclick = async () => {
      read();
      if (!d.name) {
        form.name.focus();
        return toast('Digite o nome');
      }
      await store.upsert('companies', { ...d });
      api.close();
      toast(existing ? 'Atualizado' : 'Cadastrado');
      onSaved && onSaved(store.company(d.id));
    };
  };
  openSheet({ className: 'sheet--tall', html: html(), onMount: mount });
}

/* ======================== LINK DO CLIENTE ======================== */
export async function openShare(id) {
  const c = store.company(id);
  const cloud = store.mode === 'cloud';
  let link = '';
  if (cloud) {
    await store.ensureShareToken(c);
    await store.publishCompany(id);
    link = liveLink(store.company(id).shareToken);
  } else {
    link = snapshotLink(await encodeSnapshot(buildClientPayload(c, store.state.events, { maxFuture: 90 })));
  }
  const html = `
    ${sheetHead('Link do cliente')}
    <div class="share">
      <div class="share__co">${logo(c, 56)}<div><strong>${esc(c.name)}</strong><small>vê somente o próprio cronograma</small></div></div>
      <ul class="checks">
        <li>${icon('check', 16)} Somente os eventos da ${esc(c.name)}</li>
        <li>${icon('check', 16)} Sem notas internas e sem outras empresas</li>
        <li>${icon('check', 16)} Somente leitura: o cliente não consegue alterar nada</li>
        <li>${icon(cloud ? 'check' : 'alert', 16)} ${cloud ? 'Sempre atualizado: tudo que vocês mudarem aparece para o cliente' : 'Foto do cronograma atual (próximos 90 dias). Quando mudar algo, envie o link de novo'}</li>
      </ul>
      <div class="share__link"><input readonly value="${esc(link)}" data-link></div>
      <div class="share__btns">
        <button class="btn btn--primary btn--block" data-sharebtn>${icon('share', 18)} Enviar para o cliente</button>
        <button class="btn btn--soft btn--block" data-copy>${icon('copy', 18)} Copiar link</button>
        <a class="btn btn--ghost btn--block" href="${esc(link)}" target="_blank" rel="noopener">${icon('eye', 18)} Ver como o cliente vê</a>
      </div>
      ${cloud ? `<button class="btn-text btn-text--sm btn-text--danger" data-revoke>Gerar novo link (o antigo para de funcionar)</button>` : `<p class="fhelp">Dica: ative a sincronização na nuvem (Ajustes) para o link ficar sempre atualizado automaticamente.</p>`}
    </div>`;
  openSheet({
    html,
    onMount: (api) => {
      const el = api.el;
      el.querySelector('[data-copy]').onclick = async () => {
        try {
          await navigator.clipboard.writeText(link);
          toast('Link copiado');
        } catch {
          el.querySelector('[data-link]').select();
          toast('Selecione e copie o link');
        }
      };
      el.querySelector('[data-sharebtn]').onclick = async () => {
        const text = `Olá! Este é o cronograma de conteúdo da ${c.name}. Por aqui vocês acompanham tudo o que está planejado: posts, stories, reels e captações.`;
        if (navigator.share) {
          try {
            await navigator.share({ title: `Cronograma · ${c.name}`, text, url: link });
          } catch { /* cancelado */ }
        } else {
          await navigator.clipboard?.writeText(`${text}\n${link}`);
          toast('Mensagem copiada');
        }
      };
      const rv = el.querySelector('[data-revoke]');
      if (rv) rv.onclick = async () => {
        const ok = await confirmDialog({ title: 'Gerar um novo link?', text: 'Quem tiver o link antigo não conseguirá mais ver o cronograma.', ok: 'Gerar novo link', danger: true });
        if (!ok) return;
        await store.regenerateShareToken(store.company(id));
        api.close();
        openShare(id);
      };
    },
  });
}

/* Mostra, dentro do app, exatamente o que o cliente vê (sem notas internas e sem outras empresas) */
export async function openClientPreview(id) {
  const c = store.company(id);
  if (!c) return;
  const { showClient } = await import('./client.js');
  const { sanitizePayload } = await import('../sanitize.js');
  const payload = sanitizePayload(buildClientPayload(c, store.state.events));
  const wrap = document.createElement('div');
  wrap.className = 'client-preview';
  wrap.innerHTML = `<div class="client-preview__bar"><button class="btn btn--soft btn--sm" data-closepv>${icon('left', 16)} Voltar</button><span>Assim o cliente vê</span><button class="btn btn--primary btn--sm" data-sendpv>${icon('share', 16)} Enviar</button></div><div class="client-preview__body"></div>`;
  document.body.appendChild(wrap);
  document.body.classList.add('has-sheet');
  showClient(wrap.querySelector('.client-preview__body'), payload, { canGoBack: false, preview: true });
  const close = () => {
    wrap.remove();
    document.body.classList.toggle('has-sheet', !!document.querySelector('.sheet-wrap'));
  };
  wrap.querySelector('[data-closepv]').onclick = close;
  wrap.querySelector('[data-sendpv]').onclick = () => {
    close();
    openShare(id);
  };
}
