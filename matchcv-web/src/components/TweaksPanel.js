import React from 'react';
import Icon from './Icon';

function SegButton({ active, onClick, icon, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '8px 10px', borderRadius: 8,
      fontSize: 12.5, fontWeight: 550,
      background: active ? 'var(--surface)' : 'transparent',
      color: active ? 'var(--ink)' : 'var(--ink-3)',
      boxShadow: active ? 'var(--shadow-sm)' : 'none',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      transition: 'all 120ms',
    }}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </button>
  );
}

export function TweaksPanel({ open, setOpen, theme, setTheme, lang, setLang, t }) {
  if (!open) return null;

  const Row = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
        {label}
      </div>
      {children}
    </div>
  );

  const Seg = ({ children }) => (
    <div style={{ display: 'flex', gap: 3, padding: 3, background: 'var(--surface-2)', borderRadius: 10 }}>
      {children}
    </div>
  );

  return (
    <div style={{
      position: 'fixed', bottom: 22, right: 22, zIndex: 100,
      width: 290, padding: 18,
      background: 'var(--surface)', color: 'var(--ink)',
      borderRadius: 16, boxShadow: 'var(--shadow-lg)',
      display: 'flex', flexDirection: 'column', gap: 16,
      animation: 'mcv-fadeup 220ms ease both',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="settings" size={14} />
          <span style={{ fontSize: 13, fontWeight: 650 }}>{t.tweaks}</span>
        </div>
        <button onClick={() => setOpen(false)} style={{ color: 'var(--ink-3)' }}>
          <Icon name="close" size={16} />
        </button>
      </div>

      <Row label={t.theme}>
        <Seg>
          <SegButton active={theme === 'light'} onClick={() => setTheme('light')} icon="sun">{t.light}</SegButton>
          <SegButton active={theme === 'dark'} onClick={() => setTheme('dark')} icon="moon">{t.dark}</SegButton>
        </Seg>
      </Row>

      <Row label={t.language}>
        <Seg>
          <SegButton active={lang === 'en'} onClick={() => setLang('en')}>English</SegButton>
          <SegButton active={lang === 'pt'} onClick={() => setLang('pt')}>Português</SegButton>
        </Seg>
      </Row>
    </div>
  );
}

export function TweaksToggle({ open, setOpen }) {
  if (open) return null;
  return (
    <button onClick={() => setOpen(true)} style={{
      position: 'fixed', bottom: 22, right: 22, zIndex: 100,
      width: 44, height: 44, borderRadius: 999,
      background: 'var(--surface)', color: 'var(--ink)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name="settings" size={18} />
    </button>
  );
}
