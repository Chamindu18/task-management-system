import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../layout/Navbar';
import { FaBell, FaPalette, FaShieldAlt, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', text: '' });

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
      setToastMessage({ type: 'success', text: 'Email notifications updated successfully' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to update notifications' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        <div className="profile-content-container">
          
          <div className="profile-page-header">
            <nav className="profile-breadcrumb">
              <Link to="/dashboard" className="profile-breadcrumb-link">Home</Link>
              <span className="profile-breadcrumb-separator">›</span>
              <span>Profile</span>
            </nav>
            <h1 className="profile-page-title">My Profile</h1>
            <p className="profile-page-subtitle">Manage your account settings and preferences</p>
          </div>

          <div className="profile-grid-row">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h2>{user.username}</h2>
                <p className="profile-email">{user.email}</p>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role === 'ADMIN' ? '👑' : '👤'} {user.role}
                </span>
                <p className="profile-meta-text">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="profile-quick-actions-card">
              <h3 className="profile-section-title">Quick Stats</h3>
              <div className="profile-stats-grid">
                <div className="profile-stat-item">
                  <span className="profile-stat-icon">✓</span>
                  <div className="profile-stat-details">
                    <span className="profile-stat-label">Tasks Completed</span>
                    <span className="profile-stat-value">0</span>
                  </div>
                </div>
                <div className="profile-stat-item">
                  <span className="profile-stat-icon">🎯</span>
                  <div className="profile-stat-details">
                    <span className="profile-stat-label">Active Tasks</span>
                    <span className="profile-stat-value">0</span>
                  </div>
                </div>
              </div>
              <div className="profile-action-disabled">
                <span>✨ Edit Profile - Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="profile-section-card">
            <div className="profile-section-header">
              <FaBell className="profile-section-icon" />
              <h2 className="profile-section-title">Notification Preferences</h2>
            </div>
            <div className="profile-section-body">
              
              <div className="setting-item">
                <div className="setting-info">
                  <label htmlFor="email-notifications">Email Notifications</label>
                  <span className="setting-description">
                    Receive email reminders for upcoming tasks
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={handleEmailNotificationToggle}
                    aria-label="Toggle email notifications"
                    aria-checked={emailNotifications}
                    role="switch"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item disabled">
                <div className="setting-info">
                  <label>Task Reminders</label>
                  <span className="setting-description">
                    Get notified before task deadlines
                    <span className="profile-coming-soon-badge">Coming Soon</span>
                  </span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" disabled aria-disabled="true" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item disabled">
                <div className="setting-info">
                  <label>Weekly Reports</label>
                  <span className="setting-description">
                    Receive weekly task summary emails
                    <span className="profile-coming-soon-badge">Coming Soon</span>
                  </span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" disabled aria-disabled="true" />
                  <span className="slider"></span>
                </label>
              </div>

            </div>
          </div>

          <div className="profile-section-card">
            <div className="profile-section-header">
              <FaPalette className="profile-section-icon" />
              <h2 className="profile-section-title">Appearance & Preferences</h2>
            </div>
            <div className="profile-section-body">
              
              <div className="setting-item disabled">
                <div className="setting-info">
                  <label>Dark Mode</label>
                  <span className="setting-description">
                    Switch to dark theme
                    <span className="profile-coming-soon-badge">Coming Soon</span>
                  </span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" disabled aria-disabled="true" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item disabled">
                <div className="setting-info">
                  <label>Language</label>
                  <span className="setting-description">
                    Change interface language
                    <span className="profile-coming-soon-badge">Coming Soon</span>
                  </span>
                </div>
                <select disabled className="profile-select-disabled">
                  <option>English</option>
                </select>
              </div>

            </div>
          </div>

          <div className="profile-section-card">
            <div className="profile-section-header">
              <FaShieldAlt className="profile-section-icon" />
              <h2 className="profile-section-title">Security & Privacy</h2>
            </div>
            <div className="profile-section-body">
              
              <div className="setting-item disabled">
                <div className="setting-info">
                  <label>Two-Factor Authentication</label>
                  <span className="setting-description">
                    Add an extra layer of security
                    <span className="profile-coming-soon-badge">Coming Soon</span>
                  </span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" disabled aria-disabled="true" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item disabled">
                <div className="setting-info">
                  <label>Change Password</label>
                  <span className="setting-description">
                    Update your account password
                  </span>
                </div>
                <button disabled className="profile-button-disabled">
                  Change Password
                </button>
              </div>

            </div>
          </div>

          <div className="profile-danger-zone">
            <div className="profile-danger-header">
              <FaExclamationTriangle className="profile-danger-icon" />
              <h2 className="profile-section-title">Danger Zone</h2>
            </div>
            <div className="profile-danger-body">
              
              <div className="setting-item">
                <div className="setting-info">
                  <label>Logout</label>
                  <span className="setting-description">
                    Sign out of your account
                  </span>
                </div>
                <button 
                  className="profile-logout-btn-enhanced"
                  onClick={handleLogout}
                  disabled={loading}
                  aria-label="Logout from your account"
                >
                  <FaSignOutAlt /> {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>

              <div className="setting-item disabled">
                <div className="setting-info">
                  <label>Deactivate Account</label>
                  <span className="setting-description">
                    Permanently delete your account
                    <span className="profile-coming-soon-badge">Coming Soon</span>
                  </span>
                </div>
                <button disabled className="profile-danger-button-disabled">
                  Deactivate
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {showToast && (
        <div className="profile-toast-container">
          <div className={`profile-toast profile-toast-${toastMessage.type}`}>
            <span className="profile-toast-icon">
              {toastMessage.type === 'success' ? '✓' : '✕'}
            </span>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;