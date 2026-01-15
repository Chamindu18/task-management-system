import React, { useState } from 'react';
import { User, Bell, Mail, Shield, Save } from 'lucide-react';

const SettingsPanel = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Settings - Super Simple (No department, no bio)
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@dreamdoo.com',
    phone: '+94 77 123 4567'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyReports: false,
    systemAlerts: true
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings({ ...notificationSettings, [key]: !notificationSettings[key] });
  };

  const handleSave = async (section) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Real API call when backend ready
      // await fetch('/api/settings', {
      //   method: 'PUT',
      //   body: JSON.stringify({ section, data: section === 'profile' ? profileData : notificationSettings })
      // });

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Only 2 sections
  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="settings-panel">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account preferences</p>
      </div>

      <div className="settings-layout">
        {/* Sidebar */}
        <div className="settings-sidebar">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon size={20} />
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Success/Error Message */}
          {message.text && (
            <div className={`settings-message ${message.type}`}>
              {message.type === 'success' ? '✓' : '✗'} {message.text}
            </div>
          )}

          {/* Profile Section - Super Simple */}
          {activeSection === 'profile' && (
            <div className="settings-section">
              <h2 className="section-title">Profile Information</h2>
              <p className="section-desc">Update your personal information</p>

              <div className="settings-form">
                {/* Name */}
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="+94 77 XXX XXXX"
                  />
                </div>

                {/* Save Button */}
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleSave('profile')}
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h2 className="section-title">Notification Preferences</h2>
              <p className="section-desc">Choose what notifications you want to receive</p>

              <div className="settings-form">
                <div className="toggle-group">
                  {/* Email Notifications */}
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <Mail size={20} />
                      <div>
                        <h4>Email Notifications</h4>
                        <p>Receive updates via email</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationToggle('emailNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* Task Reminders */}
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <Bell size={20} />
                      <div>
                        <h4>Task Reminders</h4>
                        <p>Get reminders for upcoming tasks</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.taskReminders}
                        onChange={() => handleNotificationToggle('taskReminders')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* Weekly Reports */}
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <Mail size={20} />
                      <div>
                        <h4>Weekly Reports</h4>
                        <p>Receive weekly performance reports</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyReports}
                        onChange={() => handleNotificationToggle('weeklyReports')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* System Alerts */}
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <Shield size={20} />
                      <div>
                        <h4>System Alerts</h4>
                        <p>Important system notifications</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.systemAlerts}
                        onChange={() => handleNotificationToggle('systemAlerts')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleSave('notifications')}
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;