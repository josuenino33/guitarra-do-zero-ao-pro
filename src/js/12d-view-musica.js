/* ===== Música do repertório: álbum de acordes (do áudio ou digitado), tom do ministro, capo e Modo Palco ===== */
const SONGW = (() => {
  const SHAPES = [['G', 7], ['C', 0], ['D', 2], ['E', 4], ['A', 9]];
  const majName = pc => T.spellAscii(T.spellScale(T.mod(pc), 'maior').root);
  const minName = pc => T.spellAscii(T.spellScale(T.mod(pc), 'menor').root) + 'm';

  /** Texto do tom ("G", "Am", "F#m") → tom maior equivalente (pc) e se é menor. */
  function keyInfo(txt) {
    const m = String(txt || '').trim().match(/^([A-G](?:#|b)?)(m(?!aj))?/);
    if (!m) return null;
    const pc = T.pcOf(m[1]);
    return { pc: m[2] ? T.mod(pc + 3) : pc, minor: !!m[2] };
  }
  const keyLabel = (pc, minor) => minor ? minName(pc - 3) : majName(pc);

  /** Grau do acorde no tom maior K (0 = I … 5 = vi, 6 = ♭VII) ou null. */
  function degOf(name, K) {
    const p = CH.parse(name);
    if (!p || p.q == null || p.bass != null || !T.CHORDS[p.q]) return null;
    const i = [0, 2, 4, 5, 7, 9, 10].indexOf(T.mod(p.root - K)); if (i < 0) return null;
    const iv = T.CHORDS[p.q].iv, minor = iv.includes(3) && !iv.includes(4);
    return minor === [1, 2, 5].includes(i) ? i : null;
  }
  const degName = (K, d) => d === 6 ? majName(K + 10) : harmonize(T.mod(K), 'maior')[d].triad;

  /** Acordes digitados: compassos separados por espaço, dois no mesmo compasso com +, % repete, - silêncio. */
  function parseText(txt) {
    const bars = [], bad = [];
    String(txt || '').trim().split(/\s+/).filter(Boolean).forEach(tok => {
      if (tok === '%') { if (bars.length) bars.push(bars[bars.length - 1]); return; }
      const parts = tok.split('+').slice(0, 2);
      if (parts.every(n => n === '-' || (CH.parse(n) && CH.parse(n).q != null))) bars.push(parts.length === 1 ? [parts[0], parts[0]] : parts);
      else bad.push(tok);
    });
    return { bars, bad };
  }

  /** Compassos da música: [{ t, a, b }] com a/b = { name (no tom original), deg } ou null (silêncio). */
  function bars(song) {
    const al = song.album;
    if (song.chords) {
      const K = (keyInfo(song.key) || { pc: 0 }).pc;
      return parseText(song.chords).bars.map(([x, y]) => ({ t: null, a: x === '-' ? null : { name: x, deg: degOf(x, K) }, b: y === '-' ? null : { name: y, deg: degOf(y, K) } }));
    }
    if (al) return al.bars.map(([t, x, y]) => ({ t, a: x < 0 ? null : { name: degName(al.key, x), deg: x }, b: y < 0 ? null : { name: degName(al.key, y), deg: y } }));
    return [];
  }
  /** Tom original da música (maior equivalente). */
  function origKey(song) {
    if (song.chords || !song.album) return keyInfo(song.key) || (song.album ? { pc: song.album.key, minor: song.album.minor } : null);
    return { pc: song.album.key, minor: song.album.minor };
  }
  /** Formas de capotraste possíveis para o tom maior pc. */
  const capoOpts = pc => SHAPES.map(([s, r]) => ({ s, r, c: T.mod(pc - r) })).filter(o => o.c <= 7).sort((a, b) => a.c - b.c);

  /**
   * Contexto de exibição: K (original), TK (tom de tocar), forma (letra ou 'none'), worship.
   * name(chord) → cifra para mostrar; shape(chord) → forma para o diagrama (com capo: casas a partir do capo).
   */
  function view(song) {
    const ok = origKey(song); if (!ok) return null;
    const K = ok.pc, TK = song.mk == null ? K : T.mod(song.mk);
    const opts = capoOpts(TK);
    let f = song.forma === 'none' ? null : opts.find(o => o.s === song.forma) || opts[0];
    if (song.forma == null) f = opts[0].c === 0 ? null : opts[0];
    const X = f ? f.r : TK, worship = song.worship !== false;
    const name = ch => {
      if (!ch) return '—';
      if (worship && ch.deg != null && ch.deg < 6) { const w = WV.best(X, ch.deg); if (w) return w.name; }
      return T.transposeName(ch.name, majName(K), majName(X));
    };
    const shape = ch => {
      if (!ch) return null;
      if (worship && ch.deg != null && ch.deg < 6) { const w = WV.best(X, ch.deg); if (w) return w; }
      return CH.get(T.transposeName(ch.name, majName(K), majName(X)));
    };
    return { K, TK, minor: ok.minor, opts, f, capo: f ? f.c : 0, worship, name, shape,
      keyText: keyLabel(TK, ok.minor), origText: keyLabel(K, ok.minor) };
  }
  const strum = sh => { if (!sh) return; if (sh.k === 'Worship') WV.strum(sh); else CH.voicing(sh).forEach((v, i) => A.play(v.midi, A.now() + 0.03 + i * 0.022, { dur: 2, vel: 0.55, string: v.s })); };

  return { keyInfo, keyLabel, majName, degOf, parseText, bars, origKey, capoOpts, view, strum, SHAPES };
})();

const songById = id => mySongs().find(s => s.id === id);
const saveSong = song => S.update(s => { s.songs = (s.songs || []).filter(x => x.id !== song.id).concat([Object.assign({}, song, { updatedAt: Date.now() })]); });
let SONG_AUDIO = { id: null, buf: null };   // áudio decodificado fica só na memória (não é salvo)

V.musica = (el, id) => {
  let song = songById(id);
  if (!song) { el.innerHTML = `<section class="panel"><p>Música não encontrada. <a href="#repertorio">Voltar ao repertório</a>.</p></section>`; return; }
  const PL = { src: null, start: 0, pos: 0, on: false };
  let raf = null, lastBar = -1, editing = false;

  function paint() {
    song = songById(id);
    const bs = SONGW.bars(song), v = SONGW.view(song), hasAudio = SONG_AUDIO.id === id && SONG_AUDIO.buf;
    const src = song.chords ? 'digitados' : song.album ? 'detectados no áudio (aproximado)' : '';
    const uniq = []; bs.forEach(b => [b.a, b.b].forEach(c => { if (c && v && !uniq.some(u => v.name(u) === v.name(c))) uniq.push(c); }));
    el.innerHTML = `<header class="page-head"><p class="eyebrow"><a href="#repertorio">Repertório</a></p><h1>${U.esc(song.title)}</h1>
        <p class="lede">${U.esc([song.artist, v && 'Tom ' + v.origText, (song.album && song.album.bpm || song.bpm) && (song.album ? song.album.bpm : song.bpm) + ' BPM'].filter(Boolean).join(' · '))}</p></header>
      ${bs.length && v ? `<div class="ctrl-row"><a class="btn primary" href="#palco-${song.id}">🎤 Modo Palco</a></div>
      <section class="panel">
        <div class="ctrl-row">
          <label class="field">Tom do ministro <select data-mk id="mk-${song.id}">${Array.from({ length: 12 }, (_, i) => `<option value="${i}" ${i === v.TK ? 'selected' : ''}>${SONGW.keyLabel(i, v.minor)}${i === v.K ? ' (original)' : ''}</option>`).join('')}</select></label>
          ${U.chips('wor', [{ v: '1', label: '✨ Worship' }, { v: '0', label: 'Simples' }], v.worship ? '1' : '0')}
        </div>
        <div class="ctrl-row"><span class="small">Capotraste:</span>${U.chips('forma', [{ v: 'none', label: 'Sem capo' }].concat(v.opts.filter(o => o.c > 0).map(o => ({ v: o.s, label: `Casa ${o.c} · forma de ${o.s}` }))), v.f ? v.f.s : 'none')}</div>
        <p class="small">${v.f ? `Coloque o capo na <b>casa ${v.f.c}</b> e toque as formas de <b>${v.f.s}</b>. As cifras abaixo são as formas; soa em <b>${v.keyText}</b>.` : `Sem capo, soa em <b>${v.keyText}</b>.`}</p>
      </section>
      <section class="panel"><p class="eyebrow">Acordes da música · toque para ouvir</p>
        <div class="chord-row">${uniq.map((c, i) => `<button type="button" class="chord-card" data-ci="${i}" aria-label="Ouvir ${U.esc(v.name(c))}"><b>${prettyChord(v.name(c))}</b>${CH.diagram(v.shape(c))}</button>`).join('')}</div></section>
      <section class="panel"><p class="eyebrow">Mapa da música · ${bs.length} compassos (${src})</p>
        ${song.album && !song.chords ? `<div class="ctrl-row">${hasAudio ? `<button type="button" class="btn primary" data-act="pl">${PL.on ? '❚❚ Pausar' : '▶ Tocar junto'}</button><span class="small">O mapa acende no compasso que está tocando.${song.mk != null && song.mk !== song.album.key ? ' O áudio continua no tom original.' : ''}</span>`
          : `<label class="btn" for="aud-${song.id}">🎵 Carregar o áudio para tocar junto</label><input type="file" id="aud-${song.id}" accept="audio/*" data-reload hidden><span class="small">O áudio não fica salvo, só a análise.</span>`}</div>` : ''}
        <ol class="song-map">${bs.map((b, i) => `<li data-bar="${i}"><i>${i + 1}</i>${b.a === b.b || (b.a && b.b && b.a.name === b.b.name) ? prettyChord(v.name(b.a)) : `${prettyChord(v.name(b.a))} <em>${prettyChord(v.name(b.b))}</em>`}</li>`).join('')}</ol>
      </section>` : ''}
      <section class="panel"><p class="eyebrow">${bs.length ? 'Trocar os acordes' : 'Montar o álbum desta música'}</p>
        <div class="ctrl-row"><label class="btn ${bs.length ? '' : 'primary'}" for="an-${song.id}">🎵 Analisar um áudio</label><input type="file" id="an-${song.id}" accept="audio/*" data-analyze hidden>
          <button type="button" class="btn" data-act="edit">✍️ ${song.chords ? 'Editar os acordes' : 'Digitar os acordes'}</button></div>
        <div class="bar" data-prog hidden><i></i></div><p class="small" data-msg>O app ouve a música no seu aparelho e encontra tom, andamento e acordes. Funciona melhor com violão ou teclado bem audíveis. Nada é enviado para a internet.</p>
        <div data-editor ${editing ? '' : 'hidden'}>
          <label class="field block" for="ch-${song.id}">Um compasso por cifra, separados por espaço. Dois acordes no mesmo compasso: <code>G+D</code>. Repetir o anterior: <code>%</code>.</label>
          <textarea id="ch-${song.id}" rows="4" data-text placeholder="G D Em C G D C C">${U.esc(song.chords || (bs.length ? bs.map(b => b.a && b.b && b.a.name !== b.b.name ? b.a.name + '+' + b.b.name : (b.a ? b.a.name : '-')).join(' ') : ''))}</textarea>
          <label class="field">Tom original <input type="text" data-key value="${U.esc(song.key || (v ? v.origText : ''))}" size="5" placeholder="G"></label>
          <div class="ctrl-row"><button type="button" class="btn primary" data-act="savech">Salvar acordes</button>${song.chords && song.album ? `<button type="button" class="btn ghost" data-act="useaudio">Voltar aos acordes do áudio</button>` : ''}</div>
        </div>
      </section>`;
    el._uniq = uniq; el._v = v; el._bars = bs;
    lastBar = -1;
  }

  async function analyzeFile(file, onlyLoad) {
    const prog = el.querySelector('[data-prog]'), msg = el.querySelector('[data-msg]');
    try {
      if (prog) { prog.hidden = false; prog.firstElementChild.style.width = '2%'; }
      if (msg) msg.textContent = 'Lendo o arquivo…';
      const ctx = A.init(), data = await file.arrayBuffer();
      const buf = await new Promise((res, rej) => ctx.decodeAudioData(data, res, rej));
      SONG_AUDIO = { id, buf };
      if (onlyLoad) { paint(); return; }
      const { x, sr } = MA.mono(buf);
      if (x.length < sr * 8) throw new Error('curta');
      const r = await MA.analyze(x, sr, p => { if (prog) prog.firstElementChild.style.width = Math.round(p * 100) + '%'; if (msg) msg.textContent = 'Ouvindo a harmonia…'; });
      const s = Object.assign({}, songById(id), { album: r, chords: '' });
      if (!s.key) s.key = SONGW.keyLabel(r.key, r.minor);
      if (!s.bpm) s.bpm = r.bpm;
      saveSong(s); U.toast('Álbum pronto!'); paint();
    } catch (e) {
      console.error(e);
      if (prog) prog.hidden = true;
      if (msg) msg.textContent = 'Não consegui ler esse arquivo. Tente um mp3, m4a ou wav com pelo menos 10 segundos.';
    }
  }

  /* player do áudio carregado, sincronizado com o mapa */
  const plTime = () => PL.on ? A.ctx.currentTime - PL.start : PL.pos;
  function plPlay() {
    if (!SONG_AUDIO.buf || PL.on) return;
    const ctx = A.init(), s = ctx.createBufferSource();
    s.buffer = SONG_AUDIO.buf; s.connect(ctx.destination);
    if (PL.pos >= SONG_AUDIO.buf.duration - 0.2) PL.pos = 0;
    s.start(0, PL.pos); PL.src = s; PL.start = ctx.currentTime - PL.pos; PL.on = true;
    s.onended = () => { if (PL.src === s && PL.on) { PL.on = false; PL.pos = 0; paint(); } };
    loop();
  }
  function plPause() { if (!PL.on) return; PL.pos = plTime(); PL.src.onended = null; try { PL.src.stop(); } catch (e) {} PL.on = false; cancelAnimationFrame(raf); }
  function loop() {
    const bs = el._bars || [], ctx = A.ctx;
    const t = plTime() - (ctx ? (ctx.outputLatency || ctx.baseLatency || 0) : 0);
    let i = -1; while (i + 1 < bs.length && bs[i + 1].t != null && bs[i + 1].t <= t) i++;
    if (i !== lastBar) {
      el.querySelectorAll('.song-map li.on').forEach(x => x.classList.remove('on'));
      const li = el.querySelector(`.song-map li[data-bar="${i}"]`); if (li) { li.classList.add('on'); li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      lastBar = i;
    }
    if (PL.on) raf = requestAnimationFrame(loop);
  }

  el.addEventListener('click', e => {
    const t = e.target;
    const chip = t.closest('[data-chips] .chip');
    if (chip) {
      const g = chip.parentElement.dataset.chips, s = Object.assign({}, songById(id));
      if (g === 'wor') s.worship = chip.dataset.v === '1';
      if (g === 'forma') s.forma = chip.dataset.v;
      saveSong(s); paint(); return;
    }
    const ci = t.closest('[data-ci]'); if (ci) { SONGW.strum(el._v.shape(el._uniq[+ci.dataset.ci])); return; }
    const act = t.closest('[data-act]')?.dataset.act;
    if (act === 'pl') { if (PL.on) plPause(); else plPlay(); t.closest('[data-act]').textContent = PL.on ? '❚❚ Pausar' : '▶ Tocar junto'; return; }
    if (act === 'edit') { editing = !editing; el.querySelector('[data-editor]').hidden = !editing; return; }
    if (act === 'useaudio') { saveSong(Object.assign({}, songById(id), { chords: '' })); editing = false; paint(); return; }
    if (act === 'savech') {
      const txt = el.querySelector('[data-text]').value, key = el.querySelector('[data-key]').value.trim(), r = SONGW.parseText(txt);
      if (r.bad.length) { U.toast('Não entendi: ' + r.bad.slice(0, 3).join(', ')); return; }
      if (!r.bars.length) { U.toast('Digite pelo menos um acorde'); return; }
      const ki = SONGW.keyInfo(key) || SONGW.keyInfo(r.bars[0][0]);
      if (!ki) { U.toast('Informe o tom original (ex.: G ou Em)'); return; }
      saveSong(Object.assign({}, songById(id), { chords: txt.trim(), key: key || SONGW.keyLabel(ki.pc, ki.minor) }));
      editing = false; U.toast('Acordes salvos'); paint(); return;
    }
    const li = t.closest('.song-map li[data-bar]');
    if (li && SONG_AUDIO.id === id && SONG_AUDIO.buf) { const b = el._bars[+li.dataset.bar]; if (b && b.t != null) { plPause(); PL.pos = b.t; plPlay(); paint(); loop(); } }
  });
  el.addEventListener('change', e => {
    if (e.target.matches('[data-mk]')) { const s = Object.assign({}, songById(id)), k = +e.target.value, ok = SONGW.origKey(s); s.mk = ok && k === ok.pc ? null : k; s.forma = null; saveSong(s); paint(); }
    if (e.target.matches('[data-analyze]') && e.target.files[0]) { plPause(); analyzeFile(e.target.files[0]); }
    if (e.target.matches('[data-reload]') && e.target.files[0]) analyzeFile(e.target.files[0], true);
  });
  paint();
  return () => { plPause(); };
};

V.palco = (el, id) => {
  const list = id === 'set' ? mySongs().filter(s => s.status === 'palco').sort((a, b) => (a.order || 0) - (b.order || 0)) : [songById(id)].filter(Boolean);
  if (!list.length) { el.innerHTML = `<section class="panel"><p>${id === 'set' ? 'Seu setlist está vazio. Marque músicas como “No setlist” no repertório.' : 'Música não encontrada.'} <a href="#repertorio">Voltar</a>.</p></section>`; return; }
  let si = 0, bar = 0, click = true, from = 0;
  document.body.classList.add('palco-on');
  const clock = A.Clock(() => bpm(), 1, (i, t) => {
    if (i < 4) { A.click(t, i === 0); return; }
    const k = i - 4, bs = SONGW.bars(list[si]);
    if (k % 4 === 0) { const n = from + k / 4; if (n >= bs.length) { setTimeout(stop, Math.max(0, (t - A.ctx.currentTime) * 1000)); return; } setTimeout(() => go(n), Math.max(0, (t - A.ctx.currentTime) * 1000)); }
    if (click) A.click(t, k % 4 === 0);
  });
  const bpm = () => (list[si].album && list[si].album.bpm) || list[si].bpm || 72;

  function paint() {
    const song = list[si], bs = SONGW.bars(song), v = SONGW.view(song);
    el.innerHTML = `<div class="palco">
      <div class="palco-top"><div><b>${U.esc(song.title)}</b><span>${v ? `Tom ${v.keyText}${v.f ? ` · capo ${v.f.c} (formas de ${v.f.s})` : ''}` : ''} · ${bpm()} BPM${list.length > 1 ? ` · ${si + 1}/${list.length}` : ''}</span></div>
        <button type="button" class="btn ghost" data-act="exit">Sair</button></div>
      ${bs.length && v ? `<div class="palco-now"><span>Agora</span><b data-now></b><small data-next></small></div>
      <ol class="song-map big">${bs.map((b, i) => `<li data-bar="${i}"><i>${i + 1}</i>${b.a && b.b && b.a.name !== b.b.name ? `${prettyChord(v.name(b.a))} <em>${prettyChord(v.name(b.b))}</em>` : prettyChord(v.name(b.a))}</li>`).join('')}</ol>`
      : `<p class="palco-empty">Esta música ainda não tem acordes. Monte o álbum dela no repertório.</p>${song.notes ? `<p class="palco-notes">${U.esc(song.notes)}</p>` : ''}`}
      <div class="palco-ctrl">
        ${list.length > 1 ? `<button type="button" class="btn" data-act="prevsong" ${si === 0 ? 'disabled' : ''}>⏮ Música</button>` : ''}
        <button type="button" class="btn" data-act="prev">◀</button>
        <button type="button" class="btn primary big" data-act="go">${clock.running ? '■ Parar' : '▶ Começar'}</button>
        <button type="button" class="btn" data-act="next">▶</button>
        ${list.length > 1 ? `<button type="button" class="btn" data-act="nextsong" ${si === list.length - 1 ? 'disabled' : ''}>Música ⏭</button>` : ''}
        <label class="check"><input type="checkbox" data-click id="palco-click" ${click ? 'checked' : ''}> Clique</label>
      </div>
      <p class="small palco-help">▶ Começar conta 4 tempos e avança sozinho no andamento. Pedal de virar página (Bluetooth) ou setas do teclado também avançam e voltam.</p>
    </div>`;
    go(bar, true);
  }
  function go(n, quiet) {
    const song = list[si], bs = SONGW.bars(song), v = SONGW.view(song); if (!bs.length || !v) return;
    bar = Math.max(0, Math.min(bs.length - 1, n));
    const b = bs[bar], nb = bs[bar + 1];
    const now = el.querySelector('[data-now]'), next = el.querySelector('[data-next]');
    if (now) now.innerHTML = b.a && b.b && b.a.name !== b.b.name ? `${prettyChord(v.name(b.a))} <em>${prettyChord(v.name(b.b))}</em>` : prettyChord(v.name(b.a));
    if (next) next.textContent = nb ? 'Próximo: ' + [nb.a, nb.b].filter((c, i, a) => c && (i === 0 || !a[0] || a[0].name !== c.name)).map(c => v.name(c)).join(' ') : 'Fim';
    el.querySelectorAll('.song-map li.on').forEach(x => x.classList.remove('on'));
    const li = el.querySelector(`.song-map li[data-bar="${bar}"]`); if (li) { li.classList.add('on'); if (!quiet) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }
  function stop() { clock.stop(); const b = el.querySelector('[data-act="go"]'); if (b) b.textContent = '▶ Começar'; }
  function song(d) { stop(); si = Math.max(0, Math.min(list.length - 1, si + d)); bar = 0; paint(); }
  el.addEventListener('click', e => {
    const a = e.target.closest('[data-act]')?.dataset.act;
    if (a === 'exit') { location.hash = id === 'set' ? '#repertorio' : '#musica-' + id; return; }
    if (a === 'go') { if (clock.running) stop(); else { from = bar; clock.start(); e.target.closest('[data-act]').textContent = '■ Parar'; S.practiced(); } return; }
    if (a === 'prev') { stop(); go(bar - 1); return; }
    if (a === 'next') { stop(); go(bar + 1); return; }
    if (a === 'prevsong') return song(-1);
    if (a === 'nextsong') return song(1);
    const li = e.target.closest('.song-map li[data-bar]'); if (li) { stop(); go(+li.dataset.bar); }
  });
  el.addEventListener('change', e => { if (e.target.matches('[data-click]')) click = e.target.checked; });
  const onKey = e => {
    if (['ArrowRight', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); stop(); go(bar + 1); }
    else if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); stop(); go(bar - 1); }
    else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); el.querySelector('[data-act="go"]')?.click(); }
  };
  document.addEventListener('keydown', onKey);
  paint();
  return () => { clock.stop(); document.removeEventListener('keydown', onKey); document.body.classList.remove('palco-on'); };
};
