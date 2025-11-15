import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we have a JWT token
      const token = authService.getToken();
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, data: userData };
    } catch (error) {
      // If backend returned a structured error object (field errors), pass it through
      if (error && typeof error === 'object') {
        return { success: false, error };
      }
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      setUser(result);
      setIsAuthenticated(true);
      return { success: true, data: result };
    } catch (error) {
      // If backend returned a structured error object (field errors), pass it through
      if (error && typeof error === 'object') {
        return { success: false, error };
      }
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout, 
      register,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;