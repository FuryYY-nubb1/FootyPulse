import React from 'react';

export default function Sidebar({ children, title }) {
  return (
    <aside style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)',
    }}>
      {title && (
        <h3 style={{
          fontSize: 'var(--fs-md)',
          fontWeight: 700,
          paddingBottom: 'var(--space-sm)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {title}
        </h3>
      )}
      {children}
    </aside>
  );
}
