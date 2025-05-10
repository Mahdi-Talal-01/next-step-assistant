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
      const response = await fetch('http://localhost:3000/api/auth/google', {
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
      console.log('Processing OAuth callback with token and user data');
      
      // Decode and parse user data
      const decodedUserData = JSON.parse(decodeURIComponent(userData));
      console.log('Decoded user data:', decodedUserData);
      
      // Save token and user data
      localStorage.setItem('access_token', token);
      await login(decodedUserData, token);
      
      // Clean URL and navigate
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      console.log('Navigating to dashboard');
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