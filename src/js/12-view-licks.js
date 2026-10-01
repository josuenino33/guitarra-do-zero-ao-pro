/* ===== Biblioteca de licks ===== */
let LICK_FILTER = 'all';
UIP.track('lickFilter', () => LICK_FILTER, v => { if (typeof v === 'string') LICK_FILTER = v; });

V.licks = (el, id, opt = {}) => {
  if (opt.estudos) LICK_FILTER = 'estudo';
  else if (!id && LICK_FILTER === 'estudo') LICK_FILTER = 'all';
  let cur = lickById(id) || (opt.estudos ? LICKS.find(l => l.style === 'estudo') : LICKS[0]);
  if (!lickById(id) && id) location.replace('#licks');
  if (id && LICK_FILTER !== 'all' && cur.style !== LICK_FILTER) LICK_FILTER = 'all';
  el.innerHTML = `
    <header class="page-head"><p class="eyebrow">Licks e solos</p><h1>Frases para tocar, ouvir e roubar</h1>
      <p class="lede">Cada frase tem tablatura, som e as notas no braço. Toque devagar primeiro: a velocidade fica no seletor.</p></header>
    ${licksTabs(LICK_FILTER === 'estudo' ? 'estudos' : 'licks')}
    <div class="licks-layout">
      <aside class="lick-list">
        <div data-filter></div>
        <ul data-list></ul>
      </aside>
      <section class="panel lick-main">
        <div data-fb></div>
        <div data-legend></div>
        <div data-panel></div>
      </section>
    </div>`;
  const fb = FB.create(el.querySelector('[data-fb]'));
  let panel = null;

  function list() {
    el.querySelector('[data-filter]').innerHTML = U.chips('style', [{ v:'all', label:'Todos' }].concat(Object.entries(STYLES).map(([v, label]) => ({ v, label }))), LICK_FILTER);
    const items = allLicks().filter(l => LICK_FILTER === 'all' || l.style === LICK_FILTER);
    const best = S.get().bpm;
    el.querySelector('[data-list]').innerHTML = items.map(l => `<li><a href="#lick-${l.id}" class="${l.id === cur.id ? 'on' : ''}">
      <span class="lt">${U.esc(l.title)}</span><span class="lm">${STYLES[l.style]} · ${'●'.repeat(l.level)}${best[l.id] ? ` · recorde ${best[l.id]} BPM` : ''}</span></a></li>`).join('');
  }

  function show() {
    panel && panel.stop();
    const d = U.buildDemo({ kind:'lick', lick: cur.id });
    fb.set(U.fbState({ marks: d.marks, labels: 'iv', flats: d.flats, frets: d.frets, spell: d.spell,
      onPick: (s, f) => { A.play(T.pitch(s, f), null, { dur: 1.2, string: s }); fb.setActive([s + ':' + f]); } }));
    el.querySelector('[data-legend]').innerHTML = U.legend('lick');
    const host = el.querySelector('[data-panel]');
    panel = U.lickPanel(host, cur, fb);
    const extra = document.createElement('div');
    extra.className = 'ctrl-row';
    extra.innerHTML = `<a class="btn" href="#treino-${cur.id}">Treinar com velocidade progressiva →</a>${cur.style === 'meus' ? `<a class="btn ghost" href="#editor-${cur.id}">Editar</a>` : ''}`;
    host.appendChild(extra);
  }
  list(); show();

  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="style"] .chip');
    if (chip) { LICK_FILTER = chip.dataset.v; list(); }
  });
  return () => { panel && panel.stop(); };
};
