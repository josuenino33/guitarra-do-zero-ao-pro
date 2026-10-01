/* ===== Trilha de aulas — módulos 1 a 4 ===== */
const MODULES = [
  { id:'m1', title:'O mapa do braço', tag:'Fundamentos', lessons:[
    { id:'afinacao', title:'Casas, cordas e a casa 12', min:8,
      body:`<p>A guitarra usa a mesma afinação padrão do violão: <b>Mi Lá Ré Sol Si Mi</b>, da corda 6 (mais grossa) para a corda 1. O que muda é o jeito de tocar: cordas mais finas, braço mais acessível até a casa 22 e muito mais solos acima da casa 5.</p>
<p>Cada casa sobe <b>meio tom</b>. Entre as notas naturais existe um tom inteiro, com duas exceções que você precisa decorar: <b>Mi→Fá</b> e <b>Si→Dó</b> ficam lado a lado, sem casa no meio.</p>
<p>Na <b>casa 12</b> tudo se repete uma oitava acima, com as mesmas notas das cordas soltas. Por isso ela tem a marcação dupla. Se você sabe as notas até a casa 11, sabe o braço inteiro.</p>`,
      demo:{ kind:'natural', strings:[0,5], views:[{label:'Cordas 6 e 1', strings:[0,5]},{label:'Todas as naturais', strings:[0,1,2,3,4,5]}] },
      tasks:['Toque a corda 6 casa por casa falando o nome da nota até a casa 12.','Ache os pares Mi–Fá e Si–Dó em cada corda.'],
      links:[{ to:'quiz', id:'qual-nota', label:'Quiz: qual é a nota?' }] },
    { id:'cordas65', title:'Notas nas cordas 6 e 5', min:10,
      body:`<p>As cordas 6 e 5 são as <b>âncoras</b> do braço. Quase todo desenho de acorde, escala e power chord começa com a tônica numa delas.</p>
<p>Use as marcações como referência: na corda 6, casa 3 = Sol, 5 = Lá, 7 = Si, 8 = Dó, 10 = Ré, 12 = Mi. Na corda 5, casa 3 = Dó, 5 = Ré, 7 = Mi, 8 = Fá, 10 = Sol, 12 = Lá.</p>
<p>Uma meta prática: dizer a nota de qualquer casa dessas duas cordas em menos de 2 segundos.</p>`,
      demo:{ kind:'natural', strings:[0,1] },
      tasks:['Faça o quiz “Ache a nota” só nas cordas 6 e 5 até acertar 10 de 10.','Fale em voz alta: Sol-3, Lá-5, Si-7, Dó-8 na corda 6.'],
      links:[{ to:'quiz', id:'ache-nota', label:'Quiz: ache a nota' }] },
    { id:'oitavas', title:'Desenhos de oitava', min:10,
      body:`<p>Uma oitava é a mesma nota, mais aguda. Na guitarra ela forma desenhos fixos que levam qualquer nota para o braço inteiro:</p>
<ul><li>Corda 6 → corda 4: <b>duas cordas acima, duas casas à frente</b>.</li>
<li>Corda 5 → corda 3: o mesmo desenho, duas casas à frente.</li>
<li>Corda 4 → corda 2 e corda 3 → corda 1: <b>três casas à frente</b>, por causa da corda Si.</li>
<li>Corda 6 → corda 1: mesma casa.</li></ul>
<p>Escolha uma nota e veja todas as posições dela. Esse é o primeiro passo para tocar em qualquer região do braço.</p>`,
      demo:{ kind:'note', root:'C', keySel:true },
      tasks:['Escolha uma nota por dia e toque todas as posições dela, de grave para agudo.','Com metrônomo a 60 BPM, toque a nota em uma corda por clique.'],
      links:[{ to:'quiz', id:'ache-nota', label:'Quiz: ache a nota' }] },
    { id:'cordasi', title:'A corda Si e o deslocamento', min:6,
      body:`<p>Todas as cordas vizinhas estão afinadas em <b>4ª justa</b> (5 casas), menos a dupla <b>Sol→Si</b>, que está em <b>3ª maior</b> (4 casas).</p>
<p>Na prática: qualquer desenho que cruza da corda 3 para a corda 2 anda <b>uma casa para a frente</b>. É por isso que escalas e tríades “quebram” naquele ponto. Quando um desenho parecer torto, confira se ele passa pela corda Si.</p>`,
      demo:{ kind:'interval', root:'G', s:2, f:5, ivs:[0,7,12,16,19], views:[{label:'Sem passar pela Si', s:1, f:5, root:'D'},{label:'Passando pela Si', s:2, f:5, root:'G'}] },
      tasks:['Toque a mesma oitava saindo da corda 5 e depois da corda 4 e compare os desenhos.'] },
  ]},
  { id:'m2', title:'Intervalos e power chords', tag:'Base do rock', lessons:[
    { id:'intervalos', title:'Intervalos como desenhos', min:12,
      body:`<p>Intervalo é a distância entre duas notas. Na guitarra, cada intervalo vira um <b>desenho</b> que funciona em qualquer tom. A partir de uma tônica na corda 6 ou 5:</p>
<ul><li><b>4ª justa</b>: mesma casa, corda de cima.</li>
<li><b>5ª justa</b>: corda de cima, duas casas à frente.</li>
<li><b>3ª maior</b>: corda de cima, uma casa para trás. <b>3ª menor</b>: duas casas para trás.</li>
<li><b>7ª menor</b>: duas cordas acima, mesma casa.</li>
<li><b>Oitava</b>: duas cordas acima, duas casas à frente.</li></ul>
<p>As cores das notas neste app seguem a função: <span class="dot iv-r"></span> tônica, <span class="dot iv-3"></span> terças, <span class="dot iv-5"></span> quintas, <span class="dot iv-7"></span> sétimas.</p>`,
      demo:{ kind:'interval', root:'A', s:0, f:5, ivs:[0,3,4,5,7,10,12], keySel:false, views:[{label:'Da corda 6', s:0, f:5, root:'A'},{label:'Da corda 5', s:1, f:3, root:'C'}] },
      tasks:['Ache a 3ª maior e a 3ª menor de Lá (corda 6, casa 5).','Faça o quiz de intervalos.'],
      links:[{ to:'quiz', id:'intervalo', label:'Quiz: intervalos' },{ to:'quiz', id:'ouvido', label:'Quiz: ouvido' }] },
    { id:'power', title:'Power chords e palm mute', min:12,
      body:`<p>O <b>power chord</b> tem só tônica e 5ª (às vezes a oitava). Sem a terça ele não é maior nem menor, por isso soa limpo mesmo com muita distorção. É a base do rock e do metal.</p>
<p>Desenho: tônica na corda 6 ou 5, 5ª na corda de cima duas casas à frente, oitava na corda seguinte também duas casas à frente.</p>
<p><b>Palm mute</b>: apoie a lateral da mão da palheta sobre as cordas, bem perto da ponte. O som fica curto e grave, o famoso “tchug”. Ative o timbre <b>Drive</b> nas configurações para ouvir o riff como numa guitarra distorcida.</p>`,
      demo:{ kind:'power', root:'E', s:0, keySel:true, views:[{label:'Tônica na corda 6', s:0},{label:'Tônica na corda 5', s:1}] },
      lick:'r3',
      tasks:['Toque o riff com palm mute a 80 BPM; suba 5 BPM quando sair limpo.','Troque entre E5, G5 e A5 sem olhar para a mão.'],
      links:[{ to:'treino', id:'r3', label:'Treinar o riff com metrônomo' }] },
  ]},
  { id:'m3', title:'Tríades', tag:'Gospel, funk, pop', lessons:[
    { id:'triade', title:'O que é uma tríade', min:8,
      body:`<p>Tríade é um acorde de 3 notas: <b>tônica, 3ª e 5ª</b>. A 3ª define o caráter:</p>
<ul><li><b>Maior</b> = tônica + 3ª maior + 5ª justa (alegre, aberto).</li>
<li><b>Menor</b> = tônica + 3ª menor + 5ª justa (melancólico).</li>
<li><b>Diminuta</b> = 3ª menor + 5ª diminuta. <b>Aumentada</b> = 3ª maior + 5ª aumentada.</li></ul>
<p>No violão você toca acordes de 5 ou 6 cordas. Na guitarra, principalmente em banda, as tríades em <b>três cordas vizinhas</b> soam mais definidas, não brigam com o baixo e o teclado e são a base de guitarra em louvor, funk e pop.</p>`,
      demo:{ kind:'triad', root:'C', quality:'maior', set:'123', inv:0, keySel:true, views:[{label:'Maior', quality:'maior'},{label:'Menor', quality:'menor'},{label:'Diminuta', quality:'dim'},{label:'Aumentada', quality:'aum'}] },
      tasks:['Toque as 4 tríades de Dó e escute a diferença.','Diga quais notas mudaram entre maior e menor (só a 3ª).'] },
    { id:'triade-123', title:'Tríades nas cordas 1-2-3', min:15,
      body:`<p>Toda tríade tem <b>3 inversões</b>, conforme a nota que fica embaixo:</p>
<ul><li><b>Fundamental</b>: a tônica embaixo (R-3-5).</li>
<li><b>1ª inversão</b>: a 3ª embaixo (3-5-R).</li>
<li><b>2ª inversão</b>: a 5ª embaixo (5-R-3).</li></ul>
<p>Nas cordas 1-2-3, as três inversões de um acorde maior cobrem o braço inteiro e depois se repetem a partir da casa 12. Decore os três desenhos e a posição da tônica em cada um. A tônica é a nota vermelha.</p>`,
      demo:{ kind:'triad', root:'G', quality:'maior', set:'123', inv:-1, keySel:true, views:[{label:'Todas', inv:-1},{label:'Fundamental', inv:0},{label:'1ª inv.', inv:1},{label:'2ª inv.', inv:2},{label:'Menor', inv:-1, quality:'menor'}] },
      tasks:['Toque as 3 inversões de Sol subindo e descendo o braço.','Repita em Ré e em Lá.','Faça o quiz de tríades.'],
      links:[{ to:'quiz', id:'triade', label:'Quiz: tríade e inversão' }] },
    { id:'triade-234', title:'Tríades nas cordas 2-3-4 e 3-4-5', min:15,
      body:`<p>O mesmo raciocínio vale para os outros grupos de cordas. Os desenhos mudam porque cada grupo tem uma relação diferente com a corda Si:</p>
<ul><li><b>Cordas 2-3-4</b>: a corda Si está em cima, então só o último salto anda uma casa.</li>
<li><b>Cordas 3-4-5</b> e <b>4-5-6</b>: nenhuma corda Si no caminho, os desenhos são “retos”.</li></ul>
<p>Dica de estudo: escolha uma região do braço (por exemplo, entre as casas 5 e 8) e ache a mesma tríade em todos os grupos de cordas sem sair dela.</p>`,
      demo:{ kind:'triad', root:'D', quality:'maior', set:'234', inv:-1, keySel:true, views:[{label:'2-3-4', set:'234'},{label:'3-4-5', set:'345'},{label:'4-5-6', set:'456'}] },
      tasks:['Ache Ré maior nas cordas 2-3-4 nas 3 inversões.','Fique entre as casas 5 e 8 e toque Ré maior em todos os grupos.'],
      links:[{ to:'quiz', id:'triade', label:'Quiz: tríade e inversão' }] },
    { id:'triade-prog', title:'Tríades numa progressão (I–V–vi–IV)', min:15,
      body:`<p>A progressão <b>I–V–vi–IV</b> (em Sol: G–D–Em–C) aparece em muitas músicas de louvor e pop. Em vez de pular de pestana em pestana, a guitarra escolhe a inversão <b>mais próxima</b> de cada acorde. Isso se chama <b>condução de vozes</b>.</p>
<p>No lick desta aula, os quatro acordes ficam entre as casas 5 e 9 nas cordas 1-2-3. Note como cada acorde muda poucas notas em relação ao anterior. Toque arpejado, com delay e reverb no pedal, e você tem uma base de guitarra de louvor.</p>`,
      demo:{ kind:'lick', lick:'g1' }, lick:'g1',
      tasks:['Toque o lick a 70 BPM e depois a 90 BPM.','Faça o mesmo caminho em Ré (D–A–Bm–G).'],
      links:[{ to:'treino', id:'g1', label:'Treinar com metrônomo' },{ to:'jam', id:'pop', label:'Tocar sobre a base I–V–vi–IV' }] },
  ]},
  { id:'m4', title:'Sistema CAGED', tag:'Organizar o braço', lessons:[
    { id:'caged', title:'As cinco formas', min:15,
      body:`<p>Você já conhece cinco acordes abertos do violão: <b>C, A, G, E e D</b>. O sistema CAGED usa esses cinco desenhos como formas móveis. Qualquer acorde maior pode ser tocado com cada uma delas, e elas se encaixam uma na outra ao longo do braço, sempre na ordem C→A→G→E→D (e recomeça).</p>
<p>Escolha uma tonalidade e passe pelas formas. Cada uma compartilha notas com a vizinha, e a tônica (vermelha) é o ponto de ligação. É isso que transforma o braço em um mapa contínuo em vez de pedaços soltos.</p>`,
      demo:{ kind:'caged', root:'C', quality:'maior', shape:'all', layer:'chord', keySel:true, views:[{label:'Todas', shape:'all'},{label:'C', shape:'C'},{label:'A', shape:'A'},{label:'G', shape:'G'},{label:'E', shape:'E'},{label:'D', shape:'D'}] },
      tasks:['Toque Dó maior nas 5 formas, uma após a outra, subindo o braço.','Repita em Sol e em Lá. Diga o nome da forma antes de tocar.'] },
    { id:'caged-menor', title:'CAGED menor', min:12,
      body:`<p>As mesmas cinco formas existem para acordes menores (Cm, Am, Gm, Em, Dm). A diferença está só na 3ª, que desce uma casa.</p>
<p>As formas de <b>Am</b> e <b>Em</b> são as mais usadas como pestana. A forma de <b>Dm</b> é ótima nas cordas agudas. As formas de Cm e Gm são mais difíceis como acorde, mas muito úteis como <b>mapa para solar</b>.</p>`,
      demo:{ kind:'caged', root:'A', quality:'menor', shape:'all', layer:'chord', keySel:true, views:[{label:'Todas', shape:'all'},{label:'C', shape:'C'},{label:'A', shape:'A'},{label:'G', shape:'G'},{label:'E', shape:'E'},{label:'D', shape:'D'}] },
      tasks:['Compare a forma de E maior e E menor no mesmo tom: qual nota mudou?'] },
    { id:'caged-arpejo', title:'Arpejos e pentatônica dentro do CAGED', min:15,
      body:`<p>Arpejo é tocar as notas do acorde uma por vez. Dentro de cada forma CAGED, as notas do acorde aparecem em todas as cordas, e é aí que mora o segredo de um solo melódico: <b>terminar as frases nas notas do acorde</b>.</p>
<p>Ligue a camada “Pentatônica”: a pentatônica maior aparece em volta de cada forma. Cada forma CAGED corresponde a uma das cinco caixas da pentatônica. Aprender um sistema ajuda o outro.</p>`,
      demo:{ kind:'caged', root:'G', quality:'maior', shape:'E', layer:'arp', keySel:true, views:[{label:'Acorde', layer:'chord'},{label:'Arpejo', layer:'arp'},{label:'Pentatônica', layer:'pent'}] },
      tasks:['Toque o arpejo da forma E de Sol, subindo e descendo.','Improvise na pentatônica e termine cada frase numa nota vermelha.'],
      links:[{ to:'jam', id:'pop', label:'Improvisar sobre uma base' }] },
  ]},
];
