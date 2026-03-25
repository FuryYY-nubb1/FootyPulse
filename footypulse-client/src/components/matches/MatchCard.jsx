import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../../utils/formatDate';
import { getMatchStatus } from '../../utils/formatScore';
import '../../styles/components/matchCard.css';

export default function MatchCard({ match }) {
  const navigate = useNavigate();
  const status = getMatchStatus(match);

  const displayTime = formatTime(match.match_date, match.kick_off_time)
    || formatTime(match.kick_off_time)
    || formatTime(match.match_date)
    || '';

  const isLive = status === 'live';
  const isFinished = status === 'finished';
  const isUpcoming = status === 'upcoming';

  return (
    <div
      onClick={() => navigate(`/matches/${match.match_id || match.id}`)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '8px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'background var(--transition-fast)',
        background: isLive ? 'rgba(255, 71, 87, 0.04)' : 'transparent',
        gap: '12px',
        minHeight: 48,
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = isLive ? 'rgba(255,71,87,0.08)' : 'var(--bg-card-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.background = isLive ? 'rgba(255, 71, 87, 0.04)' : 'transparent'}
    >
      {/* Home Team */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
          {match.home_team_name || match.home_short || 'Home'}
        </span>
        <div style={{
          width: 24, height: 24, borderRadius: 4,
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {match.home_logo
            ? <img src={match.home_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            : <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>{(match.home_team_name || 'H')[0]}</span>
          }
        </div>
      </div>

      {/* Center */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72, gap: 1 }}>
        {isUpcoming ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {displayTime || 'TBD'}
          </span>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-md)', fontWeight: 700, color: 'var(--text-primary)',
          }}>
            <span>{match.home_score ?? '-'}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-xs)' }}>:</span>
            <span>{match.away_score ?? '-'}</span>
          </div>
        )}
        {isLive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.58rem', fontWeight: 700, color: 'var(--live)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--live)', animation: 'pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
            {match.minute ? `${match.minute}'` : 'LIVE'}
          </div>
        )}
        {isFinished && (
          <span style={{ fontSize: '0.58rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FT</span>
        )}
      </div>

      {/* Away Team */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
        <div style={{
          width: 24, height: 24, borderRadius: 4,
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {match.away_logo
            ? <img src={match.away_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            : <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>{(match.away_team_name || 'A')[0]}</span>
          }
        </div>
        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {match.away_team_name || match.away_short || 'Away'}
        </span>
      </div>
    </div>
  );
}