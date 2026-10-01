/* ===== Telas do Braço: dicionário de acordes e campo harmônico ===== */
function bracoTabs(active) {
  return `<nav class="subtabs">${[['exp', 'braco', 'Explorador'], ['dict', 'acordes', 'Dicionário de acordes'], ['campo', 'campo', 'Campo harmônico']]
    .map(([k, h, l]) => `<a href="#${h}" class="${k === active ? 'on' : ''}">${l}</a>`).join('')}</nav>`;
}
V.acordes = (el) => {
  el.innerHTML = `<header class="page-head"><p class="eyebrow">Braço</p><h1>Dicionário de acordes</h1></header>${bracoTabs('dict')}<section class="panel" data-w></section>`;
  return W.dict(el.querySelector('[data-w]'), { root: 'C', q: 'maior' });
};
V.campo = (el) => {
  el.innerHTML = `<header class="page-head"><p class="eyebrow">Braço</p><h1>Campo harmônico</h1></header>${bracoTabs('campo')}<section class="panel" data-w></section>`;
  return W.campo(el.querySelector('[data-w]'), { root: 'C', scale: 'maior', views: [{ label: 'Maior', scale: 'maior' }, { label: 'Menor natural', scale: 'menor' }, { label: 'Menor harmônica', scale: 'menor_harm' }] });
};
