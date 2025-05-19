import React from "react";
import { Icon } from "@iconify/react";
import { formatDate, getPriorityBadgeClass, getCategoryBadgeClass } from "../utils/formatUtils";
import "../EmailTracker.css";

// Helper function to convert URLs to clickable links in plain text
const makeLinksClickable = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
};

// Helper function to check if content is HTML
const isHtmlContent = (content) => {
  return /<[a-z][\s\S]*>/i.test(content);
};

// Helper function to safely render HTML content
const createSafeHtml = (htmlContent) => {
  // In a production app, use a library like DOMPurify or sanitize-html
  // This is a simplified version for demonstration
  return {
    __html: htmlContent
  };
};

const EmailViewer = ({ email, onClose, onToggleRead, onToggleStarred }) => {
  if (!email) return null;

  // Process email body content
  const renderEmailContent = () => {
    // If no body, just show the preview
    if (!email.body) {
      return (
        <div>
          <p className="email-preview">{email.preview}</p>
          <p className="no-body-message">
            Full message content not available. Only preview is shown.
          </p>
        </div>
      );
    }

    // Determine if the content is HTML or plain text
    if (isHtmlContent(email.body)) {
      // If HTML, render it safely
      return <div dangerouslySetInnerHTML={createSafeHtml(email.body)} />;
    } else {
      // If plain text, convert URLs to links and preserve formatting
      const textWithLinks = makeLinksClickable(email.body);
      return (
        <div className="plain-text-email">
          <div dangerouslySetInnerHTML={createSafeHtml(textWithLinks)} />
        </div>
      );
    }
  };

  return (
    <div className="email-viewer-overlay">
      <div className="email-viewer">
        <div className="email-viewer-header">
          <div className="email-viewer-actions">
            <button
              className="action-btn"
              onClick={() => onToggleStarred(email.id)}
              title={email.isStarred ? "Unstar" : "Star"}
            >
              <Icon
                icon={email.isStarred ? "mdi:star" : "mdi:star-outline"}
                className={email.isStarred ? "starred" : ""}
              />
            </button>
            <button
              className="action-btn"
              onClick={() => onToggleRead(email.id)}
              title={email.isRead ? "Mark as unread" : "Mark as read"}
            >
              <Icon
                icon={email.isRead ? "mdi:email-open" : "mdi:email"}
                className={email.isRead ? "read" : ""}
              />
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <div className="email-viewer-content">
          <h2 className="email-viewer-subject">{email.subject}</h2>
          
          <div className="email-viewer-meta">
            <div className="email-viewer-sender">
              <Icon icon="mdi:account" />
              <span>{email.sender}</span>
            </div>
            
            <div className="email-viewer-recipient">
              <Icon icon="mdi:account-arrow-right" />
              <span>To: {email.recipient}</span>
            </div>
            
            <div className="email-viewer-date">
              <Icon icon="mdi:calendar" />
              <span>{formatDate(email.date, true)}</span>
            </div>
            
            <div className="email-viewer-tags">
              <span className={`badge ${getCategoryBadgeClass(email.category)}`}>
                {email.category}
              </span>
              <span className={`badge ${getPriorityBadgeClass(email.priority)}`}>
                {email.priority}
              </span>
            </div>
          </div>
          
          <div className="email-viewer-body">
            {renderEmailContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailViewer; 