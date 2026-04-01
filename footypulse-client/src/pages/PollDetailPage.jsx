// ============================================
// src/pages/PollDetailPage.jsx
// WHERE: Replace src/pages/PollDetailPage.jsx
// ROUTE: /polls/:id
// ============================================
// UPDATED: Uses authenticated user (useAuth) instead of anonymous ID.
//          Shows "Login to vote" when not authenticated.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pollsApi } from '../api/pollsApi';
import { useAuth } from '../context/AuthContext';
import PollResults from '../components/polls/PollResults';
import Loader from '../components/common/Loader';
import {
  BarChart3, ArrowLeft, Clock, Lock, CheckCircle,
  Users, Calendar, Tag, Share2, LogIn
} from 'lucide-react';

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

  // Use authenticated user instead of anonymous ID
  const { user, isAuthenticated } = useAuth();
  const userId = user ? String(user.user_id) : null;

  // Fetch poll and vote status
  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      setError(null);
      try {
        const pollRes = await pollsApi.getById(id);
        setPoll(pollRes.data);

        // Check vote status only if logged in
        if (userId) {
          try {
            const voteRes = await pollsApi.getUserVote(id, userId);
            if (voteRes.data?.has_voted && voteRes.data.vote) {
              setHasVoted(true);
              const selected = voteRes.data.vote.selected_options;
              setUserSelection(Array.isArray(selected) ? selected : JSON.parse(selected || '[]'));
            }
          } catch {
            // Not voted — fine
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load poll');
      }
      setLoading(false);
    };
    fetchPoll();
  }, [id, userId]);

  // Handle vote (requires authentication)
  const handleVote = useCallback(async (optionId) => {
    if (!isAuthenticated) {
      showToast('Please log in to vote.', true);
      return;
    }
    if (!poll || poll.status !== 'active' || hasVoted || voting) return;
    setVoting(true);
    setSelectedOption(optionId);
    try {
      const res = await pollsApi.vote(poll.poll_id, {
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
      const msg = err.message || 'Failed to vote. Please try again.';
      showToast(msg, true);
    }
    setVoting(false);
  }, [poll, hasVoted, voting, isAuthenticated]);

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
              background: isActive ? 'rgba(46, 213, 115, 0.1)' : 'var(--bg-secondary)',
              padding: '4px 12px', borderRadius: 'var(--radius-full)',
            }}>
              {isActive ? <Clock size={14} /> : <Lock size={14} />}
              {isActive ? 'Active' : 'Closed'}
            </div>

            <button onClick={handleShare} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', fontSize: 'var(--fs-xs)',
              color: 'var(--text-secondary)', background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}>
              <Share2 size={14} /> Share
            </button>
          </div>

          {/* Question */}
          <h1 style={{
            fontSize: 'var(--fs-xl)', fontWeight: 800, lineHeight: 1.3,
            marginBottom: 'var(--space-sm)',
          }}>
            {poll.question}
          </h1>

          {/* Description */}
          {poll.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-base)', lineHeight: 1.6 }}>
              {poll.description}
            </p>
          )}

          {/* Meta info */}
          <div style={{
            display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-md)',
            flexWrap: 'wrap',
          }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)',
            }}>
              <Users size={14} /> {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            </span>
            {poll.end_date && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)',
              }}>
                <Calendar size={14} />
                {poll.status === 'closed' ? 'Ended' : 'Ends'} {new Date(poll.end_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Login prompt for unauthenticated users */}
        {!isAuthenticated && isActive && !showResults && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-md) var(--space-lg)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
          }}>
            <LogIn size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              {' '}or{' '}
              <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>create an account</Link>
              {' '}to cast your vote.
            </span>
          </div>
        )}

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
                const canVote = isAuthenticated && isActive && !hasVoted && !voting;

                return (
                  <button
                    key={i}
                    onClick={() => handleVote(optionId)}
                    disabled={!canVote}
                    style={{
                      padding: 'var(--space-md) var(--space-lg)',
                      background: 'var(--bg-secondary)',
                      border: '2px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: canVote ? 'pointer' : 'default',
                      opacity: (voting && !isCurrentlyVoting) || !isAuthenticated ? 0.6 : 1,
                      transition: 'all var(--transition-fast)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--fs-base)',
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => { if (canVote) e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isCurrentlyVoting && (
                        <span style={{
                          width: 16, height: 16, border: '2px solid var(--accent-primary)',
                          borderTopColor: 'transparent', borderRadius: '50%',
                          animation: 'spin 0.6s linear infinite', display: 'inline-block',
                        }} />
                      )}
                      {option.text || option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMsg && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            padding: 'var(--space-sm) var(--space-lg)',
            background: toastMsg.isError ? 'var(--live)' : 'var(--accent-success)',
            color: '#fff', borderRadius: 'var(--radius-md)',
            fontSize: 'var(--fs-sm)', fontWeight: 600,
            zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            {toastMsg.message}
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}