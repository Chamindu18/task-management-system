import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const TaskStatusChart = ({ data = {} }) => {
  // Handle missing or null data
  if (!data || !data.completedTasks) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">Task Status Distribution</h3>
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          No stats data available
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Completed', value: data.completedTasks, color: '#10b981' },
    { name: 'In Progress', value: data.totalTasks - data.completedTasks - data.pendingTasks - data.overdueTasks, color: '#3b82f6' },
    { name: 'Pending', value: data.pendingTasks, color: '#f59e0b' },
    { name: 'Overdue', value: data.overdueTasks, color: '#ef4444' }
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Task Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskStatusChart;