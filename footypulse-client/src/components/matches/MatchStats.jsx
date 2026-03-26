import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalIcon, AssistIcon } from './MatchIcons';

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function getRating(player) {
  const stats = typeof player.stats === 'string' ? JSON.parse(player.stats) : (player.stats || {});
  return parseFloat(stats.rating) || 0;
}

function getStats(player) {
  return typeof player.stats === 'string' ? JSON.parse(player.stats) : (player.stats || {});
}

function getRatingColor(rating) {
  if (rating >= 8.0) return '#00F5A0';   // excellent - green
  if (rating >= 7.0) return '#00D9F5';   // good - cyan
  if (rating >= 6.0) return '#FFD93D';   // average - yellow
  if (rating >= 5.0) return '#f39c12';   // below average - orange
  return '#FF4757';                       // poor - red
}

function getRatingLabel(rating) {
  if (rating >= 9.0) return 'Outstanding';
  if (rating >= 8.0) return 'Excellent';
  if (rating >= 7.0) return 'Good';
  if (rating >= 6.5) return 'Average';
  if (rating >= 5.5) return 'Below Avg';
  return 'Poor';
}

// ═══════════════════════════════════════════
// MOTM CARD (Man of the Match)
// ═══════════════════════════════════════════
function MotmCard({ player, match }) {
  const navigate = useNavigate();
  const stats = getStats(player);
  const rating = getRating(player);
  const name = player.display_name || player.name || '';
  const teamName = player.team_name || '';
  const position = player.position || player.default_position || '';
  const number = player.jersey_number ?? '';

  // Determine team logo
  const isHome = match?.home_team_id === player.team_id;
  const teamLogo = isHome
    ? (match?.home_logo || match?.home_team_logo)
    : (match?.away_logo || match?.away_team_logo);

  return (
    <div
      onClick={() => player.person_id && navigate(`/players/${player.person_id}`)}
      style={{
        background: 'linear-gradient(135deg, rgba(0,245,160,0.08) 0%, rgba(0,217,245,0.05) 100%)',
        border: '1px solid rgba(0,245,160,0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-xl)',
        cursor: player.person_id ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Star background accent */}
      <div style={{
        position: 'absolute', top: -20, right: -20, fontSize: '6rem', opacity: 0.04,
        fontWeight: 900, color: 'var(--accent-primary)', pointerEvents: 'none',
      }}>★</div>

      {/* Player photo / number circle */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--gradient-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, position: 'relative',
      }}>
        {player.photo_url ? (
          <img src={player.photo_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        ) : null}
        <div style={{
          display: player.photo_url ? 'none' : 'flex',
          width: '100%', height: '100%', borderRadius: '50%',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '1.3rem',
          color: 'var(--text-inverse)',
        }}>
          {number}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--accent-primary)',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ★ MAN OF THE MATCH
        </div>
        <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {name}
        </div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
          {teamLogo && <img src={teamLogo} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} />}
          {teamName} • {position}
        </div>
        {/* Mini stat row */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 8 }}>
          {stats.goals > 0 && <MiniStat label="Goals" value={stats.goals} />}
          {stats.assists > 0 && <MiniStat label="Assists" value={stats.assists} />}
          {stats.shots_on_target > 0 && <MiniStat label="On Target" value={stats.shots_on_target} />}
          {stats.passes > 0 && <MiniStat label="Passes" value={stats.passes} />}
          {stats.tackles > 0 && <MiniStat label="Tackles" value={stats.tackles} />}
        </div>
      </div>

      {/* Rating badge */}
      <div style={{
        width: 56, height: 56, borderRadius: 'var(--radius-md)',
        background: getRatingColor(rating),
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '1.2rem', color: '#0a0a0f', lineHeight: 1 }}>
          {rating.toFixed(1)}
        </span>
        <span style={{ fontSize: '0.4rem', fontWeight: 700, color: 'rgba(10,10,15,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          RATING
        </span>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: '0.5rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PLAYER RATING ROW
// ═══════════════════════════════════════════
function PlayerRatingRow({ player, rank, isMotm, match }) {
  const navigate = useNavigate();
  const stats = getStats(player);
  const rating = getRating(player);
  const name = player.display_name || player.name || '';
  const number = player.jersey_number ?? '';
  const position = player.position || player.default_position || '';

  const isHome = match?.home_team_id === player.team_id;
  const teamLogo = isHome
    ? (match?.home_logo || match?.home_team_logo)
    : (match?.away_logo || match?.away_team_logo);

  return (
    <div
      onClick={() => player.person_id && navigate(`/players/${player.person_id}`)}
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr auto',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: player.person_id ? 'pointer' : 'default',
        transition: 'background var(--transition-fast)',
        background: isMotm ? 'rgba(0,245,160,0.03)' : 'transparent',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = isMotm ? 'rgba(0,245,160,0.03)' : 'transparent'}
    >
      {/* Rank */}
      <span style={{
        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--fs-sm)',
        color: rank <= 3 ? 'var(--accent-primary)' : 'var(--text-tertiary)',
        textAlign: 'center',
      }}>
        {rank}
      </span>

      {/* Player info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {teamLogo && <img src={teamLogo} alt="" style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }} />}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isMotm && <span style={{ color: 'var(--accent-primary)', marginRight: 4 }}>★</span>}
            {name}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', display: 'flex', gap: 8 }}>
            <span>{position}</span>
            {number && <span>#{number}</span>}
            {stats.goals > 0 && <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 2 }}><GoalIcon size={12} /> {stats.goals}</span>}
            {stats.assists > 0 && <span style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: 2 }}><AssistIcon size={12} /> {stats.assists}</span>}
          </div>
        </div>
      </div>

      {/* Rating badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {/* Rating bar */}
        <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min((rating / 10) * 100, 100)}%`,
            height: '100%', borderRadius: 3,
            background: getRatingColor(rating),
            transition: 'width 0.6s ease',
          }} />
        </div>

        {/* Rating number */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'var(--fs-sm)',
          color: getRatingColor(rating), minWidth: 28, textAlign: 'right',
        }}>
          {rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TEAM STATS COMPARISON BAR
// ═══════════════════════════════════════════
function TeamStatBar({ label, homeVal, awayVal }) {
  const total = (homeVal || 0) + (awayVal || 0);
  const homePct = total > 0 ? ((homeVal / total) * 100) : 50;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>{homeVal}</span>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>{awayVal}</span>
      </div>
      <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', background: 'var(--bg-tertiary)', gap: 2 }}>
        <div style={{ width: `${homePct}%`, background: 'var(--accent-primary)', borderRadius: 3, transition: 'width 0.6s ease' }} />
        <div style={{ width: `${100 - homePct}%`, background: 'var(--accent-secondary)', borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
export default function MatchStats({ homePlayers = [], awayPlayers = [], match, events = [] }) {
  const [activeView, setActiveView] = useState('ratings');

  const allPlayers = [...homePlayers, ...awayPlayers];

  // Check if we have any stats data
  const hasStats = allPlayers.some(p => {
    const s = getStats(p);
    return s.rating || s.goals !== undefined || s.passes !== undefined;
  });

  if (!allPlayers.length || !hasStats) {
    return (
      <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>
        No stats available
      </p>
    );
  }

  // Sort all players by rating (highest first)
  const sortedByRating = [...allPlayers]
    .filter(p => getRating(p) > 0)
    .sort((a, b) => getRating(b) - getRating(a));

  const motm = sortedByRating[0];

  // Compute aggregated team stats
  const computeTeamStats = (players) => {
    let goals = 0, assists = 0, shots = 0, shotsOnTarget = 0, passes = 0, passAcc = 0, passCount = 0, tackles = 0, interceptions = 0;
    players.forEach(p => {
      const s = getStats(p);
      goals += s.goals || 0;
      assists += s.assists || 0;
      shots += s.shots || 0;
      shotsOnTarget += s.shots_on_target || 0;
      passes += s.passes || 0;
      if (s.pass_accuracy) { passAcc += s.pass_accuracy; passCount++; }
      tackles += s.tackles || 0;
      interceptions += s.interceptions || 0;
    });
    return {
      goals, assists, shots, shotsOnTarget, passes,
      passAccuracy: passCount > 0 ? Math.round(passAcc / passCount) : 0,
      tackles, interceptions,
    };
  };

  const homeStats = computeTeamStats(homePlayers);
  const awayStats = computeTeamStats(awayPlayers);

  const views = [
    { key: 'ratings', label: 'Player Ratings' },
    { key: 'team', label: 'Team Stats' },
  ];

  return (
    <div>
      {/* MOTM Card */}
      {motm && <MotmCard player={motm} match={match} />}

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 3 }}>
        {views.map(v => (
          <button key={v.key} onClick={() => setActiveView(v.key)} style={{
            flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--fs-xs)', fontWeight: 600,
            background: activeView === v.key ? 'var(--bg-elevated)' : 'transparent',
            color: activeView === v.key ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            border: 'none', cursor: 'pointer', transition: 'all var(--transition-fast)',
          }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* PLAYER RATINGS VIEW */}
      {activeView === 'ratings' && (
        <div style={{
          background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '28px 1fr auto',
            gap: 10, padding: '10px 14px',
            borderBottom: '2px solid var(--border-default)',
          }}>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textAlign: 'center' }}>#</span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Player</span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right', minWidth: 96 }}>Rating</span>
          </div>

          {/* Player rows */}
          {sortedByRating.map((player, i) => (
            <PlayerRatingRow
              key={player.person_id || player.match_player_id || i}
              player={player}
              rank={i + 1}
              isMotm={i === 0}
              match={match}
            />
          ))}
        </div>
      )}

      {/* TEAM STATS VIEW */}
      {activeView === 'team' && (
        <div style={{
          background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
        }}>
          {/* Team logos header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {(match?.home_logo || match?.home_team_logo) && (
                <img src={match.home_logo || match.home_team_logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              )}
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>
                {match?.home_short || match?.home_team_name || 'Home'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>
                {match?.away_short || match?.away_team_name || 'Away'}
              </span>
              {(match?.away_logo || match?.away_team_logo) && (
                <img src={match.away_logo || match.away_team_logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              )}
            </div>
          </div>

          <TeamStatBar label="Goals" homeVal={homeStats.goals} awayVal={awayStats.goals} />
          <TeamStatBar label="Shots" homeVal={homeStats.shots} awayVal={awayStats.shots} />
          <TeamStatBar label="Shots on Target" homeVal={homeStats.shotsOnTarget} awayVal={awayStats.shotsOnTarget} />
          <TeamStatBar label="Passes" homeVal={homeStats.passes} awayVal={awayStats.passes} />
          <TeamStatBar label="Pass Accuracy %" homeVal={homeStats.passAccuracy} awayVal={awayStats.passAccuracy} />
          <TeamStatBar label="Tackles" homeVal={homeStats.tackles} awayVal={awayStats.tackles} />
          <TeamStatBar label="Interceptions" homeVal={homeStats.interceptions} awayVal={awayStats.interceptions} />
          <TeamStatBar label="Assists" homeVal={homeStats.assists} awayVal={awayStats.assists} />
        </div>
      )}
    </div>
  );
}