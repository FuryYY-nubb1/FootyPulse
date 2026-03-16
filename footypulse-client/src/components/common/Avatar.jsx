import React from 'react';
import { getInitials } from '../../utils/helpers';

export default function Avatar({ src, name, size = 40, style: customStyle = {} }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || ''}
        style={{
          width: size, height: size, borderRadius: 'var(--radius-full)',
          objectFit: 'cover', background: 'var(--bg-tertiary)',
          ...customStyle,
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: 'var(--radius-full)',
      background: 'var(--gradient-accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: 'var(--text-inverse)',
      flexShrink: 0,
      ...customStyle,
    }}>
      {getInitials(name)}
    </div>
  );
}
