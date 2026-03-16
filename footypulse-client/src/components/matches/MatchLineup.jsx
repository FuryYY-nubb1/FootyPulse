import React from 'react';

export default function MatchLineup({ homePlayers = [], awayPlayers = [] }) {
  const PlayerRow = ({ player }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
      padding: 'var(--space-sm) var(--space-md)',
      borderBottom: '1px solid var(--border-subtle)',
      fontSize: 'var(--fs-sm)',
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', width: 24, textAlign: 'center', fontSize: 'var(--fs-xs)' }}>
        {player.shirt_number || player.jersey_number || '-'}
      </span>
      <span style={{ flex: 1, fontWeight: 500 }}>{player.name || player.player_name}</span>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{player.position || ''}</span>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
      <div>
        <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>Home</h4>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          {homePlayers.map((p, i) => <PlayerRow key={i} player={p} />)}
          {!homePlayers.length && <p style={{ padding: 'var(--space-md)', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>Lineup not available</p>}
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>Away</h4>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          {awayPlayers.map((p, i) => <PlayerRow key={i} player={p} />)}
          {!awayPlayers.length && <p style={{ padding: 'var(--space-md)', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>Lineup not available</p>}
        </div>
      </div>
    </div>
  );
}
