/* ===== Preferências de tela (tom, escala, estilo, filtros) lembradas neste aparelho ===== */
const UIP = (() => {
  const KEY = 'mapa-do-braco-ui';
  let data = {};
  try { data = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { data = {}; }
  const tracked = [];

  function save() {
    tracked.forEach(t => { try { data[t.name] = JSON.parse(JSON.stringify(t.get())); } catch (e) {} });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }
  let tm = null;
  const soon = () => { clearTimeout(tm); tm = setTimeout(save, 250); };

  /**
   * Lembra um objeto de estado (copia os campos salvos para ele agora)
   * ou um valor solto com get/restore.
   */
  function track(name, obj, restore) {
    if (typeof obj === 'function') {
      tracked.push({ name, get: obj });
      if (data[name] !== undefined) { try { restore(data[name]); } catch (e) {} }
    } else {
      tracked.push({ name, get: () => obj });
      if (data[name] && typeof data[name] === 'object') Object.assign(obj, data[name]);
    }
  }

  const lickKey = id => (data.lickKeys || {})[id] ?? null;
  function setLickKey(id, pc) {
    data.lickKeys = data.lickKeys || {};
    if (pc == null) delete data.lickKeys[id]; else data.lickKeys[id] = pc;
    soon();
  }

  ['change', 'input', 'click'].forEach(ev => document.addEventListener(ev, soon, true));
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
  return { track, save, lickKey, setLickKey };
})();
