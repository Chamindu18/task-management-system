import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useApi from '../../hooks/useApi';
import formatters from '../../utils/formatters';

const UserAnalytics = ({ user, onClose }) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchData } = useApi();

  useEffect(() => {
    loadUserAnalytics();
  }, [user.id, timeRange]);

  const loadUserAnalytics = async () => {
    setLoading(true);
    try {
      // TODO: Real API call when backend ready
      // const data = await fetchData(`/api/users/${user.id}/analytics?range=${timeRange}`);
      const data = await fetchData(`/api/users/${user.id}/analytics?range=${timeRange}`);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading || !analytics) {
    return (
      <div className="analytics-overlay" onClick={onClose}>
        <div className="analytics-modal loading-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loader"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { stats, dailyActivity, priorityDistribution, performanceTrends, recentActivities } = analytics;

  return (
    <div className="analytics-overlay" onClick={onClose}>
      <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header - No Export Button */}
        <div className="analytics-header">
          <div className="analytics-user-info">
            <div className="analytics-avatar">{user.name.charAt(0)}</div>
            <div>
              <h2 className="analytics-title">{user.name} - Analytics</h2>
              <p className="analytics-subtitle">{user.email}</p>
            </div>
          </div>
          <div className="analytics-header-actions">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 3 Months</option>
              <option value="year">This Year</option>
            </select>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="analytics-body">
          {/* Key Metrics - 4 Cards */}
          <div className="analytics-metrics">
            <div className="metric-card">
              <div className="metric-icon" style={{ background: '#dbeafe' }}>
                <CheckCircle size={24} color="#3b82f6" />
              </div>
              <div>
                <p className="metric-label">Tasks Completed</p>
                <h3 className="metric-value">{stats.tasksCompleted}</h3>
                <span className="metric-trend positive">+12% from last period</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: '#fef3c7' }}>
                <Clock size={24} color="#f59e0b" />
              </div>
              <div>
                <p className="metric-label">In Progress</p>
                <h3 className="metric-value">{stats.tasksInProgress}</h3>
                <span className="metric-trend neutral">{stats.tasksPending} pending</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: '#dcfce7' }}>
                <TrendingUp size={24} color="#10b981" />
              </div>
              <div>
                <p className="metric-label">Completion Rate</p>
                <h3 className="metric-value">{stats.completionRate}%</h3>
                <span className="metric-trend positive">Above average</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: '#f3e8ff' }}>
                <AlertCircle size={24} color="#a855f7" />
              </div>
              <div>
                <p className="metric-label">On-Time Rate</p>
                <h3 className="metric-value">{stats.onTimeRate}%</h3>
                <span className="metric-trend positive">Excellent</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="analytics-charts">
            {/* Daily Activity Bar Chart */}
            <div className="analytics-chart-card">
              <h3 className="chart-card-title">Daily Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="started" fill="#3b82f6" name="Started" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Priority Distribution Pie Chart */}
            <div className="analytics-chart-card">
              <h3 className="chart-card-title">Tasks by Priority</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={priorityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Trends Line Chart */}
          <div className="analytics-chart-card full-width">
            <h3 className="chart-card-title">Performance Trends (6 Months)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Tasks Completed"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="quality" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Quality Score %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>


        </div>

        {/* Footer - Simple Close Button Only */}
        <div className="analytics-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;