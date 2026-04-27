import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { oauthUrl, api, getOAuthProvider } from '../api';

export default function LoginScreen({ t, lang, onLogin, onRegister, setLang, theme, setTheme }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading]   = React.useState(false);
  const [err, setErr]           = React.useState('');

  const savedProvider = getOAuthProvider(); // 'google' | 'github' | null

  const submit = async (e) => {
    e?.preventDefault();
    setErr('');
    if (!username || !password) {
      setErr(lang === 'pt' ? 'Preencha usuário e senha.' : 'Fill in username and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.auth.login(username, password);
      await onLogin(res.token, remember);
    } catch {
      setLoading(false);
      setErr(lang === 'pt' ? 'Usuário ou senha incorretos.' : 'Invalid credentials.');
    }
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
      <Icon name={icon} size={16} />
      {label}
    </button>
  );

  const providerLabel = savedProvider === 'github' ? 'GitHub' : 'Google';
  const providerIcon  = savedProvider === 'github' ? 'github' : 'globe';

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
          {lang === 'pt' ? 'Boas-vindas de volta.' : 'Welcome back.'}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-3)', marginTop: 10, marginBottom: 28, lineHeight: 1.55 }}>
          {lang === 'pt' ? 'Entre para adaptar seu currículo à próxima vaga.' : 'Sign in to tailor your CV to the next job.'}
        </p>

        {/* Quick re-login for remembered OAuth provider */}
        {savedProvider && (
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => { window.location.href = oauthUrl(savedProvider); }}
              style={{
                width: '100%', height: 52, borderRadius: 12, fontSize: 14.5, fontWeight: 600,
                background: 'var(--accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontFamily: 'inherit', cursor: 'pointer', border: 'none',
                boxShadow: '0 2px 12px rgba(47,91,234,0.25)',
              }}
            >
              <Icon name={providerIcon} size={18} />
              {lang === 'pt' ? `Continuar com ${providerLabel}` : `Continue with ${providerLabel}`}
            </button>
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <button
                onClick={() => { localStorage.removeItem('mcv.oauth'); window.location.reload(); }}
                style={{ fontSize: 12, color: 'var(--ink-4)', fontFamily: 'inherit' }}
              >
                {lang === 'pt' ? 'Usar outra conta' : 'Use a different account'}
              </button>
            </div>
          </div>
        )}

        {!savedProvider && (
          <>
            {/* OAuth buttons */}
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
          </>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
              {lang === 'pt' ? 'E-mail' : 'Email'}
            </label>
            <input type="email" value={username} onChange={e => setUsername(e.target.value)}
              autoComplete="email" placeholder={lang === 'pt' ? 'seu@email.com' : 'your@email.com'}
              style={inputStyle} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)' }}>
                {lang === 'pt' ? 'Senha' : 'Password'}
              </label>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 550, cursor: 'pointer' }}>
                {lang === 'pt' ? 'Esqueci' : 'Forgot?'}
              </span>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" style={inputStyle} />
          </div>

          {/* Remember me */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
            <div
              onClick={() => setRemember(r => !r)}
              style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                background: remember ? 'var(--accent)' : 'var(--surface)',
                boxShadow: remember ? 'none' : 'inset 0 0 0 1.5px var(--line-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms',
              }}
            >
              {remember && <Icon name="check" size={11} stroke={3} style={{ color: '#fff' }} />}
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
              {lang === 'pt' ? 'Lembrar de mim' : 'Remember me'}
            </span>
          </label>

          {err && (
            <div style={{ padding: '10px 12px', borderRadius: 8, fontSize: 12.5, background: 'var(--warn-soft)', color: 'var(--warn)' }}>
              {err}
            </div>
          )}
          <Button variant="accent" size="lg" type="submit" iconRight={loading ? undefined : 'arrow'}
            style={{ justifyContent: 'center', marginTop: 4 }}>
            {loading ? (lang === 'pt' ? 'Entrando…' : 'Signing in…') : (lang === 'pt' ? 'Entrar' : 'Sign in')}
          </Button>
        </form>

        <div style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>
          {lang === 'pt' ? 'Não tem conta? ' : "Don't have an account? "}
          <button onClick={onRegister} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
            {lang === 'pt' ? 'Criar conta' : 'Sign up'}
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 48, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-4)' }}>
          <span>© 2026 {t.appName}</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} style={{ color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontFamily: 'inherit' }}>
              <Icon name="globe" size={12} />{lang === 'pt' ? 'EN' : 'PT'}
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontFamily: 'inherit' }}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={12} />
              {theme === 'dark' ? (lang === 'pt' ? 'Claro' : 'Light') : (lang === 'pt' ? 'Escuro' : 'Dark')}
            </button>
          </div>
        </div>
      </div>

      {/* Right: visual panel */}
      <div style={{
        background: 'var(--surface-2)',
        backgroundImage: 'radial-gradient(circle at 70% 30%, var(--accent-soft) 0%, transparent 55%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 40, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 420, position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'var(--surface)', color: 'var(--ink-2)',
            fontSize: 11.5, fontWeight: 600,
            boxShadow: 'var(--shadow-sm)', marginBottom: 20,
          }}>
            <Icon name="sparkle" size={12} style={{ color: 'var(--accent)' }} />
            {lang === 'pt' ? 'Com IA + LaTeX' : 'Powered by AI + LaTeX'}
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--ink)' }}>
            {lang === 'pt'
              ? '"Adaptei meu CV para 12 vagas na semana passada — chamaram para 4 entrevistas."'
              : '"I tailored my CV for 12 jobs last week — got called back for 4 interviews."'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', fontWeight: 600 }}>M</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Marcela T.</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                {lang === 'pt' ? 'Engenheira de dados' : 'Data engineer'}
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: -40, right: -30, display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.6, transform: 'rotate(-6deg)' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 180, height: 12, borderRadius: 3, background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', marginLeft: i * 12 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
