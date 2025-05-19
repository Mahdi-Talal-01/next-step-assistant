import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
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
    if (emails && Array.isArray(emails)) {
      setFilteredEmails(emails);
    }
  }, [emails, setFilteredEmails]);

  // Check URL parameters for Google auth redirection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('googleAuth') === 'success') {
      window.history.replaceState({}, document.title, location.pathname);
      // Wait a moment to ensure state is updated
      setTimeout(() => {
        if (isAuthorized) {
          fetchEmails({refresh: Date.now()});
        }
      }, 500);
    }
  }, [location, isAuthorized, fetchEmails]);
  
  // Fetch emails when auth state changes and user is authenticated
  useEffect(() => {
    const { authenticated } = isAuthenticated();
    
    if (!authLoading && authenticated && isAuthorized) {
      fetchEmails({...searchOptions, refresh: Date.now()});
    }
  }, [authLoading, isAuthorized, isAuthenticated, fetchEmails, searchOptions]);

  // Event handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (isAuthorized) {
      setSearchOptions(prev => ({ ...prev, q: term }));
    }
  };

  const handleRefresh = () => {
    if (isAuthorized && !isLoading) {
      fetchEmails({ ...searchOptions, refresh: Date.now() });
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

  const handleConnect = () => {
    authorizeGmail();
  };

  const handleDisconnect = () => {
    disconnectGmail();
  };

  // Wait for auth state to finish loading before rendering anything
  if (authLoading) {
    return <EmailLoading />;
  }

  // Check authentication
  const { authenticated } = isAuthenticated();
  if (!authenticated) {
    return (
      <AuthenticationGuard 
        isLoading={isLoading}
        error="You must be logged in to use this feature"
        onConnect={() => navigate('/auth', { state: { fromEmailTracker: true } })}
      />
    );
  }

  // Check Gmail authorization
  if (!isAuthorized) {
    return (
      <AuthenticationGuard 
        isLoading={isLoading}
        error={error}
        onConnect={handleConnect}
        isAuthorized={false}
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
        // Show empty state when not loading and no emails
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
