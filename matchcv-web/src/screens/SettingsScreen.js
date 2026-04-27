import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { Card, Badge } from '../components/Card';
import { api } from '../api';

function EditProfileForm({ profile, lang, onSave, onCancel }) {
  const pt = lang === 'pt';
  const [form, setForm] = React.useState({
    fullName:  profile?.fullName  || '',
    title:     profile?.title     || '',
    phone:     profile?.phone     || '',
    location:  profile?.location  || '',
    linkedin:  profile?.linkedin  || '',
    summary:   profile?.summary?.en || '',
    skills:    (profile?.skills || []).join(', '),
  });
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState('');

  const field = (key) => ({
    value: form[key],
    onChange: e => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    background: 'var(--surface-2)', border: 'none', outline: 'none',
    boxShadow: 'inset 0 0 0 1px var(--line-2)',
    fontSize: 13.5, color: 'var(--ink)', fontFamily: 'inherit',
  };

  const save = async () => {
    setSaving(true); setErr('');
    try {
      const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.profile.update({
        fullName:  form.fullName  || null,
        title:     form.title     || null,
        phone:     form.phone     || null,
        location:  form.location  || null,
        linkedin:  form.linkedin  || null,
        summary:   form.summary   || null,
        skills:    skills.length ? skills : null,
      });
      await onSave();
    } catch {
      setErr(pt ? 'Erro ao salvar. Tente novamente.' : 'Failed to save. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>
            {pt ? 'Nome completo' : 'Full name'}
          </label>
          <input style={inputStyle} {...field('fullName')} />
        </div>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>
            {pt ? 'Cargo / Título' : 'Title'}
          </label>
          <input style={inputStyle} {...field('title')} placeholder={pt ? 'Ex: Backend Engineer' : 'e.g. Backend Engineer'} />
        </div>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>
            {pt ? 'Telefone' : 'Phone'}
          </label>
          <input style={inputStyle} {...field('phone')} placeholder="+55 11 99999-9999" />
        </div>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>
            {pt ? 'Localização' : 'Location'}
          </label>
          <input style={inputStyle} {...field('location')} placeholder={pt ? 'São Paulo, Brasil' : 'San Francisco, CA'} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>
            LinkedIn
          </label>
          <input style={inputStyle} {...field('linkedin')} placeholder="linkedin.com/in/seuperfil" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>
            {pt ? 'Resumo profissional' : 'Professional summary'}
          </label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: 80, lineHeight: 1.55 }}
            {...field('summary')}
            placeholder={pt ? 'Descreva sua trajetória e especialidade em 2-3 frases.' : 'Describe your background and expertise in 2-3 sentences.'}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>
            {pt ? 'Habilidades' : 'Skills'}
            <span style={{ fontWeight: 400, marginLeft: 4 }}>({pt ? 'separadas por vírgula' : 'comma-separated'})</span>
          </label>
          <input style={inputStyle} {...field('skills')} placeholder="Java, Spring Boot, Kafka, AWS" />
        </div>
      </div>
      {err && (
        <div style={{ padding: '8px 12px', borderRadius: 8, fontSize: 12.5, background: 'var(--warn-soft)', color: 'var(--warn)' }}>
          {err}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" onClick={onCancel}>{pt ? 'Cancelar' : 'Cancel'}</Button>
        <Button variant="accent" size="sm" onClick={save}>
          {saving ? (pt ? 'Salvando…' : 'Saving…') : (pt ? 'Salvar' : 'Save')}
        </Button>
      </div>
    </div>
  );
}

export default function SettingsScreen({ t, lang, theme, setTheme, setLang, onLogout, profile, setScreen, onProfileUpdate }) {
  const pt = lang === 'pt';
  const [editing, setEditing] = React.useState(false);

  const Section = ({ title, desc, children }) => (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em', marginBottom: 4 }}>{title}</div>
      {desc && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 14 }}>{desc}</div>}
      {children}
    </Card>
  );

  const Row = ({ label, desc, children, last, onClick }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 0', borderBottom: last ? 'none' : '1px solid var(--line)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  const Seg = ({ options, value, onChange }) => (
    <div style={{ display: 'flex', gap: 3, padding: 3, background: 'var(--surface-2)', borderRadius: 10 }}>
      {options.map(o => (
        <button key={o.k} onClick={() => onChange(o.k)} style={{
          padding: '6px 12px', borderRadius: 7, fontSize: 12.5, fontWeight: 550,
          background: value === o.k ? 'var(--surface)' : 'transparent',
          color: value === o.k ? 'var(--ink)' : 'var(--ink-3)',
          boxShadow: value === o.k ? 'var(--shadow-sm)' : 'none',
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          {o.icon && <Icon name={o.icon} size={12} />}{o.l}
        </button>
      ))}
    </div>
  );

  const Toggle = ({ on }) => (
    <div style={{ width: 36, height: 20, borderRadius: 10, background: on ? 'var(--success)' : 'var(--surface-3)', position: 'relative', flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: 999, background: '#fff', position: 'absolute', top: 2, right: on ? 2 : undefined, left: on ? undefined : 2, transition: 'all 200ms' }} />
    </div>
  );

  const planLabel = profile?.plan === 'FREE' ? 'Free' : profile?.plan === 'LIFETIME' ? 'Lifetime' : profile?.plan === 'PRO' ? 'Pro' : '—';
  const planTone  = profile?.plan === 'FREE' ? 'neutral' : 'accent';

  return (
    <div style={{ padding: '32px 40px 60px', maxWidth: 820, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em', margin: 0 }}>
          {pt ? 'Ajustes' : 'Settings'}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>
          {pt ? 'Preferências da conta e do aplicativo.' : 'Account and app preferences.'}
        </p>
      </div>

      <Section title={pt ? 'Conta' : 'Account'}>
        {editing ? (
          <EditProfileForm
            profile={profile} lang={lang}
            onSave={async () => { await onProfileUpdate(); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <Row label={profile?.fullName || profile?.username || '—'} desc={profile?.email || (pt ? 'Sem e-mail' : 'No email')}>
              <Button variant="secondary" size="sm" icon="pencil" onClick={() => setEditing(true)}>
                {pt ? 'Editar' : 'Edit'}
              </Button>
            </Row>
            <Row label={pt ? 'Cargo / Título' : 'Title'} desc={profile?.title || (pt ? 'Não preenchido' : 'Not set')}>
              {!profile?.title && (
                <Button variant="secondary" size="sm" icon="plus" onClick={() => setEditing(true)}>
                  {pt ? 'Adicionar' : 'Add'}
                </Button>
              )}
            </Row>
            <Row
              label={pt ? 'Plano' : 'Plan'}
              desc={profile?.plan === 'FREE'
                ? (pt ? '3 gerações/mês incluídas' : '3 generations/month included')
                : (pt ? 'Gerações ilimitadas' : 'Unlimited generations')}
              last
              onClick={profile?.plan === 'FREE' ? () => setScreen('plans') : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge tone={planTone}>{planLabel}</Badge>
                {profile?.plan === 'FREE' && (
                  <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
                    {pt ? 'Upgrade →' : 'Upgrade →'}
                  </span>
                )}
              </div>
            </Row>
          </>
        )}
      </Section>

      <Section
        title={pt ? 'Aparência' : 'Appearance'}
        desc={pt ? 'Tema e idioma da interface.' : 'Theme and interface language.'}
      >
        <Row label={pt ? 'Tema' : 'Theme'}>
          <Seg value={theme} onChange={setTheme} options={[
            { k: 'light', l: pt ? 'Claro' : 'Light', icon: 'sun' },
            { k: 'dark',  l: pt ? 'Escuro' : 'Dark', icon: 'moon' },
          ]} />
        </Row>
        <Row label={pt ? 'Idioma' : 'Language'} last>
          <Seg value={lang} onChange={setLang} options={[
            { k: 'en', l: 'English' },
            { k: 'pt', l: 'Português' },
          ]} />
        </Row>
      </Section>

      <Section
        title={pt ? 'Geração de CV' : 'CV generation'}
        desc={pt ? 'Como a IA reescreve seus bullets.' : 'How the AI rewrites your bullets.'}
      >
        <Row
          label={pt ? 'Tom padrão' : 'Default tone'}
          desc={pt ? 'Aplicado quando a vaga não indica um.' : 'Applied when the job posting is neutral.'}
        >
          <Seg value="balanced" onChange={() => {}} options={[
            { k: 'balanced', l: pt ? 'Equilibrado' : 'Balanced' },
            { k: 'bold',     l: pt ? 'Ousado' : 'Bold' },
          ]} />
        </Row>
        <Row
          label={pt ? 'Manter métricas originais' : 'Keep original metrics'}
          desc={pt ? 'A IA nunca inventa números que não estão no seu perfil.' : "The AI never invents numbers not in your profile."}
          last
        >
          <Toggle on />
        </Row>
      </Section>

      <Section title={pt ? 'Zona de perigo' : 'Danger zone'}>
        <Row
          label={pt ? 'Sair' : 'Sign out'}
          desc={pt ? 'Você precisará entrar novamente para acessar.' : 'You will need to sign in again to access.'}
        >
          <Button variant="secondary" size="sm" icon="arrowLeft" onClick={onLogout}>
            {pt ? 'Sair' : 'Sign out'}
          </Button>
        </Row>
        <Row
          label={pt ? 'Apagar conta' : 'Delete account'}
          desc={pt ? 'Perfil, experiências e histórico são apagados permanentemente.' : 'Profile, experiences and history are permanently deleted.'}
          last
        >
          <Button variant="secondary" size="sm" icon="trash" style={{ color: 'var(--danger)', boxShadow: 'inset 0 0 0 1px var(--danger)' }}>
            {pt ? 'Apagar' : 'Delete'}
          </Button>
        </Row>
      </Section>
    </div>
  );
}
