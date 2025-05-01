import React from "react";
import "./EmailTracker.css";

import EmailHeader from "./components/EmailHeader";
import SearchBox from "./components/SearchBox";
import FilterGroup from "./components/FilterGroup";
import EmailList from "./components/EmailList";

import { useEmailFiltering } from "./hooks/useEmailFiltering";
import { mockEmails } from "./data/mockData";

const EmailTracker = () => {
  const {
    filteredEmails,
    filters,
    searchTerm,
    setSearchTerm,
    toggleReadStatus,
    toggleStarred,
    handleFilterChange,
  } = useEmailFiltering(mockEmails);

  return (
    <div className="page-container">
      <EmailHeader />

      <div className="gmail-filters">
        <SearchBox
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm("")}
        />
        <FilterGroup filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <EmailList
        emails={filteredEmails}
        onToggleRead={toggleReadStatus}
        onToggleStarred={toggleStarred}
      />
    </div>
  );
};

export default EmailTracker;
