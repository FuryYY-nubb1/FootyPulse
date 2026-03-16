import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          [align]: 0,
          marginTop: 'var(--space-sm)',
          minWidth: 180,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-sm)',
          zIndex: 'var(--z-dropdown)',
          animation: 'fadeIn 0.15s ease',
        }}>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { onClick: () => { child.props.onClick?.(); setOpen(false); } })
          )}
        </div>
      )}
    </div>
  );
}
