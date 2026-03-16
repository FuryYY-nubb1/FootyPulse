import React from 'react';
import { formatTransferFee } from '../../utils/formatScore';
import { formatDate } from '../../utils/formatDate';

export default function PlayerTransferHistory({ transfers = [] }) {
  if (!transfers.length) return <p style={{ color: 'var(--text-tertiary)' }}>No transfer history</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {transfers.map((t, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
          padding: 'var(--space-md) var(--space-lg)',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              {t.from_team_name || '?'} → {t.to_team_name || '?'}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{t.transfer_type || ''}</div>
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
