import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Recycle, Phone, Menu, X, ArrowRight, Calendar, User, LogOut } from "lucide-react";

const NAV_LINKS = [
  { to: "/",            label: "Home" },
  { to: "/drop-points", label: "Drop Points" },
  { to: "/estimator",   label: "Estimator" },
  { to: "/pickup",      label: "Pickup" },
  { to: "/impact",      label: "Our Impact" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  
  // --- STATE USER ---
  const [user, setUser] = useState(null);

  const isActive = (path) => location.pathname === path;
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);

  // Cek status login saat komponen mount atau route berubah
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // Trigger ulang setiap pindah halaman untuk validasi data

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    closeMenu();
    navigate('/LoginPage');
  };

  /* ── Scroll state ─────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setCompact(y > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close on route change ────────────────────────────────── */
  useEffect(() => { closeMenu(); }, [location.pathname, closeMenu]);

  /* ── Close on Escape ──────────────────────────────────────── */
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => { if (e.key === "Escape") closeMenu(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [menuOpen, closeMenu]);

  /* ── Body scroll-lock ─────────────────────────────────────── */
  useEffect(() => {
    if (!menuOpen) return;
    const y = window.scrollY;
    Object.assign(document.body.style, {
      position: "fixed", top: `-${y}px`, width: "100%",
    });
    return () => {
      Object.assign(document.body.style, { position: "", top: "", width: "" });
      window.scrollTo(0, y);
    };
  }, [menuOpen]);

  const navHeight = compact ? 54 : 64;

  return (
    <>
      <nav
        className={[
          "navbar",
          scrolled ? "navbar--scrolled" : "",
          compact  ? "navbar--compact"  : "",
        ].join(" ")}
      >
        <div className="navbar-inner container">

          {/* Logo */}
          <Link to="/" className="nav-logo" aria-label="E-Cycle Home">
            <div className="nav-logo-icon">
              <Recycle size={18} strokeWidth={2.5} />
            </div>
            <span className="nav-logo-text">E-Cycle</span>
          </Link>

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link${isActive(to) ? " active" : ""}`}
              >
                <span className="nav-link-text">{label}</span>
                <span className="nav-link-bar" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="nav-actions">
            <Link to="/pickup" className="nav-cta pickup-btn" style={{ background: "var(--text)", color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={16} />
              <span style={{ fontWeight: "600" }}>Schedule Pick Up</span>
            </Link>

            <a
              href="https://wa.me/yournumber"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa-btn"
              title="Chat via WhatsApp"
            >
              <Phone size={16} strokeWidth={2} />
            </a>

            {/* CONDITIONAL RENDERING: USER PROFILE VS LOGIN/SIGNUP */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Link to="/dashboard" className="nav-cta" style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}>
                  <User size={14} strokeWidth={2.5} />
                  <span>{user.email.split('@')[0]}</span> 
                </Link>
                <button onClick={handleLogout} className="icon-btn" title="Logout" style={{ width: '38px', height: '38px' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/LoginPage" className="nav-cta nav-login-btn">
                  <span>Login</span>
                </Link>
                <Link to="/SignUpPage" className="nav-cta nav-signup-btn">
                  <span>Sign Up</span>
                </Link>
              </>
            )}

            <button className="hamburger-btn" onClick={toggleMenu}>
              <span className={`hamburger-icon${menuOpen ? " open" : ""}`}>
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE BACKDROP */}
      <div className={`mobile-menu-backdrop${menuOpen ? " open" : ""}`} onClick={closeMenu} />

      {/* MOBILE MENU */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        style={{ paddingTop: navHeight }}
      >
        <div className="mobile-menu-inner">
          {/* User Info di Mobile jika sudah login */}
          {user && (
            <Link to="/dashboard" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: 'var(--r-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged in as</p>
                  <p style={{ fontWeight: 700 }}>{user.email}</p>
                </div>
                <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                  <User size={16} />
                </div>
              </div>
            </Link>
          )}

          <nav className="mobile-nav-links">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={`mobile-nav-link${isActive(to) ? " active" : ""}`} onClick={closeMenu}>
                <span>{label}</span>
                <ArrowRight size={14} className="mobile-nav-arrow" />
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            {user ? (
              <button onClick={handleLogout} className="pill-btn outline" style={{ width: "100%" }}>
                <LogOut size={15} /> Logout
              </button>
            ) : (
              <>
                <Link to="/LoginPage" className="pill-btn" style={{ width: "100%", justifyContent: "center" }} onClick={closeMenu}>
                   Login
                </Link>
                <Link to="/SignUpPage" className="pill-btn outline" style={{ width: "100%", justifyContent: "center" }} onClick={closeMenu}>
                   Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;