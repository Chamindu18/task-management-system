import React, { useState } from 'react';
import { FaSearch, FaFilter, FaRedo, FaChevronDown } from 'react-icons/fa';

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

  // Inline styles for select dropdowns
  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
    background: 'white',
    color: '#1e293b',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '20px',
    paddingRight: '40px'
  };

  return (
    <>
      <style>{`
        select {
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 20px !important;
          padding-right: 40px !important;
        }
        
        select::-ms-expand {
          display: none;
        }
        
        select option {
          padding: 10px;
          background: white;
          color: #1e293b;
          font-weight: 500;
        }
      `}</style>
    <div style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)',
      borderRadius: '24px',
      padding: '35px',
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.12)',
      marginBottom: '30px',
      border: '2px solid rgba(99, 102, 241, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        transform: 'translate(50%, -50%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(240, 147, 251, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        transform: 'translate(-50%, 50%)',
        pointerEvents: 'none'
      }} />
      
      <h3 style={{
        fontSize: '1.4rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        <FaFilter style={{ color: '#667eea' }} />
        Search & Filter Tasks
      </h3>

      <form onSubmit={handleSearch} style={{ position: 'relative', zIndex: 1 }}>
        {/* Search Box */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            border: '2px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '14px',
            padding: '4px 4px 4px 20px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#667eea';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.08)';
          }}
          >
            <FaSearch style={{ color: '#667eea', marginRight: '12px', fontSize: '18px' }} />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="🔍 Search tasks..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                padding: '14px 12px',
                fontSize: '1rem',
                outline: 'none',
                color: '#1e293b',
                fontWeight: '500'
              }}
            />
          </div>
        </div>

        {/* Filter Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          marginBottom: '24px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '0.85rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              style={selectStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.08)';
              }}
            >
              <option value="">All Status</option>
              <option value="TODO">⏳ Todo</option>
              <option value="IN_PROGRESS">🔄 In Progress</option>
              <option value="DONE">✅ Done</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '0.85rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Priority
            </label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleChange}
              style={selectStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.08)';
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
              marginBottom: '10px',
              fontSize: '0.85rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Sort By
            </label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              style={selectStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.08)';
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
              style={selectStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.08)';
              }}
            >
              <option value="asc">⬆️ Ascending</option>
              <option value="desc">⬇️ Descending</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={resetFilters}
            style={{
              padding: '12px 24px',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              background: 'white',
              color: '#667eea',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.08)';
            }}
          >
            <FaRedo /> Reset Filters
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default TaskFilters;