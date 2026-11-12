/* ===== Edição Worship: plano do dia só com louvor (4 níveis) ===== */
if (EDICAO.ativa) {
  const B = PLAN.BLOCKS;
  Object.keys(B).forEach(k => delete B[k]);
  Object.assign(B, {
    1: [
      { id:'aquec', title:'Aquecimento', desc:'Cordas soltas com palhetada alternada.', href:'#treino-ex-soltas', pct:.1 },
      { id:'trocas', title:'Trocas de acordes', desc:'G, Cadd9, Em7 e Dsus4: 1 minuto cada par.', href:'#trocas', pct:.2 },
      { id:'base', title:'Base worship', desc:'Acompanhe a base congregacional com os acordes coloridos.', href:'#jam-w-cong', pct:.3 },
      { id:'aula', title:'Aula da trilha', desc:'', href:'', pct:.25 },
      { id:'repert', title:'Repertório', desc:'Uma música do culto do começo ao fim.', href:'#repertorio', pct:.15 } ],
    2: [
      { id:'aquec', title:'Aquecimento', desc:'Pentatônica, subindo e descendo devagar.', href:'#treino-ex-pent', pct:.1 },
      { id:'tri', title:'Tríades', desc:'Uma progressão nova em tríades e o treino “Qual inversão?”.', href:'#triades', pct:.25 },
      { id:'aula', title:'Aula da trilha', desc:'', href:'', pct:.2 },
      { id:'base', title:'Base com tríades', desc:'Base 6/8 com a guitarra em tríades agudas.', href:'#jam-w-68', pct:.3 },
      { id:'ouvido', title:'Ouvido', desc:'Treino de ouvido: continue do seu nível.', href:'#ouvido', pct:.15 } ],
    3: [
      { id:'aquec', title:'Aquecimento', desc:'Um dedo por casa, com metrônomo.', href:'#treino-ex-1234', pct:.1 },
      { id:'enfeites', title:'Enfeites', desc:'Sus resolvendo na 3ª e arremates nas trocas.', href:'#licks', pct:.2 },
      { id:'aula', title:'Aula da trilha', desc:'', href:'', pct:.2 },
      { id:'frases', title:'Frases com delay', desc:'Gere frases no Jam worship e toque junto.', href:'#jam-w-cong', pct:.3 },
      { id:'repert', title:'Repertório', desc:'Solos e enfeites numa música do culto.', href:'#repertorio', pct:.2 } ],
    4: [
      { id:'aquec', title:'Aquecimento', desc:'Pentatônica, subindo e descendo devagar.', href:'#treino-ex-pent', pct:.1 },
      { id:'campo', title:'Campo harmônico', desc:'Um tom novo no campo “✨ Worship”, dizendo os números.', href:'#campo', pct:.2 },
      { id:'aula', title:'Harmonia', desc:'', href:'', pct:.2 },
      { id:'ouvido', title:'Ouvido', desc:'Graus da escala e progressões.', href:'#ouvido', pct:.2 },
      { id:'palco', title:'Modo Palco', desc:'Uma música do repertório no Modo Palco, do começo ao fim.', href:'#repertorio', pct:.3 } ],
  });
}
