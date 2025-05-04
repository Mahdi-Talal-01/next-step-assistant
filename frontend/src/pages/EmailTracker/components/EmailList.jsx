import React from "react";
import EmailItem from "./EmailItem";
import "../EmailTracker.css";

const EmailList = ({ emails, onToggleRead, onToggleStarred }) => {
  if (emails.length === 0) {
    return (
      <div className="no-emails">
        <p>No emails found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="email-list">
      {emails.map((email) => (
        <EmailItem
          key={email.id}
          email={email}
          onToggleRead={onToggleRead}
          onToggleStarred={onToggleStarred}
        />
      ))}
    </div>
  );
};

export default EmailList;
