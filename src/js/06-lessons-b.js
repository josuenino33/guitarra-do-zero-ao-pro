/* ===== Trilha de aulas — módulos 5 a 8 ===== */
MODULES.push(
  { id:'m5', title:'Pentatônica e blues', tag:'Rock e blues', lessons:[
    { id:'pent1', title:'Pentatônica menor: caixa 1', min:15,
      body:`<p>A pentatônica menor tem 5 notas: <b>R, ♭3, 4, 5, ♭7</b>. É a escala mais usada em solos de rock e blues, porque quase não tem nota “errada” sobre acordes menores e sobre o blues.</p>
<p>A <b>caixa 1</b> é o desenho com a tônica na corda 6 sob o dedo 1. Em Lá, fica na casa 5: duas notas por corda, dedos 1 e 4 nas cordas 6, 2 e 1 e dedos 1 e 3 nas cordas 5, 4 e 3.</p>
<p>Use <b>palhetada alternada</b> (baixo, cima, baixo, cima) desde o primeiro dia. Velocidade vem depois. Comece no metrônomo a 60 BPM em colcheias.</p>`,
      demo:{ kind:'scale', scale:'pent_menor', root:'A', pos:0, keySel:true, views:[{label:'Intervalos', labels:'iv'},{label:'Notas', labels:'note'}] },
      lick:'r1',
      tasks:['Suba e desça a caixa 1 a 60 BPM, palhetada alternada.','Toque o lick de tercinas devagar e suba 5 BPM por dia.'],
      links:[{ to:'treino', id:'ex-pent', label:'Treino de velocidade da caixa 1' }] },
    { id:'pent5', title:'As cinco caixas', min:20,
      body:`<p>A pentatônica tem <b>5 caixas</b>, uma começando em cada nota da escala na corda 6. Em cada corda, a nota mais aguda de uma caixa é a nota mais grave da caixa seguinte, então elas se encaixam como peças e cobrem o braço todo.</p>
<p>A forma mais rápida de ligar as caixas é pela <b>tônica</b>: ache a nota vermelha em cada desenho. As caixas 1 e 2 (casas 5 a 10 em Lá) são as mais usadas, e a caixa 4 aparece muito em solos clássicos na região da casa 12 e acima.</p>`,
      demo:{ kind:'scale', scale:'pent_menor', root:'A', pos:0, keySel:true, views:[{label:'Caixa 1', pos:0},{label:'Caixa 2', pos:1},{label:'Caixa 3', pos:2},{label:'Caixa 4', pos:3},{label:'Caixa 5', pos:4},{label:'Braço inteiro', pos:-1}] },
      tasks:['Aprenda uma caixa nova por semana.','Toque a caixa 1 e deslize para a caixa 2 sem parar.'],
      links:[{ to:'jam', id:'rock', label:'Improvisar sobre Am–G–F–G' }] },
    { id:'pentmaior', title:'Pentatônica maior e a relativa', min:12,
      body:`<p>A pentatônica maior (<b>R, 2, 3, 5, 6</b>) usa exatamente os <b>mesmos desenhos</b> da menor. Só muda qual nota é a tônica.</p>
<p>Regra prática: a pentatônica menor de Lá tem as mesmas notas da pentatônica maior de Dó. Para tocar a pentatônica <b>maior</b> de um tom, use o desenho da <b>menor</b> com a tônica <b>3 casas abaixo</b>. Sol maior = desenho de Mi menor (casa 3 → casa 0, ou casa 15 → casa 12).</p>
<p>A pentatônica maior soa mais alegre, aberta e “country/gospel”. Em louvor e soul, ela aparece misturada com tríades e sextas.</p>`,
      demo:{ kind:'scale', scale:'pent_maior', root:'C', pos:4, keySel:true, views:[{label:'Dó maior', root:'C', scale:'pent_maior'},{label:'Lá menor', root:'A', scale:'pent_menor', pos:0}] },
      lick:'g4',
      tasks:['Toque a mesma caixa pensando em Lá menor e depois em Dó maior: termine as frases em notas diferentes.'] },
    { id:'blues', title:'Escala blues e a blue note', min:12,
      body:`<p>A escala blues é a pentatônica menor com uma nota a mais: a <b>♭5</b>, chamada de <b>blue note</b>. Ela é uma nota de passagem: soa tensa parada, e linda quando você passa por ela indo para a 4ª ou para a 5ª.</p>
<p>Na caixa 1 em Lá, a blue note (Ré♯/Mi♭) aparece na corda 5, casa 6, e na corda 3, casa 8. Toque o lick desta aula e preste atenção no “gemido” do slide até ela.</p>`,
      demo:{ kind:'scale', scale:'blues', root:'A', pos:0, keySel:true, views:[{label:'Caixa 1', pos:0},{label:'Caixa 2', pos:1},{label:'Braço inteiro', pos:-1}] },
      lick:'b4',
      tasks:['Toque a escala blues subindo e descendo.','Crie uma frase que passe pela blue note e termine na tônica.'],
      links:[{ to:'jam', id:'blues', label:'Improvisar sobre um blues em Lá' }] },
    { id:'tecnicas', title:'Bend, vibrato, slide e ligados', min:20,
      body:`<p>É na técnica de mão esquerda que a guitarra mais se diferencia do violão:</p>
<ul><li><b>Bend (b)</b>: empurre a corda para cima até a nota soar 1 tom (2 casas) ou ½ tom acima. Use 2 ou 3 dedos juntos e confira a afinação tocando a nota-alvo antes.</li>
<li><b>Release (r)</b>: volte o bend até a nota original sem palhetar.</li>
<li><b>Vibrato (~)</b>: pequenos bends repetidos e regulares. É a “assinatura” de cada guitarrista.</li>
<li><b>Slide (/ e \\)</b>: deslize até a próxima casa mantendo pressão.</li>
<li><b>Hammer-on (h) e pull-off (p)</b>: notas tocadas só com a mão esquerda, sem palhetar.</li></ul>`,
      demo:{ kind:'lick', lick:'r2' }, lick:'r2',
      tasks:['Bend de 1 tom na corda 3, casa 7: toque antes a casa 9 para ouvir o alvo.','Vibrato a 4 oscilações por segundo numa nota longa.'],
      links:[{ to:'licks', id:'r4', label:'Lick com bend em double stop' }] },
    { id:'blues12', title:'Blues de 12 compassos', min:20,
      body:`<p>O blues tem uma forma fixa de 12 compassos com três acordes: <b>I, IV e V</b>. Em Lá: A7, D7 e E7.</p>
<p class="mono-line">| A7 | D7 | A7 | A7 |<br>| D7 | D7 | A7 | A7 |<br>| E7 | D7 | A7 | E7 |</p>
<p>O estudo desta aula é um solo completo sobre essa forma. Repare nos espaços: blues é pergunta e resposta. Toque uma frase, deixe respirar, responda. E repare nas notas que mudam com o acorde: Fá♯ sobre o D7, Sol♯ sobre o E7.</p>`,
      demo:{ kind:'lick', lick:'s2' }, lick:'s2',
      tasks:['Toque o solo a 60% da velocidade e vá subindo.','Toque sobre a base de blues em Lá e crie seu próprio solo usando só a caixa 1.'],
      links:[{ to:'jam', id:'blues', label:'Base de blues em Lá' }] },
  ]},
  { id:'m6', title:'Escala maior e modos', tag:'Melodia', lessons:[
    { id:'maior3nps', title:'Escala maior com 3 notas por corda', min:15,
      body:`<p>Você já conhece a escala maior. No violão ela costuma ser tocada numa região só, com abertura de 4 dedos. Na guitarra, o sistema de <b>3 notas por corda</b> (3NPS) é muito popular: cada corda tem exatamente 3 notas, o que deixa a palhetada regular e facilita ligados e velocidade.</p>
<p>São 7 posições, uma começando em cada grau da escala na corda 6. As posições se sobrepõem: as duas últimas notas de cada corda são as duas primeiras da posição seguinte.</p>`,
      demo:{ kind:'scale', scale:'maior', root:'G', pos:0, keySel:true, views:[{label:'Pos. 1', pos:0},{label:'Pos. 2', pos:1},{label:'Pos. 3', pos:2},{label:'Pos. 4', pos:3},{label:'Pos. 5', pos:4},{label:'Pos. 6', pos:5},{label:'Pos. 7', pos:6},{label:'Braço', pos:-1}] },
      tasks:['Toque a posição 1 de Sol maior em semicolcheias a 70 BPM.','Ligue a posição 1 à posição 2 subindo pela corda 1.'],
      links:[{ to:'treino', id:'ex-3nps', label:'Treino de velocidade 3NPS' }] },
    { id:'menor-relativa', title:'Menor natural e a relativa', min:12,
      body:`<p>Toda escala maior tem uma <b>relativa menor</b> com as mesmas notas, começando no 6º grau. Dó maior e Lá menor são o mesmo conjunto de notas, com outro centro.</p>
<p>A menor natural é a pentatônica menor com duas notas a mais: a <b>2</b> e a <b>♭6</b>. Elas dão um sabor mais melódico e dramático ao solo, muito usado no rock e no metal.</p>`,
      demo:{ kind:'scale', scale:'menor', root:'A', pos:0, keySel:true, views:[{label:'Menor natural', scale:'menor'},{label:'Só a pentatônica', scale:'pent_menor'}] },
      tasks:['Toque a pentatônica e depois a menor natural na mesma região: ache as 2 notas novas.'] },
    { id:'modos', title:'Modos que o guitarrista usa', min:20,
      body:`<p>Modo é uma escala maior tocada a partir de outro grau. Para o dia a dia, pense em cada modo como uma escala conhecida com <b>uma nota característica</b>:</p>
<ul><li><b>Dórico</b> = menor natural com <b>6 maior</b>. Rock, funk, fusion (Santana).</li>
<li><b>Mixolídio</b> = maior com <b>♭7</b>. Blues, rock clássico, sobre acordes com 7.</li>
<li><b>Frígio</b> = menor com <b>♭2</b>. Metal, flamenco.</li>
<li><b>Lídio</b> = maior com <b>♯4</b>. Sonoridade de trilha de filme, flutuante.</li></ul>
<p>Para ouvir o modo, toque sobre uma base que fique num acorde só e destaque a nota característica.</p>`,
      demo:{ kind:'scale', scale:'dorico', root:'A', pos:0, keySel:true, views:[{label:'Dórico', scale:'dorico'},{label:'Mixolídio', scale:'mixolidio'},{label:'Frígio', scale:'frigio'},{label:'Lídio', scale:'lidio'}] },
      tasks:['Toque Lá dórico e Lá menor natural em sequência: só a 6ª muda.'] },
  ]},
  { id:'m7', title:'Metal e neoclássico', tag:'Velocidade', lessons:[
    { id:'harmonica', title:'Menor harmônica e frígio dominante', min:15,
      body:`<p>A <b>menor harmônica</b> é a menor natural com a <b>7ª maior</b>. Esse salto de 1 tom e meio entre a ♭6 e a 7 dá o sabor “clássico/oriental” do metal neoclássico.</p>
<p>Tocada a partir do 5º grau ela vira o <b>frígio dominante</b> (Mi frígio dominante = Lá menor harmônica), muito usado sobre o acorde V maior em tons menores.</p>
<p>O lick desta aula usa <b>pedal</b>: uma nota fixa (Mi, casa 12) alternando com a melodia na mesma corda, um recurso típico de Bach que os guitarristas neoclássicos adotaram.</p>`,
      demo:{ kind:'scale', scale:'menor_harm', root:'E', pos:0, keySel:true, views:[{label:'Menor harmônica', scale:'menor_harm'},{label:'Frígio dominante', scale:'frigio_dom'}] },
      lick:'m2',
      tasks:['Toque o lick de pedal só com palhetada alternada, bem devagar.'] },
    { id:'palhetada', title:'Palhetada alternada e sequências', min:20,
      body:`<p>Velocidade limpa vem de três coisas: <b>palhetada alternada</b> rigorosa, <b>mão esquerda sincronizada</b> e <b>metrônomo</b>.</p>
<ul><li>Movimento pequeno: a palheta passa só um pouco da corda.</li>
<li>Aumente 4 a 5 BPM por vez só quando conseguir 4 repetições limpas.</li>
<li>Sequências (grupos de 3, de 4) transformam escalas em frases. O exercício “aranha” (1-2-3-4) aquece e sincroniza as mãos.</li></ul>
<p>Use o <b>Treino de velocidade</b>: ele sobe o BPM sozinho a cada ciclo e guarda o seu recorde.</p>`,
      demo:{ kind:'lick', lick:'ex-aranha' }, lick:'ex-aranha',
      tasks:['Aranha a 80 BPM em semicolcheias, 3 minutos por dia.','Registre seu recorde no Treino.'],
      links:[{ to:'treino', id:'ex-aranha', label:'Treino de velocidade: aranha' },{ to:'treino', id:'ex-seq3', label:'Sequência em grupos de 3' }] },
    { id:'sweep', title:'Arpejos com sweep', min:20,
      body:`<p>No <b>sweep</b> a palheta “varre” as cordas num movimento só: para baixo na subida e para cima na descida. A mão esquerda solta cada nota assim que a próxima soar, para as notas não embolarem.</p>
<p>O lick desta aula tem um arpejo de Lá menor e outro de Mi maior (o V de Lá menor harmônica) em 5 cordas. Comece muito devagar e foque no abafamento, não na velocidade.</p>`,
      demo:{ kind:'lick', lick:'m3' }, lick:'m3',
      tasks:['Toque cada nota separada até ficar limpo, depois junte o movimento.'] },
  ]},
  { id:'m8', title:'Construindo solos', tag:'Musicalidade', lessons:[
    { id:'frases', title:'Pergunta, resposta e notas-alvo', min:15,
      body:`<p>Um solo marcante é feito de <b>frases</b>, como uma conversa. Três ideias para usar já:</p>
<ul><li><b>Pergunta e resposta</b>: frase 1 termina “em aberto” (na 5ª ou na 2ª), frase 2 resolve na tônica.</li>
<li><b>Notas-alvo</b>: quando o acorde muda, caia numa nota dele. No Jam deste app, as notas do acorde atual aparecem acesas no braço.</li>
<li><b>Repetição e variação</b>: repita um lick e mude só o final. O ouvinte reconhece e se envolve.</li></ul>
<p>E não esqueça do silêncio: pausas fazem parte da frase.</p>`,
      demo:{ kind:'lick', lick:'b2' }, lick:'b2',
      tasks:['No Jam, toque só 2 notas por acorde, sempre notas acesas.','Crie uma pergunta e três respostas diferentes.'],
      links:[{ to:'jam', id:'rock', label:'Jam: Am–G–F–G' }] },
    { id:'solo-rock', title:'Solo de rock em Lá menor', min:25,
      body:`<p>Este estudo de 8 compassos passa pelos acordes <b>Am – G – F – G – Am – G – F – E</b> e junta tudo: caixas 1 e 2 da pentatônica, a nota Fá da menor natural, bends e o Sol♯ da menor harmônica no último compasso.</p>
<p>Aprenda de 2 em 2 compassos. Quando estiver confortável, toque sobre o Jam “Rock menor” e depois troque algumas frases pelas suas.</p>`,
      demo:{ kind:'lick', lick:'s1' }, lick:'s1',
      tasks:['Compassos 1-2, depois 3-4, depois tudo.','Toque a 70% e suba até 100%.'],
      links:[{ to:'jam', id:'rock', label:'Jam: Am–G–F–G' }] },
  ]},
);
