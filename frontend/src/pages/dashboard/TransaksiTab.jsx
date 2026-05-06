import React, { useState, useEffect } from 'react';
import { Check, Clock, X } from 'lucide-react';

const TransaksiTab = () => {
  const [transaksi, setTransaksi] = useState([]);

  useEffect(() => {
    // Mock transaksi data
    const mockTransaksi = [
      { id: 1, tanggal: '2026-05-05', jumlah: 50000, status: 'success' },
      { id: 2, tanggal: '2026-05-04', jumlah: 75000, status: 'pending' },
      { id: 3, tanggal: '2026-05-03', jumlah: 100000, status: 'success' },
      { id: 4, tanggal: '2026-05-02', jumlah: 25000, status: 'failed' }
    ];
    setTransaksi(mockTransaksi);
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <Check size={20} className="icon-success" />;
      case 'pending':
        return <Clock size={20} className="icon-pending" />;
      case 'failed':
        return <X size={20} className="icon-failed" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      success: 'Berhasil',
      pending: 'Menunggu',
      failed: 'Gagal'
    };
    return labels[status] || status;
  };

  return (
    <div className="transaksi-tab">
      {transaksi.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Belum Ada Transaksi</h3>
          <p>Mulai melakukan recycling untuk melihat transaksi Anda di sini</p>
        </div>
      ) : (
        <div className="transaksi-list">
          {transaksi.map(item => (
            <div key={item.id} className={`transaksi-item status-${item.status}`}>
              <div className="transaksi-info">
                <div className="transaksi-date">{
                  formatDate(item.tanggal)
                }</div>
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
      )}
    </div>
  );
};

export default TransaksiTab;