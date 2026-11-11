/* ===== Worship: acordes coloridos (add9, 7M, sus, m7, m11…) gerados automaticamente no braço ===== */
// Qualidades extras usadas pelo gerador (a ordem dos intervalos segue as letras de 01d-spelling.js)
Object.assign(T.CHORDS, {
  madd9:    { name:'Menor com nona (m(add9))', sym:'m(add9)', iv:[0,2,3,7] },
  m11:      { name:'Menor com 11ª (m11)', sym:'m11', iv:[0,3,7,10,5] },
  six9:     { name:'Sexta com nona (6(9))', sym:'6(9)', iv:[0,4,7,9,2] },
  sus4add9: { name:'Sus4 com nona (sus4(9))', sym:'sus4(9)', iv:[0,2,5,7] },
});
Object.assign(QUAL_SUFFIX, { madd9:'m(add9)', m11:'m11', six9:'6(9)', sus4add9:'sus4(9)' });
Object.assign(CH.SUFFIX, { 'm(add9)':'madd9', 'madd9':'madd9', 'm11':'m11', '6(9)':'six9', '6/9':'six9', 'sus4(9)':'sus4add9' });
// formas móveis de reserva (tônica na corda 5), para o dicionário e para tocar em qualquer tom
Object.assign(VOICINGS, {
  add9:     [{ k:'Corda 6', rs:0, o:[0,2,4,1,0,0] }, { k:'Corda 5', rs:1, o:[-9,0,2,4,2,0] }],
  madd9:    [{ k:'Corda 6', rs:0, o:[0,2,4,0,0,0] }, { k:'Corda 5', rs:1, o:[-9,0,2,4,1,0] }],
  m11:      [{ k:'Corda 5', rs:1, o:[-9,0,0,0,1,0] }],
  six9:     [{ k:'Corda 5', rs:1, o:[-9,0,-1,-1,0,0] }],
  sus4add9: [{ k:'Corda 5', rs:1, o:[-9,0,0,2,0,0] }],
});

const WV = (() => {
  // notas de cor permitidas por grau do tom maior (intervalos em relação à tônica do acorde)
  // I e IV: 9, 7M, 6 · ii e vi: 7, 9, 11 · iii: 7, 11 · V: 9, sus4
  const COLORS = [[2, 11, 9], [10, 2, 5], [10, 5], [2, 11, 9], [2, 5], [10, 2, 5]];
  const MINOR = [false, true, true, false, false, true];
  const DEG_NAMES = ['I', 'ii', 'iii', 'IV', 'V', 'vi'];

  /** Nome (sufixo) e qualidade a partir dos intervalos presentes. */
  function qualify(set, minor) {
    const h = x => set.has(x);
    if (minor) {
      if (!h(3)) return null;
      if (h(10) && h(5)) return ['m11', 'm11'];
      if (h(10) && h(2)) return ['m9', 'm9'];
      if (h(10)) return ['m7', 'm7'];
      if (h(2) && !h(5)) return ['m(add9)', 'madd9'];
      return null;
    }
    if (!h(4)) {
      if (!h(7)) return null;
      if (h(5) && h(2)) return ['sus4(9)', 'sus4add9'];
      if (h(5)) return ['sus4', 'sus4'];
      if (h(2)) return ['sus2', 'sus2'];
      return null;
    }
    if (h(5)) return null;                       // 3ª e 4ª juntas embolam
    if (h(11) && h(9)) return null;              // 6ª e 7M juntas viram outro acorde
    if (h(11)) return h(2) ? ['7M(9)', 'maj9'] : ['7M', 'maj7'];
    if (h(9)) return h(2) ? ['6(9)', 'six9'] : ['6', 'six'];
    if (h(2)) return ['add9', 'add9'];
    return null;
  }

  /**
   * Procura no braço formas com cordas soltas soando e notas de cor do grau.
   * Regras: baixo na tônica, 4+ cordas, 2 a 4 dedos, no máximo 4 casas de abertura, sem cordas abafadas no meio.
   */
  function search(keyPc, deg, maxFret) {
    const minor = MINOR[deg], third = minor ? 3 : 4;
    const r = T.mod(keyPc + T.SCALES.maior.iv[deg]);
    const scale = T.SCALES.maior.iv.map(x => T.mod(keyPc + x));
    const allow = [0, third, 7, ...COLORS[deg]].filter(x => scale.includes(T.mod(r + x)));
    const out = new Map(), f = new Array(6);
    const evaluate = p => {
      const ms = [], set = new Set();
      let opens = 0, fr = 0;
      for (let s = 0; s < 6; s++) if (f[s] >= 0) { const m = T.TUNING[s] + f[s]; ms.push(m); set.add(T.mod(m - r)); if (f[s] === 0) opens++; else fr++; }
      if (ms.length < 4 || fr < 2 || fr > 4) return;
      const q = qualify(set, minor); if (!q) return;
      const colors = [...set].filter(x => ![0, 3, 4, 7].includes(x)).length;
      if (!colors || colors > (q[1] === 'm11' ? 3 : 2)) return;
      const so = ms.slice().sort((a, b) => a - b);
      let semis = 0;
      for (let i = 0; i < so.length; i++) for (let j = i + 1; j < so.length; j++) if (so[j] - so[i] === 1) semis++;
      if (semis > 1) return;
      const score = Math.min(opens, 3) * 1.5 + colors * 1.2 + (set.has(third) ? 3 : 0) + (set.has(7) ? 1 : 0) + ms.length * 0.4
        - semis * 3 - (q[1] === 'six' || q[1] === 'six9' ? 0.6 : 0) + (p <= 5 ? 1 : 0) + (T.mod(so[so.length - 1] - r) === 0 ? 0.5 : 0);
      const key = f.join(',');
      if (!out.has(key) || out.get(key).score < score) out.set(key, { f: f.slice(), q, score });
    };
    const rec = (s, started, p) => {
      if (s === 6) { evaluate(p); return; }
      const opts = started ? [0, p, p + 1, p + 2, p + 3] : [-1, 0, p, p + 1, p + 2, p + 3];
      for (const v of opts) {
        if (v < 0) { if (s < 3) { f[s] = -1; rec(s + 1, false, p); } continue; }
        const iv = T.mod(T.TUNING[s] + v - r);
        if (!started && iv !== 0) continue;
        if (!allow.includes(iv)) continue;
        f[s] = v; rec(s + 1, true, p);
      }
    };
    for (let p = 1; p + 3 <= maxFret; p++) rec(0, false, p);
    return [...out.values()].sort((a, b) => b.score - a.score);
  }

  const cache = new Map();
  /** Formas worship de um grau (0 = I … 5 = vi) num tom maior. Até 4 formas, com nomes diferentes primeiro. */
  function list(keyPc, deg, maxFret = 12) {
    const ck = keyPc + ':' + deg + ':' + maxFret;
    if (cache.has(ck)) return cache.get(ck);
    const root = T.spellAscii(T.spellScale(keyPc, 'maior').list[deg]);
    const found = search(keyPc, deg, maxFret), pick = [];
    for (const v of found) { if (pick.length >= 4) break; if (pick.some(x => x.q[0] === v.q[0])) continue; pick.push(v); }
    for (const v of found) { if (pick.length >= 4) break; if (!pick.includes(v)) pick.push(v); }
    const res = pick.map(v => ({ name: root + v.q[0], q: v.q[1], f: v.f, d: v.f.map(() => 0), k: 'Worship', deg }));
    cache.set(ck, res);
    return res;
  }
  const best = (keyPc, deg) => list(keyPc, deg)[0] || null;

  /** Toca uma forma (objeto com f) como palhetada para baixo. */
  function strum(shape, when, o = {}) {
    const t = when ?? A.now() + 0.03;
    CH.voicing(shape).forEach((v, i) => A.play(v.midi, t + i * 0.024, { dur: o.dur ?? 2.6, vel: o.vel ?? 0.55, string: v.s, bus: o.bus }));
  }

  /** Delay de colcheia pontuada (o eco "worship") em ms para um andamento. */
  const dottedDelay = bpm => Math.round(60000 / bpm * 0.75);

  return { list, best, strum, qualify, dottedDelay, COLORS, MINOR, DEG_NAMES };
})();
