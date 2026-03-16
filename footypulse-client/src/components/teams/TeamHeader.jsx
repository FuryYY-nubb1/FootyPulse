import React from 'react';
import Badge from '../common/Badge';

export default function TeamHeader({ team }) {
  if (!team) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-xl)',
      padding: 'var(--space-2xl)',
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient-accent)' }} />
      <div style={{
        width: 96, height: 96, borderRadius: 'var(--radius-lg)', background: 'var(--bg-tertiary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', flexShrink: 0,
        overflow: 'hidden',
      }}>
        {team.logo ? <img src={team.logo} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} /> : (team.name || 'T')[0]}
      </div>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>{team.name}</h1>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {team.country_name && <Badge variant="accent">{team.country_name}</Badge>}
          {team.founded && <Badge>Est. {team.founded}</Badge>}
          {team.stadium_name && <Badge>{team.stadium_name}</Badge>}
        </div>
      </div>
    </div>
  );
}
