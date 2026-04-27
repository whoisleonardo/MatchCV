import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { api } from '../api';

const STEPS = ['basic', 'skills', 'summary'];

export default function OnboardingScreen({ lang, profile, onDone }) {
  const pt = lang === 'pt';
  const [step, setStep] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState('');

  const [form, setForm] = React.useState({
    fullName: profile?.fullName || '',
    title:    profile?.title    || '',
    phone:    profile?.phone    || '',
    location: profile?.location || '',
    linkedin: profile?.linkedin || '',
    skills:   '',
    summary:  '',
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: 'var(--surface)', border: 'none', outline: 'none',
    boxShadow: 'inset 0 0 0 1px var(--line-2)',
    fontSize: 14, color: 'var(--ink)', fontFamily: 'inherit',
  };

  const canAdvance = [
    form.fullName.trim() && form.title.trim(),   // basic
    form.skills.trim(),                           // skills
    true,                                         // summary optional
  ][step];

  const save = async () => {
    setSaving(true); setErr('');
    try {
      const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.profile.update({
        fullName: form.fullName || null,
        title:    form.title    || null,
        phone:    form.phone    || null,
        location: form.location || null,
        linkedin: form.linkedin || null,
        summary:  form.summary  || null,
        skills:   skills.length ? skills : null,
      });
      onDone();
    } catch {
      setErr(pt ? 'Erro ao salvar. Tente novamente.' : 'Failed to save. Try again.');
      setSaving(false);
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else save();
  };

  const firstName = profile?.fullName?.split(' ')[0] || '';

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--ink)', color: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16,
          }}>M</div>
          <span style={{ fontWeight: 650, fontSize: 16, letterSpacing: '-0.01em' }}>MatchCV</span>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              height: 3, flex: 1, borderRadius: 999,
              background: i <= step ? 'var(--accent)' : 'var(--line-2)',
              transition: 'background 300ms',
            }} />
          ))}
        </div>

        {/* Step: basic */}
        {step === 0 && (
          <div style={{ animation: 'mcv-fadeup 300ms ease both' }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>
                {firstName
                  ? (pt ? `Oi, ${firstName}! Vamos montar seu perfil.` : `Hey ${firstName}! Let's set up your profile.`)
                  : (pt ? 'Vamos montar seu perfil.' : "Let's set up your profile.")}
              </h1>
              <p style={{ fontSize: 14.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.55 }}>
                {pt
                  ? 'Esses dados aparecem no cabeçalho do seu CV. Leva menos de 2 minutos.'
                  : 'This info appears in your CV header. Takes less than 2 minutes.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 6 }}>
                    {pt ? 'Nome completo' : 'Full name'} <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input style={inputStyle} value={form.fullName} onChange={set('fullName')}
                    placeholder={pt ? 'Ana Ribeiro' : 'Jane Smith'} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 6 }}>
                    {pt ? 'Cargo / Título' : 'Title'} <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input style={inputStyle} value={form.title} onChange={set('title')}
                    placeholder={pt ? 'Backend Engineer' : 'Backend Engineer'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 6 }}>
                    {pt ? 'Localização' : 'Location'}
                  </label>
                  <input style={inputStyle} value={form.location} onChange={set('location')}
                    placeholder={pt ? 'São Paulo, Brasil' : 'San Francisco, CA'} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 6 }}>
                    {pt ? 'Telefone' : 'Phone'}
                  </label>
                  <input style={inputStyle} value={form.phone} onChange={set('phone')}
                    placeholder="+55 11 99999-9999" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 6 }}>
                  LinkedIn
                </label>
                <input style={inputStyle} value={form.linkedin} onChange={set('linkedin')}
                  placeholder="linkedin.com/in/seuperfil" />
              </div>
            </div>
          </div>
        )}

        {/* Step: skills */}
        {step === 1 && (
          <div style={{ animation: 'mcv-fadeup 300ms ease both' }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>
                {pt ? 'Quais são suas principais habilidades?' : "What are your main skills?"}
              </h1>
              <p style={{ fontSize: 14.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.55 }}>
                {pt
                  ? 'Liste tecnologias, linguagens e ferramentas separadas por vírgula. A IA usa isso para alinhar seu CV à vaga.'
                  : 'List technologies, languages and tools, comma-separated. The AI uses these to align your CV to the job.'}
              </p>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 6 }}>
                {pt ? 'Habilidades' : 'Skills'} <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: 'vertical', lineHeight: 1.6 }}
                value={form.skills}
                onChange={set('skills')}
                placeholder="Java, Spring Boot, Kafka, AWS, Docker, Kubernetes, PostgreSQL, Cassandra"
              />
              {form.skills.trim() && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} style={{
                      padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                      background: 'var(--accent-soft)', color: 'var(--accent-soft-ink)',
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: summary */}
        {step === 2 && (
          <div style={{ animation: 'mcv-fadeup 300ms ease both' }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>
                {pt ? 'Um resumo sobre você.' : 'A quick summary about you.'}
              </h1>
              <p style={{ fontSize: 14.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.55 }}>
                {pt
                  ? '2–3 frases sobre sua trajetória e especialidade. A IA adapta esse texto para cada vaga.'
                  : '2–3 sentences about your background and expertise. The AI tailors this for each job.'}
              </p>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 6 }}>
                {pt ? 'Resumo profissional' : 'Professional summary'}
                <span style={{ fontWeight: 400, marginLeft: 4, color: 'var(--ink-4)' }}>({pt ? 'opcional' : 'optional'})</span>
              </label>
              <textarea
                style={{ ...inputStyle, minHeight: 140, resize: 'vertical', lineHeight: 1.6 }}
                value={form.summary}
                onChange={set('summary')}
                placeholder={pt
                  ? 'Engenheira backend com 5+ anos construindo sistemas distribuídos em Java e Go. Especialista em APIs de alta performance e observabilidade.'
                  : 'Backend engineer with 5+ years building distributed systems in Java and Go. Focused on high-performance APIs and observability.'}
              />
            </div>
            {err && (
              <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, fontSize: 12.5, background: 'var(--warn-soft)', color: 'var(--warn)' }}>
                {err}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
          <div>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                fontSize: 13.5, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
              }}>
                <Icon name="arrowLeft" size={14} />
                {pt ? 'Voltar' : 'Back'}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {step < STEPS.length - 1 && (
              <button onClick={onDone} style={{ fontSize: 13, color: 'var(--ink-4)', fontFamily: 'inherit' }}>
                {pt ? 'Pular por agora' : 'Skip for now'}
              </button>
            )}
            <Button
              variant="accent" size="lg"
              iconRight={step < STEPS.length - 1 ? 'arrow' : undefined}
              onClick={next}
              disabled={!canAdvance}
            >
              {saving
                ? (pt ? 'Salvando…' : 'Saving…')
                : step < STEPS.length - 1
                  ? (pt ? 'Continuar' : 'Continue')
                  : (pt ? 'Começar' : 'Get started')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
