import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowUpRight } from 'lucide-react';

const SaldoTab = () => {
  const [saldo, setSaldo] = useState(0);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    // Mock fetch saldo
    const mockSaldo = Math.floor(Math.random() * 10000000);
    setSaldo(mockSaldo);
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="saldo-tab">
      {saldo === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>Saldo Anda Kosong</h3>
          <p>Mulai tarik saldo dari kegiatan recycling Anda</p>
          <button className="cta-button">Mulai Tarik Saldo</button>
        </div>
      ) : (
        <div className="saldo-card">
          <div className="saldo-header">
            <h3>Total Saldo</h3>
            <button 
              className="visibility-toggle"
              onClick={() => setShowBalance(!showBalance)}
              title={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
            >
              {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>
          
          <div className="saldo-amount">
            <span className="label">Rp</span>
            <span className="amount">
              {showBalance ? formatRupiah(saldo).replace('Rp', '') : '•••••••'}
            </span>
          </div>

          <div className="saldo-actions">
            <button className="action-btn primary">
              <ArrowUpRight size={20} />
              <span>Tarik Saldo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaldoTab;