# Mapa do Braço

Escola de guitarra interativa: trilha de 27 aulas (mapa do braço, tríades, CAGED, pentatônica, blues, modos, metal/neoclássico e construção de solos), explorador do braço com som, licks e solos em tablatura, metrônomo, treino de velocidade, jam com bases e quizzes.

Funciona no navegador do PC e do celular, inclusive offline depois da primeira visita, e pode ser instalado como app na tela inicial.

## Estrutura

```
docs/                 site pronto (é isso que vai para o GitHub Pages)
  index.html          o app inteiro em um arquivo
  sw.js               modo offline
  manifest.webmanifest, icons/   instalação como app
mapa-do-braco.html    versão para publicar no Claude (progresso salvo na conta)
src/                  código-fonte
  style.css, body.html
  js/                 teoria, som, braço, tablatura, aulas, licks e telas
  pwa/                cabeçalho, manifesto e service worker do site
tools/icons.py        gera os ícones (precisa de Python com Pillow)
build.sh              monta docs/ e mapa-do-braco.html a partir de src/
.github/workflows/     publica docs/ automaticamente
```

## Usar no PC sem internet

Abra `docs/index.html` com dois cliques. Tudo funciona, só o modo offline e a instalação como app exigem o site publicado (https).

## Publicação

O app fica em **https://josuenino33.github.io/mapa-do-braco/**.

A publicação é automática: sempre que a pasta `docs/` muda na branch `main`, a automação em `.github/workflows/pages.yml` copia o conteúdo dela para a branch `gh-pages`, que é a que o GitHub Pages serve. Leva 1 ou 2 minutos para aparecer.

Se um dia o site sair do ar, confira em **Settings → Pages** do repositório se a fonte está como **Deploy from a branch**, branch `gh-pages`, pasta `/ (root)`.

## Instalar no celular

- **Android (Chrome):** abra o link, toque no menu ⋮ e em **Instalar app** (ou **Adicionar à tela inicial**).
- **iPhone (Safari):** abra o link, toque em **Compartilhar** e em **Adicionar à Tela de Início**.

Depois de aberto uma vez, o app funciona sem internet.

## Progresso

Fora do Claude o progresso fica salvo no próprio aparelho. Para levar de um aparelho para outro, use **Progresso → Exportar progresso** e depois **Importar backup** no outro aparelho.

## Alterar o conteúdo

As aulas ficam em `src/js/05-lessons-a.js` e `src/js/06-lessons-b.js`, e os licks em `src/js/07-licks.js`. A tablatura usa uma notação curta:

```
|e 3:5 3:7h 2:8b2r -
```

- `|q` `|e` `|s` `|t` `|h` `|w`: semínima, colcheia, semicolcheia, tercina, mínima, semibreve (`|q.` = pontuada).
- `corda:casa`, de 1 (Mi agudo) a 6 (Mi grave), mais a técnica: `h` hammer-on, `p` pull-off, `/` slide, `b2` bend de 1 tom, `b1` meio tom, `r` release, `~` vibrato, `m` palm mute.
- `x` no lugar da casa = nota abafada. `+` junta notas tocadas ao mesmo tempo. `-` = pausa.

Depois de editar, rode `bash build.sh` (no Windows, pelo Git Bash) e envie para o GitHub. O site se atualiza sozinho:

```bash
git add . && git commit -m "Atualiza aulas" && git push
```

## Dicas

- iPhone sem som: confira o volume. Em iOS antigos, a chave de silencioso também corta o som do app.
- O metrônomo, o treino de velocidade e o jam mantêm a tela acesa enquanto tocam.
