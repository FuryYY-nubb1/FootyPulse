import React, { useState, useEffect } from 'react';
import { matchesApi } from '../api/matchesApi';
import MatchCard from '../components/matches/MatchCard';
import Tabs from '../components/common/Tabs';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/formatDate';

// Group matches by date for display
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

function MatchGrid({ matches }) {
  if (!matches.length) return null;

  const grouped = groupByMatchDate(matches);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {Object.entries(grouped).map(([dateKey, dateMatches]) => (
        <div key={dateKey}>
          <div style={{
            fontSize: 'var(--fs-sm)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-md)',
            paddingBottom: 'var(--space-sm)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {formatDate(dateKey, 'long')}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-md)',
          }}>
            {dateMatches.map((m) => (
              <MatchCard key={m.match_id || m.id} match={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-3xl)',
      color: 'var(--text-secondary)',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
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
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
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
          // Auto-switch to live tab if there are live matches
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
          setRecentMatches([...data].sort((a, b) => {
            const d = (b.match_date || '').localeCompare(a.match_date || '');
            return d !== 0 ? d : (b.kick_off_time || '').localeCompare(a.kick_off_time || '');
          }));
        }
      } catch (err) {
        console.error('Failed to load matches:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
        <h1 style={{
          fontSize: 'var(--fs-2xl)',
          fontWeight: 800,
          marginBottom: 'var(--space-lg)',
        }}>
          Matches
        </h1>

        {loading ? (
          <Loader text="Loading matches..." />
        ) : (
          <>
            {/* Tab bar */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab content */}
            {activeTab === 'live' && (
              liveMatches.length > 0 ? (
                <MatchGrid matches={liveMatches} />
              ) : (
                <EmptyState icon="📡" message="No live matches right now" />
              )
            )}

            {activeTab === 'upcoming' && (
              upcomingMatches.length > 0 ? (
                <MatchGrid matches={upcomingMatches} />
              ) : (
                <EmptyState icon="📅" message="No upcoming matches scheduled" />
              )
            )}

            {activeTab === 'results' && (
              recentMatches.length > 0 ? (
                <MatchGrid matches={recentMatches} />
              ) : (
                <EmptyState icon="🏁" message="No recent results" />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}