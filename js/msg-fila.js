/* Mensagem escrita sem internet não se perde: fica guardada no aparelho (no cofre) e sobe sozinha
   quando a rede voltar — na ordem em que foi escrita, uma vez só.
   Foto e áudio ficam de fora da fila: são pesados e o servidor tem limite por dia. */
import * as cofre from './cofre.js';
import { aoVoltarRede } from './rede.js';

const K = 'lembra.msgfila';
let L = null, indo = null, ouvintes = new Set(), ligado = false;

const le = () => { if (L) return L; try { L = JSON.parse(cofre.leSync(K) || '[]'); } catch { L = []; } return L; };
const grava = async () => { try { await cofre.guarda(K, JSON.stringify(L || [])); } catch (e) { console.warn('fila de mensagens', e); } };
const avisa = () => ouvintes.forEach((f) => { try { f(le()); } catch { /* ok */ } });
export const aoMudar = (f) => { ouvintes.add(f); return () => ouvintes.delete(f); };
export const pendentes = (com) => le().filter((x) => !com || x.com === com);
export const quantas = () => le().length;

/** guarda uma mensagem para enviar depois. Devolve o item da fila. */
export async function guardaParaDepois(pacote, { com, txt = '', tipo = 'txt' } = {}) {
  const it = { n: Date.now() + Math.random(), com: com || pacote.com, tipo, txt, pacote, at: Date.now(), tentativas: 0 };
  le().push(it); await grava(); avisa();
  return it;
}
export async function tira(n) { L = le().filter((x) => x.n !== n); await grava(); avisa(); }

/** tenta subir tudo o que está esperando, na ordem. `enviar` é quem fala com o servidor. */
export function esvazia(enviar) {
  return (indo ||= (async () => {
    for (const it of [...le()]) {
      if (!le().includes(it)) continue;
      try {
        const r = await enviar(it.pacote);
        await tira(it.n);
        avisa();
        if (r && r.id) continue;
      } catch (e) {
        const msg = String((e && (e.code || e.message)) || e);
        it.tentativas = (it.tentativas || 0) + 1;
        // erro definitivo (bloqueado, apagado, sem permissão): não adianta insistir
        if (/permission|denied|403|404|bloque|limite|teen/i.test(msg) || it.tentativas > 8) { it.erro = msg.slice(0, 80); await tira(it.n); }
        else { await grava(); break; }   // sem rede: para aqui e tenta de novo depois
      }
    }
  })().finally(() => { indo = null; }));
}

/** liga o automático: quando a internet voltar, a fila sobe sozinha */
export function liga(enviar) {
  if (ligado) return; ligado = true;
  aoVoltarRede(() => esvazia(enviar));
  addEventListener('online', () => esvazia(enviar));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) esvazia(enviar); });
  if (le().length) setTimeout(() => esvazia(enviar), 1500);
}
