/* ===== Hoje: plano do dia, cronômetro e semana ===== */
const HOJE_EXTRA = [];   // outras partes da tela (desafio do dia, XP) se registram aqui

V.hoje = (el) => {
  const st = S.get(), plan = PLAN.today(st), lv = levelOf(PLAN.currentLevel(st));
  const bl = PLAN.blocks(plan.mins, st);
  const doneMin = bl.filter(b => plan.done[b.id]).reduce((a, b) => a + b.min, 0);
  const dfmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const week = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); week.push({ d, k: dfmt(d), m: st.minutes[dfmt(d)] || 0 }); }
  const weekTotal = Math.round(week.reduce((a, w) => a + w.m, 0));
  const goal = st.settings.weekGoal || 150;
  const maxM = Math.max(goal / 5, ...week.map(w => w.m), 1);
  const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  el.innerHTML = `
    <header class="page-head"><p class="eyebrow">Hoje · nível ${lv.n} · ${lv.title}</p>
      <h1>${doneMin >= plan.mins ? 'Treino do dia completo' : 'Seu treino de hoje'}</h1>
      <p class="lede">Uma rotina montada para o seu nível. Comece um bloco: o cronômetro fica no topo da tela enquanto você abre o exercício.</p></header>
    <section class="panel">
      <div class="ctrl-row"><span class="small">Tempo disponível:</span>${U.chips('mins', [15, 30, 45, 60, 90].map(m => ({ v: m, label: m + ' min' })), plan.mins)}
        <button type="button" class="btn ghost" data-act="free">⏱ Prática livre</button></div>
      <ol class="plan">${bl.map((b, i) => `<li class="${plan.done[b.id] ? 'done' : ''}">
        <span class="pl-n">${i + 1}</span>
        <div class="pl-body"><b>${b.title}</b><span>${U.esc(b.desc)}</span></div>
        <span class="pl-min">${b.min} min</span>
        ${plan.done[b.id] ? '<span class="pill ok">Feito</span>' : `<button type="button" class="btn primary" data-start="${b.id}">▶ Começar</button>`}
      </li>`).join('')}</ol>
      <div class="bar wide"><i style="width:${Math.min(100, doneMin / plan.mins * 100)}%"></i></div>
      <p class="small">${doneMin} de ${plan.mins} minutos do plano de hoje.</p>
    </section>
    <div data-extra class="info-grid"></div>
    <section class="panel"><p class="eyebrow">Esta semana</p>
      <div class="week">${week.map(w => `<div class="wk ${w.k === S.today() ? 'today' : ''}"><i style="height:${Math.round(w.m / maxM * 100)}%"></i><b>${Math.round(w.m)}</b><span>${dias[w.d.getDay()]}</span></div>`).join('')}</div>
      <div class="ctrl-row"><span><b>${weekTotal}</b> de <b>${goal}</b> minutos na semana</span>
        <label class="field">Meta semanal <select data-goal id="week-goal">${[60, 90, 150, 210, 300, 420].map(g => `<option value="${g}" ${g === goal ? 'selected' : ''}>${g} min</option>`).join('')}</select></label></div>
      <p class="small">Dica de estudo: pouco todo dia rende mais que muito de vez em quando. 20 minutos diários com foco valem mais que 3 horas no domingo.</p>
    </section>`;
  HOJE_EXTRA.forEach(fn => { try { fn(el.querySelector('[data-extra]')); } catch (e) { console.error(e); } });
  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="mins"] .chip');
    if (chip) { PLAN.setMins(+chip.dataset.v); APP.rerender(); return; }
    const b = e.target.closest('[data-start]');
    if (b) { const blk = bl.find(x => x.id === b.dataset.start); PT.start({ id: blk.id, label: blk.title, minutes: blk.min }); S.practiced(); location.hash = blk.href; return; }
    if (e.target.closest('[data-act="free"]')) { PT.start({ free: true }); U.toast('Cronômetro livre ligado: ele fica no topo da tela'); }
  });
  el.addEventListener('change', e => { if (e.target.matches('[data-goal]')) { S.update(s => { s.settings.weekGoal = +e.target.value; }); APP.rerender(); } });
};
