/* Conta de adolescente (13 a 17 anos), no modelo das "contas de adolescente" do Instagram e do ECA Digital:
   - privado por padrão: no ranking aparece anônimo (sem nome e sem foto) até a pessoa decidir o contrário;
   - stories e perfil só para amigos aceitos (já é a regra para todos);
   - "modo dormir": das 22h às 7h nenhuma notificação de curiosidade (story novo, visita ao perfil);
   - menores de 13 não podem criar conta (a ficha já bloqueia). */
import { store } from './store.js';
export function idade(birth = store.profile?.birth) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth || '')) return null;
  const [y, m, d] = birth.split('-').map(Number), h = new Date();
  return h.getFullYear() - y - ((h.getMonth() + 1 < m || (h.getMonth() + 1 === m && h.getDate() < d)) ? 1 : 0);
}
export const isTeen = () => { const a = idade(); return a !== null && a < 18; };
/* ranking anônimo por padrão para adolescentes (se a pessoa ainda não escolheu) */
export const rankHidden = () => (typeof store.profile?.rankHide === 'boolean' ? store.profile.rankHide : isTeen());
