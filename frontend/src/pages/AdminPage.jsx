import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import UserAnalytics from '../components/admin/UserAnalytics';
import SettingsPanel from '../components/admin/SettingsPanel';
import "../components/styles/Admin.css";


const AdminPage = () => {
  const { user, login, logout } = useAuth();
  const { fetchData, loading } = useApi();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      login({ name: 'Admin User', email: 'admin@dreamdoo.com', role: 'Administrator' });
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('📥 Fetching admin data from backend...');
      const [usersResponse, tasksResponse, statsResponse] = await Promise.all([
        fetchData('/admin/users'),
        fetchData('/admin/tasks'),
        fetchData('/admin/stats')
      ]);
      
      console.log('✅ Users Response:', usersResponse);
      console.log('✅ Tasks Response:', tasksResponse);
      console.log('✅ Stats Response:', statsResponse);
      
      const users = usersResponse?.data || [];
      const tasks = tasksResponse?.data || [];
      const stats = statsResponse?.data || {};
      
      console.log('📊 Processed Users:', users);
      console.log('📊 Processed Tasks:', tasks);
      console.log('📊 Processed Stats:', stats);
      
      setUsers(users);
      setTasks(tasks);
      setStats(stats);
      setLoaded(true);
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      setStats({});
      setLoaded(true);
    }
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    // TODO: Backend API call
    // await fetch('/api/users', { method: 'POST', body: JSON.stringify(newUser) });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!loaded) {
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
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
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