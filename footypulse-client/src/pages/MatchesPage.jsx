import React, { useState, useEffect } from 'react';
import { matchesApi } from '../api/matchesApi';
import MatchCard from '../components/matches/MatchCard';
import Tabs from '../components/common/Tabs';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';
import { formatDate } from '../utils/formatDate';

function groupByMatchDate(matches) {
  const groups = {};
  matches.forEach((m) => {
    const raw = m.match_date || m.date;
    const dateOnly = raw ? String(raw).split('T')[0] : 'Unknown';
    if (!groups[dateOnly]) groups[dateOnly] = [];
    groups[dateOnly].push(m);
  });
  return groups;
}

function groupByCompetition(matches) {
  const groups = {};
  matches.forEach((m) => {
    const key = m.competition_name || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

function DateGroup({ dateKey, matches }) {
  const byComp = groupByCompetition(matches);
  return (
    <div style={{
      marginBottom: 'var(--space-lg)',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 24px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <span style={{
          fontSize: 'var(--fs-xs)', fontWeight: 700,
          color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {formatDate(dateKey, 'long')}
        </span>
      </div>
      {Object.entries(byComp).map(([compName, compMatches], ci) => (
        <div key={compName}>
          <div style={{
            padding: '5px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            borderTop: ci > 0 ? '1px solid var(--border-subtle)' : 'none',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <span style={{
              fontSize: 'var(--fs-xs)', fontWeight: 700,
              color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {compName}
            </span>
          </div>
          {compMatches.map((match) => (
            <MatchCard key={match.match_id || match.id} match={match} />
          ))}
        </div>
      ))}
    </div>
  );
}

function MatchList({ matches, reverseDate = false }) {
  if (!matches.length) return null;
  const grouped = groupByMatchDate(matches);
  let sorted = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  if (reverseDate) sorted = sorted.reverse();
  return (
    <div>
      {sorted.map(([dateKey, dateMatches]) => (
        <DateGroup key={dateKey} dateKey={dateKey} matches={dateMatches} />
      ))}
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div style={{
      textAlign: 'center', padding: 'var(--space-3xl)',
      color: 'var(--text-secondary)', background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.4 }}>{icon}</div>
      <p style={{ fontSize: 'var(--fs-sm)' }}>{message}</p>
    </div>
  );
}

export default function MatchesPage() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  const load = async () => {
    setLoading(true);
    setError(null);
    const today = new Date().toISOString().split('T')[0];
    try {
      const [liveRes, upcomingRes, recentRes] = await Promise.allSettled([
        matchesApi.getLive(),
        matchesApi.getAll({ status: 'scheduled', date_from: today, limit: 50 }),
        matchesApi.getAll({ status: 'finished', limit: 50 }),
      ]);

      if (liveRes.status === 'fulfilled') {
        const data = liveRes.value?.data || liveRes.value || [];
        setLiveMatches(data);
        if (data.length > 0) setActiveTab('live');
      }

      if (upcomingRes.status === 'fulfilled') {
        const data = upcomingRes.value?.data || upcomingRes.value || [];
        setUpcomingMatches([...data].sort((a, b) => {
          const d = (a.match_date || '').localeCompare(b.match_date || '');
          return d !== 0 ? d : (a.kick_off_time || '').localeCompare(b.kick_off_time || '');
        }));
      }

      if (recentRes.status === 'fulfilled') {
        const data = recentRes.value?.data || recentRes.value || [];
        setRecentMatches([...data].sort((a, b) =>
          (b.match_date || '').localeCompare(a.match_date || '')
        ));
      }

      // All failed = DB is down
      if (
        liveRes.status === 'rejected' &&
        upcomingRes.status === 'rejected' &&
        recentRes.status === 'rejected'
      ) {
        setError('Could not load matches. The database may be waking up — please retry.');
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const tabs = [
    ...(liveMatches.length > 0
      ? [{ key: 'live', label: '🔴 Live Now', count: liveMatches.length }]
      : []),
    { key: 'upcoming', label: 'Upcoming', count: upcomingMatches.length },
    { key: 'results', label: 'Results', count: recentMatches.length },
  ];

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-lg)' }}>
          Matches
        </h1>

        {loading ? (
          <Loader text="Loading matches..." />
        ) : error ? (
          <ErrorBanner message={error} onRetry={load} />
        ) : (
          <>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'live' && (
              liveMatches.length > 0
                ? <MatchList matches={liveMatches} />
                : <EmptyState icon="📡" message="No live matches right now" />
            )}
            {activeTab === 'upcoming' && (
              upcomingMatches.length > 0
                ? <MatchList matches={upcomingMatches} reverseDate={false} />
                : <EmptyState icon="📅" message="No upcoming matches scheduled" />
            )}
            {activeTab === 'results' && (
              recentMatches.length > 0
                ? <MatchList matches={recentMatches} reverseDate={true} />
                : <EmptyState icon="🏁" message="No recent results" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
