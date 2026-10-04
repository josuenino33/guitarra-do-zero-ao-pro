/* ===== Treino de ouvido: exercícios em níveis, pontos fracos e ditado melódico ===== */
function quizTabs(active) {
  return `<nav class="subtabs">${[['quiz', 'quiz', 'Quizzes do braço'], ['ouvido', 'ouvido', 'Treino de ouvido']]
    .map(([k, h, l]) => `<a href="#${h}" class="${k === active ? 'on' : ''}">${l}</a>`).join('')}</nav>`;
}

const EAR = (() => {
  const PASS = 80, ROUNDS = 10;
  const rnd = n => Math.floor(Math.random() * n), pick = a => a[rnd(a.length)];
  const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const latin = () => U.set().latin;
  const ivName = i => i === 12 ? 'Oitava' : T.IV_NAME[i];
  const ivMark = i => i === 12 ? '8' : T.ivLabel(i);
  const DEG = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
  const ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  const DIR = { asc: 'subindo', desc: 'descendo', harm: 'juntas' };
  const fmt = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  const nameOf = (m, flats) => T.noteName(m, flats, latin());

  // músicas conhecidas que começam com o intervalo: ajudam a reconhecer de ouvido
  const SONG_UP = { 1:'Tubarão (tema do filme)', 2:'Parabéns pra você (“ra → béns”)', 3:'Smoke on the Water (riff)', 4:'When the Saints Go Marching In',
    5:'Marcha nupcial', 6:'Os Simpsons (abertura)', 7:'Brilha, brilha, estrelinha', 8:'The Entertainer (o salto depois das 3 primeiras notas)',
    9:'My Bonnie Lies Over the Ocean', 10:'Star Trek (tema clássico)', 11:'Take On Me (refrão)', 12:'Over the Rainbow (“some-where”)' };
  const SONG_DOWN = { 1:'Für Elise (início)', 2:'Yesterday (Beatles)', 3:'Hey Jude (“hey Jude”)', 4:'5ª Sinfonia de Beethoven (pa-pa-pa-pam)',
    5:'Eine kleine Nachtmusik (Mozart, início)', 7:'Os Flintstones (“Flint-stones”)' };
  const CHORD_TIP = { maior:'som aberto e estável', menor:'som mais escuro, melancólico', dim:'tenso e instável, clima de suspense',
    aum:'flutuante, “sem chão”, de sonho', sus2:'aberto e sem 3ª: nem maior nem menor', sus4:'parece pedir para resolver na 3ª',
    maj7:'suave e sofisticado, som de bossa nova', dom7:'som de blues, pede resolução', m7:'menor relaxado, de soul e jazz',
    m7b5:'menor tenso, o ii do tom menor', dim7:'muito tenso e simétrico, trilha de filme mudo' };
  const DEG_TIP = { 0:'repouso, soa como “casa”', 2:'passagem, quer descer para o 1', 4:'estável, é a nota que define o tom maior',
    5:'pede para cair no 3', 7:'forte e estável, mas ainda não é casa', 9:'suave, um pouco melancólico', 11:'sensível: puxa com força para o 1',
    3:'é a nota que define o tom menor', 8:'triste, puxa para o 5', 10:'som de blues e de rock, o 7 “abaixado”',
    1:'muito tenso, cor do modo frígio', 6:'trítono, cor do modo lídio' };

  /** Casa mais confortável para uma altura, perto da casa `near` (sem repetir a posição `avoid`). */
  function place(midi, near = 5, avoid) {
    let best = null;
    for (let s = 0; s < 6; s++) {
      const f = midi - T.TUNING[s];
      if (f < 0 || f > 15 || (avoid && avoid.s === s && avoid.f === f)) continue;
      const d = Math.abs(f - near) + (avoid && avoid.s === s ? 0.6 : 0);
      if (!best || d < best.d) best = { s, f, d };
    }
    return best;
  }
  /** Duas notas em sequência (a → b) ou juntas. */
  function pair(a, b, together) {
    A.stopAll(); const t = A.now() + 0.05;
    if (together) { A.play(a, t, { dur: 1.8, vel: 0.65 }); A.play(b, t + 0.01, { dur: 1.8, vel: 0.65 }); }
    else { A.play(a, t, { dur: 0.9 }); A.play(b, t + 0.75, { dur: 1.2 }); }
  }
  /** Cadência I–IV–V–I que firma o tom. Devolve o instante em que a próxima nota pode entrar. */
  function cadence(hz, t, step = 0.55) {
    [0, 3, 4, 0].forEach((d, i) => CH.strum(hz[d].triad, t + i * step, { dur: i === 3 ? step * 1.4 : step * 0.95, vel: 0.5 }));
    return t + 4 * step + 0.35;
  }
  const chordName = (r, q) => prettyChord(T.spellAscii(T.spellChord(r, q).root) + (QUAL_SUFFIX[q] ?? ''));
  const keyName = (r, scale) => T.spellName(T.spellScale(r, scale).root, latin());

  // ditado: o microfone fica ligado entre as perguntas enquanto a tela estiver aberta
  const DIT = { mic: false };
  let micHandler = null;

  const EX = [
    {
      id: 'intervalos', title: 'Intervalos', desc: 'Ouça duas notas e diga a distância entre elas.',
      levels: [
        { items: [4, 7, 12], dir: 'asc', label: '3ª maior, 5ª justa e oitava, subindo' },
        { items: [4, 5, 7, 12], dir: 'asc', label: '3ª maior, 4ª justa, 5ª justa e oitava, subindo' },
        { items: [3, 4, 5, 7, 12], dir: 'asc', label: '3ª menor, 3ª maior, 4ª, 5ª e oitava, subindo' },
        { items: [2, 3, 4, 5, 7, 9, 12], dir: 'asc', label: 'Entram a 2ª maior e a 6ª maior (7 intervalos), subindo' },
        { items: [2, 3, 4, 5, 7, 8, 9, 10, 12], dir: 'asc', label: 'Entram a 6ª menor e a 7ª menor (9 intervalos), subindo' },
        { items: ALL, dir: 'asc', label: 'Os 12 intervalos, subindo' },
        { items: ALL, dir: 'desc', label: 'Os 12 intervalos, descendo' },
        { items: ALL, dir: 'harm', label: 'Os 12 intervalos, com as duas notas juntas' },
      ],
      stat: k => { const d = k.replace(/\d/g, ''); return `${ivName(+k.slice(d.length))} ${DIR[d]}`; },
      gen(L, api) {
        const iv = api.pickW(L.items, i => L.dir + i), low = 45 + rnd(12), high = low + iv;
        const play = () => L.dir === 'desc' ? pair(high, low) : pair(low, high, L.dir === 'harm');
        const pl = place(low, 5), ph = place(high, pl.f, pl), rp = T.mod(low);
        const song = (L.dir === 'desc' ? SONG_DOWN : SONG_UP)[iv];
        return {
          prompt: `Ouça ${{ asc: 'a nota de baixo e depois a de cima', desc: 'a nota de cima e depois a de baixo', harm: 'as duas notas tocadas juntas' }[L.dir]} e escolha o intervalo.`,
          replays: [{ label: 'Ouvir de novo', fn: play }].concat(L.dir === 'harm' ? [{ label: 'Separadas', fn: () => pair(low, high) }] : []),
          choices: L.items.map(i => ({ v: i, label: ivName(i) })),
          start: play,
          pick: v => ({ ok: v === iv, correct: iv, right: ivName(iv), stats: [[L.dir + iv, v === iv]],
            tip: song && `Para lembrar${L.dir === 'desc' ? ' (descendo)' : ''}: ${song}.`,
            mine: v === iv ? null : () => L.dir === 'desc' ? pair(high, high - v) : pair(low, low + v, L.dir === 'harm') }),
          reveal: () => ({ marks: [T.mark(pl.s, pl.f, rp), T.mark(ph.s, ph.f, rp, { label: ivMark(iv) })], labels: 'iv' }),
        };
      },
    },
    {
      id: 'acordes', title: 'Tipo de acorde', desc: 'Ouça o acorde, nota por nota e depois junto, e diga se é maior, menor, diminuto…',
      levels: [
        { items: ['maior', 'menor'], label: 'Maior ou menor' },
        { items: ['maior', 'menor', 'dim'], label: 'Maior, menor e diminuto' },
        { items: ['maior', 'menor', 'dim', 'aum'], label: 'Maior, menor, diminuto e aumentado' },
        { items: ['maior', 'menor', 'sus2', 'sus4'], label: 'Maior, menor, sus2 e sus4' },
        { items: ['maj7', 'dom7', 'm7'], label: 'Tétrades: 7M, 7 e m7' },
        { items: ['maj7', 'dom7', 'm7', 'm7b5', 'dim7'], label: 'Tétrades: 7M, 7, m7, m7(♭5) e °7' },
      ],
      stat: k => T.CHORDS[k].name,
      gen(L, api) {
        const q = api.pickW(L.items, x => x), r = rnd(12);
        const shapes = qq => { const vs = CH.voicings(r, qq, 15), lo = vs.filter(v => Math.max(...v.f) <= 12); return lo.length ? lo : vs; };
        const v = pick(shapes(q)), lowF = sh => Math.min(...sh.f.filter(f => f >= 0));
        const play = (sh, arp = true) => {
          A.stopAll(); const ns = CH.voicing(sh); let t = A.now() + 0.05;
          if (arp) { ns.forEach((n, k) => A.play(n.midi, t + k * 0.3, { dur: 0.8, vel: 0.6 })); t += ns.length * 0.3 + 0.3; }
          ns.forEach((n, k) => A.play(n.midi, t + k * 0.022, { dur: 1.8, vel: 0.55, string: n.s }));
        };
        return {
          prompt: 'Ouça o acorde e diga o tipo.',
          replays: [{ label: 'Ouvir de novo', fn: () => play(v) }, { label: 'Só o acorde', fn: () => play(v, false) }],
          choices: L.items.map(x => ({ v: x, label: T.CHORDS[x].name })),
          start: () => play(v),
          pick: c => ({ ok: c === q, correct: q, right: `${T.CHORDS[q].name} (${chordName(r, q)})`, stats: [[q, c === q]],
            tip: `${T.CHORDS[q].name}: ${CHORD_TIP[q]}.`,
            mine: c === q ? null : () => play(shapes(c).slice().sort((a, b) => Math.abs(lowF(a) - lowF(v)) - Math.abs(lowF(b) - lowF(v)))[0]) }),
          reveal: () => ({ marks: v.f.map((f, s) => f < 0 ? null : T.mark(s, f, r)).filter(Boolean), labels: 'iv' }),
        };
      },
    },
    {
      id: 'graus', title: 'Graus da escala', desc: 'Uma cadência firma o tom e depois toca uma nota. Diga qual grau ela é: é o ouvido de tirar música.',
      levels: [
        { items: [0, 4, 7], scale: 'maior', label: '1, 3 e 5 no tom maior' },
        { items: [0, 2, 4, 5, 7], scale: 'maior', label: '1, 2, 3, 4 e 5 no tom maior' },
        { items: [0, 2, 4, 5, 7, 9, 11], scale: 'maior', label: 'A escala maior inteira' },
        { items: [0, 2, 4, 5, 7, 9, 11], scale: 'maior', wide: true, label: 'A escala maior em várias oitavas' },
        { items: [0, 2, 3, 5, 7, 8, 10], scale: 'menor', label: 'A escala menor natural' },
        { items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], scale: 'maior', label: 'Cromático: as 12 notas no tom maior' },
      ],
      stat: k => `Grau ${DEG[+k]}`,
      gen(L, api) {
        const semi = api.pickW(L.items, x => x), key = rnd(12), tonic = 48 + key, minor = L.scale === 'menor';
        let note = tonic + semi;
        if (L.wide) note = pick([note - 12, note, note + 12].filter(m => m >= 40 && m <= 74));
        const hz = harmonize(key, minor ? 'menor_harm' : 'maior'), flats = T.useFlats(key, minor ? 3 : 0);
        const sc = T.SCALES[minor ? 'menor' : 'maior'].iv, sp = T.spellScale(key, minor ? 'menor' : 'maior');
        const noteTxt = sc.includes(semi) ? T.spellName(sp.list[sc.indexOf(semi)], latin()) : nameOf(note, flats);
        const play = () => { A.stopAll(); A.play(note, cadence(hz, A.now() + 0.05), { dur: 1.6, vel: 0.95 }); };
        const tp = place(tonic, 5), np = place(note, tp.f, tp);
        return {
          prompt: `<span>Tom de <b>${keyName(key, minor ? 'menor' : 'maior')} ${minor ? 'menor' : 'maior'}</b>. Ouça a cadência e depois a nota: qual é o grau?</span>`,
          replays: [{ label: 'Cadência e nota', fn: play }, { label: 'Só a nota', fn: () => { A.stopAll(); A.play(note, null, { dur: 1.6, vel: 0.95 }); } },
            { label: 'Só a tônica', fn: () => { A.stopAll(); A.play(tonic, null, { dur: 1.6 }); } }],
          choices: L.items.map(x => ({ v: x, label: DEG[x] })),
          start: play,
          pick: v => ({ ok: v === semi, correct: semi, right: `${DEG[semi]} (${noteTxt})`, stats: [[semi, v === semi]], tip: `Grau ${DEG[semi]}: ${DEG_TIP[semi]}.`,
            mine: v === semi ? null : () => { A.stopAll(); const t = A.now() + 0.05; CH.strum(hz[0].triad, t, { dur: 1, vel: 0.45 }); A.play(tonic + v, t + 1.1, { dur: 1.6, vel: 0.95 }); } }),
          reveal: () => ({ marks: note === tonic ? [T.mark(tp.s, tp.f, key)] : [T.mark(tp.s, tp.f, key), T.mark(np.s, np.f, key)], labels: 'iv' }),
        };
      },
    },
    {
      id: 'progressoes', title: 'Progressões', partial: true, desc: 'Quatro acordes num tom maior. O primeiro é sempre o I: descubra os outros três.',
      levels: [
        { items: [1, 4, 5], label: 'I, IV e V' },
        { items: [1, 4, 5, 6], label: 'I, IV, V e vi' },
        { items: [1, 2, 4, 5, 6], label: 'I, ii, IV, V e vi' },
        { items: [1, 2, 3, 4, 5, 6], label: 'I, ii, iii, IV, V e vi' },
      ],
      stat: k => `Acorde ${ROMAN[+k - 1]}`,
      gen(L, api) {
        const COMMON = [[1, 5, 6, 4], [1, 6, 4, 5], [1, 4, 5, 4], [1, 4, 6, 5], [1, 4, 1, 5], [1, 5, 4, 5], [1, 6, 2, 5], [1, 2, 5, 1], [1, 3, 6, 4], [1, 4, 5, 1], [1, 6, 4, 1]];
        const key = rnd(12), hz = harmonize(key, 'maior'), fits = COMMON.filter(p => p.every(d => L.items.includes(d)));
        let seq;
        if (fits.length && Math.random() < 0.5) seq = pick(fits);
        else { seq = [1]; for (let k = 1; k < 4; k++) seq.push(api.pickW(L.items.filter(d => d !== seq[k - 1]), d => d)); }
        const names = d => hz[d - 1].triad;
        const txt = s => `${s.map(d => ROMAN[d - 1]).join('–')} (${s.map(d => prettyChord(names(d))).join(' – ')})`;
        const ans = [1, null, null, null], SPB = 1.25;
        let cur = 1, done = false, tms = [];
        const hl = i => api.root.querySelectorAll('.ear-slots li').forEach((li, k) => li.classList.toggle('play', k === i));
        const playSeq = s => {
          A.stopAll(); tms.forEach(clearTimeout); tms = [];
          const t = A.now() + 0.08;
          s.forEach((d, i) => {
            CH.strum(names(d), t + i * SPB, { dur: SPB * 0.55, vel: 0.55 }); CH.strum(names(d), t + i * SPB + SPB * 0.5, { dur: SPB * 0.5, vel: 0.38 });
            tms.push(setTimeout(() => hl(i), (t + i * SPB - A.now()) * 1000));
          });
          tms.push(setTimeout(() => hl(-1), (t + s.length * SPB - A.now()) * 1000));
        };
        const paint = () => api.slots(`<ol class="ear-slots">${ans.map((a, i) => {
          const cls = done ? (i === 0 ? '' : a === seq[i] ? 'ok' : 'bad') : i === cur ? 'cur' : '';
          const under = !done ? '' : i === 0 || a === seq[i] ? prettyChord(names(seq[i])) : `era ${ROMAN[seq[i] - 1]} · ${prettyChord(names(seq[i]))}`;
          return `<li class="${cls}" data-slot="${i}"><span>${i + 1}º</span><b>${a ? ROMAN[a - 1] : '?'}</b>${under ? `<small>${under}</small>` : ''}</li>`;
        }).join('')}</ol>`);
        paint();
        return {
          noBoard: true,
          prompt: `<span>Tom de <b>${keyName(key, 'maior')} maior</b>. O 1º acorde é o I. Escolha os outros três na ordem (toque num quadro para corrigir).</span>`,
          replays: [{ label: 'Ouvir de novo', fn: () => playSeq(seq) }, { label: 'Só o I', fn: () => { A.stopAll(); CH.strum(names(1), null, { dur: 1.6, vel: 0.5 }); } }],
          choices: L.items.map(d => ({ v: d, label: ROMAN[d - 1] })),
          start: () => playSeq(seq),
          stop: () => { tms.forEach(clearTimeout); tms = []; },
          click(ev) { const li = ev.target.closest('[data-slot]'); if (li && !done && +li.dataset.slot > 0) { cur = +li.dataset.slot; paint(); } },
          pick(v) {
            if (done) return null;
            ans[cur] = v;
            A.stopAll(); CH.strum(names(v), null, { dur: 1, vel: 0.4 });
            const nx = [1, 2, 3].find(i => !ans[i]);
            if (nx) { cur = nx; paint(); return null; }
            done = true; paint();
            const rc = [1, 2, 3].filter(i => ans[i] === seq[i]).length;
            return { ok: rc / 3, right: txt(seq), wrong: `${rc} de 3 certos. Era ${txt(seq)}.`, stats: [1, 2, 3].map(i => [seq[i], ans[i] === seq[i]]), mine: () => playSeq(ans) };
          },
        };
      },
    },
    {
      id: 'ache', title: 'Ouça e ache no braço', desc: 'A tônica acende no braço. Ouça a segunda nota e clique onde ela fica: ouvido e mapa do braço juntos.',
      levels: [
        { items: [4, 7, 12], dir: 'asc', label: 'Notas do acorde maior (3, 5 e 8), acima da tônica' },
        { items: [2, 4, 5, 7, 9, 11, 12], dir: 'asc', label: 'Escala maior, acima da tônica' },
        { items: [2, 4, 5, 7, 9, 11, 12], dir: 'both', label: 'Escala maior, acima e abaixo da tônica' },
        { items: ALL, dir: 'both', label: 'Cromático, acima e abaixo da tônica' },
      ],
      stat: k => `${ivName(Math.abs(+k))} ${+k < 0 ? 'abaixo' : 'acima'}`,
      gen(L, api) {
        const items = L.dir === 'both' ? L.items.flatMap(i => [i, -i]) : L.items;
        const sv = api.pickW(items, x => x), up = sv > 0, abs = Math.abs(sv), where = up ? 'acima' : 'abaixo';
        const s = up ? rnd(4) : 2 + rnd(4), f = 2 + rnd(7), base = T.pitch(s, f), target = base + sv, rp = T.mod(base);
        const right = `${ivName(abs)} ${where} (${nameOf(target, false)})`, song = (up ? SONG_UP : SONG_DOWN)[abs];
        const play = () => pair(base, target);
        let click = null;
        return {
          prompt: `<span>A tônica <b>R</b> é ${nameOf(base, false)}. Ouça a segunda nota, que fica <b>${where}</b>, e clique onde ela está no braço.</span>`,
          replays: [{ label: 'Ouvir de novo', fn: play }, { label: 'Só a tônica', fn: () => { A.stopAll(); A.play(base, null, { dur: 1.4 }); } }],
          view: { marks: [T.mark(s, f, rp)] },
          start: play,
          board(ss, ff) {
            if (ss === s && ff === f) { A.stopAll(); A.play(base, null, { dur: 1.2 }); return null; }
            const p = T.pitch(ss, ff), ok = p === target;
            A.stopAll(); A.play(p, null, { dur: 1 });
            click = { s: ss, f: ff };
            return { ok, right, stats: [[sv, ok]], tip: song && `Para lembrar${up ? '' : ' (descendo)'}: ${song}.`,
              wrong: T.mod(p) === T.mod(target) ? `Nota certa (${nameOf(p, false)}), mas na oitava errada. Era ${right}.` : `Você clicou ${nameOf(p, false)}. Era ${right}.`,
              mine: ok ? null : () => pair(base, p) };
          },
          reveal: () => {
            const ms = [T.mark(s, f, rp)];
            for (let ts = 0; ts < 6; ts++) { const tf = target - T.TUNING[ts]; if (tf >= 0 && tf <= 15) ms.push(T.mark(ts, tf, rp, { label: ivMark(abs) })); }
            if (click && T.pitch(click.s, click.f) !== target) ms.push(T.mark(click.s, click.f, rp, { role: 'bad', label: '×' }));
            return { marks: ms };
          },
        };
      },
    },
    {
      id: 'ditado', title: 'Ditado melódico', partial: true, desc: 'Ouça uma frase curta que começa na tônica e repita: clicando no braço ou tocando na guitarra.', mic: true,
      levels: [
        { len: 3, items: [0, 2, 4], step: true, label: '3 notas entre o 1, o 2 e o 3' },
        { len: 4, items: [0, 2, 4, 5, 7], step: true, label: '4 notas em graus vizinhos, do 1 ao 5' },
        { len: 4, items: [0, 2, 4, 5, 7], step: false, label: '4 notas com saltos, do 1 ao 5' },
        { len: 5, items: [0, 2, 4, 5, 7, 9, 11, 12], step: false, label: '5 notas na escala maior' },
      ],
      gen(L, api) {
        const key = rnd(12), tonic = 48 + key, hz = harmonize(key, 'maior'), sp = T.spellScale(key, 'maior'), sc = T.SCALES.maior.iv;
        let idx = 0; const seq = [0];
        while (seq.length < L.len) {
          let ni;
          if (L.step) ni = pick([idx - 1, idx + 1].filter(i => i >= 0 && i < L.items.length));
          else do { ni = rnd(L.items.length); } while (ni === idx || Math.abs(ni - idx) > 4);
          idx = ni; seq.push(L.items[ni]);
        }
        const notes = seq.map(x => tonic + x), STEP = 0.6;
        const phrase = `${seq.map(x => x === 12 ? '8' : DEG[x]).join(' – ')} (${seq.map(x => T.spellName(sp.list[sc.indexOf(x % 12)], latin())).join(' ')})`;
        const tp = place(tonic, 5), got = [T.mark(tp.s, tp.f, key)];
        let k = 1, miss = 0, muteUntil = 0, stable = 0, last = null, lastWrong = null;
        const melody = t => { notes.forEach((m, i) => A.play(m, t + i * STEP, { dur: STEP * 1.15, vel: 0.9, string: 'mel' })); return t + notes.length * STEP; };
        const hush = end => { muteUntil = performance.now() + Math.max(0, end - A.now()) * 1000 + 300; };
        const playAll = () => { A.stopAll(); hush(melody(cadence(hz, A.now() + 0.05, 0.45))); };
        const playMel = () => { A.stopAll(); hush(melody(A.now() + 0.05)); };
        const micLabel = () => DIT.mic ? '🎤 Microfone ligado' : '🎤 Responder tocando';
        const result = () => ({ ok: Math.max(0, 1 - miss * 0.5), right: phrase, wrong: `Completou com ${miss} ${miss === 1 ? 'erro' : 'erros'}. A frase era ${phrase}.` });
        function hit(midi, pos, fromMic) {
          const want = notes[k];
          if (midi === want || (fromMic && Math.abs(midi - want) === 12)) {
            const p = pos || place(want, got[got.length - 1].f);
            got.push(T.mark(p.s, p.f, key)); k++;
            api.fb.set({ marks: got.slice() });
            if (k >= notes.length) return result();
            api.say(`Isso. ${k} de ${notes.length} notas.`, 'ok');
            return null;
          }
          miss++;
          api.say(`${fromMic ? 'Ouvi' : 'Não é'} ${nameOf(midi, T.useFlats(key))}. Tente de novo.`, 'bad');
          if (pos) api.fb.set({ marks: got.concat(T.mark(pos.s, pos.f, key, { role: 'bad', label: '×' })) });
          return null;
        }
        micHandler = p => {
          if (api.busy() || performance.now() < muteUntil) { stable = 0; last = null; return; }
          if (p.hz < 0) { stable = 0; last = null; return; }
          if (p.midi === last) stable++; else { stable = 1; last = p.midi; }
          if (stable !== 3 || Math.abs(p.cents) > 45) return;
          // a nota anterior ainda soando não conta como erro
          if (T.mod(p.midi) === T.mod(notes[k - 1]) && T.mod(p.midi) !== T.mod(notes[k])) return;
          if (lastWrong && lastWrong.m === p.midi && performance.now() - lastWrong.t < 900) return;
          const before = miss, res = hit(p.midi, null, true);
          if (miss > before) lastWrong = { m: p.midi, t: performance.now() };
          if (res) api.feed(res);
        };
        const startMic = btn => MIC.start(p => micHandler && micHandler(p))
          .then(() => { DIT.mic = true; if (btn) btn.textContent = micLabel(); api.say('Microfone ligado. Toque a frase na guitarra, uma nota por vez (também vale uma oitava acima ou abaixo).'); })
          .catch(err => { DIT.mic = false; if (btn) btn.textContent = micLabel(); api.say(MIC.errorText(err), 'bad'); });
        return {
          prompt: `<span>Tom de <b>${keyName(key, 'maior')} maior</b>. A frase começa na tônica (R, já marcada). Clique nas outras ${notes.length - 1} notas na ordem.</span>
            <button type="button" class="btn ghost" data-mic>${micLabel()}</button>`,
          replays: [{ label: 'Cadência e frase', fn: playAll }, { label: 'Só a frase', fn: playMel },
            { label: 'Mostrar a resposta', plain: true, fn: () => { playMel(); return { ok: 0, right: phrase, wrong: `A frase era ${phrase}.` }; } }],
          view: { marks: got.slice() },
          start: () => { playAll(); if (DIT.mic && !MIC.on) startMic(api.root.querySelector('[data-mic]')); },
          board(s, f) { const m = T.pitch(s, f); A.stopAll(); A.play(m, null, { dur: 0.8 }); muteUntil = performance.now() + 900; return hit(m, { s, f }, false); },
          click(ev) {
            const b = ev.target.closest('[data-mic]'); if (!b) return;
            if (MIC.on) { MIC.stop(); DIT.mic = false; b.textContent = micLabel(); api.say(''); }
            else startMic(b);
          },
          reveal: () => {
            if (k >= notes.length) return { marks: got };
            let p = tp; const ms = [T.mark(tp.s, tp.f, key)];
            for (let i = 1; i < notes.length; i++) { p = place(notes[i], p.f); ms.push(T.mark(p.s, p.f, key)); }
            return { marks: ms };
          },
        };
      },
      cleanup() { MIC.stop(); micHandler = null; DIT.mic = false; },
    },
  ];

  /* ----- progresso salvo: st.ear[id] = { lv, best: { nível: % }, stats: { item: [acertos, tentativas] }, date } ----- */
  function rec(id, st = S.get()) {
    const e = (st.ear || {})[id] || {}, ex = EX.find(x => x.id === id);
    return { lv: Math.min(e.lv || 0, ex.levels.length - 1), best: e.best || {}, stats: e.stats || {}, date: e.date };
  }
  function ensure(s, id) { s.ear = s.ear || {}; return s.ear[id] || (s.ear[id] = { lv: 0, best: {}, stats: {} }); }
  const passedN = (x, st) => { const b = rec(x.id, st).best; return x.levels.filter((_, i) => (b[i] || 0) >= PASS).length; };
  const passed = (st = S.get()) => EX.reduce((a, x) => a + passedN(x, st), 0);
  const complete = (st, id) => { const x = EX.find(e => e.id === id); return passedN(x, st) === x.levels.length; };
  function suggest(st) {
    let best = null;
    EX.forEach(x => { const n = x.levels.length, p = passedN(x, st); if (p < n && (!best || p / n < best.ratio)) best = { x, ratio: p / n, li: rec(x.id, st).lv }; });
    return best;
  }

  function home(el) {
    const st = S.get(), sug = suggest(st);
    const weak = [];
    EX.forEach(x => { if (!x.stat) return; const ss = rec(x.id, st).stats;
      for (const k in ss) { const [ok, n] = ss[k]; if (n >= 4 && ok / n < 0.75) weak.push({ x, k, n, acc: ok / n }); } });
    weak.sort((a, b) => a.acc - b.acc);
    el.innerHTML = `<header class="page-head"><p class="eyebrow">Quiz</p><h1>Treino de ouvido</h1>
      <p class="lede">Exercícios em níveis: acerte ${PASS}% de uma rodada para liberar o próximo. O app repete mais o que você mais erra.</p></header>
      ${quizTabs('ouvido')}
      ${sug ? `<section class="panel ear-next"><div><p class="eyebrow">Continuar</p><h2>${sug.x.title} · nível ${sug.li + 1}</h2><p class="small">${U.esc(sug.x.levels[sug.li].label)}</p></div>
        <a class="btn primary big" href="#ouvido-${sug.x.id}">▶ Treinar agora</a></section>`
        : '<section class="panel ear-next"><div><p class="eyebrow">Tudo completo</p><h2>Você passou todos os níveis</h2><p class="small">Volte de vez em quando: ouvido é como músculo.</p></div></section>'}
      <div class="quiz-grid">${EX.map(x => { const r = rec(x.id, st), n = x.levels.length, p = passedN(x, st);
        return `<a class="quiz-card" href="#ouvido-${x.id}"><h2>${x.title}${x.mic ? ' <span class="pill mic">🎤 opcional</span>' : ''}</h2><p>${x.desc}</p>
          <div class="ear-steps" role="img" aria-label="${p} de ${n} níveis concluídos">${x.levels.map((_, i) => `<i class="${(r.best[i] || 0) >= PASS ? 'ok' : i === r.lv ? 'cur' : ''}"></i>`).join('')}</div>
          <span class="pill ${p === n ? 'ok' : p ? '' : 'muted'}">${p === n ? 'Completo' : `Nível ${r.lv + 1} de ${n}`}</span></a>`; }).join('')}</div>
      <section class="panel"><p class="eyebrow">Pontos fracos</p>
        ${weak.length ? `<table class="tbl"><tbody>${weak.slice(0, 6).map(w => `<tr><td><a href="#ouvido-${w.x.id}">${w.x.title}</a></td><td>${U.esc(w.x.stat(w.k))}</td><td><b>${Math.round(w.acc * 100)}%</b> <span class="small">em ${w.n}</span></td></tr>`).join('')}</tbody></table>
          <p class="small">Esses itens aparecem mais vezes nos treinos até você acertar com folga.</p>`
          : '<p class="small">Ainda sem pontos fracos claros. Depois de algumas rodadas, os itens que você mais erra aparecem aqui e passam a cair mais vezes.</p>'}</section>`;
  }

  function run(el, ex) {
    const N = ex.levels.length, pend = {};
    let li = rec(ex.id).lv, round = 0, score = 0, q = null, waiting = false, timer = null, prev = null;
    el.innerHTML = `<nav class="crumbs"><a href="#ouvido">Treino de ouvido</a><span>›</span><span>${ex.title}</span></nav>
      <section class="panel quiz ear">
        <div class="quiz-top"><h1>${ex.title}</h1><span class="pill" data-count></span></div>
        <div class="ear-levels" data-levels></div>
        <p class="small" data-lvdesc></p>
        <div class="prompt" data-prompt></div>
        <div class="ctrl-row" data-replay></div>
        <div data-fb></div>
        <div data-slots></div>
        <div class="answers" data-ans></div>
        <div class="feedback" data-fbk aria-live="polite"></div>
        <div class="ctrl-row" data-after></div>
      </section>
      <p class="small ear-keys">Atalhos: espaço ouve de novo, 1 a 9 respondem.</p>`;
    const $ = s => el.querySelector(s);
    const fb = FB.create($('[data-fb]'));
    fb.set(U.fbState({ frets: 15, marks: [] }));
    const say = (html, cls = '') => { const f = $('[data-fbk]'); f.innerHTML = html; f.className = 'feedback ' + cls; };
    const statOf = k => { const s = rec(ex.id).stats[k] || [0, 0], p = pend[k] || [0, 0]; return [s[0] + p[0], s[1] + p[1]]; };
    const api = {
      fb, say, root: el, feed: r => feed(r), busy: () => waiting,
      slots: html => { $('[data-slots]').innerHTML = html; },
      /** Sorteia um item, com mais chance para os que você mais erra (e sem repetir o anterior). */
      pickW(items, keyOf) {
        const w = items.map(it => { const [ok, n] = statOf(keyOf(it)); return 1 + 2 * (1 - (ok + 1) / (n + 2)); });
        const total = w.reduce((a, b) => a + b, 0);
        let i = 0;
        for (let tries = 0; tries < 4; tries++) {
          let r = Math.random() * total; i = 0;
          while (i < w.length - 1 && r >= w[i]) { r -= w[i]; i++; }
          if (items.length < 2 || String(keyOf(items[i])) !== prev) break;
        }
        prev = String(keyOf(items[i]));
        return items[i];
      },
    };

    function flush(x) {
      for (const k in pend) {
        const a = x.stats[k] || [0, 0], b = [a[0] + pend[k][0], a[1] + pend[k][1]];
        // metade do histórico antigo sai: o peso fica no que você tem errado ultimamente
        x.stats[k] = b[1] > 60 ? [Math.round(b[0] / 2), Math.round(b[1] / 2)] : b;
        delete pend[k];
      }
    }
    function paintLevels() {
      const r = rec(ex.id);
      $('[data-levels]').innerHTML = `<div class="chips" data-chips="lv">${ex.levels.map((L, i) => {
        const open = i <= r.lv, ok = (r.best[i] || 0) >= PASS;
        return `<button type="button" class="chip ${i === li ? 'on' : ''} ${ok ? 'passed' : ''}" data-v="${i}" ${open ? '' : 'disabled'} aria-pressed="${i === li}" title="${U.esc(L.label)}">${open ? '' : '🔒 '}Nível ${i + 1}${ok ? ' ✓' : ''}</button>`;
      }).join('')}</div>`;
      $('[data-lvdesc]').textContent = ex.levels[li].label + (r.best[li] != null ? ` · seu melhor: ${r.best[li]}%` : '')
        + (li === r.lv && li < N - 1 ? ` · ${PASS}% libera o nível ${li + 2}` : '');
    }
    const paintCount = () => { $('[data-count]').textContent = `${Math.min(round + (waiting ? 0 : 1), ROUNDS)}/${ROUNDS} · ${fmt(score)} ${ex.partial ? (score === 1 ? 'ponto' : 'pontos') : score === 1 ? 'acerto' : 'acertos'}`; };
    function endQ() { if (q && q.stop) q.stop(); A.stopAll(); }

    function next() {
      clearTimeout(timer); endQ();
      if (round >= ROUNDS) return finish();
      waiting = false;
      say(''); $('[data-after]').innerHTML = ''; $('[data-slots]').innerHTML = '';
      q = ex.gen(ex.levels[li], api);
      $('[data-prompt]').innerHTML = q.prompt;
      $('[data-replay]').innerHTML = (q.replays || []).map((b, i) => `<button type="button" class="btn${i ? ' ghost' : ''}" data-rp="${i}">${b.plain ? '' : '♪ '}${b.label}</button>`).join('');
      $('[data-ans]').innerHTML = (q.choices || []).map((c, i) => `<button type="button" class="btn ans" data-a="${i}">${c.label}</button>`).join('');
      $('[data-fb]').hidden = !!q.noBoard;
      fb.set(Object.assign({ marks: [], labels: 'iv', onPick: q.board ? (s, f) => { if (!waiting) feed(q.board(s, f)); } : null }, q.view || {}));
      paintCount();
      if (q.start) q.start();
    }

    function feed(res) {
      if (!res || waiting) return;
      waiting = true; round++;
      const ok = Math.max(0, Math.min(1, +res.ok || 0)), full = ok >= 1;
      score += ok;
      (res.stats || []).forEach(([k, good]) => { const p = pend[k] || (pend[k] = [0, 0]); if (good) p[0]++; p[1]++; });
      if (res.correct !== undefined && q.choices) $('[data-ans]').querySelectorAll('[data-a]').forEach(b => {
        const c = q.choices[+b.dataset.a];
        if (c.v === res.correct) b.classList.add('ok'); else if (c.v === res.chosen) b.classList.add('bad');
      });
      say((full ? `Certo: ${res.right}.` : res.wrong || `Era ${res.right}.`) + (res.tip ? `<span class="ear-tip">${res.tip}</span>` : ''), full ? 'ok' : 'bad');
      fb.set(Object.assign({ onPick: null }, q.reveal ? q.reveal(res) : {}));
      paintCount();
      if (full) { timer = setTimeout(next, res.tip ? 1500 : 1000); return; }
      q.mine = res.mine;
      $('[data-after]').innerHTML = `${res.mine ? '<button type="button" class="btn" data-act="mine">♪ Ouvir a sua resposta</button>' : ''}
        <button type="button" class="btn primary" data-act="next">${round >= ROUNDS ? 'Ver resultado' : 'Próxima'} →</button>`;
      $('[data-act="next"]').focus({ preventScroll: true });
    }

    function finish() {
      endQ(); q = null; waiting = true;
      const pct = Math.round(score / ROUNDS * 100), prevBest = rec(ex.id).best[li];
      let unlocked = false;
      S.update(s => {
        const x = ensure(s, ex.id);
        x.best[li] = Math.max(x.best[li] || 0, pct);
        if (pct >= PASS) { x.date = S.today(); if (li === (x.lv || 0) && li < N - 1) { x.lv = li + 1; unlocked = true; } }
        flush(x);
      });
      S.practiced();
      paintLevels();
      ['[data-prompt]', '[data-replay]', '[data-slots]', '[data-after]'].forEach(s => { $(s).innerHTML = ''; });
      $('[data-fb]').hidden = true;
      const recTxt = prevBest == null || pct > prevBest ? ' · novo recorde do nível' : ` · recorde ${prevBest}%`;
      $('[data-ans]').innerHTML = `<div class="result"><b>${pct}%</b><span>${fmt(score)} de ${ROUNDS}${recTxt}</span>
        ${unlocked ? `<p class="ear-unlock">Nível ${li + 2} liberado: ${U.esc(ex.levels[li + 1].label)}</p>` : ''}
        <div class="ctrl-row center">${unlocked
          ? `<button type="button" class="btn primary" data-act="lv" data-v="${li + 1}">Ir para o nível ${li + 2} →</button><button type="button" class="btn" data-act="again">Repetir este nível</button>`
          : `<button type="button" class="btn primary" data-act="again">${pct >= PASS ? 'Jogar de novo' : 'Tentar de novo'}</button>`}
          <a class="btn" href="#ouvido">Outros treinos</a></div></div>`;
      say(pct >= PASS ? (li === N - 1 ? 'Último nível deste treino concluído. Volte de vez em quando para manter o ouvido afiado.' : unlocked ? '' : 'Bom resultado.')
        : `Faltou pouco: ${PASS}% libera o próximo nível. Use “Ouvir de novo” quantas vezes precisar.`);
      paintCount();
    }

    function restart() { round = 0; score = 0; $('[data-fb]').hidden = false; paintLevels(); next(); }

    el.addEventListener('click', ev => {
      const t = ev.target;
      const lv = t.closest('[data-chips="lv"] .chip, [data-act="lv"]');
      if (lv) { if (!lv.disabled) { li = +lv.dataset.v; restart(); } return; }
      const rp = t.closest('[data-rp]');
      if (rp && q) { const r = q.replays[+rp.dataset.rp].fn(); if (r && typeof r === 'object') feed(r); return; }
      const a = t.closest('[data-a]');
      if (a && q && q.pick) { if (!waiting) { const c = q.choices[+a.dataset.a], res = q.pick(c.v); if (res) { res.chosen = c.v; feed(res); } } return; }
      const act = t.closest('[data-act]')?.dataset.act;
      if (act === 'next') next();
      else if (act === 'mine') { if (q && q.mine) q.mine(); }
      else if (act === 'again') restart();
      else if (q && q.click) q.click(ev);
    });
    const onKey = ev => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.target.closest('button, a, input, select, textarea') || !q) return;
      if (ev.key === ' ') { ev.preventDefault(); if (q.replays) q.replays[0].fn(); }
      else if (/^[1-9]$/.test(ev.key)) $(`[data-a="${+ev.key - 1}"]`)?.click();
    };
    document.addEventListener('keydown', onKey);

    paintLevels();
    next();
    return () => {
      clearTimeout(timer); endQ(); document.removeEventListener('keydown', onKey);
      if (ex.cleanup) ex.cleanup();
      if (Object.keys(pend).length) S.update(s => flush(ensure(s, ex.id)));
    };
  }

  /** Painel da tela de Progresso. */
  function panel(st) {
    return `<section class="panel"><p class="eyebrow">Treino de ouvido</p><table class="tbl"><tbody>${EX.map(x => {
      const n = x.levels.length, p = passedN(x, st);
      return `<tr><td><a href="#ouvido-${x.id}">${x.title}</a></td><td>${p === n ? '<b>Completo</b>' : `Nível <b>${rec(x.id, st).lv + 1}</b> de ${n}`}</td></tr>`;
    }).join('')}</tbody></table></section>`;
  }

  MOT.BADGES.push(
    { id:'ouvido-1', icon:'♪', name:'Ouvido ligado', desc:'Passou o primeiro nível de um treino de ouvido.', test: st => passed(st) >= 1 },
    { id:'ouvido-int', icon:'8ª', name:'Ouvido de intervalos', desc:'Passou todos os níveis de intervalos.', test: st => complete(st, 'intervalos') },
    { id:'ouvido-acordes', icon:'m7', name:'Ouvido harmônico', desc:'Passou todos os níveis de tipo de acorde.', test: st => complete(st, 'acordes') },
    { id:'ouvido-funcional', icon:'I–V', name:'Ouvido funcional', desc:'Passou todos os níveis de graus da escala e de progressões.', test: st => complete(st, 'graus') && complete(st, 'progressoes') },
    { id:'ouvido-20', icon:'20', name:'Ouvido treinado', desc:'Passou 20 níveis de treino de ouvido.', test: st => passed(st) >= 20 },
  );

  V.ouvido = (el, id) => { const ex = EX.find(x => x.id === id); return ex ? run(el, ex) : home(el); };

  return { EX, PASS, passed, panel };
})();
