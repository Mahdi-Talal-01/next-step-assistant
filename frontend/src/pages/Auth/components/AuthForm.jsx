import React from 'react';
import styles from '../Auth.module.css';

const AuthForm = ({ 
  isLogin, 
  onSubmit, 
  loading, 
  error 
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
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
    const data = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {!isLogin && (
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm; 