import React, { useState, useEffect } from 'react';
import { competitionsApi } from '../api/competitionsApi';
import CompetitionCard from '../components/competitions/CompetitionCard';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await competitionsApi.getAll();
      setCompetitions(res?.data || res || []);
    } catch (err) {
      console.error(err);
      setError('Could not load competitions. The database may be waking up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
          Leagues & Competitions
        </h1>

        {loading ? (
          <Loader text="Loading competitions..." />
        ) : error ? (
          <ErrorBanner message={error} onRetry={load} />
        ) : competitions.length === 0 ? (
          <ErrorBanner message="No competitions found. Try seeding the database." onRetry={load} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
            {competitions.map((c) => <CompetitionCard key={c.competition_id} competition={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
