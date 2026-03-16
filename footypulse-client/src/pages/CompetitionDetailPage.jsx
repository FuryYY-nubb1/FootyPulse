import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { competitionsApi } from '../api/competitionsApi';
import { standingsApi } from '../api/standingsApi';
import { matchesApi } from '../api/matchesApi';
import CompetitionHeader from '../components/competitions/CompetitionHeader';
import StandingsTable from '../components/competitions/StandingsTable';
import TopScorers from '../components/competitions/TopScorers';
import MatchList from '../components/matches/MatchList';
import SeasonSelector from '../components/competitions/SeasonSelector';
import Tabs from '../components/common/Tabs';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

export default function CompetitionDetailPage() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('standings');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [cRes, sRes] = await Promise.allSettled([
          competitionsApi.getById(id),
          competitionsApi.getSeasons(id),
        ]);
        if (cRes.status === 'fulfilled') setCompetition(cRes.value?.data || cRes.value);
        if (sRes.status === 'fulfilled') {
          const s = sRes.value?.data || sRes.value || [];
          setSeasons(s);
          if (s.length) setSelectedSeason(s[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!selectedSeason) return;
    const load = async () => {
      try {
        const [stRes, mRes] = await Promise.allSettled([
          standingsApi.getByCompetition(id, selectedSeason),
          matchesApi.getByCompetition(id, { seasonId: selectedSeason }),
        ]);
        if (stRes.status === 'fulfilled') setStandings(stRes.value?.data || stRes.value || []);
        if (mRes.status === 'fulfilled') setMatches(mRes.value?.data || mRes.value || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id, selectedSeason]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading competition..." /></div>;

  const tabs = [
    { key: 'standings', label: 'Standings' },
    { key: 'matches', label: 'Matches' },
    { key: 'scorers', label: 'Top Scorers' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <Breadcrumb items={[{ label: 'Leagues', path: '/competitions' }, { label: competition?.name || 'Competition' }]} />
        <CompetitionHeader competition={competition} />
        <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {seasons.length > 0 && <SeasonSelector seasons={seasons} selectedSeason={selectedSeason} onChange={setSelectedSeason} />}
        </div>
        <div style={{ marginTop: 'var(--space-lg)' }}>
          {activeTab === 'standings' && <StandingsTable standings={standings} />}
          {activeTab === 'matches' && <MatchList matches={matches} />}
          {activeTab === 'scorers' && <TopScorers scorers={[]} />}
        </div>
      </div>
    </div>
  );
}
