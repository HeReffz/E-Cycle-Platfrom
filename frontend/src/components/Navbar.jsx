import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Recycle, Phone, Menu, X, ArrowRight, Calendar } from "lucide-react";

const NAV_LINKS = [
  { to: "/",            label: "Home" },
  { to: "/drop-points", label: "Drop Points" },
  { to: "/estimator",   label: "Estimator" },
  { to: "/pickup",      label: "Pickup" },
  { to: "/impact",      label: "Our Impact" },
];

function Navbar() {
  const location  = useLocation();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);   // mild scroll
  const [compact,  setCompact]    = useState(false);   // more scroll → shrink

  const isActive   = (path) => location.pathname === path;
  const closeMenu  = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);

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

  /* ── Dynamic nav height for mobile-menu padding ──────────── */
  const navHeight = compact ? 54 : 64;

  return (
    <>
      {/* ════ NAVBAR ═════════════════════════════════════════ */}
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

          {/* Desktop CTA + hamburger */}
          <div className="nav-actions">
            {/* WhatsApp icon */}
            <a
              href="https://api.whatsapp.com/qr/XY5PSWPK2EZLD1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa-btn nav-phone-btn"
              title="Chat via WhatsApp"
              aria-label="WhatsApp"
            >
              <Phone size={16} strokeWidth={2} />
            </a>

            {/* Schedule Pickup CTA */}
            <Link to="/pickup" className="nav-cta nav-schedule-btn">
              <Calendar size={14} strokeWidth={2.5} />
              <span>Schedule Pickup</span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="hamburger-btn"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`hamburger-icon${menuOpen ? " open" : ""}`}>
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ════ MOBILE BACKDROP ════════════════════════════════ */}
      <div
        className={`mobile-menu-backdrop${menuOpen ? " open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ════ MOBILE SLIDE-DOWN MENU ════════════════════════ */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        style={{ paddingTop: navHeight }}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
      >
        <div className="mobile-menu-inner">
          <nav className="mobile-nav-links" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`mobile-nav-link${isActive(to) ? " active" : ""}`}
                onClick={closeMenu}
              >
                <span>{label}</span>
                <ArrowRight size={14} className="mobile-nav-arrow" />
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            <Link
              to="/pickup"
              className="pill-btn"
              style={{ width: "100%", justifyContent: "center", gap: "0.5rem" }}
              onClick={closeMenu}
            >
              <Calendar size={15} /> Schedule Pickup
            </Link>
            <a
              href="https://api.whatsapp.com/qr/XY5PSWPK2EZLD1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn outline"
              style={{ width: "100%", justifyContent: "center", gap: "0.5rem" }}
              onClick={closeMenu}
            >
              <Phone size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
