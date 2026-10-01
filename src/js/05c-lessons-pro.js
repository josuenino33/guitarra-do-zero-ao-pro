/* ===== Nível 4 e 5: partitura, improvisação avançada e vida profissional ===== */
MODULES.push(
  { id:'l3', level:4, order:5, title:'Leitura 3', tag:'Partitura', lessons:[
    { id:'pauta', title:'A pauta e a clave de sol', min:15,
      body:`<p>A partitura usa <b>5 linhas</b>. Cada linha e cada espaço é uma nota. A <b>clave de sol</b> (𝄞) marca o Sol na segunda linha de baixo para cima. O pequeno <b>8</b> embaixo da clave indica que a guitarra soa <b>uma oitava abaixo</b> do que está escrito.</p>
<ul><li>Linhas, de baixo para cima: <b>Mi Sol Si Ré Fá</b>.</li>
<li>Espaços: <b>Fá Lá Dó Mi</b>.</li>
<li>Notas mais graves ou mais agudas usam <b>linhas suplementares</b>, pequenos tracinhos.</li></ul>
<p>Comece pelas notas das cordas 1, 2 e 3 até a casa 3.</p>`,
      demo:{ kind:'staff', mode:'quiz', set:'cordas123' },
      tasks:['Acerte 20 notas seguidas no exercício.','Depois de responder, toque a nota na guitarra.'] },
    { id:'primeira-posicao', title:'Notas na primeira posição', min:20,
      body:`<p>A <b>primeira posição</b> vai da corda solta até a casa 3 (ou 4), em todas as cordas. É onde se começa a ler partitura na guitarra, porque cada nota escrita tem um lugar só.</p>
<p>As cordas graves ficam abaixo da pauta, com linhas suplementares: a corda 6 solta (Mi) fica logo abaixo da terceira linha suplementar. A corda 1 solta (Mi) está no quarto espaço da pauta.</p>`,
      demo:{ kind:'staff', mode:'quiz', set:'primeira' },
      tasks:['Acerte 20 notas seguidas.','Leia em voz alta as notas da corda 6 até a corda 1.'] },
    { id:'acidentes', title:'Sustenidos, bemóis e armadura', min:15,
      body:`<p>O <b>sustenido (♯)</b> sobe meio tom (uma casa) e o <b>bemol (♭)</b> desce meio tom. O <b>bequadro (♮)</b> cancela. Na partitura, o acidente aparece antes da nota e vale até o fim do compasso.</p>
<p>A <b>armadura de clave</b>, no começo da pauta, lista os acidentes do tom para a música inteira. Sol maior tem um sustenido (Fá♯); Fá maior tem um bemol (Si♭).</p>`,
      demo:{ kind:'staff', mode:'quiz', set:'acidentes' },
      tasks:['Acerte 15 notas seguidas com acidentes.','Diga as notas com ♯ e com ♭ de cada casa da corda 1 até a casa 5.'] },
    { id:'ler-melodia', title:'Lendo uma melodia', min:20,
      body:`<p>Juntando ritmo e notas, você lê uma melodia. A tablatura embaixo serve de conferência, mas tente ler a pauta primeiro: o nome da nota, onde ela fica e quanto tempo dura.</p>
<p>Dica: leia sempre um pouco à frente do que está tocando, como na leitura de texto.</p>`,
      demo:{ kind:'staff', mode:'melody', lick:'ex-melodia', more:['pd-ode', 'pd-green', 'pd-minueto'] },
      tasks:['Leia a melodia falando o nome das notas.','Toque olhando só para a pauta.'] },
  ]},
  { id:'impro', level:5, order:2, title:'Improvisação avançada', tag:'Linguagem', lessons:[
    { id:'notas-alvo', title:'Solando nas mudanças: notas do acorde', min:20,
      body:`<p>Escala serve para todos os acordes do tom, mas quem dá direção ao solo são as <b>notas do acorde da vez</b>. O exercício profissional é ficar <b>numa região do braço</b> e trocar só as notas-alvo quando o acorde muda.</p>
<p>Abaixo, a mesma região (casas 4 a 8) para Am7, D7 e G7M. Várias notas são comuns entre os acordes; as que definem o som de cada um são a <b>3ª e a 7ª</b>, e elas mudam pouco de um acorde para o outro (a 7ª de um desce meio tom para a 3ª do seguinte). Mire nelas no tempo 1 de cada compasso.</p>`,
      demo:{ kind:'arp', root:'A', chord:'m7', lo:4, hi:8, views:[{ label:'Am7', root:'A', chord:'m7' },{ label:'D7', root:'D', chord:'dom7' },{ label:'G7M', root:'G', chord:'maj7' }] },
      tasks:['No Jam ii–V–I, toque só notas do acorde, uma por tempo.','Depois ligue as notas-alvo com notas da escala.'],
      links:[{ to:'jam', id:'iivi', label:'Jam: ii–V–I em Sol' }] },
    { id:'arpejos-tetrades', title:'Arpejos de tétrades no braço', min:20,
      body:`<p>Os arpejos de <b>7M, m7, 7 e m7(♭5)</b> são o vocabulário básico do jazz, do fusion e do gospel moderno. Aprenda cada um em pelo menos duas regiões do braço, com a tônica na corda 6 e na corda 5.</p>
<p>Um exercício excelente: toque o campo harmônico inteiro em arpejos, subindo e descendo, sem sair da mesma região.</p>`,
      demo:{ kind:'arp', root:'C', chord:'maj7', lo:7, hi:11, views:[{ label:'C7M', chord:'maj7' },{ label:'Cm7', chord:'m7' },{ label:'C7', chord:'dom7' },{ label:'Cm7(♭5)', chord:'m7b5' },{ label:'C°7', chord:'dim7' }] },
      tasks:['Cada arpejo subindo e descendo com metrônomo.','Campo de Dó em arpejos entre as casas 7 e 10.'] },
    { id:'menor-melodica', title:'Menor melódica, lídio dominante e alterada', min:20,
      body:`<p>A <b>menor melódica</b> é a escala menor com 6ª e 7ª maiores. Dela saem dois modos muito usados:</p>
<ul><li><b>Lídio dominante</b> (4º modo): maior com ♯4 e ♭7. Perfeito sobre acordes 7 que não resolvem (blues moderno, fusion).</li>
<li><b>Alterada</b> (7º modo): todas as tensões do dominante (♭9, ♯9, ♭5 e ♯5, escrito como ♭13). Use sobre o V7 logo antes de resolver.</li></ul>
<p>Regra prática: sobre E7 que vai para Am, toque a menor melódica de Fá (meio tom acima do E).</p>`,
      demo:{ kind:'scale', scale:'menor_mel', root:'A', pos:0, keySel:true, views:[{ label:'Menor melódica', scale:'menor_mel' },{ label:'Lídio dominante', scale:'lidio_dom' },{ label:'Alterada', scale:'alterada' }] },
      lick:'alt1',
      tasks:['Toque a menor melódica de Lá em 3 notas por corda.','Use a alterada no último compasso de um blues menor.'] },
    { id:'simetricas', title:'Escalas simétricas', min:15,
      body:`<p>Escalas <b>simétricas</b> repetem o mesmo desenho ao longo do braço:</p>
<ul><li><b>Diminuta tom-semitom</b>: sobre acordes °7. O desenho se repete a cada 3 casas.</li>
<li><b>Dominante diminuta</b> (semitom-tom): sobre 7(♭9), com som “tenso e moderno”.</li>
<li><b>Tons inteiros</b>: só tons inteiros, som de sonho; sobre 7(♯5). Repete a cada 2 casas.</li></ul>`,
      demo:{ kind:'scale', scale:'dim_st', root:'G', pos:-1, keySel:true, views:[{ label:'Dominante diminuta', scale:'dim_st' },{ label:'Diminuta', scale:'dim_ts' },{ label:'Tons inteiros', scale:'tons_inteiros' }] },
      tasks:['Ache o desenho que se repete a cada 3 casas na diminuta.','Improvise sobre G7(♭9) com a dominante diminuta.'] },
    { id:'fraseado', title:'Fraseado: motivo, ritmo e espaço', min:20,
      body:`<p>O que faz um solo soar profissional não é a quantidade de notas. É o <b>fraseado</b>:</p>
<ul><li><b>Motivo</b>: uma ideia curta (3 a 5 notas) que você repete e transforma.</li>
<li><b>Sequência</b>: o mesmo motivo começando em outra nota da escala.</li>
<li><b>Deslocamento rítmico</b>: a mesma frase começando meio tempo depois.</li>
<li><b>Espaço e dinâmica</b>: pausas, notas longas, tocar mais forte ou mais fraco.</li></ul>
<p>Grave seus improvisos e escute: você está conversando ou só passando escala?</p>`,
      demo:{ kind:'lick', lick:'fusion1' }, lick:'fusion1',
      tasks:['Improvise 2 minutos usando um motivo só.','Grave um improviso e anote 3 ideias que funcionaram.'],
      links:[{ to:'gravar', label:'Abrir o gravador' }] },
    { id:'jazz-fusion', title:'Linguagem de jazz e fusion', min:20,
      body:`<p>Duas ferramentas da linguagem do jazz para começar:</p>
<ul><li><b>Arpejos nas mudanças</b>: cada acorde do ii–V–I com o seu arpejo, ligando a 7ª de um à 3ª do seguinte, que fica meio tom abaixo (Dó → Si de Dm7 para G7, Fá → Mi de G7 para C7M).</li>
<li><b>Enclosures</b>: cercar a nota-alvo por cima e por baixo antes de tocá-la.</li></ul>
<p>A melhor fonte é <b>transcrever</b>: tirar de ouvido frases dos músicos que você admira e tocá-las em outros tons.</p>`,
      demo:{ kind:'lick', lick:'jazz1' }, lick:'jazz1',
      tasks:['Toque o lick ii–V–I em mais dois tons.','Transcreva uma frase curta de um solo que você gosta.'],
      links:[{ to:'aula', id:'transcrever', label:'Aula: tirar música de ouvido' }] },
  ]},
  { id:'pro', level:5, order:3, title:'Vida profissional', tag:'Timbre, banda e palco', lessons:[
    { id:'timbre', title:'Timbre: amplificador, ganho e equalização', min:15,
      body:`<p>Três timbres resolvem quase tudo:</p>
<ul><li><b>Limpo</b>: ganho baixo (2–3), médios no meio, um pouco de reverb. Acordes, arpejos, louvor, pop.</li>
<li><b>Crunch</b>: ganho médio (4–6). Blues, rock clássico, base de pop rock. Responde à força da palhetada.</li>
<li><b>Drive de solo</b>: ganho alto, um pouco mais de <b>médios</b> para o solo aparecer na banda, e delay curto.</li></ul>
<p>Erros comuns: tirar todos os médios (some na banda), ganho alto demais (embola e esconde a palhetada) e graves exagerados. Use também o <b>volume da guitarra</b>: com ele em 7, o crunch vira quase limpo.</p>`,
      demo:{ kind:'none' },
      tasks:['Monte e anote seus 3 timbres: limpo, crunch e solo.','Toque o mesmo riff nos três e grave.'] },
    { id:'pedais', title:'Pedais e a ordem da cadeia', min:15,
      body:`<p>A ordem mais usada, da guitarra para o amplificador:</p>
<ol><li><b>Afinador</b></li><li><b>Filtros</b> (wah) e <b>compressor</b></li><li><b>Overdrive / distorção / fuzz</b></li><li><b>Modulação</b> (chorus, phaser, flanger)</li><li><b>Delay</b></li><li><b>Reverb</b></li></ol>
<p>Se o amplificador tem <b>loop de efeitos</b>, modulação, delay e reverb soam melhor nele. Pedaleiras e simuladores seguem a mesma lógica. No louvor, delay sincronizado com o BPM e reverb longo são a base do timbre ambiente.</p>`,
      demo:{ kind:'none' },
      tasks:['Desenhe a sua cadeia de efeitos.','Ajuste o delay no tempo de uma música (semínima ou colcheia pontuada).'] },
    { id:'regulagem', title:'Cordas, cuidados e regulagem', min:15,
      body:`<ul><li><b>Cordas</b>: troque a cada 1–3 meses, ou quando perderem brilho e afinação. Calibre 0.09 é mais macio; 0.10 tem mais corpo e segura melhor a afinação.</li>
<li><b>Ao trocar</b>: estique cada corda nova algumas vezes antes de afinar de vez.</li>
<li><b>Altura das cordas (action)</b>: baixa facilita, baixa demais trasteja.</li>
<li><b>Oitava (entonação)</b>: a casa 12 deve soar igual ao harmônico da casa 12; se não, ajuste o carrinho da ponte.</li>
<li><b>Tensor</b>: ajusta a curvatura do braço; mexa pouco (1/8 de volta por vez) ou leve a um luthier.</li>
<li>Limpe as cordas e o braço depois de tocar.</li></ul>`,
      demo:{ kind:'none' },
      tasks:['Troque as cordas sozinho uma vez.','Confira a oitava das 6 cordas com o afinador.'],
      links:[{ to:'afinador', label:'Abrir o afinador' }] },
    { id:'banda', title:'Tocando em banda', min:20,
      body:`<ul><li><b>Ouça o baixo e o bombo</b>: o seu ritmo encaixa neles.</li>
<li><b>Divida frequências</b>: se o teclado faz os acordes graves, toque tríades nas cordas agudas.</li>
<li><b>Menos é mais</b>: deixe espaço para a voz; preencha só onde não há melodia.</li>
<li><b>Dinâmica de banda</b>: verso mais vazio, refrão mais cheio, ponte diferente.</li>
<li><b>Mapa da música</b>: anote a estrutura (intro, verso, refrão, ponte) com os graus. Fica fácil mudar de tom.</li>
<li>Combine sinais para final, repetição e mudança de parte.</li></ul>`,
      demo:{ kind:'none' },
      tasks:['Faça o mapa de 3 músicas do seu repertório com os graus.','No Jam, toque só tríades nas cordas 1-2-3.'] },
    { id:'estudio', title:'Gravando em casa', min:20,
      body:`<p>Para gravar com qualidade você precisa de:</p>
<ul><li><b>Interface de áudio</b> (entrada para guitarra) e um <b>programa de gravação</b> (DAW).</li>
<li><b>Simulador de amplificador</b> no computador, ou microfone na frente do falante (perto do centro = mais agudo; para a borda = mais grave).</li>
<li><b>Click</b> (metrônomo) sempre ligado ao gravar.</li>
<li><b>Dobra</b>: grave a base duas vezes e coloque uma de cada lado (esquerda/direita). O som fica largo, de disco.</li>
<li>Grave mais de uma tomada e escolha a melhor; descanse os ouvidos antes de decidir.</li></ul>`,
      demo:{ kind:'none' },
      tasks:['Grave uma base com click e um solo por cima no looper.','Grave a mesma base duas vezes e compare.'],
      links:[{ to:'gravar', label:'Gravador e looper' }] },
    { id:'palco', title:'Palco e performance', min:15,
      body:`<ul><li><b>Setlist</b> com tom e BPM de cada música e a ordem das trocas de timbre.</li>
<li><b>Passagem de som</b>: peça no retorno o que você precisa ouvir (normalmente voz e bateria).</li>
<li><b>Kit de emergência</b>: cordas, cabo extra, palhetas, bateria/fonte dos pedais, afinador.</li>
<li><b>Nervosismo</b>: ensaie a música mais difícil até ficar no automático. Se errar, não pare: a música continua.</li>
<li>Ensaie as <b>transições</b> entre as músicas, não só as músicas.</li></ul>`,
      demo:{ kind:'none' },
      tasks:['Monte um setlist de 5 músicas com tom, BPM e timbre.','Toque o setlist inteiro sem parar, gravando.'] },
    { id:'estudo-pro', title:'Como estudar como profissional', min:15,
      body:`<ul><li><b>Prática deliberada</b>: estude o que você ainda não sabe, em blocos curtos e com objetivo claro.</li>
<li><b>Meça</b>: BPM, trocas por minuto, porcentagem nos quizzes. O que é medido melhora.</li>
<li><b>Grave e escute</b> toda semana.</li>
<li><b>Divida o tempo</b>: técnica, repertório, improviso, ouvido e teoria (o plano do dia faz isso por você).</li>
<li><b>Saúde</b>: aqueça antes, alongue depois, faça pausas a cada 25–30 minutos. Dor não é normal: pare e descanse.</li></ul>`,
      demo:{ kind:'none' },
      tasks:['Use o plano do dia por 2 semanas sem falhar.','Escolha uma meta medível para o mês.'],
      links:[{ to:'hoje', label:'Plano de hoje' }] },
    { id:'transcrever', title:'Tirar música de ouvido', min:20,
      body:`<ol><li>Descubra o <b>tom</b>: procure a nota que “resolve” no fim das frases, ou a nota que o baixo mais repete.</li>
<li>Ouça a <b>pentatônica</b> desse tom: a maioria das frases de rock, blues e pop sai dela.</li>
<li>Tire <b>uma frase curta</b> de cada vez. Cante antes de procurar na guitarra.</li>
<li>Use velocidade reduzida e loop do trecho (no app, o loop A-B dos licks treina isso).</li>
<li>Depois de tirar, escreva no editor de licks e toque em outros tons.</li></ol>`,
      demo:{ kind:'none' },
      tasks:['Tire de ouvido a melodia de uma música infantil ou do “parabéns”.','Tire uma frase de um solo que você gosta e salve no editor.'],
      links:[{ to:'quiz', id:'ouvido', label:'Treino de ouvido' },{ to:'editor', label:'Editor de licks' }] },
  ]},
);
