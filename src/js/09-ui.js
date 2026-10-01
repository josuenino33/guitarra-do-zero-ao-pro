/* ===== Componentes compartilhados ===== */
const U = (() => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const set = () => S.get().settings;

  function rootOptions(selPc) {
    return T.ROOTS.map((r, i) => `<option value="${i}" ${i === selPc ? 'selected' : ''}>${T.rootName(i, set().latin)}</option>`).join('');
  }
  function chips(name, items, value) {
    return `<div class="chips" role="group" data-chips="${name}">${items.map(it =>
      `<button type="button" class="chip ${String(it.v) === String(value) ? 'on' : ''}" data-v="${esc(it.v)}" aria-pressed="${String(it.v) === String(value)}">${esc(it.label)}</button>`).join('')}</div>`;
  }
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 2200);
  }

  function fbState(extra = {}) {
    const st = set();
    return Object.assign({ frets: st.frets, lefty: st.lefty, latin: st.latin }, extra);
  }

  /** Monta marcas para uma demonstração de aula/explorador. */
  function buildDemo(cfg) {
    const st = set(), N = Math.max(st.frets, cfg.minFrets || 0);
    const root = typeof cfg.root === 'number' ? cfg.root : T.pcOf(cfg.root || 'C');
    let marks = [], caption = '', labels = cfg.labels || 'iv', flats = T.useFlats(root, 0), seq = null, frets = N;
    switch (cfg.kind) {
      case 'natural': {
        const nat = [0, 2, 4, 5, 7, 9, 11];
        (cfg.strings || [0]).forEach(s => { for (let f = 0; f <= 12; f++) {
          const pc = T.mod(T.pitch(s, f));
          if (nat.includes(pc)) marks.push(Object.assign(T.mark(s, f, 0), { role: (pc === 4 || pc === 5 || pc === 11 || pc === 0) ? 'pair' : 'n' }));
        } });
        labels = 'note'; flats = false;
        caption = 'Notas naturais. Em destaque os pares sem casa no meio: Mi–Fá e Si–Dó.';
        seq = 'run'; break;
      }
      case 'note': {
        marks = T.pcPositions(root, N).map(p => T.mark(p.s, p.f, root));
        labels = 'note';
        caption = `Todas as posições de ${T.rootName(root, st.latin)} até a casa ${N}.`;
        seq = 'run'; break;
      }
      case 'interval': {
        const rp = T.pitch(cfg.s, cfg.f);
        for (const iv of cfg.ivs) for (let s = cfg.s; s <= Math.min(5, cfg.s + 3); s++)
          for (let f = Math.max(0, cfg.f - 3); f <= cfg.f + 4; f++)
            if (T.pitch(s, f) === rp + iv && !(iv && s === cfg.s && f === cfg.f))
              marks.push(T.mark(s, f, root, iv === 12 ? { label: '8' } : {}));
        marks.push(T.mark(cfg.s, cfg.f, root));
        caption = `Tônica ${T.rootName(root, st.latin)} na ${T.stringLabel(cfg.s).toLowerCase()}, casa ${cfg.f}.`;
        seq = 'run'; break;
      }
      case 'power': {
        const s = cfg.s || 0;
        for (let f = T.mod(root - T.TUNING[s]); f + 2 <= N; f += 12)
          marks.push(T.mark(s, f, root), T.mark(s + 1, f + 2, root), T.mark(s + 2, f + 2, root, { label: '8' }));
        caption = `${T.rootName(root, st.latin)}5: tônica, 5ª e oitava.`;
        seq = 'strum'; break;
      }
      case 'scale': {
        const sc = T.SCALES[cfg.scale];
        flats = T.useFlats(root, sc.parent);
        const pos = cfg.pos ?? 0;
        marks = T.scaleMarks(cfg.scale, root, pos, N);
        const posName = pos < 0 ? 'braço inteiro' : (sc.sys === 'box' ? `caixa ${pos + 1}` : `posição ${pos + 1}`);
        caption = `${sc.name} de ${T.rootName(root, st.latin)}, ${posName}.`;
        seq = 'run'; break;
      }
      case 'triad': {
        const set3 = T.STRING_SETS.find(x => x.id === (cfg.set || '123'));
        const q = cfg.quality || 'maior';
        flats = T.useFlats(root, q === 'menor' ? 3 : 0);
        let vs = T.triads(root, q, set3.s, N);
        if (cfg.inv != null && cfg.inv >= 0) vs = vs.filter(v => v.inv === cfg.inv);
        vs.forEach(v => v.notes.forEach(n => marks.push(n)));
        seq = { groups: vs.map(v => v.notes) };
        caption = `${T.chordName(root, q, st.latin)} nas ${set3.label.toLowerCase()}` + (cfg.inv >= 0 ? `, ${T.INV_NAME[cfg.inv].toLowerCase()}.` : ', três inversões.');
        break;
      }
      case 'caged': {
        const q = cfg.quality || 'maior';
        flats = T.useFlats(root, q === 'menor' ? 3 : 0);
        const shapes = T.cagedAll(q, root, N);
        const chordIv = T.CHORDS[q].iv;
        if (cfg.shape === 'all' || !cfg.shape) {
          const seen = new Set();
          shapes.forEach(sh => sh.notes.forEach(n => { const k = n.s + ':' + n.f; if (!seen.has(k)) { seen.add(k); marks.push(n); } }));
          seq = { groups: shapes.map(sh => sh.notes) };
          caption = `${T.chordName(root, q, st.latin)} nas 5 formas: ` + shapes.map(sh => `${sh.k} (casa ${sh.lo})`).join(' → ');
        } else {
          const sh = shapes.find(x => x.k === cfg.shape);
          const layer = cfg.layer || 'chord';
          if (layer === 'chord') { marks = sh.notes; seq = { groups: [sh.notes] }; }
          else {
            const lo = Math.max(0, sh.lo - (layer === 'pent' ? 1 : 0)), hi = sh.hi + 1;
            const ivs = layer === 'arp' ? chordIv : (q === 'menor' ? T.SCALES.pent_menor.iv : T.SCALES.pent_maior.iv);
            const shapeKeys = new Set(sh.notes.map(n => n.s + ':' + n.f));
            marks = T.allNotes(ivs, root, hi, lo).map(m => (layer === 'pent' && !chordIv.includes(m.iv)) ? Object.assign(m, { small: true }) : m);
            sh.notes.forEach(n => { if (!marks.some(m => m.s === n.s && m.f === n.f)) marks.push(n); });
            marks.forEach(m => { if (layer !== 'chord' && !shapeKeys.has(m.s + ':' + m.f) && chordIv.includes(m.iv)) m.cls = 'ring'; });
            seq = 'run';
          }
          caption = `Forma ${sh.k} de ${T.chordName(root, q, st.latin)}, casas ${sh.lo} a ${sh.hi}.`;
        }
        break;
      }
      case 'arp': {
        const ch = T.CHORDS[cfg.chord];
        flats = T.useFlats(root, ch.iv.includes(3) ? 3 : 0);
        const lo = cfg.lo ?? 0, hi = Math.min(cfg.hi ?? N, N);
        marks = T.allNotes(ch.iv, root, hi, lo);
        caption = `Arpejo de ${T.chordName(root, cfg.chord, st.latin)} entre as casas ${lo} e ${hi}.`;
        seq = 'run'; break;
      }
      case 'lick': {
        const lk = lickById(cfg.lick);
        const p = TAB.parse(lk.src);
        const r = T.pcOf(lk.key);
        marks = TAB.marks(p, r);
        flats = T.useFlats(r, T.SCALES[lk.scale]?.parent || 0);
        const mx = Math.max(...marks.map(m => m.f));
        frets = Math.min(22, Math.max(N, mx + 1));
        caption = `Notas do lick “${lk.title}”. Use o player abaixo.`;
        break;
      }
    }
    return { marks, caption, labels, flats, seq, frets, root };
  }

  /** Toca o conteúdo de uma demonstração. */
  function playDemo(demo) {
    A.init(); S.practiced();
    const t0 = A.now() + 0.08;
    if (demo.seq && demo.seq.groups) {
      demo.seq.groups.forEach((g, i) => {
        const notes = g.slice().sort((a, b) => T.pitch(a.s, a.f) - T.pitch(b.s, b.f));
        notes.forEach((n, j) => A.play(T.pitch(n.s, n.f), t0 + i * 0.9 + j * 0.03, { dur: 0.85, vel: 0.6, string: n.s }));
      });
      return;
    }
    const uniq = new Map();
    demo.marks.filter(m => !m.dim).forEach(m => { const p = T.pitch(m.s, m.f); if (!uniq.has(p)) uniq.set(p, m); });
    const ps = [...uniq.keys()].sort((a, b) => a - b);
    if (demo.seq === 'strum') { ps.forEach((p, j) => A.play(p, t0 + j * 0.03, { dur: 1.4, vel: 0.65 })); return; }
    const run = ps.length > 1 ? ps.concat(ps.slice(0, -1).reverse()) : ps;
    run.slice(0, 64).forEach((p, i) => A.play(p, t0 + i * 0.2, { dur: 0.3, vel: 0.7, string: uniq.get(p).s }));
  }

  function legend(kind) {
    const items = [['r','Tônica'],['3','Terça'],['5','Quinta'],['7','Sétima'],['2','2ª / 9ª'],['4','4ª / 11ª'],['6','6ª / 13ª'],['b5','♭5 (blue note)']];
    const list = kind === 'natural' ? [['n','Nota natural'],['pair','Mi–Fá / Si–Dó']] : items;
    return `<div class="legend">${list.map(([r, l]) => `<span><i class="dot iv-${r}"></i>${l}</span>`).join('')}</div>`;
  }

  /** Painel de lick: tablatura + controles, trecho A-B e prática com microfone. Usa o braço `fb` informado. */
  function lickPanel(host, lick, fb, opts = {}) {
    const parsed = TAB.parse(lick.src);
    const root = T.pcOf(lick.key);
    const sc = T.SCALES[lick.scale];
    const level = '●'.repeat(lick.level) + '○'.repeat(5 - lick.level);
    const sfx = lick.id + (opts.idSuffix || '');
    host.innerHTML = `
      <div class="lick-head">
        <div><h3>${esc(lick.title)}</h3>${lick.credit ? `<p class="small">${esc(lick.credit)}</p>` : ''}
          <p class="meta"><span>${STYLES[lick.style] || 'Meus licks'}</span><span>Tom: ${T.rootName(root, set().latin)}</span><span>${sc ? sc.name : ''}</span><span>${lick.bpm} BPM</span><span title="Dificuldade">${level}</span></p></div>
      </div>
      ${lick.chords ? `<p class="chords">${lick.chords.map((c, i) => `<span>${i + 1}</span>${esc(c)}`).join('')}</p>` : ''}
      <div class="tab-scroll" data-tab></div>
      <p class="small ab-line"><span data-ab>Toque em duas colunas da tablatura para repetir só aquele trecho.</span> <button type="button" class="linkbtn" data-act="abclear" hidden>Tocar tudo</button></p>
      <div class="ctrl-row">
        <button type="button" class="btn primary" data-act="play">▶ Tocar</button>
        <label class="field">Velocidade <select data-speed id="spd-${sfx}">
          ${[50, 60, 70, 80, 90, 100, 110, 120].map(p => `<option value="${p}" ${p === (opts.speed || 100) ? 'selected' : ''}>${p}% · ${Math.round(lick.bpm * p / 100)} BPM</option>`).join('')}
        </select></label>
        <label class="check"><input type="checkbox" data-loop id="loop-${sfx}"> Repetir</label>
        <label class="check"><input type="checkbox" data-click id="clk-${sfx}" ${opts.click ? 'checked' : ''}> Metrônomo</label>
        <button type="button" class="btn" data-act="mic">🎤 Praticar com microfone</button>
      </div>
      <p class="tu-msg" data-micmsg aria-live="polite" hidden></p>
      <p class="tip"><b>${esc(lick.tech)}.</b> ${esc(lick.tip)}</p>`;
    const tabHost = host.querySelector('[data-tab]');
    const meterOpt = { meter: lick.meter || 4, pickup: lick.pickup || 0 };
    const highlight = TAB.render(tabHost, parsed, meterOpt);
    const btn = host.querySelector('[data-act="play"]');
    let A0 = null, B0 = null, offset = 0;
    const setActive = ev => fb && fb.setActive(ev ? ev.notes.filter(o => !o.dead).map(o => o.s + ':' + o.f) : []);
    const player = TAB.Player({
      onEvent(i) { const gi = i < 0 ? -1 : i + offset; highlight(gi); setActive(parsed.events[gi]); },
      onEnd() { btn.textContent = '▶ Tocar'; btn.classList.remove('on'); fb && fb.setActive([]); },
    });
    function range() {
      if (A0 == null) return null;
      return [Math.min(A0, B0 ?? A0), Math.max(A0, B0 ?? A0)];
    }
    function paintAB() {
      const r = range();
      tabHost.querySelectorAll('.tab-col').forEach(c => { const i = +c.dataset.i; c.classList.toggle('sel', !!r && i >= r[0] && i <= r[1]); });
      host.querySelector('[data-ab]').textContent = !r ? 'Toque em duas colunas da tablatura para repetir só aquele trecho.'
        : B0 == null ? 'Agora toque na última coluna do trecho.' : `Trecho: notas ${r[0] + 1} a ${r[1] + 1}. Ele toca em loop.`;
      host.querySelector('[data-act="abclear"]').hidden = !r;
    }
    function sub() {
      const r = range();
      if (!r || B0 == null) { offset = 0; return parsed; }
      const evs = parsed.events.slice(r[0], r[1] + 1), b0 = evs[0].beat;
      offset = r[0];
      return { events: evs.map(e => Object.assign({}, e, { beat: e.beat - b0 })), beats: evs[evs.length - 1].beat + evs[evs.length - 1].d - b0 };
    }
    function play() {
      opts.onPlay && opts.onPlay();
      const pct = +host.querySelector('[data-speed]').value;
      const ab = B0 != null;
      player.play(sub(), { bpm: lick.bpm * pct / 100, loop: ab || host.querySelector('[data-loop]').checked, click: host.querySelector('[data-click]').checked,
        meter: meterOpt.meter, pickup: ab ? 0 : meterOpt.pickup, swing: !!lick.swing });
      btn.textContent = '■ Parar'; btn.classList.add('on');
      S.practiced();
    }
    btn.addEventListener('click', () => {
      if (player.playing) { player.stop(); btn.textContent = '▶ Tocar'; btn.classList.remove('on'); return; }
      stopMic(); play();
    });
    tabHost.addEventListener('click', e => {
      const c = e.target.closest('.tab-col'); if (!c) return;
      const i = +c.dataset.i;
      if (A0 == null || B0 != null) { A0 = i; B0 = null; } else B0 = i;
      paintAB();
      if (B0 != null && player.playing) play();
    });
    host.querySelector('[data-act="abclear"]').addEventListener('click', () => { A0 = B0 = null; paintAB(); if (player.playing) play(); });

    /* prática com microfone: o app espera a nota certa para avançar */
    const msg = host.querySelector('[data-micmsg]'), micBtn = host.querySelector('[data-act="mic"]');
    let mic = null;
    function stopMic(text) {
      if (!mic) return;
      MIC.stop(); mic = null; micBtn.textContent = '🎤 Praticar com microfone'; micBtn.classList.remove('on');
      highlight(-1); fb && fb.setActive([]);
      if (text) msg.textContent = text; else msg.hidden = true;
    }
    function targetAt(k) {
      const ev = mic.evs[k];
      return ev.notes.filter(o => !o.dead).flatMap(o => [T.TUNING[o.s] + o.f].concat(o.bend ? [T.TUNING[o.s] + o.f + o.bend] : []));
    }
    function showTarget() {
      const gi = mic.idx[mic.k];
      highlight(gi); setActive(parsed.events[gi]);
      const names = [...new Set(targetAt(mic.k).map(m => T.noteName(m, false, set().latin)))].join(' ou ');
      msg.textContent = `Nota ${mic.k + 1} de ${mic.evs.length}: toque ${names}${mic.miss ? ` · ${mic.miss} erro${mic.miss > 1 ? 's' : ''}` : ''}`;
    }
    micBtn.addEventListener('click', async () => {
      if (mic) { stopMic(); return; }
      player.stop(); btn.textContent = '▶ Tocar'; btn.classList.remove('on');
      const r = range() && B0 != null ? range() : [0, parsed.events.length - 1];
      const idx = []; for (let i = r[0]; i <= r[1]; i++) if (parsed.events[i].notes.some(o => !o.dead)) idx.push(i);
      mic = { k: 0, idx, evs: idx.map(i => parsed.events[i]), stable: 0, last: null, miss: 0, wrongLock: 0, t0: performance.now() };
      msg.hidden = false;
      try {
        await MIC.start(p => {
          if (!mic) return;
          if (p.hz < 0) { mic.stable = 0; mic.last = null; return; }
          if (p.midi === mic.last) mic.stable++; else { mic.stable = 1; mic.last = p.midi; }
          if (mic.stable < 3 || Math.abs(p.cents) > 45) return;
          if (targetAt(mic.k).includes(p.midi)) {
            mic.k++; mic.stable = -6; mic.wrongLock = 0;
            if (mic.k >= mic.evs.length) {
              const secs = Math.round((performance.now() - mic.t0) / 1000), miss = mic.miss;
              S.practiced(); stopMic(`Concluído em ${secs} s${miss ? ` com ${miss} erro${miss > 1 ? 's' : ''}` : ' sem erros'}! Agora tente no tempo do metrônomo.`);
              msg.hidden = false; return;
            }
            showTarget();
          } else if (mic.stable === 3 && performance.now() > mic.wrongLock) { mic.miss++; mic.wrongLock = performance.now() + 600; showTarget(); }
        });
        micBtn.textContent = '■ Parar microfone'; micBtn.classList.add('on');
        showTarget();
      } catch (err) { mic = null; msg.textContent = MIC.errorText(err); }
    });
    return { player, parsed, root, stop: () => { player.stop(); stopMic(); btn.textContent = '▶ Tocar'; btn.classList.remove('on'); } };
  }

  return { $, esc, set, rootOptions, chips, toast, fbState, buildDemo, playDemo, legend, lickPanel };
})();
