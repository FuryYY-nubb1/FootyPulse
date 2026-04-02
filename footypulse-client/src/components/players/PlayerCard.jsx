import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

export default function PlayerCard({ player }) {
  const navigate = useNavigate();

  // Normalize field names — search API returns person_id/display_name/photo_url/primary_position
  // while other parts of the app may use id/name/photo/position
  const id = player.person_id || player.id;
  const name = player.display_name || player.name || player.player_name || '';
  const photo = player.photo_url || player.photo || null;
  const position = player.primary_position || player.position || '';
  const teamName = player.team_name || '';
  const personType = player.person_type || '';

  // Format position code to readable text
  const positionMap = {
    GK: 'Goalkeeper', CB: 'Defender', LB: 'Defender', RB: 'Defender',
    CDM: 'Midfielder', CM: 'Midfielder', CAM: 'Midfielder',
    LW: 'Forward', RW: 'Forward', ST: 'Forward',
  };
  const positionLabel = positionMap[position] || position;

  return (
    <Card onClick={() => navigate(`/players/${id}`)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <Avatar src={photo} name={name} size={48} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>{name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {positionLabel}
            {teamName ? ` • ${teamName}` : ''}
            {!teamName && personType && personType !== 'player' ? ` • ${personType.charAt(0).toUpperCase() + personType.slice(1)}` : ''}
          </div>
        </div>
      </div>
    </Card>
  );
}