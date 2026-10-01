/* ===== Componentes de aula: acordes, trocas, levadas, música com cifra ===== */
const W = {};

function chordItems(list) { return list.map(c => { const [name, prefer] = c.split('@'); return { name, prefer }; }); }

W.chords = (host, cfg) => {
  const items = chordItems(cfg.chords);
  host.innerHTML = `<div class="chord-row">${items.map(i => CH.card(i.name, { prefer: i.prefer })).join('')}</div>
    <div class="ctrl-row"><button type="button" class="btn" data-act="all">♪ Ouvir todos</button><span class="small">Toque num diagrama para ouvir o acorde.</span></div>`;
  host.addEventListener('click', e => {
    const c = e.target.closest('[data-chord]');
    if (c) { CH.strum(c.dataset.chord, null, { prefer: c.dataset.prefer }); return; }
    if (e.target.closest('[data-act="all"]')) { A.init(); items.forEach((it, i) => CH.strum(it.name, A.now() + 0.05 + i * 1.1, { prefer: it.prefer, dur: 1 })); S.practiced(); }
  });
  return () => A.stopAll();
};

/* ---- Trocas de acordes em 1 minuto ---- */
const CHANGE_PAIRS = [['Em','Am'],['E','A'],['A','D'],['D','G'],['G','C'],['C','Am'],['Em','C'],['G','D'],['Am','Dm'],['D','Em'],['C','F'],['E7','A7'],['A7','D7'],['G','Em'],['F','G'],['Am','F'],['Bm','G'],['D','Bm']];
const pairKey = p => p.join('-');

W.changes = (host, cfg = {}) => {
  const pairs = cfg.pairs || CHANGE_PAIRS;
  let cur = 0, count = 0, timer = null, endAt = 0;
  host.innerHTML = `
    <div class="ctrl-row" data-pairs></div>
    <div class="changes">
      <div class="chord-row two" data-cards></div>
      <div class="ch-side">
        <div class="ch-clock"><b data-time>60</b><span>segundos</span></div>
        <button type="button" class="tap-pad" data-act="tap" disabled><b data-count>0</b><span>trocas · toque aqui ou espaço</span></button>
        <div class="ctrl-row"><button type="button" class="btn primary" data-act="go">▶ Começar 1 minuto</button><span class="pill" data-best></span></div>
      </div>
    </div>`;
  const $ = s => host.querySelector(s);
  function paint() {
    const best = S.get().changes || {};
    $('[data-pairs]').innerHTML = U.chips('pair', pairs.map((p, i) => ({ v: i, label: `${p[0]} ↔ ${p[1]}${best[pairKey(p)] ? ` · ${best[pairKey(p)]}` : ''}` })), cur);
    $('[data-cards]').innerHTML = pairs[cur].map(n => CH.card(n)).join('');
    const b = best[pairKey(pairs[cur])];
    $('[data-best]').textContent = b ? `Recorde: ${b} trocas` : 'Sem recorde ainda';
  }
  function stop(save) {
    clearInterval(timer); timer = null;
    $('[data-act="tap"]').disabled = true;
    $('[data-act="go"]').textContent = '▶ Começar 1 minuto';
    if (save && count > 0) {
      const k = pairKey(pairs[cur]), prev = (S.get().changes || {})[k] || 0;
      S.update(s => { s.changes = s.changes || {}; s.changes[k] = Math.max(prev, count); });
      S.practiced();
      U.toast(count > prev ? `Novo recorde: ${count} trocas!` : `${count} trocas. Recorde: ${prev}`);
      A.click(A.now() + 0.01, true);
      paint();
    }
  }
  function tap() { if (!timer) return; count++; $('[data-count]').textContent = count; }
  host.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="pair"] .chip');
    if (chip) { if (timer) stop(false); cur = +chip.dataset.v; count = 0; $('[data-count]').textContent = 0; paint(); return; }
    const c = e.target.closest('[data-chord]'); if (c) { CH.strum(c.dataset.chord); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'tap') tap();
    if (act === 'go') {
      if (timer) { stop(false); return; }
      count = 0; $('[data-count]').textContent = 0; endAt = performance.now() + 60000;
      $('[data-act="tap"]').disabled = false; $('[data-act="go"]').textContent = '■ Cancelar';
      A.click(A.now() + 0.01, true);
      timer = setInterval(() => { const left = Math.max(0, Math.ceil((endAt - performance.now()) / 1000)); $('[data-time]').textContent = left; if (left <= 0) stop(true); }, 200);
    }
  });
  const key = e => { if (e.code === 'Space' && timer) { e.preventDefault(); tap(); } };
  document.addEventListener('keydown', key);
  paint();
  return () => { clearInterval(timer); document.removeEventListener('keydown', key); };
};

/* ---- Levadas ---- */
function strumPanel(host, o) {
  // o: { pattern, chords, views?, editable? }
  let pat = RH.patById(o.pattern), chords = o.chords.slice(), bpm = pat.bpm, view = 0;
  host.innerHTML = `
    ${o.views ? `<div class="ctrl-row" data-views></div>` : ''}
    <div class="strum-head"><h3 data-pname></h3><span class="small" data-pstyle></span></div>
    <div data-grid></div>
    <div class="ctrl-row"><ol class="bars" data-bars></ol></div>
    ${o.editable ? `<div class="ctrl-row"><label class="field grow">Acordes (um por compasso) <input type="text" data-chords id="strum-chords" value="${chords.join(' ')}" autocomplete="off"></label></div>` : ''}
    <div class="chord-row small-cards" data-cards></div>
    <div class="ctrl-row">
      <button type="button" class="btn primary" data-act="play">▶ Tocar</button>
      <label class="field">Andamento <input type="range" min="40" max="160" value="${bpm}" data-bpm id="strum-bpm-${o.idSuffix || ''}"> <b data-bpmv>${bpm}</b> BPM</label>
      <label class="check"><input type="checkbox" data-click id="strum-click-${o.idSuffix || ''}" checked> Metrônomo</label>
    </div>`;
  const $ = s => host.querySelector(s);
  const player = RH.Strummer({ onSlot(bar, slot) {
    host.querySelectorAll('.sg-cell.on').forEach(c => c.classList.remove('on'));
    host.querySelectorAll('[data-bars] li').forEach((li, i) => li.classList.toggle('on', i === bar));
    if (slot >= 0) host.querySelector(`.sg-cell[data-slot="${slot}"]`)?.classList.add('on');
  } });
  function paint() {
    if (o.views) $('[data-views]').innerHTML = U.chips('sview', o.views.map((v, i) => ({ v: i, label: v.label })), view);
    $('[data-pname]').textContent = pat.name;
    $('[data-pstyle]').textContent = `${pat.style} · ${pat.beats === 2 ? '6/8' : pat.beats + '/4'}`;
    $('[data-grid]').innerHTML = RH.grid(pat);
    $('[data-bars]').innerHTML = chords.map(c => `<li>${U.esc(c)}</li>`).join('');
    $('[data-cards]').innerHTML = [...new Set(chords)].filter(c => CH.get(c)).map(c => CH.card(c)).join('');
  }
  function restart() { if (player.running) player.start({ pattern: pat.id, chords, bpm, click: $('[data-click]').checked }); }
  host.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="sview"] .chip');
    if (chip) {
      view = +chip.dataset.v; const v = o.views[view];
      pat = RH.patById(v.pattern || o.pattern); chords = (v.chords || o.chords).slice(); bpm = pat.bpm;
      $('[data-bpm]').value = bpm; $('[data-bpmv]').textContent = bpm; paint(); restart(); return;
    }
    const c = e.target.closest('[data-chord]'); if (c && !player.running) { CH.strum(c.dataset.chord); return; }
    const b = e.target.closest('[data-act="play"]');
    if (b) {
      if (player.running) { player.stop(); b.textContent = '▶ Tocar'; }
      else { player.start({ pattern: pat.id, chords, bpm, click: $('[data-click]').checked }); b.textContent = '■ Parar'; S.practiced(); }
    }
  });
  host.addEventListener('input', e => {
    if (e.target.matches('[data-bpm]')) { bpm = +e.target.value; $('[data-bpmv]').textContent = bpm; player.setBpm(bpm); }
  });
  host.addEventListener('change', e => {
    if (e.target.matches('[data-click]')) player.setClick(e.target.checked);
    if (e.target.matches('[data-chords]')) {
      const list = e.target.value.trim().split(/[\s,|]+/).filter(Boolean);
      const bad = list.filter(c => !CH.get(c));
      if (!list.length || bad.length) { U.toast(bad.length ? `Não conheço: ${bad.join(', ')}` : 'Escreva pelo menos um acorde'); return; }
      chords = list; paint(); restart();
    }
  });
  paint();
  return { stop: () => player.stop(), setPattern(id) { pat = RH.patById(id); bpm = pat.bpm; $('[data-bpm]').value = bpm; $('[data-bpmv]').textContent = bpm; paint(); restart(); } };
}

W.strum = (host, cfg) => { const p = strumPanel(host, Object.assign({ idSuffix: 'aula' }, cfg)); return () => p.stop(); };

/* ---- Música com cifra ---- */
W.song = (host, cfg) => {
  const song = SONGS.find(s => s.id === cfg.song);
  let bar = 0;
  const flat = [];
  const sections = song.sections.map(sec => {
    if (sec.bars) return `<div class="cf-sec"><p class="cf-name">${sec.name}</p><p class="cf-bars">${sec.bars.map(c => `<span class="cf-ch" data-bar="${flat.push(c) - 1}" data-chord="${c}">${c}</span>`).join(' | ')}</p></div>`;
    const lines = sec.lines.map(line => {
      const parts = line.split(/\[([^\]]+)\]/);
      let html = parts[0] ? `<span class="cf-seg"><i></i>${U.esc(parts[0])}</span>` : '';
      for (let i = 1; i < parts.length; i += 2) {
        html += `<span class="cf-seg"><i class="cf-ch" data-bar="${flat.push(parts[i]) - 1}" data-chord="${parts[i]}">${parts[i]}</i>${U.esc(parts[i + 1] || ' ')}</span>`;
      }
      return `<p class="cf-line">${html}</p>`;
    }).join('');
    return `<div class="cf-sec"><p class="cf-name">${sec.name}</p>${lines}</div>`;
  }).join('');
  const used = [...new Set(flat)];
  const SYMS = [['C','Dó maior'],['Cm','Dó menor'],['C7','Dó com sétima'],['C7M','Dó com sétima maior'],['Cm7','Dó menor com sétima'],['Csus4','Dó com 4ª no lugar da 3ª'],['C5','Power chord de Dó'],['C°','Dó diminuto'],['Cm7(b5)','Dó meio-diminuto (Cø)'],['C/E','Dó com Mi no baixo']];
  host.innerHTML = `
    <div class="song-head"><div><h3>${song.title}</h3><p class="small">${song.credit} · Tom: ${song.key} · ${song.bpm} BPM</p></div></div>
    <div class="chord-row small-cards">${used.map(c => CH.card(c)).join('')}</div>
    <div class="cifra" data-cifra>${sections}</div>
    ${cfg.symbols ? `<details class="syms"><summary>Tabela de símbolos de cifra</summary><div class="chord-row small-cards">${SYMS.map(([c, n]) => `<div class="sym">${CH.card(c)}<span>${n}</span></div>`).join('')}</div></details>` : ''}
    <div class="ctrl-row">
      ${U.chips('spat', song.patterns.map(p => ({ v: p, label: RH.patById(p).name })), song.patterns[0])}
    </div>
    <div class="ctrl-row">
      <button type="button" class="btn primary" data-act="play">▶ Tocar a música</button>
      <label class="field">Andamento <input type="range" min="40" max="140" value="${song.bpm}" data-bpm id="song-bpm"> <b data-bpmv>${song.bpm}</b> BPM</label>
    </div>`;
  let pattern = song.patterns[0], bpm = song.bpm;
  const player = RH.Strummer({ onSlot(b) {
    host.querySelectorAll('.cf-ch.on').forEach(c => c.classList.remove('on'));
    if (b >= 0) { const el = host.querySelector(`.cf-ch[data-bar="${b}"]`); el?.classList.add('on'); if (b !== bar) { bar = b; el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } }
  } });
  host.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips="spat"] .chip');
    if (chip) { pattern = chip.dataset.v; chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip)); if (player.running) player.start({ pattern, chords: flat, bpm }); return; }
    const b = e.target.closest('[data-act="play"]');
    if (b) {
      if (player.running) { player.stop(); b.textContent = '▶ Tocar a música'; }
      else { player.start({ pattern, chords: flat, bpm }); b.textContent = '■ Parar'; S.practiced(); }
      return;
    }
    const c = e.target.closest('[data-chord]'); if (c && !player.running) CH.strum(c.dataset.chord);
  });
  host.addEventListener('input', e => { if (e.target.matches('[data-bpm]')) { bpm = +e.target.value; host.querySelector('[data-bpmv]').textContent = bpm; player.setBpm(bpm); } });
  return () => player.stop();
};
W.cifra = (host, cfg) => W.song(host, Object.assign({ symbols: true }, cfg));
W.none = () => null;
