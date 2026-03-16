import React from 'react';

export default function SeasonSelector({ seasons = [], selectedSeason, onChange }) {
  return (
    <select
      value={selectedSeason || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-sm) var(--space-md)',
        fontSize: 'var(--fs-sm)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
      }}
    >
      {seasons.map((s) => (
        <option key={s.id} value={s.id}>{s.name || s.label || `${s.start_year}/${s.end_year}`}</option>
      ))}
    </select>
  );
}
