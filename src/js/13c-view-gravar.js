/* ===== Treino: gravador e looper ===== */
const LOOPCFG = { bpm: 90, bars: 4 };

function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

V.gravar = (el) => {
  const micOk = S.standalone && navigator.mediaDevices;
  el.innerHTML = treinoTabs('grav') + (micOk ? '' : `<section class="panel warn-box"><p>${MIC.errorText()}</p></section>`) + `
    <section class="panel">
      <p class="eyebrow">Gravador</p>
      <p class="small">Grave você tocando e escute com atenção: tempo, notas abafadas, trocas. Ouvir a própria gravação é um dos estudos que mais fazem evoluir. As gravações ficam salvas neste aparelho.</p>
      <div class="ctrl-row">
        <button type="button" class="btn primary big" data-act="rec" ${micOk ? '' : 'disabled'}>● Gravar</button>
        <b class="rec-time" data-rtime>0:00</b>
        <label class="field grow">Nome <input type="text" data-rname id="rec-name" placeholder="Ex.: levada pop 80 BPM"></label>
      </div>
      <ul class="takes" data-takes><li class="small">Carregando gravações…</li></ul>
    </section>
    <section class="panel">
      <p class="eyebrow">Looper</p>
      <p class="small">Grave uma base de alguns compassos (acordes, por exemplo). Ela fica tocando em loop e você grava camadas por cima ou sola sobre ela. Use fone de ouvido para o microfone não regravar o loop.</p>
      <div class="ctrl-row">
        <label class="field">Andamento <input type="number" min="40" max="220" value="${LOOPCFG.bpm}" data-k="bpm" id="loop-bpm"> BPM</label>
        <span class="small">Compassos:</span>${U.chips('bars', [1, 2, 4, 8].map(b => ({ v: b, label: String(b) })), LOOPCFG.bars)}
        <label class="check"><input type="checkbox" data-k="click" id="loop-click" checked> Metrônomo</label>
      </div>
      <div class="loop-pos"><i data-lpos></i></div>
      <p class="tu-msg" data-lmsg aria-live="polite">Pronto para gravar.</p>
      <div class="ctrl-row">
        <button type="button" class="btn primary" data-act="lrec" ${micOk ? '' : 'disabled'}>● Gravar 1ª camada</button>
        <button type="button" class="btn" data-act="lundo" disabled>↶ Desfazer camada</button>
        <button type="button" class="btn" data-act="lclear" disabled>Limpar tudo</button>
        ${S.standalone ? '<button type="button" class="btn" data-act="lwav" disabled>Baixar mixagem (WAV)</button>' : ''}
      </div>
      <ul class="layers" data-layers></ul>
    </section>`;
  const $ = s => el.querySelector(s);
  const urls = [];
  let tTimer = null, raf = null;

  async function paintTakes() {
    const takes = await REC.list();
    $('[data-takes]').innerHTML = takes.length ? takes.map(t => {
      const u = URL.createObjectURL(t.blob); urls.push(u);
      return `<li><div><b>${U.esc(t.name)}</b><span class="small">${new Date(t.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })} · ${Math.round(t.dur)}s</span></div>
        <audio controls preload="none" src="${u}"></audio>
        <div class="ctrl-row">${S.standalone ? `<button type="button" class="btn" data-dl="${t.id}">Baixar</button>` : ''}<button type="button" class="btn ghost" data-del="${t.id}">Apagar</button></div></li>`;
    }).join('') : '<li class="small">Nenhuma gravação ainda.</li>';
    paintTakes.takes = takes;
  }
  paintTakes();

  function paintLayers() {
    const ls = LOOP.layers;
    $('[data-layers]').innerHTML = ls.map((L, i) => `<li><b>${L.name}</b><label class="field">Volume <input type="range" min="0" max="1.5" step="0.05" value="${L.vol}" data-vol="${i}" id="lvol-${i}"></label></li>`).join('');
    $('[data-act="lrec"]').textContent = ls.length ? '● Gravar camada por cima' : '● Gravar 1ª camada';
    ['lundo', 'lclear', 'lwav'].forEach(a => { const b = $(`[data-act="${a}"]`); if (b) b.disabled = !ls.length; });
    $('[data-lmsg]').textContent = ls.length ? `Tocando em loop: ${ls.length} camada${ls.length > 1 ? 's' : ''}.` : 'Pronto para gravar.';
  }
  function anim() {
    raf = requestAnimationFrame(anim);
    if (!LOOP.len || !A.ctx) return;
    const p = (((A.ctx.currentTime - LOOP.anchor) % LOOP.len) + LOOP.len) % LOOP.len / LOOP.len;
    $('[data-lpos]').style.width = (A.ctx.currentTime < LOOP.anchor ? 0 : p * 100) + '%';
    $('[data-lpos]').classList.toggle('rec', !!LOOP.recording);
  }
  raf = requestAnimationFrame(anim);

  el.addEventListener('click', async e => {
    const chip = e.target.closest('[data-chips="bars"] .chip');
    if (chip) { if (LOOP.layers.length) { U.toast('Limpe o loop para mudar o tamanho'); return; } LOOPCFG.bars = +chip.dataset.v; chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip)); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'rec') {
      const b = $('[data-act="rec"]');
      if (REC.on) {
        clearInterval(tTimer);
        const r = await REC.stop();
        b.textContent = '● Gravar'; b.classList.remove('on');
        if (r && r.blob.size) {
          const name = $('[data-rname]').value.trim() || 'Gravação ' + new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
          await REC.save({ id: 't' + Date.now(), name, date: Date.now(), dur: r.dur, blob: r.blob });
          S.addMinutes(r.dur / 60); U.toast('Gravação salva'); paintTakes();
        }
        return;
      }
      try {
        await REC.start(); b.textContent = '■ Parar'; b.classList.add('on');
        const t0 = performance.now();
        tTimer = setInterval(() => { const s = (performance.now() - t0) / 1000; $('[data-rtime]').textContent = `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; }, 250);
      } catch (err) { U.toast(MIC.errorText(err)); }
      return;
    }
    if (act === 'lrec') {
      if (LOOP.recording) return;
      try {
        const n = LOOP.layers.length;
        const { t0, len } = await LOOP.record({ bpm: LOOPCFG.bpm, bars: LOOPCFG.bars }, () => { paintLayers(); });
        $('[data-lmsg]').textContent = n ? 'Gravando a próxima volta…' : 'Contando 4 tempos… depois grave a volta inteira.';
        setTimeout(() => { if (LOOP.recording) $('[data-lmsg]').textContent = `Gravando (${len.toFixed(1)} s)…`; }, Math.max(0, (t0 - A.ctx.currentTime) * 1000));
        S.practiced();
      } catch (err) { $('[data-lmsg]').textContent = MIC.errorText(err); }
      return;
    }
    if (act === 'lundo') { LOOP.undo(); paintLayers(); }
    if (act === 'lclear') { LOOP.clear(); paintLayers(); }
    if (act === 'lwav') { const w = LOOP.wav(); if (w) saveBlob(w, 'loop-mapa-do-braco.wav'); }
    const dl = e.target.closest('[data-dl]');
    if (dl) { const t = paintTakes.takes.find(x => x.id === dl.dataset.dl); if (t) saveBlob(t.blob, `${t.name}.${(t.blob.type.includes('mp4') ? 'm4a' : 'webm')}`); }
    const del = e.target.closest('[data-del]');
    if (del) {
      if (del.dataset.armed) { await REC.del(del.dataset.del); paintTakes(); }
      else { del.dataset.armed = '1'; del.textContent = 'Clique de novo para apagar'; setTimeout(() => { if (del.isConnected) { delete del.dataset.armed; del.textContent = 'Apagar'; } }, 3500); }
    }
  });
  el.addEventListener('input', e => { if (e.target.dataset.vol != null) LOOP.setVol(+e.target.dataset.vol, +e.target.value); });
  el.addEventListener('change', e => {
    if (e.target.dataset.k === 'bpm') { if (LOOP.layers.length) { U.toast('Limpe o loop para mudar o andamento'); e.target.value = LOOPCFG.bpm; return; } LOOPCFG.bpm = Math.max(40, Math.min(220, +e.target.value || 90)); }
    if (e.target.dataset.k === 'click') LOOP.click = e.target.checked;
  });
  return () => { cancelAnimationFrame(raf); clearInterval(tTimer); if (REC.on) REC.stop(); LOOP.close(); urls.forEach(u => URL.revokeObjectURL(u)); };
};
