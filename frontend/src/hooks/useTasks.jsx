import { useState } from 'react';
import api from '../services/api'; // Axios instance for API calls

// Custom hook to manage tasks
const useTasks = () => {
  // State for storing tasks
  const [tasks, setTasks] = useState([]);
  // Loading state to indicate API calls
  const [loading, setLoading] = useState(false);
  // Error state to capture API errors
  const [error, setError] = useState(null);
  // Pagination info
  const [pagination, setPagination] = useState({
    currentPage: 0,   // current page number
    totalPages: 0,    // total number of pages
    totalItems: 0,    // total number of tasks
    pageSize: 10,     // items per page
  });

  /**
   * Fetch tasks from API
   * @param {Object} filters - optional filters like page, status, priority, search, sort
   */
  const fetchTasks = async (filters = {}) => {
    setLoading(true);  // start loading
    setError(null);    // reset error
    try {
      // Construct query parameters
      const params = {
        page: filters.page || 0,
        size: filters.size || 10,
        status: filters.status || '',
        priority: filters.priority || '',
        search: filters.search || '',
        sortBy: filters.sortBy || 'dueDate',
        sortDir: filters.sortDir || 'asc',
      };

      // Make GET request to fetch tasks
      const response = await api.get('/tasks', { params });
      
      console.log('📊 Tasks API Response:', response.data);

      // Handle paginated vs non-paginated responses
      let data = [];
      let paginationData = null;
      
      if (response.data && response.data.content) {
        // Spring Data Page response
        data = response.data.content;
        paginationData = {
          currentPage: response.data.number,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalElements,
          pageSize: response.data.size,
        };
      } else if (Array.isArray(response.data)) {
        // Array response
        data = response.data;
      } else if (response.data && response.data.data) {
        // Wrapped response
        data = response.data.data;
      }
      
      // Normalize status values for consistent display
      // Backend uses: TODO, IN_PROGRESS, DONE
      // Frontend displays: TODO, IN_PROGRESS, DONE
      data = data.map(task => ({
        ...task,
        status: task.status || 'TODO'
      }));
      
      setTasks(data);  // update tasks state

      if (paginationData) {
        setPagination(paginationData);
      }

      return data;
    } catch (err) {
      // Handle errors
      console.error('❌ Tasks fetch error:', err);
      const msg = err.response?.data?.message || 'Failed to fetch tasks';
      setError(msg);
      throw err;
    } finally {
      setLoading(false); // stop loading
    }
  };

  /**
   * Create a new task
   * @param {Object} taskData - data of new task
   */
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/tasks', taskData);
      // Add new task to top of list
      setTasks((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing task
   * @param {number} id - task ID
   * @param {Object} taskData - updated task data
   */
  const updateTask = async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      // Replace the old task with updated task
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a task
   * @param {number} id - task ID
   */
  const deleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tasks/${id}`);
      // Remove task from list
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate task statistics
   * Returns total, pending, inProgress, completed, overdue counts
   */
  const getTaskStats = () => {
    const total = tasks.length;
    // Backend uses: TODO, IN_PROGRESS, DONE
    const pending = tasks.filter((t) => {
      const status = t.status?.toUpperCase() || '';
      return status === 'TODO';
    }).length;
    const inProgress = tasks.filter((t) => {
      const status = t.status?.toUpperCase() || '';
      return status === 'IN_PROGRESS';
    }).length;
    const completed = tasks.filter((t) => {
      const status = t.status?.toUpperCase() || '';
      return status === 'DONE';
    }).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // compare only dates, ignore time
    const overdue = tasks.filter((t) => {
      const due = new Date(t.dueDate);
      return due < today && t.status !== 'DONE';
    }).length;

    return { total, pending, inProgress, completed, overdue };
  };

  // Return all states and functions for use in components
  return {
    tasks,
    loading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
  };
};

export default useTasks;
