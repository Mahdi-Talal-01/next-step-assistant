import React from "react";
import { Icon } from "@iconify/react";
import {
  formatDate,
  getPriorityBadgeClass,
  getCategoryBadgeClass,
} from "../utils/formatUtils";
import "../EmailTracker.css";

const EmailItem = ({ email, onToggleRead, onToggleStarred, onViewEmail }) => {
  // Prevent event bubbling for action buttons
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      className={`email-item ${email.isRead ? "read" : ""}`}
      onClick={() => onViewEmail(email)}
    >
      <div className="email-actions">
        <button
          className="action-btn"
          onClick={(e) => handleActionClick(e, () => onToggleStarred(email.id))}
          title={email.isStarred ? "Unstar" : "Star"}
        >
          <Icon
            icon={email.isStarred ? "mdi:star" : "mdi:star-outline"}
            className={email.isStarred ? "starred" : ""}
          />
        </button>
        <button
          className="action-btn"
          onClick={(e) => handleActionClick(e, () => onToggleRead(email.id))}
          title={email.isRead ? "Mark as unread" : "Mark as read"}
        >
          <Icon
            icon={email.isRead ? "mdi:email-open" : "mdi:email"}
            className={email.isRead ? "read" : ""}
          />
        </button>
      </div>

      <div className="email-content">
        <div className="email-header">
          <h3 className="email-sender">{email.sender}</h3>
          <span className="email-date">{formatDate(email.date)}</span>
        </div>
        <div className="email-subject">{email.subject}</div>
        <div className="email-preview">{email.preview}</div>
        <div className="email-tags">
          <span className={`badge ${getCategoryBadgeClass(email.category)}`}>
            {email.category}
          </span>
          <span className={`badge ${getPriorityBadgeClass(email.priority)}`}>
            {email.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailItem;