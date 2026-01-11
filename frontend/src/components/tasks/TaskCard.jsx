import React from 'react';
import { FaEdit, FaTrash, FaClock, FaFlag } from 'react-icons/fa';

const TaskCard = ({ task, onEdit, onDelete }) => {

const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'PENDING': return 'secondary';
      default: return 'secondary';
    }
  };    

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'COMPLETED';
  };
   return (
    <div className="card mb-3 shadow-sm hover-shadow">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h5 className="card-title mb-2">
              {task.title}
            </h5>
            <p className="card-text text-muted mb-3">
              {task.description}
            </p>
            
            <div className="d-flex gap-2 flex-wrap mb-3">
              <span className={`badge bg-${getStatusColor(task.status)}`}>
                {task.status?.replace('_', ' ')}
              </span>
              <span className={`badge bg-${getPriorityColor(task.priority)}`}>
                <FaFlag className="me-1" size={12} />
                {task.priority}
              </span>
              {isOverdue() && (
                <span className="badge bg-danger">
                  <FaClock className="me-1" size={12} />
                  OVERDUE
                </span>
              )}
            </div>

            <div className="text-muted small">
              <FaClock className="me-1" />
              Due: {formatDate(task.dueDate)}
            </div>
          </div>

          <div className="d-flex gap-2 ms-3">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => onEdit(task)}
              title="Edit Task"
            >
              <FaEdit />
            </button>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(task.id)}
              title="Delete Task"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;


















