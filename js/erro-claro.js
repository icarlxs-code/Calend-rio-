/* Traduz os erros técnicos que chegam dos celulares para o Painel do dono, em português simples:
   o que aconteceu, onde, se trava o app e se já foi corrigido. Puro (sem tela): os testes conferem. */
const cmp = (a, b) => { const A = String(a || '0').split('.').map(Number), B = String(b || '0').split('.').map(Number); for (let i = 0; i < 3; i++) if ((A[i] || 0) !== (B[i] || 0)) return (A[i] || 0) > (B[i] || 0) ? 1 : -1; return 0; };

/* erros conhecidos: o que significam e em que versão foram corrigidos */
const CONHECIDOS = [
  { se: (e) => /can'?t find variable: x\b|\bx is not defined/i.test(e.msg) && /mensage|onMount/i.test(`${e.steps} ${e.where}`),
    oque: 'Na lista de Mensagens, alguns botões não funcionavam (arrastar a conversa para os lados, resultado da busca, "Encontrar amigos").', grav: 'incomoda', corrigido: '2.33.0' },
  { se: (e) => /\.then is not a function|'e\.then' is undefined/i.test(e.msg),
    oque: 'Ao fechar uma janela deslizando o dedo (Perfil, Minhas frases…), dava erro e a janela podia ficar travada na tela.', grav: 'trava', corrigido: '2.33.0' },
  { se: (e) => /payment_intent_data/.test(e.msg), oque: 'Erro ao assinar com cartão.', grav: 'trava', corrigido: '2.0.2' },
];
/* tipos de erro comuns, quando não é um conhecido */
const TIPOS = [
  { re: /^script error\.?$/i, oque: 'Erro de fora do app (tradução automática do navegador, extensão ou outro site). Não trava o Lembra.', grav: 'externo' },
  { re: /failed to fetch|networkerror|load failed|network request failed|internet|offline|timeout|tempo esgotado/i, oque: 'O celular da pessoa ficou sem internet na hora. Não é defeito do app.', grav: 'externo' },
  { re: /quota ?exceeded|storage|disk|espaço/i, oque: 'A memória do celular da pessoa está cheia.', grav: 'externo' },
  { re: /can'?t find variable|is not defined/i, oque: 'Uma parte do app tentou usar algo que não existe (defeito de programação).', grav: 'trava' },
  { re: /is not a function|undefined is not an object|cannot read propert|null is not an object|of undefined|of null/i, oque: 'Um botão ou tela tentou usar algo que ainda não tinha carregado (defeito de programação).', grav: 'incomoda' },
  { re: /permission|insufficient|denied|não autorizado/i, oque: 'O servidor recusou um pedido por falta de permissão.', grav: 'incomoda' },
];
const TELAS = { 'aba:hoje': 'tela Hoje', 'aba:calendario': 'Calendário', 'aba:empresas': 'Empresas', 'aba:ajustes': 'Ajustes', mensagens: 'Mensagens', privado: 'conversa', profile: 'Perfil', 'minhas-frases': 'Minhas frases',
  'pessoal:p-hoje': 'Pessoal › Hoje', 'pessoal:p-listas': 'Pessoal › Listas', 'pessoal:p-notas': 'Pessoal › Notas', acc: 'abriu um item', friends: 'Amigos', lixeira: 'Lixeira', plans: 'Planos', assistente: 'Assistente', ficha: 'Ficha' };
/** "# · aba:ajustes › acc › aba:hoje › profile" → "Ajustes › abriu um item › tela Hoje › Perfil" */
export function caminho(steps) {
  return String(steps || '').replace(/^#\s*·?\s*/, '').split(/\s*›\s*|\s*·\s*/).map((x) => x.trim()).filter((x) => x && x !== '#').map((x) => TELAS[x] || x.replace(/^aba:|^pessoal:p-/, '').replace(/-/g, ' ')).join(' › ');
}
const GRAV = { trava: '🔴 Atrapalha a pessoa', incomoda: '🟠 Incomoda, mas o app segue', externo: '⚪ Não é defeito do app' };

/** { titulo, oque, onde, gravidade, situacao, tecnico } */
export function explica(e, versaoAtual = '') {
  const k = CONHECIDOS.find((c) => c.se(e || {}));
  const t = k || TIPOS.find((x) => x.re.test(String(e?.msg || ''))) || { oque: 'Algo deu errado no celular da pessoa.', grav: 'incomoda' };
  let situacao = '';
  if (k && k.corrigido) situacao = cmp(e.ver, k.corrigido) < 0 ? `✅ Já corrigido na versão ${k.corrigido}. Some sozinho quando essas pessoas atualizarem o app.` : `⚠️ Voltou a acontecer mesmo depois da correção (versão ${e.ver}). Precisa olhar de novo.`;
  else if (versaoAtual && e?.ver && cmp(e.ver, versaoAtual) < 0 && t.grav !== 'externo') situacao = `Aconteceu na versão antiga ${e.ver}. Se não aparecer na ${versaoAtual}, já foi resolvido.`;
  const n = (e?.users || []).length;
  return {
    titulo: GRAV[t.grav], oque: t.oque, gravidade: t.grav,
    onde: caminho(e?.steps) || '—',
    quem: `${n || 1} pessoa${n > 1 ? 's' : ''} · ${e?.count || 1} vez${(e?.count || 1) > 1 ? 'es' : ''}${e?.dev ? ` · ${String(e.dev).replace('(app)', '(app instalado)')}` : ''}`,
    situacao, tecnico: `${e?.msg || ''}${e?.where ? ` — ${e.where}` : ''} · versão ${e?.ver || '?'}`,
  };
}
