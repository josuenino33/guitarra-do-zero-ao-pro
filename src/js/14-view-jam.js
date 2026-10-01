/* ===== Jam: bases em qualquer tom e vários estilos ===== */
// meter = tempos por compasso, sub = divisões por tempo; comp = levada dos acordes (uma por compasso, ou duas alternadas)
const JAMS = [
  { id:'blues', title:'Blues shuffle', key:'A', bpm:88, meter:4, sub:2, feel:'shuffle', bass:'boogie', comp:['--D---D-'],
    chords:['A7','D7','A7','A7','D7','D7','A7','A7','E7','D7','A7','E7'], scales:['blues','pent_menor','mixolidio'], minor:false },
  { id:'pop', title:'Pop / louvor', key:'G', bpm:76, meter:4, sub:2, feel:'straight', bass:'root', comp:['D-DU-UDU'],
    chords:['G','D','Em','C'], scales:['pent_maior','maior'] },
  { id:'rock', title:'Rock menor', key:'A', bpm:100, meter:4, sub:2, feel:'straight', bass:'eighths', comp:['D-D-D-D-'],
    chords:['Am','G','F','G'], scales:['pent_menor','menor','blues'], minor:true },
  { id:'metal', title:'Metal', key:'E', bpm:132, meter:4, sub:2, feel:'metal', bass:'eighths', comp:['D-------'],
    chords:['Em','C','D','B'], scales:['menor_harm','menor','pent_menor'], minor:true },
  { id:'dorico', title:'Modal dórico', key:'A', bpm:96, meter:4, sub:2, feel:'straight', bass:'root', comp:['D--UD-DU'],
    chords:['Am7','Am7','D','D'], scales:['dorico','pent_menor'], minor:true },
  { id:'iivi', title:'ii–V–I (jazz)', key:'G', bpm:120, meter:4, sub:2, feel:'jazz', bass:'walk', comp:['D--D----'],
    chords:['Am7','D7','G7M','G7M'], scales:['maior','pent_maior'] },
  { id:'funk', title:'Funk', key:'E', bpm:98, meter:4, sub:4, feel:'funk', bass:'funk', comp:['D-xUX-xUD-xUX-xU'],
    chords:['E9','E9','A9','E9'], scales:['dorico','pent_menor','mixolidio'], minor:true },
  { id:'reggae', title:'Reggae', key:'A', bpm:76, meter:4, sub:2, feel:'reggae', bass:'reggae', comp:['-X-X-X-X'],
    chords:['Am','D','Am','D'], scales:['dorico','pent_menor'], minor:true },
  { id:'bossa', title:'Bossa nova', key:'C', bpm:126, meter:4, sub:2, feel:'bossa', bass:'bossa', comp:['D--D--D-', '--D-D---'],
    chords:['C7M','Dm7','G7','C7M'], scales:['maior','pent_maior'] },
  { id:'seisoito', title:'Balada 6/8', key:'C', bpm:56, meter:2, sub:3, feel:'sixeight', bass:'sixeight', comp:['D-UD-U'],
    chords:['C','G','Am','F'], scales:['pent_maior','maior'] },
  { id:'valsa', title:'Valsa 3/4', key:'G', bpm:100, meter:3, sub:2, feel:'waltz', bass:'waltz', comp:['--D-D-'],
    chords:['G','D','D','G'], scales:['maior','pent_maior'] },
];
const JAM = { id:'blues', scale:null, bpm:null, key:null, drums:true, bass:true, comp:true, labels:'iv' };

function parseChord(name) {
  const p = CH.parse(name);
  return { root: p.root, q: p.q || 'maior', name };
}
function transposeChord(name, shift, flats) {
  const m = name.match(/^([A-G][b#]?)(.*)$/);
  const pc = T.mod(T.pcOf(m[1]) + shift);
  return (flats ? T.FLAT : T.SHARP)[pc] + m[2];
}

V.jam = (el, id) => {
  if (id && JAMS.some(j => j.id === id)) { if (JAM.id !== id) { JAM.scale = null; JAM.bpm = null; JAM.key = null; } JAM.id = id; }
  const jam = JAMS.find(j => j.id === JAM.id);
  if (!JAM.scale || !jam.scales.includes(JAM.scale)) JAM.scale = jam.scales[0];
  if (!JAM.bpm) JAM.bpm = jam.bpm;
  const baseKey = T.pcOf(jam.key);
  const keyPc = JAM.key == null ? baseKey : JAM.key;
  const flats = T.useFlats(keyPc, jam.minor ? 3 : 0);
  const chords = jam.chords.map(c => parseChord(transposeChord(c, keyPc - baseKey, flats)));
  const latin = U.set().latin;

  el.innerHTML = treinoTabs('jam') + `
    <section class="panel">
      <div class="ctrl-row">${U.chips('jam', JAMS.map(j => ({ v: j.id, label: j.title })), jam.id)}</div>
      <div class="ctrl-row">
        <label class="field">Tom <select data-k="key" id="jam-key">${T.ROOTS.map((r, i) => `<option value="${i}" ${i === keyPc ? 'selected' : ''}>${T.rootName(i, latin)}${jam.minor ? 'm' : ''}</option>`).join('')}</select></label>
        <label class="field">Escala <select data-k="scale" id="jam-scale">${jam.scales.map(s => `<option value="${s}" ${s === JAM.scale ? 'selected' : ''}>${T.SCALES[s].name} de ${T.rootName(keyPc, latin)}</option>`).join('')}</select></label>
        <label class="field">Andamento <input type="range" min="40" max="200" value="${JAM.bpm}" data-k="bpm" id="jam-bpm"> <b data-bpm>${JAM.bpm}</b> BPM</label>
      </div>
      <div class="ctrl-row">
        <label class="check"><input type="checkbox" data-k="drums" id="jam-drums" ${JAM.drums ? 'checked' : ''}> Bateria</label>
        <label class="check"><input type="checkbox" data-k="bass" id="jam-bass" ${JAM.bass ? 'checked' : ''}> Baixo</label>
        <label class="check"><input type="checkbox" data-k="comp" id="jam-comp" ${JAM.comp ? 'checked' : ''}> Acordes</label>
        <span class="small">${jam.meter === 2 ? 'Compasso 6/8' : jam.meter + '/4'} · ${({ shuffle:'shuffle', jazz:'swing', funk:'semicolcheias', reggae:'one drop', bossa:'bossa', sixeight:'6/8', waltz:'valsa', metal:'metal', straight:'reto' })[jam.feel]}</span>
      </div>
      <div class="jam-now">
        <button type="button" class="btn primary big" data-act="go">▶ Tocar base</button>
        <div class="now"><span>Agora</span><b data-now>${prettyChord(chords[0].name)}</b></div>
        <div class="now dim"><span>Próximo</span><b data-next>${prettyChord(chords[1 % chords.length].name)}</b></div>
        <ol class="bars" data-bars>${chords.map((c, i) => `<li data-i="${i}">${prettyChord(c.name)}</li>`).join('')}</ol>
      </div>
      <div data-fb></div>
      <p class="caption">Notas grandes: notas do acorde atual (rótulos em relação ao acorde). Pontos pequenos: o resto da escala. Mire nas notas grandes quando o acorde mudar.</p>
    </section>`;
  const fb = FB.create(el.querySelector('[data-fb]'));
  const sc = T.SCALES[JAM.scale];
  const sflats = T.useFlats(keyPc, sc.parent);

  function showChord(ci) {
    const c = chords[ci], civ = T.CHORDS[c.q].iv.map(i => T.mod(c.root + i));
    const scalePcs = sc.iv.map(i => T.mod(keyPc + i));
    const N = U.set().frets, marks = [];
    for (let s = 0; s < 6; s++) for (let f = 0; f <= N; f++) {
      const pc = T.mod(T.pitch(s, f));
      if (civ.includes(pc)) marks.push(T.mark(s, f, c.root));
      else if (scalePcs.includes(pc)) marks.push(Object.assign(T.mark(s, f, keyPc), { small: true, role: 'n', label: '' }));
    }
    fb.set(U.fbState({ marks, labels: JAM.labels, flats: sflats,
      onPick: (s, f) => { A.play(T.pitch(s, f), null, { dur: 1.2, string: s }); fb.setActive([s + ':' + f]); } }));
    el.querySelector('[data-now]').textContent = prettyChord(c.name);
    el.querySelector('[data-next]').textContent = prettyChord(chords[(ci + 1) % chords.length].name);
    el.querySelectorAll('[data-bars] li').forEach((li, i) => li.classList.toggle('on', i === ci));
  }
  showChord(0);

  const bassMidi = pc => 28 + T.mod(pc - 4);
  const BOOGIE = [0, 4, 7, 9, 10, 9, 7, 4];
  const FUNK = { 0: 0, 3: 12, 6: 10, 8: 0, 10: 7, 14: 12 };
  const slots = jam.meter * jam.sub;
  const clock = A.Clock(() => JAM.bpm, jam.sub, (i, t) => {
    const spb = 60 / JAM.bpm, sd = spb / jam.sub;
    const barN = Math.floor(i / slots), bar = barN % chords.length, pos = i % slots, beat = Math.floor(pos / jam.sub), off = pos % jam.sub;
    const c = chords[bar], next = chords[(bar + 1) % chords.length];
    const swing = (jam.feel === 'shuffle' || jam.feel === 'jazz') && jam.sub === 2 && off === 1;
    const tt = swing ? t + spb / 6 : t;
    if (pos === 0) setTimeout(() => showChord(bar), Math.max(0, (t - A.ctx.currentTime) * 1000));
    if (JAM.drums) drums(jam.feel, pos, beat, off, tt, barN);
    if (JAM.bass) bassLine(jam.bass, c, next, pos, beat, off, tt, spb, sd);
    if (JAM.comp) {
      const pat = jam.comp[barN % jam.comp.length], sym = pat[pos];
      if (sym && sym !== '-') RH.hit(sym, c.name, tt, sd, pos === 0, 'back');
    }
  });

  function drums(feel, pos, beat, off, t, barN) {
    const D = A.drum;
    switch (feel) {
      case 'funk':
        if ([0, 6, 8].includes(pos)) D('kick', t);
        if (pos === 4 || pos === 12) D('snare', t); else if (pos === 7 || pos === 14) D('snare', t, 0.25);
        D('hat', t, off === 0 ? 0.9 : 0.45); break;
      case 'reggae':
        if (pos === 4) { D('kick', t); D('snare', t, 0.8); }
        D('hat', t, off ? 0.8 : 0.5); break;
      case 'bossa':
        if (pos === 0 || pos === 4) D('kick', t, 0.6); if (pos === 3 || pos === 7) D('kick', t, 0.35);
        if ((barN % 2 ? [2, 4] : [0, 3, 6]).includes(pos)) D('snare', t, 0.22);
        D('hat', t, 0.35); break;
      case 'jazz':
        if (off === 0) D('hat', t, 0.6); else if (beat === 1 || beat === 3) D('hat', t, 0.4);
        if (off === 0 && (beat === 1 || beat === 3)) D('hat', t, 0.9);
        if (pos === 0) D('kick', t, 0.35); break;
      case 'sixeight':
        if (pos === 0) D('kick', t); if (pos === 3) D('snare', t);
        D('hat', t, off === 0 ? 0.8 : 0.5); break;
      case 'waltz':
        if (pos === 0) D('kick', t); if (off === 0 && beat > 0) D('snare', t, 0.35);
        D('hat', t, off === 0 ? 0.6 : 0.3); break;
      case 'metal':
        D('kick', t, off ? 0.7 : 1); if (off === 0 && (beat === 1 || beat === 3)) D('snare', t);
        if (off === 0) D('hat', t); break;
      default:
        if (off === 0 && (beat === 0 || beat === 2)) D('kick', t);
        if (off === 0 && (beat === 1 || beat === 3)) D('snare', t);
        D('hat', t, off ? 0.6 : 1);
    }
  }

  function bassLine(kind, c, next, pos, beat, off, t, spb, sd) {
    const r = bassMidi(c.root), minor = T.CHORDS[c.q].iv.includes(3);
    const third = r + (minor ? 3 : 4), fifth = r + 7;
    switch (kind) {
      case 'boogie': A.bass(r + (minor && BOOGIE[pos] === 4 ? 3 : BOOGIE[pos]), t, spb * 0.45); break;
      case 'eighths': A.bass(r, t, sd * 0.85); break;
      case 'walk': {
        if (off) return;
        const nr = bassMidi(next.root);
        const notes = [r, third, fifth, nr + (nr > fifth ? -1 : 1)];
        A.bass(notes[beat], t, spb * 0.9); break;
      }
      case 'funk': if (FUNK[pos] != null) A.bass(r + FUNK[pos], t, sd * 1.6); break;
      case 'reggae': if (pos === 0) A.bass(r, t, spb * 1.4); else if (pos === 3) A.bass(fifth, t, sd * 0.9); else if (pos === 4) A.bass(r + 12, t, spb * 0.8); break;
      case 'bossa': if (pos === 0) A.bass(r, t, spb * 1.4); else if (pos === 3) A.bass(fifth - 12, t, sd); else if (pos === 4) A.bass(fifth - 12, t, spb * 1.4); break;
      case 'sixeight': if (pos === 0) A.bass(r, t, spb * 0.9); else if (pos === 3) A.bass(fifth, t, spb * 0.9); break;
      case 'waltz': if (pos === 0) A.bass(r, t, spb * 0.95); break;
      default: if (off === 0) A.bass(beat === jam.meter - 1 ? fifth : r, t, spb * 0.9);
    }
  }

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
    if (k === 'scale' || k === 'key') {
      if (k === 'scale') JAM.scale = e.target.value; else JAM.key = +e.target.value;
      const running = clock.running; APP.rerender(); if (running) U.toast('Base alterada. Toque de novo.');
    }
    if (['drums', 'bass', 'comp'].includes(k)) JAM[k] = e.target.checked;
  });
  return () => { clock.stop(); A.stopAll(); };
};
