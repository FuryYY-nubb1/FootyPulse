import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeamTopPlayers({ players = [] }) {
  const navigate = useNavigate();

  // Sort players by goals/appearances or just show all with stats
  const topPlayers = [...players]
    .sort((a, b) => (b.goals || 0) - (a.goals || 0))
    .slice(0, 10);

  if (!topPlayers.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-3xl)',
        color: 'var(--text-secondary)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}>
        <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>No player data available</p>
        <p style={{ fontSize: 'var(--fs-sm)' }}>Stats will appear once the season is underway</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 80px 80px 80px',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        fontSize: 'var(--fs-xs)',
        fontWeight: 600,
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 'var(--space-xs)',
      }}>
        <span>#</span>
        <span>Player</span>
        <span style={{ textAlign: 'center' }}>Apps</span>
        <span style={{ textAlign: 'center' }}>Goals</span>
        <span style={{ textAlign: 'center' }}>Assists</span>
      </div>

      {/* Player rows */}
      {topPlayers.map((player, index) => (
        <div
          key={player.id || player.person_id}
          onClick={() => navigate(`/players/${player.person_id || player.id}`)}
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 80px 80px 80px',
            gap: 'var(--space-sm)',
            padding: 'var(--space-md)',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border-subtle)',
            transition: 'background var(--transition-fast)',
            borderRadius: index === topPlayers.length - 1 ? '0 0 var(--radius-md) var(--radius-md)' : 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {/* Rank */}
          <span style={{
            fontSize: 'var(--fs-sm)',
            fontWeight: 700,
            color: index < 3 ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}>
            {index + 1}
          </span>

          {/* Player info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minWidth: 0 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 'var(--fs-xs)',
              fontWeight: 700,
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-mono)',
              overflow: 'hidden',
            }}>
              {player.photo_url ? (
                <img src={player.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                player.shirt_number || player.jersey_number || '#'
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 'var(--fs-sm)',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {player.name || player.player_name || player.display_name}
              </div>
              <div style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--text-tertiary)',
              }}>
                {player.position || player.primary_position || ''}
                {player.nationality ? ` · ${player.nationality}` : ''}
              </div>
            </div>
          </div>

          {/* Appearances */}
          <span style={{
            textAlign: 'center',
            fontSize: 'var(--fs-sm)',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}>
            {player.appearances ?? player.apps ?? '-'}
          </span>

          {/* Goals */}
          <span style={{
            textAlign: 'center',
            fontSize: 'var(--fs-sm)',
            fontWeight: 700,
            color: (player.goals || 0) > 0 ? 'var(--text-primary)' : 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}>
            {player.goals ?? '-'}
          </span>

          {/* Assists */}
          <span style={{
            textAlign: 'center',
            fontSize: 'var(--fs-sm)',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}>
            {player.assists ?? '-'}
          </span>
        </div>
      ))}
    </div>
  );
}