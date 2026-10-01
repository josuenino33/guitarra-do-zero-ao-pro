/* ===== Grafia correta das notas: cada grau recebe a sua letra =====
   Ex.: Sol♭ maior = G♭ A♭ B♭ C♭ D♭ E♭ F (e não “B” no lugar de C♭); Lá lídio tem D♯ (♯4), não E♭. */
(() => {
  const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const LAT = ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si'];
  const NAT = [0, 2, 4, 5, 7, 9, 11];
  const H7 = [0, 1, 2, 3, 4, 5, 6];

  // letra (deslocamento a partir da tônica) de cada nota das escalas e acordes
  const SCALE_LETTERS = {
    pent_menor: [0, 2, 3, 4, 6], pent_maior: [0, 1, 2, 4, 5], blues: [0, 2, 3, 4, 4, 6], blues_maior: [0, 1, 2, 2, 4, 5],
    // grafia prática do jazz: o ♯9 é escrito como a 3ª menor (E7♯9 = E G♯ B D G)
    alterada: [0, 1, 2, 2, 4, 5, 6], dim_ts: [0, 1, 2, 3, 3, 4, 5, 6], dim_st: [0, 1, 2, 2, 3, 4, 5, 6], tons_inteiros: [0, 1, 2, 3, 4, 5],
  };
  const SCALE_LABELS = { alterada: ['R', '♭9', '♯9', '3', '♭5', '♭13', '♭7'], dim_st: ['R', '♭9', '♯9', '3', '♯11', '5', '13', '♭7'] };
  const CHORD_LABELS = { s9: ['R', '3', '5', '♭7', '♯9'] };
  // a grafia da tônica segue a armadura do tom (G♯ menor, não A♭ menor; D♭ maior, não C♯ maior)
  const FAMILY = { maior:'maior', lidio:'maior', mixolidio:'maior', pent_maior:'maior', blues_maior:'maior', lidio_dom:'maior', tons_inteiros:'maior',
    menor:'menor', dorico:'menor', frigio:'menor', menor_harm:'menor', menor_mel:'menor', frigio_dom:'menor', pent_menor:'menor', blues:'menor' };
  const CHORD_LETTERS = {
    maior: [0, 2, 4], menor: [0, 2, 4], dim: [0, 2, 4], aum: [0, 2, 4], sus2: [0, 1, 4], sus4: [0, 3, 4], power: [0, 4],
    dom7: [0, 2, 4, 6], maj7: [0, 2, 4, 6], m7: [0, 2, 4, 6], m7b5: [0, 2, 4, 6], dim7: [0, 2, 4, 6], mmaj7: [0, 2, 4, 6], aummaj7: [0, 2, 4, 6],
    six: [0, 2, 4, 5], m6: [0, 2, 4, 5], nine: [0, 2, 4, 6, 1], m9: [0, 2, 4, 6, 1], maj9: [0, 2, 4, 6, 1], add9: [0, 1, 2, 4],
    thirteen: [0, 2, 4, 6, 5], b9: [0, 2, 4, 6, 1], s9: [0, 2, 4, 6, 2],
  };
  const EXT = new Set(['nine', 'm9', 'maj9', 'add9', 'thirteen', 'b9', 's9']);
  const PREFERRED = new Set(['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']);

  const norm = d => { d = T.mod(d); return d > 6 ? d - 12 : d; };
  const acc = (n, ascii) => n === 0 ? '' : (n > 0 ? (ascii ? '#' : '♯') : (ascii ? 'b' : '♭')).repeat(Math.abs(n));
  const spellIn = (letter, pc) => ({ l: letter, a: norm(pc - NAT[letter]) });
  const name = (sp, latin, ascii) => (latin ? LAT : LET)[sp.l] + acc(sp.a, ascii);
  const ascii = sp => LET[sp.l] + acc(sp.a, true);

  /** Lê “F#”, “Bb”, “Cbb”… */
  function parseName(n) {
    const m = String(n).match(/^([A-G])(##|bb|#|b)?/);
    if (!m) return null;
    const a = !m[2] ? 0 : m[2][0] === '#' ? m[2].length : -m[2].length;
    return { l: LET.indexOf(m[1]), a };
  }
  /** As duas grafias possíveis de uma tônica (C# ou Db, por exemplo). */
  function rootCandidates(pc) {
    const out = [];
    for (let l = 0; l < 7; l++) { const a = norm(pc - NAT[l]); if (Math.abs(a) <= 1) out.push({ l, a }); }
    // tecla branca: só o nome natural (E, não F♭); tecla preta: sustenido e bemol
    return out.some(c => c.a === 0) ? out.filter(c => c.a === 0) : out;
  }
  // escalas que repetem letras: se a letra padrão der dobrado, usa a vizinha (blue note de E♭ = A, não B♭♭)
  const FLEX = new Set(['blues', 'blues_maior', 'alterada', 'dim_ts', 'dim_st', 'tons_inteiros']);
  function spellList(root, rootPc, ivs, letters, flex) {
    return ivs.map((iv, i) => {
      const lo = (root.l + letters[i]) % 7, sp = spellIn(lo, rootPc + iv);
      if (!flex || Math.abs(sp.a) < 2) return sp;
      const alt = [spellIn((lo + 6) % 7, rootPc + iv), spellIn((lo + 1) % 7, rootPc + iv)].filter(x => Math.abs(x.a) < 2);
      return alt[0] || sp;
    });
  }
  const cost = list => list.reduce((s, x) => s + Math.abs(x.a) + (Math.abs(x.a) > 1 ? 4 : 0), 0);
  /** Escolhe a grafia da tônica com menos acidentes (Db maior, C# menor…). */
  function bestRoot(rootPc, ivs, letters) {
    const cands = rootCandidates(rootPc);
    if (cands.length === 1) return cands[0];
    let best = null, bc = Infinity;
    cands.forEach(c => {
      const k = cost(spellList(c, rootPc, ivs, letters)) - (PREFERRED.has(ascii(c)) ? 0.5 : 0);
      if (k < bc) { bc = k; best = c; }
    });
    return best;
  }

  /** Rótulo do grau pela letra: ♯4 no lídio, ♯5 no aumentado, ♭♭7 no diminuto, 9/11/13 nas extensões. */
  function degLabel(iv, lo, ext) {
    if (T.mod(iv) === 0 && lo === 0) return 'R';
    let num = lo + 1;
    if (ext && (lo === 1 || lo === 3 || lo === 5)) num += 7;
    return acc(norm(iv - NAT[lo])) + num;
  }
  function roleFor(lo, a) {
    if (lo === 4 && a < 0) return 'b5';
    return ['r', '2', '3', '4', '5', '6', '7'][lo];
  }

  /** Mapa classe de altura → { l, a, i (rótulo), role } para um contexto. */
  function labelRole(lab) {
    if (lab === 'R') return 'r';
    if (lab.includes('♭5')) return 'b5';
    const n = lab.replace(/[♭♯]/g, '');
    return ({ 9: '2', 11: '4', 13: '6' })[n] || n[0];
  }
  function makeMap(list, rootPc, ivs, letters, ext, labels) {
    const map = {};
    ivs.forEach((iv, i) => {
      const lo = letters[i], sp = list[i];
      const lab = labels ? labels[i] : degLabel(iv, lo, ext);
      map[T.mod(rootPc + iv)] = { l: sp.l, a: sp.a, i: lab, role: labels ? labelRole(lab) : roleFor(lo, norm(iv - NAT[lo])) };
    });
    return map;
  }

  const scaleLetters = key => SCALE_LETTERS[key] || (T.SCALES[key].iv.length === 7 ? H7 : T.SCALES[key].iv.map((_, i) => i));
  const chordLetters = q => CHORD_LETTERS[q] || T.CHORDS[q].iv.map((_, i) => [0, 2, 4, 6, 1, 3, 5][i]);

  /** Grafia de uma escala: tônica, lista na ordem dos graus e mapa para o braço. */
  const EXT_SCALES = new Set(['alterada', 'dim_st']);   // nomes de tensão: ♭9 ♯9 ♯11 ♭13
  function spellScale(rootPc, key, root) {
    const sc = T.SCALES[key], letters = scaleLetters(key), ext = EXT_SCALES.has(key), custom = SCALE_LABELS[key];
    const fam = FAMILY[key];
    const r = root || (fam ? bestRoot(rootPc, T.SCALES[fam].iv, H7) : bestRoot(rootPc, sc.iv, letters));
    const labels = custom || sc.iv.map((iv, i) => degLabel(iv, letters[i], ext));
    const list = spellList(r, rootPc, sc.iv, letters, FLEX.has(key));
    return { root: r, list, labels, map: makeMap(list, rootPc, sc.iv, letters, ext, custom) };
  }
  /** Grafia de um acorde (tônica opcional, quando vem de um tom). */
  function spellChord(rootPc, q, root) {
    const ch = T.CHORDS[q], letters = chordLetters(q), ext = EXT.has(q), custom = CHORD_LABELS[q];
    const r = root || bestRoot(rootPc, ch.iv, letters);
    const labels = custom || ch.iv.map((iv, i) => degLabel(iv, letters[i], ext));
    const list = spellList(r, rootPc, ch.iv, letters, false);
    return { root: r, list, labels, map: makeMap(list, rootPc, ch.iv, letters, ext, custom) };
  }

  /** Transpõe o nome de um acorde de um tom para outro mantendo a relação de letras. */
  function transposeName(chord, fromKey, toKey) {
    const m = chord.match(/^([A-G](?:##|bb|#|b)?)(.*?)(?:\/([A-G](?:##|bb|#|b)?))?$/);
    if (!m) return chord;
    const fk = parseName(fromKey), tk = parseName(toKey);
    const fkPc = T.pcOf(fromKey), tkPc = T.pcOf(toKey);
    const mv = n => { const p = parseName(n), off = T.mod(T.pcOf(n) - fkPc), lo = (p.l - fk.l + 7) % 7; return ascii(spellIn((tk.l + lo) % 7, tkPc + off)); };
    return mv(m[1]) + m[2] + (m[3] ? '/' + mv(m[3]) : '');
  }
  /** Nome do tom de uma escala (para seletores e títulos). */
  const keyName = (rootPc, scaleKey, latin) => name(spellScale(rootPc, scaleKey).root, latin);
  /** Nome neutro de uma tecla: “C♯/D♭”. */
  const neutralName = (pc, latin) => rootCandidates(pc).map(c => name(c, latin)).join('/');

  Object.assign(T, { LETTERS: LET, spellIn, spellName: name, spellAscii: ascii, parseName, bestRoot, degLabel, spellScale, spellChord,
    transposeName, keyName, neutralName, scaleLetters, chordLetters });
})();
