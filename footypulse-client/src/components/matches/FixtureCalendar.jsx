import React, { useState } from 'react';

export default function FixtureCalendar({ onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDays = () => {
    const days = [];
    for (let i = -3; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const handleSelect = (date) => {
    setSelectedDate(date);
    onDateSelect?.(date.toISOString().split('T')[0]);
  };

  return (
    <div style={{
      display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto',
      padding: 'var(--space-md) 0', marginBottom: 'var(--space-lg)',
    }}>
      {getDays().map((day) => {
        const isSelected = day.toDateString() === selectedDate.toDateString();
        const isToday = day.toDateString() === new Date().toDateString();
        return (
          <button
            key={day.toISOString()}
            onClick={() => handleSelect(day)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
              border: isToday && !isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              minWidth: 56, flexShrink: 0,
              transition: 'all var(--transition-fast)',
            }}
          >
            <span style={{ fontSize: 'var(--fs-xs)', textTransform: 'uppercase' }}>
              {day.toLocaleDateString('en', { weekday: 'short' })}
            </span>
            <span style={{ fontSize: 'var(--fs-md)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {day.getDate()}
            </span>
            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>
              {day.toLocaleDateString('en', { month: 'short' })}
            </span>
          </button>
        );
      })}
    </div>
  );
}
