// Final Dashboard.jsx - With Working Navigation
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import Navbar from '../components/layout/Navbar';
import { 
  FaPlus, FaTasks, FaCheckCircle, FaClock, 
  FaExclamationTriangle, FaEdit, FaTrash, 
  FaCog, FaChevronLeft, FaChevronRight, FaFlag
} from 'react-icons/fa';
import welcomeBanner from '../images/Welcome banner.jpg';
import myTasksImage from '../images/MyTasks.jpg';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
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

  // Calculate weekly progress based on actual tasks
  const getWeeklyProgress = () => {
    const today = new Date();
    const weekData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
      const dayOfWeek = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      const isToday = index === dayOfWeek;
      
      if (!tasks || tasks.length === 0) {
        return { day, count: 0, isToday };
      }
      
      // Count completed tasks for each day of the week
      const tasksForDay = tasks.filter(task => {
        if (task.status === 'completed' && task.updatedAt) {
          const taskDate = new Date(task.updatedAt);
          const taskDay = (taskDate.getDay() + 6) % 7;
          return taskDay === index;
        }
        return false;
      });
      
      return { day, count: tasksForDay.length, isToday };
    });
    
    const maxCount = Math.max(...weekData.map(d => d.count), 1);
    return weekData.map(d => ({
      ...d,
      height: d.count > 0 ? (d.count / maxCount) * 80 + 20 : 20
    }));
  };

  const weeklyData = getWeeklyProgress();

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

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayIndex = getFirstDayOfMonth(currentDate);
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const days = [];
    
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, isToday: false, isEmpty: true });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today && 
                      currentDate.getMonth() === currentMonth && 
                      currentDate.getFullYear() === currentYear;
      days.push({ day: i, isToday, isEmpty: false });
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
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Card */}
        <div
          className="welcome-card"
          style={{
            backgroundImage: `url(${welcomeBanner})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        >
          <div className="welcome-content">
            <h1>Hi, {user?.username || 'User'}! 👋</h1>
            <p>Here’s what you need to work on today</p>
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
        <div className="task-section" style={{ backgroundImage: `url(${myTasksImage})`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
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
          <div className="settings-icon" onClick={() => navigate('/profile')}>
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
              <div key={i} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', fontWeight: '600', padding: '8px 0' }}>
                {day}
              </div>
            ))}
            {generateCalendarDays().map((dayInfo, i) => (
              <div 
                key={i}
                className={`calendar-day ${dayInfo.isToday ? 'active' : ''} ${dayInfo.isEmpty ? 'empty' : ''}`}
                style={{ 
                  visibility: dayInfo.isEmpty ? 'hidden' : 'visible'
                }}
              >
                {dayInfo.day && <div className="day-number">{dayInfo.day}</div>}
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

        {/* Progress Chart - Pie Chart */}
        <div className="progress-chart">
          <div className="chart-title">Task Overview</div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ marginBottom: '20px' }}>
              {(() => {
                const total = stats.total || 1;
                const completed = stats.completed || 0;
                const inProgress = stats.inProgress || 0;
                const pending = stats.pending || 0;
                
                const completedPercent = (completed / total) * 100;
                const inProgressPercent = (inProgress / total) * 100;
                const pendingPercent = (pending / total) * 100;
                
                let currentAngle = 0;
                const segments = [];
                
                // Completed segment (Green)
                if (completed > 0) {
                  const angle = (completedPercent / 100) * 360;
                  const x1 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
                  const y1 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
                  const x2 = 100 + 80 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                  const y2 = 100 + 80 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                  const largeArc = angle > 180 ? 1 : 0;
                  segments.push(
                    <path
                      key="completed"
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill="#10b981"
                    />
                  );
                  currentAngle += angle;
                }
                
                // In Progress segment (Blue)
                if (inProgress > 0) {
                  const angle = (inProgressPercent / 100) * 360;
                  const x1 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
                  const y1 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
                  const x2 = 100 + 80 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                  const y2 = 100 + 80 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                  const largeArc = angle > 180 ? 1 : 0;
                  segments.push(
                    <path
                      key="inProgress"
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill="#3b82f6"
                    />
                  );
                  currentAngle += angle;
                }
                
                // Pending segment (Orange)
                if (pending > 0) {
                  const angle = (pendingPercent / 100) * 360;
                  const x1 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
                  const y1 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
                  const x2 = 100 + 80 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                  const y2 = 100 + 80 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                  const largeArc = angle > 180 ? 1 : 0;
                  segments.push(
                    <path
                      key="pending"
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill="#f59e0b"
                    />
                  );
                }
                
                // If no tasks, show gray circle
                if (total === 0 || (completed === 0 && inProgress === 0 && pending === 0)) {
                  segments.push(
                    <circle key="empty" cx="100" cy="100" r="80" fill="#e5e7eb" />
                  );
                }
                
                return segments;
              })()}
              {/* Center circle for donut effect */}
              <circle cx="100" cy="100" r="50" fill="white" />
              <text x="100" y="105" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1e293b">
                {stats.total || 0}
              </text>
              <text x="100" y="125" textAnchor="middle" fontSize="12" fill="#64748b">
                Total
              </text>
            </svg>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', marginRight: '8px' }}></div>
              <div className="legend-value">{stats.completed || 0}</div>
              <div className="legend-label">Completed</div>
            </div>
            <div className="legend-item">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', marginRight: '8px' }}></div>
              <div className="legend-value">{stats.inProgress || 0}</div>
              <div className="legend-label">In Progress</div>
            </div>
            <div className="legend-item">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', marginRight: '8px' }}></div>
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