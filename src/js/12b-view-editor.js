/* ===== Meus licks: editor de tablatura ===== */
STYLES.meus = 'Meus licks';
const myLicks = () => (S.get().myLicks || []).filter(l => !l.deleted);
const allLicks = () => LICKS.concat(myLicks());

V.editor = (el, id) => {
  const orig = id ? myLicks().find(l => l.id === id) : null;
  const L = Object.assign({ id: 'u' + Date.now().toString(36), title: '', key: 'A', scale: 'pent_menor', bpm: 80, level: 2, tech: '', tip: '', src: '', style: 'meus' }, orig || {});
  let dur = 'e', tech = '', chord = false;
  const DURS = [['s', 'Semicolcheia'], ['t', 'Tercina'], ['e', 'Colcheia'], ['q', 'Semínima'], ['q.', 'Semínima pont.'], ['h', 'Mínima'], ['w', 'Semibreve']];
  const TECHS = [['', 'Normal'], ['h', 'Hammer-on'], ['p', 'Pull-off'], ['/', 'Slide'], ['b1', 'Bend ½'], ['b2', 'Bend 1 tom'], ['b2r', 'Bend e volta'], ['~', 'Vibrato'], ['m', 'Palm mute']];
  el.innerHTML = `
    <nav class="crumbs"><a href="#licks">Licks</a><span>›</span><span>${orig ? 'Editar lick' : 'Novo lick'}</span></nav>
    <header class="page-head"><h1>${orig ? 'Editar: ' + U.esc(orig.title) : 'Criar meu lick'}</h1>
      <p class="lede">Clique no braço para escrever nota por nota, ou digite direto na notação. Ouça, ajuste e salve.</p></header>
    <section class="panel">
      <div class="ctrl-row">
        <label class="field grow">Nome <input type="text" data-k="title" id="ed-title" value="${U.esc(L.title)}" placeholder="Ex.: Frase de abertura em Lá"></label>
        <label class="field">Tom <select data-k="key" id="ed-key">${T.ROOTS.map(r => `<option ${r === L.key ? 'selected' : ''}>${r}</option>`).join('')}</select></label>
        <label class="field">Escala <select data-k="scale" id="ed-scale">${Object.entries(T.SCALES).map(([k, s]) => `<option value="${k}" ${k === L.scale ? 'selected' : ''}>${s.name}</option>`).join('')}</select></label>
        <label class="field">BPM <input type="number" min="30" max="260" data-k="bpm" id="ed-bpm" value="${L.bpm}"></label>
        <label class="field">Nível <select data-k="level" id="ed-level">${[1, 2, 3, 4, 5].map(n => `<option ${n === L.level ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      </div>
      <div class="ctrl-row"><span class="small">Duração:</span>${U.chips('dur', DURS.map(([v, l]) => ({ v, label: l })), dur)}</div>
      <div class="ctrl-row"><span class="small">Técnica:</span>${U.chips('tech', TECHS.map(([v, l]) => ({ v, label: l })), tech)}
        <label class="check"><input type="checkbox" data-chord id="ed-chord"> Juntar com a nota anterior (acorde)</label></div>
      <div data-fb></div>
      <div class="ctrl-row">
        <button type="button" class="btn" data-act="rest">+ Pausa</button>
        <button type="button" class="btn" data-act="dead">+ Nota abafada</button>
        <button type="button" class="btn" data-act="undo">↶ Desfazer</button>
        <button type="button" class="btn ghost" data-act="clear">Limpar</button>
      </div>
      <label class="field block" for="ed-src">Notação</label>
      <textarea id="ed-src" data-src rows="3" spellcheck="false">${U.esc(L.src)}</textarea>
      <p class="small" data-err></p>
      <details class="syms"><summary>Como funciona a notação</summary>
        <p class="small"><b>|s |t |e |q |h |w</b> definem a duração das próximas notas (semicolcheia, tercina, colcheia, semínima, mínima, semibreve; <b>|q.</b> = pontuada). Cada nota é <b>corda:casa</b> (corda 1 = Mi agudo) mais a técnica: <b>h</b> hammer-on, <b>p</b> pull-off, <b>/</b> slide, <b>b2</b> bend de 1 tom, <b>b1</b> meio tom, <b>r</b> volta do bend, <b>~</b> vibrato, <b>m</b> palm mute. <b>3:x</b> = abafada, <b>+</b> junta notas, <b>-</b> = pausa. Exemplo: <code>|e 3:5 3:7h |q 2:8b2r -</code></p></details>
      <label class="field grow">Técnica principal <input type="text" data-k="tech" id="ed-tech" value="${U.esc(L.tech)}" placeholder="Ex.: Bend e vibrato"></label>
      <label class="field block" for="ed-tip">Dica para estudar</label>
      <textarea id="ed-tip" data-k="tip" rows="2">${U.esc(L.tip)}</textarea>
    </section>
    <section class="panel"><p class="eyebrow">Prévia</p><div data-preview></div></section>
    <footer class="lesson-foot">
      ${orig ? '<button type="button" class="btn ghost" data-act="del">Apagar lick</button>' : '<span></span>'}
      <button type="button" class="btn primary big" data-act="save">Salvar lick</button>
    </footer>`;
  const $ = s => el.querySelector(s);
  const src = $('[data-src]');
  const fb = FB.create($('[data-fb]'));
  let panel = null;

  function preview() {
    panel && panel.stop();
    const err = $('[data-err]');
    if (!src.value.trim()) { err.textContent = 'Clique no braço para adicionar a primeira nota.'; $('[data-preview]').innerHTML = '<p class="small">A prévia aparece aqui.</p>'; fb.set(U.fbState({ marks: [], onPick })); return; }
    try {
      const p = TAB.parse(src.value);
      err.textContent = `${p.events.length} notas · ${p.beats % 1 ? p.beats.toFixed(2) : p.beats} tempos${p.beats % 4 ? ' (o compasso ainda não fechou: faltam ' + +(4 - p.beats % 4).toFixed(2) + ' tempos)' : ''}`;
      const mx = Math.max(15, ...p.events.flatMap(e => e.notes.map(o => o.f || 0)).map(f => f + 1));
      fb.set(U.fbState({ marks: TAB.marks(p, T.pcOf(L.key)), labels: 'iv', frets: Math.min(22, mx), onPick }));
      panel = U.lickPanel($('[data-preview]'), Object.assign({}, L, { src: src.value, title: L.title || 'Sem nome', tip: L.tip || '', tech: L.tech || 'Meu lick' }), fb, { idSuffix: '-ed', keySel: false });
    } catch (e) { err.textContent = 'Erro na notação: ' + e.message.replace('Token inválido', 'não entendi'); }
  }
  function lastDur() { const m = [...src.value.matchAll(/\|([whqestx]\.?)/g)]; return m.length ? m[m.length - 1][1] : null; }
  function append(tok, isNote) {
    let v = src.value.trim();
    if (chord && isNote && v && /\d$|[hp\/~mrx]$/.test(v) && !v.endsWith('-')) { src.value = v + '+' + tok; preview(); return; }
    if (lastDur() !== dur) v += (v ? ' ' : '') + '|' + dur;
    src.value = (v ? v + ' ' : '') + tok;
    preview();
  }
  function onPick(s, f) {
    A.play(T.pitch(s, f), null, { dur: 0.8, string: s });
    append(`${6 - s}:${f}${tech}`, true);
  }
  preview();

  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips] .chip');
    if (chip) {
      const g = chip.parentElement.dataset.chips;
      if (g === 'dur') dur = chip.dataset.v; if (g === 'tech') tech = chip.dataset.v;
      chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip));
      return;
    }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'rest') append('-', false);
    if (act === 'dead') append('6:x', true);
    if (act === 'undo') { src.value = src.value.trim().replace(/\s*\S+$/, '').replace(/\s*\|[whqestx]\.?$/, ''); preview(); }
    if (act === 'clear') { src.value = ''; preview(); }
    if (act === 'save') {
      L.title = $('#ed-title').value.trim() || 'Meu lick';
      L.src = src.value.trim();
      try { TAB.parse(L.src); } catch (err) { U.toast('Corrija a notação antes de salvar'); return; }
      if (!L.src) { U.toast('Adicione pelo menos uma nota'); return; }
      L.updatedAt = Date.now();
      S.update(s => { s.myLicks = (s.myLicks || []).filter(x => x.id !== L.id).concat([Object.assign({}, L)]); });
      U.toast('Lick salvo'); location.hash = '#lick-' + L.id;
    }
    if (act === 'del') {
      const b = e.target.closest('[data-act]');
      if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = 'Clique de novo para apagar'; return; }
      S.update(s => { s.myLicks = (s.myLicks || []).filter(x => x.id !== L.id).concat([{ id: L.id, deleted: true, updatedAt: Date.now() }]); });
      U.toast('Lick apagado'); location.hash = '#licks';
    }
  });
  el.addEventListener('change', e => {
    if (e.target.matches('[data-chord]')) chord = e.target.checked;
    const k = e.target.dataset.k;
    if (k) { L[k] = ['bpm', 'level'].includes(k) ? +e.target.value : e.target.value; if (k !== 'title' && k !== 'tip') preview(); }
  });
  let tm = null;
  src.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(preview, 400); });
  return () => { panel && panel.stop(); };
};
