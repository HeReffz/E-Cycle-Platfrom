import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import "../styles/auth.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError(''); // Reset error umum saat mengetik
    
    if (value && !validateEmail(value)) {
      setEmailError('Format email tidak valid');
    } else {
      setEmailError('');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    
    // Validasi tambahan sebelum kirim
    if (!validateEmail(email)) {
      setEmailError('Format email tidak valid');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    
    // Simulasi proses pendaftaran (Mock API)
    setTimeout(() => {
      // Simpan data sementara jika diperlukan
      localStorage.setItem('tempEmail', email);
      
      setLoading(false);
      
      // ALUR: Setelah sukses daftar, arahkan ke halaman LOGIN
      navigate('/LoginPage'); 
    }, 1500);
  };

  // Validasi tombol: email harus valid dan password minimal 6 karakter
  const isFormValid = email && validateEmail(email) && !emailError && password.length >= 6;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Buat Akun</h1>
          <p>Daftar untuk memulai menggunakan E-Cycle</p>
        </div>

        {/* Tampilkan pesan error jika ada */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignUp}>
          {/* KOLOM EMAIL */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            {emailError && <span className="helper-text error">{emailError}</span>}
          </div>

          {/* KOLOM PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Buat password minimal 6 karakter"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(''); // Reset error saat user memperbaiki password
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                tabIndex="-1" 
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className="helper-text">Minimal 6 karakter</span>
          </div>

          <button
            type="submit"
            className={`login-btn ${!isFormValid || loading ? 'disabled' : ''}`}
            disabled={!isFormValid || loading}
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <div className="auth-footer">
            {/* Link kembali ke LoginPage */}
            <p>Sudah punya akun? <Link to="/LoginPage">Masuk di sini</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;