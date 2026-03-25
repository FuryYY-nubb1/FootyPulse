import React, { useRef, useEffect } from 'react';

export default function GameWeekSelector({ matchdays = [], selected, onChange }) {
  const scrollRef = useRef(null);

  // Auto-scroll to selected matchday
  useEffect(() => {
    if (!scrollRef.current || !selected) return;
    const activeBtn = scrollRef.current.querySelector('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selected]);

  if (!matchdays.length) return null;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      marginBottom: 'var(--space-lg)',
    }}>
      {/* Left arrow */}
      <button
        onClick={() => scroll(-1)}
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          flexShrink: 0,
          transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-card-hover)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--bg-tertiary)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
        aria-label="Scroll left"
      >
        ‹
      </button>

      {/* Scrollable matchday pills */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flex: 1,
          padding: 'var(--space-xs) 0',
        }}
      >
        {matchdays.map((md) => {
          const isActive = md === selected;
          return (
            <button
              key={md}
              data-active={isActive}
              onClick={() => onChange(md)}
              style={{
                background: isActive
                  ? 'var(--accent-primary)'
                  : 'var(--bg-tertiary)',
                color: isActive
                  ? 'var(--bg-primary)'
                  : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-xs) var(--space-lg)',
                fontSize: 'var(--fs-sm)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
                minWidth: 110,
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              Game Week {md}
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll(1)}
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          flexShrink: 0,
          transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-card-hover)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--bg-tertiary)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}