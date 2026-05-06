import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Activity, Battery, Droplets, Wind, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

const METRICS = [
  {
    icon: <Wind size={28} color="#22c55e" />,
    value: "45.2T",
    label: "CO₂ Emissions\nPrevented",
    color: "#22c55e",
    highlight: true,
  },
  {
    icon: <Battery size={28} color="#f59e0b" />,
    value: "8,200",
    label: "Toxic Batteries\nSafely Processed",
    color: "#f59e0b",
  },
  {
    icon: <Droplets size={28} color="#3b82f6" />,
    value: "1.2M",
    label: "Liters of Water\nSaved from Pollution",
    color: "#3b82f6",
    highlight: true,
  },
  {
    icon: <Activity size={28} color="#8b5cf6" />,
    value: "125Kg",
    label: "Precious Metals\nRecovered",
    color: "#8b5cf6",
  },
];

function Impact() {
  return (
    <div className="container" style={{ padding: '2.5rem 2rem 7rem' }}>

      {/* Header */}
      <ScrollReveal animation="slideUp">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="tag-badge">Our Impact</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', marginBottom: '1rem', letterSpacing: '-1px' }}>
            The Difference We Make
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Setiap perangkat yang kamu daur ulang berkontribusi pada planet yang lebih sehat.
            Berikut dashboard dampak nyata dari komunitas E-Cycle.
          </p>
        </div>
      </ScrollReveal>

      {/* Hero Number */}
      <ScrollReveal animation="scale" delay={100}>
        <div
          className="impact-section"
          style={{
            marginTop: 0,
            padding: '4.5rem 2rem',
            borderRadius: '24px',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Total E-Waste Dicegah dari TPA
            </span>
          </div>
          <div className="impact-number" style={{ margin: '0.75rem 0' }}>12,450 <span style={{ fontSize: '2.5rem' }}>Kg</span></div>
          <p style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '1rem' }}>Dan terus bertambah setiap harinya</p>
        </div>
      </ScrollReveal>

      {/* Breakdown label */}
      <ScrollReveal animation="slideUp" delay={50}>
        <h3 style={{ margin: '0 0 2rem', textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Environmental Savings Breakdown
        </h3>
      </ScrollReveal>

      {/* Metrics grid */}
      <div className="metrics-grid-override" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {METRICS.map((m, i) => (
          <ScrollReveal key={i} animation="slideUp" delay={i * 80}>
            <div
              className={`card${m.highlight ? ' highlight' : ''}`}
              style={{ alignItems: 'center', textAlign: 'center', padding: '2rem 1.25rem', height: '100%', gap: '0' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `${m.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                {m.icon}
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>{m.value}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4, margin: 0, whiteSpace: 'pre-line' }}>
                {m.label}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA */}
      <ScrollReveal animation="slideUp" delay={100}>
        <div
          className="card"
          style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            color: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            padding: '2.25rem 2.5rem',
          }}
        >
          <div>
            <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Siap berkontribusi?</h3>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.93rem' }}>
              Bergabung dengan ribuan orang yang membuat bumi lebih bersih.
            </p>
          </div>
          <Link
            to="/pickup"
            className="pill-btn"
            style={{ flexShrink: 0, background: 'var(--primary)', minWidth: 'max-content' }}
          >
            Mulai Daur Ulang
          </Link>
        </div>
      </ScrollReveal>

      {/* Responsive override for metrics grid */}
      <style>{`
        @media (max-width: 768px) {
          .metrics-grid-override { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .metrics-grid-override { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default Impact;
