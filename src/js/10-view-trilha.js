/* ===== Trilha e aula ===== */
const V = {};
const ALL_LESSONS = () => MODULES.flatMap((m, mi) => m.lessons.map((l, li) => Object.assign({ mod: m, num: `${mi + 1}.${li + 1}` }, l)));

function linkHref(l) {
  if (l.to === 'quiz') return '#quiz-' + l.id;
  if (l.to === 'treino') return '#treino-' + l.id;
  if (l.to === 'jam') return '#jam-' + l.id;
  if (l.to === 'licks') return '#lick-' + l.id;
  return '#' + l.to;
}

V.trilha = (el) => {
  const st = S.get(), all = ALL_LESSONS();
  const doneN = all.filter(l => st.done[l.id]).length;
  const next = all.find(l => !st.done[l.id]);
  el.innerHTML = `
    <section class="hero-strip">
      <div>
        <p class="eyebrow">Sua trilha</p>
        <h1>Do mapa do braço ao primeiro solo</h1>
        <p class="lede">${all.length} aulas em ${MODULES.length} módulos. Cada aula tem o braço interativo, som, e um exercício para fazer com a guitarra na mão.</p>
      </div>
      <div class="stat-row">
        <div class="stat"><b>${doneN}<small>/${all.length}</small></b><span>aulas concluídas</span></div>
        <div class="stat"><b>${S.streak()}</b><span>${S.streak() === 1 ? 'dia seguido' : 'dias seguidos'}</span></div>
        ${next ? `<a class="btn primary big" href="#aula-${next.id}">${doneN ? 'Continuar' : 'Começar'}: ${U.esc(next.title)} →</a>` : `<span class="pill ok">Trilha completa</span>`}
      </div>
    </section>
    <div class="modules">
      ${MODULES.map((m, mi) => {
        const d = m.lessons.filter(l => st.done[l.id]).length;
        return `<section class="module">
          <header><span class="mod-n">Módulo ${mi + 1}</span><span class="tag">${m.tag}</span></header>
          <h2>${m.title}</h2>
          <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${m.lessons.length}" aria-valuenow="${d}"><i style="width:${d / m.lessons.length * 100}%"></i></div>
          <ol class="lessons">
            ${m.lessons.map((l, li) => `<li><a href="#aula-${l.id}" class="${st.done[l.id] ? 'done' : ''}">
              <span class="ln">${mi + 1}.${li + 1}</span><span class="lt">${l.title}</span><span class="lm">${l.min} min</span><span class="ck" aria-label="${st.done[l.id] ? 'concluída' : 'pendente'}"></span></a></li>`).join('')}
          </ol>
        </section>`;
      }).join('')}
    </div>`;
};

V.lesson = (el, id) => {
  const all = ALL_LESSONS();
  const idx = all.findIndex(l => l.id === id);
  if (idx < 0) { location.hash = '#trilha'; return; }
  const L = all[idx], prev = all[idx - 1], next = all[idx + 1];
  const demo0 = L.demo;
  let view = 0, root = demo0.root != null ? T.pcOf(demo0.root) : null;
  let labelsMode = demo0.labels || (['natural', 'note'].includes(demo0.kind) ? 'note' : 'iv');

  el.innerHTML = `
    <nav class="crumbs"><a href="#trilha">Trilha</a><span>›</span><span>Módulo ${MODULES.indexOf(L.mod) + 1} · ${L.mod.title}</span></nav>
    <article class="lesson">
      <header class="lesson-head">
        <p class="eyebrow">Aula ${L.num} · ${L.min} min</p>
        <h1>${L.title}</h1>
      </header>
      <div class="prose">${L.body}</div>
    </article>
    <section class="panel demo">
      <div class="ctrl-row" data-demo-ctrl></div>
      <div data-fb></div>
      <p class="caption" data-caption></p>
      <div data-legend></div>
    </section>
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

  const fb = FB.create(el.querySelector('[data-fb]'));
  let lp = null;
  const lickHost = el.querySelector('[data-lick]');

  function cfg() {
    const v = (demo0.views || [])[view] || {};
    const c = Object.assign({}, demo0, v);
    if (root != null && demo0.keySel) c.root = root;
    if (v.labels) labelsMode = v.labels;
    return c;
  }

  function draw() {
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
    lp = U.lickPanel(lickHost, lk, fb, {
      idSuffix: '-aula',
      onPlay() {
        if (demo0.kind !== 'lick') {
          const d = U.buildDemo({ kind: 'lick', lick: lk.id });
          fb.set({ marks: d.marks, labels: labelsMode, flats: d.flats, frets: d.frets });
        }
      },
    });
  }

  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips] .chip');
    if (chip) {
      const g = chip.parentElement.dataset.chips;
      if (g === 'view') view = +chip.dataset.v;
      if (g === 'labels') labelsMode = chip.dataset.v;
      draw(); return;
    }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'hear') U.playDemo(draw.demo);
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
  return () => { lp && lp.stop(); A.stopAll(); };
};
