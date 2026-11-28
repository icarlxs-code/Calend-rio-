/* "Conta um pouco de você": a tela que aparece uma vez para cada pessoa (inclusive quem já tinha conta)
   e a conversa curtinha do mascote ("vocês estão bem?"). As respostas ficam só na conta da pessoa. */
import { store, saveProfileQuiet } from '../store.js';
import { openSheet, sheetHead, toast } from '../components.js';
import { esc } from '../utils.js';
import { RELACOES, FILHOS, ANIMO, COM_PAR, NAO_DIZER, limpaVida, respondeu, risco, respostaDeRisco, respostaReserva, RESPOSTA_SIM, EMERGENCIA, FECHO, perguntaDoPar } from '../vida.js';

const LS = 'lembra.vida';
/* modo sem nuvem (teste local): guarda no aparelho */
export function vidaAtual() {
  if (store.profile?.vida) return store.profile.vida;
  try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch { return null; }
}
async function guarda(v) {
  try { localStorage.setItem(LS, JSON.stringify(v)); } catch { /* ok */ }
  store.profile = { ...(store.profile || {}), vida: v };
  await saveProfileQuiet({ vida: v });
}
const ocupado = () => document.querySelector('.sheet-wrap.is-open, .ficha, .vficha, .paywall, .ob, .guide, .termsgate, .photogate, .avgate, .mustupd, .nv, .gx');
const opc = (L, v) => `<option value="" disabled${v ? '' : ' selected'}>Escolha…</option>${L.map(([k, t]) => `<option value="${k}"${v === k ? ' selected' : ''}>${esc(t)}</option>`).join('')}`;

/** abre a tela se a pessoa ainda não respondeu (chamado ao entrar no app) */
export function pede({ forca = false } = {}) {
  if (!forca && respondeu({ vida: vidaAtual() })) return false;
  if (!store.user && store.mode === 'cloud') return false;
  if (!forca && ocupado()) { setTimeout(() => pede(), 4000); return false; }
  abreFicha();
  return true;
}
/* tela cheia no estilo oficial: fundo ilustrado, o Sininho vivo fazendo uma pergunta por vez,
   respostas em botões grandes e ele reagindo a cada escolha (amor = olhos de coração, filhos = emocionado…) */
const REACAO = {
  solteiro: ['descolado', 'Solteiro(a) e livre! 😎'], namorando: ['apaixonado', 'Que amor! 💛'], noivo: ['apaixonado', 'Casório vindo aí! 💍'],
  casado: ['apaixonado', 'Que lindo! ❤️'], uniao: ['apaixonado', 'Que lindo! ❤️'], complicado: ['zonzo', 'Relacionamento é assim mesmo, às vezes dá um nó 😵‍💫'],
  separado: ['feliz', 'Recomeços também são bonitos 🌱'], viuvo: ['emocionado', 'Sinto muito. Tô aqui com você 🤍'],
  sim: ['emocionado', 'Que coisa boa! 🥹'], nao: ['feliz', 'Beleza!'], gravida: ['estrelado', 'Que notícia incrível! ⭐'],
  bem: ['estrelado', 'Adoro essa energia! ⭐'], normal: ['feliz', 'Dia normal também é dia bom 🙂'], desanimado: ['emocionado', 'Vou caprichar pra te animar 🤗'],
  dificil: ['emocionado', 'Obrigado por confiar em mim. Tô do seu lado 🤍'],
};
export function abreFicha({ aoFechar } = {}) {
  document.querySelector('.vficha')?.remove();
  const d = { ...(vidaAtual() || {}) };
  if (typeof d.nomes === 'string') d.nomes = d.nomes.split(',');
  const passos = () => [
    { k: 'rel', arte: '19-socializar', h: 'Seu coração', p: 'Me conta: como está o seu coração?', L: RELACOES },
    ...(COM_PAR.includes(d.rel) ? [{ k: 'par', arte: '19-socializar', h: 'Seu amor', p: 'E qual é o nome dele(a)? Se quiser, pode pular.', txt: 'Nome (opcional)', max: 30 }] : []),
    { k: 'filhos', arte: '06-aniversario', h: 'Sua família', p: 'Você tem filhos?', L: FILHOS },
    ...(d.filhos === 'sim' ? [{ k: 'nomes', arte: '06-aniversario', h: 'Seus pequenos', p: 'Como eles se chamam? Assim eu lembro deles com você.', txt: 'Ex.: Lucas, Bia', max: 200 }] : []),
    { k: 'animo', arte: '28-calma', h: 'Como você está', p: 'E você, como anda se sentindo?', L: ANIMO },
  ];
  let i = 0;
  const w = document.createElement('div');
  w.className = 'vficha'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Conta um pouco de você');
  document.body.appendChild(w);
  const fecha = () => { w.classList.add('is-sai'); setTimeout(() => w.remove(), 280); aoFechar && aoFechar(); };
  let snh = null, S = null;
  const fala = (t, humor, gesto) => { if (!S || !snh) return; if (humor) S.setMood(snh, humor); if (gesto) S.act(snh, gesto); S.say(snh, t, { bubble: w.querySelector('.snhb__txt') }); };
  const pinta = () => {
    const P = passos(), s = P[i];
    const val = s.k === 'nomes' ? (d.nomes || []).join(', ') : d[s.k] || '';
    w.innerHTML = `<img class="vficha__bg" src="assets/stories/${s.arte}.webp" alt="" decoding="async">
      <div class="vficha__topo"><button class="vficha__x" data-x aria-label="Fechar">✕</button><span class="vficha__pts" aria-label="Pergunta ${i + 1} de ${P.length}">${P.map((_, j) => `<i class="${j < i ? 'is-ok' : j === i ? 'is-on' : ''}"></i>`).join('')}</span><span></span></div>
      <div class="vficha__palco snhwrap"><span class="vficha__snh">${S ? S.sininho('feliz', { size: Math.min(190, Math.round(innerWidth * 0.46)) }) : ''}</span><div class="snhb vficha__bal"><span class="snhb__txt" aria-live="polite"></span></div></div>
      <div class="vficha__card"><div class="vficha__h">${esc(s.h)}</div>
        ${s.L ? `<div class="vficha__ops" role="radiogroup">${s.L.map(([k, t], j) => `<button class="vficha__op${val === k ? ' is-on' : ''}${k === NAO_DIZER ? ' vficha__op--nd' : ''}" role="radio" aria-checked="${val === k}" data-v="${esc(k)}" style="--d:${0.05 + j * 0.04}s">${esc(t)}</button>`).join('')}</div>`
        : `<input class="input vficha__in" maxlength="${s.max}" autocomplete="off" placeholder="${esc(s.txt)}" value="${esc(val)}"><div class="vficha__bts"><button class="btn btn--soft" data-pula>Pular</button><button class="btn btn--primary" data-seg>Continuar</button></div>`}
        ${i > 0 ? '<button class="vficha__volta" data-volta>‹ Voltar</button>' : ''}</div>`;
    if (S) { S.alive(); snh = w.querySelector('[data-snh]'); }
    setTimeout(() => fala(s.p, 'feliz', i ? 'sim' : 'tchau'), 260);
    w.querySelector('[data-x]').onclick = fecha;
    const volta = w.querySelector('[data-volta]'); if (volta) volta.onclick = () => { i--; pinta(); };
    w.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => {
      d[s.k] = b.dataset.v;
      w.querySelectorAll('[data-v]').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', x === b); });
      const [h, t] = REACAO[b.dataset.v] || ['feliz', b.dataset.v === NAO_DIZER ? 'Tudo bem, sem problema 😉' : 'Anotado!'];
      fala(t, h, 'pulo');
      setTimeout(avanca, 1500);
    }));
    const inp = w.querySelector('.vficha__in');
    if (inp) {
      const seg = () => { d[s.k] = s.k === 'nomes' ? inp.value.split(',').map((x) => x.trim()).filter(Boolean) : inp.value.trim(); if (inp.value.trim()) fala(s.k === 'nomes' ? 'Que nomes lindos! 🥰' : `${inp.value.trim().split(' ')[0]}, que nome bonito! 💛`, 'apaixonado', 'pulo'); setTimeout(avanca, inp.value.trim() ? 1300 : 0); };
      w.querySelector('[data-seg]').onclick = seg; inp.onkeydown = (e) => { if (e.key === 'Enter') seg(); };
      w.querySelector('[data-pula]').onclick = () => { d[s.k] = s.k === 'nomes' ? [] : ''; avanca(); };
    }
  };
  async function avanca() {
    if (i < passos().length - 1) { i++; return pinta(); }
    const v = limpaVida({ ...d, nomes: (d.nomes || []).join(', ') });
    if (!v) { i = 0; return pinta(); }
    try { await guarda(v); } catch { toast('Não consegui salvar agora. Tento de novo quando a internet voltar.'); }
    w.querySelector('.vficha__card').innerHTML = '<div class="vficha__h">Prontinho!</div><p class="vficha__fim">Agora eu te conheço melhor. Só você vê estas respostas.</p><button class="btn btn--primary btn--block" data-fim>Valeu, Lembra!</button>';
    w.querySelector('.vficha__pts').querySelectorAll('i').forEach((x) => (x.className = 'is-ok'));
    fala('Obrigado por me contar! Agora eu falo com você do seu jeitinho 💛', 'apaixonado', 'pulo');
    w.querySelector('[data-fim]').onclick = fecha;
  }
  import('../sininho.js').then((m) => { S = m; pinta(); }).catch(() => pinta());
  return { el: w, close: fecha };
}

/* ---------- conversa curta do mascote ---------- */
const emergenciaHtml = () => `<div class="vida__sos" role="group" aria-label="Ajuda agora">${EMERGENCIA.map((e) => `<a class="btn btn--soft btn--block" href="tel:${e.n}"><b>${esc(e.t)}</b><small>${esc(e.s)}</small></a>`).join('')}<p class="fhelp">O celular pede para confirmar antes de ligar.</p></div>`;
/** "vocês estão bem?" → sim: uma frase e fim; não: "o que aconteceu?", a pessoa escreve e o mascote responde curto */
export function conversaDoPar({ resposta } = {}) {
  const v = vidaAtual(), pergunta = perguntaDoPar(v);
  if (!pergunta) return null;
  let etapa = resposta === 'nao' ? 'conta' : resposta === 'sim' ? 'sim' : 'pergunta', texto = '', fala = '', perigo = null;
  const corpo = () => {
    if (etapa === 'pergunta') return `<p class="vida__fala">${esc(pergunta)}</p><div class="vida__bts"><button class="btn btn--primary" data-r="sim">Sim</button><button class="btn btn--soft" data-r="nao">Não</button></div>`;
    if (etapa === 'sim') return `<p class="vida__fala">${esc(RESPOSTA_SIM[Date.now() % RESPOSTA_SIM.length])}</p><button class="btn btn--primary btn--block" data-close>Valeu!</button>`;
    if (etapa === 'conta') return `<p class="vida__fala">Poxa… O que aconteceu? Pode me contar.</p><textarea class="input" name="t" rows="4" maxlength="600" placeholder="Escreva aqui…"></textarea><button class="btn btn--primary btn--block" data-env>Enviar</button>`;
    if (etapa === 'pensando') return '<div class="fx__load"><i></i><i></i><i></i></div>';
    return `<p class="vida__fala">${esc(fala)}</p>${perigo ? emergenciaHtml() : ''}<p class="vida__fecho">${esc(FECHO)}</p><button class="btn btn--primary btn--block" data-close>Obrigado(a)</button>`;
  };
  const a = openSheet({ className: 'vidapapo', html: `${sheetHead('')}<div class="page page--sheet vida" data-corpo>${corpo()}</div>`, onMount: (x) => liga(x) });
  function redesenha() { const c = a.el.querySelector('[data-corpo]'); if (c) { c.innerHTML = corpo(); liga(a); } }
  function liga(x) {
    x.el.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => { etapa = b.dataset.r === 'sim' ? 'sim' : 'conta'; redesenha(); }));
    const env = x.el.querySelector('[data-env]');
    if (env) env.onclick = async () => {
      texto = (x.el.querySelector('textarea[name="t"]').value || '').trim();
      if (!texto) return;
      perigo = risco(texto); etapa = 'pensando'; redesenha();
      ({ fala, perigo } = await responde(texto, perigo));
      etapa = 'fim'; redesenha();
    };
  }
  return a;
}
/** a resposta: risco = resposta pronta (não depende da IA); senão a IA grátis, curtinha; sem IA, uma frase carinhosa */
async function responde(texto, perigo) {
  if (perigo) return { fala: respostaDeRisco(perigo), perigo };
  try {
    const { api, server } = await import('../avisos.js');
    if (store.mode === 'cloud' && server()) {
      const r = await api('/desabafo', { ws: '', texto, vida: vidaAtual(), pronome: store.profile?.pronoun || '' });
      if (r && r.risco) return { fala: respostaDeRisco(r.risco), perigo: r.risco };
      if (r && r.texto) return { fala: r.texto, perigo: null };
    }
  } catch { /* sem internet: segue */ }
  return { fala: respostaReserva(texto, String(Date.now())), perigo: null };
}
export { NAO_DIZER };

/* ---------- time do coração: quem ainda não escolheu (nem disse que não torce) escolhe ao entrar ---------- */
const semTime = () => { const p = store.profile || {}; if (p.teamId || p.teamOther || p.semTime) return false; try { return localStorage.getItem('lembra.semTime') !== '1'; } catch { return true; } };
/** abre a escolha do time (com "Não torço"); fechou sem escolher, pergunta de novo na próxima vez que entrar */
export async function pedeTime({ forca = false } = {}) {
  if ((!forca && !semTime()) || (!store.user && store.mode === 'cloud')) return false;
  if (ocupado()) { setTimeout(() => pedeTime(), 4000); return false; }
  const E = await import('./editar-perfil.js'), d = { teamId: store.profile?.teamId || '', teamOther: store.profile?.teamOther || '', teamAvisos: !!store.profile?.teamAvisos };

  E.escolheTime(d, async () => {

    const nenhum = !d.teamId && !d.teamOther;
    try { localStorage.setItem('lembra.semTime', nenhum ? '1' : '0'); } catch { /* ok */ }
    const dados = { teamId: d.teamId, teamOther: d.teamOther, teamAvisos: !!d.teamId, ...(nenhum ? { semTime: true } : {}) };
    store.profile = { ...(store.profile || {}), ...dados };
    try { await saveProfileQuiet(dados); } catch { /* sem internet: fica no aparelho e sobe depois */ }
    if (d.teamId) E.escolheCamps(store.profile?.teamCamps || [], async (L) => {
      store.profile = { ...(store.profile || {}), teamCamps: L };
      try { await saveProfileQuiet({ teamCamps: L }); } catch { /* ok */ }
      falaDoTime(d.teamId, E);
    });
  });
  return true;
}
/** acabou de escolher: o mascote já fala do time (o que está rolando agora ou o próximo jogo) */
async function falaDoTime(id, E) {
  const { porTime } = await import('../../functions/times.js'), t = porTime(id); if (!t) return;
  const M = await import('../mascote.js');
  let texto = `${t.nome} no coração! ❤️ Agora eu te aviso dos jogos: véspera, no dia e perto da hora.`;
  try {
    const r = await E.sincTime(store.profile);
    const c = r && r.cena;
    if (c && c.tipo && (c.tipo === 'gol' || c.tipo === 'gol-sofrido' || c.tipo === 'comecou' || c.tipo === 'intervalo')) texto = `Tá rolando agora! ${t.nome} ${c.meu} x ${c.dele}${c.rival ? ` ${c.rival}` : ''}. Bora torcer junto! ⚽`;
    else if (c && c.tipo === 'fim') texto = `${t.nome} ${c.meu} x ${c.dele}${c.rival ? ` ${c.rival}` : ''} no último jogo. ${c.meu > c.dele ? 'Que vitória! 🎉' : c.meu === c.dele ? 'Fica pro próximo! 💪' : 'Bola pra frente! 💪'}`;
    else if (r && r.jogos && r.jogos[0]) texto = `${t.nome} no coração! ❤️ ${E.proximoTxt(r.jogos[0], id).replace(/^próximo/, 'Próximo jogo')}. Eu te aviso!`;
  } catch { /* sem internet: fala o básico */ }
  setTimeout(() => M.react('torcida', { texto, humor: 'comemora', gesto: 'pulo' }), 600);
}
