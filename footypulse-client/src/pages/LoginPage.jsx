import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Login failed');
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 'var(--space-2xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 900, marginBottom: 'var(--space-sm)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Sign in to your FootyPulse account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {error && (
            <div style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--live)', fontSize: 'var(--fs-sm)' }}>
              {error}
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 500, marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 'var(--space-md)' }} placeholder="your@email.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 500, marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 'var(--space-md)' }} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={{
            padding: 'var(--space-md)', background: 'var(--gradient-accent)', color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 'var(--fs-base)', marginTop: 'var(--space-sm)',
            opacity: loading ? 0.7 : 1, transition: 'all var(--transition-fast)',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
