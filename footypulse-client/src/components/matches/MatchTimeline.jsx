import React from 'react';
import { EventIcon } from './MatchIcons';
import { MATCH_EVENTS } from '../../utils/constants';

export default function MatchTimeline({ events = [] }) {
  if (!events.length) return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No events recorded</p>;

  return (
    <div style={{ position: 'relative', padding: 'var(--space-lg) 0' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--border-subtle)', transform: 'translateX(-50%)' }} />
      {events.sort((a, b) => (a.minute || 0) - (b.minute || 0)).map((event, i) => {
        const isHome = event.team_side === 'home' || event.is_home;
        const eventInfo = MATCH_EVENTS[event.event_type] || { label: event.event_type };
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            flexDirection: isHome ? 'row' : 'row-reverse',
            marginBottom: 'var(--space-md)',
            animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
          }}>
            <div style={{ flex: 1, textAlign: isHome ? 'right' : 'left' }}>
              <span style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{event.player_name || ''}</span>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{eventInfo.label}</div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elevated)',
              border: '2px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1, flexShrink: 0,
            }}>
              <EventIcon type={event.event_type} size={20} />
            </div>
            <div style={{ flex: 1, textAlign: isHome ? 'left' : 'right' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {event.minute}'{event.added_time ? `+${event.added_time}` : ''}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}