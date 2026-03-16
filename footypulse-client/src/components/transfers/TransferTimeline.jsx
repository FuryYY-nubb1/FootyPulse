import React from 'react';
import TransferCard from './TransferCard';
import { formatDate } from '../../utils/formatDate';

export default function TransferTimeline({ transfers = [] }) {
  if (!transfers.length) return null;

  const grouped = transfers.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(t);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} style={{ marginBottom: 'var(--space-2xl)' }}>
          <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-md)' }}>
            {month}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-md)' }}>
            {items.map((t, i) => <TransferCard key={t.id || i} transfer={t} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
