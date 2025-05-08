import BaseApi from "../../../commons/request";


class AuthService {
  async register(userData) {
    try {
      const response = await BaseApi.post('/users/register', userData);
      if (response.success) {
        this.setAuthToken(response.data.token);
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await BaseApi.post('/users/login', credentials);
      if (response.success) {
        this.setAuthToken(response.data.token);
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService(); 