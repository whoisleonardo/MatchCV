import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { oauthUrl } from '../api';

export default function RegisterScreen({ t, lang, onLogin, onPlans, setLang, theme, setTheme }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');

  const submit = (e) => {
    e?.preventDefault();
    setErr('');
    if (!name || !email || !password) {
      setErr(lang === 'pt' ? 'Preencha todos os campos.' : 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setErr(lang === 'pt' ? 'A senha deve ter ao menos 6 caracteres.' : 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onPlans(); }, 900);
  };

  const inputStyle = {
    width: '100%', height: 44, padding: '0 14px',
    borderRadius: 10, border: 'none', outline: 'none',
    background: 'var(--surface)',
    boxShadow: 'inset 0 0 0 1px var(--line-2)',
    fontSize: 14, color: 'var(--ink)',
  };

  const oauthBtn = (provider, icon, label) => (
    <button
      key={label}
      onClick={() => { window.location.href = oauthUrl(provider); }}
      style={{
        flex: 1, height: 44, borderRadius: 10, fontSize: 14, fontWeight: 550,
        background: 'var(--surface)', color: 'var(--ink)',
        boxShadow: 'inset 0 0 0 1px var(--line-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'background 120ms', fontFamily: 'inherit', cursor: 'pointer', border: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
    >
      <Icon name={icon} size={16} />{label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
      {/* Left: form */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px 8vw', maxWidth: 560, margin: '0 auto', width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: 'var(--ink)', color: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em',
          }}>M</div>
          <div>
            <div style={{ fontWeight: 650, fontSize: 16, letterSpacing: '-0.01em' }}>{t.appName}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: -2 }}>{t.tagline}</div>
          </div>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>
          {lang === 'pt' ? 'Crie sua conta.' : 'Create your account.'}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-3)', marginTop: 10, marginBottom: 32, lineHeight: 1.55 }}>
          {lang === 'pt' ? 'Comece grátis. Sem cartão de crédito.' : 'Start for free. No credit card required.'}
        </p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {oauthBtn('github', 'github', 'GitHub')}
          {oauthBtn('google', 'globe', 'Google')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontSize: 12, color: 'var(--ink-4)', fontWeight: 500 }}>
            {lang === 'pt' ? 'ou continue com e-mail' : 'or continue with email'}
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
              {lang === 'pt' ? 'Nome completo' : 'Full name'}
            </label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              autoComplete="name" placeholder={lang === 'pt' ? 'Ana Ribeiro' : 'Ana Ribeiro'}
              style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
              {lang === 'pt' ? 'E-mail' : 'Email'}
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email" placeholder={lang === 'pt' ? 'seu@email.com' : 'your@email.com'}
              style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
              {lang === 'pt' ? 'Senha' : 'Password'}
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={lang === 'pt' ? 'Mínimo 6 caracteres' : 'Min. 6 characters'}
              style={inputStyle} />
          </div>
          {err && (
            <div style={{ padding: '10px 12px', borderRadius: 8, fontSize: 12.5, background: 'var(--warn-soft)', color: 'var(--warn)' }}>
              {err}
            </div>
          )}
          <Button variant="accent" size="lg" type="submit" iconRight={loading ? undefined : 'arrow'}
            style={{ justifyContent: 'center', marginTop: 6 }}>
            {loading
              ? (lang === 'pt' ? 'Criando conta…' : 'Creating account…')
              : (lang === 'pt' ? 'Criar conta' : 'Create account')}
          </Button>
        </form>

        <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink-4)', textAlign: 'center', lineHeight: 1.5 }}>
          {lang === 'pt'
            ? 'Ao criar uma conta você concorda com nossos Termos de Uso e Política de Privacidade.'
            : 'By creating an account you agree to our Terms of Service and Privacy Policy.'}
        </div>

        <div style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>
          {lang === 'pt' ? 'Já tem conta? ' : 'Already have an account? '}
          <button onClick={onLogin} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', background: 'none', border: 'none' }}>
            {lang === 'pt' ? 'Entrar' : 'Sign in'}
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 40, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-4)' }}>
          <span>© 2026 {t.appName}</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} style={{ color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Icon name="globe" size={12} />{lang === 'pt' ? 'EN' : 'PT'}
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={12} />
              {theme === 'dark' ? (lang === 'pt' ? 'Claro' : 'Light') : (lang === 'pt' ? 'Escuro' : 'Dark')}
            </button>
          </div>
        </div>
      </div>

      {/* Right: visual panel */}
      <div style={{
        background: 'var(--surface-2)',
        backgroundImage: 'radial-gradient(circle at 30% 60%, var(--success-soft) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--accent-soft) 0%, transparent 40%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 48, gap: 28,
      }}>
        {[
          { icon: 'sparkle', title: lang === 'pt' ? 'IA que realmente entende vagas' : 'AI that actually reads job postings', desc: lang === 'pt' ? 'Reescrevemos seus bullets para combinar as palavras-chave e o tom de cada vaga.' : 'We rewrite your bullets to match each job\'s keywords and tone.' },
          { icon: 'file', title: lang === 'pt' ? 'LaTeX de verdade' : 'Real LaTeX output', desc: lang === 'pt' ? 'PDF profissional, ATS-safe, texto selecionável. Sem imagens, sem formatação quebrada.' : 'Professional PDF, ATS-safe, selectable text. No images, no broken formatting.' },
          { icon: 'target', title: lang === 'pt' ? 'Nota FAANG-ready' : 'FAANG-ready score', desc: lang === 'pt' ? 'Saiba exatamente o quão bem seu currículo se encaixa na vaga antes de enviar.' : 'Know exactly how well your CV fits the job before you apply.' },
        ].map((f, i) => (
          <div key={i} style={{
            display: 'flex', gap: 16, maxWidth: 380,
            padding: '18px 20px', background: 'var(--surface)',
            borderRadius: 14, boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'var(--accent-soft)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={f.icon} size={18} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em', marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
