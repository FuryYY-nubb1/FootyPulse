import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatPosition(pos) {
  const map = {
    GK: 'Goalkeeper', CB: 'Defender', LB: 'Defender', RB: 'Defender',
    CDM: 'Midfielder', CM: 'Midfielder', CAM: 'Midfielder',
    LW: 'Forward', RW: 'Forward', ST: 'Forward',
  };
  return map[pos] || pos || '—';
}

function formatDOB(dob) {
  if (!dob) return '—';
  const d = new Date(dob);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function PlayerHeader({ player, currentContract }) {
  if (!player) return null;

  const age = calculateAge(player.date_of_birth);
  const jerseyNumber = currentContract?.jersey_number || player.jersey_number;
  const teamName = currentContract?.team_name || player.team_name;
  const teamLogo = currentContract?.team_logo || currentContract?.logo_url || player.team_logo;

  // Split name for display
  const firstName = player.first_name || player.name?.split(' ')[0] || '';
  const lastName = player.last_name || player.name?.split(' ').slice(1).join(' ') || '';

  return (
    <div>
      {/* Main Header Card */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--gradient-card)',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Accent top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'var(--gradient-accent)',
        }} />

        {/* Large faded jersey number background */}
        {jerseyNumber && (
          <div style={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(8rem, 20vw, 14rem)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.02)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            {jerseyNumber}
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2xl)',
          padding: 'var(--space-2xl) var(--space-2xl) var(--space-xl)',
          position: 'relative',
          zIndex: 1,
          flexWrap: 'wrap',
        }}>
          {/* Player Photo */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: '3px solid var(--border-default)',
            background: 'var(--bg-tertiary)',
          }}>
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.name || player.display_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <Avatar name={player.name || player.display_name} size={120} />
            )}
          </div>

          {/* Name + Club */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              lineHeight: 1.05,
              marginBottom: 'var(--space-md)',
            }}>
              <span style={{
                display: 'block',
                fontSize: 'var(--fs-xl)',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                {firstName}
              </span>
              <span style={{
                display: 'block',
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
              }}>
                {lastName || firstName}
              </span>
            </h1>

            {/* Club badge + name */}
            {teamName && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
              }}>
                {teamLogo && (
                  <img
                    src={teamLogo}
                    alt={teamName}
                    style={{ width: 28, height: 28, objectFit: 'contain' }}
                  />
                )}
                <span style={{
                  fontSize: 'var(--fs-md)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {teamName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Player Bio Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(255,255,255,0.015)',
        }}>
          {/* Nationality */}
          <BioCell
            label="Nationality"
            value={
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                {player.nationality_code && (
                  <img
                    src={`https://flagcdn.com/24x18/${player.nationality_code.toLowerCase().slice(0, 2)}.png`}
                    alt=""
                    style={{ width: 20, height: 14, objectFit: 'cover', borderRadius: 2 }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                {player.nationality || '—'}
              </span>
            }
          />

          {/* Shirt Number */}
          <BioCell
            label="Shirt Number"
            value={jerseyNumber || '—'}
            mono
          />

          {/* Date of Birth */}
          <BioCell
            label="Date Of Birth"
            value={formatDOB(player.date_of_birth)}
            mono
          />

          {/* Age */}
          <BioCell
            label="Age"
            value={age || '—'}
            mono
          />

          {/* Position */}
          <BioCell
            label="Position"
            value={formatPosition(player.primary_position)}
          />

          {/* Height */}
          {player.height_cm && (
            <BioCell
              label="Height"
              value={`${player.height_cm} cm`}
              mono
            />
          )}

          {/* Preferred Foot */}
          {player.preferred_foot && (
            <BioCell
              label="Preferred Foot"
              value={player.preferred_foot.charAt(0).toUpperCase() + player.preferred_foot.slice(1)}
            />
          )}

          {/* Market Value */}
          {player.market_value && parseFloat(player.market_value) > 0 && (
            <BioCell
              label="Market Value"
              value={formatMarketValue(player.market_value)}
              accent
            />
          )}
        </div>
      </div>
    </div>
  );
}

function BioCell({ label, value, mono, accent }) {
  return (
    <div style={{
      padding: 'var(--space-lg) var(--space-xl)',
      borderRight: '1px solid var(--border-subtle)',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: mono ? 'var(--fs-lg)' : 'var(--fs-md)',
        fontWeight: 700,
        fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        color: accent ? 'var(--accent-primary)' : 'var(--text-primary)',
        marginBottom: 'var(--space-xs)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 'var(--fs-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 500,
      }}>
        {label}
      </div>
    </div>
  );
}

function formatMarketValue(val) {
  const num = parseFloat(val);
  if (!num) return '—';
  if (num >= 1000000) return `€${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `€${(num / 1000).toFixed(0)}K`;
  return `€${num}`;
}