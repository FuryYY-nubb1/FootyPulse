export function formatDate(dateStr, format = 'default') {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

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

/**
 * Format a time string for display.
 * Handles multiple input formats:
 *   - Time-only: "20:00:00" or "20:00"
 *   - ISO datetime: "2025-02-16T20:00:00Z"
 *   - Date + time combo: called with (matchDate, kickOffTime)
 */
export function formatTime(dateOrTime, kickOffTime) {
  // If both date and kick_off_time are provided, combine them
  if (dateOrTime && kickOffTime) {
    const dateStr = String(dateOrTime).split('T')[0]; // "2025-02-16"
    const combined = new Date(`${dateStr}T${kickOffTime}`);
    if (!isNaN(combined.getTime())) {
      return combined.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }

  const val = String(dateOrTime || '');

  // Handle time-only strings like "20:00:00" or "16:30"
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(val)) {
    const [h, m] = val.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  // Handle full date strings
  if (val) {
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }

  return '';
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

/**
 * Group items by date. Tries multiple common date field names.
 */
export function groupByDate(items, dateField = 'date') {
  const groups = {};
  items.forEach((item) => {
    // Try the given field, then fallback to common alternatives
    const raw = item[dateField] || item.match_date || item.date || item.created_at;
    if (!raw) {
      const key = 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return;
    }

    // Normalize: take just the date portion (YYYY-MM-DD) to avoid timezone grouping issues
    const dateOnly = String(raw).split('T')[0];
    const date = new Date(dateOnly + 'T12:00:00'); // noon to avoid timezone edge cases
    const key = isNaN(date.getTime()) ? 'Unknown' : date.toDateString();

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}