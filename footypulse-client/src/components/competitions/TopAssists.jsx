import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';

export default function TopAssists({ assists = [] }) {
  const navigate = useNavigate();
  if (!assists.length) return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No data</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
      {assists.map((s, i) => (
        <div key={i} onClick={() => navigate(`/players/${s.player_id || s.id}`)} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
          padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 700, color: i < 3 ? 'var(--accent-secondary)' : 'var(--text-tertiary)', width: 24, textAlign: 'center' }}>{i + 1}</span>
          <Avatar src={s.photo} name={s.player_name || s.name} size={32} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>{s.player_name || s.name}</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{s.team_name || ''}</div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-md)', fontWeight: 800, color: 'var(--accent-secondary)' }}>{s.assists || s.count || 0}</span>
        </div>
      ))}
    </div>
  );
}
