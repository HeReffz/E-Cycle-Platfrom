import React, { useState } from 'react';
import { Wallet, TrendingUp, Send } from 'lucide-react';
import SaldoTab from './SaldoTab';
import TransaksiTab from './TransaksiTab';
import PenarikanTab from './PenarikanTab';
import '../../styles/dashboard.css';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('saldo');

  const tabs = [
    { id: 'saldo', label: 'Saldo', icon: Wallet },
    { id: 'transaksi', label: 'Transaksi', icon: TrendingUp },
    { id: 'penarikan', label: 'Penarikan', icon: Send }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard E-Cycle</h1>
        <p>Kelola saldo dan transaksi Anda</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <TabIcon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'saldo' && <SaldoTab />}
        {activeTab === 'transaksi' && <TransaksiTab />}
        {activeTab === 'penarikan' && <PenarikanTab />}
      </div>
    </div>
  );
};

export default DashboardPage;