import React from 'react';
import { useAuthForm } from '../hooks/useAuthForm';
import { ErrorMessage } from './ErrorMessage';
import styles from '../Auth.module.css';

export const LoginForm = () => {
  const { error, loading, handleSubmit } = useAuthForm();

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
      <ErrorMessage error={error} />
    </form>
  );
}; 