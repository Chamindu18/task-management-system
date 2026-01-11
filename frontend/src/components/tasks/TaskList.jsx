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

























}