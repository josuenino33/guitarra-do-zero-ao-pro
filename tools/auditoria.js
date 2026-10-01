// Auditoria de teoria do Mapa do Braço: roda com `node audit.js <pasta do projeto>`
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = process.argv[2] || path.join(__dirname, '..');
const js = f => fs.readFileSync(path.join(root, 'src/js', f), 'utf8');
const order = fs.readdirSync(path.join(root, 'src/js')).filter(f => /^(01|02b|04|05|06|07)/.test(f)).sort();
const ctx = { console, S: { get: () => ({ myLicks: [] }) }, UIP: { lickKey: () => null } };
vm.createContext(ctx);
vm.runInContext(order.map(js).join('\n') + '\n;globalThis.o={T,CH,RH,TAB,MODULES,LEVELS,LICKS,SONGS,VOICINGS,QUAL_SUFFIX,harmonize};', ctx);
vm.runInContext(js('09e-widgets-adv.js').split('const DICT_GROUPS')[0], ctx);
const jamSrc = js('14-view-jam.js'); const JAMS = vm.runInContext('(' + jamSrc.slice(jamSrc.indexOf('[', jamSrc.indexOf('const JAMS')), jamSrc.indexOf('];', jamSrc.indexOf('const JAMS')) + 1) + ')', ctx);
const { T, CH, RH, TAB, MODULES, LICKS, VOICINGS, harmonize } = ctx.o;

let errs = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { errs++; if (errs <= 60) console.log('  ERRO:', msg); } };
const sec = t => console.log('\n## ' + t);
const N = x => T.mod(x);
const nm = sp => T.spellName(sp, false);

sec('1. Afinação e braço');
ok(T.TUNING.join() === '40,45,50,55,59,64', 'afinação padrão E2 A2 D3 G3 B3 E4');
['E', 'A', 'D', 'G', 'B', 'E'].forEach((n, s) => ok(N(T.TUNING[s]) === T.pcOf(n), 'corda solta ' + n));

sec('2. Grafia das escalas (12 tons)');
const doubles = [];
for (const k of Object.keys(T.SCALES)) for (let r = 0; r < 12; r++) {
  const sp = T.spellScale(r, k), sc = T.SCALES[k];
  sp.list.forEach((x, i) => ok(T.pcOf(T.spellAscii(x)) === N(r + sc.iv[i]), `${k} ${r}: grau ${i + 1} grafado ${nm(x)} não bate com a altura`));
  if (sc.iv.length === 7 && k !== 'alterada') ok(new Set(sp.list.map(x => x.l)).size === 7, `${k} de ${nm(sp.root)}: precisa de 7 letras diferentes (${sp.list.map(nm).join(' ')})`);
  sp.list.forEach(x => { if (Math.abs(x.a) > 1) doubles.push(`${sc.name} de ${nm(sp.root)}: ${nm(x)}`); });
}
const sample = (k, rs) => rs.map(r => { const sp = T.spellScale(r, k); return `${nm(sp.root)}: ${sp.list.map(nm).join(' ')}`; }).join(' | ');
console.log('  Maior em todos os tons:\n   ' + sample('maior', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).split(' | ').join('\n   '));
console.log('  Menor natural:\n   ' + sample('menor', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).split(' | ').join('\n   '));
console.log('  Lídio de Lá: ' + sample('lidio', [9]) + ' | Blues de Lá: ' + sample('blues', [9]) + ' | Alterada de Mi: ' + sample('alterada', [4]));
console.log('  Rótulos lídio: ' + T.spellScale(9, 'lidio').labels.join(' ') + ' | alterada: ' + T.spellScale(4, 'alterada').labels.join(' ') + ' | blues: ' + T.spellScale(9, 'blues').labels.join(' '));
console.log('  Dobrados (corretos em teoria):', [...new Set(doubles)].slice(0, 8).join('; ') || 'nenhum');

sec('3. Grafia dos acordes');
for (const q of Object.keys(T.CHORDS)) for (let r = 0; r < 12; r++) {
  const sp = T.spellChord(r, q);
  sp.list.forEach((x, i) => ok(T.pcOf(T.spellAscii(x)) === N(r + T.CHORDS[q].iv[i]), `${q} ${r} nota ${i}`));
}
console.log('  C+ ' + T.spellChord(0, 'aum').list.map(nm).join(' ') + ' (' + T.spellChord(0, 'aum').labels.join(' ') + ') | C°7 ' + T.spellChord(0, 'dim7').list.map(nm).join(' ') + ' (' + T.spellChord(0, 'dim7').labels.join(' ') + ') | E7(♯9) ' + T.spellChord(4, 's9').list.map(nm).join(' ') + ' (' + T.spellChord(4, 's9').labels.join(' ') + ') | G13 ' + T.spellChord(7, 'thirteen').labels.join(' '));

sec('4. Caixas da pentatônica (comparadas com a referência de Lá menor)');
const REF = [ // casas por corda 6→1
  [[5, 8], [5, 7], [5, 7], [5, 7], [5, 8], [5, 8]],
  [[8, 10], [7, 10], [7, 10], [7, 9], [8, 10], [8, 10]],
  [[10, 12], [10, 12], [10, 12], [9, 12], [10, 13], [10, 12]],
  [[12, 15], [12, 15], [12, 14], [12, 14], [13, 15], [12, 15]],
  [[15, 17], [15, 17], [14, 17], [14, 17], [15, 17], [15, 17]],
];
for (let b = 0; b < 5; b++) {
  const ms = T.scaleMarks('pent_menor', 9, b, 22);
  const got = [0, 1, 2, 3, 4, 5].map(s => ms.filter(m => m.s === s).map(m => m.f).sort((x, y) => x - y));
  ok(JSON.stringify(got) === JSON.stringify(REF[b]), `caixa ${b + 1}: ${JSON.stringify(got)} ≠ ${JSON.stringify(REF[b])}`);
}
for (const k of ['pent_menor', 'pent_maior', 'blues', 'blues_maior']) for (let r = 0; r < 12; r++) for (let b = 0; b < 5; b++) {
  const ms = T.scaleMarks(k, r, b, 22), sc = T.SCALES[k];
  ok(ms.every(m => sc.iv.includes(m.iv)), `${k} ${r} caixa ${b + 1} tem nota fora da escala`);
  ok(sc.iv.every(iv => ms.some(m => m.iv === iv)), `${k} ${r} caixa ${b + 1} não tem todos os graus`);
  const span = [0, 1, 2, 3, 4, 5].map(s => { const fs = ms.filter(m => m.s === s).map(m => m.f); return Math.max(...fs) - Math.min(...fs); });
  ok(Math.max(...span) <= 4, `${k} ${r} caixa ${b + 1} abertura grande demais`);
}
const blues1 = T.scaleMarks('blues', 9, 0, 22).filter(m => m.iv === 6).map(m => `corda ${6 - m.s} casa ${m.f}`);
ok(blues1.join() === 'corda 5 casa 6,corda 3 casa 8', 'blue note da caixa 1 de Lá (aula diz corda 5 casa 6 e corda 3 casa 8): ' + blues1);

sec('5. Escalas em 3 notas por corda (todas as escalas de 7 notas, 12 tons, 7 posições)');
for (const [k, sc] of Object.entries(T.SCALES)) if (sc.iv.length === 7) for (let r = 0; r < 12; r++) for (let p = 0; p < 7; p++) {
  const ms = T.scaleMarks(k, r, p, 22);
  ok([0, 1, 2, 3, 4, 5].every(s => ms.filter(m => m.s === s).length === 3), `${k} ${r} pos ${p + 1}: 3 notas por corda`);
  const ps = ms.slice().sort((a, b) => a.s - b.s || a.f - b.f).map(m => T.pitch(m.s, m.f));
  ok(ps.every((x, i) => i === 0 || x > ps[i - 1]), `${k} ${r} pos ${p + 1}: alturas sobem`);
  // graus consecutivos, sem pular nota da escala
  const deg = ps.map(x => sc.iv.indexOf(N(x - r)));
  ok(deg.every((d, i) => d >= 0 && (i === 0 || d === (deg[i - 1] + 1) % 7)), `${k} ${r} pos ${p + 1}: graus consecutivos`);
  ok(ms.every(m => m.f >= 0 && m.f <= 22), `${k} ${r} pos ${p + 1}: dentro do braço`);
}

sec('6. Acordes abertos: notas, baixo, digitação');
const CORE = q => T.CHORDS[q].iv.filter(iv => !(iv === 7 && !['power', 'sus2', 'sus4'].includes(q)));
for (const [name, sh] of Object.entries(CH.OPEN)) {
  const p = CH.parse(name), want = T.CHORDS[p.q].iv.map(N);
  const v = CH.voicing(Object.assign({ name }, sh)), pcs = new Set(v.map(n => N(n.midi - p.root)));
  ok([...pcs].every(x => want.includes(x)), `${name}: nota fora do acorde`);
  ok(CORE(p.q).every(x => pcs.has(N(x))), `${name}: falta nota essencial`);
  ok(N(v[0].midi) === (p.bass ?? p.root), `${name}: o baixo deveria ser ${p.bass != null ? 'a nota do baixo' : 'a tônica'}`);
  const fr = sh.f.map((f, s) => ({ f, d: sh.d[s] })).filter(x => x.f > 0 && x.d > 0);
  ok(fr.every(a => fr.every(b => !(a.f < b.f && a.d > b.d))), `${name}: dedo de número maior numa casa mais baixa`);
  ok(fr.every(a => fr.every(b => a.d !== b.d || a.f === b.f)), `${name}: mesmo dedo em casas diferentes`);
}

sec('7. Formas móveis e voicings (todas as qualidades, 12 tons)');
for (const [q, list] of Object.entries(VOICINGS)) for (let r = 0; r < 12; r++) {
  const vs = CH.voicings(r, q), want = T.CHORDS[q].iv.map(N);
  ok(vs.length > 0, `${q} ${r}: sem forma`);
  vs.forEach(v => {
    const notes = CH.voicing(v), pcs = new Set(notes.map(n => N(n.midi - r)));
    ok([...pcs].every(x => want.includes(x)), `${q} ${r} ${v.k}: nota fora`);
    ok(CORE(q).every(x => pcs.has(N(x)) || (q === 'thirteen' && x === 7) || (q === 'm6' && x === 7)), `${q} ${r} ${v.k}: falta nota essencial`);
    ok(N(notes[0].midi) === r, `${q} ${r} ${v.k}: baixo não é a tônica`);
    const fr = v.f.filter(f => f > 0);
    ok(Math.max(...fr) - Math.min(...fr) <= 4, `${q} ${r} ${v.k}: abertura de mão maior que 4 casas`);
  });
}
for (let r = 0; r < 12; r++) for (const q of ['', 'm', '7', 'm7', '7M']) for (const pf of ['E', 'A']) {
  const name = T.ROOTS[r] + q, sh = CH.get(name, pf), p = CH.parse(name);
  const notes = CH.voicing(sh); ok(N(notes[0].midi) === p.root, `${name}@${pf}: baixo`);
  const fr = sh.f.map((f, s) => ({ f, d: sh.d[s] })).filter(x => x.f > 0 && x.d > 1);
  ok(fr.every(a => fr.every(b => !(a.f < b.f && a.d > b.d))), `${name}@${pf}: digitação`);
}

sec('8. Tríades e inversões (4 grupos de cordas, 4 qualidades, 12 tons)');
for (const q of ['maior', 'menor', 'dim', 'aum']) for (let r = 0; r < 12; r++) for (const set of T.STRING_SETS) {
  const vs = T.triads(r, q, set.s, 22), ivs = T.CHORDS[q].iv;
  for (let inv = 0; inv < 3; inv++) ok(vs.some(v => v.inv === inv), `${q} ${r} ${set.id}: falta a inversão ${inv}`);
  vs.forEach(v => {
    const pcs = v.notes.map(n => N(n.pc - r));
    ok(new Set(pcs).size === 3 && pcs.every(x => ivs.includes(x)), `${q} ${r} ${set.id}: notas erradas`);
    ok(pcs[0] === ivs[v.inv], `${q} ${r} ${set.id} inv ${v.inv}: baixo errado`);
    ok(v.notes.map(n => n.s).join() === set.s.join(), `${q} ${r} ${set.id}: cordas`);
    const ps = v.notes.map(n => T.pitch(n.s, n.f)); ok(ps[2] - ps[0] < 12 + 1, `${q} ${r} ${set.id}: voicing fechado`);
  });
}

sec('9. CAGED (maior e menor, 12 tons)');
for (const q of ['maior', 'menor']) for (let r = 0; r < 12; r++) {
  const shapes = T.cagedAll(q, r, 22), ivs = T.CHORDS[q].iv;
  shapes.forEach(sh => {
    ok(sh.notes.every(n => ivs.includes(N(n.pc - r))), `${q} ${r} forma ${sh.k}: nota fora`);
    ok([0, ivs[1]].every(x => sh.notes.some(n => N(n.pc - r) === x)), `${q} ${r} forma ${sh.k}: falta tônica ou 3ª`);
  });
  const ks = shapes.map(s => s.k).join(''), cyc = 'CAGEDCAGED';
  ok(cyc.includes(ks), `${q} ${r}: ordem das formas ${ks} não segue C-A-G-E-D`);
}

sec('10. Campo harmônico');
const EXP3 = { maior: ['maior', 'menor', 'menor', 'maior', 'maior', 'menor', 'dim'], menor: ['menor', 'dim', 'maior', 'menor', 'menor', 'maior', 'maior'], menor_harm: ['menor', 'dim', 'aum', 'menor', 'maior', 'maior', 'dim'] };
const EXP4 = { maior: ['maj7', 'm7', 'm7', 'maj7', 'dom7', 'm7', 'm7b5'], menor: ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', 'dom7'], menor_harm: ['mmaj7', 'm7b5', 'aummaj7', 'm7', 'dom7', 'maj7', 'dim7'] };
for (const sc of Object.keys(EXP3)) for (let r = 0; r < 12; r++) {
  const h = harmonize(r, sc);
  ok(h.map(d => d.q3).join() === EXP3[sc].join(), `${sc} ${r}: tríades ${h.map(d => d.q3)}`);
  ok(h.map(d => d.q4).join() === EXP4[sc].join(), `${sc} ${r}: tétrades ${h.map(d => d.q4)}`);
  h.forEach(d => [d.triad, d.tetrad].forEach(n => { const p = CH.parse(n); ok(p && p.root === d.pc, `${sc} ${r}: ${n} raiz`); ok(!!CH.get(n), `${sc} ${r}: ${n} sem forma`); }));
  const letters = h.map(d => T.parseName(d.triad).l); ok(letters.every((l, i) => i === 0 || l === (letters[i - 1] + 1) % 7), `${sc} ${r}: letras dos graus`);
}
console.log('  Fá♯ maior: ' + harmonize(6, 'maior').map(d => d.triad).join(' ') + ' | Sol♭/Fá♯ menor harm.: ' + harmonize(8, 'menor_harm').map(d => d.triad).join(' '));

sec('11. Licks, estudos e solos');
const ALLOW = { b3: ['C#', 'F#', 'F', 'G#'], m1: ['A#', 'F'], s1: ['G#'], s2: ['F#', 'C#', 'B', 'G#'], 'ex-aranha': '*', 'ex-1234': '*', fusion1: ['G#', 'D#'], alt1: ['A'], tap1: ['G#'], 'pd-green': ['G#'] };
for (const l of LICKS) {
  const p = TAB.parse(l.src), r = T.pcOf(l.key), sc = T.SCALES[l.scale];
  const out = new Set();
  p.events.forEach(e => e.notes.forEach(o => { if (!o.dead) { const pc = N(TAB.soundingMidi(o)); if (!sc.iv.includes(N(pc - r))) out.add(T.SHARP[pc]); } }));
  const allow = ALLOW[l.id] || [];
  ok(allow === '*' || [...out].every(x => allow.includes(x)), `${l.id}: notas fora da escala ${[...out]}`);
  const m = l.meter || 4, pk = l.pickup || 0;
  if (!l.id.startsWith('ex-')) ok(Math.abs(((p.beats - pk) % m + m) % m) < 1e-9, `${l.id}: compasso incompleto (${p.beats} tempos)`);
  (l.chords || []).forEach(c => ok(!!CH.get(c), `${l.id}: acorde ${c} sem forma`));
  // transposição para todos os tons
  if (TAB.transposable(l.src)) for (let k = 0; k < 12; k++) {
    let d = N(k - r); if (d > 6) d -= 12;
    const tr = TAB.transpose(l.src, d), p2 = TAB.parse(tr.src);
    ok(p2.events.every(e => e.notes.every(o => o.dead || (o.f >= 0 && o.f <= 24))), `${l.id} → ${k}: casa fora do braço (24 casas)`);
    ok(N(tr.shift - d) === 0, `${l.id} → ${k}: deslocamento`);
    const key = T.spellAscii(T.spellScale(k, l.scale).root);
    (l.chords || []).forEach(c => { const t = T.transposeName(c, l.key, key); ok(!!CH.get(t) && CH.parse(t).root === N(CH.parse(c).root + d), `${l.id}: ${c} → ${t}`); });
  }
}

sec('12. Jam: acordes em todos os tons');
for (const j of JAMS) for (let k = 0; k < 12; k++) {
  const key = T.spellAscii(T.spellScale(k, j.minor ? 'menor' : 'maior').root), d = N(k - T.pcOf(j.key));
  j.chords.forEach(c => { const t = T.transposeName(c, j.key, key); const p = CH.parse(t);
    ok(p && p.root === N(CH.parse(c).root + d) && p.q === CH.parse(c).q && !!CH.get(t), `${j.id} em ${key}: ${c} → ${t}`); });
}
console.log('  Blues em F♯/G♭: ' + JAMS[0].chords.slice(0, 9).filter((c, i, a) => a.indexOf(c) === i).map(c => T.transposeName(c, 'A', T.spellAscii(T.spellScale(6, 'maior').root))).join(' ')
  + ' | Rock em C♯m: ' + JAMS[2].chords.map(c => T.transposeName(c, 'A', T.spellAscii(T.spellScale(1, 'menor').root))).join(' '));

sec('13. Afirmações das aulas conferidas no braço');
const at = (s, f) => T.SHARP[N(T.pitch(s, f))];
ok([3, 5, 7, 8, 10, 12].map(f => at(0, f)).join() === 'G,A,B,C,D,E', 'corda 6: casas 3,5,7,8,10,12 = Sol Lá Si Dó Ré Mi');
ok([3, 5, 7, 8, 10, 12].map(f => at(1, f)).join() === 'C,D,E,F,G,A', 'corda 5: casas 3,5,7,8,10,12 = Dó Ré Mi Fá Sol Lá');
ok(T.pitch(2, 5 + 2) === T.pitch(0, 5) + 12, 'oitava corda 6 → 4: +2 casas');
ok(T.pitch(3, 5 + 2) === T.pitch(1, 5) + 12, 'oitava corda 5 → 3: +2 casas');
ok(T.pitch(4, 5 + 3) === T.pitch(2, 5) + 12 && T.pitch(5, 5 + 3) === T.pitch(3, 5) + 12, 'oitava corda 4 → 2 e 3 → 1: +3 casas');
ok(T.pitch(5, 5) === T.pitch(0, 5) + 24, 'corda 6 → corda 1: mesma casa (duas oitavas)');
ok(T.pitch(1, 5) - T.pitch(0, 5) === 5 && T.pitch(1, 7) - T.pitch(0, 5) === 7 && T.pitch(1, 4) - T.pitch(0, 5) === 4 && T.pitch(1, 3) - T.pitch(0, 5) === 3 && T.pitch(2, 5) - T.pitch(0, 5) === 10, 'desenhos de intervalo da corda 6 (4J, 5J, 3M, 3m, 7m)');
ok(T.pitch(2, 5) - T.pitch(1, 5) === 5 && T.pitch(3, 5) - T.pitch(1, 5) === 10, 'desenhos de intervalo da corda 5');
ok(T.TUNING[4] - T.TUNING[3] === 4 && [1, 2, 3, 5].every(s => T.TUNING[s] - T.TUNING[s - 1] === 5), 'cordas vizinhas em 4ª, Sol→Si em 3ª maior');
const b1 = T.scaleMarks('pent_menor', 9, 0, 22); ok([0, 1, 2, 3, 4, 5].map(s => b1.filter(m => m.s === s).map(m => m.f).join('-')).join() === '5-8,5-7,5-7,5-7,5-8,5-8', 'caixa 1 de Lá: dedos 1-4 nas cordas 6,2,1 e 1-3 nas 5,4,3');
const g1 = TAB.parse(LICKS.find(l => l.id === 'g1').src); const triFr = [0, 4, 8, 12].map(i => g1.events.slice(i, i + 3).map(e => e.notes[0].f).join(','));
ok(triFr.join(' ') === '7,8,7 7,7,5 9,8,7 9,8,8', 'lick g1: G (2ª inv) D (fund) Em (fund) C (1ª inv)');
const pos = { 'G': [7, 8, 7], 'D': [7, 7, 5], 'Em': [9, 8, 7], 'C': [9, 8, 8] };
const invOf = (name, fr) => { const p = CH.parse(name), b = N(T.pitch(3, fr[0]) - p.root); return T.CHORDS[p.q].iv.indexOf(b); };
ok(invOf('G', pos.G) === 2 && invOf('D', pos.D) === 0 && invOf('Em', pos.Em) === 0 && invOf('C', pos.C) === 1, 'inversões citadas na dica do g1');

sec('14. Ritmo');
RH.PATTERNS.forEach(p => ok(p.p.length === p.beats * p.sub, `levada ${p.id}: tamanho`));
RH.READING.forEach(r => ok(Math.abs(RH.parseRhythm(r.src).reduce((a, e) => a + e.d, 0) % 4) < 1e-9, `ritmo ${r.src}: compasso`));

console.log(`\n${checks} verificações, ${errs} erro(s).`);
