import React from 'react';

export default function Loader({ size = 'md', text }) {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const s = sizes[size] || sizes.md;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-3xl)', gap: 'var(--space-md)' }}>
      <div style={{
        width: s, height: s,
        border: '3px solid var(--border-default)',
        borderTopColor: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {text && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
