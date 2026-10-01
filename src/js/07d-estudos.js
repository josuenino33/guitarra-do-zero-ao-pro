/* ===== Estudos originais e peças de domínio público, por nível ===== */
STYLES.estudo = 'Estudos e peças';
(() => {
  const rep = (s, n) => Array(n).fill(s).join(' ');
  const E = '6:0+5:2 6:0+5:2 6:0+5:4 6:0+5:4 6:0+5:2 6:0+5:2 6:0+5:4 6:0+5:4';
  const Ab = '5:0+4:2 5:0+4:2 5:0+4:4 5:0+4:4 5:0+4:2 5:0+4:2 5:0+4:4 5:0+4:4';
  const B = '5:2+4:4 5:2+4:4 5:2+4:6 5:2+4:6 5:2+4:4 5:2+4:4 5:2+4:6 5:2+4:6';
  LICKS.push(
    { id:'pd-brilha', style:'estudo', title:'Brilha, brilha, estrelinha', credit:'Melodia tradicional (domínio público)', key:'C', scale:'maior', bpm:90, level:1, tech:'Primeira melodia nas cordas 1 e 2',
      src:'|q 2:1 2:1 1:3 1:3 1:5 1:5 |h 1:3 |q 1:1 1:1 1:0 1:0 2:3 2:3 |h 2:1 |q 1:3 1:3 1:1 1:1 1:0 1:0 |h 2:3 |q 1:3 1:3 1:1 1:1 1:0 1:0 |h 2:3 |q 2:1 2:1 1:3 1:3 1:5 1:5 |h 1:3 |q 1:1 1:1 1:0 1:0 2:3 2:3 |h 2:1',
      tip:'Use um dedo por casa: casa 1 com o dedo 1, casa 3 com o dedo 3, casa 5 com o dedo 4. Cante a melodia enquanto toca.' },
    { id:'pd-ode', style:'estudo', title:'Ode à Alegria', credit:'Beethoven, 9ª Sinfonia (domínio público)', key:'C', scale:'maior', bpm:100, level:1, tech:'Melodia por graus conjuntos',
      src:'|q 1:0 1:0 1:1 1:3 1:3 1:1 1:0 2:3 2:1 2:1 2:3 1:0 |q. 1:0 |e 2:3 |h 2:3 |q 1:0 1:0 1:1 1:3 1:3 1:1 1:0 2:3 2:1 2:1 2:3 1:0 |q. 2:3 |e 2:1 |h 2:1',
      tip:'Repare na semínima pontuada seguida de colcheia no fim de cada frase: conte “1 2 3 e 4”.' },
    { id:'est-boogie', style:'estudo', title:'Estudo 1: boogie em Mi (12 compassos)', credit:'Estudo original do Mapa do Braço', key:'E', scale:'mixolidio', bpm:96, level:2, tech:'Shuffle com power chords', swing:true,
      chords:['E7','E7','E7','E7','A7','A7','E7','E7','B7','A7','E7','B7'],
      src:'|e ' + [E, E, E, E, Ab, Ab, E, E, B, Ab, E, B].join(' '),
      tip:'O dedo 1 fica parado na casa 2 e o dedo 3 (ou 4) alterna para a casa 4. Palm mute leve e colcheias com swing. É a base de rock’n’roll e blues mais tocada da história.' },
    { id:'est-funk', style:'estudo', title:'Estudo 2: riff de funk em Am7', credit:'Estudo original do Mapa do Braço', key:'A', scale:'dorico', bpm:88, level:2, tech:'Semicolcheias com notas abafadas',
      src:'|s ' + rep('4:7 4:x 4:7 4:5 3:x 3:5 4:x 4:7 4:7 4:x 3:5 3:7 4:x 4:5 4:7 4:x', 2),
      tip:'A mão direita faz semicolcheias sem parar; os “x” são notas abafadas com a mão esquerda solta sobre as cordas. As notas que soam devem ser curtas e secas.' },
    { id:'pd-green', style:'estudo', title:'Greensleeves', credit:'Canção tradicional inglesa (domínio público)', key:'A', scale:'menor', bpm:96, level:2, meter:3, pickup:1, tech:'Compasso 3/4 e anacruse',
      src:'|q 3:2 |h 2:1 |q 2:3 |q. 1:0 |e 1:1 |q 1:0 |h 2:3 |q 2:0 |q. 3:0 |e 3:2 |q 2:0 |h 2:1 |q 3:2 |q. 3:2 |e 3:1 |q 3:2 |h 2:0 |q 3:1 |h 4:2 |q 3:2',
      tip:'Compasso de 3 tempos que começa no tempo 3 (anacruse). Conte “3 | 1 2 3 | 1 2 3”. A melodia usa Sol natural e Sol♯: o Sol♯ (sensível) vem da menor harmônica e puxa para o Lá.' },
    { id:'est-triades', style:'estudo', title:'Estudo 3: tríades em D–Bm–G–A', credit:'Estudo original do Mapa do Braço', key:'D', scale:'maior', bpm:80, level:3, tech:'Tríades arpejadas nas cordas 1-2-3',
      chords:['D','Bm','G','A'],
      src:'|e ' + ['3:2 2:3 1:2 2:3 3:2 2:3 1:2 2:3', '3:4 2:3 1:2 2:3 3:4 2:3 1:2 2:3', '3:4 2:3 1:3 2:3 3:4 2:3 1:3 2:3', '3:2 2:2 1:0 2:2 3:2 2:2 1:0 2:2'].join(' '),
      tip:'Cada acorde muda o mínimo possível de notas: de D para Bm só a nota da corda 3 se move. Deixe as notas soarem juntas, como um piano.' },
    { id:'pd-minueto', style:'estudo', title:'Minueto em Sol', credit:'Christian Petzold, atribuído a J. S. Bach (domínio público)', key:'G', scale:'maior', bpm:100, level:3, meter:3, tech:'Leitura em 3/4 na primeira posição',
      src:'|q 2:3 |e 3:0 3:2 2:0 2:1 |q 2:3 3:0 3:0 1:0 |e 2:1 2:3 1:0 1:2 |q 1:3 3:0 3:0 2:1 |e 2:3 2:1 2:0 3:2 |q 2:0 |e 2:1 2:0 3:2 3:0 |q 4:4 |e 3:0 3:2 2:0 3:0 |h. 3:2',
      tip:'Os primeiros 8 compassos da peça mais tocada por estudantes de música. Leia também na partitura (aula “Lendo uma melodia”) e toque com metrônomo em 3.' },
  );
})();
