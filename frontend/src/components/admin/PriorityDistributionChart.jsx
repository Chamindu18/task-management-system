import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const PriorityDistributionChart = ({ tasks = [] }) => {
  const priorityCount = useMemo(() => {
    // Backend sends priority as uppercase: "HIGH", "MEDIUM", "LOW"
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    if (tasks && Array.isArray(tasks)) {
      tasks.forEach(task => {
        // Defensive check: ensure priority exists and is a valid string
        if (task.priority && typeof task.priority === 'string') {
          // Normalize to uppercase to match backend enum values
          const normalizedPriority = task.priority.toUpperCase();
          if (counts.hasOwnProperty(normalizedPriority)) {
            counts[normalizedPriority]++;
          }
        }
      });
    }
    return [
      { name: 'High', value: counts.HIGH, color: '#ef4444' },
      { name: 'Medium', value: counts.MEDIUM, color: '#f59e0b' },
      { name: 'Low', value: counts.LOW, color: '#10b981' }
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