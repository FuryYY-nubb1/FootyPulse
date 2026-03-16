import React from 'react';
import Badge from '../common/Badge';

export default function TransferRumors({ rumors = [] }) {
  if (!rumors.length) return null;

  return (
    <div>
      <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Transfer Rumors</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {rumors.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-md) var(--space-lg)',
            background: 'var(--bg-card)', border: '1px dashed var(--border-default)',
            borderRadius: 'var(--radius-md)',
          }}>
            <Badge variant="warning">Rumor</Badge>
            <span style={{ flex: 1, fontSize: 'var(--fs-sm)' }}>{r.player_name} → {r.to_team_name}</span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{r.source || ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
