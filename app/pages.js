// pages.js — one renderer per hash route. Each returns the page HTML for
// the #view container; main.js inserts it and then calls the matching
// draw function so every canvas is painted from the same data.

import { YEARS, YEARLY, AGE_GROUPS, EMPLOYMENT_SECTORS, MINIMUM_WAGES, REGIONS, HEADLINES, formatNumber, yearValue } from './data.js';
import { drawLineChart, drawBarChart, drawHorizontalBars, drawDonut, PALETTE } from './charts.js';

export function kpiCard(label, value, sub, source) {
  return `<article class="kpi"><p class="kpi-label">${label}</p><p class="kpi-value">${value}</p><p class="kpi-sub">${sub}</p><p class="kpi-src">${source}</p></article>`;
}

export function sourceNote(text) {
  return `<p class="source-note">Source: ${text}</p>`;
}

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('');
}

export function yearSelectorHtml(selected, id) {
  return `<label class="year-pick">Year <select id="${id}" aria-label="Choose year">${yearOptions(selected)}</select></label>`;
}

// ---------- Dashboard (home) ----------
export function renderDashboard(year) {
  const pop = yearValue(YEARLY.population, year);
  const gdp = yearValue(YEARLY.gdpUsd, year);
  const growth = yearValue(YEARLY.gdpGrowth, year);
  const infl = yearValue(YEARLY.inflation, year);
  const unemp = yearValue(YEARLY.unemployment, year);
  const remit = yearValue(YEARLY.remittances, year);
  const topRegions = [...REGIONS].sort((a, b) => b.pop - a.pop).slice(0, 5);
  const regionRows = topRegions.map((r) => `<tr><td>${r.name}</td><td>${formatNumber(r.pop, 2)} m</td><td>${r.grdp.toFixed(1)}%</td></tr>`).join('');
  return `
  <section class="hero">
    <h1>Philippines by the numbers</h1>
    <p class="lede">Population, economy, jobs and regions — the headline figures, from the latest official releases.</p>
    <div class="hero-controls">${yearSelectorHtml(year, 'dash-year')}
      <a class="btn" href="#/economy">Explore the economy →</a>
      <a class="btn btn-ghost" href="#/regions">Compare regions →</a>
    </div>
  </section>
  <section class="kpi-grid" aria-label="Key indicators">
    ${kpiCard('Population', formatNumber(pop, 1) + ' m', 'people living in the Philippines', 'PSA, ' + year)}
    ${kpiCard('GDP', '$' + formatNumber(gdp, 0) + ' bn', 'nominal GDP, ' + (growth >= 0 ? '+' : '') + growth.toFixed(1) + '% real growth', 'PSA / World Bank, ' + year)}
    ${kpiCard('Inflation', infl.toFixed(1) + '%', 'average headline inflation', 'PSA, ' + year)}
    ${kpiCard('Unemployment', unemp.toFixed(1) + '%', 'of the labour force', 'PSA Labour Force Survey, ' + year)}
    ${kpiCard('Remittances', '$' + remit.toFixed(1) + ' bn', 'personal remittances from overseas Filipinos', 'BSP, ' + year)}
    ${kpiCard('Poverty rate', HEADLINES.poverty2023.toFixed(1) + '%', 'poverty incidence, 2023', 'PSA, 2023 · down from 18.1% in 2021')}
  </section>
  <section class="chart-row">
    <article class="panel"><h2>GDP, 2019–2024 (US$ bn)</h2>
      <canvas id="chart-gdp" width="560" height="250" role="img" aria-label="Line chart of nominal GDP from 2019 to 2024"></canvas>
      ${sourceNote('PSA national accounts; World Bank. 2024: $462 bn.')}</article>
    <article class="panel"><h2>Inflation, 2019–2024 (%)</h2>
      <canvas id="chart-inflation" width="560" height="250" role="img" aria-label="Bar chart of average inflation from 2019 to 2024"></canvas>
      ${sourceNote('PSA. Peaked at 6.0% in 2023, eased to 3.2% in 2024.')}</article>
  </section>
  <section class="split">
    <article class="panel"><h2>Largest regions by population, 2024</h2>
      <table class="data-table"><thead><tr><th>Region</th><th>Population</th><th>Share of GDP</th></tr></thead><tbody>${regionRows}</tbody></table>
      ${sourceNote('2024 Census of Population, PSA. See the full ranking on the Regions page.')}</article>
    <article class="panel"><h2>At a glance</h2>
      <ul class="facts">
        <li><strong>${formatNumber(HEADLINES.medianAge, 1)} years</strong> — median age of Filipinos (PSA, 2024).</li>
        <li><strong>${formatNumber(HEADLINES.lifeExpectancy, 1)} years</strong> — life expectancy at birth (PSA, 2024).</li>
        <li><strong>${formatNumber(HEADLINES.households2024, 1)} million</strong> — households counted in the 2024 Census.</li>
        <li><strong>17 regions</strong> — from Metro Manila to BARMM, compared on the Regions page.</li>
        <li><strong>7,641 islands</strong> — the archipelago the statistics cover.</li>
      </ul>
      <p class="panel-note">Every figure on this site names its source and year. Figures are rounded; totals may not sum exactly.</p></article>
  </section>`;
}

export function drawDashboard() {
  const gdpSeries = YEARS.map((y) => ({ label: String(y), value: YEARLY.gdpUsd[y] }));
  drawLineChart(document.getElementById('chart-gdp'), gdpSeries, { color: PALETTE.teal, decimals: 0 });
  const inflSeries = YEARS.map((y) => ({ label: String(y), value: YEARLY.inflation[y] }));
  drawBarChart(document.getElementById('chart-inflation'), inflSeries, { decimals: 1 });
}

// ---------- Economy ----------
export function renderEconomy(year, chartType) {
  const gdp = yearValue(YEARLY.gdpUsd, year);
  const growth = yearValue(YEARLY.gdpGrowth, year);
  const infl = yearValue(YEARLY.inflation, year);
  const ex = yearValue(YEARLY.exports, year);
  const im = yearValue(YEARLY.imports, year);
  const remit = yearValue(YEARLY.remittances, year);
  const tradeRows = YEARS.map((y) => {
    const bal = YEARLY.exports[y] - YEARLY.imports[y];
    return `<tr><td>${y}</td><td>$${YEARLY.exports[y].toFixed(1)} bn</td><td>$${YEARLY.imports[y].toFixed(1)} bn</td><td>$${bal.toFixed(1)} bn</td></tr>`;
  }).join('');
  return `
  <section class="page-head"><h1>Economy</h1>
    <p class="lede">Growth, prices, trade and the money overseas Filipinos send home.</p>
    <div class="hero-controls">${yearSelectorHtml(year, 'econ-year')}
      <span class="toggle" role="group" aria-label="Chart type">
        <button type="button" data-chart="line" class="${chartType === 'line' ? 'active' : ''}">Line</button>
        <button type="button" data-chart="bar" class="${chartType === 'bar' ? 'active' : ''}">Bars</button>
      </span>
    </div></section>
  <section class="kpi-grid" aria-label="Economy indicators">
    ${kpiCard('GDP', '$' + formatNumber(gdp, 0) + ' bn', 'nominal GDP in ' + year, 'PSA / World Bank')}
    ${kpiCard('Real GDP growth', (growth >= 0 ? '+' : '') + growth.toFixed(1) + '%', 'year on year, ' + year, 'PSA')}
    ${kpiCard('Inflation', infl.toFixed(1) + '%', 'average headline inflation, ' + year, 'PSA')}
    ${kpiCard('Exports', '$' + ex.toFixed(1) + ' bn', 'merchandise exports, ' + year, 'PSA trade statistics')}
    ${kpiCard('Imports', '$' + im.toFixed(1) + ' bn', 'merchandise imports, ' + year, 'PSA trade statistics')}
    ${kpiCard('Remittances', '$' + remit.toFixed(1) + ' bn', 'personal remittances, ' + year, 'BSP')}
  </section>
  <section class="chart-row">
    <article class="panel"><h2>Real GDP growth, 2019–2024 (%)</h2>
      <canvas id="chart-growth" width="560" height="250" role="img" aria-label="Chart of real GDP growth from 2019 to 2024"></canvas>
      ${sourceNote('PSA. The 2020 contraction of 9.5% was the pandemic year; growth rebounded to 7.6% in 2022.')}</article>
    <article class="panel"><h2>Remittances, 2019–2024 (US$ bn)</h2>
      <canvas id="chart-remit" width="560" height="250" role="img" aria-label="Bar chart of personal remittances from 2019 to 2024"></canvas>
      ${sourceNote('BSP. Remittances rose every year from 2020 to 2024, reaching $38.3 bn.')}</article>
  </section>
  <section class="panel"><h2>Trade balance, 2019–2024</h2>
    <table class="data-table"><thead><tr><th>Year</th><th>Exports</th><th>Imports</th><th>Balance</th></tr></thead><tbody>${tradeRows}</tbody></table>
    ${sourceNote('PSA trade statistics. The Philippines imports more merchandise than it exports; the gap was $53.8 bn in 2024.')}</section>`;
}

export function drawEconomy(chartType) {
  const growthSeries = YEARS.map((y) => ({ label: String(y), value: YEARLY.gdpGrowth[y] }));
  if (chartType === 'bar') drawBarChart(document.getElementById('chart-growth'), growthSeries, { decimals: 1 });
  else drawLineChart(document.getElementById('chart-growth'), growthSeries, { color: PALETTE.gold, decimals: 1 });
  const remitSeries = YEARS.map((y) => ({ label: String(y), value: YEARLY.remittances[y] }));
  drawBarChart(document.getElementById('chart-remit'), remitSeries, { decimals: 1 });
}

// ---------- Population ----------
export function renderPopulation() {
  const popRows = YEARS.map((y) => `<tr><td>${y}</td><td>${formatNumber(YEARLY.population[y], 1)} m</td><td>${y === 2020 || y === 2024 ? 'Census' : 'Estimate'}</td></tr>`).join('');
  return `
  <section class="page-head"><h1>Population</h1>
    <p class="lede">How many Filipinos there are, how old they are, and where they live.</p></section>
  <section class="kpi-grid" aria-label="Population indicators">
    ${kpiCard('Population, 2024', '112.7 m', '2024 Census of Population', 'PSA, 2024')}
    ${kpiCard('Median age', '25.3 years', 'half the population is younger', 'PSA, 2024')}
    ${kpiCard('Life expectancy', '72.2 years', 'at birth', 'PSA, 2024')}
    ${kpiCard('Households', '28.5 m', 'counted in the 2024 Census', 'PSA, 2024')}
    ${kpiCard('Aged 0–14', '27.9%', 'share of the population', 'PSA, 2024')}
    ${kpiCard('Aged 65+', '6.2%', 'share of the population', 'PSA, 2024')}
  </section>
  <section class="chart-row">
    <article class="panel"><h2>Population by age group, 2024</h2>
      <canvas id="chart-age" width="560" height="220" role="img" aria-label="Horizontal bar chart of population by age group in 2024"></canvas>
      ${sourceNote('PSA, 2024. The 25–54 band is the largest at 43.4 million people.')}</article>
    <article class="panel"><h2>Population, 2019–2024 (millions)</h2>
      <canvas id="chart-pop" width="560" height="220" role="img" aria-label="Line chart of population from 2019 to 2024"></canvas>
      ${sourceNote('PSA. 2020 and 2024 are census counts; other years are mid-year estimates.')}</article>
  </section>
  <section class="panel"><h2>Population by year</h2>
    <table class="data-table"><thead><tr><th>Year</th><th>Population</th><th>Basis</th></tr></thead><tbody>${popRows}</tbody></table>
    ${sourceNote('PSA Census of Population 2020 and 2024; mid-year population projections for other years.')}</section>`;
}

export function drawPopulation() {
  const ageRows = AGE_GROUPS.map((g, i) => ({
    label: g.band,
    value: g.millions,
    display: g.millions.toFixed(1) + ' m · ' + g.share.toFixed(1) + '%',
    color: [PALETTE.blue, PALETTE.teal, PALETTE.gold, PALETTE.coral, PALETTE.lightBlue][i],
  }));
  drawHorizontalBars(document.getElementById('chart-age'), ageRows, { rowHeight: 36 });
  const popSeries = YEARS.map((y) => ({ label: String(y), value: YEARLY.population[y] }));
  drawLineChart(document.getElementById('chart-pop'), popSeries, { color: PALETTE.blue, decimals: 1 });
}

// ---------- Labor ----------
export function renderLabor(year) {
  const unemp = yearValue(YEARLY.unemployment, year);
  const wageRows = MINIMUM_WAGES.map((w) => `<tr><td>${w.region}</td><td>₱${w.wage.toLocaleString('en-US')}</td></tr>`).join('');
  const sectorList = EMPLOYMENT_SECTORS.map((s) => `<li><span class="dot" style="background:${s.sector === 'Services' ? PALETTE.teal : s.sector === 'Industry' ? PALETTE.gold : PALETTE.blue}"></span>${s.sector} — <strong>${s.share.toFixed(1)}%</strong></li>`).join('');
  return `
  <section class="page-head"><h1>Labour &amp; wages</h1>
    <p class="lede">Who works, where they work, what unemployment looks like, and the daily minimum wage by region.</p>
    <div class="hero-controls">${yearSelectorHtml(year, 'labor-year')}</div></section>
  <section class="kpi-grid" aria-label="Labour indicators">
    ${kpiCard('Unemployment', unemp.toFixed(1) + '%', 'of the labour force, ' + year, 'PSA Labour Force Survey')}
    ${kpiCard('Unemployment, 2020 peak', '10.4%', 'pandemic-year peak, for comparison', 'PSA, 2020')}
    ${kpiCard('Services share', '60.8%', 'of employed persons work in services', 'PSA, 2024')}
    ${kpiCard('Agriculture share', '21.3%', 'of employed persons work in agriculture', 'PSA, 2024')}
    ${kpiCard('NCR minimum wage', '₱645 / day', 'daily minimum, non-agriculture', 'NCR wage order, 2024')}
    ${kpiCard('Labour force', '≈ 52 m', 'people in the labour force, 2024', 'PSA, 2024')}
  </section>
  <section class="chart-row">
    <article class="panel"><h2>Unemployment rate, 2019–2024 (%)</h2>
      <canvas id="chart-unemp" width="560" height="250" role="img" aria-label="Line chart of the unemployment rate from 2019 to 2024"></canvas>
      ${sourceNote('PSA Labour Force Survey. From the 10.4% pandemic peak in 2020 down to 3.8% in 2024.')}</article>
    <article class="panel"><h2>Where Filipinos work, 2024</h2>
      <div class="donut-wrap"><canvas id="chart-sectors" width="220" height="220" role="img" aria-label="Donut chart of employment by sector in 2024"></canvas>
      <ul class="legend">${sectorList}</ul></div>
      ${sourceNote('PSA, 2024. Services dominate employment; industry is the smallest of the three sectors.')}</article>
  </section>
  <section class="panel"><h2>Daily minimum wage by region, 2024 (non-agriculture)</h2>
    <table class="data-table"><thead><tr><th>Region</th><th>Daily minimum wage</th></tr></thead><tbody>${wageRows}</tbody></table>
    ${sourceNote('Regional wage orders, 2024. Rates differ by region and by sector; check the current wage order before relying on a figure.')}</section>`;
}

export function drawLabor() {
  const unempSeries = YEARS.map((y) => ({ label: String(y), value: YEARLY.unemployment[y] }));
  drawLineChart(document.getElementById('chart-unemp'), unempSeries, { color: PALETTE.coral, decimals: 1 });
  const slices = EMPLOYMENT_SECTORS.map((s, i) => ({
    label: s.sector,
    value: s.share,
    color: [PALETTE.teal, PALETTE.blue, PALETTE.gold][i],
  }));
  drawDonut(document.getElementById('chart-sectors'), slices, { centre: '52 m', centreSub: 'in labour force' });
}

// ---------- Regions ----------
export function regionTableRows(regions) {
  return regions.map((r) => `<tr><td>${r.name}</td><td>${r.code}</td><td>${r.island}</td><td>${formatNumber(r.pop, 2)}</td><td>${r.density.toLocaleString('en-US')}</td><td>${r.grdp.toFixed(1)}%</td><td>${r.unemp.toFixed(1)}%</td></tr>`).join('');
}

export function renderRegions(islandFilter, query) {
  const counts = { Luzon: 0, Visayas: 0, Mindanao: 0 };
  REGIONS.forEach((r) => { counts[r.island] += 1; });
  return `
  <section class="page-head"><h1>Regions compared</h1>
    <p class="lede">All 17 regions side by side. Filter by island group, search by name, or click a column heading to sort.</p>
    <div class="hero-controls">
      <label class="year-pick">Island group
        <select id="region-island" aria-label="Filter by island group">
          <option value="All"${islandFilter === 'All' ? ' selected' : ''}>All islands (${REGIONS.length})</option>
          <option value="Luzon"${islandFilter === 'Luzon' ? ' selected' : ''}>Luzon (${counts.Luzon})</option>
          <option value="Visayas"${islandFilter === 'Visayas' ? ' selected' : ''}>Visayas (${counts.Visayas})</option>
          <option value="Mindanao"${islandFilter === 'Mindanao' ? ' selected' : ''}>Mindanao (${counts.Mindanao})</option>
        </select></label>
      <label class="search-pick">Search <input id="region-search" type="search" placeholder="e.g. Visayas, Davao…" value="${query.replace(/"/g, '&quot;')}" aria-label="Search regions"></label>
    </div></section>
  <section class="kpi-grid" aria-label="Regional highlights">
    ${kpiCard('Largest region', 'CALABARZON', '16.93 million people, 2024 Census', 'PSA, 2024')}
    ${kpiCard('Densest region', 'Metro Manila', '22,679 people per km²', 'PSA, 2024')}
    ${kpiCard('Biggest economy', 'Metro Manila', '31.2% of national GDP', 'PSA GRDP, 2024')}
    ${kpiCard('Lowest unemployment', 'Cordillera (CAR)', '3.1% of the labour force', 'PSA, 2024')}
  </section>
  <section class="panel"><h2>All regions <span id="region-count" class="count"></span></h2>
    <div class="table-scroll"><table class="data-table sortable">
      <thead><tr>
        <th data-sort="name">Region ↕</th><th data-sort="code">Code ↕</th><th data-sort="island">Island ↕</th>
        <th data-sort="pop">Population (m) ↕</th><th data-sort="density">Density /km² ↕</th>
        <th data-sort="grdp">Share of GDP ↕</th><th data-sort="unemp">Unemployment ↕</th>
      </tr></thead>
      <tbody id="region-rows"></tbody></table></div>
    <p id="region-empty" class="panel-note" hidden>No region matches that search. Clear the search or choose another island group.</p>
    ${sourceNote('2024 Census of Population and GRDP, PSA. Population in millions; density in persons per km²; unemployment 2024.')}</section>
  <section class="panel"><h2>How to read this table</h2>
    <p>Metro Manila holds 14.0 million people on just 619 km², which is why its density is more than twenty times the next densest region. CALABARZON is the most populous region, and together the two account for over a quarter of the country. GRDP shares show where output is made, not where people live: BARMM has 4.94 million people but under 1% of GDP.</p></section>`;
}

export function filteredRegions(islandFilter, query) {
  const q = query.trim().toLowerCase();
  return REGIONS.filter((r) => (islandFilter === 'All' || r.island === islandFilter) && (!q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)));
}
