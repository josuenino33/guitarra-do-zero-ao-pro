/* ===== Afinador e leitura rítmica ===== */
const TUNINGS = [
  { id:'padrao', name:'Padrão (E A D G B E)', m:[40,45,50,55,59,64] },
  { id:'meio', name:'Meio tom abaixo (E♭ A♭ D♭ G♭ B♭ E♭)', m:[39,44,49,54,58,63] },
  { id:'dropd', name:'Drop D (D A D G B E)', m:[38,45,50,55,59,64] },
  { id:'umtom', name:'Um tom abaixo (D G C F A D)', m:[38,43,48,53,57,62] },
  { id:'dropc', name:'Drop C (C G C F A D)', m:[36,43,48,53,57,62] },
  { id:'openg', name:'Open G (D G D G B D)', m:[38,43,50,55,59,62] },
  { id:'dadgad', name:'DADGAD', m:[38,45,50,55,57,62] },
];

W.tuner = (host, cfg = {}) => {
  let tun = TUNINGS[0], target = -1, hist = [], okSince = 0, done = new Set();
  const latin = () => U.set().latin;
  const nm = m => T.noteName(m, tun.id === 'meio', latin());
  host.innerHTML = `
    <div class="ctrl-row">
      <label class="field">Afinação <select data-tun id="tuner-tun">${TUNINGS.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}</select></label>
      <button type="button" class="btn primary" data-act="mic">🎤 Ligar microfone</button>
    </div>
    <div class="tuner">
      <div class="tu-read"><b data-note>–</b><span data-hz>Toque uma corda solta</span></div>
      <div class="tu-meter" aria-hidden="true"><i class="tu-zero"></i><i class="tu-needle" data-needle></i><span>−50</span><span>0</span><span>+50</span></div>
      <p class="tu-msg" data-msg aria-live="polite"></p>
    </div>
    <div class="tu-strings" data-strings></div>
    <p class="small">Toque num botão de corda para ouvir a nota de referência e afinar de ouvido. Com o microfone ligado, o afinador reconhece a corda sozinho.</p>`;
  const $ = s => host.querySelector(s);
  function strings() {
    $('[data-strings]').innerHTML = tun.m.map((m, i) => `<button type="button" class="tu-str ${i === target ? 'on' : ''} ${done.has(i) ? 'ok' : ''}" data-str="${i}"><small>${6 - i}</small><b>${nm(m)}</b></button>`).join('');
  }
  strings();
  function show(r) {
    if (r.hz < 0) { if (r.rms < 0.008) { $('[data-hz]').textContent = 'Toque uma corda solta'; } return; }
    hist.push(r.hz); if (hist.length > 5) hist.shift();
    const hz = hist.slice().sort((a, b) => a - b)[hist.length >> 1];
    const m = 69 + 12 * Math.log2(hz / 440);
    let si = target;
    if (si < 0) { let best = 99; tun.m.forEach((t, i) => { const d = Math.abs(m - t); if (d < best) { best = d; si = i; } }); }
    const ref = tun.m[si];
    const cents = Math.round((m - ref) * 100);
    $('[data-note]').textContent = nm(Math.round(m));
    $('[data-hz]').textContent = `${hz.toFixed(1)} Hz · corda ${6 - si} (${nm(ref)})`;
    const clamped = Math.max(-50, Math.min(50, cents));
    const needle = $('[data-needle]');
    needle.style.left = `calc(${50 + clamped}% - 2px)`;
    const ok = Math.abs(cents) <= 5;
    needle.classList.toggle('ok', ok);
    $('[data-msg]').textContent = Math.abs(cents) > 300 ? 'Longe da nota: confira se é a corda certa.' : ok ? 'Afinada!' : cents < 0 ? `Baixa ${-cents} cents: aperte a tarraxa` : `Alta ${cents} cents: afrouxe um pouco e suba de novo`;
    if (ok) { if (!okSince) okSince = performance.now(); if (performance.now() - okSince > 700 && !done.has(si)) { done.add(si); strings(); if (done.size === 6) { U.toast('Todas as cordas afinadas'); S.practiced(); } } }
    else okSince = 0;
  }
  host.addEventListener('click', async e => {
    const st = e.target.closest('[data-str]');
    if (st) { const i = +st.dataset.str; target = target === i ? -1 : i; A.play(tun.m[i], null, { dur: 2.5, vel: 0.8, string: i }); strings(); return; }
    const b = e.target.closest('[data-act="mic"]');
    if (b) {
      if (MIC.on) { MIC.stop(); b.textContent = '🎤 Ligar microfone'; $('[data-msg]').textContent = ''; return; }
      try { await MIC.start(show); b.textContent = '■ Desligar microfone'; $('[data-msg]').textContent = 'Ouvindo… toque uma corda solta.'; }
      catch (err) { $('[data-msg]').textContent = MIC.errorText(err); }
    }
  });
  host.addEventListener('change', e => { if (e.target.matches('[data-tun]')) { tun = TUNINGS.find(t => t.id === e.target.value); target = -1; done.clear(); strings(); } });
  return () => MIC.stop();
};

W.rhythm = (host, cfg = {}) => {
  const list = RH.READING.filter(r => !cfg.lv || cfg.lv.includes(r.lv));
  let idx = 0, bpm = 70, play = null, raf = null, taps = [], mode = null;
  host.innerHTML = `
    <div class="ctrl-row"><span class="pill" data-n></span>
      <button type="button" class="btn ghost" data-act="prev" aria-label="Ritmo anterior">←</button>
      <button type="button" class="btn ghost" data-act="next" aria-label="Próximo ritmo">→</button>
      <label class="field">Andamento <input type="range" min="40" max="140" value="${bpm}" data-bpm id="rh-bpm"> <b data-bpmv>${bpm}</b> BPM</label></div>
    <div class="rn-wrap" data-svg></div>
    <div class="ctrl-row">
      <button type="button" class="btn" data-act="hear">♪ Ouvir</button>
      <button type="button" class="btn primary" data-act="tapgo">Tocar junto</button>
      <span class="small" data-info>Ouça primeiro. Em “Tocar junto”, conte 4 cliques e bata no ritmo.</span>
    </div>
    <button type="button" class="tap-pad wide" data-act="tap" disabled><b data-score>–</b><span>toque aqui (ou barra de espaço) em cada nota</span></button>`;
  const $ = s => host.querySelector(s);
  let evs = [];
  function draw() {
    const r = list[idx];
    const n = RH.notation(r.src);
    evs = n.evs;
    $('[data-svg]').innerHTML = n.svg;
    $('[data-n]').textContent = `Ritmo ${idx + 1} de ${list.length} · nível ${r.lv}`;
    $('[data-score]').textContent = '–';
  }
  function anim() {
    if (!play) return;
    const now = A.ctx.currentTime, beat = (now - play.t0) / play.spb;
    host.querySelectorAll('.rn-hit').forEach(h => { const e = evs[+h.dataset.ev]; h.classList.toggle('on', beat >= e.beat && beat < e.beat + e.d); });
    if (now > play.end + 0.4) { finish(); return; }
    raf = requestAnimationFrame(anim);
  }
  function start(m) {
    stop(); mode = m; taps = [];
    play = RH.playRhythm(list[idx].src, bpm, { click: true });
    if (m === 'tap') { $('[data-act="tap"]').disabled = false; $('[data-score]').textContent = '…'; }
    raf = requestAnimationFrame(anim);
    S.practiced();
  }
  function finish() {
    cancelAnimationFrame(raf);
    host.querySelectorAll('.rn-hit.on').forEach(h => h.classList.remove('on'));
    if (mode === 'tap') {
      const exp = evs.filter(e => !e.rest).map(e => play.t0 + e.beat * play.spb);
      const used = new Set(); let sum = 0;
      exp.forEach(t => {
        let bi = -1, bd = 0.16;
        taps.forEach((x, i) => { const d = Math.abs(x - t); if (!used.has(i) && d < bd) { bd = d; bi = i; } });
        if (bi >= 0) { used.add(bi); sum += Math.max(0, 1 - bd / 0.16); }
      });
      const extra = taps.length - used.size;
      const pct = Math.round(100 * sum / (exp.length + extra * 0.5));
      $('[data-score]').textContent = pct + '%';
      $('[data-info]').textContent = pct >= 80 ? 'Ótimo! Passe para o próximo ritmo.' : pct >= 50 ? 'Quase lá. Ouça de novo e repita.' : 'Ouça de novo contando os tempos em voz alta.';
      $('[data-act="tap"]').disabled = true;
    }
    play = null; mode = null;
  }
  function stop() { cancelAnimationFrame(raf); play = null; mode = null; $('[data-act="tap"]').disabled = true; }
  // desconta a latência de saída do áudio: você bate quando OUVE o clique
  function tap() { if (mode === 'tap' && play) { taps.push(A.ctx.currentTime - (A.ctx.outputLatency || A.ctx.baseLatency || 0)); A.play(69, null, { dur: 0.08, vel: 0.4, mute: true }); } }
  host.addEventListener('pointerdown', e => { if (e.target.closest('[data-act="tap"]')) { e.preventDefault(); tap(); } });
  host.addEventListener('click', e => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'prev') { idx = (idx - 1 + list.length) % list.length; stop(); draw(); }
    if (act === 'next') { idx = (idx + 1) % list.length; stop(); draw(); }
    if (act === 'hear') start('hear');
    if (act === 'tapgo') start('tap');
  });
  host.addEventListener('input', e => { if (e.target.matches('[data-bpm]')) { bpm = +e.target.value; $('[data-bpmv]').textContent = bpm; } });
  const key = e => { if (e.code === 'Space' && mode === 'tap') { e.preventDefault(); tap(); } };
  document.addEventListener('keydown', key);
  draw();
  return () => { stop(); document.removeEventListener('keydown', key); };
};
