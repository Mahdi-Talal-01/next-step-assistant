import React from 'react';
import { Icon } from '@iconify/react';
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
        <Icon icon="mdi:google" width="24" height="24" color="#4285F4" className={styles.googleIcon} />
        {loading ? 'Connecting...' : 'Continue with Google'}
      </button>
      <ErrorMessage error={error} />
    </div>
  );
}; 