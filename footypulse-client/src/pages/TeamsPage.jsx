import React, { useState, useEffect } from 'react';
import { teamsApi } from '../api/teamsApi';
import TeamCard from '../components/teams/TeamCard';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await teamsApi.getAll({ page, limit: 20, search });
      setTeams(res?.data || res || []);
      setTotal(res?.pagination?.totalPages || Math.ceil((res?.total || 20) / 20));
    } catch (err) {
      console.error(err);
      setError('Could not load teams. The database may be waking up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, search]);

  const handleSearch = (query) => {
    setPage(1);
    setSearch(query);
  };

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-md)',
        }}>
          <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>Teams</h1>
          <SearchBar placeholder="Search teams..." onSearch={handleSearch} />
        </div>

        {loading ? (
          <Loader text="Loading teams..." />
        ) : error ? (
          <ErrorBanner message={error} onRetry={load} />
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
              {teams.map((t) => <TeamCard key={t.id} team={t} />)}
            </div>
            {!teams.length && (
              <p style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-secondary)' }}>
                No teams found
              </p>
            )}
            <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}