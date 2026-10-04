/* ===== Motivação: XP, patentes, conquistas e desafio do dia ===== */
const MOT = (() => {
  const RANKS = [
    { xp:0, name:'Aprendiz' }, { xp:400, name:'Músico de quarto' }, { xp:1200, name:'Garagem' }, { xp:2600, name:'Barzinho' },
    { xp:5000, name:'Palco' }, { xp:8500, name:'Estúdio' }, { xp:13000, name:'Turnê' }, { xp:20000, name:'Lenda' },
  ];
  const sum = o => Object.values(o || {}).reduce((a, b) => a + (+b || 0), 0);

  /** XP calculado a partir do que você já fez (nada fica duplicado entre aparelhos). */
  function xp(st = S.get()) {
    const parts = {
      'Aulas concluídas': Object.keys(st.done).length * 50,
      'Metas de nível': Object.keys(st.goals || {}).length * 120,
      'Minutos praticados': Math.round(sum(st.minutes) * 2),
      'Dias de prática': st.days.length * 15,
      'Quizzes': Math.round(Object.values(st.quiz).reduce((a, q) => a + q.best, 0) / 2),
      'Recordes de BPM': Object.keys(st.bpm).length * 25,
      'Trocas de acordes': Math.round(sum(st.changes) / 2),
      'Desafios do dia': Object.keys(st.challenges || {}).length * 60,
      'Repertório': (st.songs || []).filter(s => !s.deleted && (s.status === 'pronta' || s.status === 'palco')).length * 40,
      'Licks criados': (st.myLicks || []).filter(l => !l.deleted).length * 20,
      'Treino de ouvido': EAR.passed(st) * 40,
    };
    return { total: Object.values(parts).reduce((a, b) => a + b, 0), parts };
  }
  function rank(total) {
    let i = 0; while (i + 1 < RANKS.length && total >= RANKS[i + 1].xp) i++;
    const cur = RANKS[i], nx = RANKS[i + 1];
    return { i, cur, next: nx, pct: nx ? (total - cur.xp) / (nx.xp - cur.xp) : 1 };
  }

  const done = st => Object.keys(st.done).length;
  const totalMin = st => sum(st.minutes);
  const bestQuiz = st => Math.max(0, ...Object.values(st.quiz).map(q => q.best));
  const lvDone = (st, n) => typeof levelStats === 'function' && levelStats(n, st).pct >= 1;
  const BADGES = [
    { id:'primeira-aula', icon:'1', name:'Primeira aula', desc:'Concluiu a primeira aula.', test: st => done(st) >= 1 },
    { id:'dez-aulas', icon:'10', name:'Dez aulas', desc:'Concluiu 10 aulas.', test: st => done(st) >= 10 },
    { id:'meia-trilha', icon:'½', name:'Meia trilha', desc:'Concluiu metade das aulas.', test: st => done(st) >= Math.ceil(ALL_LESSONS().length / 2) },
    { id:'semana', icon:'7', name:'Uma semana', desc:'7 dias seguidos de prática.', test: () => S.streak() >= 7 },
    { id:'mes', icon:'30', name:'Um mês', desc:'30 dias seguidos de prática.', test: () => S.streak() >= 30 },
    { id:'hora', icon:'60', name:'Uma hora num dia', desc:'60 minutos de prática no mesmo dia.', test: st => Math.max(0, ...Object.values(st.minutes)) >= 60 },
    { id:'dez-horas', icon:'10h', name:'10 horas', desc:'10 horas de prática no total.', test: st => totalMin(st) >= 600 },
    { id:'cem-horas', icon:'100h', name:'100 horas', desc:'100 horas de prática no total.', test: st => totalMin(st) >= 6000 },
    { id:'trocas30', icon:'⇄', name:'Mão rápida', desc:'30 trocas de acordes em 1 minuto.', test: st => Math.max(0, ...Object.values(st.changes)) >= 30 },
    { id:'quiz100', icon:'✓', name:'Gabaritou', desc:'100% em um quiz.', test: st => bestQuiz(st) >= 100 },
    { id:'bpm120', icon:'♩', name:'120 BPM', desc:'Recorde de 120 BPM ou mais num exercício.', test: st => Math.max(0, ...Object.values(st.bpm)) >= 120 },
    { id:'compositor', icon:'✎', name:'Compositor', desc:'Criou o primeiro lick no editor.', test: st => (st.myLicks || []).some(l => !l.deleted) },
    { id:'repertorio5', icon:'♫', name:'Repertório', desc:'5 músicas prontas no repertório.', test: st => (st.songs || []).filter(s => !s.deleted && ['pronta', 'palco'].includes(s.status)).length >= 5 },
    { id:'setlist', icon:'★', name:'Setlist montado', desc:'10 músicas no setlist.', test: st => (st.songs || []).filter(s => !s.deleted && s.status === 'palco').length >= 10 },
    { id:'desafios7', icon:'⚑', name:'Desafiante', desc:'7 desafios do dia cumpridos.', test: st => Object.keys(st.challenges || {}).length >= 7 },
    ...[1, 2, 3, 4, 5].map(n => ({ id:'nivel' + n, icon:'N' + n, name:'Nível ' + n + ' completo', desc:'Todas as aulas e metas do nível ' + n + '.', test: st => lvDone(st, n) })),
  ];

  let checking = false;
  function checkBadges() {
    if (checking) return; checking = true;
    try {
      const st = S.get(), fresh = BADGES.filter(b => !(st.badges || {})[b.id] && b.test(st));
      if (fresh.length) {
        S.update(s => { s.badges = s.badges || {}; fresh.forEach(b => { s.badges[b.id] = S.today(); }); });
        U.toast(fresh.length === 1 ? `Conquista: ${fresh[0].name}` : `${fresh.length} conquistas novas!`);
      }
    } finally { checking = false; }
  }

  /* desafio do dia: sorteado pela data, adaptado ao nível */
  const CHALLENGES = [
    { lv:1, text:'Faça 20 trocas de G para C em 1 minuto.', href:'#trocas', test: st => (st.changes['G-C'] || 0) >= 20 },
    { lv:1, text:'Toque a levada pop por 3 minutos sem parar.', href:'#levadas-pop' },
    { lv:1, text:'Afine a guitarra sozinho e toque “Estrada de Terra”.', href:'#aula-primeira-musica' },
    { lv:1, text:'Acerte 8 de 10 no quiz “Qual é a nota?”.', href:'#quiz-qual-nota', test: st => st.quiz['qual-nota']?.date === S.today() && st.quiz['qual-nota'].best >= 80 },
    { lv:1, text:'Toque junto 3 ritmos da leitura rítmica com mais de 80%.', href:'#aula-pulso' },
    { lv:1, text:'Faça uma rodada de intervalos no treino de ouvido com 80% ou mais.', href:'#ouvido-intervalos', test: st => st.ear?.intervalos?.date === S.today() },
    { lv:2, text:'Toque o riff de power chords a 100 BPM.', href:'#treino-r3' },
    { lv:2, text:'Toque a levada de funk por 2 minutos.', href:'#levadas-funk' },
    { lv:2, text:'Toque F e Bm limpos, 10 vezes cada.', href:'#aula-pestana-f' },
    { lv:2, text:'Acerte 9 de 10 no quiz “Ache a nota”.', href:'#quiz-ache-nota', test: st => st.quiz['ache-nota']?.date === S.today() && st.quiz['ache-nota'].best >= 90 },
    { lv:3, text:'Improvise 5 minutos no blues usando só a caixa 1.', href:'#jam-blues' },
    { lv:3, text:'Toque as 3 inversões de Ré maior nas cordas 1-2-3.', href:'#aula-triade-123' },
    { lv:3, text:'Toque Dó maior nas 5 formas do CAGED.', href:'#aula-caged' },
    { lv:3, text:'Acerte 8 de 10 no quiz de tríades.', href:'#quiz-triade', test: st => st.quiz.triade?.date === S.today() && st.quiz.triade.best >= 80 },
    { lv:3, text:'Faça uma rodada de graus da escala com 80% ou mais.', href:'#ouvido-graus', test: st => st.ear?.graus?.date === S.today() },
    { lv:4, text:'Toque o campo harmônico de Sol em tétrades.', href:'#campo' },
    { lv:4, text:'Suba 5 BPM no seu recorde de escala em 3 notas por corda.', href:'#treino-ex-3nps' },
    { lv:4, text:'Leia 20 notas seguidas na partitura.', href:'#aula-primeira-posicao' },
    { lv:4, text:'Improvise na base dórica destacando a 6ª maior.', href:'#jam-dorico' },
    { lv:4, text:'Faça uma rodada de ditado melódico com 80% ou mais.', href:'#ouvido-ditado', test: st => st.ear?.ditado?.date === S.today() },
    { lv:5, text:'Toque um ii–V–I em 3 tons diferentes.', href:'#jam-iivi' },
    { lv:5, text:'Grave 2 minutos de improviso e escute com atenção.', href:'#gravar' },
    { lv:5, text:'Tire de ouvido uma frase e salve no editor.', href:'#editor' },
    { lv:5, text:'Toque o seu setlist do começo ao fim.', href:'#repertorio' },
  ];
  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function daily() {
    const lv = PLAN.currentLevel(), pool = CHALLENGES.filter(c => c.lv <= lv && c.lv >= lv - 1);
    return pool[hash(S.today()) % pool.length];
  }
  function completeToday() { S.update(s => { s.challenges = s.challenges || {}; s.challenges[S.today()] = true; }); S.practiced(); U.toast('Desafio do dia cumprido! +60 XP'); }

  function rankCard(st) {
    const x = xp(st), r = rank(x.total);
    return `<section class="panel rank"><p class="eyebrow">Sua patente</p>
      <div class="rank-row"><b class="rank-name">${r.cur.name}</b><span class="xp">${x.total.toLocaleString('pt-BR')} XP</span></div>
      <div class="bar wide"><i style="width:${Math.round(r.pct * 100)}%"></i></div>
      <p class="small">${r.next ? `Faltam ${(r.next.xp - x.total).toLocaleString('pt-BR')} XP para <b>${r.next.name}</b>.` : 'Patente máxima!'} XP vem de aulas, metas, minutos, quizzes, treino de ouvido, recordes, desafios e repertório.</p></section>`;
  }
  function challengeCard(st) {
    const c = daily(), ok = (st.challenges || {})[S.today()];
    return `<section class="panel challenge ${ok ? 'done' : ''}"><p class="eyebrow">Desafio do dia</p>
      <p class="ch-text">${c.text}</p>
      <div class="ctrl-row">${ok ? '<span class="pill ok">Cumprido</span>' : `<a class="btn primary" href="${c.href}">Ir para o desafio →</a><button type="button" class="btn" data-ch-done>✓ Consegui</button>`}</div></section>`;
  }
  function badgesGrid(st, limit) {
    const got = BADGES.filter(b => (st.badges || {})[b.id]);
    const list = limit ? got.slice(-limit).reverse() : BADGES;
    return `<div class="badges">${list.map(b => { const on = (st.badges || {})[b.id];
      return `<div class="badge ${on ? 'on' : ''}" title="${b.desc}"><i>${b.icon}</i><b>${b.name}</b><span>${on ? new Date(on + 'T12:00').toLocaleDateString('pt-BR') : b.desc}</span></div>`; }).join('')}</div>`;
  }

  // Hoje: patente, desafio e últimas conquistas
  HOJE_EXTRA.push(host => {
    const st = S.get();
    host.insertAdjacentHTML('beforeend', challengeCard(st) + rankCard(st));
    const got = Object.keys(st.badges || {}).length;
    if (got) host.insertAdjacentHTML('beforeend', `<section class="panel"><p class="eyebrow">Últimas conquistas · ${got} de ${BADGES.length}</p>${badgesGrid(st, 3)}<a class="small" href="#progresso">Ver todas →</a></section>`);
    // marcação automática quando o próprio app consegue verificar o desafio
    const c = daily();
    if (!(st.challenges || {})[S.today()] && c.test && c.test(st)) setTimeout(() => { completeToday(); APP.rerender(); }, 300);
    host.addEventListener('click', e => { if (e.target.closest('[data-ch-done]')) { completeToday(); APP.rerender(); } });
  });

  let tm = null;
  S.on(() => { clearTimeout(tm); tm = setTimeout(checkBadges, 600); });
  setTimeout(checkBadges, 1500);

  return { xp, rank, BADGES, rankCard, badgesGrid, checkBadges, daily };
})();
