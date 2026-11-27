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
const ocupado = () => document.querySelector('.sheet-wrap.is-open, .ficha, .paywall, .ob, .guide, .termsgate, .photogate, .avgate, .mustupd, .nv, .gx');
const opc = (L, v) => `<option value="" disabled${v ? '' : ' selected'}>Escolha…</option>${L.map(([k, t]) => `<option value="${k}"${v === k ? ' selected' : ''}>${esc(t)}</option>`).join('')}`;

/** abre a tela se a pessoa ainda não respondeu (chamado ao entrar no app) */
export function pede({ forca = false } = {}) {
  if (!forca && respondeu({ vida: vidaAtual() })) return false;
  if (!store.user && store.mode === 'cloud') return false;
  if (!forca && ocupado()) { setTimeout(() => pede(), 4000); return false; }
  abreFicha();
  return true;
}
export function abreFicha() {
  const d = { ...(vidaAtual() || {}) };
  const html = () => `${sheetHead('Conta um pouco de você', { right: '<button class="btn btn--primary btn--sm" data-ok>Salvar</button>' })}
    <form class="form" onsubmit="return false">
      <p class="fhelp">Assim eu falo com você do seu jeito. Só você vê estas respostas. Em todas dá para escolher “Prefiro não dizer”.</p>
      <div class="fgroup"><label class="flabel" for="v-rel">Relacionamento</label><select id="v-rel" class="input" name="rel">${opc(RELACOES, d.rel)}</select></div>
      <div class="fgroup" data-par ${COM_PAR.includes(d.rel) ? '' : 'hidden'}><label class="flabel" for="v-par">Nome dele(a) (opcional)</label><input id="v-par" class="input" name="par" maxlength="30" autocomplete="off" value="${esc(d.par || '')}"></div>
      <div class="fgroup"><label class="flabel" for="v-fil">Tem filhos?</label><select id="v-fil" class="input" name="filhos">${opc(FILHOS, d.filhos)}</select></div>
      <div class="fgroup" data-nomes ${d.filhos === 'sim' ? '' : 'hidden'}><label class="flabel" for="v-nomes">Nome dos filhos (opcional)</label><input id="v-nomes" class="input" name="nomes" maxlength="200" autocomplete="off" placeholder="Ex.: Lucas, Bia" value="${esc((d.nomes || []).join(', '))}"></div>
      <div class="fgroup"><label class="flabel" for="v-ani">Como você anda se sentindo?</label><select id="v-ani" class="input" name="animo">${opc(ANIMO, d.animo)}</select></div>
      <p class="fhelp" data-err hidden role="status">Escolha uma opção em cada pergunta (pode ser “Prefiro não dizer”).</p>
    </form>`;
  const a = openSheet({
    className: 'sheet--tall vidasheet', html: html(),
    onMount: (x) => {
      const f = x.el.querySelector('form');
      f.rel.onchange = () => { x.el.querySelector('[data-par]').hidden = !COM_PAR.includes(f.rel.value); };
      f.filhos.onchange = () => { x.el.querySelector('[data-nomes]').hidden = f.filhos.value !== 'sim'; };
      x.el.querySelector('[data-ok]').onclick = async () => {
        const v = limpaVida({ rel: f.rel.value, par: f.par.value, filhos: f.filhos.value, nomes: f.nomes.value, animo: f.animo.value });
        if (!v) { x.el.querySelector('[data-err]').hidden = false; return; }
        try { await guarda(v); } catch { toast('Não consegui salvar agora. Tento de novo quando a internet voltar.'); }
        a.close(); toast('Prontinho! Agora eu te conheço melhor 💛');
      };
    },
  });
  return a;
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
