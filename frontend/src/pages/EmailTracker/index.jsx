import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./EmailTracker.css";

// Components
import EmailHeader from "./components/EmailHeader";
import SearchBox from "./components/SearchBox";
import FilterGroup from "./components/FilterGroup";
import EmailList from "./components/EmailList";
import GmailConnect from "./components/GmailConnect";
import { EmailLoading, EmailEmpty } from "./components/EmailStates";
import EmailViewer from "./components/EmailViewer";
import AuthenticationGuard from "./components/AuthenticationGuard";

// Hooks
import { useEmailFiltering } from "./hooks/useEmailFiltering";
import { useGmailApi } from "./hooks/useGmailApi";
import { useAuth } from "../Auth/hooks/useAuth";

/**
 * EmailTracker is the main component for the email tracking feature.
 * It handles the overall layout and coordination between child components.
 */
const EmailTracker = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Log authentication status
  console.log("User authentication:", { 
    user: user ? `${user.name} (${user.email})` : 'No user', 
    provider: user?.provider || 'None', 
    isGoogleAuthenticated: user?.provider === 'google' 
  });
  
  // Gmail API integration
  const {
    emails,
    isLoading,
    error,
    isAuthorized,
    authChecked,
    fetchEmails,
    authorizeGmail,
    disconnectGmail
  } = useGmailApi();

  // UI State
  const [searchOptions, setSearchOptions] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Email filtering
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
    console.log("EmailTracker: emails from useGmailApi:", emails);
    console.log("EmailTracker: emails length:", emails?.length || 0);
    setFilteredEmails(emails || []);
    
    setTimeout(() => {
      console.log("EmailTracker: filteredEmails after update:", filteredEmails);
      console.log("EmailTracker: filteredEmails length:", filteredEmails?.length || 0);
    }, 0);
  }, [emails, setFilteredEmails, filteredEmails]);

  // Check URL parameters for Google auth redirection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('googleAuth') === 'success') {
      window.history.replaceState({}, document.title, location.pathname);
      
      if (isAuthorized) {
        fetchEmails();
      }
    }
  }, [location, isAuthorized, fetchEmails]);
  
  // Fetch emails when auth state changes
  useEffect(() => {
    if (user && isAuthorized) {
      fetchEmails(searchOptions);
    }
  }, [user, isAuthorized, fetchEmails, searchOptions]);

  // Event handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (isAuthorized) {
      setSearchOptions(prev => ({ ...prev, q: term }));
    }
  };

  const handleRefresh = () => {
    if (isAuthorized && !isLoading) {
      fetchEmails(searchOptions);
    }
  };

  const handleApiFilterChange = (filterType, value) => {
    handleFilterChange(filterType, value);
    
    if (filterType === 'category' && isAuthorized) {
      let labelIds = ['INBOX'];
      
      if (value === 'social') labelIds = ['CATEGORY_SOCIAL'];
      if (value === 'promotions') labelIds = ['CATEGORY_PROMOTIONS'];
      if (value === 'updates') labelIds = ['CATEGORY_UPDATES'];
      if (value === 'forums') labelIds = ['CATEGORY_FORUMS'];
      
      setSearchOptions(prev => ({ ...prev, labelIds: labelIds.join(',') }));
    }
  };

  const handleViewEmail = (email) => {
    if (!email.isRead) {
      toggleReadStatus(email.id);
    }
    setSelectedEmail(email);
  };

  const handleCloseEmailViewer = () => {
    setSelectedEmail(null);
  };

  // Check authentication and authorization
  if (!user) {
    return (
      <AuthenticationGuard 
        isLoading={isLoading}
        error="You must be logged in to use this feature"
      />
    );
  }

  if (!isAuthorized) {
    return (
      <AuthenticationGuard 
        isLoading={isLoading}
        error={error}
        onConnect={authorizeGmail} 
      />
    );
  }

  // Main content when user is authorized
  return (
    <div className="page-container">
      <EmailHeader 
        onRefresh={handleRefresh} 
        isLoading={isLoading} 
        isAuthorized={isAuthorized}
      />

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

      {/* Email content area */}
      {isLoading ? (
        // Always show loading state when fetching emails
        <EmailLoading />
      ) : filteredEmails && filteredEmails.length > 0 ? (
        // Show email list when we have emails
        <EmailList
          emails={filteredEmails}
          onToggleRead={toggleReadStatus}
          onToggleStarred={toggleStarred}
          onViewEmail={handleViewEmail}
        />
      ) : (
        // Show empty state only when not loading and no emails found
        <EmailEmpty isAuthorized={true} />
      )}

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
