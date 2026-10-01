/* ===== Ritmo: levadas, palhetada de acordes e escrita rítmica ===== */
const RH = (() => {
  /* Levadas. beats = tempos por compasso, sub = divisões por tempo.
     D/U = para baixo/para cima soando, X = abafado (chuck), x = abafado leve para cima,
     B = baixo (nota mais grave do acorde), b = baixo alternado, '-' = mão passa sem tocar. */
  const PATTERNS = [
    { id:'semi', name:'Uma por tempo', style:'Primeiros passos', beats:4, sub:2, p:'D-D-D-D-', bpm:70 },
    { id:'colcheias', name:'Colcheias ↓↑', style:'Base de tudo', beats:4, sub:2, p:'DUDUDUDU', bpm:70 },
    { id:'pop', name:'Pop / violão de roda', style:'Pop, MPB, louvor', beats:4, sub:2, p:'D-DU-UDU', bpm:80 },
    { id:'balada', name:'Balada', style:'Pop, louvor', beats:4, sub:2, p:'D--UD-DU', bpm:70 },
    { id:'rock', name:'Rock em colcheias', style:'Rock', beats:4, sub:2, p:'DDDDDDDD', bpm:110, accent:[0, 4] },
    { id:'reggae', name:'Reggae (contratempo)', style:'Reggae', beats:4, sub:2, p:'-X-X-X-X', bpm:76 },
    { id:'chuck', name:'Pop com abafado', style:'Pop, funk leve', beats:4, sub:2, p:'D-XU-UXU', bpm:90 },
    { id:'funk', name:'Funk em semicolcheias', style:'Funk, black music', beats:4, sub:4, p:'D-xUX-xUD-xUX-xU', bpm:92 },
    { id:'country', name:'Baixo e acorde', style:'Country, sertanejo', beats:4, sub:2, p:'B-D-b-D-', bpm:96 },
    { id:'valsa', name:'Valsa 3/4', style:'Valsa, guarânia', beats:3, sub:2, p:'B-D-D-', bpm:96 },
    { id:'seisoito', name:'Balada 6/8', style:'Louvor, baladas', beats:2, sub:3, p:'D-UD-U', bpm:58 },
    { id:'shuffle', name:'Shuffle', style:'Blues, rock clássico', beats:4, sub:2, p:'DUDUDUDU', bpm:90, swing:true, accent:[2, 6] },
  ];
  const patById = id => PATTERNS.find(p => p.id === id) || PATTERNS[0];

  function chuck(t, vel = 0.5) {
    A.drum('snare', t, vel * 0.35);
    A.drum('hat', t, vel * 0.8);
  }

  /** Toca um golpe de palheta no acorde. */
  function hit(sym, chordName, t, slotDur, accent, bus) {
    if (sym === '-') return;
    const sh = CH.get(chordName); if (!sh) return;
    const v = CH.voicing(sh);
    const vel = (accent ? 0.62 : 0.48);
    if (sym === 'X' || sym === 'x') {
      chuck(t, sym === 'X' ? 1 : 0.6);
      v.slice(sym === 'X' ? 0 : 2).forEach((n, i) => A.play(n.midi, t + i * 0.006, { dur: 0.05, vel: 0.35, mute: true, string: bus ? 'bk' + n.s : n.s, bus }));
      return;
    }
    if (sym === 'B' || sym === 'b') {
      const n = sym === 'B' ? v[0] : (v[1] || v[0]);
      A.play(n.midi, t, { dur: slotDur * 1.9, vel: 0.7, string: bus ? 'bk' + n.s : n.s, bus });
      return;
    }
    const notes = sym === 'U' ? v.slice(-4).reverse() : (sym === 'D' ? v : v);
    const ring = Math.max(0.25, slotDur * 2.2);
    notes.forEach((n, i) => A.play(n.midi, t + i * (sym === 'U' ? 0.012 : 0.016), { dur: ring, vel: sym === 'U' ? vel * 0.82 : vel, string: bus ? 'bk' + n.s : n.s, bus }));
  }

  /**
   * Reprodutor de levada sobre uma sequência de acordes (um acorde por compasso).
   * cb.onSlot(bar, slot) a cada divisão.
   */
  function Strummer(cb = {}) {
    let clock = null, pat = null, chords = [], bpm = 80, click = true;
    function start(o) {
      stop();
      pat = patById(o.pattern); chords = o.chords; bpm = o.bpm || pat.bpm; click = o.click !== false;
      const slots = pat.beats * pat.sub;
      const countIn = o.countIn !== false ? slots : 0;
      clock = A.Clock(() => bpm, pat.sub, (i, t) => {
        const spb = 60 / bpm, slotDur = spb / pat.sub;
        const k = i - countIn;
        const slot = ((k % slots) + slots) % slots;
        const tt = pat.swing && slot % 2 === 1 ? t + spb / 6 : t;
        if (click && i % pat.sub === 0) A.click(t, (i / pat.sub) % pat.beats === 0);
        if (k < 0) return;
        const bar = Math.floor(k / slots) % chords.length;
        hit(pat.p[slot], chords[bar], tt, slotDur, (pat.accent || [0]).includes(slot));
        setTimeout(() => cb.onSlot && cb.onSlot(bar, slot), Math.max(0, (tt - A.ctx.currentTime) * 1000));
      });
      clock.start();
    }
    function stop() { if (clock) { clock.stop(); clock = null; } A.stopAll(); cb.onSlot && cb.onSlot(-1, -1); }
    return { start, stop, setBpm(b) { bpm = b; }, setClick(c) { click = c; }, get running() { return !!clock; } };
  }

  const ARROW = { D:'↓', U:'↑', X:'✕', x:'✕', B:'B', b:'b', '-':'' };
  function countLabels(pat) {
    const out = [];
    for (let b = 0; b < pat.beats; b++) for (let s = 0; s < pat.sub; s++) {
      if (s === 0) out.push(String(b + 1));
      else if (pat.sub === 2) out.push('e');
      else if (pat.sub === 3) out.push(s === 1 ? 'e' : 'a');
      else out.push(['', 'i', 'e', 'a'][s]);
    }
    return out;
  }
  /** Grade visual da levada. */
  function grid(pat) {
    const counts = countLabels(pat);
    return `<div class="strum-grid" style="--n:${pat.p.length}">${[...pat.p].map((c, i) =>
      `<div class="sg-cell ${c === '-' ? 'rest' : ''} ${c === 'x' || c === 'X' ? 'mute' : ''} ${c === 'U' || c === 'x' ? 'up' : ''} ${i % pat.sub === 0 ? 'beat' : ''}" data-slot="${i}">
        <b>${ARROW[c]}</b><span>${counts[i]}</span></div>`).join('')}</div>`;
  }

  /* ---- Escrita rítmica (uma linha, figuras e pausas) ----
     Tokens: w h q e s (semibreve…semicolcheia), "." pontuada, R antes = pausa (Rq, Re, Rh). */
  const VAL = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25 };
  function parseRhythm(src) {
    let beat = 0;
    return src.trim().split(/\s+/).map(tok => {
      const rest = tok[0] === 'R';
      const k = rest ? tok[1] : tok[0];
      const dot = tok.endsWith('.');
      const d = VAL[k] * (dot ? 1.5 : 1);
      const ev = { k, rest, dot, d, beat };
      beat += d;
      return ev;
    });
  }
  const REST_GLYPH = { w:'𝄻', h:'𝄼', q:'𝄽', e:'𝄾', s:'𝄿' };

  /** SVG da linha rítmica, com barras de compasso a cada `per` tempos. */
  function notation(src, o = {}) {
    const evs = parseRhythm(src);
    const per = o.per || 4, unit = o.unit || 46, y = 44, H = 76;
    const total = evs.reduce((a, e) => a + e.d, 0);
    const bars = Math.ceil(total / per - 1e-6);
    const W = 24 + total * unit + bars * 10 + 12;
    const p = [`<line class="rn-line" x1="8" x2="${W - 8}" y1="${y}" y2="${y}"/>`];
    const xOf = beat => 24 + beat * unit + Math.floor(beat / per + 1e-6) * 10;
    for (let b = 0; b <= bars; b++) { const xb = b === 0 ? 12 : xOf(b * per) - 8; p.push(`<line class="rn-bar" x1="${xb}" x2="${xb}" y1="${y - 14}" y2="${y + 14}"/>`); }
    // agrupa colcheias/semicolcheias do mesmo tempo para as barras de ligação
    const groups = {};
    evs.forEach((e, i) => { e.x = xOf(e.beat) + 6; if (!e.rest && (e.k === 'e' || e.k === 's')) (groups[Math.floor(e.beat + 1e-6)] ||= []).push(e); });
    evs.forEach((e, i) => {
      if (e.rest) { p.push(`<text class="rn-rest" x="${e.x}" y="${y + 9}" text-anchor="middle">${REST_GLYPH[e.k]}</text>`); }
      else {
        const hollow = e.k === 'w' || e.k === 'h';
        p.push(`<ellipse class="rn-head ${hollow ? 'hollow' : ''}" cx="${e.x}" cy="${y}" rx="6.5" ry="4.6" transform="rotate(-20 ${e.x} ${y})"/>`);
        if (e.k !== 'w') p.push(`<line class="rn-stem" x1="${e.x + 5.6}" x2="${e.x + 5.6}" y1="${y - 2}" y2="${y - 32}"/>`);
      }
      if (e.dot) p.push(`<circle class="rn-dot" cx="${e.x + 12}" cy="${y - 3}" r="2"/>`);
      e.i = i;
    });
    Object.values(groups).forEach(g => {
      if (g.length === 1) {
        const e = g[0];
        p.push(`<path class="rn-flag" d="M${e.x + 5.6} ${y - 32} q 9 8 7 18"/>`);
        if (e.k === 's') p.push(`<path class="rn-flag" d="M${e.x + 5.6} ${y - 25} q 9 8 7 18"/>`);
        return;
      }
      const x1 = g[0].x + 5.6, x2 = g[g.length - 1].x + 5.6;
      p.push(`<rect class="rn-beam" x="${x1}" y="${y - 34}" width="${x2 - x1}" height="4"/>`);
      g.forEach((e, j) => {
        if (e.k !== 's') return;
        const nx = g[j + 1] && g[j + 1].k === 's' ? g[j + 1].x + 5.6 : (g[j - 1] && g[j - 1].k === 's' ? null : e.x + 5.6 + 9 * (j === g.length - 1 ? -1 : 1));
        if (nx != null) p.push(`<rect class="rn-beam" x="${Math.min(e.x + 5.6, nx)}" y="${y - 27}" width="${Math.abs(nx - e.x - 5.6)}" height="4"/>`);
      });
    });
    evs.forEach(e => p.push(`<rect class="rn-hit" data-ev="${e.i}" x="${e.x - 10}" y="${y - 38}" width="20" height="52"/>`));
    return { svg: `<svg class="rn" viewBox="0 0 ${W} ${H}" style="max-width:${Math.round(W * 1.7)}px;min-width:${Math.round(W * 1.15)}px">${p.join('')}</svg>`, evs, total };
  }

  /** Toca um ritmo: clique no tempo e uma nota abafada em cada figura. */
  function playRhythm(src, bpm, o = {}) {
    A.init();
    const evs = parseRhythm(src), spb = 60 / bpm;
    const total = evs.reduce((a, e) => a + e.d, 0);
    let t0 = A.now() + 0.1;
    const per = o.per || 4;
    if (o.countIn !== false) { for (let b = 0; b < per; b++) A.click(t0 + b * spb, b === 0); t0 += per * spb; }
    if (o.click !== false) for (let b = 0; b < Math.ceil(total); b++) A.click(t0 + b * spb, b % per === 0);
    evs.forEach(e => { if (!e.rest) A.play(57, t0 + e.beat * spb, { dur: Math.min(e.d * spb, 0.5), vel: 0.75, string: 3 }); });
    return { t0, evs, spb, end: t0 + total * spb };
  }

  /* Exercícios de leitura rítmica (um ou dois compassos 4/4) por nível. */
  const READING = [
    { lv:1, src:'q q q q' }, { lv:1, src:'h h' }, { lv:1, src:'w' }, { lv:1, src:'h q q' }, { lv:1, src:'q q h' },
    { lv:1, src:'q Rq q Rq' }, { lv:1, src:'h. q' }, { lv:2, src:'e e e e q q' }, { lv:2, src:'q e e q e e' },
    { lv:2, src:'e e q e e q' }, { lv:2, src:'q. e q q' }, { lv:2, src:'Re e Re e Re e Re e' }, { lv:2, src:'q Re e h' },
    { lv:3, src:'s s s s q e e q' }, { lv:3, src:'e s s e s s q q' }, { lv:3, src:'q. e e e q' }, { lv:3, src:'s s e s s e q q' },
    { lv:3, src:'e e Rq e e Rq' }, { lv:3, src:'Re e e e q. e' },
  ];

  return { PATTERNS, patById, Strummer, grid, hit, parseRhythm, notation, playRhythm, READING };
})();
