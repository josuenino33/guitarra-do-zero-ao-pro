/* ===== Edição Worship: o app mostra só o que serve ao louvor =====
   O conteúdo geral (rock, blues, metal, jazz, CAGED, modos, leitura, vida profissional…) continua
   no código, só não aparece. Para voltar ao app completo: EDICAO_ATIVA = false. */
const EDICAO_ATIVA = true;
const EDICAO = (() => {
  // módulos que ficam, com [nível, ordem] na edição worship
  const MODS = { louvor1:[1, 1], m3:[2, 1], m5:[2, 2], m6:[2, 3], louvor2:[3, 1], tec:[3, 2], harm:[4, 1] };
  const TITLES = { m3:'Tríades', m5:'Pentatônica e técnicas para solar', m6:'Escalas mais usadas: maior, menor e modos', tec:'Técnicas de expressão' };
  const HIDE_LESSONS = ['blues', 'blues12', 'tapping', 'hibrida', 'economica', 'skipping', 'legato-avancado'];
  const STYLES_OK = ['worship', 'enfeite', 'gospel', 'tecnica', 'exercicio'];
  const LICKS_TEC_OK = ['harm1'];          // de “técnica”, só os harmônicos
  const JAMS_OK = ['w-cong', 'w-68', 'w-build', 'w-amb', 'pop', 'seisoito'];
  const LEVADAS_OK = ['semi', 'colcheias', 'pop', 'balada', 'chuck', 'seisoito'];
  const DEMO_SWAP = { b2:'w2', r2:'g3', r1:'ex-pent' };   // exemplos de rock/blues trocados por frases de louvor
  const W_LEVELS = [
    { n:1, title:'Base no louvor', sub:'Capotraste, acordes coloridos, levadas e dinâmica', goals:[
      { id:'w1-capo', text:'Escolho o capotraste certo para o tom do ministro', href:'#repertorio' },
      { id:'w1-cores', text:'Toco G – Dsus4 – Em7 – Cadd9 sem tirar os dedos das cordas 1 e 2', href:'#aula-louvor-cores' },
      { id:'w1-base', text:'Acompanho a base “Worship congregacional” do começo ao fim', href:'#jam-w-cong' },
      { id:'w1-swell', text:'Faço swells de volume no tempo da música', href:'#aula-louvor-pad' } ] },
    { n:2, title:'Tríades e escalas', sub:'Tríades nas cordas agudas, pentatônicas, escala maior, menor e modos', goals:[
      { id:'w2-inv', text:'Acerto 20 no treino “Qual inversão?”', href:'#triades' },
      { id:'w2-tri', text:'Toco I – V – vi – IV em tríades nas cordas 1-2-3 em três tons', href:'#triades' },
      { id:'w2-penta', text:'Toco a pentatônica maior de G da casa 7 à 12, subindo e descendo', href:'#aula-pentmaior' },
      { id:'w2-maior', text:'Toco a escala maior de G em duas posições e a menor natural de Em', href:'#aula-maior3nps' } ] },
    { n:3, title:'Solos e enfeites', sub:'Delay pontilhado, notas-alvo, respostas e enfeites', goals:[
      { id:'w3-delay', text:'Calculo o delay pontilhado de qualquer música', href:'#aula-louvor-delay' },
      { id:'w3-frases', text:'Toco três frases do Jam worship junto com a base', href:'#jam-w-cong' },
      { id:'w3-enfeite', text:'Faço enfeites nas trocas de acorde sem atrasar a base', href:'#lick-e1' },
      { id:'w3-resposta', text:'Toco o lick “Resposta à voz” com delay', href:'#lick-w5' } ] },
    { n:4, title:'Harmonia e ouvido', sub:'Campo harmônico, funções e tocar de ouvido', goals:[
      { id:'w4-numeros', text:'Escrevo três músicas do repertório em números', href:'#aula-louvor-numeros' },
      { id:'w4-palco', text:'Monto o álbum de uma música e toco no Modo Palco', href:'#repertorio' },
      { id:'w4-ouvido', text:'Reconheço I, IV, V e vi de ouvido', href:'#ouvido' } ] },
  ];

  if (EDICAO_ATIVA) {
    for (let i = MODULES.length - 1; i >= 0; i--) {
      const m = MODULES[i];
      if (!MODS[m.id]) { MODULES.splice(i, 1); continue; }
      [m.level, m.order] = MODS[m.id];
      if (TITLES[m.id]) m.title = TITLES[m.id];
      m.lessons = m.lessons.filter(l => !HIDE_LESSONS.includes(l.id));
    }
    for (let i = LICKS.length - 1; i >= 0; i--) {
      const l = LICKS[i];
      if (!STYLES_OK.includes(l.style) || (l.style === 'tecnica' && !LICKS_TEC_OK.includes(l.id))) LICKS.splice(i, 1);
    }
    Object.keys(STYLES).forEach(k => { if (!STYLES_OK.includes(k)) delete STYLES[k]; });
    if (RH.PATTERNS) for (let i = RH.PATTERNS.length - 1; i >= 0; i--) if (!LEVADAS_OK.includes(RH.PATTERNS[i].id)) RH.PATTERNS.splice(i, 1);
    const lessonIds = new Set(); MODULES.forEach(m => m.lessons.forEach(l => lessonIds.add(l.id)));
    const lickIds = new Set(LICKS.map(l => l.id));
    MODULES.forEach(m => m.lessons.forEach(l => {
      if (l.demo && l.demo.kind === 'lick' && !lickIds.has(l.demo.lick) && DEMO_SWAP[l.demo.lick]) l.demo = Object.assign({}, l.demo, { lick: DEMO_SWAP[l.demo.lick] });
      if (l.lick && !lickIds.has(l.lick)) { if (DEMO_SWAP[l.lick]) l.lick = DEMO_SWAP[l.lick]; else delete l.lick; }
      if (l.links) l.links = l.links.filter(k => !((k.to === 'aula' && !lessonIds.has(k.id)) || (k.to === 'licks' && k.id && !lickIds.has(k.id)) || (k.to === 'jam' && k.id && !JAMS_OK.includes(k.id))));
    }));
    LEVELS.splice(0, LEVELS.length, ...W_LEVELS);
  }

  /** Um link interno (#aula-x, #lick-x, #jam-x) ainda existe nesta edição? */
  function hrefOk(href) {
    if (!EDICAO_ATIVA || !href) return true;
    const m = String(href).match(/^#(aula|lick|jam)-(.+)$/);
    if (!m) return true;
    if (m[1] === 'aula') return MODULES.some(mod => mod.lessons.some(l => l.id === m[2]));
    if (m[1] === 'lick') return LICKS.some(l => l.id === m[2]);
    return JAMS_OK.includes(m[2]);
  }
  return { ativa: EDICAO_ATIVA, jamOk: id => !EDICAO_ATIVA || JAMS_OK.includes(id), hrefOk, JAMS_OK };
})();
