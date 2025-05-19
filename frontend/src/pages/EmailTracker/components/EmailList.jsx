import React from "react";
import EmailItem from "./EmailItem";
import "../EmailTracker.css";

const EmailList = ({ emails, onToggleRead, onToggleStarred, onViewEmail }) => {
  if (!emails || emails.length === 0) {
    return (
      <div className="no-emails">
        <p>No emails found matching your criteria</p>
      </div>
    );
  }
  return (
    <div className="email-list">
      {emails.map((email) => {
        return (
          <EmailItem
            key={email.id}
            email={email}
            onToggleRead={onToggleRead}
            onToggleStarred={onToggleStarred}
            onViewEmail={onViewEmail}
          />
        );
      })}
    </div>
  );
};

export default EmailList;
