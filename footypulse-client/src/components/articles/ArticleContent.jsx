import React from 'react';
import { formatDate } from '../../utils/formatDate';
import Badge from '../common/Badge';

export default function ArticleContent({ article }) {
  if (!article) return null;

  return (
    <article style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Category Badge */}
      {article.category && (
        <Badge 
          variant="accent" 
          style={{ 
            marginBottom: 'var(--space-lg)',
            fontSize: 'var(--fs-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
          }}
        >
          {article.category}
        </Badge>
      )}
      
      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-display)', 
        fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
        fontWeight: 900,
        lineHeight: 1.1, 
        marginBottom: 'var(--space-xl)',
        letterSpacing: '-0.02em',
        background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {article.title}
      </h1>
      
      {/* Metadata Bar */}
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-lg)',
        padding: 'var(--space-lg) 0',
        marginBottom: 'var(--space-2xl)', 
        fontSize: 'var(--fs-sm)', 
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--gradient-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 'var(--fs-sm)',
          }}>
            {(article.author_name || 'F')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
              {article.author_name || 'FootyPulse'}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)' }}>
              {formatDate(article.published_at || article.created_at, 'long')}
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Image */}
      {article.media.featured_image && (
        <div style={{
          position: 'relative',
          marginBottom: 'var(--space-3xl)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <img 
            src={article.media.featured_image} 
            alt={article.title} 
            style={{
              width: '100%', 
              display: 'block',
              maxHeight: 500, 
              objectFit: 'cover',
            }} 
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)',
          }} />
        </div>
      )}
      
      {/* Article Content */}
      <div
        style={{ 
          fontSize: 'var(--fs-lg)', 
          lineHeight: 1.8, 
          color: 'var(--text-secondary)',
        }}
        dangerouslySetInnerHTML={{ __html: article.content || article.body || '' }}
      />
      
      {/* Add custom styles for content elements */}
      <style>{`
        article h2 {
          font-size: var(--fs-xl);
          font-weight: 700;
          margin-top: var(--space-2xl);
          margin-bottom: var(--space-lg);
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }
        
        article h3 {
          font-size: var(--fs-lg);
          font-weight: 600;
          margin-top: var(--space-xl);
          margin-bottom: var(--space-md);
          color: var(--text-primary);
        }
        
        article p {
          margin-bottom: var(--space-lg);
        }
        
        article a {
          color: var(--color-accent);
          text-decoration: none;
          border-bottom: 1px solid var(--color-accent);
          transition: opacity 0.2s;
        }
        
        article a:hover {
          opacity: 0.7;
        }
        
        article blockquote {
          border-left: 4px solid var(--color-accent);
          padding-left: var(--space-lg);
          margin: var(--space-xl) 0;
          font-style: italic;
          color: var(--text-secondary);
          background: rgba(255,255,255,0.02);
          padding: var(--space-lg);
          border-radius: var(--radius-md);
        }
        
        article ul, article ol {
          margin: var(--space-lg) 0;
          padding-left: var(--space-xl);
        }
        
        article li {
          margin-bottom: var(--space-sm);
        }
        
        article img {
          border-radius: var(--radius-lg);
          margin: var(--space-xl) 0;
        }
        
        article strong {
          color: var(--text-primary);
          font-weight: 600;
        }
      `}</style>
    </article>
  );
}