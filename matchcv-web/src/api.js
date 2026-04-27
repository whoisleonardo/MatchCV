const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const TOKEN_KEY = 'mcv.token';

// Token lives in localStorage (persistent) or sessionStorage (session-only).
// OAuth always uses localStorage. Email/password respects the remember flag.
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}
export function storeToken(t, remember = true) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, t);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, t);
    localStorage.removeItem(TOKEN_KEY);
  }
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('mcv.oauth');
  localStorage.removeItem('mcv.screen');
}
export function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
export function oauthUrl(provider) {
  return `${BASE}/oauth2/authorization/${provider}`;
}

// Remember which OAuth provider the user last used
export function storeOAuthProvider(p) { localStorage.setItem('mcv.oauth', p); }
export function getOAuthProvider()    { return localStorage.getItem('mcv.oauth'); }

async function req(method, path, body, raw = false) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${text}`);
  }
  if (raw) return res;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/pdf') || ct.includes('octet-stream')) return res.blob();
  if (ct.includes('application/json')) return res.json();
  return res;
}

export const api = {
  auth: {
    login: (username, password) => req('POST', '/auth/login', { username, password }),
  },
  profile: {
    me:             () => req('GET', '/api/profile/me'),
    update:         (data) => req('PATCH', '/api/profile/me', data),
    experiences:    () => req('GET', '/api/profile/experiences'),
    education:      () => req('GET', '/api/profile/education'),
    certifications: () => req('GET', '/api/profile/certifications'),
    projects:       () => req('GET', '/api/profile/projects'),
  },
  llm: {
    optimize: (cv, jobDescription, language) =>
      req('POST', '/api/llm/optimize', { cv, jobDescription, language }),
  },
  cv: {
    generate: (jobDescription, language) =>
      req('POST', '/api/cv/generate', { jobDescription, language }),
  },
};
