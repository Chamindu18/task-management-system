import React from 'react';
import TaskCard from './TaskCard';
import { FaSpinner, FaInbox } from 'react-icons/fa';

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
      <div className="alert alert-info text-center py-5">
        <FaInbox size={48} className="mb-3 text-muted" />
        <h5>No tasks found</h5>
        <p className="mb-0 text-muted">Create your first task to get started!</p>
      </div>
    );
  }
  return (
    <div>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

       {pagination && pagination.totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            
            <li className={`page-item ${pagination.currentPage === 0 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
              >
                Previous
              </button>
            </li>

            {[...Array(pagination.totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${pagination.currentPage === index ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(index)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${pagination.currentPage === pagination.totalPages - 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages - 1}
              >
                Next
              </button>
            </li>
          </ul>
          <p className="text-center text-muted small mb-0">
            Showing page {pagination.currentPage + 1} of {pagination.totalPages} 
            ({pagination.totalItems} total tasks)
          </p>
        </nav>
      )}
    </div>
  );
};

export default TaskList;

  
























