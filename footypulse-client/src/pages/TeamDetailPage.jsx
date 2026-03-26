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
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tRes, sRes, fRes, aRes] = await Promise.allSettled([
          teamsApi.getById(id),
          teamsApi.getSquad(id),
          teamsApi.getFixtures(id),
          articlesApi.getAll({ team_id: id, limit: 12 }),
        ]);
        if (tRes.status === 'fulfilled') setTeam(extract(tRes.value));
        if (sRes.status === 'fulfilled') setSquad(extract(sRes.value) || []);
        if (fRes.status === 'fulfilled') setFixtures(extract(fRes.value) || []);
        if (aRes.status === 'fulfilled') setArticles(extract(aRes.value) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Fetch league standings when team loads
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
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: `3px solid ${activeTab === tab.key ? 'var(--accent-primary)' : 'transparent'}`,
                  transition: 'all var(--transition-fast)', whiteSpace: 'nowrap',
                  textTransform: 'capitalize', letterSpacing: '0.01em', background: 'transparent',
                }}
                onMouseEnter={(e) => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        {activeTab === 'overview' && (
          <TeamOverview teamId={id} teamName={team?.name} team={team} articles={articles} fixtures={fixtures} />
        )}
        {activeTab === 'matches' && <TeamFixtures matches={fixtures} />}
        {activeTab === 'squad' && <TeamSquad players={squad} teamName={team?.name} />}
        {activeTab === 'standings' && (
          <StandingsTable standings={standings} highlightTeamId={id} />
        )}
        {activeTab === 'top-players' && <TeamTopPlayers players={squad} />}
      </div>
    </div>
  );
}