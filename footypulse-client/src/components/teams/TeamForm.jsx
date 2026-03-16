import React from 'react';

export default function TeamForm({ form = [] }) {
  const colors = { W: 'var(--win)', D: 'var(--draw)', L: 'var(--loss)' };
  const bgs = { W: 'rgba(0,245,160,0.15)', D: 'rgba(255,217,61,0.15)', L: 'rgba(255,71,87,0.15)' };

  return (
    <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginRight: 'var(--space-sm)' }}>Form</span>
      {form.slice(-5).map((result, i) => {
        const r = (result || '').toUpperCase();
        return (
          <div key={i} style={{
            width: 26, height: 26, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--fs-xs)', fontWeight: 700,
            background: bgs[r] || 'var(--bg-tertiary)',
            color: colors[r] || 'var(--text-secondary)',
          }}>
            {r}
          </div>
        );
      })}
    </div>
  );
}
