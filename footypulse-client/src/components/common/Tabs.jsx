import React from 'react';

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 'var(--space-xs)',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: 'var(--space-xl)',
      overflowX: 'auto',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            padding: 'var(--space-sm) var(--space-lg)',
            fontSize: 'var(--fs-sm)',
            fontWeight: activeTab === tab.key ? 600 : 500,
            color: activeTab === tab.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: `2px solid ${activeTab === tab.key ? 'var(--accent-primary)' : 'transparent'}`,
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap',
            marginBottom: -1,
          }}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              marginLeft: 6, fontSize: 'var(--fs-xs)',
              background: activeTab === tab.key ? 'var(--accent-primary-dim)' : 'var(--bg-tertiary)',
              padding: '1px 6px', borderRadius: 'var(--radius-full)',
            }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
