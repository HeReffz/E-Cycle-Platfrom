import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { getApiUrl, setAuthToken, setUser } from '../utils/auth';
import '../styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = formData.email && formData.password;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal. Coba lagi.');
        return;
      }

      // Persist auth state
      setAuthToken(data.token);
      setUser(data.user);

      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('[Login] Network error:', err);
      setError('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo & Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <Leaf size={32} className="auth-logo-icon" />
          </div>
          <h1>Selamat Datang</h1>
          <p>Masuk ke akun E-Cycle Anda</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Masukkan password Anda"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className={`auth-btn${!isFormValid || loading ? ' disabled' : ''}`}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Memproses...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Belum punya akun?{' '}
            <Link to="/SignUpPage">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;