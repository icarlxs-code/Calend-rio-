/* Sistema da marca Lembra — 4 versões, cada uma no lugar certo (para a pessoa gravar a marca sem cansar dela):
   1) COMPLETA (símbolo + "Lembra" + frase): primeiro contato — abertura, cadastro, login, termos, tela de planos.
      Ensina o nome e a promessa ("Seus compromissos, sempre lembrados").
   2) PALAVRA ("Lembra"): onde a pessoa já sabe onde está — rodapé dos Ajustes, comemorações, páginas.
   3) SÍMBOLO (calendário + sino): o sinal mais forte para a memória — ícone do app, carregando, notificação
      e, de propósito, junto da RECOMPENSA (o "Marcado!" ao lançar um compromisso, pagamento confirmado):
      a marca fica ligada à sensação de "resolvido" (condicionamento: ver o símbolo = alívio).
   4) LETRA ("L"): espaços pequenos — foto do "Suporte Lembra" no chat, selos e marcas d'água.
   Sempre na mesma forma e proporção (nunca esticar, nunca trocar a fonte): repetição consistente é o que fixa.
   Marca do Lembra: símbolo (calendário + sino), palavra "Lembra" ou as duas juntas com a frase.
   Branca em fundo escuro, preta em fundo claro — segue o tema do celular e o escolhido no app.
   on: 'auto' (decide pelo tema) | 'dark' (fundo sempre escuro) | 'light' (fundo sempre claro) */
export function brand(kind = 'completa', { cls = '', alt = 'Lembra', h = null, on = 'auto' } = {}) {
  const style = h ? ` style="height:${h}px"` : '';
  const img = (cor, extra) => `<img class="brand brand--${kind} ${extra} ${cls}" src="media/marca/${kind}-${cor}.png" alt="${alt}"${style} draggable="false">`;
  if (on === 'dark') return img('branco', '');
  if (on === 'light') return img('preto', '');
  return img('preto', 'brand--onlight') + img('branco', 'brand--ondark');
}
