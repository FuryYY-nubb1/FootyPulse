// ============================================
// src/pages/PollsPage.jsx
// WHERE: Replace src/pages/PollsPage.jsx
// ROUTE: /polls
// ============================================
// UPDATED: Uses authenticated user (useAuth) instead of anonymous ID.
//          Shows "Login to vote" message for unauthenticated users.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { pollsApi } from '../api/pollsApi';
import { useAuth } from '../context/AuthContext';
import PollCard from '../components/polls/PollCard';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { BarChart3, Filter, LogIn } from 'lucide-react';

export default function PollsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [polls, setPolls] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedPolls, setVotedPolls] = useState({});   // { pollId: [selectedOptions] }
  const [toastMsg, setToastMsg] = useState(null);

  const page = parseInt(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || '';

  // Use authenticated user instead of anonymous ID
  const { user, isAuthenticated } = useAuth();
  const userId = user ? String(user.user_id) : null;

  // Fetch polls
  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (status) params.status = status;
        const res = await pollsApi.getAll(params);
        setPolls(res.data || []);
        setPagination(res.pagination);

        // Check vote status for each poll (only if logged in)
        if (userId) {
          const pollList = res.data || [];
          const voteChecks = {};
          await Promise.all(
            pollList.map(async (p) => {
              try {
                const voteRes = await pollsApi.getUserVote(p.poll_id, userId);
                if (voteRes.data?.has_voted && voteRes.data.vote) {
                  const selected = voteRes.data.vote.selected_options;
                  voteChecks[p.poll_id] = Array.isArray(selected) ?
                    selected : JSON.parse(selected || '[]');
                }
              } catch {
                // User hasn't voted — that's fine
              }
            })
          );
          setVotedPolls(voteChecks);
        }
      } catch (err) {
        console.error('Failed to load polls:', err);
      }
      setLoading(false);
    };
    fetchPolls();
  }, [page, status, userId]);

  // Handle vote (requires authentication — token is sent via axios interceptor)
  const handleVote = useCallback(async (pollId, optionId) => {
    if (!isAuthenticated) {
      showToast('Please log in to vote.', true);
      return;
    }
    try {
      const res = await pollsApi.vote(pollId, {
        selected_options: [optionId],
      });

      // Update voted state
      setVotedPolls(prev => ({ ...prev, [pollId]: [optionId] }));

      // Update the poll in the list with fresh data
      if (res.data?.poll) {
        setPolls(prev => prev.map(p =>
          p.poll_id === pollId ? { ...p, ...res.data.poll } : p
        ));
      }

      showToast('Vote recorded! Thanks for participating.');
    } catch (err) {
      const msg = err.message || 'Failed to vote. Please try again.';
      showToast(msg, true);
      throw err; // Re-throw so PollCard can handle UI state
    }
  }, [isAuthenticated]);

  const showToast = (message, isError = false) => {
    setToastMsg({ message, isError });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  return (
    <div className="page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title" style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
          }}>
            <BarChart3 size={28} style={{ color: 'var(--accent-secondary)' }} />
            Polls
          </h1>
          <p className="page-subtitle">
            Have your say — vote on the biggest questions in football
          </p>
        </div>

        {/* Login prompt for unauthenticated users */}
        {!isAuthenticated && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-md) var(--space-lg)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-xl)',
          }}>
            <LogIn size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              {' '}or{' '}
              <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>create an account</Link>
              {' '}to vote on polls.
            </span>
          </div>
        )}

        {/* Status Filters */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 'var(--space-xs)', marginBottom: 'var(--space-xl)',
          flexWrap: 'wrap',
        }}>
          <Filter size={16} style={{ color: 'var(--text-tertiary)', marginRight: 4 }} />
          {[
            { value: '', label: 'All Polls' },
            { value: 'active', label: 'Active' },
            { value: 'closed', label: 'Closed' },
          ].map((f) => (
            <button
              key={f.value}
              className={`btn ${status === f.value ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter('status', f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <Loader text="Loading polls..." />
        ) : polls.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
            <BarChart3 size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }} />
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>No polls found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {status ? `No ${status} polls at the moment.` : 'Check back later for new polls!'}
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-lg)',
            }}>
              {polls.map((poll) => (
                <PollCard
                  key={poll.poll_id}
                  poll={poll}
                  onVote={handleVote}
                  hasVoted={!!votedPolls[poll.poll_id]}
                  userSelection={votedPolls[poll.poll_id] || null}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>

            {pagination && pagination.total_pages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={pagination.total_pages}
                onPageChange={(p) => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', String(p));
                  setSearchParams(params);
                }}
              />
            )}
          </>
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
      </div>
    </div>
  );
}