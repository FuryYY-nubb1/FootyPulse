import React, { useState, useEffect } from 'react';
import { competitionsApi } from '../../api/competitionsApi';
import GameWeekSelector from './GameWeekSelector';
import MatchCard from '../matches/MatchCard';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/formatDate';

// Group matches by date
function groupMatchesByDate(matches) {
  const groups = {};
  for (const m of matches) {
    const dateKey = m.match_date || m.date || 'Unknown';
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(m);
  }
  return groups;
}

export default function CompetitionMatches({ competitionId, seasonId }) {
  const [matches, setMatches] = useState([]);
  const [matchdays, setMatchdays] = useState([]);
  const [selectedMatchday, setSelectedMatchday] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch matchdays & initial matches
  useEffect(() => {
    if (!competitionId || !seasonId) return;

    const load = async () => {
      setLoading(true);
      try {
        // First fetch to get matchday list
        const res = await competitionsApi.getMatches(competitionId, {
          seasonId,
          limit: 200,
        });
        const data = res?.data || res || {};
        const allMatches = data.data || data || [];
        const mds = data.matchdays || [];

        setMatchdays(mds);

        // Auto-select the "current" matchday (latest with results, or first upcoming)
        if (mds.length && !selectedMatchday) {
          // Find the most recent matchday with finished matches
          const finishedMatches = Array.isArray(allMatches)
            ? allMatches.filter(m => m.status === 'finished')
            : [];

          let currentMd = mds[0];
          if (finishedMatches.length) {
            const maxMd = Math.max(...finishedMatches.map(m => m.matchday || 0));
            // Check if there are upcoming matches in this matchday
            const hasUpcoming = Array.isArray(allMatches)
              && allMatches.some(m => m.matchday === maxMd && m.status !== 'finished');
            currentMd = hasUpcoming ? maxMd : Math.min(maxMd + 1, mds[mds.length - 1]);
            // Clamp to available matchdays
            if (!mds.includes(currentMd)) currentMd = maxMd;
          }
          setSelectedMatchday(currentMd);
        }
      } catch (err) {
        console.error('Failed to load matchdays:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [competitionId, seasonId]);

  // Fetch matches for selected matchday
  useEffect(() => {
    if (!competitionId || !seasonId || !selectedMatchday) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await competitionsApi.getMatches(competitionId, {
          seasonId,
          matchday: selectedMatchday,
          limit: 50,
        });
        const data = res?.data || res || {};
        setMatches(data.data || data || []);
      } catch (err) {
        console.error('Failed to load matches:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [competitionId, seasonId, selectedMatchday]);

  const grouped = groupMatchesByDate(matches);

  return (
    <div>
      <h2 style={{
        fontSize: 'var(--fs-xl)',
        fontWeight: 900,
        fontFamily: 'var(--font-display)',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-lg)',
        letterSpacing: '-0.01em',
      }}>
        Fixtures, Live Scores & Results
      </h2>

      {/* Game Week Selector */}
      <GameWeekSelector
        matchdays={matchdays}
        selected={selectedMatchday}
        onChange={setSelectedMatchday}
      />

      {/* Match List */}
      {loading ? (
        <Loader text="Loading matches..." />
      ) : !matches.length ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3xl)',
          color: 'var(--text-secondary)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)', opacity: 0.4 }}>⚽</div>
          <p>No matches found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {Object.entries(grouped).map(([dateKey, dateMatches]) => (
            <div key={dateKey}>
              {/* Date header */}
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

              {/* Match cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--space-md)',
              }}>
                {dateMatches.map((match) => (
                  <MatchCard key={match.match_id || match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}