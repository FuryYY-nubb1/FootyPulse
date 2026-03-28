import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ placeholder = 'Search teams, players, matches...', onSearch, className = '' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query.trim());
    } else {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
      background: 'var(--bg-input)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-full)',
      padding: 'var(--space-xs) var(--space-sm) var(--space-xs) var(--space-lg)',
      transition: 'border-color var(--transition-fast)',
    }}>
      <span style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>🔍</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          color: 'var(--text-primary)', fontSize: 'var(--fs-sm)',
          padding: 'var(--space-sm) 0',
        }}
      />
      <button type="submit" style={{
        padding: 'var(--space-sm) var(--space-md)',
        background: 'var(--gradient-accent)',
        color: 'var(--text-inverse)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--fs-xs)',
        fontWeight: 600,
      }}>
        Search
      </button>
    </form>
  );
}
