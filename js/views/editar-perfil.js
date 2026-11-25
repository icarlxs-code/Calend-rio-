/* Editar perfil completo: quem você é, contato, onde mora e time do coração.
   Só vão para o perfil dos amigos: nome, foto, frase, profissão/empresa e o que a pessoa ligar (cidade e idade).
   Telefone, e-mail, nascimento, bairro e time nunca aparecem para ninguém. */
import { store, saveMyProfile } from '../store.js';
import { openSheet, sheetHead, toast, avatar } from '../components.js';
import { icon } from '../icons.js';
import { esc } from '../utils.js';
import { maskPhone, validPhone, ageOf, PRONOUNS } from '../persona.js';
import { DDDS, meuId, trocaMeuId } from '../achar.js';
import { photoActions } from './profile.js';
import { achaTimes, porTime, boton, AVISO_TIME } from '../times.js';
import { api } from '../avisos.js';

const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
const lim = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
export const timeDe = (p = store.profile) => porTime(p?.teamId) || null;
export const sincTime = (p = store.profile) => (store.mode === 'cloud' ? api('/futebol', { ws: '', time: p?.teamId || '', avisos: !!(p?.teamId && p?.teamAvisos) }) : Promise.resolve({ ligado: false, jogos: [] }));

/** problema do telefone em palavras (ou '' se está tudo certo) */
export function erroTel(v) {
  const d = String(v || '').replace(/\D/g, ''); if (!d) return '';
  if (d.length === 8 || d.length === 9) return 'Coloque o DDD antes do número, como (21).';
  if (!DDDS.has(d.slice(0, 2))) return 'Esse DDD não existe. Confira.';
  return validPhone(v) ? '' : 'Confira o número: DDD + 9 números.';
}

export function openEditProfile(after) {
  const p = store.profile || {}, me = store.member(store.me) || {}, mostra = p.mostra || {};
  const d = { name: p.name || me.name || '', nickname: p.nickname || '', bio: p.bio || '', birth: p.birth || '', pronoun: p.pronoun || '', phone: maskPhone(p.phone || ''), role: p.role || '', workplace: p.workplace || '', cidade: p.cidade || '', uf: p.uf || '', bairro: p.bairro || '', teamId: p.teamId || '', teamOther: p.teamOther || '', teamAvisos: !!p.teamAvisos, vCidade: !!mostra.cidade, vIdade: !!mostra.idade, id: '', idEra: '' };
  const menor = () => { const a = ageOf(d.birth); return a !== null && a < 18; };
  const campo = (k, rot, o = {}) => `<div class="fgroup${o.meio ? ' ep__meio' : ''}"><label class="flabel" for="ep-${k}">${rot}</label><input id="ep-${k}" class="input" data-k="${k}" type="${o.type || 'text'}" value="${esc(d[k])}" maxlength="${o.max || 60}" ${o.attrs || ''} placeholder="${esc(o.ph || '')}"><p class="ep__erro" data-erro="${k}" hidden></p></div>`;
  const selo = (txt) => `<span class="ep__selo">${icon('lock', 12)} ${txt}</span>`;
  const time = () => {
    const t = porTime(d.teamId);
    return `<button type="button" class="ep__time" data-time>${t ? boton(t, 44) : `<span class="ep__bola">${icon('heart', 20)}</span>`}<span><b>${t ? esc(t.nome) : d.teamOther ? esc(d.teamOther) : 'Escolher meu time'}</b><small>${t ? 'Toque para trocar ou tirar' : d.teamOther ? 'Sem avisos de jogos para este time' : 'Opcional'}</small></span>${icon('right', 16)}</button>
      ${t ? `<label class="list__row ep__chave"><span><b>Avisar dos jogos</b><small data-fut>só do ${esc(t.nome)}, na véspera, no dia e perto da hora</small></span><input type="checkbox" class="switch" data-chk="teamAvisos" ${d.teamAvisos ? 'checked' : ''}></label>` : ''}
      <p class="fhelp">${esc(AVISO_TIME)}</p>`;
  };
  const html = () => { const id = ageOf(d.birth); return `${sheetHead('Editar perfil', { left: '<button class="btn-text" data-close>Cancelar</button>', right: '<button class="btn btn--primary btn--sm" data-save>Salvar</button>' })}
    <form class="form ep" onsubmit="return false">
      <div class="profpic"><button type="button" class="profpic__btn" data-pic>${avatar(store.me, 92)}<span>${icon('camera', 14)} Alterar foto</span></button></div>
      <section class="ep__sec"><h3>Você</h3>
        ${campo('name', 'Nome', { max: 60, attrs: 'autocomplete="name"' })}
        ${campo('nickname', 'Como prefere ser chamado(a)', { max: 30, attrs: 'autocomplete="nickname"', ph: 'Apelido (opcional)' })}
        <div class="fgroup"><label class="flabel" for="ep-id">Seu ID</label><span class="ep__id"><i>@</i><input id="ep-id" class="input" data-k="id" maxlength="20" autocapitalize="none" spellcheck="false" autocomplete="off" value="${esc(d.id)}" placeholder="${d.idEra ? '' : 'carregando…'}"></span><p class="ep__erro" data-erro="id" hidden></p><p class="fhelp">Quem tiver o seu ID acha você na hora.</p></div>
        <div class="fgroup"><label class="flabel" for="ep-bio">Sobre você <small class="muted" data-conta>${d.bio.length}/80</small></label><textarea id="ep-bio" class="input" data-k="bio" rows="2" maxlength="80" placeholder="Uma frase sua (opcional)">${esc(d.bio)}</textarea></div>
        <div class="row2">${campo('birth', `Nascimento${id !== null ? ` · ${id} anos` : ''}`, { type: 'date', attrs: 'min="1900-01-01"' })}<div class="fgroup"><label class="flabel" for="ep-pr">Tratamento</label><select id="ep-pr" class="input" data-k="pronoun"><option value="">Escolher</option>${PRONOUNS.map((x) => `<option value="${x.id}" ${d.pronoun === x.id ? 'selected' : ''}>${x.label}</option>`).join('')}</select></div></div>
        <div class="row2">${campo('role', 'Cargo', { max: 40, ph: 'Opcional' })}${campo('workplace', 'Empresa', { max: 60, ph: 'Opcional' })}</div>
      </section>
      <section class="ep__sec"><h3>Contato ${selo('ninguém vê')}</h3>
        ${campo('phone', 'Celular com DDD', { type: 'tel', max: 20, attrs: 'inputmode="tel" autocomplete="tel-national"', ph: '(21) 99999-8888' })}
        <div class="fgroup"><label class="flabel">E-mail da conta</label><div class="input ep__fixo">${esc(store.user?.email || 'sem e-mail')}</div></div>
      </section>
      <section class="ep__sec"><h3>Onde você mora</h3>
        <div class="row2 ep__cid">${campo('cidade', 'Cidade', { attrs: 'autocomplete="address-level2"' })}<div class="fgroup"><label class="flabel" for="ep-uf">Estado</label><select id="ep-uf" class="input" data-k="uf"><option value="">UF</option>${UFS.map((u) => `<option ${d.uf === u ? 'selected' : ''}>${u}</option>`).join('')}</select></div></div>
        ${campo('bairro', `Bairro ou região ${selo('ninguém vê')}`, { attrs: 'autocomplete="address-level3"', ph: 'Opcional' })}
      </section>
      <section class="ep__sec"><h3>Time do coração ${selo('ninguém vê')}</h3><div data-tcx>${time()}</div></section>
      <section class="ep__sec"><h3>O que seus amigos veem</h3><div class="list">
        ${menor() ? `<p class="fhelp ep__menor">${icon('shield', 14)} Para sua segurança, cidade e idade ficam escondidas até os 18 anos.</p>` : `<label class="list__row"><span><b>Minha cidade</b><small>${esc([d.cidade, d.uf].filter(Boolean).join(', ') || 'preencha acima')}</small></span><input type="checkbox" class="switch" data-chk="vCidade" ${d.vCidade ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Minha idade</b><small>só o número, nunca a data</small></span><input type="checkbox" class="switch" data-chk="vIdade" ${d.vIdade ? 'checked' : ''}></label>`}</div></section>
    </form>`; };
  return openSheet({ className: 'sheet--tall', html: html(), onMount: (s) => {
    const el = s.el, q = (x) => el.querySelector(x), redesenha = () => { const sc = el.querySelector('.sheet__inner') || el, y = sc.scrollTop; s.set(html()); sc.scrollTop = y; };
    const erro = (k, t) => { const n = q(`[data-erro="${k}"]`); if (n) { n.hidden = !t; n.textContent = t || ''; q(`[data-k="${k}"]`)?.setAttribute('aria-invalid', t ? 'true' : 'false'); } };
    el.querySelectorAll('[data-k]').forEach((i) => {
      const k = i.dataset.k;
      i.addEventListener('input', () => { if (k === 'phone') { const puro = i.value.replace(/\D/g, ''); if (puro.length >= 10 || !puro) i.value = puro ? maskPhone(i.value) : ''; } if (k === 'id') i.value = i.value.toLowerCase().normalize('NFD').replace(/[^a-z0-9._]/g, ''); d[k] = i.value; if (k === 'bio') q('[data-conta]').textContent = `${i.value.length}/80`; erro(k, ''); });
      if (k === 'phone') i.addEventListener('blur', () => erro('phone', erroTel(i.value)));
      if (k === 'birth') i.addEventListener('change', redesenha);
      if (k === 'cidade' || k === 'uf') i.addEventListener('input', () => { const m = q('[data-chk="vCidade"]'); if (m) m.parentElement.querySelector('small').textContent = [d.cidade, d.uf].filter(Boolean).join(', ') || 'preencha acima'; });
    });
    const chaves = () => el.querySelectorAll('[data-chk]').forEach((c) => (c.onchange = () => { d[c.dataset.chk] = c.checked; }));
    const ligaTime = () => { const b = q('[data-time]'); if (b) b.onclick = () => escolheTime(d, () => { q('[data-tcx]').innerHTML = time(); ligaTime(); chaves(); jogos(); }); };
    const jogos = () => { if (!d.teamId) return; sincTimeVer(d.teamId).then((r) => { const n = q('[data-fut]'); if (!n) return; if (r.ligado === false) n.textContent = 'a tabela de jogos ainda não chegou; assim que chegar, eu aviso'; else if (r.jogos?.[0]) n.textContent = proximoTxt(r.jogos[0], d.teamId); }).catch(() => {}); };
    chaves(); ligaTime(); jogos();
    q('[data-pic]').onclick = () => photoActions(redesenha);
    if (!d.idEra) meuId().then((x) => { d.idEra = x; if (!d.id) d.id = x; const i = q('[data-k="id"]'); if (i && !i.value) i.value = d.id; }).catch(() => { const i = q('[data-k="id"]'); if (i) { i.placeholder = 'sem internet agora'; i.disabled = true; } });
    q('[data-save]').onclick = async (ev) => {
      const b = ev.currentTarget, falha = (k, t) => { erro(k, t); const n = q(`[data-k="${k}"]`); n?.scrollIntoView({ block: 'center' }); n?.focus({ preventScroll: true }); };
      const name = lim(d.name, 60); if (!/\p{L}{2}/u.test(name)) return falha('name', 'Escreva seu nome.');
      const nick = lim(d.nickname, 30); if (nick && !/\p{L}/u.test(nick)) return falha('nickname', 'O apelido precisa ter pelo menos uma letra.');
      const te = erroTel(d.phone); if (te) return falha('phone', te);
      const era = ageOf(p.birth), vai = ageOf(d.birth);
      if (p.birth && !d.birth) return falha('birth', 'Informe a sua data de nascimento.');
      if (d.birth && (vai === null || vai > 110 || d.birth > new Date().toISOString().slice(0, 10))) return falha('birth', 'Confira o dia, o mês e o ano.');
      if (vai !== null && vai < 13) return falha('birth', 'O Lembra é para maiores de 13 anos.');
      if (era !== null && era < 18 && vai !== null && vai >= 18) return falha('birth', 'Para corrigir essa data, fale com o suporte.');
      b.disabled = true;
      try {
        if (d.id && d.id !== d.idEra && d.idEra) { try { d.idEra = await trocaMeuId(d.id); d.id = d.idEra; } catch (e) { b.disabled = false; return falha('id', e.message || 'Esse ID não deu certo.'); } }
        const mudouTel = d.phone.replace(/\D/g, '') !== String(p.phone || '').replace(/\D/g, '');
        await saveMyProfile({ name, nickname: nick, bio: lim(d.bio, 80), birth: d.birth, pronoun: d.pronoun, phone: d.phone, ...(mudouTel && p.phoneVerified ? { phoneVerified: false } : {}), role: lim(d.role, 40), workplace: lim(d.workplace, 60), cidade: lim(d.cidade, 60), uf: d.uf, bairro: lim(d.bairro, 60), teamId: d.teamId, teamOther: lim(d.teamOther, 40), teamAvisos: !!(d.teamId && d.teamAvisos), mostra: { cidade: !menor() && d.vCidade, idade: !menor() && d.vIdade } });
        sincTime().catch(() => {}); import('../friends.js').then((f) => f.publishCard()).catch(() => {});
        toast('Perfil salvo ✓'); s.close(); if (after) after();
      } catch { b.disabled = false; toast('Não consegui salvar agora. Verifique a internet.'); }
    };
  } });
}
/* só olha a tabela (não liga aviso nenhum antes de salvar) */
const sincTimeVer = (time) => (store.mode === 'cloud' ? api('/futebol', { ws: '', ver: true, time }) : Promise.resolve({ ligado: false, jogos: [] }));
export function proximoTxt(j, id) { const rival = j.c === id ? j.fora : j.casa, dt = new Date(j.at); return `próximo: ${rival}, ${dt.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' }).replace('.', '')} às ${dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}`; }

export function escolheTime(d, ok) {
  const linha = (t) => `<button class="tm" data-t="${t.id}">${boton(t, 42)}<span><b>${esc(t.nome)}</b><small>${t.uf}</small></span>${d.teamId === t.id ? icon('check', 20) : ''}</button>`;
  const lista = (q) => { const L = achaTimes(q); return L.length ? L.map(linha).join('') : ''; };
  return openSheet({ className: 'sheet--tall sheet--time', html: `${sheetHead('Seu time do coração', { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <label class="achar__campo">${icon('search', 22)}<input type="text" placeholder="Nome, apelido ou estado" aria-label="Buscar time" autocomplete="off" data-q></label>
    <button class="tm tm--n" data-nao><span class="ep__bola">${icon('x', 18)}</span><span><b>Não torço</b><small>nenhum aviso de futebol</small></span></button>
    <div class="tm__l" data-l>${lista('')}</div>
    <button class="tm tm--n" data-outro><span class="ep__bola">${icon('plus', 18)}</span><span><b>Outro time</b><small data-ot>escreva o nome na busca e toque aqui</small></span></button>
    <p class="fhelp">${esc(AVISO_TIME)}</p>`,
  onMount: (x) => {
    const q = (s) => x.el.querySelector(s), inp = q('[data-q]');
    const fecha = (o) => { Object.assign(d, { teamId: '', teamOther: '', teamAvisos: false }, o); x.close(); ok(); };
    const liga = () => x.el.querySelectorAll('[data-t]').forEach((b) => (b.onclick = () => fecha({ teamId: b.dataset.t, teamAvisos: d.teamId === b.dataset.t && d.teamAvisos })));
    liga(); inp.oninput = () => { q('[data-l]').innerHTML = lista(inp.value); q('[data-ot]').textContent = inp.value.trim() ? `usar “${inp.value.trim().slice(0, 40)}” (sem avisos de jogos)` : 'escreva o nome na busca e toque aqui'; liga(); };
    q('[data-nao]').onclick = () => fecha({});
    q('[data-outro]').onclick = () => { const v = lim(inp.value, 40); if (!/\p{L}{2}/u.test(v)) { inp.focus(); return toast('Escreva o nome do time na busca.'); } fecha({ teamOther: v }); };
  } });
}
