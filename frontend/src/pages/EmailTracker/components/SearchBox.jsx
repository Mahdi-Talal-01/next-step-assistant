import React from "react";
import { Icon } from "@iconify/react";
import "../EmailTracker.css";

const SearchBox = ({ searchTerm, onSearchChange, onClearSearch, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <Icon icon="mdi:magnify" className="search-icon" />
      <input
        type="text"
        placeholder="Search emails..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <button type="button" className="clear-search" onClick={onClearSearch}>
          <Icon icon="mdi:close" />
        </button>
      )}
      <button type="submit" className="search-submit" style={{ display: 'none' }}>
        Search
      </button>
    </form>
  );
};

export default SearchBox;
