import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '../../utils/formatDate';
import { getMatchStatus } from '../../utils/formatScore';

function FixtureRow({ match }) {
  const navigate = useNavigate();
  const status = getMatchStatus(match);
  const isLive = status === 'live';
  const isFinished = status === 'finished';

  const displayTime = formatTime(match.match_date, match.kick_off_time)
    || formatTime(match.kick_off_time)
    || '';

  const dateLabel = (() => {
    const raw = match.match_date || match.date;
    if (!raw) return '';
    const d = new Date(String(raw).split('T')[0] + 'T12:00:00');
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  })();

  const compName = match.competition_name || match.competition_short || '';

  return (
    <div
      onClick={() => navigate(`/matches/${match.match_id || match.id}`)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Date + Competition header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-md)',
        padding: '8px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 'var(--fs-xs)',
        color: 'var(--text-tertiary)',
        letterSpacing: '0.04em',
      }}>
        {dateLabel && <span>{dateLabel}</span>}
        {dateLabel && compName && <span style={{ opacity: 0.4 }}>·</span>}
        {compName && <span>{compName}</span>}
        {isLive && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: 'var(--live)', fontWeight: 700, fontSize: 'var(--fs-xs)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--live)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            LIVE
          </span>
        )}
      </div>

      {/* Match body — Home Logo Score Away */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '16px 24px',
        gap: '16px',
        background: isLive ? 'rgba(255,71,87,0.03)' : 'transparent',
      }}>
        {/* Home team */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          <span style={{
            fontSize: 'var(--fs-md)', fontWeight: 700, color: 'var(--text-primary)',
            textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {match.home_team_name || match.home_short || 'Home'}
          </span>
          <div style={{
            width: 40, height: 40, borderRadius: 6, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {match.home_logo ? (
              <img src={match.home_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                {(match.home_team_name || 'H')[0]}
              </div>
            )}
          </div>
        </div>

        {/* Score / Time center */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
          {isFinished || isLive ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--text-primary)',
            }}>
              <span style={{ fontSize: 'var(--fs-xl)', minWidth: 24, textAlign: 'right' }}>
                {match.home_score ?? 0}
              </span>
              <span style={{
                width: 1, height: 24, background: 'var(--border-default)',
              }} />
              <span style={{ fontSize: 'var(--fs-xl)', minWidth: 24, textAlign: 'left' }}>
                {match.away_score ?? 0}
              </span>
            </div>
          ) : (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-md)', fontWeight: 700,
              color: 'var(--accent-primary)', padding: '4px 12px',
              background: 'rgba(0,245,160,0.08)', borderRadius: 'var(--radius-sm)',
            }}>
              {displayTime || 'TBD'}
            </span>
          )}

          {isFinished && (
            <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
              FT
            </span>
          )}
          {isLive && match.minute && (
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--live)', marginTop: 2 }}>
              {match.minute}'
            </span>
          )}
        </div>

        {/* Away team */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 6, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {match.away_logo ? (
              <img src={match.away_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                {(match.away_team_name || 'A')[0]}
              </div>
            )}
          </div>
          <span style={{
            fontSize: 'var(--fs-md)', fontWeight: 700, color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {match.away_team_name || match.away_short || 'Away'}
          </span>
        </div>
      </div>
    </div>
  );
}


export default function TeamFixtures({ matches = [] }) {
  if (!matches.length) {
    return (
      <div style={{
        textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-secondary)',
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
      }}>
        <p style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)', opacity: 0.4 }}>⚽</p>
        <p style={{ fontSize: 'var(--fs-sm)' }}>No fixtures available</p>
      </div>
    );
  }

  // Split into results and upcoming, sorted
  const results = matches
    .filter(m => m.status === 'finished')
    .sort((a, b) => (b.match_date || '').localeCompare(a.match_date || ''));

  const live = matches.filter(m => m.status === 'live');

  const upcoming = matches
    .filter(m => m.status === 'scheduled' || m.status === 'postponed')
    .sort((a, b) => (a.match_date || '').localeCompare(b.match_date || ''));

  return (
    <div>
      {/* Live matches first */}
      {live.length > 0 && (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{
            fontSize: 'var(--fs-md)', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.04em', marginBottom: 'var(--space-md)',
            color: 'var(--live)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--live)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            Live Now
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {live.map(m => <FixtureRow key={m.match_id || m.id} match={m} />)}
          </div>
        </div>
      )}

      {/* Upcoming fixtures */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{
            fontSize: 'var(--fs-md)', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.04em', marginBottom: 'var(--space-md)',
            color: 'var(--text-primary)',
          }}>
            Upcoming
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {upcoming.map(m => <FixtureRow key={m.match_id || m.id} match={m} />)}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h3 style={{
            fontSize: 'var(--fs-md)', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.04em', marginBottom: 'var(--space-md)',
            color: 'var(--text-primary)',
          }}>
            Results
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {results.map(m => <FixtureRow key={m.match_id || m.id} match={m} />)}
          </div>
        </div>
      )}
    </div>
  );
}