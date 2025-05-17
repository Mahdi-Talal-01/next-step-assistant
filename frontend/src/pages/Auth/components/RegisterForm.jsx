import React from 'react';
import { ErrorMessage } from './ErrorMessage';
import styles from '../Auth.module.css';

export const RegisterForm = ({ onSubmit, loading, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm} autoComplete="off">
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
      {error && <ErrorMessage error={error} />}
    </form>
  );
}; 