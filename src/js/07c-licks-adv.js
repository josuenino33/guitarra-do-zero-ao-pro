/* ===== Licks de técnicas avançadas e jazz/fusion ===== */
STYLES.tecnica = 'Técnicas avançadas';
STYLES.jazz = 'Jazz / Fusion';
(() => {
  const rep = (s, n) => Array(n).fill(s).join(' ');
  LICKS.push(
    { id:'tap1', style:'tecnica', title:'Tapping em arpejos (Am–F–G–E)', key:'A', scale:'menor_harm', bpm:80, level:4, tech:'Tapping, pull-off, hammer-on',
      chords:['Am','F','G','E'],
      src:'|t ' + [rep('1:12t 1:5p 1:8h', 4), rep('1:13t 1:5p 1:8h', 4), rep('1:15t 1:7p 1:10h', 4), rep('1:12t 1:4p 1:7h', 4)].join(' '),
      tip:'O dedo médio da mão direita bate na casa marcada com t e puxa a corda para soar a nota da mão esquerda (pull-off). Abafe as outras cordas com a palma da mão direita.' },
    { id:'hib1', style:'tecnica', title:'Palhetada híbrida em arpejos', key:'A', scale:'maior', bpm:80, level:4, tech:'Palheta + dedos médio e anelar',
      chords:['A','D'],
      src:'|s ' + [rep('4:7 2:5 1:5 2:5 3:6 2:5 1:5 2:5', 2), rep('5:5 2:7 1:5 2:7 4:7 2:7 1:5 2:7', 2)].join(' '),
      tip:'Palheta nas cordas graves (4 e 5) e dedo médio na corda 2, anelar na corda 1. Soa como dois violões ao mesmo tempo e é a base do country e do pop moderno.' },
    { id:'harm1', style:'tecnica', title:'Harmônicos naturais', key:'E', scale:'maior', bpm:70, level:3, tech:'Harmônicos nas casas 12, 7 e 5',
      src:'|q 6:12n 5:12n 4:12n 3:12n 2:12n 1:12n |h 3:7n+2:7n |q 6:5n 5:5n 4:5n 3:5n |h 2:5n+1:5n |h -',
      tip:'Encoste o dedo de leve exatamente em cima do traste (sem apertar) e solte logo depois de palhetar. Use o captador da ponte e um pouco de ganho para soar mais.' },
    { id:'skip1', style:'tecnica', title:'Oitavas pulando cordas', key:'A', scale:'pent_menor', bpm:90, level:3, tech:'String skipping',
      src:'|e 6:5 4:7 6:8 4:10 5:5 3:7 5:7 3:9 4:5 2:8 4:7 2:10 |h 1:5~',
      tip:'Cada par é a mesma nota em duas oitavas, com uma corda pulada no meio. Abafe a corda do meio com o dedo que está tocando a nota grave.' },
    { id:'trill1', style:'tecnica', title:'Trinado e legato rápido', key:'A', scale:'dorico', bpm:70, level:4, tech:'Hammer-on e pull-off em sextinas',
      src:'|x ' + [rep('2:5 2:7h 2:5p 2:7h 2:5p 2:7h', 2), '2:5 2:8h 2:5p 2:8h 2:5p 2:8h', '3:7 3:9h 3:7p 3:9h 3:7p 3:9h'].join(' ') + ' |h 3:7~ |h -',
      tip:'Palhete só a primeira nota de cada grupo. O dedo que faz o pull-off puxa a corda um pouco para baixo, como se tocasse a corda com a mão esquerda.' },
    { id:'jazz1', style:'jazz', title:'ii–V–I com notas do acorde', key:'C', scale:'maior', bpm:100, level:4, tech:'Arpejos de tétrades, nota de passagem',
      chords:['Dm7','G7','C7M'],
      src:'|e 5:5 4:3 4:7 3:5 2:6 3:5 4:7 4:3 4:9 3:7 3:10 2:8 2:6 3:9 3:7 4:9 |q 3:9 |e 2:8 1:7 |h 1:8~',
      tip:'Compasso 1: arpejo de Dm7 (Ré Fá Lá Dó). Compasso 2: G7 começando na 3ª (Si), com Mi de passagem. Compasso 3: resolve na 3ª do C7M (Mi). Cada acorde ganha as notas dele.' },
    { id:'fusion1', style:'jazz', title:'Enclosures: cercando a nota-alvo', key:'A', scale:'dorico', bpm:84, level:5, tech:'Aproximação cromática',
      chords:['Am7','Am7'],
      src:'|t 1:7 1:4 1:5 2:6 2:4 2:5 3:7 3:4 3:5 4:9 4:6 4:7 |q 5:7 4:5 |h 4:7~',
      tip:'Cada grupo cerca uma nota do Am7: uma acima (da escala), uma meio tom abaixo, e cai na nota do acorde (Lá, Mi, Dó, Lá). É o jeito do jazz e do fusion de deixar a frase “com tensão”.' },
    { id:'alt1', style:'jazz', title:'Escala alterada resolvendo em Am', key:'E', scale:'alterada', bpm:90, level:5, tech:'Tensões no acorde dominante',
      chords:['E7(#9)','Am'],
      src:'|e 1:8 1:6 1:4 2:8 2:6 3:7 3:5 3:3 |q 3:2 2:5 |h 1:5~',
      tip:'Sobre o E7 a escala alterada traz ♭9, ♯9, ♭5 e ♯5: muita tensão. Ela resolve meio tom abaixo, no Lá do Am. Toque devagar para ouvir cada nota “puxando” para a resolução.' },
  );
})();
