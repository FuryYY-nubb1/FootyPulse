// ============================================
// src/components/polls/PollCard.jsx
// ============================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle, Clock, Lock, Users } from 'lucide-react';

export default function PollCard({ poll, onVote, hasVoted, userSelection }) {
  const [voting, setVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  if (!poll) return null;

  const options = poll.options || [];
  const totalVotes = poll.total_votes || options.reduce((sum, o) => sum + (o.votes || 0), 0);
  const isActive = poll.status === 'active';
  const isClosed = poll.status === 'closed';
  const showResults = hasVoted || isClosed;

  const handleVote = async (optionIdx) => {
    if (!isActive || hasVoted || voting) return;
    setVoting(true);
    setSelectedOption(optionIdx);
    try {
      await onVote?.(poll.poll_id, optionIdx);
    } catch (err) {
      setSelectedOption(null);
      console.error('Vote failed:', err);
    }
    setVoting(false);
  };

  const getTypeLabel = () => {
    switch (poll.poll_type) {
      case 'prediction': return 'Prediction';
      case 'multiple': return 'Multiple Choice';
      case 'rating': return 'Rating';
      default: return 'Poll';
    }
  };

  return (
    <div className="card" style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      transition: 'all var(--transition-fast)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: isActive ? 'var(--accent-success)' : 'var(--text-tertiary)',
        }}>
          {isActive ? <Clock size={12} /> : <Lock size={12} />}
          {isActive ? 'Active' : 'Closed'}
        </div>
        <span style={{
          fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)',
          background: 'var(--bg-secondary)', padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
        }}>
          {getTypeLabel()}
        </span>
      </div>

      {/* Question */}
      <Link to={`/polls/${poll.poll_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h4 style={{
          fontSize: 'var(--fs-base)', fontWeight: 700,
          lineHeight: 1.4, cursor: 'pointer',
        }}>
          {poll.question}
        </h4>
      </Link>

      {/* Description */}
      {poll.description && (
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {poll.description.length > 100 ? `${poll.description.slice(0, 100)}...` : poll.description}
        </p>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {options.map((option, i) => {
          const optionId = option.id !== undefined ? option.id : i;
          const optionVotes = option.votes || 0;
          const percent = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
          const isSelected = hasVoted && userSelection?.includes(optionId);
          const isCurrentlyVoting = voting && selectedOption === optionId;

          return (
            <button
              key={i}
              onClick={() => handleVote(optionId)}
              disabled={!isActive || hasVoted || voting}
              style={{
                position: 'relative',
                padding: 'var(--space-sm) var(--space-md)',
                background: isSelected ? 'var(--accent-primary-dim)' : 'var(--bg-secondary)',
                border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
                overflow: 'hidden',
                cursor: isActive && !hasVoted && !voting ? 'pointer' : 'default',
                opacity: voting && !isCurrentlyVoting ? 0.6 : 1,
                transition: 'all var(--transition-fast)',
              }}
            >
              {/* Progress bar background */}
              {showResults && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${percent}%`,
                  background: isSelected
                    ? 'rgba(var(--accent-primary-rgb, 99, 102, 241), 0.2)'
                    : 'rgba(255,255,255,0.05)',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: 'var(--radius-md)',
                }} />
              )}

              <div style={{
                position: 'relative', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{
                  fontSize: 'var(--fs-sm)', fontWeight: isSelected ? 600 : 500,
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'var(--text-primary)',
                }}>
                  {isSelected && <CheckCircle size={14} style={{ color: 'var(--accent-primary)' }} />}
                  {isCurrentlyVoting && (
                    <span style={{
                      width: 14, height: 14, border: '2px solid var(--accent-primary)',
                      borderTopColor: 'transparent', borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite', display: 'inline-block',
                    }} />
                  )}
                  {option.text || option.label}
                </span>

                {showResults && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)',
                    fontWeight: 600, color: 'var(--text-secondary)',
                  }}>
                    {percent}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 'var(--space-xs)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <span style={{
          fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Users size={12} />
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </span>

        {poll.end_date && (
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {isClosed ? 'Ended' : 'Ends'} {new Date(poll.end_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Inline spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}