import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const GmailConnect = ({ 
  isAuthorized, 
  onConnect, 
  onDisconnect, 
  isLoading, 
  error,
  authChecked,
  onTestApi,
  onForceAuth
}) => {
  const [showDebug, setShowDebug] = useState(false);
  const [oauthError, setOauthError] = useState(null);
  
  // Debug button styles for consistency
  const debugButtonStyle = {
    background: '#f0f0f0', 
    border: '1px solid #ccc', 
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#333',
    fontSize: '0.85em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  return (
    <div className="gmail-connect-container">
      {!isAuthorized ? (
        <div className="connect-box">
          <div className="connect-icon">
            <Icon icon="mdi:gmail" width="48" height="48" />
          </div>
          <div className="connect-content">
            <h3>Gmail Connection Required</h3>
            <p>
              Please connect your Google account to unlock the Email Tracker feature.
              This will allow you to track and analyze your job application emails.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                    Connect with Google
                  </>
                )}
              </button>
            </div>
            
            <div className="lock-message">
              <Icon icon="mdi:lock" className="lock-icon" />
              <span>This feature requires Gmail access to display your emails</span>
            </div>
            
            {showDebug && (
              <div style={{ 
                marginTop: '15px', 
                padding: '10px',
                background: '#f5f5f5', 
                borderRadius: '4px',
                fontSize: '0.9em'
              }}>
                <div>Connection Status: <strong>{authChecked ? 'Checked' : 'Not Checked'}</strong></div>
                <div>Authorization: <strong>{isAuthorized ? 'Authorized' : 'Not Authorized'}</strong></div>
                <div>Loading State: <strong>{isLoading ? 'Loading' : 'Idle'}</strong></div>
                <div style={{ marginTop: '10px' }}>
                  <strong>Troubleshooting Tips:</strong>
                  <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                    <li>Make sure you're allowing pop-ups in your browser</li>
                    <li>Check that you have a stable internet connection</li>
                    <li>Try refreshing the page and connecting again</li>
                    <li>If connecting from a company network, check for firewall restrictions</li>
                    <li><strong>If the backend confirms you're authorized</strong>, use the "Force Authorization" button</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="connected-box">
          <div className="connected-status">
            <Icon icon="mdi:check-circle" className="connected-icon" />
            <span>Gmail account connected</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="disconnect-button" 
              onClick={onDisconnect}
              disabled={isLoading}
            >
              {isLoading ? 'Disconnecting...' : 'Disconnect Account'}
            </button>
            
            <button 
              style={{ 
                background: 'none', 
                border: '1px solid #ccc', 
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => setShowDebug(!showDebug)}
            >
              <Icon icon="mdi:information-outline" style={{ marginRight: '5px' }} />
              {showDebug ? 'Hide Details' : 'Connection Details'}
            </button>
            
            {/* Force refresh button for when connected */}
            {showDebug && (
              <button 
                style={debugButtonStyle}
                onClick={onTestApi}
              >
                <Icon icon="mdi:refresh" style={{ marginRight: '5px' }} />
                Force Refresh
              </button>
            )}
          </div>
          
          {showDebug && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px',
              background: '#f5f5f5', 
              borderRadius: '4px',
              fontSize: '0.9em'
            }}>
              <div>Connection Status: <strong>Connected</strong></div>
              <div>Authorization: <strong>Authorized</strong></div>
              <div>Ready to fetch emails: <strong>Yes</strong></div>
              <div style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
                Auto-authorization is enabled by default
              </div>
              <div style={{ marginTop: '10px' }}>
                <strong>If you're not seeing emails:</strong>
                <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                  <li>Check if you have emails in your Gmail inbox</li>
                  <li>Try disconnecting and reconnecting your account</li>
                  <li>Ensure you've granted the necessary permissions</li>
                  <li>Use the "Force Refresh" button to retry fetching emails</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="connection-error">
          <Icon icon="mdi:alert-circle" className="error-icon" />
          <span>{error}</span>
        </div>
      )}
      
      {oauthError && <div className={styles.error}>{oauthError}</div>}
    </div>
  );
};

export default GmailConnect;