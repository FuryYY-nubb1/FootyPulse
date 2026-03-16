import React from 'react';
import Card from '../common/Card';

export default function PlayerStats({ stats }) {
  if (!stats) return <p style={{ color: 'var(--text-tertiary)' }}>No stats available</p>;

  const items = [
    { label: 'Appearances', value: stats.appearances || 0 },
    { label: 'Goals', value: stats.goals || 0, color: 'var(--accent-primary)' },
    { label: 'Assists', value: stats.assists || 0, color: 'var(--accent-secondary)' },
    { label: 'Yellow Cards', value: stats.yellow_cards || 0, color: 'var(--draw)' },
    { label: 'Red Cards', value: stats.red_cards || 0, color: 'var(--loss)' },
    { label: 'Minutes', value: stats.minutes_played || 0 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-md)' }}>
      {items.map((item) => (
        <Card key={item.label} hover={false}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-xs)' }}>
            {item.label}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xl)', fontWeight: 800, color: item.color || 'var(--text-primary)' }}>
            {item.value}
          </div>
        </Card>
      ))}
    </div>
  );
}
