import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../utils/constants';
import '../../styles/components/navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon">⚡</span>
          Footy<span className="navbar__brand-pulse">Pulse</span>
        </Link>

        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
                end={link.path === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <button className="navbar__search-btn" onClick={() => navigate('/search')} aria-label="Search">
            🔍
          </button>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/profile">
                <div className="navbar__avatar" style={{
                  background: 'var(--gradient-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-inverse)',
                }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="navbar__auth-btn">Sign In</Link>
          )}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <div className={`navbar__mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        {!isAuthenticated && (
          <Link to="/login" className="navbar__auth-btn" style={{ textAlign: 'center', marginTop: '1rem' }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}