/* ===== Braço da guitarra em SVG ===== */
const FB = (() => {
  const NUT = 60, PAD_R = 14, TOP = 22, GAP = 28, K = 20;
  const WIDTHS = [2.7, 2.2, 1.8, 1.45, 1.1, 0.9];
  const INLAY = [3, 5, 7, 9, 15, 17, 19, 21];

  function geometry(N) {
    const W = NUT + N * 56 + PAD_R;
    const span = W - NUT - PAD_R;
    const norm = 1 - Math.pow(2, -N / K);
    const xs = [];
    for (let n = 0; n <= N; n++) xs.push(NUT + span * (1 - Math.pow(2, -n / K)) / norm);
    const y = s => TOP + (5 - s) * GAP;
    const H = TOP * 2 + 5 * GAP + 16;
    const nx = f => f === 0 ? NUT - 22 : (xs[f - 1] + xs[f]) / 2;
    return { W, H, xs, y, nx };
  }

  function create(host, opts = {}) {
    const inst = { state: { marks: [], frets: 15, lefty: false, labels: 'note', flats: false, latin: false } };
    host.classList.add('fb-wrap');
    host.addEventListener('click', e => {
      const hit = e.target.closest('[data-s]');
      if (!hit || !inst.state.onPick) return;
      inst.state.onPick(+hit.dataset.s, +hit.dataset.f, e);
    });

    inst.set = (patch) => { Object.assign(inst.state, patch); render(); return inst; };

    inst.setActive = (keys) => {
      const on = new Set(keys);
      host.querySelectorAll('.fb-note').forEach(n => n.classList.toggle('is-on', on.has(n.dataset.k)));
    };

    function label(m, st) {
      if (m.label != null) return m.label;
      if (st.labels === 'iv') return T.ivLabel(m.iv);
      if (st.labels === 'none') return '';
      return T.noteName(m.pc, st.flats, st.latin);
    }

    function render() {
      const st = inst.state, N = st.frets;
      const g = geometry(N);
      const X = x => st.lefty ? g.W - x : x;
      const p = [];
      const yTop = g.y(5) - 13, yBot = g.y(0) + 13;
      p.push(`<rect class="fb-wood" x="${Math.min(X(g.xs[0]), X(g.xs[N]))}" y="${yTop}" width="${g.xs[N] - g.xs[0]}" height="${yBot - yTop}" rx="2"/>`);
      const midY = (g.y(2) + g.y(3)) / 2;
      for (let n = 1; n <= N; n++) {
        const cx = X((g.xs[n - 1] + g.xs[n]) / 2);
        if (INLAY.includes(n)) p.push(`<circle class="fb-inlay" cx="${cx}" cy="${midY}" r="6"/>`);
        if (n === 12 || n === 24) {
          p.push(`<circle class="fb-inlay" cx="${cx}" cy="${(g.y(4) + g.y(3)) / 2}" r="6"/>`);
          p.push(`<circle class="fb-inlay" cx="${cx}" cy="${(g.y(2) + g.y(1)) / 2}" r="6"/>`);
        }
      }
      for (let n = 1; n <= N; n++) p.push(`<rect class="fb-fret" x="${X(g.xs[n]) - 1.6}" y="${yTop}" width="3.2" height="${yBot - yTop}"/>`);
      p.push(`<rect class="fb-nut" x="${X(g.xs[0]) - 3.5}" y="${yTop - 1}" width="7" height="${yBot - yTop + 2}" rx="1.5"/>`);
      for (let s = 0; s < 6; s++) {
        const y = g.y(s);
        p.push(`<line class="fb-string ${s < 3 ? 'wound' : ''}" x1="${X(NUT - 40)}" x2="${X(g.xs[N])}" y1="${y}" y2="${y}" stroke-width="${WIDTHS[s]}"/>`);
        p.push(`<text class="fb-sname" x="${X(12)}" y="${y + 4}">${6 - s}</text>`);
      }
      for (let n = 0; n <= N; n++) {
        const strong = INLAY.includes(n) || n === 12 || n === 24;
        p.push(`<text class="fb-num ${strong ? 'strong' : ''}" x="${X(g.nx(n))}" y="${g.H - 3}">${n}</text>`);
      }
      // áreas de clique
      if (st.onPick) {
        for (let s = 0; s < 6; s++) for (let f = 0; f <= N; f++) {
          const x0 = f === 0 ? NUT - 40 : g.xs[f - 1], x1 = f === 0 ? g.xs[0] - 4 : g.xs[f];
          const xa = Math.min(X(x0), X(x1));
          p.push(`<rect class="fb-hit" data-s="${s}" data-f="${f}" x="${xa}" y="${g.y(s) - GAP / 2}" width="${Math.abs(x1 - x0)}" height="${GAP}"/>`);
        }
      }
      // notas
      const sorted = st.marks.slice().sort((a, b) => (a.dim ? 0 : 1) - (b.dim ? 0 : 1));
      for (const m of sorted) {
        if (m.f > N) continue;
        const cx = X(g.nx(m.f)), cy = g.y(m.s);
        const txt = label(m, st);
        const fs = txt.length > 3 ? 8.5 : txt.length > 2 ? 9.5 : 11;
        const cls = ['fb-note', 'iv-' + (m.role || 'n'), m.dim ? 'dim' : '', m.cls || ''].join(' ');
        const r = m.small ? 8 : 12;
        p.push(`<g class="${cls}" data-k="${m.s}:${m.f}" ${st.onPick ? `data-s="${m.s}" data-f="${m.f}"` : ''}>` +
          `<circle cx="${cx}" cy="${cy}" r="${r}"/>` +
          (txt ? `<text x="${cx}" y="${cy + fs * 0.36}" font-size="${fs}">${txt}</text>` : '') + `</g>`);
      }
      host.innerHTML = `<svg class="fb" viewBox="0 0 ${g.W} ${g.H}" style="min-width:${Math.round(g.W * 0.74)}px;max-width:${Math.round(g.W * 1.35)}px;margin-inline:auto" role="img" aria-label="Braço da guitarra">${p.join('')}</svg>`;
    }

    if (opts.state) inst.set(opts.state); else render();
    return inst;
  }

  return { create, geometry };
})();
