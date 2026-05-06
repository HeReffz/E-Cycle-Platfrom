import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import "../styles/auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // SEKARANG: Cuma cek email dan password aja biar gak ribet
  const isFormValid = formData.email && formData.password;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Mengizinkan user untuk login dengan akun test, akun yang baru didaftarkan, atau akun apapun untuk keperluan prototype
      if (formData.email && formData.password) {
        localStorage.setItem('user', JSON.stringify({ email: formData.email }));
        localStorage.setItem('authToken', 'mock-auth-token');
        navigate('/');
      } else {
        setError('Email atau password salah');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p>Masuk ke akun E-Cycle Anda</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Masukkan email Anda"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Masukkan password Anda"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`login-btn ${!isFormValid || loading ? 'disabled' : ''}`}
            disabled={!isFormValid || loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="auth-footer">
            <p>Belum punya akun? <Link to="/SignUpPage">Daftar di sini</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;