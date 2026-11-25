/* Plano grátis a partir de 2027: até MAX lembretes ativos. Nada é apagado: o que passa do limite continua visível, só não avisa.
   Puro. O número não aparece em texto nenhum antes do anúncio (ANUNCIO). */
export const MAX = 20;
export const ANUNCIO = Date.UTC(2026, 11, 15, 3, 0, 0);
export const FUNDADORES_ATE = Date.UTC(2027, 1, 1, 3, 0, 0);
export const revelado = (now = Date.now()) => now >= ANUNCIO;
export const fundadoresAbertos = (now = Date.now()) => now < FUNDADORES_ATE;
/** ocupa vaga: lembrete do Pessoal futuro ou em aberto; repetido conta 1; aniversário não conta */
export const ativo = (it, hoje) => !!it && (!it.kind || it.kind === 'event') && it.cat !== 'aniversario' && (it.repeat && it.repeat !== 'none' ? !it.until || it.until >= hoje : !it.done);
export const ativos = (L, hoje) => L.filter((x) => ativo(x, hoje));
/** ids que ficam sem aviso (os mais novos que passaram do limite) */
export function semAviso(L, hoje, limitado) { if (!limitado) return new Set(); return new Set(ativos(L, hoje).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)).slice(MAX).map((x) => x.id)); }
/** pode criar (ou reabrir) este item? */
export const podeCriar = (L, item, hoje, limitado) => !limitado || !ativo(item, hoje) || ativos(L.filter((x) => x.id !== item.id), hoje).length < MAX;
export const textoLimite = (now = Date.now()) => (revelado(now) ? `O plano grátis tem até ${MAX} lembretes ativos. Conclua ou apague algum, ou assine.` : 'O plano grátis tem um limite de lembretes. Assine ou reduza os lembretes.');
