import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import './Dashboard.css'; 

function Dashboard() {
    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="dashboard-content">
                <div className="dashboard-container">
                
                    <div className="welcome-section">
                        <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Manage your tasks efficiently and stay organized with our powerful task management system.
                        </p>
                    </div>

                    
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📋</div>
                            <div className="stat-content">
                                <h3>Total Tasks</h3>
                                <p className="stat-number">0</p>
                                <span className="stat-label">All tasks in system</span>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <h3>Completed</h3>
                                <p className="stat-number">0</p>
                                <span className="stat-label">Tasks done</span>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-content">
                                <h3>Pending</h3>
                                <p className="stat-number">0</p>
                                <span className="stat-label">Awaiting action</span>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-content">
                                <h3>Team Members</h3>
                                <p className="stat-number">0</p>
                                <span className="stat-label">Active users</span>
                            </div>
                        </div>
                    </div>

                    {/* RECENT ACTIVITY PLACEHOLDER */}
                    <div className="activity-section">
                        <h2>Recent Activity</h2>
                        <div className="activity-placeholder">
                            <p>Your recent activities will appear here once you start using the system.</p>
                            <button className="cta-button">
                                Create Your First Task
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Dashboard;