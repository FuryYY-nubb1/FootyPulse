// ============================================
// src/components/players/PlayerStats.jsx
// ============================================
// REDESIGNED: Modern sports aesthetic inspired by
// FIFA cards, ESPN, and SofaScore stat layouts.
// ============================================

import React, { useState, useEffect } from 'react';
import { playersApi } from '../../api/playersApi';

// ── Rating helpers ──
function getRatingColor(rating) {
  if (rating >= 8.0) return '#00F5A0';
  if (rating >= 7.0) return '#00D9F5';
  if (rating >= 6.0) return '#FFD93D';
  if (rating >= 5.0) return '#f39c12';
  return '#FF4757';
}

function getRatingLabel(rating) {
  if (rating >= 9.0) return 'WORLD CLASS';
  if (rating >= 8.0) return 'EXCELLENT';
  if (rating >= 7.0) return 'GOOD';
  if (rating >= 6.5) return 'AVERAGE';
  if (rating >= 5.5) return 'BELOW AVG';
  return 'POOR';
}

// ── Circular progress ring ──
function CircularStat({ value, max = 100, size = 64, strokeWidth = 4, color, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min((value / max) * 100, 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x={size / 2} y={size / 2}
          textAnchor="middle" dominantBaseline="central"
          fill="var(--text-primary)"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize: size * 0.28, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
          {value}
        </text>
      </svg>
      {label && (
        <span style={{
          fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-tertiary)',
          textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center',
        }}>{label}</span>
      )}
    </div>
  );
}

// ── Horizontal progress bar stat ──
function BarStat({ label, value, max = 100, suffix = '', color = 'var(--accent-primary)' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
          {value}{suffix}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3, background: color,
          width: `${pct}%`, transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

// ── Hex stat badge (FIFA-style) ──
function HexStat({ value, label, color = 'var(--accent-primary)', size = 'normal' }) {
  const isLarge = size === 'large';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: isLarge ? 'var(--space-lg)' : 'var(--space-md)',
    }}>
      <div style={{
        width: isLarge ? 72 : 52, height: isLarge ? 72 : 52,
        borderRadius: isLarge ? 18 : 14,
        background: `linear-gradient(135deg, ${color}22, ${color}11)`,
        border: `2px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 900,
          fontSize: isLarge ? 'var(--fs-2xl)' : 'var(--fs-lg)',
          color,
        }}>
          {value}
        </span>
      </div>
      <span style={{
        fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-tertiary)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        textAlign: 'center', lineHeight: 1.2,
      }}>{label}</span>
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
        setSeasonStats(res?.data || res);
      } catch (err) {
        console.error('Failed to fetch player stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [playerId]);

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
  const isGK = stats?.primary_position === 'GK';

  if (!stats && !seasonStats) {
    return (
      <div style={{
        textAlign: 'center', padding: 'var(--space-3xl)',
        color: 'var(--text-secondary)', background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.4 }}>📊</div>
        <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>No stats available</p>
        <p style={{ fontSize: 'var(--fs-sm)' }}>Stats will appear once the player has match data</p>
      </div>
    );
  }

  const goalsPer90 = minutes > 0 ? ((goals / minutes) * 90).toFixed(2) : '0.00';
  const assistsPer90 = minutes > 0 ? ((assists / minutes) * 90).toFixed(2) : '0.00';
  const shotAccuracy = shots > 0 ? Math.round((shotsOnTarget / shots) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>

      {/* ═══ SECTION 1: SEASON OVERVIEW ═══ */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,245,160,0.04) 0%, rgba(0,217,245,0.02) 100%)',
        border: '1px solid rgba(0,245,160,0.12)',
        borderRadius: 16, padding: 'var(--space-xl)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative gradient line at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #00F5A0, #00D9F5, #6366f1)',
        }} />

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 'var(--space-lg)',
        }}>
          <h2 style={{
            fontSize: 'var(--fs-sm)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--text-tertiary)',
          }}>
            Season Overview
          </h2>
          {rating > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: getRatingColor(rating),
              padding: '6px 14px', borderRadius: 10,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 'var(--fs-lg)', color: '#0a0a0f', lineHeight: 1 }}>
                {rating.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'rgba(10,10,15,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {getRatingLabel(rating)}
              </span>
            </div>
          )}
        </div>

        {/* Key numbers row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: 2, background: 'rgba(255,255,255,0.03)', borderRadius: 12, overflow: 'hidden',
        }}>
          {[
            { val: appearances, label: 'Apps', color: '#a78bfa' },
            { val: goals, label: 'Goals', color: '#00F5A0' },
            { val: assists, label: 'Assists', color: '#00D9F5' },
            { val: yellowCards, label: 'Yellows', color: '#FFD93D' },
            { val: redCards, label: 'Reds', color: '#FF4757' },
            { val: minutes.toLocaleString(), label: 'Minutes', color: '#94a3b8' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)', padding: '16px 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontWeight: 900,
                fontSize: 'var(--fs-xl)', color: item.color, lineHeight: 1,
              }}>
                {item.val}
              </span>
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--text-tertiary)',
              }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 2: PERFORMANCE METRICS ═══ */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-md)',
      }}>

        {/* Attacking */}
        <div style={{
          background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 14, padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#00F5A0' }} />
          <h3 style={{
            fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#00F5A0', marginBottom: 'var(--space-lg)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: '0.9rem' }}>⚡</span> Attacking
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 'var(--space-lg)' }}>
            <CircularStat value={goals} max={Math.max(goals, 30)} size={70} strokeWidth={5} color="#00F5A0" label="Goals" />
            <CircularStat value={assists} max={Math.max(assists, 20)} size={70} strokeWidth={5} color="#00D9F5" label="Assists" />
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>Goals per 90</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 700, color: '#00F5A0' }}>{goalsPer90}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>Assists per 90</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 700, color: '#00D9F5' }}>{assistsPer90}</span>
            </div>
            {shots > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>Shot accuracy</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 700, color: shotAccuracy >= 50 ? '#00F5A0' : '#FFD93D' }}>{shotAccuracy}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Passing & Creation */}
        {(passes > 0 || passAccuracy > 0) ? (
          <div style={{
            background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 14, padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#6366f1' }} />
            <h3 style={{
              fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#6366f1', marginBottom: 'var(--space-lg)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '0.9rem' }}>🎯</span> Passing
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 'var(--space-lg)' }}>
              <CircularStat value={passAccuracy > 0 ? `${passAccuracy}` : '—'} max={100} size={70} strokeWidth={5} color="#6366f1" label="Accuracy %" />
              <HexStat value={passes} label="Total Passes" color="#a78bfa" />
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-md)' }}>
              {shots > 0 && (
                <BarStat label="Shots" value={shots} max={Math.max(shots, 30)} color="#6366f1" />
              )}
              {shotsOnTarget > 0 && (
                <BarStat label="Shots on Target" value={shotsOnTarget} max={shots || 10} color="#a78bfa" />
              )}
            </div>
          </div>
        ) : (
          /* Discipline card as fallback */
          <div style={{
            background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 14, padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#FFD93D' }} />
            <h3 style={{
              fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#FFD93D', marginBottom: 'var(--space-lg)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '0.9rem' }}>🟨</span> Discipline
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <HexStat value={yellowCards} label="Yellow Cards" color="#FFD93D" size="large" />
              <HexStat value={redCards} label="Red Cards" color="#FF4757" size="large" />
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>Avg mins per game</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 700 }}>
                  {appearances > 0 ? Math.round(minutes / appearances) : '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ SECTION 3: DEFENSIVE / GK STATS ═══ */}
      {(tackles > 0 || interceptions > 0 || saves > 0 || cleanSheets > 0) && (
        <div style={{
          background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 14, padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#f59e0b' }} />
          <h3 style={{
            fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#f59e0b', marginBottom: 'var(--space-lg)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: '0.9rem' }}>{isGK ? '🧤' : '🛡️'}</span>
            {isGK ? 'Goalkeeping' : 'Defensive'}
          </h3>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: 'var(--space-md)',
          }}>
            {tackles > 0 && <HexStat value={tackles} label="Tackles" color="#f59e0b" />}
            {interceptions > 0 && <HexStat value={interceptions} label="Interceptions" color="#fb923c" />}
            {isGK && saves > 0 && <HexStat value={saves} label="Saves" color="#f59e0b" />}
            {isGK && cleanSheets > 0 && <HexStat value={cleanSheets} label="Clean Sheets" color="#00F5A0" />}
          </div>
        </div>
      )}

      {loading && (
        <div style={{
          textAlign: 'center', padding: 'var(--space-lg)',
          color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)',
        }}>
          Loading season stats...
        </div>
      )}
    </div>
  );
}