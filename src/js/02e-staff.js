/* ===== Partitura: pauta com clave de sol (guitarra soa uma oitava abaixo do escrito) ===== */
const STAFF = (() => {
  const SP = 10;                         // distância entre linhas
  const LETTER = { C:0, D:1, E:2, F:3, G:4, A:5, B:6 };
  const STEP_E4 = 4 * 7 + 2;             // linha de baixo da pauta = Mi4

  /** Grafia de uma altura escrita: letra, acidente e degrau diatônico. */
  function spell(midiWritten, flats) {
    const nm = (flats ? T.FLAT : T.SHARP)[T.mod(midiWritten)];
    const oct = Math.floor(midiWritten / 12) - 1;
    return { letter: nm[0], acc: nm[1] === '#' ? '♯' : nm[1] === 'b' ? '♭' : '', step: oct * 7 + LETTER[nm[0]] };
  }

  /**
   * notes: [{ midi (som real), d (tempos, opcional), rest? }]
   * o: { flats, width, per (tempos por compasso), unit }
   */
  function render(notes, o = {}) {
    const top = 46, bottom = top + 4 * SP, left = 48;
    const unit = o.unit || 44;
    const timed = notes.some(n => n.d);
    let x = left + 18, beat = 0;
    const per = o.per || 4;
    const items = notes.map(n => {
      const it = Object.assign({}, n, { x });
      const w = timed ? Math.max(26, (n.d || 1) * unit) : 56;
      beat += n.d || 1;
      x += w;
      const rel = (beat - (o.pickup || 0)) / per;
      if (timed && rel > 1e-6 && Math.abs(rel - Math.round(rel)) < 1e-6) { it.barAfter = x + 4; x += 10; }
      return it;
    });
    const W = Math.max(o.width || 0, x + 16), H = bottom + 46;
    const p = [];
    for (let i = 0; i < 5; i++) p.push(`<line class="st-line" x1="6" x2="${W - 6}" y1="${top + i * SP}" y2="${top + i * SP}"/>`);
    p.push(`<text class="st-clef" x="10" y="${bottom - SP * 0.98}">𝄞</text>`);
    p.push(`<text class="st-8" x="21" y="${bottom + 32}">8</text>`);
    items.forEach((n, i) => {
      if (n.barAfter && i < items.length - 1) p.push(`<line class="st-bar" x1="${n.barAfter}" x2="${n.barAfter}" y1="${top}" y2="${bottom}"/>`);
      if (n.rest) { p.push(`<text class="rn-rest st-rest" x="${n.x}" y="${top + SP * 2.9}" text-anchor="middle">${({ 4:'𝄻', 2:'𝄼', 1:'𝄽', 0.5:'𝄾', 0.25:'𝄿' })[n.d || 1] || '𝄽'}</text>`); return; }
      const sp = spell(n.midi + 12, o.flats);
      const y = bottom - (sp.step - STEP_E4) * SP / 2;
      for (let st = STEP_E4 - 2; st >= sp.step; st -= 2) { const ly = bottom - (st - STEP_E4) * SP / 2; p.push(`<line class="st-ledger" x1="${n.x - 11}" x2="${n.x + 11}" y1="${ly}" y2="${ly}"/>`); }
      for (let st = STEP_E4 + 10; st <= sp.step; st += 2) { const ly = bottom - (st - STEP_E4) * SP / 2; p.push(`<line class="st-ledger" x1="${n.x - 11}" x2="${n.x + 11}" y1="${ly}" y2="${ly}"/>`); }
      if (sp.acc) p.push(`<text class="st-acc" x="${n.x - 15}" y="${y + 5}" text-anchor="middle">${sp.acc}</text>`);
      const d = n.d || 1, hollow = d >= 2;
      p.push(`<ellipse class="rn-head ${hollow ? 'hollow' : ''}" data-n="${i}" cx="${n.x}" cy="${y}" rx="6.4" ry="4.6" transform="rotate(-20 ${n.x} ${y})"/>`);
      if (timed && d < 4) {
        const up = sp.step < STEP_E4 + 4;
        const sx = up ? n.x + 5.6 : n.x - 5.6, sy2 = up ? y - 32 : y + 32;
        p.push(`<line class="rn-stem" x1="${sx}" x2="${sx}" y1="${y}" y2="${sy2}"/>`);
        const flags = d === 0.5 || d === 0.75 ? 1 : d === 0.25 ? 2 : 0;
        for (let k = 0; k < flags; k++) { const fy = sy2 + (up ? 1 : -1) * k * 7; p.push(`<path class="rn-flag" d="M${sx} ${fy} q 9 ${up ? 8 : -8} 7 ${up ? 18 : -18}"/>`); }
        if ([1.5, 3, 0.75].includes(d)) p.push(`<circle class="rn-dot" cx="${n.x + 11}" cy="${y - 2}" r="2"/>`);
      }
      if (n.label) p.push(`<text class="st-label" x="${n.x}" y="${H - 6}" text-anchor="middle">${n.label}</text>`);
    });
    if (timed) p.push(`<line class="st-bar end" x1="${W - 8}" x2="${W - 8}" y1="${top}" y2="${bottom}"/>`);
    return `<svg class="staff" viewBox="0 0 ${W} ${H}" style="max-width:${Math.round(W * 1.5)}px;min-width:${Math.round(Math.min(W, 900) * 0.9)}px" role="img" aria-label="Partitura">${p.join('')}</svg>`;
  }

  /** Notas de uma tablatura (só notas simples) para a pauta. */
  function fromTab(parsed) {
    return parsed.events.map(e => {
      const n = e.notes.find(o => !o.dead);
      return n ? { midi: T.TUNING[n.s] + n.f, d: e.d } : { rest: true, d: e.d };
    });
  }

  return { render, spell, fromTab };
})();
