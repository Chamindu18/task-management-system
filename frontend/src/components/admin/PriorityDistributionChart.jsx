import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const PriorityDistributionChart = ({ tasks = [] }) => {
  const priorityCount = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    if (tasks && Array.isArray(tasks)) {
      tasks.forEach(task => {
        if (task.priority && counts.hasOwnProperty(task.priority)) {
          counts[task.priority]++;
        }
      });
    }
    return [
      { name: 'High', value: counts.High, color: '#ef4444' },
      { name: 'Medium', value: counts.Medium, color: '#f59e0b' },
      { name: 'Low', value: counts.Low, color: '#10b981' }
    ];
  }, [tasks]);

  // Show empty state if no data
  if (!tasks || tasks.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">Task Priority Distribution</h3>
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          No task data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Task Priority Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={priorityCount}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            {priorityCount.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityDistributionChart;