import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchApi } from '../api/searchApi';
import TeamCard from '../components/teams/TeamCard';
import PlayerCard from '../components/players/PlayerCard';
import ArticleCard from '../components/articles/ArticleCard';
import MatchCard from '../components/matches/MatchCard';
import SearchBar from '../components/common/SearchBar';
import Tabs from '../components/common/Tabs';
import Loader from '../components/common/Loader';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ teams: [], players: [], articles: [], matches: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!query) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await searchApi.search(query);
        setResults({
          teams:    res?.data?.teams   || res?.teams   || [],
          players: res?.players || res?.data?.players || res?.data?.persons || [],
          articles: res?.data?.articles || res?.articles || [],
          matches:  res?.data?.matches  || res?.matches  || [],
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [query]);

  const handleSearch = (q) => setSearchParams({ q });
  const total = results.teams.length + results.players.length + results.articles.length + results.matches.length;

  const tabs = [
    { key: 'all',     label: 'All',     count: total },
    { key: 'teams',   label: 'Teams',   count: results.teams.length },
    { key: 'players', label: 'Players', count: results.players.length },
    { key: 'articles',label: 'News',    count: results.articles.length },
    { key: 'matches', label: 'Matches', count: results.matches.length },
  ];
  const show = (key) => activeTab === 'all' || activeTab === key;

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <SearchBar placeholder="Search..." onSearch={handleSearch} />
        {query && (
          <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, margin: 'var(--space-xl) 0' }}>
            Results for "{query}"
          </h2>
        )}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {loading ? (
          <Loader text="Searching..." />
        ) : (
          <>
            {show('teams') && results.teams.length > 0 && (
              <section style={{ marginBottom: 'var(--space-2xl)' }}>
                <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Teams</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
                  {results.teams.map((t) => (
                    <TeamCard key={t.team_id || t.id} team={t} />
                  ))}
                </div>
              </section>
            )}

            {show('players') && results.players.length > 0 && (
              <section style={{ marginBottom: 'var(--space-2xl)' }}>
                <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Players</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
                  {results.players.map((p) => (
                    <PlayerCard key={p.person_id || p.id} player={p} />
                  ))}
                </div>
              </section>
            )}

            {show('articles') && results.articles.length > 0 && (
              <section style={{ marginBottom: 'var(--space-2xl)' }}>
                <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>News</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
                  {results.articles.map((a) => (
                    <ArticleCard key={a.article_id || a.id} article={a} />
                  ))}
                </div>
              </section>
            )}

            {show('matches') && results.matches.length > 0 && (
              <section style={{ marginBottom: 'var(--space-2xl)' }}>
                <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Matches</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
                  {results.matches.map((m) => (
                    <MatchCard key={m.match_id || m.id} match={m} />
                  ))}
                </div>
              </section>
            )}

            {total === 0 && !loading && query && (
              <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>🔍</div>
                <p>No results found for "{query}"</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
