import React from 'react';
import { useAuthForm } from '../hooks/useAuthForm';
import { ErrorMessage } from './ErrorMessage';
import styles from '../Auth.module.css';

export const RegisterForm = () => {
  const { error, loading, handleRegister } = useAuthForm();

  return (
    <form onSubmit={handleRegister} className={styles.registerForm} autoComplete="off">
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter your name"
        />
      </div>
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
          placeholder="Create a password"
        />
      </div>
      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
      <ErrorMessage error={error} />
    </form>
  );
}; 