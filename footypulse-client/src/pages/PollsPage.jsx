// ============================================
// src/pages/PollsPage.jsx
// WHERE: Add to src/pages/
// ROUTE: /polls
// ============================================

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { pollsApi } from '../api/pollsApi';
import PollCard from '../components/polls/PollCard';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { BarChart3 } from 'lucide-react';

export default function PollsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [polls, setPolls] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const page = parseInt(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || '';

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (status) params.status = status;
        const res = await pollsApi.getAll(params);
        setPolls(res.data || []);
        setPagination(res.pagination);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, [page, status]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <BarChart3 size={28} style={{ color: 'var(--accent-secondary)' }} /> Polls
          </h1>
          <p className="page-subtitle">Have your say — vote on the biggest questions in football</p>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          {[
            { value: '', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'closed', label: 'Closed' },
          ].map((f) => (
            <button key={f.value}
              className={`btn ${status === f.value ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter('status', f.value)}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? <Loader text="Loading polls..." /> : polls.length === 0 ? (
          <div className="empty-state">
            <BarChart3 size={48} />
            <p>No polls found</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {polls.map((p) => <PollCard key={p.poll_id} poll={p} />)}
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={(p) => setFilter('page', p.toString())} />
      </div>
    </div>
  );
}
