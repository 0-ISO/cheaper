export function renderChart(points) {
  const w = 600, h = 140, pad = 8;
  const step = (w - pad * 2) / (points.length - 1);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const y = v => pad + (h - pad * 2) * (1 - (v - min) / (max - min || 1));

  const path = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${y(v)}`)
    .join(' ');

  const area = path
    + ` L ${pad + (points.length - 1) * step} ${h - pad}`
    + ` L ${pad} ${h - pad} Z`;

  const uid = 'g' + Math.random().toString(36).slice(2, 8);

  return `
    <svg class="chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#${uid})"/>
      <path d="${path}" fill="none" stroke="var(--accent)"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

export function renderSparkline(points, trend = '') {
  const w = 90, h = 36, pad = 3;
  const step = (w - pad * 2) / (points.length - 1);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const y = v => pad + (h - pad * 2) * (1 - (v - min) / (max - min || 1));
  const path = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${y(v)}`)
    .join(' ');

  return `
    <div class="sparkline">
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <path class="line ${trend}" d="${path}"/>
      </svg>
    </div>
  `;
}