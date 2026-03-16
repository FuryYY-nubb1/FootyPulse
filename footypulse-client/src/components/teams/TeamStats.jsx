import React from 'react';
import Card from '../common/Card';

export default function TeamStats({ stats }) {
  if (!stats) return <p style={{ color: 'var(--text-tertiary)' }}>No stats available</p>;

  const items = [
    { label: 'Played', value: stats.played || stats.matches_played || 0 },
    { label: 'Wins', value: stats.wins || 0, color: 'var(--win)' },
    { label: 'Draws', value: stats.draws || 0, color: 'var(--draw)' },
    { label: 'Losses', value: stats.losses || 0, color: 'var(--loss)' },
    { label: 'Goals For', value: stats.goals_for || stats.gf || 0 },
    { label: 'Goals Against', value: stats.goals_against || stats.ga || 0 },
    { label: 'Goal Diff', value: stats.goal_difference || stats.gd || 0 },
    { label: 'Points', value: stats.points || 0, color: 'var(--accent-primary)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'var(--space-md)' }}>
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
