// main.js — router and controls for TalaStat. Hash routes only, no network:
// #/ dashboard, #/economy, #/population, #/labor, #/regions.
// State (year, chart type, region filter, search, sort) lives here and is
// re-applied on every render so every control visibly does its job.

import { REGIONS } from './data.js';
import {
  renderDashboard, drawDashboard,
  renderEconomy, drawEconomy,
  renderPopulation, drawPopulation,
  renderLabor, drawLabor,
  renderRegions, filteredRegions, regionTableRows,
} from './pages.js';

const view = document.getElementById('view');
const navLinks = [...document.querySelectorAll('.nav a')];

const state = {
  year: 2024,
  econChart: 'line',
  island: 'All',
  query: '',
  sortKey: 'pop',
  sortDir: -1,
};

function setActiveNav(route) {
  navLinks.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + route);
  });
}

function sortedRegions(rows) {
  const key = state.sortKey;
  const dir = state.sortDir;
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === 'string') return av.localeCompare(bv) * dir;
    return (av - bv) * dir;
  });
}

function paintRegionRows() {
  const rows = sortedRegions(filteredRegions(state.island, state.query));
  const tbody = document.getElementById('region-rows');
  if (!tbody) return;
  tbody.innerHTML = regionTableRows(rows);
  const count = document.getElementById('region-count');
  if (count) count.textContent = `— ${rows.length} of ${REGIONS.length} regions`;
  const empty = document.getElementById('region-empty');
  if (empty) empty.hidden = rows.length !== 0;
}

function bindYearSelect(id) {
  const sel = document.getElementById(id);
  if (sel) sel.addEventListener('change', () => {
    state.year = Number(sel.value);
    render();
  });
}

function render() {
  const hash = window.location.hash || '#/';
  const route = hash.replace(/^#\/?/, '').split('/')[0] || '';
  if (route === 'economy') {
    view.innerHTML = renderEconomy(state.year, state.econChart);
    setActiveNav('/economy');
    drawEconomy(state.econChart);
    bindYearSelect('econ-year');
    view.querySelectorAll('[data-chart]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.econChart = btn.getAttribute('data-chart');
        render();
      });
    });
  } else if (route === 'population') {
    view.innerHTML = renderPopulation();
    setActiveNav('/population');
    drawPopulation();
  } else if (route === 'labor') {
    view.innerHTML = renderLabor(state.year);
    setActiveNav('/labor');
    drawLabor();
    bindYearSelect('labor-year');
  } else if (route === 'regions') {
    view.innerHTML = renderRegions(state.island, state.query);
    setActiveNav('/regions');
    paintRegionRows();
    const islandSel = document.getElementById('region-island');
    if (islandSel) islandSel.addEventListener('change', () => {
      state.island = islandSel.value;
      render();
    });
    const search = document.getElementById('region-search');
    if (search) {
      search.addEventListener('input', () => {
        state.query = search.value;
        paintRegionRows();
      });
      search.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') event.preventDefault();
      });
    }
    view.querySelectorAll('th[data-sort]').forEach((th) => {
      th.addEventListener('click', () => {
        const key = th.getAttribute('data-sort');
        if (state.sortKey === key) state.sortDir *= -1;
        else {
          state.sortKey = key;
          state.sortDir = key === 'name' || key === 'code' || key === 'island' ? 1 : -1;
        }
        paintRegionRows();
      });
    });
  } else {
    view.innerHTML = renderDashboard(state.year);
    setActiveNav('/');
    drawDashboard();
    bindYearSelect('dash-year');
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
