import React from 'react';
import MatchCard from '../matches/MatchCard';

export default function TeamFixtures({ matches = [] }) {
  if (!matches.length) return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No fixtures available</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
      {matches.map((m) => <MatchCard key={m.id} match={m} />)}
    </div>
  );
}
