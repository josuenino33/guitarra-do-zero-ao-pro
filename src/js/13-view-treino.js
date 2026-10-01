/* ===== Treino: metrônomo e velocidade progressiva ===== */
const MET = { bpm: 80, beats: 4, sub: 1 };
const SPEED = { id: 'ex-pent', start: 60, target: 100, step: 5, reps: 2, listen: true };

function treinoTabs(active) {
  return `<header class="page-head"><p class="eyebrow">Treino</p><h1>Tempo, velocidade e improviso</h1></header>
    <nav class="subtabs">${[['treino', 'Metrônomo'], ['treino-' + SPEED.id, 'Velocidade progressiva'], ['jam', 'Jam (bases)']].map(([h, l], i) =>
      `<a href="#${h}" class="${['met', 'speed', 'jam'][i] === active ? 'on' : ''}">${l}</a>`).join('')}</nav>`;
}

V.metronomo = (el) => {
  el.innerHTML = treinoTabs('met') + `
    <section class="panel met">
      <div class="met-bpm">
        <button type="button" class="btn round" data-d="-5" aria-label="Menos 5 BPM">−5</button>
        <button type="button" class="btn round" data-d="-1" aria-label="Menos 1 BPM">−1</button>
        <div class="bpm-read"><b data-bpm>${MET.bpm}</b><span>BPM</span></div>
        <button type="button" class="btn round" data-d="1" aria-label="Mais 1 BPM">+1</button>
        <button type="button" class="btn round" data-d="5" aria-label="Mais 5 BPM">+5</button>
      </div>
      <input type="range" min="30" max="240" value="${MET.bpm}" data-range id="met-range" aria-label="Andamento">
      <div class="beats" data-beats></div>
      <div class="ctrl-row center">
        ${U.chips('beats', [2, 3, 4, 6].map(b => ({ v: b, label: b + ' tempos' })), MET.beats)}
        ${U.chips('sub', [{ v: 1, label: '♩' }, { v: 2, label: '♫ colcheia' }, { v: 3, label: 'tercina' }, { v: 4, label: 'semicolcheia' }], MET.sub)}
      </div>
      <div class="ctrl-row center">
        <button type="button" class="btn primary big" data-act="go">▶ Iniciar</button>
        <button type="button" class="btn" data-act="tap">Bater o tempo</button>
      </div>
    </section>`;
  const beatsEl = el.querySelector('[data-beats]');
  const drawBeats = () => { beatsEl.innerHTML = Array.from({ length: MET.beats }, (_, i) => `<i class="${i === 0 ? 'acc' : ''}"></i>`).join(''); };
  drawBeats();
  const setBpm = b => { MET.bpm = Math.max(30, Math.min(240, b)); el.querySelector('[data-bpm]').textContent = MET.bpm; el.querySelector('[data-range]').value = MET.bpm; };
  // 12 pulsos por tempo cobrem colcheia, tercina e semicolcheia sem reiniciar o relógio
  const clock = A.Clock(() => MET.bpm, 12, (i, t) => {
    const sub = i % 12, beat = Math.floor(i / 12) % MET.beats;
    if (sub === 0) {
      A.click(t, beat === 0);
      setTimeout(() => { [...beatsEl.children].forEach((c, k) => c.classList.toggle('on', k === beat)); }, Math.max(0, (t - A.ctx.currentTime) * 1000));
    } else if (MET.sub > 1 && sub % (12 / MET.sub) === 0) A.tick(t);
  });
  let taps = [];
  el.addEventListener('click', e => {
    const d = e.target.closest('[data-d]'); if (d) { setBpm(MET.bpm + +d.dataset.d); return; }
    const chip = e.target.closest('[data-chips] .chip');
    if (chip) {
      MET[chip.parentElement.dataset.chips] = +chip.dataset.v;
      chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip));
      drawBeats();
      return;
    }
    const btn = e.target.closest('[data-act]'), act = btn?.dataset.act;
    if (act === 'go') {
      if (clock.running) { clock.stop(); btn.textContent = '▶ Iniciar'; beatsEl.querySelectorAll('.on').forEach(c => c.classList.remove('on')); }
      else { clock.start(); btn.textContent = '■ Parar'; S.practiced(); }
    }
    if (act === 'tap') {
      const n = performance.now(); taps = taps.filter(x => n - x < 2500); taps.push(n);
      if (taps.length > 1) setBpm(Math.round(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1))));
    }
  });
  el.addEventListener('input', e => { if (e.target.matches('[data-range]')) setBpm(+e.target.value); });
  return () => clock.stop();
};

V.speed = (el, id) => {
  if (id && lickById(id)) SPEED.id = id;
  const lick = lickById(SPEED.id);
  const rec = S.get().bpm[lick.id];
  if (SPEED.lastId !== lick.id) { SPEED.start = Math.round(lick.bpm * 0.7); SPEED.target = rec ? rec + 10 : lick.bpm; SPEED.lastId = lick.id; }
  const groups = Object.entries(STYLES).map(([k, n]) => `<optgroup label="${n}">${LICKS.filter(l => l.style === k).map(l => `<option value="${l.id}" ${l.id === lick.id ? 'selected' : ''}>${U.esc(l.title)}</option>`).join('')}</optgroup>`).join('');
  el.innerHTML = treinoTabs('speed') + `
    <section class="panel">
      <div class="ctrl-row"><label class="field grow">Exercício <select data-k="id" id="spd-ex">${groups}</select></label>
        <span class="pill">${rec ? `Recorde: ${rec} BPM` : 'Sem recorde ainda'}</span></div>
      <div class="ctrl-row">
        <label class="field">Começar em <input type="number" min="30" max="260" value="${SPEED.start}" data-k="start" id="spd-start"> BPM</label>
        <label class="field">Meta <input type="number" min="30" max="300" value="${SPEED.target}" data-k="target" id="spd-target"> BPM</label>
        <label class="field">Subir <input type="number" min="1" max="20" value="${SPEED.step}" data-k="step" id="spd-step"> BPM</label>
        <label class="field">a cada <input type="number" min="1" max="8" value="${SPEED.reps}" data-k="reps" id="spd-reps"> repetições</label>
        <label class="check"><input type="checkbox" data-k="listen" id="spd-listen" ${SPEED.listen ? 'checked' : ''}> Tocar junto</label>
      </div>
      <div class="speed-read"><div><b data-cur>${SPEED.start}</b><span>BPM agora</span></div><div><b data-rep>0</b><span>repetição</span></div>
        <div class="bar wide"><i data-prog style="width:0%"></i></div></div>
      <div class="tab-scroll" data-tab></div>
      <div class="ctrl-row">
        <button type="button" class="btn primary big" data-act="go">▶ Iniciar treino</button>
        <button type="button" class="btn ok" data-act="save">✓ Consegui limpo neste BPM</button>
      </div>
      <p class="tip">${U.esc(lick.tip)} Regra de ouro: só suba quando tocar 4 vezes seguidas sem erro. Se travar, volte 10 BPM.</p>
    </section>`;
  const parsed = TAB.parse(lick.src);
  const hl = TAB.render(el.querySelector('[data-tab]'), parsed);
  const beats = Math.ceil(parsed.beats);
  let bpm = SPEED.start, rep = 0, beatInRep = 0, repStart = 0, repBpm = bpm, raf = null;
  const curEl = el.querySelector('[data-cur]'), repEl = el.querySelector('[data-rep]'), progEl = el.querySelector('[data-prog]');
  const clock = A.Clock(() => bpm, 1, (i, t) => {
    if (beatInRep === 0) {
      repStart = t; repBpm = bpm;
      if (SPEED.listen) TAB.scheduleNotes(parsed, t, bpm);
      const shown = bpm, r = rep + 1;
      setTimeout(() => { curEl.textContent = shown; repEl.textContent = r; progEl.style.width = Math.min(100, (shown - SPEED.start) / Math.max(1, SPEED.target - SPEED.start) * 100) + '%'; }, Math.max(0, (t - A.ctx.currentTime) * 1000));
    }
    A.click(t, beatInRep % 4 === 0);
    beatInRep++;
    if (beatInRep >= beats) {
      beatInRep = 0; rep++;
      if (rep % SPEED.reps === 0) bpm = Math.min(SPEED.target, bpm + SPEED.step);
    }
  });
  function anim() {
    const now = A.ctx.currentTime;
    if (now >= repStart) {
      const b = (now - repStart) * repBpm / 60;
      let idx = -1; parsed.events.forEach((e, i) => { if (e.beat <= b + 1e-6) idx = i; });
      hl(idx);
    }
    raf = requestAnimationFrame(anim);
  }
  function stop() { clock.stop(); cancelAnimationFrame(raf); A.stopAll(); hl(-1); const b = el.querySelector('[data-act="go"]'); if (b) b.textContent = '▶ Iniciar treino'; }

  el.addEventListener('click', e => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'go') {
      if (clock.running) { stop(); return; }
      bpm = SPEED.start; rep = 0; beatInRep = 0;
      A.init(); repStart = Infinity; clock.start(); raf = requestAnimationFrame(anim);
      e.target.textContent = '■ Parar'; S.practiced();
    }
    if (act === 'save') {
      const val = clock.running ? repBpm : +curEl.textContent;
      S.update(s => { s.bpm[lick.id] = Math.max(s.bpm[lick.id] || 0, val); });
      S.practiced();
      U.toast(`Recorde salvo: ${Math.max(val, rec || 0)} BPM`);
      el.querySelector('.pill').textContent = `Recorde: ${S.get().bpm[lick.id]} BPM`;
    }
  });
  el.addEventListener('change', e => {
    const k = e.target.dataset.k; if (!k) return;
    if (k === 'id') { stop(); location.hash = '#treino-' + e.target.value; return; }
    if (k === 'listen') SPEED.listen = e.target.checked;
    else SPEED[k] = Math.max(1, +e.target.value || 1);
    if (k === 'start' && !clock.running) curEl.textContent = SPEED.start;
  });
  return stop;
};
