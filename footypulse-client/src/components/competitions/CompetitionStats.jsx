import React from 'react';
import { useNavigate } from 'react-router-dom';

// ── Stat Card (big number + label) ──
function StatCard({ value, label, icon, color = 'var(--accent-primary)' }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xs)',
      minWidth: 0,
    }}>
      <div style={{ fontSize: '1.2rem', opacity: 0.5 }}>{icon}</div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-2xl)',
        fontWeight: 900,
        color,
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 'var(--fs-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 600,
      }}>
        {label}
      </div>
    </div>
  );
}

// ── Player Row (used in top scorers / assists lists) ──
function PlayerRow({ rank, player, statValue, statColor = 'var(--accent-primary)' }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/players/${player.player_id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-xs)',
        fontWeight: 700,
        color: rank <= 3 ? 'var(--accent-primary)' : 'var(--text-tertiary)',
        width: 24,
        textAlign: 'center',
      }}>
        {rank}
      </span>

      {player.team_logo ? (
        <img src={player.team_logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 3 }} />
      ) : (
        <div style={{ width: 22, height: 22, borderRadius: 3, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
          {(player.team_name || 'T')[0]}
        </div>
      )}

      <span style={{
        flex: 1,
        fontSize: 'var(--fs-sm)',
        fontWeight: 500,
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {player.player_name || player.name}
      </span>

      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-md)',
        fontWeight: 800,
        color: statColor,
        minWidth: 30,
        textAlign: 'right',
      }}>
        {statValue}
      </span>
    </div>
  );
}

// ── Player List Card ──
function PlayerListCard({ title, players = [], statKey, statColor, emptyText }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      flex: '1 1 300px',
      minWidth: 0,
    }}>
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        borderBottom: '1px solid var(--border-subtle)',
        fontWeight: 800,
        fontSize: 'var(--fs-sm)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-primary)',
      }}>
        {title}
      </div>

      {players.length > 0 ? (
        players.map((p, i) => (
          <PlayerRow
            key={p.player_id || i}
            rank={i + 1}
            player={p}
            statValue={p[statKey] || 0}
            statColor={statColor}
          />
        ))
      ) : (
        <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
          {emptyText || 'No data yet'}
        </div>
      )}
    </div>
  );
}

// ── Match Result Row (for biggest win / highest scoring) ──
function MatchResultRow({ match }) {
  const navigate = useNavigate();
  if (!match) return null;

  const totalGoals = (match.home_score || 0) + (match.away_score || 0);

  return (
    <div
      onClick={() => navigate(`/matches/${match.match_id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {match.home_logo && <img src={match.home_logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />}
      <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {match.home_team}
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 800,
        fontSize: 'var(--fs-sm)',
        color: 'var(--accent-primary)',
        padding: '2px 8px',
        background: 'rgba(0,245,160,0.08)',
        borderRadius: 'var(--radius-sm)',
      }}>
        {match.home_score} - {match.away_score}
      </span>
      <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, flex: 1, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {match.away_team}
      </span>
      {match.away_logo && <img src={match.away_logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />}
    </div>
  );
}


// ── Main Component ──
export default function CompetitionStats({
  standings = [],
  scorers = [],
  assists = [],
  redCards = [],
  matches = [],
}) {
  // ── Compute league stats from standings ──
  const totalMatches = standings.reduce((sum, r) => sum + (r.played || r.won + r.drawn + r.lost || 0), 0) / 2;
  const totalGoals = standings.reduce((sum, r) => sum + (r.goals_for || 0), 0);
  const totalWins = standings.reduce((sum, r) => sum + (r.won || 0), 0);
  const totalDraws = standings.reduce((sum, r) => sum + (r.drawn || 0), 0) / 2;
  const avgGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : '0.00';

  // ── Compute from match data ──
  const finishedMatches = matches.filter(m => m.status === 'finished');

  // Highest scoring match
  const highestScoring = [...finishedMatches]
    .sort((a, b) => ((b.home_score || 0) + (b.away_score || 0)) - ((a.home_score || 0) + (a.away_score || 0)))
    .slice(0, 3)
    .map(m => ({
      match_id: m.match_id,
      home_team: m.home_team_name || m.home_short,
      away_team: m.away_team_name || m.away_short,
      home_logo: m.home_logo,
      away_logo: m.away_logo,
      home_score: m.home_score,
      away_score: m.away_score,
    }));

  // Biggest wins (largest goal difference)
  const biggestWins = [...finishedMatches]
    .sort((a, b) => Math.abs((b.home_score || 0) - (b.away_score || 0)) - Math.abs((a.home_score || 0) - (a.away_score || 0)))
    .filter(m => m.home_score !== m.away_score)
    .slice(0, 3)
    .map(m => ({
      match_id: m.match_id,
      home_team: m.home_team_name || m.home_short,
      away_team: m.away_team_name || m.away_short,
      home_logo: m.home_logo,
      away_logo: m.away_logo,
      home_score: m.home_score,
      away_score: m.away_score,
    }));

  // Best attack (team with most goals for)
  const bestAttack = [...standings].sort((a, b) => (b.goals_for || 0) - (a.goals_for || 0)).slice(0, 1)[0];
  // Best defense (team with fewest goals against)
  const bestDefense = [...standings].sort((a, b) => (a.goals_against || 0) - (b.goals_against || 0)).slice(0, 1)[0];

  const hasAnyData = standings.length > 0 || scorers.length > 0;

  if (!hasAnyData) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-3xl)',
        color: 'var(--text-secondary)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.4 }}>📊</div>
        <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
          No stats available yet
        </p>
        <p style={{ fontSize: 'var(--fs-sm)' }}>
          Statistics will appear once the season is underway
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{
        fontSize: 'var(--fs-xl)',
        fontWeight: 900,
        fontFamily: 'var(--font-display)',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-lg)',
        letterSpacing: '-0.01em',
      }}>
        Season Statistics
      </h2>

      {/* ── Overview Stat Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-xl)',
      }}>
        <StatCard value={Math.round(totalMatches)} label="Matches Played" icon="⚽" color="var(--accent-primary)" />
        <StatCard value={totalGoals} label="Total Goals" icon="🥅" color="var(--accent-secondary)" />
        <StatCard value={avgGoals} label="Avg Goals / Match" icon="📊" color="#f39c12" />
        <StatCard value={totalWins} label="Total Wins" icon="🏆" color="#2ecc71" />
        <StatCard value={Math.round(totalDraws)} label="Total Draws" icon="🤝" color="#95a5a6" />
        <StatCard value={standings.length} label="Teams" icon="🏟️" color="var(--text-primary)" />
      </div>

      {/* ── Best Attack / Defense ── */}
      {(bestAttack || bestDefense) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}>
          {bestAttack && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
            }}>
              {bestAttack.team_logo && <img src={bestAttack.team_logo} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />}
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Best Attack</div>
                <div style={{ fontSize: 'var(--fs-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{bestAttack.team_name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', color: 'var(--accent-primary)', fontWeight: 800 }}>{bestAttack.goals_for} goals scored</div>
              </div>
            </div>
          )}
          {bestDefense && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
            }}>
              {bestDefense.team_logo && <img src={bestDefense.team_logo} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />}
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Best Defense</div>
                <div style={{ fontSize: 'var(--fs-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{bestDefense.team_name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', color: 'var(--accent-secondary)', fontWeight: 800 }}>{bestDefense.goals_against} goals conceded</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Top Scorers / Assists / Red Cards ── */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-lg)',
        flexWrap: 'wrap',
        marginBottom: 'var(--space-xl)',
      }}>
        <PlayerListCard
          title="Top Scorers"
          players={scorers}
          statKey="goals"
          statColor="var(--accent-primary)"
          emptyText="No goals scored yet"
        />
        <PlayerListCard
          title="Top Assists"
          players={assists}
          statKey="assists"
          statColor="var(--accent-secondary)"
          emptyText="No assists recorded yet"
        />
        <PlayerListCard
          title="Red Cards"
          players={redCards}
          statKey="red_cards"
          statColor="var(--live)"
          emptyText="No red cards yet"
        />
      </div>

      {/* ── Highest Scoring Matches / Biggest Wins ── */}
      {(highestScoring.length > 0 || biggestWins.length > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {highestScoring.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--border-subtle)',
                fontWeight: 800,
                fontSize: 'var(--fs-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Highest Scoring Matches
              </div>
              {highestScoring.map((m, i) => <MatchResultRow key={i} match={m} />)}
            </div>
          )}

          {biggestWins.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--border-subtle)',
                fontWeight: 800,
                fontSize: 'var(--fs-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Biggest Wins
              </div>
              {biggestWins.map((m, i) => <MatchResultRow key={i} match={m} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}