import React from 'react';
import { useNavigate } from 'react-router-dom';

// Map primary_position codes to display groups
const POSITION_GROUPS = {
  GK: 'Goalkeepers',
  CB: 'Defenders',
  LB: 'Defenders',
  RB: 'Defenders',
  CDM: 'Midfielders',
  CM: 'Midfielders',
  CAM: 'Midfielders',
  LW: 'Attackers',
  RW: 'Attackers',
  ST: 'Attackers',
};

const GROUP_ORDER = ['Goalkeepers', 'Defenders', 'Midfielders', 'Attackers'];

// SVG stat icons matching Goal.com style
const StatIcons = {
  appearances: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  goals: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  ),
  assists: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  yellowCards: (
    <div style={{ width: 12, height: 16, borderRadius: 2, background: '#FFD93D' }} />
  ),
  redCards: (
    <div style={{ width: 12, height: 16, borderRadius: 2, background: '#FF4757' }} />
  ),
};

function PlayerPhoto({ player, size = 40 }) {
  const photoUrl = player.photo_url;

  if (photoUrl) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--bg-tertiary)',
      }}>
        <img
          src={photoUrl}
          alt={player.display_name || player.name || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-tertiary);border-radius:50%;color:var(--text-tertiary)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>`;
          }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'var(--bg-tertiary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'var(--text-tertiary)',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}

function PlayerRow({ player, onClick }) {
  const name = player.display_name || player.name || player.player_name || '';
  const jerseyNum = player.jersey_number || player.shirt_number || '';
  const loanInfo = player.contract_type === 'loan' ? player.parent_club_name : null;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 36px 1fr repeat(5, 40px)',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-md) var(--space-sm)',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <PlayerPhoto player={player} size={36} />

      <span style={{
        fontWeight: 800,
        fontSize: 'var(--fs-base)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        textAlign: 'center',
      }}>
        {jerseyNum}
      </span>

      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </div>
        {loanInfo && (
          <div style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--accent-primary)',
            fontWeight: 500,
          }}>
            On Loan at {loanInfo}
          </div>
        )}
      </div>

      {/* Stats: Apps, Goals, Assists, Yellow Cards, Red Cards */}
      <span style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        {player.appearances ?? player.apps ?? 0}
      </span>
      <span style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        {player.goals ?? 0}
      </span>
      <span style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        {player.assists ?? 0}
      </span>
      <span style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        {player.yellow_cards ?? 0}
      </span>
      <span style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        {player.red_cards ?? 0}
      </span>
    </div>
  );
}

function StatColumnHeaders() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '40px 36px 1fr repeat(5, 40px)',
      gap: 'var(--space-sm)',
      padding: '0 var(--space-sm)',
      alignItems: 'center',
    }}>
      {/* Empty cells for photo + number + name */}
      <span />
      <span />
      <span />

      {/* Stat icon headers */}
      <span style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-tertiary)' }} title="Matches Played">
        {StatIcons.appearances}
      </span>
      <span style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-tertiary)' }} title="Goals Scored">
        {StatIcons.goals}
      </span>
      <span style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-tertiary)' }} title="Assists">
        {StatIcons.assists}
      </span>
      <span style={{ display: 'flex', justifyContent: 'center' }} title="Yellow Cards">
        {StatIcons.yellowCards}
      </span>
      <span style={{ display: 'flex', justifyContent: 'center' }} title="Red Cards">
        {StatIcons.redCards}
      </span>
    </div>
  );
}

export default function TeamSquad({ players = [], teamName = '' }) {
  const navigate = useNavigate();

  // Separate managers from players
  const managers = players.filter(p => p.person_type === 'manager');
  const playersList = players.filter(p => p.person_type !== 'manager');

  // Group players by position category
  const grouped = {};
  playersList.forEach((p) => {
    const pos = p.primary_position || p.position || '';
    const group = POSITION_GROUPS[pos] || 'Other';
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(p);
  });

  // Sort each group by jersey number
  Object.values(grouped).forEach((group) => {
    group.sort((a, b) => (a.jersey_number || 99) - (b.jersey_number || 99));
  });

  // Build ordered groups
  const orderedGroups = GROUP_ORDER
    .filter((g) => grouped[g]?.length)
    .map((g) => ({ name: g, players: grouped[g] }));

  // Add "Other" if exists
  if (grouped.Other?.length) {
    orderedGroups.push({ name: 'Other', players: grouped.Other });
  }

  return (
    <div>
      {/* Page title */}
      <h2 style={{
        fontSize: 'var(--fs-xl)',
        fontWeight: 900,
        fontFamily: 'var(--font-display)',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-xl)',
        letterSpacing: '-0.01em',
      }}>
        {teamName ? `${teamName} Squad` : 'Squad'}
      </h2>

      {/* Position groups */}
      {orderedGroups.map(({ name, players: groupPlayers }) => {
        // Split into two columns
        const mid = Math.ceil(groupPlayers.length / 2);
        const leftCol = groupPlayers.slice(0, mid);
        const rightCol = groupPlayers.slice(mid);

        return (
          <div key={name} style={{ marginBottom: 'var(--space-2xl)' }}>
            {/* Group header with stat icons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-xl)',
              borderBottom: '2px solid var(--border-default)',
              paddingBottom: 'var(--space-sm)',
              marginBottom: 'var(--space-xs)',
            }}>
              {/* Left column header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
              }}>
                <h3 style={{
                  fontSize: 'var(--fs-lg)',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                }}>
                  {name}
                </h3>
                <StatColumnHeaders />
              </div>

              {/* Right column header (stat icons only) */}
              {rightCol.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                }}>
                  <span />
                  <StatColumnHeaders />
                </div>
              )}
            </div>

            {/* Two-column player rows */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: rightCol.length > 0 ? '1fr 1fr' : '1fr',
              gap: '0 var(--space-xl)',
            }}>
              {/* Left column */}
              <div>
                {leftCol.map((player) => (
                  <PlayerRow
                    key={player.person_id || player.id}
                    player={player}
                    onClick={() => navigate(`/players/${player.person_id || player.id}`)}
                  />
                ))}
              </div>

              {/* Right column */}
              {rightCol.length > 0 && (
                <div>
                  {rightCol.map((player) => (
                    <PlayerRow
                      key={player.person_id || player.id}
                      player={player}
                      onClick={() => navigate(`/players/${player.person_id || player.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Manager section */}
      {managers.length > 0 && (
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <div style={{
            borderBottom: '2px solid var(--border-default)',
            paddingBottom: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
          }}>
            <h3 style={{
              fontSize: 'var(--fs-lg)',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}>
              Manager
            </h3>
          </div>
          {managers.map((manager) => (
            <div
              key={manager.person_id || manager.id}
              onClick={() => navigate(`/players/${manager.person_id || manager.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-md) var(--space-sm)',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <PlayerPhoto player={manager} size={48} />
              <span style={{
                fontSize: 'var(--fs-base)',
                fontWeight: 600,
              }}>
                {manager.display_name || manager.name || manager.player_name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Key / Legend */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-lg) var(--space-xl)',
      }}>
        <h4 style={{
          fontSize: 'var(--fs-md)',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-lg)',
        }}>
          Key
        </h4>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-xl)',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>{StatIcons.appearances}</span>
            Matches Played
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>{StatIcons.goals}</span>
            Goals Scored
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>{StatIcons.assists}</span>
            Assists
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            {StatIcons.yellowCards}
            Yellow Cards
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            {StatIcons.redCards}
            Red Cards
          </div>
        </div>
      </div>

      {/* No players fallback */}
      {!playersList.length && !managers.length && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3xl)',
          color: 'var(--text-secondary)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>No squad data available</p>
          <p style={{ fontSize: 'var(--fs-sm)' }}>Squad information will appear when available</p>
        </div>
      )}
    </div>
  );
}