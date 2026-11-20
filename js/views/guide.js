/* "Como funciona o Lembra": explica, de forma organizada, o modo Trabalho e o modo Pessoal.
   Aparece no 1º acesso de cada conta e fica em Ajustes → Como funciona. */
import { openSheet } from '../components.js';
import { icon } from '../icons.js';
import { store } from '../store.js';
import { TYPES, TYPE_ORDER, WORK, isMarketing } from '../constants.js';
import { esc } from '../utils.js';
import { g } from '../persona.js';
const welcome = () => g('Bem-vindo', 'Bem-vinda', 'Boas-vindas', store.profile?.pronoun);

const block = (ic, title, text) => `<div class="gitem"><span class="gitem__ic">${icon(ic, 18)}</span><div><b>${title}</b><p>${text}</p></div></div>`;

const MKT_PAGES = () => [
  {
    key: 'intro', badge: welcome(), color: 'linear-gradient(135deg,#111,#3a3a44)', ic: 'sparkles',
    title: 'O Lembra tem dois modos',
    lead: 'Um para o seu trabalho e outro para a sua vida pessoal. Cada um com a sua tela, seus lembretes e suas cores — e o que está em um nunca aparece no outro.',
    body: `<div class="gmodes">
      <div class="gmode"><span class="gmode__ic gmode__ic--work">${icon('briefcase', 22)}</span><b>Trabalho</b><small>Empresas, posts, captações e reuniões</small></div>
      <div class="gmode"><span class="gmode__ic gmode__ic--life">${icon('heart', 22)}</span><b>Pessoal</b><small>Aniversários, compromissos, listas e cuidado com você</small></div>
    </div>
    <p class="gnote">Para trocar de modo, toque no <b>coração</b> no topo (vai para o Pessoal) ou em <b>Trabalho</b> (volta).</p>`,
  },
  {
    key: 'work', badge: 'Modo Trabalho', color: 'linear-gradient(135deg,#1d1d24,#41414d)', ic: 'briefcase',
    title: 'Para organizar seus clientes',
    lead: 'Feito para quem cuida das redes sociais de empresas: tudo o que precisa ser postado, gravado ou combinado, com hora marcada e lembrete.',
    body: [
      block('building', 'Empresas', 'Cadastre cada cliente com logo e cor. Cada empresa tem a própria agenda e um link para o cliente acompanhar.'),
      block('calendar', 'Posts, captações e reuniões', 'Marque Feed, Reels, Story, Carrossel, gravações e reuniões. Escreva do seu jeito: o app arruma o título.'),
      block('bell', 'Lembretes e cobrança', '1h e 30 min antes, “Já postou?” na hora e cobrança a cada 10 min se atrasar — até você marcar como feito.'),
      block('sparkle', 'Assistente', 'Peça em português: “coloca reels da padaria sexta 18h”. Ele mostra o que vai fazer e você confirma.'),
      block('alert', 'Selo de atrasado', 'Passou do horário e não marcou como feito? O cartão fica vermelho para você não esquecer.'),
    ].join(''),
  },
  {
    key: 'life', badge: 'Modo Pessoal', color: 'linear-gradient(135deg,#FF7AA2,#A06BFF 55%,#6A7BFF)', ic: 'heart',
    title: 'Para você não esquecer de nada',
    lead: 'Um espaço só seu, privado, para a vida fora do trabalho — com mensagens de amigo que te lembram e te animam ao longo do dia.',
    body: [
      block('note', 'Anote do jeito que fala', '“Cortar cabelo amanhã 15h”, “aniversário da Maria 25/12”, “buscar a Ana sexta às 18h”. O app entende sozinho.'),
      block('cake', 'Aniversários', 'Repetem todo ano, com aviso na véspera e no dia — e a idade que a pessoa vai fazer.'),
      block('listcheck', 'Listas', 'Mercado, coisas para fazer, ideias, presentes… marque os itens conforme for resolvendo.'),
      block('droplet', 'Mensagens de ânimo', 'Água, hora de comer, versículos e palavras de motivação em horários variados. Você escolhe o que quer receber.'),
      block('lock', 'Privado', 'Só você vê. Nem clientes, nem quem divide a agenda de trabalho com você.'),
    ].join(''),
  },
  {
    key: 'start', badge: g('Pronto para começar', 'Pronta para começar', 'Tudo pronto para começar', store.profile?.pronoun), color: 'linear-gradient(135deg,#0E9F6E,#34C759)', ic: 'check',
    title: 'Três passos para começar',
    lead: 'Leva menos de 2 minutos:',
    body: [
      block('phone', '1. Instale na tela inicial', 'Assim ele abre como app e recebe as notificações (no iPhone, só funciona instalado).'),
      block('bell', '2. Ative as notificações', 'Em Ajustes → Notificações → Ativar. É o que faz o Lembra lembrar você de verdade.'),
      block('plus', '3. Anote a primeira coisa', 'No Trabalho, cadastre uma empresa e um post. No Pessoal, anote algo de hoje.'),
    ].join(''),
  },
];

/* Para as outras profissões: o mesmo guia, com os nomes e compromissos da profissão da pessoa */
function pages() {
  const P = MKT_PAGES();
  if (isMarketing()) return P;
  const labels = TYPE_ORDER.filter((t) => t !== 'outro').map((t) => TYPES[t]?.label).filter(Boolean);
  const list = (n) => labels.slice(0, n).join(', ').toLowerCase();
  const prof = WORK.profession ? esc(WORK.profession) : 'o seu trabalho';
  const t0 = TYPES[TYPE_ORDER[0]] || TYPES.outro;
  P[0] = { ...P[0], body: P[0].body.replace('Empresas, posts, captações e reuniões', esc(`${WORK.entity.many}, ${list(3)}`)) };
  P[1] = {
    ...P[1],
    title: `Feito para ${prof}`,
    lead: `O modo Trabalho fala a língua da sua profissão: ${esc(list(5))}. Tudo com hora marcada, avisos calculados para você e cobrança se ficar para trás.`,
    body: [
      block(WORK.entity.icon, esc(WORK.entity.many), `Cadastre ${esc(WORK.entity.hint || 'seus grupos de trabalho')} com nome e cor, para separar a agenda de cada um.`),
      block(t0.icon || 'calendar', 'Seus compromissos', `Marque ${esc(list(6))}… Escreva do seu jeito: o app arruma o título.`),
      block('bell', 'Avisos sob medida', `Os avisos foram calculados pela sua ficha. Na hora, o Lembra pergunta “${esc(t0.ask || 'Já fez?')}” e, se atrasar, cobra até você marcar como feito.`),
      block('sparkle', 'Assistente', `Peça em português: “marca ${esc((labels[0] || 'compromisso').toLowerCase())} sexta às 14h”. Ele mostra o que vai fazer e você confirma.`),
      block('alert', 'Selo de atrasado', 'Passou do horário e não marcou como feito? O cartão fica vermelho para você não esquecer.'),
    ].join(''),
  };
  P[3] = { ...P[3], body: P[3].body.replace('No Trabalho, cadastre uma empresa e um post.', `No Trabalho, marque ${esc((labels[0] || 'um compromisso').toLowerCase())} de hoje ou amanhã.`) };
  return P;
}

export function openGuide() {
  const PAGES = pages();
  let i = 0;
  const html = () => {
    const p = PAGES[i];
    return `<div class="guide">
      <div class="guide__hero" style="background:${p.color}">
        <span class="guide__badge">${p.badge}</span>
        <span class="guide__ic">${icon(p.ic, 30)}</span>
        <h2>${p.title}</h2>
        <p>${p.lead}</p>
      </div>
      <div class="guide__body">${p.body}</div>
      <div class="guide__dots">${PAGES.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="guide__nav">
        ${i > 0 ? '<button class="btn btn--soft" data-prev>Voltar</button>' : '<button class="btn-text" data-close>Pular</button>'}
        <button class="btn btn--primary" data-next>${i < PAGES.length - 1 ? 'Próximo' : 'Começar'}</button>
      </div>
    </div>`;
  };
  const api = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      const n = a.el.querySelector('[data-next]');
      n.onclick = () => { if (i < PAGES.length - 1) { i++; a.set(html()); a.el.scrollTop = 0; } else a.close(); };
      const pv = a.el.querySelector('[data-prev]');
      if (pv) pv.onclick = () => { i--; a.set(html()); a.el.scrollTop = 0; };
    },
  });
  try { localStorage.setItem(`lembra.guide.${store.user?.uid || 'x'}`, '1'); } catch { /* ok */ }
  return api;
}
export const guideSeen = () => { try { return !!localStorage.getItem(`lembra.guide.${store.user?.uid || 'x'}`); } catch { return true; } };
