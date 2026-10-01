/* ===== Meu repertório e abas da seção Licks ===== */
const SONG_STATUS = [
  { v:'quero', label:'Quero aprender' }, { v:'aprendendo', label:'Aprendendo' }, { v:'pronta', label:'Pronta' }, { v:'palco', label:'No setlist' },
];
const mySongs = () => (S.get().songs || []).filter(s => !s.deleted);

function licksTabs(active) {
  return `<nav class="subtabs">${[['licks', 'licks', 'Licks e solos'], ['estudos', 'estudos', 'Estudos e peças'], ['rep', 'repertorio', 'Meu repertório'], ['ed', 'editor', '＋ Criar lick']]
    .map(([k, h, l]) => `<a href="#${h}" class="${k === active ? 'on' : ''}">${l}</a>`).join('')}</nav>`;
}

V.repertorio = (el) => {
  let editing = null, armed = null;
  el.innerHTML = `<header class="page-head"><p class="eyebrow">Repertório</p><h1>Suas músicas</h1>
      <p class="lede">Anote o que você quer tocar, acompanhe o que está aprendendo e monte o seu setlist. Um repertório pronto é o que transforma estudo em música.</p></header>
    ${licksTabs('rep')}
    <div class="stat-row" data-stats></div>
    <section class="panel">
      <details data-formbox><summary class="btn primary">＋ Adicionar música</summary>
        <form class="song-form" data-form autocomplete="off">
          <label class="field grow">Música <input type="text" id="sg-title" name="title" required placeholder="Nome da música"></label>
          <label class="field grow">Artista <input type="text" id="sg-artist" name="artist" placeholder="Quem toca"></label>
          <label class="field">Tom <input type="text" id="sg-key" name="key" placeholder="Ex.: G, Am" size="5"></label>
          <label class="field">BPM <input type="number" id="sg-bpm" name="bpm" min="30" max="260" placeholder="90"></label>
          <label class="field">Afinação <select id="sg-tuning" name="tuning">${TUNINGS.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}</select></label>
          <label class="field">Status <select id="sg-status" name="status">${SONG_STATUS.map(s => `<option value="${s.v}">${s.label}</option>`).join('')}</select></label>
          <label class="field grow">Link (vídeo, cifra ou tablatura) <input type="url" id="sg-link" name="link" placeholder="https://"></label>
          <label class="field block" for="sg-notes">Anotações</label>
          <textarea id="sg-notes" name="notes" rows="2" placeholder="Trechos difíceis, levada, capotraste…"></textarea>
          <div class="ctrl-row"><button type="submit" class="btn primary" data-save>Salvar música</button><button type="button" class="btn ghost" data-act="cancel">Cancelar</button></div>
        </form>
      </details>
    </section>
    <div data-list></div>`;
  const $ = s => el.querySelector(s);
  const form = $('[data-form]');
  const safeUrl = u => /^https?:\/\//i.test(u || '') ? u : '';

  function paint() {
    const list = mySongs();
    $('[data-stats]').innerHTML = SONG_STATUS.map(s => `<div class="stat"><b>${list.filter(x => x.status === s.v).length}</b><span>${s.label.toLowerCase()}</span></div>`).join('');
    if (!list.length) { $('[data-list]').innerHTML = `<section class="panel empty"><p><b>Seu repertório está vazio.</b> Adicione a primeira música que você quer aprender, com o link do vídeo ou da cifra.</p></section>`; return; }
    $('[data-list]').innerHTML = SONG_STATUS.map(st => {
      let items = list.filter(x => x.status === st.v);
      if (!items.length) return '';
      items = items.sort((a, b) => st.v === 'palco' ? (a.order || 0) - (b.order || 0) : (b.updatedAt || 0) - (a.updatedAt || 0));
      return `<section class="panel"><p class="eyebrow">${st.label}${st.v === 'palco' ? ' · ordem do show' : ''}</p><ol class="songs ${st.v === 'palco' ? 'setlist' : ''}">${items.map((s, i) => `<li>
        <div class="sg-main"><b>${U.esc(s.title)}</b><span class="small">${[s.artist, s.key && 'Tom ' + s.key, s.bpm && s.bpm + ' BPM', s.tuning && s.tuning !== 'padrao' ? TUNINGS.find(t => t.id === s.tuning)?.name : ''].filter(Boolean).map(U.esc).join(' · ')}</span>
          ${s.notes ? `<span class="small sg-notes">${U.esc(s.notes)}</span>` : ''}</div>
        <div class="ctrl-row">
          ${safeUrl(s.link) ? `<a class="btn" href="${U.esc(safeUrl(s.link))}" target="_blank" rel="noopener noreferrer">Abrir link ↗</a>` : ''}
          <button type="button" class="btn primary" data-practice="${s.id}">▶ Praticar</button>
          <select data-status="${s.id}" id="st-${s.id}" aria-label="Status">${SONG_STATUS.map(o => `<option value="${o.v}" ${o.v === s.status ? 'selected' : ''}>${o.label}</option>`).join('')}</select>
          ${st.v === 'palco' ? `<button type="button" class="btn ghost" data-up="${s.id}" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" class="btn ghost" data-down="${s.id}" aria-label="Descer" ${i === items.length - 1 ? 'disabled' : ''}>↓</button>` : ''}
          <button type="button" class="btn ghost" data-edit="${s.id}">Editar</button>
          <button type="button" class="btn ghost" data-del="${s.id}">${armed === s.id ? 'Clique de novo para apagar' : 'Apagar'}</button>
        </div></li>`).join('')}</ol></section>`;
    }).join('');
  }
  function save(song) { S.update(s => { s.songs = (s.songs || []).filter(x => x.id !== song.id).concat([Object.assign({}, song, { updatedAt: Date.now() })]); }); }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const base = editing ? mySongs().find(x => x.id === editing) : { id: 's' + Date.now().toString(36) };
    const song = Object.assign({}, base, { title: f.get('title').trim(), artist: f.get('artist').trim(), key: f.get('key').trim(), bpm: +f.get('bpm') || null,
      tuning: f.get('tuning'), status: f.get('status'), link: safeUrl(f.get('link').trim()), notes: f.get('notes').trim() });
    if (!song.title) return;
    if (song.status === 'palco' && song.order == null) song.order = mySongs().filter(x => x.status === 'palco').length;
    save(song); editing = null; form.reset(); $('[data-formbox]').open = false; $('[data-save]').textContent = 'Salvar música';
    U.toast('Música salva'); paint();
  });
  el.addEventListener('click', e => {
    if (e.target.closest('[data-act="cancel"]')) { editing = null; form.reset(); $('[data-formbox]').open = false; return; }
    const t = e.target.closest('[data-practice],[data-edit],[data-del],[data-up],[data-down]'); if (!t) return;
    const id = t.dataset.practice || t.dataset.edit || t.dataset.del || t.dataset.up || t.dataset.down;
    const song = mySongs().find(x => x.id === id); if (!song) return;
    if (t.dataset.practice) { PT.start({ id: 'repert', label: song.title, minutes: 10 }); save(Object.assign({}, song, { lastPracticed: S.today() })); S.practiced(); U.toast('Cronômetro de 10 minutos ligado'); paint(); }
    if (t.dataset.edit) {
      editing = id; $('[data-formbox]').open = true;
      ['title', 'artist', 'key', 'bpm', 'tuning', 'status', 'link', 'notes'].forEach(k => { form.elements[k].value = song[k] ?? ''; });
      $('[data-save]').textContent = 'Salvar alterações'; form.scrollIntoView({ block: 'center' });
    }
    if (t.dataset.del) {
      if (armed !== id) { armed = id; paint(); setTimeout(() => { if (armed === id) { armed = null; paint(); } }, 3500); return; }
      armed = null;
      S.update(s => { s.songs = (s.songs || []).filter(x => x.id !== id).concat([{ id, deleted: true, updatedAt: Date.now() }]); }); paint();
    }
    if (t.dataset.up || t.dataset.down) {
      const set = mySongs().filter(x => x.status === 'palco').sort((a, b) => (a.order || 0) - (b.order || 0));
      const i = set.findIndex(x => x.id === id), j = i + (t.dataset.up ? -1 : 1);
      if (j < 0 || j >= set.length) return;
      [set[i], set[j]] = [set[j], set[i]];
      S.update(s => { s.songs = (s.songs || []).map(x => { const k = set.findIndex(y => y.id === x.id); return k >= 0 ? Object.assign({}, x, { order: k, updatedAt: Date.now() }) : x; }); });
      paint();
    }
  });
  el.addEventListener('change', e => {
    const id = e.target.dataset.status; if (!id) return;
    const song = mySongs().find(x => x.id === id);
    const upd = Object.assign({}, song, { status: e.target.value });
    if (upd.status === 'palco') upd.order = mySongs().filter(x => x.status === 'palco').length;
    save(upd); if (upd.status === 'pronta' || upd.status === 'palco') U.toast('Mais uma música pronta!'); paint();
  });
  paint();
};
