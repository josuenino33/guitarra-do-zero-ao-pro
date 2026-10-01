/* ===== Componentes avançados: dicionário de acordes, campo harmônico, partitura ===== */
Object.assign(T.CHORDS, { mmaj7: { name:'Menor com 7M', sym:'m(7M)', iv:[0,3,7,11] }, aummaj7: { name:'Aumentado com 7M', sym:'+(7M)', iv:[0,4,8,11] } });
Object.assign(CH.SUFFIX, { 'm(7M)':'mmaj7', '+(7M)':'aummaj7' });
Object.assign(QUAL_SUFFIX, { mmaj7:'m(7M)', aummaj7:'+(7M)' });
VOICINGS.mmaj7 = [{ k:'Corda 5', rs:1, o:[-9,0,2,1,1,0] }];
VOICINGS.aummaj7 = [{ k:'Corda 5', rs:1, o:[-9,0,-1,-2,-3,-9] }];

const prettyChord = n => String(n).replace(/^([A-G])(##|bb|#|b)?/, (m, l, a) => l + (a ? a.replace(/#/g, '♯').replace(/b/g, '♭') : ''))
  .replace(/\/([A-G])(##|bb|#|b)/, (m, l, a) => '/' + l + a.replace(/#/g, '♯').replace(/b/g, '♭'))
  .replace('(b5)', '(♭5)').replace('(b9)', '(♭9)').replace('(#9)', '(♯9)');
const EXT_LABEL = { 1:'♭9', 2:'9', 3:'♯9', 9:'13' };
function formula(q) {
  const ext = ['nine', 'm9', 'maj9', 'b9', 's9', 'thirteen'].includes(q);
  return T.CHORDS[q].iv.map((iv, i) => ext && i >= 4 && EXT_LABEL[iv] ? EXT_LABEL[iv] : T.ivLabel(iv));
}
const DICT_GROUPS = [
  ['Tríades', ['maior', 'menor', 'dim', 'aum', 'sus2', 'sus4', 'power']],
  ['Tétrades', ['maj7', 'm7', 'dom7', 'm7b5', 'dim7', 'six', 'm6', 'mmaj7']],
  ['Extensões', ['nine', 'm9', 'maj9', 'thirteen', 'b9', 's9']],
];

W.dict = (host, cfg = {}) => {
  let root = T.pcOf(cfg.root || 'C'), q = cfg.q || 'maior';
  host.innerHTML = `<div class="ctrl-row"><label class="field">Tônica <select data-root id="dict-root">${U.rootOptions(root)}</select></label></div>
    ${DICT_GROUPS.map(([g, qs]) => `<div class="ctrl-row"><span class="small grp">${g}</span>${U.chips('q', qs.map(k => ({ v: k, label: k === 'maior' ? 'maior' : prettyChord('C' + QUAL_SUFFIX[k]).slice(1) })), q)}</div>`).join('')}
    <div class="dict-head" data-head></div>
    <div class="chord-row" data-voicings></div>`;
  const $ = s => host.querySelector(s);
  function paint() {
    const sp = T.spellChord(root, q);
    const name = T.spellAscii(sp.root) + (QUAL_SUFFIX[q] ?? '');
    const roleOf = (lab) => lab === 'R' ? 'r' : lab.includes('♭5') ? 'b5' : ({ 2:'2', 9:'2', 3:'3', 4:'4', 11:'4', 5:'5', 6:'6', 13:'6', 7:'7' })[lab.replace(/[♭♯]/g, '')] || 'n';
    $('[data-head]').innerHTML = `<h3>${prettyChord(name)}</h3><p class="small">${T.CHORDS[q].name} · fórmula ${sp.labels.join(' – ')}</p>
      <div class="degrees">${sp.list.map((n, i) => `<div class="deg iv-${roleOf(sp.labels[i])}"><b>${T.spellName(n, U.set().latin)}</b><span>${sp.labels[i]}</span></div>`).join('')}</div>`;
    const vs = CH.voicings(root, q).map(v => Object.assign({}, v, { name }));
    $('[data-voicings]').innerHTML = vs.length ? vs.map((v, i) => `<button type="button" class="chord-card" data-v="${i}"><b>${prettyChord(name)}</b><small>${v.k}</small>${CH.diagram(v)}</button>`).join('')
      : '<p class="small">Sem forma cadastrada para este acorde.</p>';
    paint.vs = vs;
    host.querySelectorAll('[data-chips="q"] .chip').forEach(c => c.classList.toggle('on', c.dataset.v === q));
  }
  host.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="q"] .chip'); if (chip) { q = chip.dataset.v; paint(); return; }
    const c = e.target.closest('[data-v]');
    if (c && paint.vs) { const v = paint.vs[+c.dataset.v]; A.init(); const t = A.now() + 0.03; CH.voicing(v).forEach((n, i) => A.play(n.midi, t + i * 0.025, { dur: 1.8, vel: 0.55, string: n.s })); }
  });
  host.addEventListener('change', e => { if (e.target.matches('[data-root]')) { root = +e.target.value; paint(); } });
  paint();
  return () => A.stopAll();
};

const PROG_MAJOR = [[1, 5, 6, 4], [6, 4, 1, 5], [1, 6, 4, 5], [1, 4, 5, 4], [2, 5, 1, 1], [4, 5, 3, 6], [1, 4, 6, 5]];
const PROG_MINOR = [[1, 4, 5, 1], [1, 6, 3, 7], [1, 7, 6, 7], [1, 4, 7, 3], [2, 5, 1, 1]];
const PROG_NAMED = { 'ii-V-I': [2, 5, 1, 1], 'I-V-vi-IV': [1, 5, 6, 4] };

W.campo = (host, cfg = {}) => {
  let root = T.pcOf(cfg.root || 'C'), scale = cfg.scale || 'maior', tet = !!cfg.tetrads, view = 0, pi = 0, pattern = 'pop', bpm = 84;
  const views = cfg.views;
  const progs = () => scale === 'maior' ? PROG_MAJOR : PROG_MINOR;
  if (cfg.prog && PROG_NAMED[cfg.prog]) pi = Math.max(0, progs().findIndex(p => p.join() === PROG_NAMED[cfg.prog].join()));
  host.innerHTML = `
    ${views ? `<div class="ctrl-row" data-views></div>` : ''}
    <div class="ctrl-row"><label class="field">Tom <select data-root id="campo-root">${U.rootOptions(root)}</select></label>
      ${U.chips('tet', [{ v: 0, label: 'Tríades' }, { v: 1, label: 'Tétrades' }], tet ? 1 : 0)}</div>
    <div class="campo" data-grid></div>
    <p class="small">T = tônica (repouso) · SD = subdominante (afastamento) · D = dominante (tensão). Toque num acorde para ouvir.</p>
    <div class="prog-box">
      <p class="eyebrow">Progressões</p>
      <div class="ctrl-row" data-progs></div>
      <ol class="bars" data-bars></ol>
      <div class="ctrl-row">
        <button type="button" class="btn primary" data-act="play">▶ Tocar progressão</button>
        ${U.chips('pat', [{ v: 'pop', label: 'Pop' }, { v: 'balada', label: 'Balada' }, { v: 'rock', label: 'Rock' }, { v: 'semi', label: '1 por tempo' }], pattern)}
        <label class="field">Andamento <input type="range" min="50" max="150" value="${bpm}" data-bpm id="campo-bpm"> <b data-bpmv>${bpm}</b></label>
      </div>
    </div>`;
  const $ = s => host.querySelector(s);
  let degs = [];
  const player = RH.Strummer({ onSlot(bar) { host.querySelectorAll('[data-bars] li').forEach((li, i) => li.classList.toggle('on', i === bar)); } });
  const chordsOf = p => p.map(d => tet ? degs[d - 1].tetrad : degs[d - 1].triad);
  function paint() {
    degs = harmonize(root, scale);
    if (views) $('[data-views]').innerHTML = U.chips('cview', views.map((v, i) => ({ v: i, label: v.label })), view);
    $('[data-grid]').innerHTML = degs.map((d, i) => `<button type="button" class="campo-deg fn-${d.fn}" data-deg="${i}">
      <span class="roman">${d.roman}</span><b>${prettyChord(tet ? d.tetrad : d.triad)}</b><span class="fn">${d.fn}</span>${CH.diagram(CH.get(tet ? d.tetrad : d.triad))}</button>`).join('');
    $('[data-progs]').innerHTML = U.chips('prog', progs().map((p, i) => ({ v: i, label: p.map(x => degs[x - 1].roman).join('–') })), pi);
    $('[data-bars]').innerHTML = chordsOf(progs()[pi]).map(c => `<li>${prettyChord(c)}</li>`).join('');
  }
  function restart() { if (player.running) player.start({ pattern, chords: chordsOf(progs()[pi]), bpm }); }
  host.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips] .chip');
    if (chip) {
      const g = chip.parentElement.dataset.chips;
      if (g === 'tet') tet = chip.dataset.v === '1';
      if (g === 'prog') pi = +chip.dataset.v;
      if (g === 'pat') pattern = chip.dataset.v;
      if (g === 'cview') { view = +chip.dataset.v; scale = views[view].scale; pi = Math.min(pi, progs().length - 1); }
      paint(); restart(); return;
    }
    const d = e.target.closest('[data-deg]'); if (d) { CH.strum(tet ? degs[+d.dataset.deg].tetrad : degs[+d.dataset.deg].triad); return; }
    const b = e.target.closest('[data-act="play"]');
    if (b) { if (player.running) { player.stop(); b.textContent = '▶ Tocar progressão'; } else { player.start({ pattern, chords: chordsOf(progs()[pi]), bpm }); b.textContent = '■ Parar'; S.practiced(); } }
  });
  host.addEventListener('change', e => { if (e.target.matches('[data-root]')) { root = +e.target.value; paint(); restart(); } });
  host.addEventListener('input', e => { if (e.target.matches('[data-bpm]')) { bpm = +e.target.value; $('[data-bpmv]').textContent = bpm; player.setBpm(bpm); } });
  paint();
  return () => player.stop();
};

W.staff = (host, cfg = {}) => {
  const latin = () => U.set().latin;
  if (cfg.mode === 'melody') {
    const ids = [cfg.lick].concat(cfg.more || []);
    let cur = 0, pl = null;
    host.innerHTML = `${ids.length > 1 ? `<div class="ctrl-row" data-pieces></div>` : ''}<div data-melody></div>`;
    const paint = () => {
      pl && pl.stop();
      const lk = lickById(ids[cur]), parsed = TAB.parse(lk.src);
      const flats = T.useFlats(T.pcOf(lk.key), T.SCALES[lk.scale]?.parent || 0);
      if (ids.length > 1) host.querySelector('[data-pieces]').innerHTML = U.chips('piece', ids.map((id, i) => ({ v: i, label: lickById(id).title })), cur);
      const box = host.querySelector('[data-melody]');
        const spell = T.SCALES[lk.scale] ? T.spellScale(T.pcOf(lk.key), lk.scale, T.parseName(lk.key)).map : null;
      box.innerHTML = `${lk.credit ? `<p class="small">${U.esc(lk.credit)}</p>` : ''}<div class="staff-wrap" data-st>${STAFF.render(STAFF.fromTab(parsed), { flats, spell, per: lk.meter || 4, pickup: lk.pickup || 0 })}</div>
        <div class="tab-scroll" data-tab></div>
        <div class="ctrl-row"><button type="button" class="btn primary" data-act="play">▶ Tocar</button>
          <label class="check"><input type="checkbox" data-hide id="staff-hide-${cur}"> Esconder a tablatura</label></div>`;
      const hl = TAB.render(box.querySelector('[data-tab]'), parsed, { meter: lk.meter || 4, pickup: lk.pickup || 0 });
      const btn = box.querySelector('[data-act="play"]');
      pl = TAB.Player({ onEvent(i) { hl(i); box.querySelectorAll('.rn-head.on').forEach(h => h.classList.remove('on')); box.querySelector(`.rn-head[data-n="${i}"]`)?.classList.add('on'); },
        onEnd() { btn.textContent = '▶ Tocar'; } });
      btn.addEventListener('click', () => { if (pl.playing) { pl.stop(); btn.textContent = '▶ Tocar'; } else { pl.play(parsed, { bpm: lk.bpm, click: true, meter: lk.meter || 4, pickup: lk.pickup || 0 }); btn.textContent = '■ Parar'; S.practiced(); } });
      box.querySelector('[data-hide]').addEventListener('change', e => { box.querySelector('[data-tab]').hidden = e.target.checked; });
    };
    host.addEventListener('click', e => { const c = e.target.closest('[data-chips="piece"] .chip'); if (c) { cur = +c.dataset.v; paint(); } });
    paint();
    return () => pl && pl.stop();
  }
  const NAT = [0, 2, 4, 5, 7, 9, 11];
  const sets = { cordas123: [55, 67], primeira: [40, 67], acidentes: [40, 67] };
  const [lo, hi] = sets[cfg.set] || sets.primeira;
  const pool = []; for (let m = lo; m <= hi; m++) if (cfg.set === 'acidentes' || NAT.includes(T.mod(m))) pool.push(m);
  let cur = null, flats = false, streak = 0, best = 0, locked = false;
  host.innerHTML = `<div class="ctrl-row"><span class="pill" data-streak>Sequência: 0</span><span class="small" data-best></span></div>
    <div class="staff-wrap single" data-st></div>
    <div class="answers" data-ans></div>
    <p class="feedback" data-fbk aria-live="polite"></p>
    <div data-fb></div>`;
  const $ = s => host.querySelector(s);
  const fb = FB.create($('[data-fb]'));
  const opts = cfg.set === 'acidentes'
    ? T.ROOTS.map((r, i) => ({ v: i, label: T.noteName(i, false, latin()) + ([1, 3, 6, 8, 10].includes(i) ? ' / ' + T.noteName(i, true, latin()) : '') }))
    : NAT.map(i => ({ v: i, label: T.noteName(i, false, latin()) }));
  $('[data-ans]').innerHTML = opts.map(o => `<button type="button" class="btn ans" data-a="${o.v}">${o.label}</button>`).join('');
  function next() {
    locked = false;
    let m; do { m = pool[Math.floor(Math.random() * pool.length)]; } while (cur && m === cur.m && pool.length > 1);
    flats = cfg.set === 'acidentes' ? Math.random() < 0.5 : false;
    cur = { m };
    $('[data-st]').innerHTML = STAFF.render([{ midi: m }], { flats, width: 150 });
    $('[data-fbk]').textContent = ''; $('[data-fbk]').className = 'feedback';
    host.querySelectorAll('.ans').forEach(b => b.classList.remove('ok', 'bad'));
    fb.set(U.fbState({ frets: 5, marks: [] }));
  }
  host.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'); if (!a || locked) return;
    locked = true;
    const ok = +a.dataset.a === T.mod(cur.m);
    a.classList.add(ok ? 'ok' : 'bad');
    streak = ok ? streak + 1 : 0; best = Math.max(best, streak);
    $('[data-streak]').textContent = `Sequência: ${streak}`; $('[data-best]').textContent = best ? `Melhor: ${best}` : '';
    const nm = T.noteName(cur.m, flats, latin()), pos = [];
    for (let s = 0; s < 6; s++) { const f = cur.m - T.TUNING[s]; if (f >= 0 && f <= 5) pos.push(T.mark(s, f, T.mod(cur.m))); }
    $('[data-fbk]').textContent = ok ? `Certo: ${nm}.` : `Era ${nm}.`;
    $('[data-fbk]').className = 'feedback ' + (ok ? 'ok' : 'bad');
    fb.set({ marks: pos.map(p => Object.assign(p, { role: 'r' })), labels: 'note' });
    A.play(cur.m, null, { dur: 1 });
    if (ok) S.practiced();
    setTimeout(next, ok ? 900 : 1800);
  });
  next();
};

