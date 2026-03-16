import React from 'react';
import Card from '../common/Card';

export default function PlayerAchievements({ achievements = [] }) {
  if (!achievements.length) return <p style={{ color: 'var(--text-tertiary)' }}>No achievements recorded</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
      {achievements.map((a, i) => (
        <Card key={i} hover={false}>
          <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>🏆</div>
          <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{a.title || a.name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {a.season || a.year || ''} {a.team_name ? `• ${a.team_name}` : ''}
          </div>
        </Card>
      ))}
    </div>
  );
}
