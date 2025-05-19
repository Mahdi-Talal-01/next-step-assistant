import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthHeader } from './components/AuthHeader';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { GoogleLoginButton } from './components/GoogleLoginButton';
import { useAuth } from './hooks/useAuth';
import styles from './Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading, error, isAuthenticated } = useAuth();

  // Handle form submissions
  const handleSubmit = async (data) => {
    try {
      if (isLogin) {
        await login(data);
      } else {
        await register(data);
      }
      
      // Check if authenticated after login/register
      const authState = isAuthenticated();
      if (authState.authenticated) {
        const from = location.state?.from?.pathname || "/app/dashboard";
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setAuthError(err.message || "Authentication failed");
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    const urlUser = params.get('user');
    const urlError = params.get('error');
    // Check if we were redirected from Gmail tracker
    const fromEmailTracker = location.state?.fromEmailTracker || false;

    if (urlToken && urlUser) {
      localStorage.setItem("access_token", urlToken);
      localStorage.setItem("user", decodeURIComponent(urlUser));
      window.history.replaceState({}, document.title, "/auth");
      
      // If coming from email tracker, redirect back there with success parameter
      if (fromEmailTracker) {
        navigate("/app/gmail-tracker?googleAuth=success", { replace: true });
      } else {
        navigate("/app/dashboard", { replace: true });
      }
      return;
    }

    if (urlError) {
      setAuthError(urlError);
      console.error("OAuth error:", urlError);
      return;
    }

    // If already authenticated, redirect to dashboard or back to Email Tracker
    // Only redirect if currently on /auth to avoid infinite loop
    const { authenticated } = isAuthenticated();
    if (authenticated && location.pathname === "/auth") {
      if (fromEmailTracker) {
        navigate("/app/gmail-tracker?googleAuth=success", { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/app/dashboard";
        navigate(from, { replace: true });
      }
    }
  }, [location, navigate, isAuthenticated]);

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <AuthHeader />
        {(authError || error) && <div className={styles.error}>Authentication error: {authError || error}</div>}
        {isLogin ? (
          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
        ) : (
          <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
        )}
        <div className={styles.divider}><span>or</span></div>
        <GoogleLoginButton />
        <div className={styles.toggleText} style={{ marginTop: 16 }}>
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button className={styles.toggleButton} onClick={() => setIsLogin(false)} disabled={loading}>
                Create one
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button className={styles.toggleButton} onClick={() => setIsLogin(true)} disabled={loading}>
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 