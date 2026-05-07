import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Send, LogOut, User } from 'lucide-react';
import SaldoTab from './SaldoTab';
import TransaksiTab from './TransaksiTab';
import PenarikanTab from './PenarikanTab';
import { fetchWithAuth, getUser, logout } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('saldo');
  const [user, setUser] = useState(getUser()); // Cached user from localStorage
  const [balance, setBalance] = useState(null);  // null = loading
  const [balanceError, setBalanceError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const balRes = await fetchWithAuth('/api/users/me/balance');
      if (balRes.ok) {
        const balData = await balRes.json();
        setBalance(balData.balance);
      } else {
        setBalanceError('Gagal memuat saldo');
      }

      const userRes = await fetchWithAuth('/api/users/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err.message);
      setBalanceError('Tidak dapat terhubung ke server');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/LoginPage', { replace: true });
  };

  const tabs = [
    { id: 'saldo', label: 'Saldo', icon: Wallet },
    { id: 'transaksi', label: 'Transaksi', icon: TrendingUp },
    { id: 'penarikan', label: 'Penarikan', icon: Send },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-top">
          <div className="dashboard-greeting">
            <div className="dashboard-avatar">
              <User size={24} />
            </div>
            <div>
              <h1>Dashboard E-Cycle</h1>
              <p>Halo, <strong>{user?.name || user?.email || 'Pengguna'}</strong> 👋</p>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
            id="dashboard-logout-btn"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`tab-button${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <TabIcon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'saldo' && (
          <SaldoTab 
            balance={balance} 
            balanceError={balanceError} 
            onWithdrawClick={() => setActiveTab('penarikan')}
          />
        )}
        {activeTab === 'transaksi' && <TransaksiTab />}
        {activeTab === 'penarikan' && (
          <PenarikanTab balance={balance} refreshData={fetchDashboardData} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;