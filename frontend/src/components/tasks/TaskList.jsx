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

  

























}