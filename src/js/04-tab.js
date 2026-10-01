/* ===== Tablatura: leitura, desenho e reprodução =====
   Sintaxe: "|e 3:5 3:7h 2:8b2r -"  (|q |e |s |t |h |w e "." para pontuada)
   Nota = corda:casa + técnica (h hammer, p pull-off, / slide, bN bend, r release,
   BN pré-bend, ~ vibrato, m palm mute). Corda:x = nota abafada. "+" junta notas. */
const TAB = (() => {
  const DUR = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25, t: 1 / 3, x: 1 / 6 };

  function parse(src) {
    const ev = [];
    let d = 0.5, beat = 0;
    for (const tok of src.trim().split(/\s+/)) {
      if (!tok) continue;
      if (tok[0] === '|') { d = DUR[tok[1]] * (tok[2] === '.' ? 1.5 : 1); continue; }
      if (tok === '-') { ev.push({ rest: true, d, beat, notes: [] }); beat += d; continue; }
      const notes = tok.split('+').map(nt => {
        const m = nt.match(/^([1-6]):(\d+|x)(.*)$/);
        if (!m) throw new Error('Token inválido: ' + nt);
        const n = +m[1], tech = m[3];
        const o = { n, s: 6 - n, f: m[2] === 'x' ? null : +m[2], dead: m[2] === 'x' };
        if (tech.includes('h')) o.h = true;
        if (tech.includes('p')) o.p = true;
        if (tech.includes('/')) o.sl = true;
        if (tech.includes('~')) o.vib = true;
        if (tech.includes('m')) o.pm = true;
        const b = tech.match(/b(\d)/); if (b) o.bend = +b[1];
        const B = tech.match(/B(\d)/); if (B) { o.bend = +B[1]; o.pre = true; }
        if (tech.includes('r')) o.rel = true;
        return o;
      });
      ev.push({ notes, d, beat });
      beat += d;
    }
    // casa anterior em cada corda (para rótulo e áudio de slide/legato)
    const last = {};
    ev.forEach(e => e.notes.forEach(o => {
      if (o.dead) return;
      o.prev = last[o.s];
      last[o.s] = o.f;
    }));
    return { events: ev, beats: beat };
  }

  function noteLabel(o) {
    if (o.dead) return 'x';
    let t = String(o.f);
    if (o.h) t = 'h' + t;
    else if (o.p) t = 'p' + t;
    else if (o.sl) t = (o.prev != null && o.prev > o.f ? '\\' : '/') + t;
    if (o.bend) t = o.pre ? `${o.f}pb${o.f + o.bend}` : `${t}b${o.f + o.bend}`;
    if (o.rel) t += 'r' + o.f;
    if (o.vib) t += '~';
    return t;
  }

  function countLabel(beat) {
    const r = Math.round(beat * 6) / 6;
    if (Math.abs(r - Math.round(r)) < 1e-6) return String((Math.round(r) % 4) + 1);
    if (Math.abs(r - Math.floor(r) - 0.5) < 1e-6) return '&';
    return '';
  }

  /** Desenha a tablatura dentro de `host`; retorna função para destacar evento. */
  function render(host, parsed, beatsPerBar = 4) {
    const cols = [];
    const bar = () => cols.push(`<div class="tab-bar" aria-hidden="true"></div>`);
    bar();
    parsed.events.forEach((e, i) => {
      if (i > 0 && Math.abs(e.beat / beatsPerBar - Math.round(e.beat / beatsPerBar)) < 1e-6) bar();
      const rows = ['', '', '', '', '', ''];
      e.notes.forEach(o => { rows[o.n - 1] = noteLabel(o); });
      const maxLen = Math.max(1, ...rows.map(r => r.length));
      const w = Math.max(maxLen + 1.4, Math.round(e.d * 6) + 1);
      const pm = e.notes.some(o => o.pm) ? '<i>PM</i>' : '';
      cols.push(`<div class="tab-col" data-i="${i}" style="--w:${w}"><span class="tab-top">${countLabel(e.beat)}${pm}</span>` +
        rows.map(r => `<span class="tab-cell">${r ? `<b>${r.replace('\\', '&#92;')}</b>` : ''}</span>`).join('') + `</div>`);
    });
    bar();
    host.innerHTML = `<div class="tab" role="img" aria-label="Tablatura"><div class="tab-names"><span class="tab-top"></span>${['e','B','G','D','A','E'].map(n => `<span class="tab-cell">${n}</span>`).join('')}</div>${cols.join('')}</div>`;
    return (idx) => {
      host.querySelectorAll('.tab-col.on').forEach(c => c.classList.remove('on'));
      if (idx == null || idx < 0) return;
      const c = host.querySelector(`.tab-col[data-i="${idx}"]`);
      if (c) {
        c.classList.add('on');
        const box = host;
        const left = c.offsetLeft - box.clientWidth / 3;
        if (c.offsetLeft < box.scrollLeft || c.offsetLeft > box.scrollLeft + box.clientWidth - 40) box.scrollTo({ left, behavior: 'smooth' });
      }
    };
  }

  /** Marcas para o braço a partir dos eventos (todas as notas do lick). */
  function marks(parsed, rootPc) {
    const seen = new Map();
    parsed.events.forEach(e => e.notes.forEach(o => {
      if (o.dead) return;
      const k = o.s + ':' + o.f;
      if (!seen.has(k)) seen.set(k, T.mark(o.s, o.f, rootPc));
      if (o.bend && !o.pre) {
        // o alvo do bend aparece como fantasma uma ou duas casas acima
        const kb = o.s + ':' + (o.f + o.bend);
        if (!seen.has(kb)) seen.set(kb, T.mark(o.s, o.f + o.bend, rootPc, { dim: true, small: true }));
      }
    }));
    return [...seen.values()];
  }

  /** Agenda as notas de uma tablatura a partir de t0. onEv(i, t) para cada evento. */
  function scheduleNotes(parsed, t0, bpm, onEv) {
    const spb = 60 / bpm;
    parsed.events.forEach((e, i) => {
      const t = t0 + e.beat * spb;
      onEv && onEv(i, t);
      const isLast = i === parsed.events.length - 1;
      e.notes.forEach(o => {
        if (o.dead) { A.play(T.TUNING[o.s] + 5, t, { dur: 0.05, vel: 0.5, mute: true, string: o.s }); return; }
        const legato = o.h || o.p || o.sl;
        const dur = isLast ? Math.max(e.d * spb, 1.6) : Math.max(e.d * spb * 1.05, 0.12) + (o.bend || o.vib ? 0.15 : 0.35);
        A.play(T.TUNING[o.s] + o.f, t, {
          dur, string: o.s, vel: legato ? 0.55 : (e.notes.length > 1 ? 0.6 : 0.85),
          slideFrom: o.sl && o.prev != null ? T.TUNING[o.s] + o.prev : null,
          bend: o.bend, release: o.rel, prebend: o.pre, vib: o.vib, mute: o.pm,
        });
      });
    });
  }

  /** Reprodutor. cb.onEvent(i), cb.onEnd() */
  function Player(cb = {}) {
    let raf = null, sched = [], tEnd = 0, opt = {}, parsed = null, playing = false, lastIdx = -1;

    function schedule(t0) {
      scheduleNotes(parsed, t0, opt.bpm, (i, t) => sched.push({ i, t }));
      if (opt.click) {
        const spb = 60 / opt.bpm, beats = Math.ceil(parsed.beats);
        for (let b = 0; b < beats; b++) A.click(t0 + b * spb, b % 4 === 0);
      }
      return t0 + parsed.beats * 60 / opt.bpm;
    }

    function loop() {
      const now = A.ctx.currentTime;
      let idx = -1;
      for (const s of sched) { if (s.t <= now + 0.01) idx = s.i; else break; }
      if (idx !== lastIdx && now >= (sched[0]?.t ?? Infinity) - 0.01) { lastIdx = idx; cb.onEvent?.(idx); }
      if (now >= tEnd - 0.2 && opt.loop && playing) {
        sched = sched.filter(s => s.t > now - 0.05);
        const nextT0 = tEnd;
        tEnd = schedule(nextT0);
        sched.sort((a, b) => a.t - b.t);
      } else if (now >= tEnd && playing) { stop(); cb.onEnd?.(); return; }
      raf = requestAnimationFrame(loop);
    }

    function play(p, o) {
      stop(true);
      A.init();
      parsed = p; opt = Object.assign({ bpm: 90, loop: false, click: false, countIn: true }, o);
      const spb = 60 / opt.bpm;
      let t0 = A.now() + 0.12;
      if (opt.countIn) { for (let b = 0; b < 4; b++) A.click(t0 + b * spb, b === 0); t0 += 4 * spb; }
      sched = []; lastIdx = -2; playing = true;
      tEnd = schedule(t0);
      raf = requestAnimationFrame(loop);
    }

    function stop(silent) {
      playing = false;
      cancelAnimationFrame(raf); raf = null;
      sched = [];
      A.stopAll();
      if (!silent) cb.onEvent?.(-1);
    }

    return { play, stop, get playing() { return playing; } };
  }

  return { parse, render, marks, Player, noteLabel, scheduleNotes };
})();
