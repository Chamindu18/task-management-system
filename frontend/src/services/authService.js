import api from './api';

const authService = {
  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Store token after registration
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      // CRITICAL: Return the actual error response from backend
      if (error.response?.data) {
        throw error.response.data; // This contains field-specific errors
      }
      throw new Error(error.message || 'Registration failed');
    }
  },

  //Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout user
  async logout() {
    try {
      // Clear JWT token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optional: Call backend logout if needed
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // If request fails, clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data?.message || error.message || 'Not authenticated';
    }
  },

  // Helper method to get stored user
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Helper method to get token
  getToken() {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService;