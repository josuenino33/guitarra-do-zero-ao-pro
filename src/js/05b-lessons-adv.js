/* ===== Nível 4: harmonia e técnicas avançadas ===== */
MODULES.push(
  { id:'harm', level:4, order:1, title:'Harmonia', tag:'Acordes e campo harmônico', lessons:[
    { id:'campo', title:'O campo harmônico maior', min:15,
      body:`<p>Se você empilhar terças sobre cada nota da escala maior (pulando uma nota da escala), surgem os <b>7 acordes do tom</b>. Em Dó: <b>C Dm Em F G Am B°</b>.</p>
<p>A sequência <b>maior, menor, menor, maior, maior, menor, diminuto</b> vale para qualquer tom. Por isso a harmonia usa números romanos: <b>I ii iii IV V vi vii°</b> (maiúsculo = maior). “Um quatro cinco” é a mesma ideia em Dó, em Sol ou em Mi.</p>
<p>Troque o tom abaixo e toque cada grau. A maioria das músicas que você conhece usa só esses acordes.</p>`,
      demo:{ kind:'campo', root:'C', scale:'maior' },
      tasks:['Toque o campo de Dó, de Sol e de Ré em sequência, dizendo o grau.','Pegue uma música que você toca e escreva os graus dos acordes.'] },
    { id:'tetrades', title:'Tétrades: 7M, m7, 7 e m7(b5)', min:15,
      body:`<p>Empilhando mais uma terça, cada acorde ganha a <b>sétima</b>. O campo maior em tétrades fica <b>I7M ii7 iii7 IV7M V7 vi7 viiø</b>. Em Dó: C7M Dm7 Em7 F7M G7 Am7 Bm7(b5).</p>
<ul><li><b>7M</b>: som aberto e sonhador (bossa nova, MPB, neo soul).</li>
<li><b>m7</b>: menor mais suave.</li>
<li><b>7</b> (dominante): tensão que pede resolução; a base do blues.</li>
<li><b>m7(b5)</b> ou ø: menor com quinta diminuta, comum antes do V em tons menores.</li></ul>`,
      demo:{ kind:'campo', root:'C', scale:'maior', tetrads:true },
      tasks:['Toque as 7 tétrades de Dó.','Compare C e C7M, Am e Am7: o que muda no som?'] },
    { id:'funcoes', title:'Funções e o ii–V–I', min:15,
      body:`<p>Cada grau tem uma <b>função</b>:</p>
<ul><li><b>Tônica</b> (I, iii, vi): repouso, sensação de casa.</li>
<li><b>Subdominante</b> (ii, IV): afasta da tônica.</li>
<li><b>Dominante</b> (V, vii°): tensão que pede a volta para o I.</li></ul>
<p>A tensão do V7 vem do <b>trítono</b> entre a 3ª e a 7ª do acorde (em G7: Si e Fá), que resolve em Dó e Mi. A progressão <b>ii–V–I</b> (Dm7–G7–C7M) é a mais importante do jazz, da bossa e do gospel. Aprenda a tocá-la em todos os tons.</p>`,
      demo:{ kind:'campo', root:'G', scale:'maior', tetrads:true, prog:'ii-V-I' },
      tasks:['Toque ii–V–I em Dó, Sol e Fá.','No Jam ii–V–I, solte arpejos de cada acorde.'],
      links:[{ to:'jam', id:'iivi', label:'Jam: ii–V–I em Sol' }] },
    { id:'progressoes', title:'Progressões que todo músico usa', min:15,
      body:`<p>Algumas sequências de graus aparecem em milhares de músicas. Reconhecer de ouvido é uma das habilidades mais úteis para tocar com outras pessoas:</p>
<ul><li><b>I–V–vi–IV</b>: pop e louvor. <b>vi–IV–I–V</b>: a mesma, começando no menor.</li>
<li><b>I–vi–IV–V</b>: anos 50 e baladas. <b>I–IV–V</b>: rock, blues e sertanejo.</li>
<li><b>ii–V–I</b>: jazz e bossa. <b>i–♭VII–♭VI–♭VII</b>: rock e metal em tom menor.</li></ul>
<p>Escolha uma progressão abaixo, ouça e toque junto em vários tons.</p>`,
      demo:{ kind:'campo', root:'D', scale:'maior', prog:'I-V-vi-IV' },
      tasks:['Toque cada progressão em 3 tons diferentes.','Ouça 3 músicas e diga qual progressão elas usam.'] },
    { id:'menor-campo', title:'Campo harmônico menor', min:15,
      body:`<p>O campo da <b>menor natural</b> é <b>i ii° ♭III iv v ♭VI ♭VII</b> (em Lá: Am B° C Dm Em F G). São os mesmos acordes do campo maior relativo, com outro centro.</p>
<p>Na <b>menor harmônica</b> a 7ª sobe meio tom e o v vira <b>V maior</b> (E e E7 em Lá menor). Isso cria uma resolução muito mais forte para o i, típica do metal neoclássico, do tango e de muitas músicas gospel em tom menor.</p>`,
      demo:{ kind:'campo', root:'A', scale:'menor', views:[{ label:'Menor natural', scale:'menor' },{ label:'Menor harmônica', scale:'menor_harm' }] },
      tasks:['Toque Am–Dm–Em–Am e depois Am–Dm–E–Am. Ouça a diferença do E maior.'] },
    { id:'drop2', title:'Voicings drop 2 e drop 3', min:20,
      body:`<p>Uma tétrade “fechada” (as 4 notas dentro de uma oitava) é difícil de tocar na guitarra. A solução são os <b>voicings abertos</b>:</p>
<ul><li><b>Drop 2</b>: a segunda nota mais aguda desce uma oitava. Fica em 4 cordas vizinhas (5-4-3-2 ou 4-3-2-1). É o som clássico da guitarra de jazz e de bossa.</li>
<li><b>Drop 3</b>: a terceira nota mais aguda desce uma oitava. A tônica fica na corda 6 e a corda 5 não toca.</li></ul>
<p>No dicionário abaixo, troque o tom e o tipo de acorde e veja todas as formas no braço.</p>`,
      demo:{ kind:'dict', root:'C', q:'maj7' },
      tasks:['Toque Dm7–G7–C7M só com drop 2 nas cordas 5 a 2.','Faça o mesmo com drop 3, tônica na corda 6.'],
      links:[{ to:'acordes', label:'Abrir o dicionário de acordes' }] },
    { id:'extensoes', title:'Extensões e alterações: 9, 11, 13, ♭9 e ♯9', min:20,
      body:`<p>Continuando a empilhar terças passamos da oitava: <b>9</b> (= 2), <b>11</b> (= 4) e <b>13</b> (= 6). Elas colorem o acorde sem mudar a função. Na guitarra, quase sempre tiramos a 5ª (ou até a tônica, se o baixo tocar) para caber nos dedos.</p>
<p>No acorde dominante podemos <b>alterar</b> a 9ª e a 5ª: ♭9, ♯9, ♭5, ♯5. Elas aumentam a tensão antes da resolução. O <b>7(♯9)</b> é o “acorde do Hendrix”, ouvido em muito rock e funk.</p>`,
      demo:{ kind:'dict', root:'G', q:'nine', views:[{ label:'9', q:'nine' },{ label:'13', q:'thirteen' },{ label:'7(♭9)', q:'b9' },{ label:'7(♯9)', q:'s9' },{ label:'m9', q:'m9' },{ label:'7M(9)', q:'maj9' }] },
      tasks:['Toque G7 → G9 → G13 e ouça a cor de cada um.','Use E7(♯9) num riff de funk ou rock.'] },
  ]},
  { id:'tec', level:4, order:4, title:'Técnicas avançadas', tag:'Mãos de profissional', lessons:[
    { id:'tapping', title:'Tapping', min:20,
      body:`<p>No <b>tapping</b> a mão direita também aperta notas no braço. O dedo médio (ou indicador) “bate” firme na casa e depois puxa a corda para o lado, fazendo soar a nota que a mão esquerda está segurando.</p>
<p>O padrão clássico é em tercinas: <b>t</b> (mão direita) → <b>p</b> (pull-off para a mão esquerda) → <b>h</b> (hammer-on). Mudando as notas, você toca arpejos amplos que seriam impossíveis com uma mão só.</p>`,
      demo:{ kind:'lick', lick:'tap1' }, lick:'tap1',
      tasks:['Só a primeira tercina, devagar, até as três notas terem o mesmo volume.','Lick completo a 60 BPM, depois 80.'],
      links:[{ to:'treino', id:'tap1', label:'Treino de velocidade' }] },
    { id:'hibrida', title:'Palhetada híbrida', min:20,
      body:`<p>Na <b>palhetada híbrida</b> a palheta toca as cordas graves e os dedos médio e anelar puxam as agudas. Dá para tocar notas em cordas distantes ao mesmo tempo, como no violão dedilhado, sem largar a palheta.</p>
<p>É essencial no country, muito usada no pop, no gospel e no rock moderno. Comece com o padrão do lick: palheta, médio, anelar, médio.</p>`,
      demo:{ kind:'lick', lick:'hib1' }, lick:'hib1',
      tasks:['Só a mão direita nas cordas soltas, no mesmo padrão.','Lick completo a 70 BPM.'] },
    { id:'economica', title:'Palhetada econômica', min:20,
      body:`<p>Na palhetada alternada a palheta sempre alterna baixo e cima. Na <b>econômica</b>, quando você muda para a próxima corda <b>na mesma direção</b> do movimento, a palheta continua o movimento (como um mini sweep) em vez de voltar.</p>
<p>Em escalas de 3 notas por corda subindo: <b>↓↑↓ ↓↑↓</b>… a terceira palhetada de uma corda e a primeira da seguinte saem num movimento só. Fica mais rápido e mais leve, mas exige rigor no tempo.</p>`,
      demo:{ kind:'lick', lick:'ex-3nps' }, lick:'ex-3nps',
      tasks:['Escala maior 3NPS subindo com palhetada econômica e descendo com alternada.','Compare a velocidade máxima limpa das duas.'],
      links:[{ to:'treino', id:'ex-3nps', label:'Treino de velocidade' }] },
    { id:'harmonicos', title:'Harmônicos naturais e artificiais', min:15,
      body:`<p>Os <b>harmônicos naturais</b> (escritos &lt;12&gt;) soam como sininhos: encoste o dedo sem apertar exatamente em cima do traste 12, 7 ou 5 e solte logo após palhetar.</p>
<p>O <b>harmônico artificial</b> (ou <i>pinch harmonic</i>) é aquele “grito” do rock e do metal: segure a palheta com pouca ponta para fora e deixe a lateral do polegar raspar a corda logo depois da palhetada. Funciona melhor com distorção e captador da ponte. A posição da mão direita muda a nota do harmônico: procure o ponto que mais grita.</p>`,
      demo:{ kind:'lick', lick:'harm1' }, lick:'harm1',
      tasks:['Harmônicos nas casas 12, 7 e 5 de todas as cordas.','Com drive, procure o pinch harmonic na corda 3, casa 7.'] },
    { id:'skipping', title:'String skipping: pulando cordas', min:15,
      body:`<p>Tocar pulando cordas abre intervalos maiores e dá um som menos “escala para cima e para baixo”. O desafio é <b>abafar</b> as cordas que você pula e acertar a palheta sem olhar.</p>
<p>O lick desta aula toca a pentatônica em <b>oitavas</b>: a mesma nota duas vezes, uma corda pulada no meio.</p>`,
      demo:{ kind:'lick', lick:'skip1' }, lick:'skip1',
      tasks:['Lick a 70 BPM sem deixar a corda do meio soar.','Crie a mesma ideia com a escala maior.'] },
    { id:'legato-avancado', title:'Legato avançado e trinados', min:20,
      body:`<p>No legato quase todas as notas saem da mão esquerda. Para soar igual à palhetada, o <b>hammer-on</b> precisa ser rápido e firme e o <b>pull-off</b> deve puxar a corda levemente para baixo, quase “palhetando” com o dedo.</p>
<p>O <b>trinado</b> (alternar rápido duas notas) é o melhor exercício de força e independência. Faça em todos os pares de dedos: 1-2, 1-3, 1-4, 2-3, 2-4, 3-4.</p>`,
      demo:{ kind:'lick', lick:'trill1' }, lick:'trill1',
      tasks:['30 segundos de trinado por par de dedos.','Lick de legato em 3 notas por corda a 80 BPM.'],
      links:[{ to:'licks', id:'m4', label:'Legato em 3 notas por corda' }] },
    { id:'vibrato-bend', title:'Bend e vibrato de profissional', min:20,
      body:`<p>Bend afinado e vibrato controlado são o que mais diferencia um guitarrista experiente:</p>
<ul><li><b>Bend afinado</b>: toque a nota-alvo antes, depois faça o bend e compare. Pratique ½ tom, 1 tom e 1 tom e meio.</li>
<li><b>Pré-bend</b>: suba a corda sem tocar, palhete e solte devagar.</li>
<li><b>Vibrato</b>: escolha a largura (estreito e rápido, ou largo e lento) e mantenha regular, no tempo da música.</li>
<li><b>Bend em uníssono</b>: uma corda sobe até soar igual à outra parada.</li></ul>`,
      demo:{ kind:'lick', lick:'b2' }, lick:'b2',
      tasks:['10 bends de 1 tom conferindo com a nota-alvo.','Vibrato no tempo: 2 oscilações por tempo a 80 BPM.'],
      links:[{ to:'licks', id:'r4', label:'Lick com bend em uníssono' }] },
  ]},
);
