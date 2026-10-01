/* ===== Quizzes ===== */
const QUIZZES = [
  { id:'qual-nota', title:'Qual é a nota?', desc:'Uma casa acende no braço. Escolha o nome da nota.', scope:true },
  { id:'ache-nota', title:'Ache a nota', desc:'Clique na casa da nota pedida, na corda indicada.', scope:true },
  { id:'intervalo', title:'Que intervalo é esse?', desc:'Tônica em vermelho e outra nota. Diga a distância entre elas.' },
  { id:'triade', title:'Tríade e inversão', desc:'Três notas acesas. É maior ou menor? Qual inversão?' },
  { id:'ouvido', title:'Treino de ouvido', desc:'Ouça duas notas e diga o intervalo, sem olhar o braço.' },
];
const QZ = { scope:'65', rounds:10 };
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];

V.quiz = (el, id) => {
  const q = QUIZZES.find(x => x.id === id);
  if (!q) return quizHome(el);
  return q.mic ? quizMicRun(el, q) : quizRun(el, q);
};

function quizHome(el) {
  const best = S.get().quiz;
  el.innerHTML = `<header class="page-head"><p class="eyebrow">Quiz</p><h1>Decorar o braço jogando</h1>
    <p class="lede">Rodadas de ${QZ.rounds} perguntas. Seu melhor resultado fica salvo.</p></header>
    <div class="quiz-grid">${QUIZZES.map(z => `<a class="quiz-card" href="#quiz-${z.id}">
      <h2>${z.title}${z.mic ? ' <span class="pill mic">🎤 microfone</span>' : ''}</h2><p>${z.desc}</p>
      <span class="pill ${best[z.id] ? (best[z.id].best >= 90 ? 'ok' : '') : 'muted'}">${best[z.id] ? `Melhor: ${best[z.id].best}% · ${best[z.id].time}s` : 'Ainda não jogado'}</span></a>`).join('')}</div>`;
}

function quizRun(el, q) {
  let round = 0, score = 0, t0 = performance.now(), cur = null, locked = false, timer = null;
  el.innerHTML = `<nav class="crumbs"><a href="#quiz">Quiz</a><span>›</span><span>${q.title}</span></nav>
    <section class="panel quiz">
      <div class="quiz-top"><h1>${q.title}</h1>
        ${q.scope ? U.chips('scope', [{ v:'65', label:'Cordas 6 e 5' }, { v:'all', label:'Todas as cordas' }], QZ.scope) : ''}
        <span class="pill" data-count></span></div>
      <p class="prompt" data-prompt></p>
      <div data-fb></div>
      <div class="answers" data-ans></div>
      <p class="feedback" data-fbk aria-live="polite"></p>
    </section>`;
  const fb = FB.create(el.querySelector('[data-fb]'));
  const promptEl = el.querySelector('[data-prompt]'), ansEl = el.querySelector('[data-ans]'), fbk = el.querySelector('[data-fbk]');
  const latin = () => U.set().latin;
  const N = 12;
  const strings = () => QZ.scope === '65' ? [0, 1] : [0, 1, 2, 3, 4, 5];
  const noteButtons = () => T.ROOTS.map((r, i) => `<button type="button" class="btn ans" data-a="${i}">${T.noteName(i, false, latin())}${[1, 3, 6, 8, 10].includes(i) ? ' / ' + T.noteName(i, true, latin()) : ''}</button>`).join('');

  const GEN = {
    'qual-nota'() {
      const s = pick(strings()), f = rnd(N + 1), pc = T.mod(T.pitch(s, f));
      fb.set(U.fbState({ frets: N, marks: [Object.assign(T.mark(s, f, pc), { role:'q', label:'?' })], onPick: null }));
      promptEl.textContent = `Que nota é esta? (${T.stringLabel(s)}, casa ${f})`;
      ansEl.innerHTML = noteButtons();
      return { answer: pc, reveal: () => fb.set({ marks: [Object.assign(T.mark(s, f, pc), { role:'r' })], labels:'note' }) };
    },
    'ache-nota'() {
      const s = pick(strings()), pc = rnd(12);
      fb.set(U.fbState({ frets: N, marks: [], labels:'note', onPick: (ss, ff) => answer(ss === s && T.mod(T.pitch(ss, ff)) === pc, { s: ss, f: ff }) }));
      promptEl.innerHTML = `Ache <b>${T.noteName(pc, false, latin())}${[1, 3, 6, 8, 10].includes(pc) ? ' / ' + T.noteName(pc, true, latin()) : ''}</b> na <b>${T.stringLabel(s).toLowerCase()}</b>.`;
      ansEl.innerHTML = '';
      return { custom: true, reveal: (click) => {
        const marks = [];
        for (let f = 0; f <= N; f++) if (T.mod(T.pitch(s, f)) === pc) marks.push(Object.assign(T.mark(s, f, pc), { role:'r' }));
        if (click && !marks.some(m => m.s === click.s && m.f === click.f)) marks.push(Object.assign(T.mark(click.s, click.f, pc), { role:'bad' }));
        fb.set({ marks, labels:'note', onPick: null });
      } };
    },
    'intervalo'() {
      const ivs = [2, 3, 4, 5, 7, 9, 10, 11, 12];
      for (;;) {
        const s = rnd(4), f = 1 + rnd(9), iv = pick(ivs), rp = T.pitch(s, f), opts = [];
        for (let ss = s; ss <= Math.min(5, s + 2); ss++) for (let ff = Math.max(0, f - 3); ff <= f + 4; ff++)
          if (T.pitch(ss, ff) === rp + iv && ss !== s) opts.push({ s: ss, f: ff });
        if (!opts.length) continue;
        const tg = pick(opts), rootPc = T.mod(rp);
        fb.set(U.fbState({ frets: 15, labels:'iv', marks: [T.mark(s, f, rootPc), Object.assign(T.mark(tg.s, tg.f, rootPc), { role:'q', label:'?' })], onPick: null }));
        promptEl.textContent = 'Qual é o intervalo entre a tônica e a nota “?”';
        ansEl.innerHTML = ivs.map(i => `<button type="button" class="btn ans" data-a="${i}">${i === 12 ? 'Oitava' : T.IV_NAME[i]}</button>`).join('');
        A.play(rp, null, { dur: 0.8 }); A.play(rp + iv, A.now() + 0.5, { dur: 1 });
        return { answer: iv, reveal: () => fb.set({ marks: [T.mark(s, f, rootPc), Object.assign(T.mark(tg.s, tg.f, rootPc), iv === 12 ? { label:'8' } : {})] }) };
      }
    },
    'triade'() {
      const root = rnd(12), qual = pick(['maior', 'menor']), set = pick(T.STRING_SETS);
      const vs = T.triads(root, qual, set.s, 15);
      const v = pick(vs);
      fb.set(U.fbState({ frets: 15, labels:'note', flats: T.useFlats(root, qual === 'menor' ? 3 : 0), marks: v.notes.map(n => Object.assign({}, n, { role:'q' })), onPick: null }));
      promptEl.textContent = `Que tríade é esta? (${set.label})`;
      ansEl.innerHTML = ['maior', 'menor'].flatMap(qq => [0, 1, 2].map(i => `<button type="button" class="btn ans" data-a="${qq}-${i}">${T.CHORDS[qq].name} · ${T.INV_NAME[i]}</button>`)).join('');
      v.notes.forEach((n, k) => A.play(T.pitch(n.s, n.f), A.now() + k * 0.03, { dur: 1.2, vel: 0.6 }));
      return { answer: `${qual}-${v.inv}`, extra: `${T.chordName(root, qual, latin())}, ${T.INV_NAME[v.inv].toLowerCase()}`, reveal: () => fb.set({ marks: v.notes, labels:'iv' }) };
    },
    'ouvido'() {
      const ivs = [3, 4, 5, 7, 9, 10, 12];
      const iv = pick(ivs), base = 48 + rnd(12);
      const playIt = () => { A.play(base, null, { dur: 0.9 }); A.play(base + iv, A.now() + 0.7, { dur: 0.9 }); A.play(base, A.now() + 1.6, { dur: 1.2, vel: 0.6 }); A.play(base + iv, A.now() + 1.6, { dur: 1.2, vel: 0.6 }); };
      fb.set(U.fbState({ frets: 15, marks: [], onPick: null }));
      promptEl.innerHTML = 'Ouça e escolha o intervalo. <button type="button" class="btn" data-act="replay">♪ Ouvir de novo</button>';
      promptEl.querySelector('[data-act]').onclick = playIt;
      ansEl.innerHTML = ivs.map(i => `<button type="button" class="btn ans" data-a="${i}">${i === 12 ? 'Oitava' : T.IV_NAME[i]}</button>`).join('');
      playIt();
      const s = base - 40 < 12 ? 0 : 1, f = base - T.TUNING[s];
      return { answer: iv, reveal: () => {
        const tp = base + iv; let best = null;
        for (let ts = s; ts < 6; ts++) {
          const tf = tp - T.TUNING[ts];
          if (tf < 0 || tf > 15) continue;
          const d = Math.abs(tf - f);
          if (!best || d < best.d) best = { ts, tf, d };
        }
        fb.set({ marks: [T.mark(s, f, T.mod(base)), Object.assign(T.mark(best.ts, best.tf, T.mod(base)), iv === 12 ? { label:'8' } : {})], labels:'iv' });
      } };
    },
  };

  function next() {
    clearTimeout(timer);
    if (round >= QZ.rounds) return finish();
    locked = false; fbk.textContent = ''; fbk.className = 'feedback';
    el.querySelector('[data-count]').textContent = `${round + 1}/${QZ.rounds} · ${score} acertos`;
    cur = GEN[q.id]();
  }

  function answer(ok, click) {
    if (locked) return;
    locked = true; round++;
    if (ok) score++;
    let right = '';
    if (q.id === 'qual-nota') right = T.noteName(cur.answer, false, latin());
    else if (q.id === 'intervalo' || q.id === 'ouvido') right = cur.answer === 12 ? 'Oitava' : T.IV_NAME[cur.answer];
    else if (q.id === 'triade') right = cur.extra;
    fbk.textContent = ok ? (q.id === 'triade' ? `Certo: ${cur.extra}.` : 'Certo!') : (right ? `Era ${right}.` : 'Não é aqui. Veja as posições certas.');
    fbk.className = 'feedback ' + (ok ? 'ok' : 'bad');
    cur.reveal(click);
    if (click) A.play(T.pitch(click.s, click.f), null, { dur: 0.8 });
    el.querySelector('[data-count]').textContent = `${round}/${QZ.rounds} · ${score} acertos`;
    timer = setTimeout(next, ok ? 900 : 1900);
  }

  function finish() {
    const pct = Math.round(score / QZ.rounds * 100), secs = Math.round((performance.now() - t0) / 1000);
    const prev = S.get().quiz[q.id];
    const isBest = !prev || pct > prev.best || (pct === prev.best && secs < prev.time);
    if (isBest) S.update(s => { s.quiz[q.id] = { best: pct, time: secs, date: S.today() }; });
    S.practiced();
    promptEl.innerHTML = '';
    ansEl.innerHTML = `<div class="result"><b>${pct}%</b><span>${score} de ${QZ.rounds} em ${secs}s${isBest ? ' · novo recorde' : ` · recorde ${prev.best}%`}</span>
      <div class="ctrl-row center"><button type="button" class="btn primary" data-act="again">Jogar de novo</button><a class="btn" href="#quiz">Outros quizzes</a></div></div>`;
    fbk.textContent = pct >= 90 ? 'Excelente. Tente ficar mais rápido.' : pct >= 60 ? 'Bom. Repita até passar de 90%.' : 'Reveja a aula correspondente e tente de novo.';
    fbk.className = 'feedback';
  }

  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="scope"] .chip');
    if (chip) { QZ.scope = chip.dataset.v; chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip)); round = 0; score = 0; t0 = performance.now(); next(); return; }
    const a = e.target.closest('[data-a]');
    if (a && cur && !cur.custom) { answer(String(cur.answer) === a.dataset.a); a.classList.add(String(cur.answer) === a.dataset.a ? 'ok' : 'bad'); return; }
    if (e.target.closest('[data-act="again"]')) { round = 0; score = 0; t0 = performance.now(); next(); }
  });
  next();
  return () => { clearTimeout(timer); A.stopAll(); };
}
