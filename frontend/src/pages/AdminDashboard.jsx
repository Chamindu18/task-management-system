
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';

function AdminDashboard() {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="dashboard-content" style={{ 
                marginLeft: '240px', 
                marginTop: '70px', 
                padding: '20px' 
            }}>
                <div className="alert alert-success">
                    <h2>👑 Admin Dashboard</h2>
                    <p>Welcome, <strong>{user?.username}</strong>! You have administrator privileges.</p>
                </div>
                
                <div className="row">
                    <div className="col-md-4">
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Users</h5>
                                <p className="card-text">Manage system users</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-white bg-success mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Tasks</h5>
                                <p className="card-text">View all tasks</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-white bg-info mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Statistics</h5>
                                <p className="card-text">System analytics</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title">Admin Features</h5>
                        <ul>
                            <li>User Management</li>
                            <li>Task Overview</li>
                            <li>System Reports</li>
                            <li>Admin Settings</li>
                        </ul>
                        <p className="text-muted">
                            This is a skeleton admin dashboard. Full implementation will be done later.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}

export default AdminDashboard;