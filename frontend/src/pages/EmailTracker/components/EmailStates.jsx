import React from 'react';
import { Icon } from '@iconify/react';

export const EmailLoading = () => {
  return (
    <div className="emails-loading">
      <Icon icon="mdi:loading" />
      <p>Loading your emails...</p>
    </div>
  );
};

export const EmailEmpty = ({ isAuthorized }) => {
  return (
    <div className="emails-empty">
      {isAuthorized ? (
        <>
          <Icon icon="mdi:email-outline" />
          <h3>No Emails Found</h3>
          <p>No emails match your current filters. Try adjusting your search criteria.</p>
        </>
      ) : (
        <>
          <Icon icon="mdi:email-lock" />
          <h3>Connect Gmail to View Emails</h3>
          <p>Connect your Gmail account to start tracking and analyzing your emails.</p>
        </>
      )}
    </div>
  );
}; 