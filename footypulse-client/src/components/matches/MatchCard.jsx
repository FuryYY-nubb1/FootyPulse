import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../../utils/formatDate';
import { getMatchStatus } from '../../utils/formatScore';
import '../../styles/components/matchCard.css';

export default function MatchCard({ match }) {
  const navigate = useNavigate();
  const status = getMatchStatus(match);

  // Build proper display time by combining match_date + kick_off_time
  const displayTime = formatTime(match.match_date, match.kick_off_time)
    || formatTime(match.kick_off_time)
    || formatTime(match.match_date)
    || '';

  const statusLabels = {
    live: match.minute ? `${match.minute}'` : 'LIVE',
    finished: 'FT',
    upcoming: displayTime,
    postponed: 'PST',
  };

  return (
    <div
      className={`match-card ${status === 'live' ? 'match-card--live' : ''}`}
      onClick={() => navigate(`/matches/${match.match_id || match.id}`)}
    >
      <div className="match-card__header">
        <span className="match-card__competition">
          {match.competition_name || 'League'}
        </span>
        <span className={`match-card__status match-card__status--${status}`}>
          {statusLabels[status] || match.status}
        </span>
      </div>

      <div className="match-card__body">
        <div className="match-card__team">
          <div className="match-card__team-logo">
            {match.home_logo ? (
              <img src={match.home_logo} alt="" />
            ) : (
              <span>{(match.home_team_name || 'H')[0]}</span>
            )}
          </div>
          <span className="match-card__team-name">
            {match.home_team_name || 'Home'}
          </span>
        </div>

        {status === 'upcoming' ? (
          <div className="match-card__time">
            {displayTime || 'TBD'}
          </div>
        ) : (
          <div className="match-card__score">
            <span>{match.home_score ?? '-'}</span>
            <span className="match-card__score-separator">:</span>
            <span>{match.away_score ?? '-'}</span>
          </div>
        )}

        <div className="match-card__team">
          <div className="match-card__team-logo">
            {match.away_logo ? (
              <img src={match.away_logo} alt="" />
            ) : (
              <span>{(match.away_team_name || 'A')[0]}</span>
            )}
          </div>
          <span className="match-card__team-name">
            {match.away_team_name || 'Away'}
          </span>
        </div>
      </div>

      {match.stadium_name && (
        <div className="match-card__footer">
          <span className="match-card__venue">{match.stadium_name}</span>
        </div>
      )}
    </div>
  );
}