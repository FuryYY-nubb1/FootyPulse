import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Registration failed');
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 'var(--space-2xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 900, marginBottom: 'var(--space-sm)' }}>Join FootyPulse</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Create your account and join the community</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {error && <div style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--live)', fontSize: 'var(--fs-sm)' }}>{error}</div>}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 500, marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)' }}>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-md)' }} placeholder="Your name" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 500, marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)' }}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-md)' }} placeholder="your@email.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 500, marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-md)' }} placeholder="••••••••" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 500, marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)' }}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-md)' }} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={{
            padding: 'var(--space-md)', background: 'var(--gradient-accent)', color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 'var(--fs-base)', marginTop: 'var(--space-sm)',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}