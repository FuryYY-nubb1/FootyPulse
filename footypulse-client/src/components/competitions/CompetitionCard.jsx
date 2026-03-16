import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';

export default function CompetitionCard({ competition }) {
  const navigate = useNavigate();
  
  return (
    <Card onClick={() => navigate(`/competitions/${competition.competition_id}`)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{
          width: 48, 
          height: 48, 
          borderRadius: 'var(--radius-md)', 
          background: 'white',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '1.5rem',
          overflow: 'hidden', 
          flexShrink: 0,
          padding: '8px',
        }}>
          {competition.logo_url ? (
            <img 
              src={competition.logo_url} 
              alt={competition.name} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
              }} 
            />
          ) : (
            '🏆'
          )}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{competition.name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {competition.country_name || ''} {competition.competition_type ? `• ${competition.competition_type}` : ''}
          </div>
        </div>
      </div>
    </Card>
  );
}