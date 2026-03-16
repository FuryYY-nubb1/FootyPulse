import React from 'react';
import MatchCard from './MatchCard';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/formatDate';
import { groupByDate } from '../../utils/formatDate';

export default function MatchList({ matches = [], loading, emptyMessage = 'No matches found' }) {
  if (loading) return <Loader text="Loading matches..." />;
  if (!matches.length) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>⚽</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const grouped = groupByDate(matches, 'date');

  return (
    <div className="match-list">
      {Object.entries(grouped).map(([dateKey, dateMatches]) => (
        <div key={dateKey} className="match-list__date-group">
          <div className="match-list__date">{formatDate(dateKey, 'long')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
            {dateMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
