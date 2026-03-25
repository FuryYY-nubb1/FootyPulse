import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

// Featured article (large left card)
function OverviewFeatured({ article }) {
  const navigate = useNavigate();
  if (!article) return null;

  return (
    <div
      onClick={() => navigate(`/news/${article.slug || article.id}`)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: 420,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        transition: 'all var(--transition-base)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Cover image */}
      {article.cover_image_url ? (
        <img
          src={article.cover_image_url}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-card))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          opacity: 0.3,
        }}>
          ⚽
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-xl)',
      }}>
        {article.article_type && (
          <span style={{
            display: 'inline-block',
            background: 'var(--accent-primary)',
            color: 'var(--bg-primary)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {article.article_type}
          </span>
        )}
        <h3 style={{
          fontSize: 'var(--fs-xl)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.3,
          marginBottom: 'var(--space-sm)',
        }}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p style={{
            fontSize: 'var(--fs-sm)',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
            maxHeight: '3em',
            overflow: 'hidden',
          }}>
            {article.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}

// Side article card (smaller, right column)
function OverviewSideCard({ article }) {
  const navigate = useNavigate();
  if (!article) return null;

  return (
    <div
      onClick={() => navigate(`/news/${article.slug || article.id}`)}
      style={{
        display: 'flex',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        alignItems: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-card-hover)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-card)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 100,
        height: 80,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--bg-tertiary)',
      }}>
        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', opacity: 0.3,
          }}>
            ⚽
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 'var(--space-xs)',
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
          {article.article_type && (
            <span style={{ textTransform: 'capitalize' }}>{article.article_type}</span>
          )}
          {article.created_at && (
            <>
              <span>·</span>
              <span>{formatDate(article.created_at, 'short')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CompetitionOverview({ articles = [], competitionName = '' }) {
  if (!articles.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-3xl)',
        color: 'var(--text-secondary)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.4 }}>📰</div>
        <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
          No news available
        </p>
        <p style={{ fontSize: 'var(--fs-sm)' }}>
          Check back later for the latest {competitionName} updates
        </p>
      </div>
    );
  }

  const featured = articles[0];
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
        {competitionName} Overview
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: sideArticles.length ? '2fr 1fr' : '1fr',
        gap: 'var(--space-lg)',
        alignItems: 'stretch',
      }}>
        {/* Featured article */}
        <OverviewFeatured article={featured} />

        {/* Side news */}
        {sideArticles.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }}>
            {sideArticles.map((a) => (
              <OverviewSideCard key={a.id || a.article_id} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}