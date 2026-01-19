import api from './api';

const taskService = {
  // Get all tasks with optional filters
  getTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      
      const queryString = params.toString();
      const response = await api.get(`/tasks${queryString ? '?' + queryString : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get single task by ID
  getTask: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Get tasks by status
  getTasksByStatus: async (status) => {
    return taskService.getTasks({ status });
  },

  // Get tasks by priority
  getTasksByPriority: async (priority) => {
    return taskService.getTasks({ priority });
  },

  // Get tasks assigned to user
  getTasksByAssignee: async (userId) => {
    return taskService.getTasks({ assignedTo: userId });
  }
};

export default taskService;
