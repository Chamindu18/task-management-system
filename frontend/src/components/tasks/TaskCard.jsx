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


















}