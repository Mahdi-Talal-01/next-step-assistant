import BaseApi from "../../../commons/request";


class AuthService {
  async register(userData) {
    try {
      const response = await BaseApi.post('/users/register', userData);
      if (response.success && response.data) {
        this.setAuthData(response.data);
        return response.data;
      }
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await BaseApi.post('/users/login', credentials);
      if (response.success && response.data) {
        this.setAuthData(response.data);
        return response.data;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  logout() {
    this.clearAuthData();
  }

  setAuthData(data) {
    if (!data) return;
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getAuthData() {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      return {
        token,
        user,
        isAuthenticated: !!token && !!user
      };
    } catch (error) {
      this.clearAuthData();
      return {
        token: null,
        user: null,
        isAuthenticated: false
      };
    }
  }

  isAuthenticated() {
    const { isAuthenticated } = this.getAuthData();
    return isAuthenticated;
  }
}

export default new AuthService(); 