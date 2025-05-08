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
    
    try {
      if (data.token) {
        localStorage.setItem('access_token', data.token);
        console.log('Token saved in setAuthData:', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('User data saved in setAuthData:', data.user);
      }
    } catch (error) {
      console.error('Error saving auth data:', error);
      this.clearAuthData();
      throw error;
    }
  }

  clearAuthData() {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      console.log('Auth data cleared');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  getAuthData() {
    try {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      console.log('Getting auth data:', { token: !!token, user: !!user });
      
      return {
        token,
        user,
        isAuthenticated: !!token && !!user
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
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
    console.log('Checking authentication:', isAuthenticated);
    return isAuthenticated;
  }
}

export default new AuthService(); 