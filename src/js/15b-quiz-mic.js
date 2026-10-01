/* ===== Quizzes com microfone: o app escuta a guitarra ===== */
QUIZZES.push(
  { id:'toque-nota', title:'Toque a nota', desc:'O app pede uma nota e escuta: toque em qualquer lugar do braço.', mic:true },
  { id:'toque-corda', title:'Toque na corda', desc:'Ache a nota pedida na corda indicada e toque. O app confere pelo microfone.', mic:true, scope:true },
  { id:'toque-intervalo', title:'Toque o intervalo', desc:'Ouça a tônica e toque o intervalo pedido acima dela.', mic:true },
);

function quizMicRun(el, q) {
  let round = 0, score = 0, t0 = 0, cur = null, timer = null, listening = false, firstTry = true, stable = 0, last = null, wrongLock = 0;
  const latin = () => U.set().latin;
  const both = pc => T.noteName(pc, false, latin()) + ([1, 3, 6, 8, 10].includes(T.mod(pc)) ? ' / ' + T.noteName(pc, true, latin()) : '');
  el.innerHTML = `<nav class="crumbs"><a href="#quiz">Quiz</a><span>›</span><span>${q.title}</span></nav>
    <section class="panel quiz">
      <div class="quiz-top"><h1>${q.title}</h1>
        ${q.scope ? U.chips('scope', [{ v:'65', label:'Cordas 6 e 5' }, { v:'all', label:'Todas as cordas' }], QZ.scope) : ''}
        <span class="pill" data-count></span></div>
      <p class="prompt" data-prompt>Ligue o microfone, deixe a guitarra afinada e toque uma nota por vez, deixando soar.</p>
      <div data-fb></div>
      <div class="ctrl-row">
        <button type="button" class="btn primary big" data-act="go">🎤 Começar</button>
        <button type="button" class="btn" data-act="skip" disabled>Pular</button>
        <button type="button" class="btn ghost" data-act="ref" hidden>♪ Ouvir a tônica</button>
        <span class="small" data-heard></span>
      </div>
      <p class="feedback" data-fbk aria-live="polite"></p>
    </section>`;
  const $ = s => el.querySelector(s);
  const fb = FB.create($('[data-fb]'));
  fb.set(U.fbState({ frets: 15, marks: [] }));
  const strings = () => QZ.scope === '65' ? [0, 1] : [0, 1, 2, 3, 4, 5];
  const rnd = n => Math.floor(Math.random() * n), pick = a => a[rnd(a.length)];

  function gen() {
    if (q.id === 'toque-nota') {
      const pc = rnd(12), ok = []; for (let m = 40; m <= 88; m++) if (T.mod(m) === pc) ok.push(m);
      return { ok, text: `Toque <b>${both(pc)}</b> em qualquer lugar.`, reveal: () => T.pcPositions(pc, 15).map(p => T.mark(p.s, p.f, pc)), right: both(pc) };
    }
    if (q.id === 'toque-corda') {
      const s = pick(strings()), pc = rnd(12), ok = [], pos = [];
      for (let f = 0; f <= 15; f++) if (T.mod(T.pitch(s, f)) === pc) { ok.push(T.pitch(s, f)); pos.push(f); }
      return { ok, text: `Toque <b>${both(pc)}</b> na <b>${T.stringLabel(s).toLowerCase()}</b>.`, reveal: () => pos.map(f => T.mark(s, f, pc)), right: `${both(pc)} na casa ${pos.join(' ou ')}` };
    }
    const ivs = [3, 4, 5, 7, 9, 10, 12], iv = pick(ivs), s = rnd(3), f = 1 + rnd(8), root = T.pitch(s, f);
    return { ok: [root + iv], root, rs: s, rf: f, text: `A tônica é ${T.noteName(root, false, latin())} (corda ${6 - s}, casa ${f}). Toque a <b>${iv === 12 ? 'oitava' : T.IV_NAME[iv].toLowerCase()}</b> acima.`,
      marks: [T.mark(s, f, T.mod(root))], reveal: () => { const out = [T.mark(s, f, T.mod(root))]; for (let ss = s; ss < 6; ss++) { const ff = root + iv - T.TUNING[ss]; if (ff >= 0 && ff <= 15 && Math.abs(ff - f) <= 5) out.push(T.mark(ss, ff, T.mod(root), iv === 12 ? { label: '8' } : {})); } return out; },
      right: `${T.noteName(root + iv, false, latin())}` };
  }

  function next() {
    clearTimeout(timer);
    if (round >= QZ.rounds) return finish();
    cur = gen(); firstTry = true; stable = 0; last = null;
    $('[data-prompt]').innerHTML = cur.text;
    $('[data-fbk]').textContent = ''; $('[data-fbk]').className = 'feedback';
    $('[data-count]').textContent = `${round + 1}/${QZ.rounds} · ${score} acertos`;
    fb.set({ marks: cur.marks || [], labels: q.id === 'toque-intervalo' ? 'iv' : 'note' });
    $('[data-act="ref"]').hidden = q.id !== 'toque-intervalo';
    if (cur.root) A.play(cur.root, null, { dur: 1.4, vel: 0.7 });
    listening = true;
  }
  function resolve(ok) {
    listening = false; round++;
    if (ok && firstTry) score++;
    $('[data-fbk]').textContent = ok ? (firstTry ? 'Certo!' : 'Certo, na segunda tentativa.') : `Era ${cur.right}.`;
    $('[data-fbk]').className = 'feedback ' + (ok ? 'ok' : 'bad');
    fb.set({ marks: cur.reveal(), labels: q.id === 'toque-intervalo' ? 'iv' : 'note' });
    $('[data-count]').textContent = `${round}/${QZ.rounds} · ${score} acertos`;
    timer = setTimeout(next, ok ? 1100 : 2200);
  }
  function finish() {
    MIC.stop(); listening = false;
    const pct = Math.round(score / QZ.rounds * 100), secs = Math.round((performance.now() - t0) / 1000);
    const prev = S.get().quiz[q.id];
    const isBest = !prev || pct > prev.best || (pct === prev.best && secs < prev.time);
    if (isBest) S.update(s => { s.quiz[q.id] = { best: pct, time: secs, date: S.today() }; });
    S.practiced();
    $('[data-prompt]').innerHTML = `<b class="big-num">${pct}%</b> ${score} de ${QZ.rounds} em ${secs}s${isBest ? ' · novo recorde' : ''}`;
    $('[data-act="go"]').textContent = '🎤 Jogar de novo'; $('[data-act="skip"]').disabled = true;
  }
  function onPitch(p) {
    if (!listening || !cur) return;
    if (p.hz < 0) { stable = 0; last = null; return; }
    if (p.midi === last) stable++; else { stable = 1; last = p.midi; }
    if (stable < 3 || Math.abs(p.cents) > 45) return;
    $('[data-heard]').textContent = `Ouvi: ${T.noteName(p.midi, false, latin())}`;
    if (cur.ok.includes(p.midi)) resolve(true);
    else if (stable === 3 && performance.now() > wrongLock) {
      firstTry = false; wrongLock = performance.now() + 700;
      $('[data-fbk]').textContent = `Você tocou ${T.noteName(p.midi, false, latin())}. Tente de novo.`; $('[data-fbk]').className = 'feedback bad';
    }
  }
  el.addEventListener('click', async e => {
    const chip = e.target.closest('[data-chips="scope"] .chip');
    if (chip) { QZ.scope = chip.dataset.v; chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip)); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'go') {
      try { await MIC.start(onPitch); } catch (err) { $('[data-fbk]').textContent = MIC.errorText(err); $('[data-fbk]').className = 'feedback bad'; return; }
      round = 0; score = 0; t0 = performance.now();
      $('[data-act="go"]').textContent = '🎤 Ouvindo…'; $('[data-act="skip"]').disabled = false;
      next();
    }
    if (act === 'skip' && listening) resolve(false);
    if (act === 'ref' && cur && cur.root) A.play(cur.root, null, { dur: 1.4, vel: 0.7 });
  });
  return () => { clearTimeout(timer); MIC.stop(); };
}
