import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';

// Single column leaderboard
function PlayerColumn({ title, players = [], statKey, statLabel, accentColor }) {
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      flex: 1,
      minWidth: 280,
    }}>
      {/* Column header */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {title}
        </span>
      </div>

      {/* Player rows */}
      {!players.length ? (
        <div style={{
          padding: 'var(--space-xl)',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--fs-sm)',
        }}>
          No data available
        </div>
      ) : (
        <div>
          {players.map((player, index) => (
            <div
              key={player.player_id || index}
              onClick={() => player.player_id && navigate(`/players/${player.player_id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm) var(--space-lg)',
                borderBottom: index < players.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                cursor: player.player_id ? 'pointer' : 'default',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (player.player_id) e.currentTarget.style.background = 'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Rank */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-xs)',
                fontWeight: 700,
                color: index < 3 ? accentColor : 'var(--text-tertiary)',
                width: 24,
                textAlign: 'center',
                flexShrink: 0,
              }}>
                {index + 1}
              </span>

              {/* Team logo */}
              {player.team_logo ? (
                <img
                  src={player.team_logo}
                  alt=""
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: 'contain',
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: 2,
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.5rem',
                  color: 'var(--text-tertiary)',
                  flexShrink: 0,
                }}>
                  {(player.team_name || '?')[0]}
                </div>
              )}

              {/* Player name */}
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

              {/* Stat value */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-md)',
                fontWeight: 800,
                color: accentColor,
                minWidth: 30,
                textAlign: 'right',
              }}>
                {player[statKey] || 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopPlayers({ scorers = [], assists = [], redCards = [] }) {
  const hasAnyData = scorers.length || assists.length || redCards.length;

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
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.4 }}>🏅</div>
        <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
          No player stats available yet
        </p>
        <p style={{ fontSize: 'var(--fs-sm)' }}>
          Stats will appear once the season is underway
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
        Top Players — Goals, Assists & More
      </h2>

      <div style={{
        display: 'flex',
        gap: 'var(--space-lg)',
        flexWrap: 'wrap',
      }}>
        <PlayerColumn
          title="Top Scorers"
          players={scorers}
          statKey="goals"
          statLabel="Goals"
          accentColor="var(--accent-primary)"
        />
        <PlayerColumn
          title="Assists"
          players={assists}
          statKey="assists"
          statLabel="Assists"
          accentColor="var(--accent-secondary)"
        />
        <PlayerColumn
          title="Red Cards"
          players={redCards}
          statKey="red_cards"
          statLabel="Reds"
          accentColor="var(--live)"
        />
      </div>
    </div>
  );
}