import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import '../styles/ErrorBoundary.css';

const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <Icon icon="mdi:alert-circle-outline" />
        </div>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="error-message">
          {error.statusText || error.message}
        </p>
        <Link to="/" className="home-link">
          <Icon icon="mdi:home" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary; 