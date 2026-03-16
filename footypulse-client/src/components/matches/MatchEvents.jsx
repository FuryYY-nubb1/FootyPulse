import React from 'react';
import { MATCH_EVENTS } from '../../utils/constants';

export default function MatchEvents({ events = [] }) {
  if (!events.length) return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No events</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
      {events.sort((a, b) => (a.minute || 0) - (b.minute || 0)).map((event, i) => {
        const info = MATCH_EVENTS[event.event_type] || { icon: '📋', label: event.event_type };
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--fs-sm)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--accent-primary)', fontWeight: 600, minWidth: 36 }}>
              {event.minute}'
            </span>
            <span>{info.icon}</span>
            <span style={{ fontWeight: 500 }}>{event.player_name || ''}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-xs)' }}>{info.label}</span>
          </div>
        );
      })}
    </div>
  );
}
