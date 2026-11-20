/* Marca do Lembra: símbolo (calendário + sino), palavra "Lembra" ou as duas juntas com a frase.
   Branca em fundo escuro, preta em fundo claro — segue o tema do celular e o escolhido no app.
   on: 'auto' (decide pelo tema) | 'dark' (fundo sempre escuro) | 'light' (fundo sempre claro) */
export function brand(kind = 'completa', { cls = '', alt = 'Lembra', h = null, on = 'auto' } = {}) {
  const style = h ? ` style="height:${h}px"` : '';
  const img = (cor, extra) => `<img class="brand brand--${kind} ${extra} ${cls}" src="media/marca/${kind}-${cor}.png" alt="${alt}"${style} draggable="false">`;
  if (on === 'dark') return img('branco', '');
  if (on === 'light') return img('preto', '');
  return img('preto', 'brand--onlight') + img('branco', 'brand--ondark');
}
