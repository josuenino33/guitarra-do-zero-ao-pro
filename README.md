# Guitarra do zero ao pro

**Mapa do Braço** é uma escola de guitarra interativa, do zero ao profissional. Funciona no navegador do PC e do celular, inclusive offline depois da primeira visita, e pode ser instalado como app na tela inicial.

## O que tem

- **Hoje**: plano de estudo diário montado pelo seu nível e pelo tempo disponível, cronômetro por bloco, minutos da semana, desafio do dia e patente de músico (XP).
- **Trilha**: 94 aulas em 5 níveis (Iniciante, Básico, Intermediário, Avançado, Profissional), cada nível com prova prática.
  - Iniciante: guitarra e amplificador, postura, afinação, acordes abertos, trocas de acordes, primeira música, ritmo, tablatura e cifra.
  - Básico: mapa do braço, intervalos, power chords, pestana e formas móveis, levadas por estilo, leitura rítmica.
  - Intermediário: tríades e inversões, CAGED, pentatônica, blues e técnicas de expressão.
  - Avançado: harmonia (campo harmônico, tétrades, drop 2/drop 3, extensões), modos, metal/neoclássico, técnicas avançadas (tapping, híbrida, econômica, harmônicos, string skipping, legato) e partitura.
  - Profissional: solos, notas-alvo, arpejos de tétrades, menor melódica, escalas simétricas, jazz/fusion, timbre, pedais, regulagem, banda, estúdio, palco, estudo deliberado e transcrição.
- **Braço**: explorador de escalas, tríades, CAGED e arpejos em qualquer tom; dicionário de acordes com todas as formas; campo harmônico com progressões tocáveis.
- **Licks**: licks e solos de rock, blues, louvor, metal, técnicas avançadas e jazz; estudos e peças por nível (incluindo peças de domínio público); editor para criar os seus licks; loop A-B e prática com microfone.
- **Repertório**: suas músicas com tom, BPM, afinação, link e status, e setlist ordenado. Em **🎼 Acordes**, cada música ganha um álbum: o app analisa um áudio no próprio aparelho (tom, andamento e acordes compasso a compasso) ou você digita as cifras. Escolha o **tom do ministro** e o app transpõe, sugere o capotraste e mostra as formas worship; com o áudio carregado, o mapa acende junto com a música. O **🎤 Modo Palco** mostra o acorde atual em letras grandes, avança sozinho no andamento ou com pedal de virar página (Bluetooth) e percorre o setlist inteiro.
- **Treino**: metrônomo, treinador de levadas, trocas de acordes em 1 minuto, afinador, gravador e looper, treino de velocidade progressiva e Jam em qualquer tom com 11 estilos.
- **Quiz**: notas no braço, intervalos, tríades, ouvido e quizzes com microfone (o app escuta a guitarra).
- **Treino de ouvido** (aba dentro do Quiz): 6 exercícios em níveis, e cada rodada com 80% ou mais libera o próximo nível. São eles: intervalos (subindo, descendo e juntos), tipo de acorde (de maior/menor até tétrades), graus da escala com cadência, progressões, ouvir e achar a nota no braço e ditado melódico (clicando no braço ou tocando na guitarra com o microfone). O app guarda o que você mais erra, mostra esses pontos fracos e faz eles caírem mais vezes.
- **Tríades**: aba no Braço que monta qualquer progressão em tríades nas cordas 1-2-3, 2-3-4 ou 3-4-5, escolhendo a inversão que deixa a mão andar o mínimo (mostra quantas casas), toca em bloco ou arpejado com delay, lista as 3 inversões de cada acorde e tem o treino “Qual inversão?”. O Jam worship pode usar tríades agudas como guitarra base, e há a frase “Tríades arpejadas” e 3 licks de tríades.
- **Worship / louvor**: trilha **Guitarra no louvor** com 15 aulas (papel da guitarra, capo e as 5 formas, acordes coloridos, tríades nas cordas agudas, inversões e condução de vozes, tríades com corda solta, levadas, dinâmica, pads e swells, delay pontilhado, pentatônica maior, notas-alvo, resposta à voz, tocar com a banda e números de Nashville).
- **Worship / louvor**: em ⚙️ escolha o foco **Worship** e o app coloca o louvor na frente (Jam e Licks). O Jam ganhou 4 bases worship (congregacional, balada 6/8, crescendo com intro → verso → pré → refrão e ambiente só com pad), com pad de teclado, acordes coloridos gerados para o tom (7M(9), add9, m11, sus4…, com cordas soltas soando) e o tempo do delay de colcheia pontuada pelo andamento. No **Campo harmônico**, a opção **✨ Worship** mostra e toca essas formas em qualquer tom maior. Para solar: o Jam worship gera **frases** sobre a progressão no tom escolhido (ostinato com delay, melodia de alvos, nota longa + resposta e subida pro refrão), mostra a tablatura e toca junto com a base com **delay pontilhado** na guitarra. Em Licks, o estilo **Worship (frases)** traz 7 frases para estudar, também com o delay.
- **Progresso**: aulas, recordes, níveis do treino de ouvido, calendário, conquistas e backup.

Microfone (afinador, quizzes com microfone, ditado melódico tocando, prática de licks com microfone, gravador e looper) funciona na versão do site (https), não no link do Claude.

## Estrutura

```
docs/                 site pronto (é isso que vai para o GitHub Pages)
  index.html          o app inteiro em um arquivo
  sw.js               modo offline
  manifest.webmanifest, icons/   instalação como app
mapa-do-braco.html    versão para publicar no Claude (progresso salvo na conta)
src/                  código-fonte
  style.css, css/     estilos (base e componentes)
  body.html
  js/                 teoria, acordes, som, ritmo, microfone, braço, tablatura,
                      partitura, aulas, licks, estudos e telas
  pwa/                cabeçalho, manifesto e service worker do site
tools/icons.py        gera os ícones (precisa de Python com Pillow)
build.sh              monta docs/ e mapa-do-braco.html a partir de src/
.github/workflows/     publica docs/ automaticamente
```

## Usar no PC sem internet

Abra `docs/index.html` com dois cliques. Tudo funciona, só o modo offline e a instalação como app exigem o site publicado (https).

## Publicação

O app fica em **https://josuenino33.github.io/guitarra-do-zero-ao-pro/**.

A publicação é automática: sempre que a pasta `docs/` muda na branch `main`, a automação em `.github/workflows/pages.yml` copia o conteúdo dela para a branch `gh-pages`, que é a que o GitHub Pages serve. Leva 1 ou 2 minutos para aparecer.

Se um dia o site sair do ar, confira em **Settings → Pages** do repositório se a fonte está como **Deploy from a branch**, branch `gh-pages`, pasta `/ (root)`.

## Instalar no celular

- **Android (Chrome):** abra o link, toque no menu ⋮ e em **Instalar app** (ou **Adicionar à tela inicial**).
- **iPhone (Safari):** abra o link, toque em **Compartilhar** e em **Adicionar à Tela de Início**.

Depois de aberto uma vez, o app funciona sem internet.

## Progresso

Fora do Claude o progresso fica salvo no próprio aparelho. Para levar de um aparelho para outro, use **Progresso → Exportar progresso** e depois **Importar backup** no outro aparelho.

## Alterar o conteúdo

As aulas ficam em `src/js/05*-lessons-*.js` e `src/js/06-lessons-b.js` (os níveis em `05a-lessons-zero.js`), e os licks e estudos em `src/js/07*.js`. A tablatura usa uma notação curta:

```
|e 3:5 3:7h 2:8b2r -
```

- `|q` `|e` `|s` `|t` `|h` `|w`: semínima, colcheia, semicolcheia, tercina, mínima, semibreve (`|q.` = pontuada).
- `corda:casa`, de 1 (Mi agudo) a 6 (Mi grave), mais a técnica: `h` hammer-on, `p` pull-off, `/` slide, `b2` bend de 1 tom, `b1` meio tom, `r` release, `~` vibrato, `m` palm mute.
- `t` tapping e `n` harmônico natural.
- `x` no lugar da casa = nota abafada. `+` junta notas tocadas ao mesmo tempo. `-` = pausa.
- No lick: `meter: 3` para compasso 3/4, `pickup: 1` para anacruse e `swing: true` para colcheias balançadas.

Para conferir a teoria (caixas, posições, acordes, inversões, CAGED, campo harmônico, grafia das notas, licks e bases nos 12 tons), rode `node tools/auditoria.js`. Ele faz cerca de 18 mil verificações e deve terminar com 0 erros.

Depois de editar, rode `bash build.sh` (no Windows, pelo Git Bash) e envie para o GitHub. O site se atualiza sozinho:

```bash
git add . && git commit -m "Atualiza aulas" && git push
```

## Dicas

- iPhone sem som: confira o volume. Em iOS antigos, a chave de silencioso também corta o som do app.
- O metrônomo, o treino de velocidade e o jam mantêm a tela acesa enquanto tocam.

## Usar como app no celular

- **Instalar pelo navegador (PWA)**: abra o site no Chrome do celular, menu ⋮ → **Instalar app** (ou **Adicionar à tela inicial**). Fica com ícone, abre em tela cheia e funciona sem internet. Atualiza sozinho quando o site muda.
- **APK para Android**: a cada mudança em `docs/` na `main`, o GitHub Actions (`.github/workflows/android.yml`) gera o app com Capacitor e publica `MapaDoBraco.apk` em **Releases → App Android**. Para gerar no seu computador: `bash tools/android.sh` (precisa de Node 20, Java 21 e Android SDK).
