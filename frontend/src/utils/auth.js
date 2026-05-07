// ── API URL ───────────────────────────────────────────────────────────────────
// In production (Vercel), VITE_API_URL should be set to your backend URL.
// In development, it defaults to http://localhost:5000
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

// ── Token Management ──────────────────────────────────────────────────────────
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// ── User Management ───────────────────────────────────────────────────────────
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

// ── Auth State ────────────────────────────────────────────────────────────────
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;

  // Basic JWT expiry check without verifying signature (server will verify)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      // Token expired — clean up
      logout();
      return false;
    }
    return true;
  } catch {
    logout();
    return false;
  }
};

export const logout = () => {
  removeAuthToken();
  removeUser();
};

// ── Authenticated Fetch ───────────────────────────────────────────────────────
// Use this for all protected API calls. Automatically injects the JWT header.
export const fetchWithAuth = async (path, options = {}) => {
  const token = getAuthToken();
  const baseUrl = getApiUrl();

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // If token is invalid/expired, force logout
  if (response.status === 401) {
    logout();
    window.location.href = '/LoginPage';
    throw new Error('Sesi habis, silakan login ulang');
  }

  return response;
};
