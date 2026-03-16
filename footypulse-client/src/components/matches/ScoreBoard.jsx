import React from 'react';
import MatchCard from './MatchCard';

export default function ScoreBoard({ matches = [], title = "Today's Matches" }) {
  return (
    <div>
      <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>{title}</h3>
      {matches.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
          {matches.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
          No matches scheduled
        </div>
      )}
    </div>
  );
}
