import React from 'react';
import Badge from '../common/Badge';
import { formatDate, formatTime } from '../../utils/formatDate';
import { getMatchStatus } from '../../utils/formatScore';

export default function MatchDetail({ match }) {
  if (!match) return null;
  const status = getMatchStatus(match);

  return (
    <div style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-2xl)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient-accent)' }} />

      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>
        {match.competition_name || 'Competition'} • {match.round || ''}
      </div>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-xl)' }}>
        {formatDate(match.date, 'long')} • {match.venue || ''}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2xl)' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
            fontSize: '2rem',
          }}>
            {match.home_team_logo ? <img src={match.home_team_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : (match.home_team_name || 'H')[0]}
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-md)' }}>{match.home_team_name || 'Home'}</div>
        </div>

        <div>
          {status === 'upcoming' ? (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xl)', fontWeight: 700 }}>
                {formatTime(match.date)}
              </div>
              <Badge variant="info">Upcoming</Badge>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-3xl)', fontWeight: 900 }}>
                {match.home_score ?? 0} <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-xl)' }}>-</span> {match.away_score ?? 0}
              </div>
              <Badge variant={status === 'live' ? 'live' : 'accent'}>
                {status === 'live' ? `${match.minute || ''}'` : 'FT'}
              </Badge>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
            fontSize: '2rem',
          }}>
            {match.away_team_logo ? <img src={match.away_team_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : (match.away_team_name || 'A')[0]}
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-md)' }}>{match.away_team_name || 'Away'}</div>
        </div>
      </div>
    </div>
  );
}
