import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function DoneScreen({ t, lang, onAgain, onBack }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse at 50% 20%, var(--accent-soft) 0%, transparent 60%)',
      padding: 40, gap: 32,
    }}>
      <div style={{
        width: 76, height: 76, borderRadius: 999,
        background: 'var(--success-soft)', color: 'var(--success)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 0 0 2px var(--success)',
        animation: 'mcv-fadeup 500ms ease both',
      }}>
        <Icon name="check" size={38} stroke={2.6} />
      </div>

      <div style={{ textAlign: 'center', maxWidth: 480, animation: 'mcv-fadeup 600ms 100ms ease both' }}>
        <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.15 }}>
          {t.readyTitle}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-3)', marginTop: 12, marginBottom: 0, lineHeight: 1.55 }}>
          {t.readySub}
        </p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '18px 22px', background: 'var(--surface)',
        borderRadius: 14, boxShadow: 'var(--shadow-lg)',
        minWidth: 420, animation: 'mcv-fadeup 700ms 200ms ease both',
      }}>
        <div style={{
          width: 48, height: 60, borderRadius: 6, background: '#fff',
          boxShadow: 'inset 0 0 0 1px var(--line-2), 0 2px 0 rgba(0,0,0,0.02)',
          padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: 2, position: 'relative',
        }}>
          <div style={{ height: 2, background: '#1a1a1a', width: '80%', borderRadius: 1 }} />
          <div style={{ height: 1, background: '#bbb', width: '60%' }} />
          <div style={{ height: 1, background: '#ddd', width: '95%', marginTop: 3 }} />
          <div style={{ height: 1, background: '#ddd', width: '90%' }} />
          <div style={{ height: 1, background: '#ddd', width: '85%' }} />
          <div style={{ height: 1, background: '#ddd', width: '88%' }} />
          <div style={{ position: 'absolute', top: -4, right: -4, background: 'var(--success)', color: '#fff', width: 18, height: 18, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={11} stroke={3.5} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em' }}>cv_ana_ribeiro.pdf</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, display: 'flex', gap: 10 }}>
            <span>184 KB</span><span>·</span>
            <span>{lang === 'pt' ? '1 página' : '1 page'}</span><span>·</span>
            <span style={{ color: 'var(--success)', fontWeight: 550 }}>{lang === 'pt' ? 'Nota 83' : 'Score 83'}</span>
          </div>
        </div>
        <Button variant="primary" icon="download">{t.downloadPdf}</Button>
      </div>

      <div style={{ display: 'flex', gap: 10, animation: 'mcv-fadeup 700ms 300ms ease both' }}>
        <Button variant="secondary" icon="sparkle" onClick={onAgain}>{t.openAgain}</Button>
        <Button variant="ghost" icon="arrowLeft" onClick={onBack}>{t.dashboard}</Button>
      </div>

      <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--ink-4)', animation: 'mcv-fadeup 700ms 450ms ease both' }}>
        {['ATS-safe', 'LaTeX', lang === 'pt' ? 'Texto selecionável' : 'Selectable text'].map((label) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={12} stroke={3} />{label}
          </span>
        ))}
      </div>
    </div>
  );
}
