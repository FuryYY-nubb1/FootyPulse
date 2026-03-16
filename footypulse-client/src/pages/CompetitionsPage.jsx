import React, { useState, useEffect } from 'react';
import { competitionsApi } from '../api/competitionsApi';
import CompetitionCard from '../components/competitions/CompetitionCard';
import Loader from '../components/common/Loader';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await competitionsApi.getAll();
        setCompetitions(res?.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>Leagues & Competitions</h1>
        {loading ? <Loader text="Loading competitions..." /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
            {competitions.map((c) => <CompetitionCard key={c.competition_id} competition={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
