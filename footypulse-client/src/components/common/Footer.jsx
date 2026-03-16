import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Matches', path: '/matches' },
  { label: 'Leagues', path: '/competitions' },
  { label: 'Teams', path: '/teams' },
  { label: 'Transfers', path: '/transfers' },
  { label: 'News', path: '/news' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: 'var(--space-3xl) 0 var(--space-xl)',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-2xl)',
          marginBottom: 'var(--space-2xl)',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'var(--fs-xl)',
              marginBottom: 'var(--space-md)',
            }}>
              ⚡ Footy<span className="text-accent">Pulse</span>
            </div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your ultimate destination for live football scores, stats, transfers, and breaking news.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Navigate
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {footerLinks.map((link) => (
                <Link key={link.path} to={link.path} style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              About
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <a href="#" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>About Us</a>
              <a href="#" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>Contact</a>
              <a href="#" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>Privacy Policy</a>
              <a href="#" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>Terms</a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 'var(--space-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
        }}>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} FootyPulse. All rights reserved.
          </p>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            Built with ⚡ and passion for the beautiful game
          </p>
        </div>
      </div>
    </footer>
  );
}
