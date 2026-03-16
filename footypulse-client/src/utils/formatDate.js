export function formatDate(dateStr, format = 'default') {
  if (!dateStr) return '';
  const date = new Date(dateStr);

  const formats = {
    default: { month: 'short', day: 'numeric', year: 'numeric' },
    short: { month: 'short', day: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    relative: null,
  };

  if (format === 'relative') {
    return getRelativeTime(date);
  }

  return date.toLocaleDateString('en-US', formats[format] || formats.default);
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isToday(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isTomorrow(dateStr) {
  const date = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}

export function groupByDate(items, dateField = 'date') {
  const groups = {};
  items.forEach((item) => {
    const key = new Date(item[dateField]).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}
