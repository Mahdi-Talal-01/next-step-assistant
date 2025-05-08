import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from '../Auth.module.css';

const AuthForm = ({ onSubmit, onGoogleLogin, error, loading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.authForm}>
      <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
      <p className={styles.subtitle}>
        {isLogin ? 'Sign in to continue your journey' : 'Start your journey with us'}
      </p>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Full Name"
              required
              disabled={loading}
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="Email Address"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="Password"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        {error && (
          <div className={styles.error}>
            <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
            {error}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <div className={styles.loadingSpinner} />
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <button
        type="button"
        className={styles.googleButton}
        onClick={onGoogleLogin}
        disabled={loading}
      >
        <Icon icon="mdi:google" className={styles.googleIcon} />
        Continue with Google
      </button>

      <p className={styles.toggleText}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm; 