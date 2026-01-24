import { useAuth } from '../../hooks/useAuth';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import './Profile.css'; 

function Profile() {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="profile-content">
                <div className="profile-container">
                    {/* PROFILE HEADER */}
                    <div className="profile-header">
                        <h1 className="profile-title">User Profile</h1>
                        <p className="profile-subtitle">Manage your account information and preferences</p>
                    </div>

                    {/* PROFILE INFO CARD */}
                    <div className="profile-card">
                        <div className="profile-main">
                            <div className="profile-avatar">
                                <span className="avatar-icon">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="profile-user">
                                <h3 className="profile-name">{user?.username || 'User'}</h3>
                                <p className="profile-email">{user?.email || '--'}</p>
                            </div>
                            <button className="pill-button icon-btn" aria-label="Profile settings">⚙</button>
                        </div>

                        <div className="profile-info">
                            <div className="info-item">
                                <label>Username</label>
                                <p>{user?.username || '--'}</p>
                            </div>
                            
                            <div className="info-item">
                                <label>Email Address</label>
                                <p>{user?.email || '--'}</p>
                            </div>
                            
                            <div className="info-item">
                                <label>Role</label>
                                <p className="role-badge">{user?.role || '--'}</p>
                            </div>
                            
                            <div className="info-item">
                                <label>User ID</label>
                                <p>{user?.id || '--'}</p>
                            </div>
                        </div>
                    </div>

                    {/* PLACEHOLDER FOR PROFILE SETTINGS */}
                    <div className="settings-section">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">Profile Settings</p>
                                <h2>Personalization</h2>
                            </div>
                            <button className="pill-button ghost">Manage</button>
                        </div>

                        <div className="settings-grid">
                            <div className="setting-card">
                                <div className="setting-title">
                                    <h3>Notifications</h3>
                                    <span className="chip">Email + Push</span>
                                </div>
                                <p className="setting-desc">Stay updated on task assignments, mentions, and due dates with a gentle daily digest.</p>
                                <div className="setting-actions">
                                    <button className="pill-button primary">Enable</button>
                                    <button className="pill-button outline">Customize</button>
                                </div>
                            </div>

                            <div className="setting-card">
                                <div className="setting-title">
                                    <h3>Workspace Theme</h3>
                                    <span className="chip">Calm</span>
                                </div>
                                <p className="setting-desc">Switch between light, dark, or the new gradient calm palette to match your mood.</p>
                                <div className="setting-actions">
                                    <button className="pill-button primary">Apply</button>
                                    <button className="pill-button outline">Preview</button>
                                </div>
                            </div>

                            <div className="setting-card">
                                <div className="setting-title">
                                    <h3>Language</h3>
                                    <span className="chip">English</span>
                                </div>
                                <p className="setting-desc">Choose your preferred language for notifications and dashboard labels.</p>
                                <div className="setting-actions">
                                    <button className="pill-button primary">Set</button>
                                    <button className="pill-button outline">More</button>
                                </div>
                            </div>

                            <div className="setting-card">
                                <div className="setting-title">
                                    <h3>Time Zone</h3>
                                    <span className="chip">Local</span>
                                </div>
                                <p className="setting-desc">Align reminders and due dates with your local time for consistent scheduling.</p>
                                <div className="setting-actions">
                                    <button className="pill-button primary">Sync</button>
                                    <button className="pill-button outline">Adjust</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="security-section">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">Security Settings</p>
                                <h2>Protection</h2>
                            </div>
                            <button className="pill-button ghost">Secure</button>
                        </div>

                        <div className="settings-grid">
                            <div className="setting-card">
                                <div className="setting-title">
                                    <h3>Password</h3>
                                    <span className="chip">Strong</span>
                                </div>
                                <p className="setting-desc">Use a unique phrase with numbers and symbols. Rotate it every 90 days.</p>
                                <div className="setting-actions">
                                    <button className="pill-button primary">Update</button>
                                    <button className="pill-button outline">Guide</button>
                                </div>
                            </div>

                            <div className="setting-card">
                                <div className="setting-title">
                                    <h3>Two-Factor</h3>
                                    <span className="chip warn">Off</span>
                                </div>
                                <p className="setting-desc">Add an extra verification step using authenticator apps or SMS codes.</p>
                                <div className="setting-actions">
                                    <button className="pill-button primary">Enable</button>
                                    <button className="pill-button outline">Methods</button>
                                </div>
                            </div>

                            <div className="setting-card">
                                <div className="setting-title">
                                    <h3>Devices</h3>
                                    <span className="chip">2 active</span>
                                </div>
                                <p className="setting-desc">Review and sign out sessions that you no longer recognize or use.</p>
                                <div className="setting-actions">
                                    <button className="pill-button primary">View</button>
                                    <button className="pill-button outline">Sign out</button>
                                </div>
                            </div>

                            <div className="setting-card">
                                <div className="setting-title">
                                    <h3>Data Export</h3>
                                    <span className="chip">Available</span>
                                </div>
                                <p className="setting-desc">Download your tasks, activity logs, and analytics for your records.</p>
                                <div className="setting-actions">
                                    <button className="pill-button primary">Export</button>
                                    <button className="pill-button outline">Options</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Profile;