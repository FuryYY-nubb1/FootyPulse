import React from 'react';
import { useNavigate } from 'react-router-dom';
import MatchCard from '../matches/MatchCard';

// ── Helpers ──
function getRelativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Featured Article ──
function FeaturedArticle({ article }) {
  const navigate = useNavigate();
  if (!article) return null;

  const media = typeof article.media === 'string' ? JSON.parse(article.media || '{}') : (article.media || {});
  const image = media?.thumbnail || media?.featured_image || article.cover_image_url || null;

  return (
    <div
      onClick={() => navigate(`/news/${article.slug || article.article_id || article.id}`)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--bg-tertiary)',
        minHeight: 320,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {image && (
        <img src={image} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4,
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
      }} />
      <div style={{ position: 'relative', padding: 'var(--space-xl)' }}>
        {article.article_type && (
          <span style={{
            display: 'inline-block', background: 'var(--accent-primary)', color: 'var(--bg-primary)',
            fontSize: 'var(--fs-xs)', fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {article.article_type}
          </span>
        )}
        <h3 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 'var(--space-sm)' }}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p style={{ fontSize: 'var(--fs-sm)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, maxHeight: '3em', overflow: 'hidden' }}>
            {article.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Side Article Card ──
function SideArticleCard({ article }) {
  const navigate = useNavigate();
  if (!article) return null;

  return (
    <div
      onClick={() => navigate(`/news/${article.slug || article.article_id || article.id}`)}
      style={{
        padding: 'var(--space-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
    >
      <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, lineHeight: 1.3, marginBottom: 'var(--space-xs)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {article.title}
      </h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
        {article.team_name && <span>{article.team_name}</span>}
        {article.team_name && <span>·</span>}
        <span>{getRelativeTime(article.published_at || article.created_at)}</span>
      </div>
    </div>
  );
}

// ── Section Header ──
function SectionHeader({ title, linkText, linkPath }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
      <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      {linkText && linkPath && (
        <span onClick={() => navigate(linkPath)} style={{ fontSize: 'var(--fs-sm)', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>
          {linkText} →
        </span>
      )}
    </div>
  );
}


// ══════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════
export default function TeamOverview({ teamId, teamName, team, articles = [], fixtures = [] }) {
  const navigate = useNavigate();

  const featured = articles[0] || null;
  const sideArticles = articles.slice(1, 5);

  // Split fixtures into recent results and upcoming
  const results = fixtures
    .filter(m => m.status === 'finished')
    .sort((a, b) => (b.match_date || '').localeCompare(a.match_date || ''))
    .slice(0, 5);

  const upcoming = fixtures
    .filter(m => m.status === 'scheduled' || m.status === 'live')
    .sort((a, b) => (a.match_date || '').localeCompare(b.match_date || ''))
    .slice(0, 5);

  // Stadium info from team object
  const stadium = team?.stadium_name || null;
  const stadiumCapacity = team?.capacity || team?.stadium_capacity || null;
  const city = team?.city || null;
  const country = team?.country_name || null;
  const founded = team?.founded_year || null;

  return (
    <div>
      {/* ── SECTION 1: Latest News ── */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <SectionHeader title="Latest News" />

        {articles.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: sideArticles.length ? '2fr 1fr' : '1fr',
            gap: 'var(--space-lg)',
            alignItems: 'start',
          }}>
            <FeaturedArticle article={featured} />
            {sideArticles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {sideArticles.map(a => (
                  <SideArticleCard key={a.article_id || a.id} article={a} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-tertiary)',
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
          }}>
            <p style={{ fontSize: 'var(--fs-sm)' }}>No news available. Check back later.</p>
          </div>
        )}
      </div>


    </div>
  );
}