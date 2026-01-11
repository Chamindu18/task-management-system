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
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <FaFilter className="me-2" />
          Search & Filter Tasks
        </h5>

        <form onSubmit={handleSearch}>
          <div className="row g-3">
            {/* Search Box */}
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search tasks by title or description..."
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                />
              </div>
            </div>