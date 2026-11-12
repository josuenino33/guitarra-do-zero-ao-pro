/* ===== Análise de áudio: andamento, batidas, tom e acordes de uma música (tudo no aparelho) ===== */
const MA = (() => {
  // perfis de Krumhansl para achar o tom
  const MAJ = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
  const MIN = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
  // graus procurados (tom maior): I ii iii IV V vi e o ♭VII emprestado
  const DEGS = [{ o: 0, m: false }, { o: 2, m: true }, { o: 4, m: true }, { o: 5, m: false }, { o: 7, m: false }, { o: 9, m: true }, { o: 10, m: false }];
  const N = 4096, H = 1024;

  function pearson(a, b) {
    const n = a.length; let ma = 0, mb = 0;
    for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
    ma /= n; mb /= n;
    let s = 0, sa = 0, sb = 0;
    for (let i = 0; i < n; i++) { const x = a[i] - ma, y = b[i] - mb; s += x * y; sa += x * x; sb += y * y; }
    return sa && sb ? s / Math.sqrt(sa * sb) : 0;
  }

  function makeFFT(n) {
    const lev = Math.log2(n), rev = new Uint32Array(n);
    for (let i = 0; i < n; i++) { let r = 0, x = i; for (let l = 0; l < lev; l++) { r = (r << 1) | (x & 1); x >>= 1; } rev[i] = r; }
    const co = new Float32Array(n / 2), si = new Float32Array(n / 2);
    for (let i = 0; i < n / 2; i++) { co[i] = Math.cos(2 * Math.PI * i / n); si[i] = Math.sin(2 * Math.PI * i / n); }
    return (re, im) => {
      for (let i = 0; i < n; i++) { const j = rev[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
      for (let size = 2; size <= n; size *= 2) {
        const h = size / 2, st = n / size;
        for (let i = 0; i < n; i += size) for (let j = 0, k = 0; j < h; j++, k += st) {
          const l = i + j + h, tr = re[l] * co[k] + im[l] * si[k], ti = -re[l] * si[k] + im[l] * co[k];
          re[l] = re[i + j] - tr; im[l] = im[i + j] - ti; re[i + j] += tr; im[i + j] += ti;
        }
      }
    };
  }

  /** AudioBuffer → mono em ~11 kHz. */
  function mono(buf) {
    const sr0 = buf.sampleRate, fac = Math.max(1, Math.round(sr0 / 11025)), sr = sr0 / fac, L = Math.floor(buf.length / fac);
    const x = new Float32Array(L), chs = [];
    for (let c = 0; c < buf.numberOfChannels; c++) chs.push(buf.getChannelData(c));
    const nc = chs.length * fac;
    for (let i = 0; i < L; i++) { let s = 0; const b = i * fac; for (let j = 0; j < fac; j++) for (let c = 0; c < chs.length; c++) s += chs[c][b + j]; x[i] = s / nc; }
    return { x, sr };
  }

  /** Envelope de ataques e andamento por autocorrelação (preferência perto de 100 BPM). */
  function tempo(x, sr) {
    const hop = 128, win = 256, n = Math.max(0, Math.floor((x.length - win) / hop)), e = new Float32Array(n);
    for (let i = 0; i < n; i++) { let s = 0; const o = i * hop; for (let j = 0; j < win; j++) { const v = x[o + j]; s += v * v; } e[i] = Math.log(1e-7 + s); }
    const on = new Float32Array(n);
    for (let i = 1; i < n; i++) { const d = e[i] - e[i - 1]; on[i] = d > 0 ? d : 0; }
    const M = 32, o2 = new Float32Array(n); let acc = 0;
    for (let i = 0; i < n; i++) { acc += on[i]; if (i >= M) acc -= on[i - M]; const v = on[i] - acc / Math.min(i + 1, M); o2[i] = v > 0 ? v : 0; }
    const hs = hop / sr, lo = Math.floor(60 / 180 / hs), hi = Math.ceil(60 / 55 / hs), sc = [];
    let best = -1, bl = lo;
    for (let lag = lo; lag <= hi; lag++) {
      let s = 0; for (let i = 0; i + lag < n; i++) s += o2[i] * o2[i + lag];
      const bpm = 60 / (lag * hs), w = Math.exp(-0.5 * Math.pow(Math.log2(bpm / 100) / 0.9, 2));
      sc[lag] = s * w; if (sc[lag] > best) { best = sc[lag]; bl = lag; }
    }
    let lag = bl;
    if (bl > lo && bl < hi) { const a = sc[bl - 1], b = sc[bl], c = sc[bl + 1], den = a - 2 * b + c; if (den) lag = bl + 0.5 * (a - c) / den; }
    return { on: o2, hs, lag, beat: lag * hs, bpm: 60 / (lag * hs) };
  }

  /** Batidas por programação dinâmica: acompanha quando o andamento varia. */
  function beats(Tp) {
    const on = Tp.on, n = on.length, p = Tp.lag, hs = Tp.hs;
    if (!n) return [];
    let m = 0; for (let i = 0; i < n; i++) m += on[i]; m /= n;
    let sd = 0; for (let i = 0; i < n; i++) sd += (on[i] - m) ** 2; sd = Math.sqrt(sd / n) || 1;
    const lo = Math.max(1, Math.round(p * 0.5)), hi = Math.round(p * 2), pen = new Float32Array(hi + 1);
    for (let d = lo; d <= hi; d++) pen[d] = 60 * Math.log(d / p) ** 2;
    const sc = new Float32Array(n), bk = new Int32Array(n).fill(-1);
    for (let t = 0; t < n; t++) {
      let best = -1e9, bi = -1;
      for (let d = lo; d <= hi && t - d >= 0; d++) { const v = sc[t - d] - pen[d]; if (v > best) { best = v; bi = t - d; } }
      if (bi >= 0 && best > 0) { sc[t] = on[t] / sd + best; bk[t] = bi; } else sc[t] = on[t] / sd;
    }
    let t = n - 1, bv = -1e9;
    for (let i = Math.max(0, n - Math.ceil(p)); i < n; i++) if (sc[i] > bv) { bv = sc[i]; t = i; }
    const b = []; while (t >= 0) { b.push(t * hs); t = bk[t]; }
    b.reverse();
    const step = p * hs; while (b.length && b[0] - step > 0.05) b.unshift(b[0] - step);
    if (b.length > 2) { const iv = []; for (let i = 1; i < b.length; i++) iv.push(b[i] - b[i - 1]); iv.sort((x, y) => x - y); Tp.beat = iv[iv.length >> 1]; Tp.bpm = 60 / Tp.beat; }
    return b;
  }

  /** Cromagrama (12 classes de altura) e graves por quadro. Processa `count` quadros por chamada. */
  function chromaStart(x, sr) {
    const nF = Math.max(0, Math.floor((x.length - N) / H) + 1);
    const han = new Float32Array(N); for (let i = 0; i < N; i++) han[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N);
    const binPc = new Int8Array(N / 2).fill(-1), binB = new Uint8Array(N / 2);
    for (let b = 1; b < N / 2; b++) { const f = b * sr / N; if (f < 80 || f > 2500) continue; binPc[b] = T.mod(Math.round(69 + 12 * Math.log2(f / 440))); binB[b] = f < 260 ? 1 : 0; }
    return { x, sr, nF, f: 0, fft: makeFFT(N), han, binPc, binB, chroma: new Float32Array(nF * 12), bass: new Float32Array(nF * 12), rms: new Float32Array(nF), re: new Float32Array(N), im: new Float32Array(N) };
  }
  function chromaStep(st, count) {
    const { x, re, im, han, binPc, binB, chroma, bass, rms } = st;
    const end = Math.min(st.nF, st.f + count);
    for (let f = st.f; f < end; f++) {
      const off = f * H; let r = 0;
      for (let i = 0; i < N; i++) { const v = x[off + i]; r += v * v; re[i] = v * han[i]; im[i] = 0; }
      rms[f] = Math.sqrt(r / N); st.fft(re, im);
      for (let b = 1; b < N / 2; b++) { const p = binPc[b]; if (p < 0) continue; const m = Math.sqrt(re[b] * re[b] + im[b] * im[b]); chroma[f * 12 + p] += m; if (binB[b]) bass[f * 12 + p] += m; }
      let mx = 0, mb = 0; for (let p = 0; p < 12; p++) { mx = Math.max(mx, chroma[f * 12 + p]); mb = Math.max(mb, bass[f * 12 + p]); }
      for (let p = 0; p < 12; p++) { if (mx) chroma[f * 12 + p] /= mx; if (mb) bass[f * 12 + p] /= mb; }
    }
    st.f = end;
    return st.f >= st.nF;
  }

  /** Janelas de meio compasso (2 batidas) com o cromagrama somado (pesado pelo volume). */
  function windows(st, bt, dur, beat) {
    const W = [];
    for (let i = 0; i < bt.length; i += 2) {
      const a = bt[i], b = i + 2 < bt.length ? bt[i + 2] : Math.min(dur, a + 2 * beat); if (b - a < 0.2) continue;
      const c = new Float32Array(12), bs = new Float32Array(12); let r = 0, n = 0;
      const f0 = Math.max(0, Math.ceil((a * st.sr - N / 2) / H)), f1 = Math.min(st.nF - 1, Math.floor((b * st.sr - N / 2) / H));
      for (let f = f0; f <= f1; f++) { const w = st.rms[f]; for (let p = 0; p < 12; p++) { c[p] += st.chroma[f * 12 + p] * w; bs[p] += st.bass[f * 12 + p] * w; } r += w; n++; }
      W.push({ a, b, c, bs, r: n ? r / n : 0 });
    }
    return W;
  }

  /** Tom: compara a soma do cromagrama com os perfis maior e menor nos 12 tons. key = tom maior (ou relativo maior). */
  function keyOf(W) {
    const s = new Float32Array(12); W.forEach(w => { for (let p = 0; p < 12; p++) s[p] += w.c[p]; });
    let best = -9, key = 0, minor = false, root = 0;
    for (let r = 0; r < 12; r++) {
      const pm = [], pn = []; for (let i = 0; i < 12; i++) { pm[i] = MAJ[T.mod(i - r)]; pn[i] = MIN[T.mod(i - r)]; }
      const a = pearson(s, pm), b = pearson(s, pn);
      if (a > best) { best = a; key = r; minor = false; root = r; }
      if (b > best) { best = b; key = T.mod(r + 3); minor = true; root = r; }
    }
    return { key, minor, root };
  }

  /** Acorde (grau) de cada janela: modelo de tríades + graves, suavizado por Viterbi (trocar custa). -1 = silêncio. */
  function chordPath(W, k) {
    const E = W.map(w => {
      let mb = 0; for (let p = 0; p < 12; p++) mb = Math.max(mb, w.bs[p]); mb = mb || 1;
      return DEGS.map((D, i) => {
        const r = T.mod(k + D.o), t = new Array(12).fill(0); t[r] = 1; t[T.mod(r + (D.m ? 3 : 4))] = 1; t[T.mod(r + 7)] = 1;
        return pearson(w.c, t) + 0.35 * (w.bs[r] / mb) - (i === 6 ? 0.12 : 0);
      });
    });
    if (!E.length) return [];
    const P = 0.25, bp = [], S7 = DEGS.length;
    let sc = E[0].slice();
    for (let t = 1; t < E.length; t++) {
      const ns = [], b = [];
      for (let s = 0; s < S7; s++) { let bv = -1e9, bi = 0; for (let s2 = 0; s2 < S7; s2++) { const v = sc[s2] - (s2 === s ? 0 : P); if (v > bv) { bv = v; bi = s2; } } ns[s] = bv + E[t][s]; b[s] = bi; }
      sc = ns; bp.push(b);
    }
    const path = new Array(E.length); let cur = 0, bv = -1e9;
    sc.forEach((v, i) => { if (v > bv) { bv = v; cur = i; } });
    for (let t = E.length - 1; t >= 0; t--) { path[t] = cur; if (t > 0) cur = bp[t - 1][cur]; }
    const rs = W.map(w => w.r).sort((a, b) => a - b), thr = 0.08 * (rs[Math.floor(rs.length * 0.9)] || 0);
    W.forEach((w, i) => { if (w.r < thr) path[i] = -1; });
    return path;
  }

  function finish(st, Tp, bt) {
    const dur = st.x.length / st.sr, W = windows(st, bt, dur, Tp.beat), K = keyOf(W), path = chordPath(W, K.key), bars = [];
    for (let i = 0; i < W.length; i += 2) bars.push([Math.round(W[i].a * 100) / 100, path[i], i + 1 < path.length ? path[i + 1] : path[i]]);
    return { key: K.key, minor: K.minor, bpm: Math.round(Tp.bpm), dur: Math.round(dur * 10) / 10, bars };
  }

  /** Análise completa (síncrona; usada nos testes). bars = [[início em s, grau 1ª metade, grau 2ª metade]] */
  function analyzeSync(x, sr) {
    const Tp = tempo(x, sr), bt = beats(Tp), st = chromaStart(x, sr);
    chromaStep(st, Infinity);
    return finish(st, Tp, bt);
  }
  /** Mesma análise, cedendo a vez para a tela atualizar (onProg recebe 0..1). */
  async function analyze(x, sr, onProg) {
    const wait = () => new Promise(r => setTimeout(r, 0));
    onProg && onProg(0.05); await wait();
    const Tp = tempo(x, sr), bt = beats(Tp), st = chromaStart(x, sr);
    while (!chromaStep(st, 80)) { onProg && onProg(0.1 + 0.85 * st.f / st.nF); await wait(); }
    return finish(st, Tp, bt);
  }

  return { mono, analyze, analyzeSync, DEGS };
})();
