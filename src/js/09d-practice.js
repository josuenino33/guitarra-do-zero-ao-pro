/* ===== Plano de estudo e cronômetro de prática ===== */
const PLAN = (() => {
  // blocos por nível: pct = parte do tempo total
  const BLOCKS = {
    1: [
      { id:'aquec', title:'Aquecimento', desc:'Cordas soltas e 1-2-3-4 com palhetada alternada.', href:'#treino-ex-1234', pct:.15 },
      { id:'trocas', title:'Trocas de acordes', desc:'3 pares, 1 minuto cada. Anote os recordes.', href:'#trocas', pct:.25 },
      { id:'ritmo', title:'Ritmo', desc:'Levada pop com G–D–Em–C, sem parar a mão.', href:'#levadas-pop', pct:.25 },
      { id:'aula', title:'Aula da trilha', desc:'', href:'', pct:.2 },
      { id:'musica', title:'Música', desc:'“Estrada de Terra” do começo ao fim.', href:'#aula-primeira-musica', pct:.15 } ],
    2: [
      { id:'aquec', title:'Aquecimento', desc:'Aranha cromática com metrônomo.', href:'#treino-ex-aranha', pct:.15 },
      { id:'braco', title:'Notas no braço', desc:'Quiz “Ache a nota” até acertar 9 de 10.', href:'#quiz-ache-nota', pct:.15 },
      { id:'ritmo', title:'Ritmo', desc:'Uma levada de estilo nova por semana.', href:'#levadas', pct:.2 },
      { id:'tecnica', title:'Técnica', desc:'Riff de power chords com palm mute, subindo o BPM.', href:'#treino-r3', pct:.2 },
      { id:'aula', title:'Aula da trilha', desc:'', href:'', pct:.15 },
      { id:'jam', title:'Tocar junto', desc:'Base de rock: só acordes, no tempo.', href:'#jam-rock', pct:.15 } ],
    3: [
      { id:'aquec', title:'Aquecimento', desc:'Caixa 1 da pentatônica, subindo e descendo.', href:'#treino-ex-pent', pct:.1 },
      { id:'mapa', title:'Tríades e CAGED', desc:'Explorador do braço: um tom novo por dia.', href:'#braco', pct:.2 },
      { id:'tecnica', title:'Técnica', desc:'Licks com bend e vibrato, devagar e afinado.', href:'#treino-r2', pct:.2 },
      { id:'aula', title:'Aula da trilha', desc:'', href:'', pct:.2 },
      { id:'ouvido', title:'Ouvido', desc:'Treino de ouvido: continue do seu nível.', href:'#ouvido', pct:.1 },
      { id:'impro', title:'Improviso', desc:'Blues em Lá: pergunta e resposta.', href:'#jam-blues', pct:.2 } ],
    4: [
      { id:'aquec', title:'Aquecimento', desc:'Sequência em grupos de 3.', href:'#treino-ex-seq3', pct:.1 },
      { id:'tecnica', title:'Velocidade', desc:'3 notas por corda com treino progressivo.', href:'#treino-ex-3nps', pct:.25 },
      { id:'aula', title:'Teoria e harmonia', desc:'', href:'', pct:.2 },
      { id:'ouvido', title:'Ouvido', desc:'Treino de ouvido: graus da escala e progressões.', href:'#ouvido', pct:.15 },
      { id:'impro', title:'Improviso modal', desc:'Base dórica: destaque a 6ª maior.', href:'#jam-dorico', pct:.3 } ],
    5: [
      { id:'aquec', title:'Aquecimento', desc:'Legato e palhetada alternada.', href:'#treino-m4', pct:.1 },
      { id:'tecnica', title:'Técnica', desc:'O lick mais difícil do seu repertório, no treino progressivo.', href:'#treino-m3', pct:.2 },
      { id:'repert', title:'Repertório', desc:'Músicas do seu repertório, do começo ao fim.', href:'#repertorio', pct:.3 },
      { id:'impro', title:'Improviso com notas-alvo', desc:'Mire nas notas do acorde em cada troca.', href:'#jam-rock', pct:.25 },
      { id:'ouvido', title:'Ouvido', desc:'Treino de ouvido: ditado melódico e progressões.', href:'#ouvido', pct:.15 } ],
  };

  function currentLevel(st = S.get()) {
    const lv = LEVELS.find(l => levelStats(l.n, st).pct < 1);
    return lv ? lv.n : LEVELS.length;
  }
  function nextLesson(level, st = S.get()) {
    const all = ALL_LESSONS();
    return all.find(l => l.mod.level === level && !st.done[l.id]) || all.find(l => !st.done[l.id]);
  }

  /** Blocos do dia para o tempo escolhido. */
  function blocks(mins, st = S.get()) {
    const lv = currentLevel(st), nl = nextLesson(lv, st);
    return BLOCKS[lv].map(b => {
      const o = Object.assign({}, b, { min: Math.max(2, Math.round(mins * b.pct)) });
      if (b.id === 'aula') { o.href = nl ? '#aula-' + nl.id : '#trilha'; o.desc = nl ? nl.title : 'Revise uma aula de que você gostou.'; }
      return o;
    });
  }

  function today(st = S.get()) {
    const p = st.plan;
    return p && p.date === S.today() ? p : { date: S.today(), mins: (p && p.mins) || 30, done: {} };
  }
  function setMins(m) { S.update(s => { const p = today(s); s.plan = Object.assign({}, p, { mins: m }); }); }
  function markDone(id) { S.update(s => { const p = today(s); s.plan = Object.assign({}, p, { done: Object.assign({}, p.done, { [id]: true }) }); }); }

  return { blocks, today, setMins, markDone, currentLevel, BLOCKS };
})();

/* Cronômetro no topo da tela: segue contando enquanto você navega. */
const PT = (() => {
  let cur = null, tick = null;
  const el = () => document.getElementById('ptimer');
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function left() { return !cur ? 0 : cur.paused ? cur.left : Math.max(0, (cur.endAt - performance.now()) / 1000); }
  function elapsed() { return !cur ? 0 : cur.free ? (cur.paused ? cur.acc : cur.acc + (performance.now() - cur.since) / 1000) : cur.total - left(); }
  function paint() {
    const e = el(); if (!e) return;
    if (!cur) { e.hidden = true; e.innerHTML = ''; return; }
    e.hidden = false;
    const t = cur.free ? fmt(elapsed()) : fmt(left());
    e.innerHTML = `<span class="pt-label">${U.esc(cur.label)}</span><b>${t}</b>
      <button type="button" data-pt="pause" aria-label="${cur.paused ? 'Continuar' : 'Pausar'}">${cur.paused ? '▶' : '❚❚'}</button>
      <button type="button" data-pt="stop" aria-label="Encerrar">✕</button>`;
    e.classList.toggle('paused', !!cur.paused);
  }
  function chime() { A.init(); const t = A.now() + 0.05; [76, 79, 84].forEach((m, i) => A.play(m, t + i * 0.12, { dur: 1.2, vel: 0.5, bus: 'back' })); }
  function finish(completed) {
    if (!cur) return;
    const mins = elapsed() / 60;
    S.addMinutes(mins);
    if (completed && cur.blockId) PLAN.markDone(cur.blockId);
    if (completed) { chime(); U.toast(`Bloco “${cur.label}” concluído`); }
    else if (mins >= 0.5) U.toast(`${Math.round(mins)} min registrados`);
    clearInterval(tick); tick = null; cur = null; paint();
  }
  function start(o) {
    if (cur) finish(false);
    A.init();
    cur = o.free ? { free: true, label: o.label || 'Prática livre', acc: 0, since: performance.now() }
      : { blockId: o.id, label: o.label, total: o.minutes * 60, endAt: performance.now() + o.minutes * 60000 };
    clearInterval(tick);
    tick = setInterval(() => { if (!cur.free && left() <= 0) finish(true); else paint(); }, 500);
    paint();
  }
  function toggle() {
    if (!cur) return;
    if (cur.free) { if (cur.paused) { cur.since = performance.now(); cur.paused = false; } else { cur.acc += (performance.now() - cur.since) / 1000; cur.paused = true; } }
    else if (cur.paused) { cur.endAt = performance.now() + cur.left * 1000; cur.paused = false; }
    else { cur.left = left(); cur.paused = true; }
    paint();
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-pt]'); if (!b) return;
    if (b.dataset.pt === 'pause') toggle(); else finish(!cur?.free ? false : false);
  });
  window.addEventListener('pagehide', () => { if (cur) finish(false); });
  return { start, stop: () => finish(false), get active() { return cur; } };
})();
