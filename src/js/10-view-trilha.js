/* ===== Trilha (por níveis) e aula ===== */
const V = {};
const MODS = () => MODULES.slice().sort((a, b) => (a.level || 9) - (b.level || 9) || (a.order || 0) - (b.order || 0));
const ALL_LESSONS = () => MODS().flatMap(m => m.lessons.map((l, li) => Object.assign({ mod: m, idx: li }, l)));
const levelOf = n => LEVELS.find(l => l.n === n);

function linkHref(l) {
  const map = { quiz:'#quiz-', treino:'#treino-', jam:'#jam-', licks:'#lick-', levadas:'#levadas-', aula:'#aula-' };
  if (map[l.to]) return l.id ? map[l.to] + l.id : '#' + (l.to === 'licks' ? 'licks' : l.to === 'levadas' ? 'levadas' : l.to);
  if (l.to === 'metronomo') return '#treino';
  return '#' + l.to;
}

function levelStats(n, st) {
  const ls = ALL_LESSONS().filter(l => l.mod.level === n);
  const lv = levelOf(n);
  const done = ls.filter(l => st.done[l.id]).length, goals = lv.goals.filter(g => (st.goals || {})[g.id]).length;
  return { ls, done, goals, total: ls.length + lv.goals.length, pct: (done + goals) / Math.max(1, ls.length + lv.goals.length) };
}

V.trilha = (el) => {
  const st = S.get(), all = ALL_LESSONS();
  const doneN = all.filter(l => st.done[l.id]).length;
  const next = all.find(l => !st.done[l.id]);
  const curLv = LEVELS.find(lv => levelStats(lv.n, st).pct < 1) || LEVELS[LEVELS.length - 1];
  el.innerHTML = `
    <section class="hero-strip">
      <div>
        <p class="eyebrow">Sua trilha · nível ${curLv.n} de ${LEVELS.length}</p>
        <h1>Do zero ao palco</h1>
        <p class="lede">${all.length} aulas em ${LEVELS.length} níveis. Cada nível termina com uma prova prática: quando você marcar tudo, está pronto para o próximo.</p>
      </div>
      <div class="stat-row">
        <div class="stat"><b>${doneN}<small>/${all.length}</small></b><span>aulas concluídas</span></div>
        <div class="stat"><b>${S.streak()}</b><span>${S.streak() === 1 ? 'dia seguido' : 'dias seguidos'}</span></div>
        ${next ? `<a class="btn primary big" href="#aula-${next.id}">${doneN ? 'Continuar' : 'Começar'}: ${U.esc(next.title)} →</a>` : `<span class="pill ok">Trilha completa</span>`}
      </div>
    </section>
    <nav class="level-nav" aria-label="Níveis">${LEVELS.map(lv => { const s = levelStats(lv.n, st);
      return `<a href="#nivel-${lv.n}" class="${lv.n === curLv.n ? 'on' : ''}"><b>${lv.n}</b><span>${lv.title}</span><i style="--p:${Math.round(s.pct * 100)}%"></i></a>`; }).join('')}</nav>
    ${LEVELS.map(lv => {
      const s = levelStats(lv.n, st);
      const mods = MODS().filter(m => m.level === lv.n);
      return `<section class="level" id="nivel-${lv.n}">
        <header class="level-head"><div><p class="eyebrow">Nível ${lv.n}</p><h2>${lv.title}</h2><p class="small">${lv.sub}</p></div>
          <span class="pill ${s.pct >= 1 ? 'ok' : ''}">${Math.round(s.pct * 100)}%</span></header>
        <div class="modules">${mods.map(m => {
          const d = m.lessons.filter(l => st.done[l.id]).length;
          return `<section class="module">
            <header><span class="mod-n">${m.tag}</span><span class="tag">${d}/${m.lessons.length}</span></header>
            <h3>${m.title}</h3>
            <div class="bar"><i style="width:${d / m.lessons.length * 100}%"></i></div>
            <ol class="lessons">${m.lessons.map((l, li) => `<li><a href="#aula-${l.id}" class="${st.done[l.id] ? 'done' : ''}">
              <span class="ln">${li + 1}</span><span class="lt">${l.title}</span><span class="lm">${l.min} min</span><span class="ck"></span></a></li>`).join('')}</ol>
          </section>`; }).join('')}</div>
        <div class="goals panel"><p class="eyebrow">Prova do nível ${lv.n}</p>
          <ul>${lv.goals.map(g => `<li><label class="check"><input type="checkbox" data-goal="${g.id}" id="goal-${g.id}" ${(st.goals || {})[g.id] ? 'checked' : ''}> <span>${g.text}</span></label>${g.href ? ` <a href="${g.href}">treinar →</a>` : ''}</li>`).join('')}</ul>
          <p class="small">Marque só quando conseguir de verdade, sem errar.</p></div>
      </section>`; }).join('')}`;
  el.addEventListener('change', e => {
    const g = e.target.dataset.goal; if (!g) return;
    S.update(s => { s.goals = s.goals || {}; if (e.target.checked) s.goals[g] = S.today(); else delete s.goals[g]; });
    if (e.target.checked) { S.practiced(); U.toast('Meta cumprida!'); }
  });
  el.addEventListener('click', e => {
    const a = e.target.closest('.level-nav a'); if (!a) return;
    e.preventDefault(); el.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

V.lesson = (el, id) => {
  const all = ALL_LESSONS();
  const idx = all.findIndex(l => l.id === id);
  if (idx < 0) { location.hash = '#trilha'; return; }
  const L = all[idx], prev = all[idx - 1], next = all[idx + 1];
  const demo0 = L.demo || { kind: 'none' };
  const widget = W[demo0.kind];
  const lv = levelOf(L.mod.level) || { n: '', title: '' };
  let view = 0, root = demo0.root != null ? T.pcOf(demo0.root) : null;
  let labelsMode = demo0.labels || (['natural', 'note'].includes(demo0.kind) ? 'note' : 'iv');

  el.innerHTML = `
    <nav class="crumbs"><a href="#trilha">Trilha</a><span>›</span><a href="#trilha">Nível ${lv.n} · ${lv.title}</a><span>›</span><span>${L.mod.title}</span></nav>
    <article class="lesson">
      <header class="lesson-head">
        <p class="eyebrow">Aula ${L.idx + 1} de ${L.mod.lessons.length} · ${L.min} min</p>
        <h1>${L.title}</h1>
      </header>
      <div class="prose">${L.body}</div>
    </article>
    ${widget ? (demo0.kind === 'none' ? '' : `<section class="panel demo" data-widget></section>`) : `<section class="panel demo">
      <div class="ctrl-row" data-demo-ctrl></div>
      <div data-fb></div>
      <p class="caption" data-caption></p>
      <div data-legend></div>
    </section>`}
    ${L.lick && demo0.kind !== 'lick' ? `<section class="panel"><p class="eyebrow">Lick da aula</p><div data-lick></div></section>` : ''}
    ${demo0.kind === 'lick' ? `<section class="panel"><div data-lick></div></section>` : ''}
    <section class="practice">
      <h2>Pratique</h2>
      <ul class="tasks">${(L.tasks || []).map(t => `<li>${t}</li>`).join('')}</ul>
      ${L.links ? `<div class="links">${L.links.map(l => `<a class="btn" href="${linkHref(l)}">${l.label} →</a>`).join('')}</div>` : ''}
    </section>
    <footer class="lesson-foot">
      ${prev ? `<a class="btn ghost" href="#aula-${prev.id}">← ${U.esc(prev.title)}</a>` : '<span></span>'}
      <button type="button" class="btn ${S.get().done[L.id] ? 'ok' : 'primary'}" data-act="done">${S.get().done[L.id] ? '✓ Concluída' : 'Marcar como concluída'}</button>
      ${next ? `<a class="btn ghost" href="#aula-${next.id}">${U.esc(next.title)} →</a>` : '<span></span>'}
    </footer>`;

  const cleanups = [];
  let fb = null, lp = null;
  if (widget) {
    const host = el.querySelector('[data-widget]');
    if (host) { const c = widget(host, demo0); if (typeof c === 'function') cleanups.push(c); }
  } else {
    fb = FB.create(el.querySelector('[data-fb]'));
  }
  const lickHost = el.querySelector('[data-lick]');

  function cfg() {
    const v = (demo0.views || [])[view] || {};
    const c = Object.assign({}, demo0, v);
    if (root != null && demo0.keySel) c.root = root;
    if (v.labels) labelsMode = v.labels;
    return c;
  }

  function draw() {
    if (!fb) return;
    const c = cfg();
    const d = U.buildDemo(c);
    const ctrl = el.querySelector('[data-demo-ctrl]');
    const views = demo0.views ? U.chips('view', demo0.views.map((v, i) => ({ v: i, label: v.label })), view) : '';
    const keySel = demo0.keySel ? `<label class="field">Tom <select data-root id="lesson-root">${U.rootOptions(T.pcOf(c.root))}</select></label>` : '';
    const lab = demo0.kind !== 'natural' && demo0.kind !== 'lick' ? U.chips('labels', [{ v: 'iv', label: 'Intervalos' }, { v: 'note', label: 'Notas' }], labelsMode) : '';
    ctrl.innerHTML = `${views}<div class="ctrl-right">${keySel}${lab}${demo0.kind !== 'lick' ? '<button type="button" class="btn" data-act="hear">♪ Ouvir</button>' : ''}</div>`;
    fb.set(U.fbState({ marks: d.marks, labels: demo0.kind === 'natural' ? 'note' : labelsMode, flats: d.flats, frets: d.frets,
      onPick: (s, f) => { A.play(T.pitch(s, f), null, { dur: 1.2, string: s }); fb.setActive([s + ':' + f]); } }));
    el.querySelector('[data-caption]').textContent = d.caption;
    el.querySelector('[data-legend]').innerHTML = U.legend(demo0.kind);
    draw.demo = d;
  }
  draw();

  if (lickHost) {
    const lk = lickById(L.lick || demo0.lick);
    if (!fb) {
      const fbHost = document.createElement('div');
      lickHost.before(fbHost);
      fb = FB.create(fbHost);
      const d = U.buildDemo({ kind: 'lick', lick: lk.id });
      fb.set(U.fbState({ marks: d.marks, labels: 'iv', flats: d.flats, frets: d.frets }));
    }
    lp = U.lickPanel(lickHost, lk, fb, {
      idSuffix: '-aula',
      onPlay() {
        if (demo0.kind !== 'lick' && !widget) {
          const d = U.buildDemo({ kind: 'lick', lick: lk.id });
          fb.set({ marks: d.marks, labels: labelsMode, flats: d.flats, frets: d.frets });
        }
      },
    });
  }

  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="view"] .chip, [data-chips="labels"] .chip');
    if (chip && fb && !widget) {
      const g = chip.parentElement.dataset.chips;
      if (g === 'view') view = +chip.dataset.v;
      if (g === 'labels') labelsMode = chip.dataset.v;
      draw(); return;
    }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'hear' && draw.demo) U.playDemo(draw.demo);
    if (act === 'done') {
      const was = !!S.get().done[L.id];
      S.update(s => { if (was) delete s.done[L.id]; else s.done[L.id] = S.today(); });
      S.practiced();
      const b = e.target.closest('[data-act]');
      b.className = 'btn ' + (was ? 'primary' : 'ok');
      b.textContent = was ? 'Marcar como concluída' : '✓ Concluída';
      if (!was) U.toast(next ? `Aula concluída. Próxima: ${next.title}` : 'Trilha completa!');
    }
  });
  el.addEventListener('change', e => {
    if (e.target.matches('[data-root]')) { root = +e.target.value; draw(); }
  });
  return () => { cleanups.forEach(c => c()); lp && lp.stop(); A.stopAll(); };
};
