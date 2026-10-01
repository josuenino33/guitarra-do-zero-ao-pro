/* ===== Áudio: corda sintetizada (Karplus-Strong), timbres, cliques e relógio ===== */
const A = (() => {
  let ctx = null, master, gtrIn, cleanG, driveG, revSend, clickBus, backBus;
  const cache = new Map();
  const voices = {};
  let live = [];
  let tone = 'clean', volume = 0.8;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    // iPhone: toca mesmo com a chave de silencioso ligada (Safari 16.4+)
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = volume;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master.connect(comp); comp.connect(ctx.destination);

    // reverb curto de sala
    const conv = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 1.3);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    conv.buffer = ir;
    revSend = ctx.createGain(); revSend.gain.value = 0.16;
    revSend.connect(conv); conv.connect(master);

    gtrIn = ctx.createGain();
    // limpo
    cleanG = ctx.createGain();
    const cleanLP = ctx.createBiquadFilter(); cleanLP.type = 'lowpass'; cleanLP.frequency.value = 6500;
    gtrIn.connect(cleanG); cleanG.connect(cleanLP); cleanLP.connect(master); cleanLP.connect(revSend);
    // drive: ganho -> saturação -> falante
    driveG = ctx.createGain();
    const pre = ctx.createGain(); pre.gain.value = 9;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 110;
    const sh = ctx.createWaveShaper();
    const curve = new Float32Array(2048);
    for (let i = 0; i < 2048; i++) { const x = i / 1023.5 - 1; curve[i] = Math.tanh(2.6 * x); }
    sh.curve = curve; sh.oversample = '2x';
    const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 900; mid.gain.value = 4; mid.Q.value = 0.8;
    const cab = ctx.createBiquadFilter(); cab.type = 'lowpass'; cab.frequency.value = 3600; cab.Q.value = 0.9;
    const post = ctx.createGain(); post.gain.value = 0.22;
    gtrIn.connect(driveG); driveG.connect(hp); hp.connect(pre); pre.connect(sh); sh.connect(mid); mid.connect(cab); cab.connect(post);
    post.connect(master); post.connect(revSend);

    clickBus = ctx.createGain(); clickBus.gain.value = 0.9; clickBus.connect(master);
    // base do jam: sempre limpa, um pouco mais escura
    backBus = ctx.createGain(); backBus.gain.value = 0.55;
    const backLP = ctx.createBiquadFilter(); backLP.type = 'lowpass'; backLP.frequency.value = 3200;
    backBus.connect(backLP); backLP.connect(master); backLP.connect(revSend);
    setTone(tone);
    return ctx;
  }

  function setTone(t) {
    tone = t;
    if (!ctx) return;
    cleanG.gain.value = t === 'clean' ? 1 : 0;
    driveG.gain.value = t === 'drive' ? 1 : 0;
  }
  function setVolume(v) { volume = v; if (master) master.gain.value = v; }

  function buffer(midi) {
    if (cache.has(midi)) return cache.get(midi);
    const sr = ctx.sampleRate;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const dur = midi < 45 ? 3.4 : midi < 60 ? 2.8 : 2.2;
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    const S = midi < 52 ? 0.5 : midi < 66 ? 0.4 : 0.3;
    const P = sr / f - S;
    const Ni = Math.floor(P), fr = P - Ni;
    const t60 = midi < 52 ? 5 : midi < 66 ? 4 : 3;
    const rho = Math.pow(0.001, 1 / (f * t60));
    // excitação: ruído suavizado (palheta média)
    let prev = 0;
    for (let i = 0; i < Ni + 2 && i < len; i++) { const r = Math.random() * 2 - 1; prev = prev * 0.45 + r * 0.55; d[i] = prev; }
    let mean = 0; for (let i = 0; i < Ni + 2; i++) mean += d[i]; mean /= (Ni + 2);
    for (let i = 0; i < Ni + 2; i++) d[i] -= mean;
    let dPrev = 0;
    for (let n = Ni + 2; n < len; n++) {
      const del = (1 - fr) * d[n - Ni] + fr * d[n - Ni - 1];
      d[n] = rho * ((1 - S) * del + S * dPrev);
      dPrev = del;
    }
    const fade = Math.floor(sr * 0.08);
    for (let i = 0; i < fade; i++) d[len - 1 - i] *= i / fade;
    cache.set(midi, buf);
    return buf;
  }

  /**
   * Toca uma nota. o: { dur, vel, string, bend, release, prebend, slideFrom, vib, mute, dry }
   */
  function play(midi, when, o = {}) {
    init();
    const t = Math.max(when ?? ctx.currentTime, ctx.currentTime);
    const src = ctx.createBufferSource();
    src.buffer = buffer(midi);
    const g = ctx.createGain();
    const vel = (o.vel ?? 0.8) * (o.mute ? 0.9 : 1);
    g.gain.setValueAtTime(vel, t);
    let out = g;
    if (o.mute) {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1300;
      g.connect(lp); out = lp;
      g.gain.setTargetAtTime(0, t + 0.06, 0.07);
    }
    src.connect(g);
    out.connect(o.bus === 'back' ? backBus : (o.bus || gtrIn));
    const pr = src.playbackRate;
    const len = o.dur ?? 2.4;
    if (o.slideFrom != null) {
      pr.setValueAtTime(Math.pow(2, (o.slideFrom - midi) / 12), t);
      pr.linearRampToValueAtTime(1, t + Math.min(0.09, len * 0.5));
    }
    if (o.bend) {
      const r = Math.pow(2, o.bend / 12);
      if (o.prebend) pr.setValueAtTime(r, t); else { pr.setValueAtTime(1, t); pr.setTargetAtTime(r, t + 0.03, 0.045); }
      if (o.release) pr.setTargetAtTime(1, t + len * 0.55, 0.04);
    }
    if (o.vib) {
      const lfo = ctx.createOscillator(); lfo.frequency.value = 5.6;
      const lg = ctx.createGain(); lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(0.018, t + 0.25);
      lfo.connect(lg); lg.connect(pr); lfo.start(t); lfo.stop(t + len + 0.2);
    }
    src.start(t);
    if (o.dur != null) {
      g.gain.setValueAtTime(vel, t + len);
      g.gain.linearRampToValueAtTime(0, t + len + 0.07);
      src.stop(t + len + 0.1);
    }
    // abafa a nota anterior na mesma corda
    if (o.string != null) {
      const pv = voices[o.string];
      if (pv && pv.t < t) { pv.g.gain.cancelScheduledValues(t); pv.g.gain.setTargetAtTime(0, t, 0.012); }
      voices[o.string] = { g, t };
    }
    const v = { src, g, end: t + len + 0.1 };
    live.push(v);
    if (live.length > 80) live = live.filter(x => x.end > ctx.currentTime);
    return v;
  }

  function stopAll() {
    if (!ctx) return;
    const now = ctx.currentTime;
    live.forEach(v => { try { v.g.gain.cancelScheduledValues(now); v.g.gain.setTargetAtTime(0, now, 0.02); v.src.stop(now + 0.15); } catch (e) {} });
    live = [];
    Object.keys(voices).forEach(k => delete voices[k]);
  }

  function click(t, accent) {
    init();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square'; o.frequency.value = accent ? 1750 : 1150;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(accent ? 0.35 : 0.2, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    o.connect(g); g.connect(clickBus); o.start(t); o.stop(t + 0.06);
  }

  function tick(t) {
    init();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    o.connect(g); g.connect(clickBus); o.start(t); o.stop(t + 0.04);
  }

  let noiseBuf = null;
  function noise() {
    if (noiseBuf) return noiseBuf;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function drum(kind, t, vel = 1) {
    init();
    if (kind === 'kick') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
      g.gain.setValueAtTime(0.9 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      o.connect(g); g.connect(clickBus); o.start(t); o.stop(t + 0.35);
      return;
    }
    const s = ctx.createBufferSource(); s.buffer = noise();
    const f = ctx.createBiquadFilter(), g = ctx.createGain();
    if (kind === 'hat') { f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(0.18 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); }
    else { f.type = 'bandpass'; f.frequency.value = 1900; f.Q.value = 0.7; g.gain.setValueAtTime(0.5 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18); }
    s.connect(f); f.connect(g); g.connect(clickBus); s.start(t); s.stop(t + 0.25);
  }
  function bass(midi, t, dur) {
    init();
    play(midi, t, { dur, vel: 1, bus: 'back', string: 'bass' });
  }

  // mantém a tela do celular acesa enquanto o metrônomo ou a base estiverem tocando
  let lock = null, locks = 0;
  async function wake(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    try {
      if (locks > 0 && !lock && navigator.wakeLock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); }
      else if (locks === 0 && lock) { await lock.release(); lock = null; }
    } catch (e) { lock = null; }
  }

  /** Relógio com agendamento antecipado. onTick(tickIndex, time) por subdivisão. */
  function Clock(getBpm, perBeat, onTick) {
    let timer = null, next = 0, i = 0;
    const self = {
      running: false,
      start() {
        init();
        if (self.running) return;
        i = 0; next = ctx.currentTime + 0.12; self.running = true; wake(true);
        timer = setInterval(() => {
          while (next < ctx.currentTime + 0.12) {
            onTick(i, next);
            next += 60 / getBpm() / perBeat; i++;
          }
        }, 25);
      },
      stop() { if (self.running) wake(false); clearInterval(timer); timer = null; self.running = false; },
    };
    return self;
  }

  const now = () => (init(), ctx.currentTime);
  return { init, play, stopAll, click, tick, drum, bass, setTone, setVolume, Clock, now, get ctx() { return ctx; } };
})();
