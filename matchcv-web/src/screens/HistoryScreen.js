import React from 'react';
import Icon from '../components/Icon';
import { Card } from '../components/Card';

export default function HistoryScreen({ lang, setScreen }) {
  const pt = lang === 'pt';

  return (
    <div style={{ padding: '32px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em', margin: 0 }}>
          {pt ? 'Histórico' : 'History'}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>
          {pt ? 'Todos os CVs que você gerou.' : 'Every CV you have generated.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: pt ? 'Total gerado' : 'Total generated', value: '0' },
          { label: pt ? 'Nota média' : 'Avg. score', value: '—' },
          { label: pt ? 'Melhor nota' : 'Best score', value: '—' },
          { label: pt ? 'Este mês' : 'This month', value: '0' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: 'var(--ink)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <Icon name="file" size={36} style={{ color: 'var(--ink-4)' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-2)' }}>
            {pt ? 'Nenhum CV gerado ainda' : 'No CVs generated yet'}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-3)', maxWidth: 380, lineHeight: 1.55 }}>
            {pt
              ? 'Adapte seu currículo a uma vaga e o CV aparecerá aqui com a nota e a data.'
              : 'Tailor your CV to a job posting and it will appear here with its score and date.'}
          </div>
          <button
            onClick={() => setScreen('generate')}
            style={{
              marginTop: 8, padding: '10px 20px', borderRadius: 10,
              background: 'var(--accent)', color: '#fff',
              fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            <Icon name="sparkle" size={14} />
            {pt ? 'Gerar primeiro CV' : 'Generate first CV'}
          </button>
        </div>
      </Card>
    </div>
  );
}
