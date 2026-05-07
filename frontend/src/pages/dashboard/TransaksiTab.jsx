import React, { useState, useEffect } from 'react';
import { Check, Clock, X, RefreshCw } from 'lucide-react';
import { fetchWithAuth } from '../../utils/auth';

const TransaksiTab = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransaksi = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWithAuth('/api/users/me/transactions');
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Gagal memuat transaksi');
        return;
      }
      const data = await res.json();
      console.log('[TransaksiTab] Loaded:', data.transactions?.length, 'items');
      setTransaksi(data.transactions || []);
    } catch (err) {
      console.error('[TransaksiTab] Error:', err.message);
      setError('Tidak dapat terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <Check size={18} className="icon-success" />;
      case 'pending':
        return <Clock size={18} className="icon-pending" />;
      case 'failed':
      case 'cancelled':
        return <X size={18} className="icon-failed" />;
      default:
        return <Clock size={18} className="icon-pending" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: 'Selesai',
      verified: 'Terverifikasi',
      pending: 'Menunggu',
      failed: 'Gagal',
      cancelled: 'Dibatalkan',
    };
    return labels[status] || status;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="transaksi-tab">
        <div className="transaksi-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="transaksi-item skeleton-item">
              <div className="skeleton-line wide" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="transaksi-tab">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>Gagal Memuat Transaksi</h3>
          <p>{error}</p>
          <button className="cta-button" onClick={fetchTransaksi}>
            <RefreshCw size={16} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state (real — user has no transactions yet)
  if (transaksi.length === 0) {
    return (
      <div className="transaksi-tab">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Belum Ada Transaksi</h3>
          <p>Mulai melakukan recycling untuk melihat riwayat transaksi Anda di sini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaksi-tab">
      <div className="transaksi-list">
        {transaksi.map(item => (
          <div key={item.id} className={`transaksi-item status-${item.status}`}>
            <div className="transaksi-info">
              <div className="transaksi-date">{formatDate(item.tanggal)}</div>
              {item.lokasi && (
                <div className="transaksi-location">📍 {item.lokasi}</div>
              )}
              <div className="transaksi-status">
                {getStatusIcon(item.status)}
                <span>{getStatusLabel(item.status)}</span>
              </div>
            </div>
            <div className="transaksi-amount">
              {formatRupiah(item.jumlah)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransaksiTab;