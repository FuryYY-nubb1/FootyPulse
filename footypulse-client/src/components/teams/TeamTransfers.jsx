import React from 'react';
import { formatTransferFee } from '../../utils/formatScore';
import { formatDate } from '../../utils/formatDate';

export default function TeamTransfers({ transfers = [] }) {
  if (!transfers.length) return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No transfers found</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {transfers.map((t, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
          padding: 'var(--space-md) var(--space-lg)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{t.player_name || t.person_name}</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
              {t.from_team_name || 'Unknown'} → {t.to_team_name || 'Unknown'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--accent-primary)' }}>
              {formatTransferFee(t.fee)}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{formatDate(t.date, 'short')}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
