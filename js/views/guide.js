/* "Como funciona o Lembra": explica, de forma organizada, o modo Trabalho e o modo Pessoal.
   Aparece no 1º acesso de cada conta e fica em Ajustes → Como funciona. */
import { openSheet } from '../components.js';
import { icon } from '../icons.js';
import { store } from '../store.js';

const block = (ic, title, text) => `<div class="gitem"><span class="gitem__ic">${icon(ic, 18)}</span><div><b>${title}</b><p>${text}</p></div></div>`;

const PAGES = [
  {
    key: 'intro', badge: 'Bem-vindo', color: 'linear-gradient(135deg,#111,#3a3a44)', ic: 'sparkles',
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
      block('lock', 'Privado', 'Só você vê. Nem o parceiro de trabalho, nem os clientes.'),
    ].join(''),
  },
  {
    key: 'start', badge: 'Pronto para começar', color: 'linear-gradient(135deg,#0E9F6E,#34C759)', ic: 'check',
    title: 'Três passos para começar',
    lead: 'Leva menos de 2 minutos:',
    body: [
      block('phone', '1. Instale na tela inicial', 'Assim ele abre como app e recebe as notificações (no iPhone, só funciona instalado).'),
      block('bell', '2. Ative as notificações', 'Em Ajustes → Notificações → Ativar. É o que faz o Lembra lembrar você de verdade.'),
      block('plus', '3. Anote a primeira coisa', 'No Trabalho, cadastre uma empresa e um post. No Pessoal, anote algo de hoje.'),
    ].join(''),
  },
];

export function openGuide() {
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
