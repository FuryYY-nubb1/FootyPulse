import React, { useState, useEffect } from 'react';
import { competitionsApi } from '../../api/competitionsApi';
import GameWeekSelector from './GameWeekSelector';
import MatchCard from '../matches/MatchCard';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/formatDate';

// Helper: safely extract data from axios + server response
// axios: { data: { success: true, data: [...], matchdays: [...] } }
function extractResponse(axiosRes) {
  const outer = axiosRes?.data ?? axiosRes;
  if (outer?.success !== undefined) return outer; // return the full server payload {success, data, matchdays}
  return axiosRes;
}

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
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Fetch matchdays & all matches on mount
  useEffect(() => {
    if (!competitionId || !seasonId) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await competitionsApi.getMatches(competitionId, {
          seasonId,
          limit: 500,
        });

        const payload = extractResponse(res);
        const allMatches = payload.data || payload || [];
        const mds = payload.matchdays || [];

        setMatchdays(mds);

        // If there are matchdays, auto-select the current one
        if (mds.length) {
          const matchesArr = Array.isArray(allMatches) ? allMatches : [];
          const finishedMatches = matchesArr.filter(m => m.status === 'finished');

          let currentMd = mds[0];
          if (finishedMatches.length) {
            const maxMd = Math.max(...finishedMatches.map(m => m.matchday || 0));
            const hasUpcoming = matchesArr.some(
              m => m.matchday === maxMd && m.status !== 'finished'
            );
            currentMd = hasUpcoming ? maxMd : Math.min(maxMd + 1, mds[mds.length - 1]);
            if (!mds.includes(currentMd)) currentMd = maxMd;
          }
          setSelectedMatchday(currentMd);
        } else {
          // No matchdays — show all matches directly (UCL stages, cups, etc.)
          setMatches(Array.isArray(allMatches) ? allMatches : []);
          setSelectedMatchday(null);
        }

        setInitialLoaded(true);
      } catch (err) {
        console.error('Failed to load matches:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [competitionId, seasonId]);

  // Fetch matches for selected matchday (only when matchdays exist)
  useEffect(() => {
    if (!competitionId || !seasonId || !selectedMatchday || !initialLoaded) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await competitionsApi.getMatches(competitionId, {
          seasonId,
          matchday: selectedMatchday,
          limit: 50,
        });

        const payload = extractResponse(res);
        const matchesData = payload.data || payload || [];
        setMatches(Array.isArray(matchesData) ? matchesData : []);
      } catch (err) {
        console.error('Failed to load matches for matchday:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [competitionId, seasonId, selectedMatchday, initialLoaded]);

  const grouped = groupMatchesByDate(matches);
  const sortedDates = Object.keys(grouped).sort();

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

      {/* Game Week Selector (only show if matchdays exist) */}
      {matchdays.length > 0 && (
        <GameWeekSelector
          matchdays={matchdays}
          selected={selectedMatchday}
          onChange={setSelectedMatchday}
        />
      )}

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
          <p style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)', opacity: 0.4 }}>⚽</p>
          <p style={{ fontSize: 'var(--fs-sm)' }}>No matches found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              {/* Date header */}
              <div style={{
                fontSize: 'var(--fs-xs)',
                fontWeight: 700,
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: 'var(--space-sm) 0',
                marginBottom: 'var(--space-xs)',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                {formatDate ? formatDate(dateKey) : dateKey}
              </div>

              {/* Matches for this date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {grouped[dateKey].map((match) => (
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