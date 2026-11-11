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

  /** Delay de colcheia pontuada (o eco "worship") em ms. Em 6/8 (sub 3) o tempo é a semínima pontuada: usa 2 colcheias. */
  const dottedDelay = (bpm, sub = 2) => Math.round(60000 / bpm * (sub === 3 ? 2 / 3 : 0.75));

  /* ---------- Gerador de frases sobre uma progressão (sai no formato de tablatura do app) ---------- */
  const PHRASES = [
    { id:'ostinato', name:'Ostinato com delay', tip:'Três notas repetindo. Com o delay pontilhado vira a cascata típica do worship. Toque leve e deixe o eco preencher.' },
    { id:'alvos', name:'Melodia de alvos', tip:'Cada compasso cai numa nota do acorde e as notas de passagem caminham até o próximo alvo.' },
    { id:'resposta', name:'Nota longa + resposta', tip:'Segura uma nota (como um swell de volume) e responde com uma frase curta descendo, como resposta à voz.' },
    { id:'triades', name:'Tríades arpejadas', tip:'As três notas de cada acorde nas cordas 1-2-3, na inversão mais perto da anterior. A mão quase não anda e a nota de cima vira uma melodia.' },
    { id:'subida', name:'Subida pro refrão', tip:'Vai subindo a pentatônica e chega na tônica aguda no último compasso. Use antes do refrão.' },
  ];
  // padrões em "passos" (colcheias no 4/4, colcheias de tercina no 6/8)
  const PAT = {
    8: { alvos:[4, 2, 2], resp:{ rest:2, run:4, end:2 }, sub:[3, 3, 2] },
    6: { alvos:[3, 1, 1, 1], resp:{ rest:0, run:3, end:3 }, sub:[3, 3] },
  };
  const TOK = [[1 / 6, 'x'], [0.25, 's'], [1 / 3, 't'], [0.5, 'e'], [1, 'q'], [1.5, 'q.'], [2, 'h'], [3, 'h.'], [4, 'w']];
  const tokOf = beats => (TOK.find(([v]) => Math.abs(v - beats) < 1e-6) || [])[1];

  /**
   * Frase de solo sobre os graus `degs` (um por compasso) no tom maior `keyPc`.
   * Notas da pentatônica maior; cai em notas do acorde nos tempos fortes. Retorna { src, beats }.
   */
  function phrase(type, keyPc, degs, meter = 4, sub = 2, seed = 1) {
    let sd = seed;
    const rnd = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
    const S = meter * sub, P = PAT[S] || PAT[8], L = degs.length;
    const pool = []; for (let m = 59; m <= 81; m++) if ([0, 2, 4, 7, 9].includes(T.mod(m - keyPc))) pool.push(m);
    const roots = pool.filter(m => T.mod(m - keyPc) === 0);
    const cl = (list, m, r = true) => { const s = list.slice().sort((a, b) => Math.abs(a - m) - Math.abs(b - m)); return r && s.length > 1 && rnd() < 0.3 ? s[1] : s[0]; };
    const up = m => pool.find(x => x > m) ?? m;
    const dn = m => { let r = m; for (const x of pool) if (x < m) r = x; return r; };
    const safe = d => {
      const r = T.mod(keyPc + T.SCALES.maior.iv[d]), t = [0, MINOR[d] ? 3 : 4, 7].map(i => T.mod(r + i));
      const ct = pool.filter(m => t.includes(T.mod(m)));
      return ct.length ? ct : pool;
    };
    const ev = [];   // { st: passo inicial, n: passos, m: nota }
    if (type === 'ostinato') {
      const r1 = cl(roots, 72, false), r5 = pool.find(m => m > r1 && T.mod(m - keyPc) === 7) ?? r1, r2 = pool.find(m => m > r1 && T.mod(m - keyPc) === 2) ?? r1;
      degs.forEach((d, b) => {
        const low = cl(safe(d).filter(m => m < r2), r1 - 2, false) ?? r1;
        const cell = rnd() < 0.5 ? [r5, r2, low] : [r5, low, r2];
        for (let i = 0; i < S; i++) ev.push({ st: b * S + i, n: 1, m: cell[i % 3] });
      });
    } else if (type === 'alvos') {
      let cur = cl(pool, 70 + Math.round(rnd() * 5));
      const tg = degs.map((d, b) => (cur = cl(b === L - 1 ? roots : safe(d), cur)));
      tg.forEach((t, b) => {
        let st = b * S;
        if (b === L - 1) { ev.push({ st, n: S, m: t }); return; }
        ev.push({ st, n: P.alvos[0], m: t }); st += P.alvos[0];
        const nx = tg[b + 1], appr = [];
        let x = nx;
        for (let i = 0; i < P.alvos.length - 1; i++) { x = nx > t ? dn(x) : nx < t ? up(x) : (i % 2 ? nx : up(nx)); appr.unshift(x); }
        appr.forEach((m, i) => { ev.push({ st, n: P.alvos[i + 1], m }); st += P.alvos[i + 1]; });
      });
    } else if (type === 'triades') {
      const path = TRI.progPath(keyPc, degs, '123', 7 + Math.round(rnd() * 3)), pat = S === 6 ? [0, 1, 2, 1, 2, 1] : [0, 2, 1, 2, 0, 2, 1, 2];
      path.forEach((v, b) => pat.forEach((k, i) => ev.push({ st: b * S + i, n: 1, m: T.TUNING[v.strings[k]] + v.frets[k], p: { s: v.strings[k], f: v.frets[k] } })));
    } else if (type === 'resposta') {
      let last = cl(pool, 69);
      degs.forEach((d, b) => {
        let st = b * S;
        if (b % 2 === 0 || b === L - 1) { last = cl(b === L - 1 ? roots : safe(d), last); ev.push({ st, n: S, m: last }); return; }
        st += P.resp.rest;
        let m = cl(safe(d), up(up(last)), false);   // a resposta começa numa nota do acorde
        for (let i = 0; i < P.resp.run; i++) { ev.push({ st, n: 1, m }); st++; m = dn(m); }
        last = cl(safe(d), m, false);
        ev.push({ st, n: P.resp.end, m: last });
      });
    } else {
      let m = cl(pool, 62 + Math.round(rnd() * 3), false);
      degs.forEach((d, b) => {
        let st = b * S;
        if (b === L - 1) { ev.push({ st, n: S, m: roots.find(x => x > m) ?? roots[roots.length - 1] }); return; }
        const s = safe(d).filter(x => x >= m); m = s.length ? s[0] : cl(safe(d), m, false);
        P.sub.forEach(n => { ev.push({ st, n, m }); st += n; m = up(m); });
      });
    }
    // posição no braço: perto da tônica na corda Si, a mão anda devagar
    let c = T.mod(keyPc - T.TUNING[4]); if (c < 5) c += 12;
    const toks = [];
    let cur = null, t = 0;
    const put = (beats, tok) => { const k = tokOf(beats); if (k !== cur) { toks.push('|' + k); cur = k; } toks.push(tok); };
    ev.sort((a, b) => a.st - b.st).forEach(e => {
      if (e.st > t) { put((e.st - t) / sub, '-'); t = e.st; }
      let best = e.p || null, bc = e.p ? -1 : 1e9;
      for (let s = 0; s < 6 && !e.p; s++) {
        const f = e.m - T.TUNING[s];
        if (f < 0 || f > 17) continue;
        const cost = Math.abs(f - c) + (f === 0 ? 1.5 : 0) + (s < 2 ? 2 : 0);
        if (cost < bc) { bc = cost; best = { s, f }; }
      }
      c = 0.7 * c + 0.3 * best.f;
      const beats = e.n / sub;
      put(beats, `${6 - best.s}:${best.f}${beats >= 2 ? '~' : ''}`);
      t = e.st + e.n;
    });
    return { src: toks.join(' '), beats: L * meter };
  }

  return { list, best, strum, qualify, dottedDelay, phrase, PHRASES, COLORS, MINOR, DEG_NAMES };
})();
