/* ===== Harmonia avançada: tétrades, extensões, voicings drop 2/drop 3 e escalas extras ===== */
Object.assign(T.CHORDS, {
  dim7:  { name:'Diminuto (°7)', sym:'°7', iv:[0,3,6,9] },
  six:   { name:'Sexta (6)', sym:'6', iv:[0,4,7,9] },
  m6:    { name:'Menor com sexta (m6)', sym:'m6', iv:[0,3,7,9] },
  nine:  { name:'Nona (9)', sym:'9', iv:[0,4,7,10,2] },
  m9:    { name:'Menor com nona (m9)', sym:'m9', iv:[0,3,7,10,2] },
  maj9:  { name:'Sétima maior com nona', sym:'7M(9)', iv:[0,4,7,11,2] },
  add9:  { name:'Com nona (add9)', sym:'add9', iv:[0,2,4,7] },
  thirteen: { name:'Treze (13)', sym:'13', iv:[0,4,7,10,9] },
  b9:    { name:'Sétima com nona menor', sym:'7(b9)', iv:[0,4,7,10,1] },
  s9:    { name:'Sétima com nona aumentada', sym:'7(#9)', iv:[0,4,7,10,3] },
});

Object.assign(T.SCALES, {
  menor_mel:  { name:'Menor melódica', iv:[0,2,3,5,7,9,11], parent:3, sys:'3nps' },
  lidio_dom:  { name:'Lídio dominante', iv:[0,2,4,6,7,9,10], parent:5, sys:'3nps' },
  alterada:   { name:'Alterada (superlócrio)', iv:[0,1,3,4,6,8,10], parent:1, sys:'3nps' },
  dim_ts:     { name:'Diminuta (tom-semitom)', iv:[0,2,3,5,6,8,9,11], parent:3, sys:'3nps' },
  dim_st:     { name:'Dominante diminuta (semitom-tom)', iv:[0,1,3,4,6,7,9,10], parent:1, sys:'3nps' },
  tons_inteiros: { name:'Tons inteiros', iv:[0,2,4,6,8,10], parent:0, sys:'3nps' },
});

/* Voicings móveis: rs = corda da tônica (0 = corda 6), o = casas relativas (-9 = não tocar). */
const VOICINGS = {
  maior:  [{ k:'Forma de E', rs:0, o:[0,2,2,1,0,0] }, { k:'Forma de A', rs:1, o:[-9,0,2,2,2,0] }, { k:'Tríade aguda (forma de D)', rs:2, o:[-9,-9,0,2,3,2] }],
  menor:  [{ k:'Forma de Em', rs:0, o:[0,2,2,0,0,0] }, { k:'Forma de Am', rs:1, o:[-9,0,2,2,1,0] }, { k:'Tríade aguda (forma de Dm)', rs:2, o:[-9,-9,0,2,3,1] }],
  dom7:   [{ k:'Forma de E7', rs:0, o:[0,2,0,1,0,0] }, { k:'Drop 3 (corda 6)', rs:0, o:[0,-9,0,1,0,-9] }, { k:'Drop 2 (corda 5)', rs:1, o:[-9,0,2,0,2,-9] }, { k:'Drop 2 (corda 4)', rs:2, o:[-9,-9,0,2,1,2] }],
  maj7:   [{ k:'Drop 3 (corda 6)', rs:0, o:[0,-9,1,1,0,-9] }, { k:'Drop 2 (corda 5)', rs:1, o:[-9,0,2,1,2,-9] }, { k:'Drop 2 (corda 4)', rs:2, o:[-9,-9,0,2,2,2] }],
  m7:     [{ k:'Forma de Em7', rs:0, o:[0,2,0,0,0,0] }, { k:'Drop 3 (corda 6)', rs:0, o:[0,-9,0,0,0,-9] }, { k:'Drop 2 (corda 5)', rs:1, o:[-9,0,2,0,1,-9] }, { k:'Drop 2 (corda 4)', rs:2, o:[-9,-9,0,2,1,1] }],
  m7b5:   [{ k:'Drop 3 (corda 6)', rs:0, o:[0,-9,0,0,-1,-9] }, { k:'Drop 2 (corda 5)', rs:1, o:[-9,0,1,0,1,-9] }, { k:'Drop 2 (corda 4)', rs:2, o:[-9,-9,0,1,1,1] }],
  dim7:   [{ k:'Drop 3 (corda 6)', rs:0, o:[0,-9,-1,0,-1,-9] }, { k:'Drop 2 (corda 5)', rs:1, o:[-9,0,1,-1,1,-9] }],
  six:    [{ k:'Corda 6', rs:0, o:[0,-9,-1,1,0,-9] }, { k:'Corda 5', rs:1, o:[-9,0,2,2,2,2] }],
  m6:     [{ k:'Corda 5', rs:1, o:[-9,0,-2,-1,-2,-9] }],
  nine:   [{ k:'Corda 5', rs:1, o:[-9,0,-1,0,0,0] }],
  m9:     [{ k:'Corda 5', rs:1, o:[-9,0,-2,0,0,-9] }],
  maj9:   [{ k:'Corda 5', rs:1, o:[-9,0,-1,1,0,-9] }],
  thirteen: [{ k:'Corda 6', rs:0, o:[0,-9,0,1,2,-9] }],
  b9:     [{ k:'Corda 5', rs:1, o:[-9,0,-1,0,-1,-9] }],
  s9:     [{ k:'Corda 5 (o acorde do Hendrix)', rs:1, o:[-9,0,-1,0,1,-9] }],
  sus2:   [{ k:'Forma de A', rs:1, o:[-9,0,2,2,0,0] }],
  sus4:   [{ k:'Forma de E', rs:0, o:[0,2,2,2,0,0] }, { k:'Forma de A', rs:1, o:[-9,0,2,2,3,0] }],
  aum:    [{ k:'Corda 5', rs:1, o:[-9,0,-1,-2,-2,-9] }, { k:'Corda 4', rs:2, o:[-9,-9,0,-1,-1,-2] }],
  dim:    [{ k:'Corda 5', rs:1, o:[-9,0,1,2,1,-9] }],
  power:  [{ k:'Corda 6', rs:0, o:[0,2,2,-9,-9,-9] }, { k:'Corda 5', rs:1, o:[-9,0,2,2,-9,-9] }],
};
const QUAL_SUFFIX = { maior:'', menor:'m', dom7:'7', maj7:'7M', m7:'m7', m7b5:'m7(b5)', dim7:'°7', six:'6', m6:'m6', nine:'9', m9:'m9', maj9:'7M(9)',
  thirteen:'13', b9:'7(b9)', s9:'7(#9)', sus2:'sus2', sus4:'sus4', aum:'+', dim:'°', power:'5', add9:'add9' };

(() => {
  // novas cifras reconhecidas pelo parser
  const extra = { '6':'six', 'm6':'m6', '9':'nine', 'm9':'m9', '7M(9)':'maj9', 'maj9':'maj9', '13':'thirteen', '7(b9)':'b9', '7b9':'b9',
    '7(#9)':'s9', '7#9':'s9', '°7':'dim7', 'dim7':'dim7', '+':'aum', 'aug':'aum', 'add9':'add9' };
  Object.assign(CH.SUFFIX, extra);

  /** Todas as formas de um acorde no braço (aberta, se houver, e móveis). */
  CH.voicings = (rootPc, q, maxFret = 15) => {
    const name = T.ROOTS[T.mod(rootPc)] + (QUAL_SUFFIX[q] ?? '');
    const out = [];
    if (CH.OPEN[name]) out.push(Object.assign({ name, k: 'Aberta' }, CH.OPEN[name]));
    (VOICINGS[q] || []).forEach(v => {
      let f = T.mod(rootPc - T.TUNING[v.rs]);
      const offs = v.o.filter(o => o !== -9);
      if (f + Math.min(...offs) < 1) f += 12;
      if (f + Math.max(...offs) > maxFret && f - 12 + Math.min(...offs) >= 1) f -= 12;
      const frets = v.o.map(o => o === -9 ? -1 : f + o);
      if (frets.some(x => x > maxFret)) return;
      const same = frets.map((x, i) => x === f ? i : -1).filter(i => i >= 0);
      const sh = { name, k: v.k, f: frets, d: frets.map(() => 0) };
      if (same.length >= 3 && v.o.filter(o => o === 0).length >= 3 && Math.min(...offs) === 0) sh.b = { f, from: Math.min(...same), to: Math.max(...same) };
      out.push(sh);
    });
    return out;
  };

  // acordes sem forma aberta caem na primeira forma móvel
  const baseGet = CH.get;
  CH.get = (name, prefer) => {
    const sh = baseGet(name, prefer);
    if (sh) return sh;
    const p = CH.parse(name); if (!p) return null;
    const v = CH.voicings(p.root, p.q)[0];
    return v ? Object.assign({}, v, { name }) : null;
  };
})();

/** Campo harmônico: tríades e tétrades de cada grau. */
function harmonize(rootPc, scaleKey) {
  const iv = T.SCALES[scaleKey].iv, flats = T.useFlats(rootPc, T.SCALES[scaleKey].parent);
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const tri = { '4,7':'maior', '3,7':'menor', '3,6':'dim', '4,8':'aum' };
  const tet = { '4,7,11':'maj7', '3,7,10':'m7', '4,7,10':'dom7', '3,6,10':'m7b5', '3,6,9':'dim7', '3,7,11':'mmaj7', '4,8,11':'aummaj7' };
  return iv.map((d, i) => {
    const at = k => T.mod(iv[(i + k) % 7] - d);
    const t3 = tri[`${at(2)},${at(4)}`] || 'maior';
    const t4 = tet[`${at(2)},${at(4)},${at(6)}`] || 'm7';
    const pc = T.mod(rootPc + d);
    const nm = (flats ? T.FLAT : T.SHARP)[pc];
    const minor = t3 === 'menor' || t3 === 'dim';
    let roman = ROMAN[i]; if (minor) roman = roman.toLowerCase();
    const acc = T.mod(d - T.SCALES.maior.iv[i]);
    if (acc === 11) roman = '♭' + roman; else if (acc === 1) roman = '♯' + roman;
    const sym4 = { maj7:'7M', m7:'m7', dom7:'7', m7b5:'m7(b5)', dim7:'°7', mmaj7:'m(7M)', aummaj7:'+(7M)' }[t4];
    return { deg: i + 1, pc, roman: roman + (t3 === 'dim' ? '°' : t3 === 'aum' ? '+' : ''), triad: nm + QUAL_SUFFIX[t3], tetrad: nm + sym4, q3: t3, q4: t4,
      fn: ['T', 'SD', 'T', 'SD', 'D', 'T', 'D'][i] };
  });
}
