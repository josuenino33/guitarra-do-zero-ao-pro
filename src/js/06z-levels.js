/* ===== Nível e ordem dos módulos originais (roda depois de todos os módulos) ===== */
Object.entries({ m1:[2, 1], m2:[2, 2], m3:[3, 1], m4:[3, 2], m5:[3, 3], m6:[4, 1], m7:[4, 2], m8:[5, 1] })
  .forEach(([id, [lv, o]]) => { const m = MODULES.find(x => x.id === id); if (m) { m.level = lv; m.order = o; } });
