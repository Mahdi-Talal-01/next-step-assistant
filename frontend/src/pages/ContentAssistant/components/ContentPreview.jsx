import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown";
import styles from "../styles/ContentAssistant.module.css";

const ContentPreview = ({ content, contentType, onEdit, onCopy }) => {
  // Get appropriate title based on content type
  const getPreviewTitle = () => {
    const titles = {
      jobDescription: "Job Description Preview",
      emailReply: "Email Reply Preview",
      linkedinPost: "LinkedIn Post Preview",
      blogPost: "Blog Post Preview",
    };
    return titles[contentType] || "Content Preview";
  };

  // Get icon for each content type
  const getContentTypeIcon = () => {
    const icons = {
      jobDescription: "mdi:briefcase-outline",
      emailReply: "mdi:email-outline",
      linkedinPost: "mdi:linkedin",
      blogPost: "mdi:file-document-outline",
    };
    return icons[contentType] || "mdi:text-box-outline";
  };

  // Custom rendering for email content
  const renderEmail = (content) => {
    return (
      <div className={styles.emailPreview}>
        <div className={styles.emailHeader}>
          <div className={styles.emailControls}>
            <span
              className={styles.emailControlDot}
              style={{ backgroundColor: "#ff5f57" }}
            ></span>
            <span
              className={styles.emailControlDot}
              style={{ backgroundColor: "#ffbd2e" }}
            ></span>
            <span
              className={styles.emailControlDot}
              style={{ backgroundColor: "#28c940" }}
            ></span>
          </div>
          <div className={styles.emailToolbar}>
            <Icon icon="mdi:arrow-left" />
            <Icon icon="mdi:archive-outline" />
            <Icon icon="mdi:alert-circle-outline" />
            <Icon icon="mdi:delete-outline" />
            <Icon icon="mdi:email-open-outline" />
            <Icon icon="mdi:tag-outline" />
            <Icon icon="mdi:dots-vertical" />
          </div>
        </div>
        <div className={styles.emailBody}>
          {content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Custom rendering for LinkedIn post
  const renderLinkedInPost = (content) => {
    return (
      <div className={styles.linkedinPreview}>
        <div className={styles.linkedinHeader}>
          <div className={styles.linkedinProfile}>
            <div className={styles.linkedinAvatar}>
              <Icon icon="mdi:account" />
            </div>
            <div>
              <div className={styles.linkedinName}>Your Name</div>
              <div className={styles.linkedinTitle}>Your Position</div>
            </div>
          </div>
          <Icon
            icon="mdi:dots-horizontal"
            className={styles.linkedinMoreIcon}
          />
        </div>
        <div className={styles.linkedinContent}>
          {content.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div className={styles.linkedinActions}>
          <div className={styles.linkedinAction}>
            <Icon icon="mdi:thumb-up-outline" />
            <span>Like</span>
          </div>
          <div className={styles.linkedinAction}>
            <Icon icon="mdi:comment-outline" />
            <span>Comment</span>
          </div>
          <div className={styles.linkedinAction}>
            <Icon icon="mdi:share-outline" />
            <span>Share</span>
          </div>
          <div className={styles.linkedinAction}>
            <Icon icon="mdi:send-outline" />
            <span>Send</span>
          </div>
        </div>
      </div>
    );
  };

  // Custom rendering for job description
  const renderJobDescription = (content) => {
    return (
      <div className={styles.jobDescriptionPreview}>
        <div className={styles.jobHeader}>
          <Icon icon={getContentTypeIcon()} className={styles.jobIcon} />
        </div>
        <div className={styles.jobContent}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  };

  // Custom rendering for blog post
  const renderBlogPost = (content) => {
    return (
      <div className={styles.blogPostPreview}>
        <div className={styles.blogHeader}>
          <div className={styles.blogNavigation}>
            <Icon icon="mdi:arrow-left" />
            <Icon icon="mdi:home" />
            <Icon icon="mdi:magnify" />
          </div>
          <div className={styles.blogActions}>
            <Icon icon="mdi:bookmark-outline" />
            <Icon icon="mdi:share-variant-outline" />
          </div>
        </div>
        <div className={styles.blogContent}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      key="preview"
      className={styles.previewContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.previewHeader}>
        <h2 className={styles.previewTitle}>
          <Icon
            icon={getContentTypeIcon()}
            className={styles.previewTitleIcon}
          />
          {getPreviewTitle()}
        </h2>
        <div className={styles.previewActions}>
          <motion.div
            className={`${styles.previewButton} ${styles.editButton}`}
            onClick={onEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="mdi:pencil" />
            Edit
          </motion.div>
          <motion.div
            className={`${styles.previewButton} ${styles.copyButton}`}
            onClick={() => onCopy(content)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="mdi:content-copy" />
            Copy
          </motion.div>
        </div>
      </div>

      <div className={styles.previewContent}>
        {contentType === "emailReply" ? (
          renderEmail(content)
        ) : contentType === "linkedinPost" ? (
          renderLinkedInPost(content)
        ) : contentType === "jobDescription" ? (
          renderJobDescription(content)
        ) : contentType === "blogPost" ? (
          renderBlogPost(content)
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
};

ContentPreview.propTypes = {
  content: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default ContentPreview;
