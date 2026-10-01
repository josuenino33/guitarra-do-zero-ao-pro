/* ===== Exercícios do nível 1 e músicas com cifra ===== */
CH.OPEN['C/E'] = { f:[0,3,2,0,1,0], d:[0,3,2,0,1,0] };

LICKS.push(
  { id:'ex-soltas', style:'exercicio', title:'Cordas soltas com palhetada alternada', key:'E', scale:'maior', bpm:60, level:1, tech:'Palhetada alternada',
    src:'|e 6:0 6:0 6:0 6:0 5:0 5:0 5:0 5:0 4:0 4:0 4:0 4:0 3:0 3:0 3:0 3:0 2:0 2:0 2:0 2:0 1:0 1:0 1:0 1:0',
    tip:'Baixo, cima, baixo, cima em cada corda. Movimento pequeno, vindo do pulso, e a palheta mal passando da corda.' },
  { id:'ex-1234', style:'exercicio', title:'Um dedo por casa (1-2-3-4)', key:'A', scale:'maior', bpm:60, level:1, tech:'Mão esquerda',
    src:'|q 1:5 1:6 1:7 1:8 2:5 2:6 2:7 2:8 3:5 3:6 3:7 3:8',
    tip:'Dedo 1 na casa 5, dedo 2 na 6, dedo 3 na 7, dedo 4 na 8. Deixe os dedos que já tocaram apoiados nas cordas.' },
  { id:'ex-melodia', style:'exercicio', title:'Primeira melodia em Dó', key:'C', scale:'maior', bpm:72, level:1, tech:'Leitura de tablatura',
    src:'|q 2:1 2:3 1:0 1:1 |h 1:3 |q 1:1 1:0 2:3 2:1 2:3 1:0 |h. 2:1 |q -',
    tip:'Só as cordas 1 e 2. Fale o número da casa antes de tocar e conte os tempos em voz alta.' },
);

/* Músicas originais deste app (cifra + levada). [Acorde] marca a troca, um acorde por compasso. */
const SONGS = [
  { id:'estrada', title:'Estrada de Terra', credit:'Música original do Mapa do Braço', key:'G', bpm:76, level:1, patterns:['semi', 'pop', 'balada'],
    sections:[
      { name:'Intro', bars:['G','Em','C','D'] },
      { name:'Verso', lines:['[G]Saio cedo, [Em]pé na estrada,','[C]sol nascendo de[D]vagar,','[G]cada passo, [Em]cada nota','[C]vai me ensinando a to[D]car.'] },
      { name:'Refrão', lines:['[C]Toca, toca, [G]não para,','[D]mão no ritmo e o cora[Em]ção,','[C]um acorde [G]puxa o outro','[D]e a estrada vira can[G]ção.'] },
    ] },
];
