// ============================================
// src/pages/PollDetailPage.jsx
// WHERE: Add to src/pages/
// ROUTE: /polls/:id
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pollsApi } from '../api/pollsApi';
import PollResults from '../components/polls/PollResults';
import Loader from '../components/common/Loader';
import {
  BarChart3, ArrowLeft, Clock, Lock, CheckCircle,
  Users, Calendar, Tag, Share2
} from 'lucide-react';

function getOrCreateUserId() {
  let userId = localStorage.getItem('footypulse_user_id');
  if (!userId) {
    userId = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('footypulse_user_id', userId);
  }
  return userId;
}

export default function PollDetailPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userSelection, setUserSelection] = useState(null);
  const [voting, setVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const userId = getOrCreateUserId();

  // Fetch poll and vote status
  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pollRes, voteRes] = await Promise.all([
          pollsApi.getById(id),
          pollsApi.getUserVote(id, userId).catch(() => ({ data: { has_voted: false } })),
        ]);

        setPoll(pollRes.data);

        if (voteRes.data?.has_voted && voteRes.data.vote) {
          setHasVoted(true);
          const selected = voteRes.data.vote.selected_options;
          setUserSelection(Array.isArray(selected) ? selected : JSON.parse(selected || '[]'));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load poll');
      }
      setLoading(false);
    };
    fetchPoll();
  }, [id, userId]);

  // Handle vote
  const handleVote = useCallback(async (optionId) => {
    if (!poll || poll.status !== 'active' || hasVoted || voting) return;
    setVoting(true);
    setSelectedOption(optionId);
    try {
      const res = await pollsApi.vote(poll.poll_id, {
        user_id: userId,
        selected_options: [optionId],
      });

      setHasVoted(true);
      setUserSelection([optionId]);

      // Update poll with fresh data
      if (res.data?.poll) {
        setPoll(prev => ({ ...prev, ...res.data.poll }));
      }
      showToast('Vote recorded! Thanks for participating.');
    } catch (err) {
      setSelectedOption(null);
      const msg = err.response?.data?.message || 'Failed to vote. Please try again.';
      showToast(msg, true);
    }
    setVoting(false);
  }, [poll, hasVoted, voting, userId]);

  const showToast = (message, isError = false) => {
    setToastMsg({ message, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll?.question || 'FootyPulse Poll',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="page"><div className="container"><Loader text="Loading poll..." /></div></div>;

  if (error || !poll) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
          <BarChart3 size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }} />
          <h2 style={{ marginBottom: 'var(--space-sm)' }}>Poll Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
            {error || 'This poll may have been removed or does not exist.'}
          </p>
          <Link to="/polls" className="btn btn-primary">Back to Polls</Link>
        </div>
      </div>
    );
  }

  const options = poll.options || [];
  const totalVotes = poll.total_votes || options.reduce((sum, o) => sum + (o.votes || 0), 0);
  const isActive = poll.status === 'active';
  const showResults = hasVoted || poll.status === 'closed';

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        {/* Breadcrumb */}
        <Link to="/polls" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)',
          textDecoration: 'none', marginBottom: 'var(--space-lg)',
          transition: 'color var(--transition-fast)',
        }}>
          <ArrowLeft size={16} /> Back to Polls
        </Link>

        {/* Poll Header Card */}
        <div style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-lg)',
        }}>
          {/* Status & Meta Row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 'var(--fs-sm)', fontWeight: 600,
              color: isActive ? 'var(--accent-success)' : 'var(--text-tertiary)',
              background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
              padding: '4px 12px', borderRadius: 'var(--radius-full, 50px)',
            }}>
              {isActive ? <Clock size={14} /> : <Lock size={14} />}
              {isActive ? 'Active' : 'Closed'}
            </div>

            <button onClick={handleShare} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 'var(--fs-sm)',
            }}>
              <Share2 size={16} /> Share
            </button>
          </div>

          {/* Question */}
          <h1 style={{
            fontSize: 'var(--fs-xl, 1.5rem)', fontWeight: 800,
            lineHeight: 1.3, marginBottom: 'var(--space-sm)',
          }}>
            {poll.question}
          </h1>

          {poll.description && (
            <p style={{
              fontSize: 'var(--fs-base)', color: 'var(--text-secondary)',
              lineHeight: 1.6, marginBottom: 'var(--space-md)',
            }}>
              {poll.description}
            </p>
          )}

          {/* Meta info */}
          <div style={{
            display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap',
            fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Tag size={12} /> {poll.poll_type || 'single'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={12} /> {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            </span>
            {poll.start_date && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} /> Started {new Date(poll.start_date).toLocaleDateString()}
              </span>
            )}
            {poll.end_date && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {poll.status === 'closed' ? 'Ended' : 'Ends'} {new Date(poll.end_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Voting / Results Section */}
        {showResults ? (
          <PollResults poll={poll} userSelection={userSelection} />
        ) : (
          <div style={{
            background: 'var(--gradient-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
          }}>
            <h3 style={{
              fontSize: 'var(--fs-base)', fontWeight: 700,
              marginBottom: 'var(--space-lg)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <BarChart3 size={18} style={{ color: 'var(--accent-secondary)' }} />
              Cast your vote
              {poll.poll_type === 'single' && (
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                  — choose one
                </span>
              )}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {options.map((option, i) => {
                const optionId = option.id !== undefined ? option.id : i;
                const isCurrentlyVoting = voting && selectedOption === optionId;

                return (
                  <button
                    key={i}
                    onClick={() => handleVote(optionId)}
                    disabled={voting}
                    style={{
                      padding: 'var(--space-md) var(--space-lg)',
                      background: 'var(--bg-secondary)',
                      border: '2px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: voting ? 'wait' : 'pointer',
                      opacity: voting && !isCurrentlyVoting ? 0.5 : 1,
                      transition: 'all var(--transition-fast)',
                      fontSize: 'var(--fs-base)',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                    }}
                    onMouseEnter={(e) => {
                      if (!voting) {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        e.currentTarget.style.background = 'var(--accent-primary-dim, rgba(99,102,241,0.1))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                  >
                    {/* Radio-style indicator */}
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: '2px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isCurrentlyVoting && (
                        <span style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: 'var(--accent-primary)',
                          animation: 'pulse 0.6s ease-in-out infinite alternate',
                        }} />
                      )}
                    </span>
                    {option.text || option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Voted confirmation banner */}
        {hasVoted && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--fs-sm)', color: 'var(--accent-success)',
            fontWeight: 500,
          }}>
            <CheckCircle size={16} />
            You have voted on this poll
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          padding: 'var(--space-sm) var(--space-lg)',
          background: toastMsg.isError ? 'var(--accent-danger, #ef4444)' : 'var(--accent-success, #10b981)',
          color: '#fff', borderRadius: 'var(--radius-md)',
          fontSize: 'var(--fs-sm)', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 9999, animation: 'slideUp 0.3s ease-out',
        }}>
          {toastMsg.message}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes pulse {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}