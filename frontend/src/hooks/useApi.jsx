import { useState, useCallback } from 'react';
import api from '../services/api';

// All data should now come from the backend API

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Use axios instance with proper CORS and error handling
      const response = await api.get(endpoint, options);
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('🔴 API Error:', {
        endpoint,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      throw err;
    }
  }, []);

  return { fetchData, loading, error };
};

export default useApi;