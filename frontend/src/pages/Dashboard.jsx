// Final Dashboard.jsx - Error-Free Version
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import { 
  FaPlus, FaTasks, FaCheckCircle, FaClock, 
  FaExclamationTriangle, FaEdit, FaTrash, 
  FaHome, FaClipboardList, FaChartBar, FaUser,
  FaCog, FaChevronLeft, FaChevronRight, FaFlag
} from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const {
    tasks = [],
    loading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({});
  const [activeMenu, setActiveMenu] = useState('home');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await fetchTasks({ page: 0, size: 10 });
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }
    };
    loadTasks();
  }, []);

  // Safe stats calculation with fallback
  const stats = tasks && tasks.length > 0 
    ? getTaskStats() 
    : { total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0 };

  // Handlers
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchTasks({ ...newFilters, page: 0 }).catch(err => {
      console.error('Filter error:', err);
    });
  };

  const handlePageChange = (page) => {
    fetchTasks({ ...filters, page }).catch(err => {
      console.error('Pagination error:', err);
    });
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowForm(false);
    } catch (err) {
      console.error('Create task error:', err);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Update task error:', err);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (err) {
        console.error('Delete task error:', err);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    for (let i = 1; i <= Math.min(daysInMonth, 7); i++) {
      const isToday = i === today && 
                      currentDate.getMonth() === currentMonth && 
                      currentDate.getFullYear() === currentYear;
      days.push({ day: i, isToday });
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="dashboard-layout">
      {/* Left Icon Sidebar */}
      <aside className="icon-sidebar">
        <div className="icon-sidebar-logo">
          ✅
        </div>
        <div className="icon-sidebar-menu">
          <div 
            className={`icon-menu-item ${activeMenu === 'home' ? 'active' : ''}`}
            onClick={() => setActiveMenu('home')}
            title="Home"
          >
            <FaHome />
          </div>
          <div 
            className={`icon-menu-item ${activeMenu === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveMenu('tasks')}
            title="Tasks"
          >
            <FaClipboardList />
          </div>
          <div 
            className={`icon-menu-item ${activeMenu === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveMenu('analytics')}
            title="Analytics"
          >
            <FaChartBar />
          </div>
          <div 
            className={`icon-menu-item ${activeMenu === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveMenu('profile')}
            title="Profile"
          >
            <FaUser />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Card */}
        <div className="welcome-card">
          <div className="welcome-content">
            <h1>Good Morning, {user?.username || 'User'}! 👋</h1>
            <p>Have a nice day at work</p>
          </div>
          <div className="welcome-illustration">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.2"/>
              <circle cx="100" cy="80" r="40" fill="url(#grad1)"/>
              <rect x="70" y="110" width="60" height="70" rx="10" fill="url(#grad1)"/>
            </svg>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#991b1b',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Stats Grid - 4 cards in one row */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-header">
              <div className="stat-icon">
                <FaTasks />
              </div>
              <div>
                <div className="stat-title">Total Tasks</div>
                <div className="stat-value">{stats.total || 0}</div>
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-header">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div>
                <div className="stat-title">Completed</div>
                <div className="stat-value">{stats.completed || 0}</div>
              </div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-header">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div>
                <div className="stat-title">Pending</div>
                <div className="stat-value">{stats.pending || 0}</div>
              </div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-header">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div>
                <div className="stat-title">In Progress</div>
                <div className="stat-value">{stats.inProgress || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <TaskFilters onFilter={handleFilter} />

        {/* Task List Section */}
        <div className="task-section">
          <div className="section-header">
            <h2 className="section-title">My Tasks</h2>
            <button 
              className="add-task-btn"
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
            >
              <FaPlus /> New Task
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p style={{ marginTop: '20px', color: '#64748b' }}>Loading tasks...</p>
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No tasks found</h3>
              <p>Create your first task to get started!</p>
            </div>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-name">{task.title}</div>
                      <div className="task-desc">
                        {task.description?.substring(0, 60)}
                        {task.description?.length > 60 && '...'}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${task.status?.toLowerCase().replace('_', '')}`}>
                        {task.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
                        <FaFlag style={{ marginRight: '5px' }} />
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {task.dueDate 
                        ? new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'No due date'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn btn-edit"
                          onClick={() => handleEdit(task)}
                          title="Edit Task"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(task.id)}
                          title="Delete Task"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '30px'
            }}>
              <button
                disabled={pagination.currentPage === 0}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: pagination.currentPage === 0 ? '#e2e8f0' : '#6366f1',
                  color: pagination.currentPage === 0 ? '#94a3b8' : 'white',
                  cursor: pagination.currentPage === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Previous
              </button>
              <span style={{
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                color: '#64748b',
                fontWeight: '600'
              }}>
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.currentPage === pagination.totalPages - 1}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: pagination.currentPage === pagination.totalPages - 1 ? '#e2e8f0' : '#6366f1',
                  color: pagination.currentPage === pagination.totalPages - 1 ? '#94a3b8' : 'white',
                  cursor: pagination.currentPage === pagination.totalPages - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Right Side Panel */}
      <aside className="right-panel">
        <div className="panel-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h4>{user?.username || 'User'}</h4>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className="settings-icon">
            <FaCog />
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="calendar-widget">
          <div className="calendar-header">
            <div className="calendar-title">{getMonthName(currentDate)}</div>
            <div className="calendar-nav">
              <button className="nav-btn" onClick={handlePrevMonth}>
                <FaChevronLeft />
              </button>
              <button className="nav-btn" onClick={handleNextMonth}>
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                {day}
              </div>
            ))}
            {generateCalendarDays().map((day, i) => (
              <div 
                key={i}
                className={`calendar-day ${day.isToday ? 'active' : ''}`}
              >
                <div className="day-number">{day.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="quick-stats-title">Task Statistics</div>
          <div className="quick-stat-item">
            <span className="quick-stat-label">Completion Rate</span>
            <span className="quick-stat-value">
              {stats.total > 0 
                ? Math.round((stats.completed / stats.total) * 100) 
                : 0}%
            </span>
          </div>
          <div className="quick-stat-item">
            <span className="quick-stat-label">Tasks This Week</span>
            <span className="quick-stat-value">{stats.total || 0}</span>
          </div>
          <div className="quick-stat-item">
            <span className="quick-stat-label">Pending Tasks</span>
            <span className="quick-stat-value">{stats.pending || 0}</span>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="progress-chart">
          <div className="chart-title">Weekly Progress</div>
          <div className="chart-visual">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div 
                key={i}
                className="chart-bar"
                style={{
                  height: `${Math.random() * 80 + 20}%`,
                  background: i === 3 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'
                }}
              />
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-value">{stats.completed || 0}</div>
              <div className="legend-label">Completed</div>
            </div>
            <div className="legend-item">
              <div className="legend-value">{stats.inProgress || 0}</div>
              <div className="legend-label">In Progress</div>
            </div>
            <div className="legend-item">
              <div className="legend-value">{stats.pending || 0}</div>
              <div className="legend-label">Pending</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Dashboard;