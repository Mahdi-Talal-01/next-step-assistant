import React from 'react';
import { Icon } from '@iconify/react';

/**
 * GmailConnect component displays Google authentication status and controls
 */
const GmailConnect = ({ 
  isAuthorized, 
  onConnect, 
  onDisconnect, 
  isLoading, 
  error
}) => {
  return (
    <div className="gmail-connect-container">
      {!isAuthorized ? (
        <div className="connect-box">
          <div className="connect-icon">
            <Icon icon="mdi:google" width="48" height="48" color="#4285F4" />
          </div>
          <div className="connect-content">
            <h3>Login with Google Required</h3>
            <p>
              Please login with your Google account to unlock the Email Tracker feature.
              This will allow you to track and analyze your job application emails.
            </p>
            
            {onConnect && (
              <button 
                className="connect-button" 
                onClick={onConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon icon="mdi:loading" className="loading-icon" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:google" />
                    Connect Gmail
                  </>
                )}
              </button>
            )}
            
            <div className="lock-message">
              <Icon icon="mdi:lock" className="lock-icon" />
              <span>This feature is only available to Google-authenticated users</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="connected-box">
          <div className="connected-status">
            <Icon icon="mdi:check-circle" className="connected-icon" />
            <span>Gmail account connected</span>
          </div>
          <button 
            className="disconnect-button" 
            onClick={onDisconnect}
            disabled={isLoading}
          >
            {isLoading ? 'Disconnecting...' : 'Disconnect Account'}
          </button>
        </div>
      )}
      
      {error && (
        <div className="connection-error">
          <Icon icon="mdi:alert-circle" className="error-icon" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default GmailConnect;

 