import React from 'react';
import { I18N } from './data';
import { api, storeToken, clearToken, getToken, storeOAuthProvider } from './api';
import { mapProfile } from './mappers';
import Sidebar from './components/Sidebar';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PlansScreen from './screens/PlansScreen';
import Dashboard from './screens/Dashboard';
import GenerateScreen from './screens/GenerateScreen';
import DoneScreen from './screens/DoneScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const AUTH_SCREENS = new Set(['login', 'register']);

// Show onboarding whenever the user has no title set — clearest signal of a fresh profile.
function isFirstTime(profile) {
  return !profile?.title;
}

function deriveInitialScreen() {
  if (window.location.pathname === '/auth/callback') return 'loading';
  if (getToken()) return localStorage.getItem('mcv.screen') || 'dashboard';
  return 'login';
}

function WithSidebar({ t, lang, screen, setScreen, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar t={t} lang={lang} currentScreen={screen} setScreen={setScreen} />
      <main className="mcv-scroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  );
}

function WithSidebarFull({ t, lang, screen, setScreen, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar t={t} lang={lang} currentScreen={screen} setScreen={setScreen} />
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--line-2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'mcv-spin 700ms linear infinite' }} />
    </div>
  );
}

export default function App() {
  const [theme, setTheme]     = React.useState(() => localStorage.getItem('mcv.theme') || 'dark');
  const [lang, setLang]       = React.useState(() => localStorage.getItem('mcv.lang') || 'pt');
  const [screen, setScreen]   = React.useState(deriveInitialScreen);
  const [profile, setProfile] = React.useState(null);

  const t = I18N[lang];

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mcv.theme', theme);
  }, [theme]);

  React.useEffect(() => { localStorage.setItem('mcv.lang', lang); }, [lang]);
  React.useEffect(() => {
    if (screen !== 'onboarding') localStorage.setItem('mcv.screen', screen);
  }, [screen]);

  // Fetch full profile and return it so callers can route based on its contents.
  async function loadProfile() {
    try {
      const [me, experiences, education, certifications, projects] = await Promise.all([
        api.profile.me(),
        api.profile.experiences(),
        api.profile.education(),
        api.profile.certifications(),
        api.profile.projects(),
      ]);
      const p = mapProfile(me, experiences, education, certifications, projects);
      setProfile(p);
      return p;
    } catch (err) {
      console.error('loadProfile failed', err);
      clearToken();
      setScreen('login');
      return null;
    }
  }

  // OAuth2 callback: /auth/callback?token=<jwt>&provider=google|github
  React.useEffect(() => {
    if (window.location.pathname !== '/auth/callback') return;
    const params = new URLSearchParams(window.location.search);
    const token    = params.get('token');
    const provider = params.get('provider');
    window.history.replaceState({}, '', '/');
    if (token) {
      // OAuth always remembers (localStorage)
      storeToken(token, true);
      if (provider) storeOAuthProvider(provider);
      loadProfile().then(p => {
        if (p && isFirstTime(p)) setScreen('onboarding');
        else setScreen('dashboard');
      });
    } else {
      setScreen('login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load profile on mount when there's an existing valid token
  React.useEffect(() => {
    if (getToken() && !AUTH_SCREENS.has(screen) && screen !== 'loading') {
      loadProfile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Email/password login — respects the remember flag
  const handleLogin = async (token, remember = true) => {
    storeToken(token, remember);
    const p = await loadProfile();
    if (p && isFirstTime(p)) setScreen('onboarding');
    else setScreen('dashboard');
  };

  const handleLogout = () => {
    clearToken();
    setProfile(null);
    setScreen('login');
  };

  const onTheme = (v) => setTheme(v);
  const onLang  = (v) => setLang(v);

  if (screen === 'loading' || (getToken() && !profile && !AUTH_SCREENS.has(screen) && screen !== 'onboarding')) {
    return <Spinner />;
  }

  let content;

  if (screen === 'login') {
    content = (
      <LoginScreen
        t={t} lang={lang}
        onLogin={handleLogin}
        onRegister={() => setScreen('register')}
        setLang={onLang} theme={theme} setTheme={onTheme}
      />
    );
  } else if (screen === 'register') {
    content = (
      <RegisterScreen
        t={t} lang={lang}
        onLogin={() => setScreen('login')}
        onPlans={() => setScreen('plans')}
        setLang={onLang} theme={theme} setTheme={onTheme}
      />
    );
  } else if (screen === 'onboarding') {
    content = (
      <OnboardingScreen
        lang={lang} profile={profile}
        onDone={async () => {
          await loadProfile();
          setScreen('dashboard');
        }}
      />
    );
  } else if (screen === 'plans') {
    const plansBack = profile ? 'dashboard' : 'register';
    content = profile ? (
      <WithSidebar t={t} lang={lang} screen={screen} setScreen={setScreen}>
        <PlansScreen t={t} lang={lang} onSelect={() => setScreen('dashboard')} onBack={() => setScreen(plansBack)} />
      </WithSidebar>
    ) : (
      <PlansScreen t={t} lang={lang} onSelect={() => setScreen('dashboard')} onBack={() => setScreen(plansBack)} />
    );
  } else if (screen === 'dashboard') {
    content = (
      <WithSidebar t={t} lang={lang} screen={screen} setScreen={setScreen}>
        <Dashboard t={t} lang={lang} profile={profile} setScreen={setScreen} />
      </WithSidebar>
    );
  } else if (screen === 'generate') {
    content = (
      <WithSidebarFull t={t} lang={lang} screen={screen} setScreen={setScreen}>
        <GenerateScreen
          t={t} lang={lang} profile={profile}
          onDone={() => setScreen('done')}
          onBack={() => setScreen('dashboard')}
        />
      </WithSidebarFull>
    );
  } else if (screen === 'done') {
    content = (
      <WithSidebarFull t={t} lang={lang} screen={screen} setScreen={setScreen}>
        <DoneScreen
          t={t} lang={lang} profile={profile}
          onAgain={() => setScreen('generate')}
          onBack={() => setScreen('dashboard')}
        />
      </WithSidebarFull>
    );
  } else if (screen === 'history') {
    content = (
      <WithSidebar t={t} lang={lang} screen={screen} setScreen={setScreen}>
        <HistoryScreen lang={lang} setScreen={setScreen} />
      </WithSidebar>
    );
  } else if (screen === 'settings') {
    content = (
      <WithSidebar t={t} lang={lang} screen={screen} setScreen={setScreen}>
        <SettingsScreen
          t={t} lang={lang} theme={theme} profile={profile}
          setTheme={onTheme} setLang={onLang}
          onLogout={handleLogout} setScreen={setScreen}
          onProfileUpdate={loadProfile}
        />
      </WithSidebar>
    );
  }

  return <>{content}</>;
}
