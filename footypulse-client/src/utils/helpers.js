export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function formatNumber(num) {
  if (!num && num !== 0) return '-';
  return num.toLocaleString();
}

export function getPlaceholderImage(type = 'team') {
  const colors = { team: '#1a1a24', player: '#1e1e2e', article: '#14141e' };
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="${encodeURIComponent(colors[type] || '#1a1a24')}" width="100" height="100"/></svg>`;
}
