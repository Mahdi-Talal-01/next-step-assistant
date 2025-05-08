import React, { useState } from 'react';
import styles from '../Auth.module.css';

const AuthForm = ({ isLogin, onSubmit, loading, error }) => {
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
    <form className={styles.authForm} onSubmit={handleSubmit}>
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
          <svg
            className={styles.errorIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
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
  );
};

export default AuthForm; 