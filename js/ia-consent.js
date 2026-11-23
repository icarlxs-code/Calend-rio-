/* Consentimento para a inteligência artificial (exigência da Apple 5.1.2(i), do Google e da LGPD):
   antes do PRIMEIRO envio de qualquer dado para uma IA, a pessoa vê o que vai, para quem vai, e escolhe.
   A escolha fica guardada (no aparelho e na conta) e pode ser mudada em Ajustes a qualquer momento.
   Sem consentimento, nada vai para a IA: o assistente não abre, os títulos são arrumados só no aparelho
   e as mensagens automáticas usam frases prontas. */
import { store, saveUserProfile } from './store.js';
import { openSheet, sheetHead } from './components.js';
import { icon } from './icons.js';

const K = 'lembra.iaConsent';
export function iaStatus() {
  const p = store.profile && store.profile.iaConsent;
  if (p === true || p === false) return p;
  try { const v = localStorage.getItem(K); return v === '1' ? true : v === '0' ? false : null; } catch { return null; }
}
export const iaOk = () => iaStatus() === true;
export async function setIa(v) {
  try { localStorage.setItem(K, v ? '1' : '0'); } catch { /* ok */ }
  try { if (store.mode === 'cloud' && store.user) await saveUserProfile({ iaConsent: !!v, iaConsentAt: Date.now() }); } catch { /* ok */ }
}

/* pede (se ainda não respondeu). Resolve true/false. */
export function pedeIa({ motivo = 'usar o assistente' } = {}) {
  const s = iaStatus();
  if (s !== null) return Promise.resolve(s);
  return new Promise((res) => {
    let done = false;
    const fim = (v) => { if (done) return; done = true; setIa(v); a.close(); res(v); };
    const a = openSheet({
      className: 'sheet--dialog',
      onClose: () => { if (!done) { done = true; res(false); } },
      html: `${sheetHead('Inteligência artificial', { left: '<button class="btn-text" data-close>Fechar</button>' })}
      <div class="page page--sheet iacons">
        <p>Para ${motivo}, o Lembra usa inteligência artificial. Antes, você precisa saber:</p>
        <ul class="iacons__l">
          <li>${icon('upload', 16)}<span><b>O que é enviado:</b> a sua pergunta e só o necessário da agenda (títulos, datas e horários dos compromissos, nomes dos grupos e a sua profissão). Nunca senha, CPF ou fotos.</span></li>
          <li>${icon('cloud', 16)}<span><b>Para quem:</b> Cloudflare Workers AI (modelo Llama, da Meta), pelo nosso servidor. Quando disponível, também a Anthropic (modelo Claude).</span></li>
          <li>${icon('lock', 16)}<span><b>Como:</b> a chave da IA fica no nosso servidor, a conversa vai criptografada e não é usada para treinar modelos.</span></li>
          <li>${icon('alert', 16)}<span>A IA pode errar: confira antes de confirmar. Ela não substitui orientação médica, jurídica ou financeira.</span></li>
        </ul>
        <button class="btn btn--primary btn--block" data-sim>Aceitar e continuar</button>
        <button class="btn btn--soft btn--block" data-nao>Agora não</button>
        <p class="fhelp">Você pode mudar isso quando quiser em Ajustes → Inteligência artificial.</p>
      </div>`,
      onMount: (x) => { x.el.querySelector('[data-sim]').onclick = () => fim(true); x.el.querySelector('[data-nao]').onclick = () => fim(false); },
    });
  });
}
