import React from 'react';

export default function MatchStats({ stats = [] }) {
  if (!stats.length) {
    return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No stats available</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-lg) 0' }}>
      {stats.map((stat, i) => {
        const total = (stat.home || 0) + (stat.away || 0);
        const homePercent = total > 0 ? ((stat.home / total) * 100) : 50;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{stat.home ?? 0}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label || stat.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{stat.away ?? 0}</span>
            </div>
            <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
              <div style={{ width: `${homePercent}%`, background: 'var(--accent-primary)', borderRadius: '2px 0 0 2px', transition: 'width 0.6s ease' }} />
              <div style={{ width: `${100 - homePercent}%`, background: 'var(--accent-secondary)', borderRadius: '0 2px 2px 0', transition: 'width 0.6s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
