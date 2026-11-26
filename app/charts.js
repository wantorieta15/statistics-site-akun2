// charts.js — pure Canvas charts, no libraries. Every chart draws from
// plain arrays of {label, value} so pages only pass data, never markup.

export const PALETTE = {
  blue: '#0b3d5c',
  teal: '#0e7c7b',
  gold: '#f2a900',
  coral: '#e4572e',
  lightBlue: '#7fb3d5',
  grid: '#d9e2e8',
  text: '#334155',
  faint: '#64748b',
};

function setupCanvas(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function drawAxes(ctx, x0, y0, x1, y1, maxValue, unit) {
  ctx.strokeStyle = PALETTE.grid;
  ctx.fillStyle = PALETTE.faint;
  ctx.font = '11px system-ui, sans-serif';
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (maxValue * i) / 4;
    const y = y1 - ((y1 - y0) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.fillText(unit ? v.toFixed(0) + unit : v.toFixed(0), x0 - 6, y + 4);
  }
  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(x0, y1);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function drawXLabels(ctx, labels, x0, x1, y1) {
  ctx.fillStyle = PALETTE.faint;
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  const step = (x1 - x0) / labels.length;
  labels.forEach((label, i) => {
    ctx.fillText(String(label), x0 + step * (i + 0.5), y1 + 16);
  });
}

// Line chart with filled area and dots. values: [{label, value}].
export function drawLineChart(canvas, values, options = {}) {
  const width = options.width || 560;
  const height = options.height || 250;
  const ctx = setupCanvas(canvas, width, height);
  const color = options.color || PALETTE.teal;
  const pad = { left: 46, right: 14, top: 14, bottom: 28 };
  const x0 = pad.left;
  const x1 = width - pad.right;
  const y0 = pad.top;
  const y1 = height - pad.bottom;
  const nums = values.map((v) => v.value);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const lo = min < 0 ? min * 1.15 : Math.max(0, min - (max - min) * 0.25);
  const hi = max * 1.08;
  drawAxes(ctx, x0, y0, x1, y1, hi, options.unit || '');
  const px = (i) => x0 + ((x1 - x0) * i) / (values.length - 1);
  const py = (v) => y1 - ((y1 - y0) * (v - lo)) / (hi - lo);
  ctx.beginPath();
  values.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(px(i), py(pt.value));
    else ctx.lineTo(px(i), py(pt.value));
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.lineTo(px(values.length - 1), y1);
  ctx.lineTo(px(0), y1);
  ctx.closePath();
  ctx.fillStyle = color + '22';
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  values.forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(px(i), py(pt.value), 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(pt.value.toFixed(options.decimals ?? 1), px(i), py(pt.value) - 8);
  });
  drawXLabels(ctx, values.map((v) => v.label), x0, x1, y1);
}

// Vertical bar chart. values: [{label, value}].
export function drawBarChart(canvas, values, options = {}) {
  const width = options.width || 560;
  const height = options.height || 250;
  const ctx = setupCanvas(canvas, width, height);
  const colors = options.colors || [PALETTE.blue, PALETTE.teal, PALETTE.gold, PALETTE.coral, PALETTE.lightBlue, PALETTE.blue];
  const pad = { left: 46, right: 14, top: 18, bottom: 28 };
  const x0 = pad.left;
  const x1 = width - pad.right;
  const y0 = pad.top;
  const y1 = height - pad.bottom;
  const max = Math.max(...values.map((v) => v.value)) * 1.12;
  drawAxes(ctx, x0, y0, x1, y1, max, options.unit || '');
  const slot = (x1 - x0) / values.length;
  const barW = Math.min(46, slot * 0.58);
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  values.forEach((pt, i) => {
    const cx = x0 + slot * (i + 0.5);
    const h = ((y1 - y0) * pt.value) / max;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(cx - barW / 2, y1 - h, barW, h);
    ctx.fillStyle = PALETTE.text;
    ctx.fillText(pt.value.toFixed(options.decimals ?? 1), cx, y1 - h - 6);
  });
  drawXLabels(ctx, values.map((v) => v.label), x0, x1, y1);
}

// Horizontal bars for the age pyramid / ranked lists.
export function drawHorizontalBars(canvas, rows, options = {}) {
  const width = options.width || 560;
  const rowH = options.rowHeight || 34;
  const height = options.height || rows.length * rowH + 16;
  const ctx = setupCanvas(canvas, width, height);
  const color = options.color || PALETTE.blue;
  const max = Math.max(...rows.map((r) => r.value)) * 1.08;
  const labelW = options.labelWidth || 110;
  const barX = labelW + 8;
  const barW = width - barX - 64;
  ctx.font = '12px system-ui, sans-serif';
  rows.forEach((row, i) => {
    const y = 8 + i * rowH;
    ctx.fillStyle = PALETTE.text;
    ctx.textAlign = 'right';
    ctx.fillText(row.label, labelW, y + 15);
    const w = (barW * row.value) / max;
    ctx.fillStyle = row.color || color;
    ctx.fillRect(barX, y + 3, w, 18);
    ctx.fillStyle = PALETTE.text;
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(row.display, barX + w + 8, y + 17);
    ctx.font = '12px system-ui, sans-serif';
  });
}

// Donut chart with a centre label. slices: [{label, value, color}].
export function drawDonut(canvas, slices, options = {}) {
  const size = options.size || 220;
  const ctx = setupCanvas(canvas, size, size);
  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 8;
  const inner = outer * 0.58;
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let angle = -Math.PI / 2;
  slices.forEach((slice) => {
    const sweep = (slice.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = PALETTE.blue;
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(options.centre || '', cx, cy + 2);
  ctx.fillStyle = PALETTE.faint;
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText(options.centreSub || '', cx, cy + 18);
}
