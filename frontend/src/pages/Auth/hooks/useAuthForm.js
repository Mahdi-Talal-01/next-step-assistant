import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import authService from '../services/authService';

export const useAuthForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      const response = await authService.login(formData);
      if (response.token) {
        localStorage.setItem('access_token', response.token);
        await login(response.user);
        navigate('/app/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      setError('');
      const response = await authService.register(formData);
      if (response.token) {
        localStorage.setItem('access_token', response.token);
        await login(response.user);
        navigate('/app/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    setError,
    handleSubmit
  };
}; 