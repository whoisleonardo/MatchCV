const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const TOKEN_KEY = 'mcv.token';

export function oauthUrl(provider) {
  return `${API_BASE}/oauth2/authorization/${provider}`;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
