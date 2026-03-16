import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchesApi } from '../api/matchesApi';
import { articlesApi } from '../api/articlesApi';
import { transfersApi } from '../api/transfersApi';
import LiveScore from '../components/matches/LiveScore';
import ScoreBoard from '../components/matches/ScoreBoard';
import ArticleFeatured from '../components/articles/ArticleFeatured';
import ArticleCard from '../components/articles/ArticleCard';
import TransferCard from '../components/transfers/TransferCard';
import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';

export default function HomePage() {
  const [matches, setMatches] = useState([]);
  const [articles, setArticles] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, aRes, tRes] = await Promise.allSettled([
          matchesApi.getByDate(new Date().toISOString().split('T')[0]),
          articlesApi.getFeatured(),
          transfersApi.getLatest(),
        ]);
        if (mRes.status === 'fulfilled') setMatches(mRes.value?.data || mRes.value || []);
        if (aRes.status === 'fulfilled') setArticles(aRes.value?.data || aRes.value || []);
        if (tRes.status === 'fulfilled') setTransfers(tRes.value?.data || tRes.value || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: 'var(--space-4xl) 0',
        background: 'var(--gradient-hero)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50%', left: '50%', width: 800, height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,160,0.06) 0%, transparent 70%)',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-hero)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: 'var(--space-lg)',
              letterSpacing: '-0.03em',
            }}>
              Feel the <span className="text-accent">Pulse</span> of Football
            </h1>
            <p style={{
              fontSize: 'var(--fs-md)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2xl)',
              lineHeight: 1.6,
              maxWidth: 500,
              margin: '0 auto var(--space-2xl)',
            }}>
              Live scores, breaking transfers, in-depth stats, and the latest news — all in one place.
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="container page-content">
        {loading ? (
          <Loader text="Loading today's action..." />
        ) : (
          <>
            {/* Live Matches */}
            <section style={{ marginBottom: 'var(--space-3xl)' }}>
              <LiveScore matches={matches} />
            </section>

            {/* Today's Matches */}
            <section style={{ marginBottom: 'var(--space-3xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}>Today's Matches</h2>
                <Link to="/matches" style={{ fontSize: 'var(--fs-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}>View All →</Link>
              </div>
              <ScoreBoard matches={matches.slice(0, 6)} title="" />
            </section>

            {/* Featured Article + News */}
            {articles.length > 0 && (
              <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                  <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}>Latest News</h2>
                  <Link to="/news" style={{ fontSize: 'var(--fs-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}>All News →</Link>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr', 
                  gap: 'var(--space-lg)',
                  alignItems: 'stretch', // Added this to make both columns same height
                }}>
                  <ArticleFeatured article={articles[0]} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {articles.slice(1, 4).map((a) => <ArticleCard key={a.id} article={a} />)}
                  </div>
                </div>
              </section>
            )}

            {/* Latest Transfers */}
            {transfers.length > 0 && (
              <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                  <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}>Latest Transfers</h2>
                  <Link to="/transfers" style={{ fontSize: 'var(--fs-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}>All Transfers →</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-md)' }}>
                  {transfers.slice(0, 4).map((t, i) => <TransferCard key={t.id || i} transfer={t} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}