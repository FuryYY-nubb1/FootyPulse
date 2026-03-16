import React from 'react';
import { formatDate } from '../../utils/formatDate';

export default function PlayerCareer({ contracts = [] }) {
  if (!contracts.length) return <p style={{ color: 'var(--text-tertiary)' }}>No career history available</p>;

  return (
    <div style={{ position: 'relative', paddingLeft: 'var(--space-xl)' }}>
      <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'var(--border-subtle)' }} />
      {contracts.map((c, i) => (
        <div key={i} style={{ position: 'relative', marginBottom: 'var(--space-lg)' }}>
          <div style={{
            position: 'absolute', left: -18, top: 4, width: 12, height: 12,
            borderRadius: '50%', background: i === 0 ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
            border: '2px solid var(--border-default)',
          }} />
          <div style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>{c.team_name || 'Unknown'}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {formatDate(c.start_date, 'short')} — {c.end_date ? formatDate(c.end_date, 'short') : 'Present'}
          </div>
          {c.position && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>{c.position}</div>}
        </div>
      ))}
    </div>
  );
}
