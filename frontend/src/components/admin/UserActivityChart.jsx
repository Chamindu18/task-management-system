import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserActivityChart = ({ data = [] }) => {
  // If no data provided, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">User Activity (Last 7 Days)</h3>
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          No activity data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">User Activity (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="inactive" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityChart;