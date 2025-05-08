import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import styles from './Auth.module.css';
import { useAuth } from './hooks/useAuth';
import authService from './services/authService';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Debug function to check token state
  const debugToken = () => {
    console.log('Debug Token State:', {
      token: localStorage.getItem('access_token'),
      url: window.location.href,
      searchParams: Object.fromEntries(new URLSearchParams(window.location.search))
    });
  };

  useEffect(() => {
    debugToken();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      const userData = searchParams.get('user');
      const error = searchParams.get('error');
      
      if (error) {
        setError(error);
        return;
      }

      if (token && userData) {
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
      }
    };

    handleOAuthCallback();
  }, [location.search, login, navigate]);

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

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue to your account</p>
        
        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}
        
        <AuthForm 
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Auth; 