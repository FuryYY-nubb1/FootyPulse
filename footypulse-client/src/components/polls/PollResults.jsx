// ============================================
// src/components/polls/PollResults.jsx
// ============================================

import React from 'react';
import { Trophy, Users } from 'lucide-react';

export default function PollResults({ poll, userSelection }) {
  if (!poll) return null;

  const options = poll.options || [];
  const totalVotes = poll.total_votes || options.reduce((sum, o) => sum + (o.votes || 0), 0);

  // Find the winning option(s)
  const maxVotes = Math.max(...options.map(o => o.votes || 0));

  // Color palette for option bars
  const barColors = [
    'var(--accent-primary, #6366f1)',
    'var(--accent-secondary, #f59e0b)',
    'var(--accent-success, #10b981)',
    'var(--accent-danger, #ef4444)',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#ec4899',
  ];

  return (
    <div style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
    }}>
      <h4 style={{
        fontSize: 'var(--fs-lg)', fontWeight: 700,
        marginBottom: 'var(--space-xs)', lineHeight: 1.4,
      }}>
        {poll.question}
      </h4>

      {poll.description && (
        <p style={{
          fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)',
          marginBottom: 'var(--space-lg)', lineHeight: 1.5,
        }}>
          {poll.description}
        </p>
      )}

      {/* Results bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {options.map((option, i) => {
          const optionId = option.id !== undefined ? option.id : i;
          const optionVotes = option.votes || 0;
          const percent = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
          const isWinner = optionVotes === maxVotes && maxVotes > 0;
          const isUserPick = userSelection?.includes(optionId);
          const barColor = barColors[i % barColors.length];

          return (
            <div key={i}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 6,
              }}>
                <span style={{
                  fontSize: 'var(--fs-sm)', fontWeight: isWinner ? 700 : 500,
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'var(--text-primary)',
                }}>
                  {isWinner && <Trophy size={14} style={{ color: 'var(--accent-secondary)' }} />}
                  {option.text || option.label}
                  {isUserPick && (
                    <span style={{
                      fontSize: 'var(--fs-xs)', color: 'var(--accent-primary)',
                      fontWeight: 600, marginLeft: 4,
                    }}>
                      (Your vote)
                    </span>
                  )}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)',
                    fontWeight: 700, color: 'var(--text-primary)',
                  }}>
                    {percent}%
                  </span>
                  <span style={{
                    fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)',
                    minWidth: 50, textAlign: 'right',
                  }}>
                    {optionVotes} vote{optionVotes !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                height: 10, background: 'var(--bg-secondary)',
                borderRadius: 5, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${percent}%`,
                  background: barColor,
                  borderRadius: 5,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total votes footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <span style={{
          fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Users size={14} />
          {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
        </span>

        {poll.end_date && (
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {poll.status === 'closed' ? 'Ended' : 'Ends'}{' '}
            {new Date(poll.end_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}