import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useOAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://15.236.226.177:3000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to initiate Google login');
      }
    } catch (err) {
      setError('Failed to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthCallback = async (token, userData) => {
    try {
      setLoading(true);
      // Decode and parse user data
      const decodedUserData = JSON.parse(decodeURIComponent(userData));
      // Save token and user data
      localStorage.setItem('access_token', token);
      await login(decodedUserData, token);
      
      // Clean URL and navigate
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError('Failed to complete authentication');
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    setError,
    handleGoogleLogin,
    handleOAuthCallback
  };
}; 