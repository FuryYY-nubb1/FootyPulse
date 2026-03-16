import React from 'react';
import PollCard from './PollCard';

export default function PollWidget({ polls = [], onVote }) {
  if (!polls.length) return null;

  return (
    <div>
      <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Polls</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {polls.map((p) => <PollCard key={p.id} poll={p} onVote={onVote} />)}
      </div>
    </div>
  );
}
