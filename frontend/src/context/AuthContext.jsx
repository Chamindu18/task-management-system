import { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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

      // FIRST: Try to get user from localStorage (includes role)
      const storedUser = authService.getStoredUser();
      if (storedUser && storedUser.role) {
        console.log('🔄 Using stored user with role:', storedUser.role);
        setUser(storedUser);
        setIsAuthenticated(true);
      }

      // THEN: Verify with backend for fresh data
      const userData = await authService.getCurrentUser();
      console.log('🔄 Backend user data:', userData);
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
      console.log('🔄 Login successful, user data:', userData);
      
      // ✅ MAKE SURE ROLE IS SET
      setUser(userData);
      setIsAuthenticated(true);
      
      return { 
        success: true, 
        data: userData 
      };
    } catch (error) {
      console.error('Login error in context:', error);
      
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      setUser(result);
      setIsAuthenticated(true);
      return { success: true, data: result };
    } catch (error) {
      console.error('Registration error in context:', error);
      
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
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