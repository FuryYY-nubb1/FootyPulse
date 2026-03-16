import React, { useState, useEffect } from 'react';
import { transfersApi } from '../api/transfersApi';
import TransferList from '../components/transfers/TransferList';
import TransferTimeline from '../components/transfers/TransferTimeline';
import Tabs from '../components/common/Tabs';
import Pagination from '../components/common/Pagination';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await transfersApi.getAll({ page, limit: 20 });
        setTransfers(res?.data || res || []);
        setTotalPages(res?.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

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
        {viewMode === 'grid' ? (
          <TransferList transfers={transfers} loading={loading} />
        ) : (
          <TransferTimeline transfers={transfers} />
        )}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
