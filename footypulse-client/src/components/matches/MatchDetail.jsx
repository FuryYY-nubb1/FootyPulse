import React from 'react';
import Badge from '../common/Badge';
import { formatDate, formatTime } from '../../utils/formatDate';
import { getMatchStatus } from '../../utils/formatScore';

export default function MatchDetail({ match }) {
  if (!match) return null;
  const status = getMatchStatus(match);

  // Normalize field names — server uses home_logo, client may have home_team_logo
  const homeLogo = match.home_logo || match.home_team_logo;
  const awayLogo = match.away_logo || match.away_team_logo;
  const matchDate = match.match_date || match.date;
  const venue = match.stadium_name || match.venue || '';
  const competitionLogo = match.competition_logo || match.comp_logo;

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

      {/* Competition + Round */}
      <div style={{
        fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        {competitionLogo && (
          <img src={competitionLogo} alt="" style={{
            width: 18, height: 18, objectFit: 'contain',
          }} />
        )}
        {match.competition_name || 'Competition'}
        {match.round && <span> • {match.round}</span>}
      </div>

      {/* Date + Venue */}
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-xl)' }}>
        {formatDate(matchDate, 'long')}
        {venue && <span> • {venue}</span>}
      </div>

      {/* Teams + Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2xl)' }}>
        {/* Home Team */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
            fontSize: '2rem', overflow: 'hidden', padding: homeLogo ? 8 : 0,
          }}>
            {homeLogo
              ? <img src={homeLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : <span style={{ fontWeight: 700, color: 'var(--text-tertiary)' }}>
                  {(match.home_team_name || 'H')[0]}
                </span>
            }
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-md)' }}>
            {match.home_team_name || 'Home'}
          </div>
        </div>

        {/* Score / Time */}
        <div>
          {status === 'upcoming' ? (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xl)', fontWeight: 700 }}>
                {formatTime(matchDate, match.kick_off_time)}
              </div>
              <Badge variant="info">Upcoming</Badge>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-3xl)', fontWeight: 900 }}>
                {match.home_score ?? 0}
                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-xl)', margin: '0 8px' }}>-</span>
                {match.away_score ?? 0}
              </div>
              <Badge variant={status === 'live' ? 'live' : 'accent'}>
                {status === 'live' ? `${match.minute || ''}'` : 'FT'}
              </Badge>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
            fontSize: '2rem', overflow: 'hidden', padding: awayLogo ? 8 : 0,
          }}>
            {awayLogo
              ? <img src={awayLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : <span style={{ fontWeight: 700, color: 'var(--text-tertiary)' }}>
                  {(match.away_team_name || 'A')[0]}
                </span>
            }
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-md)' }}>
            {match.away_team_name || 'Away'}
          </div>
        </div>
      </div>
    </div>
  );
}