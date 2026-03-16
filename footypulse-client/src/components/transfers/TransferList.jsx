import React from 'react';
import TransferCard from './TransferCard';
import Loader from '../common/Loader';

export default function TransferList({ transfers = [], loading }) {
  if (loading) return <Loader text="Loading transfers..." />;
  if (!transfers.length) return <p style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-secondary)' }}>No transfers found</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-md)' }}>
      {transfers.map((t, i) => <TransferCard key={t.id || i} transfer={t} />)}
    </div>
  );
}
