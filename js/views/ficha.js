/* Ficha de cadastro do Lembra: conhece a pessoa para o app trabalhar para ela.
   Etapas: boas-vindas → você → trabalho → rotina → dificuldades → estilo → resumo calculado. */
import { brand } from '../brand.js';
import { icon } from '../icons.js';
import { esc } from '../utils.js';
import { PROFESSIONS, ARCHETYPES, TYPE_DEFS, archOf, searchProfessions, profStyle, professionFor } from '../../functions/catalog.js';
import { DIFFICULTIES, JOURNEYS, GOALS, TONES, METHODS, VOLUMES, PRONOUNS, GENDERS, computePersona, validCPF, maskCPF, maskPhone, validPhone, tidyName, validNameChars, ageOf, g } from '../persona.js';
import { store, saveUserProfile } from '../store.js';
import { savePrefs } from '../personal.js';
import { routine } from '../planner.js';
import { toast } from '../components.js';
import { rise, tick } from '../sound.js';
import { burst } from '../reward.js';
import { CONFIG } from '../../config.js';
import { pickField, openPicker } from '../picker.js';
import { roleHint } from '../roles.js';

/* páginas oficiais (Termos e Privacidade) */
const pageUrl = (name) => `${/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || !CONFIG.siteUrl ? location.pathname.replace(/[^/]*$/, '') : CONFIG.siteUrl.replace(/\/?$/, '/')}${name}/`;

const WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const FORGET = ['', 'Quase nunca esqueço', 'Esqueço às vezes', 'Esqueço com frequência', 'Esqueço muito', 'Esqueço quase tudo'];
const LEADS = [{ v: '', l: 'O Lembra calcula' }, { v: 15, l: '15 min' }, { v: 30, l: '30 min' }, { v: 60, l: '1 hora' }, { v: 120, l: '2 horas' }, { v: 1440, l: '1 dia' }];
const STEPS = ['inicio', 'voce', 'trabalho', 'rotina', 'dificuldades', 'estilo', 'mente', 'resumo'];
/* "Você por dentro": como apps de afirmações (I am, Mantra) estudam a pessoa no começo — aqui para o amigo do Lembra falar do jeito certo */
const MOOD = { motivation: [['baixa', 'Baixa'], ['media', 'Mais ou menos'], ['alta', 'Alta']], selfesteem: [['baixa', 'Baixa'], ['oscila', 'Oscila'], ['boa', 'Boa']], anxiety: [['muita', 'Muito'], ['as_vezes', 'Às vezes'], ['pouca', 'Pouco']] };
const TRAITS = [['ansioso', ''], ['impulsivo', 'Impulsivo(a)'], ['perfeccionista', 'Perfeccionista'], ['procrastinador', 'Deixo tudo pra depois'], ['organizado', 'Organizado(a)'], ['sensivel', 'Sensível'], ['competitivo', 'Competitivo(a)'], ['sonhador', 'Sonhador(a)'], ['pratico', 'Prático(a)']].filter(([, l]) => l);
const FOCUS = [['autoestima', 'Autoestima'], ['ansiedade', 'Ansiedade'], ['foco', 'Foco'], ['disciplina', 'Disciplina'], ['relacionamentos', 'Relacionamentos'], ['saude', 'Saúde e corpo'], ['dinheiro', 'Dinheiro'], ['gratidao', 'Gratidão'], ['descanso', 'Descanso e sono']];
export const LIKES = [['leitura', 'Ler'], ['esporte', 'Esporte / academia'], ['corrida', 'Correr / caminhar'], ['musica', 'Música'], ['cozinhar', 'Cozinhar'], ['series', 'Filmes e séries'], ['games', 'Games'], ['natureza', 'Natureza / ar livre'], ['viagem', 'Viajar'], ['arte', 'Arte / desenho'], ['danca', 'Dançar'], ['pets', 'Pets'], ['moda', 'Moda e beleza'], ['estudar', 'Aprender coisas novas'], ['amigos', 'Sair com amigos'], ['familia', 'Tempo com a família'], ['igreja', 'Igreja / comunidade'], ['meditacao', 'Meditação / yoga'], ['jardinagem', 'Plantas'], ['voluntariado', 'Ajudar os outros']];
const RELIGIONS = [['catolica', 'Católica'], ['evangelica', 'Evangélica'], ['protestante', 'Protestante'], ['crista', 'Cristã (sem denominação)'], ['adventista', 'Adventista'], ['testemunha', 'Testemunha de Jeová'], ['ortodoxa', 'Cristã ortodoxa'], ['sud', 'Santos dos Últimos Dias'], ['espirita', 'Espírita'], ['umbanda', 'Umbanda'], ['candomble', 'Candomblé'], ['judaica', 'Judaica'], ['islamica', 'Islâmica'], ['budista', 'Budista'], ['hindu', 'Hinduísta'], ['espiritualizado', 'Espiritualizado(a), sem religião'], ['agnostico', 'Agnóstico(a)'], ['ateu', 'Ateu / ateia'], ['outra', 'Outra'], ['nao_dizer', 'Prefiro não dizer']];
const WATER = [[0, 'Não precisa'], [60, 'A cada 1h'], [90, 'A cada 1h30'], [120, 'A cada 2h'], [180, 'A cada 3h']];

export function openFicha({ initial = {}, onDone, onClose, required = true } = {}) {
  const f = {
    name: '', nickname: '', birth: '', cpf: '', phone: '', profession: '', role: '', workplace: '',
    pronoun: '', gender: '', volume: '', method: '',
    journey: 'comercial', workStart: '08:00', workEnd: '18:00', workDays: [1, 2, 3, 4, 5], wake: '06:30', sleep: '22:30', lunch: '12:00',
    difficulties: [], forget: 3, lead: '', tone: 'firme', freq: '', faith: false, water: true, meals: true, goal: 'lembrar', consent: false,
    motivationLevel: '', selfesteem: '', anxiety: '', traits: [], focus: [], likes: [], wantsMotivation: true, religion: '', perDay: 7, waterEvery: 180,
    ...initial,
  };
  let step = initial.onboardedAt ? 1 : 0, q = '', err = '', sub = 0, calcDone = false;
  // rascunho: se o app fechar ou recarregar no meio da ficha, ela continua de onde parou (fica só neste aparelho, até terminar)
  const DRAFT = `lembra.ficha.${store.user?.uid || 'x'}`;
  try { const d = JSON.parse(sessionStorage.getItem(DRAFT) || 'null'); if (d && d.f) { Object.assign(f, d.f); step = Math.min(d.step || 0, STEPS.length - 1); } } catch { /* ok */ }
  const saveDraft = () => { try { sessionStorage.setItem(DRAFT, JSON.stringify({ f, step })); } catch { /* ok */ } };
  const dropDraft = () => { try { sessionStorage.removeItem(DRAFT); } catch { /* ok */ } };
  const wrap = document.createElement('div');
  wrap.className = 'ficha';
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('is-open'));

  /* caixas de escolha: uma linha na tela; abrem a lista (única ou várias) */
  const PICK = {
    gender: { label: 'Você se identifica como', options: () => GENDERS.map((x) => ({ v: x.id, l: x.label })),
      after: (v) => { f.pronoun = GENDERS.find((x) => x.id === v)?.pronoun || 'n'; refreshField('pronoun'); } },
    pronoun: { label: 'O Lembra fala com você…', options: () => PRONOUNS.map((x) => ({ v: x.id, l: x.label, d: x.id === 'f' ? 'Ex.: “Pronta para hoje?”' : x.id === 'm' ? 'Ex.: “Pronto para hoje?”' : 'Ex.: “Tudo pronto para hoje?”' })) },
    journey: { label: 'Como é a sua jornada?', options: () => JOURNEYS.map((j) => ({ v: j.id, l: j.label, d: j.hint })),
      after: (v) => { if (v === 'plantao') { f.workStart = '07:00'; f.workEnd = '19:00'; const ws = wrap.querySelector('[data-f="workStart"]'), we = wrap.querySelector('[data-f="workEnd"]'); if (ws) ws.value = f.workStart; if (we) we.value = f.workEnd; } } },
    volume: { label: 'Quantos compromissos de trabalho num dia normal?', options: () => VOLUMES.map((v) => ({ v: v.id, l: v.label })) },
    difficulties: { label: 'O que acontece com você', title: 'O que mais te atrapalha?', multi: true, hint: 'Marque tudo o que acontece com você. Sem julgamento 😉', options: () => DIFFICULTIES.map((d) => ({ v: d.id, l: d.label })) },
    method: { label: 'Hoje, como você se lembra dos compromissos?', options: () => METHODS.map((m) => ({ v: m.id, l: m.label })) },
    lead: { label: 'Quanto tempo antes você quer o aviso?', options: () => LEADS.map((l) => ({ v: l.v, l: l.l })) },
    tone: { label: 'Quando você atrasar, o Lembra fala como…', options: () => TONES.map((t) => ({ v: t.id, l: t.label, d: t.sample })),
      after: (v) => { const smp = wrap.querySelector('.ficha__sample'); if (smp) smp.textContent = TONES.find((t) => t.id === v)?.sample || ''; } },
    goal: { label: 'Seu principal objetivo', options: () => GOALS.map((x) => ({ v: x.id, l: x.label })) },
    motivationLevel: { label: 'Como anda a sua motivação?', options: () => MOOD.motivation.map(([v, l]) => ({ v, l })) },
    selfesteem: { label: 'E a sua autoestima?', options: () => MOOD.selfesteem.map(([v, l]) => ({ v, l })) },
    anxiety: { label: 'Você se considera uma pessoa ansiosa?', options: () => MOOD.anxiety.map(([v, l]) => ({ v, l })) },
    traits: { label: 'Como você se descreve?', multi: true, options: () => TRAITS.map(([v, l]) => ({ v, l })) },
    focus: { label: 'O que você quer trabalhar em você?', multi: true, options: () => FOCUS.map(([v, l]) => ({ v, l })) },
    likes: { label: 'O que você curte fazer?', title: 'O que você curte fazer no tempo livre?', hint: 'Marque o que quiser: o “Feito pra você” sugere coisas do seu gosto.', multi: true, options: () => LIKES.map(([v, l]) => ({ v, l })) },
    religion: { label: 'Qual é a sua religião ou crença?', options: () => RELIGIONS.map(([v, l]) => ({ v, l })) },
    waterEvery: { label: 'Lembrar de beber água', options: () => WATER.map(([v, l]) => ({ v, l })) },
  };
  const field = (k) => pickField({ key: k, label: PICK[k].label, options: PICK[k].options(), value: f[k], multi: !!PICK[k].multi });
  const refreshField = (k) => { const box = wrap.querySelector(`[data-pkf="${k}"]`); if (box) { box.outerHTML = field(k); bindPick(); } };
  const bindPick = () => wrap.querySelectorAll('[data-pickf]').forEach((b) => (b.onclick = () => {
    const k = b.dataset.pickf, P = PICK[k];
    openPicker({ title: P.title || P.label, hint: P.hint || '', options: P.options(), multi: !!P.multi, value: f[k], onDone: (v) => {
      f[k] = v;
      if (P.after) P.after(v);
      if (err) { err = ''; const e = wrap.querySelector('.ficha__err'); if (e) e.hidden = true; }
      refreshField(k); saveDraft();
    } });
  }));
  const prog = () => `<div class="ficha__prog"><i style="width:${Math.round((step / (STEPS.length - 1)) * 100)}%"></i></div>`;
  const nav = (next = 'Continuar') => `<p class="ficha__err" ${err ? '' : 'hidden'}>${esc(err)}</p>
    <div class="ficha__nav">${step > 0 ? '<button class="btn btn--soft" data-back>Voltar</button>' : !required ? '<button class="btn-text" data-quit>Agora não</button>' : '<span></span>'}<button class="btn btn--primary" data-next>${next}</button></div>`;

  const listHtml = () => {
    const list = searchProfessions(q, 30);
    const own = q.trim() && !list.some((p) => p.name.toLowerCase() === q.trim().toLowerCase());
    return list.map((p) => `<button class="ficha__opt${f.profession === p.name ? ' is-on' : ''}" data-prof="${esc(p.name)}"><span class="ficha__optic">${icon(profStyle(p.name).icon || ARCHETYPES[p.arch]?.entity.icon || 'briefcase', 18)}</span><span><b>${esc(professionFor(p.name, f.pronoun))}</b><small>${esc(p.area)}</small></span></button>`).join('')
      + (own ? `<button class="ficha__opt ficha__opt--own" data-prof="${esc(q.trim())}"><span class="ficha__optic">${icon('plus', 18)}</span><span><b>Usar “${esc(q.trim())}”</b><small>Minha profissão não está na lista</small></span></button>` : '')
      || '<p class="fhelp" style="padding:12px 14px">Nada encontrado. Escreva sua profissão e toque em “Usar”.</p>';
  };
  const pickHtml = () => {
    if (!f.profession) return '';
    const a = ARCHETYPES[archOf(f.profession)];
    return `<div class="ficha__pick">${icon(profStyle(f.profession).icon || a.entity.icon || 'check', 20)} <div><b>${esc(professionFor(f.profession, f.pronoun))}</b><small>Sua agenda vai organizar por <b>${esc(a.entity.many.toLowerCase())}</b>, com: ${a.types.slice(0, 5).map((t) => esc(TYPE_DEFS[t].label)).join(', ')}…</small></div></div>`;
  };
  const views = {
    inicio: () => `<div class="ficha__hero">
        <div class="brandwrap">${brand('completa', { h: 118 })}</div>
        <h1>Vamos montar o seu Lembra</h1>
        <p>Em 2 minutos o app aprende como é o seu trabalho, a sua rotina e o que costuma escapar da sua cabeça. Com isso ele calcula <b>quantos avisos</b> você precisa, <b>quando</b> te mandar mensagens e <b>como</b> falar com você.</p>
        <ul class="ficha__bul">
          <li>${icon('briefcase', 16)} Agenda de trabalho com a cara da sua profissão</li>
          <li>${icon('bell', 16)} Lembretes calculados para você</li>
          <li>${icon('heart', 16)} Um modo Pessoal só seu</li>
        </ul></div>${nav('Começar')}`,
    voce: () => `<h2>Sobre você</h2><p class="ficha__sub">Seus dados ficam guardados só na sua conta.</p>
      <label class="flabel" for="fi-name">Nome completo</label><input id="fi-name" class="input" data-f="name" value="${esc(f.name)}" autocomplete="name" maxlength="80">
      <label class="flabel" for="fi-nick">Como prefere que o Lembra te chame?</label><input id="fi-nick" class="input" data-f="nickname" value="${esc(f.nickname)}" maxlength="30" placeholder="Ex.: Rafa" autocomplete="nickname">
      <div class="row2"><div><label class="flabel" for="fi-birth">Nascimento</label><input id="fi-birth" class="input" type="date" data-f="birth" value="${esc(f.birth)}" min="1900-01-01" max="${new Date().toISOString().slice(0, 10)}" autocomplete="bday"></div>
      <div><label class="flabel" for="fi-cpf">CPF</label><input id="fi-cpf" class="input" inputmode="numeric" data-f="cpf" value="${esc(maskCPF(f.cpf))}" placeholder="000.000.000-00" maxlength="20" autocomplete="off"></div></div>
      <div class="row2">${field('gender')}${field('pronoun')}</div>
      <p class="fhelp">Isso muda o jeito de falar (pronta, pronto ou “tudo pronto”) e as sugestões do seu modo Pessoal. Ninguém mais vê.</p>
      <label class="flabel" for="fi-phone">Celular (opcional)</label><input id="fi-phone" class="input" type="tel" inputmode="tel" data-f="phone" value="${esc(maskPhone(f.phone))}" placeholder="(00) 00000-0000" maxlength="20" autocomplete="tel-national">
      <p class="fhelp">O CPF serve só para identificar sua conta e garantir um teste grátis por pessoa. Ele não aparece para ninguém.</p>${nav()}`,
    trabalho: () => {
      return `<h2>Com o que você trabalha?</h2><p class="ficha__sub">O Lembra se adapta à sua profissão: nomes, tipos de compromisso, dicas e cobranças.</p>
      <div class="ficha__search">${icon('search', 18)}<input class="input" data-q type="search" enterkeyhint="done" placeholder="Busque: enfermeiro, professor, sargento…" value="${esc(q)}" autocomplete="off" autocorrect="off" spellcheck="false"></div>
      <div class="ficha__list" data-list>${listHtml()}</div>
      <div data-pick>${pickHtml()}</div>
      <label class="flabel" for="fi-role">Cargo ou função <small class="muted">(opcional)</small></label><input id="fi-role" class="input" data-f="role" value="${esc(f.role)}" placeholder="${esc(roleHint(f.profession))}" maxlength="40">
      <label class="flabel" for="fi-place">Onde trabalha <small class="muted">(opcional)</small></label><input id="fi-place" class="input" data-f="workplace" value="${esc(f.workplace)}" maxlength="60" placeholder="Ex.: nome da empresa, loja ou hospital">${nav()}`;
    },
    rotina: () => `<h2>Sua rotina</h2><p class="ficha__sub">Para o Lembra só te chamar nos horários certos.</p>
      ${field('journey')}
      <div class="row2"><div><label class="flabel">Começo o trabalho</label><input class="input" type="time" data-f="workStart" value="${f.workStart}"></div><div><label class="flabel">Termino</label><input class="input" type="time" data-f="workEnd" value="${f.workEnd}"></div></div>
      ${field('volume')}
      <label class="flabel">Dias em que trabalho</label>
      <div class="ficha__days">${WD.map((w, i) => `<button class="ficha__day${f.workDays.includes(i) ? ' is-on' : ''}" data-wd="${i}">${w}</button>`).join('')}</div>
      <div class="row3"><div><label class="flabel">Acordo</label><input class="input" type="time" data-f="wake" value="${f.wake}"></div><div><label class="flabel">Almoço</label><input class="input" type="time" data-f="lunch" value="${f.lunch}"></div><div><label class="flabel">Durmo</label><input class="input" type="time" data-f="sleep" value="${f.sleep}"></div></div>${nav()}`,
    dificuldades: () => `<h2>O que mais te atrapalha?</h2><p class="ficha__sub">Marque tudo o que acontece com você. Sem julgamento 😉</p>
      ${field('difficulties')}
      <p class="fhelp">Opções sobre saúde (ansiedade, sono) são opcionais e só servem para ajustar o ritmo das mensagens. Ficam só na sua conta.</p>
      ${field('method')}
      <label class="flabel">O quanto você esquece as coisas?</label>
      <input class="ficha__range" type="range" min="1" max="5" step="1" data-f="forget" value="${f.forget}"><p class="ficha__rangev"><b>${FORGET[f.forget]}</b></p>
      ${field('lead')}${nav()}`,
    estilo: () => `<h2>Como o Lembra fala com você</h2><p class="ficha__sub">Quando você atrasar ou precisar de um empurrão.</p>
      ${field('tone')}
      <p class="ficha__sample">${esc(TONES.find((t) => t.id === f.tone)?.sample || '')}</p>
      <div class="list ficha__toggles">
        <label class="list__row"><span><b>Lembrar de comer</b><small>almoço e jantar</small></span><input type="checkbox" class="switch" data-chk="meals" ${f.meals ? 'checked' : ''}></label>
      </div>
      ${field('goal')}${nav()}`,
    mente: () => {
      return `<h2>Você por dentro</h2><p class="ficha__sub">Para o Lembra falar com você como um amigo que te conhece — e não mandar a mesma coisa que manda para todo mundo. Fica só na sua conta.</p>
      ${field('motivationLevel')}${field('selfesteem')}${field('anxiety')}
      ${field('traits')}${field('focus')}${field('likes')}
      <div class="list ficha__toggles">
        <label class="list__row"><span><b>Mensagens de motivação</b><small>frases de ânimo do seu jeito</small></span><input type="checkbox" class="switch" data-chk="wantsMotivation" ${f.wantsMotivation ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Mensagens de fé</b><small>da sua religião, se você tiver</small></span><input type="checkbox" class="switch" data-chk="faith" data-rerender ${f.faith ? 'checked' : ''}></label>
      </div>
      ${f.faith ? field('religion') : ''}
      <label class="flabel">Quantas mensagens do amigo do Lembra por dia?</label>
      <input class="ficha__range" type="range" min="3" max="15" step="1" data-f="perDay" value="${f.perDay}"><p class="ficha__rangev"><b data-perday>${f.perDay} por dia</b> <small>(fora os lembretes da sua agenda)</small></p>
      ${field('waterEvery')}
      ${nav('Ver meu Lembra')}`;
    },
    resumo: () => {
      const pages = conquests();
      const nick = esc(f.nickname || f.name.split(' ')[0] || '');
      // 1) o cálculo: o círculo sobe de 0 a 100% (vermelho → verde) com som crescendo
      if (sub === 0) return `<div class="rv rv--calc">
        <div class="rgauge" data-rgauge><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="rgauge__bg" cx="60" cy="60" r="52"/><circle class="rgauge__fg" data-arc cx="60" cy="60" r="52"/></svg>
          <div class="rgauge__num"><b data-num>${calcDone ? 100 : 0}</b><small>%</small></div></div>
        <h2 data-rtitle>${calcDone ? `${g('Pronto', 'Pronta', 'Tudo pronto', f.pronoun)}, ${nick}! Seu Lembra está montado` : 'Montando o seu Lembra…'}</h2>
        <p class="rv__sub" data-rsub>${calcDone ? `Veja o que ele vai fazer por você, passo a passo.` : 'Lendo as suas respostas'}</p>
        <div class="rv__chips" data-rchips ${calcDone ? '' : 'hidden'}><span>${icon('sparkles', 14)} Nível de cuidado <b>${computePersona(f).index}/100</b></span><span>${icon('bell', 14)} ${pages.length} coisas feitas para você</span></div>
      </div>${nav('Ver o que ele faz por mim')}`;
      // 2) uma conquista por página
      if (sub <= pages.length) {
        const c = pages[sub - 1];
        return `<div class="rv rv--card" style="--c:${c.c}">
          <span class="rv__ic">${icon(c.ic, 34)}</span>
          <small class="rv__k">${sub} de ${pages.length} · ${esc(c.k)}</small>
          <h2>${esc(c.title)}</h2>
          ${c.big ? `<div class="rv__big">${esc(c.big)}</div>` : ''}
          <p>${esc(c.text)}</p>
          <div class="rv__dots">${pages.map((_, i) => `<i class="${i === sub - 1 ? 'is-on' : i < sub - 1 ? 'is-done' : ''}"></i>`).join('')}</div>
        </div>${nav(sub === pages.length ? 'Quero começar' : 'Próximo')}`;
      }
      // 3) último passo: concordância
      return `<div class="rv rv--card" style="--c:#34C759"><span class="rv__ic">${icon('check', 34)}</span><small class="rv__k">Último passo</small>
        <h2>${g('Tudo certo', 'Tudo certo', 'Tudo certo', f.pronoun)}, ${nick}. Bora começar?</h2>
        <p>Seu Lembra já está calculado. Só falta você concordar com as regras de uso dos seus dados.</p></div>
      <label class="consent consent--ficha"><input type="checkbox" data-chk="consent" ${f.consent ? 'checked' : ''}><span class="consent__dot" aria-hidden="true">${icon('check', 14)}</span>
        <span>Li e concordo com os <a href="${pageUrl('termos')}" target="_blank" rel="noopener">Termos de Uso</a> e a <a href="${pageUrl('privacidade')}" target="_blank" rel="noopener">Política de Privacidade</a>, e autorizo o uso das respostas desta ficha — inclusive as opcionais sobre saúde e fé — só para personalizar o meu Lembra (LGPD, art. 11). Posso mudar ou apagar quando quiser.</span></label>
      ${nav('Começar a usar')}`;
    },
  };

  /* Cada coisa que o Lembra vai fazer, calculada pela ficha (uma página para cada) */
  const conquests = () => {
    const p = computePersona(f);
    const a = ARCHETYPES[archOf(f.profession)];
    const off = (o) => (o >= 1440 ? `${Math.round(o / 1440)} dia antes` : o >= 60 ? `${o / 60}h antes` : `${o} min antes`);
    const hhmm = (t) => String(t || '').replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
    const dur = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}` : `${m} min`);
    const tone = TONES.find((t) => t.id === p.tone)?.label || 'Coach firme';
    const method = METHODS.find((m) => m.id === f.method);
    const vol = VOLUMES.find((v) => v.id === f.volume);
    const jour = JOURNEYS.find((j) => j.id === f.journey) || JOURNEYS[0];
    const list = [
      { k: 'Trabalho', ic: profStyle(f.profession).icon || a.entity.icon || 'briefcase', c: '#0A84FF', title: `Uma agenda com a cara de ${professionFor(f.profession, f.pronoun)}`, big: `${a.types.length} tipos de compromisso`, text: `Aba “${a.entity.many}” e os compromissos do seu dia a dia: ${a.types.map((t) => TYPE_DEFS[t].label).join(', ')}.` },
      { k: 'Avisos', ic: 'bell', c: '#FF9500', title: `${p.offsets.length + 1} avisos para cada compromisso`, big: p.offsets.map(off).join(' · '), text: `E uma pergunta na hora exata. Calculado pelo seu nível de cuidado (${p.index}/100): quanto mais você esquece, mais o Lembra te protege.` },
    ];
    if (method && method.w) list.push({ k: 'Cabeça leve', ic: 'sparkles', c: '#AF52DE', title: 'Você não precisa mais guardar tudo de cabeça', big: '', text: `Hoje você lembra ${method.id === 'cabeca' ? 'de cabeça' : method.id === 'outros' ? 'porque alguém te lembra' : 'no papel'}. A partir de agora esse trabalho é do Lembra.` });
    list.push(
      { k: 'Atrasos', ic: 'clock', c: '#FF3B30', title: 'Atrasou? A gente te puxa', big: `a cada ${p.lateEvery} min · até ${dur(p.lateMax)}`, text: `No tom “${tone}”, até você marcar como feito. Nunca de madrugada.` },
      { k: 'Seu ritmo', ic: 'moon', c: '#5856D6', title: `Mensagens só entre ${hhmm(p.nudges.wake)} e ${hhmm(p.nudges.sleep)}`, big: '', text: `${p.nudges.freq === 'alta' ? 'Com bastante frequência' : p.nudges.freq === 'calma' ? 'Com calma, sem excesso' : 'Num ritmo equilibrado'}${p.nudges.water ? ', lembrete de beber água' : ''}${p.nudges.meals ? ` e de comer perto das ${hhmm(p.nudges.lunch)}` : ''}. No seu horário de acordar e dormir.` },
      { k: 'Pessoal', ic: 'heart', c: '#FF2D55', title: 'Um modo Pessoal só seu', big: '', text: 'Aniversários, consultas, contas e listas — com sugestões feitas para a sua idade e o seu jeito. Ninguém mais vê.' },
      { k: 'Equilíbrio', ic: 'target', c: '#34C759', title: `Até ${vol ? vol.max : jour.max} compromissos por dia`, big: '', text: `Jornada “${jour.label}”: quando passar disso, o Lembra avisa para você não se sobrecarregar.` },
    );
    return list;
  };

  /* Animação do cálculo: 0 → 100% em ~2 s, cor do vermelho ao verde, número subindo, som crescendo e comemoração */
  const runCalc = () => {
    const el = wrap.querySelector('[data-rgauge]');
    if (!el || calcDone) return;
    const arc = el.querySelector('[data-arc]'), num = el.querySelector('[data-num]');
    const next = wrap.querySelector('[data-next]');
    const sub0 = wrap.querySelector('[data-rsub]');
    const L = 2 * Math.PI * 52;
    arc.style.strokeDasharray = `${L}`;
    const MS = matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 2100;
    const msgs = ['Lendo as suas respostas', 'Calculando seus avisos', 'Ajustando o tom das mensagens', 'Montando a sua agenda', 'Quase pronto…'];
    if (next) next.disabled = true;
    rise(MS);
    const t0 = performance.now();
    const frame = (now) => {
      if (!el.isConnected) return;
      const t = Math.min(1, (now - t0) / MS);
      const p = 1 - Math.pow(1 - t, 3);
      const v = Math.round(p * 100);
      arc.style.strokeDashoffset = `${L * (1 - p)}`;
      arc.style.stroke = `hsl(${Math.round(p * 135)} 78% ${48 - p * 6}%)`;
      num.textContent = v;
      if (sub0) sub0.textContent = msgs[Math.min(msgs.length - 1, Math.floor(p * msgs.length))];
      if (t < 1) return requestAnimationFrame(frame);
      calcDone = true;
      el.classList.add('is-done');
      try { navigator.vibrate && navigator.vibrate([14, 50, 20]); } catch { /* ok */ }
      burst(el, { big: true });
      const nick = esc(f.nickname || f.name.split(' ')[0] || '');
      wrap.querySelector('[data-rtitle]').innerHTML = `${g('Pronto', 'Pronta', 'Tudo pronto', f.pronoun)}, ${nick}! Seu Lembra está montado`;
      if (sub0) sub0.textContent = 'Veja o que ele vai fazer por você, passo a passo.';
      const chips = wrap.querySelector('[data-rchips]'); if (chips) chips.hidden = false;
      if (next) next.disabled = false;
    };
    requestAnimationFrame(frame);
  };

  // desenha a ETAPA inteira só quando muda de etapa; dentro dela, cada toque atualiza só o que mudou (sem piscar)
  let shownStep = '';
  const render = () => {
    const key = `${step}.${STEPS[step] === 'resumo' ? sub : 0}`;
    if (STEPS[step] === 'trabalho' && shownStep !== key) q = f.profession || '';
    wrap.innerHTML = `<div class="ficha__inner${STEPS[step] === 'resumo' ? ' ficha__inner--rv' : ''}">${!required ? `<button class="ficha__x" data-quit aria-label="Fechar">${icon('x', 20)}</button>` : ''}${step > 0 ? prog() : ''}<div class="ficha__step${shownStep !== key ? ' is-new' : ''}">${views[STEPS[step]]()}</div></div>`;
    bind();
    saveDraft();
    if (shownStep !== key) wrap.scrollTop = 0;
    shownStep = key;
    if (STEPS[step] === 'resumo' && sub === 0) runCalc();
  };
  const showErr = () => {
    const e = wrap.querySelector('.ficha__err');
    if (!e) return render();
    e.textContent = err; e.hidden = !err;
    if (err) {
      e.scrollIntoView({ block: 'center', behavior: 'smooth' });
      // o Lembra fala o erro (o texto continua no campo para leitores de tela)
      import('../mascote.js').then((M) => M.fala && M.fala(M.linhaDeErro(err))).catch(() => {});
    }
  };
  const pickOne = (attr, value, set) => {
    set(value);
    wrap.querySelectorAll(`[data-${attr}]`).forEach((x) => x.classList.toggle('is-on', x.dataset[attr] === String(value)));
  };
  const validate = () => {
    const s = STEPS[step];
    if (s === 'voce') {
      f.name = tidyName(f.name);
      const nm = wrap.querySelector('[data-f="name"]'); if (nm) nm.value = f.name;
      if (!f.name) return 'Escreva seu nome completo.';
      if (!validNameChars(f.name)) return 'O nome deve ter só letras (sem números, emojis ou símbolos).';
      if (f.name.split(' ').filter((w) => w.replace(/[^\p{L}]/gu, '').length >= 2).length < 2) return 'Escreva seu nome completo (nome e sobrenome).';
      f.nickname = f.nickname.replace(/\s+/g, ' ').trim();
      if (f.nickname && !/\p{L}/u.test(f.nickname)) return 'O apelido precisa ter pelo menos uma letra.';
      if (!f.birth) return 'Informe a sua data de nascimento.';
      const age = ageOf(f.birth);
      if (age === null || age > 110 || f.birth > new Date().toISOString().slice(0, 10)) return 'Data de nascimento inválida. Confira o dia, o mês e o ano.';
      if (age < 13) return 'O Lembra é para maiores de 13 anos (menores de 18 com autorização dos responsáveis).';
      if (!validCPF(f.cpf)) return 'CPF inválido. Confira os números.';
      if (!f.gender) return 'Escolha como você se identifica (pode ser “Prefiro não dizer”).';
      if (!f.pronoun) return 'Escolha como o Lembra fala com você.';
      if (!validPhone(f.phone)) return 'Celular inválido. Use DDD + número, ex.: (11) 98765-4321 — ou deixe em branco.';
    }
    if (s === 'trabalho') {
      f.profession = f.profession.replace(/\s+/g, ' ').trim();
      if (!f.profession) return 'Escolha ou escreva a sua profissão.';
      if (!/\p{L}{2}/u.test(f.profession)) return 'Escreva o nome da profissão com letras.';
    }
    if (s === 'rotina') {
      const t = /^\d{2}:\d{2}$/;
      if (![f.workStart, f.workEnd, f.wake, f.sleep, f.lunch].every((x) => t.test(x || ''))) return 'Preencha todos os horários (trabalho, acordar, almoço e dormir).';
      if (f.workStart === f.workEnd && f.journey !== 'plantao') return 'O horário de começo e de término do trabalho não podem ser iguais.';
      if (f.wake === f.sleep) return 'O horário de acordar e de dormir não podem ser iguais.';
      if (!f.workDays.length) return 'Marque pelo menos um dia de trabalho.';
    }
    if (s === 'resumo' && sub > conquests().length && !f.consent) return 'Para continuar, marque a bolinha de concordância com os Termos e a Política de Privacidade.';
    return '';
  };
  const bind = () => {
    const $ = (sel) => wrap.querySelectorAll(sel);
    bindPick();
    $('[data-f]').forEach((el) => (el.oninput = () => {
      const k = el.dataset.f;
      // corrigiu o campo: some o aviso de erro
      if (err) { err = ''; const e = wrap.querySelector('.ficha__err'); if (e) e.hidden = true; }
      if (k === 'cpf') { el.value = maskCPF(el.value); f.cpf = el.value.replace(/\D/g, ''); }
      else if (k === 'phone') { el.value = maskPhone(el.value); f.phone = el.value; }
      else if (k === 'forget') { f.forget = +el.value; wrap.querySelector('.ficha__rangev b').textContent = FORGET[f.forget]; }
      else if (k === 'perDay') { f.perDay = +el.value; wrap.querySelector('[data-perday]').textContent = `${f.perDay} por dia`; }
      else f[k] = el.value;
    }));
    const qi = wrap.querySelector('[data-q]');
    const listEl = wrap.querySelector('[data-list]');
    const bindProfs = () => listEl.querySelectorAll('[data-prof]').forEach((b) => (b.onclick = () => {
      f.profession = b.dataset.prof.trim().slice(0, 80);
      q = f.profession; qi.value = f.profession; qi.blur();
      if (err) { err = ''; showErr(); }
      listEl.innerHTML = listHtml(); bindProfs();
      wrap.querySelector('[data-pick]').innerHTML = pickHtml();
      const role = wrap.querySelector('#fi-role'); if (role) role.placeholder = roleHint(f.profession);
    }));
    if (qi) {
      qi.oninput = () => { q = qi.value; listEl.innerHTML = listHtml(); listEl.scrollTop = 0; bindProfs(); };
      qi.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); qi.blur(); } };
      bindProfs();
    }
    $('[data-journey]').forEach((b) => (b.onclick = () => pickOne('journey', b.dataset.journey, (v) => {
      f.journey = v;
      if (v === 'plantao') {
        f.workStart = '07:00'; f.workEnd = '19:00';
        const ws = wrap.querySelector('[data-f="workStart"]'), we = wrap.querySelector('[data-f="workEnd"]');
        if (ws) ws.value = f.workStart; if (we) we.value = f.workEnd;
      }
    })));
    $('[data-wd]').forEach((b) => (b.onclick = () => { const d = +b.dataset.wd; f.workDays = f.workDays.includes(d) ? f.workDays.filter((x) => x !== d) : [...f.workDays, d].sort(); b.classList.toggle('is-on', f.workDays.includes(d)); }));
    $('[data-diff]').forEach((b) => (b.onclick = () => { const d = b.dataset.diff; f.difficulties = f.difficulties.includes(d) ? f.difficulties.filter((x) => x !== d) : [...f.difficulties, d]; b.classList.toggle('is-on'); }));
    $('[data-lead]').forEach((b) => (b.onclick = () => pickOne('lead', b.dataset.lead, (v) => { f.lead = v === '' ? '' : +v; })));
    $('[data-tone]').forEach((b) => (b.onclick = () => pickOne('tone', b.dataset.tone, (v) => { f.tone = v; })));
    // escolhas de uma opção só (sem redesenhar a tela inteira: não perde o que está digitado)
    $('[data-gender]').forEach((b) => (b.onclick = () => {
      f.gender = b.dataset.gender;
      $('[data-gender]').forEach((x) => x.classList.toggle('is-on', x === b));
      const pr = GENDERS.find((x) => x.id === f.gender)?.pronoun || 'n';
      f.pronoun = pr;
      $('[data-pronoun]').forEach((x) => x.classList.toggle('is-on', x.dataset.pronoun === pr));
      if (err) { err = ''; showErr(); }
    }));
    for (const k of ['pronoun', 'volume', 'method']) $(`[data-${k}]`).forEach((b) => (b.onclick = () => { f[k] = b.dataset[k]; $(`[data-${k}]`).forEach((x) => x.classList.toggle('is-on', x === b)); }));
    $('[data-freq]').forEach((b) => (b.onclick = () => pickOne('freq', b.dataset.freq, (v) => { f.freq = v; })));
    $('[data-goal]').forEach((b) => (b.onclick = () => pickOne('goal', b.dataset.goal, (v) => { f.goal = v; })));
    $('[data-chk]').forEach((c) => (c.onchange = () => { f[c.dataset.chk] = c.checked; if (c.dataset.rerender !== undefined) { saveDraft(); render(); } }));
    $('[data-one]').forEach((b) => (b.onclick = () => { const k = b.dataset.one; f[k] = b.dataset.v; $(`[data-one="${k}"]`).forEach((x) => x.classList.toggle('is-on', x === b)); }));
    $('[data-many]').forEach((b) => (b.onclick = () => { const k = b.dataset.many, v = b.dataset.v; f[k] = f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]; b.classList.toggle('is-on', f[k].includes(v)); }));
    const back = wrap.querySelector('[data-back]');
    if (back) back.onclick = () => { err = ''; if (STEPS[step] === 'resumo' && sub > 0) { sub--; render(); return; } step--; sub = 0; calcDone = false; render(); };
    $('[data-quit]').forEach((b) => (b.onclick = () => close()));
    wrap.querySelector('[data-next]').onclick = async () => {
      err = validate();
      if (err) return showErr();
      if (step < STEPS.length - 1) { step++; sub = 0; calcDone = false; render(); return; }
      // resumo: cálculo → uma conquista por página → concordância
      if (sub <= conquests().length) { sub++; if (sub <= conquests().length) tick(sub); render(); return; }
      const btn = wrap.querySelector('[data-next]');
      btn.disabled = true; btn.textContent = 'Preparando…';
      const arch = archOf(f.profession);
      const area = PROFESSIONS.find((p) => p.name === f.profession)?.area || 'Outra';
      try { await onDone({ ...f, arch, area, persona: computePersona(f) }); dropDraft(); close(true); }
      catch (e) { btn.disabled = false; btn.textContent = 'Começar a usar'; err = 'Não consegui salvar agora. Verifique a internet e tente de novo.'; showErr(); }
    };
  };
  const close = (done = false) => { wrap.classList.remove('is-open'); setTimeout(() => wrap.remove(), 250); if (!done && onClose) onClose(); };
  render();
  return { close };
}

/* ---------- salvar e quando pedir a ficha ---------- */
const KEYS = ['name', 'nickname', 'pronoun', 'gender', 'birth', 'cpf', 'phone', 'profession', 'area', 'arch', 'role', 'workplace', 'journey', 'volume', 'method', 'workStart', 'workEnd', 'workDays',
  'wake', 'sleep', 'lunch', 'difficulties', 'forget', 'lead', 'tone', 'freq', 'faith', 'water', 'meals', 'goal',
  'motivationLevel', 'selfesteem', 'anxiety', 'traits', 'focus', 'likes', 'wantsMotivation', 'religion', 'perDay', 'waterEvery'];

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
