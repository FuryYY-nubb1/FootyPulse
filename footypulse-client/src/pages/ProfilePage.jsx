import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Card from '../components/common/Card';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-wrapper">
      <div className="container page-content" style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-2xl)' }}>Profile</h1>
        <Card hover={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
            <Avatar name={user?.name} size={72} />
            <div>
              <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{user?.name || 'User'}</h2>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            padding: 'var(--space-sm) var(--space-xl)', background: 'rgba(255,71,87,0.1)',
            color: 'var(--live)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: 'var(--fs-sm)',
          }}>
            Sign Out
          </button>
        </Card>
      </div>
    </div>
  );
}