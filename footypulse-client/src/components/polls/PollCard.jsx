import React from 'react';

export default function PollCard({ poll, onVote }) {
  if (!poll) return null;
  const totalVotes = (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);

  return (
    <div style={{
      background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
    }}>
      <h4 style={{ fontSize: 'var(--fs-base)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>{poll.question}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {(poll.options || []).map((option, i) => {
          const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          return (
            <button
              key={i}
              onClick={() => onVote?.(poll.id, option.id || i)}
              style={{
                position: 'relative', padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', textAlign: 'left', overflow: 'hidden',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${percent}%`, background: 'var(--accent-primary-dim)',
                transition: 'width 0.5s ease', borderRadius: 'var(--radius-md)',
              }} />
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>{option.text || option.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{percent}%</span>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', textAlign: 'right' }}>
        {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
