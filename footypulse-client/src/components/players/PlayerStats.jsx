import React, { useState, useEffect } from 'react';
import { playersApi } from '../../api/playersApi';
import Card from '../common/Card';

function getRatingColor(rating) {
  if (rating >= 8.0) return '#00F5A0';
  if (rating >= 7.0) return '#00D9F5';
  if (rating >= 6.0) return '#FFD93D';
  if (rating >= 5.0) return '#f39c12';
  return '#FF4757';
}

function getRatingLabel(rating) {
  if (rating >= 9.0) return 'Outstanding';
  if (rating >= 8.0) return 'Excellent';
  if (rating >= 7.0) return 'Good';
  if (rating >= 6.5) return 'Average';
  if (rating >= 5.5) return 'Below Avg';
  return 'Poor';
}

function StatCard({ label, value, icon, color, subtitle, large }) {
  return (
    <div style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: large ? 'var(--space-xl)' : 'var(--space-lg)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all var(--transition-base)',
    }}>
      {/* Subtle glow at top */}
      {color && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: 2,
          background: color,
          opacity: 0.6,
        }} />
      )}

      <div style={{
        fontSize: 'var(--fs-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 600,
        marginBottom: 'var(--space-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
      }}>
        {icon && <span style={{ fontSize: '0.85rem' }}>{icon}</span>}
        {label}
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: large ? 'var(--fs-3xl)' : 'var(--fs-2xl)',
        fontWeight: 900,
        color: color || 'var(--text-primary)',
        lineHeight: 1,
      }}>
        {value}
      </div>

      {subtitle && (
        <div style={{
          fontSize: 'var(--fs-xs)',
          color: 'var(--text-tertiary)',
          marginTop: 'var(--space-xs)',
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function RatingCard({ rating }) {
  const r = parseFloat(rating) || 0;
  const color = getRatingColor(r);
  const label = getRatingLabel(r);
  const percentage = Math.min((r / 10) * 100, 100);

  return (
    <div style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
      position: 'relative',
      overflow: 'hidden',
      gridColumn: 'span 2',
    }}>
      {/* Top accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 3,
        background: color,
      }} />

      <div style={{
        fontSize: 'var(--fs-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 600,
        marginBottom: 'var(--space-md)',
      }}>
        ⭐ Average Rating
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xl)',
      }}>
        {/* Big rating number */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-lg)',
          background: color,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: 'var(--fs-2xl)',
            color: '#0a0a0f',
            lineHeight: 1,
          }}>
            {r > 0 ? r.toFixed(1) : '—'}
          </span>
          {r > 0 && (
            <span style={{
              fontSize: '0.5rem',
              fontWeight: 700,
              color: 'rgba(10,10,15,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {label}
            </span>
          )}
        </div>

        {/* Rating bar */}
        <div style={{ flex: 1 }}>
          <div style={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            background: 'var(--bg-tertiary)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${percentage}%`,
              height: '100%',
              borderRadius: 4,
              background: color,
              transition: 'width 0.8s ease',
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--space-xs)',
            fontSize: 'var(--fs-xs)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}>
            <span>0</span>
            <span>10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerStats({ stats, playerId }) {
  const [seasonStats, setSeasonStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) return;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await playersApi.getStats(playerId);
        const data = res?.data || res;
        setSeasonStats(data);
      } catch (err) {
        console.error('Failed to fetch player stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [playerId]);

  // Merge stats from player data and season stats
  const s = seasonStats || stats || {};

  const appearances = s.appearances || s.apps || 0;
  const goals = s.goals || 0;
  const assists = s.assists || 0;
  const yellowCards = s.yellow_cards || s.yellowCards || 0;
  const redCards = s.red_cards || s.redCards || 0;
  const minutes = s.minutes_played || s.minutes || 0;
  const rating = s.avg_rating || s.rating || 0;
  const cleanSheets = s.clean_sheets || 0;
  const shots = s.shots || 0;
  const shotsOnTarget = s.shots_on_target || 0;
  const passes = s.passes || 0;
  const passAccuracy = s.pass_accuracy || 0;
  const tackles = s.tackles || 0;
  const interceptions = s.interceptions || 0;
  const saves = s.saves || 0;

  if (!stats && !seasonStats) {
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
          No stats available
        </p>
        <p style={{ fontSize: 'var(--fs-sm)' }}>
          Stats will appear once the player has match data
        </p>
      </div>
    );
  }

  const isGK = stats?.primary_position === 'GK';

  return (
    <div>
      {/* Section Title */}
      <h2 style={{
        fontSize: 'var(--fs-xl)',
        fontWeight: 900,
        fontFamily: 'var(--font-display)',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-lg)',
        letterSpacing: '-0.01em',
      }}>
        Player Bio
      </h2>

      {/* Rating + Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-xl)',
      }}>
        {/* Rating Card - spans 2 columns */}
        {rating > 0 && <RatingCard rating={rating} />}

        {/* Core Stats */}
        <StatCard
          label="Appearances"
          value={appearances}
          icon="👤"
          color="var(--text-primary)"
        />
        <StatCard
          label="Goals"
          value={goals}
          icon="⚽"
          color="var(--accent-primary)"
          subtitle={appearances > 0 ? `${(goals / appearances).toFixed(2)} per game` : null}
        />
        <StatCard
          label="Assists"
          value={assists}
          icon="🎯"
          color="var(--accent-secondary)"
          subtitle={appearances > 0 ? `${(assists / appearances).toFixed(2)} per game` : null}
        />
        <StatCard
          label="Yellow Cards"
          value={yellowCards}
          icon=""
          color="var(--draw)"
        />
        <StatCard
          label="Red Cards"
          value={redCards}
          icon=""
          color="var(--loss)"
        />
        <StatCard
          label="Minutes Played"
          value={minutes.toLocaleString()}
          icon="⏱️"
          subtitle={appearances > 0 ? `${Math.round(minutes / appearances)} avg per game` : null}
        />
      </div>

      {/* Advanced Stats - only show if we have data */}
      {(shots > 0 || passes > 0 || tackles > 0 || cleanSheets > 0 || saves > 0) && (
        <>
          <h3 style={{
            fontSize: 'var(--fs-md)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-md)',
          }}>
            Detailed Stats
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 'var(--space-md)',
          }}>
            {shots > 0 && (
              <StatCard label="Total Shots" value={shots} />
            )}
            {shotsOnTarget > 0 && (
              <StatCard
                label="Shots on Target"
                value={shotsOnTarget}
                subtitle={shots > 0 ? `${Math.round((shotsOnTarget / shots) * 100)}% accuracy` : null}
              />
            )}
            {passes > 0 && (
              <StatCard label="Passes" value={passes} />
            )}
            {passAccuracy > 0 && (
              <StatCard
                label="Pass Accuracy"
                value={`${passAccuracy}%`}
                color={passAccuracy >= 85 ? 'var(--accent-primary)' : passAccuracy >= 70 ? 'var(--draw)' : 'var(--loss)'}
              />
            )}
            {tackles > 0 && (
              <StatCard label="Tackles" value={tackles} />
            )}
            {interceptions > 0 && (
              <StatCard label="Interceptions" value={interceptions} />
            )}
            {isGK && cleanSheets > 0 && (
              <StatCard
                label="Clean Sheets"
                value={cleanSheets}
                icon="🧤"
                color="var(--accent-primary)"
              />
            )}
            {isGK && saves > 0 && (
              <StatCard label="Saves" value={saves} icon="🧤" />
            )}
          </div>
        </>
      )}

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-lg)',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--fs-sm)',
        }}>
          Loading season stats...
        </div>
      )}
    </div>
  );
}