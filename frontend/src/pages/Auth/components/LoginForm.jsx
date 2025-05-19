import React from 'react';
import { ErrorMessage } from './ErrorMessage';
import styles from '../Auth.module.css';

export const LoginForm = ({ onSubmit, loading, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      email: formData.get('email'),
      password: formData.get('password')
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="Enter your email"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <ErrorMessage error={error} />}
    </form>
  );
}; 