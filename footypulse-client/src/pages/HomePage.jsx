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
import ErrorBanner from '../components/common/ErrorBanner';

export default function HomePage() {
  const [matches, setMatches] = useState([]);
  const [articles, setArticles] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, aRes, tRes] = await Promise.allSettled([
        matchesApi.getByDate(new Date().toISOString().split('T')[0]),
        articlesApi.getFeatured(),
        transfersApi.getLatest(),
      ]);
      if (mRes.status === 'fulfilled') setMatches(mRes.value?.data || mRes.value || []);
      else console.error('Matches failed:', mRes.reason);

      if (aRes.status === 'fulfilled') setArticles(aRes.value?.data || aRes.value || []);
      else console.error('Articles failed:', aRes.reason);

      if (tRes.status === 'fulfilled') setTransfers(tRes.value?.data || tRes.value || []);
      else console.error('Transfers failed:', tRes.reason);

      // If all 3 failed, show error
      if (
        mRes.status === 'rejected' &&
        aRes.status === 'rejected' &&
        tRes.status === 'rejected'
      ) {
        setError('Could not connect to the database. It may be waking up — please retry.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong loading the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)',
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'rgba(0,245,160,0.1)', border: '1px solid rgba(0,245,160,0.2)',
            marginBottom: 'var(--space-lg)',
          }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Live Football Hub
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
            lineHeight: 1.1, marginBottom: 'var(--space-lg)',
          }}>
            The Pulse of <span style={{ color: 'var(--accent-primary)' }}>World Football</span>
          </h1>
          <p style={{
            fontSize: 'var(--fs-lg)', color: 'var(--text-secondary)',
            maxWidth: 560, margin: '0 auto var(--space-xl)',
          }}>
            Live scores, transfers, standings and news — all in one place.
          </p>
          <SearchBar />
        </div>
      </section>

      <div className="container page-content">
        {loading ? (
          <Loader text="Loading today's action..." />
        ) : error ? (
          <ErrorBanner message={error} onRetry={load} />
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
              {matches.length > 0
                ? <ScoreBoard matches={matches.slice(0, 6)} title="" />
                : <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>No matches today.</p>
              }
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
                  alignItems: 'stretch',
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
