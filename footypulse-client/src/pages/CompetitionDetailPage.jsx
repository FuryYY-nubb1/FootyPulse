import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { competitionsApi } from '../api/competitionsApi';
import { standingsApi } from '../api/standingsApi';
import CompetitionHeader from '../components/competitions/CompetitionHeader';
import CompetitionOverview from '../components/competitions/CompetitionOverview';
import CompetitionMatches from '../components/competitions/CompetitionMatches';
import StandingsTable from '../components/competitions/StandingsTable';
import CompetitionStats from '../components/competitions/CompetitionStats';
import SeasonSelector from '../components/competitions/SeasonSelector';
import Tabs from '../components/common/Tabs';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

// Helper: safely extract data from axios responses
function extract(axiosRes) {
  const outer = axiosRes?.data ?? axiosRes;
  if (outer?.success !== undefined) return outer.data;
  if (Array.isArray(outer)) return outer;
  return outer;
}

export default function CompetitionDetailPage() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [standings, setStandings] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [articles, setArticles] = useState([]);
  const [scorersData, setScorersData] = useState({ scorers: [], assists: [], redCards: [] });
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Load competition info + seasons + news on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [cRes, sRes, nRes] = await Promise.allSettled([
          competitionsApi.getById(id),
          competitionsApi.getSeasons(id),
          competitionsApi.getNews(id, { limit: 10 }),
        ]);

        if (cRes.status === 'fulfilled') {
          setCompetition(extract(cRes.value));
        }

        if (sRes.status === 'fulfilled') {
          const s = extract(sRes.value) || [];
          setSeasons(s);
          const current = s.find((x) => x.is_current);
          if (current) setSelectedSeason(current.id);
          else if (s.length) setSelectedSeason(s[0].id);
        }

        if (nRes.status === 'fulfilled') {
          setArticles(extract(nRes.value) || []);
        }
      } catch (err) {
        console.error('CompetitionDetailPage load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Load standings + scorers + all matches when season changes
  useEffect(() => {
    if (!selectedSeason) return;

    const load = async () => {
      try {
        const [stRes, scRes, mRes] = await Promise.allSettled([
          standingsApi.getByCompetition(id, selectedSeason),
          competitionsApi.getScorers(id, { seasonId: selectedSeason }),
          competitionsApi.getMatches(id, { seasonId: selectedSeason, limit: 500 }),
        ]);

        if (stRes.status === 'fulfilled') {
          setStandings(extract(stRes.value) || []);
        }

        if (scRes.status === 'fulfilled') {
          const d = extract(scRes.value) || {};
          setScorersData({
            scorers: d.scorers || [],
            assists: d.assists || [],
            redCards: d.redCards || [],
          });
        }

        if (mRes.status === 'fulfilled') {
          const payload = mRes.value?.data ?? mRes.value;
          const matchData = payload?.success !== undefined ? payload.data : payload;
          setAllMatches(Array.isArray(matchData) ? matchData : []);
        }
      } catch (err) {
        console.error('Standings/scorers/matches load error:', err);
      }
    };
    load();
  }, [id, selectedSeason]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Loader text="Loading competition..." />
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'matches', label: 'Matches' },
    { key: 'standings', label: 'Standings' },
    { key: 'stats', label: 'Stats' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <Breadcrumb
          items={[
            { label: 'Leagues', path: '/competitions' },
            { label: competition?.name || 'Competition' },
          ]}
        />

        <CompetitionHeader competition={competition} />

        <div style={{
          marginTop: 'var(--space-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
        }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {seasons.length > 0 && (
            <SeasonSelector
              seasons={seasons}
              selectedSeason={selectedSeason}
              onChange={setSelectedSeason}
            />
          )}
        </div>

        <div style={{ marginTop: 'var(--space-lg)' }}>
          {activeTab === 'overview' && (
            <CompetitionOverview
              articles={articles}
              competitionName={competition?.name || ''}
            />
          )}

          {activeTab === 'matches' && (
            <CompetitionMatches
              competitionId={id}
              seasonId={selectedSeason}
            />
          )}

          {activeTab === 'standings' && (
            <StandingsTable standings={standings} />
          )}

          {activeTab === 'stats' && (
            <CompetitionStats
              standings={standings}
              scorers={scorersData.scorers}
              assists={scorersData.assists}
              redCards={scorersData.redCards}
              matches={allMatches}
            />
          )}
        </div>
      </div>
    </div>
  );
}