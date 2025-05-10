import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log("Initializing auth state...");
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    console.log("Token from localStorage:", storedToken);

    if (storedToken) {
      try {
        // If user data is in localStorage (from OAuth), use it
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          // Otherwise, fetch from backend
          const authData = await authService.getAuthData();
          console.log("Stored auth data:", authData);
          if (authData.user) {
            setUser(authData.user);
            setToken(storedToken);
          } else {
            console.log("No authenticated user found");
            clearAuth();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuth();
      }
    } else {
      console.log("No token found");
      clearAuth();
    }
    setLoading(false);
  };

  const login = async (userData, authToken = null) => {
    console.log("Logging in user...");
    try {
      if (authToken) {
        // OAuth login - use provided token and user data
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("access_token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Regular login - use login endpoint
        const response = await authService.login(userData);
        if (response.token) {
          setUser(response.user);
          setToken(response.token);
          localStorage.setItem("access_token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      clearAuth();
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    authService.clearAuthData();
  };

  // Return an object for isAuthenticated for clarity
  const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    return {
      authenticated: !!token,
      user: user ? JSON.parse(user) : null,
    };
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
