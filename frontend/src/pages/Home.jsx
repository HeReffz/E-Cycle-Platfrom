import React from "react";
import { Link } from "react-router-dom";
import {
  Recycle, MapPin, Calculator, Leaf, ArrowUpRight, Zap, Globe,
} from "lucide-react";
import heroImg from "../assets/hero.png";
import { ScrollReveal } from "../components/ScrollReveal";

const STATS = [
  { icon: <Recycle size={18} color="var(--primary)" />, text: "2.4M Ton E-Waste / Tahun" },
  { icon: <Leaf size={18} color="var(--primary)" />, text: "Proses Ramah Lingkungan" },
  { icon: <Calculator size={18} color="var(--primary)" />, text: "Valuasi Transparan" },
  { icon: <MapPin size={18} color="var(--primary)" />, text: "500+ Drop Points" },
];

const FEATURES = [
  {
    badge: "Smart Drop",
    icon: <MapPin size={20} color="var(--primary)" />,
    title: "Smart Drop-Point Finder",
    desc: "Temukan drop point e-waste resmi terdekat dengan jam operasional real-time dan daftar perangkat yang diterima.",
    footer: <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Samsung • Apple • Asus</span>,
    link: "/drop-points",
    highlight: true,
  },
  {
    badge: "AI Driven",
    icon: <Calculator size={20} />,
    title: "E-Waste Estimator",
    desc: "Dapatkan valuasi instan untuk perangkat lamamu berdasarkan data pasar real-time. Transparan dan adil.",
    footer: <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Cek Nilai</span>,
    link: "/estimator",
  },
  {
    badge: "Logistics",
    icon: <Recycle size={20} />,
    title: "Pickup Scheduling",
    desc: "Tidak bisa ke drop point? Jadwalkan penjemputan ke rumah dengan mitra eco-logistics kami.",
    footer: <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Booking Sekarang</span>,
    link: "/pickup",
  },
];

function Home() {
  return (
    <>
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <ScrollReveal animation="slideUp" duration={700}>
            <h1>
              Your Old
              <div className="hero-img-container">
                <img src={heroImg} alt="Daur ulang gadget" />
              </div>
              Gadgets
              <br />Are Valuable
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fadeIn" delay={200} duration={700}>
            <div className="hero-actions">
              <Link to="/drop-points" className="pill-btn">
                Find Drop-Point
              </Link>
              <Link to="/estimator" className="action-link">
                Estimate Value <ArrowUpRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* Stats Banner */}
        <ScrollReveal animation="slideUp" delay={100}>
          <div className="stats-banner">
            {STATS.map((s, i) => (
              <div key={i} className="stat-item">
                {s.icon}
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Feature Cards */}
        <section className="cards-grid">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={i} animation="slideUp" delay={i * 100}>
              <div className={`card${f.highlight ? " highlight" : ""}`} style={{ height: "100%" }}>
                <span
                  className="tag-badge"
                  style={!f.highlight ? { background: "rgba(0,0,0,0.05)", color: "var(--text)" } : {}}
                >
                  {f.badge}
                </span>
                <div className="card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="card-footer">
                  {f.footer}
                  <Link
                    to={f.link}
                    className="icon-btn"
                    style={f.highlight ? {
                      background: "var(--primary)",
                      color: "white",
                      borderColor: "var(--primary)",
                    } : {}}
                  >
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </section>
      </div>

      {/* Impact Section */}
      <ScrollReveal animation="slideUp" delay={50}>
        <section className="impact-section">
          <div className="container">
            <span
              className="tag-badge"
              style={{ background: "rgba(34,197,94,0.1)", color: "var(--primary-dark)" }}
            >
              Our Impact
            </span>
            <h2>
              Together, We're Making
              <br />A Difference
            </h2>
            <div className="impact-number">12,450</div>
            <p style={{ fontWeight: 600, fontSize: "1.15rem", marginBottom: "2.5rem" }}>
              Kg of E-Waste Recycled Successfully
            </p>
            <Link to="/impact" className="pill-btn outline">
              View Full Impact Dashboard
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}

export default Home;
