import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

export default function PlayerCard({ player }) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/players/${player.id}`)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <Avatar src={player.photo} name={player.name} size={48} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>{player.name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {player.position || ''} {player.team_name ? `• ${player.team_name}` : ''}
          </div>
        </div>
      </div>
    </Card>
  );
}
