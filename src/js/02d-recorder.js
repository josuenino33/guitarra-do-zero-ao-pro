/* ===== Gravador (MediaRecorder + IndexedDB) e looper (PCM sincronizado) ===== */
const MIC_OPTS = { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } };

const REC = (() => {
  let mr = null, stream = null, chunks = [], t0 = 0;
  function db() {
    return new Promise((res, rej) => {
      const rq = indexedDB.open('mapa-gravacoes', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('takes', { keyPath: 'id' });
      rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
    });
  }
  async function tx(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => { const t = d.transaction('takes', mode); const r = fn(t.objectStore('takes')); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); });
  }
  const list = async () => { try { const all = await tx('readonly', s => s.getAll()); return (all || []).sort((a, b) => b.date - a.date); } catch (e) { return []; } };
  const save = take => tx('readwrite', s => s.put(take));
  const del = id => tx('readwrite', s => s.delete(id));

  async function start() {
    stream = await navigator.mediaDevices.getUserMedia(MIC_OPTS);
    const type = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
    mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    chunks = []; mr.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    mr.start(250); t0 = performance.now();
    return stream;
  }
  function stop() {
    return new Promise(res => {
      if (!mr) return res(null);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
        stream.getTracks().forEach(t => t.stop());
        const dur = (performance.now() - t0) / 1000;
        mr = null; stream = null;
        res({ blob, dur });
      };
      mr.stop();
    });
  }
  const supported = () => !!(window.MediaRecorder && navigator.mediaDevices);
  return { start, stop, list, save, del, supported, get on() { return !!mr; } };
})();

const LOOP = (() => {
  let stream = null, src = null, proc = null, sink = null, rec = null;
  let layers = [], anchor = 0, len = 0, bpm = 90, beats = 16, clickOn = true, clickTimer = null, lat = 0;
  const ctx = () => A.ctx;

  async function mic() {
    if (stream) return;
    A.init();
    stream = await navigator.mediaDevices.getUserMedia(MIC_OPTS);
    src = ctx().createMediaStreamSource(stream);
    proc = ctx().createScriptProcessor(4096, 1, 1);
    sink = ctx().createGain(); sink.gain.value = 0;
    src.connect(proc); proc.connect(sink); sink.connect(ctx().destination);
    lat = (ctx().outputLatency || 0) + (ctx().baseLatency || 0) + 0.01;
    proc.onaudioprocess = e => {
      if (!rec) return;
      const data = e.inputBuffer.getChannelData(0), sr = ctx().sampleRate;
      // o áudio que chega aqui foi tocado “lat” segundos antes
      const tStart = e.playbackTime - data.length / sr - lat;
      for (let i = 0; i < data.length; i++) {
        const k = Math.round((tStart + i / sr - rec.t0) * sr);
        if (k >= 0 && k < rec.buf.length) rec.buf[k] = data[i];
      }
      rec.peak = Math.max(rec.peak * 0.9, ...[0, 512, 1024, 2048, 3072].map(i => Math.abs(data[i] || 0)));
    };
  }

  function clicks(from, to) {
    const spb = 60 / bpm;
    let n = Math.ceil((from - anchor) / spb - 1e-6);
    for (;; n++) { const t = anchor + n * spb; if (t >= to) break; if (t >= from && n >= 0) A.click(t, n % 4 === 0); }
  }
  function startClicks() {
    stopClicks();
    let until = ctx().currentTime;
    clickTimer = setInterval(() => { if (!clickOn) { until = ctx().currentTime + 0.3; return; } const to = ctx().currentTime + 0.3; clicks(until, to); until = to; }, 100);
  }
  function stopClicks() { clearInterval(clickTimer); clickTimer = null; }

  function playLayer(L, when) {
    const s = ctx().createBufferSource(); s.buffer = L.buffer; s.loop = true;
    const g = ctx().createGain(); g.gain.value = L.vol ?? 1;
    s.connect(g); g.connect(A.ctx.destination);
    const offset = ((when - anchor) % len + len) % len;
    s.start(when, offset);
    L.src = s; L.g = g;
  }

  /** Grava uma volta. Na primeira, conta 4 tempos antes; depois, começa na próxima volta. */
  async function record(o, onDone) {
    await mic();
    const sr = ctx().sampleRate, now = ctx().currentTime;
    let t0;
    if (!layers.length) {
      bpm = o.bpm; beats = o.bars * 4; len = beats * 60 / bpm;
      anchor = now + 0.15 + 4 * 60 / bpm;   // contagem de 4 tempos
      t0 = anchor;
      for (let b = 0; b < 4; b++) A.click(now + 0.15 + b * 60 / bpm, b === 0);
    } else {
      const n = Math.ceil((now + 0.05 - anchor) / len);
      t0 = anchor + n * len;
    }
    rec = { t0, buf: new Float32Array(Math.round(len * sr)), peak: 0 };
    if (!clickTimer) startClicks();
    const waitMs = (t0 + len - ctx().currentTime) * 1000 + 300;
    setTimeout(() => {
      const r = rec; rec = null;
      const buffer = ctx().createBuffer(1, r.buf.length, sr);
      buffer.copyToChannel(r.buf, 0);
      const L = { buffer, vol: 1, name: 'Camada ' + (layers.length + 1) };
      layers.push(L);
      playLayer(L, ctx().currentTime + 0.02);
      onDone && onDone(L);
    }, waitMs);
    return { t0, len };
  }

  function undo() { const L = layers.pop(); if (L && L.src) { try { L.src.stop(); } catch (e) {} } if (!layers.length) stopClicks(); }
  function clear() { layers.forEach(L => { try { L.src.stop(); } catch (e) {} }); layers = []; rec = null; stopClicks(); }
  function close() {
    clear();
    if (proc) { proc.onaudioprocess = null; try { src.disconnect(); proc.disconnect(); sink.disconnect(); } catch (e) {} }
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = src = proc = sink = null;
  }
  function setVol(i, v) { const L = layers[i]; if (L) { L.vol = v; if (L.g) L.g.gain.value = v; } }

  /** Mixa as camadas em WAV (para baixar). */
  function wav() {
    if (!layers.length) return null;
    const n = layers[0].buffer.length, sr = layers[0].buffer.sampleRate, mix = new Float32Array(n);
    layers.forEach(L => { const d = L.buffer.getChannelData(0); for (let i = 0; i < n; i++) mix[i] += d[i] * (L.vol ?? 1); });
    let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(mix[i]));
    const k = pk > 0.98 ? 0.98 / pk : 1;
    const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, mix[i] * k)) * 0x7fff, true);
    return new Blob([buf], { type: 'audio/wav' });
  }

  return { record, undo, clear, close, setVol, wav,
    get layers() { return layers; }, get recording() { return rec; }, get len() { return len; }, get anchor() { return anchor; },
    set click(v) { clickOn = v; }, get click() { return clickOn; } };
})();
