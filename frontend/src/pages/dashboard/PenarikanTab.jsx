import React, { useState } from 'react';
import { Edit2, CheckCircle } from 'lucide-react';
import PenarikanModal from './PenarikanModal';
import '../../styles/penarikan.css';

/**
 * PenarikanTab — Withdrawal methods management.
 * Props:
 *   balance: number | null  (real balance from backend, passed by DashboardPage)
 *   refreshData: function (fetches fresh balance from backend)
 */
const PenarikanTab = ({ balance, refreshData }) => {
  const [selectedMethod, setSelectedMethod] = useState('gopay');
  const [showModal, setShowModal] = useState(false);
  const saldo = balance ?? 0; // Use real balance, default to 0 while loading
  const [withdrawalData, setWithdrawalData] = useState({
    gopay: { nomor: '', lastChanged: null },
    dana: { nomor: '', lastChanged: null },
    shopeepay: { nomor: '', lastChanged: null }
  });

  const DAILY_LIMIT = 5000000;
  const METHODS = [
    { id: 'gopay', name: 'GOPAY', fee: 'Rp0' },
    { id: 'dana', name: 'DANA', fee: 'Rp100' },
    { id: 'shopeepay', name: 'SHOPEEPAY', fee: 'Rp100' }
  ];

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateDaysUntilChange = (lastChanged) => {
    if (!lastChanged) return 0;
    const now = new Date();
    const lastDate = new Date(lastChanged);
    const diffTime = Math.abs(now - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return 90 - diffDays;
  };

  const canChangeMethod = (method) => {
    const data = withdrawalData[method];
    if (!data.lastChanged) return true;
    return calculateDaysUntilChange(data.lastChanged) <= 0;
  };

  const handleSaveMethod = (nomor) => {
    setWithdrawalData(prev => ({
      ...prev,
      [selectedMethod]: {
        nomor,
        lastChanged: new Date().toISOString()
      }
    }));
    setShowModal(false);
  };

  return (
    <div className="penarikan-tab">
      {/* Saldo Display */}
      <div className="penarikan-info-card">
        <div className="info-row">
          <span className="label">Saldo Saat Ini</span>
          <span className="value">{formatRupiah(saldo)}</span>
        </div>
        <div className="info-row">
          <span className="label">Limit Harian</span>
          <span className="value">{formatRupiah(DAILY_LIMIT)}</span>
        </div>
      </div>

      {/* Withdrawal Methods */}
      <div className="methods-section">
        <h3>Metode Penarikan</h3>
        <div className="methods-list">
          {METHODS.map(method => {
            const data = withdrawalData[method.id];
            const daysUntilChange = calculateDaysUntilChange(data.lastChanged);
            const canChange = canChangeMethod(method.id);

            return (
              <div key={method.id} className="method-item">
                <div className="method-header">
                  <div className="radio-group">
                    <input
                      type="radio"
                      id={method.id}
                      name="withdrawal-method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                    />
                    <label htmlFor={method.id}>
                      <strong>{method.name}</strong>
                    </label>
                  </div>
                  <span className="fee">Fee: {method.fee}</span>
                </div>

                {data.nomor ? (
                  <div className="method-details">
                    <div className="phone-display">
                      <CheckCircle size={16} className="icon-success" />
                      <span>{data.nomor}</span>
                    </div>
                    {data.lastChanged && (
                      <div className="change-info">
                        {canChange ? (
                          <span className="can-change">Bisa diubah sekarang</span>
                        ) : (
                          <span className="cannot-change">
                            Terakhir diubah {daysUntilChange} hari lagi
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="method-empty">
                    <span>Belum ada nomor terdaftar</span>
                  </div>
                )}

                <button
                  className={`edit-btn ${!canChange ? 'disabled' : ''}`}
                  onClick={() => setShowModal(true)}
                  disabled={!canChange}
                  title={!canChange ? `Bisa diubah dalam ${calculateDaysUntilChange(data.lastChanged)} hari` : 'Edit metode penarikan'}
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for editing */}
      {showModal && (
        <PenarikanModal
          method={selectedMethod}
          onSave={handleSaveMethod}
          onClose={() => setShowModal(false)}
          saldo={saldo}
          dailyLimit={DAILY_LIMIT}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default PenarikanTab;