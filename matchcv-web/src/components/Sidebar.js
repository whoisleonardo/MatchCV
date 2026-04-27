import React from 'react';
import Icon from './Icon';

export default function Sidebar({ t, lang, currentScreen, setScreen }) {
  const nav = [
    { id: 'dashboard', label: t.dashboard, icon: 'user' },
    { id: 'generate', label: t.generate, icon: 'sparkle' },
    { id: 'history', label: t.history, icon: 'file' },
    { id: 'plans', label: lang === 'pt' ? 'Planos' : 'Plans', icon: 'bolt' },
    { id: 'settings', label: t.settings, icon: 'settings' },
  ];

  return (
    <aside style={{
      width: 240, flexShrink: 0, padding: 24,
      display: 'flex', flexDirection: 'column', gap: 28,
      borderRight: '1px solid var(--line)', background: 'var(--bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'var(--ink)', color: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>M</div>
        <div>
          <div style={{ fontWeight: 650, fontSize: 15, letterSpacing: '-0.01em' }}>{t.appName}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: -1 }}>{t.tagline}</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(n => {
          const active = currentScreen === n.id || (n.id === 'generate' && currentScreen === 'done');
          return (
            <button key={n.id} onClick={() => setScreen(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 8, fontSize: 13.5,
              fontWeight: 500, letterSpacing: '-0.005em',
              color: active ? 'var(--ink)' : 'var(--ink-3)',
              background: active ? 'var(--surface-2)' : 'transparent',
              textAlign: 'left', transition: 'background 120ms',
              width: '100%',
            }}>
              <Icon name={n.icon} size={16} />{n.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          padding: 14, borderRadius: 12, background: 'var(--surface-2)',
          fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="info" size={14} />
            {lang === 'pt' ? 'Dica' : 'Tip'}
          </div>
          {lang === 'pt'
            ? 'Adicione 3+ experiências para ter o melhor resultado.'
            : 'Add 3+ experiences to get the best tailoring.'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-4)', textAlign: 'center' }}>{t.poweredBy}</div>
      </div>
    </aside>
  );
}
