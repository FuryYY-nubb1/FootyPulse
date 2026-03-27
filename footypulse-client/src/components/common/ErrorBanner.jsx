// src/components/common/ErrorBanner.jsx
// Reusable error banner used across all pages when DB/API fails

export default function ErrorBanner({ message = 'Could not load data.', onRetry }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-3xl)',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(255,80,80,0.2)',
      margin: 'var(--space-xl) 0',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>⚠️</div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-md)' }}>
        {message}
      </p>
      <button
        onClick={onRetry || (() => window.location.reload())}
        style={{
          padding: '8px 20px',
          background: 'var(--accent-primary)',
          color: '#000',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          fontSize: 'var(--fs-sm)',
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  );
}
