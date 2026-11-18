/* Estado da interface (o que está selecionado na tela) */
import { todayKey, monthKey } from './utils.js';

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem('pauta.ui') || '{}');
  } catch {
    return {};
  }
})();

export const ui = {
  tab: saved.tab || 'hoje',
  person: saved.person || 'all',
  date: todayKey(),
  month: monthKey(todayKey()),
  monthSel: todayKey(),
  monthCompany: null,
  showAllTips: false,
};

export function saveUi() {
  try {
    localStorage.setItem('pauta.ui', JSON.stringify({ tab: ui.tab, person: ui.person }));
  } catch { /* ignore */ }
}
