import React from "react";
import { Icon } from "@iconify/react";
import "../EmailTracker.css";

const EmailHeader = () => {
  return (
    <div className="gmail-header">
      <h1>Gmail Tracker</h1>
      <div className="gmail-actions">
        <button className="btn btn-primary">
          <Icon icon="mdi:refresh" className="me-2" />
          Refresh
        </button>
        <button className="btn btn-outline">
          <Icon icon="mdi:cog" className="me-2" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default EmailHeader;
