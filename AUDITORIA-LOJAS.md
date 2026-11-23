# Auditoria pré-publicação — App Store e Google Play (rodada 1)

Data: 23/11/2026 · Base: o documento "Prompt de Auditoria Pré-Publicação" (regras conferidas em 23/11/2026).
Legenda: **[OK]** pronto · **[RISCO]** pode dar problema · **[BLOQUEIO]** rejeição provável · **[PERGUNTA]** preciso de resposta sua · **[N/A]** não se aplica.

---

## Fase 0 — Raio-X do app

| # | Item | O que existe hoje (evidência) |
|---|------|------|
| 1 | Tecnologia | App web instalável (PWA): HTML/CSS/JavaScript puro, empacotado com esbuild (`scripts/build.mjs` → `dist/`), hospedado em `meulembra.com.br` (GitHub Pages). **Ainda não existe binário** .ipa/.aab. Caminho recomendado: **Capacitor** (gera os dois apps a partir do mesmo código e permite notificação nativa, câmera nativa e compra no app). Para o Google, o PWABuilder/TWA também serve, mas o Capacitor resolve as duas lojas de uma vez. |
| 2 | Telas | Entrar/Criar conta, Ficha (7 etapas), Hoje (Trabalho), Calendário, Empresas/Clientes, Ajustes, Pessoal (Hoje, Agenda, Listas, Notas), Assistente, Perfil (Emblemas, Níveis, Ofensiva), Ranking, Amigos, Stories (visualizador), Quem visitou, Ficou pra trás, Planos, Agenda compartilhada, Suporte, Privacidade e dados, Painel do dono (só o dono). Nenhum "lorem ipsum"/"em breve" encontrado. |
| 3 | Dados | Conta (nome, e-mail, senha via Firebase Auth); ficha (nome completo, apelido, nascimento, CPF, celular opcional, profissão, rotina, dificuldades, tom); agenda, bilhetes, Pessoal (Firestore, Google); amigos, cartão público, stories (foto 24 h), visitas (7 dias), denúncias, endereço de notificação, uso agregado (Cloudflare KV); pagamento (Stripe, sem cartão no app). IA: pergunta + títulos/horários da agenda, só com consentimento. |
| 4 | Terceiros | Google Firebase (Auth, Firestore) · Cloudflare (Workers, KV, Workers AI/Llama da Meta) · Anthropic (Claude, opcional, no servidor) · Stripe (pagamentos) · Apple/Google (entrega de push). Sem analytics de terceiros e sem anúncios. |
| 5 | Permissões | Notificações (pedidas depois do cadastro, com explicação); Câmera (só ao tocar em "Postar story"); nada de localização, contatos ou microfone. |
| 6 | Conta | Cadastro com e-mail e senha obrigatório (agenda sincronizada). Sem login social. |
| 7 | Dinheiro | Assinatura digital (Essencial/Profissional mensal e anual, Fundadores vitalício, complemento Agenda compartilhada) **cobrada pela Stripe**. Teste grátis de 7 dias. |
| 8 | Conteúdo de usuário | Stories (fotos tiradas na hora, visíveis para amigos por 24 h), nome/foto no ranking e no perfil. IA gera texto (assistente e mensagens). |
| 9 | Público | Profissionais adultos; cadastro exige 13+ anos. Tem recursos sociais (amigos, stories, ranking). |
| 10 | Segredos | Nenhuma chave secreta no app: a chave do Firebase é pública por design (protegida pelas regras `firestore.rules`); chaves da IA e da Stripe ficam só no servidor (Cloudflare). **[OK]** |

---

## Fase 1 — Apple (resumo)

| Item | Regra | Status | O que foi feito / falta |
|---|---|---|---|
| App binário com SDK do iOS 26 | requisito técnico | **[BLOQUEIO]** | Falta empacotar com Capacitor e compilar no Xcode 26. |
| Funcionalidade mínima ("site embrulhado") | 4.2 | **[RISCO]** | Ao empacotar: notificações nativas (APNs), câmera nativa nos stories, widget do dia. O app já tem muito além de site: lembretes, mascote, ofensiva, stories. |
| Compra de assinatura | 3.1.1 / 3.1.2 | **[BLOQUEIO]** | Assinatura digital vendida dentro do app precisa da **Compra no App** da Apple (no Brasil, alternativa só nas regras do acordo com o CADE). Hoje é Stripe. Precisa: Compra no App + "Restaurar compras". |
| Conteúdo de usuário (stories) | 1.2 | **[OK]** | Denunciar story (6 motivos), bloquear pessoa, retirada automática após 2 denúncias, aviso ao dono, regras nos Termos (seção 6.1). |
| IA de terceiros | 5.1.2(i) | **[OK]** | Tela de consentimento nomeando Cloudflare/Meta e Anthropic, antes do 1º envio; revogável em Ajustes; sem consentimento nada é enviado (app e servidor). |
| Botão "Denunciar" em resposta de IA | 1.2 / IA | **[RISCO]** | Falta um "Denunciar resposta" no assistente. Próxima rodada. |
| Excluir conta dentro do app | 5.1.1(v) | **[OK]** | Ajustes → Privacidade e dados → Excluir minha conta (apaga também amigos, stories e visitas). |
| Política de privacidade no app e sem login | 5.1.1(i) | **[OK]** | `/privacidade/` (atualizada: amigos, stories, IA), `/termos/`, `/suporte/`, `/excluir-conta/`. |
| Notificações não obrigatórias | 4.5.4 | **[OK]** | O app funciona sem elas; explica como ativar. |
| Frases de permissão (Info.plist) | 5.1.1 | **[RISCO]** | Ao empacotar: `NSCameraUsageDescription`: "O Lembra usa a câmera para você tirar a foto do story do compromisso que concluiu." |
| Conta de demonstração para o revisor | 2.1 | **[PERGUNTA]** | Preciso criar uma conta de teste com plano liberado e dados de exemplo. |
| iPad | 2.4.1 | **[RISCO]** | Layout é de celular; recomendo declarar só iPhone no início. |

## Fase 2 — Google Play (resumo)

| Item | Status | Observação |
|---|---|---|
| .aab com targetSdk 36 | **[BLOQUEIO]** | Falta empacotar (Capacitor ou PWABuilder/TWA). |
| Google Play Faturamento | **[BLOQUEIO]** | Mesma questão da Apple: assinatura digital vendida no app. |
| Exclusão de conta por link web | **[OK]** | `https://meulembra.com.br/excluir-conta/` (nova). |
| Conteúdo de usuário: denúncia e bloqueio | **[OK]** | Igual à Apple. |
| Teste fechado 12 testadores × 14 dias | **[PERGUNTA]** | Conta pessoal nova: obrigatório. |
| Segurança dos dados (formulário) | **[PERGUNTA]** | Texto pronto depois das respostas abaixo. |

## Fase 3 — Comuns

| Item | Status | Observação |
|---|---|---|
| LGPD (dados, base legal, retenção, direitos, contato) | **[OK]** | Política 1.2. |
| ECA Digital (menores) | **[RISCO]** | Cadastro aceita 13+; com stories e ranking, recomendo **16+** ou modo protegido para menores (sem stories e sem ranking público). |
| HTTPS, sem segredos no app, regras do banco fechadas | **[OK]** | — |
| Sem internet / permissão negada / listas vazias | **[OK]** | Telas tratadas (testadas em rodadas anteriores). |

---

## Perguntas para você (respondidas, começo a Fase 4 completa)

1. **Pagamento nas lojas:** quer usar a **Compra no App** da Apple e o **Faturamento do Google** dentro dos apps (taxa de 15% em assinaturas no 1º ano de pequeno desenvolvedor), mantendo a Stripe só no site? (É o caminho mais seguro para aprovação.)
2. **Idade mínima:** subimos para **16 anos** (por causa dos stories e do ranking) ou mantemos 13 com stories/ranking desligados para menores de 16?
3. **Empacotamento:** posso preparar o projeto **Capacitor** (iOS + Android) com notificação nativa e câmera nativa? Você vai precisar de um Mac com Xcode 26 para gerar o app do iPhone (ou um serviço de build na nuvem).
4. **Contas de desenvolvedor:** já tem Apple Developer (US$ 99/ano) e Google Play Console (US$ 25)? Em nome de pessoa física?
5. **União Europeia:** concorda em deixar a UE fora da distribuição no início (evita expor endereço/telefone como "trader")?
6. **Conta de demonstração:** posso criar `revisor@meulembra.com.br` com plano liberado e dados de exemplo para os revisores?
7. **E-mail de privacidade/suporte** que vai nas lojas: o mesmo de hoje (`CONFIG.contactEmail`)?
8. **Testadores do Google (12+ por 14 dias):** você tem 15–20 pessoas para o teste fechado?

## O que já foi corrigido nesta rodada (no código, publicado)
- Consentimento de IA (tela + Ajustes + bloqueio no servidor) — Apple 5.1.2(i), Google IA, LGPD.
- Denunciar story e bloquear pessoa, com retirada automática — Apple 1.2, Google conteúdo de usuário.
- Exclusão de conta apaga amigos/stories/visitas; página web `/excluir-conta/` — Apple 5.1.1(v), Google exclusão de conta.
- Página `/suporte/` — Apple 1.5.
- Termos e Privacidade 1.2 (amigos, stories 24 h, visitas 7 dias, mascote lendo bilhetes só no aparelho, provedores de IA).
