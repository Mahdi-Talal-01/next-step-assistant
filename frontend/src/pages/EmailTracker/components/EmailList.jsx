import React from "react";
import EmailItem from "./EmailItem";
import "../EmailTracker.css";

const EmailList = ({ emails, onToggleRead, onToggleStarred, onViewEmail }) => {
  console.log("EmailList component received emails:", emails);
  console.log("EmailList emails length:", emails?.length || 0);
  
  if (!emails || emails.length === 0) {
    console.log("EmailList: No emails to display");
    return (
      <div className="no-emails">
        <p>No emails found matching your criteria</p>
      </div>
    );
  }

  console.log("EmailList: Rendering", emails.length, "emails");
  
  return (
    <div className="email-list">
      {emails.map((email) => {
        console.log("EmailList: Rendering email item:", email.id);
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
