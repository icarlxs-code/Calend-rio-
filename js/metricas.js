/* Contas do painel do dono (puras, só números): hábito, ativação e retorno. Dias em America/Sao_Paulo. */
const F = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' });
export const diaDe = (ms) => F.format(new Date(ms));
export const mais = (k, n) => new Date(Date.parse(`${k}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
export const ehTeste = (u) => u.teste === true || (u.teste !== false && /@teste\.local$/i.test(u.email || ''));
export const filtra = (L, v) => (v === 'todas' ? L : L.filter((u) => ehTeste(u) === (v === 'teste')));
const taxa = (a, b) => ({ n: a, de: b, pct: b ? Math.round((a / b) * 100) : null, pequena: b < 5 });
export function metricas(L, now = Date.now()) {
  const hoje = diaDe(now), ini = mais(hoje, -6);
  const dias7 = (u) => new Set((u.activeDays || []).filter((d) => d >= ini && d <= hoje)).size, idade = (u) => (u.createdAt ? Math.round((Date.parse(`${hoje}T12:00:00Z`) - Date.parse(`${diaDe(u.createdAt)}T12:00:00Z`)) / 864e5) : 0);
  const dist = Array(8).fill(0); L.forEach((u) => dist[Math.min(7, dias7(u))]++);
  const eleg = L.filter((u) => idade(u) >= 2), fez = (u, n) => (u.activeDays || []).includes(mais(diaDe(u.createdAt), n));
  const d1 = L.filter((u) => u.createdAt && idade(u) >= 1), d7 = L.filter((u) => u.createdAt && idade(u) >= 7), a24 = L.filter((u) => u.createdAt && now - u.createdAt >= 864e5);
  const com = a24.filter((u) => u.firstEventAt), sem = a24.filter((u) => !u.firstEventAt && (u.counts?.myEvents || 0) + (u.counts?.personal || 0) > 0);
  return {
    wau3: eleg.filter((u) => dias7(u) >= 3).length, inelegiveis: L.length - eleg.length, wau: L.filter((u) => dias7(u) >= 1).length, media7: L.length ? L.reduce((a, u) => a + dias7(u), 0) / L.length : 0, dist: dist.slice(1),
    ativacao: taxa(com.filter((u) => u.firstEventAt - u.createdAt <= 864e5).length, a24.length - sem.length),
    estimativa: taxa(sem.filter((u) => (u.activeDays || []).includes(diaDe(u.createdAt))).length, sem.length),
    d1: taxa(d1.filter((u) => fez(u, 1)).length, d1.length), d7: taxa(d7.filter((u) => fez(u, 7)).length, d7.length),
    semana: taxa(d7.filter((u) => [1, 2, 3, 4, 5, 6, 7].some((n) => fez(u, n))).length, d7.length),
    zero: L.filter((u) => !((u.counts?.myEvents || 0) + (u.counts?.personal || 0))).length, semAviso: L.filter((u) => !(u.device?.notifications === 'granted' && u.device?.registered)).length,
    checkup: { permissao: L.filter((u) => u.device?.notifications === 'granted').length, teste: L.filter((u) => u.checkup?.enviado).length, chegou: L.filter((u) => u.checkup?.chegou === true).length, falhou: L.filter((u) => u.checkup?.chegou === false).length },
  };
}
/* ---------- enquete 2027 ---------- */
export const OPCOES = [['gratis', 'Grátis limitado'], ['essencial', 'Essencial'], ['profissional', 'Profissional'], ['fundadores', 'Fundadores']];
export function mostraEnquete({ teste, i = {}, aberturas = 0, criada = 0, now = Date.now() }) {
  if (teste || i.choice) return false;
  if (aberturas < 2 && !(criada && now - criada > 864e5)) return false;
  if (!i.dismissedAt) return !(i.shownAt && now - i.shownAt > 14 * 864e5);
  return (i.dismissals || 1) < 2 && now - i.dismissedAt >= 7 * 864e5 && now - i.dismissedAt < 14 * 864e5;
}
export function resumoEnquete(L, now = Date.now()) {
  const at = L.filter((u) => u.lastSeen && now - u.lastSeen < 7 * 864e5), r = L.filter((u) => u.intent2027?.choice), n = r.length;
  return { n, taxa: taxa(n, at.length), opcoes: OPCOES.map(([k, l]) => [l, r.filter((u) => u.intent2027.choice === k).length]), fundadores: r.filter((u) => u.intent2027.choice === 'fundadores').length, viram: L.filter((u) => u.intent2027?.shownAt).length, fecharam: L.filter((u) => u.intent2027?.dismissedAt && !u.intent2027?.choice).length, naoViram: L.filter((u) => !u.intent2027?.shownAt).length, indicativo: n < 10 };
}
