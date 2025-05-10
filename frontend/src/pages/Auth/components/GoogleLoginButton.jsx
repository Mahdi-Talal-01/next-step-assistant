import React from 'react';
import { useOAuth } from '../hooks/useOAuth';
import { ErrorMessage } from './ErrorMessage';
import styles from '../Auth.module.css';

export const GoogleLoginButton = () => {
  const { error, loading, handleGoogleLogin } = useOAuth();

  return (
    <div className={styles.socialLogin}>
      <button
        onClick={handleGoogleLogin}
        className={styles.googleButton}
        disabled={loading}
      >
        <img src="/google-icon.svg" alt="Google" className={styles.googleIcon} />
        {loading ? 'Connecting...' : 'Continue with Google'}
      </button>
      <ErrorMessage error={error} />
    </div>
  );
}; 