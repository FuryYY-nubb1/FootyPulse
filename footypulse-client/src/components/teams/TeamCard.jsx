import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';

export default function TeamCard({ team }) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/teams/${team.team_id}`)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{
          width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
          overflow: 'hidden',
        }}>
          {team.logo_url ? <img src={team.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : (team.name || 'T')[0]}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>{team.name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {team.country_name || ''} {team.founded_year ? `• Est. ${team.founded_year}` : ''}
          </div>
        </div>
      </div>
    </Card>
  );
}