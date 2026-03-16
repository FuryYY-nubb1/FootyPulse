import React, { useState, useEffect } from 'react';
import { matchesApi } from '../api/matchesApi';
import MatchList from '../components/matches/MatchList';
import FixtureCalendar from '../components/matches/FixtureCalendar';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await matchesApi.getByDate(selectedDate);
        setMatches(res?.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDate]);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-lg)' }}>Matches</h1>
        <FixtureCalendar onDateSelect={setSelectedDate} />
        <MatchList matches={matches} loading={loading} />
      </div>
    </div>
  );
}
