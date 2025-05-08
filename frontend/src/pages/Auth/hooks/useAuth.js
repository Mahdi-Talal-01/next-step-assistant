import { useState, useCallback, useEffect, useRef } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const mounted = useRef(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user: storedUser, isAuthenticated } = authService.getAuthData();
        if (mounted.current) {
          if (isAuthenticated && storedUser) {
            setUser(storedUser);
          } else {
            setUser(null);
          }
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        if (mounted.current) {
          setUser(null);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted.current = false;
    };
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  return {
    user,
    error,
    loading,
    initialized,
    register,
    login,
    logout,
    isAuthenticated: isAuthenticated()
  };
}; 