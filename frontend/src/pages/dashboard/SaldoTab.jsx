import React, { useState } from 'react';
import { Eye, EyeOff, ArrowUpRight, RefreshCw } from 'lucide-react';

/**
 * SaldoTab — Displays user balance from backend.
 * Props:
 *   balance: number | null  (null = loading, number = loaded)
 *   balanceError: string    (error message if fetch failed)
 *   onWithdrawClick: function (switches to penarikan tab)
 */
const SaldoTab = ({ balance, balanceError, onWithdrawClick }) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Loading state
  if (balance === null && !balanceError) {
    return (
      <div className="saldo-tab">
        <div className="saldo-card">
          <div className="skeleton-header" />
          <div className="skeleton-amount" />
          <div className="skeleton-btn" />
        </div>
      </div>
    );
  }

  // Error state
  if (balanceError) {
    return (
      <div className="saldo-tab">
        <div className="saldo-card error-state">
          <div className="empty-icon">⚠️</div>
          <h3>Gagal Memuat Saldo</h3>
          <p>{balanceError}</p>
          <button
            className="cta-button"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty balance (new user)
  if (balance === 0) {
    return (
      <div className="saldo-tab">
        <div className="saldo-card">
          <div className="saldo-header">
            <h3>Total Saldo</h3>
          </div>
          <div className="saldo-amount zero">
            <span className="label">Rp</span>
            <span className="amount">0</span>
          </div>
          <div className="empty-balance-hint">
            <p>💡 Mulai recycle barang elektronik Anda untuk mendapatkan saldo!</p>
          </div>
          <div className="saldo-actions">
            <button className="action-btn primary" onClick={onWithdrawClick}>
              <ArrowUpRight size={20} />
              <span>Mulai Recycle</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Has balance
  return (
    <div className="saldo-tab">
      <div className="saldo-card">
        <div className="saldo-header">
          <h3>Total Saldo</h3>
          <button
            className="visibility-toggle"
            onClick={() => setShowBalance(!showBalance)}
            title={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
            aria-label={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
          >
            {showBalance ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </div>

        <div className="saldo-amount">
          <span className="label">Rp</span>
          <span className="amount">
            {showBalance
              ? formatRupiah(balance).replace('Rp\u00A0', '').replace('Rp', '')
              : '•••••••'}
          </span>
        </div>

        <div className="saldo-actions">
          <button className="action-btn primary" onClick={onWithdrawClick}>
            <ArrowUpRight size={20} />
            <span>Tarik Saldo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaldoTab;