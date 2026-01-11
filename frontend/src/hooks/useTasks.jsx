import { useState, useEffect } from 'react';
import api from '../services/api';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  });

  const fetchTasks = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: filters.page || 0,
        size: filters.size || 10,
        status: filters.status || '',
        priority: filters.priority || '',
        search: filters.search || '',
        sortBy: filters.sortBy || 'dueDate',
        sortDir: filters.sortDir || 'asc'
      };

      const response = await api.get('/tasks', { params });

      if (response.data.content) {
        setTasks(response.data.content);
        setPagination({
          currentPage: response.data.number,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalElements,
          pageSize: response.data.size
        });
      } else {
        setTasks(response.data);
      }
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };