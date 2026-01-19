import api from './api';

const reportService = {
  // Get all reports for current user
  getReports: async (userId) => {
    try {
      const response = await api.get(`/reports?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Get single report
  getReport: async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },

  // Create new report
  createReport: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Download report
  downloadReport: async (reportId, format = 'pdf') => {
    try {
      const response = await api.get(`/reports/${reportId}/download?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },

  // Delete report
  deleteReport: async (reportId) => {
    try {
      await api.delete(`/reports/${reportId}`);
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },

  // Generate report
  generateReport: async (userId, startDate, endDate, format = 'pdf') => {
    try {
      const response = await api.post('/reports/generate', {
        userId,
        startDate,
        endDate,
        format
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
};

export default reportService;
