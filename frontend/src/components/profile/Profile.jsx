import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch email notification setting on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/user/settings');
        setEmailNotifications(response.data.emailNotifications);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleEmailNotificationToggle = async () => {
    try {
      const newValue = !emailNotifications;
      const response = await api.patch(
        `/user/settings/email-notifications?enabled=${newValue}`
      );
      setEmailNotifications(response.data.emailNotifications);
      setMessage({ type: 'success', text: 'Email notifications updated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notifications' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2>{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <span className={`role-badge ${user.role.toLowerCase()}`}>
              {user.role}
            </span>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-section">
          <h3>Settings</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Email Notifications</label>
              <span className="setting-description">
                Receive email reminders for upcoming tasks
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={handleEmailNotificationToggle}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item disabled">
            <div className="setting-info">
              <label>Dark Mode</label>
              <span className="setting-description">Coming Soon</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" disabled />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item disabled">
            <div className="setting-info">
              <label>Two-Factor Authentication</label>
              <span className="setting-description">Coming Soon</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" disabled />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <button 
          className="logout-button" 
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Profile;