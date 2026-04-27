import React from 'react';

export function Card({ children, style = {}, padded = true, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: padded ? 24 : 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Badge({ tone = 'neutral', children, style = {} }) {
  const tones = {
    neutral: { background: 'var(--surface-3)', color: 'var(--ink-2)' },
    accent: { background: 'var(--accent-soft)', color: 'var(--accent-soft-ink)' },
    success: { background: 'var(--success-soft)', color: 'var(--success)' },
    warn: { background: 'var(--warn-soft)', color: 'var(--warn)' },
    outline: { background: 'transparent', color: 'var(--ink-3)', boxShadow: 'inset 0 0 0 1px var(--line)' },
  }[tone];

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px', borderRadius: 999, fontSize: 12, fontWeight: 550,
      letterSpacing: '-0.005em', lineHeight: 1.4, whiteSpace: 'nowrap',
      ...tones, ...style,
    }}>
      {children}
    </span>
  );
}
