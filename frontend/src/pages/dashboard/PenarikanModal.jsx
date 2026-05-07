import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchWithAuth } from '../../utils/auth';
import '../../styles/modal.css';

const PenarikanModal = ({ method, onSave, onClose, saldo, dailyLimit, refreshData }) => {
  const [nomor, setNomor] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState('edit'); // 'edit' or 'confirm'

  const methodNames = {
    gopay: 'GOPAY',
    dana: 'DANA',
    shopeepay: 'SHOPEEPAY'
  };

  const validatePhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    return phoneRegex.test(cleanPhone);
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleNomorChange = (e) => {
    const value = e.target.value;
    setNomor(value);
    setError('');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    setError('');
  };

  const validateInput = () => {
    if (!nomor.trim()) {
      setError('Nomor telepon harus diisi');
      return false;
    }
    if (!validatePhoneNumber(nomor)) {
      setError('Format nomor telepon tidak valid (cth: +62812345678)');
      return false;
    }
    if (!amount) {
      setError('Jumlah penarikan harus diisi');
      return false;
    }
    const withdrawAmount = parseInt(amount);
    if (withdrawAmount > saldo) {
      setError('Saldo tidak cukup untuk penarikan ini');
      return false;
    }
    if (withdrawAmount > dailyLimit) {
      setError(`Jumlah melebihi limit harian ${formatRupiah(dailyLimit)}`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateInput()) return;
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetchWithAuth('/api/users/me/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          amount: parseInt(amount),
          method: method,
          nomor: nomor
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan saat memproses penarikan');
        setLoading(false);
        return;
      }

      onSave(nomor);
      setSuccess(true);
      
      // Refresh the dashboard balance and transaction history
      if (refreshData) {
        refreshData();
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('[Penarikan] Error:', err);
      setError('Tidak dapat terhubung ke server');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="success-message">
            <CheckCircle size={64} className="icon-success" />
            <h3>Berhasil!</h3>
            <p>Metode penarikan {methodNames[method]} berhasil diperbarui</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit {methodNames[method]}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {step === 'edit' ? (
            <>
              <div className="form-group">
                <label htmlFor="nomor">Nomor Telepon</label>
                <input
                  id="nomor"
                  type="tel"
                  placeholder="+62812345678"
                  value={nomor}
                  onChange={handleNomorChange}
                />
                <span className="helper-text">Format: +62 atau 0 diikuti 9-12 digit</span>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Jumlah Penarikan</label>
                <input
                  id="amount"
                  type="text"
                  placeholder="Masukkan jumlah"
                  value={amount ? formatRupiah(parseInt(amount)) : ''}
                  onChange={handleAmountChange}
                />
                <span className="helper-text">Max: {formatRupiah(Math.min(saldo, dailyLimit))}</span>
              </div>

              <button 
                className="modal-btn primary"
                onClick={handleNext}
              >
                Lanjutkan
              </button>
            </>
          ) : (
            <>
              <div className="confirmation-box">
                <div className="confirm-item">
                  <span className="label">Metode</span>
                  <span className="value">{methodNames[method]}</span>
                </div>
                <div className="confirm-item">
                  <span className="label">Nomor</span>
                  <span className="value">{nomor}</span>
                </div>
                <div className="confirm-item">
                  <span className="label">Jumlah</span>
                  <span className="value">{formatRupiah(parseInt(amount))}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="modal-btn secondary"
                  onClick={() => setStep('edit')}
                >
                  Kembali
                </button>
                <button 
                  className="modal-btn primary"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Konfirmasi'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PenarikanModal;