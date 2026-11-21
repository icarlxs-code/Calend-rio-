# Lembra nas lojas (Google Play e App Store) e atualizações

## 1. Atualizações: ninguém precisa reinstalar nada

O Lembra é um app da web instalado na tela de início (PWA). Ele se atualiza sozinho:

- **Ao abrir e ao voltar para o app**, ele confere o `version.json`. Se houver versão nova, recarrega sozinho em cerca de 2 segundos, sempre num momento em que a pessoa não está digitando.
- **Versão mínima (`"min"` no `release.json`)**: se a versão da pessoa estiver abaixo dela, aparece a tela "Atualização necessária" com um botão. Esse botão limpa a versão velha guardada no celular.
- **Painel do dono → Pessoas**: mostra a versão de cada pessoa ("v2.0.0 ✓" ou "desatualizada"), quando ela recebeu a versão e se já abriu o app depois da atualização. O botão **"Pedir para atualizar"** manda uma notificação; tocando nela, o app abre já atualizado.
- **Número da versão**: a cada mudança de estrutura, sobe o número em `release.json`:
  - `2.0.0` → `2.1.0` para novidade;
  - `2.1.0` → `2.1.1` para correção;
  - `3.0.0` para mudança grande.

  As "notes" desse arquivo aparecem uma vez para cada pessoa, em "Novidades".

Reinstalar o ícone só era necessário com versões antigas (antes da 2.0.0) presas no celular. Isso agora se resolve pelo botão "Pedir para atualizar" ou pela tela de atualização obrigatória.

## 2. Google Play (Android) — recomendado primeiro

**Como funciona:** o app da Play Store é uma "casca" (Trusted Web Activity) que abre o próprio site do Lembra em tela cheia, sem barra do navegador. Toda atualização do site chega na hora para quem baixou pela loja. Só é preciso mandar versão nova à loja quando mudar o ícone, o nome ou a casca.

**Custos e requisitos:**
1. Conta de desenvolvedor no Google Play Console: **US$ 25, uma vez só**.
2. **Domínio próprio** (ex.: `lembra.com.br`, cerca de R$ 40/ano no registro.br). O Android confere um arquivo em `https://SEU-DOMINIO/.well-known/assetlinks.json`. No endereço atual (`icarlxs-code.github.io/Calend-rio-/`) não dá para colocar esse arquivo na raiz. Depois de comprar o domínio, troque `siteUrl` no `config.js` e `SITE_URL`/`ALLOWED_ORIGINS` no `worker/wrangler.toml`.
3. Gerar o pacote no **PWABuilder** (pwabuilder.com, gratuito):
   1. cole o endereço do app;
   2. escolha "Android → Google Play";
   3. baixe o `.aab` e a chave de assinatura (**guarde a chave para sempre**).
4. Publique o `assetlinks.json` que o PWABuilder gera em `/.well-known/` do domínio.
5. No Play Console:
   - crie o app e envie o `.aab`;
   - preencha a ficha da loja (prints, descrição) e a política de privacidade (já existe em `/privacidade/`);
   - preencha a classificação etária.
   - Contas novas de pessoa física precisam de **teste fechado com 12 testadores por 14 dias** antes de publicar.

**Pagamentos:** pelas regras atuais do Google Play, assinatura vendida *dentro* do app da loja normalmente precisa usar o faturamento do Google (taxa de 15% em assinaturas). Há regras de pagamento alternativo em alguns países, e o Brasil tem acordo recente com o CADE, mas as condições locais ainda não estavam publicadas quando isto foi escrito. Antes de publicar, confira no Play Console e escolha uma destas opções:
- integrar o Google Play Billing na versão da loja (o PWABuilder tem suporte);
- usar o programa de faturamento alternativo, se estiver liberado para o Brasil.

## 3. App Store (iPhone)

**Custos:** Apple Developer Program, **US$ 99 por ano**.

**Atenção:** a Apple costuma recusar apps que são "só um site dentro de uma casca" (regra 4.2, funcionalidade mínima). Para passar, o app do iPhone precisa de recursos nativos:
- notificações pelo sistema da Apple (APNs);
- widget na tela de início com os compromissos do dia;
- atalhos.

O caminho é empacotar o Lembra com o **Capacitor**, trocando o aviso pela web (Web Push) pelo aviso nativo (APNs/FCM). O servidor de avisos precisa mandar para os dois tipos.

**Pagamentos no Brasil:** em 2026 a Apple anunciou mudanças no Brasil por acordo com o CADE. Elas permitem oferecer pagamento alternativo ou link para pagar no site, mas a compra pela Apple precisa continuar como opção, e a comissão máxima caiu. Confira as condições vigentes em developer.apple.com/br/support/app-distribution-in-brazil antes de publicar.

## 4. Ordem recomendada

1. **Agora:** continuar como app da web, que já se atualiza sozinho. Comprar o domínio.
2. **Depois:** Google Play pelo PWABuilder (barato e rápido; a mesma base de código).
3. **Por último:** App Store com Capacitor e avisos nativos (dá mais trabalho e tem custo anual).
