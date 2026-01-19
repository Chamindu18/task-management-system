import React, { useState } from 'react';
import { FaSearch, FaFilter, FaRedo } from 'react-icons/fa';

const TaskFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'dueDate',
    sortDir: 'asc'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const resetFilters = () => {
    const reset = {
      search: '',
      status: '',
      priority: '',
      sortBy: 'dueDate',
      sortDir: 'asc'
    };
    setFilters(reset);
    onFilter(reset);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '30px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      marginBottom: '30px'
    }}>
      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <FaFilter style={{ color: '#6366f1' }} />
        Search & Filter Tasks
      </h3>

      <form onSubmit={handleSearch}>
        {/* Search Box */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '4px 4px 4px 20px',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <FaSearch style={{ color: '#94a3b8', marginRight: '12px' }} />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search tasks by title or description..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                padding: '12px 8px',
                fontSize: '1rem',
                outline: 'none',
                color: '#1e293b'
              }}
            />
          </div>
        </div>

        {/* Filter Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                background: 'white',
                color: '#1e293b',
                fontWeight: '500'
              }}
            >
              <option value="">All Status</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="IN_PROGRESS">🔄 In Progress</option>
              <option value="COMPLETED">✅ Completed</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Priority
            </label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                background: 'white',
                color: '#1e293b',
                fontWeight: '500'
              }}
            >
              <option value="">All Priorities</option>
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Sort By
            </label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                background: 'white',
                color: '#1e293b',
                fontWeight: '500'
              }}
            >
              <option value="dueDate">📅 Due Date</option>
              <option value="priority">🚨 Priority</option>
              <option value="status">📊 Status</option>
              <option value="createdAt">🕐 Created Date</option>
              <option value="title">📝 Title</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Order
            </label>
            <select
              name="sortDir"
              value={filters.sortDir}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                background: 'white',
                color: '#1e293b',
                fontWeight: '500'
              }}
            >
              <option value="asc">⬆️ Ascending</option>
              <option value="desc">⬇️ Descending</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={resetFilters}
            style={{
              padding: '10px 20px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              background: 'white',
              color: '#64748b',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.color = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.color = '#64748b';
            }}
          >
            <FaRedo /> Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskFilters;