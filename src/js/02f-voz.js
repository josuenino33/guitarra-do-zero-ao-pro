/* ===== Voz: lê as aulas em voz alta (voz do próprio aparelho, sem internet e sem custo) =====
   No navegador usa speechSynthesis; no app Android (Capacitor) usa o plugin
   @capacitor-community/text-to-speech, porque o WebView do Android não tem speechSynthesis.
   VOZ.fala(texto) transforma a escrita musical em fala: “Em7” → “Mi menor com sétima”,
   “I – V – vi – IV” → “um, cinco, seis, quatro”, “3:7h” → “corda 3, casa 7, hammer-on”. */
const VOZ = (() => {
  /* ---------- texto → fala ---------- */
  const NOTE = { C:'Dó', D:'Ré', E:'Mi', F:'Fá', G:'Sol', A:'Lá', B:'Si' };
  const ACC = { '#':' sustenido', '♯':' sustenido', 'b':' bemol', '♭':' bemol' };
  const NUM = { 2:'segunda', 3:'terça', 4:'quarta', 5:'quinta', 6:'sexta', 7:'sétima', 9:'nona', 11:'décima primeira', 13:'décima terceira' };
  const ALT = { 'b':'menor', '♭':'menor', '#':'aumentada', '♯':'aumentada' };
  const ROM = '(?<![\\p{L}\\d])([b♭#♯]?)(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)(°|ø|7M|7)?(?![\\p{L}\\d])';
  const ROM_NC = ROM.replace(/\((?!\?)/g, '(?:');
  const RE_ROM1 = /^([b♭#♯]?)(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)(°|ø|7M|7)?$/u;
  const RE_ROMAN_RUN = new RegExp(ROM_NC + '(?:(?:\\s+|\\s*[–—-]\\s*)' + ROM_NC + '){2,}', 'gu');
  const roman = (a, r, q) => (a ? (/[b♭]/.test(a) ? 'bemol ' : 'sustenido ') : '') + ROMAN[r.toUpperCase()]
    + (q === '7' ? ' com sétima' : q === '7M' ? ' com sétima maior' : q === 'ø' ? ' meio diminuto' : q ? ' diminuto' : '');
  const ROMAN = { I:'um', II:'dois', III:'três', IV:'quatro', V:'cinco', VI:'seis', VII:'sete' };
  // cifras que também são palavras em português (“A guitarra”, “E depois”, “Em cada troca”)
  const AMBIGUOUS = new Set(['A', 'E', 'Em']);

  const CHORD = '[A-G](?:#|♯|b(?![a-ln-z])|♭)?(?:maj7|7M|M7|m(?!aj)|°7?|º7?|dim7?|aum|\\+|sus[24]?|add(?:9|11|2|4)|1[13]|[2345679])*(?:\\([^)\\s]{1,12}\\))?(?:\\/[A-G](?:#|♯|b|♭)?)?';
  const L = '(?<![\\p{L}\\d/])', R = '(?![\\p{L}\\d])';
  const RE_CHORD = new RegExp(L + '(' + CHORD + ')' + R, 'gu');
  const RE_RUN = new RegExp(L + CHORD + '(?:\\s*(?:[–—\\-→,]|\\be\\b)?\\s*' + CHORD + ')+' + R, 'gu');
  const RE_GAP = new RegExp('(' + CHORD + ')\\s+(?=' + CHORD + R + ')', 'gu');
  const RE_ONLY = new RegExp('^\\s*' + CHORD + '(?:\\s*(?:[–—\\-→,]|\\be\\b)?\\s*' + CHORD + ')*\\s*$', 'u');

  function noteName(s) { return NOTE[s[0]] + (ACC[s[1]] || ''); }

  function ext(x) {
    // extensões dentro de parênteses ou soltas: “9”, “b5”, “#9”, “11”
    return x.split(/[,\s]+/).filter(Boolean).map(e => {
      const m = e.match(/^([b♭#♯])?(\d{1,2})$/);
      if (!m) return e;
      return (NUM[m[2]] || m[2]) + (m[1] ? ' ' + (m[2] === '5' && /[b♭]/.test(m[1]) ? 'diminuta' : ALT[m[1]]) : '');
    }).join(' e ');
  }

  /** “C♯m7(b5)/E” → “Dó sustenido menor com sétima e quinta diminuta, com baixo em Mi” */
  function chord(c) {
    const m = c.match(/^([A-G](?:#|♯|b|♭)?)(.*?)(?:\(([^)]*)\))?(?:\/([A-G](?:#|♯|b|♭)?))?$/u);
    if (!m) return c;
    let q = m[2], words = [], withs = [];
    const take = re => { const k = q.match(re); if (k) q = q.slice(k[0].length); return k; };
    for (let guard = 0; q && guard < 8; guard++) {
      if (take(/^(maj7|7M|M7)/)) withs.push('sétima maior');
      else if (take(/^m(?!aj)/)) words.push('menor');
      else if (take(/^(°7|º7|dim7)/)) words.push('diminuto com sétima');
      else if (take(/^(°|º|dim)/)) words.push('diminuto');
      else if (take(/^(\+|aum)/)) words.push('aumentado');
      else if (take(/^sus2/)) words.push('sus dois');
      else if (take(/^sus4?/)) words.push('sus quatro');
      else if (take(/^add(9|2)/)) withs.push('nona');
      else if (take(/^add(11|4)/)) withs.push('décima primeira');
      else if (take(/^5/)) words.push('cinco');
      else { const k = take(/^(13|11|9|7|6|2|4)/); if (k) withs.push(NUM[k[1]]); else break; }
    }
    if (m[3]) withs.push(ext(m[3]));
    // m7(b5) → meio diminuto
    if (words[0] === 'menor' && withs[0] === 'sétima' && withs[1] === 'quinta diminuta') { words = ['meio diminuto']; withs = []; }
    let out = noteName(m[1]);
    if (words.length) out += ' ' + words.join(' ');
    if (withs.length) out += ' com ' + withs.join(' e ');
    if (m[4]) out += ', com baixo em ' + noteName(m[4]);
    return out;
  }

  // “A”, “E” e “Em” só são cifra no meio da frase (em português o artigo e a conjunção vêm em minúscula ali)
  const midSentence = (all, off) => { const b = all.slice(0, off).replace(/\s+$/, ''); return !!b && !/[.!?:;\n\u0001]$/.test(b); };
  function chordsIn(s, all) {
    return s.replace(RE_CHORD, (k, c, off, str) => (!all && AMBIGUOUS.has(c) && !midSentence(str, off)) ? k : chord(c));
  }
  // qualidades soltas no texto (“add9 e sus2 no I”)
  const QUAL = { add9:'add nove', add2:'add dois', sus2:'sus dois', sus4:'sus quatro', '7M':'sétima maior', maj7:'sétima maior',
    m7:'menor com sétima', m9:'menor com nona', m11:'menor com décima primeira', 'm7(b5)':'meio diminuto', 'm7(♭5)':'meio diminuto', '°':'diminuto', '°7':'diminuto com sétima' };

  /** Texto já sem HTML → texto para falar. Trechos entre \u0001…\u0002 são cifras (vieram de <b>). */
  function fala(txt) {
    let s = String(txt)
      .replace(/\bBPM\u0002?\s*\(batidas por minuto\)/g, 'batidas por minuto\u0002').replace(/\bPM\s+(?=palm mute)/g, '')
      // explicação da cifra: “C Dó, D Ré” → a letra é soletrada, não vira acorde
      .replace(/(?<![\p{L}\d])([A-G]) (Dó|Ré|Mi|Fá|Sol|Lá|Si)(?![\p{L}])/gu, (k, l, n) => NOTE[l] === n ? `letra ${l.toLowerCase()}\u0005 ${n}` : k);
    // trechos marcados como cifra: converte tudo, inclusive A, E e Em
    s = s.replace(/\u0001([^\u0002]*)\u0002/g, (_, x) => RE_ONLY.test(x) ? chordsIn(x.replace(RE_GAP, '$1, '), true) : x);
    // tablatura curta: “3:7h”, “2:8b2r”
    s = s.replace(/(?<![\p{L}\d])([1-6]):(\d{1,2})([hp\/~mrbnt]\d?)*(?![\p{L}\d])/gu, (k, c, f) => {
      const t = k.slice(c.length + 1 + f.length), tec = [];
      if (/h/.test(t)) tec.push('hammer-on'); if (/p/.test(t)) tec.push('pull-off'); if (/\//.test(t)) tec.push('slide');
      if (/b/.test(t)) tec.push('bend'); if (/r/.test(t)) tec.push('release'); if (/~/.test(t)) tec.push('vibrato');
      return `corda ${c}, casa ${f}` + (tec.length ? ', ' + tec.join(', ') : '') + ',';
    });
    // sequências de cifras (G – D – Em – C): aí A, E e Em também são acordes
    s = s.replace(RE_RUN, run => chordsIn(run.replace(RE_GAP, '$1, '), true));
    s = s.replace(/<(\d+)>/g, '$1').replace(/\s*\(3NPS\)/g, '').replace(/(?<![\p{L}\d])7\(([^)]*)\)/gu, (_, x) => 'sete com ' + ext(x));
    // cifras soltas e sem ambiguidade (Cadd9, F♯m, C#m7(b5), G)
    s = chordsIn(s, false);
    // campos harmônicos em romanos: “I ii iii IV V vi vii°”, “i ii° ♭III iv v ♭VI ♭VII” (aqui i e v minúsculos também valem)
    s = s.replace(RE_ROMAN_RUN, run => run.split(/\s*[–—-]\s*|\s+/).map(t => t.replace(RE_ROM1, (k, a, r, q) => roman(a, r, q))).join(', '));
    s = s.replace(/(?<=\b(?:o|no|do|ao|pro|para o)\s)(i|v)(?![\p{L}\d])/gu, (_, r) => roman('', r, ''));
    s = s.replace(/(?<![\p{L}\d#♯♭])(m7\([b♭]5\)|add9|add2|sus2|sus4|7M|maj7|m11|m7|m9|°7)(?![\p{L}\d])/gu, (_, q) => QUAL[q]).replace(/(?<![\p{L}\d])ø(?![\p{L}\d])/gu, 'meio diminuto');
    // graus alterados: ♭3, b7, ♯11
    s = s.replace(/(?<![\p{L}\d])([b♭#♯])(13|11|9|[2-7])(?![\p{L}\d])/gu, (_, a, n) => NUM[n] + ' ' + (n === '5' && /[b♭]/.test(a) ? 'diminuta' : ALT[a]));
    // graus em algarismo romano: I, IV, V7, vi, ii–V–I
    s = s.replace(/(?<![\p{L}\d])([b♭#♯]?)(VII|VI|IV|V|III|II|I|vii|vi|iv|iii|ii)(°|ø|7M|7)?(?![\p{L}\d])/gu, (k, a, r, q, off, all) => {
      if (r === 'vi' && /\beu\s+$/i.test(all.slice(Math.max(0, off - 4), off))) return k;   // “eu vi”
      return roman(a, r, q);
    });
    // intervalos escritos com ª, tônica “R”, fórmulas e compassos
    s = s.replace(/(?<![\p{L}\d])(13|11|[2-9])ª/gu, (_, n) => n === '8' ? 'oitava' : NUM[n])
      .replace(/(?<![\p{L}\d])R(?![\p{L}\d])/gu, 'tônica').replace(/\(\s*=\s*/g, '(igual a ').replace(/\s+=\s+/g, ' é ').replace(/\s+\+\s+/g, ' mais ')
      .replace(/(?<![\d:])(\d{1,2})\/(\d{1,2})(?!\d)/g, '$1 por $2');
    // cordas e números em sequência: “1-2-3” → “1, 2 e 3”
    s = s.replace(/(?<![\d:])(\d)(?:-(\d)){1,4}(?![\d:])/g, k => { const p = k.split('-'); return p.slice(0, -1).join(', ') + ' e ' + p[p.length - 1]; });
    s = s.replace(/(\d+)\s*BPM/g, '$1 batidas por minuto').replace(/\bBPM\b/g, 'andamento')
      .replace(/(\d)\s*ms\b/g, '$1 milissegundos').replace(/\s*÷\s*/g, ' dividido por ').replace(/\s*×\s*/g, ' vezes ')
      .replace(/[\p{Extended_Pictographic}\uFE0F\u200D\u{1D100}-\u{1D1FF}]/gu, '').replace(/\u0005/g, ',')
      .replace(/(\p{L})♯/gu, '$1 sustenido').replace(/(\p{L})♭/gu, '$1 bemol')
      .replace(/♯/g, 'sustenido').replace(/♭/g, 'bemol').replace(/♮/g, 'bequadro')
      .replace(/\s*↓\s*/g, ' baixo, ').replace(/\s*↑\s*/g, ' cima, ').replace(/,\s+-(?=\s)/g, ',').replace(/\(\s+/g, '(').replace(/[,\s]+\)/g, ')')
      .replace(/\b(\d+)x\b/g, '$1 vezes').replace(/\bPM\b/g, 'palm mute').replace(/\bCAGED\b/g, 'cáged')
      .replace(/\s*→\s*/g, ', depois, ').replace(/\s+[–—]\s+/g, ', ').replace(/[–—]/g, ', ')
      .replace(/[“”"«»]/g, '').replace(/\s*…/g, '.').replace(/[•·]/g, ',')
      .replace(/([.,;:!?])\1+/g, '$1').replace(/,\s*([.,;:!?])/g, '$1').replace(/\s{2,}/g, ' ').replace(/[,\s]+$/, '').trim();
    return s;
  }

  /** Quebra um trecho longo em frases (alguns navegadores cortam falas longas). */
  function frases(s, max = 220) {
    if (s.length <= max) return [s];
    const out = [];
    let cur = '';
    for (const p of s.split(/(?<=[.!?;:])\s+/)) {
      if ((cur + ' ' + p).trim().length > max && cur) { out.push(cur); cur = p; } else cur = (cur + ' ' + p).trim();
    }
    if (cur) out.push(cur);
    return out.flatMap(x => x.length <= max ? [x] : x.split(/(?<=,)\s+/));
  }

  /** Texto de um elemento, com <b> que contém só cifra marcado para virar acorde. */
  function textOf(node) {
    let s = '';
    node.childNodes.forEach(n => {
      if (n.nodeType === 3) s += n.nodeValue;
      else if (n.nodeType === 1) {
        if (n.matches('svg, script, style, .no-voz, button')) return;
        const t = n.textContent;
        s += (n.tagName === 'B' || n.tagName === 'STRONG') && RE_ONLY.test(t) ? '\u0001' + t + '\u0002' : textOf(n);
        if (/^(BR|LI|P|DIV)$/.test(n.tagName)) s += '. ';
      }
    });
    return s;
  }

  /* ---------- motor de fala ---------- */
  const W = typeof window !== 'undefined' ? window : null;
  const nativeTTS = () => {
    const C = W && W.Capacitor;
    if (!C || !(C.isNativePlatform ? C.isNativePlatform() : C.platform && C.platform !== 'web')) return null;
    try { return (C.Plugins && C.Plugins.TextToSpeech) || (C.registerPlugin && C.registerPlugin('TextToSpeech')) || null; } catch (e) { return null; }
  };
  const synth = () => (W && W.speechSynthesis && typeof W.SpeechSynthesisUtterance === 'function') ? W.speechSynthesis : null;
  const available = () => !!(nativeTTS() || synth());

  let voicesCache = null;
  /** Vozes em português: [{ id, name, lang }] (id = nome no navegador, índice no app Android) */
  async function voices() {
    const nat = nativeTTS();
    if (nat) {
      try {
        const r = await nat.getSupportedVoices();
        return (r.voices || []).map((v, i) => ({ id: String(i), name: v.name, lang: v.lang })).filter(v => /^pt/i.test(v.lang));
      } catch (e) { return []; }
    }
    const sy = synth(); if (!sy) return [];
    let list = sy.getVoices();
    if (!list.length) list = await new Promise(res => {
      const t = setTimeout(() => res(sy.getVoices()), 1500);
      sy.addEventListener('voiceschanged', () => { clearTimeout(t); res(sy.getVoices()); }, { once: true });
    });
    voicesCache = list;
    return list.filter(v => /^pt/i.test(v.lang)).map(v => ({ id: v.name, name: v.name, lang: v.lang }));
  }

  // voz preferida quando o usuário não escolheu: pt-BR natural/online primeiro
  function pickVoice(list, want) {
    const pt = list.filter(v => /^pt/i.test(v.lang));
    return pt.find(v => v.name === want)
      || pt.find(v => /pt[-_]BR/i.test(v.lang) && /natural|online|neural|google|francisca|antonio|thalita|luciana|felipe/i.test(v.name))
      || pt.find(v => /pt[-_]BR/i.test(v.lang)) || pt[0] || null;
  }

  const prefs = () => { try { const st = S.get().settings; return { rate: +st.vozRate || 1, voice: st.vozName || '' }; } catch (e) { return { rate: 1, voice: '' }; } };

  let token = 0;
  /** Fala um trecho; resolve quando termina (ou quando é interrompido). */
  function say(text) {
    const my = ++token, p = prefs();
    const nat = nativeTTS();
    if (nat) {
      const opt = { text, lang: 'pt-BR', rate: p.rate, pitch: 1, volume: 1, category: 'playback' };
      if (p.voice !== '' && !isNaN(+p.voice)) opt.voice = +p.voice;
      return nat.speak(opt).catch(() => {}).then(() => my === token);
    }
    const sy = synth(); if (!sy) return Promise.resolve(false);
    return new Promise(res => {
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(voicesCache || sy.getVoices(), p.voice);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'pt-BR';
      u.rate = p.rate;
      let done = false;
      const fin = () => { if (!done) { done = true; clearInterval(keep); res(my === token); } };
      u.onend = fin; u.onerror = fin;
      // Chrome no PC pausa sozinho falas longas: um “resume” periódico evita isso
      const keep = setInterval(() => { if (!sy.speaking) return fin(); if (!sy.paused) sy.resume(); }, 5000);
      sy.speak(u);
    });
  }

  function silence() {
    token++;
    const nat = nativeTTS(); if (nat) { try { nat.stop(); } catch (e) {} }
    const sy = synth(); if (sy) sy.cancel();
  }

  /* ---------- leitor de uma página: trechos com destaque ---------- */
  /**
   * Cria um leitor para uma lista de partes: [{ el, text }]. Cada parte é lida e destacada.
   * onState(estado, índice) avisa a tela: 'play' | 'pause' | 'stop'.
   */
  function reader(parts, onState) {
    let i = 0, state = 'stop', run = 0;
    const mark = () => parts.forEach((p, k) => p.el && p.el.classList.toggle('voz-on', state !== 'stop' && k === i));
    const set = s => { state = s; mark(); onState && onState(state, i); };

    async function loop() {
      const my = ++run;
      while (i < parts.length && my === run && state === 'play') {
        mark(); onState && onState(state, i);
        const el = parts[i].el;
        if (el && el.scrollIntoView) {
          const r = el.getBoundingClientRect(), h = W.innerHeight || 800;
          if (r.top < 70 || r.bottom > h - 40) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        for (const f of frases(parts[i].text)) {
          if (my !== run || state !== 'play') return;
          if (!(await say(f))) return;
        }
        if (my !== run || state !== 'play') return;
        i++;
      }
      if (my === run && state === 'play') { i = 0; set('stop'); }
    }

    return {
      get state() { return state; }, get index() { return i; }, parts,
      play(at) { if (at != null) i = Math.max(0, Math.min(parts.length - 1, at)); silence(); set('play'); loop(); },
      pause() { if (state !== 'play') return; run++; silence(); set('pause'); },
      toggle() { state === 'play' ? this.pause() : this.play(); },
      stop() { run++; silence(); i = 0; set('stop'); },
      step(d) { const was = state; i = Math.max(0, Math.min(parts.length - 1, i + d)); if (was === 'play') this.play(); else { mark(); onState && onState(state, i); } },
    };
  }

  /** Partes de uma aula: título, cada parágrafo/item do texto e as tarefas de “Pratique”. */
  function lessonParts(root, title) {
    const parts = [];
    const head = root.querySelector('.lesson-head h1');
    parts.push({ el: head, text: fala(title || head.textContent) + '.' });
    root.querySelectorAll('.prose > p, .prose > ul > li, .prose > ol > li, .prose > h2, .prose > h3, .prose > blockquote, .prose > div').forEach(el => {
      const t = fala(textOf(el)); if (t.replace(/[\s.,;:!?]/g, '')) parts.push({ el, text: t });
    });
    const tasks = [...root.querySelectorAll('.practice .tasks > li')];
    tasks.forEach((el, k) => parts.push({ el, text: (k ? '' : 'Para praticar. ') + fala(textOf(el)) }));
    return parts;
  }

  return { available, voices, pickVoice, say, silence, reader, lessonParts, fala, chord, textOf, frases,
    test() { silence(); say(fala('Olá! Esta é a voz que vai ler as aulas. Vamos tocar G – D – Em – C, o I – V – vi – IV.')); } };
})();
