/* ===== Acordes: formas, cifras e diagramas ===== */
const CH = (() => {
  // f = casa por corda (corda 6 → 1), -1 = não tocar; d = dedo (0 = solta); b = pestana {f, from, to} em índice de corda
  const OPEN = {
    'C':     { f:[-1,3,2,0,1,0], d:[0,3,2,0,1,0] },
    'C7':    { f:[-1,3,2,3,1,0], d:[0,3,2,4,1,0] },
    'Cadd9': { f:[-1,3,2,0,3,0], d:[0,2,1,0,3,0] },
    'C7M':   { f:[-1,3,2,0,0,0], d:[0,3,2,0,0,0] },
    'D':     { f:[-1,-1,0,2,3,2], d:[0,0,0,1,3,2] },
    'Dm':    { f:[-1,-1,0,2,3,1], d:[0,0,0,2,3,1] },
    'D7':    { f:[-1,-1,0,2,1,2], d:[0,0,0,2,1,3] },
    'Dsus2': { f:[-1,-1,0,2,3,0], d:[0,0,0,1,3,0] },
    'Dsus4': { f:[-1,-1,0,2,3,3], d:[0,0,0,1,3,4] },
    'Dm7':   { f:[-1,-1,0,2,1,1], d:[0,0,0,2,1,1] },
    'E':     { f:[0,2,2,1,0,0], d:[0,2,3,1,0,0] },
    'Em':    { f:[0,2,2,0,0,0], d:[0,2,3,0,0,0] },
    'E7':    { f:[0,2,0,1,0,0], d:[0,2,0,1,0,0] },
    'Em7':   { f:[0,2,2,0,3,0], d:[0,1,2,0,3,0] },
    'F':     { f:[1,3,3,2,1,1], d:[1,3,4,2,1,1], b:{ f:1, from:0, to:5 } },
    'F7M':   { f:[-1,-1,3,2,1,0], d:[0,0,3,2,1,0] },
    'G':     { f:[3,2,0,0,0,3], d:[2,1,0,0,0,3] },
    'G7':    { f:[3,2,0,0,0,1], d:[3,2,0,0,0,1] },
    'A':     { f:[-1,0,2,2,2,0], d:[0,0,1,2,3,0] },
    'Am':    { f:[-1,0,2,2,1,0], d:[0,0,2,3,1,0] },
    'A7':    { f:[-1,0,2,0,2,0], d:[0,0,2,0,3,0] },
    'Am7':   { f:[-1,0,2,0,1,0], d:[0,0,2,0,1,0] },
    'Asus2': { f:[-1,0,2,2,0,0], d:[0,0,1,2,0,0] },
    'Asus4': { f:[-1,0,2,2,3,0], d:[0,0,1,2,3,0] },
    'B7':    { f:[-1,2,1,2,0,2], d:[0,2,1,3,0,4] },
    'Bm':    { f:[-1,2,4,4,3,2], d:[0,1,3,4,2,1], b:{ f:2, from:1, to:5 } },
  };
  // formas móveis com pestana: tônica na corda 6 (forma de E) ou na corda 5 (forma de A)
  const MOVABLE = {
    E: { rs:0, q: {
      maior: { o:[0,2,2,1,0,0], d:[1,3,4,2,1,1] }, menor: { o:[0,2,2,0,0,0], d:[1,3,4,1,1,1] },
      dom7:  { o:[0,2,0,1,0,0], d:[1,3,1,2,1,1] }, m7:    { o:[0,2,0,0,0,0], d:[1,3,1,1,1,1] },
      maj7:  { o:[0,-9,1,1,0,-9], d:[1,0,3,4,2,0], nb:true }, power: { o:[0,2,2,-9,-9,-9], d:[1,3,4,0,0,0], nb:true },
      sus4:  { o:[0,2,2,2,0,0], d:[1,2,3,4,1,1] }, m7b5: { o:[0,-9,0,0,-1,-9], d:[2,0,3,4,1,0], nb:true },
    } },
    A: { rs:1, q: {
      maior: { o:[-9,0,2,2,2,0], d:[0,1,3,3,3,1] }, menor: { o:[-9,0,2,2,1,0], d:[0,1,3,4,2,1] },
      dom7:  { o:[-9,0,2,0,2,0], d:[0,1,3,1,4,1] }, m7:    { o:[-9,0,2,0,1,0], d:[0,1,3,1,2,1] },
      maj7:  { o:[-9,0,2,1,2,0], d:[0,1,3,2,4,1] }, power: { o:[-9,0,2,2,-9,-9], d:[0,1,3,4,0,0], nb:true },
      sus2:  { o:[-9,0,2,2,0,0], d:[0,1,3,4,1,1] }, sus4: { o:[-9,0,2,2,3,0], d:[0,1,2,3,4,1] },
      m7b5:  { o:[-9,0,1,0,1,-9], d:[0,1,3,2,4,0], nb:true }, dim: { o:[-9,0,1,2,1,-9], d:[0,1,2,4,3,0], nb:true },
    } },
  };
  const SUFFIX = { '':'maior', 'm':'menor', '7':'dom7', 'm7':'m7', '7M':'maj7', 'maj7':'maj7', 'sus2':'sus2', 'sus4':'sus4',
    '5':'power', 'dim':'dim', '°':'dim', 'm7(b5)':'m7b5', 'm7b5':'m7b5', 'ø':'m7b5', '+':'aum', 'aug':'aum', 'add9':'add9' };

  function parse(name) {
    const m = String(name).match(/^([A-G])(##|bb|#|b)?(.*?)(?:\/([A-G](?:##|bb|#|b)?))?$/);
    if (!m) return null;
    const root = T.pcOf(m[1] + (m[2] || ''));
    const q = SUFFIX[m[3]] ?? null;
    return { root, q, suffix: m[3], bass: m[4] ? T.pcOf(m[4]) : null, name };
  }

  function movable(p, prefer) {
    const opts = [];
    for (const [k, sh] of Object.entries(MOVABLE)) {
      const t = sh.q[p.q]; if (!t) continue;
      let f = T.mod(p.root - T.TUNING[sh.rs]);
      if (f === 0) f = 12;
      opts.push({ k, f, t });
    }
    if (!opts.length) return null;
    opts.sort((a, b) => (prefer ? (a.k === prefer ? -1 : 1) : a.f - b.f));
    const { k, f, t } = opts[0];
    const frets = t.o.map(o => o === -9 ? -1 : f + o);
    const sh = { f: frets, d: t.d.slice(), shape: k };
    if (!t.nb) {
      const strs = frets.map((x, i) => x === f ? i : -1).filter(i => i >= 0);
      sh.b = { f, from: Math.min(...strs), to: Math.max(...strs) };
    }
    return sh;
  }

  /** Forma de um acorde pelo nome (aberta quando existe, senão com pestana). */
  function get(name, prefer) {
    if (!prefer && OPEN[name]) return Object.assign({ name }, OPEN[name]);
    const p = CH.parse(name); if (!p) return null;
    const sh = movable(p, prefer);
    return sh ? Object.assign({ name }, sh) : (OPEN[name] ? Object.assign({ name }, OPEN[name]) : null);
  }

  /** Alturas MIDI das cordas tocadas (grave → agudo) com o índice da corda. */
  function voicing(shape) {
    return shape.f.map((f, s) => f < 0 ? null : { s, midi: T.TUNING[s] + f }).filter(Boolean);
  }

  /** Diagrama SVG vertical (corda 6 à esquerda). */
  function diagram(shape, o = {}) {
    if (!shape) return '';
    const W = 96, top = 22, gx = 14, gy = 18, left = 18, rows = 5;
    const played = shape.f.filter(f => f > 0);
    const minF = played.length ? Math.min(...played) : 1, maxF = played.length ? Math.max(...played) : 1;
    const base = maxF <= 5 ? 1 : minF;
    const p = [];
    const x = s => left + s * gx;
    for (let r = 0; r <= rows; r++) p.push(`<line class="cd-fret" x1="${x(0)}" x2="${x(5)}" y1="${top + r * gy}" y2="${top + r * gy}"/>`);
    if (base === 1) p.push(`<rect class="cd-nut" x="${x(0) - 1}" y="${top - 4}" width="${gx * 5 + 2}" height="5"/>`);
    else p.push(`<text class="cd-base" x="${x(0) - 7}" y="${top + gy * 0.68}" text-anchor="end">${base}</text>`);
    for (let s = 0; s < 6; s++) p.push(`<line class="cd-str" x1="${x(s)}" x2="${x(s)}" y1="${top}" y2="${top + rows * gy}"/>`);
    shape.f.forEach((f, s) => {
      if (f < 0) p.push(`<text class="cd-x" x="${x(s)}" y="${top - 8}" text-anchor="middle">×</text>`);
      else if (f === 0) p.push(`<circle class="cd-open" cx="${x(s)}" cy="${top - 11}" r="4"/>`);
    });
    if (shape.b) {
      const y = top + (shape.b.f - base + 0.5) * gy;
      p.push(`<rect class="cd-barre" x="${x(shape.b.from) - 7}" y="${y - 7}" width="${x(shape.b.to) - x(shape.b.from) + 14}" height="14" rx="7"/>`);
      p.push(`<text class="cd-fing" x="${x(shape.b.from)}" y="${y + 4}" text-anchor="middle">1</text>`);
    }
    const rootPc = CH.parse(shape.name)?.root;
    shape.f.forEach((f, s) => {
      if (f <= 0 || (shape.b && f === shape.b.f && s >= shape.b.from && s <= shape.b.to && shape.d[s] === 1)) return;
      const y = top + (f - base + 0.5) * gy;
      const isRoot = rootPc != null && T.mod(T.TUNING[s] + f) === rootPc;
      p.push(`<circle class="cd-dot ${isRoot ? 'root' : ''}" cx="${x(s)}" cy="${y}" r="7"/>`);
      if (shape.d[s]) p.push(`<text class="cd-fing" x="${x(s)}" y="${y + 4}" text-anchor="middle">${shape.d[s]}</text>`);
    });
    return `<svg class="chord-svg" viewBox="0 0 ${W} ${top + rows * gy + 8}" role="img" aria-label="Diagrama do acorde ${shape.name}">${p.join('')}</svg>`;
  }

  /** Cartão com nome + diagrama; clicável para ouvir. */
  function card(name, o = {}) {
    const sh = CH.get(name, o.prefer);
    return `<button type="button" class="chord-card" data-chord="${name}" ${o.prefer ? `data-prefer="${o.prefer}"` : ''} aria-label="Ouvir ${name}">
      <b>${name}</b>${o.prefer ? `<small>forma de ${o.prefer}</small>` : ''}${diagram(sh)}</button>`;
  }

  /** Toca o acorde como uma palhetada para baixo. */
  function strum(name, when, o = {}) {
    const sh = CH.get(name, o.prefer); if (!sh) return;
    const t = when ?? A.now() + 0.03;
    voicing(sh).forEach((v, i) => A.play(v.midi, t + i * 0.022, { dur: o.dur ?? 1.8, vel: o.vel ?? 0.55, string: v.s }));
  }

  return { OPEN, SUFFIX, parse, get, voicing, diagram, card, strum };
})();
