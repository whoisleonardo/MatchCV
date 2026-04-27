import React from 'react';
import Icon from './Icon';

export default function Button({ variant = 'primary', size = 'md', icon, iconRight, children, style = {}, ...rest }) {
  const sizes = {
    sm: { h: 30, px: 12, fs: 13, gap: 6 },
    md: { h: 38, px: 16, fs: 14, gap: 8 },
    lg: { h: 48, px: 22, fs: 15, gap: 10 },
  }[size];

  const variants = {
    primary: { background: 'var(--ink)', color: 'var(--bg)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' },
    accent: { background: 'var(--accent)', color: 'var(--accent-ink)', boxShadow: '0 1px 0 rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)' },
    secondary: { background: 'var(--surface)', color: 'var(--ink)', boxShadow: 'inset 0 0 0 1px var(--line-2)' },
    ghost: { background: 'transparent', color: 'var(--ink-2)' },
  }[variant];

  return (
    <button
      {...rest}
      style={{
        height: sizes.h,
        padding: `0 ${sizes.px}px`,
        fontSize: sizes.fs,
        fontWeight: 550,
        letterSpacing: '-0.005em',
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizes.gap,
        transition: 'transform 120ms ease, background 120ms ease, opacity 120ms ease',
        whiteSpace: 'nowrap',
        ...variants,
        ...style,
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; rest.onMouseDown?.(e); }}
      onMouseUp={e => { e.currentTarget.style.transform = ''; rest.onMouseUp?.(e); }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; rest.onMouseLeave?.(e); }}
    >
      {icon && <Icon name={icon} size={sizes.fs + 2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sizes.fs + 2} />}
    </button>
  );
}
