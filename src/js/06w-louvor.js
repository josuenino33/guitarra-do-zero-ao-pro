/* ===== Trilha do guitarrista de louvor (worship): base no nível 2, solos e banda no nível 3 ===== */
MODULES.push(
  { id:'louvor1', level:2, order:9, title:'Guitarra no louvor: base', tag:'Worship', lessons:[
    { id:'louvor-papel', title:'O papel da guitarra no louvor', min:8,
      body:`<p>No louvor a guitarra serve à música e à congregação. Quem canta é a igreja; a banda sustenta. Três ideias guiam tudo o que vem nesta trilha:</p>
<ul><li><b>Espaço</b>: violão, teclado e baixo já ocupam os graves e os médios. A guitarra brilha quando toca <b>menos notas</b>, mais <b>agudas</b> e com <b>ambiência</b> (delay e reverb).</li>
<li><b>Dinâmica</b>: a música cresce. Intro e verso pedem pouco; o refrão pede mais. Saber esperar é metade do trabalho.</li>
<li><b>Tempo</b>: a congregação segue a banda. Firmeza no andamento vale mais que qualquer solo.</li></ul>
<p>Na prática você vai alternar entre três papéis: <b>base</b> (acordes abertos e coloridos), <b>textura</b> (pads, notas longas, ostinatos com delay) e <b>melodia</b> (frases curtas respondendo à voz).</p>`,
      demo:{ kind:'none' },
      tasks:['Escute uma música de louvor que você toca e anote o que a guitarra faz no verso e no refrão.','Toque a base “Worship congregacional” do Jam e tente tocar só nos tempos 1 e 3.'],
      links:[{ to:'jam', id:'w-cong', label:'Jam: Worship congregacional' }] },
    { id:'louvor-capo', title:'Capotraste e as 5 formas (G, C, D, E, A)', min:12,
      body:`<p>Quase todo guitarrista de louvor toca com <b>cinco formas abertas</b> e o <b>capotraste</b>. Assim as cordas soltas continuam soando em qualquer tom, e é daí que vem o som “aberto” do worship.</p>
<p>Para escolher: conte quantas casas separam a forma do tom da música. Exemplos:</p>
<ul><li>Música em <b>A</b>: formas de <b>G</b> com capo na casa <b>2</b> (ou formas de A sem capo).</li>
<li>Música em <b>B</b>: formas de <b>A</b> no capo <b>2</b>, ou de <b>G</b> no capo <b>4</b>.</li>
<li>Música em <b>E♭</b>: formas de <b>D</b> no capo <b>1</b>, ou de <b>C</b> no capo <b>3</b>.</li></ul>
<p>Prefira capo até a casa 5 ou 6: mais alto o som fica fino. No <b>Repertório</b>, abra uma música e escolha o tom do ministro: o app calcula o capo e mostra as formas.</p>`,
      demo:{ kind:'chords', chords:['G','C','D','E','A'] },
      tasks:['Toque as 5 formas abertas trocando a cada 4 tempos.','Para três músicas do seu repertório, descubra duas opções de capo para cada uma.'],
      links:[{ to:'repertorio', label:'Abrir o repertório' }] },
    { id:'louvor-cores', title:'Acordes coloridos e cordas soltas', min:12,
      body:`<p>Trocar a tríade por um acorde com uma <b>nota de cor</b> muda o clima sem mudar a harmonia:</p>
<ul><li><b>add9</b> e <b>sus2</b> no I e no IV: luz e abertura (Cadd9, Asus2).</li>
<li><b>7M</b> no I e no IV: suave, “flutuando” (G7M, C7M).</li>
<li><b>sus4</b> no V: tensão que pede resolução (Dsus4 → D → G).</li>
<li><b>m7</b> e <b>m11</b> no ii, iii e vi: menor sem ficar triste (Em7, Am11).</li></ul>
<p>O truque das formas de G: deixe os dedos fixos na <b>casa 3 das cordas 1 e 2</b>. Eles servem para G, Cadd9, Em7 e Dsus4, e essas duas cordas ligam um acorde no outro. No <b>Campo harmônico</b>, a opção <b>✨ Worship</b> mostra formas assim em qualquer tom.</p>`,
      demo:{ kind:'chords', chords:['G','Cadd9','Em7','Dsus4'] },
      tasks:['Toque G – Dsus4 – Em7 – Cadd9 sem tirar os dedos das cordas 1 e 2.','No Campo harmônico, ligue “✨ Worship” e toque o campo de outro tom.'],
      links:[{ to:'campo', label:'Campo harmônico' }] },
    { id:'louvor-triades', title:'Tríades nas cordas agudas', min:12,
      body:`<p>Na guitarra elétrica do louvor, o acorde de seis cordas aparece pouco. O que mais se ouve é a <b>tríade</b>: as três notas do acorde (tônica, 3ª e 5ª) em <b>três cordas vizinhas</b>, quase sempre nas cordas <b>1-2-3</b> ou <b>2-3-4</b>.</p>
<ul><li>O violão e o teclado já fazem o acorde cheio. A tríade aguda soma brilho sem embolar.</li>
<li>São só três dedos: sobra mão para trocar rápido, abafar e fazer swell.</li>
<li>Com delay e reverb, uma tríade arpejada vira textura.</li></ul>
<p>Comece com G – D – Em – C nas cordas 1-2-3 por volta da casa 7. Na aba <b>Tríades</b> do Braço o app mostra o desenho de cada acorde, toca em loop e muda para qualquer tom.</p>`,
      demo:{ kind:'lick', lick:'w8' },
      tasks:['Toque o lick “Tríades nas cordas 1-2-3” devagar, sem deixar uma corda de fora.','Na aba Tríades, troque o tom para D e para E e toque a mesma progressão.'],
      links:[{ to:'triades', label:'Abrir a aba Tríades' }, { to:'jam', id:'w-cong', label:'Jam com base em tríades' }] },
    { id:'louvor-levadas', title:'Levadas do louvor: congregacional, balada e 6/8', min:12,
      body:`<p>Três levadas cobrem a maior parte do repertório:</p>
<ul><li><b>Congregacional</b> (4/4, 68–80 BPM): uma palhetada longa no tempo 1 deixando soar, e um movimento leve no fim do compasso.</li>
<li><b>Balada</b>: colcheias suaves, acentuando 2 e 4 só com a mão direita mais firme.</li>
<li><b>6/8</b>: dois grupos de três (UM-dois-três QUA-tro-cinco). Pense em dois pulsos grandes por compasso.</li></ul>
<p>Comece sempre mais simples do que a gravação. Se o violão já faz a levada cheia, a guitarra pode tocar uma palhetada por compasso.</p>`,
      demo:{ kind:'strum', pattern:'balada', chords:['G','D','Em','C'], views:[{ label:'Balada', pattern:'balada' }, { label:'6/8', pattern:'seisoito' }, { label:'Pop', pattern:'pop' }] },
      tasks:['Toque a mesma progressão nas três levadas com metrônomo.','No Jam, toque junto com a “Worship balada 6/8”.'],
      links:[{ to:'jam', id:'w-68', label:'Jam: Worship balada 6/8' }] },
    { id:'louvor-dinamica', title:'Dinâmica: intro, verso, pré e refrão', min:10,
      body:`<p>Uma música de louvor costuma crescer em ondas. Um mapa simples para a guitarra:</p>
<ol><li><b>Intro</b>: notas longas, pad ou um ostinato baixinho.</li>
<li><b>Verso</b>: palhetadas espaçadas, só as cordas agudas.</li>
<li><b>Pré-refrão</b>: colcheias e volume subindo.</li>
<li><b>Refrão</b>: acorde inteiro, levada cheia.</li>
<li><b>Ponte</b>: às vezes cai tudo e recomeça a crescer.</li></ol>
<p>A base <b>Worship crescendo</b> do Jam faz esse caminho sozinha a cada 16 compassos e mostra a parte na tela. Acompanhe e mude junto.</p>`,
      demo:{ kind:'none' },
      tasks:['Toque a base “Worship crescendo” e mude a sua levada em cada parte.','Desenhe o mapa de dinâmica de uma música do repertório.'],
      links:[{ to:'jam', id:'w-build', label:'Jam: Worship crescendo' }] },
    { id:'louvor-pad', title:'Pads e swells com a guitarra', min:10,
      body:`<p>O <b>swell</b> faz a nota surgir sem ataque, como um teclado ou um violino:</p>
<ol><li>Volume da guitarra no zero.</li><li>Palhete a nota ou o acorde.</li><li>Gire o volume até o máximo em um ou dois tempos.</li></ol>
<p>Com reverb longo, isso vira um <b>pad</b>. Use em intros, orações e pontes. Funciona melhor com notas do acorde nas cordas agudas e com o captador do braço. Um pedal de volume deixa o pé fazer o trabalho e libera a mão.</p>`,
      demo:{ kind:'lick', lick:'w2' },
      tasks:['Faça swells sobre a base “Ambiente (pad)” do Jam.','Faça swells de duas notas juntas (cordas 1 e 2).'],
      links:[{ to:'jam', id:'w-amb', label:'Jam: Ambiente (pad)' }] },
  ] },
  { id:'louvor2', level:3, order:9, title:'Guitarra no louvor: solos e banda', tag:'Worship', lessons:[
    { id:'louvor-delay', title:'Delay pontilhado: o eco no tempo', min:12,
      body:`<p>O eco característico do worship é o delay de <b>colcheia pontuada</b>: cada nota repete três quartos de tempo depois, encaixando entre as notas que você toca.</p>
<p><b>Conta</b>: 60000 ÷ BPM × 0,75 = tempo em milissegundos.</p>
<ul><li>72 BPM → 625 ms</li><li>80 BPM → 563 ms</li><li>120 BPM → 375 ms</li></ul>
<p>Ajuste a <b>mistura</b> (mix) entre 25% e 40% e a <b>repetição</b> (feedback) para 2 ou 3 ecos. Toque colcheias limpas e deixe o pedal completar o ritmo. O Jam worship mostra o tempo certo do delay para o andamento escolhido.</p>`,
      demo:{ kind:'lick', lick:'w1' },
      tasks:['Calcule o delay de três músicas do seu repertório.','Toque o lick “Ostinato pontilhado” com e sem delay e compare.'],
      links:[{ to:'licks', id:'w1', label:'Lick: Ostinato pontilhado' }] },
    { id:'louvor-penta', title:'Pentatônica maior e notas seguras', min:12,
      body:`<p>A <b>pentatônica maior</b> (graus 1, 2, 3, 5 e 6) é a escala mais usada nos solos de louvor: não tem as notas que mais brigam com os acordes (4 e 7).</p>
<p>Três notas funcionam sobre <b>todos</b> os acordes comuns do tom: a <b>tônica (1)</b>, a <b>9ª (2)</b> e a <b>5ª (5)</b>. Uma nota longa em qualquer uma delas, com delay e reverb, já é uma frase.</p>
<p>Comece na região das casas 7 a 12 no tom de G: o som é cheio e não briga com o violão.</p>`,
      demo:{ kind:'scale', scale:'pent_maior', root:'G', pos:0, keySel:true },
      tasks:['Toque a pentatônica maior de G da casa 7 à 12 subindo e descendo.','Sobre a base congregacional, segure só as notas 1, 2 e 5, uma por compasso.'],
      links:[{ to:'licks', id:'w6', label:'Lick: Subida pro refrão' }] },
    { id:'louvor-alvos', title:'Notas-alvo na troca de acorde', min:12,
      body:`<p>A melodia fica “casada” com a harmonia quando a nota do <b>tempo 1</b> de cada compasso é uma nota do acorde (tônica, 3ª ou 5ª). O resto do compasso caminha até o próximo alvo.</p>
<ol><li>Escolha um alvo por acorde, perto um do outro no braço.</li><li>Toque só os alvos, um por compasso.</li><li>Acrescente uma ou duas notas da escala ligando um alvo ao próximo.</li></ol>
<p>No Jam worship, a frase <b>Melodia de alvos</b> é gerada assim no tom e na progressão que você escolher.</p>`,
      demo:{ kind:'lick', lick:'w7' },
      tasks:['Escreva um alvo para cada acorde de G – D – Em – C e toque só eles.','Gere frases “Melodia de alvos” no Jam e toque junto.'],
      links:[{ to:'jam', id:'w-cong', label:'Jam com frases' }] },
    { id:'louvor-resposta', title:'Responder à voz', min:10,
      body:`<p>No louvor o solo raramente compete com a voz. A guitarra <b>responde</b>: toca quando o cantor respira, no fim das frases, e silencia quando a letra volta.</p>
<ul><li>Frases curtas: 3 a 6 notas.</li><li>Comece depois que a voz termina, não antes.</li><li>Termine numa nota longa e segura (1, 3 ou 5 do acorde).</li></ul>
<p>Treine cantando você mesmo uma frase simples e respondendo com a guitarra.</p>`,
      demo:{ kind:'lick', lick:'w5' },
      tasks:['Toque o lick “Resposta à voz” e repare onde ficam os silêncios.','Cante uma frase e responda com 4 notas da pentatônica maior.'] },
    { id:'louvor-inversoes', title:'Inversões: a mão que quase não anda', min:12,
      body:`<p>Toda tríade tem três <b>inversões</b>, conforme a nota que fica embaixo:</p>
<ul><li><b>Fundamental</b>: a tônica embaixo.</li><li><b>1ª inversão</b>: a 3ª embaixo.</li><li><b>2ª inversão</b>: a 5ª embaixo.</li></ul>
<p>O segredo do louvor é <b>não pular pelo braço</b>. Na troca de acorde, escolha a inversão que está mais perto da anterior. Muitas vezes uma ou duas notas ficam paradas e só um dedo anda meia casa ou uma casa. Isso se chama <b>condução de vozes</b>.</p>
<p>Resultado: a nota de cima de cada tríade forma uma <b>melodia</b> por si só. Escute a progressão prestando atenção só na nota mais aguda.</p>
<p>A aba <b>Tríades</b> calcula esse caminho para qualquer tom, progressão e grupo de cordas, mostra quantas casas a mão anda e tem um treino rápido de reconhecer inversões.</p>`,
      demo:{ kind:'lick', lick:'w9' },
      tasks:['Na aba Tríades, toque I–V–vi–IV nas cordas 1-2-3 e depois nas 2-3-4.','Faça 20 acertos no treino “Qual inversão?”.','Cante a nota de cima de cada tríade enquanto toca.'],
      links:[{ to:'triades', label:'Abrir a aba Tríades' }] },
    { id:'louvor-triade-solta', title:'Tríades com corda solta soando', min:10,
      body:`<p>Junte duas ideias desta trilha: a tríade aguda e a corda solta. Toque a tríade nas cordas <b>2-3-4</b> e deixe a corda <b>1 solta</b> soando junto, ou a tríade nas cordas 1-2-3 com a corda 4 solta embaixo.</p>
<p>A nota solta não muda e cada acorde a “pinta” de um jeito: no tom de E, o Mi solto é a tônica no E, vira sus4 no B, é a 3ª menor no C♯m e a 5ª no A. Por isso tons como <b>E</b>, <b>D</b> e <b>A</b> são tão usados no louvor: as cordas soltas pertencem ao tom.</p>
<p>Arpeje devagar e deixe tudo soar. Com delay pontilhado, o resultado é aquele “sino” que fica por cima da banda.</p>`,
      demo:{ kind:'lick', lick:'w10' },
      tasks:['Toque o lick “Tríades com a corda Mi solta” e deixe todas as notas soarem.','Invente um arpejo seu nos acordes E – B – C♯m – A usando a corda 1 solta.'],
      links:[{ to:'licks', id:'w10', label:'Lick: Tríades com a corda Mi solta' }] },
    { id:'louvor-banda', title:'Tocar com a banda sem brigar com o teclado', min:10,
      body:`<p>Guitarra e teclado tocam nas mesmas alturas. Para não embolar:</p>
<ul><li><b>Registro</b>: se o teclado faz acordes no meio, toque mais agudo (acima da casa 7, ou só cordas 1 a 3).</li>
<li><b>Ritmo</b>: se o teclado segura acordes longos, a guitarra faz movimento (colcheias, ostinato); se o teclado é rítmico, a guitarra segura notas longas.</li>
<li><b>Baixo</b>: siga a tônica do baixista. Se ele mudar a nota do baixo, evite tocar outra tônica grave.</li>
<li><b>Combinar</b>: no ensaio, decidam quem faz o quê em cada parte.</li></ul>`,
      demo:{ kind:'none' },
      tasks:['No próximo ensaio, combine com o tecladista o registro de cada um no refrão.','Toque uma música inteira só nas cordas 1, 2 e 3.'] },
    { id:'louvor-numeros', title:'Números (Nashville) e tocar de ouvido', min:12,
      body:`<p>Músicos de louvor costumam falar de acordes por <b>números</b>: em G, o 1 é G, o 4 é C, o 5 é D e o 6 é Em (menor). A progressão “1 – 5 – 6 – 4” vale em qualquer tom.</p>
<p>Por que isso ajuda:</p>
<ul><li>Mudou o tom do ministro? Os números continuam os mesmos.</li><li>Fica mais fácil reconhecer de ouvido: o 6 menor soa “triste”, o 4 “afasta”, o 5 “pede para voltar”.</li></ul>
<p>Use o campo harmônico abaixo: toque as progressões e diga os números em voz alta. No treino de ouvido, o exercício de progressões treina exatamente isso.</p>`,
      demo:{ kind:'campo', root:'G', scale:'maior' },
      tasks:['Escreva três músicas do seu repertório em números.','Toque 1 – 5 – 6 – 4 em G, D e E.'],
      links:[{ to:'ouvido', label:'Treino de ouvido' }] },
  ] },
);
