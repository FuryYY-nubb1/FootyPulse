import React from 'react';
import { useNavigate } from 'react-router-dom';
import { POSITIONS } from '../../utils/constants';

export default function TeamSquad({ players = [] }) {
  const navigate = useNavigate();

  const grouped = players.reduce((acc, p) => {
    const pos = p.position || 'Unknown';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(p);
    return acc;
  }, {});

  const posOrder = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'];

  return (
    <div>
      {Object.entries(grouped)
        .sort(([a], [b]) => (posOrder.indexOf(a) === -1 ? 99 : posOrder.indexOf(a)) - (posOrder.indexOf(b) === -1 ? 99 : posOrder.indexOf(b)))
        .map(([position, posPlayers]) => (
          <div key={position} style={{ marginBottom: 'var(--space-xl)' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-md)' }}>
              {POSITIONS[position] || position}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-sm)' }}>
              {posPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => navigate(`/players/${player.person_id || player.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                    padding: 'var(--space-md)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 700,
                    color: 'var(--accent-primary)',
                  }}>
                    {player.shirt_number || player.jersey_number || '#'}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>{player.name || player.player_name}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{player.nationality || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
