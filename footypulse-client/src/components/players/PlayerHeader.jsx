import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

export default function PlayerHeader({ player }) {
  if (!player) return null;

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
      <Avatar src={player.photo} name={player.name} size={96} />
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>{player.name}</h1>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
          {player.position && <Badge variant="accent">{player.position}</Badge>}
          {player.nationality && <Badge>{player.nationality}</Badge>}
          {player.team_name && <Badge variant="info">{player.team_name}</Badge>}
        </div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
          {player.date_of_birth && `Born: ${formatDate(player.date_of_birth)}`}
          {player.height && ` • ${player.height}cm`}
          {player.weight && ` • ${player.weight}kg`}
        </div>
      </div>
    </div>
  );
}
