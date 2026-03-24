import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { teamsApi } from '../api/teamsApi';
import { articlesApi } from '../api/articlesApi';
import TeamHeader from '../components/teams/TeamHeader';
import TeamOverview from '../components/teams/TeamOverview';
import TeamSquad from '../components/teams/TeamSquad';
import TeamStats from '../components/teams/TeamStats';
import TeamFixtures from '../components/teams/TeamFixtures';
import TeamTransfers from '../components/teams/TeamTransfers';
import TeamTopPlayers from '../components/teams/TeamTopPlayers';
import ArticleList from '../components/articles/ArticleList';
import Loader from '../components/common/Loader';

export default function TeamDetailPage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [squad, setSquad] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tRes, sRes, fRes, trRes, aRes] = await Promise.allSettled([
          teamsApi.getById(id),
          teamsApi.getSquad(id),
          teamsApi.getFixtures(id),
          teamsApi.getTransfers(id),
          articlesApi.getAll({ team_id: id, limit: 12 }),
        ]);
        if (tRes.status === 'fulfilled') setTeam(tRes.value?.data || tRes.value);
        if (sRes.status === 'fulfilled') setSquad(sRes.value?.data || sRes.value || []);
        if (fRes.status === 'fulfilled') setFixtures(fRes.value?.data || fRes.value || []);
        if (trRes.status === 'fulfilled') setTransfers(trRes.value?.data || trRes.value || []);
        if (aRes.status === 'fulfilled') setArticles(aRes.value?.data || aRes.value || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading team..." /></div>;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'news', label: 'News' },
    { key: 'matches', label: 'Matches' },
    { key: 'squad', label: 'Squad' },
    { key: 'standings', label: 'Standings' },
    { key: 'top-players', label: 'Top Players' },
  ];

  return (
    <div className="page-wrapper">
      {/* Full-width header */}
      <TeamHeader team={team} />

      {/* Navigation tabs - Goal.com style */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        marginLeft: 'calc(-1 * var(--space-xl))',
        marginRight: 'calc(-1 * var(--space-xl))',
        position: 'sticky',
        top: 'var(--navbar-height)',
        zIndex: 'var(--z-sticky)',
      }}>
        <div className="container">
          <nav style={{
            display: 'flex',
            gap: 0,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: 'var(--space-md) var(--space-lg)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: `3px solid ${activeTab === tab.key ? 'var(--accent-primary)' : 'transparent'}`,
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap',
                  textTransform: 'capitalize',
                  letterSpacing: '0.01em',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        {activeTab === 'overview' && (
          <TeamOverview teamId={id} teamName={team?.name} />
        )}
        {activeTab === 'news' && (
          <div>
            <h2 style={{
              fontSize: 'var(--fs-xl)',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-lg)',
            }}>
              Latest News
            </h2>
            <ArticleList articles={articles} loading={false} />
            {!articles.length && (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-3xl)',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
              }}>
                <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>No news articles</p>
                <p style={{ fontSize: 'var(--fs-sm)' }}>Check back later for updates about {team?.name}</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'matches' && <TeamFixtures matches={fixtures} />}
        {activeTab === 'squad' && <TeamSquad players={squad} teamName={team?.name} />}
        {activeTab === 'standings' && <TeamStats stats={team} />}
        {activeTab === 'top-players' && <TeamTopPlayers players={squad} />}
      </div>
    </div>
  );
}