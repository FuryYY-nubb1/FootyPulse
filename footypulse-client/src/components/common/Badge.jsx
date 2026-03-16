import React from 'react';

const variants = {
  default: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
  accent: { bg: 'var(--accent-primary-dim)', color: 'var(--accent-primary)' },
  live: { bg: 'rgba(255,71,87,0.15)', color: 'var(--live)' },
  success: { bg: 'rgba(0,245,160,0.15)', color: 'var(--win)' },
  warning: { bg: 'rgba(255,217,61,0.15)', color: 'var(--draw)' },
  info: { bg: 'var(--accent-secondary-dim)', color: 'var(--accent-secondary)' },
};

export default function Badge({ children, variant = 'default', style: customStyle = {} }) {
  const v = variants[variant] || variants.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px',
      fontSize: 'var(--fs-xs)',
      fontWeight: 600,
      borderRadius: 'var(--radius-full)',
      background: v.bg,
      color: v.color,
      letterSpacing: '0.02em',
      ...customStyle,
    }}>
      {children}
    </span>
  );
}
