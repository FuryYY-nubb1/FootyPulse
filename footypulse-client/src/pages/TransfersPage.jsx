import React, { useState, useEffect } from 'react';
import { transfersApi } from '../api/transfersApi';
import TransferList from '../components/transfers/TransferList';
import TransferTimeline from '../components/transfers/TransferTimeline';
import Tabs from '../components/common/Tabs';
import Pagination from '../components/common/Pagination';
import ErrorBanner from '../components/common/ErrorBanner';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await transfersApi.getAll({ page, limit: 20 });
      setTransfers(res?.data || res || []);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError('Could not load transfers. The database may be waking up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>Transfers</h1>
          <Tabs
            tabs={[{ key: 'grid', label: 'Grid' }, { key: 'timeline', label: 'Timeline' }]}
            activeTab={viewMode}
            onChange={setViewMode}
          />
        </div>

        {error ? (
          <ErrorBanner message={error} onRetry={load} />
        ) : viewMode === 'grid' ? (
          <TransferList transfers={transfers} loading={loading} />
        ) : (
          <TransferTimeline transfers={transfers} />
        )}

        {!error && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </div>
  );
}
