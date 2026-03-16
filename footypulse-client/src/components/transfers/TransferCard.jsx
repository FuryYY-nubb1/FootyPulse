import React from 'react';
import { formatTransferFee } from '../../utils/formatScore';
import { formatDate } from '../../utils/formatDate';

export default function TransferCard({ transfer }) {
  return (
    <div style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      transition: 'all var(--transition-base)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
        }}>
          {transfer.player_photo ? <img src={transfer.player_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-full)' }} /> : '👤'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>{transfer.player_name || transfer.person_name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{transfer.position || ''}</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--fs-md)',
          background: 'var(--accent-primary-dim)', color: 'var(--accent-primary)',
          padding: '4px 12px', borderRadius: 'var(--radius-full)',
        }}>
          {formatTransferFee(transfer.fee)}
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-md)', background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>From</div>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>{transfer.from_team_name || '—'}</div>
        </div>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>→</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>To</div>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>{transfer.to_team_name || '—'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-md)', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
        <span>{transfer.transfer_type || 'Permanent'}</span>
        <span>{formatDate(transfer.date, 'short')}</span>
      </div>
    </div>
  );
}
