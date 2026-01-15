import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import UserAnalytics from '../components/admin/UserAnalytics';
import SettingsPanel from '../components/admin/SettingsPanel';
import "../components/styles/Admin.css";


const AdminPage = () => {
  const { user, login } = useAuth();
  const { fetchData, loading } = useApi();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!user) {
      login({ name: 'Admin User', email: 'admin@dreamdoo.com', role: 'Administrator' });
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, tasksData, statsData] = await Promise.all([
        fetchData('/api/users'),
        fetchData('/api/tasks'),
        fetchData('/api/stats')
      ]);
      setUsers(usersData);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    // TODO: Backend API call
    // await fetch('/api/users', { method: 'POST', body: JSON.stringify(newUser) });
  };

  if (!stats) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading DreamDoo Admin...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <div className="nav-brand">
          <h2>DreamDoo</h2>
          <span className="nav-badge">Admin</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={18} />
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Users
          </button>
          <button
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            Settings
          </button>
        </div>
        <div className="nav-user">
          <div className="nav-avatar">{user?.name?.charAt(0) || 'A'}</div>
          <span className="nav-username">{user?.name || 'Admin'}</span>
        </div>
      </nav>

      <main className="admin-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loader"></div>
          </div>
        )}
        
        {activeTab === 'dashboard' && <AdminDashboard stats={stats} tasks={tasks} />}
        {activeTab === 'users' && (
          <UserManagement 
            users={users} 
            onRefresh={loadData}
            onSelectUser={setSelectedUser}
            onAddUser={handleAddUser}
          />
        )}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>

      {selectedUser && (
        <UserAnalytics 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default AdminPage;