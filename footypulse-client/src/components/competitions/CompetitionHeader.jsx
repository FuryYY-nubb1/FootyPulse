import React from 'react';
import Badge from '../common/Badge';

export default function CompetitionHeader({ competition }) {
  if (!competition) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-xl)',
      padding: 'var(--space-2xl)',
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient-accent)' }} />
      <div style={{
        width: 80, 
        height: 80, 
        borderRadius: 'var(--radius-lg)', 
        background: 'white',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '2.5rem',
        overflow: 'hidden', 
        flexShrink: 0,
        padding: '12px',
      }}>
        {competition.logo_url ? (
          <img 
            src={competition.logo_url} 
            alt={competition.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain' 
            }} 
          />
        ) : (
          '🏆'
        )}
      </div>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>{competition.name}</h1>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {competition.country_name && <Badge variant="accent">{competition.country_name}</Badge>}
          {competition.type && <Badge>{competition.type}</Badge>}
        </div>
      </div>
    </div>
  );
}