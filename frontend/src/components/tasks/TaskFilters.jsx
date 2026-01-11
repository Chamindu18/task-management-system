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

            <div className="col-md-3">
              <label className="form-label small fw-bold">Status</label>
              <select
                className="form-select"
                name="status"
                value={filters.status}
                onChange={handleChange}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold">Priority</label>
              <select
                className="form-select"
                name="priority"
                value={filters.priority}
                onChange={handleChange}
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold">Sort By</label>
              <select
                className="form-select"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleChange}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold">Order</label>
              <select
                className="form-select"
                name="sortDir"
                value={filters.sortDir}
                onChange={handleChange}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>