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
