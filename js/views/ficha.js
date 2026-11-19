/* Ficha de cadastro do Lembra: conhece a pessoa para o app trabalhar para ela.
   Etapas: boas-vindas → você → trabalho → rotina → dificuldades → estilo → resumo calculado. */
import { icon } from '../icons.js';
import { esc } from '../utils.js';
import { PROFESSIONS, ARCHETYPES, TYPE_DEFS, archOf, searchProfessions, profStyle } from '../../functions/catalog.js';
import { DIFFICULTIES, JOURNEYS, GOALS, TONES, METHODS, VOLUMES, PRONOUNS, computePersona, validCPF, maskCPF, ageOf } from '../persona.js';
import { store, saveUserProfile } from '../store.js';
import { savePrefs } from '../personal.js';
import { routine } from '../planner.js';
import { toast } from '../components.js';
import { CONFIG } from '../../config.js';

/* páginas oficiais (Termos e Privacidade) */
const pageUrl = (name) => `${/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || !CONFIG.siteUrl ? location.pathname.replace(/[^/]*$/, '') : CONFIG.siteUrl.replace(/\/?$/, '/')}${name}/`;

const WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const FORGET = ['', 'Quase nunca esqueço', 'Esqueço às vezes', 'Esqueço com frequência', 'Esqueço muito', 'Esqueço quase tudo'];
const LEADS = [{ v: '', l: 'O Lembra calcula' }, { v: 15, l: '15 min' }, { v: 30, l: '30 min' }, { v: 60, l: '1 hora' }, { v: 120, l: '2 horas' }, { v: 1440, l: '1 dia' }];
const STEPS = ['inicio', 'voce', 'trabalho', 'rotina', 'dificuldades', 'estilo', 'resumo'];

export function openFicha({ initial = {}, onDone, onClose, required = true } = {}) {
  const f = {
    name: '', nickname: '', birth: '', cpf: '', phone: '', profession: '', role: '', workplace: '',
    pronoun: '', volume: '', method: '',
    journey: 'comercial', workStart: '08:00', workEnd: '18:00', workDays: [1, 2, 3, 4, 5], wake: '06:30', sleep: '22:30', lunch: '12:00',
    difficulties: [], forget: 3, lead: '', tone: 'firme', freq: '', faith: true, water: true, meals: true, goal: 'lembrar', consent: false,
    ...initial,
  };
  let step = initial.onboardedAt ? 1 : 0, q = '', err = '';
  const wrap = document.createElement('div');
  wrap.className = 'ficha';
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('is-open'));

  const prog = () => `<div class="ficha__prog"><i style="width:${Math.round((step / (STEPS.length - 1)) * 100)}%"></i></div>`;
  const nav = (next = 'Continuar') => `<p class="ficha__err" ${err ? '' : 'hidden'}>${esc(err)}</p>
    <div class="ficha__nav">${step > 0 ? '<button class="btn btn--soft" data-back>Voltar</button>' : !required ? '<button class="btn-text" data-quit>Agora não</button>' : '<span></span>'}<button class="btn btn--primary" data-next>${next}</button></div>`;

  const views = {
    inicio: () => `<div class="ficha__hero">
        <img src="media/lembra-logo.jpg" alt="Lembra" width="88" height="88">
        <h1>Vamos montar o seu Lembra</h1>
        <p>Em 2 minutos o app aprende como é o seu trabalho, a sua rotina e o que costuma escapar da sua cabeça. Com isso ele calcula <b>quantos avisos</b> você precisa, <b>quando</b> te mandar mensagens e <b>como</b> falar com você.</p>
        <ul class="ficha__bul">
          <li>${icon('briefcase', 16)} Agenda de trabalho com a cara da sua profissão</li>
          <li>${icon('bell', 16)} Lembretes calculados para você</li>
          <li>${icon('heart', 16)} Um modo Pessoal só seu</li>
        </ul></div>${nav('Começar')}`,
    voce: () => `<h2>Sobre você</h2><p class="ficha__sub">Seus dados ficam guardados só na sua conta.</p>
      <label class="flabel" for="fi-name">Nome completo</label><input id="fi-name" class="input" data-f="name" value="${esc(f.name)}" autocomplete="name" maxlength="80">
      <label class="flabel" for="fi-nick">Como quer ser chamado(a)?</label><input id="fi-nick" class="input" data-f="nickname" value="${esc(f.nickname)}" maxlength="30" placeholder="Ex.: Rafa">
      <div class="row2"><div><label class="flabel" for="fi-birth">Nascimento</label><input id="fi-birth" class="input" type="date" data-f="birth" value="${esc(f.birth)}"></div>
      <div><label class="flabel" for="fi-cpf">CPF</label><input id="fi-cpf" class="input" inputmode="numeric" data-f="cpf" value="${esc(maskCPF(f.cpf))}" placeholder="000.000.000-00" maxlength="14"></div></div>
      <label class="flabel">Como prefere ser tratado(a)?</label>
      <div class="ficha__chips">${PRONOUNS.map((p) => `<button class="ficha__chip${f.pronoun === p.id ? ' is-on' : ''}" data-pronoun="${p.id}">${esc(p.label)}</button>`).join('')}</div>
      <label class="flabel" for="fi-phone">Celular (opcional)</label><input id="fi-phone" class="input" type="tel" inputmode="tel" data-f="phone" value="${esc(f.phone)}" placeholder="(00) 00000-0000" maxlength="20">
      <p class="fhelp">O CPF serve só para identificar sua conta e garantir um teste grátis por pessoa. Ele não aparece para ninguém.</p>${nav()}`,
    trabalho: () => {
      // já escolheu e não está buscando: mostra a escolhida (e as parecidas) em vez do começo da lista
      const list = searchProfessions(q || f.profession, 30);
      const arch = archOf(f.profession);
      const a = ARCHETYPES[arch];
      return `<h2>Com o que você trabalha?</h2><p class="ficha__sub">O Lembra se adapta à sua profissão: nomes, tipos de compromisso, dicas e cobranças.</p>
      <div class="ficha__search">${icon('search', 18)}<input class="input" data-q placeholder="Busque: enfermeiro, professor, sargento, vendedor…" value="${esc(q || f.profession)}" autocomplete="off"></div>
      <div class="ficha__list">${list.map((p) => `<button class="ficha__opt${f.profession === p.name ? ' is-on' : ''}" data-prof="${esc(p.name)}"><span class="ficha__optic">${icon(profStyle(p.name).icon || ARCHETYPES[p.arch]?.entity.icon || 'briefcase', 18)}</span><span><b>${esc(p.name)}</b><small>${esc(p.area)}</small></span></button>`).join('')}
        ${q && !list.some((p) => p.name.toLowerCase() === q.toLowerCase()) ? `<button class="ficha__opt ficha__opt--own" data-prof="${esc(q)}"><b>Usar “${esc(q)}”</b><small>Minha profissão não está na lista</small></button>` : ''}</div>
      ${f.profession ? `<div class="ficha__pick">${icon(profStyle(f.profession).icon || a.entity.icon || 'check', 20)} <div><b>${esc(f.profession)}</b><small>Sua agenda vai organizar por <b>${esc(a.entity.many.toLowerCase())}</b>, com: ${a.types.slice(0, 5).map((t) => esc(TYPE_DEFS[t].label)).join(', ')}…</small></div></div>` : ''}
      <div class="row2"><div><label class="flabel" for="fi-role">Cargo ou função (opcional)</label><input id="fi-role" class="input" data-f="role" value="${esc(f.role)}" placeholder="Ex.: Sargento, Residente" maxlength="40"></div>
      <div><label class="flabel" for="fi-place">Onde trabalha (opcional)</label><input id="fi-place" class="input" data-f="workplace" value="${esc(f.workplace)}" maxlength="60"></div></div>${nav()}`;
    },
    rotina: () => `<h2>Sua rotina</h2><p class="ficha__sub">Para o Lembra só te chamar nos horários certos.</p>
      <label class="flabel">Como é a sua jornada?</label>
      <div class="ficha__cards">${JOURNEYS.map((j) => `<button class="ficha__card${f.journey === j.id ? ' is-on' : ''}" data-journey="${j.id}"><b>${esc(j.label)}</b><small>${esc(j.hint)}</small></button>`).join('')}</div>
      <div class="row2"><div><label class="flabel">Começo o trabalho</label><input class="input" type="time" data-f="workStart" value="${f.workStart}"></div><div><label class="flabel">Termino</label><input class="input" type="time" data-f="workEnd" value="${f.workEnd}"></div></div>
      <label class="flabel">Num dia normal, quantos compromissos de trabalho você tem?</label>
      <div class="ficha__chips">${VOLUMES.map((v) => `<button class="ficha__chip${f.volume === v.id ? ' is-on' : ''}" data-volume="${v.id}">${esc(v.label)}</button>`).join('')}</div>
      <label class="flabel">Dias em que trabalho</label>
      <div class="ficha__days">${WD.map((w, i) => `<button class="ficha__day${f.workDays.includes(i) ? ' is-on' : ''}" data-wd="${i}">${w}</button>`).join('')}</div>
      <div class="row3"><div><label class="flabel">Acordo</label><input class="input" type="time" data-f="wake" value="${f.wake}"></div><div><label class="flabel">Almoço</label><input class="input" type="time" data-f="lunch" value="${f.lunch}"></div><div><label class="flabel">Durmo</label><input class="input" type="time" data-f="sleep" value="${f.sleep}"></div></div>${nav()}`,
    dificuldades: () => `<h2>O que mais te atrapalha?</h2><p class="ficha__sub">Marque tudo o que acontece com você. Sem julgamento 😉</p>
      <div class="ficha__chips">${DIFFICULTIES.map((d) => `<button class="ficha__chip${f.difficulties.includes(d.id) ? ' is-on' : ''}" data-diff="${d.id}">${esc(d.label)}</button>`).join('')}</div>
      <p class="fhelp">Opções sobre saúde (ansiedade, sono) são opcionais e só servem para ajustar o ritmo das mensagens. Ficam só na sua conta.</p>
      <label class="flabel">Hoje, como você se lembra dos compromissos?</label>
      <div class="ficha__chips">${METHODS.map((m) => `<button class="ficha__chip${f.method === m.id ? ' is-on' : ''}" data-method="${m.id}">${esc(m.label)}</button>`).join('')}</div>
      <label class="flabel">O quanto você esquece as coisas?</label>
      <input class="ficha__range" type="range" min="1" max="5" step="1" data-f="forget" value="${f.forget}"><p class="ficha__rangev"><b>${FORGET[f.forget]}</b></p>
      <label class="flabel">Com quanta antecedência gosta de ser avisado(a)?</label>
      <div class="ficha__chips">${LEADS.map((l) => `<button class="ficha__chip${String(f.lead) === String(l.v) ? ' is-on' : ''}" data-lead="${l.v}">${l.l}</button>`).join('')}</div>${nav()}`,
    estilo: () => `<h2>Como o Lembra fala com você</h2><p class="ficha__sub">Quando você atrasar ou precisar de um empurrão.</p>
      <div class="ficha__cards ficha__cards--1">${TONES.map((t) => `<button class="ficha__card${f.tone === t.id ? ' is-on' : ''}" data-tone="${t.id}"><b>${esc(t.label)}</b><small>${esc(t.sample)}</small></button>`).join('')}</div>
      <label class="flabel">Mensagens de ânimo durante o dia</label>
      <div class="ficha__chips">${[['', 'O Lembra decide'], ['calma', 'Poucas'], ['normal', 'Equilibrado'], ['alta', 'Bastante']].map(([v, l]) => `<button class="ficha__chip${f.freq === v ? ' is-on' : ''}" data-freq="${v}">${l}</button>`).join('')}</div>
      <div class="list ficha__toggles">
        <label class="list__row"><span><b>Versículos e fé</b></span><input type="checkbox" class="switch" data-chk="faith" ${f.faith ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Lembrar de beber água</b></span><input type="checkbox" class="switch" data-chk="water" ${f.water ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Lembrar de comer</b></span><input type="checkbox" class="switch" data-chk="meals" ${f.meals ? 'checked' : ''}></label>
      </div>
      <label class="flabel">Seu principal objetivo</label>
      <div class="ficha__chips">${GOALS.map((g) => `<button class="ficha__chip${f.goal === g.id ? ' is-on' : ''}" data-goal="${g.id}">${esc(g.label)}</button>`).join('')}</div>${nav('Ver meu Lembra')}`,
    resumo: () => {
      const p = computePersona(f);
      const arch = archOf(f.profession);
      const a = ARCHETYPES[arch];
      return `<h2>Pronto, ${esc(f.nickname || f.name.split(' ')[0] || '')}! Este é o seu Lembra</h2>
      <div class="ficha__score"><div class="ficha__gauge" style="--v:${p.index}"><b>${p.index}</b><small>/100</small></div><div><b>Índice de esquecimento</b><small>Calculado pelas suas respostas. Quanto maior, mais o Lembra cuida de você.</small></div></div>
      <div class="ficha__box"><b>${icon('briefcase', 15)} Trabalho: ${esc(f.profession)}</b><p>Aba “${esc(a.entity.many)}” · compromissos: ${a.types.map((t) => esc(TYPE_DEFS[t].label)).join(', ')}.</p></div>
      <div class="ficha__box"><b>${icon('bell', 15)} Como o Lembra vai trabalhar para você</b><ul>${p.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>
      <label class="consent consent--ficha"><input type="checkbox" data-chk="consent" ${f.consent ? 'checked' : ''}><span class="consent__dot" aria-hidden="true">${icon('check', 14)}</span>
        <span>Li e concordo com os <a href="${pageUrl('termos')}" target="_blank" rel="noopener">Termos de Uso</a> e a <a href="${pageUrl('privacidade')}" target="_blank" rel="noopener">Política de Privacidade</a>, e autorizo o uso das respostas desta ficha — inclusive as opcionais sobre saúde e fé — só para personalizar o meu Lembra (LGPD, art. 11). Posso mudar ou apagar quando quiser.</span></label>
      ${nav('Começar a usar')}`;
    },
  };

  const render = () => {
    wrap.innerHTML = `<div class="ficha__inner">${!required ? `<button class="ficha__x" data-quit aria-label="Fechar">${icon('x', 20)}</button>` : ''}${step > 0 ? prog() : ''}<div class="ficha__step">${views[STEPS[step]]()}</div></div>`;
    bind();
    wrap.scrollTop = 0;
  };
  const validate = () => {
    const s = STEPS[step];
    if (s === 'voce') {
      if (f.name.trim().split(/\s+/).length < 2) return 'Escreva seu nome completo (nome e sobrenome).';
      const age = ageOf(f.birth);
      if (age === null || age > 110) return 'Informe uma data de nascimento válida.';
      if (age < 13) return 'O Lembra é para maiores de 13 anos (menores de 18 com autorização dos responsáveis).';
      if (!validCPF(f.cpf)) return 'CPF inválido. Confira os números.';
    }
    if (s === 'trabalho' && !f.profession.trim()) return 'Escolha ou escreva a sua profissão.';
    if (s === 'rotina' && !f.workDays.length) return 'Marque pelo menos um dia de trabalho.';
    if (s === 'resumo' && !f.consent) return 'Para continuar, marque a bolinha de concordância com os Termos e a Política de Privacidade.';
    return '';
  };
  const bind = () => {
    const $ = (sel) => wrap.querySelectorAll(sel);
    $('[data-f]').forEach((el) => (el.oninput = () => {
      const k = el.dataset.f;
      // corrigiu o campo: some o aviso de erro
      if (err) { err = ''; const e = wrap.querySelector('.ficha__err'); if (e) e.hidden = true; }
      if (k === 'cpf') { el.value = maskCPF(el.value); f.cpf = el.value.replace(/\D/g, ''); }
      else if (k === 'forget') { f.forget = +el.value; wrap.querySelector('.ficha__rangev b').textContent = FORGET[f.forget]; }
      else f[k] = el.value;
    }));
    const qi = wrap.querySelector('[data-q]');
    if (qi) qi.oninput = () => { q = qi.value; const pos = qi.selectionStart; render(); const n = wrap.querySelector('[data-q]'); n.focus(); n.setSelectionRange(pos, pos); };
    $('[data-prof]').forEach((b) => (b.onclick = () => { f.profession = b.dataset.prof.trim().slice(0, 80); q = ''; render(); }));
    $('[data-journey]').forEach((b) => (b.onclick = () => {
      f.journey = b.dataset.journey;
      if (f.journey === 'plantao') { f.workStart = '07:00'; f.workEnd = '19:00'; }
      render();
    }));
    $('[data-wd]').forEach((b) => (b.onclick = () => { const d = +b.dataset.wd; f.workDays = f.workDays.includes(d) ? f.workDays.filter((x) => x !== d) : [...f.workDays, d].sort(); render(); }));
    $('[data-diff]').forEach((b) => (b.onclick = () => { const d = b.dataset.diff; f.difficulties = f.difficulties.includes(d) ? f.difficulties.filter((x) => x !== d) : [...f.difficulties, d]; b.classList.toggle('is-on'); }));
    $('[data-lead]').forEach((b) => (b.onclick = () => { f.lead = b.dataset.lead === '' ? '' : +b.dataset.lead; render(); }));
    $('[data-tone]').forEach((b) => (b.onclick = () => { f.tone = b.dataset.tone; render(); }));
    // escolhas de uma opção só (sem redesenhar a tela inteira: não perde o que está digitado)
    for (const k of ['pronoun', 'volume', 'method']) $(`[data-${k}]`).forEach((b) => (b.onclick = () => { f[k] = b.dataset[k]; $(`[data-${k}]`).forEach((x) => x.classList.toggle('is-on', x === b)); }));
    $('[data-freq]').forEach((b) => (b.onclick = () => { f.freq = b.dataset.freq; render(); }));
    $('[data-goal]').forEach((b) => (b.onclick = () => { f.goal = b.dataset.goal; render(); }));
    $('[data-chk]').forEach((c) => (c.onchange = () => { f[c.dataset.chk] = c.checked; }));
    const back = wrap.querySelector('[data-back]');
    if (back) back.onclick = () => { err = ''; step--; render(); };
    $('[data-quit]').forEach((b) => (b.onclick = () => close()));
    wrap.querySelector('[data-next]').onclick = async () => {
      err = validate();
      if (err) return render();
      if (step < STEPS.length - 1) { step++; render(); return; }
      const btn = wrap.querySelector('[data-next]');
      btn.disabled = true; btn.textContent = 'Preparando…';
      const arch = archOf(f.profession);
      const area = PROFESSIONS.find((p) => p.name === f.profession)?.area || 'Outra';
      try { await onDone({ ...f, arch, area, persona: computePersona(f) }); close(true); }
      catch (e) { btn.disabled = false; btn.textContent = 'Começar a usar'; err = 'Não consegui salvar agora. Verifique a internet e tente de novo.'; render(); }
    };
  };
  const close = (done = false) => { wrap.classList.remove('is-open'); setTimeout(() => wrap.remove(), 250); if (!done && onClose) onClose(); };
  render();
  return { close };
}

/* ---------- salvar e quando pedir a ficha ---------- */
const KEYS = ['name', 'nickname', 'pronoun', 'birth', 'cpf', 'phone', 'profession', 'area', 'arch', 'role', 'workplace', 'journey', 'volume', 'method', 'workStart', 'workEnd', 'workDays',
  'wake', 'sleep', 'lunch', 'difficulties', 'forget', 'lead', 'tone', 'freq', 'faith', 'water', 'meals', 'goal'];

/* A ficha vira: perfil da conta + perfil de trabalho do espaço + lembretes da pessoa + mensagens do Pessoal */
export async function saveFicha(r) {
  const now = Date.now();
  const p = r.persona;
  const data = {};
  KEYS.forEach((k) => (data[k] = typeof r[k] === 'string' ? r[k].trim() : r[k]));
  Object.assign(data, { index: p.index, consentAt: store.profile?.consentAt || now, fichaConsentAt: now, termsVersion: CONFIG.termsVersion || '1.0', onboardedAt: store.profile?.onboardedAt || now, fichaAt: now });
  await saveUserProfile(data);
  // espaço próprio: a profissão muda os nomes e os tipos de compromisso; a rotina vira o expediente
  if (store.solo && store.workspace === store.user?.uid) {
    store.upsert('settings', { id: 'workprofile', arch: r.arch, profession: r.profession });
    const { updatedAt, updatedBy, createdAt, createdBy, ...cur } = routine();
    store.upsert('settings', { ...cur, ...p.routine, id: 'routine' });
  }
  if (store.me) store.upsert('settings', { id: `persona-${store.me}`, offsets: p.offsets, lateEvery: p.lateEvery, lateMax: p.lateMax, tone: p.tone, index: p.index });
  savePrefs(p.nudges);
}
const initialFicha = () => {
  const pr = store.profile || {};
  const me = store.member(store.me);
  return { ...pr, name: pr.name || store.user?.displayName || me?.name || '', consent: !!pr.fichaConsentAt };
};
const waitIntro = () => new Promise((res) => {
  const t0 = Date.now();
  const t = () => (document.documentElement.classList.contains('intro-done') || Date.now() - t0 > 9000 ? res() : setTimeout(t, 250));
  t();
});
export const fichaDone = () => !!store.profile?.onboardedAt;

/* Conta própria: a ficha é obrigatória antes de usar. Dupla: oferecida uma vez. */
export async function ensureFicha() {
  if (store.mode !== 'cloud' || fichaDone()) return;
  const key = `lembra.fichaOffer.${store.user?.uid || 'x'}`;
  if (!store.solo) { try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch { return; } }
  await waitIntro();
  return new Promise((resolve) => openFicha({
    initial: initialFicha(),
    required: store.solo,
    onDone: async (r) => { await saveFicha(r); resolve(true); },
    onClose: () => resolve(false),
  }));
}
/* Ajustes → Sua ficha */
export function editFicha() {
  return openFicha({
    initial: initialFicha(),
    required: false,
    onDone: async (r) => { await saveFicha(r); toast('Ficha atualizada. O Lembra recalculou tudo para você ✓', { ms: 4000 }); },
  });
}
