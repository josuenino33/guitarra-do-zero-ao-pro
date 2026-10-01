/* ===== Progresso: conta (db) com cópia local ===== */
const S = (() => {
  const KEY = 'mapa-do-braco-v1';
  const DEF = () => ({ v:1, done:{}, bpm:{}, quiz:{}, days:[], changes:{}, goals:{},
    minutes:{}, plan:null, myLicks:[], songs:[], badges:{}, challenges:{},
    settings:{ latin:false, lefty:false, frets:15, tone:'clean', volume:0.8 } });
  let state = DEF(), ref = null, mode = 'local', timer = null, writing = Promise.resolve();
  const subs = new Set();

  try { const raw = localStorage.getItem(KEY); if (raw) state = Object.assign(DEF(), JSON.parse(raw)); } catch (e) {}
  state.settings = Object.assign(DEF().settings, state.settings);
  { const d = DEF(); for (const k in d) if (state[k] === undefined) state[k] = d[k]; }

  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

  function merge(a, b) {
    const out = DEF();
    out.done = Object.assign({}, b.done, a.done);
    for (const src of [a.bpm || {}, b.bpm || {}]) for (const k in src) out.bpm[k] = Math.max(out.bpm[k] || 0, src[k]);
    for (const src of [a.quiz || {}, b.quiz || {}]) for (const k in src) {
      const cur = out.quiz[k];
      if (!cur || src[k].best > cur.best) out.quiz[k] = src[k];
    }
    out.days = [...new Set([...(a.days || []), ...(b.days || [])])].sort().slice(-400);
    out.goals = Object.assign({}, b.goals, a.goals);
    for (const src of [a.changes || {}, b.changes || {}]) for (const k in src) out.changes[k] = Math.max(out.changes[k] || 0, src[k]);
    out.settings = Object.assign(DEF().settings, b.settings, a.settings);
    for (const src of [a.minutes || {}, b.minutes || {}]) for (const k in src) out.minutes[k] = Math.max(out.minutes[k] || 0, src[k]);
    out.badges = Object.assign({}, b.badges, a.badges);
    out.challenges = Object.assign({}, b.challenges, a.challenges);
    const pa = a.plan, pb = b.plan;
    out.plan = !pa ? pb || null : !pb ? pa : pa.date !== pb.date ? (pa.date > pb.date ? pa : pb)
      : Object.assign({}, pb, pa, { done: Object.assign({}, pb.done, pa.done) });
    // listas com id e updatedAt: fica a versão mais recente de cada item (apagados ficam marcados com deleted)
    const mergeList = (x = [], y = []) => {
      const m = new Map();
      [...y, ...x].forEach(it => { const cur = m.get(it.id); if (!cur || (it.updatedAt || 0) >= (cur.updatedAt || 0)) m.set(it.id, it); });
      return [...m.values()];
    };
    out.myLicks = mergeList(a.myLicks, b.myLicks);
    out.songs = mergeList(a.songs, b.songs);
    return out;
  }

  function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function scheduleRemote() {
    if (!ref) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const body = JSON.parse(JSON.stringify(state));
      writing = writing.then(() => ref.set(body)).then(() => { if (mode !== 'conta') { mode = 'conta'; emit(); } })
        .catch(e => { if (e && (e.code === 'invalid_argument' || e.code === 'revoked' || e.code === 'not_granted')) { ref = null; mode = 'local'; emit(); } });
    }, 1200);
  }

  function emit() { subs.forEach(fn => { try { fn(state, mode); } catch (e) { console.error(e); } }); }

  function update(fn) {
    fn(state);
    saveLocal();
    scheduleRemote();
    emit();
  }

  async function connect() {
    try {
      if (!window.claude || typeof window.claude.use !== 'function') return;
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!db || !user) return;
      const id = await user.id();
      if (!id) return;
      const r = db.doc('data/users/' + id + '/progress');
      const snap = await r.get();
      ref = r; mode = 'conta';
      const remote = snap.exists ? snap.data() : null;
      if (remote) { state = merge(remote, state); saveLocal(); }
      const hasLocal = Object.keys(state.done).length || state.days.length || Object.keys(state.bpm).length;
      const differs = remote ? JSON.stringify(merge(remote, {})) !== JSON.stringify(state) : hasLocal;
      if (differs) scheduleRemote();
      emit();
    } catch (e) { mode = 'local'; emit(); }
  }

  function addMinutes(n) {
    if (!(n > 0)) return;
    const d = today();
    update(s => { s.minutes[d] = Math.round(((s.minutes[d] || 0) + n) * 10) / 10; if (!s.days.includes(d)) s.days.push(d); });
  }

  function practiced() {
    const d = today();
    if (!state.days.includes(d)) update(s => { s.days.push(d); });
  }

  function streak() {
    const set = new Set(state.days);
    let n = 0; const d = new Date();
    if (!set.has(today())) d.setDate(d.getDate() - 1);
    for (;;) {
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!set.has(k)) break;
      n++; d.setDate(d.getDate() - 1);
    }
    return n;
  }

  // fora do Claude (arquivo local, GitHub Pages, app instalado) não existe window.claude
  const standalone = !(window.claude && typeof window.claude.use === 'function');

  function importData(obj) {
    if (!obj || typeof obj !== 'object' || !obj.done || !obj.settings) throw new Error('Arquivo de backup inválido');
    state = merge(obj, state);
    saveLocal(); scheduleRemote(); emit();
  }
  const exportData = () => JSON.stringify(Object.assign({ app: 'mapa-do-braco', exportedAt: new Date().toISOString() }, state), null, 1);

  return {
    get: () => state, get mode() { return mode; }, standalone, importData, exportData,
    update, connect, practiced, streak, today, addMinutes,
    on(fn) { subs.add(fn); return () => subs.delete(fn); },
    reset() { const keep = state.settings; state = DEF(); state.settings = keep; saveLocal(); scheduleRemote(); emit(); },
  };
})();
