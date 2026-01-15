import React from 'react';
import { CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';
import formatters from '../../utils/formatters';
import TaskStatusChart from './TaskStatusChart';
import UserActivityChart from './UserActivityChart';
import PriorityDistributionChart from './PriorityDistributionChart';

const AdminDashboard = ({ stats, tasks, activityData = [] }) => {
  // Simple stat cards - no export button
  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#3b82f6'  },
    { icon: CheckCircle, label: 'Completed Tasks', value: stats.completedTasks, color: '#10b981' },
    { icon: Clock, label: 'Pending Tasks', value: stats.pendingTasks, color: '#f59e0b' },
    { icon: AlertCircle, label: 'Overdue Tasks', value: stats.overdueTasks, color: '#ef4444' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Header - Simple without export button */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{formatters.number(stat.value)}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <TaskStatusChart data={stats} />
        <UserActivityChart data={activityData} />
      </div>

      <div className="charts-grid">
        <PriorityDistributionChart tasks={tasks} />
        
        {/* Quick Stats */}
        <div className="chart-container">
          <h3 className="chart-title">Quick Stats</h3>
          <div className="quick-stats">
            <div className="quick-stat-item">
              <span className="qs-label">Completion Rate</span>
              <span className="qs-value">{stats.completionRate}%</span>
            </div>
            <div className="quick-stat-item">
              <span className="qs-label">Active Users</span>
              <span className="qs-value">{stats.activeUsers}</span>
            </div>
            <div className="quick-stat-item">
              <span className="qs-label">Tasks This Week</span>
              <span className="qs-value">{stats.tasksThisWeek}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;