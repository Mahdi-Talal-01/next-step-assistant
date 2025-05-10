import React, { useEffect, useState } from "react";
import "./EmailTracker.css";
import BaseApi from '../../commons/request';

import EmailHeader from "./components/EmailHeader";
import SearchBox from "./components/SearchBox";
import FilterGroup from "./components/FilterGroup";
import EmailList from "./components/EmailList";
import GmailConnect from "./components/GmailConnect";
import { EmailLoading, EmailEmpty } from "./components/EmailStates";
import EmailViewer from "./components/EmailViewer";

import { useEmailFiltering } from "./hooks/useEmailFiltering";
import { useGmailApi } from "./hooks/useGmailApi";

const EmailTracker = () => {
  const {
    emails,
    isLoading,
    error,
    isAuthorized: apiIsAuthorized,
    authChecked,
    fetchEmails,
    authorizeGmail,
    disconnectGmail,
    forceAuthorize
  } = useGmailApi();
  
  // Default to authorized (matching our aggressive authorization approach)
  const [overrideAuthorized, setOverrideAuthorized] = useState(true);
  
  // Combine the API's auth state with our override
  const isAuthorized = overrideAuthorized || apiIsAuthorized;
  
  const [debugInfo, setDebugInfo] = useState(null);

  // Add debugging for authorization status
  useEffect(() => {
    console.log('Email Tracker - Auth Status:', {
      isAuthorized,
      apiIsAuthorized,
      overrideAuthorized,
      authChecked,
      hasEmails: emails && emails.length > 0,
      emailCount: emails ? emails.length : 0,
      hasError: !!error
    });
  }, [isAuthorized, apiIsAuthorized, overrideAuthorized, authChecked, emails, error]);
  
  // Fetch emails when component mounts, regardless of authorization state
  useEffect(() => {
    // Always try to fetch emails on component mount
    const timer = setTimeout(() => {
      fetchEmails();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [fetchEmails]);
  
  // Manual debug function to test API directly
  const testApiDirectly = async () => {
    try {
      const statusResponse = await BaseApi.get('/gmail/status');
      console.log('Direct status check:', statusResponse);
      
      const emailsResponse = await BaseApi.get('/gmail/emails');
      console.log('Direct emails check:', emailsResponse);
      
      setDebugInfo({
        statusResponse,
        emailsResponse: emailsResponse ? 'Response received' : 'No response',
        timestamp: new Date().toLocaleTimeString()
      });
      
      // If emails were received directly but isAuthorized is false, force true
      if (emailsResponse) {
        console.log('Emails received. Forcing authorization...');
        setOverrideAuthorized(true);
        forceAuthorize(true);
      } else {
        // Regular refresh
        fetchEmails();
      }
    } catch (err) {
      console.error('Direct API test failed:', err);
      setDebugInfo({
        error: err.message || 'Unknown error',
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  const [searchOptions, setSearchOptions] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);

  const {
    filteredEmails,
    filters,
    searchTerm,
    setSearchTerm,
    toggleReadStatus,
    toggleStarred,
    handleFilterChange,
    setEmails: setFilteredEmails
  } = useEmailFiltering([]);

  // Update emails in filtering hook when emails change
  useEffect(() => {
    // Always set the current emails, even if empty
    // This ensures we're always showing the most current state
    setFilteredEmails(emails || []);
  }, [emails, setFilteredEmails]);

  // Fetch emails when authorized
  useEffect(() => {
    if (isAuthorized) {
      fetchEmails(searchOptions);
    }
  }, [isAuthorized, fetchEmails, searchOptions]);

  // Handle search submission
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (isAuthorized) {
      setSearchOptions(prev => ({ ...prev, q: term }));
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (isAuthorized && !isLoading) {
      fetchEmails(searchOptions);
    }
  };

  // Handle filter change with API refresh if needed
  const handleApiFilterChange = (filterType, value) => {
    handleFilterChange(filterType, value);
    
    // For certain filters, update the API query
    if (filterType === 'category' && isAuthorized) {
      let labelIds = ['INBOX'];
      
      if (value === 'social') labelIds = ['CATEGORY_SOCIAL'];
      if (value === 'promotions') labelIds = ['CATEGORY_PROMOTIONS'];
      if (value === 'updates') labelIds = ['CATEGORY_UPDATES'];
      if (value === 'forums') labelIds = ['CATEGORY_FORUMS'];
      
      setSearchOptions(prev => ({ ...prev, labelIds: labelIds.join(',') }));
    }
  };

  // Handle email selection for viewing
  const handleViewEmail = (email) => {
    // Mark as read when opening
    if (!email.isRead) {
      toggleReadStatus(email.id);
    }
    setSelectedEmail(email);
  };

  // Handle closing the email viewer
  const handleCloseEmailViewer = () => {
    setSelectedEmail(null);
  };

  const renderEmailContent = () => {
    if (isLoading) {
      return <EmailLoading />;
    }
    
    if (!isAuthorized) {
      return <EmailEmpty isAuthorized={false} />;
    }
    
    if (filteredEmails && filteredEmails.length > 0) {
      return (
        <EmailList
          emails={filteredEmails}
          onToggleRead={toggleReadStatus}
          onToggleStarred={toggleStarred}
          onViewEmail={handleViewEmail}
        />
      );
    }
    
    return <EmailEmpty isAuthorized={true} />;
  };

  return (
    <div className="page-container">
      <EmailHeader 
        onRefresh={handleRefresh} 
        isLoading={isLoading} 
        isAuthorized={isAuthorized}
      />

      <GmailConnect
        isAuthorized={isAuthorized}
        onConnect={authorizeGmail}
        onDisconnect={disconnectGmail}
        isLoading={isLoading}
        error={error}
        authChecked={authChecked}
        onTestApi={testApiDirectly}
        onForceAuth={forceAuthorize}
      />
      
      {debugInfo && (
        <div style={{
          margin: '10px 0',
          padding: '10px',
          backgroundColor: '#f0f8ff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '0.9em'
        }}>
          <div><strong>Debug Info (Last checked: {debugInfo.timestamp})</strong></div>
          {debugInfo.error ? (
            <div style={{color: 'red'}}>Error: {debugInfo.error}</div>
          ) : (
            <div>
              <div>Status API: {JSON.stringify(debugInfo.statusResponse)}</div>
              <div>Emails API: {debugInfo.emailsResponse}</div>
            </div>
          )}
        </div>
      )}

      <div className="gmail-filters">
        <SearchBox
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          onClearSearch={() => {
            setSearchTerm("");
            setSearchOptions(prev => ({ ...prev, q: "" }));
          }}
        />
        <FilterGroup filters={filters} onFilterChange={handleApiFilterChange} />
      </div>

      {renderEmailContent()}

      {selectedEmail && (
        <EmailViewer
          email={selectedEmail}
          onClose={handleCloseEmailViewer}
          onToggleRead={toggleReadStatus}
          onToggleStarred={toggleStarred}
        />
      )}
    </div>
  );
};

export default EmailTracker;
