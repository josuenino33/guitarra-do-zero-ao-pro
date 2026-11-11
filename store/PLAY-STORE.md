# Publicar o Mapa do Braço na Play Store

## Textos da página do app

**Nome do app** (até 30 caracteres): Mapa do Braço: Guitarra

**Descrição curta** (até 80 caracteres): Aprenda guitarra do zero ao palco, com foco em louvor, tríades e solos.

**Descrição completa:**

Mapa do Braço é uma escola de guitarra completa no seu celular, do primeiro acorde até tocar na banda da igreja.

LOUVOR E WORSHIP
• Bases de worship para tocar junto: congregacional, balada 6/8, crescendo e ambiente com pad
• Acordes coloridos com cordas soltas (add9, 7M, sus, m7, m11) gerados para qualquer tom
• Frases de solo geradas na hora sobre a progressão, com delay pontilhado no tempo da música
• Trilha “Guitarra no louvor”: capotraste, tríades, dinâmica, swells, notas-alvo e tocar com a banda

TRÍADES
• Qualquer progressão em tríades nas cordas 1-2-3, 2-3-4 ou 3-4-5
• O app escolhe a inversão que deixa a mão andar o mínimo na troca
• Treino “Qual inversão?” para fixar as três inversões

REPERTÓRIO E PALCO
• O app ouve uma música no seu aparelho e encontra tom, andamento e acordes
• Tom do ministro com transposição e capotraste sugerido
• Modo Palco com acorde grande, avanço automático e pedal de virar página

E MAIS
• 94 aulas em 5 níveis, do zero ao profissional
• Braço interativo, escalas, CAGED, campo harmônico e dicionário de acordes
• Licks e solos com tablatura que toca e acompanha
• Metrônomo, afinador, treino de ritmo, de velocidade e de ouvido
• Funciona sem internet, sem cadastro e sem anúncios

**Categoria:** Educação · **Público-alvo:** 13 anos ou mais · **Contém anúncios:** não

**Política de privacidade (URL):** https://josuenino33.github.io/guitarra-do-zero-ao-pro/privacidade.html

## Imagens

- Ícone 512×512: `docs/icons/icon-512.png`
- Imagem de destaque 1024×500: `store/capa-1024x500.png`
- Capturas de tela do celular: `store/telas/` (6 telas, 1082×1922)

## Passo a passo

1. **Conta de desenvolvedor**: crie em play.google.com/console (taxa única de US$ 25, verificação de identidade).
2. **Chave e segredos no GitHub**: cadastre KEYSTORE_BASE64, KEYSTORE_PASSWORD, KEY_ALIAS e KEY_PASSWORD
   em Settings → Secrets and variables → Actions. A partir daí o workflow “App Android” gera o
   `MapaDoBraco.aab` assinado em Releases → App Android.
3. **Criar o app** no Play Console, preencher a página com os textos e imagens acima,
   a classificação de conteúdo, o público-alvo e a seção “Segurança dos dados”
   (o app não coleta nem compartilha dados; usa o microfone só no aparelho).
4. **Teste fechado**: contas pessoais novas precisam de um teste fechado com pelo menos
   12 testadores inscritos por 14 dias seguidos antes de pedir a publicação.
   Envie o `.aab` na faixa de teste fechado e compartilhe o link com amigos da igreja.
5. **Produção**: depois dos 14 dias, peça o acesso à produção no Play Console e envie para revisão.

Cada atualização: mude o site (docs/), faça o merge na main e baixe o novo `.aab` em Releases.
O número da versão sobe sozinho.
