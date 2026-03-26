import React from 'react';
import { EventIcon, EventIconLegend } from './MatchIcons';
import { MATCH_EVENTS } from '../../utils/constants';

function EventRow({ event, isLast }) {
  const isHome = event.team_side === 'home' || event.is_home;
  const info = MATCH_EVENTS[event.event_type] || { label: event.event_type };

  let subText = '';
  if (event.event_type === 'sub') {
    subText = event.assist_name || event.related_player_name || '';
  } else if (event.event_type === 'goal' || event.event_type === 'penalty') {
    if (event.assist_name || event.related_player_name) subText = event.assist_name || event.related_player_name;
    if (event.score_after) subText = (subText ? subText + '  ' : '') + event.score_after;
  } else if (event.event_type === 'red' || event.event_type === 'second_yellow') {
    subText = info.label || 'Red card';
  } else if (event.event_type === 'yellow') {
    subText = 'Yellow card';
  } else if (event.event_type === 'var') {
    subText = event.description || 'VAR Decision';
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 50px 1fr',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
      minHeight: 52,
    }}>
      {/* Left - Home events */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 10, opacity: isHome ? 1 : 0, paddingRight: 12,
      }}>
        {isHome && (
          <>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {event.player_name || ''}
              </div>
              {subText && (
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', lineHeight: 1.3, marginTop: 1 }}>
                  {subText}
                </div>
              )}
            </div>
            <EventIcon type={event.event_type} size={18} />
          </>
        )}
      </div>

      {/* Center - Minute */}
      <div style={{
        textAlign: 'center', fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-secondary)',
      }}>
        {event.minute}'{event.added_time ? `+${event.added_time}` : ''}
      </div>

      {/* Right - Away events */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
        gap: 10, opacity: !isHome ? 1 : 0, paddingLeft: 12,
      }}>
        {!isHome && (
          <>
            <EventIcon type={event.event_type} size={18} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {event.player_name || ''}
              </div>
              {subText && (
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', lineHeight: 1.3, marginTop: 1 }}>
                  {subText}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MatchEvents({ events = [], match }) {
  if (!events.length) {
    return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No events</p>;
  }

  const sortedEvents = [...events].sort((a, b) => (b.minute || 0) - (a.minute || 0));

  return (
    <div>
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        {/* Header with team logos */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
              {(match?.home_logo || match?.home_team_logo)
                ? <img src={match.home_logo || match.home_team_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>{(match?.home_short || match?.home_team_name || 'H')[0]}</span>
              }
            </div>
            <span style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {match?.home_short || match?.home_team_name || 'Home'}
            </span>
          </div>

          <h3 style={{ fontSize: 'var(--fs-md)', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
            KEY EVENTS
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {match?.away_short || match?.away_team_name || 'Away'}
            </span>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
              {(match?.away_logo || match?.away_team_logo)
                ? <img src={match.away_logo || match.away_team_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>{(match?.away_short || match?.away_team_name || 'A')[0]}</span>
              }
            </div>
          </div>
        </div>

        {/* End of match indicator */}
        <div style={{
          textAlign: 'center', padding: '12px 0 4px', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.5 }}>
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 4V7.5L9.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          End of match
        </div>

        {/* Events list */}
        <div style={{ padding: '0 20px 12px' }}>
          {sortedEvents.map((event, i) => (
            <EventRow key={event.event_id || i} event={event} isLast={i === sortedEvents.length - 1} />
          ))}
        </div>
      </div>

      {/* Icon Legend */}
      <EventIconLegend />
    </div>
  );
}