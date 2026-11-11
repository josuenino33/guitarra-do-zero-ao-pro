/* ===== Braço: tríades worship (inversões, condução de vozes, tocar em loop e treino) ===== */
const TRI_UI = { key:7, prog:'1564', set:'123', near:7, mode:'bloco', bpm:72, dly:true, chord:0 };
const TRI_PROGS = [
  { id:'1564', label:'I–V–vi–IV', d:[0, 4, 5, 3] }, { id:'6415', label:'vi–IV–I–V', d:[5, 3, 0, 4] },
  { id:'4156', label:'IV–I–V–vi', d:[3, 0, 4, 5] }, { id:'1465', label:'I–IV–vi–V', d:[0, 3, 5, 4] }, { id:'2511', label:'ii–V–I–I', d:[1, 4, 0, 0] },
];

V.triades = (el) => {
  const st = TRI_UI;
  const REG = [{ v:4, label:'Grave (casas 2–6)' }, { v:7, label:'Meio (5–10)' }, { v:11, label:'Agudo (9–14)' }];
  el.innerHTML = `<header class="page-head"><p class="eyebrow">Braço</p><h1>Tríades</h1>
      <p class="lede">Três notas em três cordas vizinhas: a base da guitarra no louvor. O app escolhe a inversão de cada acorde que deixa a mão andar o mínimo na troca.</p></header>
    ${bracoTabs('tri')}
    <section class="panel">
      <div class="ctrl-row"><label class="field">Tom <select data-key id="tri-key">${U.rootOptions(st.key)}</select></label></div>
      <div class="ctrl-row">${U.chips('prog', TRI_PROGS.map(p => ({ v: p.id, label: p.label })), st.prog)}</div>
      <div class="ctrl-row">${U.chips('set', T.STRING_SETS.slice(0, 3).map(s => ({ v: s.id, label: s.label })), st.set)}</div>
      <div class="ctrl-row">${U.chips('near', REG, st.near)}</div>
      <div class="chord-row" data-cards></div>
      <p class="small" data-move></p>
      <div class="ctrl-row">
        <button type="button" class="btn primary" data-act="play">▶ Tocar em loop</button>
        ${U.chips('mode', [{ v:'bloco', label:'Em bloco' }, { v:'arpejo', label:'Arpejado' }], st.mode)}
      </div>
      <div class="ctrl-row">
        <label class="field">Andamento <input type="range" min="50" max="120" value="${st.bpm}" data-bpm id="tri-bpm"> <b data-bpmv>${st.bpm}</b> BPM</label>
        <label class="check"><input type="checkbox" data-dly id="tri-dly" ${st.dly ? 'checked' : ''}> Delay pontilhado</label>
      </div>
      <div class="tab-scroll" data-tab></div>
    </section>
    <section class="panel"><p class="eyebrow">Todas as inversões de um acorde</p>
      <div class="ctrl-row" data-chordchips></div><div class="chord-row" data-all></div>
      <p class="small">Fundamental: a tônica embaixo. 1ª inversão: a 3ª embaixo. 2ª inversão: a 5ª embaixo. As três soam o mesmo acorde; muda a nota de cima e o lugar da mão.</p></section>
    <section class="panel"><p class="eyebrow">Treino: qual inversão?</p><div data-quiz></div></section>`;
  const $ = s => el.querySelector(s);
  let p = null, parsed = null, hl = () => {}, quiz = null, score = { ok: 0, n: 0 };
  const player = TAB.Player({
    onEvent(i) {
      hl(i);
      const bar = i < 0 ? -1 : Math.floor(parsed.events[i].beat / 4 + 1e-9);
      el.querySelectorAll('[data-card]').forEach(c => c.classList.toggle('on', +c.dataset.card === bar));
    },
    onEnd() { $('[data-act="play"]').textContent = '▶ Tocar em loop'; A.setDelay(0); },
  });
  const prog = () => TRI_PROGS.find(x => x.id === st.prog) || TRI_PROGS[0];

  function paint() {
    p = TRI.progPath(st.key, prog().d, st.set, st.near);
    if (!p) { $('[data-cards]').innerHTML = '<p class="small">Sem tríades nessa região.</p>'; return; }
    $('[data-cards]').innerHTML = p.map((v, i) => `<button type="button" class="chord-card" data-card="${i}" aria-label="Ouvir ${v.name}">
      <b>${prettyChord(v.name)}</b><span class="small">${T.INV_NAME[v.inv]} · em cima: ${v.top}</span>${CH.diagram(TRI.shape(v))}</button>`).join('');
    const moves = p.map((v, i) => TRI.move(v, p[(i + 1) % p.length]));
    $('[data-move]').innerHTML = `A mão anda <b>${TRI.totalMove(p)} casas</b> no total (somando os 3 dedos) por volta da progressão. Trocas: ${p.map((v, i) => `${prettyChord(v.name)} → ${prettyChord(p[(i + 1) % p.length].name)}: ${moves[i]}`).join(' · ')}.`;
    parsed = TAB.parse(TRI.src(p, st.mode));
    hl = TAB.render($('[data-tab]'), parsed, 4);
    const uniq = []; p.forEach((v, i) => { if (!uniq.some(u => u.name === v.name)) uniq.push(Object.assign({ i }, v)); });
    if (st.chord >= uniq.length) st.chord = 0;
    $('[data-chordchips]').innerHTML = U.chips('chord', uniq.map((v, i) => ({ v: i, label: v.name })), st.chord);
    const c = uniq[st.chord], all = TRI.options(c.root, c.minor, st.set);
    $('[data-all]').innerHTML = all.map((v, i) => `<button type="button" class="chord-card" data-opt="${i}" aria-label="Ouvir"><b>${T.INV_NAME[v.inv]}</b><span class="small">casa ${v.lo} · em cima: ${v.top}</span>${CH.diagram(TRI.shape(v))}</button>`).join('');
    $('[data-all]')._opts = all;
  }

  function play() {
    A.setDelay(st.dly ? 45 / st.bpm : 0);
    player.play(parsed, { bpm: st.bpm, loop: true, click: false, countIn: false });
    $('[data-act="play"]').textContent = '■ Parar'; S.practiced();
  }
  function stop() { player.stop(); A.setDelay(0); $('[data-act="play"]').textContent = '▶ Tocar em loop'; }

  /* treino: mostra uma tríade e pergunta a inversão */
  function newQuiz() {
    const k = Math.floor(Math.random() * 12), d = Math.floor(Math.random() * 6), set = ['123', '234', '345'][Math.floor(Math.random() * 3)];
    const H = harmonize(k, 'maior'), opts = TRI.options(H[d].pc, TRI.MINOR[d], set, 12);
    const v = opts[Math.floor(Math.random() * opts.length)];
    quiz = Object.assign({ name: H[d].triad }, v);
    $('[data-quiz]').innerHTML = `<div class="tri-quiz"><div class="chord-card"><b>${prettyChord(quiz.name)}</b><span class="small">${T.STRING_SETS.find(s => s.id === set).label}</span>${CH.diagram(TRI.shape(quiz))}</div>
      <div><p>Qual é a inversão? Olhe a nota mais grave.</p>
        <div class="ctrl-row">${T.INV_NAME.map((n, i) => `<button type="button" class="btn" data-ans="${i}">${n}</button>`).join('')}</div>
        <p class="small" data-qmsg>${score.n ? `Acertos: ${score.ok} de ${score.n}` : 'Toque no desenho para ouvir.'}</p></div></div>`;
  }
  function answer(i) {
    score.n++;
    const right = i === quiz.inv;
    if (right) { score.ok++; S.practiced(); }
    WV.strum(TRI.shape(quiz));
    el.querySelectorAll('[data-ans]').forEach(b => { b.disabled = true; b.classList.toggle('primary', +b.dataset.ans === quiz.inv); });
    $('[data-qmsg]').innerHTML = `${right ? '✅ Isso!' : `❌ Era <b>${T.INV_NAME[quiz.inv]}</b>.`} A nota de baixo é a ${['tônica', '3ª', '5ª'][quiz.inv]} e em cima está a ${quiz.top}. Acertos: ${score.ok} de ${score.n}. <button type="button" class="linkbtn" data-act="nextq">Próxima →</button>`;
  }

  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips] .chip');
    if (chip) {
      const g = chip.parentElement.dataset.chips, v = chip.dataset.v;
      if (g === 'prog') { st.prog = v; st.chord = 0; }
      if (g === 'set') st.set = v;
      if (g === 'near') st.near = +v;
      if (g === 'mode') st.mode = v;
      if (g === 'chord') st.chord = +v;
      chip.parentElement.querySelectorAll('.chip').forEach(c => { c.classList.toggle('on', c === chip); c.setAttribute('aria-pressed', c === chip); });
      const was = player.playing; if (was) player.stop();
      paint(); if (was && g !== 'chord') play();
      return;
    }
    const card = e.target.closest('[data-card]'); if (card) { WV.strum(TRI.shape(p[+card.dataset.card])); return; }
    const opt = e.target.closest('[data-opt]'); if (opt) { WV.strum(TRI.shape($('[data-all]')._opts[+opt.dataset.opt])); return; }
    const ans = e.target.closest('[data-ans]'); if (ans && !ans.disabled) { answer(+ans.dataset.ans); return; }
    if (e.target.closest('[data-quiz] .chord-card')) { WV.strum(TRI.shape(quiz)); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'play') { if (player.playing) stop(); else play(); }
    if (act === 'nextq') newQuiz();
  });
  el.addEventListener('change', e => {
    if (e.target.matches('[data-key]')) { st.key = +e.target.value; const was = player.playing; if (was) player.stop(); paint(); if (was) play(); }
    if (e.target.matches('[data-dly]')) { st.dly = e.target.checked; if (player.playing) A.setDelay(st.dly ? 45 / st.bpm : 0); }
  });
  el.addEventListener('input', e => {
    if (!e.target.matches('[data-bpm]')) return;
    st.bpm = +e.target.value; $('[data-bpmv]').textContent = st.bpm;
  });
  el.addEventListener('change', e => { if (e.target.matches('[data-bpm]') && player.playing) { player.stop(); play(); } });
  paint(); newQuiz();
  return () => { player.stop(); A.setDelay(0); };
};
