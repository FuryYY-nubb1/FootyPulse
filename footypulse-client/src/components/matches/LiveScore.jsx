import React from 'react';
import MatchCard from './MatchCard';

export default function LiveScore({ matches = [] }) {
  const liveMatches = matches.filter((m) => {
    const s = (m.status || '').toLowerCase();
    return ['live', 'in_play', '1h', '2h', 'ht', 'et'].includes(s);
  });

  if (!liveMatches.length) {
    return (
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>📡</div>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>No live matches right now</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: 'var(--live)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 700 }}>Live Now</h3>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {liveMatches.length} match{liveMatches.length !== 1 ? 'es' : ''}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
        {liveMatches.map((m) => <MatchCard key={m.id} match={m} />)}
      </div>
    </div>
  );
}
