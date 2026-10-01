/* ===== Jam: bases para improvisar ===== */
const JAMS = [
  { id:'blues', title:'Blues em Lá (12 compassos)', key:'A', bpm:88, feel:'shuffle', bass:'boogie',
    chords:['A7','D7','A7','A7','D7','D7','A7','A7','E7','D7','A7','E7'], scales:['blues','pent_menor','mixolidio'] },
  { id:'pop', title:'Louvor / pop: G–D–Em–C', key:'G', bpm:76, feel:'straight', bass:'root',
    chords:['G','D','Em','C'], scales:['pent_maior','maior'] },
  { id:'rock', title:'Rock menor: Am–G–F–G', key:'A', bpm:100, feel:'straight', bass:'eighths',
    chords:['Am','G','F','G'], scales:['pent_menor','menor','blues'] },
  { id:'metal', title:'Metal: Em–C–D–B', key:'E', bpm:132, feel:'straight', bass:'eighths',
    chords:['Em','C','D','B'], scales:['menor_harm','menor','pent_menor'] },
  { id:'dorico', title:'Modal dórico: Am7–D', key:'A', bpm:96, feel:'straight', bass:'root',
    chords:['Am7','Am7','D','D'], scales:['dorico','pent_menor'] },
];
const JAM = { id:'blues', scale:null, bpm:null, drums:true, bass:true, comp:true, labels:'iv' };

function parseChord(name) {
  const m = name.match(/^([A-G][b#]?)(.*)$/);
  const q = { '':'maior', 'm':'menor', '7':'dom7', 'm7':'m7', '7M':'maj7' }[m[2]] || 'maior';
  return { root: T.pcOf(m[1]), q, name };
}

V.jam = (el, id) => {
  if (id && JAMS.some(j => j.id === id)) { if (JAM.id !== id) { JAM.scale = null; JAM.bpm = null; } JAM.id = id; }
  const jam = JAMS.find(j => j.id === JAM.id);
  if (!JAM.scale || !jam.scales.includes(JAM.scale)) JAM.scale = jam.scales[0];
  if (!JAM.bpm) JAM.bpm = jam.bpm;
  const chords = jam.chords.map(parseChord);
  const keyPc = T.pcOf(jam.key);

  el.innerHTML = treinoTabs('jam') + `
    <section class="panel">
      <div class="ctrl-row">${U.chips('jam', JAMS.map(j => ({ v:j.id, label:j.title })), jam.id)}</div>
      <div class="ctrl-row">
        <label class="field">Escala <select data-k="scale" id="jam-scale">${jam.scales.map(s => `<option value="${s}" ${s === JAM.scale ? 'selected' : ''}>${T.SCALES[s].name} de ${T.rootName(keyPc, U.set().latin)}</option>`).join('')}</select></label>
        <label class="field">Andamento <input type="range" min="50" max="180" value="${JAM.bpm}" data-k="bpm" id="jam-bpm"> <b data-bpm>${JAM.bpm}</b> BPM</label>
        <label class="check"><input type="checkbox" data-k="drums" id="jam-drums" ${JAM.drums ? 'checked' : ''}> Bateria</label>
        <label class="check"><input type="checkbox" data-k="bass" id="jam-bass" ${JAM.bass ? 'checked' : ''}> Baixo</label>
        <label class="check"><input type="checkbox" data-k="comp" id="jam-comp" ${JAM.comp ? 'checked' : ''}> Acordes</label>
      </div>
      <div class="jam-now">
        <button type="button" class="btn primary big" data-act="go">▶ Tocar base</button>
        <div class="now"><span>Agora</span><b data-now>${chords[0].name}</b></div>
        <div class="now dim"><span>Próximo</span><b data-next>${chords[1 % chords.length].name}</b></div>
        <ol class="bars" data-bars>${chords.map((c, i) => `<li data-i="${i}">${c.name}</li>`).join('')}</ol>
      </div>
      <div data-fb></div>
      <p class="caption">Notas grandes: notas do acorde atual (rótulos em relação ao acorde). Pontos pequenos: o resto da escala. Mire nas notas grandes quando o acorde mudar.</p>
    </section>`;
  const fb = FB.create(el.querySelector('[data-fb]'));
  const sc = T.SCALES[JAM.scale];
  const flats = T.useFlats(keyPc, sc.parent);

  function showChord(ci) {
    const c = chords[ci], civ = T.CHORDS[c.q].iv.map(i => T.mod(c.root + i));
    const scalePcs = sc.iv.map(i => T.mod(keyPc + i));
    const N = U.set().frets, marks = [];
    for (let s = 0; s < 6; s++) for (let f = 0; f <= N; f++) {
      const pc = T.mod(T.pitch(s, f));
      if (civ.includes(pc)) marks.push(T.mark(s, f, c.root));
      else if (scalePcs.includes(pc)) marks.push(Object.assign(T.mark(s, f, keyPc), { small: true, role: 'n', label: '' }));
    }
    fb.set(U.fbState({ marks, labels: JAM.labels, flats,
      onPick: (s, f) => { A.play(T.pitch(s, f), null, { dur: 1.2, string: s }); fb.setActive([s + ':' + f]); } }));
    el.querySelector('[data-now]').textContent = c.name;
    el.querySelector('[data-next]').textContent = chords[(ci + 1) % chords.length].name;
    el.querySelectorAll('[data-bars] li').forEach((li, i) => li.classList.toggle('on', i === ci));
  }
  showChord(0);

  const bassMidi = pc => 28 + T.mod(pc - 4);
  const BOOGIE = [0, 4, 7, 9, 10, 9, 7, 4];
  const clock = A.Clock(() => JAM.bpm, 2, (i, t) => {
    const spb = 60 / JAM.bpm;
    const bar = Math.floor(i / 8) % chords.length, pos = i % 8, beat = pos >> 1, off = pos & 1;
    const c = chords[bar];
    const tt = off && jam.feel === 'shuffle' ? t + spb / 6 : t;
    if (pos === 0) setTimeout(() => showChord(bar), Math.max(0, (t - A.ctx.currentTime) * 1000));
    if (JAM.drums) {
      if (!off && (beat === 0 || beat === 2)) A.drum('kick', tt);
      if (jam.id === 'metal' && off) A.drum('kick', tt, 0.7);
      if (!off && (beat === 1 || beat === 3)) A.drum('snare', tt);
      A.drum('hat', tt, off ? 0.6 : 1);
    }
    if (JAM.bass) {
      const r = bassMidi(c.root);
      if (jam.bass === 'boogie') A.bass(r + (c.q === 'menor' && BOOGIE[pos] === 4 ? 3 : BOOGIE[pos]), tt, spb * 0.45);
      else if (jam.bass === 'eighths') A.bass(r, tt, spb * 0.42);
      else if (!off && beat !== 3) A.bass(r, tt, spb * 0.9);
      else if (!off) A.bass(r + 7, tt, spb * 0.9);
    }
    if (JAM.comp) {
      const ivs = T.CHORDS[c.q].iv;
      const voice = ivs.map(iv => 52 + T.mod(c.root + iv - 4)).sort((a, b) => a - b);
      const strum = (vel, dur) => voice.forEach((m, k) => A.play(m, tt + k * 0.018, { dur, vel, bus: 'back' }));
      if (jam.feel === 'shuffle') { if (off === 0 && (beat === 1 || beat === 3)) strum(0.35, spb * 0.5); }
      else if (jam.id === 'metal') { if (pos === 0) strum(0.4, spb * 3.6); }
      else if (pos === 0 || pos === 3 || pos === 6) strum(pos === 0 ? 0.42 : 0.3, spb * (pos === 0 ? 1.4 : 1));
    }
  });

  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="jam"] .chip');
    if (chip) { clock.stop(); A.stopAll(); location.hash = '#jam-' + chip.dataset.v; return; }
    const btn = e.target.closest('[data-act="go"]');
    if (btn) {
      if (clock.running) { clock.stop(); A.stopAll(); btn.textContent = '▶ Tocar base'; showChord(0); }
      else { clock.start(); btn.textContent = '■ Parar'; S.practiced(); }
    }
  });
  el.addEventListener('input', e => {
    if (e.target.dataset.k === 'bpm') { JAM.bpm = +e.target.value; el.querySelector('[data-bpm]').textContent = JAM.bpm; }
  });
  el.addEventListener('change', e => {
    const k = e.target.dataset.k;
    if (k === 'scale') { JAM.scale = e.target.value; const running = clock.running; APP.rerender(); if (running) U.toast('Escala trocada. Toque a base de novo.'); }
    if (['drums', 'bass', 'comp'].includes(k)) JAM[k] = e.target.checked;
  });
  return () => { clock.stop(); A.stopAll(); };
};
