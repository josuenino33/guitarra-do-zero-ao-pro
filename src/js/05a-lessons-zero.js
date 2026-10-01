/* ===== Níveis da trilha e módulos de base (nível 1 e 2) ===== */
const LEVELS = [
  { n:1, title:'Iniciante', sub:'Do zero às primeiras músicas', goals:[
    { id:'g1-afinar', text:'Afino a guitarra sozinho em menos de 2 minutos' },
    { id:'g1-trocas', text:'Faço 30 trocas por minuto entre G e C', href:'#trocas' },
    { id:'g1-pop', text:'Toco a levada pop a 80 BPM sem parar a mão', href:'#levadas-pop' },
    { id:'g1-musica', text:'Toco “Estrada de Terra” do começo ao fim', href:'#aula-primeira-musica' },
    { id:'g1-tab', text:'Leio e toco uma tablatura simples' } ] },
  { n:2, title:'Básico', sub:'Ritmo firme, pestana e o braço mapeado', goals:[
    { id:'g2-notas', text:'Acerto 90% no quiz “Qual é a nota?” (cordas 6 e 5)', href:'#quiz-qual-nota' },
    { id:'g2-pestana', text:'Toco F e Bm com todas as cordas soando' },
    { id:'g2-power', text:'Toco o riff de power chords com palm mute a 100 BPM', href:'#lick-r3' },
    { id:'g2-levadas', text:'Toco 4 levadas de estilos diferentes', href:'#levadas' },
    { id:'g2-leitura', text:'Leio ritmos com colcheias e pausas', href:'#aula-figuras' } ] },
  { n:3, title:'Intermediário', sub:'Tríades, CAGED, pentatônica e blues', goals:[
    { id:'g3-triades', text:'Toco as 3 inversões de tríade nos 4 grupos de cordas' },
    { id:'g3-caged', text:'Toco as 5 formas CAGED de um acorde em qualquer tom' },
    { id:'g3-pent', text:'Ligo as 5 caixas da pentatônica sem parar' },
    { id:'g3-blues', text:'Improviso 12 compassos de blues sobre a base', href:'#jam-blues' },
    { id:'g3-bend', text:'Faço bends de 1 tom afinados' } ] },
  { n:4, title:'Avançado', sub:'Modos, harmonia, técnica e velocidade', goals:[
    { id:'g4-3nps', text:'Escala maior em 3 notas por corda a 100 BPM em semicolcheias', href:'#treino-ex-3nps' },
    { id:'g4-modos', text:'Uso dórico e mixolídio sobre uma base de um acorde só', href:'#jam-dorico' },
    { id:'g4-sweep', text:'Toco o sweep Am–E limpo a 70 BPM', href:'#lick-m3' },
    { id:'g4-legato', text:'Toco o legato de 3 notas por corda a 80 BPM', href:'#lick-m4' } ] },
  { n:5, title:'Profissional', sub:'Solos, repertório, palco e estúdio', goals:[
    { id:'g5-solo', text:'Toco o solo de rock de 8 compassos sobre a base', href:'#aula-solo-rock' },
    { id:'g5-alvo', text:'Improviso mirando nas notas do acorde em cada troca', href:'#jam-rock' },
    { id:'g5-tempo', text:'Toco 30 minutos seguidos com metrônomo sem perder o tempo' },
    { id:'g5-gravar', text:'Gravo uma música inteira e escuto com ouvido crítico' } ] },
];

MODULES.push(
  { id:'m0', level:1, order:1, title:'Primeiros passos', tag:'Do zero', lessons:[
    { id:'conhecendo', title:'Conhecendo a guitarra e o amplificador', min:8,
      body:`<p>A guitarra elétrica não tem caixa acústica: o som vem dos <b>captadores</b>, ímãs embaixo das cordas que transformam a vibração em sinal elétrico. Esse sinal vai pelo <b>cabo</b> até o <b>amplificador</b>.</p>
<ul><li><b>Captadores</b>: <i>single coil</i> (som brilhante, estalado) ou <i>humbucker</i> (som mais grosso, sem chiado). A <b>chave seletora</b> escolhe qual soa: o do braço é mais suave, o da ponte é mais agudo e agressivo.</li>
<li><b>Volume e tonalidade</b> na guitarra: o tone fechado tira agudos.</li>
<li><b>Tarraxas</b> afinam; a <b>ponte</b> segura as cordas e às vezes tem alavanca.</li></ul>
<p>No amplificador, comece no canal <b>limpo</b>: ganho em 3, graves, médios e agudos em 5, e suba o volume aos poucos. O <b>ganho</b> (ou drive) é o que distorce. Muito ganho esconde erros, então estude bastante no limpo.</p>`,
      demo:{ kind:'none' },
      tasks:['Ache na sua guitarra: captadores, chave seletora, volume, tone, tarraxas e ponte.','Ligue o amplificador com volume no zero, depois ajuste ganho 3 e equalização em 5.','Teste as posições da chave seletora tocando a mesma corda.'] },
    { id:'postura', title:'Postura, palheta e as duas mãos', min:12,
      body:`<p><b>Postura</b>: sentado, a guitarra apoiada na perna direita, costas retas, ombros soltos. Em pé, ajuste a correia para a guitarra ficar na mesma altura de quando você está sentado.</p>
<p><b>Mão esquerda</b>: polegar atrás do braço, mais ou menos na direção do dedo médio. Aperte com a <b>ponta dos dedos</b>, logo atrás do traste (não em cima nem no meio da casa). Unhas curtas.</p>
<p><b>Palheta</b>: segure entre o polegar e a lateral do indicador, deixando só a pontinha para fora. O movimento vem do <b>pulso</b>, pequeno e relaxado, não do braço inteiro.</p>
<p>Os dois exercícios abaixo treinam exatamente isso: cordas soltas com palhetada alternada e um dedo por casa.</p>`,
      demo:{ kind:'lick', lick:'ex-soltas' }, lick:'ex-soltas',
      tasks:['Cordas soltas: 4 palhetadas em cada corda, da 6 para a 1, a 60 BPM.','Dedos 1-2-3-4 nas casas 5-6-7-8 da corda 1, depois em todas as cordas.','Confira: o polegar está atrás do braço e o pulso está relaxado?'],
      links:[{ to:'treino', id:'ex-1234', label:'Exercício 1-2-3-4 com metrônomo' }] },
    { id:'afinar', title:'Afinando a guitarra', min:8,
      body:`<p>Toda vez que pegar a guitarra, <b>afine antes</b>. Uma guitarra desafinada faz até os acordes certos soarem errados.</p>
<p>A afinação padrão é <b>Mi Lá Ré Sol Si Mi</b> (E A D G B E), da corda 6 para a 1. Use o afinador abaixo: toque uma corda solta, deixe soar e gire a tarraxa até o ponteiro ficar no centro.</p>
<ul><li>Se a nota estiver <b>baixa</b> (ponteiro à esquerda), aperte a corda.</li>
<li>Sempre chegue na nota <b>de baixo para cima</b>: se passou, afrouxe um pouco e suba de novo. Assim a corda segura a afinação.</li></ul>
<p>Sem microfone? Use os tons de referência e afine de ouvido, comparando o som.</p>`,
      demo:{ kind:'tuner' },
      tasks:['Afine as 6 cordas usando o afinador.','Desafine uma corda de propósito e afine de novo de ouvido, usando o tom de referência.'],
      links:[{ to:'afinador', label:'Abrir o afinador completo' }] },
    { id:'acordes-abertos', title:'Primeiros acordes: Em, E, Am, A, D e Dm', min:15,
      body:`<p>Como ler o diagrama: as linhas verticais são as cordas (a corda 6 fica à esquerda), as horizontais são os trastes. A bolinha mostra onde apertar e o número é o <b>dedo</b> (1 indicador, 2 médio, 3 anelar, 4 mínimo). <b>○</b> = corda solta, <b>×</b> = não tocar.</p>
<p>Monte o acorde, toque <b>corda por corda</b> e ouça se cada uma soa limpa. Se alguma abafa, arqueie mais os dedos ou aproxime-os do traste. Clique em cada diagrama para ouvir como deve soar.</p>
<p>Comece por <b>Em</b> e <b>E</b>: só dois ou três dedos e todas as cordas soando. Repare que de Em para E muda um dedo só. O mesmo vale para Am → A e Dm → D.</p>`,
      demo:{ kind:'chords', chords:['Em','E','Am','A','D','Dm'] },
      tasks:['Monte cada acorde e toque corda por corda até todas soarem.','Alterne Em ↔ E e Am ↔ A, quatro batidas cada.'],
      links:[{ to:'trocas', label:'Treino de trocas de acordes' }] },
    { id:'acordes-abertos-2', title:'G, C e os acordes com sétima', min:15,
      body:`<p><b>G</b> e <b>C</b> completam os acordes abertos mais usados. Com Em, Am, D e eles, você já toca centenas de músicas.</p>
<p>Os acordes com <b>sétima</b> (E7, A7, D7, G7, B7) têm um som de “quero resolver” e são a base do blues. Repare que E7 é o E com um dedo a menos.</p>
<p>No G, existem duas digitações comuns. A deste app (dedos 2, 1 e 3) é a mais fácil de trocar para C e Em.</p>`,
      demo:{ kind:'chords', chords:['G','C','E7','A7','D7','G7','B7'] },
      tasks:['Monte G e C até soarem limpos.','Toque E7, A7 e B7 em sequência: é a base de um blues em Mi.'] },
    { id:'trocas', title:'Trocando de acordes sem parar', min:15,
      body:`<p>O que separa “sei os acordes” de “toco a música” é a <b>troca</b>. O método do minuto funciona muito bem:</p>
<ul><li>Escolha um par de acordes, ligue o cronômetro de 1 minuto e troque o máximo de vezes que conseguir, tocando uma vez cada.</li>
<li>Anote o recorde. Faça três pares por dia. Em poucas semanas você passa de 10 para 40 trocas por minuto.</li></ul>
<p>Dicas: levante todos os dedos <b>juntos</b>, como um bloco. Use <b>dedos-âncora</b>: de C para Am o dedo 1 e o 2 não saem do lugar. Olhe para o próximo acorde antes de trocar.</p>`,
      demo:{ kind:'changes', pairs:[['Em','Am'],['E','A'],['A','D'],['D','G'],['G','C'],['C','Am'],['Em','C'],['G','D']] },
      tasks:['3 pares por dia, 1 minuto cada.','Meta do nível 1: 30 trocas por minuto entre G e C.'] },
    { id:'primeira-musica', title:'Sua primeira música: “Estrada de Terra”', min:20,
      body:`<p>Uma música feita para este app com os quatro acordes mais usados do pop: <b>G, Em, C e D</b>. Cada acorde dura um compasso (4 tempos).</p>
<p>Comece com a levada de uma batida por tempo (↓ ↓ ↓ ↓). Quando as trocas estiverem no tempo, passe para a levada pop. Se a troca atrasar, diminua o BPM: é melhor tocar devagar sem parar do que rápido aos trancos.</p>`,
      demo:{ kind:'song', song:'estrada' },
      tasks:['Toque só a sequência G–Em–C–D com uma batida por tempo a 60 BPM.','Toque a música inteira com a levada pop.','Cante junto (mesmo baixinho): ajuda a manter o tempo.'] },
  ]},
  { id:'r1', level:1, order:2, title:'Ritmo 1', tag:'Mão direita', lessons:[
    { id:'pulso', title:'Pulso, tempo e compasso', min:10,
      body:`<p>Toda música tem um <b>pulso</b>, a batida que você marca com o pé sem pensar. A velocidade do pulso é medida em <b>BPM</b> (batidas por minuto).</p>
<p>Os pulsos se agrupam em <b>compassos</b>. O mais comum é o de 4 tempos (4/4): conte <b>1 2 3 4</b>, com o 1 um pouco mais forte. Dividindo cada tempo em dois, a contagem vira <b>1 e 2 e 3 e 4 e</b>.</p>
<p>Abaixo, ouça cada ritmo e depois toque junto batendo no botão (ou na barra de espaço). O app mede sua precisão.</p>`,
      demo:{ kind:'rhythm', lv:[1] },
      tasks:['Bata o pé junto com o metrônomo a 60, 80 e 100 BPM.','Toque junto os ritmos do nível 1 até passar de 80% de precisão.'],
      links:[{ to:'metronomo', label:'Abrir o metrônomo' }] },
    { id:'baixo-cima', title:'Para baixo e para cima: a mão não para', min:12,
      body:`<p>A regra de ouro do ritmo no violão e na guitarra: a mão direita é um <b>pêndulo</b>. Ela desce nos números (1, 2, 3, 4) e sobe nos “e”, <b>sempre</b>, mesmo quando não toca as cordas.</p>
<p>Comece em colcheias: ↓↑↓↑↓↑↓↑. A batida para baixo pega todas as cordas; a para cima pega só as mais agudas e é mais leve. Use pouca força e deixe a palheta passar solta.</p>`,
      demo:{ kind:'strum', pattern:'colcheias', chords:['Em','Em','G','G'], views:[{ label:'Uma por tempo', pattern:'semi' },{ label:'Colcheias', pattern:'colcheias' }] },
      tasks:['Colcheias em Em a 60 BPM por 2 minutos sem parar.','Faça a mão passar no ar nas batidas “-” sem tocar as cordas.'],
      links:[{ to:'levadas', id:'colcheias', label:'Treinar no treinador de levadas' }] },
    { id:'levada-pop', title:'A levada pop: ↓ ↓↑ ↑↓↑', min:15,
      body:`<p>A levada mais usada no pop, no louvor e na MPB: <b>↓ - ↓ ↑ - ↑ ↓ ↑</b>. Contando: <b>1 . 2 e . e 4 e</b>. Nos espaços a mão continua o pêndulo, só não encosta nas cordas.</p>
<p>Ela tem uma <b>síncope</b>: a batida do tempo 3 é “pulada”, e é isso que dá o balanço. Fale a contagem em voz alta enquanto toca até ficar automática.</p>`,
      demo:{ kind:'strum', pattern:'pop', chords:['G','D','Em','C'] },
      tasks:['A levada num acorde só (Em) a 70 BPM.','Depois com a sequência G–D–Em–C, trocando no tempo 1.'],
      links:[{ to:'levadas', id:'pop', label:'Treinador de levadas: pop' }] },
    { id:'dinamica', title:'Dinâmica e acentos', min:10,
      body:`<p>Tocar sempre com a mesma força deixa o som chapado. <b>Dinâmica</b> é variar o volume: verso mais baixo, refrão mais forte.</p>
<p><b>Acento</b> é uma batida mais forte que as outras. No rock, os tempos <b>2 e 4</b> recebem acento junto com a caixa da bateria (o <i>backbeat</i>). Experimente a levada de colcheias só para baixo acentuando o 1 e o 3, depois o 2 e o 4, e sinta a diferença.</p>`,
      demo:{ kind:'strum', pattern:'rock', chords:['E','A','D','A'], views:[{ label:'Rock', pattern:'rock' },{ label:'Shuffle', pattern:'shuffle', chords:['A7','D7','A7','E7'] }] },
      tasks:['Toque o verso piano (fraco) e o refrão forte de “Estrada de Terra”.','Colcheias só para baixo com acento no 2 e no 4.'] },
  ]},
  { id:'l1', level:1, order:3, title:'Leitura 1', tag:'Tablatura e cifra', lessons:[
    { id:'ler-tab', title:'Lendo tablatura', min:10,
      body:`<p>A <b>tablatura</b> mostra onde tocar. São 6 linhas, uma para cada corda: a de <b>cima é a corda 1</b> (Mi agudo) e a de baixo é a corda 6. O número é a casa (0 = corda solta). Leia da esquerda para a direita; números empilhados são tocados juntos.</p>
<p>Os símbolos usados neste app:</p>
<ul><li><b>h</b> hammer-on, <b>p</b> pull-off, <b>/</b> e <b>\\</b> slide, <b>7b9</b> bend da casa 7 até soar como a 9, <b>r</b> release, <b>~</b> vibrato, <b>x</b> nota abafada, <b>PM</b> palm mute.</li>
<li>A linha de cima mostra a contagem (<b>1 e 2 e</b>), para você saber o ritmo.</li></ul>`,
      demo:{ kind:'lick', lick:'ex-melodia' }, lick:'ex-melodia',
      tasks:['Toque a melodia da tablatura bem devagar, falando a contagem.','Abra três licks da biblioteca e leia só os símbolos.'],
      links:[{ to:'licks', id:'r2', label:'Lick com bend e vibrato' }] },
    { id:'ler-cifra', title:'Lendo cifra', min:12,
      body:`<p>A <b>cifra</b> é a forma mais comum de escrever músicas no Brasil: a letra com o nome dos acordes em cima da sílaba onde eles entram. O nome do acorde segue um padrão:</p>
<ul><li>Letra = tônica (C Dó, D Ré, E Mi, F Fá, G Sol, A Lá, B Si). Sozinha = acorde <b>maior</b>.</li>
<li><b>m</b> = menor (Am). <b>7</b> = sétima (A7). <b>7M</b> = sétima maior (C7M). <b>m7</b> = menor com sétima.</li>
<li><b>sus4</b>, <b>sus2</b> = a terça troca pela 4ª ou 2ª. <b>add9</b> = acrescenta a nona. <b>°</b> = diminuto. <b>ø</b> ou <b>m7(b5)</b> = meio-diminuto. <b>5</b> = power chord.</li>
<li><b>C/E</b> = acorde de Dó com a nota Mi no baixo.</li></ul>
<p>Clique nos acordes da cifra abaixo para ver o diagrama.</p>`,
      demo:{ kind:'cifra', song:'estrada', symbols:true },
      tasks:['Leia a cifra e diga o nome de cada acorde em voz alta.','Procure uma música que você gosta numa cifra e identifique os símbolos.'] },
  ]},
  { id:'pestana', level:2, order:3, title:'Acordes com pestana', tag:'Formas móveis', lessons:[
    { id:'pestana-f', title:'A pestana: F e Bm', min:20,
      body:`<p>Na <b>pestana</b>, o dedo 1 aperta várias cordas na mesma casa. É difícil no começo para todo mundo; a força vem com algumas semanas.</p>
<ul><li>Use a <b>lateral</b> do dedo 1, um pouco virada para o lado do polegar, bem perto do traste.</li>
<li>O polegar desce para o meio das costas do braço. Puxe com o braço, não esmague com a mão.</li>
<li>Monte primeiro só a pestana e toque corda por corda; depois coloque os outros dedos.</li></ul>`,
      demo:{ kind:'chords', chords:['F','Bm','F7M','Dm'] },
      tasks:['30 segundos montando e soltando a pestana do F, descansando a mão entre as séries.','Troque C → F e Am → Bm.'] },
    { id:'formas-moveis', title:'Formas móveis: E e A', min:20,
      body:`<p>A pestana transforma os acordes abertos E e A em <b>formas móveis</b>: o mesmo desenho, em qualquer casa, vira outro acorde.</p>
<ul><li><b>Forma de E</b>: tônica na corda 6. Na casa 3 é Sol, na 5 é Lá, na 8 é Dó.</li>
<li><b>Forma de A</b>: tônica na corda 5. Na casa 3 é Dó, na 5 é Ré, na 7 é Mi.</li></ul>
<p>Com as notas das cordas 6 e 5 decoradas, você toca qualquer acorde maior, menor ou com sétima. É o começo do sistema CAGED.</p>`,
      demo:{ kind:'chords', chords:['G@E','A@E','Gm@E','A7@E','C@A','D@A','Cm@A','D7@A'] },
      tasks:['Toque Sol, Lá e Dó na forma de E, depois na forma de A.','Toque G–Em–C–D só com pestanas.'],
      links:[{ to:'quiz', id:'qual-nota', label:'Quiz das notas nas cordas 6 e 5' }] },
  ]},
  { id:'r2', level:2, order:4, title:'Ritmo 2', tag:'Levadas por estilo', lessons:[
    { id:'abafado', title:'Abafamento e chuck', min:15,
      body:`<p>O <b>chuck</b> (✕) é uma batida abafada: a mão esquerda afrouxa a pressão (sem tirar os dedos das cordas) ou a palma da mão direita encosta nas cordas no momento da batida. O som fica percussivo, como uma caixa de bateria.</p>
<p>No <b>reggae</b>, a guitarra toca só os contratempos (os “e”) com acordes curtos. No pop com abafado, o chuck cai nos tempos 2 e 4.</p>`,
      demo:{ kind:'strum', pattern:'chuck', chords:['Am','F','C','G'], views:[{ label:'Pop com abafado', pattern:'chuck' },{ label:'Reggae', pattern:'reggae', chords:['Am','D','Am','D'] }] },
      tasks:['Toque só chucks em colcheias, depois intercale com batidas soando.','Reggae: acordes curtos só no “e”.'] },
    { id:'semicolcheias', title:'Semicolcheias e funk', min:20,
      body:`<p>No funk, a mão direita faz o pêndulo em <b>semicolcheias</b> (4 por tempo: <b>1 i e a</b>). A maioria das batidas é abafada; só algumas soam. Quem dá o balanço é a escolha de quais soam.</p>
<p>Use acordes com pestana pequenos ou tétrades nas cordas agudas, palhetada curta e o antebraço solto. Comece bem devagar (60 BPM).</p>`,
      demo:{ kind:'strum', pattern:'funk', chords:['Am7','Am7','D','D'] },
      tasks:['Pêndulo em semicolcheias abafadas por 2 minutos a 60 BPM.','Levada funk completa a 80 BPM.'],
      links:[{ to:'levadas', id:'funk', label:'Treinador de levadas: funk' }] },
    { id:'estilos', title:'Country, valsa, 6/8 e shuffle', min:20,
      body:`<p>Cada estilo tem uma levada típica:</p>
<ul><li><b>Baixo e acorde</b> (country, sertanejo): a nota grave do acorde, depois a batida; alterne o baixo entre duas cordas.</li>
<li><b>Valsa 3/4</b>: compasso de 3 tempos, baixo no 1 e acorde no 2 e no 3.</li>
<li><b>6/8</b>: dois tempos, cada um dividido em três (1 e a 2 e a). Muito usado em baladas e louvor.</li>
<li><b>Shuffle</b>: colcheias “balançadas”, a primeira longa e a segunda curta. É o ritmo do blues.</li></ul>`,
      demo:{ kind:'strum', pattern:'country', chords:['G','C','D','G'], views:[{ label:'Baixo e acorde', pattern:'country' },{ label:'Valsa', pattern:'valsa', chords:['G','D','D','G'] },{ label:'6/8', pattern:'seisoito', chords:['C','G','Am','F'] },{ label:'Shuffle', pattern:'shuffle', chords:['A7','D7','A7','E7'] }] },
      tasks:['Toque cada levada por 1 minuto.','Escolha uma música de cada estilo e identifique a levada.'] },
  ]},
  { id:'l2', level:2, order:5, title:'Leitura 2', tag:'Leitura rítmica', lessons:[
    { id:'figuras', title:'Figuras rítmicas e pausas', min:15,
      body:`<p>Na partitura, o ritmo é escrito com <b>figuras</b>. Cada uma vale um número de tempos (no compasso 4/4):</p>
<ul><li><b>Semibreve</b> (bolinha vazada, sem haste) = 4 tempos. <b>Mínima</b> (vazada com haste) = 2.</li>
<li><b>Semínima</b> (cheia com haste) = 1. <b>Colcheia</b> (uma bandeirola ou barra) = ½. <b>Semicolcheia</b> (duas) = ¼.</li>
<li>O <b>ponto</b> aumenta a figura pela metade: semínima pontuada = 1½ tempo.</li>
<li>Cada figura tem uma <b>pausa</b> com o mesmo valor: um tempo de silêncio contado.</li></ul>`,
      demo:{ kind:'rhythm', lv:[1, 2] },
      tasks:['Ouça cada ritmo e depois toque junto.','Toque os ritmos numa corda solta com palhetada para baixo.'] },
    { id:'leitura-ritmica', title:'Leitura rítmica com semicolcheias', min:20,
      body:`<p>Com semicolcheias, cada tempo se divide em 4: <b>1 i e a</b>. Para ler sem se perder, olhe o tempo inteiro como um bloco: as barras que ligam as notas mostram exatamente um tempo.</p>
<p>Combinações comuns: <b>colcheia + duas semicolcheias</b> (galope invertido), <b>duas semicolcheias + colcheia</b> (galope) e <b>colcheia pontuada + semicolcheia</b>.</p>`,
      demo:{ kind:'rhythm', lv:[3] },
      tasks:['Leia cada ritmo falando “1 i e a” antes de tocar.','Toque junto até passar de 80% de precisão.'] },
  ]},
);
