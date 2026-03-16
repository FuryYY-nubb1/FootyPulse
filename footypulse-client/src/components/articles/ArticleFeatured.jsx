import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArticleFeatured({ article }) {
  const navigate = useNavigate();
  if (!article) return null;

  return (
    <div 
      onClick={() => navigate(`/news/${article.slug || article.id}`)}
      style={{
        position: 'relative',
        height: '100%', // Changed to 100% to fill the grid row
        minHeight: '500px', // Minimum height for safety
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
      }}
    >
      {/* Background Image */}
      {article.media.featured_image && (
        <img 
          src={article.media.featured_image} 
          alt={article.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
        zIndex: 1,
      }} />
      
      {/* Content */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-2xl)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}>
        {/* Category Badge */}
        {article.category && (
          <span style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            padding: 'var(--space-xs) var(--space-md)',
            background: 'var(--gradient-accent)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            {article.category}
          </span>
        )}
        
        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 900,
          lineHeight: 1.2,
          color: 'white',
          margin: 0,
          letterSpacing: '-0.02em',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          {article.title}
        </h2>
        
        {/* Excerpt */}
        {article.excerpt && (
          <p style={{
            fontSize: 'var(--fs-lg)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            maxWidth: '700px',
            textShadow: '0 1px 10px rgba(0,0,0,0.5)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {article.excerpt}
          </p>
        )}
      </div>
      
      {/* Shine Effect on Hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        transform: 'translateX(-100%)',
        transition: 'transform 0.6s ease',
        zIndex: 3,
        pointerEvents: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(100%)';
      }}
      />
    </div>
  );
}