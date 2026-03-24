import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesApi } from '../../api/articlesApi';
import { formatDate, getRelativeTime } from '../../utils/formatDate';

function OverviewArticleFeatured({ article }) {
  const navigate = useNavigate();
  if (!article) return null;

  const media = typeof article.media === 'string' ? JSON.parse(article.media || '{}') : (article.media || {});
  const image = media?.featured_image || null;

  return (
    <div
      onClick={() => navigate(`/news/${article.slug || article.article_id}`)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: 400,
        display: 'flex',
        alignItems: 'flex-end',
        background: 'var(--bg-tertiary)',
        transition: 'transform var(--transition-base)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {image && (
        <img
          src={image}
          alt={article.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)',
      }} />
      <div style={{
        position: 'relative',
        padding: 'var(--space-xl)',
        width: '100%',
      }}>
        {article.article_type && (
          <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            background: 'var(--accent-primary)',
            color: 'var(--text-inverse)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-sm)',
          }}>
            {article.article_type}
          </span>
        )}
        <h3 style={{
          fontSize: 'var(--fs-xl)',
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: 'var(--space-sm)',
          fontFamily: 'var(--font-display)',
        }}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p style={{
            fontSize: 'var(--fs-sm)',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
            maxWidth: 500,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {article.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}

function OverviewArticleCard({ article }) {
  const navigate = useNavigate();

  const media = typeof article.media === 'string' ? JSON.parse(article.media || '{}') : (article.media || {});
  const image = media?.featured_image || null;

  return (
    <div
      onClick={() => navigate(`/news/${article.slug || article.article_id}`)}
      style={{
        display: 'flex',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.background = 'var(--bg-card-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      {image && (
        <div style={{
          width: 120,
          height: 80,
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'var(--bg-tertiary)',
        }}>
          <img
            src={image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 700,
          lineHeight: 1.3,
          marginBottom: 'var(--space-xs)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.title}
        </h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--text-tertiary)',
        }}>
          {article.team_name && <span>{article.team_name}</span>}
          {article.team_name && <span>·</span>}
          <span>{getRelativeTime(new Date(article.published_at || article.created_at))}</span>
        </div>
      </div>
    </div>
  );
}

export default function TeamOverview({ teamId, teamName }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await articlesApi.getAll({ team_id: teamId, limit: 6 });
        setArticles(res?.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (teamId) load();
  }, [teamId]);

  if (loading) {
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
          {teamName ? `${teamName} Overview` : 'Overview'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
          <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const featured = articles[0] || null;
  const sideArticles = articles.slice(1, 5);

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
        {teamName ? `${teamName} Overview` : 'Overview'}
      </h2>

      {!articles.length ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3xl)',
          color: 'var(--text-secondary)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>No news available</p>
          <p style={{ fontSize: 'var(--fs-sm)' }}>Check back later for the latest updates</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: sideArticles.length ? '2fr 1fr' : '1fr',
          gap: 'var(--space-lg)',
          alignItems: 'start',
        }}>
          {/* Featured article */}
          {featured && <OverviewArticleFeatured article={featured} />}

          {/* Side news cards */}
          {sideArticles.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {sideArticles.map((a) => (
                <OverviewArticleCard key={a.article_id || a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}