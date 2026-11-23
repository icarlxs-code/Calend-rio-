/* Compra dentro do app das lojas (Apple App Store / Google Play), exigida pelas regras 3.1.1 (Apple) e
   "Pagamentos" (Google) para assinaturas digitais. Só é usado dentro do app nativo (Capacitor);
   no site continua a Stripe. O plugin usado é o @capgo/native-purchases (gratuito, código aberto).
   Depois da compra, o servidor confere o recibo direto com a Apple/Google (/billing/store-verify)
   e só então libera o plano: o app nunca libera nada sozinho. */
import { api } from './avisos.js';

export const nativo = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
export const plataforma = () => (nativo() ? window.Capacitor.getPlatform() : 'web'); // 'ios' | 'android' | 'web'
const plugin = () => window.Capacitor?.Plugins?.NativePurchases;

/* códigos dos produtos (os mesmos cadastrados no App Store Connect e no Play Console) */
export const PRODUTOS = {
  'essencial-mensal': 'lembra.essencial.mensal', 'essencial-anual': 'lembra.essencial.anual',
  'profissional-mensal': 'lembra.profissional.mensal', 'profissional-anual': 'lembra.profissional.anual',
  fundadores: 'lembra.fundadores', dupla: 'lembra.dupla.mensal', equipe: 'lembra.equipe.mensal',
};

export async function comprarNaLoja(plano) {
  const P = plugin(), id = PRODUTOS[plano];
  if (!P || !id) throw new Error('Compra pela loja indisponível nesta versão.');
  const assinatura = plano !== 'fundadores';
  const r = await P.purchaseProduct({ productIdentifier: id, productType: assinatura ? 'subs' : 'inapp', quantity: 1 });
  // o servidor valida o recibo com a loja e só então libera
  return api('/billing/store-verify', { plataforma: plataforma(), produto: id, recibo: r.receipt || r.purchaseToken || r.transactionId || '' });
}

/* "Restaurar compras" (obrigatório na Apple): reenvia as compras já feitas para o servidor conferir */
export async function restaurarCompras() {
  const P = plugin();
  if (!P) throw new Error('Disponível só no app das lojas.');
  const r = await P.restorePurchases();
  return api('/billing/store-verify', { plataforma: plataforma(), restaurar: true, compras: r.purchases || r.transactions || [] });
}
