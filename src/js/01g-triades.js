/* ===== Tríades worship: inversões por grupo de cordas e condução de vozes (a mão anda o mínimo) ===== */
const TRI = (() => {
  const MINOR = [false, true, true, false, false, true];
  const TOP_NAME = { 0: 'tônica', 3: '3ª', 4: '3ª', 7: '5ª' };

  /** Todas as tríades (fechadas) do acorde no grupo de cordas, até a casa maxFret. */
  function options(rootPc, minor, setId = '123', maxFret = 15) {
    const set = T.STRING_SETS.find(x => x.id === setId) || T.STRING_SETS[0];
    return T.triads(rootPc, minor ? 'menor' : 'maior', set.s, maxFret).map(v => {
      const f = [-1, -1, -1, -1, -1, -1];
      v.notes.forEach(n => { f[n.s] = n.f; });
      const frets = v.notes.map(n => n.f), top = v.notes[2];
      return { inv: v.inv, f, frets, strings: set.s, lo: Math.min(...frets), hi: Math.max(...frets), root: rootPc, minor,
        top: TOP_NAME[T.mod(T.TUNING[top.s] + top.f - rootPc)] };
    });
  }
  const center = o => (o.lo + o.hi) / 2;
  /** Quantas casas os três dedos andam de uma tríade para a outra. */
  const move = (a, b) => a.frets.reduce((s, f, i) => s + Math.abs(f - b.frets[i]), 0);

  /**
   * Caminho de menor movimento para a sequência de acordes [{ root, minor }], perto da casa `near`.
   * Com loop, também conta a volta do último para o primeiro (a progressão repete).
   */
  function path(chords, setId = '123', near = 7, loop = true) {
    const opts = chords.map(c => options(c.root, c.minor, setId));
    if (opts.some(o => !o.length)) return null;
    let best = null, bestCost = Infinity;
    opts[0].forEach((first, s0) => {
      let cost = [Math.abs(center(first) - near) * 0.6];
      const back = [];
      let prevOpts = [first];
      for (let i = 1; i < opts.length; i++) {
        const c = [], b = [];
        opts[i].forEach((o, j) => {
          let bv = Infinity, bk = 0;
          prevOpts.forEach((p, k) => { const v = cost[k] + move(p, o); if (v < bv) { bv = v; bk = k; } });
          c[j] = bv + Math.abs(center(o) - near) * 0.15; b[j] = bk;
        });
        cost = c; back.push(b); prevOpts = opts[i];
      }
      cost.forEach((v, j) => {
        const total = v + (loop && opts.length > 1 ? move(prevOpts[j], first) : 0);
        if (total < bestCost) {
          bestCost = total;
          const seq = [j];
          for (let i = back.length - 1; i >= 0; i--) seq.unshift(back[i][seq[0]]);
          best = seq.map((k, i) => i === 0 ? first : opts[i][k]);
        }
      });
    });
    return best;
  }

  /** Caminho para os graus `degs` (0 = I … 5 = vi) do tom maior keyPc, com nomes. */
  function progPath(keyPc, degs, setId = '123', near = 7) {
    const H = harmonize(T.mod(keyPc), 'maior');
    const p = path(degs.map(d => ({ root: H[d].pc, minor: MINOR[d] })), setId, near);
    return p && p.map((v, i) => Object.assign({}, v, { name: H[degs[i]].triad, deg: degs[i] }));
  }
  const totalMove = p => p.reduce((s, v, i) => s + (i ? move(p[i - 1], v) : 0), 0);

  /** Forma para diagrama, Jam e palhetada. */
  const shape = v => ({ name: v.name || '', f: v.f, d: v.f.map(() => 0), k: 'Tríade' });

  /** Tablatura do caminho: em bloco (3 notas juntas) ou arpejada. Um acorde por compasso. */
  const ARP = { 8: [0, 2, 1, 2, 0, 2, 1, 2], 6: [0, 1, 2, 1, 2, 1] };
  function src(p, mode = 'bloco', meter = 4, sub = 2) {
    const note = (v, i) => `${6 - v.strings[i]}:${v.frets[i]}`;
    if (mode === 'arpejo') {
      const pat = ARP[meter * sub] || ARP[8], d = sub === 3 ? '|t' : '|e';
      return d + ' ' + p.map(v => pat.map(i => note(v, i)).join(' ')).join(' ');
    }
    const blk = v => [0, 1, 2].map(i => note(v, i)).join('+');
    if (meter * sub === 6) return p.map(v => `|q ${blk(v)} ${blk(v)}`).join(' ');
    return p.map(v => `|q. ${blk(v)} |e ${blk(v)} |h ${blk(v)}~`).join(' ');
  }

  return { options, path, progPath, totalMove, move, shape, src, MINOR };
})();
