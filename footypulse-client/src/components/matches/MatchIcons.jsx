// ============================================
// src/components/matches/MatchIcons.jsx
// ============================================
// Pixel-perfect SVG icons matching SofaScore style.
// Every icon is flat, bold, and unmistakable at small sizes.
// ============================================

import React from 'react';

// ── GOAL (simple modern: white circle, dark outline, inner net pattern) ──
export function GoalIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13.5" fill="#f0f0f0" stroke="#444" strokeWidth="2"/>
      <circle cx="16" cy="16" r="5.5" fill="none" stroke="#444" strokeWidth="1.5"/>
      <line x1="16" y1="2.5" x2="16" y2="10.5" stroke="#444" strokeWidth="1.3"/>
      <line x1="16" y1="21.5" x2="16" y2="29.5" stroke="#444" strokeWidth="1.3"/>
      <line x1="2.5" y1="16" x2="10.5" y2="16" stroke="#444" strokeWidth="1.3"/>
      <line x1="21.5" y1="16" x2="29.5" y2="16" stroke="#444" strokeWidth="1.3"/>
      <line x1="6" y1="6" x2="12" y2="12" stroke="#444" strokeWidth="1" opacity="0.5"/>
      <line x1="26" y1="6" x2="20" y2="12" stroke="#444" strokeWidth="1" opacity="0.5"/>
      <line x1="6" y1="26" x2="12" y2="20" stroke="#444" strokeWidth="1" opacity="0.5"/>
      <line x1="26" y1="26" x2="20" y2="20" stroke="#444" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

// ── OWN GOAL (same modern style but red) ──
export function OwnGoalIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13.5" fill="#e74c3c" stroke="#a93226" strokeWidth="2"/>
      <circle cx="16" cy="16" r="5.5" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.5"/>
      <line x1="16" y1="2.5" x2="16" y2="10.5" stroke="#fff" strokeWidth="1.3" opacity="0.4"/>
      <line x1="16" y1="21.5" x2="16" y2="29.5" stroke="#fff" strokeWidth="1.3" opacity="0.4"/>
      <line x1="2.5" y1="16" x2="10.5" y2="16" stroke="#fff" strokeWidth="1.3" opacity="0.4"/>
      <line x1="21.5" y1="16" x2="29.5" y2="16" stroke="#fff" strokeWidth="1.3" opacity="0.4"/>
      <line x1="6" y1="6" x2="12" y2="12" stroke="#fff" strokeWidth="1" opacity="0.25"/>
      <line x1="26" y1="6" x2="20" y2="12" stroke="#fff" strokeWidth="1" opacity="0.25"/>
      <line x1="6" y1="26" x2="12" y2="20" stroke="#fff" strokeWidth="1" opacity="0.25"/>
      <line x1="26" y1="26" x2="20" y2="20" stroke="#fff" strokeWidth="1" opacity="0.25"/>
    </svg>
  );
}

// ── PENALTY SCORED (green rounded rect with white goalposts + ball) ──
export function PenaltyGoalIcon({ size = 20 }) {
  const w = size * 1.3;
  return (
    <svg width={w} height={size} viewBox="0 0 40 28">
      <rect x="1" y="1" width="38" height="26" rx="4" fill="#27ae60"/>
      {/* Goalposts */}
      <rect x="6" y="5" width="2" height="18" rx="1" fill="#fff"/>
      <rect x="6" y="5" width="16" height="2" rx="1" fill="#fff"/>
      <rect x="20" y="5" width="2" height="18" rx="1" fill="#fff"/>
      {/* Ball */}
      <circle cx="29" cy="14" r="5" fill="#fff" stroke="#999" strokeWidth="0.5"/>
      <circle cx="29" cy="14" r="2" fill="#666"/>
    </svg>
  );
}

// ── PENALTY MISSED (red rounded rect with goalposts + X) ──
export function PenaltyMissIcon({ size = 20 }) {
  const w = size * 1.3;
  return (
    <svg width={w} height={size} viewBox="0 0 40 28">
      <rect x="1" y="1" width="38" height="26" rx="4" fill="#e74c3c"/>
      {/* Goalposts */}
      <rect x="6" y="5" width="2" height="18" rx="1" fill="#fff"/>
      <rect x="6" y="5" width="16" height="2" rx="1" fill="#fff"/>
      <rect x="20" y="5" width="2" height="18" rx="1" fill="#fff"/>
      {/* X mark */}
      <line x1="25" y1="9" x2="33" y2="19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="33" y1="9" x2="25" y2="19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── ASSIST (boot/cleat - simple flat shoe shape) ──
export function AssistIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      {/* Boot body */}
      <path d="M6 22 L6 14 L10 10 L14 10 L16 8 L18 10 L22 10 L26 12 L28 16 L28 20 L26 22 Z"
        fill="#e8e8e8" stroke="#888" strokeWidth="1.2" strokeLinejoin="round"/>
      {/* Studs */}
      <rect x="8" y="22" width="3" height="3" rx="0.5" fill="#888"/>
      <rect x="13" y="22" width="3" height="3" rx="0.5" fill="#888"/>
      <rect x="18" y="22" width="3" height="3" rx="0.5" fill="#888"/>
      <rect x="23" y="22" width="3" height="3" rx="0.5" fill="#888"/>
      {/* Laces */}
      <line x1="13" y1="11" x2="13" y2="14" stroke="#aaa" strokeWidth="0.8"/>
      <line x1="16" y1="10" x2="16" y2="13" stroke="#aaa" strokeWidth="0.8"/>
    </svg>
  );
}

// ── YELLOW CARD ──
export function YellowCardIcon({ size = 20 }) {
  const w = Math.round(size * 0.65);
  const h = Math.round(size * 0.9);
  return (
    <svg width={w} height={h} viewBox="0 0 18 26">
      <rect x="1" y="1" width="16" height="24" rx="2" fill="#f1c40f" stroke="#d4ac0d" strokeWidth="0.8"/>
    </svg>
  );
}

// ── RED CARD ──
export function RedCardIcon({ size = 20 }) {
  const w = Math.round(size * 0.65);
  const h = Math.round(size * 0.9);
  return (
    <svg width={w} height={h} viewBox="0 0 18 26">
      <rect x="1" y="1" width="16" height="24" rx="2" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.8"/>
    </svg>
  );
}

// ── SECOND YELLOW (yellow card overlapped by red card) ──
export function SecondYellowIcon({ size = 20 }) {
  const w = Math.round(size * 0.85);
  const h = Math.round(size * 0.9);
  return (
    <svg width={w} height={h} viewBox="0 0 24 26">
      {/* Yellow behind */}
      <rect x="1" y="2" width="14" height="22" rx="2" fill="#f1c40f" stroke="#d4ac0d" strokeWidth="0.7"/>
      {/* Red in front, overlapping */}
      <rect x="8" y="1" width="14" height="22" rx="2" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.7"/>
    </svg>
  );
}

// ── SUBSTITUTION (green arrow in ↔ red arrow out) ──
export function SubstitutionIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      {/* Green arrow pointing right (sub in) */}
      <line x1="4" y1="10" x2="20" y2="10" stroke="#2ecc71" strokeWidth="3" strokeLinecap="round"/>
      <polyline points="16,5 22,10 16,15" fill="none" stroke="#2ecc71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Red arrow pointing left (sub out) */}
      <line x1="28" y1="22" x2="12" y2="22" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round"/>
      <polyline points="16,17 10,22 16,27" fill="none" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── SUB IN (green right-pointing arrow) ──
export function SubInIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <polygon points="2,1 14,8 2,15" fill="#2ecc71"/>
    </svg>
  );
}

// ── SUB OUT (red left-pointing arrow) ──
export function SubOutIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <polygon points="14,1 2,8 14,15" fill="#e74c3c"/>
    </svg>
  );
}

// ── INJURY (red cross / plus) ──
export function InjuryIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect x="11" y="4" width="10" height="24" rx="2" fill="#e74c3c"/>
      <rect x="4" y="11" width="24" height="10" rx="2" fill="#e74c3c"/>
    </svg>
  );
}

// ── KICK OFF (clock icon) ──
export function KickOffIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" stroke="#ccc" strokeWidth="2.5"/>
      <circle cx="16" cy="16" r="1.5" fill="#ccc"/>
      <line x1="16" y1="16" x2="16" y2="8" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="16" y1="16" x2="22" y2="20" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── VAR (dark rounded box with white "VAR" text) ──
export function VarIcon({ size = 20 }) {
  const w = Math.round(size * 1.5);
  return (
    <svg width={w} height={size} viewBox="0 0 42 26">
      <rect x="1" y="1" width="40" height="24" rx="4" fill="#2c3e50" stroke="#445" strokeWidth="0.8"/>
      <text x="21" y="17.5" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="1">VAR</text>
    </svg>
  );
}


// ═══════════════════════════════════════════
// ICON RESOLVER — maps event_type → component
// ═══════════════════════════════════════════
export function EventIcon({ type, size = 20 }) {
  switch (type) {
    case 'goal':          return <GoalIcon size={size} />;
    case 'own_goal':      return <OwnGoalIcon size={size} />;
    case 'penalty':       return <PenaltyGoalIcon size={size} />;
    case 'penalty_miss':  return <PenaltyMissIcon size={size} />;
    case 'yellow':        return <YellowCardIcon size={size} />;
    case 'red':           return <RedCardIcon size={size} />;
    case 'second_yellow': return <SecondYellowIcon size={size} />;
    case 'sub':           return <SubstitutionIcon size={size} />;
    case 'var':           return <VarIcon size={size} />;
    case 'injury':        return <InjuryIcon size={size} />;
    case 'kick_off':      return <KickOffIcon size={size} />;
    default:              return <GoalIcon size={size} />;
  }
}

// ═══════════════════════════════════════════
// ICON LEGEND (2-column grid)
// ═══════════════════════════════════════════
export function EventIconLegend() {
  const items = [
    { type: 'goal', label: 'Goal' },
    { type: 'penalty', label: 'Penalty scored' },
    { type: 'own_goal', label: 'Own goal' },
    { type: 'penalty_miss', label: 'Penalty missed' },
    { type: 'sub', label: 'Substitution' },
    { type: 'yellow', label: 'Yellow card' },
    { type: 'second_yellow', label: 'Second yellow' },
    { type: 'red', label: 'Red card' },
    { type: 'injury', label: 'Injury' },
    { type: 'var', label: 'VAR' },
    { type: 'kick_off', label: 'Kick Off' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px 40px',
      padding: 'var(--space-lg) var(--space-xl)',
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      marginTop: 'var(--space-lg)',
    }}>
      {items.map(item => (
        <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <EventIcon type={item.type} size={22} />
          </div>
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}