import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-hero)', fontWeight: 900, lineHeight: 1 }}>
          <span className="text-accent">4</span>0<span className="text-accent">4</span>
        </div>
        <p style={{ fontSize: 'var(--fs-md)', color: 'var(--text-secondary)', margin: 'var(--space-lg) 0 var(--space-xl)' }}>
          Looks like this page went offside
        </p>
        <Link to="/" style={{
          display: 'inline-block', padding: 'var(--space-sm) var(--space-xl)',
          background: 'var(--gradient-accent)', color: 'var(--text-inverse)',
          borderRadius: 'var(--radius-full)', fontWeight: 700,
        }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
