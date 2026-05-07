import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Leaf } from 'lucide-react';
import { getApiUrl, setAuthToken, setUser } from '../utils/auth';
import '../styles/auth.css';

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');

    // Real-time field validation
    setFieldErrors(prev => {
      const next = { ...prev };
      if (name === 'email') {
        if (value && !validateEmail(value)) next.email = 'Format email tidak valid';
        else delete next.email;
      }
      if (name === 'password') {
        if (value && value.length < 6) next.password = 'Password minimal 6 karakter';
        else delete next.password;
      }
      if (name === 'name') {
        if (value && value.trim().length < 2) next.name = 'Nama minimal 2 karakter';
        else delete next.name;
      }
      return next;
    });
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.email &&
    validateEmail(formData.email) &&
    formData.password.length >= 6 &&
    Object.keys(fieldErrors).length === 0;

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${getApiUrl()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 409 = duplicate email
        setError(data.error || 'Pendaftaran gagal. Coba lagi.');
        return;
      }

      // Auto-login after register (token returned from register endpoint)
      setAuthToken(data.token);
      setUser(data.user);

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('[SignUp] Network error:', err);
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
          <h1>Buat Akun</h1>
          <p>Bergabung dengan komunitas E-Cycle</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="signup-name">Nama Lengkap</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" aria-hidden="true" />
              <input
                id="signup-name"
                type="text"
                name="name"
                placeholder="Nama lengkap Anda"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
            {fieldErrors.name && (
              <span className="helper-text error">{fieldErrors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" aria-hidden="true" />
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            {fieldErrors.email && (
              <span className="helper-text error">{fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" aria-hidden="true" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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
            {fieldErrors.password ? (
              <span className="helper-text error">{fieldErrors.password}</span>
            ) : (
              <span className="helper-text">Minimal 6 karakter</span>
            )}
          </div>

          <button
            type="submit"
            id="signup-submit-btn"
            className={`auth-btn${!isFormValid || loading ? ' disabled' : ''}`}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Mendaftar...
              </span>
            ) : (
              'Buat Akun'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Sudah punya akun?{' '}
            <Link to="/LoginPage">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;