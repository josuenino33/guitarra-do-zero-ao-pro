/* ===== Licks, solos e exercícios ===== */
const STYLES = { rock:'Rock', blues:'Blues', gospel:'Gospel / Louvor', metal:'Metal / Neoclássico', solo:'Solos completos', exercicio:'Exercícios' };

const LICKS = [
  { id:'r1', style:'rock', title:'Tercinas descendentes', key:'A', scale:'pent_menor', bpm:90, level:2, tech:'Palhetada alternada',
    src:'|t 1:8 1:5 2:8 1:5 2:8 2:5 2:8 2:5 3:7 2:5 3:7 3:5 3:7 3:5 4:7 3:5 4:7 4:5 |h 4:7~',
    tip:'Grupos de 3 notas que descem a caixa 1 de Lá menor. Acentue a primeira nota de cada tercina para sentir o pulso.' },
  { id:'r2', style:'rock', title:'Bend na corda Sol e resposta', key:'A', scale:'pent_menor', bpm:80, level:2, tech:'Bend, release, vibrato',
    src:'|e 4:7 3:5 |q 3:7b2 |e 2:5 1:5 |q. 2:8b2r |e 2:5 3:7 3:5 |q 4:7~ -',
    tip:'Dois bends de 1 tom: confira a afinação do primeiro tocando a casa 9 da corda 3 antes. No segundo, volte o bend devagar.' },
  { id:'r3', style:'rock', title:'Riff de power chords em Mi', key:'E', scale:'pent_menor', bpm:100, level:1, tech:'Palm mute, power chords',
    src:'|e 6:0m 6:0m 6:3+5:5 6:0m 6:0m 6:5+5:7 6:0m 6:3+5:5 6:0m 6:0m 6:3+5:5 6:0m |q 5:5+4:7 |e 5:5+4:7 6:3+5:5',
    tip:'Corda solta abafada (PM) entre os acordes, que soam abertos. Use só palhetadas para baixo para o som ficar mais pesado.' },
  { id:'r4', style:'rock', title:'Double stops de rock’n’roll', key:'A', scale:'pent_menor', bpm:110, level:3, tech:'Double stop, bend oblíquo',
    src:'|e 2:5+1:5 2:5+1:5 2:5+1:5 2:5+1:5 |q 3:7b2+2:5 |e 3:5 4:7 |e 2:8+1:8 2:8+1:8 |q 2:5+1:5 |h 3:7~',
    tip:'Pestana com o dedo 1 nas cordas 1 e 2 na casa 5. No bend oblíquo, a corda 3 sobe até soar igual à corda 2.' },
  { id:'b1', style:'blues', title:'Frase de abertura com blue note', key:'A', scale:'blues', bpm:75, level:2, tech:'Tercinas, vibrato',
    src:'|t 3:5 3:7 3:8 |q 3:7~ |e 2:5 1:5 |t 2:8 2:5 3:7 |q 3:5 |e 4:5 5:7 |h 4:7~',
    tip:'A blue note (casa 8, corda 3) é só passagem: vá direto para a casa 7 com vibrato.' },
  { id:'b2', style:'blues', title:'Box alto na casa 10', key:'A', scale:'blues', bpm:70, level:3, tech:'Bend com release',
    src:'|e 2:10 2:13 |q 1:10b2r |e 2:13 2:10 |q. 3:12b2 |e 2:10 |q 2:13 2:10~ -',
    tip:'Região muito usada no blues elétrico, acima da caixa 1. A tônica Lá fica na corda 2, casa 10.' },
  { id:'b3', style:'blues', title:'Turnaround clássico em Lá', key:'A', scale:'blues', bpm:80, level:2, tech:'Linha cromática',
    src:'|e 1:5+3:8 1:5+3:7 1:5+3:6 1:5+3:5 |q 5:0 |e 6:2 6:1 |h 6:0+4:6+3:7+2:5 -',
    tip:'A corda 1 fica parada na casa 5 enquanto a corda 3 desce casa por casa. Termina no E7, que chama de volta o começo do blues.' },
  { id:'b4', style:'blues', title:'Descida pelas blue notes', key:'A', scale:'blues', bpm:80, level:2, tech:'Slide, blue note',
    src:'|e 3:5 3:7/ 3:8 3:7 |q 3:5 |e 4:7 4:5 |e 5:7 5:6 5:5 6:8 |h 6:5~',
    tip:'Duas blue notes: casa 8 na corda 3 e casa 6 na corda 5. Deixe o slide bem audível.' },
  { id:'g1', style:'gospel', title:'Tríades em G–D–Em–C', key:'G', scale:'maior', bpm:80, level:2, tech:'Tríades arpejadas',
    src:'|e 3:7 2:8 1:7 2:8 3:7 2:7 1:5 2:7 3:9 2:8 1:7 2:8 3:9 2:8 1:8 2:8',
    tip:'Sol (2ª inv.), Ré (fundamental), Mi menor (fundamental) e Dó (1ª inv.). Só uma ou duas notas mudam de um acorde para o outro.' },
  { id:'g2', style:'gospel', title:'Sextas de soul', key:'G', scale:'maior', bpm:72, level:3, tech:'Intervalos de 6ª, slide',
    src:'|e 3:4+1:3 3:5+1:5 |q 3:7+1:7 |e 3:9/+1:8/ 3:7+1:7 |q 3:5+1:5 |e 3:4+1:3 3:2+1:2 |q 3:5+1:5 |h 3:4+1:3~',
    tip:'Toque as cordas 3 e 1 juntas e abafe a corda 2 com a polpa do dedo. As sextas são a marca da guitarra soul e gospel.' },
  { id:'g3', style:'gospel', title:'Hammer de sus para a terça', key:'G', scale:'maior', bpm:66, level:1, tech:'Hammer-on, tríades',
    src:'|e 3:7 2:8 1:5 1:7h |q 2:8 3:7 |e 3:7 3:9h 2:8 1:8 |q 2:8 1:7~',
    tip:'Sobre G e C. O hammer sai da 2ª e cai na 3ª do acorde. Com delay e reverb vira a textura clássica de louvor.' },
  { id:'g4', style:'gospel', title:'Corrida na pentatônica maior', key:'G', scale:'pent_maior', bpm:76, level:2, tech:'Semicolcheias, slide',
    src:'|s 3:7 3:9 2:8 2:10 1:7 1:10 1:12/ 1:10 |e 1:7 2:10 2:8 3:9 |q 3:7 3:9/ |h 2:8~',
    tip:'Pentatônica maior de Sol entre as casas 7 e 12. Termina na tônica com vibrato largo.' },
  { id:'m1', style:'metal', title:'Galope em Mi', key:'E', scale:'menor', bpm:120, level:2, tech:'Galope, palm mute',
    src:'|e 6:0m |s 6:0m 6:0m |e 6:0m |s 6:0m 6:0m |e 6:0m |s 6:0m 6:0m |e 6:3+5:5 |s 6:3+5:5 6:3+5:5 |e 6:0m |s 6:0m 6:0m |e 6:0m |s 6:0m 6:0m |e 6:5+5:7 |s 6:5+5:7 6:5+5:7 |e 6:6+5:8 |s 6:6+5:8 6:6+5:8',
    tip:'Ritmo de galope: uma colcheia e duas semicolcheias (baixo, baixo-cima). O último acorde, B♭5, forma o trítono com o Mi.' },
  { id:'m2', style:'metal', title:'Pedal neoclássico', key:'E', scale:'menor_harm', bpm:90, level:4, tech:'Pedal, palhetada alternada',
    src:'|s 1:17 1:12 1:15 1:12 1:14 1:12 1:15 1:12 1:14 1:12 1:11 1:12 1:17 1:12 1:19 1:12 1:20 1:12 1:19 1:12 1:17 1:12 1:15 1:12 |q 1:11 1:12~',
    tip:'A casa 12 (Mi) volta a cada duas notas enquanto a melodia anda pela menor harmônica. Tudo numa corda só: foco na palhetada.' },
  { id:'m3', style:'metal', title:'Sweep Am – E', key:'A', scale:'menor_harm', bpm:70, level:5, tech:'Sweep picking',
    src:'|s 5:12 4:14 3:14 2:13 1:12 1:17/ 1:12p 2:13 3:14 4:14 5:12 - 5:7 4:6 3:4 2:5 1:4 1:7/ 1:4p 2:5 3:4 4:6 5:7 - |h 5:12~',
    tip:'Arpejos de Lá menor e Mi maior em 5 cordas. Palheta para baixo na subida, para cima na descida, e solte cada nota logo depois de tocar.' },
  { id:'m4', style:'metal', title:'Legato em 3 notas por corda', key:'E', scale:'menor', bpm:80, level:4, tech:'Hammer-on, pull-off',
    src:'|s 4:12 4:14h 4:16h 3:12 3:14h 3:16h 2:13 2:15h 2:17h 1:14 1:15h 1:17h 1:15p 1:14p 2:17 2:15p 2:13p 3:16 3:14p 3:12p 4:16 4:14p 4:12p 5:14 |h 6:12~',
    tip:'Palhete só a primeira nota de cada corda; as outras saem com hammer-on e pull-off. O volume das notas ligadas deve igualar o das palhetadas.' },
  { id:'s1', style:'solo', title:'Solo de rock em Lá menor (8 compassos)', key:'A', scale:'menor', bpm:84, level:3, tech:'Caixas 1 e 2, bends, menor harmônica',
    chords:['Am','G','F','G','Am','G','F','E'],
    src:'|q 1:5~ |e 1:8 1:5 2:8 1:5 |q 2:5~ |e 3:7 3:5 4:7 3:5 |q. 3:7b2r |e 3:5 |e 2:6 2:5 3:7 3:5 |q 2:6~ 1:5 |t 2:8 2:5 3:7 2:5 3:7 3:5 |h 2:8~ |q 1:8b2 |e 1:10 1:8 2:10 2:8 |q 2:10~ |s 2:10 2:8 3:9 2:8 3:9 3:7 4:9 3:7 |q 3:7b2r 4:9~ |q 3:10 |e 3:9 3:7 4:10 3:7 |q 3:10~ |e 2:9 1:7 2:9 2:10 |e 3:9 2:9 |q 3:9~',
    tip:'Repare nas notas que caem no começo de cada compasso: elas são do acorde da vez (Fá sobre F, Si sobre G, Sol♯ sobre E).' },
  { id:'s2', style:'solo', title:'Solo de blues em Lá (12 compassos)', key:'A', scale:'blues', bpm:76, level:3, tech:'Pergunta e resposta, bends de ½ tom',
    chords:['A7','D7','A7','A7','D7','D7','A7','A7','E7','D7','A7','E7'],
    src:'|q 3:5b1 |e 3:7 3:5 |q 4:7~ - |q 2:7 |e 2:5 3:7 |q 3:5 - |t 1:8 1:5 2:8 2:5 3:7 2:5 |q 3:7b2 2:5~ |h - |q - |e 3:6 3:7 |q 3:7~ |e 2:7 2:5 |q 3:7 |e 3:5 4:7 |q 4:7b2r |e 4:5 5:7 |h 5:5~ |e 5:7 4:5 4:7 3:5 |q 3:6 4:7~ |h - |e 1:8 1:5 2:8 2:5 |q 2:5~ |e 3:7 3:4 |q 4:6 - |e 3:5 3:7 |q 2:7~ |e 2:5 3:7 |q 3:5 |q 3:5b1 |e 4:7 5:7 |h 4:7~ |h 6:0+4:6+3:7+2:5 -',
    tip:'O bend de ½ tom na casa 5 da corda 3 transforma a ♭3 (Dó) na 3ª maior (Dó♯) do A7. É o “choro” típico do blues.' },
];

/* Exercícios gerados a partir da teoria */
(() => {
  const tok = (s, f) => `${6 - s}:${f}`;
  const upDown = list => list.concat(list.slice(0, -1).reverse());
  const byPitch = ms => ms.slice().sort((a, b) => a.s - b.s || a.f - b.f);

  const spider = [];
  for (let s = 0; s < 6; s++) for (let f = 5; f <= 8; f++) spider.push(tok(s, f));
  for (let s = 5; s >= 0; s--) for (let f = 8; f >= 5; f--) spider.push(tok(s, f));

  const pent = byPitch(T.box('pent_menor', 9, 0, 22)).map(m => tok(m.s, m.f));
  const g3 = byPitch(T.nps(T.SCALES.maior.iv, 7, 0, 3, 22)).map(m => tok(m.s, m.f));
  const seq = [];
  for (let i = 0; i + 2 < pent.length; i++) seq.push(pent[i], pent[i + 1], pent[i + 2]);

  LICKS.push(
    { id:'ex-aranha', style:'exercicio', title:'Aranha cromática 1-2-3-4', key:'A', scale:'pent_menor', bpm:70, level:1, tech:'Sincronia das mãos',
      src:'|s ' + spider.join(' '), tip:'Um dedo por casa (5, 6, 7, 8). Mantenha os dedos perto das cordas e palhete alternado sem parar.' },
    { id:'ex-pent', style:'exercicio', title:'Caixa 1 de Lá menor, sobe e desce', key:'A', scale:'pent_menor', bpm:70, level:1, tech:'Palhetada alternada',
      src:'|e ' + upDown(pent).join(' ') + ' -', tip:'Colcheias regulares. Quando estiver fácil, use o treino de velocidade.' },
    { id:'ex-3nps', style:'exercicio', title:'Sol maior em 3 notas por corda', key:'G', scale:'maior', bpm:60, level:2, tech:'Palhetada alternada',
      src:'|s ' + upDown(g3).join(' ') + ' -', tip:'Posição 1 de Sol maior (casas 3 a 8). Seis palhetadas por corda, ida e volta.' },
    { id:'ex-seq3', style:'exercicio', title:'Sequência em grupos de 3', key:'A', scale:'pent_menor', bpm:70, level:2, tech:'Sequências',
      src:'|t ' + seq.join(' '), tip:'1-2-3, 2-3-4, 3-4-5... Uma tercina por tempo. Transforma a escala em frase.' },
  );
})();

const lickById = id => LICKS.find(l => l.id === id) || (S.get().myLicks || []).find(l => l.id === id && !l.deleted);
