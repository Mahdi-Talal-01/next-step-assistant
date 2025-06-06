import React from 'react';
import { Icon } from "@iconify/react";
import EmailHeader from "./EmailHeader";
import GmailConnect from "./GmailConnect";

/**
 * AuthenticationGuard component handles unauthorized or unauthenticated states
 * by showing appropriate messages and connect options.
 * 
 * @param {Object} props Component props
 * @param {boolean} props.isLoading Whether we're currently loading
 * @param {string} props.error Error message to display, if any
 * @param {Function} props.onConnect Optional connect handler
 */
const AuthenticationGuard = ({ isLoading, error, onConnect }) => {
  return (
    <div className="page-container">
      <EmailHeader 
        onRefresh={() => {}} 
        isLoading={isLoading} 
        isAuthorized={false}
      />
      <GmailConnect 
        isAuthorized={false} 
        isLoading={isLoading}
        error={error}
        onConnect={onConnect}
      />
    </div>
  );
};

export default AuthenticationGuard; 