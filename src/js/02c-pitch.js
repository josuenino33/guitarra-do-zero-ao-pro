/* ===== Microfone: detecção de altura (YIN simplificado) ===== */
const MIC = (() => {
  let stream = null, src = null, an = null, raf = null, buf = null;

  /** Frequência fundamental em Hz, ou -1 se não houver nota clara. */
  function yin(x, sr, fMin = 60, fMax = 1400) {
    const tauMin = Math.floor(sr / fMax), tauMax = Math.min(Math.floor(sr / fMin), (x.length >> 1) - 1);
    const W = x.length - tauMax;
    const d = new Float32Array(tauMax + 1);
    for (let tau = tauMin; tau <= tauMax; tau++) {
      let s = 0;
      for (let i = 0; i < W; i++) { const v = x[i] - x[i + tau]; s += v * v; }
      d[tau] = s;
    }
    // diferença média cumulativa normalizada
    let run = 0; const cm = new Float32Array(tauMax + 1); cm[0] = 1;
    for (let tau = 1; tau <= tauMax; tau++) { run += d[tau]; cm[tau] = tau < tauMin ? 1 : d[tau] * tau / (run || 1); }
    let tau = -1;
    for (let t = tauMin; t <= tauMax; t++) {
      if (cm[t] < 0.12) { while (t + 1 <= tauMax && cm[t + 1] < cm[t]) t++; tau = t; break; }
    }
    if (tau < 0) return -1;
    const a = cm[tau - 1] ?? cm[tau], b = cm[tau], c = cm[tau + 1] ?? cm[tau];
    const shift = (a - 2 * b + c) ? (a - c) / (2 * (a - 2 * b + c)) : 0;
    return sr / (tau + shift);
  }

  const available = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  /** Inicia a escuta. onPitch({ hz, midi, cents, rms }) ~30 vezes por segundo. */
  async function start(onPitch) {
    stop();
    const ctx = A.init();
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    src = ctx.createMediaStreamSource(stream);
    an = ctx.createAnalyser(); an.fftSize = 4096;
    src.connect(an);
    buf = new Float32Array(an.fftSize);
    const half = new Float32Array(an.fftSize / 2);
    let last = 0;
    const loop = (ts) => {
      raf = requestAnimationFrame(loop);
      if (ts - last < 33) return; last = ts;
      an.getFloatTimeDomainData(buf);
      let rms = 0; for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
      rms = Math.sqrt(rms / buf.length);
      if (rms < 0.008) { onPitch({ hz: -1, rms }); return; }
      // reduz para metade da taxa (média de pares) para caber no processamento de celulares
      for (let i = 0; i < half.length; i++) half[i] = (buf[2 * i] + buf[2 * i + 1]) * 0.5;
      const hz = yin(half, ctx.sampleRate / 2);
      if (hz <= 0) { onPitch({ hz: -1, rms }); return; }
      const m = 69 + 12 * Math.log2(hz / 440);
      const midi = Math.round(m);
      onPitch({ hz, midi, cents: Math.round((m - midi) * 100), rms });
    };
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    cancelAnimationFrame(raf); raf = null;
    if (src) { try { src.disconnect(); } catch (e) {} src = null; }
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  }

  /** Mensagem amigável para falhas do microfone. */
  function errorText(e) {
    if (!S.standalone) return 'O link do Claude não libera o microfone. Use o app em josuenino33.github.io/mapa-do-braco para esta função.';
    if (e && e.name === 'NotAllowedError') return 'O microfone foi bloqueado. Libere o acesso nas permissões do navegador e tente de novo.';
    if (e && e.name === 'NotFoundError') return 'Nenhum microfone encontrado neste aparelho.';
    return 'Não consegui abrir o microfone neste navegador.';
  }

  return { yin, start, stop, available, errorText, get on() { return !!stream; } };
})();
