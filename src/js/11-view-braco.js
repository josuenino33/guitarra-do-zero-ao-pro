/* ===== Explorador do braço ===== */
const EXP = { type:'scale', root:9, scale:'pent_menor', pos:0, quality:'maior', set:'123', inv:-1, shape:'all', layer:'chord', chord:'maior', labels:'iv' };

V.braco = (el) => {
  el.innerHTML = `
    <header class="page-head"><p class="eyebrow">Explorador</p><h1>O braço inteiro, em qualquer tom</h1></header>
    <section class="panel">
      <div class="explorer-ctrl" data-ctrl></div>
      <div data-fb></div>
      <p class="caption" data-caption></p>
      <div data-legend></div>
    </section>
    <section class="info-grid" data-info></section>`;
  const fb = FB.create(el.querySelector('[data-fb]'));

  function cfg() {
    const e = EXP;
    if (e.type === 'scale') return { kind:'scale', root:e.root, scale:e.scale, pos:e.pos };
    if (e.type === 'triad') return { kind:'triad', root:e.root, quality:e.quality, set:e.set, inv:e.inv };
    if (e.type === 'caged') return { kind:'caged', root:e.root, quality:e.quality === 'menor' ? 'menor' : 'maior', shape:e.shape, layer:e.layer };
    if (e.type === 'note') return { kind:'note', root:e.root };
    return { kind:'chord', root:e.root, chord:e.chord };
  }

  function controls() {
    const e = EXP, sc = T.SCALES[e.scale];
    const rows = [];
    rows.push(`<div class="ctrl-row"><label class="field">Tom <select data-k="root" id="exp-root">${U.rootOptions(e.root)}</select></label>
      ${U.chips('type', [{ v:'scale', label:'Escalas' }, { v:'triad', label:'Tríades' }, { v:'caged', label:'CAGED' }, { v:'chord', label:'Arpejos' }, { v:'note', label:'Uma nota' }], e.type)}</div>`);
    if (e.type === 'scale') {
      const n = T.positionsCount(e.scale);
      rows.push(`<div class="ctrl-row"><label class="field">Escala <select data-k="scale" id="exp-scale">${Object.entries(T.SCALES).map(([k, s]) => `<option value="${k}" ${k === e.scale ? 'selected' : ''}>${s.name}</option>`).join('')}</select></label>
        ${U.chips('pos', [{ v:-1, label:'Braço' }].concat(Array.from({ length:n }, (_, i) => ({ v:i, label:(sc.sys === 'box' ? 'Caixa ' : 'Pos. ') + (i + 1) }))), e.pos)}</div>`);
    }
    if (e.type === 'triad') {
      rows.push(`<div class="ctrl-row">${U.chips('quality', ['maior', 'menor', 'dim', 'aum'].map(q => ({ v:q, label:T.CHORDS[q].name })), e.quality)}
        ${U.chips('set', T.STRING_SETS.map(s => ({ v:s.id, label:s.label })), e.set)}
        ${U.chips('inv', [{ v:-1, label:'Todas' }, { v:0, label:'Fundamental' }, { v:1, label:'1ª inv.' }, { v:2, label:'2ª inv.' }], e.inv)}</div>`);
    }
    if (e.type === 'caged') {
      rows.push(`<div class="ctrl-row">${U.chips('quality', [{ v:'maior', label:'Maior' }, { v:'menor', label:'Menor' }], e.quality === 'menor' ? 'menor' : 'maior')}
        ${U.chips('shape', [{ v:'all', label:'Todas' }, ...['C', 'A', 'G', 'E', 'D'].map(k => ({ v:k, label:'Forma ' + k }))], e.shape)}
        ${e.shape !== 'all' ? U.chips('layer', [{ v:'chord', label:'Acorde' }, { v:'arp', label:'Arpejo' }, { v:'pent', label:'Pentatônica' }], e.layer) : ''}</div>`);
    }
    if (e.type === 'chord') {
      rows.push(`<div class="ctrl-row"><label class="field">Acorde <select data-k="chord" id="exp-chord">${Object.entries(T.CHORDS).map(([k, c]) => `<option value="${k}" ${k === e.chord ? 'selected' : ''}>${c.name}</option>`).join('')}</select></label></div>`);
    }
    rows.push(`<div class="ctrl-row">${U.chips('labels', [{ v:'iv', label:'Intervalos' }, { v:'note', label:'Notas' }, { v:'none', label:'Sem rótulo' }], e.labels)}
      <button type="button" class="btn" data-act="hear">♪ Ouvir</button></div>`);
    el.querySelector('[data-ctrl]').innerHTML = rows.join('');
  }

  function info(c, d) {
    const st = U.set();
    let ivs = [], title = '';
    if (c.kind === 'scale') { ivs = T.SCALES[c.scale].iv; title = T.SCALES[c.scale].name; }
    else if (c.kind === 'triad' || c.kind === 'caged') { ivs = T.CHORDS[c.quality].iv; title = 'Tríade ' + T.CHORDS[c.quality].name.toLowerCase(); }
    else if (c.kind === 'chord') { ivs = T.CHORDS[c.chord].iv; title = 'Arpejo ' + T.CHORDS[c.chord].name.toLowerCase(); }
    else { ivs = [0]; title = 'Nota'; }
    const cells = ivs.map(iv => `<div class="deg iv-${T.IV_ROLE[iv]}"><b>${T.noteName(c.root + iv, d.flats, st.latin)}</b><span>${T.ivLabel(iv)}</span></div>`).join('');
    el.querySelector('[data-info]').innerHTML = `
      <div class="panel"><p class="eyebrow">${title} de ${T.rootName(c.root, st.latin)}</p><div class="degrees">${cells}</div>
      <p class="small">Fórmula: ${ivs.map(T.ivLabel).join(' – ')}</p></div>
      <div class="panel"><p class="eyebrow">Como estudar</p><p class="small">${tip(c)}</p></div>`;
  }

  function tip(c) {
    if (c.kind === 'scale' && c.pos < 0) return 'Com o braço inteiro aceso, escolha uma corda e toque a escala só nela, de uma ponta à outra. Depois volte para as posições.';
    if (c.kind === 'scale') return 'Toque a posição subindo e descendo com metrônomo. Depois esconda os rótulos e tente tocar só as tônicas.';
    if (c.kind === 'triad') return 'Escolha “Todas” e toque as inversões em sequência pelo braço. Depois troque só a qualidade (maior/menor) e veja qual nota anda.';
    if (c.kind === 'caged') return 'Passe pelas formas na ordem em que aparecem no braço. Em cada forma, ache a tônica nas cordas 6, 5 e 4.';
    if (c.kind === 'chord') return 'Arpejos de 4 notas (7, 7M, m7) são o próximo passo depois das tríades: eles soam “jazz” e “soul” no solo.';
    return 'Use os desenhos de oitava para ligar as posições da nota. Esconda os rótulos e tente prever onde está a próxima.';
  }

  function draw() {
    controls();
    const c = cfg();
    let d;
    if (c.kind === 'chord') {
      const ch = T.CHORDS[c.chord];
      d = { marks: T.allNotes(ch.iv, c.root, U.set().frets), flats: T.useFlats(c.root, ch.iv.includes(3) ? 3 : 0), caption: `Arpejo de ${T.chordName(c.root, c.chord, U.set().latin)} no braço inteiro.`, seq: 'run' };
    } else d = U.buildDemo(c);
    fb.set(U.fbState({ marks: d.marks, labels: EXP.labels, flats: d.flats,
      onPick: (s, f) => { A.play(T.pitch(s, f), null, { dur: 1.2, string: s }); fb.setActive([s + ':' + f]); } }));
    el.querySelector('[data-caption]').textContent = d.caption;
    el.querySelector('[data-legend]').innerHTML = U.legend(c.kind);
    info(c, d);
    draw.d = d;
  }
  draw();

  el.addEventListener('click', e => {
    const chip = e.target.closest('[data-chips] .chip');
    if (chip) {
      const g = chip.parentElement.dataset.chips, v = chip.dataset.v;
      if (['pos', 'inv'].includes(g)) EXP[g] = +v; else EXP[g] = v;
      if (g === 'type' && v === 'caged' && !['maior', 'menor'].includes(EXP.quality)) EXP.quality = 'maior';
      draw(); return;
    }
    if (e.target.closest('[data-act="hear"]')) U.playDemo(draw.d);
  });
  el.addEventListener('change', e => {
    const k = e.target.dataset.k;
    if (!k) return;
    EXP[k] = k === 'root' ? +e.target.value : e.target.value;
    if (k === 'scale') EXP.pos = Math.min(EXP.pos, T.positionsCount(EXP.scale) - 1);
    draw();
  });
  return () => A.stopAll();
};
