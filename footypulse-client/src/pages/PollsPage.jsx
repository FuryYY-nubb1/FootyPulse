// ============================================
// src/pages/PollsPage.jsx
// WHERE: Add to src/pages/
// ROUTE: /polls
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { pollsApi } from '../api/pollsApi';
import PollCard from '../components/polls/PollCard';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { BarChart3, Filter } from 'lucide-react';

// Generate or retrieve a persistent anonymous user ID
function getOrCreateUserId() {
  let userId = localStorage.getItem('footypulse_user_id');
  if (!userId) {
    userId = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('footypulse_user_id', userId);
  }
  return userId;
}

export default function PollsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [polls, setPolls] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedPolls, setVotedPolls] = useState({});   // { pollId: [selectedOptions] }
  const [toastMsg, setToastMsg] = useState(null);

  const page = parseInt(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || '';
  const userId = getOrCreateUserId();

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

        // Check vote status for each poll
        const pollList = res.data || [];
        const voteChecks = {};
        await Promise.all(
          pollList.map(async (p) => {
            try {
              const voteRes = await pollsApi.getUserVote(p.poll_id, userId);
              if (voteRes.data?.has_voted && voteRes.data.vote) {
                const selected = voteRes.data.vote.selected_options;
                voteChecks[p.poll_id] = Array.isArray(selected) ? selected : JSON.parse(selected || '[]');
              }
            } catch {
              // User hasn't voted — that's fine
            }
          })
        );
        setVotedPolls(voteChecks);
      } catch (err) {
        console.error('Failed to load polls:', err);
      }
      setLoading(false);
    };
    fetchPolls();
  }, [page, status, userId]);

  // Handle vote
  const handleVote = useCallback(async (pollId, optionId) => {
    try {
      const res = await pollsApi.vote(pollId, {
        user_id: userId,
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
      const msg = err.response?.data?.message || 'Failed to vote. Please try again.';
      showToast(msg, true);
      throw err; // Re-throw so PollCard can handle UI state
    }
  }, [userId]);

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
          <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
            <BarChart3 size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }} />
            <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-secondary)' }}>No polls found</p>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>
              {status ? `No ${status} polls at the moment` : 'Check back soon for new polls'}
            </p>
          </div>
        ) : (
          <div className="grid grid-3" style={{ gap: 'var(--space-lg)' }}>
            {polls.map((p) => (
              <PollCard
                key={p.poll_id}
                poll={p}
                onVote={handleVote}
                hasVoted={!!votedPolls[p.poll_id]}
                userSelection={votedPolls[p.poll_id] || null}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          pagination={pagination}
          onPageChange={(p) => setFilter('page', p.toString())}
        />
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          padding: 'var(--space-sm) var(--space-lg)',
          background: toastMsg.isError ? 'var(--accent-danger, #ef4444)' : 'var(--accent-success, #10b981)',
          color: '#fff', borderRadius: 'var(--radius-md)',
          fontSize: 'var(--fs-sm)', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 9999,
          animation: 'slideUp 0.3s ease-out',
        }}>
          {toastMsg.message}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}