import React from "react";
import { Icon } from "@iconify/react";
import "../EmailTracker.css";

const SearchBox = ({ searchTerm, onSearchChange, onClearSearch }) => {
  return (
    <div className="search-box">
      <Icon icon="mdi:magnify" className="search-icon" />
      <input
        type="text"
        placeholder="Search emails..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <button className="clear-search" onClick={onClearSearch}>
          <Icon icon="mdi:close" />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
