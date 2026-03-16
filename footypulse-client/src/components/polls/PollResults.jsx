import React from 'react';

export default function PollResults({ poll }) {
  if (!poll) return null;
  const totalVotes = (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);

  return (
    <div style={{
      background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
    }}>
      <h4 style={{ fontSize: 'var(--fs-base)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>{poll.question}</h4>
      {(poll.options || []).map((option, i) => {
        const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
        return (
          <div key={i} style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)', marginBottom: 4 }}>
              <span>{option.text || option.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{percent}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percent}%`, background: 'var(--gradient-accent)', borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', textAlign: 'right' }}>{totalVotes} total votes</div>
    </div>
  );
}
