import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Auth.module.css';
import AuthForm from './components/AuthForm';
import { useAuth } from './hooks/useAuth';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, login, loading, error, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/app/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (data) => {
    try {
      if (isLogin) {
        await login(data);
      } else {
        await register(data);
      }
      // Redirect to the attempted page or dashboard
      const from = location.state?.from?.pathname || '/app/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Authentication error:', err);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        
        <AuthForm
          isLogin={isLogin}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <div className={styles.switchMode}>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className={styles.switchButton}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth; 