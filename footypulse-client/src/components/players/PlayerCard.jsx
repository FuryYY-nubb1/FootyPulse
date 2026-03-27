import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

export default function PlayerCard({ player }) {
  const navigate = useNavigate();

  const id       = player.person_id   || player.id;
  const name     = player.display_name || player.name;
  const photo    = player.photo_url   || player.photo;
  const position = player.primary_position || player.position || '';

  return (
    <Card onClick={() => navigate(`/players/${id}`)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <Avatar src={photo} name={name} size={48} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>{name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {position}{player.team_name ? ` • ${player.team_name}` : ''}
          </div>
        </div>
      </div>
    </Card>
  );
}
