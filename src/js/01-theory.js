'use strict';
/* ===== Teoria: notas, escalas, acordes e posições no braço ===== */
const T = (() => {
  const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const LAT = { C:'Dó', D:'Ré', E:'Mi', F:'Fá', G:'Sol', A:'Lá', B:'Si' };
  const ROOTS = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
  // índice 0 = corda 6 (Mi grave) ... índice 5 = corda 1 (Mi agudo)
  const TUNING = [40, 45, 50, 55, 59, 64];
  const IV = ['R','b2','2','b3','3','4','b5','5','b6','6','b7','7'];
  const IV_NAME = ['Tônica','2ª menor','2ª maior','3ª menor','3ª maior','4ª justa',
    'Trítono (5ª diminuta)','5ª justa','6ª menor','6ª maior','7ª menor','7ª maior'];
  // família de cor de cada intervalo (usado no CSS: .iv-r, .iv-3 ...)
  const IV_ROLE = ['r','2','2','3','3','4','b5','5','6','6','7','7'];
  const FLAT_PARENTS = new Set([5, 10, 3, 8, 1, 6]);

  const SCALES = {
    pent_menor: { name:'Pentatônica menor', iv:[0,3,5,7,10], parent:3, sys:'box' },
    pent_maior: { name:'Pentatônica maior', iv:[0,2,4,7,9], parent:0, sys:'box' },
    blues:      { name:'Escala blues', iv:[0,3,5,6,7,10], parent:3, sys:'box', base:[0,3,5,7,10] },
    blues_maior:{ name:'Blues maior', iv:[0,2,3,4,7,9], parent:0, sys:'box', base:[0,2,4,7,9] },
    maior:      { name:'Maior (jônio)', iv:[0,2,4,5,7,9,11], parent:0, sys:'3nps' },
    menor:      { name:'Menor natural (eólio)', iv:[0,2,3,5,7,8,10], parent:3, sys:'3nps' },
    dorico:     { name:'Dórico', iv:[0,2,3,5,7,9,10], parent:10, sys:'3nps' },
    frigio:     { name:'Frígio', iv:[0,1,3,5,7,8,10], parent:8, sys:'3nps' },
    lidio:      { name:'Lídio', iv:[0,2,4,6,7,9,11], parent:7, sys:'3nps' },
    mixolidio:  { name:'Mixolídio', iv:[0,2,4,5,7,9,10], parent:5, sys:'3nps' },
    menor_harm: { name:'Menor harmônica', iv:[0,2,3,5,7,8,11], parent:3, sys:'3nps' },
    frigio_dom: { name:'Frígio dominante', iv:[0,1,4,5,7,8,10], parent:8, sys:'3nps' },
  };

  const CHORDS = {
    maior: { name:'Maior', sym:'', iv:[0,4,7] },
    menor: { name:'Menor', sym:'m', iv:[0,3,7] },
    dim:   { name:'Diminuta', sym:'°', iv:[0,3,6] },
    aum:   { name:'Aumentada', sym:'+', iv:[0,4,8] },
    sus2:  { name:'Sus2', sym:'sus2', iv:[0,2,7] },
    sus4:  { name:'Sus4', sym:'sus4', iv:[0,5,7] },
    power: { name:'Power chord (5)', sym:'5', iv:[0,7] },
    dom7:  { name:'Dominante (7)', sym:'7', iv:[0,4,7,10] },
    maj7:  { name:'Maior com 7M', sym:'7M', iv:[0,4,7,11] },
    m7:    { name:'Menor com 7', sym:'m7', iv:[0,3,7,10] },
    m7b5:  { name:'Meio-diminuto', sym:'m7(b5)', iv:[0,3,6,10] },
  };

  // Formas CAGED: rs = corda da tônica (0 = corda 6); off = deslocamento em casas por corda
  const CAGED = {
    maior: [
      { k:'C', rs:1, off:[null,0,-1,-3,-2,-3] },
      { k:'A', rs:1, off:[null,0,2,2,2,0] },
      { k:'G', rs:0, off:[0,-1,-3,-3,-3,0] },
      { k:'E', rs:0, off:[0,2,2,1,0,0] },
      { k:'D', rs:2, off:[null,null,0,2,3,2] },
    ],
    menor: [
      { k:'C', rs:1, off:[null,0,-2,-3,-2,null] },
      { k:'A', rs:1, off:[null,0,2,2,1,0] },
      { k:'G', rs:0, off:[0,-2,-3,-3,0,0] },
      { k:'E', rs:0, off:[0,2,2,0,0,0] },
      { k:'D', rs:2, off:[null,null,0,2,3,1] },
    ],
  };

  const STRING_SETS = [
    { id:'123', label:'Cordas 1-2-3', s:[3,4,5] },
    { id:'234', label:'Cordas 2-3-4', s:[2,3,4] },
    { id:'345', label:'Cordas 3-4-5', s:[1,2,3] },
    { id:'456', label:'Cordas 4-5-6', s:[0,1,2] },
  ];
  const INV_NAME = ['Fundamental', '1ª inversão', '2ª inversão'];

  const mod = (n, m = 12) => ((n % m) + m) % m;
  const NATPC = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
  const pcOf = name => {
    if (typeof name === 'number') return mod(name);
    const m = String(name).match(/^([A-G])(##|bb|#|b)?/);
    if (!m) return 0;
    const a = !m[2] ? 0 : m[2][0] === '#' ? m[2].length : -m[2].length;
    return mod(NATPC[m[1]] + a);
  };
  const pitch = (s, f) => TUNING[s] + f;

  function useFlats(rootPc, parent = 0) { return FLAT_PARENTS.has(mod(rootPc + parent)); }

  function noteName(pc, flats, latin) {
    let n = (flats ? FLAT : SHARP)[mod(pc)];
    if (latin) n = LAT[n[0]] + n.slice(1);
    return n.replace('#', '♯').replace('b', '♭');
  }
  // nome da tônica escolhida, respeitando a grafia dos seletores
  function rootName(pc, latin) {
    let n = ROOTS[mod(pc)];
    if (latin) n = LAT[n[0]] + n.slice(1);
    return n.replace('#', '♯').replace('b', '♭');
  }
  const ivLabel = semis => IV[mod(semis)].replace('b', '♭');

  function mark(s, f, rootPc, extra) {
    const pc = mod(pitch(s, f));
    const iv = mod(pc - rootPc);
    return Object.assign({ s, f, pc, iv, role: IV_ROLE[iv] }, extra);
  }

  /** Todas as notas das classes de altura dadas, no braço inteiro. */
  function allNotes(ivs, rootPc, maxFret, lo = 0) {
    const set = new Set(ivs.map(i => mod(rootPc + i)));
    const out = [];
    for (let s = 0; s < 6; s++)
      for (let f = lo; f <= maxFret; f++)
        if (set.has(mod(pitch(s, f)))) out.push(mark(s, f, rootPc));
    return out;
  }

  function nextPitch(p, pcs) { let q = p + 1; while (!pcs.has(mod(q))) q++; return q; }

  function fitFrets(list, maxFret) {
    let min = Math.min(...list.map(m => m.f)), max = Math.max(...list.map(m => m.f));
    let shift = 0;
    if (min < 0) shift = 12;
    else if (max > maxFret && min >= 12) shift = -12;
    if (shift) list.forEach(m => { m.f += shift; });
    return list.filter(m => m.f >= 0 && m.f <= maxFret);
  }

  /** Posição com N notas por corda começando no grau `deg` na corda 6. */
  function nps(ivs, rootPc, deg, perString, maxFret) {
    const pcs = new Set(ivs.map(i => mod(rootPc + i)));
    const startPc = mod(rootPc + ivs[deg]);
    let p = TUNING[0] + mod(startPc - TUNING[0]);
    const out = [];
    for (let s = 0; s < 6; s++) {
      for (let k = 0; k < perString; k++) {
        if (s > 0 || k > 0) p = nextPitch(p, pcs);
        out.push({ s, f: p - TUNING[s] });
      }
    }
    return fitFrets(out, maxFret).map(m => mark(m.s, m.f, rootPc));
  }

  /** Caixas (2 notas por corda) com notas extras (ex.: blue note) dentro da janela da corda. */
  function box(scaleKey, rootPc, idx, maxFret) {
    const sc = SCALES[scaleKey];
    const base = sc.base || sc.iv;
    const marks = nps(base, rootPc, idx, 2, maxFret);
    const extras = sc.iv.filter(i => !base.includes(i));
    if (!extras.length) return marks;
    const out = marks.slice();
    for (let s = 0; s < 6; s++) {
      const fs = marks.filter(m => m.s === s).map(m => m.f);
      if (!fs.length) continue;
      const lo = Math.min(...fs), hi = Math.max(...fs) + 1;
      for (let f = lo; f <= Math.min(hi, maxFret); f++)
        if (extras.includes(mod(pitch(s, f) - rootPc))) out.push(mark(s, f, rootPc));
    }
    return out;
  }

  function positionsCount(scaleKey) {
    const sc = SCALES[scaleKey];
    return (sc.base || sc.iv).length;
  }

  /** Notas de uma escala numa posição (ou braço inteiro quando pos < 0). */
  function scaleMarks(scaleKey, rootPc, pos, maxFret) {
    const sc = SCALES[scaleKey];
    if (pos < 0) return allNotes(sc.iv, rootPc, maxFret);
    const ms = sc.sys === 'box' ? box(scaleKey, rootPc, pos, maxFret) : nps(sc.iv, rootPc, pos, 3, maxFret);
    // posições depois da 1ª continuam subindo o braço quando cabem (evita cair nas cordas soltas)
    const lo = Math.min(...ms.map(m => m.f)), hi = Math.max(...ms.map(m => m.f));
    if (pos > 0 && lo < 3 && hi + 12 <= maxFret) ms.forEach(m => { m.f += 12; });
    return ms;
  }

  /** Forma CAGED posicionada no braço. */
  function cagedShape(quality, k, rootPc, maxFret) {
    const sh = CAGED[quality].find(x => x.k === k);
    let f = mod(rootPc - TUNING[sh.rs]);
    const offs = sh.off.filter(o => o != null);
    if (f + Math.min(...offs) < 0) f += 12;
    if (f + Math.max(...offs) > maxFret) f -= 12;
    const notes = [];
    sh.off.forEach((o, s) => { if (o != null) notes.push(mark(s, f + o, rootPc)); });
    const fs = notes.map(n => n.f);
    return { k, notes, lo: Math.min(...fs), hi: Math.max(...fs) };
  }

  function cagedAll(quality, rootPc, maxFret) {
    return CAGED[quality].map(sh => cagedShape(quality, sh.k, rootPc, maxFret)).sort((a, b) => a.lo - b.lo);
  }

  /** Tríades fechadas num grupo de 3 cordas, todas as inversões no braço. */
  function triads(rootPc, quality, strings, maxFret) {
    const ivs = CHORDS[quality].iv.slice(0, 3);
    const out = [];
    for (let inv = 0; inv < 3; inv++) {
      const order = ivs.slice(inv).concat(ivs.slice(0, inv));
      const pcs = order.map(i => mod(rootPc + i));
      const f0 = mod(pcs[0] - TUNING[strings[0]]);
      for (let base = f0; base <= maxFret; base += 12) {
        const p0 = TUNING[strings[0]] + base;
        const p1 = nextPitch(p0, new Set([pcs[1]]));
        const p2 = nextPitch(p1, new Set([pcs[2]]));
        const frets = [base, p1 - TUNING[strings[1]], p2 - TUNING[strings[2]]];
        if (frets.some(f => f < 0 || f > maxFret)) continue;
        if (Math.max(...frets) - Math.min(...frets) > 5) continue;
        out.push({ inv, notes: frets.map((f, i) => mark(strings[i], f, rootPc)), lo: Math.min(...frets) });
      }
    }
    return out.sort((a, b) => a.lo - b.lo);
  }

  /** Posições de uma classe de altura em todo o braço. */
  function pcPositions(pc, maxFret) {
    const out = [];
    for (let s = 0; s < 6; s++)
      for (let f = 0; f <= maxFret; f++)
        if (mod(pitch(s, f)) === mod(pc)) out.push({ s, f });
    return out;
  }

  const chordName = (rootPc, q, latin) => rootName(rootPc, latin) + CHORDS[q].sym;
  const stringLabel = s => 'Corda ' + (6 - s);

  return { SHARP, FLAT, ROOTS, TUNING, IV, IV_NAME, IV_ROLE, SCALES, CHORDS, CAGED, STRING_SETS, INV_NAME,
    mod, pcOf, pitch, useFlats, noteName, rootName, ivLabel, mark, allNotes, nps, box, positionsCount,
    scaleMarks, cagedShape, cagedAll, triads, pcPositions, chordName, stringLabel };
})();
