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
                        <div className="profile-avatar">
                            <span className="avatar-icon">
                                {user?.username?.charAt(0).toUpperCase()}
                            </span>
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
                        <h2>Profile Settings</h2>
                        <div className="settings-placeholder">
                            <p>Profile settings and edit functionality will be implemented here</p>
                        </div>
                    </div>

                    {/* PLACEHOLDER FOR SECURITY SETTINGS */}
                    <div className="security-section">
                        <h2>Security Settings</h2>
                        <div className="security-placeholder">
                            <p>Password change and security preferences will be here</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Profile;