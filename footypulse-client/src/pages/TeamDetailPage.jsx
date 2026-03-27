import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { teamsApi } from '../api/teamsApi';
import { articlesApi } from '../api/articlesApi';
import { standingsApi } from '../api/standingsApi';
import TeamHeader from '../components/teams/TeamHeader';
import TeamOverview from '../components/teams/TeamOverview';
import TeamSquad from '../components/teams/TeamSquad';
import StandingsTable from '../components/competitions/StandingsTable';
import TeamFixtures from '../components/teams/TeamFixtures';
import TeamTopPlayers from '../components/teams/TeamTopPlayers';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';

function extract(axiosRes) {
  const outer = axiosRes?.data ?? axiosRes;
  if (outer?.success !== undefined) return outer.data;
  if (Array.isArray(outer)) return outer;
  return outer;
}

export default function TeamDetailPage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [squad, setSquad] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [articles, setArticles] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tRes, sRes, fRes, aRes] = await Promise.allSettled([
        teamsApi.getById(id),
        teamsApi.getSquad(id),
        teamsApi.getFixtures(id),
        articlesApi.getAll({ team_id: id, limit: 12 }),
      ]);
      if (tRes.status === 'fulfilled') setTeam(extract(tRes.value));
      else setError('Could not load team data.');

      if (sRes.status === 'fulfilled') setSquad(extract(sRes.value) || []);
      if (fRes.status === 'fulfilled') setFixtures(extract(fRes.value) || []);
      if (aRes.status === 'fulfilled') setArticles(extract(aRes.value) || []);
    } catch (err) {
      console.error(err);
      setError('Something went wrong loading team data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    if (!team) return;
    const loadStandings = async () => {
      try {
        const statsRes = await teamsApi.getStats(id);
        const statsData = extract(statsRes) || [];
        if (statsData.length > 0) {
          const seasonId = statsData[0].season_id;
          const stRes = await standingsApi.getBySeason(seasonId);
          setStandings(extract(stRes) || []);
        }
      } catch (err) {
        console.error('Failed to load standings:', err);
      }
    };
    loadStandings();
  }, [team, id]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading team..." /></div>;

  if (error && !team) {
    return (
      <div className="page-wrapper">
        <div className="container page-content">
          <ErrorBanner message={error} onRetry={load} />
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'matches', label: 'Matches' },
    { key: 'squad', label: 'Squad' },
    { key: 'standings', label: 'Standings' },
    { key: 'top-players', label: 'Top Players' },
  ];

  return (
    <div className="page-wrapper">
      <TeamHeader team={team} />

      <div style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-primary)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div className="container">
          <nav style={{ display: 'flex', gap: 'var(--space-md)', overflowX: 'auto' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: 'var(--space-md) var(--space-xs)', border: 'none', cursor: 'pointer',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: activeTab === tab.key ? 700 : 400,
                  color: activeTab === tab.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  background: 'none', whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container page-content">
        {activeTab === 'overview' && <TeamOverview team={team} articles={articles} fixtures={fixtures} />}
        {activeTab === 'matches' && <TeamFixtures teamId={id} fixtures={fixtures} />}
        {activeTab === 'squad' && <TeamSquad squad={squad} />}
        {activeTab === 'standings' && <StandingsTable standings={standings} highlightTeamId={parseInt(id)} />}
        {activeTab === 'top-players' && <TeamTopPlayers teamId={id} squad={squad} />}
      </div>
    </div>
  );
}
