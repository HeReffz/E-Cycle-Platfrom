import React, { useState } from 'react';
import { Calculator, CheckCircle2, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

// ── Device type data with illustration images ─────────────────────────────────
const DEVICE_TYPES = [
  {
    id: 'Smartphone',
    label: 'Smartphone',
    img: '/smartphone.png',
    desc: 'iPhone, Android, dll',
  },
  {
    id: 'Laptop',
    label: 'Laptop',
    img: '/laptop.png',
    desc: 'MacBook, Windows, dll',
  },
  {
    id: 'Other (TV/Monitor)',
    label: 'TV / Monitor',
    img: '/tvmonitor.png',
    desc: 'LED, LCD, CRT',
  },
];

function DeviceCard({ type, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      id={`device-card-${type.id.replace(/\s/g, '-')}`}
      style={{
        padding: '1.25rem 0.75rem 1rem',
        textAlign: 'center',
        border: `2px solid ${selected ? 'var(--primary)' : '#e8e4d8'}`,
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        backgroundColor: selected ? 'rgba(46, 211, 113, 0.07)' : 'white',
        transform: selected ? 'translateY(-3px)' : 'none',
        boxShadow: selected ? '0 8px 24px rgba(46,211,113,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
          e.currentTarget.style.borderColor = 'rgba(46,211,113,0.4)';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
          e.currentTarget.style.borderColor = '#e8e4d8';
        }
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '14px',
          background: selected
            ? 'linear-gradient(135deg, rgba(46,211,113,0.15) 0%, rgba(26,173,87,0.08) 100%)'
            : '#f7f4ea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.35rem',
          transition: 'background 0.25s ease',
          overflow: 'hidden',
        }}
      >
        <img
          src={type.img}
          alt={type.label}
          style={{
            width: 54,
            height: 54,
            objectFit: 'contain',
            transition: 'transform 0.25s ease',
            transform: selected ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: selected ? 'var(--primary)' : 'var(--text-main)', lineHeight: 1.2 }}>
        {type.label}
      </span>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
        {type.desc}
      </span>
      {selected && (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '0.25rem',
            animation: 'popIn 0.2s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

function Estimator() {
  const [device, setDevice] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(null);

  const handleEstimate = (e) => {
    e.preventDefault();
    if (!device || !brand || !condition) {
      alert('Harap isi semua field terlebih dahulu!');
      return;
    }
    const baseValue = device === 'Smartphone' ? 50 : device === 'Laptop' ? 150 : 30;
    const conditionMultiplier =
      condition === 'Working Perfectly' ? 1 : condition === 'Minor Damage' ? 0.6 : 0.2;
    const finalValue = Math.floor(baseValue * conditionMultiplier * 15000);
    setEstimatedValue(finalValue);
  };

  const selectStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    border: '1.5px solid #e8e4d8',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    background: 'white',
    color: 'var(--text-main)',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    paddingRight: '2.5rem',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div className="container" style={{ padding: '2rem 2rem 6rem' }}>
      {/* Header */}
      <ScrollReveal animation="slideUp">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tag-badge">AI Driven</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>E-Waste Estimator</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Cari tahu berapa nilai perangkat lamamu. Kami memberikan estimasi harga transparan berdasarkan
            data pasar untuk memastikan kamu mendapat penawaran yang adil.
          </p>
        </div>
      </ScrollReveal>

      <div className="cards-grid estimator-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        {/* Form Area */}
        <ScrollReveal animation="slideLeft" delay={100}>
          <div className="card" style={{ height: '100%' }}>
            <h3 style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'rgba(46,211,113,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calculator size={18} color="var(--primary)" />
              </div>
              Detail Perangkat
            </h3>

            <form onSubmit={handleEstimate} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Device Type — with illustrations */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  1. Jenis perangkat apa?
                </label>
                <div className="device-type-grid">
                  {DEVICE_TYPES.map(type => (
                    <DeviceCard
                      key={type.id}
                      type={type}
                      selected={device === type.id}
                      onClick={() => setDevice(type.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  2. Brand / Merek apa?
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  style={selectStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(46,211,113,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e8e4d8';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Pilih brand</option>
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Asus/Lenovo/HP">Asus / Lenovo / HP</option>
                  <option value="Other">Brand Lainnya</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  3. Bagaimana kondisinya?
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { id: 'Working Perfectly', label: 'Berfungsi Normal', sub: 'Menyala, layar bagus, tidak ada kerusakan fisik', color: '#2ed371' },
                    { id: 'Minor Damage', label: 'Kerusakan Minor', sub: 'Baret ringan, baterai drop, tombol macet', color: '#f6ad55' },
                    { id: 'Broken/Dead', label: 'Rusak / Mati', sub: 'Tidak bisa menyala, layar retak, baterai bocor', color: '#fc8181' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setCondition(opt.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        border: `2px solid ${condition === opt.id ? opt.color : '#e8e4d8'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: condition === opt.id ? `${opt.color}10` : 'white',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          border: `2px solid ${condition === opt.id ? opt.color : '#ccc'}`,
                          background: condition === opt.id ? opt.color : 'transparent',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: condition === opt.id ? opt.color : 'var(--text-main)' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          {opt.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="pill-btn"
                id="estimate-submit-btn"
                style={{ marginTop: '0.5rem', width: '100%', gap: '0.5rem' }}
              >
                <ChevronRight size={18} />
                Hitung Estimasi Nilai
              </button>
            </form>
          </div>
        </ScrollReveal>

        {/* Result Area */}
        <ScrollReveal animation="slideRight" delay={200}>
          <div
            className="card highlight"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: 400,
            }}
          >
            {estimatedValue !== null ? (
              <div style={{ animation: 'popIn 0.4s cubic-bezier(0.22,1,0.36,1)', width: '100%' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(46,211,113,0.2) 0%, rgba(46,211,113,0.05) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <CheckCircle2 size={36} color="var(--primary)" />
                </div>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  Estimasi Nilai Perangkat
                </h3>
                <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-1px', lineHeight: 1 }}>
                  Rp {estimatedValue.toLocaleString('id-ID')}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.82rem', maxWidth: '280px', margin: '0 auto 1.75rem' }}>
                  *Nilai estimasi. Harga final ditentukan setelah inspeksi fisik di drop point kami.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                  <button className="pill-btn" style={{ width: '100%' }} id="schedule-dropoff-btn">
                    Jadwalkan Drop-off Sekarang
                  </button>
                  <button
                    className="pill-btn outline"
                    style={{ width: '100%' }}
                    onClick={() => { setEstimatedValue(null); setDevice(''); setBrand(''); setCondition(''); }}
                  >
                    Hitung Ulang
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Calculator size={36} color="#ccc" />
                </div>
                <div>
                  <h3 style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Estimasi akan muncul di sini
                  </h3>
                  <p style={{ color: '#aaa', fontSize: '0.88rem', maxWidth: '240px' }}>
                    Isi detail perangkat di sebelah kiri untuk mengetahui nilainya.
                  </p>
                </div>

                {/* Preview steps */}
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', maxWidth: 280 }}>
                  {['Pilih jenis perangkat', 'Pilih merek', 'Pilih kondisi', 'Klik Hitung'].map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: 'rgba(46,211,113,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Estimator;
