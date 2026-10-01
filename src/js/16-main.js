/* ===== Progresso, configurações e roteamento ===== */
V.progresso = (el) => {
  const st = S.get(), all = ALL_LESSONS();
  const doneN = all.filter(l => st.done[l.id]).length;
  const days = new Set(st.days);
  const cells = [];
  const d = new Date(); d.setDate(d.getDate() - 83);
  for (let i = 0; i < 84; i++) {
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    cells.push(`<i class="${days.has(k) ? 'on' : ''}" title="${d.toLocaleDateString('pt-BR')}"></i>`);
    d.setDate(d.getDate() + 1);
  }
  const recs = LICKS.filter(l => st.bpm[l.id]);
  el.innerHTML = `
    <header class="page-head"><p class="eyebrow">Progresso</p><h1>Seu caderno de estudo</h1>
      <p class="lede" data-syncline></p></header>
    <div class="stat-row wide">
      <div class="stat"><b>${doneN}<small>/${all.length}</small></b><span>aulas concluídas</span></div>
      <div class="stat"><b>${S.streak()}</b><span>dias seguidos</span></div>
      <div class="stat"><b>${st.days.length}</b><span>dias de prática</span></div>
      <div class="stat"><b>${recs.length}</b><span>recordes de BPM</span></div>
    </div>
    <div class="info-grid">
      <section class="panel"><p class="eyebrow">Últimas 12 semanas</p><div class="heat">${cells.join('')}</div>
        <p class="small">Um dia conta quando você toca um lick, faz um quiz, usa o treino ou conclui uma aula.</p></section>
      <section class="panel"><p class="eyebrow">Módulos</p>
        <ul class="mod-prog">${MODULES.map(m => { const n = m.lessons.filter(l => st.done[l.id]).length;
          return `<li><span>${m.title}</span><div class="bar"><i style="width:${n / m.lessons.length * 100}%"></i></div><em>${n}/${m.lessons.length}</em></li>`; }).join('')}</ul></section>
      <section class="panel"><p class="eyebrow">Recordes de velocidade</p>
        ${recs.length ? `<table class="tbl"><thead><tr><th>Exercício</th><th>Recorde</th><th>Original</th></tr></thead><tbody>${recs.map(l => `<tr><td><a href="#treino-${l.id}">${U.esc(l.title)}</a></td><td><b>${st.bpm[l.id]}</b> BPM</td><td>${l.bpm} BPM</td></tr>`).join('')}</tbody></table>`
          : '<p class="small">Nenhum recorde ainda. No <a href="#treino-ex-pent">treino de velocidade</a>, toque limpo e clique em “Consegui limpo”.</p>'}</section>
      <section class="panel"><p class="eyebrow">Quizzes</p>
        <table class="tbl"><tbody>${QUIZZES.map(z => `<tr><td><a href="#quiz-${z.id}">${z.title}</a></td><td>${st.quiz[z.id] ? `<b>${st.quiz[z.id].best}%</b> · ${st.quiz[z.id].time}s` : '—'}</td></tr>`).join('')}</tbody></table></section>
    </div>
    ${S.standalone ? `<section class="panel backup"><p class="eyebrow">Backup</p>
      <p class="small">Neste modo o progresso fica salvo só neste aparelho. Para levar para outro (do PC para o celular, por exemplo), exporte aqui e importe lá.</p>
      <div class="ctrl-row"><button type="button" class="btn" data-act="export">Exportar progresso</button>
        <label class="btn" for="import-file">Importar backup</label><input type="file" id="import-file" accept="application/json,.json" hidden></div></section>` : ''}
    <section class="danger"><button type="button" class="btn ghost" data-act="reset">Apagar meu progresso</button></section>`;
  const sync = () => { el.querySelector('[data-syncline]').textContent = S.mode === 'conta'
    ? 'Seu progresso fica salvo na sua conta e aparece igual no computador e no celular.'
    : S.standalone ? 'Seu progresso fica salvo neste aparelho. Use o backup abaixo para levar para outro.'
    : 'Seu progresso está salvo neste navegador. Abra pelo link do Claude com sua conta para levar para outros aparelhos.'; };
  sync();
  const off = S.on(sync);
  let armed = false;
  el.addEventListener('change', e => {
    if (e.target.id !== 'import-file' || !e.target.files[0]) return;
    e.target.files[0].text().then(txt => { S.importData(JSON.parse(txt)); U.toast('Backup importado'); APP.rerender(); })
      .catch(() => U.toast('Não consegui ler esse arquivo. Use um backup exportado por este app.'));
  });
  el.addEventListener('click', e => {
    if (e.target.closest('[data-act="export"]')) {
      const blob = new Blob([S.exportData()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `mapa-do-braco-backup-${S.today()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      return;
    }
    const b = e.target.closest('[data-act="reset"]'); if (!b) return;
    if (!armed) { armed = true; b.textContent = 'Clique de novo para apagar tudo'; b.classList.add('warn'); setTimeout(() => { armed = false; b.textContent = 'Apagar meu progresso'; b.classList.remove('warn'); }, 4000); return; }
    S.reset(); U.toast('Progresso apagado'); APP.rerender();
  });
  return off;
};

const APP = (() => {
  let cleanup = null;
  const host = () => document.getElementById('view');

  function route() {
    const h = (location.hash || '#hoje').slice(1);
    const pre = (p) => h.startsWith(p) ? h.slice(p.length) : null;
    if (pre('aula-') != null) return ['trilha', el => V.lesson(el, pre('aula-'))];
    if (h === 'licks' || pre('lick-') != null) return ['licks', el => V.licks(el, pre('lick-'))];
    if (h === 'editor' || pre('editor-') != null) return ['licks', el => V.editor(el, pre('editor-'))];
    if (h === 'treino') return ['treino', el => V.metronomo(el)];
    if (h === 'levadas' || pre('levadas-') != null) return ['treino', el => V.levadas(el, pre('levadas-'))];
    if (h === 'trocas') return ['treino', el => V.trocas(el)];
    if (h === 'afinador') return ['treino', el => V.afinador(el)];
    if (h === 'gravar') return ['treino', el => V.gravar(el)];
    if (h === 'hoje' || h === '') return ['hoje', el => V.hoje(el)];
    if (pre('treino-') != null) return ['treino', el => V.speed(el, pre('treino-'))];
    if (h === 'jam' || pre('jam-') != null) return ['treino', el => V.jam(el, pre('jam-'))];
    if (h === 'quiz' || pre('quiz-') != null) return ['quiz', el => V.quiz(el, pre('quiz-'))];
    if (h === 'braco') return ['braco', el => V.braco(el)];
    if (h === 'progresso') return ['progresso', el => V.progresso(el)];
    return ['trilha', el => V.trilha(el)];
  }

  let lastHash = null;
  function render() {
    if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
    const [nav, fn] = route();
    const el = document.createElement('div');
    el.className = 'view';
    host().replaceChildren(el);
    try { const r = fn(el); cleanup = typeof r === 'function' ? r : null; }
    catch (e) { console.error(e); el.innerHTML = `<div class="panel"><p>Algo deu errado ao abrir esta tela. <a href="#trilha">Voltar para a trilha</a>.</p></div>`; }
    document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.nav === nav));
    const h = location.hash;
    const sameBase = lastHash && lastHash.startsWith('#lick-') && h.startsWith('#lick-');
    if (sameBase && window.innerWidth < 900) el.querySelector('.lick-main')?.scrollIntoView({ block: 'start' });
    else if (!sameBase) window.scrollTo(0, 0);
    lastHash = h;
  }

  function settingsSheet() {
    const st = S.get().settings;
    const sh = document.getElementById('settings');
    sh.querySelector('[data-body]').innerHTML = `
      <div class="set-row"><span>Nomes das notas</span>${U.chips('latin', [{ v:'0', label:'C D E' }, { v:'1', label:'Dó Ré Mi' }], st.latin ? '1' : '0')}</div>
      <div class="set-row"><span>Mão</span>${U.chips('lefty', [{ v:'0', label:'Destro' }, { v:'1', label:'Canhoto' }], st.lefty ? '1' : '0')}</div>
      <div class="set-row"><span>Casas visíveis</span>${U.chips('frets', [{ v:'12', label:'12' }, { v:'15', label:'15' }, { v:'22', label:'22' }], String(st.frets))}</div>
      <div class="set-row"><span>Timbre</span>${U.chips('tone', [{ v:'clean', label:'Limpo' }, { v:'drive', label:'Drive' }], st.tone)}</div>
      <div class="set-row"><label for="set-vol">Volume</label><input type="range" id="set-vol" min="0" max="1" step="0.05" value="${st.volume}"></div>
      <p class="small">Toque qualquer casa do braço para ouvir a nota.</p>`;
  }

  function init() {
    const st = S.get().settings;
    A.setTone(st.tone); A.setVolume(st.volume);
    window.addEventListener('hashchange', render);
    const sh = document.getElementById('settings');
    const open = () => { settingsSheet(); sh.hidden = false; sh.querySelector('.chip')?.focus(); };
    const close = () => { sh.hidden = true; };
    document.getElementById('btn-settings').addEventListener('click', () => sh.hidden ? open() : close());
    sh.addEventListener('click', e => {
      if (e.target === sh || e.target.closest('[data-close]')) return close();
      const chip = e.target.closest('[data-chips] .chip'); if (!chip) return;
      const k = chip.parentElement.dataset.chips, v = chip.dataset.v;
      S.update(s => {
        if (k === 'latin' || k === 'lefty') s.settings[k] = v === '1';
        else if (k === 'frets') s.settings.frets = +v;
        else s.settings[k] = v;
      });
      if (k === 'tone') { A.setTone(v); A.play(52, null, { dur: 1 }); A.play(59, A.now() + 0.02, { dur: 1 }); A.play(64, A.now() + 0.04, { dur: 1 }); }
      settingsSheet();
      if (k !== 'tone') render();
    });
    sh.addEventListener('input', e => { if (e.target.id === 'set-vol') { A.setVolume(+e.target.value); S.update(s => { s.settings.volume = +e.target.value; }); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sh.hidden) close(); });

    const syncEl = document.getElementById('sync');
    let lastMode = S.mode;
    const paint = () => {
      syncEl.textContent = S.mode === 'conta' ? 'Salvo na conta' : S.standalone ? 'Salvo neste aparelho' : 'Salvo neste navegador';
      syncEl.className = 'sync ' + S.mode;
      if (S.mode !== lastMode) { lastMode = S.mode; const n = route()[0]; if (n === 'trilha' && !location.hash.startsWith('#aula-') || n === 'progresso') render(); }
    };
    S.on(paint); paint();
    render();
    S.connect();
  }

  return { init, rerender: render };
})();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', APP.init); else APP.init();
