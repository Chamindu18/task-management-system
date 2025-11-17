import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';
import './AdminDashboard.css'; 

function AdminDashboard() {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="admin-content">
                <div className="admin-container">
                    {/* ADMIN WELCOME BANNER */}
                    <div className="admin-banner">
                        <div className="banner-icon">👑</div>
                        <div className="banner-content">
                            <h1>Admin Dashboard</h1>
                            <p>Welcome, <strong>{user?.username}</strong>! You have administrator privileges.</p>
                        </div>
                    </div>

                    {/* ADMIN QUICK ACTIONS GRID */}
                    <div className="admin-actions-grid">
                        <div className="action-card">
                            <div className="action-icon">👥</div>
                            <h3>User Management</h3>
                            <p>Manage system users and permissions</p>
                        </div>
                        
                        <div className="action-card">
                            <div className="action-icon">📋</div>
                            <h3>Task Overview</h3>
                            <p>View and manage all system tasks</p>
                        </div>
                        
                        <div className="action-card">
                            <div className="action-icon">📊</div>
                            <h3>Statistics</h3>
                            <p>System analytics and reports</p>
                        </div>
                        
                        <div className="action-card">
                            <div className="action-icon">⚙️</div>
                            <h3>System Settings</h3>
                            <p>Configure system preferences</p>
                        </div>
                    </div>

                    {/* ADMIN FEATURES SECTION */}
                    <div className="admin-features">
                        <h2>Admin Features</h2>
                        <div className="features-grid">
                            <div className="feature-item">
                                <h4>User Management</h4>
                                <p>Create, edit, and manage user accounts</p>
                            </div>
                            <div className="feature-item">
                                <h4>Task Overview</h4>
                                <p>Monitor all tasks across the system</p>
                            </div>
                            <div className="feature-item">
                                <h4>System Reports</h4>
                                <p>Generate and export system reports</p>
                            </div>
                            <div className="feature-item">
                                <h4>Admin Settings</h4>
                                <p>Configure system-wide settings</p>
                            </div>
                        </div>
                    </div>

                    {/* PLACEHOLDER FOR STATISTICS */}
                    <div className="stats-placeholder">
                        <h2>System Statistics</h2>
                        <div className="placeholder-content">
                            <p>Real-time statistics and charts will be displayed here</p>
                        </div>
                    </div>

                    {/* PLACEHOLDER FOR RECENT ACTIVITY */}
                    <div className="activity-placeholder">
                        <h2>Recent System Activity</h2>
                        <div className="placeholder-content">
                            <p>Recent admin activities and system events will appear here</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default AdminDashboard;