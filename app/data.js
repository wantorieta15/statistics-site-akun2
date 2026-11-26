// TalaStat data module — published Philippine figures, 2019–2024.
// Sources: Philippine Statistics Authority (PSA), Bangko Sentral ng
// Pilipinas (BSP), World Bank. Values are the published headline figures
// for the year shown; regional populations are the 2024 Census counts.

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const YEARLY = {
  // Population, millions (PSA; 2020 and 2024 are census counts).
  population: { 2019: 108.3, 2020: 109.0, 2021: 110.0, 2022: 111.0, 2023: 111.9, 2024: 112.7 },
  // Nominal GDP, US$ billion (World Bank / PSA national accounts).
  gdpUsd: { 2019: 376, 2020: 361, 2021: 394, 2022: 404, 2023: 437, 2024: 462 },
  // Real GDP growth, percent year on year (PSA).
  gdpGrowth: { 2019: 6.1, 2020: -9.5, 2021: 5.7, 2022: 7.6, 2023: 5.5, 2024: 5.6 },
  // Average headline inflation, percent (PSA).
  inflation: { 2019: 2.5, 2020: 2.6, 2021: 3.9, 2022: 5.8, 2023: 6.0, 2024: 3.2 },
  // Unemployment rate, percent of labour force (PSA Labour Force Survey).
  unemployment: { 2019: 5.1, 2020: 10.4, 2021: 7.8, 2022: 5.4, 2023: 4.3, 2024: 3.8 },
  // Merchandise exports / imports, US$ billion (PSA trade statistics).
  exports: { 2019: 70.9, 2020: 65.2, 2021: 74.7, 2022: 78.8, 2023: 73.5, 2024: 73.3 },
  imports: { 2019: 111.6, 2020: 89.8, 2021: 116.9, 2022: 137.2, 2023: 126.9, 2024: 127.1 },
  // Personal remittances from overseas Filipinos, US$ billion (BSP).
  remittances: { 2019: 33.5, 2020: 33.2, 2021: 34.9, 2022: 36.1, 2023: 37.2, 2024: 38.3 },
};

// Age structure, 2024 (PSA): millions of people in each band.
export const AGE_GROUPS = [
  { band: '0–14 years', millions: 31.4, share: 27.9 },
  { band: '15–24 years', millions: 21.9, share: 19.4 },
  { band: '25–54 years', millions: 43.4, share: 38.5 },
  { band: '55–64 years', millions: 9.0, share: 8.0 },
  { band: '65+ years', millions: 7.0, share: 6.2 },
];

// Employment by sector, share of employed persons, 2024 (PSA).
export const EMPLOYMENT_SECTORS = [
  { sector: 'Services', share: 60.8 },
  { sector: 'Agriculture, forestry & fishing', share: 21.3 },
  { sector: 'Industry', share: 17.9 },
];

// Daily minimum wage (non-agriculture), pesos per day, 2024 wage orders.
export const MINIMUM_WAGES = [
  { region: 'Metro Manila (NCR)', wage: 645 },
  { region: 'CALABARZON (IV-A)', wage: 560 },
  { region: 'Central Luzon (III)', wage: 550 },
  { region: 'Davao Region (XI)', wage: 510 },
  { region: 'Central Visayas (VII)', wage: 468 },
  { region: 'Western Visayas (VI)', wage: 480 },
  { region: 'Northern Mindanao (X)', wage: 461 },
  { region: 'Bicol Region (V)', wage: 435 },
];

// Regions: 2024 Census population (millions), density (persons/km²),
// share of national GDP (GRDP, %), unemployment 2024 (%). PSA.
export const REGIONS = [
  { name: 'CALABARZON', code: 'IV-A', island: 'Luzon', pop: 16.93, density: 1013, grdp: 14.5, unemp: 4.4 },
  { name: 'Metro Manila (NCR)', code: 'NCR', island: 'Luzon', pop: 14.00, density: 22679, grdp: 31.2, unemp: 4.0 },
  { name: 'Central Luzon', code: 'III', island: 'Luzon', pop: 12.99, density: 594, grdp: 10.8, unemp: 4.2 },
  { name: 'Central Visayas', code: 'VII', island: 'Visayas', pop: 8.08, density: 512, grdp: 6.7, unemp: 4.1 },
  { name: 'Western Visayas', code: 'VI', island: 'Visayas', pop: 8.08, density: 391, grdp: 4.0, unemp: 4.6 },
  { name: 'Bicol Region', code: 'V', island: 'Luzon', pop: 6.08, density: 334, grdp: 2.2, unemp: 5.0 },
  { name: 'Davao Region', code: 'XI', island: 'Mindanao', pop: 5.61, density: 276, grdp: 4.9, unemp: 3.6 },
  { name: 'Northern Mindanao', code: 'X', island: 'Mindanao', pop: 5.50, density: 263, grdp: 4.3, unemp: 3.9 },
  { name: 'Ilocos Region', code: 'I', island: 'Luzon', pop: 5.47, density: 422, grdp: 3.0, unemp: 4.5 },
  { name: 'BARMM', code: 'BARMM', island: 'Mindanao', pop: 4.94, density: 135, grdp: 0.9, unemp: 3.2 },
  { name: 'SOCCSKSARGEN', code: 'XII', island: 'Mindanao', pop: 4.90, density: 215, grdp: 2.7, unemp: 3.8 },
  { name: 'Eastern Visayas', code: 'VIII', island: 'Visayas', pop: 4.77, density: 206, grdp: 2.1, unemp: 4.8 },
  { name: 'Zamboanga Peninsula', code: 'IX', island: 'Mindanao', pop: 3.94, density: 230, grdp: 2.0, unemp: 3.5 },
  { name: 'Cagayan Valley', code: 'II', island: 'Luzon', pop: 3.71, density: 127, grdp: 1.8, unemp: 3.4 },
  { name: 'MIMAROPA', code: 'IV-B', island: 'Luzon', pop: 3.23, density: 109, grdp: 1.5, unemp: 3.7 },
  { name: 'CARAGA', code: 'XIII', island: 'Mindanao', pop: 2.97, density: 141, grdp: 1.3, unemp: 3.3 },
  { name: 'Cordillera (CAR)', code: 'CAR', island: 'Luzon', pop: 1.80, density: 91, grdp: 1.1, unemp: 3.1 },
];

export const HEADLINES = {
  poverty2023: 15.5,
  povertyNote: 'Poverty incidence among the population, 2023 (PSA). Down from 18.1% in 2021.',
  lifeExpectancy: 72.2,
  medianAge: 25.3,
  households2024: 28.5,
};

export function formatNumber(value, decimals = 1) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function yearValue(series, year) {
  return series[year] ?? null;
}
