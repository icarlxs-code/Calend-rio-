# Textos e respostas prontos para as lojas (Fase 4)

E-mail oficial em tudo: **meulembra@gmail.com** · Site: **https://meulembra.com.br**
Política de privacidade: https://meulembra.com.br/privacidade/ · Termos: https://meulembra.com.br/termos/
Suporte: https://meulembra.com.br/suporte/ · Exclusão de conta: https://meulembra.com.br/excluir-conta/

---

## 1. App Store (Apple)

- **Nome (até 30):** `Lembra: Agenda e Lembretes`
- **Subtítulo (até 30):** `Trabalho e pessoal no lugar`
- **Texto promocional (até 170):** `O Lembra organiza o trabalho e a vida pessoal, avisa na hora certa e comemora cada compromisso cumprido. Com mascote, ofensiva e conquistas.`
- **Palavras-chave (até 100, sem repetir o nome):** `agenda,lembrete,compromissos,tarefas,rotina,organizador,calendario,produtividade,horario,habitos`
- **Descrição:**
```
O Lembra é a agenda que lembra de tudo por você — do trabalho e da vida pessoal.

AGENDA DE TRABALHO COM A CARA DA SUA PROFISSÃO
Mais de 200 profissões: os nomes, tipos de compromisso e dicas se adaptam ao seu trabalho. Clientes, locais, turmas ou obras organizados do seu jeito.

LEMBRETES NA HORA CERTA
Você responde uma ficha rápida e o Lembra calcula quantos avisos você precisa e quando. O que ficou pra trás aparece com nome, e você resolve com um toque: Feito ou Pra hoje.

MODO PESSOAL, SÓ SEU
Aniversários, contas, cuidados com você, listas e anotações. Ninguém mais vê.

O LEMBRA, SEU MASCOTE
Ele percebe o seu ritmo, lembra do que você anotou e comemora com você. Tudo calculado no seu próprio celular.

OFENSIVA, CONQUISTAS E AMIGOS
Ganhe XP, suba de nível e desbloqueie mais de 100 emblemas. Adicione amigos, poste a foto do que você concluiu (some em 24 horas) e veja quem cumpre mais o que marca.

ASSISTENTE COM INTELIGÊNCIA ARTIFICIAL (OPCIONAL)
Peça em português: "marca reunião amanhã às 14h". Só funciona se você autorizar, e você pode desligar quando quiser.

ASSINATURA
Teste grátis de 7 dias. Depois, plano Essencial ou Profissional, mensal ou anual, renovação automática; cancele quando quiser nos ajustes da sua conta Apple. Termos: https://meulembra.com.br/termos/ · Privacidade: https://meulembra.com.br/privacidade/
```

### Notas para o Revisor
```
Conta de demonstração: revisor.lembra@gmail.com / (senha no campo próprio). Plano liberado e agenda com dados de exemplo.

Como testar:
1. Hoje: compromissos do dia, cartão "ficou pra trás" com Feito / Pra hoje.
2. Toque no mascote (canto inferior): ele fala sobre a agenda e oferece ações reais.
3. Abra um compromisso concluído → "Postar story": abre a câmera (foto tirada na hora), visível só para amigos, some em 24 h.
4. Stories: três pontinhos → Denunciar (6 motivos) ou Bloquear. Perfil do amigo → "Denunciar ou bloquear".
5. Assistente (ícone de brilho): na 1ª vez aparece a tela de consentimento da IA (Cloudflare Workers AI/Meta Llama e Anthropic); cada resposta tem "Denunciar". Ajustes → Inteligência artificial desliga.
6. Excluir conta: Ajustes → Privacidade e dados → Excluir minha conta.
7. Assinatura: Ajustes → Seu plano → Compra no App; "Restaurar compras" na mesma tela.

Diferencial: agenda adaptada a mais de 200 profissões + modo pessoal privado + mascote que calcula padrões no aparelho (ex.: ritmo de corte de cabelo) + stories de compromissos concluídos.
Sem anúncios, sem rastreamento entre apps.
```

### Privacidade do app (App Privacy)
| Dado | Coletado | Vinculado à pessoa | Rastreamento | Finalidade |
|---|---|---|---|---|
| Nome, e-mail | Sim | Sim | Não | Funcionalidade do app, conta |
| Data de nascimento, CPF (hash para teste grátis), celular | Sim | Sim | Não | Funcionalidade, prevenção a fraude |
| Fotos (stories, foto de perfil) | Sim | Sim | Não | Funcionalidade (stories somem em 24 h) |
| Conteúdo do usuário (agenda, bilhetes) | Sim | Sim | Não | Funcionalidade |
| Interações (botões usados, contagens) | Sim | Sim | Não | Análise do app (próprio, sem terceiros) |
| Identificadores (token de notificação) | Sim | Sim | Não | Funcionalidade |
| Compras (situação da assinatura) | Sim | Sim | Não | Funcionalidade |
| Diagnóstico (erros) | Sim | Não | Não | Análise do app |
| Saúde (opções sensíveis da ficha, opcionais) | Sim | Sim | Não | Personalização, com consentimento |

### Classificação etária (questionário Apple) → resultado esperado **13+**
- Conteúdo gerado por usuário: **Sim** (stories entre amigos, com denúncia, bloqueio e moderação).
- Recursos sociais/mensagens: **Sim, limitados** (amigos aceitos; sem chat aberto, sem desconhecidos).
- Compartilhamento de localização: **Não**. Namoro/relacionamento: **Não**. Companheiro de IA romântico: **Não**.
- Apostas, violência, conteúdo sexual, drogas: **Não**. Compras no app: **Sim**.

## 2. Google Play

- **Título (até 30):** `Lembra: Agenda e Lembretes`
- **Descrição curta (até 80):** `Agenda de trabalho e pessoal que avisa na hora certa e comemora cada conquista.`
- **Descrição completa:** a mesma da Apple, trocando "ajustes da sua conta Apple" por "Google Play → Assinaturas".

### Segurança dos dados (Data safety)
| Tipo | Coletado | Compartilhado | Opcional | Finalidade | Criptografado em trânsito | Pode excluir |
|---|---|---|---|---|---|---|
| Nome, e-mail, ID do usuário | Sim | Não | Não | Funcionalidade, gerenciamento da conta | Sim | Sim |
| Data de nascimento, telefone | Sim | Não | Telefone sim | Funcionalidade, prevenção a fraude | Sim | Sim |
| Fotos | Sim | Não¹ | Sim | Funcionalidade (stories 24 h, foto de perfil) | Sim | Sim |
| Outros conteúdos (agenda, bilhetes) | Sim | Não¹ | Não | Funcionalidade | Sim | Sim |
| Interações no app | Sim | Não | Não | Análise | Sim | Sim |
| Diagnóstico / falhas | Sim | Não | Não | Análise | Sim | Sim |
| Histórico de compras | Sim | Não | Não | Funcionalidade | Sim | Sim |
| Informações de saúde (ficha, opcional) | Sim | Não | Sim | Personalização | Sim | Sim |

¹ Fornecedores que processam em nosso nome (Firebase, Cloudflare, IA com consentimento) não contam como "compartilhamento" pelas definições do Google.

### Conteúdo do app (Play Console)
- Público-alvo: **13 a 17 e 18+** (não é para crianças; não participa do programa Famílias).
- Anúncios: **Não**. Acesso ao app: conta de demonstração (a mesma da Apple).
- Apps de saúde: **Não** (não é app médico). Recursos financeiros: **Não**. Governo: **Não**.
- IARC: conteúdo gerado por usuário **Sim**, interação entre usuários **Sim**, compartilha localização **Não**, compras digitais **Sim**.

## 3. Capturas de tela (iPhone 6,9" e Android), nesta ordem
1. Hoje com o cartão "ficou pra trás" e o mascote — "O que ficou pra trás aparece com nome"
2. Editor com tipos da profissão — "Agenda com a cara da sua profissão"
3. Modo Pessoal — "Sua vida pessoal, só sua"
4. Ofensiva e emblemas — "Cada dia cumprido vira conquista"
5. Amigos e stories — "Mostre o que você fez (some em 24 h)"
6. Ranking — "Quem mais cumpre fica no topo"
Sem preços nas imagens. Só funções que existem.

## 4. Teste fechado do Google (12+ testadores × 14 dias) — mensagem-convite
```
Oi! Tô lançando o Lembra, uma agenda que lembra de tudo por você. Preciso de você no teste fechado do Google Play por 14 dias:
1) Entre neste link com o seu Gmail: [LINK DO TESTE]
2) Toque em "Tornar-se testador" e instale o app.
3) Use pelo menos 1 vez por dia (marque um compromisso, conclua outro) até [DATA FINAL].
Qualquer problema, me manda print. Valeu demais! 🙏
```
Cronograma: dia 0 envia para 15–20 pessoas · dias 1–14 lembrete a cada 3 dias · dia 15 pede acesso à produção.
Formulário de acesso à produção: "Testamos com N pessoas por 14 dias; ajustes feitos: [lista]; o app está pronto porque [estável, sem falhas no relatório de pré-lançamento]."

## 5. Checklist de console (na ordem)
1. Criar as contas (Apple US$ 99/ano · Google US$ 25). Na Apple, disponibilidade: **todos os países menos a União Europeia**.
2. Seguir `app-nativo/README.md` (gerar os apps, permissões, produtos e chaves).
3. App Store Connect: app → informações → privacidade (tabela acima) → classificação etária → preços (assinaturas) → capturas → Notas para o Revisor → enviar.
4. Play Console: app → Conteúdo do app (todas as declarações) → Segurança dos dados → loja → teste fechado (14 dias) → produção.
