/* ===== Treino: levadas, trocas de acordes e afinador ===== */
const PROGS = [
  { label:'G D Em C', c:['G','D','Em','C'] }, { label:'C G Am F', c:['C','G','Am','F'] }, { label:'Am F C G', c:['Am','F','C','G'] },
  { label:'D A Bm G', c:['D','A','Bm','G'] }, { label:'E A B7 E', c:['E','A','B7','E'] }, { label:'A7 D7 A7 E7', c:['A7','D7','A7','E7'] },
  { label:'Am7 D', c:['Am7','Am7','D','D'] }, { label:'Em', c:['Em'] },
];
let LEV = { id:'pop', prog:0 };
UIP.track('levadas', LEV);

V.levadas = (el, id) => {
  if (id && RH.PATTERNS.some(p => p.id === id)) LEV.id = id;
  if (!RH.PATTERNS.some(p => p.id === LEV.id)) LEV.id = 'pop';
  if (!PROGS[LEV.prog]) LEV.prog = 0;
  const groups = {};
  RH.PATTERNS.forEach(p => { (groups[p.style] ||= []).push(p); });
  el.innerHTML = treinoTabs('lev') + `
    <section class="panel">
      <div class="ctrl-row">${U.chips('lev', RH.PATTERNS.map(p => ({ v: p.id, label: p.name })), LEV.id)}</div>
      <div class="ctrl-row"><span class="small">Sequência:</span>${U.chips('prog', PROGS.map((p, i) => ({ v: i, label: p.label })), LEV.prog)}</div>
      <div data-strum></div>
    </section>
    <section class="panel"><p class="eyebrow">Como ler a grade</p>
      <p class="small"><b>↓</b> para baixo · <b>↑</b> para cima · <b>✕</b> abafado (chuck) · <b>B</b> e <b>b</b> nota grave do acorde · espaço vazio = a mão passa sem tocar. Embaixo de cada batida está a contagem. A mão direita nunca para: desce nos números e sobe nos “e”.</p></section>`;
  const panel = strumPanel(el.querySelector('[data-strum]'), { pattern: LEV.id, chords: PROGS[LEV.prog].c, editable: true, idSuffix: 'lev' });
  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips] .chip');
    if (!chip) return;
    const g = chip.parentElement.dataset.chips;
    if (g === 'lev') { LEV.id = chip.dataset.v; history.replaceState(null, '', '#levadas-' + LEV.id); panel.stop(); APP.rerender(); }
    if (g === 'prog') { LEV.prog = +chip.dataset.v; panel.stop(); APP.rerender(); }
  });
  return () => panel.stop();
};

V.trocas = (el) => {
  el.innerHTML = treinoTabs('troc') + `
    <section class="panel"><p class="lede">Escolha um par, aperte começar e troque de um acorde para o outro o máximo que conseguir em 1 minuto. Toque uma vez em cada acorde e marque cada troca.</p>
      <div data-w></div></section>`;
  return W.changes(el.querySelector('[data-w]'), {});
};

V.afinador = (el) => {
  el.innerHTML = treinoTabs('afin') + `<section class="panel"><div data-w></div></section>`;
  return W.tuner(el.querySelector('[data-w]'), { full: true });
};
