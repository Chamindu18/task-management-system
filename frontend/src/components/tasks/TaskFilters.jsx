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
    const resetFilters = {
      search: '',
      status: '',
      priority: '',
      sortBy: 'dueDate',
      sortDir: 'asc'
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };