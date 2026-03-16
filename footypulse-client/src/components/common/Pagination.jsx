import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const btnStyle = (active) => ({
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--fs-sm)',
    fontWeight: active ? 700 : 500,
    fontFamily: 'var(--font-mono)',
    background: active ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
    color: active ? 'var(--text-inverse)' : 'var(--text-secondary)',
    border: active ? 'none' : '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)', padding: 'var(--space-xl) 0' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ ...btnStyle(false), opacity: currentPage === 1 ? 0.4 : 1 }}
      >
        ‹
      </button>
      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} style={{ color: 'var(--text-tertiary)', padding: '0 4px' }}>…</span>
        ) : (
          <button key={page} onClick={() => onPageChange(page)} style={btnStyle(page === currentPage)}>
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ ...btnStyle(false), opacity: currentPage === totalPages ? 0.4 : 1 }}
      >
        ›
      </button>
    </div>
  );
}
