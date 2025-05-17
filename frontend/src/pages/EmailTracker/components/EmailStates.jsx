import React from 'react';
import { Icon } from '@iconify/react';

export const EmailLoading = () => {
  return (
    <div className="emails-loading">
      <div className="loading-animation">
        <Icon icon="mdi:loading" className="spin-icon" />
      </div>
      <h3>Fetching Your Emails</h3>
      <p>Please wait while we retrieve your latest emails...</p>
    </div>
  );
};

export const EmailEmpty = ({ isAuthorized }) => {
  return (
    <div className="emails-empty">
      {isAuthorized ? (
        <>
          <Icon icon="mdi:email-outline" className="empty-icon" />
          <h3>No Emails Found</h3>
          <p>No emails match your current filters. Try adjusting your search criteria or refreshing the page.</p>
          <div className="empty-suggestions">
            <div className="suggestion-item">
              <Icon icon="mdi:filter-outline" />
              <span>Try removing filters</span>
            </div>
            <div className="suggestion-item">
              <Icon icon="mdi:refresh" />
              <span>Refresh your inbox</span>
            </div>
            <div className="suggestion-item">
              <Icon icon="mdi:calendar-range" />
              <span>Check for newer emails</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <Icon icon="mdi:email-lock" className="empty-icon" />
          <h3>Connect Gmail to View Emails</h3>
          <p>Connect your Gmail account to start tracking and analyzing your job application emails.</p>
        </>
      )}
    </div>
  );
}; 