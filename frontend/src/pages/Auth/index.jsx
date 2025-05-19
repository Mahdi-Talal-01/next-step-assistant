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
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    const urlUser = params.get('user');
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
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <div className={styles.divider}><span>or</span></div>
        <GoogleLoginButton />
        <div className={styles.toggleText} style={{ marginTop: 16 }}>
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button className={styles.toggleButton} onClick={() => setIsLogin(false)}>
                Create one
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button className={styles.toggleButton} onClick={() => setIsLogin(true)}>
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