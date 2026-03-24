import React from 'react';

export default function TeamHeader({ team }) {
  if (!team) return null;

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      marginTop: 'calc(-1 * var(--space-2xl))',
      marginLeft: 'calc(-1 * var(--space-xl))',
      marginRight: 'calc(-1 * var(--space-xl))',
      padding: 'var(--space-3xl) var(--space-xl)',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '50%',
        opacity: 0.03,
        backgroundImage: (team.logo_url || team.logo) ? `url(${team.logo_url || team.logo})` : 'none',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center right',
        pointerEvents: 'none',
      }} />
      
      {/* Diagonal accent stripe */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'var(--gradient-accent)',
      }} />

      {/* Subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
          {/* Team Logo */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: 'var(--radius-lg)',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            padding: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            {(team.logo_url || team.logo) ? (
              <img
                src={team.logo_url || team.logo}
                alt={team.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--bg-primary)',
                fontFamily: 'var(--font-display)',
              }}>
                {(team.name || 'T')[0]}
              </span>
            )}
          </div>

          {/* Team Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 'var(--space-sm)',
              textTransform: 'uppercase',
            }}>
              {team.name}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-lg)',
              flexWrap: 'wrap',
              marginTop: 'var(--space-sm)',
            }}>
              {team.country_name && (
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'inline-block',
                  }} />
                  {team.country_name}
                </span>
              )}
              {team.stadium_name && (
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--text-tertiary)',
                }}>
                  {team.stadium_name}
                </span>
              )}
              {(team.founded_year || team.founded) && (
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--text-tertiary)',
                }}>
                  Est. {team.founded_year || team.founded}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}