import React, { useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const colors = {
    success: 'var(--accent-primary)',
    error: 'var(--live)',
    info: 'var(--accent-secondary)',
    warning: 'var(--draw)',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 'var(--space-xl)', right: 'var(--space-xl)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)',
        zIndex: 'var(--z-toast)', pointerEvents: 'none',
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            background: 'var(--bg-elevated)',
            border: `1px solid ${colors[toast.type] || colors.info}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md) var(--space-lg)',
            fontSize: 'var(--fs-sm)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideInRight 0.3s ease',
            pointerEvents: 'auto',
            maxWidth: 360,
          }}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default function Toast() { return null; }
