// TaskList.jsx - table style
import React from 'react';
import { FaSpinner, FaInbox, FaEdit, FaTrash } from 'react-icons/fa';

const TaskList = ({ tasks, loading, onEdit, onDelete, pagination, onPageChange }) => {

  if (loading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="fa-spin text-primary" size={48} />
        <p className="mt-3 text-muted">Loading tasks...</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded shadow-sm">
        <FaInbox size={64} className="text-muted mb-3" />
        <h5>No tasks found</h5>
        <p className="text-muted">Create a task to get started</p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':    return 'status-pending';
      case 'IN_PROGRESS': return 'status-progress';
      case 'COMPLETED':  return 'status-completed';
      default:           return 'bg-secondary text-white';
    }
  };

  return (
    <div className="task-list px-3 pb-3">
      <table>
        <thead>
          <tr className="text-muted small fw-bold">
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>
                <div className="fw-bold">{task.title}</div>
                <small className="text-muted">{task.description?.substring(0, 60)}...</small>
              </td>
              <td>
                <span className={`status-badge ${getStatusClass(task.status)}`}>
                  {task.status?.replace('_', ' ')}
                </span>
              </td>
              <td>
                <span className={`badge bg-${task.priority === 'HIGH' ? 'danger' : task.priority === 'MEDIUM' ? 'warning' : 'info'}`}>
                  {task.priority}
                </span>
              </td>
              <td className="text-muted">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(task)}>
                  <FaEdit />
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagination.currentPage === 0 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(pagination.currentPage - 1)}>Previous</button>
            </li>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${pagination.currentPage === i ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(i)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${pagination.currentPage === pagination.totalPages - 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(pagination.currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TaskList;