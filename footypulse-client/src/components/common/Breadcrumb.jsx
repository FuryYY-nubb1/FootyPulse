import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
      fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-xl)',
    }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'var(--text-tertiary)' }}>/</span>}
          {item.path ? (
            <Link to={item.path} style={{ color: 'var(--text-tertiary)' }}>{item.label}</Link>
          ) : (
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
